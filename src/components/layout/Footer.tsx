import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { company, contact, services } from '../../data/site';
import { ease } from '../../lib/motion';

/** A soft gradient card that closes every page: the line, the links, the ways to reach us. */
export default function Footer() {
  const year = new Date().getFullYear();
  const social = [
    { href: contact.instagram, label: 'Instagram', icon: <InstagramIcon /> },
    { href: contact.linkedin, label: 'LinkedIn', icon: <LinkedInIcon /> },
    { href: contact.facebook, label: 'Facebook', icon: <FacebookIcon /> },
    { href: contact.youtube, label: 'YouTube', icon: <YouTubeIcon /> },
    { href: contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : '', label: 'WhatsApp', icon: <WhatsAppIcon /> },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[#F7F9FC] px-4 pb-6 pt-12 md:px-8">
      <motion.div
        className="relative mx-auto max-w-[95rem] overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-[#F1F6FC] to-ice/60 px-6 py-14 ring-1 ring-ink/5 sm:px-12 md:rounded-[3rem] md:py-20 lg:px-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(117,166,216,0.35),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(83,125,190,0.25),transparent_70%)]"
        />

        <div className="relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-display text-[clamp(2.2rem,1.2rem+2.6vw,4rem)] leading-[1.02] text-ink">
              From ground&#8209;breakings
              <br />
              <span className="text-shine font-semibold">to grand finales.</span>
            </p>
            <span aria-hidden className="mt-8 block h-[2px] w-16 rounded-full bg-cobalt/60" />
            <p className="mt-6 font-display text-[1.6rem] text-ink">
              Catch up <em className="text-cobalt">with us.</em>
            </p>
            {social.length > 0 && (
              <ul className="mt-8 flex gap-3">
                {social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_20px_-10px_rgba(8,22,41,0.35)] transition-[background-color,color,transform] duration-300 hover:-translate-y-1 hover:bg-navy hover:text-white"
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            <div>
              <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-cobalt">Studio</h2>
              <ul className="mt-5 space-y-3 text-body-sm">
                {[
                  ['/about', 'Our story'],
                  ['/expertise', 'Expertise'],
                  ['/work', 'Work'],
                  ['/careers', 'Careers'],
                  ['/contact', 'Contact'],
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="link-draw text-ink/70 hover:text-ink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-cobalt">Expertise</h2>
              <ul className="mt-5 space-y-3 text-body-sm">
                {services.slice(0, 6).map((s) => (
                  <li key={s.slug}>
                    <Link to={`/expertise#${s.slug}`} className="link-draw text-ink/70 hover:text-ink">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-cobalt">Reach us</h2>
              <ul className="mt-5 space-y-3 text-body-sm text-ink/70">
                {contact.addressLines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="link-draw hover:text-ink">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="link-draw hover:text-ink">
                      {contact.phone}
                    </a>
                  </li>
                )}
                <li>
                  <Link to="/contact" className="link-draw font-semibold text-navy">
                    Plan an event →
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </motion.div>

      <div className="mx-auto mt-6 flex max-w-[95rem] flex-col items-start justify-between gap-3 px-2 text-[0.8rem] text-ink/45 sm:flex-row sm:items-center md:px-6">
        <Logo tone="dark" className="origin-left scale-[0.8]" />
        <p>
          © {year} {company.legalName}. Event photography from our own productions.
        </p>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm7 0h3.8v1.6h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12v5.33h-4v-4.73c0-1.13-.02-2.58-1.57-2.58-1.57 0-1.81 1.23-1.81 2.5v4.81h-4v-11Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.45A21 21 0 0 0 14.3 4.3c-2.3 0-3.8 1.4-3.8 3.95v2.25H7.9v3h2.6V21h3Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.1L3.5 20.5Z" strokeLinejoin="round" />
      <path d="M9 9.5c.5 2.2 2.3 4 4.5 4.5l1.2-1.2 2 1-.4 1.6c-3.8.4-8.2-4-7.8-7.8l1.6-.4 1 2L9 9.5Z" strokeLinejoin="round" />
    </svg>
  );
}
