// server/middleware/auth.mjs
// Universal Authentication Middleware — MyMentalHealthBuddy (MJS / Replit)

import jwt from 'jsonwebtoken';

// Core auth guard used by all protected routes
export function authGuard(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized: missing Bearer token',
      });
    }

    const token = authHeader.split(' ')[1];

    const payload = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = payload;

    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized: invalid or expired token',
    });
  }
}

// Backwards compatible name for older routes:
// import { requireAuth } from '../middleware/auth.mjs';
export const requireAuth = authGuard;

// Optional default export
export default authGuard;