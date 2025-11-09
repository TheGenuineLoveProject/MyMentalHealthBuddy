/**
 * Comprehensive Rate Limiting - 360° Security Enhancement
 * Protects all API endpoints from abuse
 */
import type { Request, Response, NextFunction } from 'express';
interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
}
declare class RateLimiter {
    private store;
    private config;
    constructor(config: RateLimitConfig);
    private cleanup;
    private getKey;
    check(identifier: string): boolean;
    getRemainingRequests(identifier: string): number;
    getResetTime(identifier: string): number;
}
export declare const rateLimiters: {
    api: RateLimiter;
    auth: RateLimiter;
    chat: RateLimiter;
    billing: RateLimiter;
    export: RateLimiter;
    aiGeneration: RateLimiter;
    content: RateLimiter;
    analytics: RateLimiter;
};
/**
 * Create rate limiting middleware
 */
export declare function createRateLimitMiddleware(limiter: RateLimiter): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const rateLimitMiddleware: {
    api: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    auth: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    chat: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    billing: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    export: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    aiGeneration: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    content: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    analytics: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
export {};
//# sourceMappingURL=rateLimiting.d.ts.map