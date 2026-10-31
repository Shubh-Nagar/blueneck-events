import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { testimonials } from '../../data/site';
import { caseBySlug } from '../../data/work';
import Heading from '../ui/Heading';

/**
 * Testimonials. The company profile has no client quotes yet, so until
 * `testimonials` in src/data/site.ts is filled in, this shows short notes
 * from Blueneck's own case write-ups — labelled as such, never as client quotes.
 */
const CASE_NOTES = [
  {
    slug: 'industry-excellence-awards',
    text: 'We designed and executed a customised venue setup to match the occasion, which dignitaries and attendees appreciated.',
  },
  {
    slug: 'prabandhotsav-2023',
    text: 'Team Blueneck managed the entire show for the second year in a row.',
  },
  {
    slug: 'credai-conclave',
    text: 'When you build a masterpiece from scratch, the sense of success hits differently.',
  },
  {
    slug: 'sa-re-ga-ma-pa-auditions',
    text: 'Twenty-one cities, three of them metros, in forty days. From venue finalisation to mapping the audition process, every detail was planned and executed.',
  },
];

export default function Voices() {
  const reduce = useReducedMotion();
  const isClientQuotes = testimonials.length > 0;
  const items = isClientQuotes
    ? testimonials.map((t) => ({ text: t.quote, by: t.name, sub: t.role, slug: t.caseSlug }))
    : CASE_NOTES.map((n) => ({ text: n.text, by: caseBySlug(n.slug)?.title ?? '', sub: 'From our case notes', slug: n.slug }));

  return (
    <section className="relative overflow-hidden bg-[#F7F9FC] py-24 md:py-32" aria-labelledby="voices-title">
      <span
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-16 font-display text-[9rem] leading-none text-cobalt/15"
      >
        “
      </span>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-24 h-[34rem] w-[34rem] rounded-full border-[1.5px] border-cobalt/15"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      />

      <div className="shell relative">
        <Heading
          id="voices-title"
          lead={isClientQuotes ? 'Don’t just' : 'Notes from'}
          accent={isClientQuotes ? 'take our word for it' : 'the floor'}
        >
          {isClientQuotes
            ? 'From industry leaders to public institutions, hear from the people who trusted us with their day.'
            : 'A few lines from our own write-ups, on what it took to pull each one off.'}
        </Heading>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, k) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, y: 50, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: k * 0.1, duration: 0.6, type: 'spring' }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/80 p-7 shadow-[0_20px_50px_-25px_rgba(8,22,41,0.25)] ring-1 ring-ink/5 backdrop-blur"
            >
              <span
                aria-hidden
                className="absolute -right-2 -top-6 font-display text-[8rem] leading-none text-ice/60 transition-colors duration-500 group-hover:text-sky/50"
              >
                ”
              </span>
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-ice/50 font-display text-xl text-navy"
              >
                “
              </span>
              <blockquote className="relative mt-6 flex-1 text-body-sm leading-relaxed text-ink/75">{it.text}</blockquote>
              {it.slug && (
                <Link
                  to={`/work/${it.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.15em] text-ink"
                >
                  <span className="border-b border-ink pb-0.5">Read more</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              )}
              <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-[0.8rem] font-semibold text-white">
                  {it.by.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[1.05rem] text-ink">{it.by}</span>
                  <span className="block text-[0.75rem] text-ink/50">{it.sub}</span>
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
