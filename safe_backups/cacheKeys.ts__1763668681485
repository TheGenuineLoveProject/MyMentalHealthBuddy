/**
 * Cache Key Factory
 * Centralized cache key management for React Query
 * 
 * Benefits:
 * - Type-safe cache keys
 * - Easy cache invalidation
 * - Hierarchical key structure
 * - Automatic key generation
 */

export const cacheKeys = {
  // User-related queries
  user: {
    all: ['users'] as const,
    current: () => [...cacheKeys.user.all, 'current'] as const,
    subscription: () => [...cacheKeys.user.all, 'subscription'] as const,
    preferences: () => [...cacheKeys.user.all, 'preferences'] as const,
  },

  // Mood tracking queries
  moods: {
    all: ['moods'] as const,
    list: (filters?: Record<string, any>) => 
      [...cacheKeys.moods.all, 'list', filters] as const,
    detail: (id: number) => [...cacheKeys.moods.all, 'detail', id] as const,
    analytics: (timeRange?: string) => 
      [...cacheKeys.moods.all, 'analytics', timeRange] as const,
    insights: () => [...cacheKeys.moods.all, 'insights'] as const,
  },

  // Journal queries
  journal: {
    all: ['journal'] as const,
    list: (page?: number, filters?: Record<string, any>) => 
      [...cacheKeys.journal.all, 'list', page, filters] as const,
    detail: (id: number) => [...cacheKeys.journal.all, 'detail', id] as const,
    search: (query: string) => [...cacheKeys.journal.all, 'search', query] as const,
  },

  // AI Chat queries
  chat: {
    all: ['chat'] as const,
    sessions: () => [...cacheKeys.chat.all, 'sessions'] as const,
    session: (id: string) => [...cacheKeys.chat.all, 'session', id] as const,
    messages: (sessionId: string) => 
      [...cacheKeys.chat.all, 'messages', sessionId] as const,
  },

  // Content Studio queries
  content: {
    all: ['content'] as const,
    list: (filters?: Record<string, any>) => 
      [...cacheKeys.content.all, 'list', filters] as const,
    detail: (id: number) => [...cacheKeys.content.all, 'detail', id] as const,
    drafts: () => [...cacheKeys.content.all, 'drafts'] as const,
    published: () => [...cacheKeys.content.all, 'published'] as const,
  },

  // Social Calendar queries
  calendar: {
    all: ['calendar'] as const,
    events: (month?: string) => 
      [...cacheKeys.calendar.all, 'events', month] as const,
    event: (id: number) => [...cacheKeys.calendar.all, 'event', id] as const,
    platforms: () => [...cacheKeys.calendar.all, 'platforms'] as const,
  },

  // Analytics queries
  analytics: {
    all: ['analytics'] as const,
    overview: (timeRange?: string) => 
      [...cacheKeys.analytics.all, 'overview', timeRange] as const,
    engagement: (timeRange?: string) => 
      [...cacheKeys.analytics.all, 'engagement', timeRange] as const,
    audience: () => [...cacheKeys.analytics.all, 'audience'] as const,
    performance: (contentId?: number) => 
      [...cacheKeys.analytics.all, 'performance', contentId] as const,
  },

  // Resources queries
  resources: {
    all: ['resources'] as const,
    categories: () => [...cacheKeys.resources.all, 'categories'] as const,
    category: (slug: string) => 
      [...cacheKeys.resources.all, 'category', slug] as const,
  },

  // Billing queries
  billing: {
    all: ['billing'] as const,
    invoices: () => [...cacheKeys.billing.all, 'invoices'] as const,
    paymentMethods: () => [...cacheKeys.billing.all, 'payment-methods'] as const,
    subscription: () => [...cacheKeys.billing.all, 'subscription'] as const,
  },

  // Design/Canva queries
  designs: {
    all: ['designs'] as const,
    list: () => [...cacheKeys.designs.all, 'list'] as const,
    detail: (id: string) => [...cacheKeys.designs.all, 'detail', id] as const,
    templates: () => [...cacheKeys.designs.all, 'templates'] as const,
  },

  // Performance monitoring
  performance: {
    all: ['performance'] as const,
    metrics: (timeRange?: string) => 
      [...cacheKeys.performance.all, 'metrics', timeRange] as const,
    vitals: () => [...cacheKeys.performance.all, 'vitals'] as const,
  },
} as const;

/**
 * Cache invalidation helpers
 */
export const invalidate = {
  /**
   * Invalidate all user-related caches
   */
  user: () => cacheKeys.user.all,

  /**
   * Invalidate specific mood caches
   */
  moods: (id?: number) => 
    id ? cacheKeys.moods.detail(id) : cacheKeys.moods.all,

  /**
   * Invalidate journal caches
   */
  journal: (id?: number) => 
    id ? cacheKeys.journal.detail(id) : cacheKeys.journal.all,

  /**
   * Invalidate chat session caches
   */
  chat: (sessionId?: string) => 
    sessionId ? cacheKeys.chat.session(sessionId) : cacheKeys.chat.all,

  /**
   * Invalidate content caches
   */
  content: (id?: number) => 
    id ? cacheKeys.content.detail(id) : cacheKeys.content.all,

  /**
   * Invalidate calendar caches
   */
  calendar: (id?: number) => 
    id ? cacheKeys.calendar.event(id) : cacheKeys.calendar.all,

  /**
   * Invalidate analytics caches (force fresh data)
   */
  analytics: () => cacheKeys.analytics.all,

  /**
   * Invalidate billing caches
   */
  billing: () => cacheKeys.billing.all,
};
