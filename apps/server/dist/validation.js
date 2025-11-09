"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRateLimiter = exports.apiRateLimiter = exports.ValidationError = exports.ValidationPatterns = exports.Sanitizer = void 0;
exports.validateRequest = validateRequest;
const zod_1 = require("zod");
// Input sanitization utilities
class Sanitizer {
    // Remove potential XSS characters from string inputs
    static sanitizeString(input) {
        if (typeof input !== 'string')
            return '';
        return input
            .trim()
            .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
            .replace(/<[^>]+>/g, '') // Remove all HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+\s*=\s*["']?[^"']*["']?/gi, '') // Remove event handlers
            .slice(0, 10000); // Limit length to prevent DoS
    }
    // Sanitize array of strings
    static sanitizeStringArray(input) {
        if (!Array.isArray(input))
            return [];
        return input
            .filter(item => typeof item === 'string')
            .map(item => this.sanitizeString(item))
            .filter(item => item.length > 0)
            .slice(0, 100); // Limit array size
    }
    // Sanitize object by sanitizing all string values
    static sanitizeObject(input) {
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeString(value);
            }
            else if (Array.isArray(value)) {
                sanitized[key] = this.sanitizeStringArray(value);
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    // Validate and sanitize user ID
    static sanitizeUserId(input) {
        if (typeof input !== 'string')
            return 'demo-user';
        const sanitized = this.sanitizeString(input);
        if (!sanitized || sanitized.length < 1 || sanitized.length > 100) {
            return 'demo-user';
        }
        return sanitized;
    }
}
exports.Sanitizer = Sanitizer;
// Common validation patterns
exports.ValidationPatterns = {
    userId: zod_1.z.string().min(1).max(100),
    sessionId: zod_1.z.string().min(1).max(200),
    email: zod_1.z.string().email().max(255),
    username: zod_1.z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
    title: zod_1.z.string().max(500),
    content: zod_1.z.string().min(1).max(50000),
    mood: zod_1.z.string().min(1).max(50),
    intensity: zod_1.z.number().int().min(1).max(10),
    notes: zod_1.z.string().max(5000),
    tag: zod_1.z.string().min(1).max(50),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(50)).max(20),
    country: zod_1.z.string().length(2).regex(/^[A-Z]{2}$/),
    phoneNumber: zod_1.z.string().max(50),
    website: zod_1.z.string().url().max(500)
};
// Enhanced error responses
class ValidationError extends Error {
    errors;
    statusCode;
    constructor(message, errors, statusCode = 400) {
        super(message);
        this.errors = errors;
        this.statusCode = statusCode;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
// Request validation helper
function validateRequest(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new ValidationError('Validation failed', result.error.flatten(), 400);
    }
    return result.data;
}
// Rate limiting state (simple in-memory implementation)
class RateLimiter {
    requests = new Map();
    windowMs;
    maxRequests;
    constructor(windowMs = 60000, maxRequests = 60) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
        // Clean up old entries every 5 minutes
        setInterval(() => this.cleanup(), 300000);
    }
    check(identifier) {
        const now = Date.now();
        const requests = this.requests.get(identifier) || [];
        // Filter out old requests outside the window
        const recentRequests = requests.filter(timestamp => now - timestamp < this.windowMs);
        if (recentRequests.length >= this.maxRequests) {
            this.requests.set(identifier, recentRequests);
            return false; // Rate limit exceeded
        }
        recentRequests.push(now);
        this.requests.set(identifier, recentRequests);
        return true; // Request allowed
    }
    cleanup() {
        const now = Date.now();
        for (const [identifier, requests] of this.requests.entries()) {
            const recentRequests = requests.filter(timestamp => now - timestamp < this.windowMs);
            if (recentRequests.length === 0) {
                this.requests.delete(identifier);
            }
            else {
                this.requests.set(identifier, recentRequests);
            }
        }
    }
}
// Export singleton rate limiter instances
exports.apiRateLimiter = new RateLimiter(60000, 60); // 60 requests per minute
exports.chatRateLimiter = new RateLimiter(60000, 20); // 20 chat requests per minute
