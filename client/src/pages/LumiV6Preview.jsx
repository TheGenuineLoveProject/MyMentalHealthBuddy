/**
 * LumiV6Preview — /v6
 *
 * Side-by-side preview of overlay={false} (current PNG-only) vs
 * overlay={true} (V6 CSS face system). Iterate on positioning,
 * colors, and emotion-gated mouth here without touching production
 * surfaces.
 *
 * Public route, no auth — purely a design tool.
 */
import { Link } from "wouter";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import SEO from "@/components/SEO";

const STATES = ["calm", "encouraged", "celebrate", "sad", "anxious", "crisis"];
const COLORS = ["default", "yellow", "pink", "blue", "purple", "orange", "sleep"];
const POSES  = ["default", "meditating", "celebrating", "waving"];

function Cell({ label, children, testId }) {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm"
      data-testid={testId}
    >
      <div className="flex h-40 w-40 items-center justify-center">
        {children}
      </div>
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </div>
  );
}

export default function LumiV6Preview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <SEO
        title="Lumi V6 Overlay Preview"
        description="Internal preview of the V6 CSS overlay system."
      />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-6 flex items-center justify-between text-sm">
          <Link href="/dashboard" className="text-emerald-800 hover:underline" data-testid="link-back-dashboard">
            ← Back to Dashboard
          </Link>
          <Link
            href="/crisis"
            className="rounded-md bg-rose-50 px-3 py-1 font-semibold text-rose-700 hover:bg-rose-100"
            data-testid="link-crisis"
          >
            Crisis Support
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900" data-testid="text-title">
            Lumi V6 Overlay — Preview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Each row compares <code>overlay=false</code> (current PNG) with
            <code className="mx-1">overlay=true</code> (CSS face system on top).
            Faceless V5 PNGs will replace the underlying art later; until then
            the soft face-pad mutes the PNG face beneath the new CSS face.
          </p>
        </header>

        <section className="mb-10" data-testid="section-states">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">States · overlay=true</h2>
          <p className="mb-3 text-sm text-slate-600">
            Mouth appears only on celebrate/encouraged/sad (Hello Kitty rule).
            Crisis stays motionless — eyes don't blink, heart doesn't pulse.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {STATES.map((s) => (
              <Cell key={s} label={s} testId={`cell-state-${s}`}>
                <BuddyAvatar state={s} colorMode="default" overlay={true} size={140} />
              </Cell>
            ))}
          </div>
        </section>

        <section className="mb-10" data-testid="section-colors">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Color modes · overlay=true · state=calm</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {COLORS.map((c) => (
              <Cell key={c} label={c} testId={`cell-color-${c}`}>
                <BuddyAvatar state="calm" colorMode={c} overlay={true} size={140} />
              </Cell>
            ))}
          </div>
        </section>

        <section className="mb-10" data-testid="section-poses">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Poses · overlay=true · state=encouraged</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {POSES.map((p) => (
              <Cell key={p} label={p} testId={`cell-pose-${p}`}>
                <BuddyAvatar state="encouraged" colorMode="pink" pose={p} overlay={true} size={140} />
              </Cell>
            ))}
          </div>
        </section>

        <section className="mb-10" data-testid="section-compare">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Side-by-side · overlay off vs on</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATES.slice(0, 4).map((s) => (
              <div key={s} className="contents">
                <Cell label={`${s} · off`} testId={`cell-off-${s}`}>
                  <BuddyAvatar state={s} colorMode="default" overlay={false} size={140} />
                </Cell>
                <Cell label={`${s} · v6`} testId={`cell-v6-${s}`}>
                  <BuddyAvatar state={s} colorMode="default" overlay={true} size={140} />
                </Cell>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10" data-testid="section-sizes">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Sizes · overlay=true</h2>
          <div className="flex flex-wrap items-end gap-6">
            {["sm", "md-header", "md", "lg", "xl"].map((sz) => (
              <div key={sz} className="flex flex-col items-center gap-2">
                <BuddyAvatar state="calm" colorMode="default" overlay={true} size={sz} />
                <span className="text-xs text-slate-600">{sz}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 rounded-xl bg-white/60 p-4 text-xs text-slate-500">
          V6 formula: round body (V4 PNG) · CSS dot eyes · emotion-gated mouth ·
          warm amber heart pulse · soft matte texture · transparent background.
          Crisis state stays motionless — safety contract preserved.
        </footer>
      </div>
    </div>
  );
}
