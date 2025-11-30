// server/routes/analytics.mjs
import express from "express";
import { db } from "../db/connection.mjs";
import { moods, journals } from "../../shared/schema.mjs";

const router = express.Router();

// Response helpers
function success(res, data, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

function serverError(res, message = "Server error") {
  return res.status(500).json({ ok: false, error: message });
}

// Health check
router.get("/ping", (req, res) => {
  return success(res, { route: "analytics" });
});

// GET summary analytics
router.get("/summary", async (req, res) => {
  try {
    const allMoods = await db.select().from(moods);
    const allJournals = await db.select().from(journals);

    return success(res, {
      data: {
        totalMoods: allMoods.length,
        totalJournalEntries: allJournals.length,
      },
    });
  } catch (err) {
    console.error("[analytics.summary error]", err);
    return serverError(res, "Failed to fetch analytics");
  }
});

export default router;
