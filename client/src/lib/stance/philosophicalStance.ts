export interface PhilosophicalQuestion {
  id: string;
  domain: "metaphysics" | "epistemology" | "ethics" | "politics" | "aesthetics" | "mind" | "meaning";
  question: string;
  poles: [string, string];
  description: string;
  relatedThinkers: string[];
}

export interface StancePosition {
  questionId: string;
  position: number;
  confidence: number;
  reasoning: string;
  lastRevisited: string;
}

export interface PhilosophicalProfile {
  id: string;
  positions: StancePosition[];
  worldviewLabel?: string;
  coreCommitments: string[];
  openQuestions: string[];
  influentialThinkers: string[];
  createdAt: string;
  updatedAt: string;
}

export const PHILOSOPHICAL_QUESTIONS: PhilosophicalQuestion[] = [
  {
    id: "free-will",
    domain: "mind",
    question: "Do humans have free will?",
    poles: ["Hard Determinism", "Libertarian Free Will"],
    description: "Are our choices genuinely free, or determined by prior causes?",
    relatedThinkers: ["Spinoza", "Kant", "Dennett", "Sam Harris"]
  },
  {
    id: "consciousness",
    domain: "mind",
    question: "What is the nature of consciousness?",
    poles: ["Physicalism", "Dualism"],
    description: "Is consciousness reducible to physical processes, or something more?",
    relatedThinkers: ["Descartes", "Chalmers", "Dennett", "Nagel"]
  },
  {
    id: "moral-realism",
    domain: "ethics",
    question: "Are moral truths objective?",
    poles: ["Moral Relativism", "Moral Realism"],
    description: "Do moral facts exist independently of human opinion?",
    relatedThinkers: ["Nietzsche", "Moore", "Mackie", "Parfit"]
  },
  {
    id: "meaning-life",
    domain: "meaning",
    question: "What gives life meaning?",
    poles: ["Cosmic Nihilism", "Inherent Purpose"],
    description: "Is meaning created, discovered, or absent?",
    relatedThinkers: ["Camus", "Frankl", "Sartre", "Kierkegaard"]
  },
  {
    id: "knowledge-source",
    domain: "epistemology",
    question: "What is the primary source of knowledge?",
    poles: ["Pure Rationalism", "Pure Empiricism"],
    description: "Is knowledge primarily from reason or experience?",
    relatedThinkers: ["Descartes", "Hume", "Locke", "Kant"]
  },
  {
    id: "self-identity",
    domain: "metaphysics",
    question: "What makes you the same person over time?",
    poles: ["No Fixed Self", "Continuous Soul"],
    description: "Is personal identity persistent, constructed, or illusory?",
    relatedThinkers: ["Buddha", "Parfit", "Locke", "Hume"]
  },
  {
    id: "justice",
    domain: "politics",
    question: "What makes a society just?",
    poles: ["Individual Liberty", "Collective Equality"],
    description: "Should we prioritize freedom or equality?",
    relatedThinkers: ["Rawls", "Nozick", "Marx", "Mill"]
  },
  {
    id: "god-existence",
    domain: "metaphysics",
    question: "Does God exist?",
    poles: ["Strong Atheism", "Theism"],
    description: "What is the nature of ultimate reality?",
    relatedThinkers: ["Aquinas", "Russell", "Plantinga", "Dawkins"]
  },
  {
    id: "ethics-foundation",
    domain: "ethics",
    question: "What grounds moral obligation?",
    poles: ["Consequentialism", "Deontology"],
    description: "Are actions judged by outcomes or intrinsic rightness?",
    relatedThinkers: ["Mill", "Kant", "Bentham", "Ross"]
  },
  {
    id: "beauty",
    domain: "aesthetics",
    question: "Is beauty objective or subjective?",
    poles: ["Pure Subjectivism", "Aesthetic Realism"],
    description: "Do objects have inherent beauty, or is it in the eye of the beholder?",
    relatedThinkers: ["Plato", "Hume", "Kant", "Burke"]
  },
  {
    id: "mind-body",
    domain: "mind",
    question: "How do mind and body relate?",
    poles: ["Eliminative Materialism", "Substance Dualism"],
    description: "Is the mind identical to the brain, or something distinct?",
    relatedThinkers: ["Descartes", "Churchland", "Chalmers", "Kim"]
  },
  {
    id: "truth-nature",
    domain: "epistemology",
    question: "What is truth?",
    poles: ["Social Constructivism", "Correspondence Theory"],
    description: "Does truth correspond to reality, or is it socially constructed?",
    relatedThinkers: ["Tarski", "Rorty", "James", "Foucault"]
  }
];

export const DOMAIN_LABELS: Record<PhilosophicalQuestion["domain"], { label: string; description: string }> = {
  metaphysics: { label: "Metaphysics", description: "The nature of reality" },
  epistemology: { label: "Epistemology", description: "The nature of knowledge" },
  ethics: { label: "Ethics", description: "Right and wrong action" },
  politics: { label: "Political Philosophy", description: "Society and justice" },
  aesthetics: { label: "Aesthetics", description: "Beauty and art" },
  mind: { label: "Philosophy of Mind", description: "Consciousness and self" },
  meaning: { label: "Meaning & Purpose", description: "Life's significance" }
};

export function createStancePosition(questionId: string, position: number, confidence: number, reasoning: string): StancePosition {
  return {
    questionId,
    position: Math.max(0, Math.min(100, position)),
    confidence: Math.max(0, Math.min(100, confidence)),
    reasoning,
    lastRevisited: new Date().toISOString()
  };
}

export function createPhilosophicalProfile(): PhilosophicalProfile {
  return {
    id: `philprofile_${Date.now()}`,
    positions: [],
    coreCommitments: [],
    openQuestions: [],
    influentialThinkers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function savePhilosophicalProfile(profile: PhilosophicalProfile): void {
  const key = "glp_philosophical_profile";
  const updated = { ...profile, updatedAt: new Date().toISOString() };
  try { localStorage.setItem(key, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export function getPhilosophicalProfile(): PhilosophicalProfile | null {
  const stored = localStorage.getItem("glp_philosophical_profile");
  return stored ? JSON.parse(stored) : null;
}

export function getQuestionById(id: string): PhilosophicalQuestion | undefined {
  return PHILOSOPHICAL_QUESTIONS.find(q => q.id === id);
}

export function getQuestionsByDomain(domain: PhilosophicalQuestion["domain"]): PhilosophicalQuestion[] {
  return PHILOSOPHICAL_QUESTIONS.filter(q => q.domain === domain);
}

export function inferWorldview(positions: StancePosition[]): string {
  if (positions.length < 3) return "Exploratory";
  
  const avgPosition = positions.reduce((sum, p) => sum + p.position, 0) / positions.length;
  const avgConfidence = positions.reduce((sum, p) => sum + p.confidence, 0) / positions.length;
  
  if (avgConfidence < 40) return "Philosophical Skeptic";
  if (avgPosition < 35) return "Traditional / Realist";
  if (avgPosition > 65) return "Progressive / Constructivist";
  return "Pluralist / Pragmatist";
}

export function findTensionsInPositions(positions: StancePosition[]): { q1: string; q2: string; tension: string }[] {
  const tensions: { q1: string; q2: string; tension: string }[] = [];
  
  const freeWill = positions.find(p => p.questionId === "free-will");
  const determinism = freeWill && freeWill.position < 30;
  const moralRealism = positions.find(p => p.questionId === "moral-realism");
  
  if (determinism && moralRealism && moralRealism.position > 70) {
    tensions.push({
      q1: "free-will",
      q2: "moral-realism",
      tension: "Hard determinism can create tension with strong moral realism — if we can't choose freely, how are we morally responsible?"
    });
  }
  
  return tensions;
}
