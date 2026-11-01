/**
 * Medical conferences page. Copy and figures are taken from the Blueneck
 * "Medical Conferences" pitch deck; photographs come from the BEPL medical
 * conference expertise deck and live in /public/images/medical/.
 */
import photos from './medical.images.json';
import type { Img } from './site';

export const medicalImages = photos as Record<keyof typeof photos, Img>;
const p = medicalImages;

export const medicalHero = {
  eyebrow: 'Medical conferences · CMEs · Scientific meetings',
  title: ['The science stays', 'centre stage.'],
  sub: 'Everything else simply works.',
  cover: p.cover,
};

export const medicalStats = [
  { figure: '17', label: 'Medical conferences since 2022' },
  { figure: '15', label: 'Medical specialties' },
  { figure: '16', label: 'National, zonal and state bodies served' },
  { figure: '5', label: 'Consecutive years of medical conferences' },
];

export const medicalServices = [
  { name: 'Registration', img: p['nsicon-2025-registration'], text: 'Dedicated helpline, daily updates, audit sheets, onsite QR registration.' },
  { name: 'Scientific and abstracts', img: p['soncon-2024-eposter'], text: 'Faculty lists and invites, abstract guidelines, submissions and acceptances.' },
  { name: 'Design', img: p['arsicon-2024-kits'], text: 'Logo, brochures, souvenir, certificates, badges and venue branding.' },
  { name: 'Hall management', img: p['nsicon-2025-plenary'], text: 'A console lead in every hall, plus stage and backstage for ceremonies.' },
  { name: 'Venue management', img: p['wzusicon-2026-hall-a'], text: 'Blueprint and layout, a BNE member in every zone, on site a day early.' },
  { name: 'Trade management', img: p['nsicon-2025-trade'], text: 'One contact for every exhibitor, from stall allotment to the last day.' },
  { name: 'Hospitality and logistics', img: p['wzusicon-2023-palace'], text: 'A senior at each hotel; airport-to-airport care for OC guests.' },
  { name: 'Food and beverage', img: p['wzusicon-2023-dining'], text: 'QR badge scans at every meal for an exact plate count.' },
];

export type Role = 'lead' | 'shared' | 'oc';
export const roles: { area: string; role: Role; how: string }[] = [
  { area: 'Delegate registration', role: 'lead', how: 'Full list shared with the OC every day' },
  {
    area: 'Scientific programme and faculty',
    role: 'oc',
    how: 'Faculty lists set with the Scientific Committee; one contact for all faculty',
  },
  { area: 'Faculty travel and stay', role: 'shared', how: 'A senior at each hotel; airport-to-airport guest care' },
  { area: 'Trade participation', role: 'shared', how: 'One contact for every exhibitor; nothing sent without OC approval' },
  { area: 'Design and literature', role: 'shared', how: 'We design every item; the OC provides content' },
  { area: 'Venue and vendors', role: 'lead', how: 'OC signs and pays vendors; we supervise every one' },
  { area: 'Registration and sponsorship funds', role: 'oc', how: 'Payments go directly to the OC' },
];

export const roleLabel: Record<Role, string> = { lead: 'We lead', shared: 'Shared', oc: 'OC decides' };

/** Seventeen congresses, by year. All in Indore unless a city is given. */
export const portfolio: { year: string; events: { name: string; specialty: string; city?: string }[] }[] = [
  {
    year: '2022',
    events: [
      { name: 'RESPICON', specialty: 'Respiratory' },
      { name: 'SONO SUMMIT', specialty: 'Radiology' },
      { name: 'IPS GSB', specialty: 'Psychiatry' },
    ],
  },
  { year: '2023', events: [{ name: 'WZUSICON', specialty: 'Urology' }] },
  {
    year: '2024',
    events: [
      { name: 'ARSICON', specialty: 'Rhinoplasty' },
      { name: 'ATVSICON', specialty: 'Thoracic and vascular' },
      { name: 'NEOCON', specialty: 'Neonatology' },
      { name: 'SONCON', specialty: 'Neurology', city: 'Ujjain' },
    ],
  },
  {
    year: '2025',
    events: [
      { name: 'NSICON', specialty: 'Neurology' },
      { name: 'NCPR', specialty: 'Paediatric rheumatology' },
      { name: 'MPENTCON', specialty: 'ENT' },
      { name: 'ISPR', specialty: 'Paediatric radiology' },
      { name: 'ISNWZ', specialty: 'Nephrology' },
    ],
  },
  {
    year: '2026',
    events: [
      { name: 'USCON', specialty: 'Ultrasound' },
      { name: 'WZUSICON', specialty: 'Urology', city: 'Goa' },
      { name: 'ICAAICON', specialty: 'Allergy and immunology' },
      { name: 'RSACPCON', specialty: 'Anaesthesiology' },
    ],
  },
];

export type Signature = {
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string[];
  stats: { figure: string; label: string }[];
  source: string;
  /** Photographs for the auto-playing slideshow beside the story. */
  photos: { img: Img; caption: string }[];
  caseSlug?: string;
};

export const signatures: Signature[] = [
  {
    eyebrow: 'Signature case study 01',
    title: 'NSICON 2025',
    subtitle: '73rd Annual National Conference of the Neurological Society of India',
    body: [
      'Over 13 months, our longest engagement to date, Blueneck ran the conference end to end: registration, scientific sessions, workshops, look and feel, guest hospitality, logistics, entertainment and gifting.',
      'A core team of 6 professionals and 50 managers also delivered 3 entertainment nights and a public awareness Neurothon.',
    ],
    stats: [
      { figure: '1,700', label: 'Delegates' },
      { figure: '5', label: 'Days' },
      { figure: '8', label: 'Halls' },
      { figure: '8', label: 'Workshops' },
      { figure: '90', label: 'Trade stalls' },
      { figure: '12', label: 'Hotels' },
      { figure: '3,750', label: 'Room nights' },
      { figure: '3', label: 'Entertainment nights' },
    ],
    source: 'Indore, 10–14 December 2025',
    photos: [
      { img: p['nsicon-2025-plenary'], caption: 'The plenary hall, dressed in the NSICON look' },
      { img: p['nsicon-2025-arch'], caption: 'Entrance arch' },
      { img: p['nsicon-2025-lamp'], caption: 'Lamp lighting at the inaugural' },
      { img: p['nsicon-2025-registration'], caption: 'Delegate and spot registration counters' },
      { img: p['nsicon-2025-avenue'], caption: 'Branded avenue to the venue' },
      { img: p['nsicon-2025-delegates'], caption: 'A full house for the scientific sessions' },
      { img: p['nsicon-2025-trade'], caption: 'Trade corridor, 90 stalls' },
      { img: p['nsicon-2025-inaugural'], caption: 'Dignitaries on the inaugural stage' },
      { img: p['nsicon-2025-welcome'], caption: 'An Indore welcome at the gate' },
      { img: p['nsicon-2025-stall'], caption: 'Exhibitor stall in the trade hall' },
      { img: p['nsicon-2025-hall'], caption: 'One of eight halls in session' },
      { img: p['nsicon-2025-faculty'], caption: 'Faculty and organising committee' },
    ],
  },
  {
    eyebrow: 'Signature case study 02',
    title: 'WZUSICON 2026, Goa',
    subtitle: '36th Annual Conference of the Urological Society of India – West Zone',
    body: [
      'Nine months of planning and four days on ground, at the Goa Marriott. Blueneck ran the conference end to end: registration, scientific halls, exhibition, look and feel, guest hospitality, logistics and every evening engagement.',
      'The conference marks a continuing association with USI – West Zone, following WZUSICON 2023.',
    ],
    stats: [
      { figure: '9', label: 'Months of planning' },
      { figure: '4', label: 'Days on ground' },
      { figure: '36th', label: 'Annual conference' },
      { figure: '4', label: 'Evening engagements' },
    ],
    source: 'Goa Marriott, 8–11 October 2026',
    photos: [
      { img: p['wzusicon-2026-title'], caption: 'WZUSICON 2026, Goa' },
      { img: p['wzusicon-2026-lamp'], caption: 'Lamp lighting at the inauguration' },
      { img: p['wzusicon-2026-lawns'], caption: 'Lawns set for the sundowner' },
      { img: p['wzusicon-2026-plenary'], caption: 'Panel in the plenary hall' },
      { img: p['wzusicon-2026-carnival'], caption: 'Red and Black carnival night' },
      { img: p['wzusicon-2026-hall-a'], caption: 'Hall A, in the Goa signage system' },
      { img: p['wzusicon-2026-sundowner'], caption: 'Sundowner stage after dark' },
      { img: p['wzusicon-2026-trade'], caption: 'Exhibition and sponsor stalls' },
      { img: p['wzusicon-2026-beach-stage'], caption: 'A beach-themed photo stage on the lawns' },
      { img: p['wzusicon-2026-session'], caption: 'An off-script conversation session' },
      { img: p['wzusicon-2026-bar'], caption: 'Evening bar for delegates' },
      { img: p['wzusicon-2026-photo-booth'], caption: 'Goa photo booth' },
    ],
  },
  {
    eyebrow: 'Signature case study 03',
    title: 'WZUSICON 2023',
    subtitle: '33rd Annual Conference of the Urological Society of India, West Zone',
    body: [
      'Three days at the Sheraton Grand Palace, Indore, laid out as one campus of nine zones: registration and selfie zone, three halls, exhibition, dining, workshops in the hotel garden and a gala night on the Palace Lawns.',
      'We delivered swift registration and onboarding, venue set-up from halls to gala dinners, travel and hospitality, and exhibitor onboarding, booths and brand zones. Javed Ali closed the gala on the Palace Lawns.',
    ],
    stats: [
      { figure: '3', label: 'Days' },
      { figure: '800–1,000', label: 'Delegates' },
      { figure: '9', label: 'Venue zones' },
    ],
    source: 'Sheraton Grand Palace, Indore, 6–8 October 2023',
    photos: [
      { img: p['wzusicon-2023-arch'], caption: 'WZUSICON 2023 at the Sheraton Grand Palace' },
      { img: p['wzusicon-2023-hall'], caption: 'Hall A in session' },
      { img: p['wzusicon-2023-gala'], caption: 'Javed Ali live on the Palace Lawns' },
      { img: p['wzusicon-2023-palace'], caption: 'The palace front, lit for the conference' },
      { img: p['wzusicon-2023-exhibition'], caption: 'Trade exhibition in the ballrooms' },
      { img: p['wzusicon-2023-memory-lane'], caption: 'A trip down memory lane' },
      { img: p['wzusicon-2023-dining'], caption: 'Garden dining under the canopy' },
      { img: p['wzusicon-2023-lawn-stage'], caption: 'Evening stage on the lawns' },
      { img: p['wzusicon-2023-crowd'], caption: 'Delegates at the gala concert' },
      { img: p['wzusicon-2023-spouses'], caption: 'Spouse programme' },
      { img: p['wzusicon-2023-outing'], caption: 'City outing in Indore' },
      { img: p['wzusicon-2023-javed-ali'], caption: 'Gala night finale' },
    ],
    caseSlug: 'usicon-west-zone',
  },
];

/** Photo wall: one frame per conference we have pictures of. */
export const medicalGallery: { img: Img; caption: string }[] = [
  { img: p['wzusicon-2023-arch'], caption: 'WZUSICON 2023 · Indore' },
  { img: p['soncon-2024-hall'], caption: 'SONCON 2024 · Ujjain' },
  { img: p['neocon-2024-stage'], caption: 'NEOCON 2024 · inaugural' },
  { img: p['arsicon-2024-stage'], caption: 'ARSICON 2024 · live surgical workshop' },
  { img: p['wzusicon-2023-trade'], caption: 'WZUSICON 2023 · trade exhibition' },
  { img: p['soncon-2024-eposter'], caption: 'SONCON 2024 · e-poster station' },
  { img: p['respicon-2022-venue'], caption: 'RESPICON Midterm 2022' },
  { img: p['neocon-2024-registration'], caption: 'NEOCON 2024 · registration hall' },
  { img: p['sono-summit-2022-arch'], caption: 'SONO SUMMIT 2022 · entry arch' },
  { img: p['atvsicon-2024-hall'], caption: 'ATVSICON 2024 · scientific hall' },
  { img: p['ips-gsb-2022-hall'], caption: 'IPS Gujarat 2022 · gala hall' },
  { img: p['wzusicon-2023-dining'], caption: 'WZUSICON 2023 · garden dining' },
  { img: p['arsicon-2024-kits'], caption: 'ARSICON 2024 · delegate kits' },
  { img: p['soncon-2024-lamp'], caption: 'SONCON 2024 · lamp lighting' },
  { img: p['sono-summit-2022-trade'], caption: 'SONO SUMMIT 2022 · equipment trade' },
  { img: p['respicon-2022-registration'], caption: 'RESPICON 2022 · numbered counters' },
  { img: p['neocon-2024-arch'], caption: 'NEOCON 2024 · MGM Medical College' },
  { img: p['wzusicon-2023-outing'], caption: 'WZUSICON 2023 · city outing' },
];

export const stages = [
  { name: 'Align', text: 'Meet the OC and assign a senior and a junior lead.', img: p['neocon-2024-stage'] },
  { name: 'Build the lists', text: 'Delegates, faculty, trade prospects and correspondence.', img: p['respicon-2022-stage'] },
  { name: 'Open registration', text: 'Numbered forms, e-receipts and SMS, a daily list to the OC.', img: p['respicon-2022-registration'] },
  { name: 'Design identity', text: 'Logo, forms, booklets, badges, certificates, branding.', img: p['arsicon-2024-kits'] },
  { name: 'Plan the venue', text: 'Zones, hall layouts, stalls, stage seating, vendors.', img: p['wzusicon-2023-palace'] },
  { name: 'Run the show', text: 'A head for every segment; all set before doors open.', img: p['soncon-2024-hall'] },
];

export const bodies = {
  served: [
    { name: 'Urological Society of India', note: 'West Zone' },
    { name: 'Indian Radiological & Imaging Association' },
    { name: 'National Neonatology Forum', note: 'Indore Branch' },
    { name: 'IAP National Respiratory Chapter' },
    { name: 'Indian Psychiatric Society', note: 'Gujarat' },
    { name: 'Association of Rhinoplasty Surgeons (India)' },
    { name: 'ATVSI Indore & ASI City Chapter' },
    { name: 'Neuro Societies of Indore & Ujjain' },
  ],
  recent: [
    'Indian Federation of Ultrasound in Medicine & Biology',
    'Indian College of Allergy, Asthma & Applied Immunology',
    'Research Society of Anaesthesiology Clinical Pharmacology',
    'Neurological Society of India',
    'Paediatric Rheumatology · NCPR',
    'AOI · MP Chapter',
    'Indian Society of Pediatric Radiology',
    'Indian Society of Nephrology · West Zone',
  ],
};

export const risks = [
  ['Registration errors', 'A number on every form, every entry recorded, daily reconciliation with the OC'],
  ['Vendor delays', 'One supervisor accountable for every vendor, whoever hired them'],
  ['Lost delegates, crowded halls', 'Zoned venue plans and way-finding at every turn'],
  ['Dignitary protocol', 'Experience with ministers and the Chief Minister on stage'],
  ['Crowd safety', 'Crowd-management systems proven at 25,000+'],
  ['Last-minute changes', 'Built into our scope: solutions on the spot, additions absorbed'],
  ['Health compliance', 'COVID-compliant large-crowd operations in 2022'],
] as const;

export const commitments = [
  { name: 'A senior and a junior lead', text: 'From the day you sign' },
  { name: 'Daily updates', text: 'To the OC, without fail' },
  { name: 'Every vendor supervised', text: 'Whoever hired them' },
  { name: 'Your funds stay with you', text: 'Registration and sponsorship payments go directly to the OC' },
];

/** Contact on the pitch deck's closing slide. */
export const medicalContact = {
  name: 'Radhika Pawar',
  role: 'Director, Blueneck Events Pvt. Ltd.',
  phone: '+91 99260 00545',
  email: 'radhika@bluenecks.in',
  address: '405, 5th Floor, Sapphire Twins, Opp. C21 Mall, Above Moti Mahal, Scheme No. 54, AB Road, Indore (MP) 452010',
};
