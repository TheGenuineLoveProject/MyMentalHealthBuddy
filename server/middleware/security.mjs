// server/middleware/security.mjs
// Enhanced security middleware

import { randomBytes } from "crypto";

// Content Security Policy configuration
export function cspHeaders(req, res, next) {
  const isProduction = process.env.NODE_ENV === "production";
  
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.openai.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io wss:",
    "worker-src 'self' blob:",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  if (!isProduction) {
    cspDirectives.push("script-src-elem 'self' 'unsafe-inline'");
  }

  res.setHeader("Content-Security-Policy", cspDirectives.join("; "));
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-DNS-Prefetch-Control", "on");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  
  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  
  next();
}

// Input sanitization for text content
export function sanitizeInput(text) {
  if (typeof text !== "string") return text;
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*on\w+\s*=\s*["'][^"']*["'][^>]*>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

// Recursively sanitize nested objects and arrays
function deepSanitize(value) {
  if (typeof value === "string") {
    return sanitizeInput(value);
  }
  if (Array.isArray(value)) {
    return value.map(deepSanitize);
  }
  if (value !== null && typeof value === "object") {
    const sanitized = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = deepSanitize(val);
    }
    return sanitized;
  }
  return value;
}

// Middleware to sanitize request body (recursively)
export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = deepSanitize(req.body);
  }
  next();
}

// Security headers for API responses
export function securityHeaders(req, res, next) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  next();
}

// CSRF token generation using double-submit cookie pattern
// NOTE: This app uses JWT bearer tokens in Authorization headers, not session cookies.
// CSRF protection is less critical but available for future use.
const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_LENGTH = 32;

export function generateCsrfToken() {
  return randomBytes(TOKEN_LENGTH).toString("hex");
}

// CSRF protection middleware - currently disabled as the app uses JWT tokens
// To enable: set ENABLE_CSRF=true in environment variables and integrate with frontend
export function csrfProtection(req, res, next) {
  // CSRF is disabled by default since we use JWT bearer tokens
  // JWT tokens are not automatically sent with requests, making CSRF attacks less viable
  // Enable with ENABLE_CSRF=true if switching to cookie-based sessions
  if (process.env.ENABLE_CSRF !== "true") {
    return next();
  }
  
  const isProduction = process.env.NODE_ENV === "production";
  
  // Skip CSRF for safe methods and exempt endpoints
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  const exemptPaths = ["/api/webhooks", "/api/health", "/api/ready", "/api/auth"];
  
  if (safeMethods.includes(req.method) || exemptPaths.some(path => req.path.startsWith(path))) {
    return next();
  }
  
  // Validate CSRF token for mutating requests
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];
  
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    // In development, log but don't block
    if (!isProduction) {
      return next();
    }
    return res.status(403).json({
      ok: false,
      error: "Invalid or missing CSRF token",
    });
  }
  
  next();
}

// Secure cookie configuration helper
export function getSecureCookieOptions(maxAge = 24 * 60 * 60 * 1000) {
  const isProduction = process.env.NODE_ENV === "production";
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge,
    path: "/",
  };
}
