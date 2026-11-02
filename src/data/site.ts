/**
 * Company-wide content. Everything here is taken from the Blueneck corporate
 * profile PDF unless marked TODO. Edit this file to update copy site-wide.
 */
import images from './images.generated.json' with { type: 'json' };

export type Img = { src: string; w: number; h: number; tone: string };

export const company = {
  name: 'Blueneck Events',
  legalName: 'Blueneck Events Pvt. Ltd.',
  tagline: ['Corporate', 'Weddings', 'Activations'],
  incorporated: 2022,
  /** Two-sentence version of `about` for the home page. */
  aboutShort:
    'Backed by nearly two decades of industry expertise, our leadership and team of seasoned professionals bring deep knowledge across all aspects of event management. With a PAN India presence, we take care of the execution so our clients can focus on celebrating the moment.',
  about:
    'Incorporated in 2022, Blueneck Events Pvt. Ltd. is driven by a vision to deliver seamless and memorable event experiences. Backed by nearly two decades of industry expertise, our leadership and team of seasoned professionals bring deep knowledge across all aspects of event management. With a PAN India presence, we are committed to providing hassle-free execution and exceptional service, allowing our clients to focus on celebrating the moment while we take care of the rest.',
};

/**
 * Home page hero film. Drop the showreel into `public/video/` (H.264 MP4, ideally
 * under ~15 MB and 20–40 s so it loops cleanly). `mobileSrc` is optional: a lighter
 * portrait cut for phones. The poster shows while the video loads, or if it is missing.
 */
export const heroVideo = {
  src: '/video/hero.mp4',
  mobileSrc: '',
  poster: '/images/work/prabandhotsav-2023/1.webp',
};

/**
 * Contact details.
 * TODO: the company profile does not list an address, phone or email.
 * Fill these in before going live. Empty values are hidden in the UI.
 */
export const contact = {
  email: '', // e.g. 'hello@blueneckevents.com'
  phone: '', // e.g. '+91 98xxx xxxxx'
  // Digits only, with country code. Used by the floating WhatsApp button, the footer, the
  // contact page and the assistant. TODO: confirm this is the right WhatsApp number (it is
  // director Radhika Pawar's number from the medical-conferences deck).
  whatsapp: '919926000545',
  addressLines: ['Indore, Madhya Pradesh'], // TODO: replace with the full office address
  mapQuery: 'Indore, Madhya Pradesh', // used for the embedded map
  instagram: '',
  linkedin: '',
};

/** "What we do" from the profile, plus weddings and activations from the logo line. */
export type Service = {
  slug: string;
  name: string;
  summary: string;
  /** Case-study slugs that demonstrate this service. */
  cases: string[];
};

export const services: Service[] = [
  {
    slug: 'corporate-events',
    name: 'Corporate events',
    summary:
      'Dealer meets, family days, jubilees and award nights. Multi-venue itineraries, guest logistics and hospitality, on-ground supervision and client servicing.',
    cases: [
      'vigour-biotech-dealers-meet',
      'rakuten-symphony-family-day',
      'pushp-masala-golden-jubilee',
      'dee-tee-golden-jubilee',
      'industry-excellence-awards',
    ],
  },
  {
    slug: 'weddings',
    name: 'Weddings',
    summary:
      'Our directors have curated more than 100 luxury weddings, bringing the same planning discipline we use for summits and stadium shows to the most personal day of all.',
    cases: [],
  },
  {
    slug: 'brand-activations',
    name: 'Brand activations and launches',
    summary:
      'Store launches, in-store promotions, mall activations and artist showcases. Empanelled partner for Pernod Ricard India across West India and Maharashtra.',
    cases: ['inspire-apple-store-launch-indore', 'inspire-store-launch-bhopal', 'blenders-pride-pernod-ricard', 'rambo-circus'],
  },
  {
    slug: 'government-events',
    name: 'Government and civic events',
    summary:
      'Ceremonies led by the Chief Minister, the Indore mayoral oath, city-wide route branding and public programmes for thousands of citizens, run to protocol and to the minute.',
    cases: [
      'pratibha-factory-ground-breaking',
      'mayor-shapath-grahan-samaroh',
      'pravasi-bharatiya-divas',
      'mp-startup-conclave',
      'womens-walkathon',
      'modi-at-20',
    ],
  },
  {
    slug: 'celebrity-events',
    name: 'Celebrity events and live shows',
    summary:
      'Concerts, fashion weeks and cultural festivals with headline artists, from stage design and show flow to crowd management for 25,000 people.',
    cases: ['bhaskar-utsav', 'prabandhotsav-2023', 'prabandhotsav-2022', 'times-india-fashion-week'],
  },
  {
    slug: 'auditions',
    name: 'Auditions',
    summary:
      'Televised talent-hunt auditions across 21 cities in 40 days: venue finalisation, audition flow, participant management and integration with production crews.',
    cases: ['sa-re-ga-ma-pa-auditions', 'indian-idol-telugu-auditions'],
  },
  {
    slug: 'sports-events',
    name: 'Sports events',
    summary:
      'League launches, player auctions and association awards, with sets that reflect the sport and protocol that keeps team owners and officials on schedule.',
    cases: ['mp-premier-league-2025', 'mp-premier-league-2024', 'mpca-agm-annual-awards'],
  },
  {
    slug: 'exhibitions',
    name: 'Exhibitions and trade fairs',
    summary:
      'Exhibition layout, stall build, venue setup and visitor flow for shows with more than 300 exhibitors and close to 80,000 visitors.',
    cases: ['plastpack-2025', 'she-rises-conclave-expo'],
  },
  {
    slug: 'conferences',
    name: 'Medical and professional conferences',
    summary:
      'Multi-day conclaves with registration desks, scientific sessions, trade zones and gala nights, including India’s largest carbon-neutral architecture event.',
    cases: ['usicon-west-zone', 'iia-natcon-2025', 'credai-conclave'],
  },
];

export type Director = { slug: string; name: string; role: string; bio: string[]; image: Img };

const team = images as unknown as Record<string, Img[]>;

export const directors: Director[] = [
  {
    slug: 'radhika-pawar',
    name: 'Radhika Pawar',
    role: 'Director',
    image: team['_team_radhika-pawar'][0],
    bio: [
      'With over 20 years of expertise in event management, Radhika leads Blueneck Events with a calm, solution-driven approach and a sharp strategic eye. Under her direction, the company has delivered exceptional experiences for corporate clients, government bodies, and private hosts across India.',
      'Radhika brings a unique blend of creativity, leadership, and operational excellence to every project. Her strengths lie in managing diverse formats, from corporate conferences and brand activations to large-scale public programs, while staying focused on each client’s vision and goals.',
      'A natural collaborator and strong communicator, Radhika nurtures lasting relationships with clients, teams, and partners. Her ability to stay composed under pressure and deliver with precision has earned her a trusted reputation in the events industry.',
    ],
  },
  {
    slug: 'mohit-bhargava',
    name: 'Mohit Bhargava',
    role: 'Director',
    image: team['_team_mohit-bhargava'][0],
    bio: [
      'Mohit Bhargava brings over 20 years of dynamic experience in the event industry, with a strong reputation for relationship-building, strategic planning, and flawless execution. Known for his charismatic personality and people-first approach, Mohit excels at building lasting partnerships and ensuring client satisfaction at every level.',
      'His strengths lie in crafting memorable event experiences, managing high-profile clientele, and orchestrating seamless event flows with meticulous attention to detail.',
      'As a natural people pleaser and seasoned planner, Mohit’s leadership ensures that every event curated by Blueneck is not only well-executed but deeply resonant and impactful.',
    ],
  },
  {
    slug: 'hitesh-panwar',
    name: 'Hitesh Panwar',
    role: 'Director',
    image: team['_team_hitesh-panwar'][0],
    bio: [
      'A highly accomplished event management professional with over 18 years of experience, Hitesh Panwar has led the planning and execution of 1,500+ events across India, including high-profile weddings, celebrity reality shows, and corporate conferences. He has curated over 100 luxury weddings, managed award and live shows, and delivered large-scale product launches and exhibitions for top-tier brands, TV channels and government bodies.',
      'Hitesh is known for his strategic vision, meticulous planning, and flawless execution, backed by a strong foundation in both technical and creative domains.',
      'When he’s not orchestrating grand events, Hitesh enjoys traveling and connecting with new people, which continues to inspire his work and enrich his network within the industry.',
    ],
  },
];

/** Scale figures, each tied to the event (or person) it comes from. */
export const scale = [
  { figure: '80,000', label: 'visitors to Plast Pack 2025, with 300+ exhibitors', slug: 'plastpack-2025' },
  { figure: '25,000', label: 'people in the crowd at Bhaskar Utsav, Indore', slug: 'bhaskar-utsav' },
  { figure: '21 cities', label: 'of Sa Re Ga Ma Pa auditions in 40 days', slug: 'sa-re-ga-ma-pa-auditions' },
  { figure: '1,500+', label: 'events led across India by director Hitesh Panwar', slug: null },
];

export const officeImage: Img = team._office[0];

export type Client = { src: string; name: string; w: number; h: number };
export const clients: Client[] = (images as unknown as { _clients: Client[] })._clients;

/**
 * Client testimonials.
 * TODO: the company profile contains no client quotes. Add real ones here
 * (with the client's permission) and the home page will show them instead of
 * the "case notes" fallback.
 */
export type Testimonial = { quote: string; name: string; role: string; caseSlug?: string };
export const testimonials: Testimonial[] = [];

/**
 * Careers page.
 * TODO: the company profile lists no vacancies or hiring email. Add live openings to
 * `openings` (the page shows an "open application" note while it is empty) and set
 * `email` to the inbox that should receive applications (falls back to contact.email).
 */
export type Opening = {
  title: string;
  /** Must match one of the `teams` names below, so "Apply" can preselect it. */
  team: string;
  location: string;
  type: string; // e.g. 'Full time', 'Internship', 'Per event'
  summary: string;
};

export const careers = {
  email: '', // e.g. 'careers@blueneckevents.com'
  openings: [] as Opening[],
  /** The disciplines behind every production, described from the work in the profile. */
  teams: [
    {
      name: 'Event planning and project management',
      summary:
        'Own a brief from first call to final bow: timelines, budgets, run-of-show and the hundred moving parts in between.',
    },
    {
      name: 'Production and stage',
      summary:
        'Stages, sets, sound, light and LED for launches, concerts and award nights, built to schedule and torn down without a trace.',
    },
    {
      name: 'Creative and design',
      summary:
        'Stage design, event identities, route branding and on-ground collateral that make each production look like itself.',
    },
    {
      name: 'Client servicing',
      summary:
        'Be the calm voice for corporates, government bodies and private hosts, and turn what they want into what the team can build.',
    },
    {
      name: 'Guest logistics and hospitality',
      summary:
        'Travel, stays, registrations and VIP movement for multi-venue itineraries, conferences and delegations.',
    },
    {
      name: 'Operations and on-ground crew',
      summary:
        'Vendors, venues, permissions and crowd flow. The people who make sure 25,000 guests get in, and out, on time.',
    },
  ],
};
