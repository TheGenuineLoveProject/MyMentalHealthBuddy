// server/routes/dashboard.mjs
// Read-only aggregation feeding the user Dashboard page.

import { Router } from "express";
import { db } from "../db/connection.mjs";
import { moods, journals, userProgress } from "../../shared/schema.mjs";
import { eq, and, gte, lt, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();
router.use(requireAuth);

const DAY_MS = 86400000;

function averageScore(rows) {
  const scores = rows.map((r) => r.score).filter((s) => typeof s === "number");
  if (!scores.length) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

router.get("/", async (req, res) => {
  try {
    const userId = req.dbUserId;
    const now = Date.now();
    const sevenDaysAgo = new Date(now - 7 * DAY_MS);
    const fourteenDaysAgo = new Date(now - 14 * DAY_MS);

    const last7 = await db
      .select()
      .from(moods)
      .where(and(eq(moods.userId, userId), gte(moods.createdAt, sevenDaysAgo)))
      .orderBy(desc(moods.createdAt));

    const prev7 = await db
      .select()
      .from(moods)
      .where(
        and(
          eq(moods.userId, userId),
          gte(moods.createdAt, fourteenDaysAgo),
          lt(moods.createdAt, sevenDaysAgo),
        ),
      );

    const avg7 = averageScore(last7);
    const avgPrev = averageScore(prev7);
    let trend = null;
    if (avg7 !== null && avgPrev !== null) {
      if (avg7 > avgPrev + 0.2) trend = "improving";
      else if (avg7 < avgPrev - 0.2) trend = "declining";
      else trend = "neutral";
    }

    const journalRows = await db
      .select({ id: journals.id })
      .from(journals)
      .where(eq(journals.userId, userId));

    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);

    res.json({
      moodSummary: {
        averageMoodLast7Days: avg7,
        entriesLast7Days: last7.length,
        trend,
        recentMoods: last7.slice(0, 7).map((m) => ({ rating: m.rating, createdAt: m.createdAt })),
      },
      journalSummary: { totalEntries: journalRows.length },
      stats: { streak: progress?.currentStreak || 0 },
    });
  } catch (err) {
    logger.error("[Dashboard] Failed to load dashboard", { error: err.message });
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

export default router;
