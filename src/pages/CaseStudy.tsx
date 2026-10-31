import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Page from '../components/ui/Page';
import Img from '../components/ui/Img';
import Lightbox from '../components/work/Lightbox';
import WorkCard from '../components/work/WorkCard';
import ContactCta from '../components/home/ContactCta';
import NotFound from './NotFound';
import { caseBySlug, cases, categoryLabel } from '../data/work';
import { fade, lineReveal } from '../lib/motion';

export default function CaseStudy() {
  const { slug = '' } = useParams();
  const item = caseBySlug(slug);
  const heroRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  if (!item) return <NotFound />;

  const idx = cases.findIndex((c) => c.slug === item.slug);
  const next = cases[(idx + 1) % cases.length];
  const related = cases.filter((c) => c.category === item.category && c.slug !== item.slug).slice(0, 2);
  const facts = [
    ['Client', item.client],
    ['Where', item.location],
    ['When', item.year],
    ['Type', categoryLabel(item.category)],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <Page title={item.title}>
      {/* Cover */}
      <section ref={heroRef} data-dark-cover className="relative flex min-h-[88svh] items-end overflow-hidden bg-ink">
        <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
          <img src={item.images[0].src} alt="" className="h-full w-full object-cover" fetchPriority="high" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35 sm:via-ink/55 sm:to-ink/20" />
        <div className="shell relative pb-14 pt-40 sm:pb-20">
          <motion.p variants={fade} initial="hidden" animate="show" custom={0.05} className="text-body-sm text-ice">
            <Link to={`/work?type=${item.category}`} className="link-draw">
              {categoryLabel(item.category)}
            </Link>
          </motion.p>
          <h1 className="mt-4 max-w-5xl font-display text-h1 text-paper text-balance">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span className="block" variants={lineReveal} initial="hidden" animate="show">
                {item.title}
              </motion.span>
            </span>
          </h1>
          {item.highlight && (
            <motion.p variants={fade} initial="hidden" animate="show" custom={0.4} className="mt-5 text-lead text-paper/80">
              {item.highlight}
            </motion.p>
          )}
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 sm:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 self-start rounded-[1.5rem] bg-gradient-to-br from-white to-ice/30 p-7 text-body-sm shadow-[0_25px_60px_-35px_rgba(37,76,130,0.55)] ring-1 ring-cobalt/15 lg:col-span-3 lg:grid-cols-1">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-ink/45">{k}</dt>
                <dd className="mt-1 text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="lg:col-span-6">
            {item.body.map((p, i) => (
              <p
                key={i}
                className={`text-pretty ${i === 0 ? 'font-display text-[clamp(1.4rem,1.1rem+1.1vw,2rem)] leading-[1.35] text-ink' : 'mt-7 text-body text-ink/70'}`}
              >
                {p}
              </p>
            ))}
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-body-sm text-ink/45">What we handled</h2>
            <ul className="mt-4 space-y-3 text-body-sm text-ink/80">
              {item.scope.map((s) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden className="tile mt-[0.45em] h-2 w-2 shrink-0 bg-cobalt" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {item.images.length > 1 && (
        <section className="bg-white pb-24" aria-label="Photographs">
          <div className="shell grid gap-4 sm:grid-cols-2 sm:gap-5">
            {item.images.slice(1).map((im, i, arr) => (
              <button
                key={im.src}
                onClick={() => setLightbox(i + 1)}
                className={`group block overflow-hidden rounded-2xl ${arr.length % 2 === 1 && i === 0 ? 'sm:col-span-2' : ''}`}
                aria-label={`Open photo ${i + 2} of ${item.images.length}`}
              >
                <Img
                  img={im}
                  alt=""
                  frameClassName={arr.length % 2 === 1 && i === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]'}
                  className="transition-transform duration-[1.2s] ease-stage group-hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>
          <div className="shell mt-6">
            <button onClick={() => setLightbox(0)} className="link-draw text-body-sm text-navy font-semibold">
              View all {item.images.length} photos full screen
            </button>
          </div>
        </section>
      )}

      {/* Next / related */}
      <section className="border-t border-ink/10 bg-white py-20 sm:py-28">
        <div className="shell">
          <Link
            to={`/work/${next.slug}`}
            className="group relative block h-[22rem] overflow-hidden rounded-[2rem] bg-ink shadow-[0_40px_90px_-40px_rgba(8,22,41,0.6)] sm:h-[26rem]"
          >
            <img
              src={next.images[0].src}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[1.6s] ease-stage group-hover:scale-105"
              style={{ backgroundColor: next.images[0].tone }}
            />
            <span className="absolute inset-0 bg-gradient-to-tr from-ink/90 via-ink/40 to-transparent" />
            <span className="absolute inset-x-8 bottom-8 sm:inset-x-12 sm:bottom-12">
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-ice">Next production</span>
              <span className="mt-3 flex items-end justify-between gap-6">
                <span className="font-display text-h2 text-white">{next.title}</span>
                <span className="mb-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 ease-stage group-hover:translate-x-1">
                  →
                </span>
              </span>
            </span>
          </Link>
          {related.length > 0 && (
            <>
              <h2 className="mt-20 text-body-sm text-ink/50">More {categoryLabel(item.category).toLowerCase()}</h2>
              <div className="mt-6 grid gap-10 md:grid-cols-2">
                {related.map((c) => (
                  <WorkCard key={c.slug} item={c} sizes="small" aspect="aspect-[3/2]" />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <ContactCta />

      <Lightbox
        images={item.images}
        index={lightbox}
        title={item.title}
        onClose={() => setLightbox(null)}
        onIndex={setLightbox}
      />
    </Page>
  );
}
