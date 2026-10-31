import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { company } from '../../data/site';
import { caseBySlug } from '../../data/work';
import Heading, { ArrowLink } from '../ui/Heading';
import { ease } from '../../lib/motion';

/** Who we are. Two photographs overlap and slide past each other as the page scrolls. */
export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 45, damping: 22 });
  const backY = useTransform(p, [0, 1], ['-15%', '15%']);
  const frontY = useTransform(p, [0, 1], ['12%', '-12%']);

  const back = caseBySlug('modi-at-20')!.images[0];
  const front = caseBySlug('bhaskar-utsav')!.images[0];

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
            <img
              src={back.src}
              alt=""
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
              style={{ backgroundColor: back.tone }}
            />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-[56%] overflow-hidden rounded-2xl shadow-[0_40px_80px_-20px_rgba(8,22,41,0.45)] ring-4 ring-white"
            style={{ y: reduce ? 0 : frontY }}
          >
            <img
              src={front.src}
              alt=""
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
              style={{ backgroundColor: front.tone }}
            />
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
