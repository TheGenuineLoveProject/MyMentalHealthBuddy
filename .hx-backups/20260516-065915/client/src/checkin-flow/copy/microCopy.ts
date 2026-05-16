/**
 * Phase 14 — NLP + Motivational-Interviewing infused copy.
 * OARS technique: Open questions, Affirmations, Reflections, Summaries.
 *
 * GOVERNED PHRASES — see governance/checkInFlowRules.ts CF-R006/R008.
 *   Forbidden: "you should", "sign up now", "limited time", "only X left",
 *              "don't miss out", "act now", "must", "expires"
 *   Required examples: "you choose", "no pressure", "that's completely okay",
 *              "what feels right", "in your own time"
 */

import type {
  BreathingPhaseConfig,
  MoodOption,
  ShiftOption,
} from "../types/checkInFlowTypes";

export const moods: readonly MoodOption[] = [
  { id: "tense",   label: "A little tense",     reflection: "Thank you for naming that. Tension can be the body asking for a slower moment." },
  { id: "anxious", label: "Anxious",            reflection: "Anxious moments are real. You came here, which already takes courage." },
  { id: "tired",   label: "Tired",              reflection: "Tiredness is honest information. Let's give your nervous system a soft pause." },
  { id: "okay",    label: "Okay-ish",           reflection: "Okay-ish counts. You don't have to feel any particular way to be here." },
  { id: "calm",    label: "Mostly calm",        reflection: "That's a gentle place to begin from. We'll keep it gentle." },
  { id: "lifted",  label: "Already feeling lifted", reflection: "Beautiful. A short reset can protect that feeling for the rest of your day." },
] as const;

/** 4-7-8 breathing × 4 cycles ≈ 63s + 7s rest cushions. */
export const breathingCycle: readonly BreathingPhaseConfig[] = [
  { phase: "inhale",  seconds: 4, cue: "Breathe in, softly through your nose" },
  { phase: "hold",    seconds: 7, cue: "Hold — gently, no strain" },
  { phase: "exhale",  seconds: 8, cue: "Slow release through your mouth" },
  { phase: "rest",    seconds: 1, cue: "Rest for one beat" },
] as const;

export const breathingTotalSeconds = (
  breathingCycle.reduce((sum, p) => sum + p.seconds, 0) * 4
);

export const shiftOptions: readonly ShiftOption[] = [
  { id: "softer",    label: "A little softer", response: "That's the nervous system finding ground. Worth noticing." },
  { id: "same",      label: "About the same",  response: "Some moments need more than one breath cycle. That's completely okay." },
  { id: "lighter",   label: "Noticeably lighter", response: "Beautiful. Your body knows how to come back to itself." },
  { id: "more-time", label: "I need more time", response: "Of course. There's no clock here. You can stay as long as you need." },
] as const;

export const welcomeCopy = {
  greeting: "Hi, I'm Lumi.",
  intro: "Before anything else — how are you arriving today?",
  consent: "No log-in. No tracking. Just a moment for you.",
  crisisLine: "If you're in crisis, please open /crisis right now.",
} as const;

export const breathingCopy = {
  title: "Let's take 60 seconds together.",
  subtitle: "Four cycles of 4-7-8 breathing. You can stop anytime.",
  cancel: "Stop and go back",
  reducedMotionNote: "Following text cues — no movement.",
} as const;

export const checkoutCopy = {
  title: "How does that feel now?",
  subtitle: "There's no right answer. Just notice.",
} as const;

/**
 * Offer copy — soft, MI-aligned. Used ONLY after breathing completes
 * and the store transitions to step="offer".
 */
export const offerCopy = {
  title: "If this felt useful…",
  body: "MyMentalHealthBuddy gives you a calm companion for moments like this — daily check-ins, gentle journaling, and grounding tools. No pressure. You choose if and when.",
  primaryCta: "Explore at your own pace",
  secondaryCta: "Maybe another time",
  reassurance: "Either choice is welcome here.",
} as const;

export const completeCopy = {
  title: "Thank you for showing up for yourself.",
  body: "That's a real act of care. Whenever you'd like another moment, the door is open.",
  cta: "Close",
} as const;

export const declinedCopy = {
  title: "Of course.",
  body: "Thank you for taking these few minutes. The breathing exercise is here whenever you'd like to come back.",
  cta: "Close",
} as const;

/** Phrases governance/checkInFlowRules.ts CF-R006 + CF-R008 will scan for. */
export const FORBIDDEN_PHRASES: readonly string[] = [
  "you should",
  "you must",
  "sign up now",
  "limited time",
  "only a few left",
  "don't miss out",
  "act now",
  "expires soon",
  "last chance",
  "hurry",
] as const;

export const REQUIRED_TONE_PHRASES: readonly string[] = [
  "you choose",
  "no pressure",
  "completely okay",
  "your own pace",
  "you can stop",
  "stay as long",
  "if and when",
] as const;
