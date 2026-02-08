// server/routes/analytics.mjs
import express from "express";
import { db } from "../db/connection.mjs";
import { moods, journals } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

/**
 * POST /api/analytics/event
 * Lightweight client-side event tracking (no sensitive data) - PUBLIC
 */
const SAFE_EVENT_TYPES = [
  "page_view", "feature_click", "session_start", "session_end",
  "tool_opened", "tool_completed", "mood_logged", "journal_created",
  "goal_set", "goal_completed", "auth_login", "auth_logout", "auth_register",
  "subscription_viewed", "error_occurred"
];

router.post("/event", async (req, res) => {
  try {
    const { eventType, page, metadata = {} } = req.body;

    if (!eventType || !SAFE_EVENT_TYPES.includes(eventType)) {
      return badRequest(res, "Invalid event type");
    }

    const safeMetadata = {};
    const allowedKeys = ["page", "tool", "feature", "duration", "source"];
    for (const key of allowedKeys) {
      if (metadata[key] !== undefined) {
        safeMetadata[key] = String(metadata[key]).substring(0, 200);
      }
    }

    logger.debug("Analytics event", {
      eventType,
      page: page?.substring(0, 200),
      userId: req.dbUserId || "anonymous",
      metadata: safeMetadata,
    });

    return success(res, { ok: true, received: eventType });
  } catch (err) {
    logger.error("Analytics event error", { error: err.message });
    return badRequest(res, "Failed to track event");
  }
});

/**
 * POST /api/analytics/pageview
 * Track page views without sensitive content - PUBLIC
 */
router.post("/pageview", async (req, res) => {
  try {
    const { page, referrer } = req.body;

    if (!page) {
      return badRequest(res, "Page is required");
    }

    logger.debug("Page view", {
      page: page.substring(0, 200),
      referrer: referrer?.substring(0, 500),
      userId: req.dbUserId || "anonymous",
    });

    return success(res, { ok: true });
  } catch (err) {
    logger.error("Pageview error", { error: err.message });
    return badRequest(res, "Failed to track pageview");
  }
});

// Apply auth middleware to remaining analytics routes
router.use(requireAuth);

/**
 * GET /api/analytics
 * Base endpoint - Returns combined analytics for moods + journal entries
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.dbUserId;

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

    // Last 7 moods for chart
    const recentMoods = await db
      .select({
        rating: moods.rating,
        score: moods.score,
        emotion: moods.emotion,
        createdAt: moods.createdAt,
      })
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(sql`${moods.createdAt} DESC`)
      .limit(7);

    return success(res, {
      moodCount: Number(moodStats?.count || 0),
      journalCount: Number(journalStats?.count || 0),
      recentMoods: recentMoods.reverse(),
      averageMood: recentMoods.length > 0
        ? Math.round(recentMoods.reduce((sum, m) => sum + (m.rating || 0), 0) / recentMoods.length * 10) / 10
        : null,
    });
  } catch (err) {
    logger.error("Failed to load analytics", { error: err.message, requestId: req.requestId });
    return badRequest(res, "Failed to load analytics.");
  }
});

/**
 * GET /api/analytics/summary
 * Returns combined analytics for moods + journal entries
 */
router.get("/summary", async (req, res) => {
  try {
    const userId = req.dbUserId;

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
    logger.error("Failed to load analytics summary", { error: err.message, requestId: req.requestId });
    return badRequest(res, "Failed to load analytics.");
  }
});

/**
 * GET /api/analytics/moods-last-7
 * Last 7 days of mood scores
 */
router.get("/moods-last-7", async (req, res) => {
  try {
    const userId = req.dbUserId;
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
    logger.error("Failed to load mood analytics", { error: err.message, requestId: req.requestId });
    return badRequest(res, "Failed to load mood analytics.");
  }
});

/**
 * GET /api/analytics/journal-last-7
 * Last 7 journal entries
 */
router.get("/journal-last-7", async (req, res) => {
  try {
    const userId = req.dbUserId;

    const results = await db
      .select({
        title: journals.title,
        text: journals.text,
        createdAt: journals.createdAt,
      })
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(sql`${journals.createdAt} DESC`)
      .limit(7);
    
    const mapped = results.map(j => ({ ...j, content: j.text }));

    return success(res, mapped);
  } catch (err) {
    logger.error("Failed to load journal analytics", { error: err.message, requestId: req.requestId });
    return badRequest(res, "Failed to load journal analytics.");
  }
});

export default router;