// server/routes/admin.mjs
import { Router } from "express";

const router = Router();

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return res.status(401).json({ ok: false, message: "Unauthorized." });
  }
  next();
}

router.get("/stats", requireAuth, (_req, res) => {
  res.json({
    ok: true,
    stats: {
      status: "healthy",
      uptime: process.uptime(),
    },
  });
});

export default router;