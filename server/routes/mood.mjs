// server/routes/mood.mjs

import express from "express";
import { db } from "../db/connection.mjs";
import { schema } from "../../shared/schema.mjs";
import { VALID_ACTIVITIES } from "../utils/validation.mjs";
import { success, badRequest } from "../services/response.mjs";

const router = express.Router();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function validateMoodPayload(body = {}) {
  const errors = [];

  const score = Number(body.score);
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const activities = Array.isArray(body.activities) ? body.activities : [];

  if (!Number.isFinite(score) || score < 1 || score > 10) {
    errors.push({
      field: "score",
      message: "Score must be a number between 1 and 10",
    });
  }

  if (note.length === 0) {
    errors.push({
      field: "note",
      message: "Please add a short note about how you feel",
    });
  }

  // Ensure every activity is from our allowed list
  const invalidActivities = activities.filter(
    (a) => !VALID_ACTIVITIES.includes(a)
  );
  if (invalidActivities.length > 0) {
    errors.push({
      field: "activities",
      message: `Invalid activities: ${invalidActivities.join(
        ", "
      )}. Allowed: ${VALID_ACTIVITIES.join(", ")}`,
    });
  }

  return {
    ok: errors.length === 0,
    score,
    note,
    activities,
    errors,
  };
}

function badRequest(res, message, errors = []) {
  // FIXES: validation errors were being discarded before
  return res.status(400).json({
    ok: false,
    error: message,
    validationErrors: errors,
  });
}

// ─────────────────────────────────────────────
// Routes
// Base path (mounted in index.mjs): /api/mood
// ─────────────────────────────────────────────

// Get recent moods
router.get("/", async (req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT id, user_id, score, note, activities, created_at
      FROM moods
      ORDER BY created_at DESC
      LIMIT 30
    `);

    return res.json({
      ok: true,
      moods: result.rows ?? [],
    });
  } catch (err) {
    console.error("[mood.get] error:", err);
    return res.status(500).json({
      ok: false,
      error: "Failed to load mood entries",
    });
  }
});

// Create a new mood entry
router.post("/", async (req, res) => {
  const { ok, score, note, activities, errors } = validateMoodPayload(
    req.body || {}
  );

  if (!ok) {
    return badRequest(res, "Validation failed", errors);
  }

  // If you later wire auth + req.user.id, plug it in here:
  const userId = null; // or req.user?.id when auth middleware is ready

  try {
    const inserted = await db.execute(sql`
      INSERT INTO moods (user_id, score, note, activities)
      VALUES (${userId}, ${score}, ${note}, ${JSON.stringify(activities)})
      RETURNING id, user_id, score, note, activities, created_at
    `);

    const mood = inserted.rows[0];

    return res.status(201).json({
      ok: true,
      mood,
    });
  } catch (err) {
    console.error("[mood.post] error:", err);
    return res.status(500).json({
      ok: false,
      error: "Failed to save mood entry",
    });
  }
});

export default router;