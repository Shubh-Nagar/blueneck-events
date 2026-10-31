import { useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ease } from '../../lib/motion';

/** Wraps each route: sets the document title and cross-fades between pages. */
export default function Page({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = title === 'Home' ? 'Blueneck Events — Corporate, Weddings, Activations' : `${title} — Blueneck Events`;
  }, [title]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease } }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
    >
      {children}
    </motion.div>
  );
}
