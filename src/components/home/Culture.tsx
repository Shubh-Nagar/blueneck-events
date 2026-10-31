import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { officeImage } from '../../data/site';
import { ArrowLink } from '../ui/Heading';
import { ease } from '../../lib/motion';

/** The team behind the curtain: one big framed photograph that drifts inside its frame. */
export default function Culture() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 45, damping: 22 });
  const y = useTransform(p, [0, 1], ['-15%', '15%']);
  const textY = useTransform(p, [0, 1], ['8%', '-8%']);

  return (
    <section ref={ref} className="relative bg-white px-4 py-8 md:px-8 md:py-12" aria-labelledby="culture-title">
      <motion.div
        className="relative mx-auto h-[640px] max-w-[95rem] overflow-hidden rounded-[2rem] bg-ink shadow-2xl md:h-[85vh] md:rounded-[3rem]"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease }}
      >
        <motion.div className="absolute inset-x-0 -top-[15%] h-[130%]" style={{ y: reduce ? 0 : y }}>
          <img
            src={officeImage.src}
            alt="The Blueneck Events studio in Indore"
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ backgroundColor: officeImage.tone }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-tr from-ink/90 via-ink/45 to-transparent" />

        <motion.div
          className="absolute inset-x-6 bottom-10 max-w-2xl md:inset-x-16 md:bottom-16"
          style={{ y: reduce ? 0 : textY }}
        >
          <p className="text-[0.75rem] uppercase tracking-[0.3em] text-ice/80">Indore · Pan India</p>
          <h2 id="culture-title" className="mt-5 font-display text-[clamp(2.6rem,1.6rem+4vw,5.5rem)] leading-[0.98] text-white">
            The team
            <br />
            <span className="italic text-ice">behind the curtain</span>
          </h2>
          <p className="mt-6 max-w-lg text-body text-white/75">
            Planners, designers and production crew, led by three directors with close to sixty years of event management between
            them.
          </p>
          <div className="mt-10">
            <ArrowLink to="/about" tone="light">
              Meet the team
            </ArrowLink>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
