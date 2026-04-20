/**
 * Batch Processing Utilities
 *
 * This module provides a generic batch processing function with built-in
 * rate limiting and automatic retries. Use it for any task that requires
 * processing multiple items through an LLM or external API.
 */

export interface BatchOptions {
  /** Max concurrent requests (default: 2) */
  concurrency?: number;
  /** Max retry attempts for rate limit errors (default: 7) */
  retries?: number;
  /** Initial retry delay in ms (default: 2000) */
  minTimeout?: number;
  /** Max retry delay in ms (default: 128000) */
  maxTimeout?: number;
  /** Callback for progress updates */
  onProgress?: (completed: number, total: number, item: unknown) => void;
}

/**
 * Check if an error is a rate limit or quota violation.
 * Use this in custom error handling if needed.
 */
export function isRateLimitError(error: unknown): boolean {
  const errorMsg = error instanceof Error ? error.message : String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

/**
 * Simple concurrency limiter
 */
function createLimiter(concurrency: number) {
  let running = 0;
  const queue: (() => void)[] = [];

  return async <T>(fn: () => Promise<T>): Promise<T> => {
    if (running >= concurrency) {
      await new Promise<void>(resolve => queue.push(resolve));
    }
    running++;
    try {
      return await fn();
    } finally {
      running--;
      if (queue.length > 0) {
        const next = queue.shift();
        next?.();
      }
    }
  };
}

/**
 * Retry with exponential backoff
 */
async function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; minTimeout: number; maxTimeout: number; factor?: number }
): Promise<T> {
  const { retries, minTimeout, maxTimeout, factor = 2 } = options;
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (!isRateLimitError(error) || attempt === retries) {
        throw lastError;
      }
      
      const delay = Math.min(minTimeout * Math.pow(factor, attempt), maxTimeout);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Process items in batches with rate limiting and automatic retries.
 *
 * @param items - Array of items to process
 * @param processor - Async function to process each item (write your LLM logic here)
 * @param options - Concurrency and retry settings
 * @returns Promise resolving to array of results in the same order as input
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: BatchOptions = {}
): Promise<R[]> {
  const {
    concurrency = 2,
    retries = 7,
    minTimeout = 2000,
    maxTimeout = 128000,
    onProgress,
  } = options;

  const limit = createLimiter(concurrency);
  let completed = 0;

  const promises = items.map((item, index) =>
    limit(() =>
      retry(
        async () => {
          const result = await processor(item, index);
          completed++;
          onProgress?.(completed, items.length, item);
          return result;
        },
        { retries, minTimeout, maxTimeout, factor: 2 }
      )
    )
  );

  return Promise.all(promises);
}

/**
 * Process items sequentially with SSE progress streaming.
 * Use this when you need real-time progress updates to the client.
 */
export async function batchProcessWithSSE<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  sendEvent: (event: { type: string; [key: string]: unknown }) => void,
  options: Omit<BatchOptions, "concurrency" | "onProgress"> = {}
): Promise<R[]> {
  const { retries = 5, minTimeout = 1000, maxTimeout = 15000 } = options;

  sendEvent({ type: "started", total: items.length });

  const results: R[] = [];
  let errors = 0;

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    sendEvent({ type: "processing", index, item });

    try {
      const result = await retry(
        () => processor(item, index),
        { retries, minTimeout, maxTimeout, factor: 2 }
      );
      results.push(result);
      sendEvent({ type: "progress", index, result });
    } catch (error) {
      errors++;
      results.push(undefined as R);
      sendEvent({
        type: "progress",
        index,
        error: error instanceof Error ? error.message : "Processing failed",
      });
    }
  }

  sendEvent({ type: "complete", processed: items.length, errors });
  return results;
}
