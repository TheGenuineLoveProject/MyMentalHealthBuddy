// server/routes/ai-dashboard.mjs
// AI-powered wellness dashboard with real analytics

import express from "express";
import { db } from "../db/connection.mjs";
import { moods, journals, aiMessages, userProgress, toolSessions, dailyQuests } from "../../shared/schema.mjs";
import { eq, desc, gte, and, count } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.mjs";
import { success, serverError } from "../utils/response.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const userId = req.dbUserId;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      recentMoods,
      journalStats,
      progressData,
      recentSessions,
      activeQuests,
      aiMessageCount
    ] = await Promise.all([
      db.select()
        .from(moods)
        .where(and(
          eq(moods.userId, userId),
          gte(moods.createdAt, thirtyDaysAgo)
        ))
        .orderBy(desc(moods.createdAt))
        .limit(30),

      db.select({ count: count() })
        .from(journals)
        .where(eq(journals.userId, userId)),

      db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .limit(1),

      db.select()
        .from(toolSessions)
        .where(and(
          eq(toolSessions.userId, userId),
          gte(toolSessions.completedAt, sevenDaysAgo)
        ))
        .orderBy(desc(toolSessions.completedAt))
        .limit(10),

      db.select()
        .from(dailyQuests)
        .where(and(
          eq(dailyQuests.userId, userId),
          eq(dailyQuests.isCompleted, 0),
          gte(dailyQuests.expiresAt, now)
        ))
        .limit(3),

      db.select({ count: count() })
        .from(aiMessages)
        .where(eq(aiMessages.userId, userId))
    ]);

    const moodScores = recentMoods
      .filter(m => m.score != null)
      .map(m => m.score);
    
    const averageMood = moodScores.length > 0
      ? Math.round(moodScores.reduce((a, b) => a + b, 0) / moodScores.length * 10) / 10
      : null;

    const moodTrend = calculateMoodTrend(recentMoods);

    const progress = progressData[0] || {
      totalXp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalToolsUsed: 0,
      totalSessionMinutes: 0
    };

    const topTools = calculateTopTools(recentSessions);

    const insights = generateInsights({
      averageMood,
      moodTrend,
      streak: progress.currentStreak,
      toolsUsed: recentSessions.length,
      journalCount: journalStats[0]?.count || 0
    });

    return success(res, {
      summary: {
        averageMood,
        moodTrend,
        journalCount: journalStats[0]?.count || 0,
        aiConversations: aiMessageCount[0]?.count || 0,
        lastMoodEntry: recentMoods[0]?.createdAt || null
      },
      progress: {
        level: progress.level,
        totalXp: progress.totalXp,
        xpToNextLevel: calculateXpToNextLevel(progress.level, progress.totalXp),
        currentStreak: progress.currentStreak,
        longestStreak: progress.longestStreak,
        totalToolsUsed: progress.totalToolsUsed,
        totalMinutes: progress.totalSessionMinutes
      },
      recentActivity: {
        moods: recentMoods.slice(0, 7).map(m => ({
          date: m.createdAt,
          score: m.score,
          emotion: m.emotion
        })),
        topTools,
        activeQuests: activeQuests.map(q => ({
          id: q.id,
          title: q.title,
          progress: `${q.currentCount}/${q.targetCount}`,
          xpReward: q.xpReward
        }))
      },
      insights
    });
  } catch (err) {
    logger.error("AI Dashboard error", { error: err.message, userId: req.user?.id });
    return serverError(res, err);
  }
});

router.get("/mood-chart", async (req, res) => {
  try {
    const userId = req.dbUserId;
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const moodData = await db.select({
      date: moods.createdAt,
      score: moods.score,
      emotion: moods.emotion,
      energyLevel: moods.energyLevel,
      sleepQuality: moods.sleepQuality
    })
      .from(moods)
      .where(and(
        eq(moods.userId, userId),
        gte(moods.createdAt, since)
      ))
      .orderBy(moods.createdAt);

    return success(res, { data: moodData, period: days });
  } catch (err) {
    logger.error("Mood chart error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/wellness-score", async (req, res) => {
  try {
    const userId = req.dbUserId;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [recentMoods, recentJournals, recentSessions, progress] = await Promise.all([
      db.select()
        .from(moods)
        .where(and(
          eq(moods.userId, userId),
          gte(moods.createdAt, sevenDaysAgo)
        )),
      db.select({ count: count() })
        .from(journals)
        .where(and(
          eq(journals.userId, userId),
          gte(journals.createdAt, sevenDaysAgo)
        )),
      db.select()
        .from(toolSessions)
        .where(and(
          eq(toolSessions.userId, userId),
          gte(toolSessions.completedAt, sevenDaysAgo)
        )),
      db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .limit(1)
    ]);

    const moodScore = calculateMoodScore(recentMoods);
    const engagementScore = calculateEngagementScore(
      recentMoods.length,
      recentJournals[0]?.count || 0,
      recentSessions.length,
      progress[0]?.currentStreak || 0
    );
    const selfCareScore = calculateSelfCareScore(recentSessions);

    const overallScore = Math.round((moodScore + engagementScore + selfCareScore) / 3);

    return success(res, {
      overall: overallScore,
      breakdown: {
        mood: moodScore,
        engagement: engagementScore,
        selfCare: selfCareScore
      },
      period: "7 days"
    });
  } catch (err) {
    logger.error("Wellness score error", { error: err.message });
    return serverError(res, err);
  }
});

function calculateMoodTrend(moods) {
  if (moods.length < 2) return "neutral";
  
  const scores = moods.filter(m => m.score != null).map(m => m.score);
  if (scores.length < 2) return "neutral";
  
  const recentAvg = scores.slice(0, Math.ceil(scores.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(scores.length / 2);
  const olderAvg = scores.slice(Math.ceil(scores.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(scores.length / 2);
  
  const diff = recentAvg - olderAvg;
  if (diff > 0.5) return "improving";
  if (diff < -0.5) return "declining";
  return "stable";
}

function calculateTopTools(sessions) {
  const toolCounts = {};
  sessions.forEach(s => {
    toolCounts[s.toolName] = (toolCounts[s.toolName] || 0) + 1;
  });
  
  return Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function calculateXpToNextLevel(level, currentXp) {
  const xpPerLevel = 1000;
  const xpForCurrentLevel = level * xpPerLevel;
  return Math.max(0, xpForCurrentLevel - currentXp);
}

function generateInsights({ averageMood: _averageMood, moodTrend, streak, toolsUsed, journalCount }) {
  const insights = [];
  
  if (streak >= 7) {
    insights.push({
      type: "achievement",
      message: `Amazing! You've maintained a ${streak}-day wellness streak. Keep it up!`,
      icon: "trophy"
    });
  } else if (streak >= 3) {
    insights.push({
      type: "encouragement",
      message: `Great job! You're on a ${streak}-day streak. Just a few more days to hit a week!`,
      icon: "flame"
    });
  }
  
  if (moodTrend === "improving") {
    insights.push({
      type: "positive",
      message: "Your mood has been improving lately. Whatever you're doing, it's working!",
      icon: "trending-up"
    });
  } else if (moodTrend === "declining") {
    insights.push({
      type: "support",
      message: "I notice things have been a bit tough lately. Remember, it's okay to have hard days. Consider trying a grounding exercise.",
      icon: "heart"
    });
  }
  
  if (toolsUsed >= 10) {
    insights.push({
      type: "achievement",
      message: "You've been actively using wellness tools this week. That's wonderful self-care!",
      icon: "star"
    });
  }
  
  if (journalCount >= 5) {
    insights.push({
      type: "positive",
      message: "Your journaling practice is strong. Writing helps process emotions and build self-awareness.",
      icon: "book-open"
    });
  }
  
  if (insights.length === 0) {
    insights.push({
      type: "encouragement",
      message: "Every step on your wellness journey matters. Try logging a mood or using a tool today!",
      icon: "sparkles"
    });
  }
  
  return insights;
}

function calculateMoodScore(moods) {
  if (moods.length === 0) return 50;
  const scores = moods.filter(m => m.score != null).map(m => m.score);
  if (scores.length === 0) return 50;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10);
}

function calculateEngagementScore(moodCount, journalCount, sessionCount, streak) {
  const moodPoints = Math.min(moodCount * 5, 25);
  const journalPoints = Math.min(journalCount * 10, 25);
  const sessionPoints = Math.min(sessionCount * 5, 25);
  const streakPoints = Math.min(streak * 5, 25);
  return moodPoints + journalPoints + sessionPoints + streakPoints;
}

function calculateSelfCareScore(sessions) {
  if (sessions.length === 0) return 30;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) / 60;
  return Math.min(Math.round(30 + totalMinutes * 2), 100);
}

export default router;
