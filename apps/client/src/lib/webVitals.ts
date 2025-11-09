/**
 * Web Vitals Monitoring
 * Track and report Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
 * Uses attribution build in dev for detailed CLS debugging
 */

// Use attribution build for detailed debugging (has CLS attribution data)
import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals/attribution';

export interface WebVitalsMetrics {
  lcp: number | null; // Largest Contentful Paint
  inp: number | null; // Interaction to Next Paint
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

export interface WebVitalsReport {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  timestamp: number;
}

const metrics: WebVitalsMetrics = {
  lcp: null,
  inp: null,
  cls: null,
  fcp: null,
  ttfb: null,
};

const listeners: Set<(report: WebVitalsReport) => void> = new Set();

/**
 * Get rating for a metric based on web vitals thresholds
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Handle metric callback
 */
function handleMetric(metric: Metric) {
  const report: WebVitalsReport = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    timestamp: Date.now(),
  };

  // Update stored metrics
  const key = metric.name.toLowerCase() as keyof WebVitalsMetrics;
  metrics[key] = metric.value;

  // Notify listeners
  listeners.forEach((listener) => listener(report));

  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: report.rating,
      delta: metric.delta,
    });
    
    // CLS Attribution Debugging (web-vitals v4+ with reportAllChanges)
    if (metric.name === 'CLS' && 'attribution' in metric) {
      const attribution = (metric as any).attribution;
      console.log('[CLS Attribution] Detailed shift analysis:', {
        largestShiftTarget: attribution?.largestShiftTarget,
        largestShiftValue: attribution?.largestShiftValue,
        largestShiftTime: attribution?.largestShiftTime,
        loadState: attribution?.loadState,
        largestShiftEntry: attribution?.largestShiftEntry,
      });
      
      // Log selector path if available
      if (attribution?.largestShiftTarget) {
        console.log('[CLS Attribution] Element causing shift:', attribution.largestShiftTarget);
      }
    }
  }

  // Send to analytics in production
  if (import.meta.env.PROD) {
    sendToAnalytics(report);
  }
}

/**
 * Send metrics to analytics service
 */
function sendToAnalytics(report: WebVitalsReport) {
  // TODO: Integrate with your analytics service
  // Example: Google Analytics
  // window.gtag?.('event', report.name, {
  //   value: Math.round(report.value),
  //   metric_rating: report.rating,
  //   metric_delta: Math.round(report.delta),
  // });
  
  console.log('[Analytics] Web Vitals:', report);
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  try {
    onLCP(handleMetric);
    onINP(handleMetric);
    // Enable reportAllChanges for detailed CLS attribution
    onCLS(handleMetric, { reportAllChanges: true });
    onFCP(handleMetric);
    onTTFB(handleMetric);

    // Fallback PerformanceObserver for layout-shift debugging (dev only)
    if (import.meta.env.DEV && typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              const sources = (entry as any).sources || [];
              console.log('[CLS Debug] Layout Shift Entry:', {
                value: (entry as any).value,
                startTime: entry.startTime,
                hadRecentInput: (entry as any).hadRecentInput,
                sources: sources.map((s: any) => ({
                  node: s.node?.tagName + (s.node?.className ? `.${s.node.className}` : ''),
                  previousRect: s.previousRect,
                  currentRect: s.currentRect,
                })),
              });
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('[CLS Debug] PerformanceObserver failed:', e);
      }
    }

    console.log('[Web Vitals] Monitoring initialized');
  } catch (error) {
    console.error('[Web Vitals] Failed to initialize:', error);
  }
}

/**
 * Subscribe to web vitals updates
 */
export function onWebVitalsUpdate(callback: (report: WebVitalsReport) => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Get current metrics snapshot
 */
export function getWebVitals(): WebVitalsMetrics {
  return { ...metrics };
}

/**
 * Get performance score (0-100)
 */
export function getPerformanceScore(): number {
  const { lcp, inp, cls, fcp, ttfb } = metrics;

  // Check if required metrics are available (null check, not falsy check)
  if (lcp === null || inp === null || cls === null) {
    return 0; // Not enough data
  }

  let score = 0;

  // LCP score (0-25 points)
  if (lcp <= 2500) score += 25;
  else if (lcp <= 4000) score += 15;
  else score += 5;

  // INP score (0-25 points)
  if (inp <= 200) score += 25;
  else if (inp <= 500) score += 15;
  else score += 5;

  // CLS score (0-25 points)
  if (cls <= 0.1) score += 25;
  else if (cls <= 0.25) score += 15;
  else score += 5;

  // FCP score (0-15 points)
  if (fcp !== null && fcp <= 1800) score += 15;
  else if (fcp !== null && fcp <= 3000) score += 10;
  else if (fcp !== null) score += 5;

  // TTFB score (0-10 points)
  if (ttfb !== null && ttfb <= 800) score += 10;
  else if (ttfb !== null && ttfb <= 1800) score += 5;
  else if (ttfb !== null) score += 2;

  return Math.round(score);
}

/**
 * Get performance recommendations
 */
export function getPerformanceRecommendations(): string[] {
  const recommendations: string[] = [];
  const { lcp, inp, cls, fcp, ttfb } = metrics;

  if (lcp && lcp > 2500) {
    recommendations.push('Optimize images and lazy load below-the-fold content');
    recommendations.push('Use a CDN for faster asset delivery');
    recommendations.push('Minimize render-blocking resources');
  }

  if (inp && inp > 200) {
    recommendations.push('Reduce JavaScript execution time');
    recommendations.push('Break up long tasks into smaller chunks');
    recommendations.push('Use web workers for heavy computations');
    recommendations.push('Optimize event handlers and reduce layout thrashing');
  }

  if (cls && cls > 0.1) {
    recommendations.push('Set explicit dimensions for images and embeds');
    recommendations.push('Avoid inserting content above existing content');
    recommendations.push('Use CSS transform animations instead of layout shifts');
  }

  if (fcp && fcp > 1800) {
    recommendations.push('Eliminate render-blocking resources');
    recommendations.push('Minify CSS and JavaScript');
    recommendations.push('Remove unused code');
  }

  if (ttfb && ttfb > 800) {
    recommendations.push('Optimize server response time');
    recommendations.push('Use server-side caching');
    recommendations.push('Use a faster hosting provider');
  }

  if (recommendations.length === 0) {
    recommendations.push('Great job! All metrics are within optimal range.');
  }

  return recommendations;
}
