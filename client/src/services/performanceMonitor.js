export class PerformanceMonitor {
    constructor() {
        this.metrics = [];
        this.queryMetrics = [];
        this.maxMetrics = 1000;
        this.slowQueryThreshold = 100; // ms
    }
    middleware() {
        return (req, res, next) => {
            const startTime = Date.now();
            const startMemory = process.memoryUsage().heapUsed;
            const originalSend = res.send;
            const monitor = this;
            res.send = function (data) {
                const duration = Date.now() - startTime;
                const memoryUsage = process.memoryUsage().heapUsed - startMemory;
                const metric = {
                    route: req.route?.path || req.path,
                    method: req.method,
                    duration,
                    timestamp: Date.now(),
                    statusCode: res.statusCode,
                    memoryUsage
                };
                // Only track if monitoring is enabled
                if (process.env.ENABLE_PERFORMANCE_MONITORING !== 'false') {
                    monitor.addMetric(metric);
                }
                return originalSend.call(this, data);
            };
            next();
        };
    }
    addMetric(metric) {
        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }
        if (metric.duration > 1000) {
            console.warn(`⚠️ Slow request detected: ${metric.method} ${metric.route} took ${metric.duration}ms`);
        }
    }
    addQueryMetric(query, duration, rows) {
        const metric = {
            query,
            duration,
            timestamp: Date.now(),
            rows
        };
        this.queryMetrics.push(metric);
        if (this.queryMetrics.length > this.maxMetrics) {
            this.queryMetrics.shift();
        }
        if (duration > this.slowQueryThreshold) {
            console.warn(`🐌 Slow query detected (${duration}ms): ${query.substring(0, 100)}...`);
        }
    }
    getStats() {
        const now = Date.now();
        const last5Min = this.metrics.filter(m => now - m.timestamp < 5 * 60 * 1000);
        const last1Hour = this.metrics.filter(m => now - m.timestamp < 60 * 60 * 1000);
        const avgDuration5Min = last5Min.length > 0
            ? last5Min.reduce((sum, m) => sum + m.duration, 0) / last5Min.length
            : 0;
        const avgDuration1Hour = last1Hour.length > 0
            ? last1Hour.reduce((sum, m) => sum + m.duration, 0) / last1Hour.length
            : 0;
        const slowRequests = this.metrics.filter(m => m.duration > 1000);
        const routeStats = this.getRouteStats();
        const queryStats = this.getQueryStats();
        return {
            requestMetrics: {
                total: this.metrics.length,
                last5Min: last5Min.length,
                last1Hour: last1Hour.length,
                avgDuration5Min: Math.round(avgDuration5Min),
                avgDuration1Hour: Math.round(avgDuration1Hour),
                slowRequests: slowRequests.length,
                errorRate: this.calculateErrorRate(last5Min)
            },
            routeStats,
            queryStats,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime()
        };
    }
    getRouteStats() {
        const routeMap = new Map();
        for (const metric of this.metrics) {
            const key = `${metric.method} ${metric.route}`;
            const existing = routeMap.get(key) || { count: 0, totalDuration: 0, errors: 0 };
            existing.count++;
            existing.totalDuration += metric.duration;
            if (metric.statusCode >= 400) {
                existing.errors++;
            }
            routeMap.set(key, existing);
        }
        return Array.from(routeMap.entries())
            .map(([route, stats]) => ({
            route,
            count: stats.count,
            avgDuration: Math.round(stats.totalDuration / stats.count),
            errorRate: (stats.errors / stats.count) * 100
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
    getQueryStats() {
        const now = Date.now();
        const recentQueries = this.queryMetrics.filter(q => now - q.timestamp < 5 * 60 * 1000);
        const slowQueries = this.queryMetrics
            .filter(q => q.duration > this.slowQueryThreshold)
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 10)
            .map(q => ({
            query: q.query.substring(0, 100) + (q.query.length > 100 ? '...' : ''),
            duration: q.duration,
            rows: q.rows
        }));
        return {
            totalQueries: this.queryMetrics.length,
            recentQueries: recentQueries.length,
            slowQueries,
            avgDuration: recentQueries.length > 0
                ? Math.round(recentQueries.reduce((sum, q) => sum + q.duration, 0) / recentQueries.length)
                : 0
        };
    }
    calculateErrorRate(metrics) {
        if (metrics.length === 0)
            return 0;
        const errors = metrics.filter(m => m.statusCode >= 400).length;
        return Math.round((errors / metrics.length) * 100 * 100) / 100;
    }
    getSlowestRoutes(limit = 10) {
        const routeMap = new Map();
        for (const metric of this.metrics) {
            const key = `${metric.method} ${metric.route}`;
            const durations = routeMap.get(key) || [];
            durations.push(metric.duration);
            routeMap.set(key, durations);
        }
        return Array.from(routeMap.entries())
            .map(([route, durations]) => ({
            route,
            avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
            maxDuration: Math.max(...durations),
            count: durations.length
        }))
            .sort((a, b) => b.avgDuration - a.avgDuration)
            .slice(0, limit);
    }
    reset() {
        this.metrics = [];
        this.queryMetrics = [];
    }
}
export const performanceMonitor = new PerformanceMonitor();
