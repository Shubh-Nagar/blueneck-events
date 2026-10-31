import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Page from '../components/ui/Page';
import PageHero from '../components/ui/PageHero';
import { ArrowLink } from '../components/ui/Heading';
import WorkCard from '../components/work/WorkCard';
import ContactCta from '../components/home/ContactCta';
import { ButtonLink } from '../components/ui/Button';
import { services } from '../data/site';
import { caseBySlug } from '../data/work';
import { ease } from '../lib/motion';

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
  const cover = examples[0]?.images[0];

  // Arriving from a deep link: bring the showcase into view once the page has rendered.
  useEffect(() => {
    if (!slug || !stage.current) return;
    const el = stage.current;
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    // Only on first arrival, not on every tab click.
  }, []);

  const choose = (to: string) => navigate({ hash: to }, { replace: true, preventScrollReset: true });

  return (
    <Page title="Expertise">
      <PageHero
        lead="Every format,"
        accent="one team"
        after={
          <LayoutGroup>
            <div
              role="tablist"
              aria-label="Expertise"
              className="-mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-auto sm:max-w-5xl sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
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
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-navy to-cobalt shadow-[0_8px_20px_-8px_rgba(37,76,130,0.7)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
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

      <section className="bg-white pb-10" aria-live="polite">
        <div ref={stage} id="expertise-panel" role="tabpanel" className="shell scroll-mt-28">
          <motion.div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_90px_-40px_rgba(8,22,41,0.45)] ring-1 ring-ink/5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.2 } }}
          >
            <div className="grid md:grid-cols-[1.15fr_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden bg-navy md:aspect-auto md:min-h-[30rem] md:[clip-path:polygon(0_0,100%_0,86%_100%,0_100%)]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={s.slug}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.9, ease } }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  >
                    {cover ? (
                      <img
                        src={cover.src}
                        alt={examples[0]!.title}
                        className="h-full w-full object-cover"
                        style={{ backgroundColor: cover.tone }}
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy to-ink">
                        <img src="/brand/blueneck-mark.png" alt="" className="w-1/3" />
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={s.slug}
                  className="flex flex-col justify-center p-8 sm:p-12"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease } }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                >
                  <span className="font-display text-body-sm text-cobalt">
                    {String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
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
                </motion.div>
              </AnimatePresence>
            </div>
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
