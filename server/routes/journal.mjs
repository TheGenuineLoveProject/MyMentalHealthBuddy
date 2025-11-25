// server/routes/journal.mjs
import express from "express";
import { db } from "../db/connection.mjs";
import { journals } from "../shared/schema.mjs";
import { authGuard } from "../middleware/auth.mjs";
import { eq, desc } from "drizzle-orm";

const router = express.Router();

// CREATE
router.post("/", authGuard, async (req, res) => {
  const { text } = req.body;

  const [entry] = await db
    .insert(journals)
    .values({
      userId: req.user.id,
      text
    })
    .returning();

  res.json({ ok: true, entry });
});

// LIST
router.get("/", authGuard, async (req, res) => {
  const list = await db
    .select()
    .from(journals)
    .where(eq(journals.userId, req.user.id))
    .orderBy(desc(journals.createdAt));

  res.json({ ok: true, list });
});

export default router;