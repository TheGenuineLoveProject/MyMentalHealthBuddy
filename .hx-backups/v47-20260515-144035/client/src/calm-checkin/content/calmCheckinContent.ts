/**
 * Phase 14 (spec-aligned) — All copy lives here.
 *
 * Spec contracts:
 *   - FORBIDDEN phrases: "optimize", "unlock", "transform instantly", "boost",
 *     "level up", "challenge", "streak" (any growth/conversion language).
 *   - REQUIRED tone phrases: "Continue gently", "No pressure", "You choose".
 *   - Three exercise options (Breath / Grounding / Reflection), each opt-in.
 *   - "Begin One Breath", "Continue gently", "Take one breath" CTA phrases.
 */

export const CALM_FORBIDDEN_PHRASES = [
  "optimize",
  "unlock",
  "transform instantly",
  "boost",
  "level up",
  "challenge",
  "streak",
  "subscribe now",
  "upgrade now",
  "limited time",
  "today only",
  "don't miss",
  "act fast",
  "hurry",
];

export const CALM_REQUIRED_TONE_PHRASES = [
  "continue gently",
  "no pressure",
  "you choose",
];

export type IdleContent = {
  heading: string;
  subheading: string;
  options: { id: "breathing" | "grounding" | "reflecting"; label: string; description: string }[];
};

export type BreathingContent = {
  heading: string;
  intro: string;
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cyclePromptInhale: string;
  cyclePromptHold: string;
  cyclePromptExhale: string;
  completeCta: string;
  repeatCta: string;
  reducedMotionLabel: string;
};

export type GroundingContent = {
  heading: string;
  prompt: string;
  helperHint: string;
  completeCta: string;
};

export type ReflectionContent = {
  heading: string;
  prompt: string;
  placeholder: string;
  helperHint: string;
  completeCta: string;
};

export type CompleteContent = {
  heading: string;
  body: string;
  continueCta: string;
};

export type ContinueContent = {
  heading: string;
  body: string;
  options: {
    id: "continue-calmly" | "explore-tools" | "breathe-again" | "signup-later";
    label: string;
    helperText?: string;
  }[];
};

export const CALM_CONTENT: {
  idle: IdleContent;
  breathing: BreathingContent;
  grounding: GroundingContent;
  reflection: ReflectionContent;
  complete: CompleteContent;
  continue: ContinueContent;
  crisisLine: string;
} = {
  idle: {
    heading: "A small pause, if you'd like one.",
    subheading: "Three gentle ways to settle in. You choose. No pressure.",
    options: [
      {
        id: "breathing",
        label: "Begin One Breath",
        description: "One slow breath together — about twelve seconds.",
      },
      {
        id: "grounding",
        label: "Notice One Thing",
        description: "A short grounding moment — anything that feels safe or familiar.",
      },
      {
        id: "reflecting",
        label: "Quiet Reflection",
        description: "An optional prompt — write a word, a phrase, or nothing at all.",
      },
    ],
  },
  breathing: {
    heading: "Let's take one slower breath together.",
    intro: "About twelve seconds. You can stop any time — no pressure.",
    inhaleSeconds: 4,
    holdSeconds: 2,
    exhaleSeconds: 6,
    cyclePromptInhale: "Breathe in, gently.",
    cyclePromptHold: "Hold for a moment.",
    cyclePromptExhale: "Breathe out, slowly.",
    completeCta: "Take one breath",
    repeatCta: "Breathe again, if you'd like",
    reducedMotionLabel:
      "Inhale 4 seconds · Hold 2 seconds · Exhale 6 seconds. Take one breath at your own pace.",
  },
  grounding: {
    heading: "Notice one thing around you that feels safe or familiar.",
    prompt: "It can be anything — a color, a sound, a texture, a memory.",
    helperHint: "You don't need to share it. Just notice it for a moment.",
    completeCta: "I noticed something",
  },
  reflection: {
    heading: "What feels heaviest right now?",
    prompt:
      "If you'd like, name it in a word or a phrase. There are no required answers — silence is welcome too.",
    placeholder: "A word, a phrase, or nothing at all…",
    helperHint: "This stays here with you. It isn't saved or shared.",
    completeCta: "Continue gently",
  },
  complete: {
    heading: "That was kind of you to do.",
    body: "Whatever's next, you can take it slowly. You choose what comes after — there's no pressure here.",
    continueCta: "Continue gently",
  },
  continue: {
    heading: "Continue gently.",
    body: "These options are all soft. You choose the one that fits — or none at all.",
    options: [
      {
        id: "continue-calmly",
        label: "Continue calmly",
        helperText: "Step away with what you took from this moment.",
      },
      {
        id: "explore-tools",
        label: "Explore other gentle tools",
        helperText: "If you'd like more options like this one — no pressure.",
      },
      {
        id: "breathe-again",
        label: "Take one more breath",
        helperText: "If another slow breath feels right.",
      },
      {
        id: "signup-later",
        label: "Optional signup, later",
        helperText: "If you ever want to come back and find your footing again.",
      },
    ],
  },
  crisisLine:
    "If anything inside you is asking for more support, /crisis is always one tap away.",
};
