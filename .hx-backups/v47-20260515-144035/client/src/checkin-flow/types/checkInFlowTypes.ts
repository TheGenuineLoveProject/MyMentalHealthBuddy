/**
 * Phase 14 — Calm Check-In Entry Flow types.
 * Trust-first contract: subscription messaging never appears before breathing completes.
 */

export type FlowStep =
  | "welcome"
  | "breathing"
  | "checkout"
  | "offer"
  | "complete"
  | "declined";

export type MoodId =
  | "tense"
  | "anxious"
  | "tired"
  | "okay"
  | "calm"
  | "lifted";

export type ShiftId = "softer" | "same" | "lighter" | "more-time";

export type BreathingPhase = "inhale" | "hold" | "exhale" | "rest";

export type MoodOption = {
  readonly id: MoodId;
  readonly label: string;
  /** Motivational-Interviewing reflection shown after selection. */
  readonly reflection: string;
};

export type ShiftOption = {
  readonly id: ShiftId;
  readonly label: string;
  readonly response: string;
};

export type BreathingPhaseConfig = {
  readonly phase: BreathingPhase;
  readonly seconds: number;
  readonly cue: string;
};

export type FlowState = {
  step: FlowStep;
  selectedMood: MoodId | null;
  selectedShift: ShiftId | null;
  breathingCompleted: boolean;
  /** Hard-locked false until the offer step renders. */
  subscriptionMentioned: boolean;
  startedAt: number | null;
  completedAt: number | null;
};

export type FlowActions = {
  selectMood: (mood: MoodId) => void;
  startBreathing: () => void;
  setBreathingCompleted: () => void;
  selectShift: (shift: ShiftId) => void;
  goToOffer: () => void;
  acceptOffer: () => void;
  declineOffer: () => void;
  reset: () => void;
};

/** Selector contract: subscription UI MUST gate behind this. */
export type IsSubscriptionMessagingAllowed = (state: FlowState) => boolean;
