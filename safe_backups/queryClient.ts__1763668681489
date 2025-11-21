import { QueryClient } from "@tanstack/react-query";
import { attachCsrfToken, requiresCsrfToken } from "./csrf";

/**
 * Enhanced Query Client with Advanced Error Handling & Retry Logic
 * 360° Optimization: Exponential backoff, smart retries, request timeouts, CSRF protection
 */

// Request timeout for all API calls
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Custom error class with HTTP status code
class HttpError extends Error {
  status: number;
  body?: any;
  
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

// Enhanced fetcher with timeout and better error handling
const defaultFetcher = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      
      // Normalize error message to string (handles nested error objects)
      let errorMessage: string;
      if (typeof errorData.error === 'object' && errorData.error !== null) {
        errorMessage = errorData.error.message || JSON.stringify(errorData.error);
      } else {
        errorMessage = errorData.error || `HTTP ${res.status}: ${res.statusText}`;
      }
      
      // Throw custom error with status code attached
      throw new HttpError(errorMessage, res.status, errorData);
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
  
  // PRIORITY CHECK: Don't retry on auth errors (401/403) - user needs to login
  if (error instanceof HttpError) {
    if (error.status === 401 || error.status === 403) {
      return false;
    }
    
    // Don't retry on other 4xx client errors (bad request, not found, etc.)
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    
    // Retry on 5xx server errors
    if (error.status >= 500) {
      return true;
    }
  }
  
  // Fallback to message-based detection for legacy code
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
    
    // Don't retry on 4xx client errors
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

// Enhanced API request helper with timeout, CSRF protection, and better error handling
export async function apiRequest(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    // Automatically attach CSRF token for state-changing requests
    const method = options.method || 'GET';
    let headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers
    };
    
    if (requiresCsrfToken(method)) {
      headers = await attachCsrfToken(headers) as Record<string, string>;
    }
    
    const res = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
      headers,
      credentials: 'include', // Include session cookie for authentication
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Request failed" }));
      
      // Normalize error message to string (handles nested error objects)
      let errorMessage: string;
      if (typeof errorData.error === 'object' && errorData.error !== null) {
        errorMessage = errorData.error.message || JSON.stringify(errorData.error);
      } else {
        errorMessage = errorData.error || `HTTP ${res.status}`;
      }
      
      // Throw custom error with status code attached
      throw new HttpError(errorMessage, res.status, errorData);
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
