import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import Page from '../components/ui/Page';
import Heading, { ArrowLink } from '../components/ui/Heading';
import Img from '../components/ui/Img';
import CountUp from '../components/ui/CountUp';
import { ButtonLink } from '../components/ui/Button';
import Lightbox from '../components/work/Lightbox';
import {
  bodies,
  commitments,
  medicalContact,
  medicalGallery,
  medicalHero,
  medicalServices,
  medicalStats,
  portfolio,
  risks,
  roleLabel,
  roles,
  signatures,
  stages,
  type Role,
  type Signature,
} from '../data/medical';
import { ease, fade, lineReveal } from '../lib/motion';

/** Rises into place once scrolled into view; `i` staggers siblings. */
const rise = (i = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease, delay: i * 0.06 },
});

const eyebrow = 'text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-cobalt';

export default function MedicalConferences() {
  return (
    <Page title="Medical conferences">
      <Cover />
      <Services />
      <Portfolio />
      {signatures.map((s, i) => (
        <SignatureStudy key={s.title} study={s} flip={i % 2 === 1} />
      ))}
      <Gallery />
      <Stages />
      <Roles />
      <Bodies />
      <Risk />
      <Commitments />
    </Page>
  );
}

/** Dark opening over a plenary hall, with the headline figures along the bottom. */
function Cover() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section ref={ref} data-dark-cover className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        <img src={medicalHero.cover.src} alt="" className="h-full w-full object-cover" fetchPriority="high" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
      <div aria-hidden className="grain absolute inset-0" />

      <div className="shell relative pb-14 pt-40 sm:pb-20">
        <motion.p variants={fade} initial="hidden" animate="show" custom={0.05} className={`${eyebrow} !text-ice`}>
          {medicalHero.eyebrow}
        </motion.p>
        <h1 className="mt-5 max-w-5xl font-display text-h1 text-paper">
          {medicalHero.title.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span className="block" variants={lineReveal} initial="hidden" animate="show" custom={i}>
                {i === 1 ? <span className="text-shine-light font-semibold">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p variants={fade} initial="hidden" animate="show" custom={0.45} className="mt-6 text-lead text-paper/80">
          {medicalHero.sub}
        </motion.p>
        <motion.div variants={fade} initial="hidden" animate="show" custom={0.6} className="mt-10 flex flex-wrap gap-4">
          <ButtonLink to="/contact?type=conferences" variant="light">
            Plan your conference
          </ButtonLink>
          <a
            href="#portfolio"
            className="inline-flex items-center rounded-full px-7 py-3.5 text-body-sm font-medium text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10"
          >
            See 17 congresses
          </a>
        </motion.div>

        <ul className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-white/15 ring-1 ring-white/15 backdrop-blur-md lg:grid-cols-4">
          {medicalStats.map((s, k) => (
            <motion.li
              key={s.label}
              className="bg-ink/40 px-5 py-6 sm:px-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7 + k * 0.08, duration: 0.6, ease } }}
            >
              <CountUp figure={s.figure} className="!text-white" />
              <span className="mt-3 block text-body-sm text-paper/70">{s.label}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="bg-[#F7F9FC] py-24 sm:py-32">
      <div className="shell">
        <Heading lead="Everything around" accent="the science" size="md">
          One senior and one junior for your OC from day one, and a BNE member in every area on show days.
        </Heading>
        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {medicalServices.map((s, i) => (
            <motion.li
              key={s.name}
              {...rise(i % 4)}
              className="group overflow-hidden rounded-[1.5rem] bg-white shadow-[0_15px_40px_-25px_rgba(8,22,41,0.35)] ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_25px_50px_-25px_rgba(37,76,130,0.55)]"
            >
              <div className="relative">
                <Img
                  img={s.img}
                  alt={s.name}
                  frameClassName="aspect-[16/10]"
                  className="transition-transform duration-[1.2s] ease-stage group-hover:scale-[1.06]"
                />
                <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 font-display text-body-sm font-bold text-navy shadow-md backdrop-blur">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[1.4rem] leading-tight text-ink">{s.name}</h3>
                <p className="mt-2.5 text-body-sm text-ink/60">{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section id="portfolio" className="scroll-mt-24 bg-white py-24 sm:py-32">
      <div className="shell">
        <Heading lead="Seventeen congresses." accent="Fifteen specialties." size="md">
          Five consecutive years of medical conferences, all in Indore except SONCON 2024 (Ujjain) and WZUSICON 2026 (Goa).
        </Heading>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {portfolio.map((y, i) => (
            <motion.div key={y.year} {...rise(i)}>
              <h3 className="border-b-2 border-navy pb-3 font-display text-[2rem] text-ink">{y.year}</h3>
              <ul className="mt-5 space-y-5">
                {y.events.map((e) => (
                  <li key={e.name + y.year}>
                    <span className="block font-bold text-ink">{e.name}</span>
                    <span className="text-body-sm text-ink/55">
                      {e.specialty}
                      {e.city && <span className="text-cobalt"> · {e.city}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** How long each photo stays at the front of a case-study collage, in seconds. */
const SLIDE_SECONDS = 3;

/**
 * A signature case study: the story and figures on one side, and on the other a collage
 * of the event's photos that brings each one forward in turn (pinned while the text scrolls past).
 */
function SignatureStudy({ study: s, flip }: { study: Signature; flip: boolean }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const images = s.photos.map((ph) => ph.img);

  return (
    <section className={`${flip ? 'bg-white' : 'bg-[#F7F9FC]'} overflow-hidden py-24 sm:py-28`}>
      <div className="shell grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <motion.div {...rise()} className={flip ? 'lg:order-2' : ''}>
          <p className={eyebrow}>{s.eyebrow}</p>
          <h2 className="mt-4 font-display text-h2 text-ink">{s.title}</h2>
          <p className="mt-4 text-lead text-ink/75">{s.subtitle}</p>
          {s.body.map((para) => (
            <p key={para} className="mt-6 text-body text-ink/65 text-pretty">
              {para}
            </p>
          ))}
          <p className="mt-6 text-body-sm text-ink/45">{s.source}</p>

          <ul className={`mt-10 grid gap-3 ${s.stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {s.stats.map((st) => (
              <li
                key={st.label}
                className="rounded-2xl bg-white p-4 shadow-[0_10px_30px_-20px_rgba(8,22,41,0.4)] ring-1 ring-ink/10"
              >
                <CountUp figure={st.figure} className="whitespace-nowrap !text-[clamp(1.4rem,1.2rem+0.8vw,2rem)]" />
                <span className="mt-2 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink/55">
                  {st.label}
                </span>
              </li>
            ))}
          </ul>
          {s.caseSlug && (
            <div className="mt-10">
              <ArrowLink to={`/work/${s.caseSlug}`}>View the case study</ArrowLink>
            </div>
          )}
        </motion.div>

        <motion.div {...rise(1)} className={`lg:sticky lg:top-28 ${flip ? 'lg:order-1' : ''}`}>
          <Collage title={s.title} photos={s.photos} index={index} onIndex={setIndex} onOpen={setOpen} />
        </motion.div>
      </div>

      <Lightbox images={images} index={open} title={s.title} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}

type Photos = Signature['photos'];

/** Small deterministic PRNG, so a collage looks random but lands the same way on every visit. */
const seeded = (seed: string) => {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

/** Scattered prints: a jittered 4 × 3 grid, each tilted a little, in a shuffled stacking order. */
const scatter = (seed: string, n: number) => {
  const rnd = seeded(seed);
  const cols = 4;
  const rows = Math.ceil(n / cols);
  return Array.from({ length: n }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      left: Math.min(70, Math.max(-1, col * 23.5 + (rnd() - 0.5) * 7)),
      top: Math.min(71, Math.max(-1, row * (72 / Math.max(1, rows - 1)) + (rnd() - 0.5) * 8)),
      rotate: (rnd() - 0.5) * 16,
      z: 1 + Math.floor(rnd() * n),
      // A gentle drift for while the photo waits in the pile: pixels up/sideways, seconds per cycle.
      float: { y: 5 + rnd() * 6, x: (rnd() - 0.5) * 6, duration: 4 + rnd() * 3, delay: rnd() * 2 },
    };
  });
};

/** The size and place a photo takes when it comes up front (percent of the frame). */
const FEATURE = { left: 15, top: 13, width: 70, rotate: 0 };
const CARD_WIDTH = 31;

/**
 * Every photo of the event laid out as a loose collage. One at a time, a photo lifts out
 * of the pile and enlarges to centre stage for SLIDE_SECONDS, then settles back while the
 * next comes up. Pauses on hover and off screen; click the front photo for full screen,
 * or any photo behind it to bring it forward.
 */
function Collage({
  title,
  photos,
  index,
  onIndex,
  onOpen,
}: {
  title: string;
  photos: Photos;
  index: number;
  onIndex: (i: number) => void;
  onOpen: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.3 });
  const [hover, setHover] = useState(false);
  const progress = useMotionValue(0);
  const n = photos.length;
  const slots = useMemo(() => scatter(title, n), [title, n]);
  const go = (i: number) => onIndex((i + n) % n);

  // Restart the timer whenever the front photo changes, by timer or by hand.
  useEffect(() => progress.set(0), [index, progress]);

  useAnimationFrame((_, delta) => {
    if (reduce || hover || !inView) return;
    const next = progress.get() + Math.min(delta, 250) / 1000 / SLIDE_SECONDS;
    if (next < 1) return progress.set(next);
    progress.set(1);
    go(index + 1);
  });

  const current = photos[index];
  return (
    <div>
      <div
        ref={ref}
        className="group relative aspect-[4/3]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} photographs`}
      >
        {photos.map((ph, i) => {
          const on = i === index;
          const slot = slots[i];
          return (
            <motion.button
              key={ph.img.src}
              type="button"
              onClick={() => (on ? onOpen(i) : go(i))}
              aria-label={on ? `Open ${ph.caption} full screen` : `Bring forward: ${ph.caption}`}
              aria-current={on || undefined}
              className={`absolute block aspect-[4/3] ${on ? 'cursor-zoom-in' : 'cursor-pointer'}`}
              style={{ zIndex: on ? 50 : slot.z }}
              initial={false}
              animate={{
                left: `${on ? FEATURE.left : slot.left}%`,
                top: `${on ? FEATURE.top : slot.top}%`,
                width: `${on ? FEATURE.width : CARD_WIDTH}%`,
                rotate: on ? FEATURE.rotate : slot.rotate,
                opacity: on ? 1 : 0.7,
                filter: on ? 'saturate(1)' : 'saturate(0.6)',
              }}
              whileHover={on ? undefined : { opacity: 1, filter: 'saturate(1)' }}
              transition={{ duration: reduce ? 0 : 0.9, ease }}
            >
              {/* The print itself: drifts gently while it waits in the pile, holds still up front. */}
              <motion.span
                className={`block h-full w-full rounded-xl bg-white p-1 sm:rounded-2xl sm:p-1.5 ${
                  on ? 'shadow-[0_40px_90px_-30px_rgba(8,22,41,0.75)]' : 'shadow-[0_18px_40px_-18px_rgba(8,22,41,0.55)]'
                }`}
                animate={
                  on || reduce
                    ? { x: 0, y: 0 }
                    : { x: [0, slot.float.x, 0], y: [0, -slot.float.y, 0] }
                }
                transition={
                  on || reduce
                    ? { duration: 0.6, ease }
                    : {
                        y: { duration: slot.float.duration, repeat: Infinity, ease: 'easeInOut', delay: slot.float.delay },
                        x: { duration: slot.float.duration * 1.4, repeat: Infinity, ease: 'easeInOut', delay: slot.float.delay },
                      }
                }
              >
                <span
                  className="block h-full w-full overflow-hidden rounded-[0.6rem] sm:rounded-xl"
                  style={{ backgroundColor: ph.img.tone }}
                >
                  <img
                    src={ph.img.src}
                    alt={on ? ph.caption : ''}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </span>
              </motion.span>
            </motion.button>
          );
        })}

        {/* Prev / next sit over the front photo. */}
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => go(index + d)}
            aria-label={d < 0 ? 'Previous photo' : 'Next photo'}
            className={`absolute top-1/2 z-[60] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md backdrop-blur transition-opacity duration-300 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 ${d < 0 ? 'left-[12%]' : 'right-[12%]'}`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 ${d < 0 ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Caption, counter and a bar per photo, the current one filling. */}
      <div className="mt-6 flex items-end justify-between gap-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={current.caption}
            className="font-display text-[clamp(1.1rem,0.95rem+0.6vw,1.45rem)] leading-snug text-ink"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
          >
            {current.caption}
          </motion.p>
        </AnimatePresence>
        <span className="shrink-0 text-body-sm tabular-nums text-ink/50">
          {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-4 flex gap-1.5" aria-hidden>
        {photos.map((ph, i) => (
          <span key={ph.img.src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-navy/15">
            {i < index && <span className="block h-full w-full bg-navy" />}
            {i === index && (
              <motion.span className="block h-full w-full origin-left bg-navy" style={{ scaleX: reduce ? 1 : progress }} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const images = medicalGallery.map((g) => g.img);
  return (
    <section className="bg-ink py-24 sm:py-32" aria-labelledby="medical-gallery">
      <div className="shell">
        <Heading id="medical-gallery" tone="light" lead="Science by day." accent="Every detail by us." size="md">
          From entry arch to plenary hall, trade corridor to gala night, across nine of our medical conferences.
        </Heading>
        <div className="mt-16 gap-5 sm:columns-2 lg:columns-3">
          {medicalGallery.map((g, i) => (
            <motion.button
              key={g.img.src}
              {...rise(i % 3)}
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${g.caption}`}
              className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl"
            >
              <Img
                img={g.img}
                alt={g.caption}
                className="transition-transform duration-[1.2s] ease-stage group-hover:scale-[1.05]"
              />
              <span className="absolute inset-x-3 bottom-3 rounded-lg bg-ink/75 px-3 py-2 text-left text-[0.8rem] font-semibold text-white backdrop-blur-sm">
                {g.caption}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      <Lightbox
        images={images}
        index={open}
        title="Medical conferences"
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </section>
  );
}

function Stages() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="shell">
        <Heading lead="Six stages." accent="One daily rhythm." size="md">
          Our team works from our office but attends every OC meeting. You will never chase us for an update.
        </Heading>
        <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((s, i) => (
            <motion.li key={s.name} {...rise(i % 3)} className="group">
              <Img
                img={s.img}
                alt=""
                frameClassName="aspect-[16/10] rounded-[1.25rem]"
                className="transition-transform duration-[1.2s] ease-stage group-hover:scale-[1.05]"
              />
              <div className="mt-5 flex gap-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-white ${i === stages.length - 1 ? 'bg-cobalt' : 'bg-navy'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-[1.4rem] leading-tight text-ink">{s.name}</h3>
                  <p className="mt-1 text-body-sm text-ink/60">{s.text}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const ROLE_COLS: Role[] = ['lead', 'shared', 'oc'];

function Roles() {
  return (
    <section className="bg-[#F7F9FC] py-24 sm:py-32">
      <div className="shell">
        <p className={eyebrow}>Roles</p>
        <h2 className="mt-4 font-display text-h2 text-ink">One partner. Every detail. Clear lines.</h2>
        <motion.div {...rise()} className="mt-12 overflow-x-auto rounded-[1.5rem] bg-white ring-1 ring-ink/10">
          <table className="w-full min-w-[46rem] text-left text-body-sm">
            <thead className="bg-ink text-[0.7rem] uppercase tracking-[0.18em] text-white">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Area of work
                </th>
                {ROLE_COLS.map((r) => (
                  <th key={r} scope="col" className="px-4 py-4 text-center font-semibold">
                    {roleLabel[r]}
                  </th>
                ))}
                <th scope="col" className="px-6 py-4 font-semibold">
                  How it works
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.area} className="border-t border-ink/10">
                  <th scope="row" className="px-6 py-5 font-semibold text-ink">
                    {r.area}
                  </th>
                  {ROLE_COLS.map((c) => (
                    <td key={c} className="px-4 py-5 text-center">
                      {r.role === c ? (
                        <span
                          className={`inline-block h-3 w-3 rounded-full ${c === 'shared' ? 'bg-sky' : 'bg-navy'}`}
                          aria-label={roleLabel[c]}
                        />
                      ) : null}
                    </td>
                  ))}
                  <td className="px-6 py-5 text-ink/70">{r.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

function Bodies() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="shell">
        <Heading lead="Trusted by the bodies that set" accent="India’s medical agenda" size="md" />
        <div className="mt-16 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bodies.served.map((b, i) => (
              <motion.li
                key={b.name}
                {...rise(i % 4)}
                className="flex flex-col rounded-2xl border-t-4 border-cobalt/70 bg-[#F7F9FC] p-5 ring-1 ring-ink/5"
              >
                <span className="font-display text-[1.6rem] text-ink/30">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-auto pt-6 font-display font-bold leading-snug text-ink">{b.name}</span>
                {b.note && (
                  <span className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink/45">
                    {b.note}
                  </span>
                )}
              </motion.li>
            ))}
          </ul>
          <motion.div {...rise(2)} className="rounded-2xl border-t-4 border-navy bg-[#F7F9FC] p-7 ring-1 ring-ink/5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ink/45">New in 2025–2026</p>
            <ul className="mt-5 space-y-3 text-body-sm font-semibold text-ink">
              {bodies.recent.map((b) => (
                <li key={b} className="flex gap-3">
                  <span aria-hidden className="mt-[0.45em] h-2 w-2 shrink-0 bg-cobalt/60" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Risk() {
  const tested = [
    ['25,000+', 'crowd · Bhaskar Utsav, Indore'],
    ['80,000', 'visitors and 300+ exhibitors · Plast Pack 2025'],
    ['5,000+', 'guests · Mayor’s oath ceremony'],
    ['CM-level', 'protocol · Chief Minister-led ceremonies'],
  ];
  return (
    <section className="bg-[#F7F9FC] py-24 sm:py-32">
      <div className="shell">
        <p className={eyebrow}>Risk and control</p>
        <h2 className="mt-4 font-display text-h2 text-ink">Nothing reaches the delegate unchecked</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_2fr]">
          <motion.ul {...rise()} className="flex flex-col justify-center gap-7 rounded-[1.5rem] bg-ink p-8 sm:p-10">
            <li className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ice">Tested at scale</li>
            {tested.map(([f, l]) => (
              <li key={f}>
                <span className="block font-display text-[2.2rem] leading-none text-white">{f}</span>
                <span className="mt-2 block text-body-sm text-paper/65">{l}</span>
              </li>
            ))}
          </motion.ul>
          <motion.dl {...rise(1)} className="divide-y divide-ink/10 rounded-[1.5rem] bg-white px-6 ring-1 ring-ink/10 sm:px-8">
            {risks.map(([risk, control]) => (
              <div key={risk} className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="font-semibold text-ink">{risk}</dt>
                <dd className="text-body-sm text-ink/70 sm:text-body">{control}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
        <p className="mt-6 font-display text-[1.2rem] italic text-ink/70">
          Every facet is in place before the first guest walks in.
        </p>
      </div>
    </section>
  );
}

/** Closing: the four commitments and the director to call. */
function Commitments() {
  const c = medicalContact;
  return (
    <section className="bg-white py-24 sm:py-32" aria-labelledby="medical-cta">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div {...rise()}>
          <p className={eyebrow}>Why now</p>
          <h2 id="medical-cta" className="mt-4 font-display text-h2 text-ink text-balance">
            Your next conference starts with <span className="text-shine font-semibold">four commitments</span>
          </h2>
          <p className="mt-6 max-w-prose text-body text-ink/65">
            From a 150-delegate live surgical workshop to a 2,000+ national congress, we have scaled with every brief. We
            are ready for national and international meetings, and we would like yours to be next.
          </p>
          <ol className="mt-10 space-y-6">
            {commitments.map((m, i) => (
              <li key={m.name} className="flex gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <span className="block text-[1.15rem] font-bold text-ink">{m.name}</span>
                  <span className="text-body-sm text-ink/55">{m.text}</span>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          {...rise(1)}
          className="relative self-start overflow-hidden rounded-[2rem] bg-gradient-to-br from-ice/40 via-white to-ice/30 p-8 shadow-[0_30px_80px_-40px_rgba(37,76,130,0.45)] ring-1 ring-cobalt/15 sm:p-12"
        >
          <span aria-hidden className="tile absolute -right-10 -top-10 h-40 w-40 bg-ice/40" />
          <h3 className="relative font-display text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.05] text-ink">
            Let’s build your <span className="text-shine font-semibold">next conference</span>
          </h3>
          <p className="relative mt-5 text-body text-ink/65">
            Share your dates and expected delegates. We’ll come back with a venue plan and a scope of work.
          </p>
          <div className="relative mt-8 border-t border-ink/10 pt-8">
            <p className="font-bold text-ink">{c.name}</p>
            <p className="text-body-sm text-ink/55">{c.role}</p>
            <p className="mt-5 flex flex-col gap-2 text-body">
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="link-draw self-start font-semibold text-navy">
                {c.phone}
              </a>
              <a href={`mailto:${c.email}`} className="link-draw self-start font-semibold text-navy">
                {c.email}
              </a>
            </p>
            <p className="mt-5 text-body-sm text-ink/55">{c.address}</p>
          </div>
          <div className="relative mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink to="/contact?type=conferences">Send an enquiry</ButtonLink>
            <Link to="/work?type=conferences" className="link-draw text-body-sm font-semibold text-navy">
              Other conferences we have run
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
