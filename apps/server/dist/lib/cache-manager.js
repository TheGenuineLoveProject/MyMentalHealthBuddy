"use strict";
/**
 * Server-Side Cache Manager
 * Implements multi-layer caching for optimal performance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCache = exports.queryCache = exports.apiCache = exports.CacheKeyBuilder = exports.MemoryCache = void 0;
/**
 * In-Memory Cache with LRU eviction
 */
class MemoryCache {
    cache = new Map();
    maxSize;
    defaultTTL;
    stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        evictions: 0,
        hitRate: 0
    };
    constructor(maxSize = 1000, defaultTTL = 3600000) {
        this.maxSize = maxSize;
        this.defaultTTL = defaultTTL;
        // Start cleanup interval
        setInterval(() => this.cleanup(), 60000);
    }
    /**
     * Get value from cache
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.stats.misses++;
            this.updateHitRate();
            return null;
        }
        // Check expiration
        if (Date.now() > entry.expires) {
            this.cache.delete(key);
            this.stats.misses++;
            this.stats.evictions++;
            this.updateHitRate();
            return null;
        }
        // Update access stats
        entry.hits++;
        entry.lastAccessed = Date.now();
        this.stats.hits++;
        this.updateHitRate();
        return entry.value;
    }
    /**
     * Set value in cache
     */
    set(key, value, ttl) {
        // Evict oldest if at max size
        if (this.cache.size >= this.maxSize) {
            this.evictLRU();
        }
        const expires = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, {
            value,
            expires,
            hits: 0,
            lastAccessed: Date.now()
        });
        this.stats.sets++;
    }
    /**
     * Delete value from cache
     */
    delete(key) {
        return this.cache.delete(key);
    }
    /**
     * Check if key exists
     */
    has(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return false;
        if (Date.now() > entry.expires) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    /**
     * Clear entire cache
     */
    clear() {
        this.cache.clear();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            evictions: 0,
            hitRate: 0
        };
    }
    /**
     * Get cache stats
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Get cache size
     */
    size() {
        return this.cache.size;
    }
    /**
     * Evict least recently used entry
     */
    evictLRU() {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestKey = key;
            }
        }
        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.stats.evictions++;
        }
    }
    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expires) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => {
            this.cache.delete(key);
            this.stats.evictions++;
        });
    }
    /**
     * Update hit rate
     */
    updateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }
}
exports.MemoryCache = MemoryCache;
/**
 * Cache key builder utility
 */
class CacheKeyBuilder {
    parts = [];
    constructor(prefix) {
        if (prefix) {
            this.parts.push(prefix);
        }
    }
    add(part) {
        this.parts.push(String(part));
        return this;
    }
    build() {
        return this.parts.join(':');
    }
    static from(...parts) {
        return parts.join(':');
    }
}
exports.CacheKeyBuilder = CacheKeyBuilder;
/**
 * Singleton cache instances
 */
exports.apiCache = new MemoryCache(500, 300000); // 5 min TTL
exports.queryCache = new MemoryCache(1000, 600000); // 10 min TTL
exports.sessionCache = new MemoryCache(5000, 1800000); // 30 min TTL
