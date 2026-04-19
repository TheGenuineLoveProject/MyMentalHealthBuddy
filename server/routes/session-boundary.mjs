import express from "express";
import crypto from "node:crypto";
import { sql } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.mjs";
import { issueCsrfToken } from "../security/csrf.mjs";
import { csrfProtection, issueCsrfToken } from "../security/csrf.mjs";

router.get("/csrf-token", csrfProtection, issueCsrfToken);
const router = express.Router();

router.get("/csrf-token", (req, res) => {
  const token = issueCsrfToken(req, res);
  return res.json({ ok: true, csrfToken: token });
});

router.post("/upgrade-history", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const guestId = req.headers?.["x-guest-id"];
    if (!guestId || typeof guestId !== "string") {
      return res.status(400).json({ error: "x-guest-id header required" });
    }

    const guestHistory = globalThis.__guestHistory__;
    const db = globalThis.db;
    if (!guestHistory || !db) {
      return res.status(503).json({ error: "Session boundary not ready" });
    }

    const bucket = guestHistory.get(guestId);
    if (!bucket || bucket.length === 0) {
      return res.json({ ok: true, merged: 0, cleared: false });
    }

    let merged = 0;
    for (const m of bucket) {
      const role = m?.role === "assistant" ? "assistant" : "user";
      const content = String(m?.content || "").slice(0, 8000);
      if (!content) continue;
      const id = crypto.randomUUID();
      await db.execute(sql`
        INSERT INTO ai_messages (id, user_id, role, content, flow_type, is_crisis)
        VALUES (${id}, ${userId}, ${role}, ${content}, ${"upgrade"}, ${false})
      `);
      merged += 1;
    }

    guestHistory.delete(guestId);
    return res.json({ ok: true, merged, cleared: true });
  } catch (err) {
    console.error("upgrade-history failed:", err?.message || err);
    return res.status(500).json({ error: "Upgrade failed" });
  }
});

export default router;
