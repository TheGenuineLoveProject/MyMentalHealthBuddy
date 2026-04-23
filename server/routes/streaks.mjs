// server/routes/streaks.mjs
// Minimal streak API for the launch surface (/start).
// Reads/writes the existing userProgress table; no schema change needed.

import express from "express";
import { db } from "../db/connection.mjs";
import { userProgress } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

function getAuthedUserId(req) {
  return req.session?.user?.id || req.user?.id || null;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  const da = new Date(a);
  const db_ = new Date(b);
  return (
    da.getUTCFullYear() === db_.getUTCFullYear() &&
    da.getUTCMonth() === db_.getUTCMonth() &&
    da.getUTCDate() === db_.getUTCDate()
  );
}

function isYesterday(prev, today) {
  if (!prev) return false;
  const p = new Date(prev);
  const t = new Date(today);
  const diff = Math.floor((Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) -
                           Date.UTC(p.getUTCFullYear(), p.getUTCMonth(), p.getUTCDate())) / 86400000);
  return diff === 1;
}

function computeDaysAway(last, now) {
  if (!last) return 0;
  const p = new Date(last);
  const t = new Date(now);
  const diff = Math.floor((Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) -
                           Date.UTC(p.getUTCFullYear(), p.getUTCMonth(), p.getUTCDate())) / 86400000);
  return Math.max(0, diff);
}

router.get("/me", async (req, res) => {
  const userId = getAuthedUserId(req);
  if (!userId) {
    return res.json({ authenticated: false, currentStreak: 0, longestStreak: 0, daysAway: 0 });
  }
  try {
    const rows = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
    const row = rows[0];
    if (!row) {
      return res.json({
        authenticated: true,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        toolsUsedToday: 0,
        daysAway: 0,
      });
    }
    res.json({
      authenticated: true,
      currentStreak: row.currentStreak,
      longestStreak: row.longestStreak,
      lastActivityDate: row.lastActivityDate,
      toolsUsedToday: row.toolsUsedToday,
      daysAway: computeDaysAway(row.lastActivityDate, new Date()),
    });
  } catch (err) {
    logger.error("streak.me failed", { error: err.message });
    res.status(500).json({ error: "internal_error" });
  }
});

router.post("/checkin", async (req, res) => {
  const userId = getAuthedUserId(req);
  if (!userId) {
    return res.status(401).json({
      authenticated: false,
      message: "Sign in to track your streak.",
    });
  }
  try {
    const now = new Date();
    const rows = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
    const existing = rows[0];

    if (!existing) {
      await db.insert(userProgress).values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: now,
        toolsUsedToday: 1,
        totalToolsUsed: 1,
      });
      return res.json({ authenticated: true, currentStreak: 1, longestStreak: 1, incremented: true, daysAway: 0 });
    }

    const last = existing.lastActivityDate;
    let nextStreak = existing.currentStreak;
    let nextToolsToday = existing.toolsUsedToday;

    if (isSameDay(last, now)) {
      nextToolsToday = (existing.toolsUsedToday || 0) + 1;
    } else if (isYesterday(last, now)) {
      nextStreak = (existing.currentStreak || 0) + 1;
      nextToolsToday = 1;
    } else {
      nextStreak = 1;
      nextToolsToday = 1;
    }

    const nextLongest = Math.max(existing.longestStreak || 0, nextStreak);

    await db.update(userProgress)
      .set({
        currentStreak: nextStreak,
        longestStreak: nextLongest,
        lastActivityDate: now,
        toolsUsedToday: nextToolsToday,
        totalToolsUsed: sql`${userProgress.totalToolsUsed} + 1`,
        updatedAt: now,
      })
      .where(eq(userProgress.userId, userId));

    res.json({
      authenticated: true,
      currentStreak: nextStreak,
      longestStreak: nextLongest,
      toolsUsedToday: nextToolsToday,
      incremented: !isSameDay(last, now),
      daysAway: computeDaysAway(last, now),
    });
  } catch (err) {
    logger.error("streak.checkin failed", { error: err.message });
    res.status(500).json({ error: "internal_error" });
  }
});

export default router;
