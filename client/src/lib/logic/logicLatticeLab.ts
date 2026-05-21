export interface LogicNode {
  id: string;
  text: string;
  type: "claim" | "premise" | "evidence" | "counter" | "inference";
  confidence: number;
  links: string[];
  notes?: string;
}

export interface LogicSession {
  id: string;
  topic: string;
  nodes: LogicNode[];
  createdAt: string;
  updatedAt: string;
}

export const LOGICAL_FALLACIES = [
  {
    id: "ad-hominem",
    name: "Ad Hominem",
    description: "Attacking the person rather than the argument.",
    prompt: "Is this addressing the argument itself, or the person making it?"
  },
  {
    id: "straw-man",
    name: "Straw Man",
    description: "Misrepresenting someone's argument to make it easier to attack.",
    prompt: "Am I engaging with the strongest version of this position?"
  },
  {
    id: "false-dichotomy",
    name: "False Dichotomy",
    description: "Presenting only two options when more exist.",
    prompt: "What other possibilities am I not considering?"
  },
  {
    id: "slippery-slope",
    name: "Slippery Slope",
    description: "Assuming one event will lead to extreme consequences.",
    prompt: "What evidence supports each step in this chain?"
  },
  {
    id: "appeal-authority",
    name: "Appeal to Authority",
    description: "Using authority as evidence rather than logical reasoning.",
    prompt: "Is this authority relevant and is the claim independently verifiable?"
  },
  {
    id: "circular",
    name: "Circular Reasoning",
    description: "Using the conclusion as a premise.",
    prompt: "What independent evidence supports this beyond the claim itself?"
  },
  {
    id: "hasty-generalization",
    name: "Hasty Generalization",
    description: "Drawing broad conclusions from limited examples.",
    prompt: "How representative is this sample? What counter-examples exist?"
  },
  {
    id: "false-cause",
    name: "False Cause",
    description: "Assuming correlation implies causation.",
    prompt: "What other factors could explain this relationship?"
  }
];

export const NODE_PROMPTS: Record<LogicNode["type"], string> = {
  claim: "What position or conclusion are you exploring?",
  premise: "What underlying assumption supports this?",
  evidence: "What observable facts or data support this?",
  counter: "What challenges or contradicts this?",
  inference: "What follows logically from these premises?"
};

export function createLogicNode(type: LogicNode["type"], text: string = ""): LogicNode {
  return {
    id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text,
    type,
    confidence: 50,
    links: []
  };
}

export function createLogicSession(topic: string): LogicSession {
  return {
    id: `logic_${Date.now()}`,
    topic,
    nodes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveLogicSession(session: LogicSession): void {
  const key = "glp_logic_sessions";
  const existing: LogicSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  const idx = existing.findIndex(s => s.id === session.id);
  const updated = { ...session, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 30))); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export function getLogicSessions(): LogicSession[] {
  return ((()=>{try{return JSON.parse(localStorage.getItem("glp_logic_sessions") || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
}

export function deleteLogicSession(id: string): void {
  const key = "glp_logic_sessions";
  const existing: LogicSession[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  localStorage.setItem(key, JSON.stringify(existing.filter(s => s.id !== id)));
}

export function analyzeArgumentStrength(nodes: LogicNode[]): { score: number; observations: string[] } {
  const observations: string[] = [];
  let score = 50;

  const claims = nodes.filter(n => n.type === "claim");
  const evidence = nodes.filter(n => n.type === "evidence");
  const counters = nodes.filter(n => n.type === "counter");
  const premises = nodes.filter(n => n.type === "premise");

  if (claims.length > 0 && evidence.length === 0) {
    observations.push("Claims present without supporting evidence.");
    score -= 15;
  }

  if (evidence.length >= 2) {
    observations.push("Multiple pieces of evidence strengthen the argument.");
    score += 10;
  }

  if (counters.length > 0) {
    observations.push("Counter-arguments acknowledged — a sign of intellectual honesty.");
    score += 10;
  }

  if (premises.length > 0) {
    observations.push("Underlying premises made explicit.");
    score += 5;
  }

  const avgConfidence = nodes.length > 0 
    ? nodes.reduce((sum, n) => sum + n.confidence, 0) / nodes.length 
    : 50;
  
  if (avgConfidence < 40) {
    observations.push("Low average confidence — uncertainty is acknowledged.");
  } else if (avgConfidence > 80) {
    observations.push("High confidence across nodes — consider whether this is warranted.");
  }

  return { score: Math.min(100, Math.max(0, score)), observations };
}
