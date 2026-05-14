/**
 * Phase 22 — Scheduler safety governance.
 *
 * Single source of truth for what nudge copy is allowed to say. Locked
 * contracts (per Phase 22 spec):
 *  - No urgency, FOMO, guilt, or "you missed" messaging.
 *  - No required responses, no dependency loops.
 *  - No streak / level / unlock / gamification.
 *  - No commercial upsell during a nudge.
 *  - Every nudge must be skippable and dismissable (engine-enforced).
 *
 * Module-load floor guard: the FORBIDDEN_PHRASES list is locked at 15.
 * If a future edit reduces the list below 15, this module refuses to load.
 */

import type { CircadianPhase } from "../runtime/circadianStateMachine";

// ─── Numeric ceilings ───────────────────────────────────────────────────────
/** Hard ceiling on a nudge's primary copy. */
export const MAX_NUDGE_COPY_CHARS = 200;
/** Hard ceiling on a nudge's micro / helper copy. */
export const MAX_NUDGE_MICRO_CHARS = 160;

// ─── Forbidden manipulation phrases (locked at 15) ─────────────────────────
/**
 * Case-insensitive substring matches. Any nudge copy containing these
 * phrases is rejected by `auditScenePreset()`. Spec-locked at 15.
 */
export const FORBIDDEN_PHRASES: readonly string[] = Object.freeze([
  // "You missed" / shame
  "you missed",
  "you should have",
  "where were you",
  "you forgot",
  "you haven't",
  // Obligation / required response
  "you must",
  "you need to",
  "must check in",
  "have to log",
  "required",
  "mandatory",
  // Urgency / FOMO
  "today only",
  "act now",
  "limited time",
  "don't miss",
  // Commercial upsell — closes the architect-noted sink-audit gap so
  // host-injected nudges with upsell wording also fail the render audit.
  "subscribe",
  "upgrade now",
  "buy now",
  "free trial",
  "premium",
  // Gamification (sympathetic to v5.8.51-57 modules)
  "streak",
  "level up",
  "unlock",
]);

if (FORBIDDEN_PHRASES.length < 15) {
  throw new Error(
    `[lumi-circadian] FORBIDDEN_PHRASES floor violated: expected ≥15, got ` +
      `${FORBIDDEN_PHRASES.length}. Spec violation — refuse to load.`,
  );
}

// ─── Required tone markers (any one must surface per preset) ───────────────
export const REQUIRED_TONE_MARKERS: readonly string[] = Object.freeze([
  "soft",
  "gentle",
  "slow",
  "no pressure",
  "you choose",
  "skip",
  "dismiss",
  "nothing to prove",
  "nothing owed",
  "ignore",
  "rest",
  "quiet",
]);

// ─── Scene preset shape ────────────────────────────────────────────────────
export type CircadianScenePreset = Readonly<{
  phase: CircadianPhase;
  /** Internal label only — never surfaced as a "pick a phase" UI string. */
  internalName: string;
  copy: string;
  microCopy?: string;
}>;

// ─── Audit findings ────────────────────────────────────────────────────────
export type SchedulerAuditFinding = {
  rule:
    | "forbidden-phrase"
    | "copy-too-long"
    | "missing-tone-marker"
    | "missing-copy";
  message: string;
};

function normalize(text: string): string {
  return text
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function containsForbiddenPhrase(text: string): boolean {
  const haystack = normalize(text);
  for (const phrase of FORBIDDEN_PHRASES) {
    if (haystack.includes(normalize(phrase))) return true;
  }
  return false;
}

export function auditScenePreset(
  p: CircadianScenePreset,
): SchedulerAuditFinding[] {
  const findings: SchedulerAuditFinding[] = [];

  if (!p.copy || p.copy.trim().length === 0) {
    findings.push({ rule: "missing-copy", message: "Scene copy is empty." });
  }

  const all = [p.copy, p.microCopy ?? ""].join(" ");
  if (containsForbiddenPhrase(all)) {
    findings.push({
      rule: "forbidden-phrase",
      message: `Scene "${p.internalName}" contains a forbidden phrase.`,
    });
  }

  if (p.copy.length > MAX_NUDGE_COPY_CHARS) {
    findings.push({
      rule: "copy-too-long",
      message: `Scene "${p.internalName}" copy exceeds ${MAX_NUDGE_COPY_CHARS} chars.`,
    });
  }
  if (p.microCopy && p.microCopy.length > MAX_NUDGE_MICRO_CHARS) {
    findings.push({
      rule: "copy-too-long",
      message: `Scene "${p.internalName}" microCopy exceeds ${MAX_NUDGE_MICRO_CHARS} chars.`,
    });
  }

  // Tone marker — at least one must surface across copy + microCopy.
  const haystack = normalize(all);
  const hasMarker = REQUIRED_TONE_MARKERS.some((m) =>
    haystack.includes(normalize(m)),
  );
  if (!hasMarker) {
    findings.push({
      rule: "missing-tone-marker",
      message:
        `Scene "${p.internalName}" must contain at least one ` +
        `REQUIRED_TONE_MARKER.`,
    });
  }

  return findings;
}

/** Throws if any audit findings — used at preset module-load time. */
export function assertScenePresetCompliant(p: CircadianScenePreset): void {
  const findings = auditScenePreset(p);
  if (findings.length > 0) {
    throw new Error(
      `[lumi-circadian] preset "${p.internalName}" failed audit: ` +
        findings.map((f) => `[${f.rule}] ${f.message}`).join(" | "),
    );
  }
}
