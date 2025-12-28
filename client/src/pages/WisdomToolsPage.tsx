import { useState } from "react";
import FrameworkExplorer from "@/components/frameworks/FrameworkExplorer";
import DialecticalInquiry from "@/components/inquiry/DialecticalInquiry";
import TemporalReflection from "@/components/temporal/TemporalReflection";
import PhilosophicalAtlas from "@/components/atlas/PhilosophicalAtlas";
import MetaCognitionStudio from "@/components/metacognition/MetaCognitionStudio";
import InsightPatternLab from "@/components/patterns/InsightPatternLab";
import JourneyComposer from "@/components/journey/JourneyComposer";
import WisdomCard from "@/components/wisdom/WisdomCard";
import { Brain, Scale, Clock, Sparkles, Map, Eye, Activity, Route } from "lucide-react";

type ActiveTool = "frameworks" | "dialectical" | "temporal" | "atlas" | "metacognition" | "patterns" | "journey" | "wisdom";

const TOOLS: { id: ActiveTool; name: string; description: string; icon: typeof Brain }[] = [
  {
    id: "journey",
    name: "Journey Composer",
    description: "Compose intentional sequences of reflection tools",
    icon: Route,
  },
  {
    id: "frameworks",
    name: "Cognitive Frameworks",
    description: "Mental models from philosophy, psychology, and systems",
    icon: Brain,
  },
  {
    id: "atlas",
    name: "Philosophical Atlas",
    description: "Inquiry paths from 12 wisdom traditions",
    icon: Map,
  },
  {
    id: "dialectical",
    name: "Dialectical Inquiry",
    description: "Thesis, antithesis, synthesis exploration",
    icon: Scale,
  },
  {
    id: "temporal",
    name: "Temporal Reflection",
    description: "Past, present, future integration",
    icon: Clock,
  },
  {
    id: "metacognition",
    name: "Meta-Cognition Studio",
    description: "Bias detection, assumption audits, abstraction",
    icon: Eye,
  },
  {
    id: "patterns",
    name: "Pattern Lab",
    description: "Observe patterns in your tracked states",
    icon: Activity,
  },
  {
    id: "wisdom",
    name: "Daily Wisdom",
    description: "Cross-tradition insights for contemplation",
    icon: Sparkles,
  },
];

export default function WisdomToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("journey");

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold leading-tight">Wisdom Tools</h1>
          <p className="mt-2 text-sm opacity-80">
            Intellectual frameworks for deeper self-inquiry — not prescriptions, but lenses to try on.
          </p>
        </header>

        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-black/10 hover:bg-white/5"
                }`}
                data-testid={`button-tool-${tool.id}`}
              >
                <Icon className={`h-4 w-4 mb-1.5 ${isActive ? "opacity-100" : "opacity-60"}`} />
                <div className="font-medium text-xs">{tool.name}</div>
                <div className="text-[10px] opacity-60 mt-0.5 hidden lg:block leading-tight">{tool.description}</div>
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
          {activeTool === "journey" && <JourneyComposer />}
          {activeTool === "frameworks" && <FrameworkExplorer />}
          {activeTool === "atlas" && <PhilosophicalAtlas />}
          {activeTool === "dialectical" && <DialecticalInquiry />}
          {activeTool === "temporal" && <TemporalReflection />}
          {activeTool === "metacognition" && <MetaCognitionStudio />}
          {activeTool === "patterns" && <InsightPatternLab />}
          {activeTool === "wisdom" && (
            <div className="space-y-6">
              <WisdomCard mode="daily" />
              <WisdomCard mode="random" />
              <p className="text-xs opacity-50 text-center">
                These are offerings, not prescriptions. Take what serves you.
              </p>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs opacity-50">
            All reflection data stays in your browser. You remain the authority on your own experience.
          </p>
        </footer>
      </div>
    </div>
  );
}
