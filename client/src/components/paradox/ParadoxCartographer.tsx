import { useState, useEffect } from "react";
import {
  PARADOX_TEMPLATES,
  createParadoxSession,
  createParadoxEntry,
  getRandomThirdHorizonPrompt,
  saveParadoxSession,
  getParadoxSessions,
  deleteParadoxSession,
  type ParadoxSession
} from "@/lib/paradox/paradoxCartographer";
import { Compass, Plus, Trash2, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ParadoxCartographer() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ParadoxSession[]>([]);
  const [activeSession, setActiveSession] = useState<ParadoxSession | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newObservation, setNewObservation] = useState("");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [thirdHorizonPrompt, setThirdHorizonPrompt] = useState(() => getRandomThirdHorizonPrompt());
  const [newSynthesis, setNewSynthesis] = useState("");

  useEffect(() => {
    setSessions(getParadoxSessions());
  }, []);

  function handleStartTemplate(idx: number) {
    const template = PARADOX_TEMPLATES[idx];
    const session = createParadoxSession(template.theme, template.axisX, template.axisY);
    saveParadoxSession(session);
    setActiveSession(session);
    setSessions(getParadoxSessions());
    setShowTemplates(false);
  }

  function handleAddEntry() {
    if (!activeSession || !newObservation.trim()) return;
    const entry = createParadoxEntry(position.x, position.y, newObservation);
    const updated = { ...activeSession, entries: [...activeSession.entries, entry] };
    saveParadoxSession(updated);
    setActiveSession(updated);
    setNewObservation("");
  }

  function handleUpdateThirdHorizon(notes: string) {
    if (!activeSession) return;
    const updated = { ...activeSession, thirdHorizonNotes: notes };
    saveParadoxSession(updated);
    setActiveSession(updated);
  }

  function handleAddSynthesis(synthesis: string) {
    if (!activeSession || !synthesis.trim()) return;
    const updated = {
      ...activeSession,
      synthesisAttempts: [...activeSession.synthesisAttempts, synthesis]
    };
    saveParadoxSession(updated);
    setActiveSession(updated);
  }

  if (activeSession) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeSession.theme}</h2>
            <p className="text-sm opacity-60">{activeSession.entries.length} observations</p>
          </div>
          <button
            onClick={() => { setSessions(getParadoxSessions()); setActiveSession(null); }}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-paradox"
          >
            Exit
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-4 relative" style={{ minHeight: "300px" }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs opacity-50">
            {activeSession.axisY.spectrum[1]}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs opacity-50">
            {activeSession.axisY.spectrum[0]}
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs opacity-50">
            {activeSession.axisX.spectrum[0]}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-50">
            {activeSession.axisX.spectrum[1]}
          </div>

          <div className="absolute inset-8 border border-white/5 rounded-lg">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
            
            {activeSession.entries.map((entry, idx) => (
              <div
                key={entry.id}
                className="absolute w-3 h-3 rounded-full bg-purple-500 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${entry.position.x}%`, top: `${100 - entry.position.y}%` }}
                title={entry.observation}
                data-testid={`entry-${idx}`}
              />
            ))}
            
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-amber-400 bg-amber-400/30 -translate-x-1/2 -translate-y-1/2 cursor-move"
              style={{ left: `${position.x}%`, top: `${100 - position.y}%` }}
              data-testid="position-marker"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs opacity-60 block mb-1">
              {activeSession.axisX.label}: {position.x}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={position.x}
              onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value) })}
              className="w-full"
              data-testid="slider-x"
            />
          </div>
          <div>
            <label className="text-xs opacity-60 block mb-1">
              {activeSession.axisY.label}: {position.y}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={position.y}
              onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value) })}
              className="w-full"
              data-testid="slider-y"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newObservation}
            onChange={(e) => setNewObservation(e.target.value)}
            placeholder="What do you notice at this position?"
            className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            data-testid="input-observation"
          />
          <button
            onClick={handleAddEntry}
            disabled={!newObservation.trim()}
            className="rounded-lg bg-purple-500/20 border border-purple-500/30 px-4 disabled:opacity-40"
            data-testid="button-add-entry"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="font-medium">Third Horizon</span>
            </div>
            <button
              onClick={() => setThirdHorizonPrompt(getRandomThirdHorizonPrompt())}
              className="p-1.5 rounded-lg hover:bg-white/10"
              data-testid="button-new-prompt"
            >
              <RefreshCw className="h-4 w-4 opacity-60" />
            </button>
          </div>
          <p className="text-sm italic mb-3">{thirdHorizonPrompt}</p>
          <textarea
            value={activeSession.thirdHorizonNotes}
            onChange={(e) => handleUpdateThirdHorizon(e.target.value)}
            placeholder="What emerges when you hold both poles?"
            className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[100px] text-sm"
            data-testid="input-third-horizon"
          />
        </div>

        {activeSession.entries.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-70">Your Observations</h3>
            {activeSession.entries.map((entry, idx) => (
              <div key={entry.id} className="rounded-lg border border-white/10 bg-black/10 p-3 text-sm">
                <span className="opacity-50">({entry.position.x}%, {entry.position.y}%)</span> {entry.observation}
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-5">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-purple-400" />
            <span className="font-medium">Synthesis Attempts</span>
          </div>
          <p className="text-sm opacity-60 mb-3">
            Try to articulate how these opposites might coexist or what emerges from their tension.
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSynthesis}
              onChange={(e) => setNewSynthesis(e.target.value)}
              placeholder="What synthesis emerges from this paradox?"
              className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
              data-testid="input-synthesis"
            />
            <button
              onClick={() => {
                handleAddSynthesis(newSynthesis);
                setNewSynthesis("");
              }}
              disabled={!newSynthesis.trim()}
              className="rounded-lg bg-purple-500/20 border border-purple-500/30 px-4 disabled:opacity-40"
              data-testid="button-add-synthesis"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {activeSession.synthesisAttempts.length > 0 && (
            <div className="space-y-2">
              {activeSession.synthesisAttempts.map((s, idx) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-black/10 p-3 text-sm">
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Compass className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold">Paradox Cartographer</h2>
      </div>

      <p className="text-sm opacity-80">
        Map the tensions you hold — not to resolve them, but to see them more clearly. 
        Sometimes wisdom lives in the paradox itself.
      </p>

      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className="flex items-center gap-2 text-sm rounded-lg border border-white/10 px-4 py-2 hover:bg-white/5"
        data-testid="button-toggle-templates"
      >
        <Plus className="h-4 w-4" />
        Explore a Paradox
      </button>

      {showTemplates && (
        <div className="grid gap-3 sm:grid-cols-2">
          {PARADOX_TEMPLATES.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleStartTemplate(idx)}
              className="rounded-xl border border-white/10 bg-black/10 p-4 text-left hover:bg-white/5"
              data-testid={`button-template-${idx}`}
            >
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm opacity-70 mt-1">{template.theme}</p>
              <p className="text-xs opacity-50 mt-2">
                {template.axisX.spectrum[0]} ↔ {template.axisX.spectrum[1]}
              </p>
            </button>
          ))}
        </div>
      )}

      {sessions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Maps</h3>
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
                <span className="font-medium">{session.theme}</span>
                <p className="text-xs opacity-50">{session.entries.length} observations</p>
              </button>
              <button
                onClick={() => { deleteParadoxSession(session.id); setSessions(getParadoxSessions()); }}
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
