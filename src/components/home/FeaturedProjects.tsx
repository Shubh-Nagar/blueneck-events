import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { featuredCases } from '../../data/work';
import Heading from '../ui/Heading';
import PetalBurst from '../ui/PetalBurst';
import { ease } from '../../lib/motion';

/** Seconds each project spends in the centre before the next one slides in. */
const SECONDS = 3;
/** Cards visible in each side stack. */
const DEPTH = 3;

/**
 * Where a card sits for a given distance from the centre: x as a share of the card's
 * own width, plus scale and a darkening veil. Past DEPTH the card waits, invisible,
 * at the back of its stack.
 */
const SLOTS = [
  { x: 0, scale: 1, veil: 0 },
  { x: 40, scale: 0.86, veil: 0.3 },
  { x: 54, scale: 0.74, veil: 0.45 },
  { x: 64, scale: 0.64, veil: 0.6 },
];
const HIDDEN = { x: 72, scale: 0.56, veil: 0.7 };

/**
 * Featured productions as a deck: the current one fills the centre, the ones already
 * shown stack up on the left and the ones coming next wait in a stack on the right.
 * Every few seconds the deck steps forward; clicking a side card brings it to the front.
 */
export default function FeaturedProjects() {
  const reduce = useReducedMotion();

  // Repeat the list so each side always has a full stack plus a hidden card waiting
  // at the back, which lets cards wrap from one end to the other out of sight.
  const minCards = DEPTH * 2 + 3;
  const deck = Array.from({ length: Math.ceil(minCards / featuredCases.length) }, (_, r) =>
    featuredCases.map((c) => ({ c, key: `${c.slug}-${r}` })),
  ).flat();
  const n = deck.length;

  const [i, setI] = useState(0);

  // Restart the timer after every move, so a click gets the full interval too.
  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => setI((v) => (v + 1) % n), SECONDS * 1000);
    return () => window.clearTimeout(id);
  }, [i, n, reduce]);

  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32" aria-labelledby="featured-title">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full border-[1.5px] border-dashed border-cobalt/25"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      <div className="shell relative">
        <Heading id="featured-title" lead="Featured" accent="Projects" />
      </div>

      <motion.div
        className="relative mt-14 grid place-items-center lg:mt-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease }}
      >
        {/* The logo's petal burst, turning slowly behind the centre card (same as the clients section). */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 sm:h-[60rem] sm:w-[60rem]"
        >
          <PetalBurst className="absolute inset-0 opacity-[0.45]" />
        </div>

        {deck.map(({ c, key }, k) => {
          // Signed distance from the centre, wrapped into [-n/2, n/2).
          const o = ((((k - i) % n) + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
          const d = Math.abs(o);
          const slot = d <= DEPTH ? SLOTS[d] : HIDDEN;
          const center = o === 0;
          return (
            <motion.div
              key={key}
              className="[grid-area:1/1]"
              style={{ zIndex: 20 - d }}
              initial={false}
              animate={{
                x: `${Math.sign(o) * slot.x}%`,
                scale: slot.scale,
                opacity: d <= DEPTH ? 1 : 0,
              }}
              transition={{ duration: reduce ? 0 : 0.8, ease }}
              aria-hidden={!center || undefined}
            >
              <Link
                to={`/work/${c.slug}`}
                tabIndex={center ? undefined : -1}
                onClick={(e) => {
                  if (center) return;
                  e.preventDefault();
                  setI(k);
                }}
                className="group relative block aspect-[4/5] w-[min(80vw,24rem)] overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_30px_70px_-30px_rgba(8,22,41,0.65)] sm:aspect-[16/11] sm:w-[42rem]"
                style={{ backgroundColor: c.images[0].tone }}
              >
                <img
                  src={c.images[0].src}
                  alt={center ? `${c.title}${c.location ? `, ${c.location}` : ''}` : ''}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-stage group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                {/* Veil: deeper cards in a stack sit darker, so the centre card leads. */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-ink"
                  initial={false}
                  animate={{ opacity: slot.veil }}
                  transition={{ duration: reduce ? 0 : 0.8, ease }}
                />
                <motion.div
                  className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8"
                  initial={false}
                  animate={{ opacity: center ? 1 : 0, y: center ? 0 : 12 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease, delay: center && !reduce ? 0.3 : 0 }}
                >
                  <p className="max-w-md text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] font-medium leading-[1.45] text-white">
                    <span className="bg-cobalt/90 px-2 py-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                      {c.highlight ?? c.teaser}
                    </span>
                  </p>
                  <p className="mt-4 text-body-sm text-white/80">
                    <span className="link-draw">{c.title}</span>
                    {c.location && <span className="text-white/55"> · {c.location}</span>}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
