// =====================================================
// FILE: server/middleware/requireRole.mjs
// =====================================================
/**
 * Must be used AFTER requireAuth.
 * Returns 403 when authenticated-but-not-authorized.
 * @param {string[]} roles
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const role = user.role || "user";
    if (!roles.includes(role)) return res.status(403).json({ message: "Forbidden" });

    return next();
  };
}