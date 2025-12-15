import { requireRole } from "../security/requireRole.mjs";

router.get("/admin", authMiddleware, requireRole("admin"), handler);
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}