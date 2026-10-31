import { useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { services } from '../../data/site';
import { caseBySlug } from '../../data/work';
import SectionHead from '../ui/SectionHead';
import { ease } from '../../lib/motion';

/**
 * Services as a typographic list. On pointer devices a photo from that service's
 * work follows the cursor; on touch the rows are simple links.
 */
export default function ExpertiseList() {
  const listRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 26 });
  const y = useSpring(my, { stiffness: 220, damping: 26 });

  const onMove = (e: PointerEvent) => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const previews = services.map((s) => {
    const c = s.cases[0] ? caseBySlug(s.cases[0]) : undefined;
    return c?.images[0];
  });

  return (
    <section className="bg-ink pb-24 sm:pb-32" aria-labelledby="expertise-title">
      <div className="shell">
        <SectionHead
          title={<span id="expertise-title">What we do</span>}
          aside={
            <Link to="/expertise" className="link-draw text-body text-ice">
              All expertise
            </Link>
          }
        >
          Nine formats, one team. We plan, design, build and run the day.
        </SectionHead>

        <div ref={listRef} className="relative mt-14" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          <ul className="border-t border-ice/15">
            {services.map((s, i) => (
              <li key={s.slug} className="border-b border-ice/15">
                <Link
                  to={`/expertise#${s.slug}`}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
                  className="group grid gap-3 py-7 transition-colors duration-500 md:grid-cols-12 md:items-baseline md:gap-8 md:py-9"
                >
                  <h3 className="font-display text-[clamp(1.75rem,1.2rem+2.2vw,3.25rem)] leading-[1.05] text-paper/85 transition-[color,transform] duration-500 ease-stage group-hover:translate-x-3 group-hover:text-ice md:col-span-6">
                    {s.name}
                  </h3>
                  <p className="max-w-prose text-body-sm text-paper/55 transition-colors duration-500 group-hover:text-paper/80 md:col-span-5">
                    {s.summary}
                  </p>
                  <span className="hidden text-right text-body-sm text-paper/40 md:col-span-1 md:block">
                    {s.cases.length > 0 ? s.cases.length : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Cursor-following preview (desktop pointer only). */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[15rem] w-[12rem] lg:block"
            style={{ x, y, translateX: '-50%', translateY: '-50%' }}
          >
            <AnimatePresence>
              {hover !== null && (
                <motion.div
                  key={hover}
                  className="absolute inset-0 overflow-hidden rounded-[3px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                  initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.45, ease } }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                >
                  {previews[hover] ? (
                    <img src={previews[hover]!.src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy">
                      <img src="/brand/blueneck-mark.png" alt="" className="w-3/4" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
