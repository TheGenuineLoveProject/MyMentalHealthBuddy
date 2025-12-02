// server/routes/ui-dashboard.mjs
// Dashboard data endpoint

import express from "express";
import { db } from "../db/connection.mjs";
import { moods, journals } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

// Apply auth middleware
router.use(requireAuth);

/**
 * GET /api/dashboard (or /api/ui-dashboard)
 * Returns dashboard summary for authenticated user
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;

    // Get mood stats
    const moodRows = await db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(sql`${moods.createdAt} DESC`)
      .limit(7);

    // Get journal count
    const [journalStats] = await db
      .select({ count: sql`count(*)` })
      .from(journals)
      .where(eq(journals.userId, userId));

    // Calculate average mood from last 7 days
    let averageMoodLast7Days = null;
    if (moodRows.length > 0) {
      averageMoodLast7Days = Math.round(
        (moodRows.reduce((sum, m) => sum + (m.rating || 0), 0) / moodRows.length) * 10
      ) / 10;
    }

    // Calculate trend
    let trend = "neutral";
    if (moodRows.length >= 4) {
      const recent = moodRows.slice(0, 3).reduce((s, m) => s + m.rating, 0) / 3;
      const older = moodRows.slice(-3).reduce((s, m) => s + m.rating, 0) / 3;
      if (recent > older + 0.5) trend = "improving";
      else if (recent < older - 0.5) trend = "declining";
    }

    return success(res, {
      moodSummary: {
        averageMoodLast7Days,
        entriesLast7Days: moodRows.length,
        trend,
        recentMoods: moodRows.map((m) => ({
          rating: m.rating,
          emotion: m.emotion,
          createdAt: m.createdAt,
        })),
      },
      journalSummary: {
        totalEntries: Number(journalStats?.count || 0),
      },
      user: {
        id: userId,
        email: req.user?.email,
      },
    }, "Dashboard data loaded.");
  } catch (err) {
    console.error("[dashboard] Unexpected error:", err);
    return badRequest(res, "Failed to load dashboard data.");
  }
});

export default router;
