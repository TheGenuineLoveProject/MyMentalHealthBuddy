import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Compass, Brain, Lightbulb, Target, Sparkles, ArrowRight,
  BookOpen, Mic, Timer, HelpCircle, TrendingUp, Download,
  Layers, Clock, Sunrise, Quote, Scale, Zap, Network,
  GitBranch, Focus, Map, Crosshair, Eye, BarChart3,
  Users, Heart, Compass as CompassIcon, Puzzle, Flame,
  Trophy, Wrench, Library, ChevronRight, Star, Check
} from "lucide-react";

interface ToolProgress {
  toolId: string;
  lastUsed: string;
  sessionsCompleted: number;
}

interface AtlasProfile {
  completedTools: string[];
  favoriteTools: string[];
  currentPath: string | null;
  totalSessions: number;
  lastVisit: string;
}

const STORAGE_KEY = "glp_atlas_profile";

const TOOL_CATEGORIES = [
  {
    id: "reflection",
    name: "Reflection Tools",
    description: "Privacy-focused self-inquiry instruments",
    route: "/tools",
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    icon: BookOpen,
    tools: [
      { id: "belief-mapping", name: "Belief Mapping", icon: Map, description: "Track patterns in personal beliefs" },
      { id: "timed-writing", name: "Timed Writing", icon: Timer, description: "Flow state writing sessions" },
      { id: "silence-mode", name: "Silence Mode", icon: Mic, description: "Private writing, no AI output" },
      { id: "question-reflection", name: "Question Reflection", icon: HelpCircle, description: "Socratic self-inquiry" },
      { id: "growth-timeline", name: "Growth Timeline", icon: TrendingUp, description: "Personal evolution visualization" },
      { id: "export-data", name: "Export Data", icon: Download, description: "Full data sovereignty" }
    ]
  },
  {
    id: "wisdom",
    name: "Wisdom Tools",
    description: "Advanced intellectual frameworks for deep thinkers",
    route: "/wisdom",
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    icon: Lightbulb,
    tools: [
      { id: "cognitive-frameworks", name: "Cognitive Frameworks", icon: Layers, description: "12 mental models across 6 categories" },
      { id: "dialectical-inquiry", name: "Dialectical Inquiry", icon: GitBranch, description: "Thesis → Antithesis → Synthesis" },
      { id: "temporal-reflection", name: "Temporal Reflection", icon: Clock, description: "Past/Present/Future integration" },
      { id: "daily-wisdom", name: "Daily Wisdom", icon: Sunrise, description: "Cross-tradition insights" },
      { id: "paradox-navigation", name: "Paradox Navigation", icon: Puzzle, description: "Navigate tensions without resolution" },
      { id: "wisdom-journal", name: "Wisdom Journal", icon: BookOpen, description: "Capture wisdom insights" },
      { id: "philosophical-dialogue", name: "Philosophical Dialogue", icon: Users, description: "Engage with great thinkers" },
      { id: "contemplation-space", name: "Contemplation Space", icon: Heart, description: "Quiet reflection sanctuary" }
    ]
  },
  {
    id: "advanced",
    name: "Advanced Tools",
    description: "20 rigorous instruments for MIT-level intellect",
    route: "/advanced",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    icon: Brain,
    tools: [
      { id: "logic-lattice", name: "Logic Lattice Lab", icon: Network, description: "Map arguments with claims and evidence" },
      { id: "decision-architecture", name: "Decision Architecture", icon: GitBranch, description: "Structure complex choices" },
      { id: "thought-experiments", name: "Thought Experiments", icon: Lightbulb, description: "8 classic philosophical puzzles" },
      { id: "moral-reasoning", name: "Moral Reasoning Lab", icon: Scale, description: "6 ethical frameworks" },
      { id: "creative-problem", name: "Creative Problem-Solving", icon: Zap, description: "SCAMPER and lateral thinking" },
      { id: "systems-resonance", name: "Systems Resonance", icon: Network, description: "Model feedback loops" },
      { id: "paradox-cartographer", name: "Paradox Cartographer", icon: Map, description: "Navigate paradoxical tensions" },
      { id: "synthesis-collider", name: "Synthesis Collider", icon: Sparkles, description: "Combine artifacts creatively" },
      { id: "attention-ecology", name: "Attention Ecology", icon: Focus, description: "Track attention flows" },
      { id: "knowledge-weave", name: "Knowledge Weave Map", icon: Network, description: "Connect concepts across domains" },
      { id: "autodidact-forge", name: "Autodidact Forge", icon: Wrench, description: "Self-directed learning" },
      { id: "semantic-mapping", name: "Semantic Mapping", icon: Map, description: "Explore personal word meanings" },
      { id: "metacognition", name: "Metacognition Dashboard", icon: Eye, description: "Track thinking patterns" },
      { id: "bias-blindspots", name: "Bias Blind Spots", icon: Target, description: "12 cognitive biases" },
      { id: "epistemic-calibration", name: "Epistemic Calibration", icon: BarChart3, description: "Prediction tracking" },
      { id: "mindscape-navigator", name: "Mindscape Navigator", icon: Compass, description: "8 archetypal mind states" },
      { id: "values-clarification", name: "Values Clarification", icon: Heart, description: "20 core values across 5 domains" },
      { id: "narrative-identity", name: "Narrative Identity Studio", icon: BookOpen, description: "Life chapters and patterns" },
      { id: "existential-inquiry", name: "Existential Inquiry", icon: Sparkles, description: "6 existential themes" },
      { id: "philosophical-stance", name: "Philosophical Stance Mapper", icon: CompassIcon, description: "12 fundamental questions" }
    ]
  },
  {
    id: "mastery",
    name: "Mastery Tools",
    description: "Deep work and deliberate practice instruments",
    route: "/mastery",
    color: "from-indigo-500/20 to-blue-500/20",
    borderColor: "border-indigo-500/30",
    icon: Trophy,
    tools: [
      { id: "deep-work", name: "Deep Work Tracker", icon: Focus, description: "Cal Newport-inspired focus sessions" },
      { id: "skill-forge", name: "Skill Forge", icon: Flame, description: "5-level deliberate practice" },
      { id: "mental-models", name: "Mental Models Library", icon: Library, description: "12 core thinking frameworks" }
    ]
  }
];

const LEARNING_PATHS = [
  {
    id: "self-awareness",
    name: "Self-Awareness Journey",
    description: "Develop deep understanding of your inner landscape",
    tools: ["belief-mapping", "metacognition", "values-clarification", "narrative-identity"],
    duration: "4-6 weeks",
    icon: Eye
  },
  {
    id: "critical-thinking",
    name: "Critical Thinking Mastery",
    description: "Sharpen logical reasoning and decision-making",
    tools: ["logic-lattice", "decision-architecture", "bias-blindspots", "epistemic-calibration"],
    duration: "6-8 weeks",
    icon: Brain
  },
  {
    id: "wisdom-integration",
    name: "Wisdom Integration Path",
    description: "Synthesize knowledge into practical wisdom",
    tools: ["cognitive-frameworks", "dialectical-inquiry", "paradox-cartographer", "synthesis-collider"],
    duration: "8-12 weeks",
    icon: Lightbulb
  },
  {
    id: "deep-mastery",
    name: "Deep Mastery Protocol",
    description: "Achieve excellence through deliberate practice",
    tools: ["deep-work", "skill-forge", "mental-models", "autodidact-forge"],
    duration: "Ongoing",
    icon: Trophy
  }
];

function loadProfile(): AtlasProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    completedTools: [],
    favoriteTools: [],
    currentPath: null,
    totalSessions: 0,
    lastVisit: new Date().toISOString()
  };
}

function saveProfile(profile: AtlasProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export default function AtlasDashboard() {
  const [profile, setProfile] = useState<AtlasProfile>(loadProfile);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showPaths, setShowPaths] = useState(false);

  useEffect(() => {
    const updated = { ...profile, lastVisit: new Date().toISOString() };
    saveProfile(updated);
  }, []);

  const totalTools = TOOL_CATEGORIES.reduce((sum, cat) => sum + cat.tools.length, 0);
  const completedCount = profile.completedTools.length;
  const progressPercent = Math.round((completedCount / totalTools) * 100);

  const toggleFavorite = (toolId: string) => {
    setProfile(p => {
      const updated = p.favoriteTools.includes(toolId)
        ? { ...p, favoriteTools: p.favoriteTools.filter(t => t !== toolId) }
        : { ...p, favoriteTools: [...p.favoriteTools, toolId] };
      saveProfile(updated);
      return updated;
    });
  };

  const selectPath = (pathId: string) => {
    setProfile(p => {
      const updated = { ...p, currentPath: pathId };
      saveProfile(updated);
      return updated;
    });
    setShowPaths(false);
  };

  const currentPath = LEARNING_PATHS.find(p => p.id === profile.currentPath);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="h-10 w-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent" data-testid="text-atlas-title">
              Intellectual Atlas
            </h1>
          </div>
          <p className="text-lg opacity-70 max-w-2xl mx-auto" data-testid="text-atlas-subtitle">
            Navigate 37 instruments for deep thinking, self-discovery, and mastery.
            Choose your path or explore freely.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
              <span className="text-sm opacity-60">Progress</span>
            </div>
            <div className="text-3xl font-bold mb-2" data-testid="text-progress-percent">{progressPercent}%</div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs opacity-50 mt-2">{completedCount} of {totalTools} tools explored</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-purple-400" />
              <span className="text-sm opacity-60">Current Path</span>
            </div>
            {currentPath ? (
              <div>
                <div className="text-lg font-semibold mb-1" data-testid="text-current-path">{currentPath.name}</div>
                <p className="text-xs opacity-50">{currentPath.duration}</p>
              </div>
            ) : (
              <button
                onClick={() => setShowPaths(true)}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                data-testid="button-choose-path"
              >
                Choose a learning path <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Star className="h-6 w-6 text-amber-400" />
              <span className="text-sm opacity-60">Favorites</span>
            </div>
            <div className="text-3xl font-bold mb-2" data-testid="text-favorites-count">{profile.favoriteTools.length}</div>
            <p className="text-xs opacity-50">Tools saved for quick access</p>
          </div>
        </div>

        {showPaths && (
          <div className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Compass className="h-5 w-5" />
              Choose Your Learning Path
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {LEARNING_PATHS.map(path => (
                <button
                  key={path.id}
                  onClick={() => selectPath(path.id)}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                  data-testid={`button-path-${path.id}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <path.icon className="h-5 w-5 text-purple-400" />
                    <span className="font-medium">{path.name}</span>
                  </div>
                  <p className="text-sm opacity-60 mb-2">{path.description}</p>
                  <div className="flex items-center gap-2 text-xs opacity-40">
                    <Clock className="h-3 w-3" />
                    {path.duration}
                    <span className="mx-2">•</span>
                    {path.tools.length} tools
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-8">
          {TOOL_CATEGORIES.map(category => {
            const CategoryIcon = category.icon;
            const isExpanded = activeCategory === category.id;
            
            return (
              <div 
                key={category.id}
                className={`rounded-2xl border ${category.borderColor} overflow-hidden transition-all`}
              >
                <button
                  onClick={() => setActiveCategory(isExpanded ? null : category.id)}
                  className={`w-full p-6 bg-gradient-to-r ${category.color} flex items-center justify-between hover:opacity-90 transition-all`}
                  data-testid={`button-category-${category.id}`}
                >
                  <div className="flex items-center gap-4">
                    <CategoryIcon className="h-8 w-8" />
                    <div className="text-left">
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                      <p className="text-sm opacity-70">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm opacity-60">{category.tools.length} tools</span>
                    <ChevronRight className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6 bg-black/20">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {category.tools.map(tool => {
                        const ToolIcon = tool.icon;
                        const isFavorite = profile.favoriteTools.includes(tool.id);
                        const isCompleted = profile.completedTools.includes(tool.id);
                        
                        return (
                          <div
                            key={tool.id}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                            data-testid={`card-tool-${tool.id}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <ToolIcon className="h-5 w-5 opacity-60" />
                              <div className="flex items-center gap-2">
                                {isCompleted && <Check className="h-4 w-4 text-emerald-400" />}
                                <button
                                  onClick={() => toggleFavorite(tool.id)}
                                  className={`p-1 rounded transition-colors ${isFavorite ? "text-amber-400" : "opacity-40 hover:opacity-70"}`}
                                  data-testid={`button-favorite-${tool.id}`}
                                >
                                  <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                                </button>
                              </div>
                            </div>
                            <h3 className="font-medium text-sm mb-1">{tool.name}</h3>
                            <p className="text-xs opacity-50">{tool.description}</p>
                          </div>
                        );
                      })}
                    </div>
                    <Link href={category.route}>
                      <a 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-all"
                        data-testid={`link-explore-${category.id}`}
                      >
                        Explore {category.name} <ArrowRight className="h-4 w-4" />
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs opacity-40 max-w-md mx-auto">
            These tools are offerings for your exploration. Take what serves you, leave what doesn't.
            Your journey is uniquely yours.
          </p>
        </div>
      </div>
    </div>
  );
}
