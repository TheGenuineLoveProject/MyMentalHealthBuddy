import { Router } from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function requireAdminToken(req, res, next) {
  const token = req.headers["x-admin-token"] || req.query.token;
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

router.get("/check", requireAdminToken, async (_req, res) => {
  const results = {
    timestamp: new Date().toISOString(),
    checks: {},
    overall: "pass",
  };

  results.checks.stripeSecretKey = {
    status: !!process.env.STRIPE_SECRET_KEY ? "pass" : "fail",
    detail: process.env.STRIPE_SECRET_KEY ? "Present" : "Missing STRIPE_SECRET_KEY",
  };

  results.checks.stripeWebhookSecret = {
    status: !!process.env.STRIPE_WEBHOOK_SECRET ? "pass" : "fail",
    detail: process.env.STRIPE_WEBHOOK_SECRET ? "Present" : "Missing STRIPE_WEBHOOK_SECRET",
  };

  results.checks.databaseUrl = {
    status: !!process.env.DATABASE_URL ? "pass" : "fail",
    detail: process.env.DATABASE_URL ? "Present" : "Missing DATABASE_URL",
  };

  try {
    await db.execute(sql`SELECT 1`);
    results.checks.databaseConnection = { status: "pass", detail: "Connected" };
  } catch (err) {
    results.checks.databaseConnection = { status: "fail", detail: err.message };
  }

  try {
    const colCheck = await db.execute(sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'subscription_status'
    `);
    if (colCheck.rows?.length > 0) {
      results.checks.subscriptionStatusColumn = {
        status: "pass",
        detail: {
          type: colCheck.rows[0].data_type,
          default: colCheck.rows[0].column_default,
        },
      };
    } else {
      results.checks.subscriptionStatusColumn = {
        status: "fail",
        detail: "Column subscription_status not found in users table",
      };
    }
  } catch (err) {
    results.checks.subscriptionStatusColumn = { status: "fail", detail: err.message };
  }

  try {
    const statusCheck = await db.execute(sql`
      SELECT subscription_status, COUNT(*) as count 
      FROM users 
      GROUP BY subscription_status
    `);
    const statuses = statusCheck.rows?.map(r => r.subscription_status) || [];
    const invalidStatuses = statuses.filter(s => s !== "free" && s !== "pro" && s !== null);
    results.checks.subscriptionStatusIntegrity = {
      status: invalidStatuses.length === 0 ? "pass" : "warn",
      detail: {
        distribution: statusCheck.rows,
        invalidValues: invalidStatuses,
      },
    };
  } catch (err) {
    results.checks.subscriptionStatusIntegrity = { status: "fail", detail: err.message };
  }

  try {
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables WHERE table_name = 'webhook_events'
      ) as exists
    `);
    results.checks.webhookEventsTable = {
      status: tableCheck.rows?.[0]?.exists ? "pass" : "fail",
      detail: tableCheck.rows?.[0]?.exists ? "Table exists" : "Table missing",
    };
  } catch (err) {
    results.checks.webhookEventsTable = { status: "fail", detail: err.message };
  }

  const failedChecks = Object.values(results.checks).filter(c => c.status === "fail");
  if (failedChecks.length > 0) {
    results.overall = "fail";
  }

  logger.info("Deployment readiness check completed", { overall: results.overall });
  res.json(results);
});

export default router;
