import { useMemo, useState } from "react";
import BuddyPanel from "@/components/avatar/BuddyPanel";
import { BUDDY_PANEL_COPY } from "@/content/microcopy/wellnessMicrocopy";

const STATE_DIMENSIONS = [
  { key: "energy", label: "Energy", hint: "low → steady → high" },
  { key: "clarity", label: "Clarity", hint: "foggy → present → sharp" },
  { key: "safety", label: "Safety", hint: "unsafe → okay → safe" },
  { key: "connection", label: "Connection", hint: "isolated → open → connected" },
  { key: "agency", label: "Agency", hint: "stuck → able → empowered" }
];

function scoreLabel(v) {
  if (v <= 2) return "Low / Tender";
  if (v <= 4) return "Neutral / Mixed";
  return "Steady / Strong";
}

function suggestionFromState(state) {
  const entries = Object.entries(state);
  const lowest = entries.sort((a, b) => a[1] - b[1])[0];
  const [k] = lowest;

  const map = {
    energy: "Try a body reset: water + small snack + 5 minutes of gentle movement.",
    clarity: 'Try a clarity reset: write one sentence: "Right now, what matters most is…"',
    safety: "Try safety first: breathe out longer than you breathe in (exhale 6, inhale 4).",
    connection: 'Try connection: send one low-pressure message: "Thinking of you—no need to respond fast."',
    agency: "Try agency: pick ONE tiny step (2 minutes) and do it before thinking more."
  };
  return map[k] || "Be kind to yourself. Small steps count.";
}

export default function StatePage() {
  const [state, setState] = useState({
    energy: 3,
    clarity: 3,
    safety: 3,
    connection: 3,
    agency: 3
  });

  const summary = useMemo(() => {
    const avg =
      (state.energy + state.clarity + state.safety + state.connection + state.agency) / 5;
    return { avg: Math.round(avg * 10) / 10, suggestion: suggestionFromState(state) };
  }, [state]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* MMHB Buddy v2.0 — friction-reducing companion for the state-tracker
          surface. The page asks the user to expose 5 vulnerability dimensions
          (energy, clarity, safety, connection, agency) on sliders. Buddy at
          calm baseline reduces felt isolation during self-assessment.
          Smaller (88px) so Buddy is a presence, not the centerpiece.
          Visual-only — no fetch, no inference from slider values, no
          profile/streak/paywall logic per BuddyPanel contract. */}
      <BuddyPanel
        state="calm"
        title={BUDDY_PANEL_COPY.mood.title}
        titleAs="p"
        subtitle={BUDDY_PANEL_COPY.mood.subtitle}
        surface="mood"
        size={88}
        className="mb-6"
        data-testid="panel-buddy-state"
      />
      <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-neutral-500">State Tracker</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
          How are you, as a whole system?
        </h1>
        <p className="mt-3 text-neutral-700">
          This is not "mood." It's your current internal conditions — so the app can support you with
          the right kind of care.
        </p>

        <div className="mt-6 space-y-5">
          {STATE_DIMENSIONS.map((d) => (
            <div key={d.key} className="rounded-xl border bg-white p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="font-medium text-neutral-900">{d.label}</div>
                  <div className="text-sm text-neutral-500">{d.hint}</div>
                </div>
                <div className="text-sm text-neutral-700">{scoreLabel(state[d.key])}</div>
              </div>

              <input
                data-testid={`slider-${d.key}`}
                className="mt-3 w-full"
                type="range"
                min="1"
                max="5"
                value={state[d.key]}
                onChange={(e) => setState((s) => ({ ...s, [d.key]: Number(e.target.value) }))}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-neutral-900 p-4 text-white">
          <div className="text-sm opacity-80">State average</div>
          <div className="text-2xl font-semibold" data-testid="text-state-average">{summary.avg} / 5</div>
          <div className="mt-2 text-sm opacity-90" data-testid="text-suggestion">{summary.suggestion}</div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a 
            data-testid="link-journal-from-state"
            className="rounded-xl bg-white px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-50" 
            href="/journal"
          >
            Journal from this state
          </a>
          <a 
            data-testid="link-go-today"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50" 
            href="/today"
          >
            Go to Today's Insight
          </a>
        </div>
      </div>
    </div>
  );
}
