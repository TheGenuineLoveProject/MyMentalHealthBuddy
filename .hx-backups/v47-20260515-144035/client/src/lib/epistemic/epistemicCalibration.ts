export interface Prediction {
  id: string;
  statement: string;
  domain: "personal" | "professional" | "world" | "relationships" | "health" | "learning";
  confidence: number;
  timeframe: string;
  resolution?: "correct" | "incorrect" | "partial" | "unresolved";
  resolvedAt?: string;
  reflection?: string;
  createdAt: string;
}

export interface BeliefAudit {
  id: string;
  belief: string;
  certainty: number;
  sourceQuality: "direct-experience" | "trusted-source" | "second-hand" | "intuition" | "unknown";
  lastExamined: string;
  counterEvidence: string[];
  wouldChangeIf: string;
  createdAt: string;
}

export interface EpistemicProfile {
  id: string;
  predictions: Prediction[];
  beliefAudits: BeliefAudit[];
  overconfidenceScore?: number;
  underconfidenceScore?: number;
  calibrationNotes: string[];
  createdAt: string;
  updatedAt: string;
}

export const CALIBRATION_QUESTIONS = [
  "What would you need to see to change your mind about this?",
  "How would you know if you were wrong?",
  "What's the strongest argument against your position?",
  "Who disagrees with you that you respect? What do they see?",
  "If you're right, what else should be true that you could check?",
  "What's your track record on similar predictions?"
];

export const EPISTEMIC_VIRTUES = [
  { id: "humility", name: "Intellectual Humility", description: "Recognizing the limits of your knowledge" },
  { id: "curiosity", name: "Curiosity", description: "Genuine desire to understand, not just to be right" },
  { id: "courage", name: "Epistemic Courage", description: "Willingness to question comfortable beliefs" },
  { id: "precision", name: "Precision", description: "Saying exactly what you mean, no more" },
  { id: "updating", name: "Updating", description: "Changing beliefs proportionally to evidence" },
  { id: "charity", name: "Interpretive Charity", description: "Steelmanning opposing views" }
];

export const SOURCE_QUALITY_LABELS: Record<BeliefAudit["sourceQuality"], string> = {
  "direct-experience": "Direct Experience",
  "trusted-source": "Trusted Source",
  "second-hand": "Second-Hand",
  "intuition": "Intuition",
  "unknown": "Unknown Origin"
};

export function createPrediction(statement: string, confidence: number, domain: Prediction["domain"], timeframe: string): Prediction {
  return {
    id: `pred_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    statement,
    domain,
    confidence: Math.max(0, Math.min(100, confidence)),
    timeframe,
    createdAt: new Date().toISOString()
  };
}

export function createBeliefAudit(belief: string, certainty: number, sourceQuality: BeliefAudit["sourceQuality"]): BeliefAudit {
  return {
    id: `belief_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    belief,
    certainty: Math.max(0, Math.min(100, certainty)),
    sourceQuality,
    lastExamined: new Date().toISOString(),
    counterEvidence: [],
    wouldChangeIf: "",
    createdAt: new Date().toISOString()
  };
}

export function createEpistemicProfile(): EpistemicProfile {
  return {
    id: `epistemic_${Date.now()}`,
    predictions: [],
    beliefAudits: [],
    calibrationNotes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveEpistemicProfile(profile: EpistemicProfile): void {
  const key = "glp_epistemic_profile";
  const updated = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getEpistemicProfile(): EpistemicProfile | null {
  const stored = localStorage.getItem("glp_epistemic_profile");
  return stored ? JSON.parse(stored) : null;
}

export function calculateCalibration(predictions: Prediction[]): { 
  overconfidence: number; 
  underconfidence: number; 
  brierScore: number;
  observations: string[] 
} {
  const resolved = predictions.filter(p => p.resolution && p.resolution !== "unresolved");
  if (resolved.length < 3) {
    return { overconfidence: 0, underconfidence: 0, brierScore: 0, observations: ["Need more resolved predictions for calibration"] };
  }

  let overconfidenceSum = 0;
  let underconfidenceSum = 0;
  let brierSum = 0;

  resolved.forEach(p => {
    const outcome = p.resolution === "correct" ? 1 : p.resolution === "partial" ? 0.5 : 0;
    const prob = p.confidence / 100;
    
    brierSum += Math.pow(prob - outcome, 2);
    
    if (prob > 0.5 && outcome < prob) overconfidenceSum++;
    if (prob < 0.5 && outcome > prob) underconfidenceSum++;
  });

  const observations: string[] = [];
  const brierScore = brierSum / resolved.length;
  
  if (brierScore < 0.1) observations.push("Excellent calibration — your confidence matches reality well.");
  else if (brierScore < 0.25) observations.push("Good calibration with room for refinement.");
  else observations.push("Significant calibration gap — consider being more uncertain.");

  return {
    overconfidence: (overconfidenceSum / resolved.length) * 100,
    underconfidence: (underconfidenceSum / resolved.length) * 100,
    brierScore: Math.round(brierScore * 100) / 100,
    observations
  };
}

export function getRandomCalibrationQuestion(): string {
  return CALIBRATION_QUESTIONS[Math.floor(Math.random() * CALIBRATION_QUESTIONS.length)];
}
