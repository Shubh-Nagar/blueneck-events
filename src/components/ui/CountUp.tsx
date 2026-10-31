import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** "80,000" counts from zero; any suffix ("+", " cities") stays put. */
export default function CountUp({ figure, className = '' }: { figure: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const m = figure.match(/^([\d,]+)(.*)$/);
  const target = m ? Number(m[1].replace(/,/g, '')) : 0;
  const [n, setN] = useState(reduce || !m ? target : 0);

  useEffect(() => {
    if (!inView || reduce || !m) return;
    const c = animate(0, target, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, target]);

  return (
    <span
      ref={ref}
      className={`block font-display text-[clamp(2.2rem,1.6rem+2.2vw,3.6rem)] font-bold leading-none text-navy ${className}`}
    >
      {m ? (
        <>
          <span className="tabular-nums">{n.toLocaleString('en-IN')}</span>
          <span className="text-cobalt">{m[2]}</span>
        </>
      ) : (
        figure
      )}
    </span>
  );
}
