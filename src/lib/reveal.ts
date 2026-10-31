import { useSyncExternalStore } from 'react';

/**
 * Whether the page loader's curtain is out of the way. Pages read this so their
 * entrance animations start when the reader can actually see them.
 */
let revealed = false;
const listeners = new Set<() => void>();

export function setRevealed(v: boolean) {
  if (v === revealed) return;
  revealed = v;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useRevealed = () => useSyncExternalStore(subscribe, () => revealed);
