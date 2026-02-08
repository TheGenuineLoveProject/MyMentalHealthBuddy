// server/routes/audit-logs.mjs
// Admin audit log explorer and export

import express from "express";
import { db } from "../db.mjs";
import { auditLog } from "../../shared/schema.mjs";
import { logger } from "../utils/logger.mjs";
import { desc, eq, and, gte, lte, like, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      userId,
      startDate,
      endDate,
      search,
    } = req.query;

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const conditions = [];

    if (action) {
      conditions.push(eq(auditLog.action, action));
    }
    if (userId) {
      conditions.push(eq(auditLog.userId, userId));
    }
    if (startDate) {
      conditions.push(gte(auditLog.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(auditLog.createdAt, new Date(endDate)));
    }
    if (search) {
      conditions.push(like(auditLog.action, `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [logs, countResult] = await Promise.all([
      db
        .select()
        .from(auditLog)
        .where(whereClause)
        .orderBy(desc(auditLog.createdAt))
        .limit(parseInt(limit, 10))
        .offset(offset),
      db
        .select({ count: sql`count(*)` })
        .from(auditLog)
        .where(whereClause),
    ]);

    const total = parseInt(countResult[0]?.count || 0, 10);

    res.json({
      ok: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          pages: Math.ceil(total / parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    logger.error("Audit logs fetch error", { error: error?.message || error });
    res.status(500).json({
      ok: false,
      error: { code: "AUDIT_FETCH_ERROR", message: "Failed to fetch audit logs" },
    });
  }
});

router.get("/actions", async (_req, res) => {
  try {
    const actions = await db
      .selectDistinct({ action: auditLog.action })
      .from(auditLog)
      .orderBy(auditLog.action);

    res.json({
      ok: true,
      data: actions.map((a) => a.action),
    });
  } catch (error) {
    logger.error("Audit actions fetch error", { error: error?.message || error });
    res.status(500).json({
      ok: false,
      error: { code: "ACTIONS_FETCH_ERROR", message: "Failed to fetch action types" },
    });
  }
});

router.get("/export", async (req, res) => {
  try {
    const { format = "json", startDate, endDate } = req.query;
    const conditions = [];

    if (startDate) {
      conditions.push(gte(auditLog.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(auditLog.createdAt, new Date(endDate)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const logs = await db
      .select()
      .from(auditLog)
      .where(whereClause)
      .orderBy(desc(auditLog.createdAt))
      .limit(10000);

    if (format === "csv") {
      const headers = ["id", "userId", "action", "details", "ipAddress", "createdAt"];
      const csv = [
        headers.join(","),
        ...logs.map((log) =>
          headers
            .map((h) => {
              const value = log[h];
              if (value === null || value === undefined) return "";
              if (typeof value === "object") return JSON.stringify(value).replace(/"/g, '""');
              return String(value).replace(/"/g, '""');
            })
            .map((v) => `"${v}"`)
            .join(",")
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=audit-logs-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=audit-logs-${Date.now()}.json`);
      res.json({ ok: true, data: logs, exportedAt: new Date().toISOString() });
    }
  } catch (error) {
    logger.error("Audit export error", { error: error?.message || error });
    res.status(500).json({
      ok: false,
      error: { code: "EXPORT_ERROR", message: "Failed to export audit logs" },
    });
  }
});

router.get("/stats", async (_req, res) => {
  try {
    const [totalResult, todayResult, actionCounts] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(auditLog),
      db
        .select({ count: sql`count(*)` })
        .from(auditLog)
        .where(gte(auditLog.createdAt, sql`CURRENT_DATE`)),
      db
        .select({
          action: auditLog.action,
          count: sql`count(*)`,
        })
        .from(auditLog)
        .groupBy(auditLog.action)
        .orderBy(desc(sql`count(*)`))
        .limit(10),
    ]);

    res.json({
      ok: true,
      data: {
        total: parseInt(totalResult[0]?.count || 0, 10),
        today: parseInt(todayResult[0]?.count || 0, 10),
        topActions: actionCounts.map((a) => ({
          action: a.action,
          count: parseInt(a.count, 10),
        })),
      },
    });
  } catch (error) {
    logger.error("Audit stats error", { error: error?.message || error });
    res.status(500).json({
      ok: false,
      error: { code: "STATS_ERROR", message: "Failed to fetch audit stats" },
    });
  }
});

export default router;
