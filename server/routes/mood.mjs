// server/routes/mood.mjs
import express from "express";
import crypto from "crypto";
import { db } from "../db/connection.mjs";
import { moodEntries } from "../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";
import { authGuard } from "../middleware/auth.mjs";
import { success, created, badRequest, serverError } from "../utils/response.mjs";
import { moodSchema, validate } from "../utils/validation.mjs";

const router = express.Router();

router.get("/ping", (req, res) => success(res, { route: "mood" }));

router.post("/", authGuard, async (req, res) => {
  try {
    const validation = validate(moodSchema, req.body);
    if (!validation.valid) {
      return res.status(400).json({
        ok: false,
        error: "Validation failed",
        validationErrors: validation.errors
      });
    }

    const { mood, notes } = validation.data;
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

    return created(res, { entry });
  } catch (err) {
    return serverError(res, err, "Failed to save mood entry");
  }
});

router.get("/history", authGuard, async (req, res) => {
  try {
    const userId = String(req.user.id);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const history = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(limit);

    const formattedHistory = history.map(entry => ({
      id: entry.id,
      mood: entry.intensity || parseInt(entry.mood) || 5,
      notes: entry.notes || "",
      createdAt: entry.createdAt?.toISOString() || new Date().toISOString()
    }));

    return success(res, { history: formattedHistory });
  } catch (err) {
    return serverError(res, err, "Failed to fetch mood history");
  }
});

router.get("/stats", authGuard, async (req, res) => {
  try {
    const userId = String(req.user.id);

    const entries = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(30);

    if (entries.length === 0) {
      return success(res, {
        stats: {
          average: 0,
          total: 0,
          trend: "neutral",
          highest: 0,
          lowest: 0
        }
      });
    }

    const moods = entries.map(e => e.intensity || parseInt(e.mood) || 5);
    const average = moods.reduce((a, b) => a + b, 0) / moods.length;
    const highest = Math.max(...moods);
    const lowest = Math.min(...moods);

    let trend = "neutral";
    if (moods.length >= 14) {
      // Need at least 14 entries to compare two weeks
      const recent = moods.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
      const olderSlice = moods.slice(7, 14);
      if (olderSlice.length > 0) {
        const older = olderSlice.reduce((a, b) => a + b, 0) / olderSlice.length;
        if (recent > older + 0.5) trend = "improving";
        else if (recent < older - 0.5) trend = "declining";
      }
    }

    return success(res, {
      stats: {
        average: Math.round(average * 10) / 10,
        total: entries.length,
        trend,
        highest,
        lowest
      }
    });
  } catch (err) {
    return serverError(res, err, "Failed to calculate mood stats");
  }
});

router.delete("/:id", authGuard, async (req, res) => {
  try {
    const userId = String(req.user.id);
    const entryId = req.params.id;

    const [entry] = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.id, entryId));

    if (!entry) {
      return res.status(404).json({ ok: false, error: "Entry not found" });
    }

    if (entry.userId !== userId) {
      return res.status(403).json({ ok: false, error: "Not authorized to delete this entry" });
    }

    await db.delete(moodEntries).where(eq(moodEntries.id, entryId));

    return success(res, { message: "Entry deleted successfully" });
  } catch (err) {
    return serverError(res, err, "Failed to delete mood entry");
  }
});

export default router;
