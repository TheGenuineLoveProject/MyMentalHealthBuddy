import express from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { requireAuth, requireRole } from "../middleware/auth.mjs";
import { audit } from "../security/audit.mjs";
import { requireAdmin } from "../middleware/requireAdmin.mjs";

export const adminRouter = express.Router();

adminRouter.get("/overview", requireAdmin, async (req, res) => {
  // Replace with real DB calls as needed
  res.json({
    ok: true,
    stats: {
      users: "TODO",
      activeToday: "TODO",
      journalEntries: "TODO",
      aiMessages: "TODO",
    },
  });
});

const router = express.Router();

router.get("/stats", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const users = await db.execute(sql`SELECT COUNT(*)::int as count FROM users`);
    const audits = await db.execute(sql`SELECT COUNT(*)::int as count FROM audit_log`);
    await audit(req, "admin.stats.viewed");
    res.json({
      users: users.rows?.[0]?.count ?? 0,
      auditLogs: audits.rows?.[0]?.count ?? 0,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to get admin stats" });
  }
});

export default router;
