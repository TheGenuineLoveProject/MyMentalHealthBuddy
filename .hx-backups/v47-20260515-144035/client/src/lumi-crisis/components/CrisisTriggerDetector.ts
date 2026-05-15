/**
 * Phase 34 — Crisis trigger detector (pure function).
 *
 * Asymmetric risk per BHCE: err toward resource provision. Detector
 * NEVER diagnoses — it flags for resource display only. Concern-level
 * matches still surface the panel; the threshold for `immediate` is
 * narrower (explicit self-harm intent).
 */

export type CrisisSeverity = "immediate" | "concern" | "none";

export interface CrisisDetectionResult {
  readonly triggered: boolean;
  readonly severity: CrisisSeverity;
  readonly matchedPhrases: ReadonlyArray<string>;
}

const IMMEDIATE_PATTERNS: ReadonlyArray<{ phrase: string; pattern: RegExp }> = Object.freeze([
  { phrase: "kill myself", pattern: /\bkill myself\b/i },
  { phrase: "end it all", pattern: /\bend it all\b/i },
  { phrase: "want to die", pattern: /\bwant to die\b/i },
  { phrase: "no point living", pattern: /\bno point (in )?living\b/i },
]);

const CONCERN_PATTERNS: ReadonlyArray<{ phrase: string; pattern: RegExp }> = Object.freeze([
  { phrase: "suicide", pattern: /\bsuicide\b/i },
  { phrase: "hurt myself", pattern: /\bhurt myself\b/i },
  { phrase: "self-harm", pattern: /\bself[- ]harm\b/i },
]);

export function detectCrisisIndicators(text: string): CrisisDetectionResult {
  if (!text) return { triggered: false, severity: "none", matchedPhrases: [] };
  const matched: string[] = [];
  let immediate = false;
  let concern = false;
  for (const { phrase, pattern } of IMMEDIATE_PATTERNS) {
    if (pattern.test(text)) {
      matched.push(phrase);
      immediate = true;
    }
  }
  for (const { phrase, pattern } of CONCERN_PATTERNS) {
    if (pattern.test(text)) {
      matched.push(phrase);
      concern = true;
    }
  }
  const severity: CrisisSeverity = immediate ? "immediate" : concern ? "concern" : "none";
  return { triggered: severity !== "none", severity, matchedPhrases: matched };
}
