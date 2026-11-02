import { Fragment, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode, type Ref } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { company } from '../../data/site';
import { useRevealed } from '../../lib/reveal';
import { ease } from '../../lib/motion';
import { chipsFor, localReply, starterChips } from '../../lib/assistant/local';
import { whatsappHref } from '../../lib/assistant/knowledge';

/**
 * The site assistant: a launcher fixed to the bottom-right corner and a chat panel.
 * Opens by itself once per page load on the home page, when the visitor scrolls past the hero film.
 *
 * Answers stream from /api/chat (Claude) when it is deployed; otherwise, or if it
 * fails, the built-in matcher answers from the site's own data.
 */
type Msg = { id: number; role: 'user' | 'assistant'; text: string; chips?: string[]; pending?: boolean };

const ENDPOINT = (import.meta.env.VITE_ASSISTANT_ENDPOINT as string | undefined) ?? '/api/chat';
const AUTO_OPEN_DELAY = 600;

let nextId = 1;
const welcome = (): Msg => ({
  id: nextId++,
  role: 'assistant',
  text: `Namaste! Welcome to **${company.name}**.\n\nPlanning a wedding, a corporate event, a conference or a launch? Ask me anything, from what we do to how to get a quote.`,
  chips: starterChips,
});

/** Session-wide: once the AI endpoint fails, stop trying it for this visit. */
let aiAvailable = !!ENDPOINT;

export default function Assistant() {
  const { pathname } = useLocation();
  const revealed = useRevealed();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [welcome()]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(false);
  const autoOpened = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  // On the home page: open once the visitor has scrolled past the hero film.
  useEffect(() => {
    if (autoOpened.current || pathname !== '/' || !revealed) return;
    let timer = 0;
    const check = () => {
      const hero = document.getElementById('hero');
      // The hero's bottom edge has left the top of the viewport: the film is behind them.
      if (!hero || hero.getBoundingClientRect().bottom > 0) return;
      window.removeEventListener('scroll', check);
      timer = window.setTimeout(() => {
        if (autoOpened.current) return;
        autoOpened.current = true;
        setOpen(true);
      }, AUTO_OPEN_DELAY);
    };
    window.addEventListener('scroll', check, { passive: true });
    check(); // already past it (e.g. a refresh that restores the scroll position)
    return () => {
      window.removeEventListener('scroll', check);
      window.clearTimeout(timer);
    };
  }, [pathname, revealed]);
  // Only the first arrival counts; leaving home first means no auto-open later this visit.
  useEffect(() => {
    if (pathname !== '/') autoOpened.current = true;
  }, [pathname]);

  useEffect(() => {
    if (open) setUnread(false);
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, open, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      launcherRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const patch = (id: number, p: Partial<Msg>) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...p } : m)));

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, 1000);
      if (!text || busy) return;
      setDraft('');
      setBusy(true);
      const userMsg: Msg = { id: nextId++, role: 'user', text };
      const reply: Msg = { id: nextId++, role: 'assistant', text: '', pending: true };
      const history = [...messages, userMsg];
      const earlier = messages.filter((m) => m.role === 'user').map((m) => m.text).slice(-4);
      setMessages([...history, reply]);
      const started = performance.now();

      let answered = false;
      if (aiAvailable) {
        try {
          const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // The opening greeting is ours, not the model's; send the real conversation.
            body: JSON.stringify({
              messages: history.slice(1).map((m) => ({ role: m.role, content: m.text })),
            }),
          });
          const type = res.headers.get('content-type') ?? '';
          if (!res.ok || !res.body || !type.startsWith('text/plain')) throw new Error(`assistant ${res.status}`);
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = '';
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            acc += decoder.decode(value, { stream: true });
            if (acc.trim()) patch(reply.id, { text: acc, pending: false });
          }
          if (acc.trim()) {
            patch(reply.id, { text: acc, pending: false, chips: chipsFor(text, earlier) });
            answered = true;
          }
        } catch {
          aiAvailable = false;
        }
      }

      if (!answered) {
        // A short, human beat before the built-in answer appears.
        const wait = Math.max(0, (reduce ? 0 : 650) - (performance.now() - started));
        await new Promise((r) => window.setTimeout(r, wait));
        const r = localReply(text, earlier);
        patch(reply.id, { text: r.text, chips: r.chips, pending: false });
      }
      setBusy(false);
      if (!openRef.current) setUnread(true);
    },
    [busy, messages, reduce],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(draft);
  };

  const toggle = () => {
    // The visitor found it on their own: don't pop it open on them later.
    autoOpened.current = true;
    setOpen((o) => {
      // Focus the input when the visitor opens it themselves (never on auto-open).
      if (!o) window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
      return !o;
    });
  };

  // On phones the panel covers the page, so following a link closes it.
  const onLink = () => {
    if (window.matchMedia('(max-width: 639px)').matches) setOpen(false);
  };

  const last = messages[messages.length - 1];

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            id="assistant-panel"
            role="dialog"
            aria-label="Blueneck assistant"
            className="mb-4 flex h-[min(600px,calc(100svh-13rem))] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-[1.75rem] bg-paper shadow-[0_40px_90px_-30px_rgba(8,22,41,0.6)] ring-1 ring-navy/10 sm:w-[400px]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease } }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16, transition: { duration: 0.25, ease } }}
          >
            <PanelHeader onClose={() => setOpen(false)} reduce={!!reduce} />

            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-busy={busy}
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
            >
              {messages.map((m) => (
                <Bubble key={m.id} msg={m} onLink={onLink} reduce={!!reduce} />
              ))}
              {last.role === 'assistant' && !last.pending && !busy && last.chips?.length ? (
                <motion.div
                  key={`chips-${last.id}`}
                  className="flex flex-wrap gap-2 pl-10"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: 0.15 } }}
                >
                  {last.chips.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => void send(c)}
                      className="rounded-full bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-navy ring-1 ring-inset ring-cobalt/25 transition-colors duration-300 hover:bg-navy hover:text-white hover:ring-navy"
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="border-t border-navy/10 bg-white px-3 pb-3 pt-3 sm:px-4">
              <div className="flex items-center gap-2 rounded-full bg-paper py-1.5 pl-5 pr-1.5 ring-1 ring-inset ring-navy/10 transition-shadow focus-within:ring-2 focus-within:ring-cobalt/60">
                <label htmlFor="assistant-input" className="sr-only">
                  Ask Blueneck
                </label>
                <input
                  ref={inputRef}
                  id="assistant-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about weddings, venues, quotes…"
                  autoComplete="off"
                  maxLength={1000}
                  className="min-w-0 flex-1 bg-transparent text-body-sm text-ink placeholder:text-ink/40 focus:outline-none [&:focus-visible]:outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || busy}
                  aria-label="Send"
                  className="group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-white transition-opacity disabled:opacity-35"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 translate-y-full rounded-full bg-cobalt transition-transform duration-500 ease-stage group-enabled:group-hover:translate-y-0"
                  />
                  <svg viewBox="0 0 24 24" className="relative h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 flex items-center justify-between px-2 text-[0.6875rem] text-ink/45">
                {whatsappHref() ? (
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#128C7E] hover:text-[#075E54]"
                  >
                    <WhatsAppGlyph className="h-3.5 w-3.5" />
                    Prefer WhatsApp? Chat with us
                  </a>
                ) : (
                  <span>AI assistant · the team confirms every detail</span>
                )}
                <Link to="/contact" onClick={onLink} className="link-draw font-semibold text-navy">
                  Plan an event
                </Link>
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>{!open && <WhatsAppButton reduce={!!reduce} />}</AnimatePresence>

      <Launcher ref={launcherRef} open={open} unread={unread} onClick={toggle} reduce={!!reduce} />
    </div>
  );
}

function PanelHeader({ onClose, reduce }: { onClose: () => void; reduce: boolean }) {
  return (
    <header className="relative overflow-hidden bg-navy px-5 pb-5 pt-5 text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(90%_120%_at_15%_0%,rgba(83,125,190,0.9)_0%,rgba(37,76,130,0.95)_50%,rgba(14,34,64,1)_100%)]"
      />
      <div aria-hidden className="grain absolute inset-0" />
      {/* The logo's diamond tiles, drifting at the edge. */}
      <motion.span
        aria-hidden
        className="tile absolute -right-6 -top-6 h-24 w-24 bg-sky/20"
        animate={reduce ? undefined : { rotate: [45, 60, 45] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span aria-hidden className="tile absolute right-16 top-12 h-4 w-4 bg-ice/40" />
      <span aria-hidden className="tile absolute bottom-3 right-28 h-2.5 w-2.5 bg-mist/50" />

      <div className="relative flex items-start gap-3.5">
        <Avatar size="lg" />
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="font-display text-[1.45rem] leading-tight">
            Blueneck <span className="italic text-ice">Concierge</span>
          </h2>
          <p className="mt-1 flex items-center gap-2 text-[0.75rem] text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Online · replies instantly
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="-mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p className="relative mt-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ice/80">
        {company.tagline.map((t, i) => (
          <Fragment key={t}>
            {i > 0 && <span aria-hidden className="inline-block h-3 w-px bg-sky/70" />}
            {t}
          </Fragment>
        ))}
      </p>
    </header>
  );
}

/** The BN disc from the logo, cropped round. */
function Avatar({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'h-12 w-12 ring-2 ring-white/25' : 'h-7 w-7 ring-1 ring-navy/10';
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full bg-navy ${box}`}>
      <img
        src="/brand/blueneck-mark.png"
        alt=""
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        style={{ width: `${100 / 0.4875}%` }}
      />
    </span>
  );
}

function Bubble({ msg, onLink, reduce }: { msg: Msg; onLink: () => void; reduce: boolean }) {
  const mine = msg.role === 'user';
  return (
    <motion.div
      className={`flex items-end gap-2.5 ${mine ? 'justify-end' : ''}`}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease } }}
    >
      {!mine && <Avatar />}
      <div
        className={`max-w-[85%] px-4 py-3 text-[0.9rem] leading-relaxed ${
          mine
            ? 'rounded-[1.25rem] rounded-br-md bg-navy text-white shadow-[0_10px_24px_-14px_rgba(37,76,130,0.9)]'
            : 'rounded-[1.25rem] rounded-bl-md bg-white text-ink/85 shadow-[0_8px_24px_-16px_rgba(8,22,41,0.35)] ring-1 ring-navy/5'
        }`}
      >
        {msg.pending ? <Typing /> : mine ? msg.text : <Rich text={msg.text} onLink={onLink} />}
      </div>
    </motion.div>
  );
}

/** Three logo tiles bobbing in turn. */
function Typing() {
  return (
    <span className="flex h-5 items-center gap-1.5 px-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="tile block h-2 w-2 bg-cobalt"
          animate={{ y: [0, -5, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

/** Renders the small markdown subset the assistant uses, as React nodes (no raw HTML). */
function Rich({ text, onLink }: { text: string; onLink: () => void }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        const bullets = lines.filter((l) => /^\s*[-*•]\s+/.test(l));
        const intro = lines.filter((l) => !/^\s*[-*•]\s+/.test(l));
        return (
          <div key={bi}>
            {intro.length > 0 && (
              <p>
                {intro.map((l, li) => (
                  <Fragment key={li}>
                    {li > 0 && <br />}
                    {inline(l, onLink)}
                  </Fragment>
                ))}
              </p>
            )}
            {bullets.length > 0 && (
              <ul className={`space-y-1.5 ${intro.length ? 'mt-1.5' : ''}`}>
                {bullets.map((l, li) => (
                  <li key={li} className="flex gap-2.5">
                    <span aria-hidden className="tile mt-[0.55em] block h-1.5 w-1.5 shrink-0 bg-sky" />
                    <span>{inline(l.replace(/^\s*[-*•]\s+/, ''), onLink)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

const linkClass = 'font-semibold text-navy underline decoration-sky/60 decoration-2 underline-offset-[3px] hover:decoration-navy';

function inline(src: string, onLink: () => void): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let at = 0;
  let k = 0;
  for (let m = re.exec(src); m; m = re.exec(src)) {
    if (m.index > at) out.push(src.slice(at, m.index));
    if (m[3] !== undefined) {
      out.push(
        <strong key={k++} className="font-semibold text-ink">
          {m[3]}
        </strong>,
      );
    } else {
      const [label, href] = [m[1], m[2]];
      if (href.startsWith('/') && !href.startsWith('//')) {
        out.push(
          <Link key={k++} to={href} onClick={onLink} className={linkClass}>
            {label}
          </Link>,
        );
      } else if (/^(https?:|mailto:|tel:)/i.test(href)) {
        out.push(
          <a key={k++} href={href} className={linkClass} {...(/^https?:/i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {label}
          </a>,
        );
      } else out.push(label);
    }
    at = m.index + m[0].length;
  }
  if (at < src.length) out.push(src.slice(at));
  return out;
}

const Launcher = ({
  ref,
  open,
  unread,
  onClick,
  reduce,
}: {
  ref: Ref<HTMLButtonElement>;
  open: boolean;
  unread: boolean;
  onClick: () => void;
  reduce: boolean;
}) => (
  <div className="relative h-16 w-16">
    {/* A ring of logo tiles turning around the button while it waits. */}
    {!open && (
      <div aria-hidden className={`pointer-events-none absolute -inset-2.5 ${reduce ? '' : 'animate-[spin_18s_linear_infinite]'}`}>
        {Array.from({ length: 10 }, (_, k) => {
          const deg = (k / 10) * 360;
          const a = (deg * Math.PI) / 180;
          return (
            <span
              key={k}
              className="absolute block h-[7px] w-[7px] rounded-[22%]"
              style={{
                left: `calc(50% + ${Math.cos(a) * 41}px - 3.5px)`,
                top: `calc(50% + ${Math.sin(a) * 41}px - 3.5px)`,
                transform: `rotate(${deg + 45}deg)`,
                backgroundColor: k % 2 ? '#BBD9F2' : '#75A6D8',
              }}
            />
          );
        })}
      </div>
    )}
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="assistant-panel"
      aria-label={open ? 'Close Blueneck assistant' : 'Chat with Blueneck'}
      className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-navy text-white shadow-[0_18px_40px_-12px_rgba(8,22,41,0.65)] ring-4 ring-white"
      whileHover={reduce ? undefined : { scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.svg
            key="x"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </motion.svg>
        ) : (
          <motion.img
            key="mark"
            src="/brand/blueneck-mark.png"
            alt=""
            className="absolute left-1/2 top-1/2 max-w-none"
            style={{ width: `${100 / 0.4875}%`, x: '-50%', y: '-50%' }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
    {/* Speech-bubble badge, so the disc reads as "chat". */}
    {!open && (
      <span
        aria-hidden
        className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-navy shadow-md ring-1 ring-navy/10"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.4c-.5.4-1.3 0-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z" />
        </svg>
        {unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-cobalt ring-2 ring-white" />}
      </span>
    )}
  </div>
);

/** WhatsApp's speech-bubble mark, filled. */
function WhatsAppGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.54 1.74 6.52L3 29l6.65-1.74A12.97 12.97 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.8c-2 0-3.95-.54-5.65-1.55l-.4-.24-3.95 1.03 1.05-3.84-.26-.4A10.77 10.77 0 0 1 5.2 16c0-5.97 4.86-10.83 10.84-10.83 5.97 0 10.8 4.86 10.8 10.83 0 5.98-4.83 10.8-10.8 10.8Zm5.93-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.1-.22.05-.41-.03-.57-.08-.16-.73-1.77-1-2.42-.27-.64-.54-.55-.73-.56h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.72 0 1.6 1.17 3.15 1.33 3.37.16.21 2.3 3.5 5.56 4.91.78.34 1.39.54 1.86.69.78.25 1.5.21 2.06.13.63-.1 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.62-.38Z" />
    </svg>
  );
}

/**
 * Floating WhatsApp shortcut, stacked above the assistant launcher. Opens a chat with
 * the team with a greeting already typed. Hidden while the assistant panel is open
 * (the panel carries its own WhatsApp link) or when no number is configured.
 */
function WhatsAppButton({ reduce }: { reduce: boolean }) {
  const href = whatsappHref();
  if (!href) return null;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Blueneck on WhatsApp (opens WhatsApp)"
      className="group relative mb-5 mr-1.5 flex items-center"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease } }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.8, transition: { duration: 0.2 } }}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Label slides out on hover / keyboard focus (desktop). */}
      <span className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[0.8125rem] font-semibold text-navy opacity-0 shadow-[0_10px_30px_-12px_rgba(8,22,41,0.45)] ring-1 ring-navy/10 transition-all duration-300 ease-stage group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
      <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgba(18,140,126,0.75)] ring-4 ring-white">
        {!reduce && <span aria-hidden className="absolute inset-0 animate-[ping_2.6s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-[#25D366]/40" />}
        <WhatsAppGlyph className="relative h-7 w-7" />
      </span>
    </motion.a>
  );
}
