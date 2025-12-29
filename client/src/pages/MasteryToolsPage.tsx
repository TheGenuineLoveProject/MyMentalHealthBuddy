import { useState } from "react";
import DeepWorkTracker from "@/components/mastery/DeepWorkTracker";
import SkillForge from "@/components/mastery/SkillForge";
import MentalModelsLibrary from "@/components/mastery/MentalModelsLibrary";
import { Focus, Flame, Brain, Target, Clock, Zap } from "lucide-react";

type ActiveTool = "deepwork" | "skills" | "models";

const TOOLS = [
  {
    id: "deepwork" as ActiveTool,
    name: "Deep Work Tracker",
    description: "Track focused work sessions",
    icon: Focus,
    color: "indigo"
  },
  {
    id: "skills" as ActiveTool,
    name: "Skill Forge",
    description: "Deliberate practice tracking",
    icon: Flame,
    color: "orange"
  },
  {
    id: "models" as ActiveTool,
    name: "Mental Models",
    description: "Frameworks for thinking",
    icon: Brain,
    color: "purple"
  }
];

export default function MasteryToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("deepwork");

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold leading-tight">Mastery Tools</h1>
          <p className="mt-2 text-sm opacity-80">
            Instruments for deep work, deliberate practice, and intellectual leverage — becoming excellent at what matters.
          </p>
        </header>

        <nav className="grid grid-cols-3 gap-3 mb-8">
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
                <div className="text-[10px] opacity-60 mt-0.5 leading-tight">{tool.description}</div>
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
          {activeTool === "deepwork" && <DeepWorkTracker />}
          {activeTool === "skills" && <SkillForge />}
          {activeTool === "models" && <MentalModelsLibrary />}
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs opacity-50">
            All data stays in your browser. Mastery is earned through consistent practice.
          </p>
          <p className="text-xs opacity-40 mt-1">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle
          </p>
        </footer>
      </div>
    </div>
  );
}
