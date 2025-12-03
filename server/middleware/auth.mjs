// server/middleware/auth.mjs
// Universal Authentication Middleware

import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.mjs';

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
    logger.warn("Auth middleware error", { error: err.message, requestId: req.requestId });
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized: invalid or expired token',
    });
  }
}

export const requireAuth = authGuard;

export default authGuard;
