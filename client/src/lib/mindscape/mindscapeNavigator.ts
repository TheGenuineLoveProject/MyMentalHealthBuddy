export interface MindState {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  triggers: string[];
  transitions: string[];
  practices: string[];
}

export interface StateTransition {
  from: string;
  to: string;
  method: string;
  duration: string;
  reliability: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface MindscapeMap {
  states: MindState[];
  transitions: StateTransition[];
  currentState: string;
  desiredStates: string[];
  avoidedStates: string[];
  stateLog: { timestamp: string; state: string; context: string }[];
}

export const ARCHETYPAL_STATES = {
  flow: {
    name: "Flow State",
    description: "Complete absorption in activity with effortless concentration",
    characteristics: ["Time distortion", "Effortless attention", "Clear goals", "Immediate feedback"],
    conditions: ["Challenge-skill balance", "Clear goals", "Uninterrupted focus"]
  },
  contemplative: {
    name: "Contemplative Presence",
    description: "Quiet awareness without agenda",
    characteristics: ["Stillness", "Openness", "Non-judgment", "Equanimity"],
    conditions: ["Solitude", "Silence", "Unhurried time"]
  },
  creative: {
    name: "Creative Receptivity",
    description: "Open, associative, playful thinking",
    characteristics: ["Divergent thinking", "Novel connections", "Playfulness", "Risk tolerance"],
    conditions: ["Safety", "Low pressure", "Diverse inputs"]
  },
  analytical: {
    name: "Analytical Focus",
    description: "Sharp, logical, systematic thinking",
    characteristics: ["Sequential processing", "Precision", "Critical evaluation"],
    conditions: ["Clear problem", "Adequate information", "Uninterrupted time"]
  },
  social: {
    name: "Social Attunement",
    description: "Tuned to others' states and relational dynamics",
    characteristics: ["Empathy", "Active listening", "Responsiveness"],
    conditions: ["Safety", "Genuine interest", "Mutual presence"]
  },
  restorative: {
    name: "Deep Rest",
    description: "Recovery and regeneration",
    characteristics: ["Low arousal", "Passivity", "Receptivity"],
    conditions: ["Safety", "Comfort", "Permission"]
  },
  alert: {
    name: "Vigilant Awareness",
    description: "Heightened attention to environment",
    characteristics: ["Scanning", "Quick reactions", "Threat detection"],
    conditions: ["Perceived uncertainty", "Novel environment"]
  },
  integrative: {
    name: "Integrative Insight",
    description: "Synthesis of disparate elements into coherent understanding",
    characteristics: ["Pattern recognition", "Aha moments", "Holistic view"],
    conditions: ["Incubation period", "Relaxed attention", "Rich background"]
  }
} as const;

export const TRANSITION_METHODS = [
  { name: "Breathing", description: "Conscious breath work to shift arousal" },
  { name: "Movement", description: "Physical activity to change state" },
  { name: "Environment Change", description: "Moving to different physical space" },
  { name: "Ritual", description: "Consistent sequence that signals transition" },
  { name: "Music", description: "Auditory cues to induce states" },
  { name: "Contemplation", description: "Focused reflection or meditation" },
  { name: "Social Interaction", description: "Connection with others" },
  { name: "Creative Activity", description: "Making or doing something engaging" }
] as const;

export const STORAGE_KEY = "glp_mindscape_map";

export function loadMindscapeMap(): MindscapeMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return {
    states: [],
    transitions: [],
    currentState: "",
    desiredStates: [],
    avoidedStates: [],
    stateLog: []
  };
}

export function saveMindscapeMap(map: MindscapeMap): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch (err) { console.warn("[storage-safe-write]", err); }
}
