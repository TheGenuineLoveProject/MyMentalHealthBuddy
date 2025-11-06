export interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  shouldRetry?: (error: any) => boolean;
}

export class ErrorRecovery {
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffFactor = 2,
      shouldRetry = () => true
    } = options;

    let lastError: any;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts || !shouldRetry(error)) {
          throw error;
        }

        console.warn(
          `Attempt ${attempt}/${maxAttempts} failed, retrying in ${delay}ms...`,
          error instanceof Error ? error.message : error
        );

        await this.sleep(delay);
        delay = Math.min(delay * backoffFactor, maxDelay);
      }
    }

    throw lastError;
  }

  static async withCircuitBreaker<T>(
    operation: () => Promise<T>,
    circuitBreakerKey: string
  ): Promise<T> {
    const breaker = CircuitBreakerRegistry.get(circuitBreakerKey);
    
    if (breaker.isOpen()) {
      throw new Error(`Circuit breaker is open for: ${circuitBreakerKey}`);
    }

    try {
      const result = await operation();
      breaker.recordSuccess();
      return result;
    } catch (error) {
      breaker.recordFailure();
      throw error;
    }
  }

  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      operation(),
      this.timeoutPromise<T>(timeoutMs)
    ]);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static timeoutPromise<T>(ms: number): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    });
  }
}

class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private lastFailureTime: number | null = null;

  constructor(
    private readonly threshold: number = 5,
    private readonly resetTimeout: number = 60000
  ) {}

  isOpen(): boolean {
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

  recordSuccess(): void {
    this.successCount++;
    this.failureCount = 0;

    if (this.state === 'half-open') {
      this.state = 'closed';
    }
  }

  recordFailure(): void {
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

  reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'closed';
    this.lastFailureTime = null;
  }
}

class CircuitBreakerRegistry {
  private static breakers = new Map<string, CircuitBreaker>();

  static get(key: string): CircuitBreaker {
    if (!this.breakers.has(key)) {
      this.breakers.set(key, new CircuitBreaker());
    }
    return this.breakers.get(key)!;
  }

  static getStats() {
    const stats: Record<string, any> = {};
    
    for (const [key, breaker] of this.breakers.entries()) {
      stats[key] = breaker.getStats();
    }

    return stats;
  }

  static reset(key?: string): void {
    if (key) {
      this.breakers.get(key)?.reset();
    } else {
      this.breakers.clear();
    }
  }
}

export { CircuitBreakerRegistry };
