import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { caseBySlug } from '../../data/work';
import { company } from '../../data/site';
import { setRevealed } from '../../lib/reveal';

/**
 * Page loader, built from the logo.
 *
 * First visit: a navy stage where the petal burst assembles around the BN disc, a line
 * fills, then the whole curtain lifts away.
 *
 * Between pages: internal link clicks are held back while a two-tone curtain rises from
 * the bottom; once it covers the screen the route changes behind it, and the curtain
 * lifts off the top as soon as the new page announces it has rendered (`page:ready`).
 * Back/forward can't be held back, so there the curtain appears already closed and lifts.
 */
type Phase = 'intro' | 'cover' | 'hold' | 'idle';

const EASE = [0.76, 0, 0.24, 1] as const;
const TITLES: Record<string, string> = {
  '/': 'Home',
  '/about': 'Our story',
  '/expertise': 'Expertise',
  '/work': 'Work',
  '/contact': 'Plan an event',
};

const titleFor = (path: string) => {
  if (TITLES[path]) return TITLES[path];
  const m = path.match(/^\/work\/([^/]+)/);
  return (m && caseBySlug(m[1])?.title) || 'Blueneck Events';
};

export default function PageLoader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('intro');
  const [label, setLabel] = useState('');
  // How the curtain enters this time: rising from below, or already in place.
  const [instant, setInstant] = useState(true);
  const pending = useRef<string | null>(null);
  const ours = useRef(false);
  const lastPath = useRef(pathname);
  const shownAt = useRef(0);
  const phaseRef = useRef<Phase>('intro');
  phaseRef.current = phase;

  // Pages start their entrance animations when this flips to true: a moment into the
  // curtain's lift, so they play as the content comes into view. While the curtain is
  // only closing over the old page, that page stays as it is.
  useEffect(() => {
    if (phase === 'cover') return setRevealed(true);
    if (phase !== 'idle') return setRevealed(false);
    const id = window.setTimeout(() => setRevealed(true), reduce ? 0 : 300);
    return () => window.clearTimeout(id);
  }, [phase, reduce]);

  // Back/forward: flag it before React renders the new route, so that page waits too.
  useEffect(() => {
    const onPop = () => {
      // Hash-only steps (same page) bring no curtain, so leave the flag alone.
      if (window.location.pathname !== lastPath.current) setRevealed(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // First visit: hold for the intro (and until the window has loaded), then lift.
  useEffect(() => {
    const min = reduce ? 500 : 2100;
    const start = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, min - (performance.now() - start));
      window.setTimeout(() => setPhase('idle'), wait);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const cap = window.setTimeout(finish, 4000);
    return () => {
      window.removeEventListener('load', finish);
      window.clearTimeout(cap);
    };
  }, [reduce]);

  // Hold internal link clicks until the curtain has closed.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (hash or filter changes) needs no curtain.
      if (url.pathname === window.location.pathname) return;
      e.preventDefault();
      // Mid-transition: the click is swallowed rather than queued.
      if (pending.current || phaseRef.current !== 'idle') return;
      pending.current = url.pathname + url.search + url.hash;
      setLabel(titleFor(url.pathname));
      setInstant(false);
      setPhase('cover');
    };
    // Capture phase, so this runs before React Router's own link handler (which then
    // sees `defaultPrevented` and stands down).
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Route changes we didn't start (back/forward): close instantly, then lift when ready.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (ours.current) {
      ours.current = false;
      return;
    }
    if (phase === 'intro') return;
    setLabel(titleFor(pathname));
    setInstant(true);
    shownAt.current = performance.now();
    setPhase('hold');
  }, [pathname, phase]);

  // While holding, lift as soon as the new page has rendered (with a short minimum so
  // the mark is seen, and a cap in case a page never reports in).
  useEffect(() => {
    if (phase !== 'hold') return;
    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      const wait = Math.max(0, (reduce ? 150 : 650) - (performance.now() - shownAt.current));
      window.setTimeout(() => setPhase('idle'), wait);
    };
    window.addEventListener('page:ready', lift);
    const cap = window.setTimeout(lift, 3000);
    return () => {
      window.removeEventListener('page:ready', lift);
      window.clearTimeout(cap);
    };
  }, [phase, reduce]);

  // The curtain has closed: change route behind it.
  const onCovered = () => {
    if (phase !== 'cover' || !pending.current) return;
    const to = pending.current;
    pending.current = null;
    ours.current = true;
    shownAt.current = performance.now();
    setPhase('hold');
    navigate(to);
  };

  const show = phase !== 'idle';
  const intro = phase === 'intro';
  const closed = 'inset(0% 0% 0% 0%)';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100]"
          role="status"
          aria-live="polite"
          aria-label={intro ? 'Loading Blueneck Events' : `Loading ${label}`}
        >
          {/* Leading cobalt sheet: rises a beat ahead of the navy, gives the wipe depth. */}
          {!intro && !reduce && (
            <motion.div
              className="absolute inset-0 bg-cobalt/85 backdrop-blur-md"
              initial={instant ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: closed, transition: { duration: 0.55, ease: EASE } }}
              exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.7, ease: EASE, delay: 0.12 } }}
            />
          )}

          <motion.div
            className="absolute inset-0 overflow-hidden bg-navy/55 backdrop-blur-2xl"
            initial={intro || instant ? false : reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={
              reduce
                ? { opacity: 1, transition: { duration: 0.25 } }
                : { clipPath: closed, transition: { duration: 0.6, ease: EASE, delay: 0.08 } }
            }
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.3 } }
                : { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.75, ease: EASE } }
            }
            onAnimationComplete={onCovered}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(83,125,190,0.75)_0%,rgba(37,76,130,0.8)_55%,rgba(14,34,64,0.85)_100%)]"
            />
            <div aria-hidden className="grain absolute inset-0" />

            <motion.div
              className="relative flex h-full flex-col items-center justify-center px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: intro ? 0.1 : 0.35 } }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.35 } }}
            >
              <Burst intro={intro} reduce={!!reduce} />

              <div className="mt-10 overflow-hidden pb-1 text-center">
                <motion.p
                  className="font-display text-[clamp(1.6rem,1.1rem+2vw,2.6rem)] leading-tight text-white"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%', transition: { duration: 0.8, ease: EASE, delay: intro ? 0.9 : 0.45 } }}
                >
                  {intro ? (
                    <>
                      From ground&#8209;breakings <span className="italic text-ice">to grand finales.</span>
                    </>
                  ) : (
                    // The three formats, divided like the line under the logo. (The page
                    // being loaded is still announced to screen readers via aria-label.)
                    <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:gap-x-6">
                      {company.tagline.map((t, i) => (
                        <span key={t} className="flex items-center gap-4 sm:gap-6">
                          {i > 0 && <span aria-hidden className="inline-block h-[0.85em] w-[2px] rounded-full bg-sky" />}
                          {t}
                        </span>
                      ))}
                    </span>
                  )}
                </motion.p>
              </div>

              {/* Progress: fills once on the intro, shimmers while a page loads. */}
              <div className="mt-8 h-[2px] w-40 overflow-hidden rounded-full bg-white/15">
                {intro ? (
                  <motion.div
                    className="h-full origin-left bg-gradient-to-r from-sky to-ice"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1, transition: { duration: reduce ? 0.4 : 1.9, ease: [0.65, 0, 0.35, 1] } }}
                  />
                ) : (
                  <div className="h-full w-1/2 animate-[loaderbar_1s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-ice to-transparent" />
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The logo's sunburst, assembling petal by petal and turning, around the BN disc. */
function Burst({ intro, reduce }: { intro: boolean; reduce: boolean }) {
  const rings = [
    { n: 12, r: 0.33, size: 0.085, offset: 0.5, color: '#75A6D8', spin: 'animate-[spin_14s_linear_infinite]' },
    { n: 24, r: 0.44, size: 0.06, offset: 0, color: '#BBD9F2', spin: 'animate-[spin_22s_linear_infinite_reverse]' },
  ];
  const base = intro ? 0.15 : 0.3;
  return (
    <div className="relative h-44 w-44 sm:h-60 sm:w-60">
      {rings.map((ring, ri) => (
        <div key={ri} className={`absolute inset-0 ${reduce ? '' : ring.spin}`}>
          {Array.from({ length: ring.n }, (_, k) => {
            const deg = ((k + ring.offset) / ring.n) * 360 - 90;
            const a = (deg * Math.PI) / 180;
            return (
              <motion.span
                key={k}
                className="absolute block"
                style={{
                  width: `${ring.size * 100}%`,
                  height: `${ring.size * 100}%`,
                  left: `${(0.5 + Math.cos(a) * ring.r - ring.size / 2) * 100}%`,
                  top: `${(0.5 + Math.sin(a) * ring.r - ring.size / 2) * 100}%`,
                  backgroundColor: ring.color,
                  borderRadius: '22%',
                  rotate: deg + 45,
                }}
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: ri === 1 ? 0.75 : 1,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: base + ri * 0.2 + k * (0.45 / ring.n) },
                }}
              />
            );
          })}
        </div>
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[46%] w-[46%] overflow-hidden rounded-full bg-navy shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]"
        style={{ x: '-50%', y: '-50%' }}
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: intro ? 0 : 0.2 } }}
      >
        {/* The mark image's disc is 48.75% of its width; scale it so the disc fills this circle. */}
        <img
          src="/brand/blueneck-mark.png"
          alt=""
          className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
          style={{ width: `${100 / 0.4875}%` }}
        />
      </motion.div>
    </div>
  );
}
