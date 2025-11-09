"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreakerRegistry = exports.ErrorRecovery = void 0;
class ErrorRecovery {
    static async withRetry(operation, options = {}) {
        const { maxAttempts = 3, initialDelay = 1000, maxDelay = 10000, backoffFactor = 2, shouldRetry = () => true } = options;
        let lastError;
        let delay = initialDelay;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (attempt === maxAttempts || !shouldRetry(error)) {
                    throw error;
                }
                console.warn(`Attempt ${attempt}/${maxAttempts} failed, retrying in ${delay}ms...`, error instanceof Error ? error.message : error);
                await this.sleep(delay);
                delay = Math.min(delay * backoffFactor, maxDelay);
            }
        }
        throw lastError;
    }
    static async withCircuitBreaker(operation, circuitBreakerKey) {
        const breaker = CircuitBreakerRegistry.get(circuitBreakerKey);
        if (breaker.isOpen()) {
            throw new Error(`Circuit breaker is open for: ${circuitBreakerKey}`);
        }
        try {
            const result = await operation();
            breaker.recordSuccess();
            return result;
        }
        catch (error) {
            breaker.recordFailure();
            throw error;
        }
    }
    static async withTimeout(operation, timeoutMs) {
        return Promise.race([
            operation(),
            this.timeoutPromise(timeoutMs)
        ]);
    }
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static timeoutPromise(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
        });
    }
}
exports.ErrorRecovery = ErrorRecovery;
class CircuitBreaker {
    threshold;
    resetTimeout;
    failureCount = 0;
    successCount = 0;
    state = 'closed';
    lastFailureTime = null;
    constructor(threshold = 5, resetTimeout = 60000) {
        this.threshold = threshold;
        this.resetTimeout = resetTimeout;
    }
    isOpen() {
        if (this.state === 'open' && this.lastFailureTime) {
            const elapsed = Date.now() - this.lastFailureTime;
            if (elapsed > this.resetTimeout) {
                this.state = 'half-open';
                return false;
            }
            return true;
        }
        return false;
    }
    recordSuccess() {
        this.successCount++;
        this.failureCount = 0;
        if (this.state === 'half-open') {
            this.state = 'closed';
        }
    }
    recordFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.threshold) {
            this.state = 'open';
            console.warn(`Circuit breaker opened after ${this.failureCount} failures`);
        }
    }
    getStats() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            lastFailureTime: this.lastFailureTime
        };
    }
    reset() {
        this.failureCount = 0;
        this.successCount = 0;
        this.state = 'closed';
        this.lastFailureTime = null;
    }
}
class CircuitBreakerRegistry {
    static breakers = new Map();
    static get(key) {
        if (!this.breakers.has(key)) {
            this.breakers.set(key, new CircuitBreaker());
        }
        return this.breakers.get(key);
    }
    static getStats() {
        const stats = {};
        for (const [key, breaker] of this.breakers.entries()) {
            stats[key] = breaker.getStats();
        }
        return stats;
    }
    static reset(key) {
        if (key) {
            this.breakers.get(key)?.reset();
        }
        else {
            this.breakers.clear();
        }
    }
}
exports.CircuitBreakerRegistry = CircuitBreakerRegistry;
