import { Router } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.mjs";
import {
  requireValidContentModel,
  requireValidContentPatch,
} from "../middleware/validate-content-model.mjs";
import { validateContentModel } from "../contracts/content-model.schema.mjs";
import {
  contentGenerateSchema,
  normalizeGenerateInput,
} from "../contracts/content/b1-content-contract.mjs";
import { validateBody } from "../middleware/validate-body.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";

const router = Router();

const contentStore = new Map();

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

router.post("/validate", requireValidContentModel, (req, res) => {
  return res.json({
    ok: true,
    contract: "CONTENT_MODEL_CONTRACT",
    message: "Payload is valid",
    item: req.validatedContent,
  });
});

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    module: "content",
    validator: "CONTENT_MODEL_CONTRACT",
    status: "operational",
    now: new Date().toISOString(),
    count: contentStore.size,
  });
});

router.get("/items", (_req, res) => {
  const items = Array.from(contentStore.values());
  res.json({ ok: true, count: items.length, items });
});

router.get("/items/:id", (req, res) => {
  const item = contentStore.get(req.params.id);
  if (!item) {
    return res.status(404).json({ ok: false, message: "Content not found" });
  }
  return res.json({ ok: true, item });
});

router.post("/items", requireAuth, requireAdmin, requireValidContentModel, (req, res) => {
  const content = req.validatedContent;

  if (contentStore.has(content.id)) {
    return res.status(409).json({ ok: false, message: "Content with this id already exists" });
  }

  const slugCollision = Array.from(contentStore.values()).find(
    (item) => item.slug === content.slug
  );

  if (slugCollision) {
    return res.status(409).json({ ok: false, message: "Slug already exists", field: "slug" });
  }

  contentStore.set(content.id, content);

  return res.status(201).json({
    ok: true,
    contract: "CONTENT_MODEL_CONTRACT",
    item: content,
  });
});

router.patch("/items/:id", requireAuth, requireAdmin, requireValidContentPatch, (req, res) => {
  const existing = contentStore.get(req.params.id);

  if (!existing) {
    return res.status(404).json({ ok: false, message: "Content not found" });
  }

  const merged = {
    ...existing,
    ...req.validatedContentPatch,
    audit: {
      ...existing.audit,
      ...(req.validatedContentPatch.audit || {}),
    },
    distribution: {
      ...(existing.distribution || {}),
      ...(req.validatedContentPatch.distribution || {}),
    },
    seo: req.validatedContentPatch.seo
      ? { ...(existing.seo || {}), ...req.validatedContentPatch.seo }
      : existing.seo,
  };

  const result = validateContentModel(merged);

  if (!result.success) {
    return res.status(400).json({
      ok: false,
      message: "Merged content failed CONTENT_MODEL_CONTRACT validation",
      contract: "CONTENT_MODEL_CONTRACT",
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
    });
  }

  const slugCollision = Array.from(contentStore.values()).find(
    (item) => item.id !== req.params.id && item.slug === result.data.slug
  );

  if (slugCollision) {
    return res.status(409).json({ ok: false, message: "Slug already exists", field: "slug" });
  }

  contentStore.set(req.params.id, result.data);

  return res.json({
    ok: true,
    contract: "CONTENT_MODEL_CONTRACT",
    item: result.data,
  });
});

router.post("/seed-demo", requireAuth, requireAdmin, (_req, res) => {
  const now = new Date().toISOString();
  const id = randomUUID();

  const demo = {
    id,
    title: "A grounded practice for settling your nervous system",
    slug: "a-grounded-practice-for-settling-your-nervous-system",
    summary:
      "A simple educational reflection that helps readers understand one calming practice without making clinical or exaggerated claims.",
    body:
      "This educational article walks through a simple grounding practice for moments of stress. It is not a substitute for therapy or crisis care. Step one is to pause. Step two is to notice your breath. Step three is to name one feeling and one need. Step four is to choose one kind, realistic next action. If you are in crisis, use emergency support resources immediately.",
    status: "draft",
    author: "system-demo-author",
    domain: "HEALING_DOMAIN",
    tags: ["grounding", "nervous-system", "self-regulation"],
    category: "healing-tools",
    seo: {
      title: "Grounding practice for nervous system regulation",
      metaDescription:
        "Learn a grounded, educational nervous system practice that supports self-awareness and gentle regulation without hype, manipulation, or clinical overreach.",
      ogTitle: "Grounding practice for nervous system regulation",
      ogDescription:
        "A calm, educational guide to one grounding practice that supports self-awareness, reflection, and gentle nervous system regulation.",
      ogImage: "https://mymentalhealthbuddy.com/images/grounding-practice.png",
      robots: "index, follow",
      schemaType: "Article",
    },
    publishAt: null,
    updatedAt: now,
    canonicalUrl:
      "/healing-tools/a-grounded-practice-for-settling-your-nervous-system",
    visibility: "public",
    distribution: {
      newsletter: {
        eligible: true,
        sent: false,
        sentAt: null,
        audience: "all_subscribers",
        segmentId: null,
        subject: null,
        campaignId: null,
      },
      social: {
        eligible: true,
        channels: ["twitter", "linkedin"],
        posts: [],
      },
    },
    audit: {
      created_by: "system-demo-author",
      created_at: now,
      updated_by: "system-demo-author",
      updated_at: now,
      published_by: null,
      published_at: null,
      archived_by: null,
      archived_at: null,
      version: 1,
      transitions: [],
      qa_results: [],
      distribution_log: [],
    },
  };

  contentStore.set(id, demo);

  res.status(201).json({
    ok: true,
    contract: "CONTENT_MODEL_CONTRACT",
    item: demo,
  });
});

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    module: "content",
    status: "operational",
    timestamp: new Date().toISOString(),
  });
});

export default router;
