// server/middleware/auth.mjs
import jwt from "jsonwebtoken";

// Get JWT secret with STRICT enforcement
function getJwtSecret() {
  const secret = process.env.SESSION_SECRET;
  
  // In production, secret is MANDATORY
  if (process.env.NODE_ENV === "production") {
    if (!secret) {
      throw new Error("CRITICAL: SESSION_SECRET environment variable is required in production");
    }
    if (secret.length < 32) {
      throw new Error("CRITICAL: SESSION_SECRET must be at least 32 characters in production");
    }
    return secret;
  }
  
  // In development, warn but allow fallback
  if (!secret) {
    console.warn("WARNING: SESSION_SECRET not set. Using development fallback. Set this before production!");
    return "dev-only-secret-change-in-production-min-32-chars";
  }
  
  return secret;
}

// Initialize secret at module load (will throw in production if not configured)
let JWT_SECRET;
try {
  JWT_SECRET = getJwtSecret();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// Strict auth - requires valid token
export function authGuard(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      error: "Authentication required",
      code: "MISSING_TOKEN"
    });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Validate token has required fields (id from auth.mjs JWT signing)
    if (!decoded.id || !decoded.email) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid token format",
        code: "INVALID_TOKEN_FORMAT"
      });
    }
    
    // Normalize user object to always have both 'id' and 'userId' for compatibility
    req.user = {
      ...decoded,
      userId: decoded.id  // Add userId alias for backward compatibility
    };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        error: "Token has expired",
        code: "TOKEN_EXPIRED"
      });
    }
    return res.status(401).json({ 
      success: false,
      error: "Invalid authentication token",
      code: "INVALID_TOKEN"
    });
  }
}

// Optional auth - continues even without token
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  
  next();
}

// Export for use in auth routes
export { JWT_SECRET };
