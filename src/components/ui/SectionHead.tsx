import type { ReactNode } from 'react';

/** Section heading: display-serif title with an optional supporting line, left aligned. */
export default function SectionHead({
  title,
  children,
  aside,
  className = '',
  tone = 'dark',
}: {
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <div className={`flex flex-col justify-between gap-6 md:flex-row md:items-end ${className}`}>
      <div className="max-w-3xl">
        <h2 className={`font-display text-h2 text-balance ${tone === 'dark' ? 'text-paper' : 'text-ink'}`}>{title}</h2>
        {children && (
          <p className={`mt-5 max-w-prose text-lead text-pretty ${tone === 'dark' ? 'text-paper/65' : 'text-ink/70'}`}>
            {children}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
