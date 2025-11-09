/**
 * Advanced Monitoring - 360° Observability Enhancement
 * Production-grade monitoring and metrics collection
 */
interface PerformanceMetrics {
    requests: {
        total: number;
        successful: number;
        failed: number;
        averageResponseTime: number;
    };
    endpoints: Map<string, {
        count: number;
        totalTime: number;
        errors: number;
    }>;
    errors: Array<{
        message: string;
        stack?: string;
        timestamp: number;
        path?: string;
    }>;
    system: {
        uptime: number;
        memory: NodeJS.MemoryUsage;
        cpu: number;
    };
}
declare class MonitoringService {
    private metrics;
    private requestMetrics;
    private responseTimes;
    private maxMetricsCount;
    private maxErrorsCount;
    /**
     * Record a custom metric
     */
    recordMetric(name: string, value: number, tags?: Record<string, string>): void;
    /**
     * Record API request
     */
    recordRequest(path: string, method: string, statusCode: number, responseTime: number): void;
    /**
     * Record error
     */
    recordError(error: Error, context?: {
        path?: string;
        userId?: string;
    }): void;
    /**
     * Update system metrics
     */
    updateSystemMetrics(): void;
    /**
     * Get all metrics
     */
    getMetrics(): PerformanceMetrics;
    /**
     * Get metrics summary for API response
     */
    getMetricsSummary(): {
        requests: {
            total: number;
            successful: number;
            failed: number;
            averageResponseTime: number;
        };
        topEndpoints: {
            endpoint: string;
            count: number;
            averageTime: number;
            errorRate: number;
        }[];
        recentErrors: {
            message: string;
            stack?: string;
            timestamp: number;
            path?: string;
        }[];
        system: {
            uptime: number;
            memory: {
                used: number;
                total: number;
                unit: string;
            };
        };
    };
    /**
     * Reset all metrics
     */
    reset(): void;
}
export declare const monitoring: MonitoringService;
/**
 * Request monitoring middleware
 */
export declare function monitoringMiddleware(req: any, res: any, next: any): void;
export {};
//# sourceMappingURL=monitoring.d.ts.map