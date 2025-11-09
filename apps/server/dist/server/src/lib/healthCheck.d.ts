/**
 * 360° Comprehensive Health Check System
 * Monitors all critical dependencies and system health
 */
import type { Request, Response } from 'express';
export interface HealthCheckResult {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    uptime: number;
    version: string;
    checks: {
        database: HealthStatus;
        memory: HealthStatus;
        openai?: HealthStatus;
        stripe?: HealthStatus;
    };
}
export interface HealthStatus {
    status: 'pass' | 'warn' | 'fail';
    message: string;
    responseTime?: number;
    details?: Record<string, any>;
}
/**
 * Perform comprehensive health check
 */
export declare function performHealthCheck(storageInstance?: any): Promise<HealthCheckResult>;
/**
 * Health check endpoint handler
 */
export declare function healthCheckHandler(storageInstance?: any): (req: Request, res: Response) => Promise<void>;
/**
 * Liveness probe - simple check that service is running
 */
export declare function livenessHandler(req: Request, res: Response): void;
/**
 * Readiness probe - check if service is ready to accept traffic
 */
export declare function readinessHandler(storageInstance?: any): (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
