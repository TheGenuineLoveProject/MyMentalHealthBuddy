import { useState, useEffect } from "react";
import {
  LOGICAL_FALLACIES,
  NODE_PROMPTS,
  createLogicNode,
  createLogicSession,
  saveLogicSession,
  getLogicSessions,
  deleteLogicSession,
  analyzeArgumentStrength,
  type LogicNode,
  type LogicSession
} from "@/lib/logic/logicLatticeLab";
import { Network, Plus, Trash2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NODE_COLORS: Record<LogicNode["type"], string> = {
  claim: "border-blue-500/30 bg-blue-500/10",
  premise: "border-purple-500/30 bg-purple-500/10",
  evidence: "border-green-500/30 bg-green-500/10",
  counter: "border-amber-500/30 bg-amber-500/10",
  inference: "border-teal-500/30 bg-teal-500/10"
};

export default function LogicLatticeLab() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<LogicSession[]>([]);
  const [activeSession, setActiveSession] = useState<LogicSession | null>(null);
  const [showFallacies, setShowFallacies] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    setSessions(getLogicSessions());
  }, []);

  function handleCreateSession() {
    if (!newTopic.trim()) return;
    const session = createLogicSession(newTopic);
    session.nodes.push(createLogicNode("claim"));
    saveLogicSession(session);
    setActiveSession(session);
    setSessions(getLogicSessions());
    setNewTopic("");
  }

  function handleAddNode(type: LogicNode["type"]) {
    if (!activeSession) return;
    const updated = {
      ...activeSession,
      nodes: [...activeSession.nodes, createLogicNode(type)]
    };
    saveLogicSession(updated);
    setActiveSession(updated);
  }

  function handleUpdateNode(nodeId: string, updates: Partial<LogicNode>) {
    if (!activeSession) return;
    const updated = {
      ...activeSession,
      nodes: activeSession.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n)
    };
    saveLogicSession(updated);
    setActiveSession(updated);
  }

  function handleDeleteNode(nodeId: string) {
    if (!activeSession) return;
    const updated = {
      ...activeSession,
      nodes: activeSession.nodes.filter(n => n.id !== nodeId)
    };
    saveLogicSession(updated);
    setActiveSession(updated);
  }

  function handleDeleteSession(id: string) {
    deleteLogicSession(id);
    setSessions(getLogicSessions());
    if (activeSession?.id === id) setActiveSession(null);
  }

  if (activeSession) {
    const analysis = analyzeArgumentStrength(activeSession.nodes);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeSession.topic}</h2>
            <p className="text-sm opacity-60">{activeSession.nodes.length} nodes</p>
          </div>
          <button
            onClick={() => { setSessions(getLogicSessions()); setActiveSession(null); }}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-logic"
          >
            Exit
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["claim", "premise", "evidence", "counter", "inference"] as const).map(type => (
            <button
              key={type}
              onClick={() => handleAddNode(type)}
              className={`rounded-lg px-3 py-1.5 text-xs capitalize border ${NODE_COLORS[type]}`}
              data-testid={`button-add-${type}`}
            >
              + {type}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activeSession.nodes.map(node => (
            <div key={node.id} className={`rounded-xl border p-4 ${NODE_COLORS[node.type]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase opacity-70">{node.type}</span>
                <button
                  onClick={() => handleDeleteNode(node.id)}
                  className="p-1 rounded hover:bg-white/10"
                  data-testid={`button-delete-node-${node.id}`}
                >
                  <Trash2 className="h-3 w-3 opacity-60" />
                </button>
              </div>
              <p className="text-xs opacity-50 mb-2">{NODE_PROMPTS[node.type]}</p>
              <textarea
                value={node.text}
                onChange={(e) => handleUpdateNode(node.id, { text: e.target.value })}
                placeholder="Enter your reasoning..."
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[80px] text-sm"
                data-testid={`input-node-${node.id}`}
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs opacity-60">Confidence:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={node.confidence}
                  onChange={(e) => handleUpdateNode(node.id, { confidence: parseInt(e.target.value) })}
                  className="flex-1"
                  data-testid={`input-confidence-${node.id}`}
                />
                <span className="text-xs w-8">{node.confidence}%</span>
              </div>
            </div>
          ))}
        </div>

        {activeSession.nodes.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-2">Argument Analysis</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm opacity-60">Structure Score:</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${analysis.score}%` }} />
              </div>
              <span className="text-sm">{analysis.score}%</span>
            </div>
            {analysis.observations.length > 0 && (
              <ul className="text-sm opacity-70 space-y-1">
                {analysis.observations.map((obs, i) => (
                  <li key={i}>• {obs}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          onClick={() => setShowFallacies(!showFallacies)}
          className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
          data-testid="button-toggle-fallacies"
        >
          <AlertTriangle className="h-4 w-4" />
          Fallacy Reference
          {showFallacies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showFallacies && (
          <div className="grid gap-2 sm:grid-cols-2">
            {LOGICAL_FALLACIES.map(f => (
              <div key={f.id} className="rounded-lg border border-white/10 bg-black/10 p-3 text-sm">
                <span className="font-medium">{f.name}</span>
                <p className="text-xs opacity-60 mt-1">{f.description}</p>
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
        <Network className="h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-semibold">Logic Lattice Lab</h2>
      </div>

      <p className="text-sm opacity-80">
        Map arguments visually — claims, premises, evidence, and counter-arguments. 
        Not to win debates, but to see your thinking more clearly.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="What argument or position do you want to explore?"
          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
          data-testid="input-logic-topic"
        />
        <button
          onClick={handleCreateSession}
          disabled={!newTopic.trim()}
          className="rounded-lg bg-blue-500/20 border border-blue-500/30 px-4 py-2 disabled:opacity-40"
          data-testid="button-create-logic"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {sessions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Sessions</h3>
          {sessions.map(session => (
            <div
              key={session.id}
              className="rounded-xl border border-white/10 bg-black/10 p-4 flex items-center justify-between"
            >
              <button
                onClick={() => setActiveSession(session)}
                className="text-left flex-1"
                data-testid={`button-open-${session.id}`}
              >
                <span className="font-medium">{session.topic}</span>
                <p className="text-xs opacity-50">{session.nodes.length} nodes</p>
              </button>
              <button
                onClick={() => handleDeleteSession(session.id)}
                className="p-2 rounded hover:bg-white/10"
                data-testid={`button-delete-${session.id}`}
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
