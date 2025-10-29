/**
 * Authentication Middleware - 360° Security Enhancement
 * Replaces insecure x-user-id header with proper session-based authentication
 */

import type { Request, Response, NextFunction } from 'express';

// Extend Express Session to include custom fields
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAdmin?: boolean;
    id?: string;
  }
}

// Extend Express Request to include user
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
export function requireAuth(req: Request, res: Response, next: NextFunction) {
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
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
  }
  
  next();
}

/**
 * Get user ID from request (from session)
 * Returns null if no authenticated user
 */
export function getUserId(req: Request): string | null {
  return req.userId || req.session?.userId || null;
}

/**
 * Get user ID or throw error
 * Use this in route handlers that require authentication
 */
export function requireUserId(req: Request): string {
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
export function getOrCreateSessionId(req: Request): string {
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
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }

  // Check if user is admin (you'll need to add this field to your user schema)
  // For now, we'll check if the user has an admin flag in session
  if (!req.session.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Administrator access required'
    });
  }

  req.userId = req.session.userId;
  next();
}

/**
 * Rate limit by user ID (for authenticated users)
 * This is more accurate than IP-based rate limiting
 */
export function getUserIdentifier(req: Request): string {
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
export function devAuthFallback(req: Request, res: Response, next: NextFunction) {
  const isDev = process.env.NODE_ENV !== 'production';
  
  // Only allow x-user-id in development
  if (isDev && !req.session?.userId) {
    const xUserId = req.headers['x-user-id'] as string;
    
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
 * 360° Optimization: RBAC - Subscription Tier Middleware
 * Enforces subscription tier requirements for premium features
 */
export interface UserSubscription {
  userId: string;
  subscriptionTier: 'free' | 'premium' | 'professional';
  subscriptionStatus: string;
}

// Extend Express Request to include user subscription
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
export function requireTier(minTier: 'premium' | 'professional', storageInstance: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
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
      const userTierLevel = tierHierarchy[user.subscriptionTier as keyof typeof tierHierarchy] || 0;
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
        subscriptionTier: user.subscriptionTier as 'free' | 'premium' | 'professional',
        subscriptionStatus: user.subscriptionStatus
      };

      next();
    } catch (error) {
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
export function checkTier(userTier: string, requiredTier: 'free' | 'premium' | 'professional'): boolean {
  const tierHierarchy = { free: 0, premium: 1, professional: 2 };
  const userLevel = tierHierarchy[userTier as keyof typeof tierHierarchy] || 0;
  const requiredLevel = tierHierarchy[requiredTier];
  return userLevel >= requiredLevel;
}

/**
 * CSRF Protection Middleware
 * Validates CSRF token for state-changing operations
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF for GET, HEAD, OPTIONS requests (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // For state-changing requests (POST, PUT, PATCH, DELETE), verify CSRF token
  const csrfToken = req.headers['x-csrf-token'] as string;
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
export function generateCsrfToken(req: Request): string {
  if (!req.session) {
    throw new Error('Session required for CSRF token generation');
  }

  const token = `csrf-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`;
  req.session.csrfToken = token;
  return token;
}

// Extend session to include CSRF token
declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
  }
}
