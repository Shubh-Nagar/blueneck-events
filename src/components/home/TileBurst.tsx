import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { cases } from '../../data/work';
import { ease } from '../../lib/motion';

/**
 * The Blueneck logo is a sunburst of rounded-diamond tiles around the BN disc.
 * Here it is rebuilt at stage scale: the large middle ring is made of real event
 * photographs, the smaller rings use the logo's own blues in their original order
 * (cobalt inside, ice outside).
 *
 * Geometry is in fractions of the container width so it scales fluidly.
 */
type Ring = {
  n: number;
  r: number;
  size: number;
  offset: number;
  color?: string;
  photo?: boolean;
  depth: number;
  opacity?: number;
};

const RINGS: Ring[] = [
  { n: 12, r: 0.228, size: 0.04, offset: 0.5, color: '#537DBE', depth: 6 },
  { n: 12, r: 0.3, size: 0.092, offset: 0, photo: true, depth: 14 },
  { n: 24, r: 0.4, size: 0.056, offset: 0.5, color: '#75A6D8', depth: 22, opacity: 0.85 },
  { n: 24, r: 0.468, size: 0.036, offset: 0, color: '#BBD9F2', depth: 30, opacity: 0.6 },
];
const DISC = 0.368; // diameter of the BN disc

// Twelve productions for the photo ring, chosen for variety of format.
const PHOTO_SLUGS = [
  'prabandhotsav-2023',
  'credai-conclave',
  'times-india-fashion-week',
  'mp-premier-league-2025',
  'rambo-circus',
  'vigour-biotech-dealers-meet',
  'plastpack-2025',
  'sa-re-ga-ma-pa-auditions',
  'rakuten-symphony-family-day',
  'usicon-west-zone',
  'inspire-apple-store-launch-indore',
  'mayor-shapath-grahan-samaroh',
];

export default function TileBurst({ onActive }: { onActive?: (slug: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const reduce = useReducedMotion();

  // Pointer parallax: outer rings drift further than inner ones.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduce, px, py]);

  const photos = useMemo(() => PHOTO_SLUGS.map((s) => cases.find((c) => c.slug === s)!).filter(Boolean), []);

  return (
    <div ref={ref} className="relative aspect-square w-full" aria-hidden>
      {w > 0 &&
        RINGS.map((ring, ri) => (
          <RingLayer key={ri} ring={ring} ri={ri} w={w} sx={sx} sy={sy} reduce={!!reduce}>
            {(i) =>
              ring.photo ? (
                <PhotoTile
                  slug={photos[i % photos.length].slug}
                  src={photos[i % photos.length].images[0].src}
                  tone={photos[i % photos.length].images[0].tone}
                  angle={angleFor(ring, i)}
                  onActive={onActive}
                />
              ) : (
                <span
                  className="tile block h-full w-full"
                  style={{
                    backgroundColor: ring.color,
                    opacity: ring.opacity ?? 1,
                    transform: `rotate(${angleFor(ring, i) + 45}deg)`,
                  }}
                />
              )
            }
          </RingLayer>
        ))}

      {/* BN disc */}
      <motion.div
        className="absolute left-1/2 top-1/2 overflow-hidden rounded-full shadow-[0_30px_80px_-20px_rgba(8,22,41,0.9)]"
        style={{ width: `${DISC * 100}%`, height: `${DISC * 100}%`, x: '-50%', y: '-50%' }}
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 1.1, ease } }}
      >
        {/* The mark image's disc is 48.75% of its width; scale it so the disc fills this circle. */}
        <img
          src="/brand/blueneck-mark.png"
          alt=""
          className="absolute left-1/2 top-1/2 max-w-none"
          style={{ width: `${100 / 0.4875}%`, transform: 'translate(-50%, -50%)' }}
        />
      </motion.div>
    </div>
  );
}

function angleFor(ring: Ring, i: number) {
  return ((i + ring.offset) / ring.n) * 360 - 90;
}

function RingLayer({
  ring,
  ri,
  w,
  sx,
  sy,
  reduce,
  children,
}: {
  ring: Ring;
  ri: number;
  w: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
  children: (i: number) => ReactNode;
}) {
  const lx = useTransform(sx, (v) => v * ring.depth);
  const ly = useTransform(sy, (v) => v * ring.depth);
  const size = ring.size * w;

  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ x: lx, y: ly }}>
      {Array.from({ length: ring.n }, (_, i) => {
        const a = (angleFor(ring, i) * Math.PI) / 180;
        const x = Math.cos(a) * ring.r * w;
        const y = Math.sin(a) * ring.r * w;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
            initial={reduce ? { x, y } : { x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x,
              y,
              scale: 1,
              opacity: 1,
              transition: { duration: 1.2, ease, delay: 0.35 + ri * 0.14 + i * (0.5 / ring.n) },
            }}
          >
            {children(i)}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function PhotoTile({
  slug,
  src,
  tone,
  angle,
  onActive,
}: {
  slug: string;
  src: string;
  tone: string;
  angle: number;
  onActive?: (slug: string | null) => void;
}) {
  return (
    <Link
      to={`/work/${slug}`}
      tabIndex={-1}
      onPointerEnter={() => onActive?.(slug)}
      onPointerLeave={() => onActive?.(null)}
      className="tile group pointer-events-auto block h-full w-full overflow-hidden ring-1 ring-ice/20 transition-[transform,box-shadow] duration-500 ease-stage hover:z-10 hover:shadow-[0_0_0_2px_#BBD9F2,0_20px_50px_-10px_rgba(0,0,0,0.6)]"
      style={{ backgroundColor: tone, transform: `rotate(${angle + 45}deg)` }}
    >
      {/* Counter-rotate so the photo stays upright inside the diamond. */}
      <span className="block h-full w-full" style={{ transform: `rotate(${-(angle + 45)}deg) scale(1.5)` }}>
        <img
          src={src}
          alt=""
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-stage group-hover:scale-110"
        />
      </span>
    </Link>
  );
}
