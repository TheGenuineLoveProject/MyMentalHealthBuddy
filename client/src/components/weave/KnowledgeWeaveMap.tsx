import { useState, useEffect } from "react";
import {
  KNOWLEDGE_CATEGORIES,
  EDGE_TYPES,
  createWeaveNode,
  createWeaveEdge,
  createKnowledgeWeave,
  saveKnowledgeWeave,
  getKnowledgeWeaves,
  deleteKnowledgeWeave,
  findClusters,
  getRandomIntegrationPrompt,
  type WeaveNode,
  type WeaveEdge,
  type KnowledgeWeave
} from "@/lib/weave/knowledgeWeave";
import { Share2, Plus, Trash2, Link, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function KnowledgeWeaveMap() {
  const { toast } = useToast();
  const [weaves, setWeaves] = useState<KnowledgeWeave[]>([]);
  const [activeWeave, setActiveWeave] = useState<KnowledgeWeave | null>(null);
  const [newFocus, setNewFocus] = useState("");
  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeCategory, setNodeCategory] = useState(KNOWLEDGE_CATEGORIES[0].id);
  const [nodeSummary, setNodeSummary] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeType, setEdgeType] = useState<WeaveEdge["type"]>("builds-on");
  const [integrationPrompt, setIntegrationPrompt] = useState(() => getRandomIntegrationPrompt());

  useEffect(() => {
    setWeaves(getKnowledgeWeaves());
  }, []);

  function handleCreateWeave() {
    if (!newFocus.trim()) return;
    const weave = createKnowledgeWeave(newFocus);
    saveKnowledgeWeave(weave);
    setActiveWeave(weave);
    setWeaves(getKnowledgeWeaves());
    setNewFocus("");
  }

  function handleAddNode() {
    if (!activeWeave || !nodeTitle.trim()) return;
    const node = createWeaveNode(nodeTitle, nodeCategory, nodeSummary);
    const updated = { ...activeWeave, nodes: [...activeWeave.nodes, node] };
    saveKnowledgeWeave(updated);
    setActiveWeave(updated);
    setNodeTitle("");
    setNodeSummary("");
  }

  function handleAddEdge() {
    if (!activeWeave || !edgeFrom || !edgeTo || edgeFrom === edgeTo) return;
    const edge = createWeaveEdge(edgeFrom, edgeTo, edgeType);
    const updated = { ...activeWeave, edges: [...activeWeave.edges, edge] };
    saveKnowledgeWeave(updated);
    setActiveWeave(updated);
    setEdgeFrom("");
    setEdgeTo("");
  }

  function handleDeleteNode(nodeId: string) {
    if (!activeWeave) return;
    const updated = {
      ...activeWeave,
      nodes: activeWeave.nodes.filter(n => n.id !== nodeId),
      edges: activeWeave.edges.filter(e => e.from !== nodeId && e.to !== nodeId)
    };
    saveKnowledgeWeave(updated);
    setActiveWeave(updated);
  }

  if (activeWeave) {
    const clusters = findClusters(activeWeave.nodes, activeWeave.edges);
    const categoryColor = (catId: string) => 
      KNOWLEDGE_CATEGORIES.find(c => c.id === catId)?.color || "#888";

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeWeave.focus}</h2>
            <p className="text-sm opacity-60">
              {activeWeave.nodes.length} concepts • {activeWeave.edges.length} connections
            </p>
          </div>
          <button
            onClick={() => { setWeaves(getKnowledgeWeaves()); setActiveWeave(null); }}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-weave"
          >
            Exit
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Add Concept</h3>
            <input
              type="text"
              value={nodeTitle}
              onChange={(e) => setNodeTitle(e.target.value)}
              placeholder="Concept title..."
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm mb-2"
              data-testid="input-node-title"
            />
            <div className="flex flex-wrap gap-1 mb-2">
              {KNOWLEDGE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNodeCategory(cat.id)}
                  className={`rounded px-2 py-1 text-xs ${nodeCategory === cat.id ? "ring-1 ring-white/30" : ""}`}
                  style={{ backgroundColor: `${cat.color}20`, borderColor: `${cat.color}40` }}
                  data-testid={`button-cat-${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <textarea
              value={nodeSummary}
              onChange={(e) => setNodeSummary(e.target.value)}
              placeholder="Brief summary..."
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[60px] text-sm mb-2"
              data-testid="input-node-summary"
            />
            <button
              onClick={handleAddNode}
              disabled={!nodeTitle.trim()}
              className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-add-concept"
            >
              Add Concept
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Connect Concepts</h3>
            <select
              value={edgeFrom}
              onChange={(e) => setEdgeFrom(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm mb-2"
              data-testid="select-edge-from"
            >
              <option value="">From concept...</option>
              {activeWeave.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>
            <select
              value={edgeType}
              onChange={(e) => setEdgeType(e.target.value as WeaveEdge["type"])}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm mb-2"
              data-testid="select-edge-type"
            >
              {EDGE_TYPES.map(et => (
                <option key={et.type} value={et.type}>{et.label}</option>
              ))}
            </select>
            <select
              value={edgeTo}
              onChange={(e) => setEdgeTo(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm mb-2"
              data-testid="select-edge-to"
            >
              <option value="">To concept...</option>
              {activeWeave.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>
            <button
              onClick={handleAddEdge}
              disabled={!edgeFrom || !edgeTo || edgeFrom === edgeTo}
              className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-add-edge"
            >
              <Link className="h-4 w-4 inline mr-1" />
              Connect
            </button>
          </div>
        </div>

        {activeWeave.nodes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-70">Your Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {activeWeave.nodes.map(node => (
                <div
                  key={node.id}
                  className="rounded-lg border px-3 py-2 flex items-center gap-2"
                  style={{ 
                    borderColor: `${categoryColor(node.category)}40`,
                    backgroundColor: `${categoryColor(node.category)}10`
                  }}
                >
                  <span className="text-sm">{node.title}</span>
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="p-1 rounded hover:bg-white/10"
                    data-testid={`button-delete-node-${node.id}`}
                  >
                    <Trash2 className="h-3 w-3 opacity-60" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {clusters.length > 1 && (
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <h3 className="font-medium mb-2">Knowledge Clusters</h3>
            <p className="text-sm opacity-80">
              You have {clusters.length} distinct clusters of connected ideas.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {clusters.map((cluster, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded-full bg-white/10">
                  Cluster {idx + 1}: {cluster.length} concepts
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Integration Prompt</span>
            <button
              onClick={() => setIntegrationPrompt(getRandomIntegrationPrompt())}
              className="p-1.5 rounded-lg hover:bg-white/10"
              data-testid="button-new-integration"
            >
              <RefreshCw className="h-4 w-4 opacity-60" />
            </button>
          </div>
          <p className="text-sm italic">{integrationPrompt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-cyan-400" />
        <h2 className="text-xl font-semibold">Knowledge Weave Map</h2>
      </div>

      <p className="text-sm opacity-80">
        Map the connections between what you're learning. See how ideas relate across domains.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={newFocus}
          onChange={(e) => setNewFocus(e.target.value)}
          placeholder="What area of knowledge do you want to map?"
          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
          data-testid="input-weave-focus"
        />
        <button
          onClick={handleCreateWeave}
          disabled={!newFocus.trim()}
          className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 disabled:opacity-40"
          data-testid="button-create-weave"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {weaves.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Weaves</h3>
          {weaves.map(weave => (
            <div
              key={weave.id}
              className="rounded-xl border border-white/10 bg-black/10 p-4 flex items-center justify-between"
            >
              <button
                onClick={() => setActiveWeave(weave)}
                className="text-left flex-1"
                data-testid={`button-open-${weave.id}`}
              >
                <span className="font-medium">{weave.focus}</span>
                <p className="text-xs opacity-50">{weave.nodes.length} concepts</p>
              </button>
              <button
                onClick={() => { deleteKnowledgeWeave(weave.id); setWeaves(getKnowledgeWeaves()); }}
                className="p-2 rounded hover:bg-white/10"
                data-testid={`button-delete-${weave.id}`}
              >
                <Trash2 className="h-4 w-4 opacity-60" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
