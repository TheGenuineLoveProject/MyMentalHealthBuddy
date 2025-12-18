export function requireAdmin(req, res, next) {
  // Option A: Allow-list by email (fast + safe while RBAC is being finalized)
  const allow = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const email = (req.user?.email || "").toLowerCase();

  if (!email || !allow.includes(email)) {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}