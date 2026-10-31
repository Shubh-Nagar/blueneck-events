import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Page from '../components/ui/Page';
import Heading from '../components/ui/Heading';
import ContactCta from '../components/home/ContactCta';
import { company, directors, type Director } from '../data/site';
import { cases } from '../data/work';
import { ease, fade, lineReveal } from '../lib/motion';

// "What we do", exactly as listed in the company profile.
const WHAT_WE_DO = [
  'Government events',
  'Celebrity events',
  'Auditions',
  'Sports events',
  'Exhibitions',
  'Corporate events',
  'Medical conferences',
];

// Portrait backdrops step through the logo's blues: navy, cobalt, sky.
const TONES = ['#254C82', '#537DBE', '#75A6D8'];

export default function About() {
  return (
    <Page title="Our story">
      <Cover />
      <Story />
      <Chronicles />
      <Directors />
      <ContactCta />
    </Page>
  );
}

/** Dark opening: the three directors as tilted posters that fan apart on scroll. */
function Cover() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const spread = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lx = useTransform(spread, [0, 1], ['0%', '-22%']);
  const rx = useTransform(spread, [0, 1], ['0%', '22%']);
  const cy = useTransform(spread, [0, 1], ['0%', '12%']);
  const fadeOut = useTransform(spread, (v) => Math.max(0, 1 - v / 0.7));
  const posters = [directors[1], directors[0], directors[2]].filter(Boolean);

  return (
    <section
      ref={ref}
      data-dark-cover
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_40%,#254C82_0%,#0E2240_55%,#081629_100%)]"
      />
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      {/* Posters */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 mx-auto flex w-[min(92vw,62rem)] -translate-y-1/2 items-end justify-center"
      >
        {posters.map((d, i) => {
          const rot = [-8, 0, 8][i];
          const x = i === 0 ? lx : i === 2 ? rx : undefined;
          return (
            <motion.div
              key={d.slug}
              className={`relative w-1/3 ${i === 1 ? 'z-10 -mx-[3%] mb-[4%]' : ''}`}
              style={reduce ? undefined : { x, y: i === 1 ? cy : undefined }}
            >
              <motion.div
                initial={{ opacity: 0, y: 60, rotate: 0 }}
                animate={{
                  opacity: i === 1 ? 1 : 0.9,
                  y: 0,
                  rotate: rot,
                  transition: { duration: 1.2, ease, delay: 0.2 + i * 0.12 },
                }}
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] ring-4 ring-white/90"
                  style={{ backgroundColor: TONES[i] }}
                >
                  <span className="tile absolute -right-[20%] -top-[20%] h-[65%] w-[65%] bg-white/10" />
                  <img
                    src={d.image.src}
                    alt=""
                    className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />

      <motion.div className="relative z-20 px-5 text-center" style={reduce ? undefined : { opacity: fadeOut }}>
        <h1 className="font-display text-[clamp(3rem,1.8rem+5.5vw,7rem)] leading-[0.95] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span className="block" variants={lineReveal} initial="hidden" animate="show" custom={2}>
              Three directors,
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span className="block italic text-ice" variants={lineReveal} initial="hidden" animate="show" custom={3}>
              one stage.
            </motion.span>
          </span>
        </h1>
        <motion.a
          href="#directors"
          className="group mt-10 inline-flex items-center gap-4 text-white"
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0.9}
        >
          <span className="border-b border-white/70 pb-1 font-display text-[0.95rem] font-bold tracking-[0.18em]">Meet them</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset ring-white/50 transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 rotate-90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}

/** The company paragraph, centred, with the founding year set huge behind it. */
function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yearY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-[#F5F9FD] to-white py-24 sm:py-32"
      aria-labelledby="story-title"
    >
      <motion.span
        aria-hidden
        style={{ y: yearY }}
        className="pointer-events-none absolute -right-[4vw] bottom-0 select-none font-display text-[28vw] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(83,125,190,0.12)]"
      >
        {company.incorporated}
      </motion.span>

      <div className="shell relative">
        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-10px_rgba(37,76,130,0.4)]">
          <img src="/brand/blueneck-mark.png" alt="" className="h-9 w-9" />
        </div>
        <Heading id="story-title" lead="How we" accent="got here" />
        <motion.p
          className="mx-auto mt-10 max-w-3xl text-center font-display text-[clamp(1.15rem,1rem+0.5vw,1.45rem)] leading-[1.7] text-ink/75 text-pretty"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
        >
          {company.about}
        </motion.p>

        <p className="mt-16 text-center text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-cobalt">What we do</p>
        <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
          {WHAT_WE_DO.map((w, i) => (
            <motion.li
              key={w}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5, type: 'spring', bounce: 0.3 }}
              className="flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-body-sm text-ink shadow-[0_8px_24px_-12px_rgba(8,22,41,0.3)] ring-1 ring-ink/5"
            >
              <span aria-hidden className="tile h-2 w-2 bg-cobalt" />
              {w}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Milestones by season, built from the year on each case study, zig-zagging down a dashed thread. */
function Chronicles() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const thread = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const milestones = useMemo(() => {
    const byYear = new Map<string, typeof cases>();
    cases.forEach((c) => c.year && byYear.set(c.year, [...(byYear.get(c.year) ?? []), c]));
    return [...byYear.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, list]) => ({
        year,
        lead: year === String(company.incorporated) ? `${company.legalName} is incorporated.` : null,
        list,
      }));
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32" aria-labelledby="chronicles-title">
      <div className="shell">
        <Heading id="chronicles-title" lead="Blueneck" accent="Chronicles">
          Our seasons so far, <em className="font-display text-cobalt">one stage at a time.</em>
        </Heading>

        <div ref={ref} className="relative mx-auto mt-20 max-w-5xl">
          {/* The thread: dashed guide plus a solid line that fills as you read. */}
          <span
            aria-hidden
            className="absolute bottom-0 left-5 top-0 w-px border-l-[1.5px] border-dashed border-cobalt/25 md:left-1/2"
          />
          <motion.span
            aria-hidden
            className="absolute left-5 top-0 h-full w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-cobalt to-sky md:left-1/2"
            style={{ scaleY: thread }}
          />

          <ol className="space-y-16 md:space-y-24">
            {milestones.map((m, i) => {
              const right = i % 2 === 1;
              return (
                <li key={m.year} className="relative grid items-center gap-6 pl-14 md:grid-cols-2 md:gap-16 md:pl-0">
                  <span
                    aria-hidden
                    className="tile absolute left-5 top-8 h-4 w-4 -translate-x-1/2 bg-cobalt ring-4 ring-white md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                  />
                  <motion.div
                    className={right ? 'md:order-2' : ''}
                    initial={{ opacity: 0, x: right ? 60 : -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.8, ease }}
                  >
                    <div className="rounded-[1.5rem] bg-gradient-to-br from-white to-ice/30 p-7 shadow-[0_25px_60px_-30px_rgba(37,76,130,0.55)] ring-1 ring-cobalt/20 sm:p-8">
                      <div className="flex items-start gap-6">
                        <div className="shrink-0">
                          <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cobalt">Year</p>
                          <p className="font-display text-[2.6rem] font-bold leading-none text-ink">{m.year}</p>
                          <span className="mt-3 block h-[3px] w-10 rounded-full bg-cobalt" />
                        </div>
                        <div className="border-l border-dashed border-ink/15 pl-6 text-body-sm leading-relaxed text-ink/70">
                          {m.lead && <p className="mb-2 font-semibold text-ink">{m.lead}</p>}
                          <p>
                            {m.list.length} {m.list.length === 1 ? 'production' : 'productions'}, including{' '}
                            {m.list.slice(0, 3).map((c, k, arr) => (
                              <span key={c.slug}>
                                <Link to={`/work/${c.slug}`} className="link-draw font-display italic text-navy">
                                  {c.title}
                                </Link>
                                {k < arr.length - 2 ? ', ' : k === arr.length - 2 ? ' and ' : '.'}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Opposite side: a taped polaroid of that year's first production. */}
                  <motion.div
                    className={`hidden md:block ${right ? 'md:order-1 md:justify-self-end' : 'md:justify-self-start'}`}
                    initial={{ opacity: 0, y: 40, rotate: right ? -6 : 6 }}
                    whileInView={{ opacity: 1, y: 0, rotate: right ? -3 : 3 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.9, ease, delay: 0.1 }}
                  >
                    <div className="relative w-56 bg-white p-3 pb-10 shadow-[0_20px_40px_-20px_rgba(8,22,41,0.45)]">
                      <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-ice/70" />
                      <img
                        src={m.list[0].images[0].src}
                        alt=""
                        loading="lazy"
                        className="aspect-square w-full object-cover"
                        style={{ backgroundColor: m.list[0].images[0].tone }}
                      />
                      <p className="absolute inset-x-3 bottom-3 truncate text-center font-display text-[0.85rem] italic text-ink/60">
                        {m.list[0].title}
                      </p>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** One director at a time: portrait left, story right, with arrows and dots. */
function Directors() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [open, setOpen] = useState(false);
  const d = directors[i];
  const go = (k: number) => {
    setDir(k > i || (i === directors.length - 1 && k === 0) ? 1 : -1);
    setOpen(false);
    setI((k + directors.length) % directors.length);
  };

  return (
    <section id="directors" className="scroll-mt-20 bg-[#F7F9FC] py-24 sm:py-32" aria-labelledby="directors-title">
      <div className="shell">
        <Heading id="directors-title" lead="The people" accent="at the helm">
          Close to sixty years of event management between the three of them.
        </Heading>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_90px_-40px_rgba(8,22,41,0.45)] ring-1 ring-ink/5">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.article
                key={d.slug}
                className="grid md:grid-cols-[5fr_7fr]"
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease } }}
                exit={{ opacity: 0, x: dir * -40, transition: { duration: 0.3 } }}
              >
                <Portrait d={d} tone={TONES[i % 3]} />
                <div className="flex flex-col p-8 sm:p-12">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-navy px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">
                    <span aria-hidden className="tile h-1.5 w-1.5 bg-ice" />
                    {d.role} · Blueneck Events
                  </span>
                  <h3 className="mt-6 font-display text-[clamp(2.2rem,1.6rem+2vw,3.4rem)] leading-none text-ink">{d.name}</h3>
                  <span className="mt-6 block h-px w-full bg-gradient-to-r from-cobalt/40 to-transparent" />
                  <div className="mt-6 text-body-sm leading-relaxed text-ink/70">
                    <p className={open ? '' : 'line-clamp-4'}>{d.bio[0]}</p>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1, transition: { duration: 0.5, ease } }}
                          exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease } }}
                          className="overflow-hidden"
                        >
                          {d.bio.slice(1).map((p) => (
                            <p key={p.slice(0, 20)} className="mt-4 text-pretty">
                              {p}
                            </p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    className="group mt-8 inline-flex w-fit items-center gap-4 text-ink"
                  >
                    <span className="border-b-2 border-current pb-1 font-display text-[0.9rem] font-bold tracking-[0.15em]">
                      {open ? 'Show less' : 'Read full story'}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-inset ring-ink/25 transition-colors duration-300 group-hover:bg-ink group-hover:text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 transition-transform ${open ? '-rotate-90' : 'rotate-90'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <RoundArrow label="Previous director" flip onClick={() => go(i - 1)} />
            <div className="flex gap-2">
              {directors.map((x, k) => (
                <button
                  key={x.slug}
                  type="button"
                  aria-label={x.name}
                  aria-current={k === i}
                  onClick={() => go(k)}
                  className="flex h-6 items-center"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-cobalt' : 'w-4 bg-ink/15 hover:bg-ink/35'}`}
                  />
                </button>
              ))}
            </div>
            <RoundArrow label="Next director" onClick={() => go(i + 1)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Portrait({ d, tone }: { d: Director; tone: string }) {
  return (
    <div className="relative min-h-[22rem] overflow-hidden md:min-h-full" style={{ backgroundColor: tone }}>
      <div aria-hidden className="tile absolute -right-[18%] -top-[18%] h-[62%] w-[62%] bg-white/10" />
      <div aria-hidden className="tile absolute -bottom-[22%] -left-[16%] h-[48%] w-[48%] bg-ink/15" />
      <img
        src={d.image.src}
        alt={d.name}
        width={d.image.w}
        height={d.image.h}
        loading="lazy"
        className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
      />
    </div>
  );
}

function RoundArrow({ label, flip, onClick }: { label: string; flip?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-md ring-1 ring-inset ring-ink/10 transition-colors duration-300 hover:bg-ink hover:text-white"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${flip ? 'rotate-180' : ''}`}
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
