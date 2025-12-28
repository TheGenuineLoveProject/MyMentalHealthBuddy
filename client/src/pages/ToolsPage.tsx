import { useState } from "react";
import BeliefMapper from "@/components/beliefs/BeliefMapper";
import TimedSession from "@/components/flow/TimedSession";
import SilenceMode from "@/components/consciousness/SilenceMode";
import QuestionReflection from "@/components/consciousness/QuestionReflection";
import GrowthTimeline from "@/components/growth/GrowthTimeline";
import ExportPanel from "@/components/export/ExportPanel";

type Tool = "beliefs" | "timed" | "silence" | "questions" | "timeline" | "export";

const TOOLS: { id: Tool; name: string; description: string }[] = [
  { id: "beliefs", name: "Belief Mapping", description: "Track patterns in your thinking" },
  { id: "timed", name: "Timed Writing", description: "Flow state writing sessions" },
  { id: "silence", name: "Silence Mode", description: "Private writing, no output" },
  { id: "questions", name: "Question Reflection", description: "Socratic self-inquiry" },
  { id: "timeline", name: "Growth Timeline", description: "Your personal evolution" },
  { id: "export", name: "Export Data", description: "Download your reflections" },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  function handleTimedComplete(text: string, duration: number) {
    const key = "glp_timed_sessions";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const entry = {
      id: Date.now().toString(),
      text,
      duration,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 50)));
    setActiveTool(null);
  }

  if (activeTool) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => setActiveTool(null)}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground"
            data-testid="button-back-to-tools"
          >
            &larr; Back to tools
          </button>

          {activeTool === "beliefs" && <BeliefMapper />}
          {activeTool === "timed" && (
            <TimedSession
              onComplete={handleTimedComplete}
              onCancel={() => setActiveTool(null)}
            />
          )}
          {activeTool === "silence" && <SilenceMode />}
          {activeTool === "questions" && <QuestionReflection />}
          {activeTool === "timeline" && <GrowthTimeline />}
          {activeTool === "export" && <ExportPanel />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Reflection Tools</h1>
          <p className="mt-2 text-muted-foreground">
            A gentle toolkit for self-discovery. Use what serves you.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="rounded-xl border p-5 text-left hover:bg-muted/50 transition-colors"
              data-testid={`button-tool-${tool.id}`}
            >
              <div className="font-medium">{tool.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {tool.description}
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          These tools are for reflection, not therapy. You know yourself best.
        </p>
      </div>
    </div>
  );
}
