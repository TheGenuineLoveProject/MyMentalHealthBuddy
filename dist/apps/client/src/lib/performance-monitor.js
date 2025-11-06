/**
 * Comprehensive Performance Monitoring System
 * Real-time Core Web Vitals tracking and optimization
 */
/**
 * Performance Observer Manager
 */
export class PerformanceMonitor {
    metrics = {};
    observers = new Map();
    listeners = new Set();
    constructor() {
        this.initializeObservers();
    }
    /**
     * Initialize all performance observers
     */
    initializeObservers() {
        // FCP (First Contentful Paint)
        this.observePaint();
        // LCP (Largest Contentful Paint)
        this.observeLCP();
        // FID (First Input Delay) / INP (Interaction to Next Paint)
        this.observeInteraction();
        // CLS (Cumulative Layout Shift)
        this.observeLayoutShift();
        // TTFB (Time to First Byte)
        this.observeNavigation();
    }
    /**
     * Observe paint metrics (FCP)
     */
    observePaint() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.metrics.fcp = entry.startTime;
                            this.notifyListeners();
                        }
                    }
                });
                observer.observe({ type: 'paint', buffered: true });
                this.observers.set('paint', observer);
            }
            catch (error) {
                console.warn('FCP observer not supported:', error);
            }
        }
    }
    /**
     * Observe LCP (Largest Contentful Paint)
     */
    observeLCP() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.lcp = lastEntry.startTime;
                    this.notifyListeners();
                });
                observer.observe({ type: 'largest-contentful-paint', buffered: true });
                this.observers.set('lcp', observer);
            }
            catch (error) {
                console.warn('LCP observer not supported:', error);
            }
        }
    }
    /**
     * Observe interaction metrics (FID/INP)
     */
    observeInteraction() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        // FID - First Input Delay
                        if (entry.name === 'first-input') {
                            const fidEntry = entry;
                            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
                            this.notifyListeners();
                        }
                        // INP - Interaction to Next Paint
                        if ('interactionId' in entry && entry.interactionId > 0) {
                            const inpEntry = entry;
                            const duration = inpEntry.processingEnd - inpEntry.startTime;
                            if (!this.metrics.inp || duration > this.metrics.inp) {
                                this.metrics.inp = duration;
                                this.notifyListeners();
                            }
                        }
                    }
                });
                observer.observe({ type: 'first-input', buffered: true });
                observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
                this.observers.set('interaction', observer);
            }
            catch (error) {
                console.warn('Interaction observer not supported:', error);
            }
        }
    }
    /**
     * Observe layout shift (CLS)
     */
    observeLayoutShift() {
        if ('PerformanceObserver' in window) {
            try {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            this.metrics.cls = clsValue;
                            this.notifyListeners();
                        }
                    }
                });
                observer.observe({ type: 'layout-shift', buffered: true });
                this.observers.set('layout-shift', observer);
            }
            catch (error) {
                console.warn('CLS observer not supported:', error);
            }
        }
    }
    /**
     * Observe navigation timing (TTFB)
     */
    observeNavigation() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        const navEntry = entry;
                        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
                        this.notifyListeners();
                    }
                });
                observer.observe({ type: 'navigation', buffered: true });
                this.observers.set('navigation', observer);
            }
            catch (error) {
                console.warn('Navigation observer not supported:', error);
            }
        }
        else if ('performance' in window && 'timing' in performance) {
            // Fallback to performance.timing
            const timing = performance.timing;
            this.metrics.ttfb = timing.responseStart - timing.requestStart;
            this.notifyListeners();
        }
    }
    /**
     * Get performance ratings
     */
    getRatings() {
        const ratings = {};
        // FCP thresholds: good < 1800ms, poor > 3000ms
        if (this.metrics.fcp !== undefined) {
            ratings.fcp = this.metrics.fcp < 1800 ? 'good' :
                this.metrics.fcp < 3000 ? 'needs-improvement' : 'poor';
        }
        // LCP thresholds: good < 2500ms, poor > 4000ms
        if (this.metrics.lcp !== undefined) {
            ratings.lcp = this.metrics.lcp < 2500 ? 'good' :
                this.metrics.lcp < 4000 ? 'needs-improvement' : 'poor';
        }
        // FID thresholds: good < 100ms, poor > 300ms
        if (this.metrics.fid !== undefined) {
            ratings.fid = this.metrics.fid < 100 ? 'good' :
                this.metrics.fid < 300 ? 'needs-improvement' : 'poor';
        }
        // INP thresholds: good < 200ms, poor > 500ms
        if (this.metrics.inp !== undefined) {
            ratings.inp = this.metrics.inp < 200 ? 'good' :
                this.metrics.inp < 500 ? 'needs-improvement' : 'poor';
        }
        // CLS thresholds: good < 0.1, poor > 0.25
        if (this.metrics.cls !== undefined) {
            ratings.cls = this.metrics.cls < 0.1 ? 'good' :
                this.metrics.cls < 0.25 ? 'needs-improvement' : 'poor';
        }
        // TTFB thresholds: good < 800ms, poor > 1800ms
        if (this.metrics.ttfb !== undefined) {
            ratings.ttfb = this.metrics.ttfb < 800 ? 'good' :
                this.metrics.ttfb < 1800 ? 'needs-improvement' : 'poor';
        }
        return ratings;
    }
    /**
     * Get optimization recommendations
     */
    getRecommendations() {
        const recommendations = [];
        const ratings = this.getRatings();
        if (ratings.fcp === 'poor' || ratings.fcp === 'needs-improvement') {
            recommendations.push('Optimize First Contentful Paint: Minimize render-blocking resources, use font-display: swap, inline critical CSS');
        }
        if (ratings.lcp === 'poor' || ratings.lcp === 'needs-improvement') {
            recommendations.push('Optimize Largest Contentful Paint: Compress images, use CDN, implement lazy loading, preload critical resources');
        }
        if (ratings.fid === 'poor' || ratings.fid === 'needs-improvement') {
            recommendations.push('Optimize First Input Delay: Break up long tasks, use web workers, defer non-critical JavaScript');
        }
        if (ratings.inp === 'poor' || ratings.inp === 'needs-improvement') {
            recommendations.push('Optimize Interaction to Next Paint: Reduce JavaScript execution time, use passive event listeners, debounce handlers');
        }
        if (ratings.cls === 'poor' || ratings.cls === 'needs-improvement') {
            recommendations.push('Fix Cumulative Layout Shift: Set explicit dimensions on images/videos, avoid inserting content above existing content, use CSS containment');
        }
        if (ratings.ttfb === 'poor' || ratings.ttfb === 'needs-improvement') {
            recommendations.push('Optimize Time to First Byte: Use CDN, enable compression, optimize server response time, implement caching');
        }
        return recommendations;
    }
    /**
     * Get comprehensive performance report
     */
    getReport() {
        return {
            metrics: { ...this.metrics },
            ratings: this.getRatings(),
            recommendations: this.getRecommendations(),
            timestamp: Date.now()
        };
    }
    /**
     * Add performance listener
     */
    addListener(callback) {
        this.listeners.add(callback);
    }
    /**
     * Remove performance listener
     */
    removeListener(callback) {
        this.listeners.delete(callback);
    }
    /**
     * Notify all listeners
     */
    notifyListeners() {
        const report = this.getReport();
        this.listeners.forEach(callback => callback(report));
    }
    /**
     * Disconnect all observers
     */
    disconnect() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
    /**
     * Log performance summary to console
     */
    logSummary() {
        const report = this.getReport();
        console.group('🎯 Performance Summary');
        console.log('Metrics:', report.metrics);
        console.log('Ratings:', report.ratings);
        if (report.recommendations.length > 0) {
            console.log('Recommendations:');
            report.recommendations.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));
        }
        console.groupEnd();
    }
}
// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
// Auto-log summary in development
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (process.env.NODE_ENV !== 'production') {
                performanceMonitor.logSummary();
            }
        }, 3000);
    });
}
