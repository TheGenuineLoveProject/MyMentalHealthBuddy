import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, Scale, Clock, Sparkles, Map, Eye, Activity, Route, BookOpen } from "lucide-react";
import FrameworkExplorer from "@/components/frameworks/FrameworkExplorer";
import DialecticalInquiry from "@/components/inquiry/DialecticalInquiry";
import TemporalReflection from "@/components/temporal/TemporalReflection";
import PhilosophicalAtlas from "@/components/atlas/PhilosophicalAtlas";
import MetaCognitionStudio from "@/components/metacognition/MetaCognitionStudio";
import InsightPatternLab from "@/components/patterns/InsightPatternLab";
import JourneyComposer from "@/components/journey/JourneyComposer";
import WisdomCard from "@/components/wisdom/WisdomCard";
import SEO from "@/components/SEO";

type ActiveTool = "frameworks" | "dialectical" | "temporal" | "atlas" | "metacognition" | "patterns" | "journey" | "wisdom";

const TOOLS: { id: ActiveTool; name: string; description: string; icon: typeof Brain }[] = [
  {
    id: "journey",
    name: "Journey Composer",
    description: "Design personalized healing sequences combining multiple tools for deeper transformation",
    icon: Route,
  },
  {
    id: "frameworks",
    name: "Cognitive Frameworks",
    description: "Master mental models from philosophy, psychology, and systems thinking to transform how you see the world",
    icon: Brain,
  },
  {
    id: "atlas",
    name: "Philosophical Atlas",
    description: "Explore inquiry paths from Stoicism, Buddhism, Taoism, and 12 other wisdom traditions",
    icon: Map,
  },
  {
    id: "dialectical",
    name: "Dialectical Inquiry",
    description: "Hold thesis and antithesis together to arrive at deeper synthesis and understanding",
    icon: Scale,
  },
  {
    id: "temporal",
    name: "Temporal Reflection",
    description: "Integrate lessons from your past, presence in now, and vision for your future self",
    icon: Clock,
  },
  {
    id: "metacognition",
    name: "Meta-Cognition Studio",
    description: "Detect hidden biases, audit unconscious assumptions, and elevate your thinking",
    icon: Eye,
  },
  {
    id: "patterns",
    name: "Pattern Lab",
    description: "Discover recurring themes and cycles in your emotional and behavioral patterns",
    icon: Activity,
  },
  {
    id: "wisdom",
    name: "Daily Wisdom",
    description: "Receive timeless insights from across traditions—Rumi, Marcus Aurelius, Lao Tzu, and more",
    icon: Sparkles,
  },
];

export default function WisdomToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("journey");

  return (
    <>
      <SEO 
        title="Wisdom Tools - The Genuine Love Project" 
        description="Timeless wisdom from across traditions. Explore cognitive frameworks, philosophical inquiry, and contemplative practices at your own pace." 
      />
      <div className="min-h-screen hero-gradient px-4 py-10">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="icon-container icon-lg icon-gradient-gold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-heading-xl text-teal">Wisdom Tools</h1>
                <p className="text-body-sm">Intellectual frameworks for deeper self-inquiry — not prescriptions, but lenses to try on.</p>
              </div>
            </div>
          </header>

          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-[var(--sage-400)] bg-white shadow-md"
                      : "border-[var(--sage-200)] bg-white/60 hover:bg-white hover:shadow-sm"
                  }`}
                  data-testid={`button-tool-${tool.id}`}
                >
                  <div className={`icon-container icon-sm ${isActive ? 'icon-gradient-sage' : 'icon-soft-sage'} mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className={`font-medium text-sm ${isActive ? 'text-[var(--teal-700)]' : 'text-[var(--teal-600)]'}`}>
                    {tool.name}
                  </div>
                  <div className="text-[11px] text-[var(--teal-500)] mt-0.5 hidden lg:block leading-tight">
                    {tool.description}
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="card-bordered">
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
                <p className="text-caption text-center">
                  These are offerings, not prescriptions. Take what serves you.
                </p>
              </div>
            )}
          </div>

          <footer className="mt-8 text-center">
            <p className="text-caption">
              All reflection data stays in your browser. You remain the authority on your own experience.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
