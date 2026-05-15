/**
 * Phase 33 — Mood entry model (opt-in, client-side only).
 *
 * 5-point scale chosen for low cognitive load + clear semantic anchors.
 * Not a clinical instrument — never used for diagnosis or screening.
 */

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export const MOOD_LEVEL_LABELS: Readonly<Record<MoodLevel, string>> = Object.freeze({
  1: "Very Low",
  2: "Low",
  3: "Neutral",
  4: "Good",
  5: "Very Good",
});

export interface EmotionRating {
  readonly name: string;
  /** 0-10, subjective. */
  readonly intensity: number;
}

export interface MoodEntry {
  readonly id: string;
  readonly timestamp: string;
  readonly level: MoodLevel;
  readonly note?: string;
  readonly emotions?: ReadonlyArray<EmotionRating>;
  readonly triggers?: ReadonlyArray<string>;
  readonly sleepHours?: number;
  readonly context?: string;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mood-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createMoodEntry(level: MoodLevel, note?: string): MoodEntry {
  return {
    id: makeId(),
    timestamp: new Date().toISOString(),
    level,
    ...(note ? { note } : {}),
  };
}

export interface MoodValidationResult {
  readonly valid: boolean;
  readonly errors: ReadonlyArray<string>;
}

export function validateMoodEntry(entry: MoodEntry): MoodValidationResult {
  const errors: string[] = [];
  if (!Number.isInteger(entry.level) || entry.level < 1 || entry.level > 5) {
    errors.push("level must be an integer 1-5");
  }
  if (entry.sleepHours !== undefined && (entry.sleepHours < 0 || entry.sleepHours > 24)) {
    errors.push("sleepHours must be 0-24");
  }
  if (entry.emotions) {
    for (const e of entry.emotions) {
      if (e.intensity < 0 || e.intensity > 10) {
        errors.push(`emotion ${e.name} intensity out of range`);
      }
    }
  }
  if (!entry.timestamp || Number.isNaN(Date.parse(entry.timestamp))) {
    errors.push("timestamp must be a valid ISO string");
  }
  return { valid: errors.length === 0, errors };
}
