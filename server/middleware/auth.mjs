/* server/middleware/auth.mjs */
export function auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    res.status(500).json({ error: "Internal auth error" });
  }
}

export function authGuard(req, res, next) {
  return auth(req, res, next);
}
