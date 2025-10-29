/**
 * Optimized Mutation Hook
 * Wrapper around useMutation with automatic cache invalidation
 */

import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface OptimizedMutationOptions<TData = unknown, TError = Error, TVariables = void, TContext = unknown>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  /**
   * Cache keys to invalidate on success
   */
  invalidates?: ReadonlyArray<ReadonlyArray<unknown>>;
  
  /**
   * Cache keys to remove on success
   */
  removes?: ReadonlyArray<ReadonlyArray<unknown>>;
  
  /**
   * Data to set in cache on success
   * Useful for optimistic updates
   */
  updates?: ReadonlyArray<{
    queryKey: ReadonlyArray<unknown>;
    data: TData | ((old: TData | undefined) => TData);
  }>;
}

/**
 * Enhanced useMutation with automatic cache management
 * 
 * @example
 * const createMood = useOptimizedMutation({
 *   mutationFn: (data) => apiRequest('/api/moods', { method: 'POST', body: JSON.stringify(data) }),
 *   invalidates: [cacheKeys.moods.all],
 *   onSuccess: () => toast({ title: 'Mood saved!' }),
 * });
 */
export function useOptimizedMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  options: OptimizedMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { invalidates, removes, updates, onSuccess, ...mutationOptions } = options;

  return useMutation<TData, TError, TVariables, TContext>({
    ...mutationOptions,
    onSuccess: async (data, variables, context) => {
      // Invalidate specified caches
      if (invalidates && invalidates.length > 0) {
        await Promise.all(
          invalidates.map((key) => queryClient.invalidateQueries({ queryKey: key }))
        );
      }

      // Remove specified caches
      if (removes && removes.length > 0) {
        removes.forEach((key) => queryClient.removeQueries({ queryKey: key }));
      }

      // Update specified caches
      if (updates && updates.length > 0) {
        updates.forEach(({ queryKey, data: updateData }) => {
          queryClient.setQueryData(
            queryKey,
            typeof updateData === 'function' ? updateData : updateData
          );
        });
      }

      // Call user's onSuccess
      if (onSuccess) {
        await onSuccess(data, variables, context);
      }
    },
  });
}
