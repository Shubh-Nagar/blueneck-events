import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ease } from '../../lib/motion';

/**
 * Section title used across the site: a plain first line, a second line in a slowly
 * drifting logo-blue gradient, and a short rule that draws out once it is in view.
 * `level={1}` makes it the page title (animates on load rather than on scroll).
 */
export default function Heading({
  id,
  lead,
  accent,
  children,
  align = 'center',
  level = 2,
  tone = 'dark',
  size = 'lg',
  className = '',
}: {
  id?: string;
  level?: 1 | 2;
  tone?: 'dark' | 'light';
  size?: 'lg' | 'md';
  lead: ReactNode;
  accent: ReactNode;
  children?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  const center = align === 'center';
  const H = level === 1 ? 'h1' : 'h2';
  const reveal = level === 1 ? { animate: { opacity: 1, y: 0 } } : { whileInView: { opacity: 1, y: 0 } };
  const sizeCls = size === 'lg' ? 'text-[clamp(2.6rem,1.6rem+4vw,5.75rem)]' : 'text-[clamp(2.2rem,1.5rem+2.8vw,4.25rem)]';
  return (
    <motion.div
      className={`${center ? 'text-center' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      {...reveal}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease, delay: level === 1 ? 0.15 : 0 }}
    >
      <H id={id} className={`font-display ${sizeCls} leading-[0.98] text-balance ${tone === 'dark' ? 'text-ink' : 'text-white'}`}>
        {lead}
        <br />
        <span className={`pb-[0.08em] font-semibold ${tone === 'dark' ? 'text-shine' : 'italic text-ice'}`}>{accent}</span>
      </H>
      <motion.span
        aria-hidden
        className={`mt-6 block h-[3px] rounded-full bg-gradient-to-r from-transparent via-cobalt to-transparent ${center ? 'mx-auto' : 'from-cobalt'}`}
        initial={{ width: 0 }}
        {...(level === 1 ? { animate: { width: 100 } } : { whileInView: { width: 100 } })}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1, ease }}
      />
      {children && (
        <p
          className={`mt-7 max-w-2xl text-lead font-light text-pretty ${tone === 'dark' ? 'text-ink/60' : 'text-white/75'} ${center ? 'mx-auto' : ''}`}
        >
          {children}
        </p>
      )}
    </motion.div>
  );
}

/** Underlined label with a circled arrow, the home page's quiet call to action. */
export function ArrowLink({ to, children, tone = 'dark' }: { to: string; children: ReactNode; tone?: 'dark' | 'light' }) {
  const ink = tone === 'dark' ? 'text-ink ring-ink/25 group-hover:bg-ink' : 'text-white ring-white/40 group-hover:bg-white';
  return (
    <Link to={to} className={`group inline-flex items-center gap-5 ${tone === 'dark' ? 'text-ink' : 'text-white'}`}>
      <span className="border-b-2 border-current pb-1 font-display text-[0.95rem] font-bold tracking-[0.18em] transition-colors duration-300 group-hover:text-cobalt">
        {children}
      </span>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset transition-[background-color,color,transform] duration-500 ease-stage group-hover:translate-x-1 ${ink} ${tone === 'dark' ? 'group-hover:text-white' : 'group-hover:text-ink'}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
