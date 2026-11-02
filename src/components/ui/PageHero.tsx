import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Heading from './Heading';

/**
 * Title block for light inner pages: a centred two-line title over a soft wash,
 * with outlined logo tiles turning slowly at the edges.
 */
export default function PageHero({
  lead,
  accent,
  children,
  after,
  image,
}: {
  lead: ReactNode;
  accent: ReactNode;
  children?: ReactNode;
  /** Optional content under the title (tabs, stats…), still inside the wash. */
  after?: ReactNode;
  /** Optional photograph behind the title, softened by the wash so the text stays legible. */
  image?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ice/40 via-[#F5F9FD] to-white pb-14 pt-36 sm:pb-20 sm:pt-44">
      {image && (
        <div aria-hidden className="absolute inset-0">
          <img src={image} alt="" fetchPriority="high" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/80 to-white" />
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.span
          className="absolute -left-24 top-24 block h-72 w-72"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        >
          <span className="tile block h-full w-full border-[1.5px] border-cobalt/15" />
        </motion.span>
        <motion.span
          className="absolute -right-20 top-10 block h-96 w-96"
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        >
          <span className="tile block h-full w-full border-[1.5px] border-dashed border-sky/30" />
        </motion.span>
        <motion.span
          className="tile absolute right-[18%] top-[38%] h-4 w-4 bg-sky/60"
          animate={reduce ? undefined : { y: [0, -16, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute left-[16%] top-[62%] h-2.5 w-2.5 rounded-full bg-cobalt/50"
          animate={reduce ? undefined : { y: [0, 14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="shell relative">
        <Heading level={1} lead={lead} accent={accent}>
          {children}
        </Heading>
        {after}
      </div>
    </section>
  );
}
