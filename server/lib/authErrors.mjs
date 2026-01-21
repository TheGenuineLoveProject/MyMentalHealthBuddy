// =====================================================
// FILE: server/lib/authErrors.mjs
// =====================================================
export const AUTH_INVALID_MESSAGE = "Invalid credentials";

export class AuthError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   */
  constructor(message = AUTH_INVALID_MESSAGE, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * Always respond with the same message for auth failures.
 * @param {import("express").Response} res
 * @param {number} [status=401]
 */
export function sendUniformAuthFailure(res, status = 401) {
  return res.status(status).json({ message: AUTH_INVALID_MESSAGE });
}