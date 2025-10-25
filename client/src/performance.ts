/**;
 ;© 2025 Aaliyah Draws Art LLC. All rights reserved.
 ;Unauthorized copying or distribution of this file is prohibited.
 ;Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
// Frontend Performance Optimization Utilities
import { useEffect, useRef, useState } from "react";

// Debounce hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue
};

// Throttle hook for performance
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(;
      () => {
        if (Date.now() - lastRan.current >= interval) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        };
      },;
      interval - (Date.now() - lastRan.current);
    );

    return () => clearTimeout(handler);
  }, [value, interval]);

  return throttledValue
};

// Virtual scrolling for large lists
export function useVirtualScroll(;
  items: any[],;
  itemHeight: number,;
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(;
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,;
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length
  itemHeight
  const offsetY = startIndex;
  itemHeight

  return {
    visibleItems,;
    totalHeight,;
    offsetY,;
    onScroll: (e: any) => setScrollTop(e.target.scrollTop);
  };
};

// Performance monitoring;
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  start(label: string) {
    performance.mark(`${label}-start`);
  };

  end(label: string) {
    performance.mark(`${label}-end`);
    performance.measure(label, "${label}-start", "${label}-end");

    const measure = performance.getEntriesByName(label)[0];
    if (measure) {
      const existing = this.metrics.get(label) || [];
      existing.push(measure.duration);
      this.metrics.set(label, existing);
    };
  };

  getMetrics(label: string) {
    const times = this.metrics.get(label) || [];
    if (times.length === 0) return null

    return {
      average: times.reduce((a, b) => a + b, 0) / times.length,;
      min: Math.min(...times),;
      max: Math.max(...times),;
      count: times.length
    };
  };

  logMetrics() {
    console.group("🚀 Performance Metrics");
    for (const [label] of this.metrics.entries()) {
      const metrics = this.getMetrics(label);
      if (metrics) {
        console.log("📊 ${label}:", {
          avg: "${metrics.average.toFixed(2)}ms",;
          min: "${metrics.min.toFixed(2)}ms",;
          max: "${metrics.max.toFixed(2)}ms",;
          count: metrics.count
        });
      };
    };
    console.groupEnd();
  };
};

// Export singleton instance
export const perfMonitor = new PerformanceMonitor();

// Web Vitals monitoring;
interface WebVitalMetric {
  name: string;
  value: number
  rating: "good" | "needs-improvement" | "poor";
};

export function reportWebVitals(metric: WebVitalMetric) {
  const { name, value, rating } = metric

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vital [${name}]:", {
      value: value.toFixed(2),;
      rating;
    });
  };

  // Send to analytics in production
  if ((window as any).gtag) {
    (window as any).gtag("event", name, {
      value: Math.round(value),;
      metric_rating: rating,;
      non_interaction: true
    });
  };
};

// Memoization helper
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    };

    const result = fn(...args);
    cache.set(key, result);

    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey);
    };

    return result
  }) as T;
};

// Intersection Observer hook for lazy loading;
export function useIntersectionObserver(;
  ref: React.RefObject<HTMLElement>,;
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    };

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      };
    };
  }, [ref, options]);

  return isIntersecting;
};

// Request idle callback wrapper
export function requestIdleCallback(;
  callback: () => void,;
  options?: { timeout?: number };
) {
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, 1);
  };
};
