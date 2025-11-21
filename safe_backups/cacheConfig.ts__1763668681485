/**
 * Cache Configuration
 * Optimized caching strategies for different data types
 */

export const cacheConfig = {
  /**
   * User data - changes infrequently
   */
  user: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: 2,
  },

  /**
   * Mood data - changes frequently, needs fresh data
   */
  moods: {
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  },

  /**
   * Journal entries - changes moderately
   */
  journal: {
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
  },

  /**
   * Chat sessions - real-time, minimal cache
   */
  chat: {
    staleTime: 0, // Always fresh
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: true,
  },

  /**
   * Content - changes moderately, can be stale
   */
  content: {
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    retry: 2,
  },

  /**
   * Calendar events - changes frequently around event dates
   */
  calendar: {
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  },

  /**
   * Analytics - expensive queries, can be cached longer
   */
  analytics: {
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  },

  /**
   * Resources - static content, long cache
   */
  resources: {
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
  },

  /**
   * Billing - sensitive, needs fresh data
   */
  billing: {
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  },

  /**
   * Designs - changes moderately
   */
  designs: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    retry: 1,
  },

  /**
   * Performance metrics - expensive, cache longer
   */
  performance: {
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  },

  /**
   * Default config for unlisted queries
   */
  default: {
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  },
} as const;

/**
 * Cache prefetch priorities
 */
export const prefetchPriority = {
  critical: ['user', 'billing'] as const, // Prefetch immediately
  high: ['moods', 'journal', 'content'] as const, // Prefetch after critical
  medium: ['calendar', 'analytics', 'designs'] as const, // Prefetch on idle
  low: ['resources', 'performance'] as const, // Prefetch on demand
} as const;
