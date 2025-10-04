import { ZodError } from "zod";
import { config, isProduction } from "../config.js";
// Custom error types
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400);
    this.code = "VALIDATION_ERROR";
  }
}
export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
    this.code = "NOT_FOUND";
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
    this.code = "UNAUTHORIZED";
  }
}
export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401);
    this.code = "AUTHENTICATION_ERROR";
  }
}
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access") {
    super(message, 403);
    this.code = "FORBIDDEN";
  }
}
export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409);
    this.code = "CONFLICT";
  }
}
export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429);
    this.code = "RATE_LIMIT_EXCEEDED";
  }
}
// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // Log error details
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get("User-Agent"),
    ip: req.ip
  });
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new NotFoundError(message);
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ConflictError(message);
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = "Validation Error";
    error = new ValidationError(message);
  }
  // Zod validation error
  if (err instanceof ZodError) {
    const message = "Validation failed";
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message
    }));
    error = new ValidationError(message);
    error.details = details;
  }
  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new UnauthorizedError(message);
  }
  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new UnauthorizedError(message);
  }
  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      message,
      code: error.code || "INTERNAL_ERROR",
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    }
  };
  // Add additional details in development
  if (!isProduction) {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = error.details;
  }
  // Add request ID if available
  if (req.headers["x-request-id"]) {
    errorResponse.error.requestId = req.headers["x-request-id"];
  }
  res.status(statusCode).json(errorResponse);
};
// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
// Not found middleware
export const notFound = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};
// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId =
    req.headers["x-request-id"] ||
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  req.headers["x-request-id"] = requestId;
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
      timestamp: new Date().toISOString()
    };
    if (config.LOG_LEVEL === "debug") {
      console.log("Request:", logData);
    }
  });
  next();
};
