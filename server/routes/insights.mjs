import { Router } from 'express';
import { getDailyInsight } from '../insights/daily.mjs';
import { db } from "../db/connection.mjs";
import { journals, moods } from "../../shared/schema.mjs";
import { eq, and, gte, desc, count } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

const router = Router();

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function requireAuth(req, res, next) {
  if (!req.dbUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function getMoodByDayOfWeek(moodLogs) {
  const dayStats = {};
  DAY_NAMES.forEach((day, idx) => {
    dayStats[idx] = { day, total: 0, count: 0, emotions: {} };
  });

  moodLogs.forEach(log => {
    const date = new Date(log.createdAt);
    const dayIndex = date.getDay();
    const moodValue = log.mood || 5;
    
    dayStats[dayIndex].total += moodValue;
    dayStats[dayIndex].count += 1;
    
    if (log.emotion) {
      dayStats[dayIndex].emotions[log.emotion] = 
        (dayStats[dayIndex].emotions[log.emotion] || 0) + 1;
    }
  });

  let happiestDay = null;
  let highestAvg = 0;
  
  Object.values(dayStats).forEach(stat => {
    if (stat.count > 0) {
      const avg = stat.total / stat.count;
      if (avg > highestAvg) {
        highestAvg = avg;
        happiestDay = stat.day;
      }
    }
  });

  return { happiestDay, dayStats };
}

function getCalmestTimeslot(moodLogs) {
  const timeSlots = {};
  for (let i = 0; i < 24; i++) {
    timeSlots[i] = { total: 0, count: 0 };
  }

  const calmEmotions = ["calm", "peaceful", "relaxed", "content", "serene"];
  
  moodLogs.forEach(log => {
    const date = new Date(log.createdAt);
    const hour = date.getHours();
    
    if (calmEmotions.includes(log.emotion?.toLowerCase())) {
      timeSlots[hour].total += 1;
    }
    timeSlots[hour].count += 1;
  });

  let calmestHour = null;
  let highestRatio = 0;

  Object.entries(timeSlots).forEach(([hour, stat]) => {
    if (stat.count >= 3) {
      const ratio = stat.total / stat.count;
      if (ratio > highestRatio) {
        highestRatio = ratio;
        calmestHour = parseInt(hour);
      }
    }
  });

  if (calmestHour === null) {
    let highestMood = 0;
    moodLogs.forEach(log => {
      const hour = new Date(log.createdAt).getHours();
      const mood = log.mood || 5;
      if (mood >= 7 && mood > highestMood) {
        highestMood = mood;
        calmestHour = hour;
      }
    });
  }

  const formatHour = (h) => {
    if (h === null) return null;
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:00 ${period}`;
  };

  return { calmestHour, formattedTime: formatHour(calmestHour) };
}

function getMoodTrend(moodLogs) {
  if (moodLogs.length < 7) return "insufficient_data";

  const recent = moodLogs.slice(0, Math.min(7, moodLogs.length));
  const older = moodLogs.slice(7, Math.min(14, moodLogs.length));

  if (older.length < 3) return "insufficient_data";

  const recentAvg = recent.reduce((sum, l) => sum + (l.mood || 5), 0) / recent.length;
  const olderAvg = older.reduce((sum, l) => sum + (l.mood || 5), 0) / older.length;

  const diff = recentAvg - olderAvg;
  
  if (diff > 0.5) return "improving";
  if (diff < -0.5) return "declining";
  return "stable";
}

function getMostFrequentEmotion(moodLogs) {
  const emotionCounts = {};
  
  moodLogs.forEach(log => {
    if (log.emotion) {
      emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
    }
  });

  let topEmotion = null;
  let topCount = 0;

  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count > topCount) {
      topCount = count;
      topEmotion = emotion;
    }
  });

  return { emotion: topEmotion, count: topCount };
}

router.get('/daily', (_req, res) => {
  res.json({ insight: getDailyInsight() });
});

router.get("/mood", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await db
      .select()
      .from(moods)
      .where(and(
        eq(moods.userId, userId),
        gte(moods.createdAt, thirtyDaysAgo)
      ))
      .orderBy(desc(moods.createdAt));

    if (logs.length < 3) {
      return res.json({
        insights: [],
        message: "Keep logging your moods to unlock personalized insights"
      });
    }

    const insights = [];

    const { happiestDay } = getMoodByDayOfWeek(logs);
    if (happiestDay) {
      insights.push({
        type: "day_pattern",
        text: `You tend to feel most joyful on ${happiestDay}s. This could be a great day for important decisions or creative work.`,
        dataPoint: `Based on ${logs.length} mood logs`,
        relatedEmotion: "joy"
      });
    }

    const { formattedTime } = getCalmestTimeslot(logs);
    if (formattedTime) {
      insights.push({
        type: "time_pattern",
        text: `Your calmest hour is around ${formattedTime}. Consider scheduling mindfulness or reflection during this peaceful window.`,
        dataPoint: `Based on your recent patterns`,
        relatedEmotion: "calm"
      });
    }

    const trend = getMoodTrend(logs);
    if (trend !== "insufficient_data") {
      const trendText = trend === "improving" 
        ? "Your overall mood has been trending upward. Keep nurturing what's working for you."
        : trend === "stable"
          ? "Your emotional state has been beautifully stable. This consistency is a sign of inner balance."
          : "You've been navigating some emotional waves lately. Remember: this too shall pass.";
      
      insights.push({
        type: "trend",
        text: trendText,
        dataPoint: `Trend: ${trend}`,
        relatedEmotion: trend === "improving" ? "hopeful" : trend === "stable" ? "balanced" : "healing"
      });
    }

    const { emotion, count: emotionCount } = getMostFrequentEmotion(logs);
    if (emotion && emotionCount >= 3) {
      const capitalizedEmotion = emotion.charAt(0).toUpperCase() + emotion.slice(1);
      insights.push({
        type: "emotion_strength",
        text: `"${capitalizedEmotion}" is your most frequently logged emotion. Understanding this pattern helps you honor your authentic feelings.`,
        dataPoint: `Logged ${emotionCount} times`,
        relatedEmotion: emotion
      });
    }

    const entries = await db
      .select({ count: count() })
      .from(journals)
      .where(eq(journals.userId, userId));
    
    const entryCount = Number(entries[0]?.count || 0);
    
    if (entryCount >= 7) {
      insights.push({
        type: "streak",
        text: `You've written ${entryCount} journal entries. This dedication is building powerful self-awareness and emotional resilience.`,
        dataPoint: `${entryCount} total entries`,
        relatedEmotion: "grateful"
      });
    }

    res.json({
      insights: insights.slice(0, 5),
      totalMoodLogs: logs.length
    });
  } catch (error) {
    logger.error("Error fetching mood insights:", { error: error?.message || error });
    res.status(500).json({ error: "Failed to fetch mood insights" });
  }
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "insights", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
