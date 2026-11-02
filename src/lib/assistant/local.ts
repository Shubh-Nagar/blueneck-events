/**
 * The assistant's built-in brain: understands the visitor's question against the site's
 * own data and answers instantly, with links. Used on its own when no AI endpoint is
 * deployed, and as the fallback whenever the AI endpoint can't be reached.
 *
 * A question is read in layers, most specific first:
 *   1. complaints (always go to a person)
 *   2. what they are asking for: price, dates, payment, contact, vendors, process…
 *      (tailored to the kind of event when one is mentioned)
 *   3. a production we have done, by name
 *   4. the kind of event (wedding, conference, launch…)
 *   5. general questions: team, location, clients, about us, small talk
 *
 * Every visitor phrasing in scripts/assistant-test.ts must keep passing:
 * run `npm run test:assistant` after changing anything here.
 */
import { company, services, directors, scale, careers, clients, testimonials } from '../../data/site';
import { cases, categoryLabel, type Category } from '../../data/work';
import { medicalStats, portfolio } from '../../data/medical';
import { enquiry } from './knowledge';

export type Reply = {
  /** Mini-markdown: **bold**, [label](/path), "- " bullets, blank-line paragraphs. */
  text: string;
  chips?: string[];
  /** Which topic matched (for tests and analytics). */
  intent?: string;
};

export const starterChips = ['What do you do?', 'Plan a wedding', 'Medical conferences', 'Show me your work', 'Get a quote'];

/* ------------------------------------------------------------------ helpers */

const contactLine = () =>
  [
    enquiry.name && `**${enquiry.name}**, ${enquiry.role}`,
    `Call [${enquiry.phone}](tel:${enquiry.phone.replace(/\s/g, '')})`,
    `Email [${enquiry.email}](mailto:${enquiry.email})`,
    enquiry.whatsapp && `WhatsApp [+${enquiry.whatsapp}](https://wa.me/${enquiry.whatsapp})`,
  ]
    .filter(Boolean)
    .join('\n- ');

const caseLinks = (slugs: string[], max = 4) =>
  slugs
    .map((s) => cases.find((c) => c.slug === s))
    .filter((c): c is (typeof cases)[number] => !!c)
    .slice(0, max)
    .map((c) => `- [${c.title}](/work/${c.slug})${c.highlight ? `: ${c.highlight[0].toLowerCase()}${c.highlight.slice(1)}` : ''}`)
    .join('\n');

const join = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join('\n\n');

/* ------------------------------------------------------------- event kinds */

type Topic = {
  id: string;
  /** How to refer to it mid-sentence: "a wedding", "a medical conference". */
  noun: string;
  words: RegExp;
  service?: string;
  category?: Category;
  extra?: string;
};

// Specialties from the medical portfolio ("urology", "neonatology"…) count as medical words.
const specialties = [...new Set(portfolio.flatMap((y) => y.events.map((e) => e.specialty.toLowerCase().split(/\W+/)[0])))]
  .map((s) => s.replace(/y$/, ''))
  .filter((s) => s.length > 3)
  .join('|');

// Order matters where words overlap: "medical conference" is medical, "cricket opening" is sports.
const topics: Topic[] = [
  {
    id: 'medical',
    noun: 'a medical conference',
    words: new RegExp(
      `\\b(medical|cme|congress|doctors?|scientific|delegates?|faculty|abstracts?|hospital|clinical|ent|ortho\\w*|cardio\\w*|derma\\w*|dental|gyn\\w*|ophthal\\w*|onco\\w*|neuro\\w*|uro\\w*|nephro\\w*|radio\\w*|p(a)?ediatric\\w*|pulmo\\w*|${specialties})|[a-z]+i?con\\b`,
    ),
  },
  {
    id: 'weddings',
    noun: 'a wedding',
    words: /\b(wedding|shaadi|shadi|vivah|marriage|sangeet|mehendi|mehndi|haldi|reception|baraat|engagement|roka|ring ceremony|bride|groom|destination)/,
    service: 'weddings',
    extra:
      'From mandap and décor to guest hospitality, artists and the run-of-show, one team carries it from start to finish. [Read more about weddings](/expertise#weddings).',
  },
  {
    id: 'corporate',
    noun: 'a corporate event',
    words: /\b(corporate|company (event|party)|office (party|event)|farewell|dealers?|annual (day|meet|function)|offsite|off-site|family day|jubilee|awards?|town ?hall|agm|team building|employees?|staff|sales meet|r&r|our (company|firm|organi[sz]ation|office|brand)|celebrate \d+ years|\d+ years (celebration|of (our|the) company)|milestone|school annual)/,
    service: 'corporate-events',
    category: 'corporate',
  },
  {
    id: 'sports',
    noun: 'a sports event',
    words: /\b(sports?|cricket|league|auction|tournament|stadium|marathon|match)/,
    service: 'sports-events',
    category: 'sports',
  },
  {
    id: 'exhibitions',
    noun: 'an exhibition',
    words: /\b(exhibition|expo|trade (fair|show)|stalls?|exhibitors?|b2b show)/,
    service: 'exhibitions',
    category: 'exhibitions',
  },
  {
    id: 'auditions',
    noun: 'an audition tour',
    words: /\b(auditions?|talent hunt|reality show|tv show|television)/,
    service: 'auditions',
    category: 'auditions',
  },
  {
    id: 'government',
    noun: 'a government event',
    words: /\b(government|govt|civic|chief minister|cm|minister|mayor|municipal|public programme|sarkari|political|rally)\b/,
    service: 'government-events',
    category: 'government',
  },
  {
    id: 'entertainment',
    noun: 'a live show',
    words: /\b(concert|celebrity|celebrities|artists?|singers?|live (show|music|band)|music|fashion|festival|fest|gala|performers?|stand-?up|comedian|bollywood)\b/,
    service: 'celebrity-events',
    category: 'entertainment',
    extra: 'Artist booking and management is part of it, from shortlisting and contracts to riders, hospitality and show flow.',
  },
  {
    id: 'activations',
    noun: 'a launch',
    words: /\b(launch|activations?|store|showroom|opening|inaugurat|brand|mall|promotions?|product|roadshow|sampling)/,
    service: 'brand-activations',
    category: 'activations',
  },
  {
    id: 'conferences',
    noun: 'a conference',
    words: /\b(conferences?|conclaves?|summits?|seminars?|conventions?|symposium|workshop|meetups?)/,
    service: 'conferences',
    category: 'conferences',
  },
  {
    id: 'private',
    noun: 'a private celebration',
    words: /\b(birthday|bday|anniversary|baby shower|godh bharai|party|parties|private|house ?warming|griha pravesh|reunion|get[- ]together|mata ki chowki|chowki|jagran|puja|pooja|katha|bhajan|kirtan|religious|naming ceremony|mundan|retirement)/,
  },
];

const topicOf = (q: string) => topics.find((t) => t.words.test(q));

const ELSEWHERE =
  /\b(destination|outside|abroad|overseas|international|mumbai|delhi|pune|bangalore|bengaluru|hyderabad|jaipur|udaipur|jodhpur|goa|kerala|rajasthan|dubai|thailand|bali)\b/;
const travelLine = (q: string) =>
  ELSEWHERE.test(q) ? 'And yes, we travel: we are based in Indore and work PAN India, with destination events handled end to end.' : '';
const nextStep = (t: Topic) =>
  `Tell us the date, city and guest count for ${t.noun.replace(/^an? /, 'your ')} and we will come back with a plan. [Plan an event](/contact)`;

function topicReply(t: Topic, q = ''): Reply {
  if (t.id === 'medical') {
    const named = portfolio
      .flatMap((y) => y.events.map((e) => ({ ...e, year: y.year })))
      .filter((e) => words(q).includes(e.name.toLowerCase()));
    return {
      text: join(
        named.length > 0 &&
          `Yes, we managed ${named.map((e) => `**${e.name} ${e.year}** (${e.specialty}, ${e.city ?? 'Indore'})`).join(' and ')}.`,
        `**Medical conferences** are a specialty: ${medicalStats.map((s) => `**${s.figure}** ${s.label.toLowerCase()}`).join(', ')}.`,
        `Recent congresses include ${portfolio
          .slice(-2)
          .flatMap((y) => y.events.map((e) => e.name))
          .slice(0, 6)
          .join(', ')}. We run delegate registration, abstracts, design, hall and trade management, hospitality and F&B, with daily updates to the organising committee.`,
        travelLine(q),
        '[See the medical conferences page](/work/medical-conferences), or [share your conference brief](/contact).',
      ),
      chips: ['Get a quote', 'How does the process work?', 'Show me your work'],
    };
  }
  if (t.id === 'private') {
    return {
      text: join(
        'Our core is weddings, corporate and large-format events, but our team has planned celebrations of every size and the same people can help with a private occasion.',
        `Tell us the **occasion, city, date and guest count** on [the enquiry form](/contact) and the team will tell you honestly whether we are the right fit.`,
      ),
      chips: ['Plan a wedding', 'Get a quote', 'Contact the team'],
    };
  }
  const s = services.find((x) => x.slug === t.service)!;
  const list = caseLinks(s.cases);
  return {
    text: join(
      `**${s.name}.** ${s.summary}`,
      t.extra,
      list && `A few we have produced:\n${list}`,
      travelLine(q),
      t.category && `[See all ${categoryLabel(t.category).toLowerCase()} work](/work?type=${t.category})`,
      nextStep(t),
    ),
    chips: ['Get a quote', 'How does the process work?', 'Show me your work'],
  };
}

/* -------------------------------------------------------- what they ask for */

type Ask = { id: string; words: RegExp; reply: (t?: Topic, q?: string) => Reply };

const BUDGET = /(?:₹|rs\.?|inr)\s?[\d,.]+\s*(?:lakhs?|lacs?|crores?|cr|k)?|\b[\d.]+\s*(?:lakhs?|lacs?|crores?|cr)\b/;
const budgetLine = (q: string) => {
  const m = q.match(BUDGET);
  return m ? `Thanks for sharing a budget of about **${m[0].trim()}**. That helps the team shape options that fit it.` : '';
};

const VENDOR_LEADS: [RegExp, string][] = [
  [/venue|banquet|lawn/, 'Yes, venue scouting is part of what we do. We shortlist venues to fit your guest count, budget and style, then plan the layout, permissions and vendors there.'],
  [/cater|food|menu/, 'Yes, we coordinate catering: menus and tastings, counters and service flow, with head-count control on the day.'],
  [/decor|tent|stage/, 'Yes, décor and stage design are in-house strengths, from concept and mood boards to the build.'],
  [/sound|light|led/, 'Yes, we produce sound, light and LED for everything from intimate functions to stadium-sized shows.'],
  [/photo|video|drone/, 'Yes, we arrange photography and film crews and brief them on every key moment.'],
  [/hotel|accommodation|stay|rooms|transport|cab|logistics/, 'Yes, guest logistics is a core service: hotel blocks, airport pickups, transport and a senior person at each hotel.'],
  [/\bdj|anchor|emcee|band|magician|choreographer/, 'Yes, we book DJs, anchors, bands, choreographers and other artists, and manage them on the day.'],
  [/invite|invitation/, 'Yes, we design invitations and the full event identity, from invites to signage.'],
];
const vendorLead = (q: string) => VENDOR_LEADS.find(([re]) => re.test(q))?.[1] ?? 'Yes, we can arrange that.';

const MONTH = '(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*';

const asks: Ask[] = [
  {
    id: 'payment',
    words: /\b(payments?|pay|paying|advance|deposit|refund|cancel|cancellation|gst|invoice|emi|installments?|upi|card payments?)\b/,
    reply: () => ({
      text: join(
        'Payment schedules and cancellation terms are agreed in each event’s contract, so the team will walk you through them with your proposal.',
        `To start, [share your brief](/contact) or reach out directly:\n- ${contactLine()}`,
      ),
      chips: ['Get a quote', 'How does the process work?'],
    }),
  },
  {
    id: 'availability',
    words: new RegExp(
      `\\b(available|availability|free on|dates? (free|open|available)|free dates?|book (you|blueneck|your team) for|\\d{1,2}(st|nd|rd|th)? ${MONTH}|${MONTH} \\d{1,2}\\b)`,
    ),
    reply: (t) => ({
      text: join(
        `I can’t see the live calendar, but the team confirms dates quickly${t ? ` for ${t.noun}` : ''}.`,
        `Send your **date, city and guest count** on [the enquiry form](/contact), or call or email:\n- ${contactLine()}`,
      ),
      chips: ['Get a quote', 'How early should I book?'],
    }),
  },
  {
    id: 'quote',
    words: /\b(price|pricing|prices|cost|costs|costing|quote|quotation|estimate|budget|charges?|charging|rates?|fees?|packages?|kitna|kharcha|lakh|lakhs|crore|how much|ballpark|rough (figure|idea|number)|approx|affordable|cheap|expensive|minimum|fixed fee|percentage|book (you|blueneck|your team)|hire (you|blueneck))/,
    reply: (t, q = '') => ({
      text: join(
        budgetLine(q),
        `Every ${t ? t.noun.replace(/^an? /, '') : 'event'} is costed to its brief, so there’s no fixed rate card. The quickest way to a number is to tell us the **occasion, city, date and rough guest count**${t?.id === 'weddings' ? ', plus the functions you are planning' : ''}.`,
        `[Share your brief on the enquiry form](/contact), or reach the team directly:\n- ${contactLine()}`,
      ),
      chips: t ? ['How does the process work?', 'Show me your work'] : ['Plan a wedding', 'Corporate events', 'Where are you based?'],
    }),
  },
  {
    id: 'partner',
    words: /\b(vendor|supplier|sponsor|sponsorship|partner with|partnership|collaborat|tie[- ]?up|empanel|associate with|work together|we are an? .*(company|agency|firm|studio)|i am an? .*(vendor|supplier|decorator|caterer|photographer|dj|artist|anchor))/,
    reply: () => ({
      text: join(
        'We are always glad to meet good partners: decorators, AV and production houses, caterers, artists, photographers and venues.',
        `Please email your profile and portfolio to [${enquiry.email}](mailto:${enquiry.email}) and the team will be in touch when there’s a fit.`,
      ),
      chips: ['Show me your work', 'Are you hiring?'],
    }),
  },
  {
    id: 'careers',
    words: /\b(jobs?|careers?|hiring|vacanc\w*|openings|job opening|intern|internships?|fresher|work (with|for|at) (you|blueneck)|join (you|your|blueneck)|apply|resume|cv|salary|stipend|chahiye job|job chahiye|naukri)\b/,
    reply: () => ({
      text: careers.openings.length
        ? join(
            `We are hiring for:\n${careers.openings.map((o) => `- **${o.title}** (${o.location}, ${o.type})`).join('\n')}`,
            '[Apply on the careers page](/careers)',
          )
        : join(
            `There are no advertised openings right now, but we always welcome open applications, including internships, across ${careers.teams
              .slice(0, 3)
              .map((t) => t.name.toLowerCase())
              .join(', ')} and more.`,
            '[Send an open application](/careers)',
          ),
      chips: ['Who leads the team?', 'What do you do?'],
    }),
  },
  {
    id: 'contact',
    words: /\b(contact|call|calling|phone|mobile|number|email|e-mail|mail id|whatsapp|reach (you|out)|talk to|speak (to|with)|executive|representative|callback|get in touch|connect me|filled the form|submitted|when will (someone|you|the team) (reply|respond|call|get back)|no (reply|response)|havent heard|mob|mob no|contact no|cell|brochure|company profile|your profile|deck|catalogue|catalog|open (on|today|now|tomorrow)|timings?|office hours|working hours|baat karn|baat kar)/,
    reply: (_t, q = '') => ({
      text: join(
        /brochure|profile|deck|catalog/.test(q)
          ? 'The team will gladly send our company profile. Ask for it here:'
          : `Happy to connect you with the team${_t ? ` about ${_t.noun.replace(/^an? /, 'your ')}` : ''}:`,
        `- ${contactLine()}`,
        /open|timing|hours/.test(q) ? 'Please call ahead before visiting so the right person is there to meet you.' : '',
        'Or [send a brief through the enquiry form](/contact) and we will come back with a plan.',
      ),
      chips: ['Where are you based?', 'Get a quote'],
    }),
  },
  {
    id: 'process',
    words: /\b(process|how (does|do) (it|this|you) work|how (do|can) (i|we) (start|begin|proceed)|steps|how early|how far in advance|lead time|timeline|how soon|last minute|in advance|planning time|how (do|can) (i|we) book|how to book|next steps?|how to proceed|on the day|day of the event|on[- ]site|on ground|who (handles|manages|coordinates|will be)|point of contact|coordinator|urgent|asap|short notice|in \d+ (days|weeks)|\d+ (days|weeks) (left|away))/,
    reply: (t) => ({
      text: join(
        `Here’s how we usually work${t ? ` on ${t.noun}` : ''}:`,
        '- **Brief:** you share the occasion, city, dates, guest count and the feel you want.\n- **Plan and proposal:** we come back with a concept, scope and costing.\n- **Production:** a senior lead and team handle vendors, design, logistics and guests, with regular updates.\n- **Show days:** we run the event on the ground so you can be present for it.',
        `On timing: the earlier the better, especially for ${t?.id === 'weddings' ? 'wedding season dates' : 'peak-season dates and large events'}, but the team has also delivered on tight timelines. [Start with your brief](/contact).`,
      ),
      chips: ['Get a quote', 'Show me your work'],
    }),
  },
  {
    id: 'scale',
    words: /\b(biggest|largest|big events?|how many (people|guests|events|delegates|visitors)(?! work| do you employ)|how big (is|was) (the|your) (biggest|largest|event|crowd)|capacity|(handle|manage) (a crowd of )?\d[\d,]{2,}|\d[\d,]{3,} (people|guests|pax|attendees|visitors|delegates)|crowd size|huge)/,
    reply: () => ({
      text: join(
        `Large crowds are routine for us:\n${scale.map((s) => `- **${s.figure}** ${s.label}`).join('\n')}`,
        '[See the productions behind these numbers](/work)',
      ),
      chips: ['Get a quote', 'Show me your work'],
    }),
  },
  {
    id: 'size',
    words: /\b(can|could|will|do) (you|u) (organi[sz]e|plan|do|manage|handle|arrange)\b.*\b\d+\s*(people|guests|pax|persons|members)|\b(small|intimate|tiny) (event|gathering|function)/,
    reply: (t) => ({
      text: join(
        `Yes. We plan ${t ? t.noun.replace(/^an? /, '') + 's' : 'events'} of every size, from intimate gatherings to crowds of 25,000, and give each the same senior attention.`,
        'Share the date, city and guest count on [the enquiry form](/contact) and the team will suggest the right format.',
      ),
      chips: ['Get a quote', 'How does the process work?'],
    }),
  },
  {
    id: 'vendors',
    words: /\b(cater|catering|caterers?|food|menu|venues?|banquet|lawn|decor|decoration|decorations|sound|lighting|lights|led|stage|photograph|photographers?|video|videographer|drone|hotels?|accommodation|stay|rooms|transport|cabs?|logistics|invites?|invitations?|makeup|anchor|emcee|security|tent|dj|djs|band|magician|choreographer)\b/,
    reply: (t, q = '') => ({
      text: join(
        vendorLead(q),
        `We bring the whole production together${t ? ` for ${t.noun}` : ''}: venue scouting and layout, décor and stage design, sound, light and LED, catering coordination, photography and film, guest hotels and transport, artists and anchors, and on-ground crew.`,
        'You get one team accountable for every vendor, whether we hire them or you do.',
        '[Tell us what you need](/contact) and we will build the plan around it.',
      ),
      chips: ['Get a quote', 'How does the process work?'],
    }),
  },
];

/* -------------------------------------------------- productions, by name */

// Words too common to identify a single production on their own.
const GENERIC = new Set(
  'chief minister central team blueneck indore bhopal edition launch store annual india indian event events conclave conference award awards audition auditions league premier madhya pradesh family dealers meet ceremony golden jubilee fashion week west zone expo partner premium industry industries excellence ground breaking factory activations institute management association society limited private cricket opening the and for with times'.split(
    ' ',
  ),
);

const words = (s: string) => s.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9@]+/).filter(Boolean);

const caseIndex = cases.map((c) => {
  const w = [...words(c.title), ...words(c.client ?? ''), ...words(c.slug.replace(/-/g, ' '))].filter((t) => !/^\d+$/.test(t));
  const pairs = new Set<string>();
  for (const src of [c.title, c.client ?? '', c.slug.replace(/-/g, ' ')]) {
    const ws = words(src).filter((t) => !/^\d+$/.test(t));
    for (let i = 0; i < ws.length - 1; i++) pairs.add(`${ws[i]} ${ws[i + 1]}`);
  }
  // Proper names mentioned in the story ("Kapil Dev", "Sonali Bendre"), matched as pairs.
  const story = `${c.highlight ?? ''}. ${c.teaser} ${c.body.join(' ')}`;
  const names = new Set<string>();
  for (const m of story.matchAll(/(?<![.!?]\s)\b([A-Z][a-z]+) ([A-Z][a-z]+)\b/g)) {
    const pair = `${m[1]} ${m[2]}`.toLowerCase();
    if (!pair.split(' ').some((x) => GENERIC.has(x))) names.add(pair);
  }
  return { c, tokens: new Set(w.filter((t) => t.length > 3 && !GENERIC.has(t))), pairs, names };
});

/** Does the question name one of our productions? ("tell me about bhaskar utsav") */
function matchCase(q: string): Reply | null {
  const qw = words(q);
  const qset = new Set(qw);
  const qpairs = new Set(qw.slice(0, -1).map((w, i) => `${w} ${qw[i + 1]}`));
  let best: { c: (typeof cases)[number]; score: number; person?: string } | null = null;
  for (const { c, tokens, pairs, names } of caseIndex) {
    let score = 0;
    let person: string | undefined;
    tokens.forEach((t) => qset.has(t) && (score += 2));
    pairs.forEach((p) => qpairs.has(p) && (score += 1));
    names.forEach((p) => {
      if (!qpairs.has(p)) return;
      score += 2;
      person = p.replace(/\b\w/g, (ch) => ch.toUpperCase());
    });
    if (score > (best?.score ?? 1)) best = { c, score, person };
  }
  if (!best) return null;
  const { c, person } = best;
  const meta = [c.client, c.location, c.year].filter(Boolean).join(' · ');
  return {
    text: join(
      // Matched on a person's name: say so, and don't promise them for the visitor's event.
      person &&
        `**${person}** featured at one of our productions, below. We can approach artists and celebrities for your event too; their availability and fees are set by them.`,
      `**${c.title}**${meta ? `\n${meta}` : ''}`,
      c.body[0],
      `What we handled:\n${c.scope
        .slice(0, 4)
        .map((s) => `- ${s}`)
        .join('\n')}`,
      `[Open the case study](/work/${c.slug})`,
    ),
    chips: [`More ${categoryLabel(c.category).toLowerCase()}`, 'Get a quote'],
  };
}

/* --------------------------------------------------------- general questions */

const clientNames = clients.map((c) => c.name).filter((n) => n && !/\d/.test(n));

const general: { id: string; words: RegExp; reply: (q?: string) => Reply }[] = [
  {
    id: 'clients',
    words: new RegExp(
      `\\b(${clientNames
        .flatMap((n) => words(n).filter((w) => w.length > 4 && !GENERIC.has(w) && !/^(power|steel|creative|paints|healthcare|cosmetics|airports|pumps|frames|swara|ganit|vigour|citadel|phoenix|bharatiya|janata|ltd|limited|india|indian|entertainment|industries|commercial|vehicles|association|institute|management|confederation|industry|authority|development|party|factory|media|frames)$/.test(w)))
        .join('|')})\\b`,
    ),
    reply: (q = '') => {
      const hit = clientNames.find((n) => words(n).some((w) => w.length > 4 && words(q).includes(w)));
      return {
        text: join(
          `Yes, **${hit}** is among the ${clientNames.length}+ organisations we have produced events for.`,
          'For the details of a specific project, [browse the work](/work) or [ask the team](/contact).',
        ),
        chips: ['Who are your clients?', 'Show me your work'],
      };
    },
  },
  {
    id: 'clients',
    words: /\b(clients?|customers|brands (you|have)|who have you worked|companies you)/,
    reply: () => ({
      text: join(
        `We have produced events for ${clientNames.length}+ organisations, including ${clientNames.slice(0, 12).join(', ')} and the Airports Authority of India.`,
        '[See the work behind the names](/work)',
      ),
      chips: ['Show me your work', 'Get a quote'],
    }),
  },
  {
    id: 'team',
    words: /\b(how big is (your|the) team|team size|how many (people|employees|staff) (work|do you)|directors?|founders?|owners?|ceo|md|leaders?|who (leads|runs|owns|started)|your team|the team|people behind|radhika|mohit|hitesh|pawar|bhargava|panwar)/,
    reply: (q = '') => {
      const d = directors.find((x) => q.includes(x.name.split(' ')[0].toLowerCase()));
      if (d) {
        return {
          text: join(`**${d.name}**, ${d.role}`, d.bio[0], d.bio[1], `[Meet ${d.name.split(' ')[0]} and the team](/about)`),
          chips: ['Who leads the team?', 'Get a quote'],
        };
      }
      return {
      text: join(
        `Blueneck is led by three directors with nearly two decades each in events:\n${directors
          .map((d) => `- **${d.name}**, ${d.role}: ${d.bio.join(' ').match(/over (\d+) years/)?.[1] ?? '18'}+ years in events`)
          .join('\n')}`,
        'Between them they have led 1,500+ events, including 100+ luxury weddings. [Meet the team](/about)',
      ),
      chips: ['What do you do?', 'Get a quote'],
      };
    },
  },
  {
    id: 'location',
    words: /\b(where (are|is) (you|your|blueneck)|kahan|kaha hai|how far|directions|map|nearby|near (you|your)|located|location|address|your office|office address|head ?office|based|which cities|other cities|pan india|outside|travel|abroad|international|overseas|(are you|do you work|do you operate|do you plan events|events?) in [a-z]+|gujarat|maharashtra|rajasthan|ujjain|mumbai|delhi|pune|bangalore|bengaluru|hyderabad|jaipur|udaipur|goa|dubai)/,
    reply: () => ({
      text: join(
        'We are headquartered in **Indore, Madhya Pradesh** and work **PAN India**. Productions so far span Indore, Bhopal, Ujjain, Ahmedabad, Hyderabad and Goa, plus televised auditions across 21 cities. For other cities, or overseas, the team will happily discuss it.',
        `Office: ${enquiry.address}`,
      ),
      chips: ['Get a quote', 'Show me your work'],
    }),
  },
  {
    id: 'bot',
    words: /\b(who are you|are you (a )?(bot|robot|ai|human|real)|chat ?bot|your name)/,
    reply: () => ({
      text: join(
        `I’m the ${company.name} website assistant. I can answer questions about our services, past events and how to work with us, and point you to the right page.`,
        'For anything specific to your event, the team takes over: [send your brief](/contact) or ask me for their number.',
      ),
      chips: starterChips,
    }),
  },
  {
    id: 'why',
    words: /\b(why (should|choose|blueneck|you)|what makes you|different from|better than|usp|stand out|trust you)/,
    reply: () => ({
      text: join(
        'A few reasons clients come back:',
        `- **Experience:** directors with nearly two decades each, ${scale.find((s) => !s.slug)?.figure ?? '1,500+'} events between them.\n- **Scale:** crowds of 25,000 and expos of 80,000 visitors handled without fuss.\n- **One accountable team:** a senior lead from the first call, every vendor supervised.\n- **Range:** weddings, corporate, government protocol, concerts and 17 medical conferences.`,
        '[See the work](/work) or [meet the team](/about).',
      ),
      chips: ['Get a quote', 'Show me your work'],
    }),
  },
  {
    id: 'reviews',
    words: /\b(reviews?|testimonials?|feedback|ratings?|references?)/,
    reply: () => ({
      text: testimonials.length
        ? join(
            `Here’s what one client said:\n\n“${testimonials[0].quote}”\n— ${testimonials[0].name}, ${testimonials[0].role}`,
            '[See the work](/work)',
          )
        : join(
            'We let the work speak first: each case study shows the brief, the scale and exactly what we handled.',
            'The team is also happy to put you in touch with past clients as references. [Browse the work](/work) or [ask the team](/contact).',
          ),
      chips: ['Who are your clients?', 'Get a quote'],
    }),
  },
  {
    id: 'experience',
    words: /\b(experience|how long|how old|how many years|years in|started|founded|established|since when|when was|when did you)/,
    reply: () => ({
      text: join(
        `${company.legalName} was incorporated in **${company.incorporated}**, but the people behind it are far from new: our three directors bring 18 to 20+ years each and have led **1,500+ events** across India, including 100+ luxury weddings.`,
        `Since ${company.incorporated} we have produced the ${cases.length} productions on this site and 17 medical conferences. [See the work](/work) or [meet the team](/about).`,
      ),
      chips: ['Who leads the team?', 'Show me your work'],
    }),
  },
  {
    id: 'work',
    words: /\b(work|portfolio|projects?|past events|previous events|case stud|done before|examples?|show me|gallery|photos|pictures)/,
    reply: () => ({
      text: join(
        `Some of the productions we are proudest of:\n${scale
          .filter((s) => s.slug)
          .map((s) => {
            const c = cases.find((x) => x.slug === s.slug)!;
            return `- [${c.title}](/work/${c.slug}): ${s.figure} ${s.label.split(',')[0]}`;
          })
          .join('\n')}`,
        `[Browse all ${cases.length} productions](/work), each with photos and what we handled.`,
      ),
      chips: ['Corporate events', 'Concerts and live shows', 'Medical conferences'],
    }),
  },
  {
    id: 'about',
    words: /\b(about (you|your|blueneck|the company)|what do you do|what you do|services|offer|expertise|company|experience|how long|started|founded|established|since when|when was|years)/,
    reply: () => ({
      text: join(
        `**${company.name}** (incorporated in ${company.incorporated}) plans and produces events across India: ${services
          .map((s) => s.name.toLowerCase())
          .slice(0, -1)
          .join(', ')} and ${services[services.length - 1].name.toLowerCase()}.`,
        company.aboutShort,
        '[Explore our expertise](/expertise)',
      ),
      chips: ['Plan a wedding', 'Corporate events', 'Show me your work'],
    }),
  },
  {
    id: 'offtopic',
    words: /\b(weather|python|javascript|code|coding|script|homework|essay|news|stock|share price|recipe|joke|movie|translate|math|politics|election|cricket score)/,
    reply: () => ({
      text: 'That’s outside what I can help with here. I’m best at questions about Blueneck’s events: what we do, past productions, and how to plan yours.',
      chips: starterChips,
    }),
  },
  {
    id: 'thanks',
    words: /\b(thank|thanks|thx|ty|dhanyavad|dhanyawad|shukriya|great|awesome|perfect|helpful|nice)\b/,
    reply: () => ({ text: 'My pleasure! Anything else I can help you plan?', chips: starterChips.slice(1) }),
  },
  {
    id: 'bye',
    words: /\b(bye|goodbye|see you|tata|good night|gn)\b/,
    reply: () => ({
      text: `Thank you for visiting ${company.name}! Whenever you are ready, [the enquiry form](/contact) is the fastest way to reach the team.`,
    }),
  },
  {
    id: 'greeting',
    words: /^(hi+|hello|hey|hola|namaste|namaskar|good (morning|afternoon|evening)|yo)\b/,
    reply: () => ({
      text: 'Namaste! I am the Blueneck assistant. Tell me what you are planning, whether a wedding, a corporate event, a conference or a launch, and I will point you the right way.',
      chips: starterChips,
    }),
  },
  {
    id: 'ack',
    words: /^(ok|okay|k|yes|yeah|yep|no|nope|sure|hmm+|cool|alright|fine|haan|ha|nahi|lol|haha+|hehe+|:\)|👍)[.! ]*$/,
    reply: () => ({ text: 'Sure. What would you like to know next?', chips: starterChips }),
  },
];

/* ------------------------------------------------------------------- entry */

const COMPLAINT =
  /\b(complain|complaint|badly|worst|terrible|horrible|disappointed|unhappy|not happy|poor (service|management)|issue with (your|the) (team|event)|bad experience|unprofessional)/;

const FRUSTRATED = /\b(useless|stupid|dumb|not helpful|unhelpful|doesnt help|dont understand|didnt understand|bakwas|rubbish|pathetic|waste of time)\b/;

/**
 * @param input   the visitor's message
 * @param earlier their previous messages, newest last. Follow-ups like "Get a quote"
 *                or "how early should I book?" keep the event they mentioned before.
 */
export function localReply(input: string, earlier: string[] = []): Reply {
  const q = input.toLowerCase().replace(/[’']/g, '').replace(/\s+/g, ' ').trim();

  if (FRUSTRATED.test(q)) {
    return {
      text: join(
        'Sorry, I’m a simple assistant and I didn’t get that right. A real person will do better:',
        `- ${contactLine()}`,
      ),
      chips: ['Get a quote', 'Show me your work'],
      intent: 'frustrated',
    };
  }

  if (COMPLAINT.test(q)) {
    return {
      text: join(
        'I’m sorry to hear that. This deserves a person, not a chatbot, so please reach a director directly:',
        `- ${contactLine()}`,
        'Share the event and what went wrong, and they will respond personally.',
      ),
      chips: ['Contact the team'],
      intent: 'complaint',
    };
  }

  const more = q.match(/^more (.+)$/);
  const topic = topicOf(more ? more[1] : q);

  const ask = asks.find((a) => a.words.test(q));
  // A bare service word ("sangeet and haldi decor") is about the event, not a vendor list.
  if (ask && !(ask.id === 'vendors' && topic && !/\b(do|can|will) you\b|\bprovide|\barrange/.test(q))) {
    const remembered = topic ?? [...earlier].reverse().map((m) => topicOf(m.toLowerCase())).find(Boolean);
    return { ...ask.reply(remembered, q), intent: ask.id };
  }

  if (!more) {
    const named = matchCase(q);
    if (named) return { ...named, intent: 'case' };
  }

  if (topic) return { ...topicReply(topic, q), intent: topic.id };

  const g = general.find((i) => i.words.test(q));
  if (g) return { ...g.reply(q), intent: g.id };

  return {
    text: join(
      'I don’t have an answer to that one, but the team will. You can [send your question on the enquiry form](/contact) or reach us directly:',
      `- ${contactLine()}`,
      'Or ask me about our services, past events, weddings, medical conferences or where we work.',
    ),
    chips: starterChips,
    intent: 'fallback',
  };
}

/** Suggested follow-ups for an AI answer, picked by the same matcher. */
export const chipsFor = (input: string, earlier: string[] = []) => localReply(input, earlier).chips ?? starterChips;
