/**
 * Phase 16 — Reflective Memory Layer
 *
 * EXACTLY 10 ALLOWED MEMORY FIELDS. Anything outside this enum is a
 * memory-write violation and is rejected by `memoryRouter.writeMemory()`.
 *
 * Categories per spec:
 *   - Preferred tools          (1 field)
 *   - Preferred pacing         (2 fields: pacing + check-in time)
 *   - Greeting tone            (2 fields: tone + lastSessionAt)
 *   - UI prefs                 (4 fields: theme/motion/fontScale/language)
 *   - Ephemeral session hint   (1 field — 7-day bucket)
 *
 *   Total                      = 10
 *
 * RULE: This file is the SINGLE source of truth for what Lumi may remember.
 * Adding a field requires governance approval + a corresponding entry in
 * `memoryRetentionRules.ts` and a test in `tests/memorySafety.test.ts`.
 */

export const ALLOWED_MEMORY_FIELDS = [
  "preferredTools",
  "preferredPacing",
  "preferredCheckInTime",
  "preferredGreetingTone",
  "lastSessionAt",
  "preferredTheme",
  "preferredMotion",
  "preferredFontScale",
  "preferredLanguage",
  "ephemeralSessionHint",
] as const;

export type AllowedMemoryField = (typeof ALLOWED_MEMORY_FIELDS)[number];

export const ALLOWED_MEMORY_FIELD_COUNT = ALLOWED_MEMORY_FIELDS.length;

/**
 * Module-load guard. If this list ever drifts from 10, fail loud rather
 * than silently expand the memory surface.
 */
if (ALLOWED_MEMORY_FIELD_COUNT !== 10) {
  throw new Error(
    `[lumi-memory] ALLOWED_MEMORY_FIELDS must contain exactly 10 fields, ` +
      `got ${ALLOWED_MEMORY_FIELD_COUNT}. Spec violation.`,
  );
}

/** Type-shape of every memory value. Strict — no `unknown`/`any`. */
export type MemoryValueShape = {
  preferredTools: ReadonlyArray<"breath" | "grounding" | "reflection" | "calm-checkin" | "lumi-conversation">;
  preferredPacing: "slow" | "medium" | "flexible";
  preferredCheckInTime: "morning" | "midday" | "evening" | "any";
  preferredGreetingTone: "warm" | "neutral" | "minimal";
  /** ISO-8601 timestamp string. Used to drive "welcome back" greeting. */
  lastSessionAt: string;
  preferredTheme: "light" | "dark" | "system";
  preferredMotion: "full" | "reduced" | "system";
  preferredFontScale: "standard" | "larger";
  /** BCP-47 locale. */
  preferredLanguage: string;
  /**
   * Single short hint string (≤120 chars, plain category, no narrative).
   * Examples: "just-finished-breath", "prefers-grounding-today".
   * EXPIRES IN 7 DAYS. Never narrative content.
   */
  ephemeralSessionHint: string;
};

export type MemoryValueOf<F extends AllowedMemoryField> = MemoryValueShape[F];

/** Cheap O(1) field-allowed check used by router. */
const allowedSet = new Set<string>(ALLOWED_MEMORY_FIELDS);
export function isAllowedField(field: string): field is AllowedMemoryField {
  return allowedSet.has(field);
}

/** Per-field shape validators. Return true iff value matches its enum/shape. */
export function isAllowedValue<F extends AllowedMemoryField>(
  field: F,
  value: unknown,
): value is MemoryValueOf<F> {
  switch (field) {
    case "preferredTools": {
      if (!Array.isArray(value)) return false;
      const allowed = new Set(["breath", "grounding", "reflection", "calm-checkin", "lumi-conversation"]);
      return value.every((v) => typeof v === "string" && allowed.has(v));
    }
    case "preferredPacing":
      return value === "slow" || value === "medium" || value === "flexible";
    case "preferredCheckInTime":
      return value === "morning" || value === "midday" || value === "evening" || value === "any";
    case "preferredGreetingTone":
      return value === "warm" || value === "neutral" || value === "minimal";
    case "lastSessionAt":
      return typeof value === "string" && !Number.isNaN(Date.parse(value));
    case "preferredTheme":
      return value === "light" || value === "dark" || value === "system";
    case "preferredMotion":
      return value === "full" || value === "reduced" || value === "system";
    case "preferredFontScale":
      return value === "standard" || value === "larger";
    case "preferredLanguage":
      return typeof value === "string" && value.length > 0 && value.length <= 16;
    case "ephemeralSessionHint":
      return typeof value === "string" && value.length > 0 && value.length <= 120;
    default:
      return false;
  }
}
