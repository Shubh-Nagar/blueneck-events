import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Img } from '../../data/site';
import { ease } from '../../lib/motion';

/** Full-screen photo viewer. Arrow keys / swipe to move, Escape to close. */
export default function Lightbox({
  images,
  index,
  title,
  onClose,
  onIndex,
}: {
  images: Img[];
  index: number | null;
  title: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = useCallback(
    (d: number) => index !== null && onIndex((index + d + images.length) % images.length),
    [index, images.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      prev?.focus();
    };
  }, [open, go, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, photo ${index! + 1} of ${images.length}`}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          onClick={onClose}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={index}
              src={images[index!].src}
              alt={`${title}, photo ${index! + 1}`}
              className="max-h-[82vh] max-w-[92vw] rounded-[3px] object-contain shadow-2xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.45, ease } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>

          <div
            className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-body-sm text-paper/70 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <span>
              {index! + 1} of {images.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} className="rounded-full px-4 py-2 ring-1 ring-ice/25 hover:bg-ice hover:text-ink">
                Previous
              </button>
              <button onClick={() => go(1)} className="rounded-full px-4 py-2 ring-1 ring-ice/25 hover:bg-ice hover:text-ink">
                Next
              </button>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full px-4 py-2 text-body-sm text-paper ring-1 ring-ice/25 hover:bg-ice hover:text-ink sm:right-8 sm:top-8"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
