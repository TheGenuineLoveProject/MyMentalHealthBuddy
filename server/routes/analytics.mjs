// server/routes/analytics.mjs
import express from "express";
import { db } from "../db/connection.mjs";
import { moods, journals, analyticsEvents } from "../../shared/schema.mjs";
import { eq, sql, desc, count, gte, and } from "drizzle-orm";
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
  "subscription_viewed", "error_occurred",
  "blog_view", "blog_post_view",
  "newsletter_signup_submit", "newsletter_signup_success", "newsletter_unsubscribe",
  "pricing_view", "checkout_start"
];

router.post("/event", async (req, res) => {
  try {
    const { eventType, event_name, event_category, page, path, metadata = {}, meta } = req.body;

    const resolvedName = event_name || eventType;
    const resolvedCategory = event_category || "general";
    const resolvedPath = path || page;
    const resolvedMeta = meta || metadata;

    if (!resolvedName || typeof resolvedName !== "string" || resolvedName.length > 100) {
      return badRequest(res, "Invalid event type/name");
    }

    const safeMetadata = {};
    if (resolvedMeta && typeof resolvedMeta === "object") {
      const metaStr = JSON.stringify(resolvedMeta);
      if (metaStr.length <= 4096) {
        Object.assign(safeMetadata, resolvedMeta);
      }
    }

    const userId = req.dbUserId || req.user?.id || null;
    const sessionId = req.headers["x-session-id"]?.substring(0, 64) || null;

    try {
      await db.insert(analyticsEvents).values({
        eventName: resolvedName.substring(0, 100),
        eventCategory: resolvedCategory.substring(0, 50),
        path: resolvedPath?.substring(0, 500) || null,
        meta: Object.keys(safeMetadata).length > 0 ? safeMetadata : null,
        userId,
        sessionId,
      });
    } catch (dbErr) {
      logger.debug("Analytics DB insert skipped", { error: dbErr.message });
    }

    logger.debug("Analytics event", {
      eventType: resolvedName,
      page: resolvedPath?.substring(0, 200),
      userId: userId || "anonymous",
    });

    return success(res, { ok: true, received: resolvedName });
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

    const userId = req.dbUserId || null;
    const sessionId = req.headers["x-session-id"]?.substring(0, 64) || null;

    try {
      await db.insert(analyticsEvents).values({
        eventName: "page_view",
        eventCategory: "navigation",
        path: page.substring(0, 500),
        meta: referrer ? { referrer: referrer.substring(0, 500) } : null,
        userId,
        sessionId,
      });
    } catch (dbErr) {
      logger.debug("Pageview DB insert skipped", { error: dbErr.message });
    }

    logger.debug("Page view", {
      page: page.substring(0, 200),
      referrer: referrer?.substring(0, 500),
      userId: userId || "anonymous",
    });

    return success(res, { ok: true });
  } catch (err) {
    logger.error("Pageview error", { error: err.message });
    return badRequest(res, "Failed to track pageview");
  }
});

/**
 * GET /api/analytics/admin/summary
 * Aggregated analytics dashboard for admins
 */
router.get("/admin/summary", async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Admin only" });
    }

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const topPages24h = await db
      .select({ path: analyticsEvents.path, views: count() })
      .from(analyticsEvents)
      .where(and(eq(analyticsEvents.eventName, "page_view"), gte(analyticsEvents.createdAt, last24h)))
      .groupBy(analyticsEvents.path)
      .orderBy(desc(count()))
      .limit(20);

    const topCTAs7d = await db
      .select({ eventName: analyticsEvents.eventName, path: analyticsEvents.path, clicks: count() })
      .from(analyticsEvents)
      .where(and(eq(analyticsEvents.eventCategory, "cta"), gte(analyticsEvents.createdAt, last7d)))
      .groupBy(analyticsEvents.eventName, analyticsEvents.path)
      .orderBy(desc(count()))
      .limit(20);

    const checkoutFunnel = {};
    for (const step of ["pricing_view", "checkout_start", "checkout_success", "checkout_cancel"]) {
      const [result] = await db
        .select({ total: count() })
        .from(analyticsEvents)
        .where(and(eq(analyticsEvents.eventName, step), gte(analyticsEvents.createdAt, last7d)));
      checkoutFunnel[step] = result?.total || 0;
    }

    const newsletterFunnel = {};
    for (const step of ["newsletter_view", "signup_attempt", "signup_success"]) {
      const [result] = await db
        .select({ total: count() })
        .from(analyticsEvents)
        .where(and(eq(analyticsEvents.eventName, step), gte(analyticsEvents.createdAt, last7d)));
      newsletterFunnel[step] = result?.total || 0;
    }

    const [totalEvents] = await db.select({ total: count() }).from(analyticsEvents);

    return res.json({ totalEvents: totalEvents?.total || 0, topPages24h, topCTAs7d, checkoutFunnel, newsletterFunnel });
  } catch (err) {
    logger.error("Analytics admin summary error", { error: err.message });
    return res.status(500).json({ error: "Failed to fetch analytics" });
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