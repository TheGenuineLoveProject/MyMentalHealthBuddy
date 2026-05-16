export interface LifeChapter {
  id: string;
  title: string;
  timeframe: string;
  summary: string;
  themes: string[];
  keyEvents: string[];
  lessons: string[];
  selfAtTime: string;
  tone: "tragic" | "comedic" | "heroic" | "ironic" | "romantic" | "neutral";
}

export interface NarrativeArc {
  id: string;
  name: string;
  pattern: "redemption" | "contamination" | "growth" | "stability" | "decline" | "transformation";
  description: string;
  chapters: string[];
}

export interface LifeNarrative {
  chapters: LifeChapter[];
  arcs: NarrativeArc[];
  currentSelf: string;
  futureSelf: string;
  coreThemes: string[];
  narrativeMode: "author" | "protagonist" | "observer";
  reflections: { date: string; insight: string }[];
}

export const NARRATIVE_PATTERNS = {
  redemption: {
    name: "Redemption",
    description: "Bad situations transformed into good outcomes",
    example: "From struggle came strength"
  },
  contamination: {
    name: "Contamination",
    description: "Good situations deteriorated into difficulty",
    example: "What seemed promising became painful"
  },
  growth: {
    name: "Progressive Growth",
    description: "Steady development toward goals and values",
    example: "Continued learning and improvement"
  },
  stability: {
    name: "Stability",
    description: "Maintenance of valued states and relationships",
    example: "Preserving what matters most"
  },
  decline: {
    name: "Decline",
    description: "Loss or diminishment over time",
    example: "Gradual letting go"
  },
  transformation: {
    name: "Transformation",
    description: "Fundamental change in self or worldview",
    example: "Becoming someone new"
  }
} as const;

export const MCADAMS_PROMPTS = [
  "Describe a high point: a specific moment that stands out as especially positive in your life story.",
  "Describe a low point: a moment that stands out as especially negative or difficult.",
  "Describe a turning point: a moment when you underwent significant change.",
  "Describe an early memory: one of your earliest clear memories.",
  "Describe an important childhood scene: a specific event from childhood that stands out.",
  "Describe an important adolescent scene: a specific event from your teenage years.",
  "Describe an important adult scene: a specific event from adulthood that stands out.",
  "Describe a wisdom event: a time when you learned something important about life or yourself."
] as const;

export const STORAGE_KEY = "glp_life_narrative";

export function loadNarrative(): LifeNarrative {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return {
    chapters: [],
    arcs: [],
    currentSelf: "",
    futureSelf: "",
    coreThemes: [],
    narrativeMode: "author",
    reflections: []
  };
}

export function saveNarrative(narrative: LifeNarrative): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(narrative));
}
