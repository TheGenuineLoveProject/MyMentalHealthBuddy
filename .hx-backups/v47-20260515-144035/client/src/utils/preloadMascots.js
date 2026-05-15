import { MASCOT_ASSETS } from '../data/lumiAssets';

/**
 * Preloads all mascot images into browser cache.
 * Call this once on app initialization.
 *
 * MASCOT_ASSETS is an object keyed by variant ({ default, blue, lavender, ... }).
 * We dedupe URLs (some variants share the same artwork, e.g. sleeping reuses
 * lavender) so we don't fire duplicate preload requests.
 */
export function preloadMascots() {
  if (typeof window === 'undefined') return;

  const seen = new Set();
  Object.values(MASCOT_ASSETS).forEach((src) => {
    if (!src || seen.has(src)) return;
    seen.add(src);

    const img = new Image();
    img.src = src;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Preloads a single image and returns a promise.
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}
