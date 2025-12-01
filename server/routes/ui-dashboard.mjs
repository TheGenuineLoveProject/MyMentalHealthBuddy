// server/routes/ui-dashboard.mjs
// Safe placeholder route for UI dashboard data.

import express from "express";

const router = express.Router();

/**
 * GET /api/ui-dashboard
 * Returns a safe placeholder summary so the front-end never breaks.
 */
router.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "UI dashboard placeholder (replace with real stats later).",
    data: {
      moodSummary: {
        averageMoodLast7Days: null,
        entriesLast7Days: 0,
      },
      journalSummary: {
        totalEntries: 0,
      },
      analyticsSummary: {
        checkinsLast30Days: 0,
      },
    },
  });
});

export default router;