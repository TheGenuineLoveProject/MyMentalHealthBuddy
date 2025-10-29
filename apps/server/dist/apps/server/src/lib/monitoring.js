/**
 * Advanced Monitoring - 360° Observability Enhancement
 * Production-grade monitoring and metrics collection
 */
class MonitoringService {
    metrics = [];
    requestMetrics = {
        requests: {
            total: 0,
            successful: 0,
            failed: 0,
            averageResponseTime: 0
        },
        endpoints: new Map(),
        errors: [],
        system: {
            uptime: 0,
            memory: process.memoryUsage(),
            cpu: 0
        }
    };
    responseTimes = [];
    maxMetricsCount = 1000;
    maxErrorsCount = 100;
    /**
     * Record a custom metric
     */
    recordMetric(name, value, tags) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            tags
        };
        this.metrics.push(metric);
        // Keep only recent metrics
        if (this.metrics.length > this.maxMetricsCount) {
            this.metrics = this.metrics.slice(-this.maxMetricsCount);
        }
    }
    /**
     * Record API request
     */
    recordRequest(path, method, statusCode, responseTime) {
        // Update overall stats
        this.requestMetrics.requests.total++;
        if (statusCode < 400) {
            this.requestMetrics.requests.successful++;
        }
        else {
            this.requestMetrics.requests.failed++;
        }
        // Track response times
        this.responseTimes.push(responseTime);
        if (this.responseTimes.length > 100) {
            this.responseTimes.shift();
        }
        // Calculate average
        const sum = this.responseTimes.reduce((a, b) => a + b, 0);
        this.requestMetrics.requests.averageResponseTime = Math.round(sum / this.responseTimes.length);
        // Track per-endpoint stats
        const endpoint = `${method} ${path}`;
        const endpointStats = this.requestMetrics.endpoints.get(endpoint) || {
            count: 0,
            totalTime: 0,
            errors: 0
        };
        endpointStats.count++;
        endpointStats.totalTime += responseTime;
        if (statusCode >= 400) {
            endpointStats.errors++;
        }
        this.requestMetrics.endpoints.set(endpoint, endpointStats);
        // Record as metric
        this.recordMetric('http_request', responseTime, {
            path,
            method,
            status: statusCode.toString()
        });
    }
    /**
     * Record error
     */
    recordError(error, context) {
        const errorRecord = {
            message: error.message,
            stack: error.stack,
            timestamp: Date.now(),
            path: context?.path
        };
        this.requestMetrics.errors.push(errorRecord);
        // Keep only recent errors
        if (this.requestMetrics.errors.length > this.maxErrorsCount) {
            this.requestMetrics.errors = this.requestMetrics.errors.slice(-this.maxErrorsCount);
        }
        // Log to console
        console.error('[ERROR]', {
            message: error.message,
            path: context?.path,
            userId: context?.userId,
            timestamp: new Date(errorRecord.timestamp).toISOString()
        });
    }
    /**
     * Update system metrics
     */
    updateSystemMetrics() {
        this.requestMetrics.system = {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage().user / 1000000 // Convert to seconds
        };
        // Record as metrics
        this.recordMetric('system_uptime', this.requestMetrics.system.uptime);
        this.recordMetric('system_memory_used', this.requestMetrics.system.memory.heapUsed);
        this.recordMetric('system_memory_total', this.requestMetrics.system.memory.heapTotal);
    }
    /**
     * Get all metrics
     */
    getMetrics() {
        this.updateSystemMetrics();
        return this.requestMetrics;
    }
    /**
     * Get metrics summary for API response
     */
    getMetricsSummary() {
        this.updateSystemMetrics();
        const topEndpoints = Array.from(this.requestMetrics.endpoints.entries())
            .map(([endpoint, stats]) => ({
            endpoint,
            count: stats.count,
            averageTime: Math.round(stats.totalTime / stats.count),
            errorRate: stats.errors / stats.count
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        return {
            requests: this.requestMetrics.requests,
            topEndpoints,
            recentErrors: this.requestMetrics.errors.slice(-10),
            system: {
                uptime: this.requestMetrics.system.uptime,
                memory: {
                    used: Math.round(this.requestMetrics.system.memory.heapUsed / 1024 / 1024),
                    total: Math.round(this.requestMetrics.system.memory.heapTotal / 1024 / 1024),
                    unit: 'MB'
                }
            }
        };
    }
    /**
     * Reset all metrics
     */
    reset() {
        this.metrics = [];
        this.responseTimes = [];
        this.requestMetrics = {
            requests: {
                total: 0,
                successful: 0,
                failed: 0,
                averageResponseTime: 0
            },
            endpoints: new Map(),
            errors: [],
            system: {
                uptime: 0,
                memory: process.memoryUsage(),
                cpu: 0
            }
        };
    }
}
// Global instance
export const monitoring = new MonitoringService();
// Update system metrics every 30 seconds
setInterval(() => {
    monitoring.updateSystemMetrics();
}, 30000);
/**
 * Request monitoring middleware
 */
export function monitoringMiddleware(req, res, next) {
    const start = Date.now();
    // Capture response
    res.on('finish', () => {
        const duration = Date.now() - start;
        monitoring.recordRequest(req.path, req.method, res.statusCode, duration);
    });
    next();
}
