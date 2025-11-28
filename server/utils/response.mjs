// server/utils/response.mjs
// Standardized API response utilities for consistent error handling

export function success(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    ok: true,
    ...data,
    timestamp: new Date().toISOString()
  });
}

export function created(res, data = {}) {
  return success(res, data, 201);
}

export function error(res, message, statusCode = 500, details = null) {
  const response = {
    ok: false,
    error: message,
    timestamp: new Date().toISOString()
  };
  
  if (details && process.env.NODE_ENV !== 'production') {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
}

export function sendSuccess(res, data = {}, status = 200) {
  res.status(status).json({
    ok: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function sendError(res, message = "Unknown error", status = 400, details = null) {
  res.status(status).json({
    ok: false,
    error: message,
    details,
    timestamp: new Date().toISOString(),
  });
}

export function badRequest(res, message = "Invalid request") {
  return error(res, message, 400);
}

export function unauthorized(res, message = "Authentication required") {
  return error(res, message, 401);
}

export function forbidden(res, message = "Access denied") {
  return error(res, message, 403);
}

export function notFound(res, message = "Resource not found") {
  return error(res, message, 404);
}

export function conflict(res, message = "Resource already exists") {
  return error(res, message, 409);
}

export function serverError(res, err, userMessage = "An unexpected error occurred") {
  console.error("[Server Error]", err);
  return error(res, userMessage, 500, err?.message);
}

export function validationError(res, errors) {
  return res.status(400).json({
    ok: false,
    error: "Validation failed",
    validationErrors: errors,
    timestamp: new Date().toISOString()
  });
}
