import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { featuredCases } from '../../data/work';
import Heading from '../ui/Heading';
import { ease } from '../../lib/motion';

/**
 * A stage with wings: the current production fills the centre, its neighbours wait
 * dimmed at either side. Advances on its own until the reader takes over.
 */
export default function FeaturedProjects() {
  const items = featuredCases;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = items.length;
  const at = (k: number) => items[(k + n) % n];

  const go = (d: number) => {
    setDir(d);
    setI((v) => (v + d + n) % n);
  };

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => go(1), 6000);
    return () => window.clearInterval(id);
  }, [paused, reduce, n]);

  const cur = at(i);

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

      <div className="relative mt-14 lg:mt-20" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
        {/* Wings: previous and next, dimmed. */}
        <div aria-hidden className="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-between px-5 lg:flex">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              tabIndex={-1}
              onClick={() => go(d)}
              className="relative h-[16vw] max-h-[15rem] w-[22vw] overflow-hidden rounded-2xl opacity-50 grayscale-[0.4] transition-opacity duration-500 hover:opacity-80"
            >
              <img src={at(i + d).images[0].src} alt="" className="h-full w-full object-cover" loading="lazy" />
              <span className="absolute inset-0 bg-ink/30" />
            </button>
          ))}
        </div>

        <motion.div
          className="relative z-10 mx-auto w-[min(92vw,62rem)]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_40px_90px_-30px_rgba(8,22,41,0.55)] sm:aspect-[16/10]">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={cur.slug}
                custom={dir}
                className="absolute inset-0"
                initial={{ opacity: 0, x: `${dir * 6}%`, scale: 1.08 }}
                animate={{ opacity: 1, x: '0%', scale: 1, transition: { duration: 1.1, ease } }}
                exit={{ opacity: 0, x: `${dir * -6}%`, transition: { duration: 0.7, ease } }}
              >
                <img
                  src={cur.images[0].src}
                  alt={`${cur.title}${cur.location ? `, ${cur.location}` : ''}`}
                  className="h-full w-full object-cover"
                  style={{ backgroundColor: cur.images[0].tone }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <Link to={`/work/${cur.slug}`} className="absolute inset-x-6 bottom-6 block sm:inset-x-10 sm:bottom-10">
                  <motion.p
                    className="max-w-xl text-[clamp(1.1rem,0.9rem+0.9vw,1.6rem)] font-medium leading-[1.45] text-white"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.7, ease } }}
                  >
                    <span className="bg-cobalt/90 px-2 py-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                      {cur.highlight ?? cur.teaser}
                    </span>
                  </motion.p>
                  <p className="mt-4 text-body-sm text-white/80">
                    <span className="link-draw">{cur.title}</span>
                    {cur.location && <span className="text-white/55"> · {cur.location}</span>}
                  </p>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <Arrow dir={-1} onClick={() => go(-1)} />
            <div className="flex gap-2">
              {items.map((it, k) => (
                <button
                  key={it.slug}
                  type="button"
                  aria-label={`Show ${it.title}`}
                  aria-current={k === i}
                  onClick={() => {
                    setDir(k > i ? 1 : -1);
                    setI(k);
                  }}
                  className="flex h-6 items-center"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-cobalt' : 'w-4 bg-ink/15 hover:bg-ink/35'}`}
                  />
                </button>
              ))}
            </div>
            <Arrow dir={1} onClick={() => go(1)} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Arrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'Previous project' : 'Next project'}
      className="flex h-11 w-11 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-ink/20 transition-colors duration-300 hover:bg-ink hover:text-white"
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
