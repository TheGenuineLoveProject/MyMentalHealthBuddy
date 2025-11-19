/**
 * Advanced Analytics Engine
 * Real-time analytics, user behavior tracking, and data visualization
 */

export interface AnalyticsEvent {
  id: string;
  type: string;
  category: 'user-action' | 'system' | 'performance' | 'error';
  timestamp: number;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
  value?: number;
}

export interface UserBehaviorMetrics {
  sessionDuration: number;
  pageViews: number;
  interactions: number;
  bounceRate: number;
  engagementScore: number;
  conversionEvents: string[];
}

export interface PerformanceMetrics {
  avgLoadTime: number;
  avgResponseTime: number;
  errorRate: number;
  successRate: number;
  uptime: number;
}

export interface ConversionFunnel {
  stage: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
}

/**
 * Analytics Tracker
 */
export class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private sessionStart: number;
  private maxEvents = 5000;
  private flushInterval = 60000; // 1 minute
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.loadEvents();
    this.startAutoFlush();
  }

  /**
   * Track an event
   */
  track(
    type: string,
    category: AnalyticsEvent['category'] = 'user-action',
    metadata?: Record<string, any>,
    value?: number
  ): void {
    const event: AnalyticsEvent = {
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
  trackPageView(page: string, referrer?: string): void {
    this.track('page_view', 'user-action', {
      page,
      referrer,
      url: window.location.href
    });
  }

  /**
   * Track user interaction
   */
  trackInteraction(element: string, action: string, metadata?: Record<string, any>): void {
    this.track(`${element}_${action}`, 'user-action', {
      element,
      action,
      ...metadata
    });
  }

  /**
   * Track conversion event
   */
  trackConversion(goal: string, value?: number, metadata?: Record<string, any>): void {
    this.track(`conversion_${goal}`, 'user-action', {
      goal,
      ...metadata
    }, value);
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: string, value: number, metadata?: Record<string, any>): void {
    this.track(`performance_${metric}`, 'performance', metadata, value);
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: string): void {
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
  getUserBehaviorMetrics(): UserBehaviorMetrics {
    const sessionDuration = Date.now() - this.sessionStart;
    const pageViews = this.events.filter(e => e.type === 'page_view').length;
    const interactions = this.events.filter(e => e.category === 'user-action').length;

    // Calculate bounce rate (single page session)
    const bounceRate = pageViews === 1 ? 100 : 0;

    // Calculate engagement score (0-100)
    const engagementScore = Math.min(100, Math.floor(
      (interactions * 10) + (sessionDuration / 60000) + (pageViews * 5)
    ));

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
  getPerformanceMetrics(): PerformanceMetrics {
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
  getConversionFunnel(stages: string[]): ConversionFunnel[] {
    const funnel: ConversionFunnel[] = [];
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
  getEventsByCategory(category: AnalyticsEvent['category']): AnalyticsEvent[] {
    return this.events.filter(e => e.category === category);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: string): AnalyticsEvent[] {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Get events in time range
   */
  getEventsInRange(startTime: number, endTime: number): AnalyticsEvent[] {
    return this.events.filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
  }

  /**
   * Export analytics data
   */
  exportData(): {
    events: AnalyticsEvent[];
    userBehavior: UserBehaviorMetrics;
    performance: PerformanceMetrics;
    sessionId: string;
    sessionDuration: number;
  } {
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
  clear(): void {
    this.events = [];
    this.saveEvents();
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load events from localStorage
   */
  private loadEvents(): void {
    try {
      const stored = localStorage.getItem('analytics-events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load analytics events:', error);
    }
  }

  /**
   * Save events to localStorage
   */
  private saveEvents(): void {
    try {
      localStorage.setItem('analytics-events', JSON.stringify(this.events));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Flush events to backend (if configured)
   */
  private async flush(): Promise<void> {
    if (this.events.length === 0) return;

    // In a real implementation, this would send to backend
    // For now, we just save to localStorage
    this.saveEvents();
  }

  /**
   * Stop auto-flush
   */
  destroy(): void {
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
  private tracker: AnalyticsTracker;

  constructor(tracker: AnalyticsTracker) {
    this.tracker = tracker;
  }

  /**
   * Get real-time dashboard data
   */
  getDashboardData(): {
    liveUsers: number;
    pageViewsToday: number;
    avgSessionDuration: string;
    topPages: Array<{ page: string; views: number }>;
    conversionRate: number;
    errorRate: number;
    engagementScore: number;
  } {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayEvents = this.tracker.getEventsInRange(today, Date.now());

    const pageViews = todayEvents.filter(e => e.type === 'page_view');
    const pageViewsCount = pageViews.length;

    // Count page views by page
    const pageViewsByPage = pageViews.reduce((acc, event) => {
      const page = event.metadata?.page || 'unknown';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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
  getTimeSeriesData(metric: 'page_views' | 'interactions' | 'errors', hours = 24): Array<{ time: string; value: number }> {
    const now = Date.now();
    const startTime = now - (hours * 3600000);
    const events = this.tracker.getEventsInRange(startTime, now);

    const buckets: Record<string, number> = {};
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
