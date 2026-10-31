import { Link } from 'react-router-dom';
import Img from '../ui/Img';
import { categoryLabel, type CaseStudy } from '../../data/work';
import type { Img as ImgData } from '../../data/site';

/** Portfolio card: photo with slow zoom on hover, then title and the one headline fact. */
export default function WorkCard({
  item,
  aspect = 'aspect-[4/3]',
  sizes = 'large',
}: {
  item: CaseStudy & { images: ImgData[] };
  aspect?: string;
  sizes?: 'large' | 'small';
}) {
  const where = [item.location, item.year].filter(Boolean).join(', ');
  return (
    <Link to={`/work/${item.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-[1.5rem] shadow-[0_20px_50px_-30px_rgba(8,22,41,0.45)] transition-shadow duration-700 group-hover:shadow-[0_30px_60px_-25px_rgba(37,76,130,0.55)]">
        <Img
          img={item.images[0]}
          alt={`${item.title}${item.location ? `, ${item.location}` : ''}`}
          frameClassName={aspect}
          className="transition-transform duration-[1.4s] ease-stage group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-navy backdrop-blur-md">
          {categoryLabel(item.category)}
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3
            className={`font-display text-ink transition-colors duration-500 group-hover:text-navy ${sizes === 'large' ? 'text-h3' : 'text-[1.4rem] leading-tight'}`}
          >
            <span className="link-draw">{item.title}</span>
          </h3>
          {item.highlight && <p className="mt-2 text-body-sm text-cobalt">{item.highlight}</p>}
        </div>
        {where && <p className="hidden shrink-0 pt-1.5 text-right text-body-sm text-ink/45 sm:block">{where}</p>}
      </div>
    </Link>
  );
}
