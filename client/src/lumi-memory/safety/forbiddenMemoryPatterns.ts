/**
 * Phase 16 — Reflective Memory Layer
 *
 * 7 FORBIDDEN MEMORY CATEGORIES. Lumi MUST NEVER persist any of these.
 *
 * Even if a value is being written into an "allowed" field (e.g.,
 * `ephemeralSessionHint`), it is scanned against these patterns first and
 * rejected if any match. This is defense-in-depth against:
 *  - well-intentioned but unsafe LLM-suggested memory writes,
 *  - host integration mistakes,
 *  - subtle drift over time.
 *
 * RULE: This list never shrinks. Module-load guard fires if it does.
 */

export type ForbiddenCategory =
  | "trauma_narrative"
  | "vulnerability_score"
  | "attachment_data"
  | "manipulation_profile"
  | "crisis_history"
  | "pii"
  | "clinical_diagnosis";

export const FORBIDDEN_CATEGORIES: ReadonlyArray<ForbiddenCategory> = [
  "trauma_narrative",
  "vulnerability_score",
  "attachment_data",
  "manipulation_profile",
  "crisis_history",
  "pii",
  "clinical_diagnosis",
];

if (FORBIDDEN_CATEGORIES.length !== 7) {
  throw new Error(
    `[lumi-memory] FORBIDDEN_CATEGORIES must contain exactly 7 categories, ` +
      `got ${FORBIDDEN_CATEGORIES.length}. Spec violation.`,
  );
}

/**
 * Per-category regex patterns. Conservative — false-positives are
 * acceptable here; false-negatives are not. We err on the side of refusing
 * to remember anything ambiguous.
 */
export const FORBIDDEN_PATTERNS: Readonly<Record<ForbiddenCategory, ReadonlyArray<RegExp>>> = {
  trauma_narrative: [
    /\b(?:abuse|abused|abuser|assault|assaulted|raped|rape|molested|molestation)\b/i,
    /\b(?:trauma|traumatized|traumatised|ptsd|c-?ptsd|flashback|flashbacks)\b/i,
    /\b(?:childhood\s+(?:abuse|trauma|neglect)|war\s+trauma|combat\s+trauma)\b/i,
  ],
  vulnerability_score: [
    /\b(?:vulnerability\s*(?:score|rating|index|level))\b/i,
    /\b(?:risk\s*score|emotional\s*rating|distress\s*score|severity\s*\d)\b/i,
    /\b(?:phq-?9|gad-?7|pcl-?5|c-?ssrs)\b/i,
  ],
  attachment_data: [
    /\b(?:attached\s+to\s+lumi|depends?\s+on\s+lumi|relies?\s+on\s+lumi)\b/i,
    /\b(?:lumi\s+is\s+(?:my|their)\s+(?:only|best)\s+(?:friend|companion|support))\b/i,
    /\b(?:relationship\s+with\s+lumi|bond\s+with\s+lumi|love\s+for\s+lumi)\b/i,
    /\b(?:can'?t\s+(?:live|cope)\s+without\s+lumi)\b/i,
  ],
  manipulation_profile: [
    /\b(?:persuasion\s+(?:profile|tactics|levers|hooks))\b/i,
    /\b(?:what\s+works\s+to\s+(?:influence|convince|persuade|push))\b/i,
    /\b(?:conversion\s+(?:triggers|hooks|levers)|behavioral\s+levers)\b/i,
    /\b(?:pressure\s+points|emotional\s+triggers)\b/i,
  ],
  crisis_history: [
    /\b(?:suicid(?:e|al|ality)|self-?harm|self\s+harm|hurt\s+myself|kill\s+myself)\b/i,
    /\bwant(?:s|ed|ing)?\s+to\s+die\b/i,
    /\b(?:attempted\s+suicide|previous\s+attempt)\b/i,
    /\b(?:overdose|cutting|self-?injury|988\s+call|crisis\s+text)\b/i,
    /\b(?:hospitalized|hospitalised|psychiatric\s+hold|5150|involuntary)\b/i,
  ],
  pii: [
    /\b[A-Z][a-z]+\s+(?:Smith|Johnson|Williams|Brown|Jones|Garcia|Miller|Davis|Rodriguez|Martinez)\b/,
    /\b[\w.-]+@[\w-]+\.[a-z]{2,}\b/i,
    /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
    /\b\d{3}-\d{2}-\d{4}\b/,
    /\b\d{1,5}\s+[A-Za-z][A-Za-z0-9\s]*\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr)\b/i,
  ],
  clinical_diagnosis: [
    /\b(?:diagnos(?:ed|is|es)\s+with|has\s+(?:depression|anxiety|bipolar|adhd|ocd|ptsd|borderline|bpd|schizophrenia))\b/i,
    /\b(?:dsm-?5|icd-?10|clinical\s+(?:depression|anxiety))\b/i,
    /\b(?:major\s+depressive\s+disorder|generalized\s+anxiety\s+disorder|panic\s+disorder)\b/i,
    /\b(?:on\s+(?:ssri|snri|antidepressant|antipsychotic|lithium|prozac|zoloft|lexapro|xanax|klonopin))\b/i,
  ],
};

const totalPatterns = Object.values(FORBIDDEN_PATTERNS).reduce(
  (n, arr) => n + arr.length,
  0,
);

if (totalPatterns < 25) {
  throw new Error(
    `[lumi-memory] FORBIDDEN_PATTERNS shrunk below safety floor ` +
      `(${totalPatterns} < 25). Spec violation.`,
  );
}

export function normalizeForScan(input: string): string {
  return input
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201F]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export type ForbiddenHit = {
  category: ForbiddenCategory;
  pattern: string;
};

/**
 * Scan an arbitrary value for ANY forbidden category. Strings, arrays of
 * strings, and plain objects (one level) are all walked.
 */
export function findForbiddenHits(value: unknown): ForbiddenHit[] {
  const hits: ForbiddenHit[] = [];
  const visit = (v: unknown): void => {
    if (typeof v === "string") {
      const norm = normalizeForScan(v);
      for (const cat of FORBIDDEN_CATEGORIES) {
        for (const re of FORBIDDEN_PATTERNS[cat]) {
          if (re.test(norm)) {
            hits.push({ category: cat, pattern: re.toString() });
          }
        }
      }
    } else if (Array.isArray(v)) {
      v.forEach(visit);
    } else if (v && typeof v === "object") {
      Object.values(v as Record<string, unknown>).forEach(visit);
    }
  };
  visit(value);
  return hits;
}

export function isMemoryContentSafe(value: unknown): boolean {
  return findForbiddenHits(value).length === 0;
}
