/**
 * Logo lockup: the tile-burst mark plus the wordmark. `tone="light"` uses the pale
 * wordmark for dark backgrounds; `tone="dark"` the navy one for white.
 */
export default function Logo({
  className = '',
  compact = false,
  tone = 'light',
}: {
  className?: string;
  compact?: boolean;
  tone?: 'light' | 'dark';
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img src="/brand/blueneck-mark.png" alt="" width={44} height={44} className="h-10 w-10 sm:h-11 sm:w-11" />
      {!compact && (
        <img
          src={tone === 'light' ? '/brand/blueneck-wordmark-light.png' : '/brand/blueneck-wordmark.png'}
          alt="Blueneck Events Pvt Ltd"
          width={900}
          height={242}
          className="h-[28px] w-auto sm:h-[32px]"
        />
      )}
    </span>
  );
}
