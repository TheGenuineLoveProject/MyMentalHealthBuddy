// server/routes/mood.mjs

import express from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { moods } from "../../shared/schema.mjs";
import { eq, sql } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { createMoodSchema, updateMoodSchema, validateBody } from "../validation/schemas.mjs";
import { logger } from "../utils/logger.mjs";
import { increment } from "../utils/metrics.mjs";

const router = express.Router();

// Health check (no auth needed)
router.get("/ping", (_req, res) => {
  return success(res, { route: "mood" }, "Mood route is healthy.");
});

/**
 * GET /api/mood
 * List moods for authenticated user; returns empty for unauthenticated
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.dbUserId;
    if (!userId) {
      return success(res, [], "Sign in to view your mood history.");
    }
    const rows = await db
      .select()
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(sql`${moods.createdAt} DESC`)
      .limit(100);
    return success(res, rows, "Mood entries retrieved.");
  } catch (err) {
    logger.error("Failed to retrieve moods", { error: err.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Error retrieving mood data." });
  }
});

// Apply auth middleware to protected routes
router.use(requireAuth);

/**
 * POST /api/mood
 * Body: { rating, emotion?, content?, score?, energyLevel?, sleepQuality?, activities?, triggers?, weather?, location? }
 * User ID comes from JWT token
 */
router.post("/", validateBody(createMoodSchema), async (req, res) => {
  try {
    const userId = req.dbUserId;
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
    } = req.validatedBody;

    const [row] = await db
      .insert(moods)
      .values({
        id: randomUUID(),
        userId,
        rating: String(rating),
        emotion: emotion || null,
        content: content || null,
        score: score || rating,
        energyLevel: energyLevel || null,
        sleepQuality: sleepQuality || null,
        activities: Array.isArray(activities) ? activities.join(",") : activities || null,
        triggers: triggers || null,
        weather: weather || null,
        location: location || null,
        createdAt: new Date(),
      })
      .returning();

    increment("mood_log_created", { plan: "unknown" });
    return success(res, row, "Mood entry created.");
  } catch (err) {
    logger.error("Failed to create mood entry", { error: err.message, requestId: req.requestId });
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when creating mood entry.",
    });
  }
});


/**
 * GET /api/mood/stats
 * Get mood statistics for authenticated user
 */
router.get("/stats", async (req, res) => {
  try {
    const userId = req.dbUserId;

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
      (rows.reduce((sum, r) => sum + Number(r.rating), 0) / totalEntries) * 10
    ) / 10;

    const last7 = rows.slice(0, 7);
    let trend = "neutral";
    if (last7.length >= 2) {
      const recent = last7.slice(0, 3).reduce((s, r) => s + Number(r.rating), 0) / Math.min(3, last7.length);
      const older = last7.slice(-3).reduce((s, r) => s + Number(r.rating), 0) / Math.min(3, last7.length);
      if (recent > older + 0.5) trend = "improving";
      else if (recent < older - 0.5) trend = "declining";
    }

    return success(res, {
      totalEntries,
      averageRating,
      trend,
      last7Days: last7.map((m) => ({
        rating: Number(m.rating),
        emotion: m.emotion,
        createdAt: m.createdAt,
      })),
    }, "Mood stats loaded.");
  } catch (err) {
    logger.error("Failed to get mood stats", { error: err.message, requestId: req.requestId });
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when loading mood stats.",
    });
  }
});

/**
 * PUT /api/mood/:id
 * Update a mood entry
 */
router.put("/:id", validateBody(updateMoodSchema), async (req, res) => {
  try {
    const userId = req.dbUserId;
    const { id } = req.params;
    const updates = req.validatedBody;

    const existing = await db
      .select()
      .from(moods)
      .where(eq(moods.id, id));

    if (existing.length === 0 || existing[0].userId !== userId) {
      return badRequest(res, "Mood entry not found or access denied.");
    }

    if (updates.activities) {
      updates.activities = Array.isArray(updates.activities) 
        ? updates.activities.join(",") 
        : updates.activities;
    }

    if (updates.rating !== undefined) {
      updates.rating = String(updates.rating);
    }

    const [updated] = await db
      .update(moods)
      .set(updates)
      .where(eq(moods.id, id))
      .returning();

    return success(res, updated, "Mood entry updated.");
  } catch (err) {
    logger.error("Failed to update mood entry", { error: err.message, requestId: req.requestId });
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when updating mood entry.",
    });
  }
});

/**
 * DELETE /api/mood/:id
 * Delete a mood entry
 */
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.dbUserId;
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
    logger.error("Failed to delete mood entry", { error: err.message, requestId: req.requestId });
    return res.status(500).json({
      ok: false,
      message: "Unexpected error when deleting mood entry.",
    });
  }
});

export default router;
