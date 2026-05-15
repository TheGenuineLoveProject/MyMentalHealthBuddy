/**
 * Phase 15 — Gentle Companion engine.
 *
 * Pure function: (input) → CompanionResponse.
 * No side effects. No network. No persistence.
 *
 * SAFETY ORDER (immutable):
 *   1. Crisis check ALWAYS runs first.
 *   2. If crisis → return CRISIS_RESPONSE — never a conversational reflection.
 *   3. Otherwise → category detection → bank lookup → response shape.
 *
 * Anti-loop guarantees:
 *   - Cycles deterministically through reflection / affirmation / invitation
 *     based on `turnIndex` so we never get stuck on one tone.
 *   - Cap message length to 220 chars.
 *   - Always attach OPT_OUT_LINE and CRISIS_LINE_SHORT.
 *   - Never emits FORBIDDEN_PHRASES (sanitized at the boundary).
 */

import {
  CRISIS_LINE_SHORT,
  CRISIS_RESPONSE,
  FORBIDDEN_PHRASES,
  OPT_OUT_LINE,
  PERMISSION_PHRASES,
  getBank,
} from "../copy/responseBank";
import type {
  CompanionInput,
  CompanionResponse,
  OarsTechnique,
  ResponseIntent,
} from "../types/companionVoiceTypes";
import { detectCategory } from "./categoryDetector";
import { detectCrisis } from "./crisisDetector";

export const MAX_MESSAGE_LENGTH = 220;

/**
 * Normalize text for forbidden-phrase / permission-phrase matching.
 * Flattens curly apostrophes and collapses whitespace so spacing/quote
 * variants cannot slip past either guard.
 */
export function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC\u201B]/g, "'") // curly + modifier apostrophes → '
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Sanitizer — defense in depth. Should always return input unchanged. */
function sanitize(message: string): string {
  const normalized = normalizeForMatch(message);
  for (const banned of FORBIDDEN_PHRASES) {
    if (normalized.includes(banned)) {
      // Should be unreachable for curated bank content; if it ever fires,
      // we fall back to the safest possible reflection.
      if (typeof console !== "undefined") {
        console.warn(
          `[companion-voice] Sanitizer caught forbidden phrase "${banned}" — falling back.`,
        );
      }
      return "We're here. No agenda — just a soft place to land for a moment.";
    }
  }
  return message;
}

/** Choose reflection / affirmation / invitation based on turn for variety. */
function pickIntent(turnIndex: number): {
  intent: ResponseIntent;
  technique: OarsTechnique;
} {
  const mod = ((turnIndex ?? 0) % 3 + 3) % 3;
  if (mod === 0) return { intent: "reflect", technique: "reflection" };
  if (mod === 1) return { intent: "affirm", technique: "affirmation" };
  return { intent: "invite", technique: "open-question" };
}

function pickFromBank(arr: string[], turnIndex: number): string {
  if (arr.length === 0) {
    return "We're here. No agenda — just a soft place to land for a moment.";
  }
  const idx = Math.abs(turnIndex ?? 0) % arr.length;
  return arr[idx];
}

/**
 * Ensure at least one PERMISSION_PHRASE is present in non-reflective output.
 * If the soft append would exceed the length cap, we TRIM the original first
 * so the permission tag still lands — CV-R006 must never silently fail.
 */
function ensurePermissionTone(message: string, intent: ResponseIntent): string {
  if (intent === "reflect" || intent === "rest") return message; // not required
  const normalized = normalizeForMatch(message);
  if (PERMISSION_PHRASES.some((p) => normalized.includes(p))) return message;
  const tag = " (No pressure.)";
  if (message.length + tag.length <= MAX_MESSAGE_LENGTH) {
    return message + tag;
  }
  // Hard fallback: trim message so tag fits — guarantees CV-R006 never fails.
  const room = MAX_MESSAGE_LENGTH - tag.length - 1; // -1 for ellipsis
  if (room <= 8) {
    // Pathologically short cap — emit a safe minimal permission line.
    return "No pressure.";
  }
  return message.slice(0, room).trimEnd() + "…" + tag;
}

export function generateResponse(input: CompanionInput): CompanionResponse {
  const text = (input?.text ?? "").trim();
  const turnIndex = typeof input?.turnIndex === "number" ? input.turnIndex : 0;

  // ── 1. CRISIS GATE — immutable, runs first ───────────────────────────────
  const crisis = detectCrisis(text);
  if (crisis.isCrisis) {
    return {
      message: CRISIS_RESPONSE.message,
      intent: "crisis",
      technique: null,
      isCrisis: true,
      optOut: OPT_OUT_LINE,
      crisisLine: CRISIS_LINE_SHORT,
      detected: "neutral", // intentionally not categorized — safety supersedes
    };
  }

  // ── 2. Empty input — gentle invitation, no analysis ──────────────────────
  if (text.length === 0) {
    return {
      message:
        "Whenever you're ready — a word, a phrase, anything. There's no right way to start.",
      intent: "invite",
      technique: "open-question",
      isCrisis: false,
      optOut: OPT_OUT_LINE,
      crisisLine: CRISIS_LINE_SHORT,
      detected: "neutral",
    };
  }

  // ── 3. Category detection + bank lookup ──────────────────────────────────
  const detected = detectCategory(text);
  const bank = getBank(detected);
  const { intent, technique } = pickIntent(turnIndex);

  let raw: string;
  if (intent === "reflect") raw = pickFromBank(bank.reflections, turnIndex);
  else if (intent === "affirm") raw = pickFromBank(bank.affirmations, turnIndex);
  else raw = pickFromBank(bank.invitations, turnIndex);

  let message = sanitize(raw);
  message = ensurePermissionTone(message, intent);
  if (message.length > MAX_MESSAGE_LENGTH) {
    message = message.slice(0, MAX_MESSAGE_LENGTH - 1).trimEnd() + "…";
  }

  return {
    message,
    intent,
    technique,
    isCrisis: false,
    optOut: OPT_OUT_LINE,
    crisisLine: CRISIS_LINE_SHORT,
    detected,
  };
}
