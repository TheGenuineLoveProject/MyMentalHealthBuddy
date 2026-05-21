export interface DeepWorkSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  focusQuality: 1 | 2 | 3 | 4 | 5;
  project: string;
  accomplishments: string[];
  distractions: string[];
  environment: string;
  insights: string;
}

export interface SkillDomain {
  id: string;
  name: string;
  category: "cognitive" | "physical" | "creative" | "interpersonal" | "technical";
  currentLevel: 1 | 2 | 3 | 4 | 5;
  targetLevel: 1 | 2 | 3 | 4 | 5;
  practiceHours: number;
  resources: string[];
  milestones: SkillMilestone[];
  lastPracticed: string;
}

export interface SkillMilestone {
  id: string;
  description: string;
  achieved: boolean;
  achievedDate?: string;
}

export interface DeliberatePractice {
  id: string;
  skillId: string;
  date: string;
  duration: number;
  focus: string;
  method: "repetition" | "feedback" | "challenge" | "analysis" | "imitation" | "experimentation";
  difficulty: 1 | 2 | 3 | 4 | 5;
  effectiveness: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface MasteryProfile {
  deepWorkSessions: DeepWorkSession[];
  skills: SkillDomain[];
  practices: DeliberatePractice[];
  totalDeepWorkMinutes: number;
  rituals: MasteryRitual[];
}

export interface MasteryRitual {
  id: string;
  name: string;
  description: string;
  trigger: string;
  sequence: string[];
  active: boolean;
}

export const SKILL_LEVELS = {
  1: { name: "Novice", description: "Just beginning, need guidance for basic tasks" },
  2: { name: "Beginner", description: "Understand basics, can do simple tasks independently" },
  3: { name: "Competent", description: "Handle typical situations, need help with complex ones" },
  4: { name: "Proficient", description: "Deep understanding, handle complex situations well" },
  5: { name: "Expert", description: "Intuitive mastery, can teach and innovate" }
} as const;

export const PRACTICE_METHODS = {
  repetition: { name: "Repetition", description: "Repeated practice of fundamentals" },
  feedback: { name: "Feedback Loop", description: "Practice with immediate feedback" },
  challenge: { name: "Edge Challenge", description: "Work at the edge of your ability" },
  analysis: { name: "Analysis", description: "Study and break down examples" },
  imitation: { name: "Imitation", description: "Copy masters and experts" },
  experimentation: { name: "Experimentation", description: "Try new approaches and variations" }
} as const;

export const DEEP_WORK_PRINCIPLES = [
  "Depth is earned through ritual, not willpower alone",
  "Shallow work expands to fill available time",
  "The ability to concentrate is a skill that must be trained",
  "High-quality work = (Time Spent) × (Intensity of Focus)",
  "Schedule every minute of your deep work in advance",
  "Quit social media during deep work blocks",
  "Embrace boredom—train your brain to resist distraction",
  "Drain the shallows by setting strict boundaries"
] as const;

export const STORAGE_KEY = "glp_mastery_profile";

export function loadMasteryProfile(): MasteryProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return {
    deepWorkSessions: [],
    skills: [],
    practices: [],
    totalDeepWorkMinutes: 0,
    rituals: []
  };
}

export function saveMasteryProfile(profile: MasteryProfile): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }
}
