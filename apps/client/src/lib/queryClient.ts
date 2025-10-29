import { QueryClient } from "@tanstack/react-query";

/**
 * Enhanced Query Client with Advanced Error Handling & Retry Logic
 * 360° Optimization: Exponential backoff, smart retries, request timeouts
 */

// Request timeout for all API calls
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Enhanced fetcher with timeout and better error handling
const defaultFetcher = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
    
    throw new Error('An unexpected error occurred');
  }
};

// Smart retry logic: Only retry on network errors or 5xx errors
const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (failureCount >= 3) return false; // Max 3 retries
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Retry on network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return true;
    }
    
    // Retry on 5xx server errors
    if (message.includes('http 5')) {
      return true;
    }
    
    // Don't retry on 4xx client errors (bad request, not found, etc.)
    if (message.includes('http 4')) {
      return false;
    }
  }
  
  return true; // Retry on unknown errors
};

// Exponential backoff: 1s, 2s, 4s
const retryDelay = (attemptIndex: number): number => {
  return Math.min(1000 * Math.pow(2, attemptIndex), 10000);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => defaultFetcher(queryKey[0] as string),
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: shouldRetry,
      retryDelay,
      refetchOnWindowFocus: false, // Don't refetch on window focus (better UX)
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
    mutations: {
      retry: false, // Don't retry mutations by default (avoid duplicate submissions)
      retryDelay,
    }
  }
});

// Enhanced API request helper with timeout and better error handling
export async function apiRequest(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }
    
    if (res.status === 204) return null;
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
    
    throw new Error('An unexpected error occurred');
  }
}

// Helper: Optimistic update helper for mutations
export function optimisticUpdate<T>(
  queryKey: string[],
  updater: (old: T | undefined) => T
) {
  return {
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<T>(queryKey);
      queryClient.setQueryData<T>(queryKey, updater);
      return { previousData };
    },
    onError: (err: unknown, variables: unknown, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  };
}

// Helper: Prefetch data for better perceived performance
export async function prefetchQuery(queryKey: string[], fetcher?: () => Promise<any>) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn: fetcher || (() => defaultFetcher(queryKey[0] as string)),
  });
}
