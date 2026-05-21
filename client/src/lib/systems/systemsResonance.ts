export interface SystemNode {
  id: string;
  label: string;
  type: "stock" | "flow" | "variable" | "delay";
  value?: number;
  x?: number;
  y?: number;
}

export interface SystemLink {
  id: string;
  from: string;
  to: string;
  polarity: "+" | "-";
  strength: number;
  label?: string;
}

export interface SystemScenario {
  id: string;
  name: string;
  adjustments: Record<string, number>;
  observations: string;
  timestamp: string;
}

export interface SystemModel {
  id: string;
  focus: string;
  description?: string;
  nodes: SystemNode[];
  links: SystemLink[];
  scenarios: SystemScenario[];
  insights: string[];
  createdAt: string;
  updatedAt: string;
}

export const ARCHETYPE_PATTERNS = [
  {
    id: "reinforcing",
    name: "Reinforcing Loop",
    description: "A cycle where changes amplify themselves — growth or decline accelerates.",
    example: "Success → Confidence → More Effort → More Success",
    prompt: "Where in your life do you see amplifying cycles?"
  },
  {
    id: "balancing",
    name: "Balancing Loop",
    description: "A cycle that seeks equilibrium — overcorrection toward a goal.",
    example: "Gap from Goal → Action → Reduced Gap → Less Action",
    prompt: "What are you unconsciously balancing toward?"
  },
  {
    id: "shifting-burden",
    name: "Shifting the Burden",
    description: "A quick fix that creates dependency while masking the real problem.",
    example: "Symptom → Quick Fix → Symptom Reduction + Weakened Fundamental Solution",
    prompt: "What fundamental solution are your quick fixes obscuring?"
  },
  {
    id: "limits-growth",
    name: "Limits to Growth",
    description: "Growth eventually triggers constraints that slow or reverse it.",
    example: "Growing Action → Success → Constraint Activation → Slowing Growth",
    prompt: "What constraints will this growth eventually encounter?"
  },
  {
    id: "tragedy-commons",
    name: "Tragedy of the Commons",
    description: "Individual rational behavior leads to collective harm.",
    example: "Individual Gain → Shared Resource Depletion → Individual Loss",
    prompt: "What shared resources are being depleted by individual optimization?"
  },
  {
    id: "fixes-fail",
    name: "Fixes That Fail",
    description: "Solutions create unintended consequences that worsen the original problem.",
    example: "Problem → Fix → Short-term Improvement + Delayed Worsening",
    prompt: "What second-order effects might this solution create?"
  }
];

export const NODE_TYPES: { type: SystemNode["type"]; label: string; description: string }[] = [
  { type: "stock", label: "Stock", description: "Accumulation — something that builds up or depletes over time" },
  { type: "flow", label: "Flow", description: "Rate of change — what increases or decreases the stock" },
  { type: "variable", label: "Variable", description: "A factor that influences the system" },
  { type: "delay", label: "Delay", description: "A lag between cause and effect" }
];

export function createSystemNode(type: SystemNode["type"], label: string = ""): SystemNode {
  return {
    id: `sysnode_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    label,
    type,
    value: 50
  };
}

export function createSystemLink(from: string, to: string, polarity: "+" | "-"): SystemLink {
  return {
    id: `syslink_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    from,
    to,
    polarity,
    strength: 50
  };
}

export function createSystemModel(focus: string): SystemModel {
  return {
    id: `system_${Date.now()}`,
    focus,
    nodes: [],
    links: [],
    scenarios: [],
    insights: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveSystemModel(model: SystemModel): void {
  const key = "glp_system_models";
  const existing: SystemModel[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  const idx = existing.findIndex(m => m.id === model.id);
  const updated = { ...model, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  try { localStorage.setItem(key, JSON.stringify(existing.slice(0, 20))); } catch (err) { console.warn("[storage-safe-write]", err); }
}

export function getSystemModels(): SystemModel[] {
  return ((()=>{try{return JSON.parse(localStorage.getItem("glp_system_models") || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
}

export function deleteSystemModel(id: string): void {
  const key = "glp_system_models";
  const existing: SystemModel[] = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
  localStorage.setItem(key, JSON.stringify(existing.filter(m => m.id !== id)));
}

export function detectLoops(nodes: SystemNode[], links: SystemLink[]): { type: "reinforcing" | "balancing"; nodeIds: string[] }[] {
  const loops: { type: "reinforcing" | "balancing"; nodeIds: string[] }[] = [];
  const adjacency: Record<string, { to: string; polarity: "+" | "-" }[]> = {};
  
  nodes.forEach(n => { adjacency[n.id] = []; });
  links.forEach(l => {
    if (adjacency[l.from]) {
      adjacency[l.from].push({ to: l.to, polarity: l.polarity });
    }
  });

  function dfs(start: string, current: string, path: string[], polarities: ("+" | "-")[]): void {
    const neighbors = adjacency[current] || [];
    for (const { to, polarity } of neighbors) {
      if (to === start && path.length >= 2) {
        const allPolarities = [...polarities, polarity];
        const negativeCount = allPolarities.filter(p => p === "-").length;
        const loopType = negativeCount % 2 === 0 ? "reinforcing" : "balancing";
        loops.push({ type: loopType, nodeIds: [...path] });
      } else if (!path.includes(to) && path.length < 6) {
        dfs(start, to, [...path, to], [...polarities, polarity]);
      }
    }
  }

  nodes.forEach(n => {
    dfs(n.id, n.id, [n.id], []);
  });

  return loops;
}
