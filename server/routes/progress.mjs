import express from "express";
import { db } from "../db/connection.mjs";
import { journals, moods, gratitudeEntries, userAchievements, users } from "../../shared/schema.mjs";
import { eq, sql, and, gte, desc, count } from "drizzle-orm";

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.dbUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.get("/stats", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;

    const totalEntriesResult = await db
      .select({ count: count() })
      .from(journals)
      .where(eq(journals.userId, userId));
    
    const totalEntries = Number(totalEntriesResult[0]?.count || 0);

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const weeklyResult = await db
      .select({ count: count() })
      .from(journals)
      .where(and(
        eq(journals.userId, userId),
        gte(journals.createdAt, weekAgo)
      ));
    
    const weeklyEntries = Number(weeklyResult[0]?.count || 0);

    const monthlyResult = await db
      .select({ count: count() })
      .from(journals)
      .where(and(
        eq(journals.userId, userId),
        gte(journals.createdAt, monthAgo)
      ));
    
    const monthlyEntries = Number(monthlyResult[0]?.count || 0);

    const recentEntries = await db
      .select({ createdAt: journals.createdAt })
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt))
      .limit(100);

    let currentStreak = 0;
    let longestStreak = 0;
    
    if (recentEntries.length > 0) {
      const entryDates = new Set(
        recentEntries.map(e => new Date(e.createdAt).toDateString())
      );
      
      const today = new Date();
      let checkDate = new Date(today);
      let streak = 0;
      
      while (entryDates.has(checkDate.toDateString())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      if (!entryDates.has(today.toDateString())) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (entryDates.has(yesterday.toDateString())) {
          checkDate = new Date(yesterday);
          streak = 0;
          while (entryDates.has(checkDate.toDateString())) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }
      }
      
      currentStreak = streak;

      const sortedDates = Array.from(entryDates)
        .map(d => new Date(d))
        .sort((a, b) => a - b);
      
      let tempStreak = 1;
      longestStreak = 1;
      
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    }

    res.json({
      totalEntries,
      currentStreak,
      longestStreak,
      weeklyEntries,
      monthlyEntries
    });
  } catch (error) {
    console.error("Error fetching progress stats:", error);
    res.status(500).json({ error: "Failed to fetch progress stats" });
  }
});

router.get("/achievements", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;

    const totalEntriesResult = await db
      .select({ count: count() })
      .from(journals)
      .where(eq(journals.userId, userId));
    const totalEntries = Number(totalEntriesResult[0]?.count || 0);

    const recentEntries = await db
      .select({ createdAt: journals.createdAt })
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt))
      .limit(100);

    const entryDates = new Set(
      recentEntries.map(e => new Date(e.createdAt).toDateString())
    );
    
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (entryDates.has(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const moodLogsResult = await db
      .select({ emotion: moods.emotion })
      .from(moods)
      .where(eq(moods.userId, userId));
    
    const emotionCounts = {};
    moodLogsResult.forEach(log => {
      if (log.emotion) {
        emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
      }
    });
    const uniqueEmotionsLogged = Object.keys(emotionCounts).filter(e => emotionCounts[e] >= 3).length;

    const gratitudeResult = await db
      .select({ count: count() })
      .from(gratitudeEntries)
      .where(eq(gratitudeEntries.userId, userId));
    const gratitudeCount = Number(gratitudeResult[0]?.count || 0);

    const morningEntries = recentEntries.filter(e => {
      const hour = new Date(e.createdAt).getHours();
      return hour >= 5 && hour < 12;
    }).length;

    const eveningEntries = recentEntries.filter(e => {
      const hour = new Date(e.createdAt).getHours();
      return hour >= 18 || hour < 5;
    }).length;

    const achievements = [];

    if (totalEntries >= 1) achievements.push("lotus_awakens");
    if (currentStreak >= 7) achievements.push("inner_light");
    if (uniqueEmotionsLogged >= 3) achievements.push("emotional_alchemist");
    if (currentStreak >= 14) achievements.push("calm_keeper");
    if (gratitudeCount >= 21) achievements.push("gratitude_guardian");
    if (currentStreak >= 21) achievements.push("deep_diver");
    if (eveningEntries >= 10) achievements.push("moon_child");
    if (morningEntries >= 10) achievements.push("sunrise_seeker");

    res.json({
      achievements,
      stats: {
        totalEntries,
        currentStreak,
        uniqueEmotions: uniqueEmotionsLogged,
        gratitudeCount,
        morningEntries,
        eveningEntries
      }
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

export default router;
