import { useState } from "react";
import LogicLatticeLab from "@/components/logic/LogicLatticeLab";
import SystemsResonance from "@/components/systems/SystemsResonance";
import ParadoxCartographer from "@/components/paradox/ParadoxCartographer";
import SynthesisCollider from "@/components/synthesis/SynthesisCollider";
import KnowledgeWeaveMap from "@/components/weave/KnowledgeWeaveMap";
import AutodidactForge from "@/components/autodidact/AutodidactForge";
import DecisionArchitecture from "@/components/decision/DecisionArchitecture";
import EpistemicCalibration from "@/components/epistemic/EpistemicCalibration";
import ThoughtExperimentsLab from "@/components/thought/ThoughtExperimentsLab";
import MetacognitionDashboard from "@/components/metacognition/MetacognitionDashboard";
import BiasBlindSpots from "@/components/bias/BiasBlindSpots";
import SemanticMapping from "@/components/semantic/SemanticMapping";
import PhilosophicalStanceMapper from "@/components/stance/PhilosophicalStanceMapper";
import ValuesClarification from "@/components/values/ValuesClarification";
import MoralReasoningLab from "@/components/moral/MoralReasoningLab";
import NarrativeIdentityStudio from "@/components/narrative/NarrativeIdentityStudio";
import AttentionEcology from "@/components/attention/AttentionEcology";
import ExistentialInquiry from "@/components/existential/ExistentialInquiry";
import CreativeProblemSolver from "@/components/creative/CreativeProblemSolver";
import MindscapeNavigator from "@/components/mindscape/MindscapeNavigator";
import { 
  Network, GitBranch, Compass, Zap, Share2, Flame,
  Scale, Target, Lightbulb, Brain, Eye, Type, MapPin,
  Heart, BookOpen, Focus, Map, Sparkles
} from "lucide-react";

type ActiveTool = 
  | "logic" | "systems" | "paradox" | "synthesis" | "weave" | "autodidact"
  | "decision" | "epistemic" | "thought" | "metacognition" | "bias" | "semantic" | "stance"
  | "values" | "moral" | "narrative" | "attention" | "existential" | "creative" | "mindscape";

const TOOL_CATEGORIES = [
  {
    name: "Reasoning & Logic",
    tools: [
      { id: "logic" as ActiveTool, name: "Logic Lattice", description: "Map arguments", icon: Network, color: "blue" },
      { id: "decision" as ActiveTool, name: "Decision Architecture", description: "Structure choices", icon: Scale, color: "indigo" },
      { id: "thought" as ActiveTool, name: "Thought Experiments", description: "Test intuitions", icon: Lightbulb, color: "purple" },
      { id: "moral" as ActiveTool, name: "Moral Reasoning", description: "Ethical frameworks", icon: Scale, color: "blue" },
      { id: "creative" as ActiveTool, name: "Creative Problem-Solving", description: "Generate solutions", icon: Sparkles, color: "yellow" }
    ]
  },
  {
    name: "Systems & Patterns",
    tools: [
      { id: "systems" as ActiveTool, name: "Systems Resonance", description: "Model feedback loops", icon: GitBranch, color: "green" },
      { id: "paradox" as ActiveTool, name: "Paradox Cartographer", description: "Navigate tensions", icon: Compass, color: "purple" },
      { id: "synthesis" as ActiveTool, name: "Synthesis Collider", description: "Combine ideas", icon: Zap, color: "orange" },
      { id: "attention" as ActiveTool, name: "Attention Ecology", description: "Track focus", icon: Focus, color: "cyan" }
    ]
  },
  {
    name: "Knowledge & Learning",
    tools: [
      { id: "weave" as ActiveTool, name: "Knowledge Weave", description: "Connect concepts", icon: Share2, color: "cyan" },
      { id: "autodidact" as ActiveTool, name: "Autodidact Forge", description: "Self-directed learning", icon: Flame, color: "amber" },
      { id: "semantic" as ActiveTool, name: "Semantic Mapping", description: "Explore meaning", icon: Type, color: "teal" }
    ]
  },
  {
    name: "Self-Awareness",
    tools: [
      { id: "metacognition" as ActiveTool, name: "Metacognition", description: "Think about thinking", icon: Brain, color: "pink" },
      { id: "bias" as ActiveTool, name: "Bias Blind Spots", description: "Cognitive biases", icon: Eye, color: "rose" },
      { id: "epistemic" as ActiveTool, name: "Epistemic Calibration", description: "Track predictions", icon: Target, color: "emerald" },
      { id: "mindscape" as ActiveTool, name: "Mindscape Navigator", description: "Map mental states", icon: Map, color: "teal" }
    ]
  },
  {
    name: "Identity & Meaning",
    tools: [
      { id: "values" as ActiveTool, name: "Values Clarification", description: "What matters most", icon: Heart, color: "rose" },
      { id: "narrative" as ActiveTool, name: "Narrative Identity", description: "Your life story", icon: BookOpen, color: "amber" },
      { id: "existential" as ActiveTool, name: "Existential Inquiry", description: "Ultimate questions", icon: Compass, color: "violet" },
      { id: "stance" as ActiveTool, name: "Philosophical Stance", description: "Map positions", icon: MapPin, color: "violet" }
    ]
  }
];

const ALL_TOOLS = TOOL_CATEGORIES.flatMap(cat => cat.tools);

export default function AdvancedToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("logic");

  const currentTool = ALL_TOOLS.find(t => t.id === activeTool);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold leading-tight">Advanced Intellectual Tools</h1>
          <p className="mt-2 text-sm opacity-80">
            20 instruments for rigorous self-inquiry — logic, ethics, identity, systems, creativity, and philosophical mapping.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          {TOOL_CATEGORIES.map(category => (
            <div key={category.name} className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wider opacity-50">{category.name}</h3>
              {category.tools.map(tool => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? "border-white/30 bg-white/10"
                        : "border-white/10 bg-black/10 hover:bg-white/5"
                    }`}
                    data-testid={`button-tool-${tool.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${isActive ? "opacity-100" : "opacity-60"}`} />
                      <span className="font-medium text-sm">{tool.name}</span>
                    </div>
                    <p className="text-xs opacity-50 mt-1">{tool.description}</p>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
          {activeTool === "logic" && <LogicLatticeLab />}
          {activeTool === "systems" && <SystemsResonance />}
          {activeTool === "paradox" && <ParadoxCartographer />}
          {activeTool === "synthesis" && <SynthesisCollider />}
          {activeTool === "weave" && <KnowledgeWeaveMap />}
          {activeTool === "autodidact" && <AutodidactForge />}
          {activeTool === "decision" && <DecisionArchitecture />}
          {activeTool === "epistemic" && <EpistemicCalibration />}
          {activeTool === "thought" && <ThoughtExperimentsLab />}
          {activeTool === "metacognition" && <MetacognitionDashboard />}
          {activeTool === "bias" && <BiasBlindSpots />}
          {activeTool === "semantic" && <SemanticMapping />}
          {activeTool === "stance" && <PhilosophicalStanceMapper />}
          {activeTool === "values" && <ValuesClarification />}
          {activeTool === "moral" && <MoralReasoningLab />}
          {activeTool === "narrative" && <NarrativeIdentityStudio />}
          {activeTool === "attention" && <AttentionEcology />}
          {activeTool === "existential" && <ExistentialInquiry />}
          {activeTool === "creative" && <CreativeProblemSolver />}
          {activeTool === "mindscape" && <MindscapeNavigator />}
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs opacity-50">
            All data stays in your browser. These tools are offerings for exploration — use what resonates, leave what doesn't.
          </p>
          <p className="text-xs opacity-40 mt-1">
            You know yourself best.
          </p>
        </footer>
      </div>
    </div>
  );
}
