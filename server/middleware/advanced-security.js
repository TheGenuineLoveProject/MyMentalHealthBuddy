import crypto from 'crypto';
import { z } from 'zod';
// Security configuration
const securityConfig = {
    csrf: {
        enabled: true,
        tokenLength: 32,
        cookieName: 'csrf-token',
        headerName: 'x-csrf-token',
        maxAge: 3600000 // 1 hour
    },
    inputValidation: {
        maxFieldSize: 10000,
        maxFields: 100,
        maxFileSize: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    },
    rateLimit: {
        windowMs: 60000, // 1 minute
        maxRequests: 100,
        maxRequestsPerIP: 50,
        blockDuration: 900000 // 15 minutes
    },
    xss: {
        enabled: true,
        sanitizeHTML: true,
        encodeEntities: true
    },
    sql: {
        enabled: true,
        parameterizedQueries: true,
        escapeStrings: true
    }
};
// CSRF token storage
const csrfTokens = new Map();
// Rate limit storage
const rateLimitStore = new Map();
// IP blacklist
const ipBlacklist = new Set();
// SQL injection patterns
const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE|ORDER BY|GROUP BY|HAVING)\b)/gi,
    /('|(--)|;|\||\\x00|\\n|\\r|\\x1a)/gi,
    /(xp_|sp_|0x|@@|char|nchar|varchar|nvarchar|exec|execute|cast|convert|script)/gi
];
// XSS patterns
const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
    /eval\(/gi,
    /expression\(/gi,
    /vbscript:/gi,
    /onload\s*=/gi
];
// Advanced Security Middleware Class
export class AdvancedSecurityMiddleware {
    static getInstance() {
        if (!this.instance) {
            this.instance = new AdvancedSecurityMiddleware();
        }
        return this.instance;
    }
    // CSRF Protection
    csrfProtection() {
        return (req, res, next) => {
            if (!securityConfig.csrf.enabled)
                return next();
            // Skip CSRF for safe methods
            if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
                // Generate token for forms
                const token = this.generateCSRFToken();
                const sessionId = req.session?.id || req.ip || 'anonymous';
                csrfTokens.set(sessionId, {
                    token,
                    expires: Date.now() + securityConfig.csrf.maxAge
                });
                res.locals.csrfToken = token;
                return next();
            }
            // Verify CSRF token for state-changing methods
            const sessionId = req.session?.id || req.ip || 'anonymous';
            const storedToken = csrfTokens.get(sessionId);
            const providedToken = req.headers[securityConfig.csrf.headerName] || req.body._csrf;
            if (!storedToken || storedToken.expires < Date.now()) {
                return res.status(403).json({ error: 'CSRF token expired' });
            }
            if (storedToken.token !== providedToken) {
                console.warn(`🛡️ CSRF attack blocked from IP: ${req.ip}`);
                return res.status(403).json({ error: 'Invalid CSRF token' });
            }
            next();
        };
    }
    generateCSRFToken() {
        return crypto.randomBytes(securityConfig.csrf.tokenLength).toString('hex');
    }
    // Input Validation
    inputValidation(schema) {
        return async (req, res, next) => {
            try {
                // Validate against schema if provided
                if (schema) {
                    const validated = await schema.parseAsync(req.body);
                    req.body = validated;
                }
                // General input sanitization
                req.body = this.sanitizeInput(req.body);
                req.query = this.sanitizeInput(req.query);
                req.params = this.sanitizeInput(req.params);
                // Check for SQL injection attempts
                if (this.detectSQLInjection(req)) {
                    console.warn(`⚠️ SQL injection attempt from IP: ${req.ip}`);
                    return res.status(400).json({ error: 'Invalid input detected' });
                }
                // Check for XSS attempts
                if (this.detectXSS(req)) {
                    console.warn(`⚠️ XSS attempt from IP: ${req.ip}`);
                    return res.status(400).json({ error: 'Potentially harmful input detected' });
                }
                next();
            }
            catch (error) {
                if (error instanceof z.ZodError) {
                    return res.status(400).json({
                        error: 'Validation failed',
                        details: error.issues
                    });
                }
                next(error);
            }
        };
    }
    sanitizeInput(input) {
        if (typeof input === 'string') {
            // Remove null bytes
            let sanitized = input.replace(/\0/g, '');
            // Escape HTML entities
            if (securityConfig.xss.encodeEntities) {
                sanitized = sanitized
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;')
                    .replace(/\//g, '&#x2F;');
            }
            // Trim whitespace
            return sanitized.trim();
        }
        if (Array.isArray(input)) {
            return input.map(item => this.sanitizeInput(item));
        }
        if (typeof input === 'object' && input !== null) {
            const sanitized = {};
            for (const key in input) {
                // Sanitize keys too
                const sanitizedKey = this.sanitizeInput(key);
                sanitized[sanitizedKey] = this.sanitizeInput(input[key]);
            }
            return sanitized;
        }
        return input;
    }
    detectSQLInjection(req) {
        if (!securityConfig.sql.enabled)
            return false;
        const checkString = (str) => {
            return sqlInjectionPatterns.some(pattern => pattern.test(str));
        };
        const checkObject = (obj) => {
            if (typeof obj === 'string')
                return checkString(obj);
            if (Array.isArray(obj))
                return obj.some(item => checkObject(item));
            if (typeof obj === 'object' && obj !== null) {
                return Object.values(obj).some(value => checkObject(value));
            }
            return false;
        };
        return checkObject(req.body) || checkObject(req.query) || checkObject(req.params);
    }
    detectXSS(req) {
        if (!securityConfig.xss.enabled)
            return false;
        const checkString = (str) => {
            return xssPatterns.some(pattern => pattern.test(str));
        };
        const checkObject = (obj) => {
            if (typeof obj === 'string')
                return checkString(obj);
            if (Array.isArray(obj))
                return obj.some(item => checkObject(item));
            if (typeof obj === 'object' && obj !== null) {
                return Object.values(obj).some(value => checkObject(value));
            }
            return false;
        };
        return checkObject(req.body) || checkObject(req.query) || checkObject(req.params);
    }
    // Advanced Rate Limiting
    advancedRateLimit() {
        return (req, res, next) => {
            const ip = req.ip || 'unknown';
            const now = Date.now();
            // Check if IP is blacklisted
            if (ip && ipBlacklist.has(ip)) {
                return res.status(429).json({ error: 'IP address blocked' });
            }
            // Get or create rate limit entry
            let entry = rateLimitStore.get(ip);
            if (!entry) {
                entry = {
                    count: 1,
                    resetTime: now + securityConfig.rateLimit.windowMs
                };
                rateLimitStore.set(ip, entry);
                return next();
            }
            // Check if blocked
            if (entry.blocked && entry.blocked > now) {
                const remainingTime = Math.ceil((entry.blocked - now) / 1000);
                return res.status(429).json({
                    error: 'Too many requests',
                    retryAfter: remainingTime
                });
            }
            // Reset if window expired
            if (now > entry.resetTime) {
                entry.count = 1;
                entry.resetTime = now + securityConfig.rateLimit.windowMs;
                delete entry.blocked;
            }
            else {
                entry.count++;
            }
            // Check limits
            if (entry.count > securityConfig.rateLimit.maxRequestsPerIP) {
                entry.blocked = now + securityConfig.rateLimit.blockDuration;
                console.warn(`🚫 Rate limit exceeded for IP: ${ip}`);
                // Add to temporary blacklist if repeatedly violating
                if (entry.count > securityConfig.rateLimit.maxRequestsPerIP * 2) {
                    if (ip)
                        ipBlacklist.add(ip);
                    setTimeout(() => { if (ip)
                        ipBlacklist.delete(ip); }, 3600000); // Remove after 1 hour
                }
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    retryAfter: Math.ceil(securityConfig.rateLimit.blockDuration / 1000)
                });
            }
            rateLimitStore.set(ip, entry);
            next();
        };
    }
    // Security Headers
    securityHeaders() {
        return (req, res, next) => {
            // Prevent XSS attacks
            res.setHeader('X-XSS-Protection', '1; mode=block');
            // Prevent MIME type sniffing
            res.setHeader('X-Content-Type-Options', 'nosniff');
            // Prevent clickjacking
            res.setHeader('X-Frame-Options', 'DENY');
            // HSTS
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            // CSP
            res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;");
            // Referrer Policy
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            // Permissions Policy
            res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
            next();
        };
    }
    // Content Type Validation
    contentTypeValidation(allowedTypes) {
        return (req, res, next) => {
            const contentType = req.headers['content-type'];
            if (!contentType) {
                return res.status(400).json({ error: 'Content-Type header required' });
            }
            const baseType = contentType.split(';')[0].trim();
            if (!allowedTypes.includes(baseType)) {
                return res.status(415).json({
                    error: 'Unsupported Media Type',
                    allowed: allowedTypes
                });
            }
            next();
        };
    }
    // API Key Authentication
    apiKeyAuth(validKeys) {
        return (req, res, next) => {
            const apiKey = req.headers['x-api-key'];
            if (!apiKey) {
                return res.status(401).json({ error: 'API key required' });
            }
            // If valid keys provided, check against them
            if (validKeys && !validKeys.has(apiKey)) {
                console.warn(`🔐 Invalid API key attempt from IP: ${req.ip}`);
                return res.status(401).json({ error: 'Invalid API key' });
            }
            // Hash the API key for logging (don't log actual keys)
            const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex').substring(0, 8);
            console.log(`🔑 API key authenticated: ${hashedKey}...`);
            next();
        };
    }
    // Session Security
    sessionSecurity() {
        return (req, res, next) => {
            if (!req.session)
                return next();
            // Regenerate session ID on login
            if (req.body?.action === 'login' && req.session) {
                req.session.regenerate((err) => {
                    if (err) {
                        console.error('Session regeneration failed:', err);
                    }
                    next();
                });
            }
            else {
                // Check session expiry
                const maxAge = 3600000; // 1 hour
                if (req.session.cookie.maxAge && req.session.cookie.maxAge < Date.now()) {
                    req.session.destroy((err) => {
                        if (err) {
                            console.error('Session destruction failed:', err);
                        }
                        return res.status(401).json({ error: 'Session expired' });
                    });
                }
                else {
                    next();
                }
            }
        };
    }
    // Audit Logging
    auditLog() {
        return (req, res, next) => {
            const startTime = Date.now();
            // Log request
            const logEntry = {
                timestamp: new Date().toISOString(),
                ip: req.ip,
                method: req.method,
                path: req.path,
                userAgent: req.headers['user-agent'],
                sessionId: req.session?.id
            };
            // Log response
            res.on('finish', () => {
                const duration = Date.now() - startTime;
                const auditLog = {
                    ...logEntry,
                    statusCode: res.statusCode,
                    duration: `${duration}ms`,
                    ...(res.statusCode >= 400 && { error: true })
                };
                // Log security-relevant events
                if (res.statusCode === 401 || res.statusCode === 403) {
                    console.warn('🔒 Security event:', auditLog);
                }
            });
            next();
        };
    }
}
// Export singleton instance
export const advancedSecurity = AdvancedSecurityMiddleware.getInstance();
// Export middleware functions
export const { csrfProtection, inputValidation, advancedRateLimit, securityHeaders, contentTypeValidation, apiKeyAuth, sessionSecurity, auditLog } = advancedSecurity;
