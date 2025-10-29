/**
 * Authentication Middleware - 360° Security Enhancement
 * Replaces insecure x-user-id header with proper session-based authentication
 */

import type { Request, Response, NextFunction } from 'express';
import type { SelectUser } from '../../shared/schema.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: SelectUser;
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
