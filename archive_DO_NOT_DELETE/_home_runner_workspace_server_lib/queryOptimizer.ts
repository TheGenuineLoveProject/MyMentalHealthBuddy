import { performanceMonitor } from '../services/performanceMonitor.js';

export interface QueryOptions {
  useCache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
  trackPerformance?: boolean;
}

export class QueryOptimizer {
  private queryCache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    this.queryCache = new Map();
    this.defaultTTL = defaultTTL;

    this.startCacheCleanup();
  }

  async executeQuery<T>(
    queryFn: () => Promise<T>,
    options: QueryOptions = {}
  ): Promise<T> {
    const {
      useCache = false,
      cacheKey,
      cacheTTL = this.defaultTTL,
      trackPerformance = true
    } = options;

    if (useCache && cacheKey) {
      const cached = this.getFromCache(cacheKey);
      if (cached !== null) {
        return cached as T;
      }
    }

    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;

      if (trackPerformance) {
        const queryString = queryFn.toString().substring(0, 100);
        performanceMonitor.addQueryMetric(
          queryString,
          duration,
          Array.isArray(result) ? result.length : 1
        );
      }

      if (useCache && cacheKey) {
        this.setInCache(cacheKey, result, cacheTTL);
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Query failed after ${duration}ms:`, error);
      throw error;
    }
  }

  private getFromCache(key: string): any | null {
    const cached = this.queryCache.get(key);
    
    if (!cached) {
      return null;
    }

    // Respect per-entry TTL instead of global default
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.queryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setInCache(key: string, data: any, ttl: number): void {
    this.queryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl // Store TTL per entry for correct expiration
    });

    if (this.queryCache.size > 1000) {
      const oldestKey = this.queryCache.keys().next().value;
      if (oldestKey) {
        this.queryCache.delete(oldestKey);
      }
    }
  }

  invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.queryCache.clear();
      return;
    }

    for (const key of this.queryCache.keys()) {
      if (key.includes(pattern)) {
        this.queryCache.delete(key);
      }
    }
  }

  getCacheStats() {
    return {
      size: this.queryCache.size,
      keys: Array.from(this.queryCache.keys())
    };
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.queryCache.entries()) {
        // Use per-entry TTL for cleanup
        if (now - value.timestamp > value.ttl) {
          this.queryCache.delete(key);
        }
      }
    }, 60000); // Clean up every minute
  }
}

export const queryOptimizer = new QueryOptimizer();

export function withQueryOptimization<T>(
  queryFn: () => Promise<T>,
  cacheKey?: string
): Promise<T> {
  return queryOptimizer.executeQuery(queryFn, {
    useCache: !!cacheKey,
    cacheKey,
    trackPerformance: true
  });
}
