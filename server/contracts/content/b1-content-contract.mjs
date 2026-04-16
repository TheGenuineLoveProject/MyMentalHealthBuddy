/**
 * ============================================================================
 * B1 CONTENT GENERATE-INPUT CONTRACT
 * ============================================================================
 * AUTHORITY: POST /api/content/generate request validation ONLY.
 * This file is NOT the canonical persisted entity schema.
 * For CRUD entity validation, see: server/contracts/content-model.schema.mjs
 *
 * Exports:
 *   - B1ContentGenerateSchema  → /generate input validation
 *   - contentGenerateSchema    → alias (backward compat)
 *   - B1ContentEntitySchema    → draft entity shape for normalization
 *   - normalizeGenerateInput() → transforms raw input → B1 entity seed
 *   - slugify(), summarize(), createAudit() → helpers
 * ============================================================================
 */
import { randomUUID } from "node:crypto";
import { z } from "zod";

export const CONTENT_STATUS = [
  "idea",
  "draft",
  "review",
  "approved",
  "scheduled",
  "published",
  "archived",
];

export const CONTENT_DOMAIN = [
  "HEALING_DOMAIN",
  "BUSINESS_DOMAIN",
  "PLATFORM_DOMAIN",
  "DESIGN_DOMAIN",
  "RESEARCH_DOMAIN",
];

export const CONTENT_VISIBILITY = [
  "public",
  "subscribers",
  "plan_gated",
  "internal",
];

const monetizationPatterns = [
  /\bbuy now\b/i,
  /\blimited time\b/i,
  /\bdiscount\b/i,
  /\bact now\b/i,
  /\bsubscribe now\b/i,
  /\bupgrade now\b/i,
  /\bstart your trial\b/i,
  /\bfree trial\b/i,
  /\bsale\b/i,
  /\bcheckout\b/i,
  /\bbook now\b/i,
  /\bpromo code\b/i,
  /\bspecial offer\b/i,
  /\bpurchase\b/i,
  /\bupgrade your plan\b/i,
  /\border now\b/i,
  /\bexclusive deal\b/i,
  /\bsign up now\b/i,
];

const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .transform((v) => v.toLowerCase().replace(/\s+/g, "-"));

const seoSchema = z
  .object({
    title: z.string().trim().min(10).max(70),
    metaDescription: z.string().trim().min(120).max(160),
    ogTitle: z.string().trim().min(1).max(95),
    ogDescription: z.string().trim().min(1).max(200),
    ogImage: z.string().trim().url(),
    robots: z
      .enum([
        "index, follow",
        "noindex, follow",
        "index, nofollow",
        "noindex, nofollow",
      ])
      .default("index, follow"),
    schemaType: z.enum([
      "Article",
      "BlogPosting",
      "WebPage",
      "FAQPage",
      "HowTo",
      "MedicalWebPage",
      "EducationalOccupationalProgram",
    ]),
  })
  .strict();

const auditTransitionSchema = z.object({
  from: z.string(),
  to: z.string(),
  by: z.string(),
  at: z.string().datetime(),
  reason: z.string().nullable().optional(),
});

const auditQaResultSchema = z.object({
  checked_at: z.string().datetime(),
  checked_by: z.string(),
  result: z.enum(["pass", "fail"]),
  blocks: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

const auditDistributionLogSchema = z.object({
  channel: z.enum([
    "newsletter",
    "twitter",
    "instagram",
    "linkedin",
    "facebook",
    "threads",
  ]),
  action: z.enum(["sent", "scheduled", "failed", "cancelled"]),
  at: z.string().datetime(),
  by: z.string(),
  details: z.string().nullable().optional(),
});

export const B1AuditSchema = z.object({
  created_by: z.string().trim().min(1),
  created_at: z.string().datetime(),
  updated_by: z.string().trim().min(1),
  updated_at: z.string().datetime(),
  published_by: z.string().trim().min(1).nullable().optional(),
  published_at: z.string().datetime().nullable().optional(),
  archived_by: z.string().trim().min(1).nullable().optional(),
  archived_at: z.string().datetime().nullable().optional(),
  version: z.number().int().min(1),
  transitions: z.array(auditTransitionSchema).default([]),
  qa_results: z.array(auditQaResultSchema).default([]),
  distribution_log: z.array(auditDistributionLogSchema).default([]),
});

export const B1ContentEntitySchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(5).max(200),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .min(3)
      .max(100),
    summary: z.string().trim().min(20).max(300),
    body: z.string().trim().min(1),
    status: z.enum(CONTENT_STATUS),
    author: z.string().trim().min(1),
    domain: z.enum(CONTENT_DOMAIN),
    tags: z.array(tagSchema).max(10).optional().default([]),
    category: z.string().trim().min(1).max(100).nullable().optional(),
    seo: seoSchema.optional(),
    publishAt: z.string().datetime().nullable().optional(),
    updatedAt: z.string().datetime(),
    canonicalUrl: z.string().trim().nullable().optional(),
    visibility: z.enum(CONTENT_VISIBILITY),
    distribution: z.record(z.any()).optional().default({}),
    audit: B1AuditSchema,
  })
  .superRefine((data, ctx) => {
    const combined = [data.title, data.summary, data.body].filter(Boolean).join(" ");

    if (data.domain === "HEALING_DOMAIN") {
      for (const pattern of monetizationPatterns) {
        if (pattern.test(combined)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["body"],
            message: `HEALING_DOMAIN content contains forbidden monetization language: ${pattern}`,
          });
          break;
        }
      }
    }

    if (data.status === "scheduled") {
      if (!data.publishAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["publishAt"],
          message: "publishAt is required when status is scheduled",
        });
      } else if (new Date(data.publishAt).getTime() <= Date.now()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["publishAt"],
          message: "publishAt must be in the future when status is scheduled",
        });
      }
    }

    if (["approved", "scheduled", "published"].includes(data.status) && !data.seo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["seo"],
        message: "seo is required before approved, scheduled, or published status",
      });
    }

    if (["published", "scheduled", "approved"].includes(data.status) && !data.canonicalUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["canonicalUrl"],
        message: "canonicalUrl is required before approved, scheduled, or published status",
      });
    }
  });

export const B1ContentGenerateSchema = z
  .object({
    topic: z.string().trim().min(3).max(200).optional(),
    prompt: z.string().trim().min(3).max(5000).optional(),
    tone: z.string().trim().min(3).max(120).optional(),
    domain: z.enum(CONTENT_DOMAIN).default("HEALING_DOMAIN"),
    visibility: z.enum(CONTENT_VISIBILITY).default("public"),
    tags: z.array(tagSchema).max(10).optional().default([]),
    category: z.string().trim().min(1).max(100).nullable().optional(),
    canonicalUrl: z.string().trim().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const source = `${data.topic || ""} ${data.prompt || ""}`.trim();

    if (data.domain === "HEALING_DOMAIN") {
      for (const pattern of monetizationPatterns) {
        if (pattern.test(source)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["prompt"],
            message: `HEALING_DOMAIN input contains forbidden monetization language: ${pattern}`,
          });
          break;
        }
      }
    }
  });

export function slugify(input = "") {
  const base = String(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);

  return base || "content-item";
}

export function summarize(input = "", max = 300) {
  const plain = String(input)
    .replace(/[#>*_`[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return "Draft content generated from the current request.";
  return plain.length <= max ? plain : `${plain.slice(0, max - 1).trim()}…`;
}

export function createAudit(userId = "system") {
  const now = new Date().toISOString();
  return {
    created_by: userId,
    created_at: now,
    updated_by: userId,
    updated_at: now,
    published_by: null,
    published_at: null,
    archived_by: null,
    archived_at: null,
    version: 1,
    transitions: [],
    qa_results: [],
    distribution_log: [],
  };
}

export function normalizeGenerateInput(input = {}, userId = "system") {
  const rawTopic = String(input.topic || input.prompt || "Genuine Love Practice").trim();
  const topic = rawTopic.length < 5 ? `${rawTopic} — wellness draft` : rawTopic;
  const tone = String(input.tone || "warm, evidence-based, non-clinical").trim();
  const body = `# ${topic}

Tone: ${tone}

This is a draft content seed generated at the API boundary so downstream publishing, SEO, audit, and distribution layers receive a B1-shaped entity.`;

  const category = input.category ?? null;
  const slug = slugify(topic);
  const summary = summarize(input.prompt || topic, 300);

  const entity = {
    id: randomUUID(),
    title: topic.slice(0, 200),
    slug,
    summary: summary.length < 20 ? `${summary} draft content seed.` : summary,
    body,
    status: "draft",
    author: userId,
    domain: input.domain || "HEALING_DOMAIN",
    tags: Array.isArray(input.tags) ? input.tags.slice(0, 10) : [],
    category,
    seo: undefined,
    publishAt: null,
    updatedAt: new Date().toISOString(),
    canonicalUrl: input.canonicalUrl ?? null,
    visibility: input.visibility || "public",
    distribution: {},
    audit: createAudit(userId),
  };

  return B1ContentEntitySchema.parse(entity);
}

export const contentGenerateSchema = B1ContentGenerateSchema;
