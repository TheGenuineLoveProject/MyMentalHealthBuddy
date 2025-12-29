import { useState, useEffect } from "react";
import { Scale, Plus, ChevronRight, Lightbulb } from "lucide-react";
import {
  MoralDilemma, MoralFramework,
  MORAL_FRAMEWORKS, CLASSIC_DILEMMAS,
  loadMoralDilemmas, saveMoralDilemmas
} from "@/lib/moral/moralReasoning";

export default function MoralReasoningLab() {
  const [dilemmas, setDilemmas] = useState<MoralDilemma[]>(() => loadMoralDilemmas());
  const [activeTab, setActiveTab] = useState<"frameworks" | "practice" | "mine">("frameworks");
  const [selectedFramework, setSelectedFramework] = useState<MoralFramework>("consequentialism");
  const [currentDilemma, setCurrentDilemma] = useState<typeof CLASSIC_DILEMMAS[number] | null>(null);
  const [reasoning, setReasoning] = useState("");

  useEffect(() => {
    saveMoralDilemmas(dilemmas);
  }, [dilemmas]);

  const saveReasoning = () => {
    if (!currentDilemma || !reasoning.trim()) return;
    
    const newDilemma: MoralDilemma = {
      id: crypto.randomUUID(),
      title: currentDilemma.title,
      description: currentDilemma.description,
      stakeholders: [...currentDilemma.stakeholders],
      considerations: [],
      reasoning: reasoning,
      decision: "",
      framework: selectedFramework,
      confidence: 3,
      timestamp: new Date().toISOString()
    };
    
    setDilemmas(d => [...d, newDilemma]);
    setReasoning("");
    setCurrentDilemma(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scale className="h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-semibold">Moral Reasoning Lab</h2>
      </div>

      <p className="text-sm opacity-70">
        Explore ethical frameworks and practice reasoning through dilemmas — not to tell you what's right, but to help you think more clearly about difficult choices.
      </p>

      <div className="flex gap-2">
        {(["frameworks", "practice", "mine"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "frameworks" && "Ethical Frameworks"}
            {tab === "practice" && "Practice Dilemmas"}
            {tab === "mine" && `My Reasoning (${dilemmas.length})`}
          </button>
        ))}
      </div>

      {activeTab === "frameworks" && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(MORAL_FRAMEWORKS) as MoralFramework[]).map(key => {
              const framework = MORAL_FRAMEWORKS[key];
              const isSelected = selectedFramework === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFramework(key)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected ? "border-blue-500/30 bg-blue-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                  data-testid={`button-framework-${key}`}
                >
                  <h4 className="font-medium text-sm">{framework.name}</h4>
                  <p className="text-xs opacity-60 mt-1">{framework.description}</p>
                </button>
              );
            })}
          </div>

          {selectedFramework && (
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
              <h3 className="font-semibold">{MORAL_FRAMEWORKS[selectedFramework].name}</h3>
              
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm italic">"{MORAL_FRAMEWORKS[selectedFramework].question}"</p>
              </div>
              
              <p className="text-sm opacity-80">{MORAL_FRAMEWORKS[selectedFramework].description}</p>
              
              <div>
                <span className="text-xs opacity-60">Key thinkers: </span>
                <span className="text-xs">{MORAL_FRAMEWORKS[selectedFramework].thinkers.join(", ")}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "practice" && (
        <div className="space-y-4">
          {!currentDilemma ? (
            <>
              <p className="text-sm opacity-70">Select a dilemma to practice reasoning through:</p>
              <div className="grid gap-3">
                {CLASSIC_DILEMMAS.map((dilemma, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentDilemma(dilemma)}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 text-left hover:bg-white/10 transition-all"
                    data-testid={`button-dilemma-${i}`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">{dilemma.title}</h4>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </div>
                    <p className="text-xs opacity-60 mt-1">{dilemma.description}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h3 className="font-semibold">{currentDilemma.title}</h3>
                <p className="text-sm opacity-80 mt-2">{currentDilemma.description}</p>
                
                <div className="mt-3">
                  <span className="text-xs opacity-60">Stakeholders: </span>
                  <span className="text-xs">{currentDilemma.stakeholders.join(", ")}</span>
                </div>
              </div>

              <div>
                <label className="text-sm opacity-70 block mb-2">
                  Using {MORAL_FRAMEWORKS[selectedFramework].name}: {MORAL_FRAMEWORKS[selectedFramework].question}
                </label>
                <textarea
                  value={reasoning}
                  onChange={e => setReasoning(e.target.value)}
                  placeholder="Work through your reasoning here..."
                  className="w-full h-32 p-3 rounded-xl border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-reasoning"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setCurrentDilemma(null); setReasoning(""); }}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={saveReasoning}
                  disabled={!reasoning.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm disabled:opacity-50"
                  data-testid="button-save-reasoning"
                >
                  Save Reasoning
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "mine" && (
        <div className="space-y-3">
          {dilemmas.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              No reasoning saved yet. Practice with some dilemmas to build your library.
            </p>
          ) : (
            dilemmas.slice().reverse().map(dilemma => (
              <div key={dilemma.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{dilemma.title}</h4>
                  <span className="text-xs opacity-50">{MORAL_FRAMEWORKS[dilemma.framework].name}</span>
                </div>
                <p className="text-xs opacity-70">{dilemma.reasoning}</p>
                <p className="text-xs opacity-40">
                  {new Date(dilemma.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          Ethical reasoning is practice, not prescription. These frameworks are tools, not answers.
        </p>
      </footer>
    </div>
  );
}
