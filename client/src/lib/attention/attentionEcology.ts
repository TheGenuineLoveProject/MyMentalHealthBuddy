export interface AttentionAudit {
  id: string;
  timestamp: string;
  timeframe: "day" | "week" | "month";
  categories: AttentionCategory[];
  totalHours: number;
  topDrains: string[];
  reflections: string;
}

export interface AttentionCategory {
  name: string;
  type: "nourishing" | "depleting" | "neutral" | "necessary";
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface AttentionIntention {
  id: string;
  description: string;
  priority: "essential" | "important" | "optional";
  currentTime: number;
  desiredTime: number;
  obstacles: string[];
  strategies: string[];
}

export interface AttentionProfile {
  audits: AttentionAudit[];
  intentions: AttentionIntention[];
  environments: AttentionEnvironment[];
  patterns: string[];
  boundaryRules: string[];
}

export interface AttentionEnvironment {
  name: string;
  type: "physical" | "digital" | "social" | "temporal";
  quality: 1 | 2 | 3 | 4 | 5;
  distractions: string[];
  supports: string[];
}

export const ATTENTION_CATEGORIES = [
  { name: "Deep Work", type: "nourishing", description: "Focused, undistracted cognitive effort" },
  { name: "Relationships", type: "nourishing", description: "Quality time with people who matter" },
  { name: "Rest & Recovery", type: "nourishing", description: "Sleep, relaxation, restoration" },
  { name: "Learning", type: "nourishing", description: "Deliberate skill and knowledge building" },
  { name: "Creation", type: "nourishing", description: "Making, building, or crafting" },
  { name: "Movement", type: "nourishing", description: "Physical activity and exercise" },
  { name: "Nature", type: "nourishing", description: "Time in natural environments" },
  { name: "Social Media", type: "depleting", description: "Scrolling feeds and notifications" },
  { name: "News Consumption", type: "depleting", description: "Passive news intake" },
  { name: "Digital Entertainment", type: "neutral", description: "Streaming, gaming, browsing" },
  { name: "Email/Messages", type: "necessary", description: "Communication management" },
  { name: "Meetings", type: "necessary", description: "Scheduled synchronous time" },
  { name: "Admin Tasks", type: "necessary", description: "Life maintenance activities" },
  { name: "Commute", type: "necessary", description: "Travel time" }
] as const;

export const ATTENTION_PRINCIPLES = [
  "Attention is a finite resource that regenerates with rest",
  "What you attend to shapes who you become",
  "Context determines capacity more than willpower",
  "Switching costs compound—each transition has overhead",
  "Digital environments are designed to capture attention",
  "Protection requires intention and structure",
  "Quality attention creates quality experience"
] as const;

export const STORAGE_KEY = "glp_attention_profile";

export function loadAttentionProfile(): AttentionProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return { audits: [], intentions: [], environments: [], patterns: [], boundaryRules: [] };
}

export function saveAttentionProfile(profile: AttentionProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
