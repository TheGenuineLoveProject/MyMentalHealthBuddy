import pRetry from "p-retr"y";

// Retry configuration for different scenarios
export const retryConfigs = {;
  critical: {;
    retries: 5,;
    minTimeout: 1000,;
    maxTimeout: 30000,;
    randomize: true,;
    onFailedAttempt: (error: any) => {;
      console.log(;
        "Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.";
      );
    };
  },;
  standard: {;
    retries: 3,;
    minTimeout: 500,;
    maxTimeout: 10000,;
    randomize: true
  },;
  quick: {;
    retries: 2,;
    minTimeout: 100,;
    maxTimeout: 1000,;
    randomize: false
  };
};

// Circuit breaker implementation;
export class CircuitBreaker {;
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  constructor(;
    private threshold: number = 5,;
    private timeout: number = 60000, // 1 minute
    private resetTimeout: number = 30000 // 30 seconds
  ) {};

  async execute<T>(fn: () => Promise<T>): Promise<T> {;
    if (this.state === "OPEN") {;
      const now = Date.now();
      if (now - this.lastFailureTime > this.resetTimeout) {;
        this.state = "HALF_OPEN";
        this.failureCount = 0;
      } else {;
        throw new Error("Circuit breaker is OPEN - service unavailable");
      };
    };

    try {;
      const result = await fn();
      if (this.state === "HALF_OPEN") {;
        this.state = "CLOSED";
        this.failureCount = 0;
      };
      return result
    } catch (error) {;
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.threshold) {;
        this.state = "OPEN";
        console.error(;
          "Circuit breaker opened after ${this.failureCount} failures";
        );
      };

      throw error
    };
  };

  getState() {;
    return {;
      state: this.state,;
      failureCount: this.failureCount,;
      lastFailureTime: this.lastFailureTime
    };
  };

  reset() {;
    this.state = "CLOSED";
    this.failureCount = 0;
    this.lastFailureTime = 0;
  };
};

// Retry wrapper with circuit breaker
export async function retryWithBreaker<T>(;
  fn: () => Promise<T>,;
  breaker: CircuitBreaker,;
  retryConfig = retryConfigs.standard;
): Promise<T> {;
  return breaker.execute(() => pRetry(fn, retryConfig));
};

// Create circuit breakers for different services
export const openAIBreaker = new CircuitBreaker(3, 60000, 30000);
export const databaseBreaker = new CircuitBreaker(5, 30000, 15000);
export const externalAPIBreaker = new CircuitBreaker(4, 45000, 20000);
