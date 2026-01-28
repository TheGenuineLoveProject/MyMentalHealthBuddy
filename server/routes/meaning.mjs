// server/routes/meaning.mjs
import { Router } from "express";

const router = Router();

router.get("/future-self/prompts", (_req, res) => {
  res.json({
    ok: true,
    prompts: [
      "What would my future self thank me for today?",
      "What is one boundary that protects my peace?",
      "What is one tiny brave action I can take in the next 10 minutes?",
    ],
  });
});

router.get("/life-chapters", (_req, res) => {
  res.json({
    ok: true,
    chapters: [
      { id: "chapter_1", title: "Roots & Resilience" },
      { id: "chapter_2", title: "Learning to Regulate" },
      { id: "chapter_3", title: "Choosing Genuine Love" },
    ],
  });
});

router.get("/gratitude/daily", (_req, res) => {
  res.json({
    ok: true,
    dimension: "gratitude",
    prompt: "Name 3 small things that supported you today.",
  });
});

router.get("/contribution-map", (_req, res) => {
  res.json({
    ok: true,
    spheres: [
      { id: "self", label: "Self" },
      { id: "home", label: "Home" },
      { id: "community", label: "Community" },
    ],
  });
});

router.get("/brave-action", (_req, res) => {
  res.json({
    ok: true,
    framework: {
      name: "Brave Action",
      steps: ["Name the fear", "Pick the smallest action", "Do it gently"],
    },
  });
});

export default router;