import express from "express";
import { db } from "../db/connection.mjs";
import { moods } from "../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";
import { validate, moodSchema } from "../utils/validation.mjs";

const router = express.Router();

// Health check
router.get("/ping", (req, res) => {
  res.json({ ok: true, route: "mood" });
});

// CREATE mood entry
router.post("/", async (req, res) => {
  try {
    const { user_id, score, note } = req.body;

    if (!user_id) {
      return res.status(400).json({ ok: false, error: "User ID required" });
    }

    const validation = validate(moodSchema, { score, note });
    if (!validation.valid) {
      return res.status(400).json({ ok: false, error: "Validation failed", errors: validation.errors });
    }

    const [result] = await db
      .insert(moods)
      .values({
        user_id,
        score: validation.data.score,
        note: validation.data.note || null,
      })
      .returning();

    return res.json({ ok: true, mood: result });
  } catch (err) {
    console.error("Error creating mood:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET all moods by user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await db
      .select()
      .from(moods)
      .where(eq(moods.user_id, userId))
      .orderBy(desc(moods.created_at));

    return res.json({ ok: true, moods: results });
  } catch (err) {
    console.error("Error fetching moods:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET mood stats for user
router.get("/:userId/stats", async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await db
      .select()
      .from(moods)
      .where(eq(moods.user_id, userId))
      .orderBy(desc(moods.created_at));

    if (results.length === 0) {
      return res.json({ 
        ok: true, 
        stats: { 
          average: 0, 
          count: 0, 
          trend: "neutral",
          recentMoods: [] 
        } 
      });
    }

    const scores = results.map(m => m.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Calculate trend from last 7 entries
    const recent = scores.slice(0, Math.min(7, scores.length));
    const older = scores.slice(7, Math.min(14, scores.length));
    
    let trend = "neutral";
    if (recent.length > 0 && older.length > 0) {
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
      if (recentAvg > olderAvg + 0.5) trend = "improving";
      else if (recentAvg < olderAvg - 0.5) trend = "declining";
    }

    return res.json({ 
      ok: true, 
      stats: { 
        average: Math.round(average * 10) / 10,
        count: results.length,
        trend,
        recentMoods: results.slice(0, 7)
      } 
    });
  } catch (err) {
    console.error("Error fetching mood stats:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;