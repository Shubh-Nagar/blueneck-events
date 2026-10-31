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

/**
 * The logo's petal burst in its light blues, turning slowly and continuously.
 * A CSS spin rather than a JS loop: it runs on the compositor and never stalls.
 * Size and place it with `className` (avoid transform utilities here: the spin owns
 * `transform`; wrap it if you need to translate it).
 */
export default function PetalBurst({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none animate-[spin_90s_linear_infinite] motion-reduce:animate-none ${className}`}>
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
  );
}
