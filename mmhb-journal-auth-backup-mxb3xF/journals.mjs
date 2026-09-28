// server/routes/journals.mjs
// Plural alias used by stats/insights consumers (useUserStats, JournalInsights)
// that expect a BARE ARRAY of the signed-in user's journal entries (newest first),
// unlike /api/journal which wraps entries in { ok, data }. Both read the same DB
// `journals` table, so the two views stay consistent.
import { Router } from "express";
import jwt from "jsonwebtoken";
import { getUserJournals, mapJournalEntry } from "../db/helpers.mjs";
import { logger } from "../utils/logger.mjs";
import { JWT_SECRET as ACCESS_SECRET } from "../config/secrets.mjs";

const router = Router();

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, message: "Unauthorized." });

    const payload = jwt.verify(token, ACCESS_SECRET);
    req.user = payload;
    if (payload.id) req.dbUserId = payload.id;
    return next();
  } catch (authErr) {
    logger.warn("Journals auth token verification failed", { error: authErr?.message || authErr });
    return res.status(401).json({ ok: false, message: "Unauthorized." });
  }
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const rows = await getUserJournals({ userId: req.dbUserId });
    return res.status(200).json(rows.map(mapJournalEntry));
  } catch (err) {
    logger.error("Failed to list journals", { error: err?.message || err });
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  }
});

export default router;
