export interface ColliderArtifact {
  id: string;
  sourceType: "quote" | "experience" | "concept" | "question" | "image" | "pattern";
  label: string;
  payload: string;
  tags: string[];
  addedAt: string;
}

export interface ColliderBlend {
  id: string;
  artifactIds: string[];
  lens: string;
  narrative: string;
  resonanceScore?: number;
  iteration: number;
  timestamp: string;
}

export interface ColliderSession {
  id: string;
  intent: string;
  artifacts: ColliderArtifact[];
  blends: ColliderBlend[];
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export const SYNTHESIS_LENSES = [
  { id: "opposition", name: "Opposition", prompt: "What if these ideas were in direct conflict? What emerges from their tension?" },
  { id: "amplification", name: "Amplification", prompt: "What if we combined their strongest aspects? What superpower emerges?" },
  { id: "inversion", name: "Inversion", prompt: "What if we flipped each idea to its opposite? What new insight appears?" },
  { id: "timeline", name: "Timeline", prompt: "How would these ideas evolve if traced 100 years forward?" },
  { id: "metaphor", name: "Metaphor Bridge", prompt: "What single metaphor could hold all these ideas together?" },
  { id: "embodiment", name: "Embodiment", prompt: "If these ideas were a person, what would they do? Say? Feel?" },
  { id: "ecology", name: "Ecology", prompt: "How do these ideas interact in a living system? What feeds what?" },
  { id: "paradox", name: "Paradox", prompt: "What becomes true when all these ideas are simultaneously held?" },
  { id: "essence", name: "Essence Distillation", prompt: "What is the one word that captures what all these share?" },
  { id: "emergence", name: "Emergence", prompt: "What new idea wants to be born from this combination?" }
];

export const ARTIFACT_TYPES: { type: ColliderArtifact["sourceType"]; label: string; placeholder: string }[] = [
  { type: "quote", label: "Quote", placeholder: "A passage that moved you..." },
  { type: "experience", label: "Experience", placeholder: "Something you lived through..." },
  { type: "concept", label: "Concept", placeholder: "An idea or framework..." },
  { type: "question", label: "Question", placeholder: "A question that haunts you..." },
  { type: "image", label: "Image", placeholder: "Describe a visual memory or symbol..." },
  { type: "pattern", label: "Pattern", placeholder: "A recurring theme you've noticed..." }
];

export function createColliderArtifact(
  sourceType: ColliderArtifact["sourceType"],
  label: string,
  payload: string,
  tags: string[] = []
): ColliderArtifact {
  return {
    id: `artifact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    sourceType,
    label,
    payload,
    tags,
    addedAt: new Date().toISOString()
  };
}

export function createColliderBlend(artifactIds: string[], lens: string): ColliderBlend {
  return {
    id: `blend_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    artifactIds,
    lens,
    narrative: "",
    iteration: 1,
    timestamp: new Date().toISOString()
  };
}

export function createColliderSession(intent: string): ColliderSession {
  return {
    id: `collider_${Date.now()}`,
    intent,
    artifacts: [],
    blends: [],
    highlights: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveColliderSession(session: ColliderSession): void {
  const key = "glp_synthesis_sessions";
  const existing: ColliderSession[] = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = existing.findIndex(s => s.id === session.id);
  const updated = { ...session, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
}

export function getColliderSessions(): ColliderSession[] {
  return JSON.parse(localStorage.getItem("glp_synthesis_sessions") || "[]");
}

export function deleteColliderSession(id: string): void {
  const key = "glp_synthesis_sessions";
  const existing: ColliderSession[] = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify(existing.filter(s => s.id !== id)));
}

export function getRandomLens(): typeof SYNTHESIS_LENSES[0] {
  return SYNTHESIS_LENSES[Math.floor(Math.random() * SYNTHESIS_LENSES.length)];
}

export function generateCombinationPrompt(artifacts: ColliderArtifact[], lens: typeof SYNTHESIS_LENSES[0]): string {
  const artifactSummary = artifacts.map(a => `• ${a.label} (${a.sourceType})`).join("\n");
  return `You are combining:\n${artifactSummary}\n\nUsing the "${lens.name}" lens:\n${lens.prompt}`;
}
