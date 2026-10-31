import type { Transition, Variants } from 'framer-motion';

/** The site's one easing curve: quick out, long settle — like a follow-spot landing. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const stage: Transition = { duration: 0.9, ease };

/** Line-by-line headline reveal (used once per page, on its title). */
export const lineReveal: Variants = {
  hidden: { y: '105%' },
  show: (i: number = 0) => ({ y: '0%', transition: { ...stage, delay: 0.15 + i * 0.09 } }),
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: (d: number = 0) => ({ opacity: 1, transition: { duration: 0.8, ease, delay: d } }),
};
