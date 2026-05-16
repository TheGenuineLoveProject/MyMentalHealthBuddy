export interface DecisionOption {
  id: string;
  label: string;
  pros: string[];
  cons: string[];
  probability?: number;
  impact?: number;
  reversibility: "easy" | "moderate" | "difficult" | "irreversible";
}

export interface DecisionCriterion {
  id: string;
  name: string;
  weight: number;
  description?: string;
}

export interface DecisionFrame {
  id: string;
  question: string;
  context: string;
  timeHorizon: "immediate" | "short-term" | "long-term" | "legacy";
  options: DecisionOption[];
  criteria: DecisionCriterion[];
  premortemNotes: string;
  intuitiveLeaning?: string;
  finalReflection?: string;
  createdAt: string;
  updatedAt: string;
}

export const DECISION_FRAMEWORKS = [
  {
    id: "10-10-10",
    name: "10/10/10 Rule",
    description: "How will you feel about this decision in 10 minutes, 10 months, and 10 years?",
    prompt: "Project yourself into each timeframe. What matters most changes with perspective."
  },
  {
    id: "regret-minimization",
    name: "Regret Minimization",
    description: "Which choice minimizes regret when you're 80 looking back?",
    prompt: "Your future self is watching. What would make them proud?"
  },
  {
    id: "reversibility",
    name: "Reversibility Test",
    description: "One-way doors deserve more deliberation than two-way doors.",
    prompt: "If this is reversible, move fast. If not, slow down and gather more information."
  },
  {
    id: "second-order",
    name: "Second-Order Effects",
    description: "What happens after what happens?",
    prompt: "Trace the chain of consequences. The second and third effects often matter most."
  },
  {
    id: "inversion",
    name: "Inversion",
    description: "Instead of how to succeed, ask how you might fail.",
    prompt: "What would guarantee failure? Now avoid those things."
  },
  {
    id: "opportunity-cost",
    name: "Opportunity Cost",
    description: "What are you saying no to by saying yes?",
    prompt: "Every choice closes other doors. Which doors matter most?"
  }
];

export const PREMORTEM_PROMPTS = [
  "Imagine this decision failed spectacularly. What went wrong?",
  "What assumption, if false, would make this the wrong choice?",
  "What are you not seeing because you want this to work?",
  "What would a trusted skeptic say about this decision?",
  "What external factors could derail this regardless of your actions?"
];

export function createDecisionOption(label: string): DecisionOption {
  return {
    id: `opt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    label,
    pros: [],
    cons: [],
    reversibility: "moderate"
  };
}

export function createDecisionCriterion(name: string, weight: number = 50): DecisionCriterion {
  return {
    id: `crit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    weight
  };
}

export function createDecisionFrame(question: string): DecisionFrame {
  return {
    id: `decision_${Date.now()}`,
    question,
    context: "",
    timeHorizon: "short-term",
    options: [],
    criteria: [],
    premortemNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveDecisionFrame(frame: DecisionFrame): void {
  const key = "glp_decision_frames";
  const existing: DecisionFrame[] = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = existing.findIndex(f => f.id === frame.id);
  const updated = { ...frame, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 25)));
}

export function getDecisionFrames(): DecisionFrame[] {
  return JSON.parse(localStorage.getItem("glp_decision_frames") || "[]");
}

export function deleteDecisionFrame(id: string): void {
  const key = "glp_decision_frames";
  const existing: DecisionFrame[] = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify(existing.filter(f => f.id !== id)));
}

export function getRandomPremortemPrompt(): string {
  return PREMORTEM_PROMPTS[Math.floor(Math.random() * PREMORTEM_PROMPTS.length)];
}

export function scoreOption(option: DecisionOption, criteria: DecisionCriterion[]): number {
  const prosWeight = option.pros.length * 10;
  const consWeight = option.cons.length * 8;
  const reversibilityBonus = option.reversibility === "easy" ? 15 : 
    option.reversibility === "moderate" ? 5 : 
    option.reversibility === "difficult" ? -5 : -15;
  return Math.max(0, Math.min(100, 50 + prosWeight - consWeight + reversibilityBonus));
}
