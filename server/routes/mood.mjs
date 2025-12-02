// server/routes/mood.mjs

import express from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { moods } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

// Health check (no auth needed)
router.get("/ping", (_req, res) => {
  return success(res, { route: "mood" }, "Mood route is healthy.");
});

// Apply auth middleware to protected routes
router.use(requireAuth);

/**
 * POST /api/mood
 * Body: { rating, emotion?, content?, score?, energyLevel?, sleepQuality?, activities?, triggers?, weather?, location? }
 * User ID comes from JWT token
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      rating,
      emotion,
      content,
      score,
      energyLevel,
      sleepQuality,
      activities,
      triggers,
      weather,
      location,
    } = req.body || {};

    // Rating is required (1-10 scale)
    if (typeof rating !== "number" || rating < 1 || rating > 10) {
      return badRequest(res, "Rating is required and must be between 1 and 10.", [
        { field: "rating", message: "Rating must be a number between 1 and 10." },
      ]);
    }

    const [row] = await db
      .insert(moods)
      .values({
        id: randomUUID(),
        userId,
        rating,
        emotion: emotion || null,
        content: content || null,
        score: score || rating, // Default score to rating if not provided
        energyLevel: energyLevel || null,
        sleepQuality: sleepQuality || null,
        activities: Array.isArray(activities) ? activities.join(",") : activities || null,
        triggers: triggers || null,
        weather: weather || null,
        location: location || null,
        createdAt: new Date(),
      })
      .returning();

    return success(res, row, "Mood entry created.");
  } catch (err) {
    console.error("[mood/create] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when creating mood entry.",
    });
  }
});

/**
 * GET /api/mood
 * List all moods for authenticated user
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;

    const rows = await db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(sql`${moods.createdAt} DESC`);

    // Parse activities back to array if needed
    const parsed = rows.map((row) => ({
      ...row,
      activities: row.activities ? row.activities.split(",").filter(Boolean) : [],
    }));

    return success(res, parsed, "Mood entries loaded.");
  } catch (err) {
    console.error("[mood/list] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when loading mood entries.",
    });
  }
});

/**
 * GET /api/mood/stats
 * Get mood statistics for authenticated user
 */
router.get("/stats", async (req, res) => {
  try {
    const userId = req.user?.id;

    // Get all moods for stats calculation
    const rows = await db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(sql`${moods.createdAt} DESC`);

    if (rows.length === 0) {
      return success(res, {
        totalEntries: 0,
        averageRating: null,
        trend: "neutral",
        last7Days: [],
      }, "No mood data yet.");
    }

    const totalEntries = rows.length;
    const averageRating = Math.round(
      (rows.reduce((sum, r) => sum + r.rating, 0) / totalEntries) * 10
    ) / 10;

    // Last 7 entries for trend
    const last7 = rows.slice(0, 7);
    let trend = "neutral";
    if (last7.length >= 2) {
      const recent = last7.slice(0, 3).reduce((s, r) => s + r.rating, 0) / Math.min(3, last7.length);
      const older = last7.slice(-3).reduce((s, r) => s + r.rating, 0) / Math.min(3, last7.length);
      if (recent > older + 0.5) trend = "improving";
      else if (recent < older - 0.5) trend = "declining";
    }

    return success(res, {
      totalEntries,
      averageRating,
      trend,
      last7Days: last7.map((m) => ({
        rating: m.rating,
        emotion: m.emotion,
        createdAt: m.createdAt,
      })),
    }, "Mood stats loaded.");
  } catch (err) {
    console.error("[mood/stats] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when loading mood stats.",
    });
  }
});

/**
 * DELETE /api/mood/:id
 * Delete a mood entry
 */
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Check ownership
    const existing = await db
      .select()
      .from(moods)
      .where(eq(moods.id, id));

    if (existing.length === 0 || existing[0].userId !== userId) {
      return badRequest(res, "Mood entry not found or access denied.");
    }

    await db.delete(moods).where(eq(moods.id, id));

    return success(res, { id }, "Mood entry deleted.");
  } catch (err) {
    console.error("[mood/delete] Unexpected error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when deleting mood entry.",
    });
  }
});

export default router;
