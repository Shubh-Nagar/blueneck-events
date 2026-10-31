import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { company, heroVideo } from '../../data/site';
import { fade } from '../../lib/motion';

/**
 * The opening: the showreel pinned full-screen for several scroll lengths. It opens
 * on the film alone; scrolling brings "Ground-breakings to Grand Finales" in over it,
 * then pushes each word towards the viewer until it dissolves, leaving the three
 * formats. Only then does the page move on. The film plays throughout.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const set = () => setMobile(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  const src = mobile && heroVideo.mobileSrc ? heroVideo.mobileSrc : heroVideo.src;

  // Progress through the pinned stretch: 0 when it pins, 1 when it lets go.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // A heavy spring so the words trail the scroll wheel slightly, like a camera dolly.
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 26, mass: 1.5, restDelta: 0.0005 });
  const p = reduce ? scrollYProgress : smooth;

  // The film: a slow push-in, and a veil that deepens while the words are on it.
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const veil = useTransform(p, [0, 0.15, 0.8, 1], [0.1, 0.5, 0.55, 0.62]);
  // Function form on purpose: Framer would otherwise hand an opacity map to the browser's
  // native ViewTimeline, which misreads this pinned section's range.
  const cueFade = useTransform(scrollYProgress, (v) => Math.max(0, 1 - v / 0.05));

  // Words arrive out of a soft blur…
  const wordsBlur = useTransform(p, [0.05, 0.22], ['blur(14px)', 'blur(0px)']);
  // …then each flies at the viewer on its own schedule.
  const l1Scale = useTransform(p, [0.05, 0.2, 0.45, 0.75], [0.85, 1, 1.4, 4.5]);
  const l1Fade = useTransform(p, [0.05, 0.2, 0.55, 0.72], [0, 1, 1, 0]);
  const l1Y = useTransform(p, [0.2, 0.75], ['0%', '-100%']);
  const toScale = useTransform(p, [0.09, 0.24, 0.45, 0.75], [0.85, 1, 1.25, 3.8]);
  const toFade = useTransform(p, [0.09, 0.24, 0.5, 0.68], [0, 1, 1, 0]);
  const grandScale = useTransform(p, [0.11, 0.26, 0.42, 0.78], [0.85, 1, 1.2, 4.2]);
  const grandFade = useTransform(p, [0.11, 0.26, 0.6, 0.76], [0, 1, 1, 0]);
  const l3Scale = useTransform(p, [0.13, 0.3, 0.48, 0.8], [0.85, 1, 1.4, 5]);
  const l3Fade = useTransform(p, [0.13, 0.3, 0.6, 0.75], [0, 1, 1, 0]);
  const l3Y = useTransform(p, [0.3, 0.8], ['0%', '100%']);
  // What is left once the words have flown past.
  const outroFade = useTransform(p, [0.78, 0.9], [0, 1]);
  const outroScale = useTransform(p, [0.78, 0.95], [0.92, 1]);

  // Re-mute once the hero is nearly done so sound doesn't follow the reader down the page.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.97 && !muted) setMuted(true);
  });

  // Only spend decode time while the hero is on screen.
  const inView = useInView(ref);
  useEffect(() => {
    const v = video.current;
    if (!v || reduce) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce, src]);

  useEffect(() => {
    if (video.current) video.current.muted = muted;
  }, [muted]);

  return (
    <section ref={ref} id="hero" data-dark-cover className="relative h-[300vh] bg-ink md:h-[400vh]">
      <h1 className="sr-only">
        {company.name}: from ground-breakings to grand finales. {company.tagline.join(', ')} events across India.
      </h1>

      <div className="sticky top-0 isolate h-[100svh] overflow-hidden">
        {/* The film */}
        <motion.div className="absolute inset-0 -z-10 transform-gpu" style={{ scale: filmScale }}>
          {!reduce && (
            <video
              key={src}
              ref={video}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={heroVideo.poster}
              onPlaying={() => setPlaying(true)}
              aria-hidden
            >
              <source src={src} type="video/mp4" />
            </video>
          )}
          <img
            src={heroVideo.poster}
            alt=""
            fetchPriority="high"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? 'opacity-0' : 'opacity-100'}`}
          />
        </motion.div>
        <motion.div aria-hidden className="absolute inset-0 -z-10 bg-ink" style={{ opacity: veil }} />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-ink/60 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink/70 to-transparent" />

        {/* The line, flown through on scroll */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[2.5vw] px-4 text-center md:gap-[1.6vw]"
          style={{ filter: reduce ? undefined : wordsBlur }}
        >
          <motion.p
            style={{ scale: l1Scale, opacity: l1Fade, y: l1Y }}
            className="font-display text-[11vw] font-black leading-[0.95] tracking-[-0.045em] text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)] md:text-[7.5vw]"
          >
            Ground&#8209;breakings
          </motion.p>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <motion.span
              style={{ scaleX: toScale, opacity: toFade, transformOrigin: 'right' }}
              className="h-[2px] w-8 rounded-full bg-gradient-to-l from-ice to-transparent sm:w-16"
            />
            <motion.span
              style={{ scale: toScale, opacity: toFade }}
              className="font-display text-[5vw] font-medium italic text-ice md:text-[3vw]"
            >
              to
            </motion.span>
            <motion.span
              style={{ scale: grandScale, opacity: grandFade }}
              className="font-display text-[4.5vw] font-bold uppercase tracking-[0.35em] text-white md:text-[2.5vw]"
            >
              Grand
            </motion.span>
            <motion.span
              style={{ scaleX: grandScale, opacity: grandFade, transformOrigin: 'left' }}
              className="h-[2px] w-8 rounded-full bg-gradient-to-r from-ice to-transparent sm:w-16"
            />
          </div>
          <motion.p
            style={{ scale: l3Scale, opacity: l3Fade, y: l3Y }}
            className="text-shine-light font-display text-[12vw] font-black leading-[0.95] drop-shadow-[0_30px_70px_rgba(83,125,190,0.6)] md:text-[7vw]"
          >
            Finales
          </motion.p>
        </motion.div>

        {/* The outro: the three formats settle in over the film. */}
        <motion.div
          aria-hidden
          style={{ opacity: outroFade, scale: outroScale }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <img src="/brand/blueneck-mark.png" alt="" className="h-20 w-20 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" />
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-display text-[clamp(1.8rem,1.2rem+2.4vw,3.4rem)] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {company.tagline.map((t, i) => (
              <span key={t} className="flex items-center gap-5">
                {i > 0 && <span className="tile inline-block h-3 w-3 bg-ice" />}
                {t}
              </span>
            ))}
          </p>
          <p className="mt-5 text-body-sm uppercase tracking-[0.3em] text-white/70">Across India, since {company.incorporated}</p>
        </motion.div>

        {playing && (
          <motion.button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            className="absolute bottom-8 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-paper ring-1 ring-inset ring-paper/25 backdrop-blur-md transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-paper/20 active:scale-95 sm:left-8"
            variants={fade}
            initial="hidden"
            animate="show"
            custom={0.6}
          >
            {muted ? <MutedIcon /> : <SoundIcon />}
          </motion.button>
        )}

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ opacity: cueFade }}>
          <button
            type="button"
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex animate-[fadein_0.8s_1.2s_both] flex-col items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-paper/70 transition-colors hover:text-paper"
          >
            Scroll
            <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-scrollcue bg-paper" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function MutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m22 9-6 6M16 9l6 6" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
    </svg>
  );
}
