/**
 * Performance Optimization Utilities
 * Safe defaults for animations, lazy loading, and reduced motion
 */

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration respecting reduced motion preference
 * @param defaultMs - Default duration in milliseconds (max 600ms per spec)
 * @returns Duration in ms (0 if reduced motion preferred)
 */
export function getAnimationDuration(defaultMs: number = 300): number {
  if (prefersReducedMotion()) return 0;
  return Math.min(defaultMs, 600); // Cap at 600ms per performance spec
}

/**
 * Get CSS transition string respecting reduced motion
 * @param property - CSS property to transition
 * @param defaultMs - Default duration
 * @param easing - CSS easing function
 */
export function getTransition(
  property: string = 'all',
  defaultMs: number = 300,
  easing: string = 'ease-out'
): string {
  const duration = getAnimationDuration(defaultMs);
  if (duration === 0) return 'none';
  return `${property} ${duration}ms ${easing}`;
}

/**
 * Lazy load observer factory
 * @param callback - Function to call when element becomes visible
 * @param options - IntersectionObserver options
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
}

/**
 * Preload critical fonts
 */
export function preloadFonts(fonts: string[] = []): void {
  if (typeof document === 'undefined') return;

  fonts.forEach((fontUrl) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = fontUrl;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = 150
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number = 100
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export default {
  prefersReducedMotion,
  getAnimationDuration,
  getTransition,
  createLazyLoadObserver,
  preloadFonts,
  debounce,
  throttle,
  isInViewport
};
