import { z } from "zod";
import { apiRequest } from "./queryClient";

// Read contracts for the two publishing consoles. All current routes use
// { ok: true, data }; bare arrays and alternate envelopes are not supported.
// Unknown fields are retained for forward compatibility; known UI fields are
// checked without coercion so corrupt values cannot become empty/zero data.
const text = z.string();
const id = text.min(1);
const nullableText = text.nullish();
const date = text.refine(value => Number.isFinite(Date.parse(value)));
const count = z.number().int().nonnegative();
const captions = z.record(text, text).nullish();
const status = z.enum(["draft", "review", "approved", "posted"]);
const object = shape => z.object(shape).passthrough();
const post = object({
  id, content: text, status, createdAt: date,
  title: nullableText, theme: nullableText, campaignId: nullableText,
  captions, hashtags: nullableText, safetyNote: nullableText,
  gentleCtaUrl: nullableText, originType: nullableText,
  canvaUrl: nullableText, mediaAssetUrl: nullableText, utmUrl: nullableText,
  createdBy: nullableText, reviewedBy: nullableText, approvedBy: nullableText,
  scheduledFor: date.nullish(), postedPlatforms: z.array(text).nullish(),
});

export const publishingResponseContracts = {
  drafts: z.array(object({
    id, type: z.enum(["social", "blog", "newsletter"]), title: text, status,
    pillar: nullableText, primaryCta: nullableText, safetyNote: nullableText, captions,
  })),
  featured: z.record(text.regex(/^\d{4}-\d{2}-\d{2}$/), object({
    glpId: id, setAt: date, setBy: text,
  })),
  posts: z.array(post),
  weekly: z.array(post.extend({ scheduledFor: date })),
  campaigns: z.array(object({
    id, name: text, status: text, goal: nullableText,
    startDate: date.nullish(), endDate: date.nullish(),
  })),
  signals: object({
    statusCounts: z.partialRecord(status, count),
    topThemes: z.array(object({ theme: text.nullable(), count })),
    recentBlogActivity: z.array(object({ path: text.nullable(), eventName: text, count })),
    suggestedFocus: z.array(text),
  }),
  clicks: z.array(object({ path: text.nullable(), count })),
  audit: z.array(object({ id, type: text, createdAt: date })),
  blogs: z.array(object({ id, title: text })),
};

export function validatePublishingResponse(contract, payload) {
  const result = object({
    ok: z.literal(true),
    data: publishingResponseContracts[contract],
  }).safeParse(payload);
  if (!result.success) {
    // Do not echo publishing content or the raw server response in errors.
    throw new Error(`Invalid ${contract} response. Please retry.`);
  }
  return result.data;
}

export async function readPublishingResponse(url, contract) {
  return validatePublishingResponse(contract, await apiRequest("GET", url));
}