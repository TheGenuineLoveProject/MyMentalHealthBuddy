export interface CognitiveBias {
  id: string;
  name: string;
  category: "perception" | "memory" | "judgment" | "social" | "self";
  description: string;
  question: string;
  antidote: string;
}

export const COGNITIVE_BIASES: CognitiveBias[] = [
  {
    id: "confirmation",
    name: "Confirmation Bias",
    category: "perception",
    description: "Seeking information that confirms existing beliefs while ignoring contradicting evidence.",
    question: "What evidence might challenge my current view that I haven't looked for?",
    antidote: "Actively seek out the strongest opposing argument before concluding."
  },
  {
    id: "availability",
    name: "Availability Heuristic",
    category: "judgment",
    description: "Overweighting information that comes to mind easily (recent, vivid, emotional).",
    question: "Is this coming to mind because it's common, or because it's memorable?",
    antidote: "Ask: What's the actual base rate? Seek data over anecdotes."
  },
  {
    id: "anchoring",
    name: "Anchoring Effect",
    category: "judgment",
    description: "Over-relying on the first piece of information encountered when making decisions.",
    question: "What was my first impression, and am I adjusting enough from it?",
    antidote: "Generate your own estimate before looking at others' numbers."
  },
  {
    id: "fundamental-attribution",
    name: "Fundamental Attribution Error",
    category: "social",
    description: "Attributing others' behavior to character while attributing your own to circumstances.",
    question: "What situational factors might explain this behavior?",
    antidote: "Imagine yourself in their exact situation with their exact information."
  },
  {
    id: "sunk-cost",
    name: "Sunk Cost Fallacy",
    category: "judgment",
    description: "Continuing a course of action because of past investment rather than future value.",
    question: "If I were starting fresh today, would I make this same choice?",
    antidote: "Focus only on future costs and benefits, not past investments."
  },
  {
    id: "hindsight",
    name: "Hindsight Bias",
    category: "memory",
    description: "Believing past events were more predictable than they actually were.",
    question: "What did I actually believe before I knew the outcome?",
    antidote: "Keep written predictions before outcomes are known."
  },
  {
    id: "dunning-kruger",
    name: "Dunning-Kruger Effect",
    category: "self",
    description: "Overestimating competence in areas of low skill; underestimating in areas of high skill.",
    question: "How would someone with 10x my experience evaluate my assessment?",
    antidote: "Seek feedback from genuine experts before trusting your judgment."
  },
  {
    id: "spotlight",
    name: "Spotlight Effect",
    category: "self",
    description: "Overestimating how much others notice your appearance, behavior, or mistakes.",
    question: "How much would I actually notice this in someone else?",
    antidote: "Remember: Everyone is the star of their own movie, not yours."
  },
  {
    id: "negativity",
    name: "Negativity Bias",
    category: "perception",
    description: "Giving more weight to negative experiences than positive ones of equal intensity.",
    question: "Am I giving this negative event appropriate weight, or disproportionate attention?",
    antidote: "Deliberately recall three positive events for each negative one considered."
  },
  {
    id: "halo",
    name: "Halo Effect",
    category: "social",
    description: "Letting one positive trait influence perception of unrelated characteristics.",
    question: "Am I evaluating each trait independently, or is one trait coloring my view?",
    antidote: "Rate each dimension separately before forming an overall judgment."
  },
  {
    id: "status-quo",
    name: "Status Quo Bias",
    category: "judgment",
    description: "Preferring the current state of affairs even when change would be beneficial.",
    question: "If I were choosing fresh, would I choose the current situation?",
    antidote: "Frame the decision as choosing between two new options."
  },
  {
    id: "self-serving",
    name: "Self-Serving Bias",
    category: "self",
    description: "Attributing success to personal factors and failure to external factors.",
    question: "How much of this outcome was due to my actions vs. circumstances?",
    antidote: "Credit luck for successes; take ownership for failures."
  }
];

export interface AssumptionAudit {
  statement: string;
  evidence: string;
  counterEvidence: string;
  confidence: number;
  timestamp: string;
}

export interface AbstractionLevel {
  level: "concrete" | "pattern" | "principle" | "paradigm";
  label: string;
  description: string;
  prompt: string;
}

export const ABSTRACTION_LADDER: AbstractionLevel[] = [
  {
    level: "concrete",
    label: "Concrete Details",
    description: "The specific, observable facts of the situation.",
    prompt: "What exactly happened? What did you see, hear, feel?"
  },
  {
    level: "pattern",
    label: "Pattern Recognition",
    description: "Recurring themes across similar situations.",
    prompt: "What pattern does this fit? Where have you seen this before?"
  },
  {
    level: "principle",
    label: "Underlying Principle",
    description: "The general rule or truth this exemplifies.",
    prompt: "What deeper principle is at work here? What always seems true?"
  },
  {
    level: "paradigm",
    label: "Paradigm / Worldview",
    description: "The fundamental assumptions shaping perception.",
    prompt: "What beliefs about reality make this possible? What would change everything?"
  }
];

export interface MetaCognitionSession {
  id: string;
  type: "bias-check" | "assumption-audit" | "abstraction-ladder";
  topic: string;
  responses: Record<string, string>;
  insights: string;
  timestamp: string;
}

export function getBiasByCategory(category: CognitiveBias["category"]): CognitiveBias[] {
  return COGNITIVE_BIASES.filter(b => b.category === category);
}

export function getRandomBiases(count: number = 3): CognitiveBias[] {
  const shuffled = [...COGNITIVE_BIASES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function saveMetaCognitionSession(session: MetaCognitionSession): void {
  const key = "glp_metacognition_sessions";
  const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  localStorage.setItem(key, JSON.stringify([session, ...existing].slice(0, 30)));
}

export function getMetaCognitionSessions(): MetaCognitionSession[] {
  return ((()=>{try{return JSON.parse(localStorage.getItem("glp_metacognition_sessions") || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
}
