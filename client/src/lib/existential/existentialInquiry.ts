export interface ExistentialTheme {
  id: string;
  name: string;
  description: string;
  questions: string[];
  reflections: ExistentialReflection[];
  relatedThinkers: string[];
}

export interface ExistentialReflection {
  id: string;
  themeId: string;
  question: string;
  response: string;
  timestamp: string;
  mood: "anxious" | "curious" | "peaceful" | "conflicted" | "resolved";
}

export interface MeaningSource {
  id: string;
  domain: string;
  description: string;
  strength: 1 | 2 | 3 | 4 | 5;
  vulnerabilities: string[];
  practices: string[];
}

export interface ExistentialProfile {
  reflections: ExistentialReflection[];
  meaningSources: MeaningSource[];
  stances: Record<string, string>;
  currentQuestions: string[];
}

export const EXISTENTIAL_THEMES = {
  death: {
    name: "Mortality & Finitude",
    description: "Awareness of life's temporal limits and what this means for living",
    questions: [
      "How does awareness of mortality shape your priorities?",
      "What would you regret not having done or said?",
      "How do you want to be remembered?",
      "What does a 'good death' mean to you?"
    ],
    thinkers: ["Heidegger", "Epicurus", "Becker"]
  },
  freedom: {
    name: "Freedom & Responsibility",
    description: "The weight of choice and authoring your own existence",
    questions: [
      "In what ways are you free that you may be ignoring?",
      "What responsibility are you avoiding through claims of constraint?",
      "How do you balance freedom with commitment?",
      "What would you do if you truly accepted your freedom?"
    ],
    thinkers: ["Sartre", "Kierkegaard", "Camus"]
  },
  isolation: {
    name: "Isolation & Connection",
    description: "The unbridgeable gap between selves and the need for belonging",
    questions: [
      "What parts of yourself feel fundamentally unknowable to others?",
      "How do you bridge the gap between isolation and connection?",
      "What price do you pay for belonging?",
      "Can you be fully known by another?"
    ],
    thinkers: ["Buber", "Marcel", "Yalom"]
  },
  meaning: {
    name: "Meaning & Absurdity",
    description: "The search for purpose in an indifferent universe",
    questions: [
      "Where do you find meaning in your life?",
      "How do you respond to life's apparent meaninglessness?",
      "What gives your suffering significance?",
      "Are you creating meaning or discovering it?"
    ],
    thinkers: ["Frankl", "Camus", "Nietzsche"]
  },
  authenticity: {
    name: "Authenticity & Bad Faith",
    description: "Living genuinely versus conforming to external definitions",
    questions: [
      "Where are you living according to others' expectations?",
      "What would authentic living look like for you?",
      "How do you distinguish your true self from roles you play?",
      "What fears keep you from authenticity?"
    ],
    thinkers: ["Heidegger", "Sartre", "Taylor"]
  },
  groundlessness: {
    name: "Groundlessness & Uncertainty",
    description: "Living without absolute foundations or guarantees",
    questions: [
      "How do you act when nothing is certain?",
      "What groundless ground do you stand on?",
      "How do you make commitments without guarantees?",
      "What would change if you accepted radical uncertainty?"
    ],
    thinkers: ["Nietzsche", "Rorty", "Buddhist philosophers"]
  }
} as const;

export const STORAGE_KEY = "glp_existential_profile";

export function loadExistentialProfile(): ExistentialProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return { reflections: [], meaningSources: [], stances: {}, currentQuestions: [] };
}

export function saveExistentialProfile(profile: ExistentialProfile): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }
}
