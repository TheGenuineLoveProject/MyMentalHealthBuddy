export interface RetryOptions {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffFactor: number;
    shouldRetry?: (error: any) => boolean;
}
export declare class ErrorRecovery {
    static withRetry<T>(operation: () => Promise<T>, options?: Partial<RetryOptions>): Promise<T>;
    static withCircuitBreaker<T>(operation: () => Promise<T>, circuitBreakerKey: string): Promise<T>;
    static withTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T>;
    private static sleep;
    private static timeoutPromise;
}
declare class CircuitBreaker {
    private readonly threshold;
    private readonly resetTimeout;
    private failureCount;
    private successCount;
    private state;
    private lastFailureTime;
    constructor(threshold?: number, resetTimeout?: number);
    isOpen(): boolean;
    recordSuccess(): void;
    recordFailure(): void;
    getStats(): {
        state: "open" | "closed" | "half-open";
        failureCount: number;
        successCount: number;
        lastFailureTime: number | null;
    };
    reset(): void;
}
declare class CircuitBreakerRegistry {
    private static breakers;
    static get(key: string): CircuitBreaker;
    static getStats(): Record<string, any>;
    static reset(key?: string): void;
}
export { CircuitBreakerRegistry };
