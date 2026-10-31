import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clients, scale } from '../../data/site';
import Heading, { ArrowLink } from '../ui/Heading';
import CountUp from '../ui/CountUp';

/**
 * The logo's sunburst, as fractions of its box: sky petals inside, mist and ice outside
 * (the logo's own light blues, in its order).
 */
const PETAL_RINGS = [
  { n: 12, r: 0.228, size: 0.04, offset: 0.5, color: '#75A6D8', opacity: 0.55 },
  { n: 12, r: 0.3, size: 0.092, offset: 0, color: '#89BBE5', opacity: 0.45 },
  { n: 24, r: 0.4, size: 0.056, offset: 0.5, color: '#BBD9F2', opacity: 0.7 },
  { n: 24, r: 0.468, size: 0.036, offset: 0, color: '#BBD9F2', opacity: 0.5 },
];

/** Client logos in two drifting rows, then the scale figures counting up. */
export default function Clients() {
  // Split the logos in half so no client appears in both rows.
  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)];

  return (
    <section className="relative z-10 overflow-hidden bg-white py-20 md:py-32" aria-labelledby="clients-title">
      {/* The logo's petal burst in its light blues, turning slowly and continuously behind the heading. */}
      {/* A CSS spin rather than a JS loop: it runs on the compositor and never stalls. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 -top-16 h-[46rem] w-[46rem] animate-[spin_90s_linear_infinite] opacity-[0.38] md:-left-40"
      >
        <span className="absolute left-1/2 top-1/2 h-[36.8%] w-[36.8%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-ice bg-ice/15" />
        {PETAL_RINGS.flatMap((ring, ri) =>
          Array.from({ length: ring.n }, (_, k) => {
            const deg = ((k + ring.offset) / ring.n) * 360 - 90;
            const a = (deg * Math.PI) / 180;
            return (
              <span
                key={`${ri}-${k}`}
                className="absolute block"
                style={{
                  width: `${ring.size * 100}%`,
                  height: `${ring.size * 100}%`,
                  left: `${(0.5 + Math.cos(a) * ring.r - ring.size / 2) * 100}%`,
                  top: `${(0.5 + Math.sin(a) * ring.r - ring.size / 2) * 100}%`,
                  backgroundColor: ring.color,
                  opacity: ring.opacity,
                  borderRadius: '22%',
                  // Each petal points outward from the centre, as in the logo.
                  transform: `rotate(${deg + 45}deg)`,
                }}
              />
            );
          }),
        )}
      </div>

      <div className="shell relative">
        <Heading id="clients-title" lead="The names" accent="behind our stages">
          Brands, broadcasters, industry bodies and government departments we have{' '}
          <em className="font-display text-cobalt">built moments with</em>.
        </Heading>
      </div>

      {/* Two rows, each with its own half of the logos: the top drifts right, the bottom left. */}
      <div className="relative mt-14 space-y-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:mt-20 md:space-y-10">
        {rows.map((row, r) => (
          <div key={r} className="group flex w-max">
            {/* The row's list is doubled so the -50% loop joins seamlessly. */}
            <ul
              className={`flex shrink-0 items-center gap-14 pr-14 animate-marquee [animation-duration:45s] group-hover:[animation-play-state:paused] md:gap-20 md:pr-20 ${
                r === 0 ? '[animation-direction:reverse]' : ''
              }`}
            >
              {[...row, ...row].map((c, i) => (
                <li key={`${c.src}-${i}`} aria-hidden className="flex h-20 w-36 shrink-0 items-center justify-center md:w-44">
                  <img
                    src={c.src}
                    alt=""
                    loading="lazy"
                    width={c.w}
                    height={c.h}
                    title={c.name || undefined}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-110"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <ul className="sr-only">
        {clients
          .filter((c) => c.name)
          .map((c) => (
            <li key={c.src}>{c.name}</li>
          ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <ArrowLink to="/work">Discover</ArrowLink>
      </div>

      <div className="shell mt-20 md:mt-28">
        <ul className="grid grid-cols-2 gap-y-12 rounded-[2rem] bg-gradient-to-r from-ice/30 via-ice/50 to-ice/30 px-6 py-12 md:py-16 lg:grid-cols-4">
          {scale.map((s, k) => (
            <motion.li
              key={s.figure}
              className="text-center"
              initial={{ opacity: 0, y: 50, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: k * 0.1, duration: 0.6, type: 'spring' }}
            >
              <Wrap slug={s.slug}>
                <CountUp figure={s.figure} />
                <span className="mx-auto mt-3 block h-[2px] w-10 rounded-full bg-cobalt/40" />
                <span className="mx-auto mt-4 block max-w-[14rem] text-[0.8rem] uppercase leading-relaxed tracking-[0.16em] text-ink/60">
                  {s.label}
                </span>
              </Wrap>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Wrap({ slug, children }: { slug: string | null; children: ReactNode }) {
  return slug ? (
    <Link to={`/work/${slug}`} className="group block px-3">
      {children}
    </Link>
  ) : (
    <div className="px-3">{children}</div>
  );
}
