// server/routes/mood.mjs
import express from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { moods } from "../../shared/schema.mjs";
import { VALID_ACTIVITIES } from "../utils/validation.mjs";

// Emotion options for mood tracking
const VALID_EMOTIONS = [
  "happy", "joyful", "excited", "content", "peaceful", "calm",
  "neutral", "tired", "stressed", "anxious", "worried", "sad",
  "angry", "frustrated", "overwhelmed", "hopeful", "grateful"
];

const router = express.Router();

// Response helpers
function success(res, data, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

function badRequest(res, message, errors = []) {
  return res.status(400).json({ ok: false, message, errors });
}

function serverError(res, message = "Server error") {
  return res.status(500).json({ ok: false, error: message });
}

// Health check
router.get("/ping", (req, res) => {
  return success(res, { route: "mood" });
});

// GET mood options
router.get("/options", (req, res) => {
  return success(res, {
    emotions: VALID_EMOTIONS,
    activities: VALID_ACTIVITIES,
    scoreRange: { min: 1, max: 10 }
  });
});

// GET all moods
router.get("/", async (req, res) => {
  try {
    const allMoods = await db
      .select()
      .from(moods)
      .orderBy(desc(moods.createdAt))
      .limit(50);

    return success(res, { moods: allMoods });
  } catch (err) {
    console.error("[mood.get error]", err);
    return serverError(res, "Failed to fetch mood entries");
  }
});

// GET moods by user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userMoods = await db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(desc(moods.createdAt))
      .limit(50);

    return success(res, { moods: userMoods });
  } catch (err) {
    console.error("[mood.getByUser error]", err);
    return serverError(res, "Failed to fetch mood entries");
  }
});

// GET mood stats for user
router.get("/user/:userId/stats", async (req, res) => {
  try {
    const { userId } = req.params;
    const userMoods = await db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(desc(moods.createdAt));

    if (userMoods.length === 0) {
      return success(res, {
        stats: {
          count: 0,
          averageScore: 0,
          trend: "neutral",
          recentMoods: []
        }
      });
    }

    const scores = userMoods.map(m => m.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Calculate trend
    let trend = "neutral";
    if (scores.length >= 7) {
      const recent = scores.slice(0, 7);
      const older = scores.slice(7, 14);
      if (older.length > 0) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        if (recentAvg > olderAvg + 0.5) trend = "improving";
        else if (recentAvg < olderAvg - 0.5) trend = "declining";
      }
    }

    return success(res, {
      stats: {
        count: userMoods.length,
        averageScore: Math.round(averageScore * 10) / 10,
        trend,
        recentMoods: userMoods.slice(0, 7)
      }
    });
  } catch (err) {
    console.error("[mood.stats error]", err);
    return serverError(res, "Failed to fetch mood stats");
  }
});

// POST new mood entry
router.post("/", async (req, res) => {
  try {
    const { userId, score, note, activities } = req.body || {};
    const errors = [];

    if (!userId) {
      errors.push({ field: "userId", message: "User ID is required" });
    }

    if (typeof score !== "number" || score < 1 || score > 10) {
      errors.push({ field: "score", message: "Score must be a number between 1 and 10" });
    }

    if (errors.length > 0) {
      return badRequest(res, "Validation failed", errors);
    }

    const [inserted] = await db
      .insert(moods)
      .values({
        userId,
        score,
        note: note || null,
        activities: activities || null,
      })
      .returning();

    return success(res, { mood: inserted }, 201);
  } catch (err) {
    console.error("[mood.post error]", err);
    return serverError(res, "Failed to save mood entry");
  }
});

// DELETE mood entry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(moods)
      .where(eq(moods.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return badRequest(res, "Mood entry not found");
    }

    return success(res, { message: "Mood entry deleted", deleted });
  } catch (err) {
    console.error("[mood.delete error]", err);
    return serverError(res, "Failed to delete mood entry");
  }
});

export default router;
