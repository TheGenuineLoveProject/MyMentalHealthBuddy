export interface CognitiveBias {
  id: string;
  name: string;
  category: "perception" | "memory" | "social" | "decision" | "belief";
  description: string;
  example: string;
  debiasing: string;
  personalExamples?: string[];
  susceptibility?: number;
}

export interface BiasIncident {
  id: string;
  biasId: string;
  situation: string;
  howNoticed: string;
  whatHelped?: string;
  timestamp: string;
}

export interface BiasAwarenessProfile {
  id: string;
  incidents: BiasIncident[];
  mostSusceptible: string[];
  strategies: string[];
  reflectionNotes: string;
  createdAt: string;
  updatedAt: string;
}

export const COGNITIVE_BIASES: CognitiveBias[] = [
  {
    id: "confirmation",
    name: "Confirmation Bias",
    category: "belief",
    description: "Seeking information that confirms existing beliefs while ignoring contradicting evidence.",
    example: "Only reading news sources that align with your political views.",
    debiasing: "Actively seek out opposing viewpoints. Ask: What would change my mind?"
  },
  {
    id: "availability",
    name: "Availability Heuristic",
    category: "decision",
    description: "Judging probability by how easily examples come to mind.",
    example: "Overestimating plane crash risk after seeing news coverage.",
    debiasing: "Look up actual statistics rather than relying on memory."
  },
  {
    id: "anchoring",
    name: "Anchoring Effect",
    category: "decision",
    description: "Over-relying on the first piece of information encountered.",
    example: "A high initial price makes a 'discount' seem like a great deal.",
    debiasing: "Generate your own estimate before looking at any reference points."
  },
  {
    id: "hindsight",
    name: "Hindsight Bias",
    category: "memory",
    description: "Believing past events were predictable after knowing the outcome.",
    example: "Thinking you 'knew it all along' after an event occurs.",
    debiasing: "Write down predictions before outcomes. Review them honestly."
  },
  {
    id: "fundamental-attribution",
    name: "Fundamental Attribution Error",
    category: "social",
    description: "Attributing others' actions to character while attributing your own to circumstances.",
    example: "Thinking someone is rude vs. thinking you're just having a bad day.",
    debiasing: "Consider what circumstances might explain others' behavior."
  },
  {
    id: "dunning-kruger",
    name: "Dunning-Kruger Effect",
    category: "perception",
    description: "Less competent individuals overestimate their ability; experts underestimate.",
    example: "Overconfidence in a new skill before understanding its depth.",
    debiasing: "Seek feedback from genuine experts. Assume there's more to learn."
  },
  {
    id: "sunk-cost",
    name: "Sunk Cost Fallacy",
    category: "decision",
    description: "Continuing something because of past investment rather than future value.",
    example: "Finishing a bad movie because you paid for the ticket.",
    debiasing: "Ask: Would I start this today if I hadn't already invested?"
  },
  {
    id: "halo",
    name: "Halo Effect",
    category: "social",
    description: "Letting one positive trait influence perception of unrelated traits.",
    example: "Assuming an attractive person is also intelligent and kind.",
    debiasing: "Evaluate each trait independently. Look for contradicting evidence."
  },
  {
    id: "bandwagon",
    name: "Bandwagon Effect",
    category: "social",
    description: "Adopting beliefs or behaviors because many others do.",
    example: "Buying something just because it's popular.",
    debiasing: "Ask: Would I believe this if I were the only one?"
  },
  {
    id: "negativity",
    name: "Negativity Bias",
    category: "perception",
    description: "Giving more weight to negative experiences than positive ones.",
    example: "One criticism outweighing ten compliments.",
    debiasing: "Actively catalog positive experiences. Practice gratitude."
  },
  {
    id: "status-quo",
    name: "Status Quo Bias",
    category: "decision",
    description: "Preferring current state even when change would be beneficial.",
    example: "Staying in a suboptimal job because change feels risky.",
    debiasing: "Imagine you're choosing fresh. What would you pick?"
  },
  {
    id: "spotlight",
    name: "Spotlight Effect",
    category: "social",
    description: "Overestimating how much others notice about you.",
    example: "Thinking everyone noticed your minor mistake in a presentation.",
    debiasing: "Remember: others are focused on themselves, not you."
  }
];

export const BIAS_CATEGORIES: { id: CognitiveBias["category"]; label: string; description: string }[] = [
  { id: "perception", label: "Perception", description: "How we see and interpret reality" },
  { id: "memory", label: "Memory", description: "How we remember and reconstruct the past" },
  { id: "social", label: "Social", description: "How we perceive and interact with others" },
  { id: "decision", label: "Decision", description: "How we make choices and judgments" },
  { id: "belief", label: "Belief", description: "How we form and maintain beliefs" }
];

export const DEBIASING_PROMPTS = [
  "What evidence would convince me I'm wrong?",
  "What would a skeptic say about this?",
  "Am I reasoning toward a predetermined conclusion?",
  "What am I not seeing because of what I want to see?",
  "If I had to argue the opposite position, what would I say?",
  "What base rates am I ignoring?",
  "Am I confusing correlation with causation?",
  "What would I advise a friend in this situation?"
];

export function createBiasIncident(biasId: string, situation: string, howNoticed: string): BiasIncident {
  return {
    id: `incident_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    biasId,
    situation,
    howNoticed,
    timestamp: new Date().toISOString()
  };
}

export function createBiasAwarenessProfile(): BiasAwarenessProfile {
  return {
    id: `bias_profile_${Date.now()}`,
    incidents: [],
    mostSusceptible: [],
    strategies: [],
    reflectionNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveBiasAwarenessProfile(profile: BiasAwarenessProfile): void {
  const key = "glp_bias_profile";
  const updated = { ...profile, updatedAt: new Date().toISOString() };
  try { localStorage.setItem(key, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export function getBiasAwarenessProfile(): BiasAwarenessProfile | null {
  const stored = localStorage.getItem("glp_bias_profile");
  return stored ? JSON.parse(stored) : null;
}

export function getBiasById(id: string): CognitiveBias | undefined {
  return COGNITIVE_BIASES.find(b => b.id === id);
}

export function getRandomDebiasingPrompt(): string {
  return DEBIASING_PROMPTS[Math.floor(Math.random() * DEBIASING_PROMPTS.length)];
}

export function getMostFrequentBiases(incidents: BiasIncident[]): { biasId: string; count: number }[] {
  const counts: Record<string, number> = {};
  incidents.forEach(i => {
    counts[i.biasId] = (counts[i.biasId] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([biasId, count]) => ({ biasId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
