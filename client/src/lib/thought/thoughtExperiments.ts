export interface ThoughtExperiment {
  id: string;
  name: string;
  category: "ethics" | "identity" | "epistemology" | "metaphysics" | "consciousness" | "society";
  premise: string;
  questions: string[];
  relatedConcepts: string[];
  yourResponse?: string;
  reflections?: string[];
}

export interface ExperimentSession {
  id: string;
  experimentId: string;
  responses: { questionIndex: number; response: string; timestamp: string }[];
  synthesis: string;
  changedPerspective?: string;
  createdAt: string;
}

export const THOUGHT_EXPERIMENTS: ThoughtExperiment[] = [
  {
    id: "trolley",
    name: "The Trolley Problem",
    category: "ethics",
    premise: "A runaway trolley will kill five people. You can pull a lever to divert it to another track where it will kill one person instead.",
    questions: [
      "Would you pull the lever? Why or why not?",
      "Does it matter if the one person is someone you love?",
      "What if you had to push someone onto the tracks instead of pulling a lever?",
      "What principle guides your decision?"
    ],
    relatedConcepts: ["utilitarianism", "deontology", "moral intuition", "action vs. inaction"]
  },
  {
    id: "experience-machine",
    name: "The Experience Machine",
    category: "consciousness",
    premise: "You can plug into a machine that will give you any experiences you desire. You'll believe they're real. You can never unplug.",
    questions: [
      "Would you plug in? What does your answer reveal about what you value?",
      "Is there something valuable about reality beyond how it feels?",
      "What experiences would you choose? What does that tell you?",
      "How is this different from your current life?"
    ],
    relatedConcepts: ["hedonism", "authenticity", "meaning", "virtual reality"]
  },
  {
    id: "ship-of-theseus",
    name: "Ship of Theseus",
    category: "identity",
    premise: "A ship has all its parts gradually replaced over time. Meanwhile, someone collects all the old parts and builds another ship from them.",
    questions: [
      "Which ship is the 'real' Ship of Theseus?",
      "How does this apply to you — your cells replace over time, your memories fade?",
      "What makes something the 'same' thing over time?",
      "Is continuity necessary for identity?"
    ],
    relatedConcepts: ["personal identity", "persistence", "essentialism", "continuity"]
  },
  {
    id: "chinese-room",
    name: "The Chinese Room",
    category: "consciousness",
    premise: "A person in a room follows rules to produce Chinese responses to Chinese questions, without understanding Chinese. Is this understanding?",
    questions: [
      "Does the system understand Chinese, even if the person inside doesn't?",
      "Could AI ever truly understand, or only simulate understanding?",
      "What is the difference between simulating understanding and actually understanding?",
      "How do you know others truly understand rather than just appearing to?"
    ],
    relatedConcepts: ["AI", "understanding", "syntax vs semantics", "consciousness"]
  },
  {
    id: "veil-of-ignorance",
    name: "Veil of Ignorance",
    category: "society",
    premise: "Design a society without knowing what position you'll occupy — your gender, race, wealth, abilities are all unknown to you.",
    questions: [
      "What rules would you create for this society?",
      "How much inequality would you tolerate?",
      "What safety nets would you require?",
      "How does this compare to the society you actually live in?"
    ],
    relatedConcepts: ["justice", "fairness", "social contract", "Rawls"]
  },
  {
    id: "brain-in-vat",
    name: "Brain in a Vat",
    category: "epistemology",
    premise: "You might be a brain in a vat, receiving electrical signals that simulate reality. You have no way to prove otherwise.",
    questions: [
      "How would you know if this were true?",
      "Does it matter if you can't tell the difference?",
      "What can you know with certainty?",
      "What would change about how you live if you believed this?"
    ],
    relatedConcepts: ["skepticism", "simulation theory", "Descartes", "knowledge"]
  },
  {
    id: "utility-monster",
    name: "The Utility Monster",
    category: "ethics",
    premise: "Imagine a being that derives so much pleasure from resources that total happiness is maximized by giving it everything, even if everyone else suffers.",
    questions: [
      "Should we give the monster everything?",
      "What's wrong with pure utilitarianism?",
      "How do we balance competing claims to wellbeing?",
      "Are some pleasures more valuable than others?"
    ],
    relatedConcepts: ["utilitarianism", "distribution", "rights", "welfare"]
  },
  {
    id: "last-man",
    name: "The Last Man",
    category: "ethics",
    premise: "You are the last person on Earth. Before dying, you can destroy all remaining nature for no reason. No one will ever know or be affected.",
    questions: [
      "Would it be wrong to destroy everything?",
      "Does nature have value independent of human experience?",
      "What does your answer reveal about the source of value?",
      "How does this apply to your daily choices?"
    ],
    relatedConcepts: ["intrinsic value", "environmental ethics", "anthropocentrism"]
  }
];

export const EXPERIMENT_CATEGORIES: { id: ThoughtExperiment["category"]; label: string }[] = [
  { id: "ethics", label: "Ethics & Morality" },
  { id: "identity", label: "Identity & Self" },
  { id: "epistemology", label: "Knowledge & Truth" },
  { id: "metaphysics", label: "Reality & Existence" },
  { id: "consciousness", label: "Mind & Consciousness" },
  { id: "society", label: "Society & Justice" }
];

export function createExperimentSession(experimentId: string): ExperimentSession {
  return {
    id: `exp_session_${Date.now()}`,
    experimentId,
    responses: [],
    synthesis: "",
    createdAt: new Date().toISOString()
  };
}

export function saveExperimentSession(session: ExperimentSession): void {
  const key = "glp_thought_sessions";
  const existing: ExperimentSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  const idx = existing.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    existing[idx] = session;
  } else {
    existing.unshift(session);
  }
  try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 50))); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export function getExperimentSessions(): ExperimentSession[] {
  return ((()=>{try{return JSON.parse(localStorage.getItem("glp_thought_sessions") || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
}

export function deleteExperimentSession(id: string): void {
  const key = "glp_thought_sessions";
  const existing: ExperimentSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  localStorage.setItem(key, JSON.stringify(existing.filter(s => s.id !== id)));
}

export function getExperimentById(id: string): ThoughtExperiment | undefined {
  return THOUGHT_EXPERIMENTS.find(e => e.id === id);
}

export function getExperimentsByCategory(category: ThoughtExperiment["category"]): ThoughtExperiment[] {
  return THOUGHT_EXPERIMENTS.filter(e => e.category === category);
}
