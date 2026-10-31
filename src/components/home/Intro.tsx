import { Link } from 'react-router-dom';
import { company, scale } from '../../data/site';

/** Who we are, plus the scale figures — each one tied to the production it came from. */
export default function Intro() {
  return (
    <section className="relative bg-ink py-24 sm:py-32" aria-labelledby="intro-title">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <h2 id="intro-title" className="font-display text-h2 text-paper text-balance lg:col-span-7">
          Nearly two decades of event craft, under one name since 2022.
        </h2>
        <div className="lg:col-span-5 lg:pt-3">
          <p className="text-lead text-paper/70 text-pretty">{company.aboutShort}</p>
          <Link to="/about" className="link-draw mt-8 inline-block text-body text-ice">
            Meet the directors
          </Link>
        </div>
      </div>

      <div className="shell mt-20 sm:mt-28">
        <ul className="grid gap-px overflow-hidden rounded-[3px] bg-ice/10 sm:grid-cols-2 lg:grid-cols-4">
          {scale.map((s) => {
            const inner = (
              <>
                <span className="block font-display text-[clamp(2.4rem,1.8rem+2vw,3.6rem)] leading-none text-paper">
                  {s.figure}
                </span>
                <span className="mt-4 block max-w-[16rem] text-body-sm text-paper/60">{s.label}</span>
              </>
            );
            return (
              <li key={s.figure} className="bg-ink">
                {s.slug ? (
                  <Link to={`/work/${s.slug}`} className="block h-full p-8 transition-colors duration-500 hover:bg-deep">
                    {inner}
                  </Link>
                ) : (
                  <div className="h-full p-8">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
