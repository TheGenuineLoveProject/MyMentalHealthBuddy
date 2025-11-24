// server/routes/mood.mjs

import express from "express";
import authGuard from "../middleware/auth.mjs"; // adjust path if needed
import { db } from "../db/connection.mjs";
// import { moodEntries } from "../../shared/schema.ts"; // once schema is fixed

const router = express.Router();

// GET /mood - list current user's mood entries
router.get("/", authGuard, async (req, res, next) => {
  try {
    const userId = req.user.id; // set by authGuard

    // TODO: replace with real drizzle query once schema is wired:
    // const moods = await db.select().from(moodEntries).where(eq(moodEntries.userId, userId));

    const moods = []; // temporary placeholder
    res.json({ success: true, data: moods });
  } catch (error) {
    next(error);
  }
});

// POST /mood - create a new mood entry
router.post("/", authGuard, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { mood, intensity, notes } = req.body;

    // TODO: apply Zod validation here later

    // TODO: replace with real drizzle insert once schema is wired:
    // await db.insert(moodEntries).values({
    //   userId,
    //   mood,
    //   intensity,
    //   notes,
    // });

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;