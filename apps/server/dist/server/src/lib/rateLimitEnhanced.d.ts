import type { Request, Response, NextFunction } from 'express';
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
export declare class EnhancedRateLimiter {
    private requests;
    private config;
    constructor(config: RateLimitConfig);
    middleware(): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    private getIdentifier;
    private startCleanup;
    getStats(): {
        totalIdentifiers: number;
        windowMs: number;
        maxRequests: number;
    };
    reset(identifier?: string): void;
}
export declare const createRateLimiter: (config: RateLimitConfig) => EnhancedRateLimiter;
export declare const standardRateLimiter: EnhancedRateLimiter;
export declare const strictRateLimiter: EnhancedRateLimiter;
export declare const authRateLimiter: EnhancedRateLimiter;
