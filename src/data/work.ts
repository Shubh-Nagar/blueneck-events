/**
 * Case studies, written from the Blueneck corporate profile.
 * Images live in /public/images/work/<slug>/ and are listed in images.generated.json
 * (first image = cover).
 */
import images from './images.generated.json' with { type: 'json' };
import type { Img } from './site.js';

export type Category =
  'government' | 'corporate' | 'entertainment' | 'activations' | 'auditions' | 'sports' | 'exhibitions' | 'conferences';

export const categories: { id: Category; label: string }[] = [
  { id: 'corporate', label: 'Corporate' },
  { id: 'government', label: 'Government and civic' },
  { id: 'entertainment', label: 'Celebrity and live shows' },
  { id: 'activations', label: 'Brand activations' },
  { id: 'exhibitions', label: 'Exhibitions' },
  { id: 'conferences', label: 'Conferences' },
  { id: 'sports', label: 'Sports' },
  { id: 'auditions', label: 'Auditions' },
];

/**
 * The "Work" dropdown in the header: one entry per kind of event. Most open the
 * filtered gallery; medical conferences have their own page, and weddings (no
 * photographed case studies yet) open their Expertise tab.
 */
export type WorkIcon =
  | 'medical'
  | 'weddings'
  | 'corporate'
  | 'music'
  | 'sports'
  | 'government'
  | 'activations'
  | 'exhibitions'
  | 'conferences'
  | 'auditions';

export const workMenu: { to: string; label: string; icon: WorkIcon; note: string }[] = [
  { to: '/work/medical-conferences', label: 'Medical conferences', icon: 'medical', note: '17 congresses across 15 specialties' },
  { to: '/expertise#weddings', label: 'Weddings', icon: 'weddings', note: '100+ luxury weddings curated' },
  { to: '/work?type=corporate', label: 'Corporate events', icon: 'corporate', note: 'Dealer meets, jubilees, award nights' },
  { to: '/work?type=entertainment', label: 'Concerts and live shows', icon: 'music', note: 'Music festivals, fashion weeks, artists' },
  { to: '/work?type=sports', label: 'Sports events', icon: 'sports', note: 'League launches and player auctions' },
  { to: '/work?type=government', label: 'Government and civic', icon: 'government', note: 'CM-led ceremonies, city programmes' },
  { to: '/work?type=activations', label: 'Brand activations', icon: 'activations', note: 'Store launches and mall promotions' },
  { to: '/work?type=exhibitions', label: 'Exhibitions and trade fairs', icon: 'exhibitions', note: 'Up to 300+ exhibitors, 80,000 visitors' },
  { to: '/work?type=conferences', label: 'Conclaves and conferences', icon: 'conferences', note: 'Industry and professional summits' },
  { to: '/work?type=auditions', label: 'TV auditions', icon: 'auditions', note: '21 cities in 40 days' },
];

export type CaseStudy = {
  slug: string;
  title: string;
  client?: string;
  location?: string;
  year?: string;
  category: Category;
  /** One headline fact from the profile, shown on cards and the case page. */
  highlight?: string;
  /** Short line for cards and previews. */
  teaser: string;
  /** Longer description paragraphs. */
  body: string[];
  /** "What we handled" list. */
  scope: string[];
  featured?: boolean;
};

type CaseData = Omit<CaseStudy, 'images'>;

const data: CaseData[] = [
  {
    slug: 'prabandhotsav-2023',
    title: 'Prabandhotsav 2023',
    client: 'Shri Vaishnav Institute of Management',
    location: 'Indore',
    year: '2023',
    category: 'entertainment',
    highlight: 'Second year running the full show',
    teaser: 'The 4th Prabandhotsav, closed by Indian Idol’s Shanmukha Priya.',
    body: [
      'Shri Vaishnav Institute of Management concluded the 4th year of Prabandhotsav with a bang. The finale of the two-day annual event saw Indian Idol fame Shanmukha Priya enthralling the audience with her voice.',
      'Team Blueneck managed the entire show for the second year in a row.',
    ],
    scope: [
      'Stage, lighting and sound design',
      'Artist management',
      'Show flow for a two-day festival',
      'Crowd and venue management',
    ],
    featured: true,
  },
  {
    slug: 'credai-conclave',
    title: 'CREDAI Conclave 2023',
    client: 'CREDAI Indore',
    location: 'Indore',
    year: '2023',
    category: 'conferences',
    highlight: 'First real-estate conclave held in Indore',
    teaser: 'A one-day real-estate conclave, then the Golden Brick Awards and gala night.',
    body: [
      'When you build a masterpiece from scratch, the sense of success hits differently. CREDAI Conclave 2023 was the first real-estate conclave organised in Indore, and Blueneck Events managed it.',
      'The one-day conclave ran sessions and discussions on how Indore is becoming the next big destination for IT and commercial real estate. The CREDAI Indore Golden Brick Award Ceremony and Gala Night that followed was our stage to show what we can create, and the Storyteller Musical Band left guests in awe.',
    ],
    scope: ['Conclave stage and set design', 'Delegate registration', 'Award ceremony', 'Gala night and live music'],
    featured: true,
  },
  {
    slug: 'times-india-fashion-week',
    title: 'Times India Fashion Week',
    client: 'INIFD with The Times of India',
    location: 'Indore',
    category: 'entertainment',
    highlight: 'Three-day fashion showcase',
    teaser: 'Thematic runway shows and a lifestyle exhibition over three days.',
    body: [
      'Times of India Fashion Week, curated by INIFD in collaboration with The Times of India, was a three-day showcase of thematic fashion shows and an immersive lifestyle exhibition.',
      'We owned the creative end to end: concept development, visual themes and runway aesthetics, with styling and ambience tailored to each segment. We also ran full-scale venue setup and logistics across every show day.',
    ],
    scope: [
      'Show concept and visual themes',
      'Runway design',
      'Venue setup and logistics',
      'Show-day execution for designers and models',
    ],
    featured: true,
  },
  {
    slug: 'mp-premier-league-2025',
    title: 'Madhya Pradesh Premier League 2025',
    client: 'MP Premier League — Scindia Cup',
    year: '2025',
    category: 'sports',
    highlight: 'Inaugural ceremony and player draft',
    teaser: 'Season launch and a formal player auction with every team owner in the room.',
    body: [
      'The Madhya Pradesh Premier League inaugural ceremony was hosted with spectacular fanfare, setting the tone for an exciting sporting season. All team owners attended, adding prestige and competitive spirit.',
      'We ran the formal player auction with engaging presentation and full transparency, built a venue that reflected sporting excellence, and managed protocol, show flow and guest logistics.',
    ],
    scope: ['Inaugural ceremony', 'Player auction production', 'Venue and set build', 'Protocol and guest logistics'],
    featured: true,
  },
  {
    slug: 'rambo-circus',
    title: 'Rambo Circus at Phoenix Citadel',
    client: 'Phoenix Citadel',
    location: 'Indore',
    category: 'activations',
    highlight: 'A three-day spectacle in Central India’s largest mall',
    teaser: 'The iconic Rambo Circus, brought into the mall for audiences of every age.',
    body: [
      'Phoenix Citadel, the largest mall in Central India, invited us to collaborate on the iconic Rambo Circus, a nostalgic celebration that delighted audiences across all age groups.',
      'Team BNE handled complete on-ground execution and end-to-end management of the three-day spectacle.',
    ],
    scope: ['Entry arch and box office build', 'Stage and lighting', 'On-ground execution', 'Three-day show management'],
    featured: true,
  },
  {
    slug: 'vigour-biotech-dealers-meet',
    title: 'Vigour Biotech Annual Dealers Meet 2023',
    client: 'Vigour Biotech',
    location: 'Indore',
    year: '2023',
    category: 'corporate',
    highlight: '500+ delegates, Kapil Dev as guest of honour',
    teaser: 'Two days of business, culture and entertainment for dealers from across India.',
    body: [
      'A high-impact, two-day event in Indore for Vigour Biotech, welcoming over 500 delegates from across India. The itinerary blended business, culture and entertainment: a high tea at a farmhouse, a pre-event entertainment night, a factory tour and a Mahakal darshan.',
      'The finale was a Gala Awards Night at Brilliant Convention Center, featuring Kapil Dev and performances by Ravi Shukla, Kishore Sodha and Raj Sodha.',
    ],
    scope: [
      'Multi-venue setup and coordination',
      'Guest logistics and hospitality',
      'On-ground supervision and client servicing',
      'Gala awards night',
    ],
    featured: true,
  },
  {
    slug: 'inspire-apple-store-launch-indore',
    title: 'Apple Premium Partner store launch',
    client: 'iNSPiRE',
    location: 'Phoenix Citadel, Indore',
    category: 'activations',
    highlight: 'Central India’s first Apple Premium Partner store',
    teaser: 'An official Apple inauguration, a flash mob and a stand-up set by Azeem Banatwalla.',
    body: [
      'We managed the grand launch of Central India’s first-ever Apple Premium Partner Store at Phoenix Citadel, Indore, an event marked by an overwhelming response and real excitement.',
      'The launch featured an official inauguration by Apple representatives, a flash mob and a stand-up act by Azeem Banatwalla. Team BNE handled end-to-end planning and execution.',
    ],
    scope: ['Launch planning', 'Store-front décor', 'Flash mob and artist booking', 'Crowd and queue management'],
  },
  {
    slug: 'inspire-store-launch-bhopal',
    title: 'iNSPiRE store launch',
    client: 'iNSPiRE',
    location: 'Bhopal',
    category: 'activations',
    highlight: 'With INSPIRE and Under Armour',
    teaser: 'Store décor, launch ceremony, outdoor and mall promotions for a new flagship.',
    body: [
      'A multi-segment launch working with premium labels including INSPIRE and Under Armour.',
      'We styled the store to the brand ethos, planned the inaugural ceremony, developed brand visuals across touchpoints, placed outdoor creatives, ran footfall-driving mall promotions and built buzz with pre-event activations.',
    ],
    scope: [
      'Store décor and visual merchandising',
      'Inaugural ceremony',
      'Branding',
      'Outdoor and mall promotions',
      'Pre-event activations',
    ],
  },
  {
    slug: 'blenders-pride-pernod-ricard',
    title: 'Blenders Pride and Pernod Ricard activations',
    client: 'Pernod Ricard India',
    location: 'West India and Maharashtra',
    category: 'activations',
    highlight: 'Empanelled partner for Pernod Ricard India',
    teaser: 'Model walks, artist showcases and in-store activations for Pernod Ricard brands.',
    body: [
      'As a trusted and empanelled partner for Pernod Ricard India across West India and Maharashtra, we deliver event solutions that amplify brand impact.',
      'Our work spans in-store promotions and strategic activations, manpower-driven retail and experiential campaigns, bespoke store décor, exclusive artist engagements and immersive brand showcases, along with internal meets and trainings.',
    ],
    scope: [
      'In-store promotions',
      'Experiential campaigns',
      'Store décor',
      'Artist engagements and showcases',
      'Internal meets and trainings',
    ],
  },
  {
    slug: 'plastpack-2025',
    title: 'Plast Pack 2025',
    category: 'exhibitions',
    year: '2025',
    highlight: '300+ exhibitors, nearly 80,000 visitors',
    teaser: 'Central India’s largest plastics and packaging trade fair.',
    body: [
      'Plast Pack 2025 marked a major milestone in industrial growth, serving as a premier platform for innovation in plastics, packaging and petrochemicals.',
      'With more than 300 national and international exhibitors and nearly 80,000 visitors, the fair showcased cutting-edge products, technologies and live machinery. It was graced by Hon. CM Dr. Mohan Yadav, Shri Kailash Vijayvargiya, Shri Tulsi Silawat, Shri Chaitanya Kashyap, Shri Shankar Lalwani and Mayor Pushyamitra Bhargava.',
    ],
    scope: ['Entry arches and fair branding', 'Exhibition layout', 'Stall build', 'Visitor flow', 'Dignitary protocol'],
  },
  {
    slug: 'bhaskar-utsav',
    title: 'Bhaskar Utsav — Indore edition',
    client: 'Dainik Bhaskar',
    location: 'Indore',
    category: 'entertainment',
    highlight: '25,000+ attendees',
    teaser: 'A cultural celebration in the Bhaskar Utsav series, built for a crowd of 25,000.',
    body: [
      'A grand celebration curated as part of the Bhaskar Utsav series. We managed a vibrant crowd of over 25,000 attendees.',
      'Execution covered a venue built for a high-energy cultural gathering, a seamless experience for performers and participants, robust crowd management for safety and flow, and oversight of stage design, logistics and ambience.',
    ],
    scope: ['Venue setup', 'Stage design', 'Performer management', 'Crowd management and safety'],
  },
  {
    slug: 'pratibha-factory-ground-breaking',
    title: 'Pratibha factory ground-breaking',
    client: 'Pratibha Swaraj Pvt. Ltd.',
    location: 'Madhya Pradesh',
    category: 'government',
    highlight: 'Both ceremonies led by the Chief Minister',
    teaser: 'Ground-breaking and inauguration for a factory built around women’s employment.',
    body: [
      'We executed two ceremonies, the ground-breaking and the inauguration, both led by the Hon. Chief Minister of Madhya Pradesh.',
      'The project is a pioneering initiative set to create large-scale employment with a special emphasis on empowering women. Our planning covered venue setup, guest logistics and event sequencing, aligned with the client’s progressive and inclusive mission.',
    ],
    scope: ['Two ceremonies end to end', 'Venue and marquee build', 'Dignitary protocol', 'Guest logistics and sequencing'],
  },
  {
    slug: 'mayor-shapath-grahan-samaroh',
    title: 'Mayor Shapath Grahan Samaroh',
    client: 'Indore Municipal Corporation',
    location: 'Indore',
    year: '2022',
    category: 'government',
    highlight: '5,000+ attendees',
    teaser: 'The oath ceremony of Indore Mayor Shri Pushyamitra Bhargav.',
    body: [
      'The oath ceremony of Indore Mayor Shri Pushyamitra Bhargav drew more than 5,000 people from every section of society.',
      'We designed an event that reflected the city’s pride and stature, set up the venue for high footfall and dignitary presence, planned the event flow so proceedings ran on time, and managed the stage throughout.',
    ],
    scope: ['Event design', 'Venue setup for high footfall', 'Event flow planning', 'Stage management'],
  },
  {
    slug: 'pravasi-bharatiya-divas',
    title: 'Pravasi Bharatiya Divas — Indore edition',
    location: 'Indore',
    year: '2023',
    category: 'government',
    highlight: 'Route branding from airport to venue',
    teaser: 'A three-day celebration of the global Indian diaspora in India’s cleanest city.',
    body: [
      'A landmark three-day event celebrating the global Indian diaspora, with NRIs from around the world gathering in Indore.',
      'We were responsible for complete route branding, from airport arrival zones to the main venue, with visuals and signage designed to make the city’s welcome felt along the way.',
    ],
    scope: ['Route branding', 'Large-format installations', 'Signage design', 'City-wide installation'],
  },
  {
    slug: 'mp-startup-conclave',
    title: 'Madhya Pradesh Startup Conclave',
    location: 'Brilliant Convention Centre, Indore',
    year: '2022',
    category: 'government',
    highlight: 'Addressed by Hon. PM Shri Narendra Modi',
    teaser: 'A state conclave for startup and enterprise growth.',
    body: [
      'A curated event for startup and enterprise growth with a strong national presence and vibrant participation.',
      'Hon. PM Shri Narendra Modi addressed the conclave by virtual meet. We delivered the venue setup and on-ground execution.',
    ],
    scope: ['Venue setup', 'Entry and stage branding', 'Virtual address integration', 'On-ground execution'],
  },
  {
    slug: 'womens-walkathon',
    title: 'Women’s Walkathon',
    client: 'Indore Municipal Corporation with Dainik Bhaskar',
    location: 'Indore',
    category: 'government',
    highlight: '5,000+ women on a 2 km route',
    teaser: 'A community walk celebrating women’s strength and spirit.',
    body: [
      'The Women’s Walkathon, an initiative by the Indore Municipal Corporation in association with Dainik Bhaskar, celebrated women’s strength and spirit.',
      'More than 5,000 women of all ages walked the 2 km stretch. The large-scale community initiative highlighted the power of collective participation and the importance of empowering women.',
    ],
    scope: ['Start and finish arches', 'Stage and hospitality', 'Route branding', 'Participant management'],
  },
  {
    slug: 'modi-at-20',
    title: 'Modi@20: Dreams Meet Delivery',
    location: 'Indore',
    category: 'government',
    highlight: 'Book launch event',
    teaser: 'An event around the anthology on two decades of progress and vision.',
    body: [
      'Modi@20: Dreams Meet Delivery is a reflective anthology by scholars and experts capturing two decades of progress, vision and transformation.',
      'We designed and produced the event, from the welcome arch and stage to the gallery and book display.',
    ],
    scope: ['Stage and welcome arch', 'Gallery installation', 'Book display', 'Venue setup'],
  },
  {
    slug: 'she-rises-conclave-expo',
    title: 'She Rises Conclave and Expo',
    client: 'FICCI FLO Indore',
    location: 'Indore',
    category: 'exhibitions',
    highlight: 'Chief guest Farah Khan',
    teaser: 'A lifestyle exhibition and conclave on fashion, entrepreneurship and culture.',
    body: [
      'The FICCI FLO Lifestyle Exhibition and Conclave was a celebration of fashion, entrepreneurship and cultural expression. Filmmaker and choreographer Farah Khan was chief guest, adding star power and media buzz.',
      'We planned the exhibition layout and thematic flow, set up the venue for high-profile guests and diverse exhibitors, and coordinated show flow and ceremonies across every segment.',
    ],
    scope: ['Exhibition layout', 'Venue setup', 'Show flow', 'Ceremony management'],
  },
  {
    slug: 'prabandhotsav-2022',
    title: 'Prabandhotsav 2022',
    client: 'Shri Vaishnav Institute of Management',
    location: 'Indore',
    year: '2022',
    category: 'entertainment',
    highlight: 'Finale with Indian Idol’s Rupali Jagga',
    teaser: 'The 3rd Prabandhotsav, a two-day annual festival.',
    body: [
      'Shri Vaishnav Institute of Management concluded the 3rd year of Prabandhotsav with a bang. The finale of the two-day annual event saw Indian Idol fame Rupali Jagga enthralling the audience.',
      'Team Blueneck managed the entire show.',
    ],
    scope: ['Stage and lighting', 'Artist management', 'Show flow', 'Venue management'],
  },
  {
    slug: 'sa-re-ga-ma-pa-auditions',
    title: 'Sa Re Ga Ma Pa auditions 2024',
    client: 'Zee TV',
    location: 'PAN India',
    year: '2024',
    category: 'auditions',
    highlight: '21 cities in 40 days',
    teaser: 'Pan-India auditions across 21 cities, including three major metros.',
    body: [
      'Pan-India auditions spanning 21 cities, including three major metropolitan hubs, over a fast-paced 40-day timeline.',
      'From venue finalisation to mapping the audition process, every detail was planned and executed.',
    ],
    scope: ['Venue finalisation in 21 cities', 'Audition process design', 'Participant management', 'Production support'],
  },
  {
    slug: 'indian-idol-telugu-auditions',
    title: 'Indian Idol Telugu auditions 2022',
    location: 'Hyderabad',
    year: '2022',
    category: 'auditions',
    highlight: 'Televised auditions, end to end',
    teaser: 'Complete planning and execution of a large-format televised audition.',
    body: [
      'We finalised a high-capacity venue suited to large crowds and TV production, and designed an end-to-end audition flow with dedicated zones for registration, waiting, jury and performance.',
      'We managed a massive turnout of participants from across the region, coordinated with the production crew for the main-day shoot, and handled logistics, security, hospitality and COVID compliance.',
    ],
    scope: [
      'Venue selection',
      'Audition zoning and flow',
      'Footfall management',
      'TV production coordination',
      'Security and COVID compliance',
    ],
  },
  {
    slug: 'mpca-agm-annual-awards',
    title: 'MPCA AGM and Annual Awards',
    client: 'Madhya Pradesh Cricket Association',
    category: 'sports',
    teaser: 'The association’s annual general meeting and awards ceremony.',
    body: [
      'We produced the Madhya Pradesh Cricket Association’s annual general meeting and annual awards, from the stage and seating to the awards ceremony itself.',
    ],
    scope: ['AGM staging', 'Awards ceremony', 'Seating and venue setup'],
  },
  {
    slug: 'mp-premier-league-2024',
    title: 'Madhya Pradesh Premier League 2024',
    client: 'MP Premier League — Scindia Cup',
    year: '2024',
    category: 'sports',
    highlight: 'Inaugural ceremony and auction',
    teaser: 'The league’s inaugural ceremony and player auction.',
    body: [
      'The Madhya Pradesh Premier League inaugural ceremony was hosted with spectacular fanfare. All team owners were invited, adding prestige and competitive spirit.',
      'We ran the player auction with engaging presentation and transparency, built the venue to reflect sporting excellence, and managed protocol, show flow and guest logistics.',
    ],
    scope: ['Inaugural ceremony', 'Player auction', 'Venue setup', 'Protocol and logistics'],
  },
  {
    slug: 'rakuten-symphony-family-day',
    title: 'Rakuten Symphony Family Day 2022',
    client: 'Rakuten Symphony',
    location: 'Indore',
    year: '2022',
    category: 'corporate',
    highlight: 'Carnival for employees and their families',
    teaser: 'A carnival-themed family day at Rakuten Symphony’s Indore office.',
    body: [
      'Rakuten Symphony, part of the Rakuten Group and a global product leader in mobile telecom, celebrated Family Day at its Indore office on 10 December 2022.',
      'The day invited employees’ families to experience the workplace and connect with the company’s culture, with musical and magic shows, games for children and plenty of food in a festive atmosphere.',
    ],
    scope: ['Carnival theme and décor', 'Entertainment and kids’ activities', 'Photo zones', 'Food and hospitality'],
  },
  {
    slug: 'pushp-masala-golden-jubilee',
    title: 'Pushp Masala Golden Jubilee',
    client: 'Pushp Masale',
    category: 'corporate',
    highlight: 'With brand ambassador Sonali Bendre',
    teaser: 'A golden-jubilee evening for everyone associated with the brand.',
    body: [
      'Pushp Masale, a brand that has served generations, empanelled us for its Golden Jubilee celebrations. The management invited everyone associated with the brand to mark the occasion.',
      'Blueneck Events managed the entire show and highlighted the brand through an innovative stage, timeline and photo setup. Actress and brand ambassador Sonali Bendre graced the occasion.',
    ],
    scope: ['Stage and timeline design', 'Photo setup', 'Show management', 'Celebrity coordination'],
  },
  {
    slug: 'dee-tee-golden-jubilee',
    title: 'Dee Tee Industries Golden Jubilee',
    client: 'Dee Tee Industries',
    location: 'Ahmedabad',
    category: 'corporate',
    highlight: '50 years of a tools manufacturer',
    teaser: 'The pilot-city celebration of a 50-year milestone.',
    body: [
      'Dee Tee Industries, a leading Indian manufacturer and exporter of industrial tools, celebrated its Golden Jubilee this year.',
      'We were onboarded for the pilot-city celebration in Ahmedabad, attended by top management and key associates. Every element was designed to reflect the legacy and milestone of 50 years.',
    ],
    scope: ['Event design', 'Stage and venue', 'Branded collateral and gifting', 'Guest management'],
  },
  {
    slug: 'industry-excellence-awards',
    title: 'Industry Excellence Awards 2025',
    client: 'Dainik Bhaskar',
    year: '2025',
    category: 'corporate',
    highlight: 'Felicitation by the Hon. Chief Minister',
    teaser: 'Honouring organisations driving Madhya Pradesh’s economic growth.',
    body: [
      'The Dainik Bhaskar Industry Excellence Awards 2025 celebrated leading organisations for their contribution to the economic development of Madhya Pradesh. Distinguished entrepreneurs were felicitated by Dr. Mohan Yadav, Hon. Chief Minister of Madhya Pradesh.',
      'We designed and executed a customised venue setup to match the occasion, which dignitaries and attendees appreciated.',
    ],
    scope: ['Venue and stage design', 'Awards show flow', 'Dignitary protocol'],
  },
  {
    slug: 'usicon-west-zone',
    title: 'USICON West Zone 2023',
    client: 'Urological Society of India — West Zone',
    location: 'Indore',
    year: '2023',
    category: 'conferences',
    highlight: '800–1,000 delegates over three days',
    teaser: 'An annual national medical conference with scientific sessions and a gala night.',
    body: [
      'The annual conference of USI West Zone was a three-day medical conclave drawing 800 to 1,000 delegates, with scientific sessions, social gatherings and networking.',
      'We managed registration and delegate onboarding, a venue that moved from conference to gala dinner, a gala night with entertainment, travel and hospitality, and trade management for exhibitor booths and brand zones.',
    ],
    scope: [
      'Registration management',
      'Venue setup for multiple formats',
      'Gala night',
      'Guest logistics',
      'Trade and exhibitor management',
    ],
  },
  {
    slug: 'iia-natcon-2025',
    title: 'IIA NATCON 2025',
    client: 'The Indian Institute of Architects',
    location: 'Bhopal and Indore',
    year: '2025',
    category: 'conferences',
    highlight: 'India’s largest carbon-neutral architecture event',
    teaser: '1,000+ architects and 18 speakers, with zero-plastic setups throughout.',
    body: [
      'We partnered with the Indian Institute of Architects on this pioneering green event. From zero-plastic setups to digital registrations, sustainability was at the core.',
      'Custom stalls by JK Cement and Kajaria, more than 1,000 architects and 18 acclaimed speakers brought the theme to life across Bhopal and Indore, with a cultural stop at Aarany en route.',
    ],
    scope: ['Zero-plastic venue setup', 'Digital registration', 'Stall coordination', 'Two-city logistics'],
  },
];

const imgs = images as unknown as Record<string, Img[]>;

export const cases: (CaseStudy & { images: Img[] })[] = data.map((c) => ({
  ...c,
  images: imgs[c.slug] ?? [],
}));

export const caseBySlug = (slug: string) => cases.find((c) => c.slug === slug);
export const featuredCases = cases.filter((c) => c.featured);
export const categoryLabel = (id: Category) => categories.find((c) => c.id === id)?.label ?? id;
