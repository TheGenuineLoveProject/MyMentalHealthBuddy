/**
 * Advanced Analytics Engine
 * Real-time analytics, user behavior tracking, and data visualization
 */
/**
 * Analytics Tracker
 */
export class AnalyticsTracker {
    events = [];
    sessionId;
    sessionStart;
    maxEvents = 5000;
    flushInterval = 60000; // 1 minute
    flushTimer;
    constructor() {
        this.sessionId = this.generateSessionId();
        this.sessionStart = Date.now();
        this.loadEvents();
        this.startAutoFlush();
    }
    /**
     * Track an event
     */
    track(type, category = 'user-action', metadata, value) {
        const event = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            category,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            metadata,
            value
        };
        this.events.push(event);
        // Limit events in memory
        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }
        this.saveEvents();
    }
    /**
     * Track page view
     */
    trackPageView(page, referrer) {
        this.track('page_view', 'user-action', {
            page,
            referrer,
            url: window.location.href
        });
    }
    /**
     * Track user interaction
     */
    trackInteraction(element, action, metadata) {
        this.track(`${element}_${action}`, 'user-action', {
            element,
            action,
            ...metadata
        });
    }
    /**
     * Track conversion event
     */
    trackConversion(goal, value, metadata) {
        this.track(`conversion_${goal}`, 'user-action', {
            goal,
            ...metadata
        }, value);
    }
    /**
     * Track performance metric
     */
    trackPerformance(metric, value, metadata) {
        this.track(`performance_${metric}`, 'performance', metadata, value);
    }
    /**
     * Track error
     */
    trackError(error, context) {
        this.track('error', 'error', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            context
        });
    }
    /**
     * Get user behavior metrics
     */
    getUserBehaviorMetrics() {
        const sessionDuration = Date.now() - this.sessionStart;
        const pageViews = this.events.filter(e => e.type === 'page_view').length;
        const interactions = this.events.filter(e => e.category === 'user-action').length;
        // Calculate bounce rate (single page session)
        const bounceRate = pageViews === 1 ? 100 : 0;
        // Calculate engagement score (0-100)
        const engagementScore = Math.min(100, Math.floor((interactions * 10) + (sessionDuration / 60000) + (pageViews * 5)));
        const conversionEvents = this.events
            .filter(e => e.type.startsWith('conversion_'))
            .map(e => e.type.replace('conversion_', ''));
        return {
            sessionDuration,
            pageViews,
            interactions,
            bounceRate,
            engagementScore,
            conversionEvents
        };
    }
    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        const perfEvents = this.events.filter(e => e.category === 'performance');
        const loadTimes = perfEvents
            .filter(e => e.type === 'performance_load_time')
            .map(e => e.value || 0);
        const responseTimes = perfEvents
            .filter(e => e.type === 'performance_response_time')
            .map(e => e.value || 0);
        const errorEvents = this.events.filter(e => e.category === 'error');
        const successEvents = this.events.filter(e => e.category === 'user-action' && !e.type.includes('error'));
        const avgLoadTime = loadTimes.length > 0
            ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length
            : 0;
        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;
        const totalRequests = errorEvents.length + successEvents.length;
        const errorRate = totalRequests > 0 ? (errorEvents.length / totalRequests) * 100 : 0;
        const successRate = 100 - errorRate;
        return {
            avgLoadTime,
            avgResponseTime,
            errorRate,
            successRate,
            uptime: 100 - (errorRate / 10) // Simplified uptime calculation
        };
    }
    /**
     * Get conversion funnel data
     */
    getConversionFunnel(stages) {
        const funnel = [];
        let previousUsers = this.events.length; // Total events as base
        stages.forEach((stage, index) => {
            const stageEvents = this.events.filter(e => e.type.includes(stage)).length;
            const conversionRate = previousUsers > 0 ? (stageEvents / previousUsers) * 100 : 0;
            const dropoffRate = 100 - conversionRate;
            funnel.push({
                stage,
                users: stageEvents,
                conversionRate,
                dropoffRate
            });
            previousUsers = stageEvents;
        });
        return funnel;
    }
    /**
     * Get events by category
     */
    getEventsByCategory(category) {
        return this.events.filter(e => e.category === category);
    }
    /**
     * Get events by type
     */
    getEventsByType(type) {
        return this.events.filter(e => e.type === type);
    }
    /**
     * Get events in time range
     */
    getEventsInRange(startTime, endTime) {
        return this.events.filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
    }
    /**
     * Export analytics data
     */
    exportData() {
        return {
            events: this.events,
            userBehavior: this.getUserBehaviorMetrics(),
            performance: this.getPerformanceMetrics(),
            sessionId: this.sessionId,
            sessionDuration: Date.now() - this.sessionStart
        };
    }
    /**
     * Clear all events
     */
    clear() {
        this.events = [];
        this.saveEvents();
    }
    /**
     * Generate session ID
     */
    generateSessionId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Load events from localStorage
     */
    loadEvents() {
        try {
            const stored = localStorage.getItem('analytics-events');
            if (stored) {
                this.events = JSON.parse(stored);
            }
        }
        catch (error) {
            console.warn('Failed to load analytics events:', error);
        }
    }
    /**
     * Save events to localStorage
     */
    saveEvents() {
        try {
            localStorage.setItem('analytics-events', JSON.stringify(this.events));
        }
        catch (error) {
            console.warn('Failed to save analytics events:', error);
        }
    }
    /**
     * Start auto-flush timer
     */
    startAutoFlush() {
        this.flushTimer = setInterval(() => {
            this.flush();
        }, this.flushInterval);
    }
    /**
     * Flush events to backend (if configured)
     */
    async flush() {
        if (this.events.length === 0)
            return;
        // In a real implementation, this would send to backend
        // For now, we just save to localStorage
        this.saveEvents();
    }
    /**
     * Stop auto-flush
     */
    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flush();
    }
}
/**
 * Real-time Analytics Dashboard Data Provider
 */
export class DashboardDataProvider {
    tracker;
    constructor(tracker) {
        this.tracker = tracker;
    }
    /**
     * Get real-time dashboard data
     */
    getDashboardData() {
        const today = new Date().setHours(0, 0, 0, 0);
        const todayEvents = this.tracker.getEventsInRange(today, Date.now());
        const pageViews = todayEvents.filter(e => e.type === 'page_view');
        const pageViewsCount = pageViews.length;
        // Count page views by page
        const pageViewsByPage = pageViews.reduce((acc, event) => {
            const page = event.metadata?.page || 'unknown';
            acc[page] = (acc[page] || 0) + 1;
            return acc;
        }, {});
        const topPages = Object.entries(pageViewsByPage)
            .map(([page, views]) => ({ page, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
        const userBehavior = this.tracker.getUserBehaviorMetrics();
        const performance = this.tracker.getPerformanceMetrics();
        const avgSessionDurationMs = userBehavior.sessionDuration;
        const minutes = Math.floor(avgSessionDurationMs / 60000);
        const seconds = Math.floor((avgSessionDurationMs % 60000) / 1000);
        const avgSessionDuration = `${minutes}m ${seconds}s`;
        const conversions = userBehavior.conversionEvents.length;
        const conversionRate = pageViewsCount > 0 ? (conversions / pageViewsCount) * 100 : 0;
        return {
            liveUsers: 1, // Current session
            pageViewsToday: pageViewsCount,
            avgSessionDuration,
            topPages,
            conversionRate,
            errorRate: performance.errorRate,
            engagementScore: userBehavior.engagementScore
        };
    }
    /**
     * Get time series data for charts
     */
    getTimeSeriesData(metric, hours = 24) {
        const now = Date.now();
        const startTime = now - (hours * 3600000);
        const events = this.tracker.getEventsInRange(startTime, now);
        const buckets = {};
        const bucketSize = 3600000; // 1 hour
        events.forEach(event => {
            let matchesMetric = false;
            switch (metric) {
                case 'page_views':
                    matchesMetric = event.type === 'page_view';
                    break;
                case 'interactions':
                    matchesMetric = event.category === 'user-action';
                    break;
                case 'errors':
                    matchesMetric = event.category === 'error';
                    break;
            }
            if (matchesMetric) {
                const bucketTime = Math.floor(event.timestamp / bucketSize) * bucketSize;
                const timeLabel = new Date(bucketTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                buckets[timeLabel] = (buckets[timeLabel] || 0) + 1;
            }
        });
        return Object.entries(buckets)
            .map(([time, value]) => ({ time, value }))
            .sort((a, b) => a.time.localeCompare(b.time));
    }
}
// Export singleton instance
export const analyticsTracker = new AnalyticsTracker();
export const dashboardProvider = new DashboardDataProvider(analyticsTracker);
