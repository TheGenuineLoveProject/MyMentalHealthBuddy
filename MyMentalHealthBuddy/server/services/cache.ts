import NodeCache from "node-cache";
// Create cache instances with different TTL for different purposes
export const apiCache = new NodeCache({
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // Check for expired keys every 60 seconds
  deleteOnExpire: true,
  useClones: false, // For better performance
  maxKeys: 1000 // Prevent memory bloat
});
export const healthCache = new NodeCache({
  stdTTL: 30, // 30 seconds for health checks
  checkperiod: 10,
  deleteOnExpire: true,
  useClones: false,
  maxKeys: 100
});
export const aiResponseCache = new NodeCache({
  stdTTL: 3600, // 1 hour for AI responses
  checkperiod: 120,
  deleteOnExpire: true,
  useClones: false,
  maxKeys: 500
});
// Cache key generators
export function getCacheKey(prefix: string, ...parts: any[]): string {
  return `${prefix}:${parts.join(":")}`;
}
// Cache middleware
export function cacheMiddleware(cache: NodeCache, ttl?: number) {
  return (req: any, res: any, next: any) => {
    const key = getCacheKey("api", req.method, req.originalUrl);
    // Only cache GET requests by default
    if (req.method !== "GET") {
      return next()
    }
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
      res.set("X-Cache", "HIT");
      const ttlValue = cache.getTtl(key);
      res.set("X-Cache-TTL", ttlValue ? ttlValue.toString() : "0");
      return res.json(cachedResponse)
    }
    // Store original json method;
    const originalJson = res.json;
    // Override json method to cache the response
    res.json = function (data: any) {
      res.set("X-Cache", "MISS");
      cache.set(key, data, ttl || undefined);
      originalJson.call(this, data)
    }
    next()
  }
}
// Cache statistics
export function getCacheStats() {
  return {
    api: {
      keys: apiCache.keys().length,
      hits: apiCache.getStats().hits,
      misses: apiCache.getStats().misses,
      hitRate:
        apiCache.getStats().hits /
          (apiCache.getStats().hits + apiCache.getStats().misses) || 0
    },
    health: {
      keys: healthCache.keys().length,
      hits: healthCache.getStats().hits,
      misses: healthCache.getStats().misses,
      hitRate:
        healthCache.getStats().hits /
          (healthCache.getStats().hits + healthCache.getStats().misses) || 0
    },
    ai: {
      keys: aiResponseCache.keys().length,
      hits: aiResponseCache.getStats().hits,
      misses: aiResponseCache.getStats().misses,
      hitRate:
        aiResponseCache.getStats().hits /
          (aiResponseCache.getStats().hits +
            aiResponseCache.getStats().misses) || 0
    }
  }
}
// Clear all caches
export function clearAllCaches() {
  apiCache.flushAll();
  healthCache.flushAll();
  aiResponseCache.flushAll()
}