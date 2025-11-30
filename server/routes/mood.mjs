// server/routes/mood.mjs

import express from "express";
import { db } from "../db/connection.mjs";
import { moods } from "../../shared/schema.mjs";
import { success, badRequest } from "../utils/response.mjs";
import { VALID_ACTIVITIES } from "../utils/validation.mjs";

const router = express.Router();

// POST /api/mood -> create a mood entry
router.post("/", async (req, res, next) => {
  try {
    const { mood, score, activities, notes, date } = req.body || {};

    if (!mood || typeof score !== "number") {
      return badRequest(res, "Mood and score are required.", [
        { field: "mood", message: "Mood is required." },
        { field: "score", message: "Score must be a number." },
      ]);
    }

    // ensure activities are valid (if provided)
    if (Array.isArray(activities)) {
      const invalid = activities.filter(
        (a) => !VALID_ACTIVITIES.includes(a)
      );
      if (invalid.length > 0) {
        return badRequest(res, "One or more activities are invalid.", [
          {
            field: "activities",
            message: `Invalid activities: ${invalid.join(", ")}`,
          },
        ]);
      }
    }

    const [row] = await db
      .insert(moods)
      .values({
        mood,
        score,
        activities: activities ?? [],
        notes: notes ?? "",
        createdAt: date ? new Date(date) : new Date(),
      })
      .returning();

    return success(res, "Mood entry created.", row);
  } catch (err) {
    next(err);
  }
});

// GET /api/mood -> list all moods
router.get("/", async (_req, res, next) => {
  try {
    const rows = await db.select().from(moods);
    return success(res, "Mood entries loaded.", rows);
  } catch (err) {
    next(err);
  }
});

// Health check
router.get("/ping", (_req, res) => {
  return success(res, "Mood route is healthy.", { route: "mood" });
});

export default router;