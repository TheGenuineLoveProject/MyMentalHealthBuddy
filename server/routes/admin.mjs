import express from "express";
import db from "../db/client.mjs";
import { requireAuth, requireRole } from "../middleware/auth.mjs";
import { audit } from "../security/audit.mjs";

const router = express.Router();

router.get("/stats", requireAuth, requireRole("admin"), async (req, res) => {
  const users = await db.execute(`SELECT COUNT(*)::int as count FROM users`);
  const audits = await db.execute(`SELECT COUNT(*)::int as count FROM audit_logs`);
  await audit(req, "admin.stats.viewed");
  res.json({
    users: users.rows?.[0]?.count ?? 0,
    auditLogs: audits.rows?.[0]?.count ?? 0,
  });
});

export default router;