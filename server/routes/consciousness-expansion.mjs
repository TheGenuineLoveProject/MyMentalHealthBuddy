// server/routes/meaning.mjs
import express from "express";

const router = express.Router();

/**
 * Tests expect these to return 200 + { ok: true, ... }:
 * - GET /api/meaning/brave-action
 * - GET /api/meaning/contribution-map
 * - GET /api/meaning/gratitude/daily
 * - GET /api/meaning/future-self/prompts
 * - GET /api/meaning/life-chapters
 */

router.get("/brave-action", (_req, res) => {
  return res.status(200).json({
    ok: true,
    framework: {
      name: "Brave Action Framework",
      steps: [
        { id: 1, title: "Name the fear", prompt: "What exactly am I afraid will happen?" },
        { id: 2, title: "Choose a value", prompt: "Which value do I want to act from right now?" },
        { id: 3, title: "Pick the smallest brave step", prompt: "What is the smallest action that honors my value?" },
        { id: 4, title: "Create safety supports", prompt: "What support or boundary makes this doable?" },
        { id: 5, title: "Do it + reflect", prompt: "What did I learn, and what’s the next tiny step?" },
      ],
      notes: [
        "Keep it small enough to succeed today.",
        "A brave action is value-aligned, not fear-free.",
      ],
    },
  });
});

router.get("/contribution-map", (_req, res) => {
  return res.status(200).json({
    ok: true,
    spheres: [
      { id: "self", title: "Self", prompt: "What helps me stay regulated and resourced?" },
      { id: "home", title: "Home", prompt: "What small improvement would reduce friction at home?" },
      { id: "relationships", title: "Relationships", prompt: "Who needs repair, appreciation, or clarity?" },
      { id: "work", title: "Work/Service", prompt: "Where can I contribute meaningfully this week?" },
      { id: "community", title: "Community", prompt: "What local/online space can I support?" },
      { id: "planet", title: "Planet", prompt: "What is one earth-kind choice I can make today?" },
    ],
  });
});

router.get("/gratitude/daily", (_req, res) => {
  return res.status(200).json({
    ok: true,
    dimension: {
      name: "Daily Gratitude Dimension",
      prompts: [
        "What is one small thing that went right today?",
        "Who supported me (directly or indirectly) today?",
        "What did my body do for me today that I can appreciate?",
        "What is one lesson or growth moment I can honor today?",
      ],
      microPractice: "Take 3 slow breaths. Name 1 thing. Feel it for 10 seconds.",
    },
  });
});

// ✅ FIX: /api/meaning/future-self/prompts must exist
router.get("/future-self/prompts", (_req, res) => {
  return res.status(200).json({
    ok: true,
    prompts: [
      "Six months from now, what would my future self thank me for starting today?",
      "What is one boundary my future self would be proud I protected?",
      "If my future self could send one sentence of encouragement, what would it say?",
      "What is one habit (tiny) that would compound into a calmer life?",
      "What is one relationship repair my future self would celebrate?",
      "What is one fear I can befriend with a small brave step?",
    ],
  });
});

// ✅ FIX: /api/meaning/life-chapters must exist
router.get("/life-chapters", (_req, res) => {
  return res.status(200).json({
    ok: true,
    chapters: [
      { id: 1, title: "Origins", prompt: "What did I learn early about love, safety, and belonging?" },
      { id: 2, title: "Survival & Strength", prompt: "What helped me keep going when things were hard?" },
      { id: 3, title: "Turning Points", prompt: "What moments changed my direction or identity?" },
      { id: 4, title: "Healing & Integration", prompt: "What helped me soften, grow, or reconnect to myself?" },
      { id: 5, title: "Values & Purpose", prompt: "What matters most now, and why?" },
      { id: 6, title: "The Chapter I’m Writing", prompt: "What is the theme of my current season?" },
      { id: 7, title: "Next Chapter", prompt: "What do I want to build, protect, and become?" },
    ],
  });
});

export default router;