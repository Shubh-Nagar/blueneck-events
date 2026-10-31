import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { company } from '../../data/site';
import { ease } from '../../lib/motion';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Our story' },
  { to: '/expertise', label: 'Expertise' },
  { to: '/work', label: 'Work' },
  { to: '/careers', label: 'Careers' },
];

/** Is a dark cover (marked `data-dark-cover` by the page) still under the bar? */
const overDarkCover = () => {
  const cover = document.querySelector('[data-dark-cover]');
  return !!cover && cover.getBoundingClientRect().bottom > 90;
};

/**
 * A floating pill. While a page's dark cover (film, photograph) is behind it, it is
 * clear glass with white type; past the cover, and on light pages, it turns white. It slips away while reading down and
 * returns as soon as the reader scrolls back up.
 */
export default function Header() {
  const [dark, setDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const { pathname } = useLocation();
  const glass = dark && !open;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setDark(overDarkCover());
      if (y > 240 && y > last.current + 4) setHidden(true);
      else if (y < last.current - 4 || y <= 240) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // Pages load lazily and cross-fade, so re-check whenever the DOM settles.
    const mo = new MutationObserver(() => setDark(overDarkCover()));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      mo.disconnect();
    };
  }, []);

  // Close the menu on navigation and lock scroll while it is open.
  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
        animate={{ y: hidden && !open ? -140 : 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Desktop pill */}
        <div
          className={`pointer-events-auto mt-5 hidden w-[95vw] max-w-[1200px] items-center justify-between rounded-full py-2 pl-6 pr-2 transition-[background-color,box-shadow] duration-500 lg:flex ${
            glass
              ? 'bg-white/10 ring-1 ring-inset ring-white/20 backdrop-blur-md'
              : 'bg-white/95 shadow-[0_10px_40px_-12px_rgba(8,22,41,0.25)] ring-1 ring-inset ring-ink/5 backdrop-blur-xl'
          }`}
        >
          <Link
            to="/"
            aria-label="Blueneck Events, home"
            className="shrink-0 transition-transform duration-300 hover:scale-[1.03]"
          >
            <Logo tone={glass ? 'light' : 'dark'} />
          </Link>

          <nav aria-label="Main" className="flex items-center gap-1">
            {nav.map((item) => {
              const on = isActive(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={`relative rounded-full px-5 py-2.5 text-body-sm font-medium tracking-wide transition-colors duration-300 ${
                    glass
                      ? on
                        ? 'text-white'
                        : 'text-white/85 hover:text-white'
                      : on
                        ? 'text-navy'
                        : 'text-ink/60 hover:text-navy'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 -z-10 rounded-full ${glass ? 'bg-white/20' : 'bg-ice/60'}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className={`ml-4 border-l pl-4 ${glass ? 'border-white/20' : 'border-ink/10'}`}>
            <Link
              to="/contact"
              className={`inline-flex h-12 items-center rounded-full px-7 text-body-sm font-bold tracking-wide shadow-md transition-colors duration-300 ${
                glass ? 'bg-white text-navy hover:bg-navy hover:text-white' : 'bg-navy text-white hover:bg-cobalt'
              }`}
            >
              Plan an event
            </Link>
          </div>
        </div>

        {/* Mobile bar */}
        <div
          className={`pointer-events-auto flex w-full items-center justify-between px-5 py-3 transition-[background-color,box-shadow] duration-500 sm:px-8 lg:hidden ${
            glass ? 'bg-ink/25 backdrop-blur-md' : 'bg-white/95 shadow-[0_4px_20px_-5px_rgba(8,22,41,0.12)] backdrop-blur-xl'
          }`}
        >
          <Link to="/" aria-label="Blueneck Events, home">
            <Logo tone={glass ? 'light' : 'dark'} />
          </Link>
          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-full ${glass ? 'bg-white/20 text-white' : 'bg-ice/50 text-ink'}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="flex flex-col items-end gap-[5px]">
              <span className="h-[1.5px] w-6 bg-current" />
              <span className="h-[1.5px] w-4 bg-current" />
              <span className="h-[1.5px] w-5 bg-current" />
            </span>
          </button>
        </div>
      </motion.header>

      {/* Outside the header: its hide/show transform would otherwise trap these fixed layers. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-[61] flex w-[90%] max-w-sm flex-col overflow-hidden rounded-l-[2.5rem] bg-white shadow-2xl lg:hidden"
              initial={{ clipPath: 'circle(0px at 100% 0%)' }}
              animate={{ clipPath: 'circle(150% at 100% 0%)', transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] } }}
              exit={{ clipPath: 'circle(0px at 100% 0%)', transition: { duration: 0.45, ease } }}
            >
              <span aria-hidden className="tile pointer-events-none absolute -right-20 top-[12%] h-72 w-72 bg-ice/40" />
              <div className="relative flex items-center justify-between border-b border-cobalt/10 px-8 py-5">
                <Logo tone="dark" compact />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ink transition-shadow hover:shadow-md"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <nav aria-label="Mobile" className="relative flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-10">
                {[...nav, { to: '/contact', label: 'Contact' }].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: 0.15 + i * 0.05, duration: 0.5, ease } }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={`font-display text-[1.9rem] leading-tight ${isActive(item.to) ? 'text-cobalt' : 'text-ink'}`}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="relative border-t border-cobalt/10 px-8 py-6">
                <Link
                  to="/contact"
                  className="flex h-12 items-center justify-center rounded-full bg-navy text-body-sm font-bold tracking-wide text-white"
                >
                  Plan an event
                </Link>
                <p className="mt-4 text-center text-[0.8rem] text-ink/50">{company.tagline.join(' · ')}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
