export interface QueryOptions {
    useCache?: boolean;
    cacheKey?: string;
    cacheTTL?: number;
    trackPerformance?: boolean;
}
export declare class QueryOptimizer {
    private queryCache;
    private defaultTTL;
    constructor(defaultTTL?: number);
    executeQuery<T>(queryFn: () => Promise<T>, options?: QueryOptions): Promise<T>;
    private getFromCache;
    private setInCache;
    invalidateCache(pattern?: string): void;
    getCacheStats(): {
        size: number;
        keys: string[];
    };
    private startCacheCleanup;
}
export declare const queryOptimizer: QueryOptimizer;
export declare function withQueryOptimization<T>(queryFn: () => Promise<T>, cacheKey?: string): Promise<T>;
//# sourceMappingURL=queryOptimizer.d.ts.map