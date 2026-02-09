// server/routes/healing.mjs
import { Router } from "express";

const router = Router();

router.get("/boundary-builder", (_req, res) => {
  res.json({
    ok: true,
    scripts: [
      "I’m not available for that, but I can do X.",
      "I need a pause. I’ll respond after I regulate.",
      "That doesn’t work for me. Here’s what does.",
    ],
  });
});

router.get("/repair-guide", (_req, res) => {
  res.json({
    ok: true,
    steps: [
      "Regulate: breathe, soften shoulders, unclench jaw.",
      "Name: what happened + what I felt (one sentence).",
      "Need: what I needed then (one sentence).",
      "Request: one clear, kind request (one sentence).",
      "Repair: one micro-action within 24 hours.",
    ],
  });
});

// Extras your logs showed being requested
router.get("/wisdom-ladder", (_req, res) => {
  res.json({ ok: true, ladders: ["Body", "Emotion", "Meaning", "Choice"] });
});

router.get("/micro-courage", (_req, res) => {
  res.json({ ok: true, steps: ["Tiny step", "10 seconds", "Repeat"] });
});

// IMPORTANT: tests expect data.mirror to be defined
router.post("/reflection-mirror", (_req, res) => {
  res.json({
    ok: true,
    mirror: "What is true? What is kind? What is next?",
  });
});

router.get("/patterns/summary", (_req, res) => {
  res.json({ ok: true, summary: "Notice → Name → Normalize → Next step" });
});

router.get("/values-compass", (_req, res) => {
  res.json({ ok: true, values: ["care", "honesty", "growth", "peace"] });
});

router.get("/emotion-translator", (_req, res) => {
  res.json({
    ok: true,
    emotions: { anger: "boundary", sadness: "care", fear: "safety" },
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "healing", status: "operational", timestamp: new Date().toISOString() });
});

export default router;