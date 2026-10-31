import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'solid' | 'ghost' | 'light';

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-body-sm font-medium transition-colors duration-500 ease-stage';
const variants: Record<Variant, string> = {
  solid: 'bg-navy text-white shadow-[0_10px_30px_-10px_rgba(37,76,130,0.6)]',
  ghost: 'text-ink ring-1 ring-inset ring-ink/20 hover:text-white',
  /** For dark photographs and navy panels. */
  light: 'bg-white text-navy hover:text-white',
};
const fills: Record<Variant, string> = {
  solid: 'bg-cobalt',
  ghost: 'bg-navy',
  light: 'bg-cobalt',
};

/**
 * Pill button. On hover a fill rises from the bottom like a stage curtain in reverse.
 */
export function ButtonLink({
  to,
  children,
  variant = 'solid',
  className = '',
}: {
  to: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      <span
        aria-hidden
        className={`absolute inset-0 translate-y-full rounded-full ${fills[variant]} transition-transform duration-500 ease-stage group-hover:translate-y-0`}
      />
      <span className="relative">{children}</span>
    </Link>
  );
}
