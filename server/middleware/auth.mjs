// server/middleware/auth.mjs
// JWT auth middleware for protected API routes

import jwt from "jsonwebtoken";

// Tiny helper to pull the token from headers
function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;

  // Expect "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) return null;
  return token || null;
}

/**
 * requireAuth
 *
 * Usage (inside a route file):
 *   import { requireAuth } from "../middleware/auth.mjs";
 *
 *   router.get("/me", requireAuth, async (req, res) => {
 *     // req.user will contain the decoded JWT payload
 *   });
 */
export function requireAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        ok: false,
        error: "Authentication required. Please sign in.",
      });
    }

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      console.error("❌ SESSION_SECRET is not set. Cannot verify JWT.");
      return res.status(500).json({
        ok: false,
        error: "Auth configuration error. Please try again later.",
      });
    }

    const payload = jwt.verify(token, secret);

    // Attach user data to request for downstream handlers
    req.user = {
      id: payload.sub ?? payload.id ?? null,
      email: payload.email ?? null,
      ...payload,
    };

    return next();
  } catch (err) {
    console.error("JWT verification failed:", err?.message || err);

    return res.status(401).json({
      ok: false,
      error: "Invalid or expired authentication token.",
    });
  }
}