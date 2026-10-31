import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Page from '../components/ui/Page';
import Heading from '../components/ui/Heading';
import ContactForm from '../components/contact/ContactForm';
import { contact } from '../data/site';
import { ease } from '../lib/motion';

export default function Contact() {
  const [params] = useSearchParams();
  const reduce = useReducedMotion();
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&z=12&output=embed`;

  return (
    <Page title="Contact">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F9FD] to-white pb-24 pt-32 sm:pb-32 sm:pt-40">
        {/* Slow-turning outlines at the edges. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.span
            className="absolute -left-16 top-28 h-56 w-56 rounded-full border-[1.5px] border-dashed border-cobalt/20"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="absolute bottom-10 left-1/2 h-10 w-10 rounded-full border-[1.5px] border-dashed border-cobalt/30"
            animate={reduce ? undefined : { rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <span className="tile absolute right-[6%] top-24 h-3 w-3 bg-sky/60" />
        </div>

        <div className="shell relative grid items-start gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading level={1} align="left" lead="Plan an event" accent="with us">
              A ceremony, a launch, a conference or a wedding. Share what you know so far and we will take it from there.
            </Heading>

            <motion.dl
              className="mt-14 grid gap-8 sm:grid-cols-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.8, ease } }}
            >
              <Detail icon={<PinIcon />} label="Studio">
                {contact.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </Detail>
              <Detail icon={<GlobeIcon />} label="Where we work">
                Across India, from Indore and Bhopal to Hyderabad and Ahmedabad.
              </Detail>
              {contact.email && (
                <Detail icon={<MailIcon />} label="Email">
                  <a href={`mailto:${contact.email}`} className="link-draw">
                    {contact.email}
                  </a>
                </Detail>
              )}
              {contact.phone && (
                <Detail icon={<PhoneIcon />} label="Phone">
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="link-draw">
                    {contact.phone}
                  </a>
                </Detail>
              )}
              {contact.whatsapp && (
                <Detail icon={<PhoneIcon />} label="WhatsApp">
                  <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="link-draw">
                    Message us on WhatsApp
                  </a>
                </Detail>
              )}
            </motion.dl>

            <motion.div
              className="mt-12 overflow-hidden rounded-[1.5rem] shadow-[0_20px_50px_-30px_rgba(8,22,41,0.45)] ring-1 ring-ink/5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8, ease } }}
            >
              <iframe
                title={`Map of ${contact.mapQuery}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-[16/10] w-full [filter:saturate(0.6)_hue-rotate(-10deg)]"
              />
            </motion.div>
          </div>

          <motion.div
            className="relative rounded-[2rem] bg-white p-6 shadow-[0_40px_90px_-40px_rgba(8,22,41,0.45)] ring-1 ring-ink/5 sm:p-10 lg:col-span-6 lg:col-start-7"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.3, duration: 0.9, ease } }}
          >
            <span aria-hidden className="tile absolute -right-3 -top-3 h-8 w-8 bg-gradient-to-br from-sky to-navy" />
            <ContactForm initialType={params.get('type') ?? ''} />
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

function Detail({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-body-sm font-bold text-ink">
        <span className="text-cobalt">{icon}</span>
        {label}
      </dt>
      <dd className="mt-2 pl-6 text-body-sm leading-relaxed text-ink/65">{children}</dd>
    </div>
  );
}

const iconCls = 'h-4 w-4';
const PinIcon = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path
      d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
      strokeLinejoin="round"
    />
  </svg>
);
