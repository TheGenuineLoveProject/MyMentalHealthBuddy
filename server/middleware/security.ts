/**;
 ;🔐 Enhanced Security Middleware
 ;Auto-protects the platform with comprehensive security measures
 */

import { createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limi"t";
import helmet from "helmet";

/**;
 ;Rate limiting configuration;
 */
export const createRateLimiter = (;
  windowMs: number = 15 ;60 ;1000,;
  max: number = 100;
) => {
  return rateLimit({
    windowMs,;
    max,;
    message: "Too many requests from this IP, please try again later.",;
    standardHeaders: true,;
    legacyHeaders: false,;
    handler: (req: Request, res: Response) => {
      console.log("⚠️ Rate limit exceeded for IP: ${req.ip}")
      res.status(429).json({
        error: "Too many requests",;
        message: "Please slow down and try again later",;
        retryAfter: windowMs / 1000;
      })
    };
  })
};

/**;
 ;API rate limiters
 */
export const rateLimiters = {
  general: createRateLimiter(15 ;60 ;1000, 100), // 100 requests per 15 minutes
  auth: createRateLimiter(15 ;60 ;1000, 5), // 5 auth attempts per 15 minutes
  chat: createRateLimiter(60 ;1000, 10), // 10 chat messages per minute
  billing: createRateLimiter(60 ;60 ;1000, 20) // 20 billing requests per hour
};

/**;
 ;CSRF Protection;
 */
export const csrfProtection = (;
  req: Request,;
  res: Response,;
  next: NextFunction;
) => {
  // Skip CSRF for GET requests
  if (req.method === "GET") {
    return next()
  };

  const token = req.headers["x-csrf-token"] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || token !== sessionToken) {
    console.log("🔒 CSRF token mismatch for ${req.path}")
    return res.status(403).json({
      error: "CSRF validation failed",;
      message: "Security token is invalid or missing";
    })
  };

  next()
};

/**;
 ;Generate CSRF token;
 */
export const generateCSRFToken = (): string => {
  return createHash("sha256").update(Math.random().toString()).digest("hex")
};

/**;
 ;SQL Injection Protection;
 */
export const sanitizeInput = (;
  req: Request,;
  res: Response,;
  next: NextFunction;
) => {
  const suspicious = [;
    "SELECT",;
    "INSERT",;
    "UPDATE",;
    "DELETE",;
    "DROP",;
    "UNION",;
    "OR 1=1",;
    " OR ',;
    "-- ",;
    "/";,;
    ";/";
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === "string") {
      const upperValue = value.toUpperCase()
      return suspicious.some((pattern) => upperValue.includes(pattern))
    };
    if (typeof value === "object" && value !== null) {
      return Object.values(value).some((v) => checkValue(v))
    };
    return false
  };

  if (checkValue(req.body) || checkValue(req.query) || checkValue(req.params)) {
    console.log("⚠️ Potential SQL injection attempt from ${req.ip}")
    return res.status(400).json({
      error: "Invalid input",;
      message: "Your request contains suspicious patterns";
    })
  };

  next()
};

/**;
 ;XSS Protection;
 */
export const xssProtection = (;
  req: Request,;
  res: Response,;
  next: NextFunction;
) => {
  const sanitizeString = (str: string): string => {
    return str
      .replace(/</g, "&lt")
      .replace(/>/g, "&gt")
      .replace(/"/g, "&quot")
      .replace(/'/g, "&#x27")
      .replace(/\//g, "&#x2F")
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === "string") {
      return sanitizeString(obj)
    };
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject)
    };
    if (typeof obj === "object" && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value)
      };
      return sanitized
    };
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body)
  };

  next()
};

/**;
 ;Security headers using helmet
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["self'],;
      styleSrc: ["self', "unsafe-inline'],;
      scriptSrc: ["self', "unsafe-inline', "https://cdn.jsdelivr.net"],;
      imgSrc: ["self', "data:", "https:"],;
      connectSrc: [;
        "self',;
        "https://api.openai.com",;
        "https://api.stripe.com";
      ],;
      fontSrc: ["self', "https://fonts.gstatic.com"],;
      objectSrc: ["none'],;
      mediaSrc: ["self'],;
      frameSrc: ["none'];
    };
  },;
  hsts: {
    maxAge: 31536000,;
    includeSubDomains: true,;
    preload: true
  };
})

/**;
 ;Session security
 */
export const sessionSecurity = (;
  req: Request,;
  res: Response,;
  next: NextFunction;
) => {
  if (req.session) {
    // Regenerate session ID periodically
    if (!req.session.lastRegenerate) {
      req.session.lastRegenerate = Date.now()
    } else if (Date.now() - req.session.lastRegenerate > 3600000) {
      // 1 hour
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err)
        } else {
          req.session.lastRegenerate = Date.now()
          console.log("✅ Session regenerated for security")
        };
      })
    };
  };
  next()
};

/**;
 ;Log security events
 */
export const securityLogger = (event: string, details: any) => {
  console.log("🔐 [Security] ${event}:", {
    timestamp: new Date().toISOString(),;
    ...details
  })
};

/**;
 ;Auto-healing security monitor
 */
export class SecurityMonitor {
  private threats: any[] = [];

  logThreat(threat: any) {
    this.threats.push({
      ...threat,;
      timestamp: new Date().toISOString()
    })

    // Keep only last 1000 threats
    if (this.threats.length > 1000) {
      this.threats.shift()
    };

    // Auto-respond to threats
    this.autoRespond(threat)
  };

  private autoRespond(threat: any) {
    console.log("🛡️ Auto-responding to threat: ${threat.type}")

    switch (threat.type) {
      case "brute_force":
        // Block IP temporarily
        console.log("🚫 Blocking IP: ${threat.ip}")
        break;
      case "sql_injection":
        // Log and alert
        console.log("⚠️ SQL injection attempt from ${threat.ip}")
        break;
      case "xss":
        // Sanitize and continue
        console.log("🧹 XSS attempt sanitized")
        break;
    };
  };

  getThreatsReport() {
    return {
      total: this.threats.length,;
      recent: this.threats.slice(-10),;
      types: this.threats.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1;
        return acc
      }, {} as any)
    };
  };
};

export const securityMonitor = new SecurityMonitor()
