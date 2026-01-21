import { Link } from "wouter";
import { ArrowLeft, Info } from "lucide-react";
import SEO from "../components/SEO";
import { StateTracker } from "../components/state/StateTracker.tsx";

const DIMENSION_INFO = [
  { name: "Energy", desc: "Physical and mental fuel available" },
  { name: "Clarity", desc: "How thoughts are forming and connecting" },
  { name: "Openness", desc: "Willingness to take in new information" },
  { name: "Regulation", desc: "How your nervous system is managing stimuli" },
  { name: "Presence", desc: "Connection to the current moment" },
  { name: "Pace", desc: "Internal tempo you're experiencing" },
];

export default function StatePage() {
  return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO 
        title="State Check-in — The Genuine Love Project" 
        description="Notice your current state without judgment. Track energy, clarity, openness, regulation, presence, and pace."
      />

      <div className="container-xs px-responsive py-8">
        <header className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-body-sm text-secondary hover:text-brand transition focus-ring rounded-lg px-2 py-1 mb-6"
            data-testid="link-back-dashboard"
          >
            <ArrowLeft className="icon-sm" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="icon-badge icon-badge-teal icon-circle-lg">
              <Info className="icon-md" />
            </div>
            <div className="stack-xs">
              <h1 className="text-display-sm text-brand">State Check-in</h1>
              <p className="text-body-sm text-secondary">Notice your current state without judgment</p>
            </div>
          </div>
        </header>

        <div className="mb-6 p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-[var(--glp-sage-deep)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-[var(--glp-ink)]/70 mb-3">
                State tracking observes where you are—not where you should be. 
                All positions are neutral observations, not goals.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--glp-ink)]/50">
                {DIMENSION_INFO.map((d) => (
                  <div key={d.name}>
                    <span className="font-medium text-[var(--glp-ink)]/60">{d.name}:</span>{" "}
                    {d.desc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--glp-ink)]/5 p-6 shadow-sm">
          <StateTracker />
        </div>

        <p className="mt-6 text-xs text-center text-[var(--glp-ink)]/30">
          States fluctuate. This is normal.
        </p>
      </div>
    </div>
  );
}
