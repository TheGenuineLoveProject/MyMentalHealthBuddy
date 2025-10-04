// Rate Limiter Service for API Protection
export class RateLimiter {
  constructor(options) {
    this.requests = new Map();
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
  }
  checkLimit(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    // Remove expired timestamps
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }
    return true;
  }
  cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const valid = timestamps.filter((t) => now - t < this.windowMs);
      if (valid.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, valid);
      }
    }
  }
  getRemainingRequests(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
    return Math.max(0, this.maxRequests - validRequests.length);
  }
  reset(identifier) {
    this.requests.delete(identifier);
  }
}
