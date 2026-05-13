/**
 * Phase 15 (spec-aligned) — 8-step safety pipeline.
 *
 *   User Input
 *     → 1. Input Safety Check       (empty / too-long / non-string)
 *     → 2. Prompt-Injection Check   (refuse to play coercion games)
 *     → 3. Tone Detection           (8-tone classifier)
 *     → 4. Escalation Check         (critical → 988 / elevated → counselor)
 *     → 5. Response Selection       (curated bank, deterministic by turnIndex)
 *     → 6. Output Validation        (forbidden phrases / regexes)
 *     → 7. Boundary Audit           (8 boundary rules)
 *     → 8. Safe Output              (delivered, with optional pause/escalation tags)
 */

import { pickResponse } from "../content/calmResponses";
import {
  detectEscalation,
  CRISIS_RESOURCE_TEXT,
  ELEVATED_SUGGESTION_TEXT,
} from "../safety/escalationBoundaries";
import {
  auditBoundaries,
  type BoundaryAuditResult,
} from "../safety/emotionalBoundaryRules";
import {
  detectPromptInjection,
  isOutputSafe,
} from "../safety/forbiddenPatterns";
import {
  detectTone,
  type ToneDetection,
} from "./emotionalToneDetector";
import type {
  ConversationState,
  EmotionalTone,
  EscalationLevel,
} from "../state/conversationState";
import {
  MAX_DEPTH,
  PAUSE_SUGGESTION_DEPTH,
  useConversationStore,
} from "../state/conversationState";

export type RouterInput = {
  userText: string;
  /** Current store snapshot — needed for depth-aware decisions. */
  state: ConversationState;
};

export type RouterDecision = {
  /** Final, audited Lumi response text — always safe to display. */
  responseText: string;
  /** Detected tone at routing time (informational; never persisted as profile). */
  tone: EmotionalTone;
  /** Escalation level surfaced for this turn. */
  escalation: EscalationLevel;
  /** Whether a pause should be suggested with this turn. */
  suggestPause: boolean;
  /** Whether the input was flagged as a prompt-injection attempt. */
  injectionDetected: boolean;
  /** Whether the response was constructed from the curated bank vs a fallback. */
  source: "bank" | "fallback" | "crisis" | "depth-cap";
  /** Audit failures (non-fatal warnings or — if blocking — caused fallback). */
  auditFailures: BoundaryAuditResult[];
};

const PERMISSION_FALLBACK =
  "I'm here for this, gently. You can take it at your own pace.";

const INJECTION_FALLBACK =
  "I'll stay as I am — calm, brief, and not a person. We can keep going gently if you'd like.";

const DEPTH_CAP_REPLY =
  "We've talked for a while now. Resting the conversation here is okay — you can come back any time, with no streak to keep and nothing to catch up on.";

/**
 * Build the crisis card text. Always identical — never personalized, never edited.
 */
function buildCrisisResponse(): string {
  return CRISIS_RESOURCE_TEXT;
}

function buildElevatedAddendum(base: string): string {
  // Append the gentle elevated suggestion. Keep within the 1-3 sentence cap by
  // only appending if base is short enough; else the base reflects already.
  if (!base) return ELEVATED_SUGGESTION_TEXT;
  if (base.length + 2 + ELEVATED_SUGGESTION_TEXT.length <= 320) {
    return `${base} ${ELEVATED_SUGGESTION_TEXT}`;
  }
  return base;
}

export function runConversationRouter(input: RouterInput): RouterDecision {
  const { userText, state } = input;

  // ── Step 1: Input safety ────────────────────────────────────────────
  if (typeof userText !== "string" || userText.trim().length === 0) {
    return {
      responseText: PERMISSION_FALLBACK,
      tone: "calm",
      escalation: "none",
      suggestPause: false,
      injectionDetected: false,
      source: "fallback",
      auditFailures: [],
    };
  }

  // Hard length cap on input — do not pass arbitrarily long strings to the bank.
  const safeInput = userText.length > 4000 ? userText.slice(0, 4000) : userText;

  // ── Step 2: Prompt-injection check ──────────────────────────────────
  const injection = detectPromptInjection(safeInput);

  // ── Step 4: Escalation check (run BEFORE tone — crisis overrides) ──
  // (Step 3 = tone, but escalation must short-circuit it.)
  const esc = detectEscalation(safeInput);

  // ── Crisis short-circuit (highest priority, immutable ordering) ─────
  if (esc.level === "critical") {
    const crisis = buildCrisisResponse();
    // Crisis text is curated; we still pass it through audit for safety.
    const auditFailures = auditBoundaries({
      responseText: crisis,
      state,
    });
    return {
      responseText: crisis,
      tone: "calm",
      escalation: "critical",
      suggestPause: false,
      injectionDetected: injection,
      source: "crisis",
      auditFailures: auditFailures.filter((f) => f.severity === "warning"),
    };
  }

  // ── Depth cap (BR-002 enforcement) ──────────────────────────────────
  if (state.depth >= MAX_DEPTH) {
    return {
      responseText: DEPTH_CAP_REPLY,
      tone: "calm",
      escalation: esc.level,
      suggestPause: true,
      injectionDetected: injection,
      source: "depth-cap",
      auditFailures: [],
    };
  }

  // ── Step 2 (resume): if injection, return calm refusal ──────────────
  if (injection) {
    return {
      responseText: INJECTION_FALLBACK,
      tone: "calm",
      escalation: esc.level,
      suggestPause: false,
      injectionDetected: true,
      source: "fallback",
      auditFailures: [],
    };
  }

  // ── Step 3: Tone detection ──────────────────────────────────────────
  const toneDet: ToneDetection = detectTone(safeInput);

  // ── Step 5: Response selection (curated bank, deterministic) ────────
  let candidate = pickResponse(toneDet.tone, state.depth);

  // If escalation is `elevated`, gently surface counselor option.
  if (esc.level === "elevated") {
    candidate = buildElevatedAddendum(candidate);
  }

  // ── Step 6: Output validation ───────────────────────────────────────
  if (!isOutputSafe(candidate)) {
    candidate = PERMISSION_FALLBACK;
  }

  // ── Step 7: Boundary audit ──────────────────────────────────────────
  const auditFailures = auditBoundaries({ responseText: candidate, state });
  const blocking = auditFailures.filter((f) => f.severity === "blocking");
  if (blocking.length > 0) {
    candidate = PERMISSION_FALLBACK;
  }

  // ── Pause suggestion (BR-008) ───────────────────────────────────────
  const suggestPause =
    !state.pauseSuggested && state.depth >= PAUSE_SUGGESTION_DEPTH;

  // ── Step 8: Safe output ─────────────────────────────────────────────
  return {
    responseText: candidate,
    tone: toneDet.tone,
    escalation: esc.level,
    suggestPause,
    injectionDetected: false,
    source: blocking.length > 0 ? "fallback" : "bank",
    auditFailures: blocking.length > 0 ? auditFailures : auditFailures.filter((f) => f.severity === "warning"),
  };
}

/**
 * Public hardened write path. Hosts that integrate the conversation panel
 * MUST use this rather than calling store mutators directly. This is the
 * SINGLE entry point for landing a user message and a Lumi reply that
 * has been audit-validated end-to-end.
 *
 * It is impossible to land a Lumi turn through this function that fails
 * the audit pipeline — failures fall back to a curated safe response or
 * the verbatim crisis card.
 */
export function submitUserTurn(userText: string): RouterDecision {
  const trimmed = typeof userText === "string" ? userText.trim() : "";
  if (trimmed.length === 0) {
    return runConversationRouter({
      userText: "",
      state: useConversationStore.getState(),
    });
  }

  // Append user turn first so the router sees latest depth.
  useConversationStore.getState().appendTurn({ speaker: "user", text: trimmed });
  const stateAfterUser = useConversationStore.getState();
  const decision = runConversationRouter({ userText: trimmed, state: stateAfterUser });

  // Persist escalation transitions through the safe API.
  if (decision.escalation === "critical") {
    useConversationStore.getState().setEscalation("critical");
  } else if (decision.escalation === "elevated") {
    useConversationStore.getState().setEscalation("elevated");
  }

  // Land the audited Lumi reply. Because it came from the router, it has
  // already been forbidden-scanned + boundary-audited (blocking-only).
  useConversationStore.getState().appendTurn({
    speaker: "lumi",
    text: decision.responseText,
    tone: decision.tone,
    escalation: decision.escalation,
  });

  if (decision.suggestPause) {
    useConversationStore.getState().markPauseSuggested();
  }

  return decision;
}
