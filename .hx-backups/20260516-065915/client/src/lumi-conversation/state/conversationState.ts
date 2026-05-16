/**
 * Phase 15 (spec-aligned) — Gentle Companion Conversation Layer.
 *
 * Six conversation states per spec:
 *   idle → conversing → (grounding | reflecting | paused | escalated)
 *
 * Hard contracts (enforced at the reducer layer + safety + runtime):
 *   - Conversation depth is capped at MAX_DEPTH (BR-002). Reaching depth
 *     suggests a pause, never silently truncates.
 *   - No turn history is rebroadcast to the user (anti-attachment-loop):
 *     orchestrator stores recent turns only for routing context, never as
 *     persistent profile.
 *   - `escalated` is one-way until explicit reset — Lumi will keep gently
 *     surfacing the resource pointer.
 *
 * Built on Zustand (already in deps from v5.8.48).
 */

import { create } from "zustand";

export type ConversationStep =
  | "idle"
  | "conversing"
  | "grounding"
  | "reflecting"
  | "paused"
  | "escalated";

export type EmotionalTone =
  | "anxious"
  | "sad"
  | "angry"
  | "lonely"
  | "overwhelmed"
  | "calm"
  | "grateful"
  | "ambivalent";

export type EscalationLevel = "none" | "elevated" | "critical";

export type ConversationTurn = {
  id: string;
  speaker: "user" | "lumi";
  text: string;
  /** For Lumi turns only. */
  tone?: EmotionalTone;
  /** Critical/elevated turns flag the resource pointer in the bubble. */
  escalation?: EscalationLevel;
  /** Whether this turn is grounded in a grounding/reflection prompt card. */
  cardKind?: "grounding" | "reflection" | null;
  createdAt: number;
};

export type ConversationState = {
  step: ConversationStep;
  /** All turns this session — capped to MAX_HISTORY_RETAINED. */
  turns: ConversationTurn[];
  /** Live escalation level — once "critical", remains until user resets. */
  escalation: EscalationLevel;
  /** Counter of user→Lumi exchanges (one user message + Lumi reply = 1 depth). */
  depth: number;
  /** Whether Lumi has already surfaced a pause suggestion in this conversation. */
  pauseSuggested: boolean;
};

export type ConversationActions = {
  /**
   * INTERNAL — used by `LumiConversationPanel` and `submitUserTurn`. Hosts
   * MUST NOT call this directly to inject Lumi turns; doing so bypasses the
   * router and audit pipeline. The barrel does not re-export this; use
   * `submitUserTurn()` from "@/lumi-conversation" for the safe write path.
   */
  appendTurn: (turn: Omit<ConversationTurn, "id" | "createdAt">) => void;
  /** INTERNAL — see appendTurn note. */
  setEscalation: (level: EscalationLevel) => void;
  /** INTERNAL — see appendTurn note. */
  setStep: (step: ConversationStep) => void;
  /** INTERNAL — see appendTurn note. */
  markPauseSuggested: () => void;
  /** Public — clears state including a sticky `critical` escalation. */
  reset: () => void;
};

/** Hard contract: BR-002. Reaching this depth invites a pause, not a wall. */
export const MAX_DEPTH = 15;
/** Pause suggestion threshold (BR-008). */
export const PAUSE_SUGGESTION_DEPTH = 10;
/** History retention cap — anti-profile-build contract. */
export const MAX_HISTORY_RETAINED = 30;

const initialState: ConversationState = {
  step: "idle",
  turns: [],
  escalation: "none",
  depth: 0,
  pauseSuggested: false,
};

let _seq = 0;
function nextId(): string {
  _seq += 1;
  return `t${Date.now().toString(36)}-${_seq}`;
}

export const useConversationStore = create<ConversationState & ConversationActions>(
  (set, get) => ({
    ...initialState,

    appendTurn: (turn) => {
      const fullTurn: ConversationTurn = {
        ...turn,
        cardKind: turn.cardKind ?? null,
        id: nextId(),
        createdAt: Date.now(),
      };
      set((s) => {
        const turns = [...s.turns, fullTurn].slice(-MAX_HISTORY_RETAINED);
        const depth =
          turn.speaker === "lumi" ? Math.min(s.depth + 1, MAX_DEPTH) : s.depth;
        const nextStep =
          s.step === "idle" && turn.speaker === "user" ? "conversing" : s.step;
        return { turns, depth, step: nextStep };
      });
    },

    setEscalation: (level) => {
      // Critical is sticky — only `reset` clears it.
      const current = get().escalation;
      if (current === "critical" && level !== "critical") return;
      set({
        escalation: level,
        step: level === "critical" ? "escalated" : get().step,
      });
    },

    setStep: (step) => {
      // Cannot leave "escalated" except via reset.
      if (get().step === "escalated" && step !== "escalated") return;
      set({ step });
    },

    markPauseSuggested: () => set({ pauseSuggested: true }),

    reset: () => set({ ...initialState, turns: [] }),
  }),
);

// ── Selectors ──

export function selectStep(s: ConversationState): ConversationStep {
  return s.step;
}

export function selectShouldSuggestPause(s: ConversationState): boolean {
  if (s.pauseSuggested) return false;
  if (s.escalation === "critical") return false; // crisis routing wins
  return s.depth >= PAUSE_SUGGESTION_DEPTH;
}

export function selectIsCapped(s: ConversationState): boolean {
  return s.depth >= MAX_DEPTH;
}
