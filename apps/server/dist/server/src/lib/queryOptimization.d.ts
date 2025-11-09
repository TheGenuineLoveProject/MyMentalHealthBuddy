/**
 * 360° Performance Optimization: Database Query Optimization Patterns
 *
 * Provides caching, batching, and optimization strategies for database queries
 * to minimize database load and improve response times.
 *
 * ⚠️ AUTOSCALE LIMITATION:
 * The in-memory query cache (QueryCache class) only works within a SINGLE instance.
 * In Autoscale deployments with multiple instances, each instance maintains its own cache,
 * which can lead to stale data and cache inconsistency.
 *
 * PRODUCTION RECOMMENDATION:
 * For multi-instance deployments (Cloud Run Autoscale), replace QueryCache with a
 * distributed cache solution like Redis or Memcached to ensure cache consistency
 * across all instances.
 *
 * CURRENT STATUS:
 * These helpers are provided for future integration. They are NOT currently wired
 * into storage.ts or routes.ts. Integration should be done carefully after adding
 * a distributed cache backend for production safety.
 */
/**
 * Simple in-memory query cache for frequently accessed data
 *
 * Note: In production with multiple instances (Autoscale), consider using Redis
 * For now, this provides single-instance optimization with automatic TTL expiration
 */
declare class QueryCache {
    private cache;
    private maxSize;
    /**
     * Get cached query result
     */
    get<T>(key: string): T | null;
    /**
     * Set cached query result with TTL
     */
    set<T>(key: string, data: T, ttl?: number): void;
    /**
     * Invalidate cache entries by key prefix
     */
    invalidate(keyPrefix: string): void;
    /**
     * Clear entire cache
     */
    clear(): void;
    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        maxSize: number;
        entries: string[];
    };
}
export declare const queryCache: QueryCache;
/**
 * Cache TTL presets for different data types
 */
export declare const QUERY_CACHE_TTL: {
    readonly STATIC: 3600000;
    readonly REFERENCE: 1800000;
    readonly USER_SETTINGS: 300000;
    readonly ANALYTICS: 180000;
    readonly ACTIVITY: 60000;
    readonly REALTIME: 5000;
};
/**
 * Cached query wrapper with automatic invalidation
 *
 * @example
 * const crisisResources = await cachedQuery(
 *   'crisis-resources:all',
 *   () => storage.getCrisisResources(),
 *   QUERY_CACHE_TTL.REFERENCE
 * );
 */
export declare function cachedQuery<T>(cacheKey: string, queryFn: () => Promise<T>, ttl?: number): Promise<T>;
/**
 * Batch query executor to reduce database roundtrips
 *
 * @example
 * const batcher = new QueryBatcher<string, User>(
 *   async (ids) => storage.getUsersByIds(ids),
 *   { maxBatchSize: 100, maxWaitMs: 50 }
 * );
 *
 * const user1 = await batcher.load('user-id-1');
 * const user2 = await batcher.load('user-id-2'); // Batched together
 */
export declare class QueryBatcher<K, V> {
    private batchFn;
    private queue;
    private timer;
    private maxBatchSize;
    private maxWaitMs;
    constructor(batchFn: (keys: K[]) => Promise<Map<K, V>>, options?: {
        maxBatchSize?: number;
        maxWaitMs?: number;
    });
    /**
     * Load a single item, automatically batching with other concurrent loads
     */
    load(key: K): Promise<V | null>;
    private executeBatch;
}
/**
 * Query optimization helper for pagination
 *
 * @example
 * const { items, pagination } = await paginatedQuery({
 *   page: 1,
 *   limit: 20,
 *   queryFn: (offset, limit) => storage.getMoodEntries(userId, offset, limit),
 *   countFn: () => storage.getMoodEntriesCount(userId)
 * });
 */
export declare function paginatedQuery<T>(options: {
    page: number;
    limit: number;
    queryFn: (offset: number, limit: number) => Promise<T[]>;
    countFn: () => Promise<number>;
}): Promise<{
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
/**
 * Database connection pool monitoring (for production optimization)
 */
export declare function logQueryMetrics(queryName: string, startTime: number, recordCount?: number): {
    query: string;
    duration: number;
    recordCount: number | undefined;
    timestamp: string;
};
/**
 * Optimized query wrapper with metrics and error handling
 *
 * @example
 * const moods = await optimizedQuery(
 *   'get-user-moods',
 *   async () => storage.getMoodEntriesByUserId(userId)
 * );
 */
export declare function optimizedQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T>;
export {};
