// server/routes/streaks.mjs
// Minimal streak API for the launch surface (/start).
// Reads/writes the existing userProgress table; no schema change needed.

import express from "express";
import { db } from "../db/connection.mjs";
import { userProgress } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";
import {
  computeUtcDaysAway,
  isPreviousUtcDay,
  isSameUtcDay,
  withUserProgressLock,
} from "../services/userProgressLock.mjs";

const router = express.Router();

function getAuthedUserId(req) {
  return req.session?.user?.id || req.user?.id || null;
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
      daysAway: computeUtcDaysAway(row.lastActivityDate, new Date()),
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
    const result = await withUserProgressLock(
      userId,
      async (tx) => {
        const now = new Date();

        const [existing] = await tx
          .select()
          .from(userProgress)
          .where(eq(userProgress.userId, userId))
          .limit(1);

        if (!existing) {
          const [created] = await tx
            .insert(userProgress)
            .values({
              userId,
              currentStreak: 1,
              longestStreak: 1,
              lastActivityDate: now,
              toolsUsedToday: 1,
              totalToolsUsed: 1,
            })
            .returning();

          return {
            authenticated: true,
            currentStreak: created.currentStreak,
            longestStreak: created.longestStreak,
            toolsUsedToday: created.toolsUsedToday,
            incremented: true,
            daysAway: 0,
          };
        }

        const last = existing.lastActivityDate;
        const sameDay = isSameUtcDay(last, now);

        let nextStreak = existing.currentStreak || 0;
        let nextToolsToday;

        if (sameDay) {
          nextToolsToday = (existing.toolsUsedToday || 0) + 1;
        } else if (isPreviousUtcDay(last, now)) {
          nextStreak += 1;
          nextToolsToday = 1;
        } else {
          nextStreak = 1;
          nextToolsToday = 1;
        }

        const nextLongest = Math.max(
          existing.longestStreak || 0,
          nextStreak,
        );

        const [updated] = await tx
          .update(userProgress)
          .set({
            currentStreak: nextStreak,
            longestStreak: nextLongest,
            lastActivityDate: now,
            toolsUsedToday: nextToolsToday,
            totalToolsUsed: sql`${userProgress.totalToolsUsed} + 1`,
            updatedAt: now,
          })
          .where(eq(userProgress.userId, userId))
          .returning();

        return {
          authenticated: true,
          currentStreak: updated.currentStreak,
          longestStreak: updated.longestStreak,
          toolsUsedToday: updated.toolsUsedToday,
          incremented: !sameDay,
          daysAway: computeUtcDaysAway(last, now),
        };
      },
    );

    return res.json(result);
  } catch (err) {
    logger.error("streak.checkin failed", {
      error: err.message,
      userId,
    });

    return res.status(500).json({
      error: "internal_error",
    });
  }
});

export default router;
