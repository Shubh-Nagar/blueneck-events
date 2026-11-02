/**
 * Customer-question test suite for the assistant's built-in answers.
 * Run: npm run test:assistant           (add -- --show to print every answer)
 *
 * Each case is something a real visitor might type, with the topic the assistant
 * should recognise. Add a line here whenever a visitor question is answered badly.
 */
import { localReply } from '../src/lib/assistant/local';

type Case = [question: string, intent: string | string[], mustInclude?: string[]];

const cases: Case[] = [
  // Greetings and small talk
  ['hi', 'greeting'],
  ['Hello there', 'greeting'],
  ['namaste ji', 'greeting'],
  ['good evening', 'greeting'],
  ['hii', 'greeting'],
  ['thank you so much', 'thanks'],
  ['ok thanks bye', ['thanks', 'bye']],
  ['bye', 'bye'],
  ['ok', 'ack'],
  ['yes', 'ack'],
  ['who are you?', 'bot'],
  ['are you a bot or a real person', 'bot'],

  // Company
  ['what do you do', 'about'],
  ['What services do you offer?', 'about'],
  ['how many years of experience do you have', 'experience', ['1,500+']],
  ['when was blueneck started', 'experience', ['2022']],
  ['tell me about your company', 'about'],
  ['why should i choose you over other event companies', 'why'],

  // Pricing and booking
  ['how much do you charge', 'quote'],
  ['What is the cost of a wedding for 300 guests?', 'quote'],
  ['wedding ka kitna kharcha hoga', 'quote'],
  ['i have a budget of 5 lakh for a corporate party, possible?', 'quote', ['5 lakh']],
  ['can I book you for 15th December', ['availability', 'quote']],
  ['are you available on 20 jan 2027?', 'availability'],
  ['do you have dates free in february', 'availability'],
  ['I want a quotation', 'quote'],
  ['what is your minimum budget', 'quote'],
  ['payment terms? advance kitna dena hoga', 'payment'],
  ['what is your cancellation policy', 'payment'],

  // Contact
  ['give me your phone number', 'contact', ['+91']],
  ['whatsapp number?', 'contact'],
  ['email id please', 'contact', ['@']],
  ['I want to talk to a human', 'contact'],
  ['can someone call me back', 'contact'],
  ['where is your office', 'location', ['Indore']],
  ['are you in mumbai?', 'location'],
  ['do you do events outside indore', 'location', ['PAN India']],
  ['can you do an event in Dubai', 'location'],

  // Weddings
  ['I am planning my wedding', 'weddings'],
  ['do you do destination weddings in udaipur', 'weddings', ['we travel']],
  ['shaadi planning karte ho?', 'weddings'],
  ['sangeet and haldi decor', 'weddings'],
  ['my sisters wedding is in march, need full planning', 'weddings'],
  ['engagement ceremony', 'weddings'],
  ['wedding planner near me', 'weddings'],

  // Private and other celebrations (not a listed service)
  ['do you organise birthday parties', 'private'],
  ['anniversary party for my parents', 'private'],
  ['baby shower', 'private'],
  ['college fest', ['entertainment', 'private']],
  ['farewell party for office', ['corporate', 'private']],

  // Corporate
  ['we need an annual day for our company', 'corporate'],
  ['dealer meet for 500 people', 'corporate', ['Kapil Dev']],
  ['corporate offsite in goa', 'corporate'],
  ['team building activities', 'corporate'],
  ['award night for employees', 'corporate'],
  ['product launch event', 'activations'],
  ['new showroom opening', 'activations'],

  // Medical, conferences
  ['we are organising a medical conference next year', 'medical'],
  ['can you manage our national CME', 'medical'],
  ['doctors conference in indore 800 delegates', 'medical'],
  ['urology conference', 'medical'],
  ['Do you handle delegate registration?', 'medical'],
  ['business conference', 'conferences'],
  ['seminar for 200 people', 'conferences'],

  // Other services
  ['can you get a celebrity for our event', 'entertainment'],
  ['arijit singh concert', 'entertainment'],
  ['live music for a party', 'entertainment'],
  ['cricket tournament opening ceremony', 'sports'],
  ['exhibition stall design', 'exhibitions'],
  ['trade fair management', 'exhibitions'],
  ['government event', 'government'],
  ['talent hunt auditions', 'auditions'],

  // What we provide
  ['do you provide catering', 'vendors'],
  ['do you arrange venues?', 'vendors'],
  ['can you suggest a good venue in indore', 'vendors', ['venue scouting']],
  ['do you do decoration', 'vendors'],
  ['sound and lighting', 'vendors'],
  ['photographer and videographer', 'vendors'],
  ['hotel bookings for guests', 'vendors'],
  ['how does the process work', 'process'],
  ['how early should I book', 'process'],
  ['what is the biggest event you have done', 'scale', ['80,000']],
  ['can you handle 10000 people', 'scale'],

  // Work and clients
  ['show me your past events', 'work'],
  ['portfolio', 'work'],
  ['who are your clients', 'clients', ['Zee Entertainment']],
  ['have you worked with apple', 'case'],
  ['tell me about bhaskar utsav', 'case', ['25,000']],
  ['plast pack', 'case'],
  ['sa re ga ma pa', 'case'],
  ['what was MP premier league', 'case'],
  ['NSICON 2025', 'medical', ['Yes, we managed **NSICON 2025**']],
  ['reviews or testimonials?', 'reviews'],

  // Team and careers
  ['who is the owner', 'team'],
  ['who is radhika pawar', 'team', ['Radhika Pawar**, Director']],
  ['are you hiring', 'careers'],
  ['internship for event management students', 'careers'],
  ['I want to work with you', 'careers'],
  ['I am a decor vendor, want to partner', 'partner'],
  ['we are a sound company, can we collaborate', 'partner'],

  // Off-topic, complaints and noise
  ['what is the weather today', 'offtopic'],
  ['write me a python script', 'offtopic'],
  ['your last event was badly managed', 'complaint'],
  ['I have a complaint', 'complaint'],
  ['asdfgh', 'fallback'],
  ['?', 'fallback'],

  // Unseen-question rounds: written before tuning, answered badly, fixed, kept here.
  ["Hey! Planning my daughter’s wedding in Indore next November, around 600 guests", 'weddings'],
  ["what r ur charges for sangeet night", 'quote'],
  ["Do you guys do mehndi functions?", 'weddings'],
  ["need a quote for a 2 day conference for 300 doctors in bhopal", 'quote'],
  ["can u manage the registration desk for our ENT conference", 'medical'],
  ["our company wants to celebrate 25 years", 'corporate'],
  ["looking for an event management company for our annual function", 'corporate'],
  ["we want kapil dev at our event", 'case', ['**Kapil Dev** featured']],
  ["How do I contact you?", 'contact'],
  ["mob no?", 'contact'],
  ["Send me your brochure", 'contact'],
  ["are u open on sunday", 'contact'],
  ["is the office open today", 'contact'],
  ["how far are you from vijay nagar", 'location'],
  ["do you work in ujjain", 'location'],
  ["Do you plan events in Gujarat?", 'location'],
  ["whats the difference between you and a wedding planner", 'weddings'],
  ["Is GST included in your price?", 'payment'],
  ["do you take card payments", 'payment'],
  ["can I see photos of your weddings", 'weddings'],
  ["show pics of past events", 'work'],
  ["what did you do for zomato", 'clients'],
  ["did you organise the modi event in indore", 'case'],
  ["rambo circus", 'case'],
  ["credai", 'case'],
  ["Do you do school annual functions?", 'corporate'],
  ["kids birthday party with magician", 'private'],
  ["mata ki chowki", 'private'],
  ["religious event / jagran", 'private'],
  ["political rally management", 'government'],
  ["who handles the event on the day", 'process'],
  ["will someone be there on the day of the event?", 'process'],
  ["can you do it in 2 weeks? urgent", 'process'],
  ["can you organise an event for 50 people", 'size'],
  ["small intimate wedding 50 guests", 'weddings'],
  ["main shaadi ke liye baat karna chahta hoon", 'contact'],
  ["aapka office kahan hai", 'location'],
  ["kya aap birthday party karte ho", 'private'],
  ["mujhe job chahiye", 'careers'],
  ["salary for event manager", 'careers'],
  ["I want to sponsor an event", 'partner'],
  ["can you help me find a DJ", 'vendors'],
  ["wedding photographer chahiye", 'weddings'],
  ["lol", 'ack'],
  ["you are useless", 'frustrated'],
  ["Can you plan a cocktail party for our wedding guests?", ['weddings']],
  ["What all is included in your wedding package", ['quote', 'weddings']],
  ["I need someone to manage 3 days of wedding functions in Jaipur", ['weddings']],
  ["do you have experience with medical conferences?", ['medical']],
  ["we are the organising committee of a state level pediatric conference", ['medical']],
  ["need help with an awards ceremony for our dealers", ['corporate']],
  ["Can you do the stage and lights for our college annual day", ['vendors', 'corporate', 'entertainment']],
  ["what is the price range", ['quote']],
  ["ballpark figure for 200 people corporate dinner", ['quote']],
  ["do you charge a fixed fee or percentage?", ['quote']],
  ["how do i book?", ['process', 'quote']],
  ["whats the next step", ['process']],
  ["I filled the form, when will someone reply?", ['contact', 'process']],
  ["Is there a number I can whatsapp", ['contact']],
  ["give me radhika maam number", ['contact']],
  ["Who is Hitesh?", ['team']],
  ["how big is your team", ['team']],
  ["have you done any events for the government", ['government']],
  ["did you manage the PM modi event", ['case']],
  ["Plast pack expo details", ['case']],
  ["what happened at prabandhotsav", ['case']],
  ["do you do events in Nepal?", ['location']],
  ["are you registered company", ['experience', 'about']],
  ["Do you have insurance for events?", ['fallback', 'contact', 'process']],
  ["can you arrange flower decoration", ['vendors']],
  ["i want a theme party", ['private']],
  ["sweet 16 party", ['private']],
  ["corporate gifting", ['corporate']],
  ["virtual event / webinar", ['conferences', 'fallback']],
  ["hello, I need help", ['greeting']],
];

// Conversations: the follow-up should remember the event mentioned earlier.
const conversations: [earlier: string[], question: string, intent: string, mustInclude: string[]][] = [
  [['planning my sisters wedding in udaipur'], 'Get a quote', 'quote', ['Every wedding']],
  [['we are organising a neurology conference'], 'how early should I book?', 'process', ['on a medical conference']],
  [['dealer meet for 500 people', 'thanks'], 'are you available on 12 march', 'availability', ['for a corporate event']],
  [['I want a birthday party'], 'do you do decoration', 'vendors', ['for a private celebration']],
  // A new topic in the question wins over the remembered one.
  [['planning my wedding'], 'cost of a product launch', 'quote', ['Every launch']],
];
const show = process.argv.includes('--show');
let pass = 0;
const failures: string[] = [];

for (const [q, want, must = []] of cases) {
  const r = localReply(q);
  const wants = Array.isArray(want) ? want : [want];
  const okIntent = wants.includes(r.intent ?? '');
  const missing = must.filter((m) => !r.text.includes(m));
  if (okIntent && !missing.length) pass++;
  else failures.push(`✗ "${q}"\n    expected ${wants.join('|')}, got ${r.intent}${missing.length ? `; missing ${missing.join(', ')}` : ''}`);
  if (show) console.log(`\n» ${q}  [${r.intent}]\n${r.text}\n  chips: ${(r.chips ?? []).join(' | ')}`);
}

for (const [earlier, q, want, must] of conversations) {
  const r = localReply(q, earlier);
  const missing = must.filter((m) => !r.text.includes(m));
  if (r.intent === want && !missing.length) pass++;
  else failures.push(`✗ "${earlier.join(' → ')} → ${q}"\n    expected ${want}, got ${r.intent}${missing.length ? `; missing ${missing.join(', ')}` : ''}`);
}

console.log(failures.join('\n'));
console.log(`\n${pass}/${cases.length + conversations.length} passed`);
if (failures.length) process.exit(1);
