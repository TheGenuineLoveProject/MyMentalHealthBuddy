import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { db } from "../db/client.mjs";

const router = express.Router();

router.get("/stats", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const allUsers = await db.query.users.findMany();
    const userCount = allUsers?.length ?? 0;

    res.json({ users: userCount, auditLogs: 0 });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
});

export default router;