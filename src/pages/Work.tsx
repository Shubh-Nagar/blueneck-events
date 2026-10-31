import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Page from '../components/ui/Page';
import PageHero from '../components/ui/PageHero';
import Heading from '../components/ui/Heading';
import CountUp from '../components/ui/CountUp';
import WorkCard from '../components/work/WorkCard';
import ContactCta from '../components/home/ContactCta';
import { clients, services } from '../data/site';
import { cases, categories, type Category } from '../data/work';
import { ease } from '../lib/motion';

// Every third card is taller, which gives the masonry columns their stagger.
const aspectFor = (i: number) => (i % 3 === 1 ? 'aspect-[4/5]' : i % 3 === 2 ? 'aspect-[1/1]' : 'aspect-[3/2]');

export default function Work() {
  const [params, setParams] = useSearchParams();
  const active = (params.get('type') as Category | null) ?? null;

  const list = useMemo(() => (active ? cases.filter((c) => c.category === active) : cases), [active]);
  const counts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, cases.filter((x) => x.category === c.id).length])),
    [],
  );
  const stats = useMemo(() => {
    const cities = new Set(cases.map((c) => c.location?.split(',')[0].trim()).filter(Boolean));
    return [
      { figure: String(cases.length), label: 'Productions' },
      { figure: String(clients.length), label: 'Brands and bodies' },
      { figure: String(services.length), label: 'Event formats' },
      { figure: String(cities.size), label: 'Cities featured' },
    ];
  }, []);

  const choose = (id: Category | null) => {
    if (id) setParams({ type: id }, { replace: true, preventScrollReset: true });
    else setParams({}, { replace: true, preventScrollReset: true });
  };

  return (
    <Page title="Work">
      <PageHero
        lead="Our"
        accent="work"
        after={
          <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {stats.map((s, k) => (
              <motion.li
                key={s.label}
                className="rounded-[1.25rem] bg-white px-4 py-7 text-center shadow-[0_15px_40px_-20px_rgba(8,22,41,0.35)] ring-1 ring-ink/5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 + k * 0.08, duration: 0.6, ease } }}
              >
                <CountUp figure={s.figure} className="!text-[clamp(2rem,1.6rem+1.4vw,2.8rem)]" />
                <span className="mt-3 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink/55">{s.label}</span>
              </motion.li>
            ))}
          </ul>
        }
      >
        Productions across government, corporate, entertainment and sport, photographed on the day.
      </PageHero>

      <section className="bg-white pb-24 pt-6">
        <div className="shell">
          {/* Filters */}
          <LayoutGroup>
            <div
              role="tablist"
              aria-label="Filter by type of event"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {[
                { id: null as Category | null, label: 'All', n: cases.length },
                ...categories.map((c) => ({ ...c, n: counts[c.id] })),
              ].map((f) => {
                const on = active === f.id;
                return (
                  <button
                    key={f.label}
                    role="tab"
                    aria-selected={on}
                    onClick={() => choose(f.id)}
                    className={`relative shrink-0 rounded-full px-5 py-2.5 text-body-sm font-medium transition-colors duration-300 ${on ? 'text-white' : 'text-ink/70 hover:text-navy'}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="work-filter"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-navy to-cobalt shadow-[0_8px_20px_-8px_rgba(37,76,130,0.7)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    {!on && <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-ink/10" />}
                    <span className="relative">
                      {f.label} <span className={on ? 'text-white/65' : 'text-ink/35'}>{f.n}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          {/* Masonry */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active ?? 'all'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="mt-14 gap-10 sm:columns-2 lg:columns-3"
            >
              {list.map((c, i) => (
                <motion.div
                  key={c.slug}
                  className="mb-14 break-inside-avoid"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
                >
                  <WorkCard item={c} aspect={aspectFor(i)} sizes="small" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Clientele */}
      <section className="bg-[#F7F9FC] py-24 sm:py-32" aria-labelledby="brands-title">
        <div className="shell">
          <Heading id="brands-title" lead="Brands we’ve" accent="worked with">
            Brands, broadcasters, industry bodies and government departments.
          </Heading>
          <ul className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {clients.map((c, l) => (
              <motion.li
                key={c.src}
                className="group flex h-28 items-center justify-center rounded-2xl bg-white px-6 shadow-[0_10px_30px_-18px_rgba(8,22,41,0.35)] ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_20px_40px_-18px_rgba(37,76,130,0.5)] sm:h-32"
                initial={{ opacity: 0.8, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: (l % 10) * 0.02, duration: 0.4, type: 'spring', bounce: 0.3 }}
              >
                <img
                  src={c.src}
                  alt={c.name}
                  title={c.name || undefined}
                  loading="lazy"
                  width={c.w}
                  height={c.h}
                  className="max-h-[58%] max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta />
    </Page>
  );
}
