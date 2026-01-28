// server/routes/socio-ecology.mjs
import { Router } from "express";

const router = Router();

/**
 * Socio-Ecology API
 * Mounted at: /api/socio-ecology
 * Tests expect:
 * - GET /daily
 * - GET /planetary-ethics
 * - GET /regenerative
 */

router.get("/daily", (_req, res) => {
  return res.json({
    ok: true,
    daily: {
      durationMinutes: 7,
      practice: [
        "Notice: one place you interact with people/nature today (home, street, store, online).",
        "Ask: 'What do I need to feel safe and steady here?'",
        "Choose 1 micro-action: pick up 3 pieces of trash OR hold a door OR send one kind message.",
        "Boundary: do one 'no' that protects your energy (skip doomscrolling for 10 minutes).",
        "Repair: if you caused friction, do one small repair (apology, clarification, gratitude).",
        "Close: name one community/nature thing you appreciate.",
      ],
      note: "Supportive reflection, not clinical advice.",
    },
  });
});

router.get("/planetary-ethics", (_req, res) => {
  return res.json({
    ok: true,
    frameworks: [
      "Do no harm (people, planet, future generations)",
      "Precautionary principle",
      "Interdependence + systems thinking",
      "Environmental justice",
      "Commons stewardship",
    ],
  });
});

router.get("/regenerative", (_req, res) => {
  return res.json({
    ok: true,
    visions: [
      "Circular economy (repair, reuse, compost)",
      "Community mutual aid + care networks",
      "Local food resilience (gardens, co-ops)",
      "Clean energy transition with equity",
      "Restored ecosystems (rivers, soil, biodiversity)",
    ],
  });
});

export default router;