// server/routes/journal.mjs
import express from "express";
import { db } from "../db/connection.mjs";
import { journals } from "../shared/schema.mjs";
import { authGuard } from "../middleware/auth.mjs";
import { eq, desc } from "drizzle-orm";

const router = express.Router();

// Health check
router.get("/ping", (req, res) => res.json({ ok: true, route: "journal" }));

// CREATE - requires authentication
router.post("/", authGuard, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ ok: false, error: "Journal text is required" });
    }

    const userId = req.user.id;

    const [entry] = await db
      .insert(journals)
      .values({
        userId,
        text: text.trim()
      })
      .returning();

    res.json({ ok: true, entry });
  } catch (err) {
    console.error("Error creating journal entry:", err);
    res.status(500).json({ ok: false, error: "Failed to save journal entry" });
  }
});

// LIST - requires authentication
router.get("/", authGuard, async (req, res) => {
  try {
    const userId = req.user.id;

    const list = await db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt))
      .limit(50);

    res.json({ ok: true, list: list || [] });
  } catch (err) {
    console.error("Error fetching journal entries:", err);
    res.status(500).json({ ok: false, list: [], error: "Failed to fetch journal entries" });
  }
});

export default router;