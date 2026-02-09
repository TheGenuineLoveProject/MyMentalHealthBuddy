// server/routes/praxis.mjs
import { Router } from "express";

const router = Router();

/**
 * Praxis API (tests expect these routes)
 * Mounted at: /api/praxis
 */

router.get("/resistance", (_req, res) => {
  return res.json({
    ok: true,
    patterns: [
      "Avoidance (delay/scroll/overthink)",
      "Perfectionism (waiting for 'ready')",
      "People-pleasing (yes when you mean no)",
      "Conflict-avoidance (silence to stay safe)",
      "Over-control (tight grip, no rest)",
      "Shutdown (numb, freeze, disappear)",
    ],
  });
});

router.get("/execution", (_req, res) => {
  return res.json({
    ok: true,
    frameworks: [
      "Plan → Do → Review",
      "If-Then implementation intentions",
      "Timeboxing (15–25 min focus)",
      "One next step (reduce scope)",
      "Feedback loop: measure → adjust",
      "Energy-first scheduling",
    ],
  });
});

router.get("/daily", (_req, res) => {
  // IMPORTANT: tests expect `data.daily` to be defined
  return res.json({
    ok: true,
    daily: {
      durationMinutes: 5,
      steps: [
        "Breathe: inhale 4, exhale 6 (5 cycles).",
        "Name: one feeling + one need.",
        "Choose: one tiny action (10 seconds counts).",
        "Do it now (or schedule it today).",
        "Close: one kind sentence to yourself.",
      ],
      note: "Non-clinical supportive practice.",
    },
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "praxis", status: "operational", timestamp: new Date().toISOString() });
});

export default router;