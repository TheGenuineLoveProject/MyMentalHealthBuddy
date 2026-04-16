import { z } from "zod";

const MONETIZATION_PATTERNS = [
  /\bbuy\s+now\b/i,
  /\bsubscribe\s+now\b/i,
  /\blimited\s+time\s+offer\b/i,
  /\bact\s+now\b/i,
  /\bdon'?t\s+miss\s+out\b/i,
  /\blast\s+chance\b/i,
  /\bfree\s+trial\b/i,
  /\bdiscount\b/i,
  /\bpromo\s*code\b/i,
  /\bspecial\s+offer\b/i,
  /\bupgrade\s+your\s+plan\b/i,
  /\bpurchase\b/i,
  /\bcheckout\b/i,
];

function containsMonetizationLanguage(text) {
  if (!text || typeof text !== "string") return false;
  return MONETIZATION_PATTERNS.some((p) => p.test(text));
}

const healingDomainSafeString = z.string().refine(
  (val) => !containsMonetizationLanguage(val),
  { message: "Healing-domain content must not contain monetization language" }
);

export const contentGenerateSchema = z.object({
  topic: healingDomainSafeString
    .max(500, "Topic must be under 500 characters")
    .optional(),
  prompt: healingDomainSafeString
    .max(500, "Prompt must be under 500 characters")
    .optional(),
  tone: z
    .string()
    .max(200, "Tone must be under 200 characters")
    .optional(),
  domain: z
    .enum([
      "HEALING_DOMAIN",
      "BUSINESS_DOMAIN",
      "PLATFORM_DOMAIN",
      "DESIGN_DOMAIN",
      "RESEARCH_DOMAIN",
    ])
    .optional(),
});

export { containsMonetizationLanguage };
