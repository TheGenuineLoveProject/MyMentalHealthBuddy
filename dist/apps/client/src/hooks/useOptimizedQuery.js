/**
 * Optimized Query Hook
 * Wrapper around useQuery with intelligent caching
 */
import { useQuery } from '@tanstack/react-query';
import { cacheConfig } from '@/lib/cacheConfig';
/**
 * Enhanced useQuery with automatic cache configuration
 *
 * @example
 * const { data } = useOptimizedQuery({
 *   queryKey: cacheKeys.moods.list(),
 *   cacheStrategy: 'moods',
 * });
 */
export function useOptimizedQuery(options) {
    const { cacheStrategy = 'default', ...queryOptions } = options;
    // Get cache configuration for this strategy
    const strategy = cacheConfig[cacheStrategy] || cacheConfig.default;
    return useQuery({
        ...strategy,
        ...queryOptions,
    });
}
