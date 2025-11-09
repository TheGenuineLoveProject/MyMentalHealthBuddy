import type { Request, Response, NextFunction } from 'express';
export declare class PerformanceMonitor {
    private metrics;
    private queryMetrics;
    private maxMetrics;
    private slowQueryThreshold;
    middleware(): (req: Request, res: Response, next: NextFunction) => void;
    private addMetric;
    addQueryMetric(query: string, duration: number, rows: number): void;
    getStats(): {
        requestMetrics: {
            total: number;
            last5Min: number;
            last1Hour: number;
            avgDuration5Min: number;
            avgDuration1Hour: number;
            slowRequests: number;
            errorRate: number;
        };
        routeStats: {
            route: string;
            count: number;
            avgDuration: number;
            errorRate: number;
        }[];
        queryStats: {
            totalQueries: number;
            recentQueries: number;
            slowQueries: {
                query: string;
                duration: number;
                rows: number;
            }[];
            avgDuration: number;
        };
        memoryUsage: NodeJS.MemoryUsage;
        uptime: number;
    };
    private getRouteStats;
    private getQueryStats;
    private calculateErrorRate;
    getSlowestRoutes(limit?: number): {
        route: string;
        avgDuration: number;
        maxDuration: number;
        count: number;
    }[];
    reset(): void;
}
export declare const performanceMonitor: PerformanceMonitor;
//# sourceMappingURL=performanceMonitor.d.ts.map