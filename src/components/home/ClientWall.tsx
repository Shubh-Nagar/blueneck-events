import { clients, type Client } from '../../data/site';
import SectionHead from '../ui/SectionHead';

/**
 * The one light section on the site: client logos need a white ground to read
 * in their own colours. Two rows drift in opposite directions; hover pauses.
 */
export default function ClientWall() {
  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)];

  return (
    <section className="overflow-hidden bg-paper py-24 text-ink sm:py-32" aria-labelledby="clients-title">
      <div className="shell">
        <SectionHead tone="light" title={<span id="clients-title">Who we have worked with</span>}>
          Brands, broadcasters, industry bodies and government departments, from the Times of India to the Airports Authority of
          India.
        </SectionHead>
      </div>

      <div className="mt-14 space-y-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="group flex w-max">
            <ul
              className={`flex shrink-0 gap-5 pr-5 group-hover:[animation-play-state:paused] ${
                r === 0 ? 'animate-marquee' : 'animate-marquee-slow [animation-direction:reverse]'
              }`}
            >
              {[...row, ...row].map((c, i) => (
                <LogoTile key={`${c.src}-${i}`} client={c} hidden={i >= row.length} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Static, fully listed version for screen readers. */}
      <ul className="sr-only">
        {clients
          .filter((c) => c.name)
          .map((c) => (
            <li key={c.src}>{c.name}</li>
          ))}
      </ul>
    </section>
  );
}

function LogoTile({ client, hidden }: { client: Client; hidden: boolean }) {
  return (
    <li
      aria-hidden
      data-dup={hidden || undefined}
      className="flex h-28 w-48 shrink-0 items-center justify-center rounded-[3px] bg-white px-7 shadow-[0_1px_0_rgba(37,76,130,0.08)] ring-1 ring-navy/[0.07] sm:h-32 sm:w-56"
    >
      <img
        src={client.src}
        alt=""
        loading="lazy"
        width={client.w}
        height={client.h}
        title={client.name || undefined}
        className="max-h-[60%] max-w-full object-contain grayscale-[0.85] transition-[filter,opacity] duration-500 hover:grayscale-0 [opacity:0.8] hover:[opacity:1]"
      />
    </li>
  );
}
