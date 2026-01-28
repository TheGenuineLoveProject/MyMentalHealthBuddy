// server/routes/post-trauma.mjs
import { Router } from "express";

const router = Router();

/**
 * Post-Trauma API
 * Tests expect these endpoints to exist and return 200 + { ok: true, ... }
 */

router.get("/growth-domains", (_req, res) => {
  return res.json({
    ok: true,
    domains: [
      "Appreciation of life",
      "Relationships",
      "Personal strength",
      "New possibilities",
      "Spiritual/existential change",
    ],
  });
});

router.get("/modalities", (_req, res) => {
  return res.json({
    ok: true,
    modalities: [
      "Grounding + breathwork",
      "Somatic tracking",
      "Journaling + narrative processing",
      "Skills practice (CBT-style)",
      "Mindfulness + self-compassion",
      "Movement + routine stabilization",
    ],
  });
});

router.get("/daily", (_req, res) => {
  return res.json({
    ok: true,
    daily: {
      durationMinutes: 7,
      steps: [
        "1 minute: breathe low + slow (inhale 4, exhale 6)",
        "1 minute: name 3 sensations in your body",
        "2 minutes: write one sentence: 'Today I feel…'",
        "2 minutes: choose one kind boundary or need",
        "1 minute: one tiny action (10 seconds counts)",
      ],
      note: "Non-clinical supportive practice.",
    },
  });
});

export default router;