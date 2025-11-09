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
        all: ['users'],
        current: () => [...cacheKeys.user.all, 'current'],
        subscription: () => [...cacheKeys.user.all, 'subscription'],
        preferences: () => [...cacheKeys.user.all, 'preferences'],
    },
    // Mood tracking queries
    moods: {
        all: ['moods'],
        list: (filters) => [...cacheKeys.moods.all, 'list', filters],
        detail: (id) => [...cacheKeys.moods.all, 'detail', id],
        analytics: (timeRange) => [...cacheKeys.moods.all, 'analytics', timeRange],
        insights: () => [...cacheKeys.moods.all, 'insights'],
    },
    // Journal queries
    journal: {
        all: ['journal'],
        list: (page, filters) => [...cacheKeys.journal.all, 'list', page, filters],
        detail: (id) => [...cacheKeys.journal.all, 'detail', id],
        search: (query) => [...cacheKeys.journal.all, 'search', query],
    },
    // AI Chat queries
    chat: {
        all: ['chat'],
        sessions: () => [...cacheKeys.chat.all, 'sessions'],
        session: (id) => [...cacheKeys.chat.all, 'session', id],
        messages: (sessionId) => [...cacheKeys.chat.all, 'messages', sessionId],
    },
    // Content Studio queries
    content: {
        all: ['content'],
        list: (filters) => [...cacheKeys.content.all, 'list', filters],
        detail: (id) => [...cacheKeys.content.all, 'detail', id],
        drafts: () => [...cacheKeys.content.all, 'drafts'],
        published: () => [...cacheKeys.content.all, 'published'],
    },
    // Social Calendar queries
    calendar: {
        all: ['calendar'],
        events: (month) => [...cacheKeys.calendar.all, 'events', month],
        event: (id) => [...cacheKeys.calendar.all, 'event', id],
        platforms: () => [...cacheKeys.calendar.all, 'platforms'],
    },
    // Analytics queries
    analytics: {
        all: ['analytics'],
        overview: (timeRange) => [...cacheKeys.analytics.all, 'overview', timeRange],
        engagement: (timeRange) => [...cacheKeys.analytics.all, 'engagement', timeRange],
        audience: () => [...cacheKeys.analytics.all, 'audience'],
        performance: (contentId) => [...cacheKeys.analytics.all, 'performance', contentId],
    },
    // Resources queries
    resources: {
        all: ['resources'],
        categories: () => [...cacheKeys.resources.all, 'categories'],
        category: (slug) => [...cacheKeys.resources.all, 'category', slug],
    },
    // Billing queries
    billing: {
        all: ['billing'],
        invoices: () => [...cacheKeys.billing.all, 'invoices'],
        paymentMethods: () => [...cacheKeys.billing.all, 'payment-methods'],
        subscription: () => [...cacheKeys.billing.all, 'subscription'],
    },
    // Design/Canva queries
    designs: {
        all: ['designs'],
        list: () => [...cacheKeys.designs.all, 'list'],
        detail: (id) => [...cacheKeys.designs.all, 'detail', id],
        templates: () => [...cacheKeys.designs.all, 'templates'],
    },
    // Performance monitoring
    performance: {
        all: ['performance'],
        metrics: (timeRange) => [...cacheKeys.performance.all, 'metrics', timeRange],
        vitals: () => [...cacheKeys.performance.all, 'vitals'],
    },
};
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
    moods: (id) => id ? cacheKeys.moods.detail(id) : cacheKeys.moods.all,
    /**
     * Invalidate journal caches
     */
    journal: (id) => id ? cacheKeys.journal.detail(id) : cacheKeys.journal.all,
    /**
     * Invalidate chat session caches
     */
    chat: (sessionId) => sessionId ? cacheKeys.chat.session(sessionId) : cacheKeys.chat.all,
    /**
     * Invalidate content caches
     */
    content: (id) => id ? cacheKeys.content.detail(id) : cacheKeys.content.all,
    /**
     * Invalidate calendar caches
     */
    calendar: (id) => id ? cacheKeys.calendar.event(id) : cacheKeys.calendar.all,
    /**
     * Invalidate analytics caches (force fresh data)
     */
    analytics: () => cacheKeys.analytics.all,
    /**
     * Invalidate billing caches
     */
    billing: () => cacheKeys.billing.all,
};
