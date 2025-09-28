// Retry configuration for frontend API calls
export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableStatuses: number[];
}

export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504]
};

// Exponential backoff with jitter
export function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = Math.min(
    config.initialDelay * Math.pow(config.backoffFactor, attempt - 1),
    config.maxDelay
  );
  // Add jitter (±25%)
  return delay * (0.75 + Math.random() * 0.5);
}

// Retry wrapper for fetch
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  config: RetryConfig = defaultRetryConfig
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });
      
      // Check if we should retry based on status code
      if (!response.ok && config.retryableStatuses.includes(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx except retryable ones)
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        const statusMatch = error.message.match(/HTTP (\d+)/);
        if (statusMatch) {
          const status = parseInt(statusMatch[1]);
          if (!config.retryableStatuses.includes(status)) {
            throw error;
          }
        }
      }
      
      // Don't retry if this was the last attempt
      if (attempt === config.maxRetries) {
        throw error;
      }
      
      // Calculate delay and wait
      const delay = calculateDelay(attempt, config);
      console.log(`Retry attempt ${attempt}/${config.maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Failed after retries');
}

// Enhanced API request with retry
export async function apiRequestWithRetry(
  method: string,
  url: string,
  body?: any,
  config?: RetryConfig
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
    },
    credentials: 'include'
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return fetchWithRetry(url, options, config);
}