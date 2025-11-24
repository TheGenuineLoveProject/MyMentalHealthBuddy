import { users, moodEntries, journalEntries, subscriptions } 
  from "../shared/schema.mjs";
import { Router } from "express";
import { db } from "../db/connection.mjs";

import authGuard from "../middleware/auth.mjs";
// journal.mjs


const router = Router();

router.post("/", authGuard, async (req, res) => {
  const { title, content } = req.body;

  const [entry] = await db.insert(journalEntries).values({
    userId: req.user.userId,
    title,
    content
  }).returning();

  res.json(entry);
});

router.get("/", authGuard, async (req, res) => {
  const entries = await db.select().from(journalEntries);
  res.json(entries);
});

export default router;
