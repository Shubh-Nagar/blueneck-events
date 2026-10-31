import { Link } from 'react-router-dom';
import { cases, featuredCases } from '../../data/work';
import SectionHead from '../ui/SectionHead';
import WorkCard from '../work/WorkCard';

/**
 * Six featured productions on an offset two-column rhythm: wide/narrow, then
 * narrow/wide, with the narrow column dropped so the rows interlock.
 */
const LAYOUT = [
  { col: 'md:col-span-7', aspect: 'aspect-[4/3]' },
  { col: 'md:col-span-5 md:mt-40', aspect: 'aspect-[4/5]' },
  { col: 'md:col-span-5', aspect: 'aspect-[4/5]' },
  { col: 'md:col-span-7 md:mt-24', aspect: 'aspect-[4/3]' },
  { col: 'md:col-span-6', aspect: 'aspect-[3/2]' },
  { col: 'md:col-span-6 md:mt-24', aspect: 'aspect-[3/2]' },
];

export default function FeaturedWork() {
  return (
    <section className="bg-ink pb-24 sm:pb-36" aria-labelledby="work-title">
      <div className="shell">
        <SectionHead
          title={<span id="work-title">Selected work</span>}
          aside={
            <Link to="/work" className="link-draw text-body text-ice">
              All {cases.length} productions
            </Link>
          }
        >
          Stages, summits and launches from the last few seasons.
        </SectionHead>

        <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-12 md:gap-y-20">
          {featuredCases.slice(0, 6).map((c, i) => (
            <div key={c.slug} className={LAYOUT[i].col}>
              <WorkCard item={c} aspect={LAYOUT[i].aspect} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
