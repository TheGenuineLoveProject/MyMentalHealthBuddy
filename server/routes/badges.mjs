import express from "express";
import { db } from "../db.mjs";
import { badges, moods, journals } from "../../shared/schema.mjs";
import { eq, and, sql } from "drizzle-orm";

const router = express.Router();

const BADGE_TRIGGERS = {
  "first-entry": (stats) => stats.totalEntries >= 1,
  "streak-3": (stats) => stats.currentStreak >= 3,
  "streak-7": (stats) => stats.currentStreak >= 7,
  "streak-14": (stats) => stats.currentStreak >= 14,
  "streak-30": (stats) => stats.currentStreak >= 30,
  "streak-100": (stats) => stats.currentStreak >= 100,
  "gratitude-entry": (stats) => stats.hasGratitude,
  "journal-10": (stats) => stats.totalJournals >= 10,
  "journal-50": (stats) => stats.totalJournals >= 50,
  "moods-25": (stats) => stats.totalMoods >= 25,
  "moods-100": (stats) => stats.totalMoods >= 100,
  "weekly-wins": (stats) => stats.weeklyComplete,
};

router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated?.() || !req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userBadges = await db
      .select()
      .from(badges)
      .where(eq(badges.userId, req.user.id));

    res.json(userBadges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ error: "Failed to fetch badges" });
  }
});

router.post("/check", async (req, res) => {
  try {
    if (!req.isAuthenticated?.() || !req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    const [userMoods, userJournals, existingBadges] = await Promise.all([
      db.select().from(moods).where(eq(moods.userId, userId)),
      db.select().from(journals).where(eq(journals.userId, userId)),
      db.select().from(badges).where(eq(badges.userId, userId))
    ]);

    const existingBadgeIds = new Set(existingBadges.map(b => b.badgeId));

    const hasGratitude = userMoods.some(m => 
      m.emotion === "grateful" || 
      (m.content && m.content.toLowerCase().includes("grateful"))
    ) || userJournals.some(j => 
      j.text && j.text.toLowerCase().includes("grateful")
    );

    const stats = {
      totalMoods: userMoods.length,
      totalJournals: userJournals.length,
      totalEntries: userMoods.length + userJournals.length,
      currentStreak: calculateStreak(userMoods, userJournals),
      hasGratitude,
      weeklyComplete: checkWeeklyComplete(userMoods, userJournals)
    };

    const newBadges = [];

    for (const [badgeId, checkFn] of Object.entries(BADGE_TRIGGERS)) {
      if (!existingBadgeIds.has(badgeId) && checkFn(stats)) {
        newBadges.push({
          userId,
          badgeId
        });
      }
    }

    if (newBadges.length > 0) {
      await db.insert(badges).values(newBadges);
    }

    const allBadges = await db
      .select()
      .from(badges)
      .where(eq(badges.userId, userId));

    res.json({ 
      badges: allBadges, 
      newBadges: newBadges.map(b => b.badgeId) 
    });
  } catch (error) {
    console.error("Error checking badges:", error);
    res.status(500).json({ error: "Failed to check badges" });
  }
});

function calculateStreak(moods, journals) {
  const allDates = new Set([
    ...moods.map(m => new Date(m.createdAt).toDateString()),
    ...journals.map(j => new Date(j.createdAt).toDateString())
  ]);

  if (allDates.size === 0) return 0;

  const sortedDates = Array.from(allDates)
    .map(d => new Date(d))
    .sort((a, b) => b - a);

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  if (sortedDates[0].toDateString() !== today && sortedDates[0].toDateString() !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = Math.round((sortedDates[i] - sortedDates[i + 1]) / (24 * 60 * 60 * 1000));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function checkWeeklyComplete(moods, journals) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const daysWithEntries = new Set([
    ...moods.filter(m => new Date(m.createdAt) >= oneWeekAgo).map(m => new Date(m.createdAt).toDateString()),
    ...journals.filter(j => new Date(j.createdAt) >= oneWeekAgo).map(j => new Date(j.createdAt).toDateString())
  ]);

  return daysWithEntries.size >= 7;
}

export default router;
