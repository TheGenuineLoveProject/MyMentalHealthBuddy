/**
 * Request Timeout Middleware - 360° Backend Optimization
 * Prevents hanging requests and improves server reliability
 */
const DEFAULT_TIMEOUT = 30000; // 30 seconds
/**
 * Request timeout middleware
 * Automatically terminates requests that take too long
 */
export function requestTimeout(options = {}) {
    const { timeout = DEFAULT_TIMEOUT, onTimeout } = options;
    return (req, res, next) => {
        // Skip timeout for streaming endpoints
        if (req.path.includes('/stream') || req.path.includes('/webhook')) {
            return next();
        }
        // Set a timeout for the request
        const timeoutId = setTimeout(() => {
            if (res.headersSent) {
                return; // Response already sent
            }
            console.warn(`[REQUEST TIMEOUT] ${req.method} ${req.path} exceeded ${timeout}ms`);
            if (onTimeout) {
                onTimeout(req, res);
            }
            else {
                res.status(408).json({
                    error: 'Request timeout',
                    message: 'The server took too long to process your request. Please try again.',
                    timeout: `${timeout}ms`
                });
            }
        }, timeout);
        // Clear timeout when response finishes
        res.on('finish', () => {
            clearTimeout(timeoutId);
        });
        // Clear timeout on error
        res.on('error', () => {
            clearTimeout(timeoutId);
        });
        next();
    };
}
/**
 * Different timeout settings for different route types
 */
export const timeoutPresets = {
    // Fast endpoints (health checks, metadata)
    fast: { timeout: 5000 }, // 5 seconds
    // Normal API endpoints
    normal: { timeout: 30000 }, // 30 seconds
    // AI/ML endpoints (potentially slow)
    ai: { timeout: 60000 }, // 60 seconds
    // File uploads/downloads
    upload: { timeout: 120000 }, // 2 minutes
};
/**
 * Apply timeout with graceful degradation
 */
export function withTimeout(promise, timeoutMs, fallback) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => {
            if (fallback !== undefined) {
                return fallback;
            }
            reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs))
    ]);
}
/**
 * Retry with timeout
 */
export async function retryWithTimeout(operation, options = {}) {
    const { maxRetries = 3, timeout = 30000, retryDelay = 1000, onRetry } = options;
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await withTimeout(operation(), timeout);
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < maxRetries) {
                if (onRetry) {
                    onRetry(attempt, lastError);
                }
                console.log(`[RETRY] Attempt ${attempt}/${maxRetries} failed, retrying in ${retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
            }
        }
    }
    throw lastError;
}
