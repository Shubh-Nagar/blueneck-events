import { useState, type ImgHTMLAttributes } from 'react';
import type { Img as ImgData } from '../../data/site';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  img: ImgData;
  /** Load immediately (above-the-fold images). */
  eager?: boolean;
  /** Classes for the wrapping element (size/aspect). */
  frameClassName?: string;
};

/**
 * Lazy image with intrinsic size (no layout shift) and a tone placeholder taken
 * from the photo's own average colour, so tiles never flash white while loading.
 */
export default function Img({ img, eager, className = '', frameClassName = '', alt = '', ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`relative block overflow-hidden ${frameClassName}`} style={{ backgroundColor: img.tone }}>
      <img
        src={img.src}
        width={img.w}
        height={img.h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...rest}
      />
    </span>
  );
}
