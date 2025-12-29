import { useState, useEffect } from "react";
import { Lightbulb, Shuffle, ChevronRight, Plus } from "lucide-react";
import {
  CreativeProfile, CreativeProblem, Idea,
  CREATIVE_TECHNIQUES,
  loadCreativeProfile, saveCreativeProfile
} from "@/lib/creative/creativeProblemSolving";

export default function CreativeProblemSolver() {
  const [profile, setProfile] = useState<CreativeProfile>(() => loadCreativeProfile());
  const [activeTab, setActiveTab] = useState<"techniques" | "session" | "history">("techniques");
  const [activeTechnique, setActiveTechnique] = useState<string>("SCAMPER");
  const [problem, setProblem] = useState({ title: "", description: "" });
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState("");

  useEffect(() => {
    saveCreativeProfile(profile);
  }, [profile]);

  const divergentTechnique = CREATIVE_TECHNIQUES.divergent.find(t => t.name === activeTechnique);
  const convergentTechnique = CREATIVE_TECHNIQUES.convergent.find(t => t.name === activeTechnique);
  const currentTechnique = divergentTechnique || convergentTechnique;

  const addIdea = () => {
    if (!newIdea.trim()) return;
    const idea: Idea = {
      id: crypto.randomUUID(),
      description: newIdea,
      technique: activeTechnique,
      feasibility: 3,
      novelty: 3,
      appeal: 3,
      notes: ""
    };
    setIdeas([...ideas, idea]);
    setNewIdea("");
  };

  const saveProblem = () => {
    if (!problem.title.trim()) return;
    const newProblem: CreativeProblem = {
      id: crypto.randomUUID(),
      title: problem.title,
      description: problem.description,
      constraints: [],
      assumptions: [],
      reframings: [],
      ideas,
      selectedSolution: "",
      timestamp: new Date().toISOString()
    };
    setProfile(p => ({ ...p, problems: [...p.problems, newProblem] }));
    setProblem({ title: "", description: "" });
    setIdeas([]);
  };

  const getRandomPrompt = () => {
    if (!divergentTechnique) return "";
    const prompts = divergentTechnique.prompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const [randomPrompt, setRandomPrompt] = useState(() => getRandomPrompt());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lightbulb className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-semibold">Creative Problem-Solving</h2>
      </div>

      <p className="text-sm opacity-70">
        Creativity can be practiced. These techniques are scaffolds for thinking differently — not formulas, but provocations.
      </p>

      <div className="flex gap-2">
        {(["techniques", "session", "history"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "techniques" && "Techniques"}
            {tab === "session" && "Session"}
            {tab === "history" && `History (${profile.problems.length})`}
          </button>
        ))}
      </div>

      {activeTab === "techniques" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium opacity-70 mb-2">Divergent (Generate Ideas)</h3>
            <div className="flex gap-2 flex-wrap">
              {CREATIVE_TECHNIQUES.divergent.map(tech => (
                <button
                  key={tech.name}
                  onClick={() => { setActiveTechnique(tech.name); setRandomPrompt(tech.prompts[0]); }}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    activeTechnique === tech.name ? "bg-yellow-500/30" : "bg-white/5 hover:bg-white/10"
                  }`}
                  data-testid={`button-tech-${tech.name}`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium opacity-70 mb-2">Convergent (Evaluate Ideas)</h3>
            <div className="flex gap-2 flex-wrap">
              {CREATIVE_TECHNIQUES.convergent.map(tech => (
                <button
                  key={tech.name}
                  onClick={() => setActiveTechnique(tech.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    activeTechnique === tech.name ? "bg-blue-500/30" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>

          {currentTechnique && (
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
              <h3 className="font-semibold">{currentTechnique.name}</h3>
              <p className="text-sm opacity-80">{currentTechnique.description}</p>

              {"prompts" in currentTechnique && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-60">Prompts:</span>
                    <button
                      onClick={() => setRandomPrompt(getRandomPrompt())}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <Shuffle className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm">{randomPrompt}</p>
                  </div>
                </div>
              )}

              {"hats" in currentTechnique && (
                <div className="grid gap-2 grid-cols-2">
                  {currentTechnique.hats.map(hat => (
                    <div key={hat.color} className="p-2 rounded-lg bg-white/5">
                      <span className="text-xs font-medium capitalize">{hat.color} Hat</span>
                      <p className="text-xs opacity-60">{hat.focus}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "session" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
            <input
              type="text"
              value={problem.title}
              onChange={e => setProblem(p => ({ ...p, title: e.target.value }))}
              placeholder="What problem are you working on?"
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
              data-testid="input-problem-title"
            />
            <textarea
              value={problem.description}
              onChange={e => setProblem(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe the problem in detail..."
              className="w-full h-20 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newIdea}
                onChange={e => setNewIdea(e.target.value)}
                placeholder="Add an idea..."
                className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                onKeyPress={e => e.key === "Enter" && addIdea()}
                data-testid="input-new-idea"
              />
              <button
                onClick={addIdea}
                className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {ideas.length > 0 && (
              <div className="space-y-2">
                {ideas.map(idea => (
                  <div key={idea.id} className="p-3 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-sm">{idea.description}</p>
                    <span className="text-xs opacity-50">{idea.technique}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {(problem.title || ideas.length > 0) && (
            <button
              onClick={saveProblem}
              className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm"
              data-testid="button-save-session"
            >
              Save Session ({ideas.length} ideas)
            </button>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3">
          {profile.problems.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              No sessions yet. Start a creative session to build your library.
            </p>
          ) : (
            profile.problems.slice().reverse().map(prob => (
              <div key={prob.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                <h4 className="font-medium text-sm">{prob.title}</h4>
                <p className="text-xs opacity-60">{prob.description}</p>
                <p className="text-xs opacity-50">{prob.ideas.length} ideas generated</p>
                <p className="text-xs opacity-40">{new Date(prob.timestamp).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          Creativity is connecting things. These tools help you make unexpected connections.
        </p>
      </footer>
    </div>
  );
}
