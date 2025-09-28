import responseTime from 'response-time';
import { randomUUID } from 'crypto';
// Request ID middleware
export function requestId(req, res, next) {
    const id = req.headers['x-request-id'] || randomUUID();
    req.id = id;
    res.setHeader('X-Request-ID', id);
    next();
}
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            totalRequests: 0,
            totalErrors: 0,
            averageResponseTime: 0,
            p95ResponseTime: 0,
            p99ResponseTime: 0,
            requestsPerMinute: 0,
            errorRate: 0,
            responseTimes: [],
            lastReset: new Date()
        };
        this.maxSamples = 1000;
        this.requestTimestamps = [];
    }
    recordRequest(responseTime, isError = false) {
        this.metrics.totalRequests++;
        if (isError) {
            this.metrics.totalErrors++;
        }
        // Record response time
        this.metrics.responseTimes.push(responseTime);
        if (this.metrics.responseTimes.length > this.maxSamples) {
            this.metrics.responseTimes.shift();
        }
        // Track request rate
        const now = Date.now();
        this.requestTimestamps.push(now);
        // Keep only last minute of timestamps
        const oneMinuteAgo = now - 60000;
        this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);
        this.updateMetrics();
    }
    updateMetrics() {
        const times = [...this.metrics.responseTimes].sort((a, b) => a - b);
        if (times.length > 0) {
            // Calculate average
            const sum = times.reduce((acc, val) => acc + val, 0);
            this.metrics.averageResponseTime = sum / times.length;
            // Calculate percentiles
            const p95Index = Math.floor(times.length * 0.95);
            const p99Index = Math.floor(times.length * 0.99);
            this.metrics.p95ResponseTime = times[p95Index] || 0;
            this.metrics.p99ResponseTime = times[p99Index] || 0;
        }
        // Calculate requests per minute
        this.metrics.requestsPerMinute = this.requestTimestamps.length;
        // Calculate error rate
        this.metrics.errorRate = this.metrics.totalRequests > 0
            ? this.metrics.totalErrors / this.metrics.totalRequests
            : 0;
    }
    getMetrics() {
        return { ...this.metrics };
    }
    reset() {
        this.metrics = {
            totalRequests: 0,
            totalErrors: 0,
            averageResponseTime: 0,
            p95ResponseTime: 0,
            p99ResponseTime: 0,
            requestsPerMinute: 0,
            errorRate: 0,
            responseTimes: [],
            lastReset: new Date()
        };
        this.requestTimestamps = [];
    }
}
export const performanceMonitor = new PerformanceMonitor();
// Response time middleware with monitoring
export const responseTimeMiddleware = responseTime((req, res, time) => {
    const isError = res.statusCode >= 400;
    performanceMonitor.recordRequest(time, isError);
    // Add performance headers
    res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
    // Log slow requests
    if (time > 1000) {
        console.warn(`Slow request detected: ${req.method} ${req.path} took ${time.toFixed(2)}ms`);
    }
});
// Health check with detailed metrics
export function getHealthMetrics() {
    const metrics = performanceMonitor.getMetrics();
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    return {
        status: metrics.errorRate < 0.05 ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: uptime,
        performance: {
            totalRequests: metrics.totalRequests,
            requestsPerMinute: metrics.requestsPerMinute,
            averageResponseTime: `${metrics.averageResponseTime.toFixed(2)}ms`,
            p95ResponseTime: `${metrics.p95ResponseTime.toFixed(2)}ms`,
            p99ResponseTime: `${metrics.p99ResponseTime.toFixed(2)}ms`,
            errorRate: `${(metrics.errorRate * 100).toFixed(2)}%`
        },
        memory: {
            rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`,
            heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
            heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
            external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)}MB`
        },
        lastReset: metrics.lastReset
    };
}
// Graceful shutdown handler
export function setupGracefulShutdown(server) {
    let isShuttingDown = false;
    const shutdown = (signal) => {
        if (isShuttingDown)
            return;
        isShuttingDown = true;
        console.log(`\n${signal} received. Starting graceful shutdown...`);
        // Stop accepting new connections
        server.close(() => {
            console.log('HTTP server closed');
            // Cleanup operations
            performanceMonitor.reset();
            // Exit process
            process.exit(0);
        });
        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.error('Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    };
    // Handle different termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        shutdown('unhandledRejection');
    });
}
// Request timeout middleware
export function timeoutMiddleware(timeout = 30000) {
    return (req, res, next) => {
        const timer = setTimeout(() => {
            if (!res.headersSent) {
                res.status(408).json({
                    error: 'Request Timeout',
                    message: 'The request took too long to process'
                });
            }
        }, timeout);
        res.on('finish', () => {
            clearTimeout(timer);
        });
        next();
    };
}
