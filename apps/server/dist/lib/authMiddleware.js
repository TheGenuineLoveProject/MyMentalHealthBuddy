"use strict";
/**
 * Authentication Middleware - 360° Security Enhancement
 * Replaces insecure x-user-id header with proper session-based authentication
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.optionalAuth = optionalAuth;
exports.getUserId = getUserId;
exports.requireUserId = requireUserId;
exports.getOrCreateSessionId = getOrCreateSessionId;
exports.requireAdmin = requireAdmin;
exports.getUserIdentifier = getUserIdentifier;
exports.devAuthFallback = devAuthFallback;
exports.requireTier = requireTier;
exports.checkTier = checkTier;
exports.csrfProtection = csrfProtection;
exports.generateCsrfToken = generateCsrfToken;
/**
 * Authentication middleware - Validates session and attaches user to request
 * This replaces the insecure x-user-id header pattern
 */
function requireAuth(req, res, next) {
    // Check if session exists
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            error: 'Authentication required',
            message: 'Please log in to access this resource'
        });
    }
    // Attach userId to request for easy access
    req.userId = req.session.userId;
    next();
}
/**
 * Optional authentication - Attaches user if session exists, but doesn't require it
 * Useful for endpoints that can work both authenticated and unauthenticated
 */
function optionalAuth(req, res, next) {
    if (req.session && req.session.userId) {
        req.userId = req.session.userId;
    }
    next();
}
/**
 * Get user ID from request (from session)
 * Returns null if no authenticated user
 */
function getUserId(req) {
    return req.userId || req.session?.userId || null;
}
/**
 * Get user ID or throw error
 * Use this in route handlers that require authentication
 */
function requireUserId(req) {
    const userId = getUserId(req);
    if (!userId) {
        throw new Error('User not authenticated');
    }
    return userId;
}
/**
 * Session ID helper - Gets or creates session ID
 * Useful for tracking anonymous sessions (e.g., chat sessions)
 */
function getOrCreateSessionId(req) {
    // Check if session already has an ID
    if (req.session && req.session.id) {
        return req.session.id;
    }
    // Generate new session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (req.session) {
        req.session.id = sessionId;
    }
    return sessionId;
}
/**
 * Admin middleware - Requires authenticated user with admin role
 * Queries database to verify admin status for security
 */
function requireAdmin(storageInstance) {
    return async (req, res, next) => {
        try {
            if (!req.session || !req.session.userId) {
                return res.status(401).json({
                    error: 'Authentication required',
                    message: 'Please log in to access this resource'
                });
            }
            const userId = req.session.userId;
            const user = await storageInstance.getUserById(userId);
            if (!user) {
                return res.status(401).json({
                    error: 'User not found',
                    message: 'Your account could not be verified'
                });
            }
            if (!user.isAdmin) {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'Administrator access required'
                });
            }
            req.userId = userId;
            req.session.isAdmin = true;
            next();
        }
        catch (error) {
            console.error('Admin auth error:', error);
            res.status(500).json({
                error: 'Authorization check failed',
                message: 'Unable to verify admin status'
            });
        }
    };
}
/**
 * Rate limit by user ID (for authenticated users)
 * This is more accurate than IP-based rate limiting
 */
function getUserIdentifier(req) {
    // Use userId if authenticated
    if (req.userId || req.session?.userId) {
        return `user-${req.userId || req.session.userId}`;
    }
    // Fall back to IP address for anonymous users
    return `ip-${req.ip || req.socket.remoteAddress || 'unknown'}`;
}
/**
 * Development/Demo middleware - Provides fallback for x-user-id header
 * ONLY use in development mode for testing
 * MUST be removed in production
 */
function devAuthFallback(req, res, next) {
    const isDev = process.env.NODE_ENV !== 'production';
    // Only allow x-user-id in development
    if (isDev && !req.session?.userId) {
        const xUserId = req.headers['x-user-id'];
        if (xUserId) {
            // Create a temporary session for development
            if (req.session) {
                req.session.userId = xUserId;
                req.userId = xUserId;
            }
        }
    }
    next();
}
/**
 * Require minimum subscription tier
 * Usage: requireTier('premium', storage) or requireTier('professional', storage)
 *
 * Note: Must pass storage instance to query user subscription
 */
function requireTier(minTier, storageInstance) {
    return async (req, res, next) => {
        try {
            // First ensure user is authenticated
            if (!req.session || !req.session.userId) {
                return res.status(401).json({
                    error: 'Authentication required',
                    message: 'Please log in to access this resource'
                });
            }
            const userId = req.session.userId;
            // Query user subscription status from database
            const user = await storageInstance.getUserById(userId);
            if (!user) {
                return res.status(401).json({
                    error: 'User not found',
                    message: 'Your account could not be verified'
                });
            }
            // Check if user's subscription is active
            if (user.subscriptionStatus !== 'active') {
                return res.status(403).json({
                    error: 'Subscription required',
                    message: `This feature requires an active ${minTier} subscription. Your subscription status: ${user.subscriptionStatus}`,
                    upgradeUrl: '/subscription'
                });
            }
            // Tier hierarchy: free < premium < professional
            const tierHierarchy = { free: 0, premium: 1, professional: 2 };
            const userTierLevel = tierHierarchy[user.subscriptionTier] || 0;
            const requiredTierLevel = tierHierarchy[minTier];
            // Check if user meets minimum tier requirement
            if (userTierLevel < requiredTierLevel) {
                return res.status(403).json({
                    error: 'Upgrade required',
                    message: `This feature requires ${minTier} tier. Your current tier: ${user.subscriptionTier}`,
                    currentTier: user.subscriptionTier,
                    requiredTier: minTier,
                    upgradeUrl: '/subscription'
                });
            }
            // Attach subscription info to request for route handlers
            req.userSubscription = {
                userId: user.id,
                subscriptionTier: user.subscriptionTier,
                subscriptionStatus: user.subscriptionStatus
            };
            next();
        }
        catch (error) {
            console.error('RBAC error:', error);
            res.status(500).json({
                error: 'Authorization check failed',
                message: 'Unable to verify subscription status'
            });
        }
    };
}
/**
 * Check if user has required tier (helper function)
 * Returns true if user meets or exceeds required tier
 */
function checkTier(userTier, requiredTier) {
    const tierHierarchy = { free: 0, premium: 1, professional: 2 };
    const userLevel = tierHierarchy[userTier] || 0;
    const requiredLevel = tierHierarchy[requiredTier];
    return userLevel >= requiredLevel;
}
/**
 * CSRF Protection Middleware
 * Validates CSRF token for state-changing operations
 */
function csrfProtection(req, res, next) {
    // Skip CSRF for GET, HEAD, OPTIONS requests (safe methods)
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }
    // For state-changing requests (POST, PUT, PATCH, DELETE), verify CSRF token
    const csrfToken = req.headers['x-csrf-token'];
    const sessionToken = req.session?.csrfToken;
    if (!csrfToken || csrfToken !== sessionToken) {
        // In development, log warning but allow through
        if (process.env.NODE_ENV !== 'production') {
            console.warn('⚠️  CSRF token missing or invalid (development mode - allowing through)');
            return next();
        }
        // In production, block the request
        return res.status(403).json({
            error: 'CSRF validation failed',
            message: 'Invalid or missing CSRF token'
        });
    }
    next();
}
/**
 * Generate CSRF token for session
 */
function generateCsrfToken(req) {
    if (!req.session) {
        throw new Error('Session required for CSRF token generation');
    }
    const token = `csrf-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`;
    req.session.csrfToken = token;
    return token;
}
