// server/routes/content.mjs
import { Router } from "express";
import { logger } from "../utils/logger.mjs";
import {
  contentGenerateSchema,
  normalizeGenerateInput,
  slugify,
} from "../contracts/content/b1-content-contract.mjs";
import { validateBody } from "../middleware/validate-body.mjs";

const router = Router();

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

router.post("/generate", validateBody(contentGenerateSchema), (req, res) => {
  try {
    const input = req.validatedBody || req.body || {};
    const topic = input.topic || input.prompt || "Genuine Love Practice";
    const tone = input.tone || "warm, evidence-based, non-clinical";

    const normalized = normalizeGenerateInput(input, "system");

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

    const meta = {
      id: normalized.id,
      slug: normalized.slug,
      domain: normalized.domain,
      visibility: normalized.visibility,
      category: normalized.category,
      tags: normalized.tags,
      canonicalUrl: normalized.canonicalUrl,
      status: normalized.status,
      updatedAt: normalized.updatedAt,
    };

    return res.json({
      ok: true,
      outputCount: FORMATS.length,
      outputs,
      meta,
    });
  } catch (err) {
    logger.error("Content generation failed", { error: err?.message || err });
    return res.status(500).json({ ok: false, message: "Generate failed." });
  }
});

router.get("/", (req, res) => {
  res.json({ ok: true, module: "content", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
