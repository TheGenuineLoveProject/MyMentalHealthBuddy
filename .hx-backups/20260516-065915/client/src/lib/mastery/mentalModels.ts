export interface MentalModel {
  id: string;
  name: string;
  category: "thinking" | "decision" | "systems" | "learning" | "communication" | "productivity";
  description: string;
  keyQuestion: string;
  examples: string[];
  relatedModels: string[];
}

export interface ModelApplication {
  id: string;
  modelId: string;
  situation: string;
  application: string;
  outcome: string;
  learning: string;
  timestamp: string;
}

export interface ModelLibrary {
  applications: ModelApplication[];
  favoriteModels: string[];
  practiceLog: { date: string; modelId: string; context: string }[];
}

export const MENTAL_MODELS_LIBRARY: MentalModel[] = [
  {
    id: "first-principles",
    name: "First Principles Thinking",
    category: "thinking",
    description: "Break down complex problems into fundamental truths and build up from there",
    keyQuestion: "What are the fundamental truths here, and what can we build from them?",
    examples: ["Elon Musk on batteries", "Questioning assumptions in any field"],
    relatedModels: ["inversion", "occams-razor"]
  },
  {
    id: "inversion",
    name: "Inversion",
    category: "thinking",
    description: "Think backwards—instead of asking how to succeed, ask how to fail, then avoid those things",
    keyQuestion: "What would guarantee failure here, and how do I avoid it?",
    examples: ["Charlie Munger's 'tell me where I'm going to die'", "Pre-mortem analysis"],
    relatedModels: ["first-principles", "pre-mortem"]
  },
  {
    id: "second-order",
    name: "Second-Order Thinking",
    category: "decision",
    description: "Consider the consequences of the consequences",
    keyQuestion: "And then what? What happens after the first effect?",
    examples: ["Rent control effects on housing supply", "Incentive structure consequences"],
    relatedModels: ["systems-thinking", "chestertons-fence"]
  },
  {
    id: "circle-of-competence",
    name: "Circle of Competence",
    category: "decision",
    description: "Understand where your expertise lies and stay within it, or expand it deliberately",
    keyQuestion: "Am I operating within my actual competence, or am I overconfident?",
    examples: ["Warren Buffett's investment philosophy", "Knowing when to defer to experts"],
    relatedModels: ["dunning-kruger", "intellectual-humility"]
  },
  {
    id: "probabilistic",
    name: "Probabilistic Thinking",
    category: "decision",
    description: "Think in probabilities and expected values rather than certainties",
    keyQuestion: "What are the probabilities and expected outcomes of each option?",
    examples: ["Insurance decisions", "Investment allocation", "Career choices"],
    relatedModels: ["bayesian-updating", "expected-value"]
  },
  {
    id: "occams-razor",
    name: "Occam's Razor",
    category: "thinking",
    description: "Among competing explanations, prefer the simplest one",
    keyQuestion: "What's the simplest explanation that fits the facts?",
    examples: ["Diagnostic reasoning", "Debugging code", "Conspiracy theories vs. simple explanations"],
    relatedModels: ["first-principles", "hanlon-razor"]
  },
  {
    id: "hanlon-razor",
    name: "Hanlon's Razor",
    category: "thinking",
    description: "Never attribute to malice that which can be explained by incompetence or oversight",
    keyQuestion: "Is there a simpler, non-malicious explanation for this behavior?",
    examples: ["Workplace conflicts", "Service failures", "Relationship misunderstandings"],
    relatedModels: ["occams-razor", "charitable-interpretation"]
  },
  {
    id: "pareto",
    name: "Pareto Principle (80/20)",
    category: "productivity",
    description: "Roughly 80% of effects come from 20% of causes",
    keyQuestion: "Which 20% of inputs are producing 80% of the results?",
    examples: ["Customer profitability", "Time management", "Feature usage"],
    relatedModels: ["leverage", "power-law"]
  },
  {
    id: "feedback-loops",
    name: "Feedback Loops",
    category: "systems",
    description: "Outputs of a system circle back as inputs, creating reinforcing or balancing dynamics",
    keyQuestion: "What feedback loops are operating here, and are they reinforcing or balancing?",
    examples: ["Compound interest", "Social media algorithms", "Habit formation"],
    relatedModels: ["systems-thinking", "second-order"]
  },
  {
    id: "margin-of-safety",
    name: "Margin of Safety",
    category: "decision",
    description: "Build in buffers to account for uncertainty and error",
    keyQuestion: "What buffer am I building in for things going wrong?",
    examples: ["Engineering tolerances", "Financial reserves", "Time buffers in schedules"],
    relatedModels: ["probabilistic", "antifragility"]
  },
  {
    id: "reversibility",
    name: "Reversibility",
    category: "decision",
    description: "Distinguish between reversible and irreversible decisions, and act accordingly",
    keyQuestion: "Is this decision easily reversible, or is it a one-way door?",
    examples: ["Jeff Bezos' Type 1 vs Type 2 decisions", "Career moves", "Relationships"],
    relatedModels: ["optionality", "regret-minimization"]
  },
  {
    id: "opportunity-cost",
    name: "Opportunity Cost",
    category: "decision",
    description: "The true cost of anything is what you give up to get it",
    keyQuestion: "What am I giving up by choosing this option?",
    examples: ["Time spent on one project vs. another", "Career path choices"],
    relatedModels: ["trade-offs", "pareto"]
  }
];

export const STORAGE_KEY = "glp_mental_models_library";

export function loadModelLibrary(): ModelLibrary {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return { applications: [], favoriteModels: [], practiceLog: [] };
}

export function saveModelLibrary(library: ModelLibrary): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
}
