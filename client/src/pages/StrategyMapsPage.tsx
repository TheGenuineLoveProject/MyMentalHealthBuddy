import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Map, ArrowRight, ChevronRight, Compass, Brain, Heart,
  Target, Lightbulb, Shield, Flame, Clock, Check, Star,
  BookOpen, Eye, Scale, Sparkles, Trophy, Zap, Users, ArrowLeft
} from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

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
        description: "Rewrite your life story with agency and meaning",
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
      case "reflection": return "border-[var(--sage-300)] bg-[var(--sage-50)]";
      case "wisdom": return "border-[var(--teal-300)] bg-[var(--teal-50)]";
      case "advanced": return "border-[var(--gold-300)] bg-[var(--gold-50)]";
      case "mastery": return "border-[var(--blush-300)] bg-[var(--blush-50)]";
      default: return "border-[var(--sage-200)] bg-white";
    }
  };

  return (
  <WellnessPageShell
    title="StrategyMapsPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >
      <SEO title="Strategy Maps — The Genuine Love Project" description="Visual guides for wellness planning." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="icon-container icon-xl icon-gradient-gold">
              <Map className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-display-lg text-teal mb-4" data-testid="text-strategy-title">
            Strategy Maps
          </h1>
          <p className="text-lead max-w-2xl mx-auto" data-testid="text-strategy-subtitle">
            Cross-tool learning pathways connecting Reflection → Wisdom → Advanced → Mastery.
            Each journey builds upon the last.
          </p>
        </header>

        <BenefitsBlock
          benefits={[
            "Structured learning pathways across all wellness tool categories",
            "Track your progress through interconnected skill-building journeys",
            "All progress stays local—your journey remains private"
          ]}
          duration="8–12 weeks per pathway"
          control="Start, pause, or change pathways anytime"
          disclaimer="Educational growth framework—not clinical guidance. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-8"
        />

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
                  className="card-bordered text-left transition-all group hover:shadow-lg"
                  data-testid={`button-map-${map.id}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="icon-container icon-lg icon-gradient-sage">
                      <MapIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-heading-md text-teal group-hover:text-[var(--teal-700)] transition-colors">{map.name}</h2>
                      <div className="flex items-center gap-2 text-caption mt-1">
                        <Clock className="h-3 w-3" />
                        {map.duration}
                        <span className="mx-1">•</span>
                        {map.nodes.length} milestones
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[var(--sage-400)] group-hover:text-[var(--teal-600)] group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-body-sm mb-4">{map.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-caption">
                      <span>Progress</span>
                      <span className="text-[var(--teal-600)]">{completedCount}/{map.nodes.length}</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--sage-100)] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%`, background: 'linear-gradient(to right, var(--sage-400), var(--teal-500))' }}
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
              className="mb-6 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] flex items-center gap-1 transition"
              data-testid="button-back-maps"
            >
              ← Back to all maps
            </button>

            <div className="card-bordered mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="icon-container icon-lg icon-gradient-teal">
                  <activeMapData.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-heading-lg text-teal">{activeMapData.name}</h2>
                  <p className="text-body-sm">{activeMapData.description}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)] mt-4">
                <div className="flex items-center gap-2 text-body-sm mb-2">
                  <Target className="h-4 w-4 text-[var(--sage-600)]" />
                  <span className="text-heading-sm text-teal">Outcome</span>
                </div>
                <p className="text-body-sm">{activeMapData.outcome}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-heading-md text-teal flex items-center gap-2">
                <Compass className="h-5 w-5 text-[var(--sage-500)]" />
                Journey Milestones
              </h3>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--sage-200)]" />
                
                {activeMapData.nodes.map((node, index) => {
                  const isUnlocked = isNodeUnlocked(node);
                  const isCompleted = progress.completedNodes.includes(node.id);
                  
                  return (
                    <div key={node.id} className="relative pl-16 pb-8 last:pb-0">
                      <div 
                        className={`absolute left-4 w-4 h-4 rounded-full border-2 ${
                          isCompleted 
                            ? "bg-[var(--sage-500)] border-[var(--sage-500)]" 
                            : isUnlocked 
                              ? "bg-[var(--sage-100)] border-[var(--sage-400)]" 
                              : "bg-[var(--sage-50)] border-[var(--sage-200)]"
                        }`}
                      >
                        {isCompleted && <Check className="h-3 w-3 text-white absolute -left-0.5 -top-0.5" />}
                      </div>
                      
                      <div 
                        className={`p-4 rounded-xl border transition-all ${
                          isUnlocked 
                            ? `${getCategoryColor(node.category)} cursor-pointer hover:scale-[1.02] hover:shadow-md` 
                            : "border-[var(--sage-200)] bg-[var(--sage-50)] opacity-60"
                        }`}
                        onClick={() => isUnlocked && setSelectedNode(node)}
                        data-testid={`card-node-${node.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-eyebrow text-[var(--sage-500)]">{node.category}</span>
                            <h4 className="text-heading-sm text-teal">{node.name}</h4>
                          </div>
                          {isUnlocked && !isCompleted && (
                            <button
                              onClick={(e) => { e.stopPropagation(); completeNode(node.id); }}
                              className="px-3 py-1 rounded-lg bg-[var(--sage-100)] hover:bg-[var(--sage-200)] text-caption text-[var(--teal-700)] transition"
                              data-testid={`button-complete-${node.id}`}
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                        <p className="text-body-sm mb-3">{node.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {node.skillsGained.map(skill => (
                            <span key={skill} className="px-2 py-1 rounded-full bg-[var(--sage-100)] text-caption text-[var(--teal-700)]">
                              {skill}
                            </span>
                          ))}
                        </div>
                        {isUnlocked && (
                          <Link href={node.route}>
                            <a className="mt-3 inline-flex items-center gap-1 text-caption text-[var(--sage-500)] hover:text-[var(--teal-600)] transition">
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
          <p className="text-caption max-w-md mx-auto">
            These paths are invitations, not prescriptions. Progress at your own pace.
            Every step forward is a step toward growth.
          </p>
        </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
