import { useState, useEffect } from "react";
import {
  RELATIONSHIP_TYPES,
  CORE_CONCEPT_CATEGORIES,
  createSemanticNode,
  createSemanticMap,
  saveSemanticMap,
  getSemanticMaps,
  deleteSemanticMap,
  getRandomMeaningPrompt,
  calculateSemanticDensity,
  type SemanticMap,
  type SemanticNode
} from "@/lib/semantic/semanticMapping";
import { Type, Plus, Trash2, RefreshCw, Link } from "lucide-react";

export default function SemanticMapping() {
  const [maps, setMaps] = useState<SemanticMap[]>([]);
  const [activeMap, setActiveMap] = useState<SemanticMap | null>(null);
  const [newFocus, setNewFocus] = useState("");
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [connectionFrom, setConnectionFrom] = useState("");
  const [connectionTo, setConnectionTo] = useState("");
  const [connectionType, setConnectionType] = useState("synonym");
  const [meaningPrompt, setMeaningPrompt] = useState(() => getRandomMeaningPrompt());

  useEffect(() => {
    setMaps(getSemanticMaps());
  }, []);

  function handleCreateMap() {
    if (!newFocus.trim()) return;
    const map = createSemanticMap(newFocus);
    saveSemanticMap(map);
    setActiveMap(map);
    setMaps(getSemanticMaps());
    setNewFocus("");
  }

  function handleAddWord() {
    if (!activeMap || !newWord.trim() || !newMeaning.trim()) return;
    const node = createSemanticNode(newWord, newMeaning);
    const updated = { ...activeMap, nodes: [...activeMap.nodes, node] };
    saveSemanticMap(updated);
    setActiveMap(updated);
    setNewWord("");
    setNewMeaning("");
  }

  function handleAddConnection() {
    if (!activeMap || !connectionFrom || !connectionTo || connectionFrom === connectionTo) return;
    const relType = RELATIONSHIP_TYPES.find(r => r.id === connectionType);
    const connection = { from: connectionFrom, to: connectionTo, relationship: relType?.label || connectionType };
    const updated = { ...activeMap, connections: [...activeMap.connections, connection] };
    saveSemanticMap(updated);
    setActiveMap(updated);
    setConnectionFrom("");
    setConnectionTo("");
  }

  function handleUpdateNodeValence(nodeId: string, valence: number) {
    if (!activeMap) return;
    const updated = {
      ...activeMap,
      nodes: activeMap.nodes.map(n => n.id === nodeId ? { ...n, emotionalValence: valence } : n)
    };
    saveSemanticMap(updated);
    setActiveMap(updated);
  }

  function handleDeleteNode(nodeId: string) {
    if (!activeMap) return;
    const updated = {
      ...activeMap,
      nodes: activeMap.nodes.filter(n => n.id !== nodeId),
      connections: activeMap.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
    };
    saveSemanticMap(updated);
    setActiveMap(updated);
  }

  if (activeMap) {
    const density = calculateSemanticDensity(activeMap);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeMap.focus}</h2>
            <p className="text-sm opacity-60">
              {activeMap.nodes.length} words • {activeMap.connections.length} connections • {density}% density
            </p>
          </div>
          <button
            onClick={() => { setMaps(getSemanticMaps()); setActiveMap(null); }}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-semantic"
          >
            Exit
          </button>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Meaning Prompt</span>
            <button
              onClick={() => setMeaningPrompt(getRandomMeaningPrompt())}
              className="p-1.5 rounded-lg hover:bg-white/10"
              data-testid="button-new-prompt"
            >
              <RefreshCw className="h-4 w-4 opacity-60" />
            </button>
          </div>
          <p className="text-sm italic">{meaningPrompt}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <h3 className="font-medium mb-3">Add a Word</h3>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="The word..."
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm mb-2"
            data-testid="input-word"
          />
          <textarea
            value={newMeaning}
            onChange={(e) => setNewMeaning(e.target.value)}
            placeholder="What does it mean to you?"
            className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[80px] text-sm mb-2"
            data-testid="input-meaning"
          />
          <button
            onClick={handleAddWord}
            disabled={!newWord.trim() || !newMeaning.trim()}
            className="rounded-lg bg-teal-500/20 border border-teal-500/30 px-4 py-2 text-sm disabled:opacity-40"
            data-testid="button-add-word"
          >
            Add Word
          </button>
        </div>

        {activeMap.nodes.length >= 2 && (
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Connect Words</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <select
                value={connectionFrom}
                onChange={(e) => setConnectionFrom(e.target.value)}
                className="flex-1 rounded border border-white/10 bg-black/20 px-2 py-1 text-sm"
                data-testid="select-connection-from"
              >
                <option value="">From...</option>
                {activeMap.nodes.map(n => (
                  <option key={n.id} value={n.id}>{n.word}</option>
                ))}
              </select>
              <select
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value)}
                className="rounded border border-white/10 bg-black/20 px-2 py-1 text-sm"
                data-testid="select-connection-type"
              >
                {RELATIONSHIP_TYPES.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
              <select
                value={connectionTo}
                onChange={(e) => setConnectionTo(e.target.value)}
                className="flex-1 rounded border border-white/10 bg-black/20 px-2 py-1 text-sm"
                data-testid="select-connection-to"
              >
                <option value="">To...</option>
                {activeMap.nodes.map(n => (
                  <option key={n.id} value={n.id}>{n.word}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddConnection}
              disabled={!connectionFrom || !connectionTo || connectionFrom === connectionTo}
              className="rounded-lg bg-teal-500/20 border border-teal-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-add-connection"
            >
              <Link className="h-4 w-4 inline mr-1" />
              Connect
            </button>
          </div>
        )}

        {activeMap.nodes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-70">Your Words</h3>
            {activeMap.nodes.map(node => (
              <div key={node.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-lg">{node.word}</span>
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="p-1 rounded hover:bg-white/10"
                    data-testid={`button-delete-${node.id}`}
                  >
                    <Trash2 className="h-4 w-4 opacity-60" />
                  </button>
                </div>
                <p className="text-sm opacity-80 mb-3">{node.personalMeaning}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-50">Emotional valence:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={node.emotionalValence}
                    onChange={(e) => handleUpdateNodeValence(node.id, parseInt(e.target.value))}
                    className="flex-1"
                    data-testid={`slider-valence-${node.id}`}
                  />
                  <span className="text-xs w-16 text-right">
                    {node.emotionalValence < 40 ? "Negative" : node.emotionalValence > 60 ? "Positive" : "Neutral"}
                  </span>
                </div>
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
        <Type className="h-5 w-5 text-teal-400" />
        <h2 className="text-xl font-semibold">Semantic Mapping</h2>
      </div>

      <p className="text-sm opacity-80">
        Explore the personal meanings of words. Language shapes thought — understanding your 
        semantic landscape reveals how you construct reality.
      </p>

      <div className="flex flex-wrap gap-2">
        {CORE_CONCEPT_CATEGORIES.map(cat => (
          <div key={cat.id} className="rounded-lg border border-white/10 bg-black/10 px-3 py-2">
            <span className="text-sm font-medium">{cat.label}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {cat.examples.map(ex => (
                <span key={ex} className="text-xs opacity-50">{ex}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newFocus}
          onChange={(e) => setNewFocus(e.target.value)}
          placeholder="What semantic territory do you want to map?"
          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
          data-testid="input-focus"
        />
        <button
          onClick={handleCreateMap}
          disabled={!newFocus.trim()}
          className="rounded-lg bg-teal-500/20 border border-teal-500/30 px-4 py-2 disabled:opacity-40"
          data-testid="button-create-map"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {maps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Maps</h3>
          {maps.map(map => (
            <div
              key={map.id}
              className="rounded-xl border border-white/10 bg-black/10 p-4 flex items-center justify-between"
            >
              <button
                onClick={() => setActiveMap(map)}
                className="text-left flex-1"
                data-testid={`button-open-${map.id}`}
              >
                <span className="font-medium">{map.focus}</span>
                <p className="text-xs opacity-50">{map.nodes.length} words</p>
              </button>
              <button
                onClick={() => { deleteSemanticMap(map.id); setMaps(getSemanticMaps()); }}
                className="p-2 rounded hover:bg-white/10"
                data-testid={`button-delete-${map.id}`}
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
