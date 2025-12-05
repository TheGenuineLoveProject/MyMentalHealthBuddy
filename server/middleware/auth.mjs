// /server/middleware/auth.mjs
// Roger v5.1 — Real JWT verification with SESSION_SECRET

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET;

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  // 1) Smoke-test bypass (development only)
  if (process.env.NODE_ENV === "development" && authHeader === "Bearer smoketest-token") {
    req.user = { id: "smoketest-user" };
    return next();
  }

  // 2) Verify Bearer token format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized: missing Bearer token"
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized: token is empty"
    });
  }

  // 3) Verify JWT with SESSION_SECRET
  if (!JWT_SECRET) {
    console.error("FATAL: SESSION_SECRET not configured for JWT verification");
    return res.status(500).json({
      ok: false,
      error: "Server configuration error"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Validate decoded payload has required fields
    if (!decoded.id || !decoded.email) {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized: invalid token payload"
      });
    }

    // Attach verified user to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized: token has expired"
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized: invalid token"
      });
    }
    
    console.error("JWT verification error:", err.message);
    return res.status(401).json({
      ok: false,
      error: "Unauthorized: token verification failed"
    });
  }
}

// Alias for backward compatibility
export const authGuard = requireAuth;