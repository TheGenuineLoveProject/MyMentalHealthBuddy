import { MASCOT_VARIANTS } from '../data/lumiAssets';

/**
 * Preloads all mascot images into browser cache.
 * Call this once on app initialization.
 */
export function preloadMascots() {
  if (typeof window === 'undefined') return;
  
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  
  MASCOT_VARIANTS.forEach((src) => {
    const img = new Image();
    img.src = src;
    
    // Also add link preload for critical path
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
