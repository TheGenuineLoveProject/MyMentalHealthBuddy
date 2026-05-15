import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Target, Timer, VolumeX, HelpCircle, TrendingUp, Download, Phone, Shield } from 'lucide-react';
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
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const TOOLS_CLARITY = {
  what: "A collection of gentle self-reflection tools including belief mapping, timed writing, silence mode, and growth tracking.",
  who: "Anyone seeking to understand themselves better through structured reflection practices.",
  when: "When you want dedicated time for self-discovery, processing thoughts, or tracking personal growth.",
  why: "Reflection helps you notice patterns, process emotions, and build self-awareness over time.",
  howSteps: [
    "Choose a tool that matches your current need or mood",
    "Set aside uninterrupted time (5-20 minutes)",
    "Engage with the prompts or exercises honestly",
    "Review your insights and notice any patterns"
  ],
  whereLinkText: "Explore the System Map",
  whereHref: "/system-map"
};

const TOOLS_EXAMPLES = [
  {
    level: "beginner",
    title: "Starting your first reflection",
    situation: "You're feeling uncertain and want to explore your thoughts but don't know where to start.",
    action: "Open Timed Writing, set a 5-minute timer, and write whatever comes to mind without editing.",
    result: "You discover you've been holding tension about a conversation you need to have."
  },
  {
    level: "intermediate",
    title: "Examining a recurring pattern",
    situation: "You notice you often feel drained after certain social situations.",
    action: "Use Belief Mapping to explore what you believe about social obligations and your energy.",
    result: "You identify a belief that 'good friends always say yes' that doesn't serve you."
  },
  {
    level: "advanced",
    title: "Deep processing with Silence Mode",
    situation: "You're processing a major life decision and need clarity without saving anything.",
    action: "Enter Silence Mode and write freely about your fears, hopes, and the decision for 20 minutes.",
    result: "The act of writing clarifies your values, and you feel more confident about your direction."
  }
];

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
  <WellnessPageShell
    title="ToolsPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

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
    </WellnessPageShell>
    );
  }

  return (
    <WellnessPageShell
      title="Reflection Tools"
      subtitle="A gentle toolkit for self-discovery"
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "Educational reflection tools you control.",
        why: "To support self-discovery and gentle growth.",
        who: "For adults (18+) seeking wellness tools.",
        when: "Whenever you want to reflect or process.",
        where: "Right here, in complete privacy.",
        how: "Choose a tool, use at your own pace."
      }}
      examples={[
        { label: "Beginner", examples: ["Try a 3-minute timed writing.", "Map one belief."] },
        { label: "Intermediate", examples: ["Track growth over weeks.", "Use silence mode for deep reflection."] },
        { label: "Advanced", examples: ["Export your journey.", "Create patterns of practice."] }
      ]}
    >
    <>
      <SEO 
        title="Reflection Tools - The Genuine Love Project" 
        description="A gentle toolkit for self-discovery including belief mapping, timed writing, and growth tracking." 
      />
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--glp-paper)' }}>
        <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-40 -right-40 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-gold w-[350px] h-[350px] top-1/3 -left-32 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[300px] h-[300px] bottom-20 right-10 absolute" aria-hidden="true" />
        <div className="relative z-10">
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

            <ClarityCard {...TOOLS_CLARITY} variant="compact" className="mb-6" />

            <ExamplesAccordion 
              examples={TOOLS_EXAMPLES} 
              title="See how others use these tools"
              className="mb-8"
            />

            <p className="text-center text-sm text-[var(--glp-ink)]/60 italic mb-8">
              <Microcopy slot="consent" seed="tools-page" as="span" />
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {TOOLS.map((tool, idx) => {
                const Icon = tool.icon;
                const gradients = ['icon-gradient-sage', 'icon-gradient-gold', 'icon-gradient-blush', 'icon-gradient-teal'];
                const gradientClass = gradients[idx % gradients.length];
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className="card-premium p-6 text-left transition-all group"
                    data-testid={`button-tool-${tool.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`icon-container icon-lg ${gradientClass} group-hover:scale-110 transition-transform`}
                        style={{ borderRadius: "9999px", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
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
      </div>
      <SafetyFooter />
    </>
  </WellnessPageShell>
  );
}
