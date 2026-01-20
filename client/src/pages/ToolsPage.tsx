import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Target, Timer, VolumeX, HelpCircle, TrendingUp, Download, Sparkles } from "lucide-react";
import BeliefMapper from "@/components/beliefs/BeliefMapper";
import TimedSession from "@/components/flow/TimedSession";
import SilenceMode from "@/components/consciousness/SilenceMode";
import QuestionReflection from "@/components/consciousness/QuestionReflection";
import GrowthTimeline from "@/components/growth/GrowthTimeline";
import ExportPanel from "@/components/export/ExportPanel";
import SEO from "@/components/SEO";

type Tool = "beliefs" | "timed" | "silence" | "questions" | "timeline" | "export";

const TOOLS: { id: Tool; name: string; description: string; icon: typeof Target }[] = [
  { id: "beliefs", name: "Belief Mapping", description: "Track patterns in your thinking", icon: Target },
  { id: "timed", name: "Timed Writing", description: "Flow state writing sessions", icon: Timer },
  { id: "silence", name: "Silence Mode", description: "Private writing, no output", icon: VolumeX },
  { id: "questions", name: "Question Reflection", description: "Socratic self-inquiry", icon: HelpCircle },
  { id: "timeline", name: "Growth Timeline", description: "Your personal evolution", icon: TrendingUp },
  { id: "export", name: "Export Data", description: "Download your reflections", icon: Download },
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
      <>
        <SEO title="Reflection Tools - The Genuine Love Project" description="Privacy-focused self-discovery tools for journaling and personal growth." />
        <div className="min-h-screen hero-gradient px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <button
              onClick={() => setActiveTool(null)}
              className="mb-6 flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition"
              data-testid="button-back-to-tools"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to tools
            </button>

            <div className="card-bordered">
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
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Reflection Tools - The Genuine Love Project" 
        description="A gentle toolkit for self-discovery including belief mapping, timed writing, and growth tracking." 
      />
      <div className="min-h-screen hero-gradient px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="icon-container icon-lg icon-gradient-sage">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-heading-xl text-teal">Reflection Tools</h1>
                <p className="text-body-sm">A gentle toolkit for self-discovery. Use what serves you.</p>
              </div>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="card-bordered p-6 text-left hover:shadow-lg hover:border-[var(--sage-300)] transition-all group"
                  data-testid={`button-tool-${tool.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="icon-container icon-md icon-soft-sage group-hover:icon-gradient-sage transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-heading-sm text-teal">{tool.name}</div>
                      <div className="text-body-sm mt-1">{tool.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-center text-caption">
            These tools are for reflection, not therapy. You know yourself best.
          </p>
        </div>
      </div>
    </>
  );
}
