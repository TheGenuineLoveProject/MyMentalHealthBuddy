/**
 * Performance Monitoring Utilities
 * Track and report Web Vitals and custom performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

/**
 * Web Vitals thresholds (Core Web Vitals)
 */
const THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,
    poor: 4000,
  },
  // Interaction to Next Paint (INP)
  INP: {
    good: 200,
    poor: 500,
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,
    poor: 3000,
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,
    poor: 1800,
  },
};

/**
 * Get rating based on value and thresholds
 */
function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report performance metric
 */
function reportMetric(metric: PerformanceMetric) {
  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      timestamp: new Date(metric.timestamp).toISOString(),
    });
  }

  // Send to backend analytics endpoint
  sendToBackend({
    metrics: {
      [metric.name]: {
        value: metric.value,
        rating: metric.rating,
      }
    },
    page: window.location.pathname,
    timestamp: new Date(metric.timestamp).toISOString(),
    userAgent: navigator.userAgent,
  });

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      non_interaction: true,
    });
  }
}

/**
 * Send performance data to backend
 */
function sendToBackend(data: any) {
  // Use sendBeacon for reliability (doesn't block page unload)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon('/api/performance', blob);
  } else {
    // Fallback to fetch
    fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch((err) => {
      console.warn('Failed to send performance data:', err);
    });
  }
}

/**
 * Observe Web Vitals using PerformanceObserver
 */
export function observeWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        renderTime: number;
        loadTime: number;
      };
      const value = lastEntry.renderTime || lastEntry.loadTime;
      
      reportMetric({
        name: 'LCP',
        value,
        rating: getRating(value, THRESHOLDS.LCP),
        timestamp: Date.now(),
      });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Interaction to Next Paint (INP)
    // Note: INP is measured by the web-vitals library
    // This observer tracks event timing for reference
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry & { processingStart: number; processingEnd: number }) => {
        const value = entry.processingEnd - entry.startTime;
        reportMetric({
          name: 'INP',
          value,
          rating: getRating(value, THRESHOLDS.INP),
          timestamp: Date.now(),
        });
      });
    });
    // INP uses 'event' type with longer buffering
    try {
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch {
      // Fallback to first-input for browsers that don't support event timing
      inpObserver.observe({ type: 'first-input', buffered: true });
    }

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry & { value: number; hadRecentInput: boolean }) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      reportMetric({
        name: 'CLS',
        value: clsValue,
        rating: getRating(clsValue, THRESHOLDS.CLS),
        timestamp: Date.now(),
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // First Contentful Paint
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const paintEntry = entry as PerformanceEntry & { name: string };
        if (paintEntry.name === 'first-contentful-paint') {
          reportMetric({
            name: 'FCP',
            value: entry.startTime,
            rating: getRating(entry.startTime, THRESHOLDS.FCP),
            timestamp: Date.now(),
          });
        }
      });
    });
    navigationObserver.observe({ type: 'paint', buffered: true });

    // Time to First Byte
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navTiming) {
      const ttfb = navTiming.responseStart - navTiming.requestStart;
      reportMetric({
        name: 'TTFB',
        value: ttfb,
        rating: getRating(ttfb, THRESHOLDS.TTFB),
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.warn('Performance monitoring failed:', error);
  }
}

/**
 * Measure custom performance metric
 */
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  
  const finish = () => {
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    
    // Mark in Performance API
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  };

  performance.mark(`${name}-start`);
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(finish);
  } else {
    finish();
    return result;
  }
}

/**
 * Get performance report
 */
export function getPerformanceReport() {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) {
    return null;
  }

  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive,
    domComplete: navigation.domComplete,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    total: navigation.loadEventEnd,
  };
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Observe Web Vitals
  observeWebVitals();

  // Log performance report when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      const report = getPerformanceReport();
      if (report && import.meta.env.DEV) {
        console.table(report);
      }
    }, 0);
  });
}

// Type definitions for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params: Record<string, unknown>
    ) => void;
  }
}
