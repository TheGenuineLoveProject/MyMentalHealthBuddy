export interface MoralDilemma {
  id: string;
  title: string;
  description: string;
  stakeholders: string[];
  considerations: MoralConsideration[];
  reasoning: string;
  decision: string;
  framework: MoralFramework;
  confidence: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
}

export interface MoralConsideration {
  perspective: string;
  argument: string;
  weight: 1 | 2 | 3;
}

export type MoralFramework = 
  | "consequentialism" 
  | "deontology" 
  | "virtue" 
  | "care" 
  | "justice" 
  | "pragmatic";

export const MORAL_FRAMEWORKS = {
  consequentialism: {
    name: "Consequentialism",
    question: "What action produces the best outcomes for all affected?",
    description: "Judges actions by their consequences and outcomes",
    thinkers: ["Mill", "Bentham", "Singer"]
  },
  deontology: {
    name: "Deontology",
    question: "What are my duties regardless of consequences?",
    description: "Focuses on inherent rightness of actions based on rules or duties",
    thinkers: ["Kant", "Ross", "Rawls"]
  },
  virtue: {
    name: "Virtue Ethics",
    question: "What would a person of good character do?",
    description: "Emphasizes character traits and becoming a good person",
    thinkers: ["Aristotle", "MacIntyre", "Foot"]
  },
  care: {
    name: "Ethics of Care",
    question: "How do I best care for those in relationship with me?",
    description: "Prioritizes relationships, context, and responsibility to others",
    thinkers: ["Gilligan", "Noddings", "Held"]
  },
  justice: {
    name: "Justice Theory",
    question: "What principles would I choose from behind a veil of ignorance?",
    description: "Seeks fair principles all rational people would accept",
    thinkers: ["Rawls", "Nozick", "Sen"]
  },
  pragmatic: {
    name: "Moral Pragmatism",
    question: "What works to solve this problem in this context?",
    description: "Evaluates moral claims by their practical consequences",
    thinkers: ["Dewey", "James", "Rorty"]
  }
} as const;

export const CLASSIC_DILEMMAS = [
  {
    title: "The Trolley Problem",
    description: "A runaway trolley will kill five people. You can divert it to a side track where it will kill one person instead.",
    stakeholders: ["Five people on main track", "One person on side track", "You"]
  },
  {
    title: "The Whistleblower",
    description: "You discover your company is engaging in harmful but legal practices. Reporting could cost your job and harm colleagues.",
    stakeholders: ["Public affected", "Colleagues", "Company", "Family", "You"]
  },
  {
    title: "The Promise",
    description: "You promised to help a friend move, but another friend has an emergency that requires your presence.",
    stakeholders: ["Friend with moving plans", "Friend with emergency", "You"]
  },
  {
    title: "The Truth Dilemma",
    description: "Telling the full truth will deeply hurt someone you care about, while a compassionate omission protects them.",
    stakeholders: ["Person who may be hurt", "Relationship trust", "You"]
  }
] as const;

export const STORAGE_KEY = "glp_moral_dilemmas";

export function loadMoralDilemmas(): MoralDilemma[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return [];
}

export function saveMoralDilemmas(dilemmas: MoralDilemma[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(dilemmas)); } catch (err) { console.warn("[storage-safe-write]", err); }
}
