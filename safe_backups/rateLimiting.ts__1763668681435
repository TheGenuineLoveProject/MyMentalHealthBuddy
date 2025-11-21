/**
 * Comprehensive Rate Limiting - 360° Security Enhancement
 * Protects all API endpoints from abuse
 */

import type { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  private getKey(identifier: string): string {
    return identifier;
  }

  check(identifier: string): boolean {
    const key = this.getKey(identifier);
    const now = Date.now();
    
    // Initialize or reset if window expired
    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
    }
    
    // Check if limit exceeded
    if (this.store[key].count >= this.config.maxRequests) {
      return false;
    }
    
    // Increment counter
    this.store[key].count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const key = this.getKey(identifier);
    const now = Date.now();
    
    if (!this.store[key] || this.store[key].resetTime < now) {
      return this.config.maxRequests;
    }
    
    return Math.max(0, this.config.maxRequests - this.store[key].count);
  }

  getResetTime(identifier: string): number {
    const key = this.getKey(identifier);
    return this.store[key]?.resetTime || Date.now() + this.config.windowMs;
  }
}

// Rate limiters for different endpoint types
export const rateLimiters = {
  // General API endpoints - 100 requests per minute
  api: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: 'Too many API requests. Please try again in a moment.'
  }),

  // Authentication endpoints - 5 requests per minute (prevent brute force)
  auth: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 5,
    message: 'Too many authentication attempts. Please try again later.'
  }),

  // Chat endpoints - 20 requests per minute
  chat: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 20,
    message: 'Too many chat messages. Please slow down.'
  }),

  // Billing endpoints - 10 requests per minute
  billing: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: 'Too many billing requests. Please try again in a moment.'
  }),

  // Export endpoints - 5 requests per 5 minutes (expensive operations)
  export: new RateLimiter({
    windowMs: 5 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many export requests. Please wait before exporting again.'
  }),

  // AI generation endpoints - 10 requests per minute
  aiGeneration: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: 'Too many AI generation requests. Please wait a moment.'
  }),

  // Content creation - 30 requests per minute
  content: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: 'Too many content requests. Please slow down.'
  }),

  // Analytics - 50 requests per minute
  analytics: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 50,
    message: 'Too many analytics requests. Please try again in a moment.'
  })
};

/**
 * Create rate limiting middleware
 */
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get identifier (IP or user ID)
    const identifier = req.userId || req.ip || req.socket.remoteAddress || 'unknown';
    
    // Check rate limit
    if (!limiter.check(identifier)) {
      const resetTime = limiter.getResetTime(identifier);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      
      res.setHeader('Retry-After', retryAfter.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', resetTime.toString());
      
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter
      });
    }
    
    // Add rate limit headers
    const remaining = limiter.getRemainingRequests(identifier);
    const resetTime = limiter.getResetTime(identifier);
    
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', resetTime.toString());
    
    next();
  };
}

// Export pre-configured middleware
export const rateLimitMiddleware = {
  api: createRateLimitMiddleware(rateLimiters.api),
  auth: createRateLimitMiddleware(rateLimiters.auth),
  chat: createRateLimitMiddleware(rateLimiters.chat),
  billing: createRateLimitMiddleware(rateLimiters.billing),
  export: createRateLimitMiddleware(rateLimiters.export),
  aiGeneration: createRateLimitMiddleware(rateLimiters.aiGeneration),
  content: createRateLimitMiddleware(rateLimiters.content),
  analytics: createRateLimitMiddleware(rateLimiters.analytics)
};
