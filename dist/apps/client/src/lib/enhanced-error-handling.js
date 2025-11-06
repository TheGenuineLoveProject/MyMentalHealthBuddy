/**
 * Enhanced Error Handling System
 * Global error boundaries, retry mechanisms, and user-friendly error messages
 */
/**
 * Global Error Handler
 */
export class GlobalErrorHandler {
    errors = [];
    maxErrors = 100;
    errorListeners = new Set();
    originalConsoleError;
    constructor() {
        // Save original console.error before patching
        this.originalConsoleError = console.error.bind(console);
        this.attachGlobalHandlers();
    }
    /**
     * Attach global error handlers
     */
    attachGlobalHandlers() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error || new Error(event.message), 'uncaught', 'error', {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), 'unhandled-rejection', 'error');
        });
        // Handle console errors (for logging)
        const originalConsoleError = this.originalConsoleError;
        console.error = (...args) => {
            this.handleError(new Error(args.join(' ')), 'console', 'warning');
            originalConsoleError.apply(console, args);
        };
    }
    /**
     * Handle error
     */
    handleError(error, category, severity = 'error', context) {
        const report = {
            id: this.generateId(),
            message: error.message,
            stack: error.stack,
            severity,
            category,
            timestamp: Date.now(),
            context,
            resolved: false
        };
        this.errors.push(report);
        // Limit stored errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        // Notify listeners
        this.errorListeners.forEach(listener => listener(report));
        // Log to console in development using original console.error to avoid recursion
        if (process.env.NODE_ENV !== 'production') {
            this.originalConsoleError(`[${severity.toUpperCase()}] ${category}:`, error);
        }
        // Send to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendToMonitoring(report);
        }
        return report;
    }
    /**
     * Add error listener
     */
    addListener(callback) {
        this.errorListeners.add(callback);
    }
    /**
     * Remove error listener
     */
    removeListener(callback) {
        this.errorListeners.delete(callback);
    }
    /**
     * Get all errors
     */
    getErrors(severity) {
        if (severity) {
            return this.errors.filter(e => e.severity === severity);
        }
        return [...this.errors];
    }
    /**
     * Clear errors
     */
    clearErrors() {
        this.errors = [];
    }
    /**
     * Mark error as resolved
     */
    resolveError(errorId) {
        const error = this.errors.find(e => e.id === errorId);
        if (error) {
            error.resolved = true;
            return true;
        }
        return false;
    }
    /**
     * Send error to monitoring service
     */
    async sendToMonitoring(report) {
        try {
            await fetch('/api/errors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });
        }
        catch (error) {
            // Silent fail - don't want to create error loop
            console.warn('Failed to send error to monitoring:', error);
        }
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
/**
 * Retry Manager
 */
export class RetryManager {
    /**
     * Retry async function with exponential backoff
     */
    async retry(fn, options = {}) {
        const { maxAttempts = 3, delay = 1000, exponentialBackoff = true, onRetry } = options;
        let lastError;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (attempt < maxAttempts) {
                    const waitTime = exponentialBackoff ? delay * Math.pow(2, attempt - 1) : delay;
                    if (onRetry) {
                        onRetry(attempt);
                    }
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }
        throw lastError || new Error('Retry failed');
    }
    /**
     * Retry with condition
     */
    async retryWhen(fn, shouldRetry, options = {}) {
        const { maxAttempts = 3, delay = 1000, exponentialBackoff = true, onRetry } = options;
        let lastError;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (attempt < maxAttempts && shouldRetry(lastError)) {
                    const waitTime = exponentialBackoff ? delay * Math.pow(2, attempt - 1) : delay;
                    if (onRetry) {
                        onRetry(attempt);
                    }
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
                else {
                    break;
                }
            }
        }
        throw lastError || new Error('Retry failed');
    }
}
/**
 * User-Friendly Error Messages
 */
export class ErrorMessageFormatter {
    messageMap = new Map([
        // Network errors
        ['Failed to fetch', 'Unable to connect to server. Please check your internet connection.'],
        ['NetworkError', 'Network error occurred. Please try again.'],
        ['timeout', 'Request timed out. Please try again.'],
        // Auth errors
        ['Unauthorized', 'Your session has expired. Please sign in again.'],
        ['Forbidden', 'You don\'t have permission to perform this action.'],
        // Validation errors
        ['ValidationError', 'Please check your input and try again.'],
        ['Invalid input', 'Some information is missing or incorrect.'],
        // Database errors
        ['Database error', 'A database error occurred. Please try again later.'],
        // Generic errors
        ['Internal Server Error', 'Something went wrong on our end. We\'re working on it!'],
        ['Not Found', 'The requested resource was not found.']
    ]);
    /**
     * Format error for display to user
     */
    format(error) {
        const message = typeof error === 'string' ? error : error.message;
        // Check for exact match
        if (this.messageMap.has(message)) {
            return this.messageMap.get(message);
        }
        // Check for partial match
        for (const [key, value] of this.messageMap.entries()) {
            if (message.includes(key)) {
                return value;
            }
        }
        // Default friendly message
        return 'An error occurred. Please try again.';
    }
    /**
     * Add custom error message mapping
     */
    addMapping(errorPattern, friendlyMessage) {
        this.messageMap.set(errorPattern, friendlyMessage);
    }
    /**
     * Get suggested actions for error
     */
    getSuggestedActions(error) {
        const message = typeof error === 'string' ? error : error.message;
        if (message.includes('network') || message.includes('fetch')) {
            return [
                'Check your internet connection',
                'Try refreshing the page',
                'Contact support if the problem persists'
            ];
        }
        if (message.includes('Unauthorized') || message.includes('session')) {
            return [
                'Sign in again',
                'Clear your browser cache',
                'Try using a different browser'
            ];
        }
        if (message.includes('validation') || message.includes('invalid')) {
            return [
                'Check all required fields are filled',
                'Ensure your input is in the correct format',
                'Review any error messages below form fields'
            ];
        }
        return [
            'Try again',
            'Refresh the page',
            'Contact support if the issue continues'
        ];
    }
}
/**
 * Error Recovery System
 */
export class ErrorRecoverySystem {
    recoveryStrategies = new Map();
    constructor() {
        this.registerDefaultStrategies();
    }
    /**
     * Register default recovery strategies
     */
    registerDefaultStrategies() {
        // Network error recovery
        this.register('network-error', async () => {
            // Wait for connection to restore
            await new Promise(resolve => {
                if (navigator.onLine) {
                    resolve();
                }
                else {
                    const listener = () => {
                        window.removeEventListener('online', listener);
                        resolve();
                    };
                    window.addEventListener('online', listener);
                }
            });
        });
        // Session error recovery
        this.register('session-error', async () => {
            // Redirect to login
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        });
        // Cache clear recovery
        this.register('cache-error', async () => {
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
                window.location.reload();
            }
        });
    }
    /**
     * Register recovery strategy
     */
    register(errorType, strategy) {
        this.recoveryStrategies.set(errorType, strategy);
    }
    /**
     * Attempt recovery
     */
    async recover(errorType) {
        const strategy = this.recoveryStrategies.get(errorType);
        if (!strategy) {
            return false;
        }
        try {
            await strategy();
            return true;
        }
        catch (error) {
            console.error(`Recovery strategy failed for ${errorType}:`, error);
            return false;
        }
    }
}
// Export singleton instances
export const globalErrorHandler = new GlobalErrorHandler();
export const retryManager = new RetryManager();
export const errorFormatter = new ErrorMessageFormatter();
export const errorRecovery = new ErrorRecoverySystem();
