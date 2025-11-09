"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.strictRateLimiter = exports.standardRateLimiter = exports.createRateLimiter = exports.EnhancedRateLimiter = void 0;
class EnhancedRateLimiter {
    requests;
    config;
    constructor(config) {
        this.requests = new Map();
        this.config = config;
        this.startCleanup();
    }
    middleware() {
        return (req, res, next) => {
            const identifier = this.getIdentifier(req);
            const now = Date.now();
            const userRequests = this.requests.get(identifier) || [];
            const windowStart = now - this.config.windowMs;
            const recentRequests = userRequests.filter(time => time > windowStart);
            if (recentRequests.length >= this.config.maxRequests) {
                const oldestRequest = recentRequests[0];
                const retryAfter = Math.ceil((oldestRequest + this.config.windowMs - now) / 1000);
                return res.status(429).json({
                    error: this.config.message || 'Too many requests',
                    retryAfter
                });
            }
            recentRequests.push(now);
            this.requests.set(identifier, recentRequests);
            res.on('finish', () => {
                if (this.config.skipSuccessfulRequests && res.statusCode < 400) {
                    const requests = this.requests.get(identifier) || [];
                    const index = requests.lastIndexOf(now);
                    if (index > -1) {
                        requests.splice(index, 1);
                        this.requests.set(identifier, requests);
                    }
                }
                if (this.config.skipFailedRequests && res.statusCode >= 400) {
                    const requests = this.requests.get(identifier) || [];
                    const index = requests.lastIndexOf(now);
                    if (index > -1) {
                        requests.splice(index, 1);
                        this.requests.set(identifier, requests);
                    }
                }
            });
            next();
        };
    }
    getIdentifier(req) {
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
    startCleanup() {
        setInterval(() => {
            const now = Date.now();
            const windowStart = now - this.config.windowMs;
            for (const [identifier, timestamps] of this.requests.entries()) {
                const recentRequests = timestamps.filter(time => time > windowStart);
                if (recentRequests.length === 0) {
                    this.requests.delete(identifier);
                }
                else {
                    this.requests.set(identifier, recentRequests);
                }
            }
        }, this.config.windowMs);
    }
    getStats() {
        return {
            totalIdentifiers: this.requests.size,
            windowMs: this.config.windowMs,
            maxRequests: this.config.maxRequests
        };
    }
    reset(identifier) {
        if (identifier) {
            this.requests.delete(identifier);
        }
        else {
            this.requests.clear();
        }
    }
}
exports.EnhancedRateLimiter = EnhancedRateLimiter;
const createRateLimiter = (config) => {
    return new EnhancedRateLimiter(config);
};
exports.createRateLimiter = createRateLimiter;
exports.standardRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests from this IP, please try again later'
});
exports.strictRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Rate limit exceeded, please slow down'
});
exports.authRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts',
    skipSuccessfulRequests: true
});
