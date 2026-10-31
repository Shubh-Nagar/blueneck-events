import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLink } from '../ui/Heading';
import { ease } from '../../lib/motion';

/** Closing call to action, shared by most pages: one glassy card, one line, one link. */
export default function ContactCta({ lead = 'Have a date', accent = 'in mind?' }: { lead?: string; accent?: string }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:py-28" aria-labelledby="cta-title">
      <motion.div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-ice/40 via-white to-ice/30 px-6 py-16 text-center shadow-[0_30px_80px_-40px_rgba(37,76,130,0.45)] ring-1 ring-cobalt/15 sm:px-12 sm:py-20"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease }}
      >
        <motion.span
          aria-hidden
          className="tile absolute left-[8%] top-10 h-6 w-6 bg-sky/50"
          animate={reduce ? undefined : { y: [0, -12, 0], rotate: [45, 60, 45] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          aria-hidden
          className="tile absolute bottom-10 right-[10%] h-10 w-10 bg-cobalt/25"
          animate={reduce ? undefined : { y: [0, 14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span aria-hidden className="tile absolute -right-10 -top-10 h-40 w-40 bg-ice/40" />

        <h2
          id="cta-title"
          className="relative font-display text-[clamp(2.2rem,1.4rem+3.2vw,4.5rem)] leading-[1.02] text-ink text-balance"
        >
          {lead} <span className="text-shine font-semibold">{accent}</span>
        </h2>
        <p className="relative mx-auto mt-6 max-w-xl text-body text-ink/60">
          Tell us the occasion, the city and roughly how many guests. We will come back with a plan.
        </p>
        <div className="relative mt-10 flex justify-center">
          <ArrowLink to="/contact">Start planning</ArrowLink>
        </div>
      </motion.div>
    </section>
  );
}
