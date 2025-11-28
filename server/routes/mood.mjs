import express from "express";
import { db } from "../db/connection.mjs";
import { moods } from "../shared/schema.mjs";
import { eq, desc, gte, lte, and, sql } from "drizzle-orm";
import { 
  validate, 
  moodSchema, 
  quickMoodSchema,
  VALID_EMOTIONS, 
  VALID_ACTIVITIES, 
  VALID_WEATHER 
} from "../utils/validation.mjs";

const router = express.Router();

// Health check
router.get("/ping", (req, res) => {
  res.json({ ok: true, route: "mood" });
});

// Get available options for mood entry
router.get("/options", (req, res) => {
  res.json({
    ok: true,
    options: {
      emotions: VALID_EMOTIONS,
      activities: VALID_ACTIVITIES,
      weather: VALID_WEATHER,
      scoreRange: { min: 1, max: 10 },
      energyRange: { min: 1, max: 5 },
      sleepRange: { min: 1, max: 5 }
    }
  });
});

// CREATE comprehensive mood entry
router.post("/", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ ok: false, error: "User ID required" });
    }

    const validation = validate(moodSchema, req.body);
    if (!validation.valid) {
      return res.status(400).json({ ok: false, error: "Validation failed", errors: validation.errors });
    }

    const { score, emotion, energy_level, sleep_quality, activities, triggers, note, weather, location } = validation.data;

    const [result] = await db
      .insert(moods)
      .values({
        user_id,
        score,
        emotion: emotion || null,
        energy_level: energy_level || null,
        sleep_quality: sleep_quality || null,
        activities: activities || null,
        triggers: triggers || null,
        note: note || null,
        weather: weather || null,
        location: location || null,
      })
      .returning();

    return res.json({ ok: true, mood: result });
  } catch (err) {
    console.error("Error creating mood:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// CREATE quick mood entry (simplified)
router.post("/quick", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ ok: false, error: "User ID required" });
    }

    const validation = validate(quickMoodSchema, req.body);
    if (!validation.valid) {
      return res.status(400).json({ ok: false, error: "Validation failed", errors: validation.errors });
    }

    const { score, emotion, note } = validation.data;

    const [result] = await db
      .insert(moods)
      .values({
        user_id,
        score,
        emotion: emotion || null,
        note: note || null,
      })
      .returning();

    return res.json({ ok: true, mood: result });
  } catch (err) {
    console.error("Error creating quick mood:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET all moods by user with optional filters
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { start_date, end_date, emotion, limit = 50 } = req.query;

    let conditions = [eq(moods.user_id, userId)];

    if (start_date) {
      conditions.push(gte(moods.created_at, new Date(start_date)));
    }
    if (end_date) {
      conditions.push(lte(moods.created_at, new Date(end_date)));
    }
    if (emotion) {
      conditions.push(eq(moods.emotion, emotion));
    }

    const results = await db
      .select()
      .from(moods)
      .where(and(...conditions))
      .orderBy(desc(moods.created_at))
      .limit(parseInt(limit));

    return res.json({ ok: true, moods: results, count: results.length });
  } catch (err) {
    console.error("Error fetching moods:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET comprehensive mood stats for user
router.get("/:userId/stats", async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const results = await db
      .select()
      .from(moods)
      .where(and(
        eq(moods.user_id, userId),
        gte(moods.created_at, startDate)
      ))
      .orderBy(desc(moods.created_at));

    if (results.length === 0) {
      return res.json({ 
        ok: true, 
        stats: { 
          average_score: 0,
          average_energy: 0,
          average_sleep: 0,
          count: 0, 
          trend: "neutral",
          top_emotions: [],
          top_activities: [],
          mood_by_day: {},
          recentMoods: [] 
        } 
      });
    }

    // Calculate averages
    const scores = results.map(m => m.score);
    const energyLevels = results.filter(m => m.energy_level).map(m => m.energy_level);
    const sleepQualities = results.filter(m => m.sleep_quality).map(m => m.sleep_quality);

    const average_score = scores.reduce((a, b) => a + b, 0) / scores.length;
    const average_energy = energyLevels.length > 0 
      ? energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length 
      : 0;
    const average_sleep = sleepQualities.length > 0 
      ? sleepQualities.reduce((a, b) => a + b, 0) / sleepQualities.length 
      : 0;

    // Calculate trend
    const recent = scores.slice(0, Math.min(7, scores.length));
    const older = scores.slice(7, Math.min(14, scores.length));
    
    let trend = "neutral";
    if (recent.length > 0 && older.length > 0) {
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
      if (recentAvg > olderAvg + 0.5) trend = "improving";
      else if (recentAvg < olderAvg - 0.5) trend = "declining";
    }

    // Count emotions
    const emotionCounts = {};
    results.forEach(m => {
      if (m.emotion) {
        emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1;
      }
    });
    const top_emotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, count }));

    // Count activities
    const activityCounts = {};
    results.forEach(m => {
      if (m.activities && Array.isArray(m.activities)) {
        m.activities.forEach(activity => {
          activityCounts[activity] = (activityCounts[activity] || 0) + 1;
        });
      }
    });
    const top_activities = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count }));

    // Group by day of week
    const mood_by_day = { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] };
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    results.forEach(m => {
      const day = dayNames[new Date(m.created_at).getDay()];
      mood_by_day[day].push(m.score);
    });
    
    const avg_by_day = {};
    Object.entries(mood_by_day).forEach(([day, scores]) => {
      avg_by_day[day] = scores.length > 0 
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null;
    });

    return res.json({ 
      ok: true, 
      stats: { 
        average_score: Math.round(average_score * 10) / 10,
        average_energy: Math.round(average_energy * 10) / 10,
        average_sleep: Math.round(average_sleep * 10) / 10,
        count: results.length,
        trend,
        top_emotions,
        top_activities,
        mood_by_day: avg_by_day,
        recentMoods: results.slice(0, 7)
      } 
    });
  } catch (err) {
    console.error("Error fetching mood stats:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET mood patterns and insights
router.get("/:userId/insights", async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await db
      .select()
      .from(moods)
      .where(eq(moods.user_id, userId))
      .orderBy(desc(moods.created_at))
      .limit(100);

    if (results.length < 7) {
      return res.json({ 
        ok: true, 
        insights: {
          message: "Keep tracking! We need at least 7 entries to generate insights.",
          patterns: [],
          recommendations: []
        }
      });
    }

    const insights = {
      patterns: [],
      recommendations: []
    };

    // Analyze activity correlations
    const activityMoods = {};
    results.forEach(m => {
      if (m.activities && Array.isArray(m.activities)) {
        m.activities.forEach(activity => {
          if (!activityMoods[activity]) {
            activityMoods[activity] = [];
          }
          activityMoods[activity].push(m.score);
        });
      }
    });

    Object.entries(activityMoods).forEach(([activity, scores]) => {
      if (scores.length >= 3) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (avg >= 7) {
          insights.patterns.push({
            type: "positive_activity",
            activity,
            average_score: Math.round(avg * 10) / 10,
            message: `${activity} is associated with higher mood scores`
          });
        }
      }
    });

    // Analyze sleep correlation
    const sleepMoods = results.filter(m => m.sleep_quality && m.score);
    if (sleepMoods.length >= 5) {
      const goodSleep = sleepMoods.filter(m => m.sleep_quality >= 4);
      const poorSleep = sleepMoods.filter(m => m.sleep_quality <= 2);
      
      if (goodSleep.length >= 2 && poorSleep.length >= 2) {
        const goodAvg = goodSleep.reduce((a, b) => a + b.score, 0) / goodSleep.length;
        const poorAvg = poorSleep.reduce((a, b) => a + b.score, 0) / poorSleep.length;
        
        if (goodAvg - poorAvg >= 1) {
          insights.patterns.push({
            type: "sleep_correlation",
            message: "Better sleep quality is linked to higher mood scores",
            good_sleep_avg: Math.round(goodAvg * 10) / 10,
            poor_sleep_avg: Math.round(poorAvg * 10) / 10
          });
          insights.recommendations.push("Prioritize good sleep hygiene for better mood");
        }
      }
    }

    // Add general recommendations based on patterns
    const avgScore = results.reduce((a, b) => a + b.score, 0) / results.length;
    if (avgScore < 5) {
      insights.recommendations.push("Consider speaking with a mental health professional");
      insights.recommendations.push("Try adding mood-boosting activities like exercise or nature walks");
    } else if (avgScore >= 7) {
      insights.recommendations.push("Great job! Keep doing what works for you");
    }

    return res.json({ ok: true, insights });
  } catch (err) {
    console.error("Error generating insights:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// DELETE a mood entry
router.delete("/:moodId", async (req, res) => {
  try {
    const { moodId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ ok: false, error: "User ID required" });
    }

    const [deleted] = await db
      .delete(moods)
      .where(and(
        eq(moods.id, moodId),
        eq(moods.user_id, user_id)
      ))
      .returning();

    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Mood entry not found" });
    }

    return res.json({ ok: true, deleted: true });
  } catch (err) {
    console.error("Error deleting mood:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
