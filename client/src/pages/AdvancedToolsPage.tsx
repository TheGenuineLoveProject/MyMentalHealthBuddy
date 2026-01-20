import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Network, GitBranch, Compass, Zap, Share2, Flame, Scale, Target, Lightbulb, Brain, Eye, Type, MapPin, Heart, BookOpen, Focus, Map, Sparkles } from "lucide-react";
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
import SEO from "@/components/SEO";

type ActiveTool = 
  | "logic" | "systems" | "paradox" | "synthesis" | "weave" | "autodidact"
  | "decision" | "epistemic" | "thought" | "metacognition" | "bias" | "semantic" | "stance"
  | "values" | "moral" | "narrative" | "attention" | "existential" | "creative" | "mindscape";

const TOOL_CATEGORIES = [
  {
    name: "Reasoning & Logic",
    iconVariant: "sage" as const,
    tools: [
      { id: "logic" as ActiveTool, name: "Logic Lattice", description: "Map arguments", icon: Network },
      { id: "decision" as ActiveTool, name: "Decision Architecture", description: "Structure choices", icon: Scale },
      { id: "thought" as ActiveTool, name: "Thought Experiments", description: "Test intuitions", icon: Lightbulb },
      { id: "moral" as ActiveTool, name: "Moral Reasoning", description: "Ethical frameworks", icon: Scale },
      { id: "creative" as ActiveTool, name: "Creative Problem-Solving", description: "Generate solutions", icon: Sparkles }
    ]
  },
  {
    name: "Systems & Patterns",
    iconVariant: "teal" as const,
    tools: [
      { id: "systems" as ActiveTool, name: "Systems Resonance", description: "Model feedback loops", icon: GitBranch },
      { id: "paradox" as ActiveTool, name: "Paradox Cartographer", description: "Navigate tensions", icon: Compass },
      { id: "synthesis" as ActiveTool, name: "Synthesis Collider", description: "Combine ideas", icon: Zap },
      { id: "attention" as ActiveTool, name: "Attention Ecology", description: "Track focus", icon: Focus }
    ]
  },
  {
    name: "Knowledge & Learning",
    iconVariant: "gold" as const,
    tools: [
      { id: "weave" as ActiveTool, name: "Knowledge Weave", description: "Connect concepts", icon: Share2 },
      { id: "autodidact" as ActiveTool, name: "Autodidact Forge", description: "Self-directed learning", icon: Flame },
      { id: "semantic" as ActiveTool, name: "Semantic Mapping", description: "Explore meaning", icon: Type }
    ]
  },
  {
    name: "Self-Awareness",
    iconVariant: "blush" as const,
    tools: [
      { id: "metacognition" as ActiveTool, name: "Metacognition", description: "Think about thinking", icon: Brain },
      { id: "bias" as ActiveTool, name: "Bias Blind Spots", description: "Cognitive biases", icon: Eye },
      { id: "epistemic" as ActiveTool, name: "Epistemic Calibration", description: "Track predictions", icon: Target },
      { id: "mindscape" as ActiveTool, name: "Mindscape Navigator", description: "Map mental states", icon: Map }
    ]
  },
  {
    name: "Identity & Meaning",
    iconVariant: "sage" as const,
    tools: [
      { id: "values" as ActiveTool, name: "Values Clarification", description: "What matters most", icon: Heart },
      { id: "narrative" as ActiveTool, name: "Narrative Identity", description: "Your life story", icon: BookOpen },
      { id: "existential" as ActiveTool, name: "Existential Inquiry", description: "Ultimate questions", icon: Compass },
      { id: "stance" as ActiveTool, name: "Philosophical Stance", description: "Map positions", icon: MapPin }
    ]
  }
];

const ALL_TOOLS = TOOL_CATEGORIES.flatMap(cat => cat.tools);

export default function AdvancedToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("logic");

  return (
    <>
      <SEO 
        title="Advanced Intellectual Tools - The Genuine Love Project" 
        description="20 rigorous instruments for self-inquiry including logic, ethics, identity, systems, creativity, and philosophical mapping." 
      />
      <div className="min-h-screen hero-gradient px-4 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="icon-container icon-lg icon-gradient-blush">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-heading-xl text-teal">Advanced Intellectual Tools</h1>
                <p className="text-body-sm">20 instruments for rigorous self-inquiry — logic, ethics, identity, systems, creativity, and philosophical mapping.</p>
              </div>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            {TOOL_CATEGORIES.map(category => (
              <div key={category.name} className="space-y-2">
                <h3 className="text-eyebrow text-[var(--sage-600)]">{category.name}</h3>
                {category.tools.map(tool => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full rounded-xl border p-3 text-left transition-all ${
                        isActive
                          ? "border-[var(--sage-400)] bg-white shadow-md"
                          : "border-[var(--sage-200)] bg-white/60 hover:bg-white hover:shadow-sm"
                      }`}
                      data-testid={`button-tool-${tool.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`icon-container icon-xs ${isActive ? `icon-gradient-${category.iconVariant}` : `icon-soft-${category.iconVariant}`}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className={`font-medium text-sm ${isActive ? 'text-[var(--teal-700)]' : 'text-[var(--teal-600)]'}`}>
                          {tool.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--teal-500)] mt-1 ml-7">{tool.description}</p>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="card-bordered">
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

          <footer className="mt-8 text-center space-y-2">
            <p className="text-caption">
              All data stays in your browser. These tools are offerings for exploration — use what resonates, leave what doesn't.
            </p>
            <p className="text-[11px] text-[var(--teal-400)] italic">
              You know yourself best.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
