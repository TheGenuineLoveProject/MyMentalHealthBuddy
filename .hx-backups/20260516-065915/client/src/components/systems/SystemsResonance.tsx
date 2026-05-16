import { useState, useEffect } from "react";
import {
  ARCHETYPE_PATTERNS,
  NODE_TYPES,
  createSystemNode,
  createSystemLink,
  createSystemModel,
  saveSystemModel,
  getSystemModels,
  deleteSystemModel,
  detectLoops,
  type SystemNode,
  type SystemLink,
  type SystemModel
} from "@/lib/systems/systemsResonance";
import { GitBranch, Plus, Trash2, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SystemsResonance() {
  const { toast } = useToast();
  const [models, setModels] = useState<SystemModel[]>([]);
  const [activeModel, setActiveModel] = useState<SystemModel | null>(null);
  const [newFocus, setNewFocus] = useState("");
  const [showArchetypes, setShowArchetypes] = useState(false);
  const [newNodeType, setNewNodeType] = useState<SystemNode["type"]>("variable");
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [linkFrom, setLinkFrom] = useState("");
  const [linkTo, setLinkTo] = useState("");
  const [linkPolarity, setLinkPolarity] = useState<"+" | "-">("+");

  useEffect(() => {
    setModels(getSystemModels());
  }, []);

  function handleCreateModel() {
    if (!newFocus.trim()) return;
    const model = createSystemModel(newFocus);
    saveSystemModel(model);
    setActiveModel(model);
    setModels(getSystemModels());
    setNewFocus("");
  }

  function handleAddNode() {
    if (!activeModel || !newNodeLabel.trim()) return;
    const node = createSystemNode(newNodeType, newNodeLabel);
    const updated = { ...activeModel, nodes: [...activeModel.nodes, node] };
    saveSystemModel(updated);
    setActiveModel(updated);
    setNewNodeLabel("");
  }

  function handleAddLink() {
    if (!activeModel || !linkFrom || !linkTo || linkFrom === linkTo) return;
    const link = createSystemLink(linkFrom, linkTo, linkPolarity);
    const updated = { ...activeModel, links: [...activeModel.links, link] };
    saveSystemModel(updated);
    setActiveModel(updated);
    setLinkFrom("");
    setLinkTo("");
  }

  function handleDeleteNode(nodeId: string) {
    if (!activeModel) return;
    const updated = {
      ...activeModel,
      nodes: activeModel.nodes.filter(n => n.id !== nodeId),
      links: activeModel.links.filter(l => l.from !== nodeId && l.to !== nodeId)
    };
    saveSystemModel(updated);
    setActiveModel(updated);
  }

  function handleDeleteLink(linkId: string) {
    if (!activeModel) return;
    const updated = { ...activeModel, links: activeModel.links.filter(l => l.id !== linkId) };
    saveSystemModel(updated);
    setActiveModel(updated);
  }

  if (activeModel) {
    const loops = detectLoops(activeModel.nodes, activeModel.links);
    const reinforcing = loops.filter(l => l.type === "reinforcing").length;
    const balancing = loops.filter(l => l.type === "balancing").length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeModel.focus}</h2>
            <p className="text-sm opacity-60">
              {activeModel.nodes.length} elements • {activeModel.links.length} connections
            </p>
          </div>
          <button
            onClick={() => { setModels(getSystemModels()); setActiveModel(null); }}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-system"
          >
            Exit
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Add Element</h3>
            <div className="flex gap-2 mb-2">
              {NODE_TYPES.map(nt => (
                <button
                  key={nt.type}
                  onClick={() => setNewNodeType(nt.type)}
                  className={`rounded px-2 py-1 text-xs ${newNodeType === nt.type ? "bg-white/20" : "bg-white/5"}`}
                  data-testid={`button-type-${nt.type}`}
                >
                  {nt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="Element name..."
                className="flex-1 rounded border border-white/10 bg-black/20 px-3 py-2 text-sm"
                data-testid="input-node-label"
              />
              <button
                onClick={handleAddNode}
                disabled={!newNodeLabel.trim()}
                className="rounded bg-green-500/20 border border-green-500/30 px-3 disabled:opacity-40"
                data-testid="button-add-node"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Add Connection</h3>
            <div className="flex gap-2 mb-2">
              <select
                value={linkFrom}
                onChange={(e) => setLinkFrom(e.target.value)}
                className="flex-1 rounded border border-white/10 bg-black/20 px-2 py-1 text-sm"
                data-testid="select-link-from"
              >
                <option value="">From...</option>
                {activeModel.nodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
              <button
                onClick={() => setLinkPolarity(linkPolarity === "+" ? "-" : "+")}
                className={`rounded px-3 py-1 text-lg font-bold ${linkPolarity === "+" ? "bg-green-500/20" : "bg-red-500/20"}`}
                data-testid="button-toggle-polarity"
              >
                {linkPolarity}
              </button>
              <select
                value={linkTo}
                onChange={(e) => setLinkTo(e.target.value)}
                className="flex-1 rounded border border-white/10 bg-black/20 px-2 py-1 text-sm"
                data-testid="select-link-to"
              >
                <option value="">To...</option>
                {activeModel.nodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddLink}
              disabled={!linkFrom || !linkTo || linkFrom === linkTo}
              className="w-full rounded bg-blue-500/20 border border-blue-500/30 py-2 text-sm disabled:opacity-40"
              data-testid="button-add-link"
            >
              Connect
            </button>
          </div>
        </div>

        {activeModel.nodes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-70">System Elements</h3>
            <div className="flex flex-wrap gap-2">
              {activeModel.nodes.map(node => (
                <div
                  key={node.id}
                  className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 flex items-center gap-2"
                >
                  <span className="text-xs opacity-50 uppercase">{node.type[0]}</span>
                  <span className="text-sm">{node.label}</span>
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

        {activeModel.links.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-70">Connections</h3>
            {activeModel.links.map(link => {
              const fromNode = activeModel.nodes.find(n => n.id === link.from);
              const toNode = activeModel.nodes.find(n => n.id === link.to);
              return (
                <div
                  key={link.id}
                  className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 flex items-center gap-2"
                >
                  <span className="text-sm">{fromNode?.label}</span>
                  <span className={`px-2 font-bold ${link.polarity === "+" ? "text-green-400" : "text-red-400"}`}>
                    {link.polarity}
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-40" />
                  <span className="text-sm">{toNode?.label}</span>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="ml-auto p-1 rounded hover:bg-white/10"
                    data-testid={`button-delete-link-${link.id}`}
                  >
                    <Trash2 className="h-3 w-3 opacity-60" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {loops.length > 0 && (
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <h3 className="font-medium mb-2">Loop Detection</h3>
            <p className="text-sm opacity-80">
              Found {reinforcing} reinforcing loop{reinforcing !== 1 ? "s" : ""} and {balancing} balancing loop{balancing !== 1 ? "s" : ""}.
            </p>
            <p className="text-xs opacity-60 mt-2">
              Reinforcing loops amplify change. Balancing loops seek equilibrium.
            </p>
          </div>
        )}

        <button
          onClick={() => setShowArchetypes(!showArchetypes)}
          className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
          data-testid="button-toggle-archetypes"
        >
          <RefreshCw className="h-4 w-4" />
          System Archetypes Reference
        </button>

        {showArchetypes && (
          <div className="grid gap-3 sm:grid-cols-2">
            {ARCHETYPE_PATTERNS.map(p => (
              <div key={p.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <h4 className="font-medium">{p.name}</h4>
                <p className="text-sm opacity-70 mt-1">{p.description}</p>
                <p className="text-xs opacity-50 mt-2 italic">{p.prompt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-green-400" />
        <h2 className="text-xl font-semibold">Systems Resonance Simulator</h2>
      </div>

      <p className="text-sm opacity-80">
        Model the systems around you — stocks, flows, feedback loops. 
        See how things connect and what patterns emerge.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={newFocus}
          onChange={(e) => setNewFocus(e.target.value)}
          placeholder="What system do you want to explore?"
          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
          data-testid="input-system-focus"
        />
        <button
          onClick={handleCreateModel}
          disabled={!newFocus.trim()}
          className="rounded-lg bg-green-500/20 border border-green-500/30 px-4 py-2 disabled:opacity-40"
          data-testid="button-create-system"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {models.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Models</h3>
          {models.map(model => (
            <div
              key={model.id}
              className="rounded-xl border border-white/10 bg-black/10 p-4 flex items-center justify-between"
            >
              <button
                onClick={() => setActiveModel(model)}
                className="text-left flex-1"
                data-testid={`button-open-${model.id}`}
              >
                <span className="font-medium">{model.focus}</span>
                <p className="text-xs opacity-50">{model.nodes.length} elements</p>
              </button>
              <button
                onClick={() => { deleteSystemModel(model.id); setModels(getSystemModels()); }}
                className="p-2 rounded hover:bg-white/10"
                data-testid={`button-delete-${model.id}`}
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
