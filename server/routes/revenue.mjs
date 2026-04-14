import express from "express";
import { sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import db from "../db/client.mjs";
import { success, serverError } from "../utils/response.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/summary", async (req, res) => {
  try {
    const totalUsersResult = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
    const totalUsers = parseInt(totalUsersResult.rows?.[0]?.count || "0", 10);

    const paidUsersResult = await db.execute(sql`
      SELECT subscription_status, COUNT(*) as count FROM users 
      WHERE subscription_status IN ('starter', 'pro', 'elite')
      GROUP BY subscription_status
    `);

    const planBreakdown = { free: 0, starter: 0, pro: 0, elite: 0 };
    let totalPaid = 0;
    for (const row of paidUsersResult.rows || []) {
      planBreakdown[row.subscription_status] = parseInt(row.count, 10);
      totalPaid += parseInt(row.count, 10);
    }
    planBreakdown.free = totalUsers - totalPaid;

    const estimatedMRR =
      planBreakdown.starter * 0 +
      planBreakdown.pro * 12.99 +
      planBreakdown.elite * 29.99;

    return success(res, {
      totalUsers,
      totalPaid,
      planBreakdown,
      estimatedMRR: Math.round(estimatedMRR * 100) / 100,
      conversionRate: totalUsers > 0 ? Math.round((totalPaid / totalUsers) * 10000) / 100 : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error("Revenue summary error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/intelligence", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const newUsers30d = await db.execute(sql`
      SELECT COUNT(*) as count FROM users WHERE created_at >= ${thirtyDaysAgo}
    `);
    const newUsers7d = await db.execute(sql`
      SELECT COUNT(*) as count FROM users WHERE created_at >= ${sevenDaysAgo}
    `);

    const paidLast30d = await db.execute(sql`
      SELECT COUNT(*) as count FROM users 
      WHERE subscription_status IN ('starter', 'pro', 'elite') 
      AND created_at >= ${thirtyDaysAgo}
    `);

    const activeAiUsers7d = await db.execute(sql`
      SELECT COUNT(DISTINCT user_id) as count FROM ai_messages 
      WHERE created_at >= ${sevenDaysAgo}
    `);

    return success(res, {
      growth: {
        newUsers30d: parseInt(newUsers30d.rows?.[0]?.count || "0", 10),
        newUsers7d: parseInt(newUsers7d.rows?.[0]?.count || "0", 10),
        newPaidUsers30d: parseInt(paidLast30d.rows?.[0]?.count || "0", 10),
      },
      engagement: {
        activeAiUsers7d: parseInt(activeAiUsers7d.rows?.[0]?.count || "0", 10),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error("Revenue intelligence error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/recommendations", async (req, res) => {
  try {
    const totalUsersResult = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
    const totalUsers = parseInt(totalUsersResult.rows?.[0]?.count || "0", 10);

    const paidResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM users 
      WHERE subscription_status IN ('starter', 'pro', 'elite')
    `);
    const paidUsers = parseInt(paidResult.rows?.[0]?.count || "0", 10);
    const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

    const recommendations = [];

    if (conversionRate < 5) {
      recommendations.push({
        priority: "high",
        category: "conversion",
        title: "Improve Free-to-Paid Conversion",
        description: "Conversion rate is below 5%. Consider adding a trial period or highlighting Starter plan benefits more prominently.",
      });
    }

    if (totalUsers < 100) {
      recommendations.push({
        priority: "medium",
        category: "acquisition",
        title: "Focus on User Acquisition",
        description: "User base is still small. Prioritize organic growth through content marketing and SEO.",
      });
    }

    recommendations.push({
      priority: "low",
      category: "retention",
      title: "Monitor Engagement Metrics",
      description: "Track AI chat usage and journal activity to identify at-risk users before they churn.",
    });

    return success(res, {
      recommendations,
      context: { totalUsers, paidUsers, conversionRate: Math.round(conversionRate * 100) / 100 },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error("Revenue recommendations error", { error: err.message });
    return serverError(res, err);
  }
});

export default router;
