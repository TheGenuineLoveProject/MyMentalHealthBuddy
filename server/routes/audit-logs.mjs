// server/routes/audit-logs.mjs
// Admin audit log explorer and export

import express from "express";
import { db } from "../db.mjs";
import { auditLogs } from "../../shared/schema.mjs";
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
      conditions.push(eq(auditLogs.action, action));
    }
    if (userId) {
      conditions.push(eq(auditLogs.userId, userId));
    }
    if (startDate) {
      conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(auditLogs.createdAt, new Date(endDate)));
    }
    if (search) {
      conditions.push(like(auditLogs.action, `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [logs, countResult] = await Promise.all([
      db
        .select()
        .from(auditLogs)
        .where(whereClause)
        .orderBy(desc(auditLogs.createdAt))
        .limit(parseInt(limit, 10))
        .offset(offset),
      db
        .select({ count: sql`count(*)` })
        .from(auditLogs)
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
    console.error("Audit logs fetch error:", error);
    res.status(500).json({
      ok: false,
      error: { code: "AUDIT_FETCH_ERROR", message: "Failed to fetch audit logs" },
    });
  }
});

router.get("/actions", async (_req, res) => {
  try {
    const actions = await db
      .selectDistinct({ action: auditLogs.action })
      .from(auditLogs)
      .orderBy(auditLogs.action);

    res.json({
      ok: true,
      data: actions.map((a) => a.action),
    });
  } catch (error) {
    console.error("Audit actions fetch error:", error);
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
      conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(auditLogs.createdAt, new Date(endDate)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const logs = await db
      .select()
      .from(auditLogs)
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt))
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
    console.error("Audit export error:", error);
    res.status(500).json({
      ok: false,
      error: { code: "EXPORT_ERROR", message: "Failed to export audit logs" },
    });
  }
});

router.get("/stats", async (_req, res) => {
  try {
    const [totalResult, todayResult, actionCounts] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(auditLogs),
      db
        .select({ count: sql`count(*)` })
        .from(auditLogs)
        .where(gte(auditLogs.createdAt, sql`CURRENT_DATE`)),
      db
        .select({
          action: auditLogs.action,
          count: sql`count(*)`,
        })
        .from(auditLogs)
        .groupBy(auditLogs.action)
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
    console.error("Audit stats error:", error);
    res.status(500).json({
      ok: false,
      error: { code: "STATS_ERROR", message: "Failed to fetch audit stats" },
    });
  }
});

export default router;
