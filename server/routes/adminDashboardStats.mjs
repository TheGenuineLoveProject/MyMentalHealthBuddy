import { requireAuth } from "../middleware/auth.mjs";
import requireAdmin from "../middleware/requireAdmin.mjs";

// Counts only: never select account identifiers, publishing content, or event metadata.
// Definitions follow shared/schema.mjs and billing.mjs's expiry-aware local plan rule.
export const DASHBOARD_COUNTS_SQL = `
SELECT
  (SELECT COUNT(*) FROM users) AS "users",
  (SELECT COUNT(*) FROM users WHERE role = 'admin') AS "adminCount",
  (SELECT COUNT(*) FROM users WHERE subscription_status = 'pro'
    AND (subscription_expires_at IS NULL OR subscription_expires_at > $1)) AS "proUsers",
  (SELECT COUNT(*) FROM users WHERE COALESCE(subscription_status, 'free') = 'free') AS "freeUsers",
  (SELECT COUNT(*) FROM blog_posts WHERE content_type = 'blog_post') AS "blogPosts",
  (SELECT COUNT(*) FROM blog_posts WHERE content_type = 'blog_post' AND status = 'published') AS "publishedBlogs",
  (SELECT COUNT(*) FROM social_posts) AS "socialPosts",
  (SELECT COUNT(*) FROM social_posts WHERE status = 'draft') AS "socialDrafts",
  (SELECT COUNT(*) FROM social_campaigns WHERE status = 'active') AS "campaigns",
  (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active') AS "leads"
`;

export const COUNT_KEYS = [
  "users", "adminCount", "proUsers", "freeUsers", "blogPosts", "publishedBlogs",
  "socialPosts", "socialDrafts", "campaigns", "leads",
];

async function queryDatabase(text, values) {
  // Lazy: importing this route never initializes a DB or runs schema bootstrap.
  const { pool } = await import("../db/connection.mjs");
  return pool.query(text, values);
}

export function registerDashboardStats(router, {
  query = queryDatabase,
  now = () => new Date(),
  uptime = () => process.uptime(),
} = {}) {
  router.get("/dashboard-stats",
    (_req, res, next) => { res.set("Cache-Control", "no-store"); next(); },
    requireAuth, requireAdmin, async (_req, res) => {
      try {
        const measuredAt = now().toISOString();
        const result = await query(DASHBOARD_COUNTS_SQL, [measuredAt]);
        if (result.rows?.length !== 1) throw new Error("Invalid aggregate result");
        const data = {};
        for (const key of COUNT_KEYS) {
          const raw = result.rows[0][key];
          if (!(typeof raw === "number" || (typeof raw === "string" && /^\d+$/.test(raw)))) {
            throw new Error("Invalid count");
          }
          const value = Number(raw);
          if (!Number.isSafeInteger(value) || value < 0) throw new Error("Invalid count");
          data[key] = value;
        }
        data.uptimeSeconds = Math.floor(uptime());
        if (!Number.isSafeInteger(data.uptimeSeconds) || data.uptimeSeconds < 0) throw new Error("Invalid uptime");
        return res.json({ ok: true, data: { ...data, measuredAt } });
      } catch {
        // Never return SQL, database details, partial counts, or synthetic zeroes.
        return res.status(503).json({ ok: false, message: "Dashboard statistics unavailable." });
      }
    });
}