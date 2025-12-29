import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, Search, Star, BookOpen, Lightbulb, Target, Layers, Grid3X3, List } from "lucide-react";

const STORAGE_KEY = "glp_cognitive_models";

type MentalModel = {
  id: string;
  name: string;
  category: string;
  description: string;
  example: string;
  application: string;
  tags: string[];
};

type Profile = {
  favorites: string[];
  practiced: string[];
  notes: Record<string, string>;
};

const MENTAL_MODELS: MentalModel[] = [
  { id: "first-principles", name: "First Principles Thinking", category: "Reasoning", description: "Break down complex problems into fundamental truths and build up from there.", example: "Instead of asking 'How do I make a cheaper car?', ask 'What are the fundamental components of transportation?'", application: "Use when facing a complex problem. Ask: What are the basic elements? What do we know to be absolutely true?", tags: ["problem-solving", "innovation", "analysis"] },
  { id: "inversion", name: "Inversion", category: "Reasoning", description: "Think backwards. Instead of asking how to succeed, ask how to fail and avoid those things.", example: "To build a great relationship, list everything that destroys relationships and avoid those.", application: "When planning any goal, ask: What would guarantee failure? Then systematically avoid those pitfalls.", tags: ["problem-solving", "risk", "planning"] },
  { id: "second-order", name: "Second-Order Thinking", category: "Reasoning", description: "Consider not just immediate consequences, but the consequences of those consequences.", example: "A tax cut might boost spending (first order), but could increase inflation (second order).", application: "Before any decision, ask: And then what? What happens after the first effect?", tags: ["decision-making", "consequences", "strategy"] },
  { id: "circle-competence", name: "Circle of Competence", category: "Self-Awareness", description: "Know the boundaries of your expertise. Stay within them or expand them deliberately.", example: "Warren Buffett avoids tech stocks because they're outside his circle.", application: "Ask: Am I truly competent here, or am I overconfident? Either expand the circle or defer to experts.", tags: ["self-awareness", "humility", "expertise"] },
  { id: "map-territory", name: "Map is Not the Territory", category: "Reality", description: "Models are simplified representations; reality is always more complex.", example: "A restaurant review describes food, but tasting it is the territory.", application: "When using any model or theory, ask: What is this map missing? What nuances exist in reality?", tags: ["epistemology", "models", "reality"] },
  { id: "occams-razor", name: "Occam's Razor", category: "Reasoning", description: "Among competing explanations, prefer the simplest one that fits the facts.", example: "If your car won't start, check the battery before suspecting engine failure.", application: "When explaining phenomena, start with the simplest explanation. Add complexity only when necessary.", tags: ["simplicity", "explanation", "analysis"] },
  { id: "hanlon-razor", name: "Hanlon's Razor", category: "Social", description: "Never attribute to malice what can be explained by incompetence or ignorance.", example: "Your colleague didn't reply rudely on purpose; they were just rushing.", application: "When someone upsets you, first consider: Could this be a mistake rather than intentional harm?", tags: ["relationships", "assumptions", "empathy"] },
  { id: "feedback-loops", name: "Feedback Loops", category: "Systems", description: "Outputs of a system become inputs, creating self-reinforcing or self-correcting cycles.", example: "Confidence leads to success, which builds more confidence (positive loop).", application: "Identify loops in any system. Ask: Is this amplifying or dampening? How can I intervene?", tags: ["systems", "cycles", "change"] },
  { id: "emergence", name: "Emergence", category: "Systems", description: "Complex patterns arise from simple rules. The whole becomes greater than the sum of parts.", example: "Individual neurons are simple, but together they produce consciousness.", application: "Look for emergent properties. Small changes in components can create dramatically different outcomes.", tags: ["complexity", "systems", "patterns"] },
  { id: "opportunity-cost", name: "Opportunity Cost", category: "Economics", description: "Every choice has a cost: what you give up by not choosing the alternative.", example: "Watching TV for 2 hours means 2 hours not spent learning or connecting.", application: "Before any time or money decision, ask: What am I giving up? Is this the best use of this resource?", tags: ["decisions", "trade-offs", "resources"] },
  { id: "sunk-cost", name: "Sunk Cost Fallacy", category: "Economics", description: "Past investments shouldn't influence future decisions. Only consider future costs and benefits.", example: "Finishing a bad movie because you paid for the ticket wastes more time.", application: "When reluctant to quit, ask: If I were starting fresh today, would I make this same choice?", tags: ["decisions", "bias", "psychology"] },
  { id: "pareto", name: "Pareto Principle (80/20)", category: "Efficiency", description: "Roughly 80% of effects come from 20% of causes.", example: "20% of customers often generate 80% of revenue.", application: "Identify the vital few. Ask: What 20% of inputs produce 80% of my desired outcomes?", tags: ["efficiency", "focus", "leverage"] },
  { id: "margin-safety", name: "Margin of Safety", category: "Risk", description: "Build buffers for error. Plan for things to go worse than expected.", example: "Leave 30 minutes early for important meetings, even if traffic is usually fine.", application: "In any plan with uncertainty, ask: What buffer am I building in? What if things go wrong?", tags: ["risk", "planning", "resilience"] },
  { id: "via-negativa", name: "Via Negativa", category: "Philosophy", description: "Improvement often comes from subtraction, not addition. Remove the bad rather than add the good.", example: "Better health often comes from stopping bad habits rather than adding supplements.", application: "Before adding solutions, ask: What can I remove? What's causing harm that I can eliminate?", tags: ["simplicity", "improvement", "philosophy"] },
  { id: "thought-experiment", name: "Thought Experiments", category: "Reasoning", description: "Use imagination to explore consequences of ideas without real-world testing.", example: "Einstein imagined riding a beam of light to develop relativity.", application: "When stuck, ask: What if I could magically change one variable? What would happen?", tags: ["creativity", "imagination", "analysis"] },
  { id: "regret-minimization", name: "Regret Minimization", category: "Decision-Making", description: "Choose the option you'll regret least when looking back from old age.", example: "Jeff Bezos left a stable job to start Amazon using this framework.", application: "For major life decisions, imagine yourself at 80. Ask: Will I regret not trying this?", tags: ["decisions", "long-term", "values"] },
  { id: "reversibility", name: "Reversibility", category: "Decision-Making", description: "Distinguish one-way doors from two-way doors. Take risks on reversible decisions.", example: "Trying a new hobby is reversible. Getting a face tattoo is not.", application: "Before deciding, ask: Can I undo this easily? If yes, decide faster and experiment more.", tags: ["decisions", "risk", "speed"] },
  { id: "antifragility", name: "Antifragility", category: "Systems", description: "Some things benefit from shocks and volatility. They get stronger from stress.", example: "Muscles grow stronger when stressed. Immune systems need exposure to pathogens.", application: "Ask: How can I build systems that improve from challenges rather than just survive them?", tags: ["resilience", "growth", "stress"] },
  { id: "compounding", name: "Compounding", category: "Growth", description: "Small consistent gains accumulate exponentially over time.", example: "1% improvement daily = 37x improvement in a year.", application: "Focus on consistent small gains. Ask: What small improvement can I make repeatedly?", tags: ["growth", "consistency", "time"] },
  { id: "leverage", name: "Leverage", category: "Efficiency", description: "Use tools, systems, or others' effort to multiply your impact.", example: "Code written once can serve millions. A book written once can teach forever.", application: "Ask: How can I create something once that delivers value repeatedly without my direct effort?", tags: ["efficiency", "scale", "impact"] },
  { id: "probabilistic", name: "Probabilistic Thinking", category: "Reasoning", description: "Think in probabilities rather than certainties. Few things are 0% or 100%.", example: "Instead of 'It will rain,' say 'There's a 70% chance of rain.'", application: "Assign probabilities to outcomes. Update them as new information arrives.", tags: ["uncertainty", "decisions", "calibration"] },
  { id: "redundancy", name: "Redundancy", category: "Risk", description: "Build backup systems. Critical functions should have multiple fail-safes.", example: "Airplanes have multiple engines and backup navigation systems.", application: "For anything critical, ask: What's my backup? What if the primary fails?", tags: ["risk", "resilience", "planning"] },
  { id: "bottleneck", name: "Bottleneck Analysis", category: "Systems", description: "Find the constraint limiting the whole system. Improving it improves everything.", example: "A highway is only as fast as its slowest section.", application: "Ask: What single point, if improved, would have the biggest impact on the whole system?", tags: ["systems", "efficiency", "focus"] },
  { id: "local-global", name: "Local vs Global Optima", category: "Optimization", description: "The best solution nearby may not be the best overall. Sometimes you must get worse to get better.", example: "Staying at a comfortable job (local optimum) may prevent a better career (global optimum).", application: "When stuck at a plateau, ask: Am I at a local maximum? What would I have to sacrifice to reach higher?", tags: ["optimization", "growth", "change"] },
  { id: "skin-game", name: "Skin in the Game", category: "Incentives", description: "People with personal risk in the outcome make better decisions about it.", example: "Surgeons who might operate on their own family are more careful.", application: "Evaluate advice based on whether the advisor shares your downside. Trust those with skin in the game.", tags: ["incentives", "trust", "accountability"] },
];

const CATEGORIES = [...new Set(MENTAL_MODELS.map(m => m.category))];

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { favorites: [], practiced: [], notes: {} };
  } catch {
    return { favorites: [], practiced: [], notes: {} };
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function CognitiveArchitecturePage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredModels = useMemo(() => {
    return MENTAL_MODELS.filter(m => {
      const matchesSearch = !search || 
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = !selectedCategory || m.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const toggleFavorite = (id: string) => {
    const updated = {
      ...profile,
      favorites: profile.favorites.includes(id)
        ? profile.favorites.filter(f => f !== id)
        : [...profile.favorites, id],
    };
    setProfile(updated);
    saveProfile(updated);
  };

  const markPracticed = (id: string) => {
    if (profile.practiced.includes(id)) return;
    const updated = {
      ...profile,
      practiced: [...profile.practiced, id],
    };
    setProfile(updated);
    saveProfile(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/atlas">
            <a className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Atlas
            </a>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="h-10 w-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent" data-testid="text-title">
              Cognitive Architecture Lab
            </h1>
          </div>
          <p className="text-lg opacity-70">
            {MENTAL_MODELS.length} mental models to sharpen your thinking. Build a latticework of wisdom.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Brain className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
            <div className="text-2xl font-bold" data-testid="text-total">{MENTAL_MODELS.length}</div>
            <p className="text-xs opacity-50">Mental Models</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold" data-testid="text-favorites">{profile.favorites.length}</div>
            <p className="text-xs opacity-50">Favorites</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
            <div className="text-2xl font-bold" data-testid="text-practiced">{profile.practiced.length}</div>
            <p className="text-xs opacity-50">Practiced</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Lightbulb className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold" data-testid="text-categories">{CATEGORIES.length}</div>
            <p className="text-xs opacity-50">Categories</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search models, tags, or concepts..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              data-testid="input-search"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl border transition-all ${viewMode === "grid" ? "bg-cyan-500/20 border-cyan-500/50" : "bg-white/5 border-white/10"}`}
              data-testid="button-grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-xl border transition-all ${viewMode === "list" ? "bg-cyan-500/20 border-cyan-500/50" : "bg-white/5 border-white/10"}`}
              data-testid="button-list"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${!selectedCategory ? "bg-cyan-500 text-white" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}
            data-testid="button-category-all"
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${selectedCategory === cat ? "bg-cyan-500 text-white" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedModel ? (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 mb-2 inline-block">
                  {selectedModel.category}
                </span>
                <h2 className="text-2xl font-bold">{selectedModel.name}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(selectedModel.id)}
                  className={`p-2 rounded-lg ${profile.favorites.includes(selectedModel.id) ? "bg-amber-500/20 text-amber-400" : "bg-white/5 hover:bg-white/10"}`}
                  data-testid="button-favorite"
                >
                  <Star className={`h-5 w-5 ${profile.favorites.includes(selectedModel.id) ? "fill-amber-400" : ""}`} />
                </button>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
                  data-testid="button-close"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-cyan-300 mb-1">Core Concept</h4>
                <p className="opacity-80">{selectedModel.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-emerald-300 mb-1">Example</h4>
                <p className="opacity-80 italic">"{selectedModel.example}"</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-300 mb-1">How to Apply</h4>
                <p className="opacity-80">{selectedModel.application}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedModel.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => { markPracticed(selectedModel.id); setSelectedModel(null); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all"
                data-testid="button-practice"
              >
                Mark as Practiced
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
            {filteredModels.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group ${viewMode === "list" ? "w-full flex items-center gap-4" : ""}`}
                data-testid={`button-model-${model.id}`}
              >
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      {model.category}
                    </span>
                    {profile.favorites.includes(model.id) && (
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    )}
                    {profile.practiced.includes(model.id) && (
                      <Target className="h-3 w-3 text-emerald-400" />
                    )}
                  </div>
                  <h3 className="font-semibold group-hover:text-cyan-300 transition-colors">{model.name}</h3>
                  <p className="text-sm opacity-60 line-clamp-2 mt-1">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {filteredModels.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p>No models match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
