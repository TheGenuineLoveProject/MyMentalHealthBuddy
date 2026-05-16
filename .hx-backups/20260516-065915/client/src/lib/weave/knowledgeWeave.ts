export interface WeaveNode {
  id: string;
  title: string;
  category: string;
  summary: string;
  references: string[];
  depth: number;
  lastReviewed?: string;
  createdAt: string;
}

export interface WeaveEdge {
  id: string;
  from: string;
  to: string;
  strength: 1 | 2 | 3 | 4 | 5;
  rationale: string;
  type: "builds-on" | "contradicts" | "complements" | "applies-to" | "derives-from";
}

export interface WeavePattern {
  id: string;
  name: string;
  nodeIds: string[];
  insight: string;
  discoveredAt: string;
}

export interface KnowledgeWeave {
  id: string;
  focus: string;
  description?: string;
  nodes: WeaveNode[];
  edges: WeaveEdge[];
  patterns: WeavePattern[];
  reviewSchedule: { cadence: "daily" | "weekly" | "monthly"; focusIds: string[] };
  createdAt: string;
  updatedAt: string;
}

export const KNOWLEDGE_CATEGORIES = [
  { id: "philosophy", label: "Philosophy", color: "#8B5CF6" },
  { id: "psychology", label: "Psychology", color: "#EC4899" },
  { id: "science", label: "Science", color: "#3B82F6" },
  { id: "systems", label: "Systems", color: "#10B981" },
  { id: "creativity", label: "Creativity", color: "#F59E0B" },
  { id: "spirituality", label: "Spirituality", color: "#6366F1" },
  { id: "practice", label: "Practice", color: "#14B8A6" },
  { id: "experience", label: "Experience", color: "#F97316" }
];

export const EDGE_TYPES: { type: WeaveEdge["type"]; label: string; description: string }[] = [
  { type: "builds-on", label: "Builds On", description: "This idea extends or deepens the other" },
  { type: "contradicts", label: "Contradicts", description: "These ideas are in tension" },
  { type: "complements", label: "Complements", description: "These ideas work together" },
  { type: "applies-to", label: "Applies To", description: "One is a specific instance of the other" },
  { type: "derives-from", label: "Derives From", description: "One idea emerged from the other" }
];

export const INTEGRATION_PROMPTS = [
  "What connects these ideas at a deeper level?",
  "What would you tell your past self about this connection?",
  "How does this change how you understand the world?",
  "What action or practice does this integration suggest?",
  "What question does this integration leave unanswered?"
];

export function createWeaveNode(title: string, category: string, summary: string = ""): WeaveNode {
  return {
    id: `weave_node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    category,
    summary,
    references: [],
    depth: 1,
    createdAt: new Date().toISOString()
  };
}

export function createWeaveEdge(from: string, to: string, type: WeaveEdge["type"], strength: WeaveEdge["strength"] = 3): WeaveEdge {
  return {
    id: `weave_edge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    from,
    to,
    type,
    strength,
    rationale: ""
  };
}

export function createKnowledgeWeave(focus: string): KnowledgeWeave {
  return {
    id: `weave_${Date.now()}`,
    focus,
    nodes: [],
    edges: [],
    patterns: [],
    reviewSchedule: { cadence: "weekly", focusIds: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function saveKnowledgeWeave(weave: KnowledgeWeave): void {
  const key = "glp_knowledge_weaves";
  const existing: KnowledgeWeave[] = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = existing.findIndex(w => w.id === weave.id);
  const updated = { ...weave, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.unshift(updated);
  }
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 15)));
}

export function getKnowledgeWeaves(): KnowledgeWeave[] {
  return JSON.parse(localStorage.getItem("glp_knowledge_weaves") || "[]");
}

export function deleteKnowledgeWeave(id: string): void {
  const key = "glp_knowledge_weaves";
  const existing: KnowledgeWeave[] = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify(existing.filter(w => w.id !== id)));
}

export function findClusters(nodes: WeaveNode[], edges: WeaveEdge[]): WeaveNode[][] {
  const clusters: WeaveNode[][] = [];
  const visited = new Set<string>();
  const adjacency: Record<string, string[]> = {};

  nodes.forEach(n => { adjacency[n.id] = []; });
  edges.forEach(e => {
    if (adjacency[e.from]) adjacency[e.from].push(e.to);
    if (adjacency[e.to]) adjacency[e.to].push(e.from);
  });

  function dfs(nodeId: string, cluster: WeaveNode[]): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) cluster.push(node);
    (adjacency[nodeId] || []).forEach(neighbor => dfs(neighbor, cluster));
  }

  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const cluster: WeaveNode[] = [];
      dfs(node.id, cluster);
      if (cluster.length > 0) clusters.push(cluster);
    }
  });

  return clusters.sort((a, b) => b.length - a.length);
}

export function getRandomIntegrationPrompt(): string {
  return INTEGRATION_PROMPTS[Math.floor(Math.random() * INTEGRATION_PROMPTS.length)];
}
