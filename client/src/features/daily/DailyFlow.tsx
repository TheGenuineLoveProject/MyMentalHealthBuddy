import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, Compass, PenLine, Activity } from "lucide-react";
import { StateTracker } from "@/components/state/StateTracker";
import { journalPrompts, categoryLabels, PromptCategory } from "@/data/journalPrompts";
import SEO from "@/components/SEO";
import { sharedReflections } from "@/data/sharedReflections";
import { safeTextOrFallback } from "@/safety/languageCheck";
import { TodaysInsight } from "@/components/insight/TodaysInsight";
import { JournalingMirror } from "@/components/journal/JournalingMirror";

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>
      <TodaysInsight />
      <hr />

      <StateTracker />
      <hr />

      <JournalingMirror />
      <hr />

      <SharedReflections />
      <hr />

      <section>
        <h3>Journal prompts (optional)</h3>
        {Object.entries(journalPrompts).map(([group, prompts]) => (
          <div key={group}>
            <h4 style={{ textTransform: "capitalize" }}>{group}</h4>
            <ul>
              {prompts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
export function SharedReflections() {
  return (
    <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
      <h3>Shared Reflections (read-only)</h3>
      <p style={{ opacity: 0.8 }}>
        Anonymous reflections offered without advice, comparison, or metrics. Please take only what feels supportive.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {sharedReflections.map((r) => (
          <div key={r.id} style={{ padding: 12, borderRadius: 10, border: "1px solid #f0f0f0" }}>
            {safeTextOrFallback(
              r.text,
              "A reflection is here. Please take only what feels kind and helpful."
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

type FlowStep = "welcome" | "state" | "prompt" | "complete";

function getDailyPrompt(): { category: PromptCategory; prompt: string } {
  const categories = Object.keys(journalPrompts) as PromptCategory[];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const categoryIndex = dayOfYear % categories.length;
  const category = categories[categoryIndex];
  const prompts = journalPrompts[category];
  const promptIndex = dayOfYear % prompts.length;
  return { category, prompt: prompts[promptIndex] };
}

export function DailyFlow() {
  const [step, setStep] = useState<FlowStep>("welcome");
  const dailyPrompt = getDailyPrompt();

  return (
    <div className="min-h-screen bg-[var(--glp-paper)]">
      <SEO 
        title="Your Space Today — The Genuine Love Project" 
        description="A place to pause, notice, and reflect — only if it feels supportive."
      />

      <div className="mx-auto max-w-xl px-6 py-8">
        {/* Back navigation */}
        <nav className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-[var(--glp-ink)]/50 hover:text-[var(--glp-ink)] transition-colors"
            data-testid="link-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </nav>

        {/* Welcome / Entry */}
        {step === "welcome" && (
          <div className="space-y-8">
            <header className="space-y-3">
              <h1 
                className="text-2xl font-normal text-[var(--glp-ink)]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Your Space Today
              </h1>
              <p className="text-[var(--glp-ink)]/60 text-sm leading-relaxed">
                A place to pause, notice, and reflect — only if it feels supportive.
                <br />
                Nothing here is required. Take what serves you.
              </p>
            </header>

            {/* A thought to sit with */}
            <TodaysInsight />

            {/* Optional actions */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--glp-ink)]/40">
                If you'd like
              </p>
              
              <button
                onClick={() => setStep("state")}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-[var(--glp-ink)]/8 hover:border-[var(--glp-sage)]/30 hover:bg-[var(--glp-sage)]/5 transition-all group"
                data-testid="button-start-state"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--glp-sage)]/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[var(--glp-sage-deep)]" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[var(--glp-ink)]/80">Notice your state</div>
                    <div className="text-xs text-[var(--glp-ink)]/50">Observe without judgment</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--glp-ink)]/30 group-hover:text-[var(--glp-sage-deep)] transition-colors" />
              </button>

              <button
                onClick={() => setStep("prompt")}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-[var(--glp-ink)]/8 hover:border-[var(--glp-sage)]/30 hover:bg-[var(--glp-sage)]/5 transition-all group"
                data-testid="button-start-prompt"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--glp-sage)]/10 flex items-center justify-center">
                    <PenLine className="w-5 h-5 text-[var(--glp-sage-deep)]" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[var(--glp-ink)]/80">Today's reflection</div>
                    <div className="text-xs text-[var(--glp-ink)]/50">{categoryLabels[dailyPrompt.category]}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--glp-ink)]/30 group-hover:text-[var(--glp-sage-deep)] transition-colors" />
              </button>

              <Link
                href="/journal"
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-[var(--glp-ink)]/8 hover:border-[var(--glp-sage)]/30 hover:bg-[var(--glp-sage)]/5 transition-all group"
                data-testid="link-journal"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--glp-sage)]/10 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-[var(--glp-sage-deep)]" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[var(--glp-ink)]/80">Open journal</div>
                    <div className="text-xs text-[var(--glp-ink)]/50">Write freely</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--glp-ink)]/30 group-hover:text-[var(--glp-sage-deep)] transition-colors" />
              </Link>
            </div>

            {/* Gentle footer */}
            <p className="text-xs text-center text-[var(--glp-ink)]/30 pt-4">
              Every experience is valid. Every pace is respected.
            </p>
          </div>
        )}

        {/* State Tracking */}
        {step === "state" && (
          <div className="space-y-6">
            <button
              onClick={() => setStep("welcome")}
              className="text-sm text-[var(--glp-ink)]/50 hover:text-[var(--glp-ink)] transition-colors"
              data-testid="button-back-welcome"
            >
              ← Back
            </button>
            
            <div className="bg-white rounded-2xl border border-[var(--glp-ink)]/5 p-6 shadow-sm">
              <StateTracker onComplete={() => setStep("welcome")} />
            </div>

            <p className="text-xs text-center text-[var(--glp-ink)]/30">
              States fluctuate. This is normal.
            </p>
          </div>
        )}

        {/* Reflection Prompt */}
        {step === "prompt" && (
          <div className="space-y-6">
            <button
              onClick={() => setStep("welcome")}
              className="text-sm text-[var(--glp-ink)]/50 hover:text-[var(--glp-ink)] transition-colors"
              data-testid="button-back-welcome"
            >
              ← Back
            </button>

            <div className="bg-white rounded-2xl border border-[var(--glp-ink)]/5 p-6 shadow-sm space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--glp-ink)]/40 mb-2">
                  {categoryLabels[dailyPrompt.category]}
                </p>
                <p 
                  className="text-lg text-[var(--glp-ink)] leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  data-testid="text-daily-prompt"
                >
                  {dailyPrompt.prompt}
                </p>
              </div>

              <div>
                <label className="text-sm text-[var(--glp-ink)]/50 block mb-2">
                  Your thoughts (optional)
                </label>
                <textarea
                  placeholder="Write here if it helps..."
                  className="w-full p-4 rounded-lg border border-[var(--glp-ink)]/10 bg-[var(--glp-paper)]/50 text-[var(--glp-ink)] text-sm resize-none focus:outline-none focus:border-[var(--glp-sage-deep)]/30 placeholder:text-[var(--glp-ink)]/30"
                  rows={6}
                  data-testid="textarea-reflection"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("welcome")}
                  className="flex-1 py-3 rounded-xl border border-[var(--glp-ink)]/10 text-[var(--glp-ink)]/60 text-sm font-medium hover:bg-[var(--glp-ink)]/5 transition-colors"
                  data-testid="button-skip-prompt"
                >
                  Skip for now
                </button>
                <Link
                  href="/journal"
                  className="flex-1 py-3 rounded-xl bg-[var(--glp-sage-deep)] text-white text-sm font-medium text-center hover:bg-[var(--glp-sage-deep)]/90 transition-colors"
                  data-testid="button-continue-journal"
                >
                  Continue in journal
                </Link>
              </div>
            </div>

            <p className="text-xs text-center text-[var(--glp-ink)]/30">
              Reflection is a practice, not a performance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyFlow;
