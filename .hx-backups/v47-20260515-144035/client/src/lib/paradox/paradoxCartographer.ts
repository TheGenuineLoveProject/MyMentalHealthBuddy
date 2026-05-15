export interface ParadoxAxis {
  id: string;
  label: string;
  spectrum: [string, string];
  description?: string;
}

export interface ParadoxEntry {
  id: string;
  position: { x: number; y: number };
  observation: string;
  timestamp: string;
}

export interface ParadoxSession {
  id: string;
  theme: string;
  axisX: ParadoxAxis;
  axisY: ParadoxAxis;
  entries: ParadoxEntry[];
  thirdHorizonNotes: string;
  synthesisAttempts: string[];
  createdAt: string;
  updatedAt: string;
}

export const PARADOX_TEMPLATES: { name: string; theme: string; axisX: ParadoxAxis; axisY: ParadoxAxis }[] = [
  {
    name: "Freedom & Commitment",
    theme: "The tension between autonomy and dedication",
    axisX: { id: "freedom", label: "Freedom", spectrum: ["Boundless Freedom", "Deep Commitment"] },
    axisY: { id: "meaning", label: "Meaning", spectrum: ["Self-Created Meaning", "Inherited Meaning"] }
  },
  {
    name: "Control & Surrender",
    theme: "Agency and acceptance",
    axisX: { id: "control", label: "Control", spectrum: ["Full Control", "Complete Surrender"] },
    axisY: { id: "outcome", label: "Outcome", spectrum: ["Process Focus", "Result Focus"] }
  },
  {
    name: "Individual & Collective",
    theme: "Self and community",
    axisX: { id: "autonomy", label: "Autonomy", spectrum: ["Individual Path", "Collective Path"] },
    axisY: { id: "identity", label: "Identity", spectrum: ["Fixed Self", "Fluid Self"] }
  },
  {
    name: "Certainty & Mystery",
    theme: "Knowing and unknowing",
    axisX: { id: "knowledge", label: "Knowledge", spectrum: ["Complete Certainty", "Embraced Mystery"] },
    axisY: { id: "action", label: "Action", spectrum: ["Wait for Clarity", "Act in Uncertainty"] }
  },
  {
    name: "Authenticity & Adaptation",
    theme: "True self and social self",
    axisX: { id: "expression", label: "Expression", spectrum: ["Pure Authenticity", "Strategic Adaptation"] },
    axisY: { id: "acceptance", label: "Acceptance", spectrum: ["Self-Acceptance", "Self-Transcendence"] }
  },
  {
    name: "Stability & Growth",
    theme: "Security and evolution",
    axisX: { id: "change", label: "Change", spectrum: ["Radical Stability", "Constant Evolution"] },
    axisY: { id: "risk", label: "Risk", spectrum: ["Safety-Seeking", "Risk-Embracing"] }
  }
];

export const THIRD_HORIZON_PROMPTS = [
  "What would become possible if both poles were fully honored?",
  "What new understanding transcends this opposition?",
  "What is the question that makes this paradox dissolve?",
  "What would someone who has integrated both sides say?",
  "What third possibility are you not yet seeing?",
  "How might holding both be different from choosing between?",
  "What does this tension want to teach you?",
  "Where in your body do you feel this paradox? What does it communicate?",
  "What would change if you stopped trying to resolve this?",
  "What wisdom tradition would see no contradiction here?"
];

export function createParadoxSession(theme: string, axisX: ParadoxAxis, axisY: ParadoxAxis): ParadoxSession {
  return {
    id: `paradox_${Date.now()}`,
    theme,
    axisX,
    axisY,
    entries: [],
    thirdHorizonNotes: "",
    synthesisAttempts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function createParadoxEntry(x: number, y: number, observation: string): ParadoxEntry {
  return {
    id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    position: { x, y },
    observation,
    timestamp: new Date().toISOString()
  };
}

export function getRandomThirdHorizonPrompt(): string {
  return THIRD_HORIZON_PROMPTS[Math.floor(Math.random() * THIRD_HORIZON_PROMPTS.length)];
}

export function saveParadoxSession(session: ParadoxSession): void {
  const key = "glp_paradox_maps";
  const existing: ParadoxSession[] = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = existing.findIndex(s => s.id === session.id);
  const updated = { ...session, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 25)));
}

export function getParadoxSessions(): ParadoxSession[] {
  return JSON.parse(localStorage.getItem("glp_paradox_maps") || "[]");
}

export function deleteParadoxSession(id: string): void {
  const key = "glp_paradox_maps";
  const existing: ParadoxSession[] = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify(existing.filter(s => s.id !== id)));
}
