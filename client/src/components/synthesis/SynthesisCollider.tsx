import { useState, useEffect } from "react";
import {
  SYNTHESIS_LENSES,
  ARTIFACT_TYPES,
  createColliderArtifact,
  createColliderBlend,
  createColliderSession,
  saveColliderSession,
  getColliderSessions,
  deleteColliderSession,
  getRandomLens,
  generateCombinationPrompt,
  type ColliderArtifact,
  type ColliderBlend,
  type ColliderSession
} from "@/lib/synthesis/synthesisCollider";
import { Zap, Plus, Trash2, Shuffle, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function SynthesisCollider() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ColliderSession[]>([]);
  const [activeSession, setActiveSession] = useState<ColliderSession | null>(null);
  const [newIntent, setNewIntent] = useState("");
  const [artifactType, setArtifactType] = useState<ColliderArtifact["sourceType"]>("concept");
  const [artifactLabel, setArtifactLabel] = useState("");
  const [artifactPayload, setArtifactPayload] = useState("");
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);
  const [selectedLens, setSelectedLens] = useState(SYNTHESIS_LENSES[0]);
  const [blendNarrative, setBlendNarrative] = useState("");

  useEffect(() => {
    setSessions(getColliderSessions());
  }, []);

  function handleCreateSession() {
    if (!newIntent.trim()) return;
    const session = createColliderSession(newIntent);
    saveColliderSession(session);
    setActiveSession(session);
    setSessions(getColliderSessions());
    setNewIntent("");
  }

  function handleAddArtifact() {
    if (!activeSession || !artifactLabel.trim()) return;
    const artifact = createColliderArtifact(artifactType, artifactLabel, artifactPayload);
    const updated = { ...activeSession, artifacts: [...activeSession.artifacts, artifact] };
    saveColliderSession(updated);
    setActiveSession(updated);
    setArtifactLabel("");
    setArtifactPayload("");
  }

  function handleToggleArtifactSelection(id: string) {
    if (selectedArtifacts.includes(id)) {
      setSelectedArtifacts(selectedArtifacts.filter(a => a !== id));
    } else if (selectedArtifacts.length < 4) {
      setSelectedArtifacts([...selectedArtifacts, id]);
    }
  }

  function handleCreateBlend() {
    if (!activeSession || selectedArtifacts.length < 2 || !blendNarrative.trim()) return;
    const blend = createColliderBlend(selectedArtifacts, selectedLens.id);
    blend.narrative = blendNarrative;
    const updated = { ...activeSession, blends: [...activeSession.blends, blend] };
    saveColliderSession(updated);
    setActiveSession(updated);
    setSelectedArtifacts([]);
    setBlendNarrative("");
    toast({ title: "Synthesis created" });
  }

  function handleDeleteArtifact(id: string) {
    if (!activeSession) return;
    const updated = {
      ...activeSession,
      artifacts: activeSession.artifacts.filter(a => a.id !== id)
    };
    saveColliderSession(updated);
    setActiveSession(updated);
    setSelectedArtifacts(selectedArtifacts.filter(a => a !== id));
  }

  if (activeSession) {
    const selectedArtifactObjects = activeSession.artifacts.filter(a => selectedArtifacts.includes(a.id));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeSession.intent}</h2>
            <p className="text-sm opacity-60">
              {activeSession.artifacts.length} artifacts • {activeSession.blends.length} syntheses
            </p>
          </div>
          <button
            onClick={() => { setSessions(getColliderSessions()); setActiveSession(null); }}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-collider"
          >
            Exit
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <h3 className="font-medium mb-3">Add Artifact</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {ARTIFACT_TYPES.map(at => (
              <button
                key={at.type}
                onClick={() => setArtifactType(at.type)}
                className={`rounded px-2 py-1 text-xs ${artifactType === at.type ? "bg-white/20" : "bg-white/5"}`}
                data-testid={`button-type-${at.type}`}
              >
                {at.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={artifactLabel}
            onChange={(e) => setArtifactLabel(e.target.value)}
            placeholder="Give it a name..."
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 mb-2 text-sm"
            data-testid="input-artifact-label"
          />
          <textarea
            value={artifactPayload}
            onChange={(e) => setArtifactPayload(e.target.value)}
            placeholder={ARTIFACT_TYPES.find(t => t.type === artifactType)?.placeholder}
            className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[80px] text-sm mb-2"
            data-testid="input-artifact-payload"
          />
          <button
            onClick={handleAddArtifact}
            disabled={!artifactLabel.trim()}
            className="rounded-lg bg-orange-500/20 border border-orange-500/30 px-4 py-2 text-sm disabled:opacity-40"
            data-testid="button-add-artifact"
          >
            Add Artifact
          </button>
        </div>

        {activeSession.artifacts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-70">
              Select 2-4 artifacts to collide ({selectedArtifacts.length} selected)
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeSession.artifacts.map(artifact => (
                <button
                  key={artifact.id}
                  onClick={() => handleToggleArtifactSelection(artifact.id)}
                  className={`rounded-lg border px-3 py-2 text-sm flex items-center gap-2 ${
                    selectedArtifacts.includes(artifact.id)
                      ? "border-orange-500/30 bg-orange-500/10"
                      : "border-white/10 bg-black/10"
                  }`}
                  data-testid={`button-select-${artifact.id}`}
                >
                  <span className="text-xs opacity-50 uppercase">{artifact.sourceType[0]}</span>
                  {artifact.label}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteArtifact(artifact.id); }}
                    className="p-1 rounded hover:bg-white/10"
                    data-testid={`button-delete-${artifact.id}`}
                  >
                    <Trash2 className="h-3 w-3 opacity-60" />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedArtifacts.length >= 2 && (
          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-400" />
                <span className="font-medium">Collision Chamber</span>
              </div>
              <button
                onClick={() => setSelectedLens(getRandomLens())}
                className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
                data-testid="button-random-lens"
              >
                <Shuffle className="h-4 w-4" />
                Random Lens
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {SYNTHESIS_LENSES.map(lens => (
                <button
                  key={lens.id}
                  onClick={() => setSelectedLens(lens)}
                  className={`rounded px-2 py-1 text-xs ${selectedLens.id === lens.id ? "bg-white/20" : "bg-white/5"}`}
                  data-testid={`button-lens-${lens.id}`}
                >
                  {lens.name}
                </button>
              ))}
            </div>

            <p className="text-sm italic opacity-80 mb-3">{selectedLens.prompt}</p>

            <textarea
              value={blendNarrative}
              onChange={(e) => setBlendNarrative(e.target.value)}
              placeholder="What emerges when you combine these through this lens?"
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[120px] text-sm mb-3"
              data-testid="input-blend-narrative"
            />

            <button
              onClick={handleCreateBlend}
              disabled={!blendNarrative.trim()}
              className="flex items-center gap-2 rounded-lg bg-orange-500/20 border border-orange-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-create-blend"
            >
              <Sparkles className="h-4 w-4" />
              Create Synthesis
            </button>
          </div>
        )}

        {activeSession.blends.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-70">Your Syntheses</h3>
            {activeSession.blends.map((blend, idx) => {
              const lens = SYNTHESIS_LENSES.find(l => l.id === blend.lens);
              return (
                <div key={blend.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{lens?.name}</span>
                    <span className="text-xs opacity-50">{blend.artifactIds.length} artifacts</span>
                  </div>
                  <p className="text-sm">{blend.narrative}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-orange-400" />
        <h2 className="text-xl font-semibold">Synthesis Collider</h2>
      </div>

      <p className="text-sm opacity-80">
        Collect ideas, experiences, and concepts. Then collide them through different lenses 
        to see what new insights emerge.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={newIntent}
          onChange={(e) => setNewIntent(e.target.value)}
          placeholder="What do you want to synthesize toward?"
          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
          data-testid="input-collider-intent"
        />
        <button
          onClick={handleCreateSession}
          disabled={!newIntent.trim()}
          className="rounded-lg bg-orange-500/20 border border-orange-500/30 px-4 py-2 disabled:opacity-40"
          data-testid="button-create-collider"
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
                <span className="font-medium">{session.intent}</span>
                <p className="text-xs opacity-50">
                  {session.artifacts.length} artifacts • {session.blends.length} syntheses
                </p>
              </button>
              <button
                onClick={() => { deleteColliderSession(session.id); setSessions(getColliderSessions()); }}
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
