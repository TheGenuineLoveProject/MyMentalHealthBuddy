import * as schema from '../shared/schema.mjs';
import { Router } from "express";
import { db } from "../db/connection.mjs";

import authGuard from "../middleware/auth.mjs";
// mood.mjs


const router = Router();

router.post("/", authGuard, async (req, res) => {
  const { mood, intensity, notes } = req.body;

  const [entry] = await db.insert(moodEntries).values({
    userId: req.user.userId,
    mood,
    intensity,
    notes
  }).returning();

  res.json(entry);
});

router.get("/history", authGuard, async (req, res) => {
  const rows = await db.select().from(moodEntries);
  res.json(rows);
});

export default router;
