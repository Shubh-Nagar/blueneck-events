import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import Page from '../components/ui/Page';
import PageHero from '../components/ui/PageHero';
import { ArrowLink } from '../components/ui/Heading';
import WorkCard from '../components/work/WorkCard';
import ContactCta from '../components/home/ContactCta';
import { ButtonLink } from '../components/ui/Button';
import { services } from '../data/site';
import { caseBySlug } from '../data/work';
import { ease } from '../lib/motion';

/** How long each tab stays open before the next one takes over, in seconds. */
const TAB_SECONDS = 3;

/** Showcase deck: cards per side stack, and each depth's offset (% of card width), scale and veil. */
const DECK_DEPTH = 3;
const DECK_SLOTS = [
  { x: 0, scale: 1, veil: 0 },
  { x: 12, scale: 0.92, veil: 0.12 },
  { x: 21, scale: 0.84, veil: 0.22 },
  { x: 29, scale: 0.76, veil: 0.32 },
];
const DECK_HIDDEN = { x: 35, scale: 0.7, veil: 0.4 };

/** Is any part of the element inside the viewport? Read live, so remounted nodes are fine. */
const onScreen = (el: HTMLElement | null) => {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
};

/**
 * Every format as a tab. The chosen one opens as a single showcase card (photo cut
 * on the diagonal, story beside it) with its productions underneath. The tab lives
 * in the URL hash, so links like /expertise#weddings land on the right one.
 */
export default function Expertise() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const stage = useRef<HTMLDivElement>(null);
  const slug = hash.slice(1);
  const index = Math.max(
    0,
    services.findIndex((s) => s.slug === slug),
  );
  const s = services[index];
  const examples = s.cases.map(caseBySlug).filter((c): c is NonNullable<typeof c> => !!c);

  // Arriving from a deep link: bring the showcase into view once the page has rendered.
  useEffect(() => {
    if (!slug || !stage.current) return;
    const el = stage.current;
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    // Only on first arrival, not on every tab click.
  }, []);

  const choose = (to: string) => navigate({ hash: to }, { replace: true, preventScrollReset: true });

  // Autoplay: the active tab fills left to right, then hands over to the next one.
  // Keeps going on hover; only pauses while the tabs and the card are both off-screen.
  const reduce = useReducedMotion();
  const tablist = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    progress.set(0);
    // Keep the active tab visible in the scrollable strip on small screens.
    const list = tablist.current;
    const tab = list?.children[index] as HTMLElement | undefined;
    if (list && tab && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [index, progress]);

  useAnimationFrame((_, delta) => {
    if (reduce || !(onScreen(tablist.current) || onScreen(stage.current))) return;
    const next = progress.get() + Math.min(delta, 250) / 1000 / TAB_SECONDS;
    if (next < 1) return progress.set(next);
    progress.set(1);
    choose(services[(index + 1) % services.length].slug);
  });

  return (
    <Page title="Expertise">
      <PageHero
        lead="Every format,"
        accent="one team"
        after={
          <LayoutGroup>
            <div
              ref={tablist}
              role="tablist"
              aria-label="Expertise"
              className="relative -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-auto sm:max-w-5xl sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {services.map((x, k) => {
                const on = k === index;
                return (
                  <button
                    key={x.slug}
                    role="tab"
                    aria-selected={on}
                    aria-controls="expertise-panel"
                    onClick={() => choose(x.slug)}
                    className={`relative shrink-0 rounded-full px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                      on ? 'text-white' : 'text-ink/70 hover:text-navy'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="expertise-tab"
                        className="absolute inset-0 overflow-hidden rounded-full bg-gradient-to-r from-navy to-cobalt shadow-[0_8px_20px_-8px_rgba(37,76,130,0.7)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        {/* Loader: a lighter sweep that fills the pill while this tab is on show. */}
                        {!reduce && (
                          <motion.span
                            aria-hidden
                            className="absolute inset-0 origin-left bg-white/25"
                            style={{ scaleX: progress }}
                          />
                        )}
                      </motion.span>
                    )}
                    <span className="relative">{x.name}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        }
      >
        Corporate, weddings and activations, plus the public ceremonies, shows, auditions, sport and conferences in between.
      </PageHero>

      <section className="overflow-hidden bg-white pb-10" aria-live="polite">
        <div ref={stage} id="expertise-panel" role="tabpanel" className="shell scroll-mt-28">
          {/* Deck: the current service in front, past ones stacked left, next ones stacked right. */}
          <motion.div
            className="relative mx-auto grid max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.2 } }}
          >
            {services.map((x, k) => {
              const n = services.length;
              // Signed distance from the current tab, wrapped into [-n/2, n/2].
              const o = ((((k - index) % n) + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
              const d = Math.abs(o);
              const slot = d <= DECK_DEPTH ? DECK_SLOTS[d] : DECK_HIDDEN;
              const front = o === 0;
              return (
                <motion.div
                  key={x.slug}
                  className={`relative [grid-area:1/1] ${front ? '' : 'cursor-pointer'}`}
                  style={{ zIndex: 20 - d }}
                  initial={false}
                  animate={{ x: `${Math.sign(o) * slot.x}%`, scale: slot.scale, opacity: d <= DECK_DEPTH ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.8, ease }}
                  onClick={front ? undefined : () => choose(x.slug)}
                  aria-hidden={!front || undefined}
                >
                  <div inert={!front} className="h-full">
                    <ServiceCard service={x} number={k + 1} />
                  </div>
                  {/* Veil: cards deeper in a stack recede. */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[2rem] bg-ink"
                    initial={false}
                    animate={{ opacity: slot.veil }}
                    transition={{ duration: reduce ? 0 : 0.8, ease }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {examples.length > 0 && (
            <div className="mx-auto mt-20 max-w-6xl">
              <p className="text-center text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-cobalt">
                {s.name}, delivered
              </p>
              <AnimatePresence mode="wait">
                <motion.ul
                  key={s.slug}
                  className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  {examples.slice(0, 6).map((c, k) => (
                    <motion.li
                      key={c.slug}
                      variants={{
                        hidden: { opacity: 0, y: 40 },
                        show: { opacity: 1, y: 0, transition: { delay: k * 0.08, duration: 0.6, ease } },
                      }}
                    >
                      <WorkCard item={c} sizes="small" aspect="aspect-[4/3]" />
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          )}

          <p className="mt-16 text-center text-body-sm text-ink/50">
            Not sure which fits?{' '}
            <Link to="/contact" className="link-draw font-semibold text-navy">
              Tell us about the occasion
            </Link>
            .
          </p>
        </div>
      </section>

      <ContactCta lead="Ready to set" accent="the stage?" />
    </Page>
  );
}

/** One service as a showcase card: photo cut on the diagonal, story beside it. */
function ServiceCard({ service: s, number }: { service: (typeof services)[number]; number: number }) {
  const examples = s.cases.map(caseBySlug).filter((c): c is NonNullable<typeof c> => !!c);
  const cover = examples[0]?.images[0];
  return (
    <div className="h-full overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_90px_-40px_rgba(8,22,41,0.45)] ring-1 ring-ink/5">
      <div className="grid h-full md:grid-cols-[1.15fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden bg-navy md:aspect-auto md:min-h-[30rem] md:[clip-path:polygon(0_0,100%_0,86%_100%,0_100%)]">
          {cover ? (
            <img
              src={cover.src}
              alt={examples[0]!.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ backgroundColor: cover.tone }}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy to-ink">
              <img src="/brand/blueneck-mark.png" alt="" className="w-1/3" />
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-12">
          <span className="font-display text-body-sm text-cobalt">
            {String(number).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,1.5rem+2vw,3.2rem)] font-bold leading-[1.02] text-ink text-balance">
            {s.name}
          </h2>
          <p className="mt-6 text-body leading-relaxed text-ink/65 text-pretty">{s.summary}</p>
          <div className="mt-10">
            {examples.length > 0 ? (
              <ArrowLink to={`/work?type=${examples[0].category}`}>View gallery</ArrowLink>
            ) : (
              <ButtonLink to={`/contact?type=${s.slug}`}>Talk to us about your {s.name.toLowerCase()}</ButtonLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
