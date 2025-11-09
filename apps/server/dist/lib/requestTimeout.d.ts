/**
 * Request Timeout Middleware - 360° Backend Optimization
 * Prevents hanging requests and improves server reliability
 */
import type { Request, Response, NextFunction } from 'express';
interface TimeoutOptions {
    timeout?: number;
    onTimeout?: (req: Request, res: Response) => void;
}
/**
 * Request timeout middleware
 * Automatically terminates requests that take too long
 */
export declare function requestTimeout(options?: TimeoutOptions): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Different timeout settings for different route types
 */
export declare const timeoutPresets: {
    fast: {
        timeout: number;
    };
    normal: {
        timeout: number;
    };
    ai: {
        timeout: number;
    };
    upload: {
        timeout: number;
    };
};
/**
 * Apply timeout with graceful degradation
 */
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback?: T): Promise<T>;
/**
 * Retry with timeout
 */
export declare function retryWithTimeout<T>(operation: () => Promise<T>, options?: {
    maxRetries?: number;
    timeout?: number;
    retryDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
}): Promise<T>;
export {};
//# sourceMappingURL=requestTimeout.d.ts.map