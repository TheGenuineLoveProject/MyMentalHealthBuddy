// server/middleware/requireAuth.mjs
import { sendUniformAuthFailure } from "../lib/authErrors.mjs";
import { verifyAccessToken } from "../services/tokens.mjs";

/**
 * Attaches req.user on success.
 * Returns 401 only for missing/invalid token.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return sendUniformAuthFailure(res, 401);
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    return next();
  } catch {
    return sendUniformAuthFailure(res, 401);
  }
}