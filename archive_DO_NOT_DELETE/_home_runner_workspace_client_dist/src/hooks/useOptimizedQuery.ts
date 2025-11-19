/**
 * Optimized Query Hook
 * Wrapper around useQuery with intelligent caching
 */

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { cacheConfig } from '@/lib/cacheConfig';

type CacheKey = keyof typeof cacheConfig;

type OptimizedQueryOptions<TData, TError, TQueryKey extends ReadonlyArray<unknown>> = 
  & Omit<UseQueryOptions<TData, TError, TData, TQueryKey>, 'staleTime' | 'gcTime' | 'retry'>
  & {
    cacheStrategy?: CacheKey;
  };

/**
 * Enhanced useQuery with automatic cache configuration
 * 
 * @example
 * const { data } = useOptimizedQuery({
 *   queryKey: cacheKeys.moods.list(),
 *   cacheStrategy: 'moods',
 * });
 */
export function useOptimizedQuery<
  TData = unknown,
  TError = Error,
  TQueryKey extends ReadonlyArray<unknown> = ReadonlyArray<unknown>
>(
  options: OptimizedQueryOptions<TData, TError, TQueryKey>
): UseQueryResult<TData, TError> {
  const { cacheStrategy = 'default', ...queryOptions } = options;

  // Get cache configuration for this strategy
  const strategy = cacheConfig[cacheStrategy] || cacheConfig.default;

  return useQuery<TData, TError, TData, TQueryKey>({
    ...strategy,
    ...queryOptions,
  });
}
