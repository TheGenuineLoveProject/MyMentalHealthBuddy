import type { Request, Response, NextFunction } from 'express';
export interface CacheConfig {
    maxAge: number;
    staleWhileRevalidate?: number;
    private?: boolean;
    mustRevalidate?: boolean;
    noStore?: boolean;
}
export declare const CACHE_PRESETS: {
    readonly PUBLIC_LONG: {
        readonly maxAge: 3600;
        readonly staleWhileRevalidate: 7200;
    };
    readonly PUBLIC_MEDIUM: {
        readonly maxAge: 300;
        readonly staleWhileRevalidate: 600;
    };
    readonly PUBLIC_SHORT: {
        readonly maxAge: 60;
        readonly staleWhileRevalidate: 120;
    };
    readonly PRIVATE_MEDIUM: {
        readonly maxAge: 180;
        readonly private: true;
    };
    readonly PRIVATE_SHORT: {
        readonly maxAge: 30;
        readonly private: true;
    };
    readonly NO_CACHE: {
        readonly maxAge: 0;
        readonly noStore: true;
        readonly mustRevalidate: true;
    };
};
/**
 * Middleware factory for API response caching
 *
 * @example
 * // Long cache for public crisis resources
 * app.get('/api/crisis-resources', apiCache(CACHE_PRESETS.PUBLIC_LONG), handler);
 *
 * // Short cache for user mood entries
 * app.get('/api/moods', requireAuth, apiCache(CACHE_PRESETS.PRIVATE_SHORT), handler);
 *
 * // No cache for real-time chat
 * app.post('/api/chat', requireAuth, apiCache(CACHE_PRESETS.NO_CACHE), handler);
 */
export declare function apiCache(config: CacheConfig): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Conditional caching based on request context
 *
 * @example
 * app.get('/api/data', conditionalCache({
 *   authenticated: CACHE_PRESETS.PRIVATE_SHORT,
 *   public: CACHE_PRESETS.PUBLIC_MEDIUM
 * }));
 */
export declare function conditionalCache(options: {
    authenticated: CacheConfig;
    public: CacheConfig;
}): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Vary header middleware to ensure proper cache keying
 * Appends to existing Vary headers instead of overwriting
 *
 * @example
 * app.use('/api', varyHeader(['Authorization', 'Accept-Encoding']));
 */
export declare function varyHeader(headers: string[]): (req: Request, res: Response, next: NextFunction) => void;
