import { useState } from "react";
import LogicLatticeLab from "@/components/logic/LogicLatticeLab";
import SystemsResonance from "@/components/systems/SystemsResonance";
import ParadoxCartographer from "@/components/paradox/ParadoxCartographer";
import SynthesisCollider from "@/components/synthesis/SynthesisCollider";
import KnowledgeWeaveMap from "@/components/weave/KnowledgeWeaveMap";
import AutodidactForge from "@/components/autodidact/AutodidactForge";
import { Network, GitBranch, Compass, Zap, Share2, Flame } from "lucide-react";

type ActiveTool = "logic" | "systems" | "paradox" | "synthesis" | "weave" | "autodidact";

const TOOLS: { id: ActiveTool; name: string; description: string; icon: typeof Network }[] = [
  {
    id: "logic",
    name: "Logic Lattice",
    description: "Map arguments and reasoning structures",
    icon: Network,
  },
  {
    id: "systems",
    name: "Systems Resonance",
    description: "Model feedback loops and system dynamics",
    icon: GitBranch,
  },
  {
    id: "paradox",
    name: "Paradox Cartographer",
    description: "Navigate tensions without forced resolution",
    icon: Compass,
  },
  {
    id: "synthesis",
    name: "Synthesis Collider",
    description: "Combine ideas through creative lenses",
    icon: Zap,
  },
  {
    id: "weave",
    name: "Knowledge Weave",
    description: "Connect concepts across domains",
    icon: Share2,
  },
  {
    id: "autodidact",
    name: "Autodidact Forge",
    description: "Design self-directed learning journeys",
    icon: Flame,
  },
];

export default function AdvancedToolsPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("logic");

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold leading-tight">Advanced Intellectual Tools</h1>
          <p className="mt-2 text-sm opacity-80">
            Deep thinking instruments for rigorous self-inquiry — logic, systems, paradox, synthesis, and lifelong learning.
          </p>
        </header>

        <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
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
                <div className="text-[10px] opacity-60 mt-0.5 hidden sm:block leading-tight">{tool.description}</div>
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
          {activeTool === "logic" && <LogicLatticeLab />}
          {activeTool === "systems" && <SystemsResonance />}
          {activeTool === "paradox" && <ParadoxCartographer />}
          {activeTool === "synthesis" && <SynthesisCollider />}
          {activeTool === "weave" && <KnowledgeWeaveMap />}
          {activeTool === "autodidact" && <AutodidactForge />}
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs opacity-50">
            All data stays in your browser. These tools are offerings for exploration — use what resonates, leave what doesn't.
          </p>
        </footer>
      </div>
    </div>
  );
}
