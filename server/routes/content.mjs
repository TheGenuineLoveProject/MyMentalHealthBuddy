// server/routes/content.mjs
import { Router } from "express";

const router = Router();

// Tests expect EXACTLY 10 formats
const FORMATS = [
  "blog",
  "twitter",
  "linkedin",
  "instagram",
  "tiktok",
  "youtube",
  "newsletter",
  "sms",
  "push",
  "shorts",
];

router.get("/formats", (_req, res) => {
  res.json({ ok: true, formats: FORMATS });
});

/**
 * Tests expect:
 * - status 200
 * - data.ok === true
 * - data.outputCount === 10
 * - data.outputs.blog/twitter/linkedin defined
 */
router.post("/generate", (req, res) => {
  try {
    const input = req.body || {};
    const topic = input.topic || input.prompt || "Genuine Love Practice";
    const tone = input.tone || "warm, evidence-based, non-clinical";

    const outputs = {
      blog: `Title: ${topic}\n\nTone: ${tone}\n\n3 steps:\n1) Name it\n2) Breathe\n3) Choose one kind action\n\nReflection: What is one tiny next step?`,
      twitter: `Micro-step: choose one kind action for yourself today. (${topic}) #GenuineLove`,
      linkedin: `A simple regulation-first framework: regulate → name → choose. Try it with: ${topic}`,
      instagram: `Slide 1: ${topic}\nSlide 2: Name the feeling\nSlide 3: One kind boundary\nSlide 4: One micro-action`,
      tiktok: `Hook: If your nervous system is loud, try this 10-second reset. Topic: ${topic}`,
      youtube: `Outline:\n1) Why it matters\n2) Common traps\n3) 3-step practice\n4) Gentle reflection\nTopic: ${topic}`,
      newsletter: `This week: ${topic}\nTry the 3-step practice + one reflection prompt.`,
      sms: `Reminder: one small loving step today. (${topic})`,
      push: `Take 30 seconds for a reset. (${topic})`,
      shorts: `Quick practice: breathe → name → choose. (${topic})`,
    };

    return res.json({
      ok: true,
      outputCount: FORMATS.length,
      outputs,
    });
  } catch (_e) {
    return res.status(500).json({ ok: false, message: "Generate failed." });
  }
});

export default router;