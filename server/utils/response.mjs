// server/utils/response.mjs
// Unified response helpers used by all routes (auth, mood, journal, etc.)

/**
 * Main success helper.
 * Both `sendSuccess` and `success` are exported so existing routes keep working.
 */
export function sendSuccess(res, data = {}, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  });
}

// Alias for older code that imports { success } instead of { sendSuccess }
export const success = sendSuccess;

/**
 * 400 – validation / bad request
 * Optionally include an array of validation errors.
 */
export function badRequest(res, message = 'Bad request', errors = []) {
  return res.status(400).json({
    success: false,
    message,
    errors,
  });
}

/**
 * 401 – unauthorized
 */
export function unauthorized(res, message = 'Unauthorized') {
  return res.status(401).json({
    success: false,
    message,
  });
}

/**
 * 403 – forbidden
 */
export function forbidden(res, message = 'Forbidden') {
  return res.status(403).json({
    success: false,
    message,
  });
}

/**
 * 404 – not found
 */
export function notFound(res, message = 'Not found') {
  return res.status(404).json({
    success: false,
    message,
  });
}

/**
 * 500 – internal server error
 */
export function serverError(res, message = 'Internal server error', error = null) {
  if (error) {
    console.error('[SERVER ERROR]', error);
  }

  return res.status(500).json({
    success: false,
    message,
  });
}