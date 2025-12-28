import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO.jsx";
import StateTracker from "../components/StateTracker.jsx";

export default function StatePage() {
  return (
    <div className="min-h-screen bg-[var(--glp-paper)]">
      <SEO 
        title="State Check-in" 
        description="Notice your current state without judgment. Track energy, clarity, openness, regulation, and presence."
      />

      <div className="mx-auto max-w-xl px-6 py-8">
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
