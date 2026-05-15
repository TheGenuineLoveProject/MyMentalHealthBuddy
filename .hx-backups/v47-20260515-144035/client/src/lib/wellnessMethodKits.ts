// Educational tools only. No medical claims. No diagnosis.
// This is a skill-building + reflection library.

export const motivationalInterviewing = {
  name: "Motivational Interviewing (MI) style reflection",
  spirit: [
    "Partnership (we collaborate with your goals)",
    "Acceptance (respect your autonomy)",
    "Compassion (gentle, non-judgmental tone)",
    "Evocation (draw out your own reasons for change)",
  ],
  corePrompts: [
    "What matters most to you about this?",
    "On a scale of 0–10, how ready do you feel to take one small step?",
    "What would make that number just one point higher?",
    "What’s one reason you might want to change… and one reason you might not?",
    "If you did take a small step, what would be the smallest version that still counts?",
  ],
  changeTalk: [
    "What would you gain if things improved by 5%?",
    "What do you want more of in your life?",
    "What would future-you thank you for?",
  ],
};

export const ethicalNlp = {
  name: "Ethical NLP-inspired language practice",
  rules: [
    "No hypnosis claims, no guaranteed outcomes.",
    "No manipulation. User consent + opt-out always.",
    "Use language for clarity, self-respect, and choice.",
  ],
  patterns: [
    {
      label: "Reframe to choice",
      template: "I notice I’m telling myself: “____”. A kinder, truer option is: “____”.",
    },
    {
      label: "Tiny-next-step",
      template: "The smallest step I’m willing to try is: ____ (under 2 minutes).",
    },
    {
      label: "Boundary language",
      template: "A respectful boundary I can try is: “____”.",
    },
  ],
};

export const selfAlignmentPath = {
  // A “12-step style” transformation framework WITHOUT 12-step branding
  // (no affiliation, no substance-focus, no clinical claims)
  name: "12-Phase Self-Alignment Path",
  phases: [
    { n: 1, title: "Pause & Notice", aim: "Name what’s happening without judging it." },
    { n: 2, title: "Safety First", aim: "Choose what feels safe; reduce intensity." },
    { n: 3, title: "Values Signal", aim: "What value is calling for attention?" },
    { n: 4, title: "Small Truth", aim: "Write one honest sentence." },
    { n: 5, title: "Choice Point", aim: "What’s one option that respects you?" },
    { n: 6, title: "Support Map", aim: "Who/what helps you stay steady?" },
    { n: 7, title: "Gentle Plan", aim: "A plan small enough to do today." },
    { n: 8, title: "Practice Loop", aim: "Repeat the smallest step for 3 days." },
    { n: 9, title: "Repair & Learn", aim: "When you slip, repair without shame." },
    { n: 10, title: "Gratitude & Meaning", aim: "Find the lesson or meaning." },
    { n: 11, title: "Contribution", aim: "One kind act aligned with your values." },
    { n: 12, title: "Integration", aim: "Make it your normal, at your pace." },
  ],
};