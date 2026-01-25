import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Target, Timer, VolumeX, HelpCircle, TrendingUp, Download, Sparkles, Phone, Shield } from "lucide-react";
import BeliefMapper from "@/components/beliefs/BeliefMapper";
import TimedSession from "@/components/flow/TimedSession";
import SilenceMode from "@/components/consciousness/SilenceMode";
import QuestionReflection from "@/components/consciousness/QuestionReflection";
import GrowthTimeline from "@/components/growth/GrowthTimeline";
import ExportPanel from "@/components/export/ExportPanel";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import { useReadingLevel } from "@/context/ReadingLevelContext";
import { Hero } from "@/components/ui";
import Microcopy from "@/components/Microcopy";

const TOOLS = [
  { id: "beliefs", name: "Belief Mapping", description: "Uncover hidden patterns in your thinking that shape your reality", icon: Target, effort: "10-15 min", level: "beginner" },
  { id: "timed", name: "Timed Writing", description: "Enter a flow state with focused, distraction-free writing sessions", icon: Timer, effort: "5-20 min", level: "beginner" },
  { id: "silence", name: "Silence Mode", description: "Write without saving—pure processing for what needs to move through you", icon: VolumeX, effort: "Any length", level: "intermediate" },
  { id: "questions", name: "Question Reflection", description: "Powerful Socratic questions that gently guide you toward insight", icon: HelpCircle, effort: "10-20 min", level: "intermediate" },
  { id: "timeline", name: "Growth Timeline", description: "Witness your evolution—see how far you've come over time", icon: TrendingUp, effort: "5-10 min", level: "beginner" },
  { id: "export", name: "Export Your Journey", description: "Download your reflections, insights, and progress safely", icon: Download, effort: "2-5 min", level: "beginner" },
];

const HERO_COPY = {
  beginner: {
    title: "Simple tools for",
    titleHighlight: "self-reflection.",
    subtitle: "These gentle practices may help you understand yourself better. Use what feels right for you.",
    helperLine: "You can stop or pause at any time."
  },
  intermediate: {
    title: "Reflection tools for",
    titleHighlight: "deeper insight.",
    subtitle: "A curated collection of journaling and reflection practices. Some people find these helpful for processing thoughts and feelings.",
    helperLine: "Take breaks whenever you need them."
  },
  advanced: {
    title: "Your personal",
    titleHighlight: "reflection toolkit.",
    subtitle: "Evidence-informed tools for self-discovery, belief examination, and growth tracking. Designed for consistent practice over time.",
    helperLine: "These are reflective exercises, not therapy."
  }
};

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState(null);
  const { readingLevel } = useReadingLevel();
  const heroCopy = HERO_COPY[readingLevel] || HERO_COPY.beginner;

  function handleTimedComplete(text, duration) {
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
        <div className="min-h-screen bg-[var(--glp-paper)] px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <button
              onClick={() => setActiveTool(null)}
              className="mb-6 flex items-center gap-2 text-sm text-[var(--glp-sage)] hover:text-[var(--glp-sage-deep)] transition"
              data-testid="button-back-to-tools"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to tools
            </button>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--glp-sage-10)]">
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

            <div className="mt-8 p-4 bg-[var(--glp-sage-10)] rounded-lg text-center">
              <p className="text-sm text-[var(--glp-ink)]/70 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Your reflections stay on your device unless you choose to export them.
              </p>
            </div>
          </div>
        </div>
        <SafetyFooter />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Reflection Tools - The Genuine Love Project" 
        description="A gentle toolkit for self-discovery including belief mapping, timed writing, and growth tracking." 
      />
      <div className="min-h-screen bg-[var(--glp-paper)]">
        <Hero
          eyebrow="Reflection Toolkit"
          title={heroCopy.title}
          titleHighlight={heroCopy.titleHighlight}
          subtitle={heroCopy.subtitle}
          helperLine={heroCopy.helperLine}
        />

        <div className="px-4 pb-16">
          <div className="mx-auto max-w-3xl">
            <BenefitsBlock
              benefit="Agency, gentle habits, and your pace"
              duration="Varies by tool"
              control="Pause or stop anytime"
              disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
              variant="minimal"
              className="mb-8"
            />
            <p className="text-center text-sm text-[var(--glp-ink)]/60 italic mb-8">
              <Microcopy slot="consent" seed="tools-page" as="span" />
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className="bg-white rounded-xl p-6 text-left shadow-sm border border-[var(--glp-sage-10)] hover:shadow-md hover:border-[var(--glp-sage-30)] transition-all group"
                    data-testid={`button-tool-${tool.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--glp-sage-10)] flex items-center justify-center group-hover:bg-[var(--glp-sage-20)] transition-colors">
                        <Icon className="w-5 h-5 text-[var(--glp-sage-deep)]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[var(--glp-sage-deep)]">{tool.name}</div>
                        <div className="text-sm text-[var(--glp-ink)]/70 mt-1">{tool.description}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-[var(--glp-sage)] bg-[var(--glp-sage-10)] px-2 py-0.5 rounded-full">
                            {tool.effort}
                          </span>
                          <span className="text-xs text-[var(--glp-ink)]/50 capitalize">
                            {tool.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-[var(--glp-blush-50)] rounded-xl border border-[var(--glp-blush-100)]">
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[var(--glp-sage-deep)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[var(--glp-ink)]">
                    If you're in crisis or need immediate support
                  </p>
                  <p className="text-sm text-[var(--glp-ink)]/70 mt-1">
                    Call or text <strong>988</strong> (Suicide & Crisis Lifeline) or text <strong>HOME</strong> to <strong>741741</strong> (Crisis Text Line).
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-[var(--glp-ink)]/60">
              These tools are for reflection and self-discovery, not therapy. You know yourself best.
            </p>
          </div>
        </div>
      </div>
      <SafetyFooter />
    </>
  );
}
