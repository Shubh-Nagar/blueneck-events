/**
 * Everything the assistant knows, built from the same data files the site renders.
 * Edit src/data/*.ts and the assistant updates with it. No DOM access here: this
 * module is also bundled into the /api/chat edge function.
 */
import { company, contact, services, directors, scale, careers, clients } from '../../data/site';
import { cases, categories, categoryLabel } from '../../data/work';
import { medicalStats, medicalServices, portfolio, bodies, commitments, medicalContact } from '../../data/medical';

/** Best contact we have: the site-wide one if filled in, else the director's from the medical deck. */
export const enquiry = {
  name: contact.email || contact.phone ? '' : medicalContact.name,
  role: contact.email || contact.phone ? '' : medicalContact.role,
  /** Opening line pre-filled when a visitor starts a WhatsApp chat. */
  whatsappGreeting: 'Hi Blueneck Events! I found you on your website and would like to talk about an event.',
  phone: contact.phone || medicalContact.phone,
  email: contact.email || medicalContact.email,
  whatsapp: contact.whatsapp,
  address: medicalContact.address,
};

/** Internal pages the assistant may link to. */
export const pages = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Our story (company and directors)' },
  { to: '/expertise', label: 'Expertise (all service lines)' },
  { to: '/work', label: 'Work (all productions, filterable)' },
  { to: '/work/medical-conferences', label: 'Medical conferences' },
  { to: '/contact', label: 'Plan an event (enquiry form)' },
  { to: '/careers', label: 'Careers' },
];

export function buildKnowledge(): string {
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(`# ${company.legalName}`, company.about, `Formats: ${company.tagline.join(' | ')}.`, '');

  push('## Contact');
  if (enquiry.name) push(`Enquiries: ${enquiry.name}, ${enquiry.role}`);
  push(`Phone: ${enquiry.phone}`, `Email: ${enquiry.email}`);
  if (enquiry.whatsapp) push(`WhatsApp: +${enquiry.whatsapp}`);
  push(`Office: ${enquiry.address}`, 'Enquiry form: /contact', '');

  push('## Site pages');
  pages.forEach((p) => push(`- ${p.to}: ${p.label}`));
  categories.forEach((c) => push(`- /work?type=${c.id}: ${c.label} productions`));
  push('');

  push('## Services');
  services.forEach((s) => push(`- ${s.name} (/expertise#${s.slug}): ${s.summary}`));
  push('');

  push('## Scale');
  scale.forEach((s) => push(`- ${s.figure} ${s.label}`));
  push('');

  push('## Directors');
  directors.forEach((d) => push(`- ${d.name}, ${d.role}: ${d.bio[0]}`));
  push('');

  push('## Productions (case studies, each at /work/<slug>)');
  cases.forEach((c) => {
    const meta = [c.client, c.location, c.year].filter(Boolean).join(', ');
    push(`- ${c.title} [/work/${c.slug}] (${categoryLabel(c.category)}${meta ? `; ${meta}` : ''}): ${c.teaser} Scope: ${c.scope.join('; ')}.`);
  });
  push('');

  push('## Medical conferences (/work/medical-conferences)');
  medicalStats.forEach((s) => push(`- ${s.figure}: ${s.label}`));
  portfolio.forEach((y) =>
    push(`- ${y.year}: ${y.events.map((e) => `${e.name} (${e.specialty}${e.city ? `, ${e.city}` : ''})`).join(', ')}`),
  );
  push(`Services: ${medicalServices.map((s) => `${s.name}: ${s.text}`).join(' ')}`);
  push(`Bodies served: ${[...bodies.served.map((b) => b.name), ...bodies.recent].join('; ')}.`);
  push(`Commitments: ${commitments.map((c) => `${c.name} (${c.text})`).join('; ')}.`);
  push('');

  push('## Clients (selection)');
  push(clients.map((c) => c.name).filter(Boolean).join(', '));
  push('');

  push('## Careers (/careers)');
  push(
    careers.openings.length
      ? careers.openings.map((o) => `- ${o.title} (${o.team}, ${o.location}, ${o.type})`).join('\n')
      : 'No advertised openings right now; open applications are welcome through the form on /careers.',
  );
  push(`Teams: ${careers.teams.map((t) => t.name).join('; ')}.`);

  return lines.join('\n');
}

/** Link that opens a WhatsApp chat with the team, greeting pre-filled. Empty if no number is set. */
export const whatsappHref = (text: string = enquiry.whatsappGreeting) =>
  enquiry.whatsapp ? `https://wa.me/${enquiry.whatsapp}?text=${encodeURIComponent(text)}` : '';
