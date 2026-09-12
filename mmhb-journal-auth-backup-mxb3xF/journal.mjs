// server/routes/journal.mjs
import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/client.mjs";
import { anonymousReflections } from "../../shared/schema.mjs";
import {
  createJournalEntry,
  getUserJournals,
  getJournalById,
  updateJournalEntry,
  deleteJournalEntry,
  mapJournalEntry,
} from "../db/helpers.mjs";
import { increment } from "../utils/metrics.mjs";
import { logger } from "../utils/logger.mjs";
import { JWT_SECRET as ACCESS_SECRET } from "../config/secrets.mjs";

const router = Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
    logger.warn("Journal auth token verification failed", { error: authErr?.message || authErr });
    return res.status(401).json({ ok: false, message: "Unauthorized." });
  }
}

/**
 * POST /api/journal
 * body: { title, content, shareWithCommunity?, isAnonymous?, mood? }
 * Persists to the DB `journals` table. Returns: { ok:true, data:{...entry} }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, content, shareWithCommunity, isAnonymous = true, mood = "neutral" } = req.body || {};

    if (!title || String(title).trim().length === 0) {
      return res.status(400).json({ ok: false, message: "Title is required." });
    }
    if (content == null || String(content).trim().length === 0) {
      return res.status(400).json({ ok: false, message: "Content is required." });
    }

    const row = await createJournalEntry({
      userId: req.dbUserId,
      title: String(title).trim(),
      text: String(content),
      mood: mood || "neutral",
    });

    increment("journal_entry_created", { plan: "unknown" });

    if (shareWithCommunity) {
      try {
        const displayName = isAnonymous ? null : (req.user?.name || req.user?.email?.split("@")[0] || null);
        await db.insert(anonymousReflections).values({
          content: String(content).slice(0, 500),
          mood: mood || "neutral",
          displayName,
          isAnonymous: Boolean(isAnonymous),
        });
      } catch (err) {
        logger.error("Failed to share with community:", { error: err?.message || err });
      }
    }

    return res.status(200).json({ ok: true, data: mapJournalEntry(row) });
  } catch (err) {
    logger.error("Failed to create journal entry", { error: err?.message || err });
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  }
});

/**
 * GET /api/journal
 * Returns: { ok:true, data:[...entries] } (newest first)
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const rows = await getUserJournals({ userId: req.dbUserId });
    return res.status(200).json({ ok: true, data: rows.map(mapJournalEntry) });
  } catch (err) {
    logger.error("Failed to list journal entries", { error: err?.message || err });
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  }
});

/**
 * GET /api/journal/:id
 * Returns single journal entry
 * - Invalid or non-existent id -> 400 (tests expect 400, NOT 404)
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!UUID_RE.test(id || "")) {
      return res.status(400).json({ ok: false, message: "Invalid journal id." });
    }

    const row = await getJournalById({ id, userId: req.dbUserId });
    if (!row) {
      return res.status(400).json({ ok: false, message: "Journal entry not found." });
    }

    return res.status(200).json({ ok: true, data: mapJournalEntry(row) });
  } catch (err) {
    logger.error("Failed to get journal entry", { error: err?.message || err });
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  }
});

/**
 * PUT /api/journal/:id
 * - Invalid or non-existent id -> 400 (tests expect 400, NOT 404)
 * - If exists -> 200 with updated entry in data
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mood } = req.body || {};

    if (!UUID_RE.test(id || "")) {
      return res.status(400).json({ ok: false, message: "Invalid journal id." });
    }

    const fields = {};
    if (title != null) {
      const t = String(title).trim();
      if (t.length === 0) {
        return res.status(400).json({ ok: false, message: "Title cannot be empty." });
      }
      fields.title = t;
    }
    if (content != null) fields.text = String(content);
    if (mood != null) fields.mood = String(mood);

    const row = await updateJournalEntry({ id, userId: req.dbUserId, ...fields });
    if (!row) {
      return res.status(400).json({ ok: false, message: "Journal entry not found." });
    }

    return res.status(200).json({ ok: true, data: mapJournalEntry(row) });
  } catch (err) {
    logger.error("Failed to update journal entry", { error: err?.message || err });
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  }
});

/**
 * DELETE /api/journal/:id
 * - Existing -> 200 {ok:true}
 * - Invalid or non-existent -> 400 (tests expect 400, NOT 404)
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!UUID_RE.test(id || "")) {
      return res.status(400).json({ ok: false, message: "Invalid journal id." });
    }

    const row = await deleteJournalEntry({ id, userId: req.dbUserId });
    if (!row) {
      return res.status(400).json({ ok: false, message: "Journal entry not found." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    logger.error("Failed to delete journal entry", { error: err?.message || err });
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  }
});

export default router;
