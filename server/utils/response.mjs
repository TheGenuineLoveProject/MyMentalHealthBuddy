// server/utils/response.mjs

/**
 * Unified JSON response helpers for MyMentalHealthBuddy.
 *
 * All responses follow this shape:
 * {
 *   success: boolean,
 *   message: string,
 *   data?: any,
 *   errors?: any,
 *   requestId?: string
 * }
 *
 * If requestId middleware is active, it will be available on req.requestId
 * and we echo it back to the client for easier debugging.
 */

function attachRequestMeta(resBody, req) {
  if (req && req.requestId) {
    return { ...resBody, requestId: req.requestId };
  }
  return resBody;
}

// 200 OK
export function success(res, data = null, message = "OK", req) {
  const body = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    body.data = data;
  }

  return res.status(200).json(attachRequestMeta(body, req));
}

// 201 Created
export function created(res, data = null, message = "Created", req) {
  const body = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    body.data = data;
  }

  return res.status(201).json(attachRequestMeta(body, req));
}

// 400 Bad Request — NOW RETURNS ERRORS ARRAY
export function badRequest(res, message = "Invalid request.", errors = null, req) {
  const body = {
    success: false,
    message,
  };

  if (errors && Array.isArray(errors) && errors.length > 0) {
    body.errors = errors;
  } else if (errors && !Array.isArray(errors)) {
    // If a single error object/string is passed
    body.errors = [errors];
  }

  return res.status(400).json(attachRequestMeta(body, req));
}

// 401 Unauthorized
export function unauthorized(res, message = "Not authorized.", req) {
  const body = {
    success: false,
    message,
  };

  return res.status(401).json(attachRequestMeta(body, req));
}

// 403 Forbidden
export function forbidden(res, message = "Forbidden.", req) {
  const body = {
    success: false,
    message,
  };

  return res.status(403).json(attachRequestMeta(body, req));
}

// 404 Not Found
export function notFound(res, message = "Not found.", req) {
  const body = {
    success: false,
    message,
  };

  return res.status(404).json(attachRequestMeta(body, req));
}

// 500 Server Error
export function serverError(res, error, message = "Something went wrong.", req) {
  console.error("🚨 Server error:", error);

  const body = {
    success: false,
    message,
  };

  // Optionally surface a very minimal error for debugging without leaking internals
  if (process.env.NODE_ENV !== "production") {
    body.errors = [
      typeof error === "string"
        ? error
        : error?.message || "Unknown server error",
    ];
  }

  return res.status(500).json(attachRequestMeta(body, req));
}