export interface LearningInquiry {
  id: string;
  question: string;
  horizon: "immediate" | "short-term" | "long-term" | "lifelong";
  successMarkers: string[];
  status: "exploring" | "active" | "integrated" | "dormant";
  createdAt: string;
}

export interface LearningExperiment {
  id: string;
  inquiryId: string;
  hypothesis: string;
  planSteps: string[];
  findings: string;
  status: "planned" | "in-progress" | "completed" | "abandoned";
  reflections: string[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface FeedbackNote {
  id: string;
  source: string;
  mode: "self" | "peer" | "mentor" | "environment";
  note: string;
  experimentId?: string;
  timestamp: string;
}

export interface ConstellationPoint {
  axis: string;
  value: number;
  note?: string;
}

export interface AutodidactPlan {
  id: string;
  identityStatement: string;
  inquiries: LearningInquiry[];
  experiments: LearningExperiment[];
  feedback: FeedbackNote[];
  constellation: { axes: string[]; points: ConstellationPoint[] };
  milestones: { title: string; reachedAt?: string; reflection?: string }[];
  createdAt: string;
  updatedAt: string;
}

export const HORIZON_LABELS: Record<LearningInquiry["horizon"], { label: string; timeframe: string }> = {
  immediate: { label: "Immediate", timeframe: "This week" },
  "short-term": { label: "Short-term", timeframe: "This month/quarter" },
  "long-term": { label: "Long-term", timeframe: "This year" },
  lifelong: { label: "Lifelong", timeframe: "Ongoing practice" }
};

export const DEFAULT_CONSTELLATION_AXES = [
  "Depth of Understanding",
  "Practical Application",
  "Creative Integration",
  "Teaching Ability",
  "Confidence",
  "Curiosity"
];

export const INQUIRY_PROMPTS = [
  "What question, if answered, would change how you live?",
  "What skill would unlock the most possibilities?",
  "What do you want to understand deeply, not just know about?",
  "What keeps appearing in your life as an invitation to learn?",
  "What would your wisest self want you to explore next?"
];

export const EXPERIMENT_TEMPLATES = [
  { name: "Deep Dive", description: "Immersive study for 2 weeks", structure: ["Gather resources", "Daily study (1hr)", "Weekly synthesis", "Final reflection"] },
  { name: "Deliberate Practice", description: "Skill building with feedback", structure: ["Define specific skill", "Design practice sessions", "Get feedback", "Adjust approach"] },
  { name: "Teaching Test", description: "Learn by explaining", structure: ["Study topic", "Create explanation", "Teach someone", "Note gaps exposed"] },
  { name: "Real-World Application", description: "Apply learning to life", structure: ["Identify application opportunity", "Plan implementation", "Execute", "Evaluate results"] },
  { name: "Cross-Domain Connection", description: "Find links between fields", structure: ["Pick two domains", "List core concepts", "Find analogies", "Generate insights"] }
];

export function createLearningInquiry(question: string, horizon: LearningInquiry["horizon"]): LearningInquiry {
  return {
    id: `inquiry_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    question,
    horizon,
    successMarkers: [],
    status: "exploring",
    createdAt: new Date().toISOString()
  };
}

export function createLearningExperiment(inquiryId: string, hypothesis: string): LearningExperiment {
  return {
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    inquiryId,
    hypothesis,
    planSteps: [],
    findings: "",
    status: "planned",
    reflections: [],
    createdAt: new Date().toISOString()
  };
}

export function createFeedbackNote(source: string, mode: FeedbackNote["mode"], note: string): FeedbackNote {
  return {
    id: `feedback_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    source,
    mode,
    note,
    timestamp: new Date().toISOString()
  };
}

export function createAutodidactPlan(identityStatement: string): AutodidactPlan {
  return {
    id: `autodidact_${Date.now()}`,
    identityStatement,
    inquiries: [],
    experiments: [],
    feedback: [],
    constellation: {
      axes: DEFAULT_CONSTELLATION_AXES,
      points: DEFAULT_CONSTELLATION_AXES.map(axis => ({ axis, value: 1 }))
    },
    milestones: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveAutodidactPlan(plan: AutodidactPlan): void {
  const key = "glp_autodidact_plans";
  const existing: AutodidactPlan[] = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = existing.findIndex(p => p.id === plan.id);
  const updated = { ...plan, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 10)));
}

export function getAutodidactPlans(): AutodidactPlan[] {
  return JSON.parse(localStorage.getItem("glp_autodidact_plans") || "[]");
}

export function deleteAutodidactPlan(id: string): void {
  const key = "glp_autodidact_plans";
  const existing: AutodidactPlan[] = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify(existing.filter(p => p.id !== id)));
}

export function getRandomInquiryPrompt(): string {
  return INQUIRY_PROMPTS[Math.floor(Math.random() * INQUIRY_PROMPTS.length)];
}

export function calculateLearningMomentum(plan: AutodidactPlan): number {
  const activeInquiries = plan.inquiries.filter(i => i.status === "active" || i.status === "exploring").length;
  const completedExperiments = plan.experiments.filter(e => e.status === "completed").length;
  const recentFeedback = plan.feedback.filter(f => {
    const days = (Date.now() - new Date(f.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  }).length;

  return Math.min(100, (activeInquiries * 15) + (completedExperiments * 20) + (recentFeedback * 10));
}
