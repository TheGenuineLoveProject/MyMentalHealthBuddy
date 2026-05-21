export interface JourneyStep {
  id: string;
  tool: "framework" | "dialectical" | "temporal" | "atlas" | "metacognition" | "pattern" | "mirror" | "freeform";
  label: string;
  prompt?: string;
  duration?: string;
  completed: boolean;
  response?: string;
  completedAt?: string;
}

export interface JourneyFlow {
  id: string;
  name: string;
  description: string;
  steps: JourneyStep[];
  createdAt: string;
  lastAccessedAt: string;
  completedAt?: string;
}

export const JOURNEY_TEMPLATES: Omit<JourneyFlow, "id" | "createdAt" | "lastAccessedAt">[] = [
  {
    name: "Deep Inquiry",
    description: "A comprehensive exploration combining multiple wisdom traditions and reflection modes.",
    steps: [
      { id: "1", tool: "atlas", label: "Choose a wisdom tradition to guide your inquiry", completed: false },
      { id: "2", tool: "dialectical", label: "Explore your question through thesis and antithesis", completed: false },
      { id: "3", tool: "temporal", label: "View the question across past, present, and future", completed: false },
      { id: "4", tool: "freeform", label: "Synthesize: What new understanding emerges?", completed: false }
    ]
  },
  {
    name: "Pattern Recognition",
    description: "Identify recurring themes in your experience using multiple lenses.",
    steps: [
      { id: "1", tool: "pattern", label: "Review your recent state patterns", completed: false },
      { id: "2", tool: "metacognition", label: "Check for cognitive biases in your interpretation", completed: false },
      { id: "3", tool: "framework", label: "Apply a mental model to understand the pattern", completed: false },
      { id: "4", tool: "freeform", label: "What experiment might you try?", completed: false }
    ]
  },
  {
    name: "Shadow Integration",
    description: "Gently explore aspects of self that remain hidden or rejected.",
    steps: [
      { id: "1", tool: "dialectical", label: "Name a quality you dislike in others", completed: false },
      { id: "2", tool: "metacognition", label: "Examine projection bias", completed: false },
      { id: "3", tool: "temporal", label: "Trace this pattern across time", completed: false },
      { id: "4", tool: "mirror", label: "Reflect with compassionate witnessing", completed: false },
      { id: "5", tool: "freeform", label: "What integration is possible?", completed: false }
    ]
  },
  {
    name: "Decision Clarity",
    description: "Bring multiple perspectives to an important decision.",
    steps: [
      { id: "1", tool: "framework", label: "Apply First Principles or Inversion thinking", completed: false },
      { id: "2", tool: "metacognition", label: "Audit assumptions and check for biases", completed: false },
      { id: "3", tool: "dialectical", label: "Argue both sides of the decision", completed: false },
      { id: "4", tool: "temporal", label: "View the decision from future perspective", completed: false },
      { id: "5", tool: "freeform", label: "What feels true now?", completed: false }
    ]
  },
  {
    name: "Morning Contemplation",
    description: "A gentle 15-minute practice to begin the day with intention.",
    steps: [
      { id: "1", tool: "atlas", label: "Receive wisdom from today's tradition", duration: "3 min", completed: false },
      { id: "2", tool: "temporal", label: "Connect with future self's guidance", duration: "5 min", completed: false },
      { id: "3", tool: "freeform", label: "Set an intention for today", duration: "3 min", completed: false }
    ]
  },
  {
    name: "Evening Review",
    description: "Reflect on the day with gratitude and honest observation.",
    steps: [
      { id: "1", tool: "pattern", label: "Notice your state patterns from today", completed: false },
      { id: "2", tool: "temporal", label: "What did today's self learn?", completed: false },
      { id: "3", tool: "freeform", label: "Three things you noticed with appreciation", completed: false },
      { id: "4", tool: "freeform", label: "One thing to release from today", completed: false }
    ]
  }
];

export const TOOL_LABELS: Record<JourneyStep["tool"], { name: string; icon: string }> = {
  framework: { name: "Cognitive Framework", icon: "brain" },
  dialectical: { name: "Dialectical Inquiry", icon: "scale" },
  temporal: { name: "Temporal Reflection", icon: "clock" },
  atlas: { name: "Philosophical Atlas", icon: "map" },
  metacognition: { name: "Meta-Cognition", icon: "eye" },
  pattern: { name: "Pattern Lab", icon: "activity" },
  mirror: { name: "AI Mirror", icon: "sparkles" },
  freeform: { name: "Free Reflection", icon: "pen" }
};

export function createJourneyFromTemplate(template: typeof JOURNEY_TEMPLATES[0]): JourneyFlow {
  return {
    ...template,
    id: `journey_${Date.now()}`,
    steps: template.steps.map(s => ({ ...s, id: `step_${Date.now()}_${s.id}` })),
    createdAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString()
  };
}

export function createCustomJourney(name: string, description: string): JourneyFlow {
  return {
    id: `journey_${Date.now()}`,
    name,
    description,
    steps: [],
    createdAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString()
  };
}

export function saveJourneyFlow(flow: JourneyFlow): void {
  const key = "glp_journey_flows";
  const existing: JourneyFlow[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  const idx = existing.findIndex(f => f.id === flow.id);
  if (idx >= 0) {
    existing[idx] = { ...flow, lastAccessedAt: new Date().toISOString() };
  } else {
    existing.unshift(flow);
  }
  try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 30))); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export function getJourneyFlows(): JourneyFlow[] {
  return ((()=>{try{return JSON.parse(localStorage.getItem("glp_journey_flows") || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
}

export function deleteJourneyFlow(id: string): void {
  const key = "glp_journey_flows";
  const existing: JourneyFlow[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  localStorage.setItem(key, JSON.stringify(existing.filter(f => f.id !== id)));
}
