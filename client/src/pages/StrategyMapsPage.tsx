import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Map, ArrowRight, ChevronRight, Compass, Brain, Heart,
  Target, Lightbulb, Shield, Flame, Clock, Check, Star,
  BookOpen, Eye, Scale, Sparkles, Trophy, Zap, Users
} from "lucide-react";

interface StrategyNode {
  id: string;
  name: string;
  description: string;
  category: "reflection" | "wisdom" | "advanced" | "mastery";
  route: string;
  prerequisites: string[];
  unlocks: string[];
  skillsGained: string[];
}

interface StrategyMap {
  id: string;
  name: string;
  description: string;
  theme: string;
  icon: any;
  nodes: StrategyNode[];
  outcome: string;
  duration: string;
}

interface UserProgress {
  completedNodes: string[];
  currentMap: string | null;
  startedAt: string | null;
  journeyNotes: { nodeId: string; note: string; timestamp: string }[];
}

const STORAGE_KEY = "glp_strategy_maps";

const STRATEGY_MAPS: StrategyMap[] = [
  {
    id: "emotional-intelligence",
    name: "Emotional Intelligence Mastery",
    description: "Develop deep awareness of emotions, regulate effectively, and cultivate authentic connections",
    theme: "from-rose-500/20 to-pink-500/20",
    icon: Heart,
    duration: "8-12 weeks",
    outcome: "Enhanced self-regulation, empathy, and relational wisdom",
    nodes: [
      {
        id: "ei-1",
        name: "State Awareness",
        description: "Learn to observe your emotional states without judgment",
        category: "reflection",
        route: "/tools",
        prerequisites: [],
        unlocks: ["ei-2", "ei-3"],
        skillsGained: ["Emotional awareness", "Non-reactive observation"]
      },
      {
        id: "ei-2",
        name: "Belief Patterns",
        description: "Uncover the beliefs that shape your emotional responses",
        category: "reflection",
        route: "/tools",
        prerequisites: ["ei-1"],
        unlocks: ["ei-4"],
        skillsGained: ["Self-knowledge", "Pattern recognition"]
      },
      {
        id: "ei-3",
        name: "Mindscape Navigation",
        description: "Explore the landscape of your mental states",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ei-1"],
        unlocks: ["ei-4"],
        skillsGained: ["Mental flexibility", "State transitions"]
      },
      {
        id: "ei-4",
        name: "Values Integration",
        description: "Align your actions with your deepest values",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ei-2", "ei-3"],
        unlocks: ["ei-5"],
        skillsGained: ["Value clarity", "Authentic action"]
      },
      {
        id: "ei-5",
        name: "Narrative Reauthoring",
        description: "Transform your life story with agency and meaning",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ei-4"],
        unlocks: [],
        skillsGained: ["Narrative agency", "Identity coherence"]
      }
    ]
  },
  {
    id: "critical-thinking",
    name: "Critical Thinking Architecture",
    description: "Build rigorous thinking habits, overcome cognitive biases, and make better decisions",
    theme: "from-blue-500/20 to-indigo-500/20",
    icon: Brain,
    duration: "10-14 weeks",
    outcome: "Sharp analytical thinking and calibrated judgment",
    nodes: [
      {
        id: "ct-1",
        name: "Logic Foundations",
        description: "Map arguments, identify claims, and trace reasoning",
        category: "advanced",
        route: "/advanced",
        prerequisites: [],
        unlocks: ["ct-2", "ct-3"],
        skillsGained: ["Logical analysis", "Argument mapping"]
      },
      {
        id: "ct-2",
        name: "Bias Recognition",
        description: "Identify cognitive biases in yourself and others",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ct-1"],
        unlocks: ["ct-4"],
        skillsGained: ["Bias awareness", "Debiasing strategies"]
      },
      {
        id: "ct-3",
        name: "Decision Architecture",
        description: "Structure complex decisions with clarity",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ct-1"],
        unlocks: ["ct-4"],
        skillsGained: ["Decision frameworks", "Pre-mortem analysis"]
      },
      {
        id: "ct-4",
        name: "Epistemic Calibration",
        description: "Align your confidence with your actual accuracy",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ct-2", "ct-3"],
        unlocks: ["ct-5"],
        skillsGained: ["Calibrated confidence", "Prediction skill"]
      },
      {
        id: "ct-5",
        name: "Mental Models Mastery",
        description: "Internalize powerful thinking frameworks",
        category: "mastery",
        route: "/mastery",
        prerequisites: ["ct-4"],
        unlocks: [],
        skillsGained: ["Mental model fluency", "Cross-domain thinking"]
      }
    ]
  },
  {
    id: "wisdom-synthesis",
    name: "Wisdom Synthesis Path",
    description: "Integrate knowledge from multiple traditions into practical wisdom for living",
    theme: "from-purple-500/20 to-violet-500/20",
    icon: Lightbulb,
    duration: "12-16 weeks",
    outcome: "Integrated practical wisdom across life domains",
    nodes: [
      {
        id: "ws-1",
        name: "Cognitive Frameworks",
        description: "Survey 12 mental models across 6 categories",
        category: "wisdom",
        route: "/wisdom",
        prerequisites: [],
        unlocks: ["ws-2"],
        skillsGained: ["Framework literacy", "Conceptual tools"]
      },
      {
        id: "ws-2",
        name: "Dialectical Thinking",
        description: "Navigate thesis-antithesis-synthesis dynamics",
        category: "wisdom",
        route: "/wisdom",
        prerequisites: ["ws-1"],
        unlocks: ["ws-3", "ws-4"],
        skillsGained: ["Dialectical reasoning", "Truth-seeking"]
      },
      {
        id: "ws-3",
        name: "Paradox Navigation",
        description: "Hold tensions without forcing resolution",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ws-2"],
        unlocks: ["ws-5"],
        skillsGained: ["Paradox tolerance", "Both/and thinking"]
      },
      {
        id: "ws-4",
        name: "Philosophical Foundations",
        description: "Clarify your stance on fundamental questions",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ws-2"],
        unlocks: ["ws-5"],
        skillsGained: ["Philosophical clarity", "Worldview coherence"]
      },
      {
        id: "ws-5",
        name: "Synthesis Mastery",
        description: "Combine insights across domains creatively",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["ws-3", "ws-4"],
        unlocks: [],
        skillsGained: ["Creative synthesis", "Insight generation"]
      }
    ]
  },
  {
    id: "deep-mastery",
    name: "Deep Mastery Protocol",
    description: "Develop expert-level skills through deliberate practice and focused work",
    theme: "from-amber-500/20 to-orange-500/20",
    icon: Trophy,
    duration: "Ongoing",
    outcome: "Expert-level competence in chosen domains",
    nodes: [
      {
        id: "dm-1",
        name: "Deep Work Foundations",
        description: "Establish focused work practices",
        category: "mastery",
        route: "/mastery",
        prerequisites: [],
        unlocks: ["dm-2", "dm-3"],
        skillsGained: ["Deep focus", "Distraction management"]
      },
      {
        id: "dm-2",
        name: "Attention Ecology",
        description: "Audit and optimize your attention allocation",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["dm-1"],
        unlocks: ["dm-4"],
        skillsGained: ["Attention management", "Priority clarity"]
      },
      {
        id: "dm-3",
        name: "Skill Forge Practice",
        description: "Apply deliberate practice principles systematically",
        category: "mastery",
        route: "/mastery",
        prerequisites: ["dm-1"],
        unlocks: ["dm-4"],
        skillsGained: ["Deliberate practice", "Skill progression"]
      },
      {
        id: "dm-4",
        name: "Autodidact Systems",
        description: "Build self-directed learning systems",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["dm-2", "dm-3"],
        unlocks: ["dm-5"],
        skillsGained: ["Self-directed learning", "Knowledge synthesis"]
      },
      {
        id: "dm-5",
        name: "Metacognitive Mastery",
        description: "Think about thinking at the highest level",
        category: "advanced",
        route: "/advanced",
        prerequisites: ["dm-4"],
        unlocks: [],
        skillsGained: ["Metacognition", "Learning optimization"]
      }
    ]
  }
];

function loadProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    completedNodes: [],
    currentMap: null,
    startedAt: null,
    journeyNotes: []
  };
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export default function StrategyMapsPage() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [activeMap, setActiveMap] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<StrategyNode | null>(null);

  const selectMap = (mapId: string) => {
    setActiveMap(mapId);
    if (!progress.currentMap) {
      const updated = { ...progress, currentMap: mapId, startedAt: new Date().toISOString() };
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const completeNode = (nodeId: string) => {
    if (!progress.completedNodes.includes(nodeId)) {
      const updated = { ...progress, completedNodes: [...progress.completedNodes, nodeId] };
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const isNodeUnlocked = (node: StrategyNode): boolean => {
    if (node.prerequisites.length === 0) return true;
    return node.prerequisites.every(prereq => progress.completedNodes.includes(prereq));
  };

  const activeMapData = STRATEGY_MAPS.find(m => m.id === activeMap);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "reflection": return "border-emerald-500/50 bg-emerald-500/10";
      case "wisdom": return "border-purple-500/50 bg-purple-500/10";
      case "advanced": return "border-amber-500/50 bg-amber-500/10";
      case "mastery": return "border-indigo-500/50 bg-indigo-500/10";
      default: return "border-white/20 bg-white/5";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="h-10 w-10 text-amber-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent" data-testid="text-strategy-title">
              Strategy Maps
            </h1>
          </div>
          <p className="text-lg opacity-70 max-w-2xl mx-auto" data-testid="text-strategy-subtitle">
            Cross-tool learning pathways connecting Reflection → Wisdom → Advanced → Mastery.
            Each journey builds upon the last.
          </p>
        </header>

        {!activeMap && (
          <div className="grid md:grid-cols-2 gap-6">
            {STRATEGY_MAPS.map(map => {
              const MapIcon = map.icon;
              const completedCount = map.nodes.filter(n => progress.completedNodes.includes(n.id)).length;
              const progressPercent = Math.round((completedCount / map.nodes.length) * 100);
              
              return (
                <button
                  key={map.id}
                  onClick={() => selectMap(map.id)}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${map.theme} border border-white/10 hover:border-white/20 text-left transition-all group`}
                  data-testid={`button-map-${map.id}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-white/10">
                      <MapIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold group-hover:text-white transition-colors">{map.name}</h2>
                      <div className="flex items-center gap-2 text-xs opacity-50 mt-1">
                        <Clock className="h-3 w-3" />
                        {map.duration}
                        <span className="mx-1">•</span>
                        {map.nodes.length} milestones
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-sm opacity-70 mb-4">{map.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="opacity-50">Progress</span>
                      <span>{completedCount}/{map.nodes.length}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/30 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeMap && activeMapData && (
          <div>
            <button
              onClick={() => setActiveMap(null)}
              className="mb-6 text-sm opacity-60 hover:opacity-100 flex items-center gap-1"
              data-testid="button-back-maps"
            >
              ← Back to all maps
            </button>

            <div className={`p-6 rounded-2xl bg-gradient-to-br ${activeMapData.theme} border border-white/10 mb-8`}>
              <div className="flex items-center gap-4 mb-4">
                <activeMapData.icon className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">{activeMapData.name}</h2>
                  <p className="text-sm opacity-70">{activeMapData.description}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 mt-4">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium">Outcome</span>
                </div>
                <p className="text-sm opacity-80">{activeMapData.outcome}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Compass className="h-5 w-5" />
                Journey Milestones
              </h3>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
                
                {activeMapData.nodes.map((node, index) => {
                  const isUnlocked = isNodeUnlocked(node);
                  const isCompleted = progress.completedNodes.includes(node.id);
                  
                  return (
                    <div key={node.id} className="relative pl-16 pb-8 last:pb-0">
                      <div 
                        className={`absolute left-4 w-4 h-4 rounded-full border-2 ${
                          isCompleted 
                            ? "bg-emerald-500 border-emerald-500" 
                            : isUnlocked 
                              ? "bg-white/20 border-white/50" 
                              : "bg-white/5 border-white/20"
                        }`}
                      >
                        {isCompleted && <Check className="h-3 w-3 text-white absolute -left-0.5 -top-0.5" />}
                      </div>
                      
                      <div 
                        className={`p-4 rounded-xl border transition-all ${
                          isUnlocked 
                            ? `${getCategoryColor(node.category)} cursor-pointer hover:scale-[1.02]` 
                            : "border-white/10 bg-white/5 opacity-50"
                        }`}
                        onClick={() => isUnlocked && setSelectedNode(node)}
                        data-testid={`card-node-${node.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-xs uppercase opacity-50">{node.category}</span>
                            <h4 className="font-medium">{node.name}</h4>
                          </div>
                          {isUnlocked && !isCompleted && (
                            <button
                              onClick={(e) => { e.stopPropagation(); completeNode(node.id); }}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs"
                              data-testid={`button-complete-${node.id}`}
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                        <p className="text-sm opacity-70 mb-3">{node.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {node.skillsGained.map(skill => (
                            <span key={skill} className="px-2 py-1 rounded-full bg-white/10 text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                        {isUnlocked && (
                          <Link href={node.route}>
                            <a className="mt-3 inline-flex items-center gap-1 text-xs opacity-60 hover:opacity-100">
                              Open tool <ArrowRight className="h-3 w-3" />
                            </a>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-xs opacity-40 max-w-md mx-auto">
            These paths are invitations, not prescriptions. Progress at your own pace.
            Every step forward is a step toward growth.
          </p>
        </div>
      </div>
    </div>
  );
}
