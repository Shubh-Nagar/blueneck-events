import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { company } from '../../data/site';
import { workMenu, type WorkIcon as WorkIconName } from '../../data/work';
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
  const [workOpen, setWorkOpen] = useState(false);
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false);
  const last = useRef(0);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname, search, hash } = useLocation();
  const glass = dark && !open;
  const here = pathname + search + hash;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setDark(overDarkCover());
      if (y > 240 && y > last.current + 4) {
        setHidden(true);
        setWorkOpen(false);
      } else if (y < last.current - 4 || y <= 240) setHidden(false);
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

  // Close the menus on navigation (including /work?type= filters) and lock scroll while the mobile one is open.
  useEffect(() => {
    setOpen(false);
    setWorkOpen(false);
    setHidden(false);
  }, [pathname, search, hash]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setWorkOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Hover opens the dropdown; a short grace period lets the pointer cross the gap to the panel.
  const showWork = () => {
    window.clearTimeout(closeTimer.current);
    setWorkOpen(true);
  };
  const hideWork = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setWorkOpen(false), 150);
  };

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
              const isWork = item.to === '/work';
              const link = (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  aria-haspopup={isWork ? 'true' : undefined}
                  aria-expanded={isWork ? workOpen : undefined}
                  className={`relative flex items-center gap-1.5 rounded-full px-5 py-2.5 text-body-sm font-medium tracking-wide transition-colors duration-300 ${
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
                  {isWork && (
                    <svg
                      viewBox="0 0 24 24"
                      className={`relative h-3.5 w-3.5 transition-transform duration-300 ${workOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </NavLink>
              );
              if (!isWork) return link;
              return (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={showWork}
                  onMouseLeave={hideWork}
                  onFocus={showWork}
                  onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && hideWork()}
                >
                  {link}
                  <AnimatePresence>
                    {workOpen && <WorkDropdown here={here} />}
                  </AnimatePresence>
                </div>
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
                    <div className="flex items-center justify-between gap-4">
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={`font-display text-[1.9rem] leading-tight ${isActive(item.to) ? 'text-cobalt' : 'text-ink'}`}
                      >
                        {item.label}
                      </NavLink>
                      {item.to === '/work' && (
                        <button
                          type="button"
                          onClick={() => setMobileWorkOpen((v) => !v)}
                          aria-expanded={mobileWorkOpen}
                          aria-controls="mobile-work-menu"
                          aria-label={mobileWorkOpen ? 'Hide types of work' : 'Show types of work'}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-ice/50 text-ink"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className={`h-5 w-5 transition-transform duration-300 ${mobileWorkOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden
                          >
                            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {item.to === '/work' && (
                      <AnimatePresence initial={false}>
                        {mobileWorkOpen && (
                          <motion.ul
                            id="mobile-work-menu"
                            className="overflow-hidden border-l-2 border-ice pl-5"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.4, ease } }}
                            exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease } }}
                          >
                            {workMenu.map((w) => (
                              <li key={w.to} className="first:pt-4">
                                <Link
                                  to={w.to}
                                  onClick={() => setOpen(false)}
                                  className={`flex items-center gap-3 py-1.5 text-body ${here === w.to ? 'font-semibold text-cobalt' : 'text-ink/70'}`}
                                >
                                  <WorkIcon name={w.icon} className="h-[1.15rem] w-[1.15rem] shrink-0 text-cobalt" />
                                  {w.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
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

/** Desktop "Work" panel: every kind of event we produce, two columns, plus the full gallery. */
function WorkDropdown({ here }: { here: string }) {
  return (
    <motion.div
      className="absolute left-1/2 top-full z-10 w-[40rem] pt-4"
      style={{ x: '-50%' }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease } }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.2, ease } }}
    >
      <div className="overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-[0_30px_70px_-20px_rgba(8,22,41,0.35)] ring-1 ring-ink/5">
        <ul className="grid grid-cols-2 gap-1">
          {workMenu.map((w) => {
            const on = here === w.to;
            return (
              <li key={w.to}>
                <Link
                  to={w.to}
                  className={`group flex items-center gap-3.5 rounded-2xl px-3.5 py-3 transition-colors duration-300 ${on ? 'bg-ice/50' : 'hover:bg-ice/30'}`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${on ? 'bg-navy text-white' : 'bg-ice/45 text-navy group-hover:bg-navy group-hover:text-white'}`}
                  >
                    <WorkIcon name={w.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-body-sm font-semibold text-ink group-hover:text-navy">{w.label}</span>
                    <span className="block text-[0.8rem] leading-snug text-ink/50">{w.note}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          to="/work"
          className="mt-2 flex items-center justify-between rounded-2xl bg-navy px-5 py-3.5 text-body-sm font-bold tracking-wide text-white transition-colors hover:bg-cobalt"
        >
          View all work
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

/** Line icons for the Work menu, drawn on a 24px grid in the header's stroke style. */
const WORK_ICONS: Record<WorkIconName, ReactNode> = {
  medical: (
    <>
      <path d="M5 3H4a1 1 0 0 0-1 1v5a5 5 0 0 0 10 0V4a1 1 0 0 0-1-1h-1" />
      <path d="M8 14v1a6 6 0 0 0 12 0v-3" />
      <circle cx="20" cy="10" r="2" />
    </>
  ),
  weddings: (
    <>
      <circle cx="9" cy="15" r="5" />
      <circle cx="15" cy="15" r="5" />
      <path d="M10 4h4l1.5 2L12 9 8.5 6z" />
    </>
  ),
  corporate: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2.5 13h19" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  sports: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 4M17 6h2.5a2.5 2.5 0 0 1-2.6 4" />
      <path d="M12 14v4M8 21h8M9.5 18h5" />
    </>
  ),
  government: (
    <>
      <path d="M12 2.5 20.5 7h-17z" />
      <path d="M5.5 10v7M9.8 10v7M14.2 10v7M18.5 10v7M3 21h18M4 17.5h16" />
    </>
  ),
  activations: (
    <>
      <path d="m3 10.5 15-5v13l-15-5z" />
      <path d="M18 9.5a3 3 0 0 1 0 5M7 14.5l1.2 4.5a1.5 1.5 0 0 0 2.9-.8l-.8-2.6" />
    </>
  ),
  exhibitions: (
    <>
      <path d="M3 9.5 4.6 4h14.8L21 9.5z" />
      <path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 12.5V20h14v-7.5M10 20v-4.5h4V20" />
    </>
  ),
  conferences: (
    <>
      <path d="M2 3.5h20M3.5 3.5V14a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V3.5" />
      <path d="m7.5 21 4.5-5 4.5 5M8 12l3-3 2.5 2L16.5 8" />
    </>
  ),
  auditions: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M18.5 10.5a6.5 6.5 0 0 1-13 0M12 17v4M8.5 21h7" />
    </>
  ),
};

function WorkIcon({ name, className = '' }: { name: WorkIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {WORK_ICONS[name]}
    </svg>
  );
}
