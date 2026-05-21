export interface TemporalLens {
  id: "past" | "present" | "future";
  name: string;
  description: string;
  questions: string[];
}

export interface TemporalIntegration {
  topic: string;
  past: string;
  present: string;
  future: string;
  integration: string;
  timestamp: string;
}

export const TEMPORAL_LENSES: TemporalLens[] = [
  {
    id: "past",
    name: "The Witness",
    description: "Looking back with compassion at what was, learning without blame.",
    questions: [
      "What wisdom does your past self have for you today?",
      "What did younger you need that you can now provide?",
      "What patterns from the past are still running?",
      "What story from your past needs rewriting?",
      "What would you tell your younger self if you could?",
      "What pain from the past still needs acknowledgment?",
      "What gift from your past have you forgotten?"
    ]
  },
  {
    id: "present",
    name: "The Observer",
    description: "Witnessing what is, without judgment or rush to change.",
    questions: [
      "What is true right now, in this exact moment?",
      "What sensation exists in your body right now?",
      "What are you aware of that you usually ignore?",
      "What would this moment look like to a neutral observer?",
      "What is present that you're not acknowledging?",
      "What is your body trying to tell you right now?",
      "If you stopped all striving, what would remain?"
    ]
  },
  {
    id: "future",
    name: "The Visionary",
    description: "Connecting with possibility without attachment to specific outcomes.",
    questions: [
      "What does your future self want you to know?",
      "What seed are you planting today for tomorrow?",
      "What would your wisest future self do?",
      "What becomes possible if this challenge resolves?",
      "What are you becoming?",
      "What future are you creating with today's choices?",
      "What would you do if you trusted yourself completely?"
    ]
  }
];

export interface TemporalPattern {
  pattern: string;
  pastManifestation: string;
  presentManifestation: string;
  futureTransformation: string;
}

export const INTEGRATION_PROMPTS = [
  "What thread connects your past, present, and future selves?",
  "What wisdom from the past supports your present moment?",
  "What present action honors both your history and your becoming?",
  "Where do all three timeframes agree about what matters?",
  "What would it mean to fully inhabit this moment while honoring all versions of yourself?",
  "How does your past inform your present without determining your future?",
  "What becomes possible when you hold all three perspectives at once?"
];

export function getTemporalLens(id: TemporalLens["id"]): TemporalLens {
  return TEMPORAL_LENSES.find(l => l.id === id)!;
}

export function getRandomTemporalQuestion(lensId?: TemporalLens["id"]): string {
  if (lensId) {
    const lens = getTemporalLens(lensId);
    return lens.questions[Math.floor(Math.random() * lens.questions.length)];
  }
  const allQuestions = TEMPORAL_LENSES.flatMap(l => l.questions);
  return allQuestions[Math.floor(Math.random() * allQuestions.length)];
}

export function getIntegrationPrompt(): string {
  return INTEGRATION_PROMPTS[Math.floor(Math.random() * INTEGRATION_PROMPTS.length)];
}

export function saveTemporalIntegration(integration: TemporalIntegration): void {
  const key = "glp_temporal_integrations";
  const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  localStorage.setItem(key, JSON.stringify([integration, ...existing].slice(0, 30)));
}

export function getTemporalIntegrations(): TemporalIntegration[] {
  const key = "glp_temporal_integrations";
  return ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
}
