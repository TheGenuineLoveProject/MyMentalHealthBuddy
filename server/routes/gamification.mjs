import express from "express";
import { db } from "../db/connection.mjs";
import { userProgress, dailyQuests, toolSessions, achievements, userAchievements } from "../../shared/schema.mjs";
import { eq, and, gte, sql } from "drizzle-orm";
import { authGuard } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

const XP_PER_LEVEL = 500;
const BASE_TOOL_XP = 25;

const QUEST_TEMPLATES = [
  { type: "breathing", title: "Breathe Deep", description: "Complete 1 breathing exercise", target: 1, xp: 50 },
  { type: "meditation", title: "Inner Peace", description: "Complete a meditation session", target: 1, xp: 75 },
  { type: "journal", title: "Express Yourself", description: "Write a journal entry", target: 1, xp: 50 },
  { type: "mood", title: "Check In", description: "Log your mood", target: 1, xp: 40 },
  { type: "any_tool", title: "Wellness Explorer", description: "Use any 3 wellness tools", target: 3, xp: 100 },
  { type: "streak", title: "Consistency King", description: "Maintain your streak today", target: 1, xp: 60 },
];

router.use(authGuard);

function calculateLevel(totalXp) {
  let level = 1;
  let xpNeeded = XP_PER_LEVEL;
  let accumulatedXp = 0;
  
  while (accumulatedXp + xpNeeded <= totalXp) {
    accumulatedXp += xpNeeded;
    level++;
    xpNeeded = XP_PER_LEVEL * level;
  }
  
  return level;
}

router.get("/progress", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    let [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);

    if (!progress) {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          totalXp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          toolsUsedToday: 0,
          totalToolsUsed: 0,
          totalSessionMinutes: 0,
        })
        .returning();
      progress = newProgress;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayStats] = await db
      .select({
        toolsUsed: sql`count(*)`,
        xpEarned: sql`coalesce(sum(${toolSessions.xpEarned}), 0)`,
      })
      .from(toolSessions)
      .where(and(
        eq(toolSessions.userId, userId),
        gte(toolSessions.completedAt, today)
      ));

    res.json({
      ...progress,
      todayStats: {
        toolsUsed: Number(todayStats?.toolsUsed || 0),
        xpEarned: Number(todayStats?.xpEarned || 0),
      },
    });
  } catch (error) {
    logger.error("Error fetching progress", { error: error.message, userId: req.user?.id });
    res.status(500).json({ ok: false, error: "Failed to fetch progress" });
  }
});

router.post("/record-session", async (req, res) => {
  try {
    const userId = req.user?.id;
    const { toolName, durationSeconds = 60, metadata } = req.body;

    if (!userId || !toolName) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const timeBonus = Math.floor(durationSeconds / 60) * 5;
    const xpEarned = BASE_TOOL_XP + timeBonus;

    await db.insert(toolSessions).values({
      userId,
      toolName,
      durationSeconds,
      xpEarned,
      metadata: metadata || null,
    });

    let [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);

    if (!progress) {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          totalXp: xpEarned,
          level: 1,
          currentStreak: 1,
          longestStreak: 1,
          toolsUsedToday: 1,
          totalToolsUsed: 1,
          totalSessionMinutes: Math.ceil(durationSeconds / 60),
          lastActivityDate: new Date(),
        })
        .returning();
      progress = newProgress;
    } else {
      const newTotalXp = progress.totalXp + xpEarned;
      const newLevel = calculateLevel(newTotalXp);
      const leveledUp = newLevel > progress.level;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastActivity = progress.lastActivityDate ? new Date(progress.lastActivityDate) : null;
      lastActivity?.setHours(0, 0, 0, 0);

      let newStreak = progress.currentStreak;
      if (!lastActivity || lastActivity.getTime() < today.getTime()) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActivity && lastActivity.getTime() === yesterday.getTime()) {
          newStreak = progress.currentStreak + 1;
        } else if (!lastActivity || lastActivity.getTime() < yesterday.getTime()) {
          newStreak = 1;
        }
      }

      const [updatedProgress] = await db
        .update(userProgress)
        .set({
          totalXp: newTotalXp,
          level: newLevel,
          currentStreak: newStreak,
          longestStreak: Math.max(progress.longestStreak, newStreak),
          toolsUsedToday: progress.toolsUsedToday + 1,
          totalToolsUsed: progress.totalToolsUsed + 1,
          totalSessionMinutes: progress.totalSessionMinutes + Math.ceil(durationSeconds / 60),
          lastActivityDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userProgress.userId, userId))
        .returning();

      return res.json({
        ok: true,
        xpEarned,
        newTotalXp,
        leveledUp,
        newLevel,
        currentStreak: newStreak,
      });
    }

    res.json({
      ok: true,
      xpEarned,
      newTotalXp: progress.totalXp,
      leveledUp: false,
      newLevel: progress.level,
      currentStreak: progress.currentStreak,
    });
  } catch (error) {
    logger.error("Error recording session", { error: error.message, userId: req.user?.id });
    res.status(500).json({ ok: false, error: "Failed to record session" });
  }
});

router.get("/quests", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let quests = await db
      .select()
      .from(dailyQuests)
      .where(and(
        eq(dailyQuests.userId, userId),
        gte(dailyQuests.expiresAt, today)
      ));

    if (quests.length === 0) {
      const selectedQuests = QUEST_TEMPLATES
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const newQuests = await Promise.all(
        selectedQuests.map(async (template) => {
          const [quest] = await db
            .insert(dailyQuests)
            .values({
              userId,
              questType: template.type,
              title: template.title,
              description: template.description,
              targetCount: template.target,
              currentCount: 0,
              xpReward: template.xp,
              isCompleted: 0,
              expiresAt: tomorrow,
            })
            .returning();
          return quest;
        })
      );

      quests = newQuests;
    }

    res.json({ ok: true, quests });
  } catch (error) {
    logger.error("Error fetching quests", { error: error.message, userId: req.user?.id });
    res.status(500).json({ ok: false, error: "Failed to fetch quests" });
  }
});

router.post("/complete-quest", async (req, res) => {
  try {
    const userId = req.user?.id;
    const { questId } = req.body;

    if (!userId || !questId) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const [quest] = await db
      .select()
      .from(dailyQuests)
      .where(and(
        eq(dailyQuests.id, questId),
        eq(dailyQuests.userId, userId)
      ))
      .limit(1);

    if (!quest) {
      return res.status(404).json({ ok: false, error: "Quest not found" });
    }

    if (quest.isCompleted) {
      return res.json({ ok: true, message: "Quest already completed" });
    }

    await db
      .update(dailyQuests)
      .set({
        currentCount: quest.targetCount,
        isCompleted: 1,
      })
      .where(eq(dailyQuests.id, questId));

    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);

    if (progress) {
      const newTotalXp = progress.totalXp + quest.xpReward;
      const newLevel = calculateLevel(newTotalXp);

      await db
        .update(userProgress)
        .set({
          totalXp: newTotalXp,
          level: newLevel,
          updatedAt: new Date(),
        })
        .where(eq(userProgress.userId, userId));
    }

    res.json({ ok: true, xpReward: quest.xpReward });
  } catch (error) {
    logger.error("Error completing quest", { error: error.message, userId: req.user?.id });
    res.status(500).json({ ok: false, error: "Failed to complete quest" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await db
      .select({
        level: userProgress.level,
        totalXp: userProgress.totalXp,
        currentStreak: userProgress.currentStreak,
      })
      .from(userProgress)
      .orderBy(sql`${userProgress.totalXp} DESC`)
      .limit(10);

    res.json({ ok: true, leaderboard });
  } catch (error) {
    logger.error("Error fetching leaderboard", { error: error.message });
    res.status(500).json({ ok: false, error: "Failed to fetch leaderboard" });
  }
});

export default router;
