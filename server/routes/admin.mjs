import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { db } from "../db/client.mjs";

const router = express.Router();

router.get("/stats", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const users = (await db.query.users.count()) ?? 0;
    const auditLogs = (await db.query.auditLogs?.count?.()) ?? 0;

    res.json({ users, auditLogs });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
});

export default router;