export interface PersonalValue {
  id: string;
  name: string;
  description: string;
  domain: "self" | "relationships" | "work" | "society" | "transcendence";
  importance: 1 | 2 | 3 | 4 | 5;
  livedAlignment: 1 | 2 | 3 | 4 | 5;
  examples: string[];
  tensions: string[];
  lastReflected: string;
}

export interface ValueConflict {
  id: string;
  valueA: string;
  valueB: string;
  situation: string;
  resolution: string;
  insight: string;
  timestamp: string;
}

export interface ValuesProfile {
  coreValues: PersonalValue[];
  conflicts: ValueConflict[];
  hierarchy: string[];
  reflections: { date: string; insight: string }[];
}

export const VALUE_DOMAINS = {
  self: { name: "Self & Growth", description: "Values about personal development and authenticity" },
  relationships: { name: "Relationships", description: "Values about connection and care for others" },
  work: { name: "Work & Purpose", description: "Values about meaningful contribution" },
  society: { name: "Society & Ethics", description: "Values about justice and collective good" },
  transcendence: { name: "Transcendence", description: "Values about meaning beyond self" }
} as const;

export const CORE_VALUES_LIBRARY = [
  { name: "Authenticity", domain: "self", description: "Being true to one's own nature and values" },
  { name: "Growth", domain: "self", description: "Continuous learning and development" },
  { name: "Autonomy", domain: "self", description: "Self-determination and independence" },
  { name: "Integrity", domain: "self", description: "Alignment between beliefs and actions" },
  { name: "Compassion", domain: "relationships", description: "Care and concern for others' wellbeing" },
  { name: "Connection", domain: "relationships", description: "Deep bonds with others" },
  { name: "Loyalty", domain: "relationships", description: "Commitment to people and causes" },
  { name: "Service", domain: "relationships", description: "Contributing to others' lives" },
  { name: "Excellence", domain: "work", description: "High standards and quality in work" },
  { name: "Creativity", domain: "work", description: "Original thinking and innovation" },
  { name: "Impact", domain: "work", description: "Making a meaningful difference" },
  { name: "Mastery", domain: "work", description: "Deep skill development" },
  { name: "Justice", domain: "society", description: "Fairness and equality" },
  { name: "Responsibility", domain: "society", description: "Taking ownership of consequences" },
  { name: "Truth", domain: "society", description: "Honesty and pursuit of knowledge" },
  { name: "Freedom", domain: "society", description: "Liberty for self and others" },
  { name: "Wisdom", domain: "transcendence", description: "Deep understanding of life" },
  { name: "Wonder", domain: "transcendence", description: "Awe and appreciation for existence" },
  { name: "Legacy", domain: "transcendence", description: "Contribution beyond one's lifetime" },
  { name: "Peace", domain: "transcendence", description: "Inner harmony and equanimity" }
] as const;

export const STORAGE_KEY = "glp_values_profile";

export function loadValuesProfile(): ValuesProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return { coreValues: [], conflicts: [], hierarchy: [], reflections: [] };
}

export function saveValuesProfile(profile: ValuesProfile): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export function calculateAlignmentGap(profile: ValuesProfile): { value: PersonalValue; gap: number }[] {
  return profile.coreValues
    .map(v => ({ value: v, gap: v.importance - v.livedAlignment }))
    .sort((a, b) => b.gap - a.gap);
}
