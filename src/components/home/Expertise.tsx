import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { services, type Img } from '../../data/site';
import { caseBySlug } from '../../data/work';
import Heading, { ArrowLink } from '../ui/Heading';
import { ease } from '../../lib/motion';

/**
 * Expertise as the logo's petal wheel. The section pins while one ring of petals, each
 * holding a photograph from that format, turns past the copy. On desktop the wheel's
 * centre sits on the right edge (only its left half shows) and the petal at nine
 * o'clock is the current one; on phones it rises from the bottom edge and the petal at
 * twelve o'clock leads. The current petal swells, the rest recede, and the copy beside
 * it turns over to match.
 */
const N = services.length;
const STEP = 360 / N;

/** `grow` is how much the front petal swells on top of the base 0.78 scale. */
type Geometry = { mobile: boolean; R: number; S: number; front: number; grow: number };

function measure(): Geometry {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const mobile = w < 1024;
  // Wheel radius and base petal size, scaled to the screen.
  const R = mobile ? Math.min(w * 0.58, h * 0.34) : Math.min(h * 0.47, w * 0.31);
  return { mobile, R, S: R * 0.43, front: mobile ? 270 : 180, grow: mobile ? 0.95 : 1.15 };
}

export default function Expertise() {
  const ref = useRef<HTMLElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const on = () => setGeo(measure());
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6, restDelta: 0.0005 });
  // Continuous position along the services: 0 … N-1.
  const f = useTransform(smooth, (v) => Math.min(1, Math.max(0, v)) * (N - 1));
  const bar = useTransform(smooth, (v) => Math.min(1, Math.max(0, v)));
  const hubTurn = useTransform(f, (v) => -v * STEP);

  useMotionValueEvent(f, 'change', (v) => {
    const k = Math.round(v);
    if (k === active) return;
    setDir(k > active ? 1 : -1);
    setActive(k);
  });

  // Scroll the page to the point where service k sits at the front.
  const goTo = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (k / (N - 1)) * travel, behavior: 'smooth' });
  };

  const s = services[active];
  // Phones: centre a little below the bottom edge so the lead petal clears the copy.
  const anchor = geo?.mobile ? { left: '50%', top: `calc(100% + ${geo.R * 0.12}px)` } : { left: '100%', top: '50%' };

  return (
    <section
      ref={ref}
      className="relative bg-white"
      style={{ height: `${(N - 1) * 55 + 100}vh` }}
      aria-labelledby="expertise-title"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-gradient-to-br from-white via-white to-ice/30">
        {/* Soft wash behind the wheel */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-45vh] left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(117,166,216,0.28),transparent_65%)] lg:bottom-auto lg:left-auto lg:right-[-45vh] lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0"
        />

        {/* The wheel, anchored on its centre point */}
        {geo && (
          <div className="absolute z-0 h-0 w-0" style={anchor}>
            {/* A faint dashed orbit that turns with the wheel, and the BN disc at the hub. */}
            <motion.span
              aria-hidden
              className="absolute rounded-full border-[1.5px] border-dashed border-cobalt/25"
              style={{ width: geo.R * 2, height: geo.R * 2, left: -geo.R, top: -geo.R, rotate: hubTurn }}
            />
            <span
              aria-hidden
              className="absolute overflow-hidden rounded-full bg-white shadow-[0_30px_80px_-20px_rgba(37,76,130,0.45)] ring-1 ring-ice"
              style={{ width: geo.R, height: geo.R, left: -geo.R / 2, top: -geo.R / 2 }}
            >
              {/* The whole mark, BN disc and its own small petals, centred in the hub. */}
              <img
                src="/brand/blueneck-mark.png"
                alt=""
                className="absolute left-1/2 top-1/2 w-[86%] max-w-none -translate-x-1/2 -translate-y-1/2"
              />
            </span>

            {services.map((svc, i) => {
              const c = svc.cases[0] ? caseBySlug(svc.cases[0]) : undefined;
              return <Petal key={svc.slug} i={i} f={f} geo={geo} img={c?.images[0]} label={svc.name} onSelect={() => goTo(i)} />;
            })}
          </div>
        )}

        {/* The copy */}
        <div className="shell pointer-events-none relative z-10 flex h-full flex-col pt-24 lg:justify-center lg:pt-0">
          <div className="pointer-events-auto max-w-[36rem] lg:w-[46%]">
            <div className="hidden lg:block">
              <Heading id="expertise-title" align="left" size="md" lead="Expertise that" accent="fills the room" />
            </div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-cobalt lg:hidden">
              Expertise that fills the room
            </p>

            <div className="relative mt-5 h-[14rem] lg:mt-10 lg:h-[21rem]" aria-live="polite">
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={s.slug}
                  custom={dir}
                  className="absolute inset-0 origin-left"
                  variants={{
                    enter: (d: number) => ({ opacity: 0, y: d * 60, rotate: d * -4, filter: 'blur(8px)' }),
                    center: { opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' },
                    exit: (d: number) => ({ opacity: 0, y: d * -60, rotate: d * 4, filter: 'blur(8px)' }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.65, ease }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-[clamp(2.4rem,1.6rem+3vw,5rem)] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(83,125,190,0.55)]">
                      {String(active + 1).padStart(2, '0')}
                    </span>
                    <span className="text-body-sm text-ink/40">/ {String(N).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-3 font-display text-[clamp(1.8rem,1.3rem+1.4vw,2.6rem)] font-bold leading-[1.08] text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-md text-body-sm leading-relaxed text-ink/65 lg:mt-4 lg:line-clamp-4">
                    {s.summary}
                  </p>
                  <div className="mt-4 lg:mt-6">
                    <ArrowLink to={`/expertise#${s.slug}`}>Explore</ArrowLink>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress */}
            <div className="mt-6 hidden lg:block">
              <div className="h-[2px] w-full max-w-sm overflow-hidden rounded-full bg-ink/10">
                <motion.div className="h-full origin-left bg-gradient-to-r from-navy to-sky" style={{ scaleX: bar }} />
              </div>
              {/* One small petal per format; the current one fills in. */}
              <ul className="mt-5 flex items-center gap-3">
                {services.map((x, k) => (
                  <li key={x.slug}>
                    <button
                      type="button"
                      onClick={() => goTo(k)}
                      aria-label={x.name}
                      title={x.name}
                      aria-current={k === active}
                      className="flex h-6 w-6 items-center justify-center"
                    >
                      <span
                        className={`tile block transition-all duration-500 ease-stage ${
                          k === active ? 'h-3.5 w-3.5 bg-navy' : 'h-2 w-2 bg-ink/20 hover:bg-cobalt/60'
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One petal on the wheel: placed, turned outward, sized and dimmed from the wheel's position. */
function Petal({
  i,
  f,
  geo,
  img,
  label,
  onSelect,
}: {
  i: number;
  f: MotionValue<number>;
  geo: Geometry;
  img?: Img;
  label: string;
  onSelect: () => void;
}) {
  const { R, S, front, grow } = geo;
  // How far this petal is from the front, wrapped around the ring (0 = in front).
  const dist = (v: number) => {
    const d = (((i - v) % N) + N) % N;
    return Math.min(d, N - d);
  };
  const angle = (v: number) => front + (i - v) * STEP;
  const near = (v: number) => Math.max(0, 1 - dist(v));

  const x = useTransform(f, (v) => Math.cos((angle(v) * Math.PI) / 180) * R);
  const y = useTransform(f, (v) => Math.sin((angle(v) * Math.PI) / 180) * R);
  const rotate = useTransform(f, (v) => angle(v) + 45);
  const counter = useTransform(f, (v) => -(angle(v) + 45));
  // Hover swells the front petal further (and zooms its photo a touch); side petals ignore it.
  const hover = useSpring(0, { stiffness: 260, damping: 22 });
  const scale = useTransform([f, hover], ([v, h]: number[]) => (0.78 + grow * near(v)) * (1 + 0.15 * h * near(v)));
  const photoScale = useTransform([f, hover], ([v, h]: number[]) => 1.45 * (1 + 0.08 * h * near(v)));
  const opacity = useTransform(f, (v) => 0.5 + 0.5 * near(v));
  const filter = useTransform(f, (v) => `saturate(${0.45 + 0.55 * near(v)})`);
  const zIndex = useTransform(f, (v) => 100 - Math.round(dist(v) * 10));
  const boxShadow = useTransform(f, (v) =>
    near(v) > 0.6
      ? '0 0 0 4px #ffffff, 0 30px 70px -15px rgba(37,76,130,0.6)'
      : '0 0 0 3px rgba(255,255,255,0.9), 0 15px 35px -15px rgba(8,22,41,0.35)',
  );

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onHoverStart={() => hover.set(1)}
      onHoverEnd={() => hover.set(0)}
      aria-label={`Show ${label}`}
      className="absolute block overflow-hidden bg-navy outline-none focus-visible:ring-4 focus-visible:ring-cobalt"
      style={{
        width: S,
        height: S,
        left: -S / 2,
        top: -S / 2,
        borderRadius: '22%',
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex,
        boxShadow,
      }}
    >
      {/* Counter-turned so the photograph stays upright inside the diamond. */}
      <motion.span className="absolute inset-0 block" style={{ rotate: counter, scale: photoScale }}>
        {img ? (
          <motion.img
            src={img.src}
            alt=""
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover"
            style={{ backgroundColor: img.tone, filter }}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cobalt to-navy">
            <img src="/brand/blueneck-mark.png" alt="" className="w-1/2" />
          </span>
        )}
      </motion.span>
    </motion.button>
  );
}
