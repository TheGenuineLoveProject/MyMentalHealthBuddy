/**
 * Phase 20 — Guided Presence Rituals · Safety governance
 *
 * Single source of truth for what ritual copy is allowed to say and how
 * long ritual UI is allowed to keep someone engaged.
 *
 * Contracts (locked):
 *  - No therapy / clinical / diagnostic claims
 *  - No urgency, guilt, dependency loops, or paid upsell
 *  - No streaks, no "must finish", no "complete to progress"
 *  - Every ritual must be skippable + optional
 *  - Every step copy must pass `auditStepCopy()` (no FORBIDDEN_PHRASES)
 *  - Soft per-step duration ceiling: MAX_STEP_DURATION_MS (60s)
 *  - Soft total ritual duration ceiling: MAX_RITUAL_DURATION_MS (5m)
 *  - Step count ceiling: MAX_STEPS_PER_RITUAL (8)
 *
 * Module-load floor guards (throw on import) protect against accidental
 * deletion of safety lists.
 */

import type { RitualPreset, RitualStep } from "../runtime/RitualEngine";

// ─── Numeric ceilings ───────────────────────────────────────────────────────
/** Soft ceiling: any single step paced by the engine. 60_000ms = 1 minute. */
export const MAX_STEP_DURATION_MS = 60_000;
/** Soft ceiling: total advisory duration of a ritual. 300_000ms = 5 minutes. */
export const MAX_RITUAL_DURATION_MS = 300_000;
/** Hard ceiling: a ritual must not contain more than 8 steps. */
export const MAX_STEPS_PER_RITUAL = 8;
/** Soft floor: a ritual should contain at least 1 step. */
export const MIN_STEPS_PER_RITUAL = 1;
/** Hard ceiling on individual step copy length (gentle, not wall of text). */
export const MAX_STEP_COPY_CHARS = 180;
/** Hard ceiling on invitation/closing copy length. */
export const MAX_FRAME_COPY_CHARS = 220;

// ─── Forbidden phrases ──────────────────────────────────────────────────────
/**
 * Case-insensitive substring matches. Any ritual copy containing these
 * phrases is rejected by `auditStepCopy()`. Spec-locked at 25.
 */
export const FORBIDDEN_PHRASES: readonly string[] = Object.freeze([
  // Coercion / obligation
  "you must",
  "you have to",
  "you need to",
  "must finish",
  "must complete",
  "do not stop",
  "don't stop",
  "don't quit",
  "no quitting",
  "complete this to progress",
  "your healing depends on this",
  "you cannot fail",
  // Self-judgment / fix-it
  "fix yourself",
  "fix you",
  "broken",
  // Urgency / FOMO
  "hurry",
  "act now",
  "today only",
  "limited time",
  "don't miss",
  // Gamification / dependency loops
  "streak",
  "level up",
  "unlock",
  // Commercial during ritual
  "subscribe",
  "upgrade now",
]);

if (FORBIDDEN_PHRASES.length < 25) {
  throw new Error(
    `[lumi-rituals] FORBIDDEN_PHRASES floor violated: expected ≥25, got ` +
      `${FORBIDDEN_PHRASES.length}. Spec violation — refuse to load.`,
  );
}

// ─── Required tone markers ──────────────────────────────────────────────────
/**
 * Phrases the spec lists as the tone Lumi rituals should sound like.
 * NOT a per-step requirement (a single step would sound stilted) — used
 * by `auditPresetTonePresence()` to verify that across the WHOLE preset
 * (invitation + steps + closing), the gentle voice surfaces at least
 * once. Spec-locked at 5.
 */
export const REQUIRED_TONE_MARKERS: readonly string[] = Object.freeze([
  "soft",
  "gentle",
  "slowly",
  "pause",
  "nothing to prove",
]);

if (REQUIRED_TONE_MARKERS.length < 5) {
  throw new Error(
    `[lumi-rituals] REQUIRED_TONE_MARKERS floor violated: expected ≥5, got ` +
      `${REQUIRED_TONE_MARKERS.length}. Spec violation — refuse to load.`,
  );
}

// ─── Audit findings ─────────────────────────────────────────────────────────
export type AuditFinding = {
  rule:
    | "forbidden-phrase"
    | "copy-too-long"
    | "step-duration-too-long"
    | "ritual-duration-too-long"
    | "step-count-out-of-range"
    | "missing-tone-marker"
    | "missing-skip-affordance";
  message: string;
  /** When applicable, which step (by index) the finding applies to. */
  stepIndex?: number;
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function normalize(text: string): string {
  return text
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** True if `text` contains any FORBIDDEN_PHRASE (substring, case-insensitive). */
export function containsForbiddenPhrase(text: string): boolean {
  const haystack = normalize(text);
  for (const phrase of FORBIDDEN_PHRASES) {
    if (haystack.includes(normalize(phrase))) return true;
  }
  return false;
}

/** Pure: returns findings for a single step's copy. */
export function auditStepCopy(step: RitualStep, stepIndex: number): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const allText = [step.copy, step.microCopy ?? ""].join(" ");
  if (containsForbiddenPhrase(allText)) {
    findings.push({
      rule: "forbidden-phrase",
      message: `Step ${stepIndex} copy contains a forbidden phrase.`,
      stepIndex,
    });
  }
  if (step.copy.length > MAX_STEP_COPY_CHARS) {
    findings.push({
      rule: "copy-too-long",
      message: `Step ${stepIndex} copy exceeds ${MAX_STEP_COPY_CHARS} chars.`,
      stepIndex,
    });
  }
  if (
    typeof step.durationMs === "number" &&
    step.durationMs > MAX_STEP_DURATION_MS
  ) {
    findings.push({
      rule: "step-duration-too-long",
      message: `Step ${stepIndex} duration exceeds ${MAX_STEP_DURATION_MS}ms.`,
      stepIndex,
    });
  }
  return findings;
}

/** Walks the full preset and returns every finding (empty array = compliant). */
export function auditPreset(preset: RitualPreset): AuditFinding[] {
  const findings: AuditFinding[] = [];

  // Frame copy
  if (containsForbiddenPhrase(preset.invitationText)) {
    findings.push({
      rule: "forbidden-phrase",
      message: "Invitation contains a forbidden phrase.",
    });
  }
  if (preset.invitationText.length > MAX_FRAME_COPY_CHARS) {
    findings.push({
      rule: "copy-too-long",
      message: `Invitation exceeds ${MAX_FRAME_COPY_CHARS} chars.`,
    });
  }
  if (containsForbiddenPhrase(preset.closing)) {
    findings.push({
      rule: "forbidden-phrase",
      message: "Closing contains a forbidden phrase.",
    });
  }
  if (preset.closing.length > MAX_FRAME_COPY_CHARS) {
    findings.push({
      rule: "copy-too-long",
      message: `Closing exceeds ${MAX_FRAME_COPY_CHARS} chars.`,
    });
  }

  // Step count
  if (
    preset.steps.length < MIN_STEPS_PER_RITUAL ||
    preset.steps.length > MAX_STEPS_PER_RITUAL
  ) {
    findings.push({
      rule: "step-count-out-of-range",
      message:
        `Ritual must have between ${MIN_STEPS_PER_RITUAL} and ` +
        `${MAX_STEPS_PER_RITUAL} steps; got ${preset.steps.length}.`,
    });
  }

  // Per-step copy
  preset.steps.forEach((s, i) => {
    findings.push(...auditStepCopy(s, i));
  });

  // Total advisory duration ceiling (computed if not declared).
  const totalSoft =
    typeof preset.totalSoftDurationMs === "number"
      ? preset.totalSoftDurationMs
      : preset.steps.reduce((sum, s) => sum + (s.durationMs ?? 0), 0);
  if (totalSoft > MAX_RITUAL_DURATION_MS) {
    findings.push({
      rule: "ritual-duration-too-long",
      message:
        `Total advisory duration ${totalSoft}ms exceeds ` +
        `${MAX_RITUAL_DURATION_MS}ms ceiling.`,
    });
  }

  // Tone marker — at least one across the whole preset (defends against
  // a future author replacing all gentle voice with neutral instructions).
  const wholeText = normalize(
    [
      preset.invitationText,
      preset.closing,
      ...preset.steps.map((s) => `${s.copy} ${s.microCopy ?? ""}`),
    ].join(" "),
  );
  const hasMarker = REQUIRED_TONE_MARKERS.some((m) =>
    wholeText.includes(normalize(m)),
  );
  if (!hasMarker) {
    findings.push({
      rule: "missing-tone-marker",
      message:
        `Preset must contain at least one REQUIRED_TONE_MARKER ` +
        `(${REQUIRED_TONE_MARKERS.join(" / ")}).`,
    });
  }

  // Skip affordance is a structural rule the engine enforces (every ritual
  // exposes pause + skip + exit). The audit only checks that the preset
  // hasn't opted out via `disableSkip` (which the type doesn't allow, but
  // we defend via a runtime check in case host code subclasses the type).
  if ((preset as unknown as { disableSkip?: boolean }).disableSkip === true) {
    findings.push({
      rule: "missing-skip-affordance",
      message: "Ritual presets MUST NOT disable skip — rituals are optional.",
    });
  }

  return findings;
}

/** Throws if any audit findings — used at module-load time by each preset file. */
export function assertPresetCompliant(p: RitualPreset): void {
  const findings = auditPreset(p);
  if (findings.length > 0) {
    throw new Error(
      `[lumi-rituals] preset "${p.internalName}" failed audit: ` +
        findings.map((f) => `[${f.rule}] ${f.message}`).join(" | "),
    );
  }
}
