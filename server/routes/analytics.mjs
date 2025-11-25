// server/routes/analytics.mjs
import express from "express";
import { authGuard } from "../middleware/auth.mjs";
import { db } from "../db/connection.mjs";
import { moodEntries, journals } from "../shared/schema.mjs";
import { eq, desc, sql, gte, and } from "drizzle-orm";

const router = express.Router();

// Health check
router.get("/ping", (req, res) => res.json({ ok: true, route: "analytics" }));

// Get mood trends over time
router.get("/mood-trends", authGuard, async (req, res) => {
  try {
    const { period = "30" } = req.query;
    const days = parseInt(period) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await db
      .select({
        mood: moodEntries.mood,
        intensity: moodEntries.intensity,
        createdAt: moodEntries.createdAt,
      })
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, String(req.user.userId)),
          gte(moodEntries.createdAt, startDate)
        )
      )
      .orderBy(moodEntries.createdAt);

    // Group by date for daily averages
    const dailyMoods = {};
    entries.forEach((entry) => {
      const date = new Date(entry.createdAt).toISOString().split("T")[0];
      if (!dailyMoods[date]) {
        dailyMoods[date] = { moods: [], intensities: [] };
      }
      dailyMoods[date].moods.push(entry.mood);
      dailyMoods[date].intensities.push(entry.intensity || 5);
    });

    const trends = Object.entries(dailyMoods).map(([date, data]) => ({
      date,
      avgIntensity: Math.round(
        data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length
      ),
      dominantMood: getMostFrequent(data.moods),
      entryCount: data.moods.length,
    }));

    res.json({
      success: true,
      data: {
        period: days,
        trends,
        totalEntries: entries.length,
      },
    });
  } catch (error) {
    console.error("Error fetching mood trends:", error);
    res.status(500).json({ success: false, error: "Failed to fetch mood trends" });
  }
});

// Get mood distribution
router.get("/mood-distribution", authGuard, async (req, res) => {
  try {
    const entries = await db
      .select({ mood: moodEntries.mood })
      .from(moodEntries)
      .where(eq(moodEntries.userId, String(req.user.userId)));

    const distribution = {};
    entries.forEach((entry) => {
      distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
    });

    const total = entries.length;
    const percentages = Object.entries(distribution).map(([mood, count]) => ({
      mood,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    res.json({
      success: true,
      data: {
        distribution: percentages.sort((a, b) => b.count - a.count),
        totalEntries: total,
      },
    });
  } catch (error) {
    console.error("Error fetching mood distribution:", error);
    res.status(500).json({ success: false, error: "Failed to fetch distribution" });
  }
});

// Get journal statistics
router.get("/journal-stats", authGuard, async (req, res) => {
  try {
    const entries = await db
      .select({
        id: journals.id,
        text: journals.text,
        createdAt: journals.createdAt,
      })
      .from(journals)
      .where(eq(journals.userId, req.user.userId))
      .orderBy(desc(journals.createdAt));

    // Calculate statistics
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => {
      return sum + (entry.text?.split(/\s+/).length || 0);
    }, 0);

    // Calculate streak
    const streak = calculateStreak(entries.map((e) => new Date(e.createdAt)));

    // Weekly activity
    const weeklyActivity = getWeeklyActivity(entries);

    res.json({
      success: true,
      data: {
        totalEntries,
        totalWords,
        averageWordsPerEntry: totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0,
        currentStreak: streak,
        weeklyActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching journal stats:", error);
    res.status(500).json({ success: false, error: "Failed to fetch journal stats" });
  }
});

// Get overall wellness score
router.get("/wellness-score", authGuard, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get recent mood entries
    const moods = await db
      .select({ mood: moodEntries.mood, intensity: moodEntries.intensity })
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, String(req.user.userId)),
          gte(moodEntries.createdAt, thirtyDaysAgo)
        )
      );

    // Get recent journal entries
    const journalCount = await db
      .select({ count: sql`count(*)` })
      .from(journals)
      .where(
        and(
          eq(journals.userId, req.user.userId),
          gte(journals.createdAt, thirtyDaysAgo)
        )
      );

    // Calculate wellness components
    const moodScore = calculateMoodScore(moods);
    const consistencyScore = calculateConsistencyScore(moods.length, journalCount[0]?.count || 0);
    const engagementScore = Math.min(100, (moods.length + Number(journalCount[0]?.count || 0)) * 3);

    const overallScore = Math.round((moodScore + consistencyScore + engagementScore) / 3);

    res.json({
      success: true,
      data: {
        overallScore,
        components: {
          moodScore,
          consistencyScore,
          engagementScore,
        },
        insights: generateInsights(overallScore, moodScore, consistencyScore),
      },
    });
  } catch (error) {
    console.error("Error calculating wellness score:", error);
    res.status(500).json({ success: false, error: "Failed to calculate wellness score" });
  }
});

// Get activity summary
router.get("/summary", authGuard, async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const [moodCount, journalEntryCount, recentMoods] = await Promise.all([
      db
        .select({ count: sql`count(*)` })
        .from(moodEntries)
        .where(eq(moodEntries.userId, String(userId))),
      db
        .select({ count: sql`count(*)` })
        .from(journals)
        .where(eq(journals.userId, userId)),
      db
        .select({ mood: moodEntries.mood })
        .from(moodEntries)
        .where(
          and(
            eq(moodEntries.userId, String(userId)),
            gte(moodEntries.createdAt, weekAgo)
          )
        ),
    ]);

    res.json({
      success: true,
      data: {
        totalMoodEntries: Number(moodCount[0]?.count || 0),
        totalJournalEntries: Number(journalEntryCount[0]?.count || 0),
        weeklyMoodEntries: recentMoods.length,
        dominantWeeklyMood: getMostFrequent(recentMoods.map((m) => m.mood)) || "No data",
      },
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ success: false, error: "Failed to fetch summary" });
  }
});

// Helper functions
function getMostFrequent(arr) {
  if (!arr.length) return null;
  const counts = {};
  let maxCount = 0;
  let maxItem = arr[0];
  
  arr.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      maxItem = item;
    }
  });
  
  return maxItem;
}

function calculateStreak(dates) {
  if (!dates.length) return 0;
  
  const sortedDates = dates
    .map((d) => new Date(d).toISOString().split("T")[0])
    .sort()
    .reverse();
  
  const uniqueDates = [...new Set(sortedDates)];
  const today = new Date().toISOString().split("T")[0];
  
  if (uniqueDates[0] !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (uniqueDates[0] !== yesterday.toISOString().split("T")[0]) {
      return 0;
    }
  }
  
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i - 1]);
    const prev = new Date(uniqueDates[i]);
    const diffDays = Math.floor((current - prev) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function getWeeklyActivity(entries) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activity = days.map((day) => ({ day, count: 0 }));
  
  entries.forEach((entry) => {
    const dayIndex = new Date(entry.createdAt).getDay();
    activity[dayIndex].count++;
  });
  
  return activity;
}

function calculateMoodScore(moods) {
  if (!moods.length) return 50;
  
  const moodValues = {
    happy: 100,
    excited: 90,
    calm: 80,
    content: 75,
    neutral: 50,
    anxious: 35,
    sad: 25,
    angry: 20,
    stressed: 30,
  };
  
  const scores = moods.map((m) => {
    const baseScore = moodValues[m.mood?.toLowerCase()] || 50;
    const intensityMod = ((m.intensity || 5) - 5) * 2;
    return baseScore + intensityMod;
  });
  
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function calculateConsistencyScore(moodCount, journalCount) {
  // Target: 30 mood entries and 15 journal entries per month
  const moodTarget = 30;
  const journalTarget = 15;
  
  const moodScore = Math.min(100, (moodCount / moodTarget) * 100);
  const journalScore = Math.min(100, (journalCount / journalTarget) * 100);
  
  return Math.round((moodScore + journalScore) / 2);
}

function generateInsights(overall, mood, consistency) {
  const insights = [];
  
  if (overall >= 80) {
    insights.push("Great job! You're maintaining excellent mental wellness habits.");
  } else if (overall >= 60) {
    insights.push("You're on a good track. Keep up the consistent self-care.");
  } else {
    insights.push("Consider increasing your daily check-ins for better insights.");
  }
  
  if (mood < 50) {
    insights.push("Your recent moods have been challenging. Remember, it's okay to seek support.");
  }
  
  if (consistency < 40) {
    insights.push("Try to log your mood daily for more accurate tracking.");
  }
  
  return insights;
}

export default router;
