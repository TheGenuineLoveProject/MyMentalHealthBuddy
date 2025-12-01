// server/routes/analytics.mjs
import express from "express";
import { db } from "../db/connection.mjs";
import { moods, journals } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";

const router = express.Router();

/**
 * GET /api/analytics/summary
 * Returns combined analytics for moods + journal entries
 */
router.get("/summary", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return badRequest(res, "Missing authentication.");

    // Mood count
    const [moodStats] = await db
      .select({ count: sql`count(*)` })
      .from(moods)
      .where(eq(moods.userId, userId));

    // Journal count
    const [journalStats] = await db
      .select({ count: sql`count(*)` })
      .from(journals)
      .where(eq(journals.userId, userId));

    return success(res, {
      moodCount: Number(moodStats.count),
      journalCount: Number(journalStats.count),
    });
  } catch (err) {
    console.error("Analytics summary error:", err);
    return badRequest(res, "Failed to load analytics.");
  }
});

/**
 * GET /api/analytics/moods-last-7
 * Last 7 days of mood scores
 */
router.get("/moods-last-7", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return badRequest(res, "Missing authentication.");

    const results = await db
      .select({
        score: moods.score,
        createdAt: moods.createdAt,
      })
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(sql`${moods.createdAt} DESC`)
      .limit(7);

    return success(res, results);
  } catch (err) {
    console.error("Analytics mood error:", err);
    return badRequest(res, "Failed to load mood analytics.");
  }
});

/**
 * GET /api/analytics/journal-last-7
 * Last 7 journal entries
 */
router.get("/journal-last-7", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return badRequest(res, "Missing authentication.");

    const results = await db
      .select({
        title: journal.title,
        content: journal.content,
        createdAt: journal.createdAt,
      })
      .from(journal)
      .where(eq(journal.userId, userId))
      .orderBy(sql`${journal.createdAt} DESC`)
      .limit(7);

    return success(res, results);
  } catch (err) {
    console.error("Analytics journal error:", err);
    return badRequest(res, "Failed to load journal analytics.");
  }
});

export default router;