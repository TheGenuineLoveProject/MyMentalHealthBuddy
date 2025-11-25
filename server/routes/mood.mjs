// server/routes/mood.mjs
import express from "express";
import { db } from "../db/connection.mjs";
import { moodEntries } from "../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";
import { authGuard } from "../middleware/auth.mjs";

const router = express.Router();

// CREATE MOOD ENTRY
router.post("/", authGuard, async (req, res) => {
  const { mood, notes } = req.body;

  const [entry] = await db
    .insert(moodEntries)
    .values({
      userId: req.user.id,
      mood,
      note: notes
    })
    .returning();

  res.json({ ok: true, entry });
});

// GET HISTORY
router.get("/history", authGuard, async (req, res) => {
  const history = await db
    .select()
    .from(moodEntries)
    .where(eq(moodEntries.userId, req.user.id))
    .orderBy(desc(moodEntries.createdAt));

  res.json({ ok: true, history });
});

export default router;