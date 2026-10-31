import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ease } from '../../lib/motion';
import { useRevealed } from '../../lib/reveal';

/**
 * Wraps each route: sets the document title and cross-fades between pages.
 *
 * A page that mounts behind the loader's curtain renders straight away (so its images
 * and film start loading), then remounts its content once the curtain lifts, so every
 * entrance animation plays in view rather than hidden underneath.
 */
export default function Page({ title, children }: { title: string; children: ReactNode }) {
  const revealed = useRevealed();
  // Latches: once live, a page never replays (e.g. while it is being covered on the way out).
  const [live, setLive] = useState(revealed);
  useEffect(() => {
    if (revealed) setLive(true);
  }, [revealed]);

  useEffect(() => {
    document.title = title === 'Home' ? 'Blueneck Events — Corporate, Weddings, Activations' : `${title} — Blueneck Events`;
  }, [title]);

  // Tell the page loader this route has rendered, so it can lift its curtain.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('page:ready'));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease } }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
    >
      <Fragment key={live ? 'live' : 'waiting'}>{children}</Fragment>
    </motion.div>
  );
}
