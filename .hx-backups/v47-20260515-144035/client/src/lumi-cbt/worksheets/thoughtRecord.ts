/**
 * Phase 32 — CBT Thought Record worksheet (opt-in, standalone module).
 *
 * Trauma-informed defaults: no diagnostic language, no severity scoring,
 * no gamification, exit path always available. Self-help only — never a
 * replacement for professional care (see `governance/cbtSafetyRules.ts`).
 */

export interface EmotionRating {
  readonly name: string;
  /** 0-10. NOT a clinical severity score; user's own subjective rating. */
  readonly intensity: number;
}

export interface ThoughtRecord {
  readonly id: string;
  readonly date: string;
  readonly situation: string;
  readonly automaticThoughts: ReadonlyArray<string>;
  readonly emotions: ReadonlyArray<EmotionRating>;
  readonly evidenceFor: ReadonlyArray<string>;
  readonly evidenceAgainst: ReadonlyArray<string>;
  readonly balancedThought: string;
  readonly reRateEmotions: ReadonlyArray<EmotionRating>;
}

export const THOUGHT_RECORD_TEMPLATE = Object.freeze({
  situation: "",
  automaticThoughts: Object.freeze([]),
  emotions: Object.freeze([]),
  evidenceFor: Object.freeze([]),
  evidenceAgainst: Object.freeze([]),
  balancedThought: "",
  reRateEmotions: Object.freeze([]),
});

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `tr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createThoughtRecord(situation: string): ThoughtRecord {
  return {
    id: makeId(),
    date: new Date().toISOString(),
    situation,
    automaticThoughts: [],
    emotions: [],
    evidenceFor: [],
    evidenceAgainst: [],
    balancedThought: "",
    reRateEmotions: [],
  };
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly missing: ReadonlyArray<string>;
}

export function validateThoughtRecord(record: ThoughtRecord): ValidationResult {
  const missing: string[] = [];
  if (!record.situation.trim()) missing.push("situation");
  if (record.automaticThoughts.length === 0) missing.push("automaticThoughts");
  if (record.emotions.length === 0) missing.push("emotions");
  if (record.evidenceFor.length === 0) missing.push("evidenceFor");
  if (record.evidenceAgainst.length === 0) missing.push("evidenceAgainst");
  if (!record.balancedThought.trim()) missing.push("balancedThought");
  if (record.reRateEmotions.length === 0) missing.push("reRateEmotions");
  for (const e of [...record.emotions, ...record.reRateEmotions]) {
    if (e.intensity < 0 || e.intensity > 10) missing.push(`emotion-intensity-out-of-range:${e.name}`);
  }
  return { valid: missing.length === 0, missing };
}
