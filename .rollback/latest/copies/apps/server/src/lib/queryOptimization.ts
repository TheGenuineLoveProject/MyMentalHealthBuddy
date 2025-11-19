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

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Simple in-memory query cache for frequently accessed data
 * 
 * Note: In production with multiple instances (Autoscale), consider using Redis
 * For now, this provides single-instance optimization with automatic TTL expiration
 */
class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000; // Prevent unbounded memory growth
  
  /**
   * Get cached query result
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry is still valid
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * Set cached query result with TTL
   */
  set<T>(key: string, data: T, ttl: number = 60000): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  /**
   * Invalidate cache entries by key prefix
   */
  invalidate(keyPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.keys()),
    };
  }
}

export const queryCache = new QueryCache();

/**
 * Cache TTL presets for different data types
 */
export const QUERY_CACHE_TTL = {
  // Static data that rarely changes
  STATIC: 3600000, // 1 hour
  
  // Reference data (crisis resources, etc.)
  REFERENCE: 1800000, // 30 minutes
  
  // User preferences and settings
  USER_SETTINGS: 300000, // 5 minutes
  
  // Analytics and aggregated data
  ANALYTICS: 180000, // 3 minutes
  
  // Recent activity data
  ACTIVITY: 60000, // 1 minute
  
  // Real-time data (minimal caching for consistency)
  REALTIME: 5000, // 5 seconds
} as const;

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
export async function cachedQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl: number = QUERY_CACHE_TTL.ACTIVITY
): Promise<T> {
  // Try to get from cache first
  const cached = queryCache.get<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }
  
  // Execute query and cache result
  const result = await queryFn();
  queryCache.set(cacheKey, result, ttl);
  
  return result;
}

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
export class QueryBatcher<K, V> {
  private queue: Array<{
    key: K;
    resolve: (value: V | null) => void;
    reject: (error: Error) => void;
  }> = [];
  
  private timer: NodeJS.Timeout | null = null;
  private maxBatchSize: number;
  private maxWaitMs: number;
  
  constructor(
    private batchFn: (keys: K[]) => Promise<Map<K, V>>,
    options: {
      maxBatchSize?: number;
      maxWaitMs?: number;
    } = {}
  ) {
    this.maxBatchSize = options.maxBatchSize || 100;
    this.maxWaitMs = options.maxWaitMs || 50;
  }
  
  /**
   * Load a single item, automatically batching with other concurrent loads
   */
  async load(key: K): Promise<V | null> {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject });
      
      // Schedule batch execution
      if (this.queue.length >= this.maxBatchSize) {
        this.executeBatch();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.executeBatch(), this.maxWaitMs);
      }
    });
  }
  
  private async executeBatch() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    const batch = this.queue.splice(0, this.maxBatchSize);
    if (batch.length === 0) return;
    
    try {
      const keys = batch.map(item => item.key);
      const results = await this.batchFn(keys);
      
      for (const item of batch) {
        const value = results.get(item.key) || null;
        item.resolve(value);
      }
    } catch (error) {
      for (const item of batch) {
        item.reject(error as Error);
      }
    }
  }
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
export async function paginatedQuery<T>(options: {
  page: number;
  limit: number;
  queryFn: (offset: number, limit: number) => Promise<T[]>;
  countFn: () => Promise<number>;
}) {
  const { page, limit, queryFn, countFn } = options;
  
  // Validate inputs
  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(Math.max(1, limit), 100); // Cap at 100 items
  
  const offset = (validatedPage - 1) * validatedLimit;
  
  // Execute query and count in parallel
  const [items, total] = await Promise.all([
    queryFn(offset, validatedLimit),
    countFn(),
  ]);
  
  const totalPages = Math.ceil(total / validatedLimit);
  
  return {
    items,
    pagination: {
      page: validatedPage,
      limit: validatedLimit,
      total,
      totalPages,
      hasNext: validatedPage < totalPages,
      hasPrev: validatedPage > 1,
    },
  };
}

/**
 * Database connection pool monitoring (for production optimization)
 */
export function logQueryMetrics(
  queryName: string,
  startTime: number,
  recordCount?: number
) {
  const duration = Date.now() - startTime;
  
  // Log slow queries (>500ms) for optimization
  if (duration > 500) {
    console.warn(`[SLOW QUERY] ${queryName} took ${duration}ms${recordCount ? ` (${recordCount} records)` : ''}`);
  }
  
  // Return metrics for monitoring
  return {
    query: queryName,
    duration,
    recordCount,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Optimized query wrapper with metrics and error handling
 * 
 * @example
 * const moods = await optimizedQuery(
 *   'get-user-moods',
 *   async () => storage.getMoodEntriesByUserId(userId)
 * );
 */
export async function optimizedQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await queryFn();
    
    // Log metrics for arrays
    if (Array.isArray(result)) {
      logQueryMetrics(queryName, startTime, result.length);
    } else {
      logQueryMetrics(queryName, startTime);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[QUERY ERROR] ${queryName} failed after ${duration}ms:`, error);
    throw error;
  }
}
