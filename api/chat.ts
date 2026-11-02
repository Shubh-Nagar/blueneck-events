/**
 * POST /api/chat — the assistant's AI brain (Vercel Node.js Function).
 *
 * Needs ANTHROPIC_API_KEY in the Vercel project's environment variables. Without it
 * (or on hosts that don't run /api, like Hostinger), this returns 503/404 and the
 * widget quietly answers from its built-in knowledge instead.
 *
 * Body: { messages: { role: 'user' | 'assistant'; content: string }[] }
 * Reply: the assistant's text, streamed as plain UTF-8.
 */
import Anthropic from '@anthropic-ai/sdk';
import { buildKnowledge } from '../src/lib/assistant/knowledge.js';

// Runs on Vercel's Node.js runtime (the Anthropic SDK pulls in modules the Edge runtime can't bundle).
// Allow time for a full streamed reply.
export const maxDuration = 60;

declare const process: { env: Record<string, string | undefined> };

const MODEL = 'claude-opus-5-5';
const MAX_TURNS = 16;
const MAX_CHARS = 1200;

// Built once per instance. Kept byte-stable so the prompt cache hits on every request.
const SYSTEM = `You are the website assistant for Blueneck Events Pvt. Ltd., an event management company from Indore, India, working PAN India. Visitors are prospective clients (corporates, couples and families, medical societies, government bodies, brands), job seekers and the curious.

How to answer:
- Be warm, polished and brief: 2 to 4 short sentences, or a short bullet list. This is a small chat window.
- Answer only from the company knowledge below. Never invent prices, availability, dates, client names, figures or contact details. If something isn't covered, say the team can help and point to the enquiry form.
- When someone is planning an event, ask at most one helpful question (occasion, city, date, guest count) and steer them to [the enquiry form](/contact) or the phone/email below.
- Link to relevant site pages with markdown links using the exact paths given, e.g. [NSICON 2025 and other medical conferences](/work/medical-conferences) or [Bhaskar Utsav](/work/bhaskar-utsav). Use **bold** sparingly. No headings, tables or images.
- Reply in the visitor's language (English, Hindi or Hinglish).
- Stay on Blueneck and event planning. Politely decline unrelated tasks.

<company_knowledge>
${buildKnowledge()}
</company_knowledge>`;

const client = new Anthropic();

type Turn = { role: 'user' | 'assistant'; content: string };

function readTurns(body: unknown): Turn[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const turns = raw
    .slice(-MAX_TURNS)
    .filter(
      (m): m is Turn =>
        !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim() !== '',
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  // The API wants the conversation to start with the visitor and end with their question.
  while (turns.length && turns[0].role !== 'user') turns.shift();
  return turns.length && turns[turns.length - 1].role === 'user' ? turns : null;
}

// Web-standard handler: Vercel answers other methods with 405 automatically.
export async function POST(req: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) return new Response('Assistant AI not configured', { status: 503 });

  let turns: Turn[] | null = null;
  try {
    turns = readTurns(await req.json());
  } catch {
    /* fall through */
  }
  if (!turns) return new Response('Bad request', { status: 400 });

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    // Chat answers don't need deep reasoning; low effort keeps replies quick and cheap.
    output_config: { effort: 'low' },
    // If a safety classifier declines, the API retries on a suitable model in the same call.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: turns,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error('assistant stream failed', err);
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
