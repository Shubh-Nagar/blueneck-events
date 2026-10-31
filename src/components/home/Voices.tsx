import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import { testimonials } from '../../data/site';
import { caseBySlug } from '../../data/work';
import Heading from '../ui/Heading';
import { ease } from '../../lib/motion';

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
  const n = items.length;

  // Endless carousel: the cards are laid out three times over and the track starts on
  // the middle set. After each slide that strays into an outer set, it jumps back by one
  // set's width without animating, so the loop never visibly ends.
  const viewport = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const idx = useRef(n);
  const step = useRef(0);
  const busy = useRef(false);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const inView = useInView(viewport, { amount: 0.3 });

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const measure = () => {
      const card = el.querySelector('li');
      if (!card) return;
      step.current = card.getBoundingClientRect().width + parseFloat(getComputedStyle(card.parentElement!).columnGap || '0');
      x.set(-idx.current * step.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [x]);

  const go = useCallback(
    (d: number) => {
      if (busy.current) return;
      busy.current = true;
      idx.current += d;
      setCurrent((((idx.current - n) % n) + n) % n);
      animate(x, -idx.current * step.current, { duration: 0.9, ease }).then(() => {
        if (idx.current >= 2 * n) idx.current -= n;
        if (idx.current < n) idx.current += n;
        x.set(-idx.current * step.current);
        busy.current = false;
      });
    },
    [n, x],
  );

  // Advance one card at a time while visible and not being read.
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = window.setInterval(() => go(1), 2000);
    return () => window.clearInterval(id);
  }, [reduce, paused, inView, go]);

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

        <motion.div
          ref={viewport}
          className="-mx-4 mt-16 overflow-hidden px-4 py-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-roledescription="carousel"
        >
          <motion.ul className="flex gap-6" style={{ x }}>
            {[...items, ...items, ...items].map((it, k) => {
              // Only the middle copy is real to assistive tech and the keyboard.
              const copy = k < n || k >= 2 * n;
              return (
                <motion.li
                  key={k}
                  aria-hidden={copy || undefined}
                  inert={copy || undefined}
                  whileHover={{ y: -8 }}
                  className="group relative flex w-[85%] shrink-0 flex-col overflow-hidden rounded-3xl bg-white/80 p-7 shadow-[0_20px_50px_-25px_rgba(8,22,41,0.25)] ring-1 ring-ink/5 backdrop-blur sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
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
              );
            })}
          </motion.ul>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <Arrow dir={-1} onClick={() => go(-1)} />
          <div className="flex gap-2">
            {items.map((it, k) => (
              <button
                key={k}
                type="button"
                aria-label={`Show note ${k + 1}: ${it.by}`}
                aria-current={k === current}
                onClick={() => go(k - current)}
                className="flex h-6 items-center"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-500 ${k === current ? 'w-10 bg-cobalt' : 'w-4 bg-ink/15 hover:bg-ink/35'}`}
                />
              </button>
            ))}
          </div>
          <Arrow dir={1} onClick={() => go(1)} />
        </div>
      </div>
    </section>
  );
}

function Arrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'Previous note' : 'Next note'}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-md ring-1 ring-inset ring-ink/10 transition-colors duration-300 hover:bg-ink hover:text-white"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${dir < 0 ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
