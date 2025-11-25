// server/routes/mood.mjs
import express from "express";
import crypto from "crypto";
import { db } from "../db/connection.mjs";
import { moodEntries } from "../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";
import { optionalAuth } from "../middleware/auth.mjs";

const router = express.Router();

// Health check
router.get("/ping", (req, res) => res.json({ ok: true, route: "mood" }));

// CREATE MOOD ENTRY
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { mood, notes } = req.body;
    
    if (!mood || typeof mood !== "number" || mood < 1 || mood > 10) {
      return res.status(400).json({ ok: false, error: "Mood must be a number between 1 and 10" });
    }

    // Require authentication to save mood entries
    if (!req.user?.id) {
      return res.status(401).json({ ok: false, error: "Please login to save mood entries" });
    }

    const userId = String(req.user.id);

    const [entry] = await db
      .insert(moodEntries)
      .values({
        id: crypto.randomUUID(),
        userId,
        mood: String(mood),
        intensity: mood,
        notes: notes || null
      })
      .returning();

    res.json({ ok: true, entry });
  } catch (err) {
    console.error("Error saving mood:", err);
    res.status(500).json({ ok: false, error: "Failed to save mood", history: [] });
  }
});

// GET HISTORY
router.get("/history", optionalAuth, async (req, res) => {
  try {
    // Return empty history if not logged in
    if (!req.user?.id) {
      return res.json({ ok: true, history: [] });
    }

    const userId = String(req.user.id);

    const history = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(20);

    // Map to expected format
    const formattedHistory = history.map(entry => ({
      id: entry.id,
      mood: entry.intensity || parseInt(entry.mood) || 5,
      notes: entry.notes || "",
      createdAt: entry.createdAt?.toISOString() || new Date().toISOString()
    }));

    res.json({ ok: true, history: formattedHistory });
  } catch (err) {
    console.error("Error fetching mood history:", err);
    res.json({ ok: false, history: [], error: "Failed to fetch history" });
  }
});

export default router;