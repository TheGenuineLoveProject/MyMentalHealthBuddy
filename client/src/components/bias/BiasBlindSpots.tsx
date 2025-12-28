import { useState, useEffect } from "react";
import {
  COGNITIVE_BIASES,
  BIAS_CATEGORIES,
  createBiasIncident,
  createBiasAwarenessProfile,
  saveBiasAwarenessProfile,
  getBiasAwarenessProfile,
  getBiasById,
  getRandomDebiasingPrompt,
  getMostFrequentBiases,
  type BiasAwarenessProfile,
  type CognitiveBias
} from "@/lib/bias/biasBlindSpots";
import { Eye, RefreshCw, AlertTriangle } from "lucide-react";

export default function BiasBlindSpots() {
  const [profile, setProfile] = useState<BiasAwarenessProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"learn" | "track" | "reflect">("learn");
  const [selectedCategory, setSelectedCategory] = useState<CognitiveBias["category"] | null>(null);
  const [selectedBias, setSelectedBias] = useState<CognitiveBias | null>(null);
  const [incidentSituation, setIncidentSituation] = useState("");
  const [incidentNotice, setIncidentNotice] = useState("");
  const [debiasingPrompt, setDebiasingPrompt] = useState(() => getRandomDebiasingPrompt());

  useEffect(() => {
    const stored = getBiasAwarenessProfile();
    setProfile(stored || createBiasAwarenessProfile());
  }, []);

  function handleRecordIncident() {
    if (!profile || !selectedBias || !incidentSituation.trim() || !incidentNotice.trim()) return;
    const incident = createBiasIncident(selectedBias.id, incidentSituation, incidentNotice);
    const updated = {
      ...profile,
      incidents: [incident, ...profile.incidents]
    };
    saveBiasAwarenessProfile(updated);
    setProfile(updated);
    setIncidentSituation("");
    setIncidentNotice("");
    setSelectedBias(null);
  }

  function handleUpdateReflection(notes: string) {
    if (!profile) return;
    const updated = { ...profile, reflectionNotes: notes };
    saveBiasAwarenessProfile(updated);
    setProfile(updated);
  }

  if (!profile) return null;

  const filteredBiases = selectedCategory
    ? COGNITIVE_BIASES.filter(b => b.category === selectedCategory)
    : COGNITIVE_BIASES;

  const frequentBiases = getMostFrequentBiases(profile.incidents);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5 text-rose-400" />
        <h2 className="text-xl font-semibold">Bias Blind Spots</h2>
      </div>

      <p className="text-sm opacity-80">
        We all have cognitive biases — systematic errors in thinking. The goal isn't to eliminate them, 
        but to notice them and account for them.
      </p>

      <div className="flex gap-2">
        {(["learn", "track", "reflect"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${activeTab === tab ? "bg-white/20" : "bg-white/5"}`}
            data-testid={`button-tab-${tab}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "learn" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-lg px-3 py-1.5 text-xs ${!selectedCategory ? "bg-white/20" : "bg-white/5"}`}
              data-testid="button-category-all"
            >
              All
            </button>
            {BIAS_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs ${selectedCategory === cat.id ? "bg-white/20" : "bg-white/5"}`}
                data-testid={`button-category-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            {filteredBiases.map(bias => (
              <div key={bias.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{bias.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 capitalize">{bias.category}</span>
                  </div>
                </div>
                <p className="text-sm opacity-80 mb-2">{bias.description}</p>
                <p className="text-xs opacity-60 italic mb-2">Example: {bias.example}</p>
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-2">
                  <span className="text-xs font-medium text-green-400">Debiasing: </span>
                  <span className="text-xs opacity-80">{bias.debiasing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "track" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Record a Bias Sighting</h3>
            <select
              value={selectedBias?.id || ""}
              onChange={(e) => setSelectedBias(getBiasById(e.target.value) || null)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm mb-3"
              data-testid="select-bias"
            >
              <option value="">Select a bias...</option>
              {COGNITIVE_BIASES.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <textarea
              value={incidentSituation}
              onChange={(e) => setIncidentSituation(e.target.value)}
              placeholder="What was the situation?"
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[60px] text-sm mb-2"
              data-testid="input-situation"
            />
            <textarea
              value={incidentNotice}
              onChange={(e) => setIncidentNotice(e.target.value)}
              placeholder="How did you notice it?"
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[60px] text-sm mb-3"
              data-testid="input-notice"
            />
            <button
              onClick={handleRecordIncident}
              disabled={!selectedBias || !incidentSituation.trim() || !incidentNotice.trim()}
              className="rounded-lg bg-rose-500/20 border border-rose-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-record-incident"
            >
              Record Incident
            </button>
          </div>

          {frequentBiases.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span className="font-medium">Most Frequent for You</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {frequentBiases.map(({ biasId, count }) => {
                  const bias = getBiasById(biasId);
                  return (
                    <span key={biasId} className="text-sm px-2 py-1 rounded-full bg-white/10">
                      {bias?.name} ({count})
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {profile.incidents.slice(0, 5).map(incident => {
            const bias = getBiasById(incident.biasId);
            return (
              <div key={incident.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
                <span className="text-sm font-medium">{bias?.name}</span>
                <p className="text-sm opacity-70 mt-1">{incident.situation}</p>
                <p className="text-xs opacity-50 mt-1">Noticed: {incident.howNoticed}</p>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "reflect" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Debiasing Prompt</span>
              <button
                onClick={() => setDebiasingPrompt(getRandomDebiasingPrompt())}
                className="p-1.5 rounded-lg hover:bg-white/10"
                data-testid="button-new-prompt"
              >
                <RefreshCw className="h-4 w-4 opacity-60" />
              </button>
            </div>
            <p className="text-sm italic">{debiasingPrompt}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Reflection Notes</h3>
            <p className="text-sm opacity-70 mb-2">
              What patterns have you noticed in your biases? What helps you catch them?
            </p>
            <textarea
              value={profile.reflectionNotes}
              onChange={(e) => handleUpdateReflection(e.target.value)}
              placeholder="Your ongoing reflections on bias awareness..."
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[150px] text-sm"
              data-testid="input-reflection"
            />
          </div>

          <div className="text-center p-4 rounded-xl border border-white/5 bg-white/5">
            <p className="text-sm opacity-60">
              "The first principle is that you must not fool yourself — and you are the easiest person to fool."
            </p>
            <p className="text-xs opacity-40 mt-1">— Richard Feynman</p>
          </div>
        </div>
      )}
    </div>
  );
}
