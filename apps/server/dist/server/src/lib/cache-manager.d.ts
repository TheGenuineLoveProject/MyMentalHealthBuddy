/**
 * Server-Side Cache Manager
 * Implements multi-layer caching for optimal performance
 */
interface CacheStats {
    hits: number;
    misses: number;
    sets: number;
    evictions: number;
    hitRate: number;
}
/**
 * In-Memory Cache with LRU eviction
 */
export declare class MemoryCache<T = any> {
    private cache;
    private maxSize;
    private defaultTTL;
    private stats;
    constructor(maxSize?: number, defaultTTL?: number);
    /**
     * Get value from cache
     */
    get(key: string): T | null;
    /**
     * Set value in cache
     */
    set(key: string, value: T, ttl?: number): void;
    /**
     * Delete value from cache
     */
    delete(key: string): boolean;
    /**
     * Check if key exists
     */
    has(key: string): boolean;
    /**
     * Clear entire cache
     */
    clear(): void;
    /**
     * Get cache stats
     */
    getStats(): CacheStats;
    /**
     * Get cache size
     */
    size(): number;
    /**
     * Evict least recently used entry
     */
    private evictLRU;
    /**
     * Clean up expired entries
     */
    private cleanup;
    /**
     * Update hit rate
     */
    private updateHitRate;
}
/**
 * Cache key builder utility
 */
export declare class CacheKeyBuilder {
    private parts;
    constructor(prefix?: string);
    add(part: string | number): this;
    build(): string;
    static from(...parts: (string | number)[]): string;
}
/**
 * Singleton cache instances
 */
export declare const apiCache: MemoryCache<any>;
export declare const queryCache: MemoryCache<any>;
export declare const sessionCache: MemoryCache<any>;
export {};
