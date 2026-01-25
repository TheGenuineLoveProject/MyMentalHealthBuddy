/**
 * Motivational Interviewing (MI) Patterns Library
 * 5-step MI micro-flow for trauma-informed engagement
 * 
 * Usage: Import and use in Mood, Journal, Wisdom, and Next Step cards
 * Constraint: Never claim outcomes. Use "may help," "often supports," "many people find."
 */

export interface MIStep {
  type: "open" | "affirm" | "reflect" | "summarize" | "evoke";
  label: string;
  template: string;
  examples: string[];
}

export const MI_STEPS: MIStep[] = [
  {
    type: "open",
    label: "Open Question",
    template: "What matters most about this right now?",
    examples: [
      "What brought you here today?",
      "What would you most like to explore?",
      "What feels important to name right now?"
    ]
  },
  {
    type: "affirm",
    label: "Affirmation",
    template: "It makes sense you feel that. You're showing courage by naming it.",
    examples: [
      "That takes real awareness to notice.",
      "It's meaningful that you're taking time for this.",
      "Your willingness to reflect shows strength."
    ]
  },
  {
    type: "reflect",
    label: "Reflection",
    template: "It sounds like ___ and you want ___.",
    examples: [
      "So you're feeling ___ because ___.",
      "It seems like this connects to ___.",
      "What I'm hearing is ___ matters to you."
    ]
  },
  {
    type: "summarize",
    label: "Summarize",
    template: "So far we have: ___.",
    examples: [
      "Let me reflect back what you've shared: ___.",
      "To summarize what's come up: ___.",
      "The key themes seem to be: ___."
    ]
  },
  {
    type: "evoke",
    label: "Evoke Change Talk",
    template: "On a scale of 0–10, how ready are you to take one small step?",
    examples: [
      "What would raise your readiness by one point?",
      "What's the smallest step you'd actually do today?",
      "If you were to try one tiny thing, what might it be?"
    ]
  }
];

export interface ReadinessResponse {
  level: "low" | "medium" | "high";
  prompt: string;
  followUp: string;
}

export const READINESS_RESPONSES: Record<number, ReadinessResponse> = {
  0: { level: "low", prompt: "What would need to change for you to feel ready?", followUp: "That's okay. Sometimes rest is the next step." },
  1: { level: "low", prompt: "What's one tiny thing that might feel possible?", followUp: "Even noticing counts as progress." },
  2: { level: "low", prompt: "What would raise it by just one point?", followUp: "Small shifts add up over time." },
  3: { level: "low", prompt: "What's holding you back right now?", followUp: "Naming barriers is part of the process." },
  4: { level: "low", prompt: "What support would help you move forward?", followUp: "Asking for help is a strength." },
  5: { level: "medium", prompt: "You're at the halfway point. What might tip you forward?", followUp: "You're closer than you think." },
  6: { level: "medium", prompt: "What's the smallest step you'd actually do today?", followUp: "One action can shift momentum." },
  7: { level: "high", prompt: "You're ready. What's your next move?", followUp: "Trust your readiness." },
  8: { level: "high", prompt: "Great! When will you take that step?", followUp: "Timing matters. Choose a moment." },
  9: { level: "high", prompt: "You're almost there. What's left to decide?", followUp: "You have what you need." },
  10: { level: "high", prompt: "You're fully ready. Go for it!", followUp: "Take action with confidence." }
};

export function getReadinessResponse(score: number): ReadinessResponse {
  const clampedScore = Math.max(0, Math.min(10, Math.round(score)));
  return READINESS_RESPONSES[clampedScore];
}

export const MI_AFFIRMATIONS: string[] = [
  "You're showing real self-awareness by exploring this.",
  "It takes courage to look at what you're feeling.",
  "Your willingness to reflect is a strength.",
  "Noticing patterns is powerful work.",
  "You're building something meaningful here.",
  "Each small step you take matters.",
  "Your insight is growing with each reflection.",
  "You're honoring yourself by taking this time."
];

export function getRandomAffirmation(): string {
  return MI_AFFIRMATIONS[Math.floor(Math.random() * MI_AFFIRMATIONS.length)];
}

export function getRandomMIPrompt(stepType: MIStep["type"]): string {
  const step = MI_STEPS.find(s => s.type === stepType);
  if (!step) return "What matters most to you right now?";
  const allPrompts = [step.template, ...step.examples];
  return allPrompts[Math.floor(Math.random() * allPrompts.length)];
}

export const SAFE_OUTCOME_LANGUAGE = {
  mayHelp: "This may help you",
  oftenSupports: "Many people find this supports",
  canOffer: "This offers an opportunity to",
  invites: "This invites you to explore",
  designed: "This is designed to support"
};

export function wrapOutcome(action: string): string {
  const prefixes = Object.values(SAFE_OUTCOME_LANGUAGE);
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix} ${action}`;
}
