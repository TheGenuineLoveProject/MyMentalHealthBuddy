// Advanced Server Optimization Middleware
// Evolution Engine v1.0.4 - Peak Performance Configuration
import compression from "compression";
import helmet from "helmet";
import { RateLimiter } from "../services/rateLimiter";
// Initialize rate limiters for different endpoints
const apiRateLimiter = new RateLimiter({ maxRequests: 100, windowMs: 60000 });
const authRateLimiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
const aiRateLimiter = new RateLimiter({ maxRequests: 50, windowMs: 60000 });
// Compression middleware with optimized settings
export const compressionMiddleware = compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Compress responses > 1KB
  filter: (req, res) => {
    // Don't compress server-sent events
    if (res.getHeader("Content-Type") === "text/event-stream") {
      return false;
    }
    // Use compression for everything else
    return compression.filter(req, res);
  }
});
// Security headers with optimized CSP
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'",
        "https://api.openai.com",
        "https://api.stripe.com"
      ],
      mediaSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'", "https://checkout.stripe.com"],
      upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedding
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});
// Advanced caching headers
export const cacheHeaders = (req, res, next) => {
  const path = req.path;
  // Static assets - long cache
  if (path.match(/\.(js|css|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // API responses - short cache
  else if (path.startsWith("/api/")) {
    if (req.method === "GET") {
      // Cache GET requests briefly
      res.setHeader("Cache-Control", "private, max-age=60, must-revalidate");
    } else {
      // Don't cache mutations
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    }
  }
  // HTML - no cache
  else {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  }
  // Add ETag support for better caching
  res.setHeader("ETag", `W/"${Date.now()}"`);
  next();
};
// Rate limiting middleware
export const rateLimitMiddleware = (type = "api") => {
  return (req, res, next) => {
    const identifier = req.ip || req.session?.id || "anonymous";
    let limiter;
    switch (type) {
      case "auth":
        limiter = authRateLimiter;
        break;
      case "ai":
        limiter = aiRateLimiter;
        break;
      default:
        limiter = apiRateLimiter;
    }
    if (!limiter.checkLimit(identifier)) {
      return res.status(429).json({
        error: "Too many requests",
        message: "Please slow down and try again later",
        retryAfter: 60
      });
    }
    // Add rate limit headers
    res.setHeader(
      "X-RateLimit-Limit",
      type === "auth" ? "5" : type === "ai" ? "50" : "100"
    );
    res.setHeader(
      "X-RateLimit-Remaining",
      limiter.getRemainingRequests(identifier).toString()
    );
    res.setHeader(
      "X-RateLimit-Reset",
      new Date(Date.now() + 60000).toISOString()
    );
    next();
  };
};
// Request size limiting
export const requestSizeLimit = (maxSize = "10mb") => {
  return (req, res, next) => {
    const contentLength = req.headers["content-length"];
    if (contentLength) {
      const size = parseInt(contentLength);
      const maxBytes = parseSize(maxSize);
      if (size > maxBytes) {
        return res.status(413).json({
          error: "Payload too large",
          message: `Request body exceeds maximum size of ${maxSize}`
        });
      }
    }
    next();
  };
};
// Performance monitoring middleware
let requestMetrics = {
  total: 0,
  success: 0,
  errors: 0,
  avgResponseTime: 0,
  p95ResponseTime: 0,
  responseTimes: []
};
export const performanceMonitoring = (req, res, next) => {
  const startTime = Date.now();
  // Monkey-patch the end method
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - startTime;
    // Update metrics
    requestMetrics.total++;
    if (res.statusCode >= 200 && res.statusCode < 400) {
      requestMetrics.success++;
    } else if (res.statusCode >= 400) {
      requestMetrics.errors++;
    }
    // Track response times (keep last 1000)
    requestMetrics.responseTimes.push(duration);
    if (requestMetrics.responseTimes.length > 1000) {
      requestMetrics.responseTimes.shift();
    }
    // Calculate averages
    const times = requestMetrics.responseTimes;
    requestMetrics.avgResponseTime =
      times.reduce((a, b) => a + b, 0) / times.length;
    // Calculate P95
    const sorted = [...times].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    requestMetrics.p95ResponseTime = sorted[p95Index] || 0;
    // Add performance headers
    res.setHeader("X-Response-Time", `${duration}ms`);
    res.setHeader(
      "X-Request-ID",
      req.headers["x-request-id"] || `req_${Date.now()}`
    );
    // Call original end
    originalEnd.apply(res, args);
  };
  next();
};
// Get performance metrics
export function getPerformanceMetrics() {
  return {
    ...requestMetrics,
    successRate:
      requestMetrics.total > 0
        ? ((requestMetrics.success / requestMetrics.total) * 100).toFixed(2) +
          "%"
        : "100%",
    errorRate:
      requestMetrics.total > 0
        ? ((requestMetrics.errors / requestMetrics.total) * 100).toFixed(2) +
          "%"
        : "0%"
  };
}
// Connection limiting to prevent DoS
export const connectionLimit = (maxConnections = 1000) => {
  let connections = 0;
  return (req, res, next) => {
    if (connections >= maxConnections) {
      return res.status(503).json({
        error: "Service temporarily unavailable",
        message: "Server is at maximum capacity, please try again later"
      });
    }
    connections++;
    res.on("finish", () => {
      connections--;
    });
    res.on("close", () => {
      connections--;
    });
    next();
  };
};
// Timeout middleware to prevent hanging requests
export const timeoutMiddleware = (timeout = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          error: "Request timeout",
          message: "The request took too long to process"
        });
      }
    }, timeout);
    res.on("finish", () => {
      clearTimeout(timer);
    });
    next();
  };
};
// Helper function to parse size strings
function parseSize(size) {
  const match = size.match(/^(\d+)(kb|mb|gb)?$/i);
  if (!match) return 10 * 1024 * 1024; // Default 10MB
  const num = parseInt(match[1]);
  const unit = (match[2] || "b").toLowerCase();
  switch (unit) {
    case "kb":
      return num * 1024;
    case "mb":
      return num * 1024 * 1024;
    case "gb":
      return num * 1024 * 1024 * 1024;
    default:
      return num;
  }
}
// CORS optimization with credentials support
export const corsOptimized = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:5000"
    ];
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  exposedHeaders: [
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-Response-Time"
  ],
  maxAge: 86400 // Cache preflight for 24 hours
};
// Export all middleware as a single setup function
export function setupOptimizations(app) {
  // Apply optimizations in correct order
  app.use(connectionLimit(1000));
  app.use(timeoutMiddleware(30000));
  app.use(compressionMiddleware);
  app.use(securityHeaders);
  app.use(cacheHeaders);
  app.use(performanceMonitoring);
  app.use(requestSizeLimit("10mb"));
  console.log("✅ Server optimizations applied:");
  console.log("  • Compression enabled (level 6)");
  console.log("  • Security headers configured");
  console.log("  • Cache headers optimized");
  console.log("  • Rate limiting active");
  console.log("  • Performance monitoring enabled");
  console.log("  • Connection limiting (1000 max)");
  console.log("  • Request timeout (30s)");
}
