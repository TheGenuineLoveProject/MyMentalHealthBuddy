import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Focus, Flame, Brain, Trophy } from "lucide-react";
import DeepWorkTracker from "@/components/mastery/DeepWorkTracker";
import SkillForge from "@/components/mastery/SkillForge";
import MentalModelsLibrary from "@/components/mastery/MentalModelsLibrary";
import SEO from "@/components/SEO";

type ActiveTool = "deepwork" | "skills" | "models";

const TOOLS = [
  {
    id: "deepwork" as ActiveTool,
    name: "Deep Work Tracker",
    description: "Gently track focused sessions at your own rhythm—notice what helps you concentrate without judgment",
    icon: Focus,
  },
  {
    id: "skills" as ActiveTool,
    name: "Skill Forge",
    description: "Explore deliberate practice at your own pace—growth happens in seasons, not straight lines",
    icon: Flame,
  },
  {
    id: "models" as ActiveTool,
    name: "Mental Models Library",
    description: "Discover thinking frameworks when you're ready—tools to support clarity, not add pressure",
    icon: Brain,
  }
];

export default function MasteryToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("deepwork");

  return (
    <>
      <SEO 
        title="Mastery Tools - The Genuine Love Project" 
        description="Deep work tracking, deliberate practice, and mental models for becoming excellent at what matters." 
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
              <div className="icon-container icon-lg icon-gradient-teal">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-heading-xl text-teal">Mastery Tools</h1>
                <p className="text-body-sm">Gentle instruments for focused growth. Use at your own pace—there's no pressure here, only support for becoming who you want to be.</p>
              </div>
            </div>
          </header>

          <nav className="grid grid-cols-3 gap-4 mb-8">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    isActive
                      ? "border-[var(--sage-400)] bg-white shadow-md"
                      : "border-[var(--sage-200)] bg-white/60 hover:bg-white hover:shadow-sm"
                  }`}
                  data-testid={`button-tool-${tool.id}`}
                >
                  <div className={`icon-container icon-md ${isActive ? 'icon-gradient-teal' : 'icon-soft-teal'} mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`font-semibold text-sm ${isActive ? 'text-[var(--teal-700)]' : 'text-[var(--teal-600)]'}`}>
                    {tool.name}
                  </div>
                  <div className="text-xs text-[var(--teal-500)] mt-1 leading-tight">
                    {tool.description}
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="card-bordered">
            {activeTool === "deepwork" && <DeepWorkTracker />}
            {activeTool === "skills" && <SkillForge />}
            {activeTool === "models" && <MentalModelsLibrary />}
          </div>

          <footer className="mt-8 text-center space-y-2">
            <p className="text-caption">
              All data stays in your browser. Mastery is earned through consistent practice.
            </p>
            <p className="text-[11px] text-[var(--teal-400)] italic">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
