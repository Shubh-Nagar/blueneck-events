import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { company, type Img } from '../../data/site';
import { caseBySlug } from '../../data/work';
import Heading, { ArrowLink } from '../ui/Heading';
import { ease } from '../../lib/motion';

const covers = (slugs: string[]) => slugs.map((s) => caseBySlug(s)?.images[0]).filter((i): i is Img => !!i);

// Each frame cycles through its own set of event photographs (case-study covers).
const BACK = covers(['modi-at-20', 'plastpack-2025', 'credai-conclave', 'mayor-shapath-grahan-samaroh', 'usicon-west-zone']);
const FRONT = covers([
  'bhaskar-utsav',
  'prabandhotsav-2023',
  'vigour-biotech-dealers-meet',
  'inspire-apple-store-launch-indore',
  'mp-premier-league-2025',
]);

/** How long each photo holds, and how long the cross-fade takes (ms). */
const HOLD = 3000;
const FADE = 1000;

/**
 * Who we are. Two photographs overlap and slide past each other as the page scrolls,
 * each cross-fading through a set of event photos. The frames change half a beat apart
 * so they never swap together.
 */
export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.2 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 45, damping: 22 });
  const backY = useTransform(p, [0, 1], ['-15%', '15%']);
  const frontY = useTransform(p, [0, 1], ['12%', '-12%']);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#F7F9FC] px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      aria-labelledby="journey-title"
    >
      <div className="mx-auto grid max-w-site items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <Heading id="journey-title" align="left" lead="Two decades" accent="of event craft" />
          <motion.p
            className="mt-8 max-w-xl text-body leading-relaxed text-ink/65"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease }}
          >
            Under one name since <strong className="font-semibold text-ink">{company.incorporated}</strong>. {company.aboutShort}
          </motion.p>
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <ArrowLink to="/about">Our story</ArrowLink>
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-[5/4] w-full max-w-2xl">
          <motion.div
            className="absolute left-0 top-0 w-[68%] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(8,22,41,0.35)] ring-4 ring-white"
            style={{ y: reduce ? 0 : backY }}
          >
            <Crossfade images={BACK} active={inView} offset={0} zoom={!reduce} />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-[56%] overflow-hidden rounded-2xl shadow-[0_40px_80px_-20px_rgba(8,22,41,0.45)] ring-4 ring-white"
            style={{ y: reduce ? 0 : frontY }}
          >
            <Crossfade images={FRONT} active={inView} offset={HOLD / 2} zoom={!reduce} />
          </motion.div>
          <motion.span
            aria-hidden
            className="tile absolute -right-4 top-6 h-10 w-10 bg-ice"
            animate={reduce ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * A 4:3 frame that cross-fades through `images`. All photos are stacked and only the
 * opacity changes, so there is never a blank frame between them. The incoming photo also
 * settles from a slight zoom. Cycling only runs while `active` and the tab is visible.
 */
function Crossfade({ images, active, offset, zoom }: { images: Img[]; active: boolean; offset: number; zoom: boolean }) {
  // `prev` stays fully opaque underneath while the new photo fades in over it, so the
  // frame never dips to the background colour mid-fade.
  const [{ index, prev }, setState] = useState({ index: 0, prev: -1 });

  useEffect(() => {
    if (!active || images.length < 2) return;
    let timer: number | undefined;
    const tick = () => {
      if (!document.hidden) setState(({ index: i }) => ({ index: (i + 1) % images.length, prev: i }));
      timer = window.setTimeout(tick, HOLD);
    };
    timer = window.setTimeout(tick, HOLD + offset);
    return () => window.clearTimeout(timer);
  }, [active, images.length, offset]);

  return (
    <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: images[0]?.tone }}>
      {images.map((img, i) => {
        const on = i === index;
        const under = i === prev;
        return (
          <img
            key={img.src}
            src={img.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              backgroundColor: img.tone,
              opacity: on || under ? 1 : 0,
              transform: zoom ? `scale(${on || under ? 1 : 1.06})` : undefined,
              // Only the incoming photo animates; the others switch instantly while hidden.
              transition: on
                ? `opacity ${FADE}ms ease-in-out, transform ${HOLD + FADE}ms cubic-bezier(0.22, 1, 0.36, 1)`
                : 'none',
              zIndex: on ? 2 : under ? 1 : 0,
            }}
          />
        );
      })}
    </div>
  );
}
