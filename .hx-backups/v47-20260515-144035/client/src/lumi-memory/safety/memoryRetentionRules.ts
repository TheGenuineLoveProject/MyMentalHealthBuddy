/**
 * Phase 16 — Reflective Memory Layer
 *
 * RETENTION SCHEDULE (per spec): 90 / 30 / 7 / 180 day buckets.
 *
 *   180 days (UI prefs — long-stable):
 *     preferredTheme · preferredMotion · preferredFontScale · preferredLanguage
 *
 *    90 days (interaction prefs — medium-stable):
 *     preferredTools · preferredPacing · preferredCheckInTime · preferredGreetingTone
 *
 *    30 days (recency context):
 *     lastSessionAt
 *
 *     7 days (ephemeral hint):
 *     ephemeralSessionHint
 *
 * Every write stamps `expiresAt = now + retentionDays`. `pruneExpired()`
 * is called on every read so the user sees only live memory.
 *
 * RULE: If you change a retention bucket, bump `CONSENT_POLICY_VERSION`
 * in `memoryConsentRules.ts` so existing consent is invalidated.
 */

import {
  ALLOWED_MEMORY_FIELDS,
  type AllowedMemoryField,
} from "../state/allowedMemoryFields";

export const RETENTION_DAYS: Readonly<Record<AllowedMemoryField, number>> = {
  preferredTheme: 180,
  preferredMotion: 180,
  preferredFontScale: 180,
  preferredLanguage: 180,
  preferredTools: 90,
  preferredPacing: 90,
  preferredCheckInTime: 90,
  preferredGreetingTone: 90,
  lastSessionAt: 30,
  ephemeralSessionHint: 7,
};

/** Module-load guard: every allowed field MUST have a retention entry. */
for (const f of ALLOWED_MEMORY_FIELDS) {
  if (!(f in RETENTION_DAYS) || typeof RETENTION_DAYS[f] !== "number") {
    throw new Error(
      `[lumi-memory] Missing retention entry for field "${f}". Spec violation.`,
    );
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function retentionMsFor(field: AllowedMemoryField): number {
  return RETENTION_DAYS[field] * DAY_MS;
}

export function expiresAtFor(field: AllowedMemoryField, nowMs: number): number {
  return nowMs + retentionMsFor(field);
}

export function isExpired(expiresAtMs: number, nowMs: number): boolean {
  return nowMs >= expiresAtMs;
}
