import { useState } from "react";
import FrameworkExplorer from "@/components/frameworks/FrameworkExplorer";
import DialecticalInquiry from "@/components/inquiry/DialecticalInquiry";
import TemporalReflection from "@/components/temporal/TemporalReflection";
import WisdomCard from "@/components/wisdom/WisdomCard";
import { Brain, Scale, Clock, Sparkles } from "lucide-react";

type ActiveTool = "frameworks" | "dialectical" | "temporal" | "wisdom";

const TOOLS: { id: ActiveTool; name: string; description: string; icon: typeof Brain }[] = [
  {
    id: "frameworks",
    name: "Cognitive Frameworks",
    description: "Mental models from philosophy, psychology, and systems thinking",
    icon: Brain,
  },
  {
    id: "dialectical",
    name: "Dialectical Inquiry",
    description: "Explore truth through thesis, antithesis, and synthesis",
    icon: Scale,
  },
  {
    id: "temporal",
    name: "Temporal Reflection",
    description: "Integrate perspectives across past, present, and future",
    icon: Clock,
  },
  {
    id: "wisdom",
    name: "Daily Wisdom",
    description: "Cross-tradition insights for contemplation",
    icon: Sparkles,
  },
];

export default function WisdomToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("frameworks");

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold leading-tight">Wisdom Tools</h1>
          <p className="mt-2 text-sm opacity-80">
            Intellectual frameworks for deeper self-inquiry — not prescriptions, but lenses to try on.
          </p>
        </header>

        <nav className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-black/10 hover:bg-white/5"
                }`}
                data-testid={`button-tool-${tool.id}`}
              >
                <Icon className={`h-5 w-5 mb-2 ${isActive ? "opacity-100" : "opacity-60"}`} />
                <div className="font-medium text-sm">{tool.name}</div>
                <div className="text-xs opacity-60 mt-1 hidden sm:block">{tool.description}</div>
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
          {activeTool === "frameworks" && <FrameworkExplorer />}
          {activeTool === "dialectical" && <DialecticalInquiry />}
          {activeTool === "temporal" && <TemporalReflection />}
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
