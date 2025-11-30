// server/routes/analytics.mjs
import { Router } from "express";
import { db } from "../db/connection.mjs";
import { moods, journals } from "../../shared/schema.ts"; // FIXED SCHEMA IMPORT

const router = Router();

// Example analytics
router.get("/summary", async (_req, res) => {
  try {
    const moodCount = await db.select().from(moods);
    const journalCount = await db.select().from(journals);

    return res.json({
      ok: true,
      data: {
        totalMoods: moodCount.length,
        totalJournalEntries: journalCount.length,
      },
    });
  } catch (err) {
    console.error("[analytics.error]", err);
    return res.status(500).json({ ok: false, error: "Analytics failed" });
  }
});

export default router;