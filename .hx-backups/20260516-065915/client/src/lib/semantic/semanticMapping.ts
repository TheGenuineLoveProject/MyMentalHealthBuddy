export interface SemanticNode {
  id: string;
  word: string;
  personalMeaning: string;
  associations: string[];
  emotionalValence: number;
  usageContexts: string[];
  etymology?: string;
  createdAt: string;
}

export interface MeaningShift {
  id: string;
  word: string;
  beforeMeaning: string;
  afterMeaning: string;
  catalyst: string;
  timestamp: string;
}

export interface SemanticMap {
  id: string;
  focus: string;
  nodes: SemanticNode[];
  connections: { from: string; to: string; relationship: string }[];
  meaningShifts: MeaningShift[];
  insights: string[];
  createdAt: string;
  updatedAt: string;
}

export const MEANING_PROMPTS = [
  "What does this word mean to you, beyond its dictionary definition?",
  "When did you first encounter this word in a meaningful way?",
  "What emotions arise when you hear or use this word?",
  "How has your understanding of this word evolved?",
  "What would be lost if this word didn't exist?"
];

export const RELATIONSHIP_TYPES = [
  { id: "synonym", label: "Similar To" },
  { id: "antonym", label: "Opposite Of" },
  { id: "part-of", label: "Part Of" },
  { id: "causes", label: "Leads To" },
  { id: "requires", label: "Requires" },
  { id: "contrasts", label: "In Tension With" },
  { id: "transforms-into", label: "Transforms Into" },
  { id: "depends-on", label: "Depends On" }
];

export const CORE_CONCEPT_CATEGORIES = [
  { id: "values", label: "Values", examples: ["integrity", "freedom", "growth", "love"] },
  { id: "emotions", label: "Emotions", examples: ["joy", "grief", "anxiety", "peace"] },
  { id: "relationships", label: "Relationships", examples: ["trust", "intimacy", "boundaries", "community"] },
  { id: "identity", label: "Identity", examples: ["self", "purpose", "authenticity", "belonging"] },
  { id: "time", label: "Time", examples: ["now", "legacy", "memory", "future"] },
  { id: "knowledge", label: "Knowledge", examples: ["truth", "wisdom", "uncertainty", "learning"] }
];

export function createSemanticNode(word: string, personalMeaning: string): SemanticNode {
  return {
    id: `sem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    word: word.toLowerCase(),
    personalMeaning,
    associations: [],
    emotionalValence: 50,
    usageContexts: [],
    createdAt: new Date().toISOString()
  };
}

export function createMeaningShift(word: string, beforeMeaning: string, afterMeaning: string, catalyst: string): MeaningShift {
  return {
    id: `shift_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    word,
    beforeMeaning,
    afterMeaning,
    catalyst,
    timestamp: new Date().toISOString()
  };
}

export function createSemanticMap(focus: string): SemanticMap {
  return {
    id: `semmap_${Date.now()}`,
    focus,
    nodes: [],
    connections: [],
    meaningShifts: [],
    insights: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveSemanticMap(map: SemanticMap): void {
  const key = "glp_semantic_maps";
  const existing: SemanticMap[] = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = existing.findIndex(m => m.id === map.id);
  const updated = { ...map, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
}

export function getSemanticMaps(): SemanticMap[] {
  return JSON.parse(localStorage.getItem("glp_semantic_maps") || "[]");
}

export function deleteSemanticMap(id: string): void {
  const key = "glp_semantic_maps";
  const existing: SemanticMap[] = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify(existing.filter(m => m.id !== id)));
}

export function getRandomMeaningPrompt(): string {
  return MEANING_PROMPTS[Math.floor(Math.random() * MEANING_PROMPTS.length)];
}

export function findConnectedWords(map: SemanticMap, wordId: string): SemanticNode[] {
  const connectedIds = map.connections
    .filter(c => c.from === wordId || c.to === wordId)
    .map(c => c.from === wordId ? c.to : c.from);
  return map.nodes.filter(n => connectedIds.includes(n.id));
}

export function calculateSemanticDensity(map: SemanticMap): number {
  if (map.nodes.length < 2) return 0;
  const maxConnections = (map.nodes.length * (map.nodes.length - 1)) / 2;
  return Math.round((map.connections.length / maxConnections) * 100);
}
