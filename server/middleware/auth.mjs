// /server/middleware/auth.mjs
// Roger v5.1 — simple auth + smoke-test bypass

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  // 1) Smoke-test bypass
  if (authHeader === "Bearer smoketest-token") {
    req.user = { id: "smoketest-user" };
    return next();
  }

  // 2) Basic Bearer check for real users
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized: missing Bearer token"
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token || token.length < 5) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized: invalid or expired token"
    });
  }

  // NOTE: you can swap this for real JWT verification later.
  // For now, treat any non-trivial token as valid.
  req.user = { id: "user-from-token" };
  return next();
}

// Alias for backward compatibility
export const authGuard = requireAuth;