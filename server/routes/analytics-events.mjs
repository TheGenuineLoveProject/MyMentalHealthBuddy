import { Router } from "express";
import { db } from "../db.mjs";
import { analyticsEvents } from "../../shared/schema.mjs";
import { sql, desc, count, eq, gte, and } from "drizzle-orm";

const router = Router();

router.post("/event", async (req, res) => {
  try {
    const { event_name, event_category, path, meta } = req.body;

    if (!event_name || typeof event_name !== "string" || event_name.length > 100) {
      return res.status(400).json({ error: "Invalid event_name" });
    }
    if (!event_category || typeof event_category !== "string" || event_category.length > 50) {
      return res.status(400).json({ error: "Invalid event_category" });
    }
    if (path && (typeof path !== "string" || path.length > 500)) {
      return res.status(400).json({ error: "Invalid path" });
    }
    if (meta && JSON.stringify(meta).length > 4096) {
      return res.status(400).json({ error: "Meta payload too large" });
    }

    const userId = req.user?.id || null;
    const sessionId = req.headers["x-session-id"]?.substring(0, 64) || null;

    await db.insert(analyticsEvents).values({
      eventName: event_name,
      eventCategory: event_category,
      path: path || null,
      meta: meta || null,
      userId,
      sessionId,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Analytics event error:", err.message);
    return res.status(500).json({ error: "Failed to record event" });
  }
});

router.get("/admin/summary", async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Admin only" });
    }

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const topPages24h = await db
      .select({
        path: analyticsEvents.path,
        views: count(),
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventName, "page_view"),
          gte(analyticsEvents.createdAt, last24h)
        )
      )
      .groupBy(analyticsEvents.path)
      .orderBy(desc(count()))
      .limit(20);

    const topCTAs7d = await db
      .select({
        eventName: analyticsEvents.eventName,
        path: analyticsEvents.path,
        clicks: count(),
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventCategory, "cta"),
          gte(analyticsEvents.createdAt, last7d)
        )
      )
      .groupBy(analyticsEvents.eventName, analyticsEvents.path)
      .orderBy(desc(count()))
      .limit(20);

    const checkoutFunnel = {};
    for (const step of ["pricing_view", "checkout_start", "checkout_success", "checkout_cancel"]) {
      const [result] = await db
        .select({ total: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventName, step),
            gte(analyticsEvents.createdAt, last7d)
          )
        );
      checkoutFunnel[step] = result?.total || 0;
    }

    const newsletterFunnel = {};
    for (const step of ["newsletter_view", "signup_attempt", "signup_success"]) {
      const [result] = await db
        .select({ total: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventName, step),
            gte(analyticsEvents.createdAt, last7d)
          )
        );
      newsletterFunnel[step] = result?.total || 0;
    }

    const [totalEvents] = await db
      .select({ total: count() })
      .from(analyticsEvents);

    return res.json({
      totalEvents: totalEvents?.total || 0,
      topPages24h,
      topCTAs7d,
      checkoutFunnel,
      newsletterFunnel,
    });
  } catch (err) {
    console.error("Analytics summary error:", err.message);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "analytics-events", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
