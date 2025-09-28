import pRetry from 'p-retry';
// Retry configuration for different scenarios
export const retryConfigs = {
    critical: {
        retries: 5,
        minTimeout: 1000,
        maxTimeout: 30000,
        randomize: true,
        onFailedAttempt: (error) => {
            console.log(`Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`);
        }
    },
    standard: {
        retries: 3,
        minTimeout: 500,
        maxTimeout: 10000,
        randomize: true
    },
    quick: {
        retries: 2,
        minTimeout: 100,
        maxTimeout: 1000,
        randomize: false
    }
};
// Circuit breaker implementation
export class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000, // 1 minute
    resetTimeout = 30000 // 30 seconds
    ) {
        this.threshold = threshold;
        this.timeout = timeout;
        this.resetTimeout = resetTimeout;
        this.failureCount = 0;
        this.lastFailureTime = 0;
        this.state = 'CLOSED';
    }
    async execute(fn) {
        if (this.state === 'OPEN') {
            const now = Date.now();
            if (now - this.lastFailureTime > this.resetTimeout) {
                this.state = 'HALF_OPEN';
                this.failureCount = 0;
            }
            else {
                throw new Error('Circuit breaker is OPEN - service unavailable');
            }
        }
        try {
            const result = await fn();
            if (this.state === 'HALF_OPEN') {
                this.state = 'CLOSED';
                this.failureCount = 0;
            }
            return result;
        }
        catch (error) {
            this.failureCount++;
            this.lastFailureTime = Date.now();
            if (this.failureCount >= this.threshold) {
                this.state = 'OPEN';
                console.error(`Circuit breaker opened after ${this.failureCount} failures`);
            }
            throw error;
        }
    }
    getState() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            lastFailureTime: this.lastFailureTime
        };
    }
    reset() {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.lastFailureTime = 0;
    }
}
// Retry wrapper with circuit breaker
export async function retryWithBreaker(fn, breaker, retryConfig = retryConfigs.standard) {
    return breaker.execute(() => pRetry(fn, retryConfig));
}
// Create circuit breakers for different services
export const openAIBreaker = new CircuitBreaker(3, 60000, 30000);
export const databaseBreaker = new CircuitBreaker(5, 30000, 15000);
export const externalAPIBreaker = new CircuitBreaker(4, 45000, 20000);
