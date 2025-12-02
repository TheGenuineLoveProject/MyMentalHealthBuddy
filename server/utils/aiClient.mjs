// server/utils/aiClient.mjs
// OpenAI client with circuit breaker, timeout, and retry logic

import OpenAI from "openai";
import { logger } from "../middleware/requestId.mjs";

const OPENAI_API_KEY = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";
const OPENAI_BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;

const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000,
  halfOpenRequests: 3,
};

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryableStatuses: [429, 500, 502, 503, 504],
};

const REQUEST_TIMEOUT = 15000;

class CircuitBreaker {
  constructor(config = CIRCUIT_BREAKER_CONFIG) {
    this.config = config;
    this.state = "CLOSED";
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.halfOpenRequests = 0;
  }

  canRequest() {
    if (this.state === "CLOSED") return true;
    if (this.state === "OPEN") {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.config.timeout) {
        this.state = "HALF_OPEN";
        this.halfOpenRequests = 0;
        logger.info("Circuit breaker transitioning to HALF_OPEN");
        return true;
      }
      return false;
    }
    if (this.state === "HALF_OPEN") {
      return this.halfOpenRequests < this.config.halfOpenRequests;
    }
    return false;
  }

  recordSuccess() {
    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = "CLOSED";
        this.failureCount = 0;
        this.successCount = 0;
        logger.info("Circuit breaker CLOSED after successful requests");
      }
    } else if (this.state === "CLOSED") {
      this.failureCount = 0;
    }
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.state === "HALF_OPEN") {
      this.state = "OPEN";
      this.halfOpenRequests = 0;
      logger.warn("Circuit breaker OPEN after failure in HALF_OPEN state");
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.state = "OPEN";
      logger.warn("Circuit breaker OPEN after reaching failure threshold", {
        failureCount: this.failureCount,
      });
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

const circuitBreaker = new CircuitBreaker();

let openaiClient = null;
if (OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
  });
}

async function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBackoffDelay(attempt) {
  const delay = Math.min(
    RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
    RETRY_CONFIG.maxDelay
  );
  return delay + Math.random() * 500;
}

function isRetryable(error) {
  if (error.status && RETRY_CONFIG.retryableStatuses.includes(error.status)) {
    return true;
  }
  if (error.message?.includes("timeout")) {
    return true;
  }
  if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
    return true;
  }
  return false;
}

export async function chatCompletion({ messages, model = "gpt-4o-mini", temperature = 0.7, maxTokens = 500 }) {
  if (!openaiClient) {
    return {
      success: false,
      error: "OpenAI not configured",
      isCircuitOpen: false,
    };
  }

  if (!circuitBreaker.canRequest()) {
    logger.warn("Circuit breaker is OPEN, rejecting request");
    return {
      success: false,
      error: "Service temporarily unavailable",
      isCircuitOpen: true,
      circuitState: circuitBreaker.getState(),
    };
  }

  let lastError = null;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = getBackoffDelay(attempt - 1);
        logger.info(`Retry attempt ${attempt} after ${delay}ms delay`);
        await sleep(delay);
      }

      const completionPromise = openaiClient.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const completion = await withTimeout(completionPromise, REQUEST_TIMEOUT);

      circuitBreaker.recordSuccess();

      return {
        success: true,
        content: completion.choices?.[0]?.message?.content || "",
        usage: completion.usage,
      };
    } catch (error) {
      lastError = error;
      logger.error("OpenAI request failed", {
        attempt,
        error: error.message,
        status: error.status,
      });

      if (!isRetryable(error)) {
        break;
      }

      if (attempt === RETRY_CONFIG.maxRetries) {
        break;
      }
    }
  }

  circuitBreaker.recordFailure();

  return {
    success: false,
    error: lastError?.message || "OpenAI request failed",
    isCircuitOpen: circuitBreaker.state === "OPEN",
    circuitState: circuitBreaker.getState(),
  };
}

export function getCircuitBreakerStatus() {
  return {
    configured: !!openaiClient,
    ...circuitBreaker.getState(),
  };
}

export function isConfigured() {
  return !!openaiClient;
}

export async function sendTherapyMessage({ messages, userId = "anonymous" }) {
  const result = await chatCompletion({ messages });
  
  if (result.success) {
    return {
      ok: true,
      message: result.content,
      raw: result,
    };
  }
  
  return {
    ok: false,
    error: result.error,
    message: "AI is currently unavailable.",
    isCircuitOpen: result.isCircuitOpen,
  };
}

export default {
  chatCompletion,
  getCircuitBreakerStatus,
  isConfigured,
  sendTherapyMessage,
};
