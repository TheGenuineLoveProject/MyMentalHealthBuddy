import { useState, useEffect } from "react";
import {
  COMMON_THINKING_PATTERNS,
  COGNITIVE_AREAS,
  createThinkingPattern,
  createMentalState,
  createMetacognitiveProfile,
  saveMetacognitiveProfile,
  getMetacognitiveProfile,
  getRandomMetacognitivePrompt,
  calculateClarityTrend,
  type MetacognitiveProfile,
  type ThinkingPattern,
  type MentalState
} from "@/lib/metacognition/metacognitionDashboard";
import { Brain, Plus, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

export default function MetacognitionDashboard() {
  const [profile, setProfile] = useState<MetacognitiveProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"state" | "patterns" | "strengths">("state");
  const [prompt, setPrompt] = useState(() => getRandomMetacognitivePrompt());
  const [newPatternName, setNewPatternName] = useState("");
  const [currentState, setCurrentState] = useState<MentalState>(() => createMentalState());

  useEffect(() => {
    const stored = getMetacognitiveProfile();
    setProfile(stored || createMetacognitiveProfile());
  }, []);

  function handleRecordState() {
    if (!profile) return;
    const updated = {
      ...profile,
      mentalStates: [currentState, ...profile.mentalStates].slice(0, 100)
    };
    saveMetacognitiveProfile(updated);
    setProfile(updated);
    setCurrentState(createMentalState());
  }

  function handleAddPattern() {
    if (!profile || !newPatternName.trim()) return;
    const template = COMMON_THINKING_PATTERNS.find(p => p.name === newPatternName);
    const pattern = createThinkingPattern(
      newPatternName,
      template?.description || "A pattern you've noticed in your thinking"
    );
    const updated = {
      ...profile,
      patterns: [...profile.patterns, pattern]
    };
    saveMetacognitiveProfile(updated);
    setProfile(updated);
    setNewPatternName("");
  }

  function handleUpdatePattern(patternId: string, updates: Partial<ThinkingPattern>) {
    if (!profile) return;
    const updated = {
      ...profile,
      patterns: profile.patterns.map(p => p.id === patternId ? { ...p, ...updates } : p)
    };
    saveMetacognitiveProfile(updated);
    setProfile(updated);
  }

  function handleUpdateOptimalConditions(conditions: string) {
    if (!profile) return;
    const updated = { ...profile, optimalConditions: conditions };
    saveMetacognitiveProfile(updated);
    setProfile(updated);
  }

  if (!profile) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Metacognition Dashboard — The Genuine Love Project" description="Explore metacognition dashboard tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Metacognition Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  const clarityTrend = calculateClarityTrend(profile.mentalStates);
  const TrendIcon = clarityTrend.trend === "improving" ? TrendingUp :
    clarityTrend.trend === "declining" ? TrendingDown : Minus;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-pink-400" />
        <h2 className="text-xl font-semibold">Metacognition Dashboard</h2>
      </div>

      <p className="text-sm opacity-80">
        Observe your thinking patterns, track mental states, and understand what conditions 
        support your best cognitive work.
      </p>

      <div className="flex gap-2">
        {(["state", "patterns", "strengths"] as const).map(tab => (
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

      {activeTab === "state" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-4">Current Mental State</h3>
            <div className="space-y-4">
              {[
                { key: "clarity", label: "Clarity", color: "blue" },
                { key: "focus", label: "Focus", color: "green" },
                { key: "creativity", label: "Creativity", color: "purple" },
                { key: "energy", label: "Energy", color: "amber" },
                { key: "anxiety", label: "Anxiety (lower is calmer)", color: "red" }
              ].map(({ key, label, color }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm opacity-70">{label}</span>
                    <span className="text-sm">{(currentState as any)[key]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentState as any)[key]}
                    onChange={(e) => setCurrentState({ ...currentState, [key]: parseInt(e.target.value) })}
                    className="w-full"
                    data-testid={`slider-${key}`}
                  />
                </div>
              ))}
              <textarea
                value={currentState.notes || ""}
                onChange={(e) => setCurrentState({ ...currentState, notes: e.target.value })}
                placeholder="Any context for this state?"
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[60px] text-sm"
                data-testid="input-state-notes"
              />
              <button
                onClick={handleRecordState}
                className="rounded-lg bg-pink-500/20 border border-pink-500/30 px-4 py-2 text-sm"
                data-testid="button-record-state"
              >
                Record State
              </button>
            </div>
          </div>

          {profile.mentalStates.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-black/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Clarity Trend</h3>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`h-4 w-4 ${
                    clarityTrend.trend === "improving" ? "text-green-400" :
                    clarityTrend.trend === "declining" ? "text-red-400" : "text-white/50"
                  }`} />
                  <span className="text-sm">{clarityTrend.average}% avg</span>
                </div>
              </div>
              <div className="flex gap-1">
                {profile.mentalStates.slice(0, 14).map((state, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded"
                    style={{
                      height: `${state.clarity}px`,
                      maxHeight: "60px",
                      backgroundColor: `hsl(200, 70%, ${30 + state.clarity * 0.4}%)`
                    }}
                    title={`Clarity: ${state.clarity}%`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "patterns" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Reflection Prompt</span>
              <button
                onClick={() => setPrompt(getRandomMetacognitivePrompt())}
                className="p-1.5 rounded-lg hover:bg-white/10"
                data-testid="button-new-prompt"
              >
                <RefreshCw className="h-4 w-4 opacity-60" />
              </button>
            </div>
            <p className="text-sm italic">{prompt}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Track a Thinking Pattern</h3>
            <select
              value={newPatternName}
              onChange={(e) => setNewPatternName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm mb-2"
              data-testid="select-pattern"
            >
              <option value="">Select a pattern...</option>
              {COMMON_THINKING_PATTERNS.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={handleAddPattern}
              disabled={!newPatternName}
              className="rounded-lg bg-pink-500/20 border border-pink-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-add-pattern"
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Track Pattern
            </button>
          </div>

          {profile.patterns.map(pattern => (
            <div key={pattern.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{pattern.name}</span>
                <select
                  value={pattern.helpfulness}
                  onChange={(e) => handleUpdatePattern(pattern.id, { helpfulness: e.target.value as ThinkingPattern["helpfulness"] })}
                  className="rounded border border-white/10 bg-black/20 px-2 py-1 text-xs"
                  data-testid={`select-helpfulness-${pattern.id}`}
                >
                  <option value="helpful">Helpful</option>
                  <option value="mixed">Mixed</option>
                  <option value="unhelpful">Unhelpful</option>
                </select>
              </div>
              <p className="text-sm opacity-70">{pattern.description}</p>
              <div className="mt-2">
                <label className="text-xs opacity-50 block mb-1">Frequency: {pattern.frequency}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pattern.frequency}
                  onChange={(e) => handleUpdatePattern(pattern.id, { frequency: parseInt(e.target.value) })}
                  className="w-full"
                  data-testid={`slider-frequency-${pattern.id}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "strengths" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Optimal Conditions</h3>
            <p className="text-sm opacity-70 mb-2">
              When do you think most clearly? What conditions support your best work?
            </p>
            <textarea
              value={profile.optimalConditions}
              onChange={(e) => handleUpdateOptimalConditions(e.target.value)}
              placeholder="Morning, after exercise, quiet environment, etc."
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[100px] text-sm"
              data-testid="input-optimal-conditions"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-70">Cognitive Areas</h3>
            <div className="flex flex-wrap gap-2">
              {COGNITIVE_AREAS.map(area => (
                <span key={area} className="rounded-full px-3 py-1 text-xs bg-white/10">
                  {area}
                </span>
              ))}
            </div>
            <p className="text-xs opacity-50">
              Reflect on which areas feel strongest for you. Track evidence over time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
