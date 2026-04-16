/**
 * ============================================================================
 * CANONICAL B1 CONTENT ENTITY SCHEMA — SINGLE SOURCE OF TRUTH
 * ============================================================================
 * AUTHORITY: All persisted content entity validation (CRUD create/patch).
 * This file owns the shape of every stored content record.
 * For /generate request-input validation, see:
 *   server/contracts/content/b1-content-contract.mjs
 *
 * Consumed by:
 *   - server/middleware/validate-content-model.mjs (requireValidContentModel)
 *   - server/routes/content.mjs (/validate, /items CRUD)
 * ============================================================================
 */
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

export const SEO_SCHEMA_TYPES = [
  "Article",
  "BlogPosting",
  "WebPage",
  "FAQPage",
  "HowTo",
  "MedicalWebPage",
  "EducationalOccupationalProgram",
];

const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const tagPattern = /^[a-z0-9-]{1,50}$/;

const reservedSlugs = new Set([
  "admin",
  "api",
  "auth",
  "billing",
  "command",
  "crisis",
  "health",
  "login",
  "register",
  "settings",
  "ws",
]);

const safePlainText = (value) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !/[<>]/.test(value);

const noUnsafeHtml = (value) => {
  if (typeof value !== "string") return false;
  const blocked =
    /<script\b|<\/script>|on\w+\s*=|javascript:|<iframe\b|<\/iframe>|<object\b|<embed\b/i;
  return !blocked.test(value);
};

const noManipulativeHealingCta = (value) => {
  if (typeof value !== "string") return true;
  const blocked =
    /\b(buy now|subscribe now|upgrade now|limited time|last chance|act now|start your paid plan|checkout now)\b/i;
  return !blocked.test(value);
};

const noClinicalClaims = (value) => {
  if (typeof value !== "string") return true;
  const blocked =
    /\b(cures?|guaranteed recovery|replaces therapy|diagnose|diagnosis|clinically proven to cure)\b/i;
  return !blocked.test(value);
};

export const seoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "seo.title must be at least 10 characters")
    .max(70, "seo.title must be at most 70 characters"),

  metaDescription: z
    .string()
    .trim()
    .min(120, "seo.metaDescription must be at least 120 characters")
    .max(160, "seo.metaDescription must be at most 160 characters")
    .refine(noClinicalClaims, "seo.metaDescription contains prohibited clinical claims"),

  ogTitle: z
    .string()
    .trim()
    .min(1, "seo.ogTitle is required")
    .max(95, "seo.ogTitle must be at most 95 characters"),

  ogDescription: z
    .string()
    .trim()
    .min(1, "seo.ogDescription is required")
    .max(200, "seo.ogDescription must be at most 200 characters")
    .refine(noClinicalClaims, "seo.ogDescription contains prohibited clinical claims"),

  ogImage: z
    .string()
    .trim()
    .url("seo.ogImage must be a valid absolute URL"),

  robots: z
    .enum([
      "index, follow",
      "noindex, follow",
      "index, nofollow",
      "noindex, nofollow",
    ])
    .default("index, follow"),

  schemaType: z.enum(SEO_SCHEMA_TYPES),
});

export const transitionSchema = z.object({
  from: z.string().trim().min(1),
  to: z.string().trim().min(1),
  by: z.string().trim().min(1),
  at: z.string().datetime({ offset: true }),
  reason: z.string().trim().nullable().optional(),
});

export const qaResultSchema = z.object({
  checked_at: z.string().datetime({ offset: true }),
  checked_by: z.string().trim().min(1),
  result: z.enum(["pass", "fail"]),
  blocks: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

export const distributionLogSchema = z.object({
  channel: z.enum([
    "newsletter",
    "twitter",
    "instagram",
    "linkedin",
    "facebook",
    "threads",
  ]),
  action: z.enum(["sent", "scheduled", "failed", "cancelled"]),
  at: z.string().datetime({ offset: true }),
  by: z.string().trim().min(1),
  details: z.string().nullable().optional(),
});

export const auditSchema = z
  .object({
    created_by: z.string().trim().min(1),
    created_at: z.string().datetime({ offset: true }),
    updated_by: z.string().trim().min(1),
    updated_at: z.string().datetime({ offset: true }),

    published_by: z.string().trim().min(1).nullable().optional(),
    published_at: z.string().datetime({ offset: true }).nullable().optional(),

    archived_by: z.string().trim().min(1).nullable().optional(),
    archived_at: z.string().datetime({ offset: true }).nullable().optional(),

    version: z.number().int().min(1),

    transitions: z.array(transitionSchema).default([]),
    qa_results: z.array(qaResultSchema).default([]),
    distribution_log: z.array(distributionLogSchema).default([]),
  })
  .superRefine((audit, ctx) => {
    if ((audit.published_by && !audit.published_at) || (!audit.published_by && audit.published_at)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "audit.published_by and audit.published_at must appear together",
        path: ["published_at"],
      });
    }

    if ((audit.archived_by && !audit.archived_at) || (!audit.archived_by && audit.archived_at)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "audit.archived_by and audit.archived_at must appear together",
        path: ["archived_at"],
      });
    }
  });

export const newsletterDistributionSchema = z.object({
  eligible: z.boolean(),
  sent: z.boolean(),
  sentAt: z.string().datetime({ offset: true }).nullable().optional(),
  audience: z.enum(["all_subscribers", "plan_subscribers", "segment"]).optional(),
  segmentId: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  campaignId: z.string().nullable().optional(),
});

export const socialPostSchema = z.object({
  channel: z.enum(["twitter", "instagram", "linkedin", "facebook", "threads"]),
  text: z.string().trim().min(1),
  imageUrl: z.string().url().nullable().optional(),
  scheduledAt: z.string().datetime({ offset: true }).nullable().optional(),
  postedAt: z.string().datetime({ offset: true }).nullable().optional(),
  postUrl: z.string().url().nullable().optional(),
});

export const socialDistributionSchema = z.object({
  eligible: z.boolean(),
  channels: z.array(z.string()).default([]),
  posts: z.array(socialPostSchema).default([]),
});

export const distributionSchema = z
  .object({
    newsletter: newsletterDistributionSchema.optional(),
    social: socialDistributionSchema.optional(),
  })
  .optional();

export const contentModelSchema = z
  .object({
    id: z
      .string()
      .trim()
      .regex(uuidV4, "id must be a valid UUID v4"),

    title: z
      .string()
      .trim()
      .min(5, "title must be at least 5 characters")
      .max(200, "title must be at most 200 characters"),

    slug: z
      .string()
      .trim()
      .min(3, "slug must be at least 3 characters")
      .max(100, "slug must be at most 100 characters")
      .regex(slugPattern, "slug must be lowercase alphanumeric plus hyphens only")
      .refine((value) => !reservedSlugs.has(value), "slug uses a reserved path"),

    summary: z
      .string()
      .trim()
      .min(20, "summary must be at least 20 characters")
      .max(300, "summary must be at most 300 characters")
      .refine(safePlainText, "summary must be plain text only"),

    body: z
      .string()
      .trim()
      .min(1, "body is required")
      .refine(noUnsafeHtml, "body contains unsafe HTML"),

    status: z.enum(CONTENT_STATUS),

    author: z
      .string()
      .trim()
      .min(1, "author is required"),

    domain: z.enum(CONTENT_DOMAIN),

    tags: z
      .array(
        z.string().trim().regex(tagPattern, "each tag must be lowercase and at most 50 chars")
      )
      .max(10, "tags may contain at most 10 items")
      .optional()
      .default([]),

    category: z.string().trim().min(1).optional(),

    seo: seoSchema.optional(),

    publishAt: z.string().datetime({ offset: true }).nullable().optional(),

    updatedAt: z.string().datetime({ offset: true }),

    canonicalUrl: z
      .string()
      .trim()
      .refine(
        (value) => /^(https?:\/\/|\/)[a-z0-9/_-]+$/i.test(value),
        "canonicalUrl must be a valid relative or absolute URL"
      )
      .optional(),

    visibility: z.enum(CONTENT_VISIBILITY),

    distribution: distributionSchema,

    audit: auditSchema,
  })
  .superRefine((content, ctx) => {
    const publishableStatuses = ["review", "approved", "scheduled", "published"];

    if (publishableStatuses.includes(content.status) && content.body.trim().length < 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "body must be at least 100 characters for review/approved/scheduled/published content",
        path: ["body"],
      });
    }

    if (content.status === "scheduled") {
      if (!content.publishAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "publishAt is required when status is scheduled",
          path: ["publishAt"],
        });
      } else {
        const publishDate = new Date(content.publishAt);
        if (Number.isNaN(publishDate.getTime()) || publishDate.getTime() <= Date.now()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "publishAt must be a future ISO datetime when status is scheduled",
            path: ["publishAt"],
          });
        }
      }
    }

    if (["approved", "scheduled", "published"].includes(content.status) && !content.seo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "seo is required before approved/scheduled/published status",
        path: ["seo"],
      });
    }

    if (content.status === "published" && !content.canonicalUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "canonicalUrl is required before published status",
        path: ["canonicalUrl"],
      });
    }

    if (content.status === "published") {
      if (!content.audit.published_by || !content.audit.published_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "audit.published_by and audit.published_at are required when status is published",
          path: ["audit", "published_at"],
        });
      }
    }

    if (content.status === "archived") {
      if (!content.audit.archived_by || !content.audit.archived_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "audit.archived_by and audit.archived_at are required when status is archived",
          path: ["audit", "archived_at"],
        });
      }
    }

    if (content.domain === "HEALING_DOMAIN") {
      if (!noManipulativeHealingCta(content.summary)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "HEALING_DOMAIN summary must not contain monetization CTA language",
          path: ["summary"],
        });
      }

      if (!noManipulativeHealingCta(content.body)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "HEALING_DOMAIN body must not contain monetization CTA language",
          path: ["body"],
        });
      }
    }

    if (!noClinicalClaims(content.summary)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "summary contains prohibited clinical claims",
        path: ["summary"],
      });
    }

    if (!noClinicalClaims(content.body)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "body contains prohibited clinical claims",
        path: ["body"],
      });
    }
  });

const contentPatchBaseSchema = z
  .object({
    id: z.string().trim().regex(uuidV4, "id must be a valid UUID v4").optional(),
    title: z.string().trim().min(5).max(200).optional(),
    slug: z.string().trim().min(3).max(100).regex(slugPattern).refine((v) => !reservedSlugs.has(v), "slug uses a reserved path").optional(),
    summary: z.string().trim().min(20).max(300).refine(safePlainText, "summary must be plain text only").optional(),
    body: z.string().trim().min(1).refine(noUnsafeHtml, "body contains unsafe HTML").optional(),
    status: z.enum(CONTENT_STATUS).optional(),
    author: z.string().trim().min(1).optional(),
    domain: z.enum(CONTENT_DOMAIN).optional(),
    tags: z.array(z.string().trim().regex(tagPattern)).max(10).optional(),
    category: z.string().trim().min(1).optional(),
    seo: seoSchema.optional(),
    publishAt: z.string().datetime({ offset: true }).nullable().optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    canonicalUrl: z.string().trim().refine((v) => /^(https?:\/\/|\/)[a-z0-9/_-]+$/i.test(v), "canonicalUrl must be a valid relative or absolute URL").optional(),
    visibility: z.enum(CONTENT_VISIBILITY).optional(),
    distribution: distributionSchema,
    audit: auditSchema.optional(),
  });

export function validateContentModel(payload) {
  return contentModelSchema.safeParse(payload);
}

export function validateContentPatch(payload) {
  return contentPatchBaseSchema.safeParse(payload);
}
