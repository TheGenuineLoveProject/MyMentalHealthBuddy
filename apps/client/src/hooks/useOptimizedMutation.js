/**
 * Optimized Mutation Hook
 * Wrapper around useMutation with automatic cache invalidation
 */
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
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
export function useOptimizedMutation(options) {
    const { invalidates, removes, updates, onSuccess, ...mutationOptions } = options;
    return useMutation({
        ...mutationOptions,
        onSuccess: (data, variables, context) => {
            // Invalidate specified caches
            if (invalidates && invalidates.length > 0) {
                Promise.all(invalidates.map((key) => queryClient.invalidateQueries({ queryKey: key })));
            }
            // Remove specified caches
            if (removes && removes.length > 0) {
                removes.forEach((key) => queryClient.removeQueries({ queryKey: key }));
            }
            // Update specified caches
            if (updates && updates.length > 0) {
                updates.forEach(({ queryKey, data: updateData }) => {
                    queryClient.setQueryData(queryKey, typeof updateData === 'function' ? updateData : updateData);
                });
            }
            // Call user's onSuccess
            if (onSuccess) {
                // @ts-expect-error - onSuccess can return void or Promise<unknown>
                return onSuccess(data, variables, context);
            }
        },
    });
}
