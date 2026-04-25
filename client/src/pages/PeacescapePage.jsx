import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Map, Heart, Wand2 } from "lucide-react";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import ZenScape from "@/components/zen/ZenScape";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { apiRequest } from "@/lib/queryClient";
import { useSEO } from "@/hooks/useSEO";

const ROADMAP_TEASERS = [
  { phase: "Phase 1", title: "Sanctuary foundation", body: "A quiet, breathing scape. Buddy beside you. Tenure-aware copy." },
  { phase: "Phase 2", title: "Avatar customizer",   body: "Choose your Buddy's palette and accessory. Small, gentle expressions of self." },
  { phase: "Phase 3", title: "Scape evolution",     body: "Your sanctuary grows with each reflection — meadow → grove → forest → cathedral." },
  { phase: "Phase 4", title: "Learning curriculum", body: "Bite-sized, trauma-informed micro-lessons that unlock alongside you." },
  { phase: "Phase 5", title: "Enlightenment journey", body: "A long-arc map of your inner work — chapters, not levels." },
  { phase: "Phase 6", title: "360° support fabric", body: "Your sanctuary, your check-ins, and your Buddy — woven together as one companion." },
];

export default function PeacescapePage() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: "Peace Scape — Your sanctuary, growing with you | The Genuine Love Project",
    description:
      "A gentle, evolving sanctuary that grows with every reflection. Customize your Buddy. Tend your inner space. Your forever companion's home.",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest("GET", "/api/peacescape/state");
        const data = await res.json();
        if (!cancelled) setState(data);
      } catch {
        if (!cancelled) setState({ ok: false, scape: { palette: "sage", theme: "meadow", accessory: "none" }, stage: { stage: 1, label: "Seed Garden", description: "A quiet patch of meadow." }, journalCount: 0, starter: true, tagline: "Your sanctuary is ready." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const scape = state?.scape || { palette: "sage", theme: "meadow", accessory: "none" };
  const stage = state?.stage || { stage: 1, label: "Seed Garden", description: "" };
  const next = state?.nextStage || null;
  const journalCount = state?.journalCount ?? 0;
  const tagline = state?.tagline || "A sanctuary that grows with you.";

  const progressPct = next
    ? Math.min(100, Math.round(((journalCount - (stage.unlockAt || 0)) / Math.max(1, next.unlockAt - (stage.unlockAt || 0))) * 100))
    : 100;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 50%, var(--glp-paper) 100%)" }}
      data-testid="page-peacescape"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 transition-colors mb-8"
          style={{ color: "var(--glp-sage-deep)" }}
          data-testid="link-back-home"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Hero — sanctuary preview with Buddy */}
        <ZenScape
          buddyState="calm"
          buddySize={200}
          buddyLabel="This is your space. We tend it together — one breath, one reflection at a time."
          className="mb-12 py-12"
        >
          <div className="text-center px-4 max-w-3xl mx-auto">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--glp-sage-deep)" }}
              data-testid="text-peacescape-title"
            >
              Your Peace Scape
            </h1>
            <p className="text-lg italic" style={{ color: "var(--glp-sage-deep)", opacity: 0.85 }} data-testid="text-peacescape-tagline">
              {tagline}
            </p>
          </div>
        </ZenScape>

        {/* Sanctuary state card */}
        <div
          className="rounded-3xl p-8 mb-10"
          style={{ background: "var(--glp-paper)", boxShadow: "0 10px 40px -20px rgba(45, 80, 60, 0.18)", border: "1px solid var(--glp-sage-10)" }}
          data-testid="card-sanctuary-state"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <BuddyAvatar state="calm" size={140} ariaLabel={`Your Buddy in the ${stage.label}`} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-3"
                style={{ background: "var(--glp-sage-10)", color: "var(--glp-sage-deep)" }}
                data-testid="badge-evolution-stage"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Stage {stage.stage} — {stage.label}
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--glp-sage-deep)" }} data-testid="text-stage-name">
                {stage.label}
              </h2>
              <p className="text-base mb-4" style={{ color: "var(--glp-ink)", opacity: 0.78 }} data-testid="text-stage-description">
                {stage.description || "A sanctuary for your inner work."}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm" style={{ color: "var(--glp-ink)", opacity: 0.7 }}>
                <span data-testid="text-palette">Palette: <strong style={{ color: "var(--glp-sage-deep)" }}>{scape.palette}</strong></span>
                <span aria-hidden="true">·</span>
                <span data-testid="text-theme">Theme: <strong style={{ color: "var(--glp-sage-deep)" }}>{scape.theme}</strong></span>
                <span aria-hidden="true">·</span>
                <span data-testid="text-accessory">Accessory: <strong style={{ color: "var(--glp-sage-deep)" }}>{scape.accessory}</strong></span>
              </div>

              {next && (
                <div className="mt-6" data-testid="block-next-stage">
                  <div className="flex justify-between text-sm mb-2" style={{ color: "var(--glp-ink)", opacity: 0.7 }}>
                    <span>Next: {next.label}</span>
                    <span>{journalCount} / {next.unlockAt} reflections</span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--glp-sage-10)" }}
                    role="progressbar"
                    aria-valuenow={progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, var(--glp-sage), var(--glp-sage-deep))" }}
                    />
                  </div>
                  <p className="text-xs mt-2 italic" style={{ color: "var(--glp-ink)", opacity: 0.6 }}>
                    No pressure. Your sanctuary unfolds at your pace.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-sm mb-8" style={{ color: "var(--glp-ink)", opacity: 0.6 }} data-testid="status-loading">
            Tending the sanctuary…
          </div>
        )}

        {/* Roadmap teaser */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Map className="h-5 w-5" style={{ color: "var(--glp-sage-deep)" }} />
            <h2 className="text-2xl font-bold" style={{ color: "var(--glp-sage-deep)" }} data-testid="text-roadmap-title">
              The Sanctuary's Path
            </h2>
          </div>
          <p className="mb-6 text-base" style={{ color: "var(--glp-ink)", opacity: 0.78 }}>
            Peace Scape is being woven slowly and intentionally. Here is the long arc — published openly so you always
            know where we are heading together.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROADMAP_TEASERS.map((p, i) => (
              <div
                key={p.phase}
                className="rounded-2xl p-5"
                style={{
                  background: i === 0 ? "var(--glp-sage-10)" : "var(--glp-paper)",
                  border: "1px solid var(--glp-sage-10)",
                  boxShadow: "0 4px 16px -8px rgba(45, 80, 60, 0.12)",
                }}
                data-testid={`card-roadmap-phase-${i + 1}`}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: i === 0 ? "var(--glp-sage-deep)" : "var(--glp-sage)" }}
                >
                  {p.phase}{i === 0 && " · live now"}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--glp-sage-deep)" }}>{p.title}</h3>
                <p className="text-sm" style={{ color: "var(--glp-ink)", opacity: 0.75 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Soft callouts */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div
            className="rounded-2xl p-6 flex gap-4 items-start"
            style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-sage-10)" }}
            data-testid="callout-customizer"
          >
            <Wand2 className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: "var(--glp-sage-deep)" }} />
            <div>
              <h3 className="font-bold mb-1" style={{ color: "var(--glp-sage-deep)" }}>Avatar customizer (coming soon)</h3>
              <p className="text-sm" style={{ color: "var(--glp-ink)", opacity: 0.78 }}>
                Choose your Buddy's palette and accessory. Small, considered ways to make this companion feel like yours.
              </p>
            </div>
          </div>
          <div
            className="rounded-2xl p-6 flex gap-4 items-start"
            style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-sage-10)" }}
            data-testid="callout-companion"
          >
            <Heart className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: "var(--glp-sage-deep)" }} />
            <div>
              <h3 className="font-bold mb-1" style={{ color: "var(--glp-sage-deep)" }}>A forever companion</h3>
              <p className="text-sm" style={{ color: "var(--glp-ink)", opacity: 0.78 }}>
                This space is built to be slow on purpose. Buddy stays. Your sanctuary stays. You can return any time.
              </p>
            </div>
          </div>
        </div>

        <SafetyFooter variant="prominent" />
      </div>
    </div>
  );
}
