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
      { id: "logic" as ActiveTool, name: "Logic Lattice", description: "Map and deconstruct arguments to reveal hidden assumptions", icon: Network },
      { id: "decision" as ActiveTool, name: "Decision Architecture", description: "Structure complex choices with clarity frameworks", icon: Scale },
      { id: "thought" as ActiveTool, name: "Thought Experiments", description: "Test intuitions through philosophical scenarios", icon: Lightbulb },
      { id: "moral" as ActiveTool, name: "Moral Reasoning", description: "Navigate ethical dilemmas with multiple frameworks", icon: Scale },
      { id: "creative" as ActiveTool, name: "Creative Problem-Solving", description: "Generate innovative solutions through lateral thinking", icon: Sparkles }
    ]
  },
  {
    name: "Systems & Patterns",
    iconVariant: "teal" as const,
    tools: [
      { id: "systems" as ActiveTool, name: "Systems Resonance", description: "Model complex feedback loops and interdependencies", icon: GitBranch },
      { id: "paradox" as ActiveTool, name: "Paradox Cartographer", description: "Navigate contradictions and hold opposing truths", icon: Compass },
      { id: "synthesis" as ActiveTool, name: "Synthesis Collider", description: "Combine disparate ideas into novel insights", icon: Zap },
      { id: "attention" as ActiveTool, name: "Attention Ecology", description: "Understand and optimize your focus patterns", icon: Focus }
    ]
  },
  {
    name: "Knowledge & Learning",
    iconVariant: "gold" as const,
    tools: [
      { id: "weave" as ActiveTool, name: "Knowledge Weave", description: "Build interconnected concept maps of your understanding", icon: Share2 },
      { id: "autodidact" as ActiveTool, name: "Autodidact Forge", description: "Design your own curriculum for self-directed mastery", icon: Flame },
      { id: "semantic" as ActiveTool, name: "Semantic Mapping", description: "Explore the deep structure of meaning and language", icon: Type }
    ]
  },
  {
    name: "Self-Awareness",
    iconVariant: "blush" as const,
    tools: [
      { id: "metacognition" as ActiveTool, name: "Metacognition", description: "Develop awareness of your own thinking patterns", icon: Brain },
      { id: "bias" as ActiveTool, name: "Bias Blind Spots", description: "Identify and overcome cognitive biases that limit you", icon: Eye },
      { id: "epistemic" as ActiveTool, name: "Epistemic Calibration", description: "Improve the accuracy of your beliefs and predictions", icon: Target },
      { id: "mindscape" as ActiveTool, name: "Mindscape Navigator", description: "Map and explore your inner mental landscape", icon: Map }
    ]
  },
  {
    name: "Identity & Meaning",
    iconVariant: "sage" as const,
    tools: [
      { id: "values" as ActiveTool, name: "Values Clarification", description: "Discover and prioritize what truly matters to you", icon: Heart },
      { id: "narrative" as ActiveTool, name: "Narrative Identity", description: "Author your life story with meaning and purpose", icon: BookOpen },
      { id: "existential" as ActiveTool, name: "Existential Inquiry", description: "Explore life's ultimate questions with depth", icon: Compass },
      { id: "stance" as ActiveTool, name: "Philosophical Stance", description: "Map your intellectual positions and worldview", icon: MapPin }
    ]
  }
];

const ALL_TOOLS = TOOL_CATEGORIES.flatMap(cat => cat.tools);

export default function AdvancedToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("logic");

  return (
    <>
      <SEO 
        title="Advanced Exploration Tools - The Genuine Love Project" 
        description="Thoughtful tools for gentle self-discovery. Explore logic, ethics, identity, and meaning at your own pace with compassionate guidance." 
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
                <h1 className="text-heading-xl text-teal">Advanced Exploration Tools</h1>
                <p className="text-body-sm">Gentle yet powerful instruments for self-discovery. Explore logic, ethics, identity, and meaning—at your own pace, in your own way.</p>
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
