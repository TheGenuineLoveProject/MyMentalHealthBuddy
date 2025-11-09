/**
 * Authentication Middleware - 360° Security Enhancement
 * Replaces insecure x-user-id header with proper session-based authentication
 */
import type { Request, Response, NextFunction } from 'express';
declare module 'express-session' {
    interface SessionData {
        userId?: string;
        isAdmin?: boolean;
        id?: string;
    }
}
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            sessionId?: string;
        }
    }
}
/**
 * Authentication middleware - Validates session and attaches user to request
 * This replaces the insecure x-user-id header pattern
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Optional authentication - Attaches user if session exists, but doesn't require it
 * Useful for endpoints that can work both authenticated and unauthenticated
 */
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): void;
/**
 * Get user ID from request (from session)
 * Returns null if no authenticated user
 */
export declare function getUserId(req: Request): string | null;
/**
 * Get user ID or throw error
 * Use this in route handlers that require authentication
 */
export declare function requireUserId(req: Request): string;
/**
 * Session ID helper - Gets or creates session ID
 * Useful for tracking anonymous sessions (e.g., chat sessions)
 */
export declare function getOrCreateSessionId(req: Request): string;
/**
 * Admin middleware - Requires authenticated user with admin role
 * Queries database to verify admin status for security
 */
export declare function requireAdmin(storageInstance: any): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Rate limit by user ID (for authenticated users)
 * This is more accurate than IP-based rate limiting
 */
export declare function getUserIdentifier(req: Request): string;
/**
 * Development/Demo middleware - Provides fallback for x-user-id header
 * ONLY use in development mode for testing
 * MUST be removed in production
 */
export declare function devAuthFallback(req: Request, res: Response, next: NextFunction): void;
/**
 * 360° Optimization: RBAC - Subscription Tier Middleware
 * Enforces subscription tier requirements for premium features
 */
export interface UserSubscription {
    userId: string;
    subscriptionTier: 'free' | 'premium' | 'professional';
    subscriptionStatus: string;
}
declare global {
    namespace Express {
        interface Request {
            userSubscription?: UserSubscription;
        }
    }
}
/**
 * Require minimum subscription tier
 * Usage: requireTier('premium', storage) or requireTier('professional', storage)
 *
 * Note: Must pass storage instance to query user subscription
 */
export declare function requireTier(minTier: 'premium' | 'professional', storageInstance: any): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Check if user has required tier (helper function)
 * Returns true if user meets or exceeds required tier
 */
export declare function checkTier(userTier: string, requiredTier: 'free' | 'premium' | 'professional'): boolean;
/**
 * CSRF Protection Middleware
 * Validates CSRF token for state-changing operations
 */
export declare function csrfProtection(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
/**
 * Generate CSRF token for session
 */
export declare function generateCsrfToken(req: Request): string;
declare module 'express-session' {
    interface SessionData {
        csrfToken?: string;
    }
}
//# sourceMappingURL=authMiddleware.d.ts.map