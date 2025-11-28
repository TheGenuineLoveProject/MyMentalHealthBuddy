import express from "express";
import { db } from "../index.mjs";
import { moods } from "../shared/schema.mjs";

const router = express.Router();

// CREATE mood entry
router.post("/", async (req, res) => {
  try {
    const { user_id, rating, content } = req.body;

    if (!user_id || !rating || !content) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const result = await db
      .insert(moods)
      .values({
        user_id,
        rating,
        content,
      })
      .returning();

    return res.json({ ok: true, mood: result[0] });
  } catch (err) {
    console.error("Error creating mood:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET all moods by user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await db
      .select()
      .from(moods)
      .where(moods.user_id.eq(userId));

    return res.json({ ok: true, moods: results });
  } catch (err) {
    console.error("Error fetching moods:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;