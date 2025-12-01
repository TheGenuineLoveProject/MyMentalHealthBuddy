// /server/routes/ai-dashboard.mjs
// Safe placeholder for AI dashboard so imports never break.

import express from "express";

const router = express.Router();

// Basic placeholder dashboard summary
router.get("/", (_req, res) => {
  res.json({
    ok: true,
    route: "ai-dashboard",
    summary: {
      moodScore: null,
      journalCount: 0,
      lastEntry: null,
      note: "AI dashboard placeholder (real DB-backed analytics can be wired later)."
    }
  });
});

export default router;