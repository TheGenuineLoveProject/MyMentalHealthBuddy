export interface ThinkingPattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  helpfulness: "helpful" | "mixed" | "unhelpful";
  triggers: string[];
  alternatives?: string;
  lastObserved: string;
}

export interface MentalState {
  id: string;
  timestamp: string;
  clarity: number;
  focus: number;
  creativity: number;
  anxiety: number;
  energy: number;
  notes?: string;
}

export interface CognitiveStrength {
  id: string;
  area: string;
  evidence: string[];
  developmentNotes?: string;
}

export interface MetacognitiveProfile {
  id: string;
  patterns: ThinkingPattern[];
  mentalStates: MentalState[];
  strengths: CognitiveStrength[];
  blindSpots: string[];
  learningStyle: string[];
  optimalConditions: string;
  createdAt: string;
  updatedAt: string;
}

export const COMMON_THINKING_PATTERNS = [
  { name: "Rumination", description: "Repeatedly thinking about problems without moving toward solutions" },
  { name: "Catastrophizing", description: "Assuming the worst possible outcome will happen" },
  { name: "Black-and-White Thinking", description: "Seeing things as all-or-nothing, missing nuance" },
  { name: "Overthinking", description: "Analyzing to the point of paralysis" },
  { name: "Confirmation Seeking", description: "Looking for evidence that supports existing beliefs" },
  { name: "Future Projection", description: "Living in anticipated futures rather than present" },
  { name: "Comparison Mode", description: "Constantly measuring yourself against others" },
  { name: "Perfectionism Loop", description: "Endless revision that prevents completion" },
  { name: "Narrative Construction", description: "Creating stories about events that may not be accurate" },
  { name: "Emotional Reasoning", description: "Treating feelings as facts" }
];

export const METACOGNITIVE_PROMPTS = [
  "What patterns do you notice in how you think about problems?",
  "When do you think most clearly? What conditions support that?",
  "What kinds of decisions do you struggle with most?",
  "How do you typically respond when you don't know something?",
  "What thinking habits serve you? Which ones don't?",
  "How do you know when you're in a good mental state for important decisions?",
  "What do you do when you notice you're stuck in unhelpful thinking?",
  "How has your thinking changed over the past year?"
];

export const COGNITIVE_AREAS = [
  "Pattern Recognition",
  "Abstract Reasoning",
  "Verbal Processing",
  "Spatial Thinking",
  "Emotional Intelligence",
  "Systems Thinking",
  "Creative Synthesis",
  "Logical Analysis",
  "Intuitive Insight",
  "Memory & Recall"
];

export function createThinkingPattern(name: string, description: string): ThinkingPattern {
  return {
    id: `pattern_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    description,
    frequency: 50,
    helpfulness: "mixed",
    triggers: [],
    lastObserved: new Date().toISOString()
  };
}

export function createMentalState(): MentalState {
  return {
    id: `state_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    clarity: 50,
    focus: 50,
    creativity: 50,
    anxiety: 50,
    energy: 50
  };
}

export function createMetacognitiveProfile(): MetacognitiveProfile {
  return {
    id: `metacog_${Date.now()}`,
    patterns: [],
    mentalStates: [],
    strengths: [],
    blindSpots: [],
    learningStyle: [],
    optimalConditions: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveMetacognitiveProfile(profile: MetacognitiveProfile): void {
  const key = "glp_metacognitive_profile";
  const updated = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getMetacognitiveProfile(): MetacognitiveProfile | null {
  const stored = localStorage.getItem("glp_metacognitive_profile");
  return stored ? JSON.parse(stored) : null;
}

export function getRandomMetacognitivePrompt(): string {
  return METACOGNITIVE_PROMPTS[Math.floor(Math.random() * METACOGNITIVE_PROMPTS.length)];
}

export function calculateClarityTrend(states: MentalState[]): { trend: "improving" | "stable" | "declining"; average: number } {
  if (states.length < 3) return { trend: "stable", average: 50 };
  
  const recent = states.slice(0, 7);
  const average = recent.reduce((sum, s) => sum + s.clarity, 0) / recent.length;
  
  const older = states.slice(7, 14);
  if (older.length === 0) return { trend: "stable", average: Math.round(average) };
  
  const olderAverage = older.reduce((sum, s) => sum + s.clarity, 0) / older.length;
  
  const diff = average - olderAverage;
  const trend = diff > 5 ? "improving" : diff < -5 ? "declining" : "stable";
  
  return { trend, average: Math.round(average) };
}
