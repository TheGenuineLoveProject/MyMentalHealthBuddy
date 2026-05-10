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
import LumiV6 from "@/components/lumi/LumiV6";
import SEO from "@/components/SEO";

const V6_EMOTIONS = ["joy", "love", "calm", "greeting", "empathy", "sleepy", "surprise"];
const V6_POSES    = ["default", "waving", "meditating", "celebrating", "hugging", "thinking", "listening"];
const V6_COLORS   = ["default", "yellow", "pink", "blue", "purple", "sleep", "orange"];

// V7 "Expressive Soul" — additive expression / posture controls.
const V7_MOUTHS   = ["worried", "excited", "loving", "focused", "breathing", "joy", "love", "greeting", "empathy", "sleepy", "surprise"];
const V7_EYES     = ["default", "wide", "soft", "happy", "closed"];
const V7_POSTURES = ["upright", "curious", "leaning", "relaxed", "bouncy"];

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

        {/* ---------- Section 1: LumiV6 "Living Lumi" component ---------- */}
        <section className="mb-10 rounded-2xl bg-white/70 p-6 ring-1 ring-amber-100" data-testid="section-lumiv6">
          <h2 className="mb-2 text-2xl font-semibold text-slate-900">LumiV6 — "Living Lumi"</h2>
          <p className="mb-6 text-sm text-slate-600">
            New multi-layer component (separate from BuddyAvatar). Mouse-track,
            blink, breathe, heart pulse — all opt-in via <code>animated</code> /
            <code className="mx-1">interactive</code>. Hover any avatar below
            to see eye-tracking + the gentle bounce.
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-800">Emotions</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {V6_EMOTIONS.map((e) => (
              <Cell key={e} label={e} testId={`cell-v6-emotion-${e}`}>
                <LumiV6 emotion={e} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">Poses</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {V6_POSES.map((p) => (
              <Cell key={p} label={p} testId={`cell-v6-pose-${p}`}>
                <LumiV6 pose={p} emotion="greeting" size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">Color modes</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {V6_COLORS.map((c) => (
              <Cell key={c} label={c} testId={`cell-v6-color-${c}`}>
                <LumiV6 colorMode={c} emotion="calm" size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">Speech bubbles</h3>
          <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-3">
            <div className="flex h-56 items-end justify-center">
              <LumiV6 emotion="greeting" pose="waving" size="lg" showMessage />
            </div>
            <div className="flex h-56 items-end justify-center">
              <LumiV6 emotion="empathy" size="lg" showMessage message="I'm right here. Take your time." />
            </div>
            <div className="flex h-56 items-end justify-center">
              <LumiV6 emotion="joy" pose="celebrating" size="lg" showMessage />
            </div>
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">Sizes</h3>
          <div className="flex flex-wrap items-end gap-6">
            {["sm", "md-header", "md", "lg", "xl"].map((sz) => (
              <div key={sz} className="flex flex-col items-center gap-2">
                <LumiV6 emotion="greeting" size={sz} />
                <span className="text-xs text-slate-600">{sz}</span>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">animated=false (crisis-safe)</h3>
          <div className="flex flex-wrap items-end gap-6">
            {V6_EMOTIONS.slice(0, 4).map((e) => (
              <div key={e} className="flex flex-col items-center gap-2">
                <LumiV6 emotion={e} size="lg" animated={false} interactive={false} />
                <span className="text-xs text-slate-600">{e}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- V7 "Expressive Soul" playground ---------- */}
        <section className="mb-10 rounded-2xl bg-white/70 p-6 ring-1 ring-rose-100" data-testid="section-lumiv7">
          <h2 className="mb-2 text-2xl font-semibold text-slate-900">LumiV7 — "Expressive Soul"</h2>
          <p className="mb-6 text-sm text-slate-600">
            Additive on top of V6: 5 new mouth shapes, 2 new eye variants, 5 body
            postures, 600ms emotion-morph transitions, and per-emotion heart rate.
            Every existing V6 prop still works. New props are independently
            overridable — leave any of them undefined and the value is derived
            from <code>emotion</code>.
          </p>

          <h3 className="mb-3 mt-2 text-lg font-semibold text-slate-800">
            Emotion-derived (mouth · eye · posture · heart rate)
          </h3>
          <p className="mb-3 text-sm text-slate-600">
            Each emotion auto-coordinates its mouth shape, eye variant, body
            posture, and heart pulse rate. Hover the surface to see eye-tracking.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {V6_EMOTIONS.map((e) => (
              <Cell key={e} label={e} testId={`cell-v7-derived-${e}`}>
                <LumiV6 emotion={e} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">Mouth expressions (override)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {V7_MOUTHS.map((m) => (
              <Cell key={m} label={m} testId={`cell-v7-mouth-${m}`}>
                <LumiV6 emotion="greeting" mouthExpression={m} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">Eye expressions (override)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {V7_EYES.map((eye) => (
              <Cell key={eye} label={eye} testId={`cell-v7-eye-${eye}`}>
                <LumiV6 emotion="greeting" eyeExpression={eye} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">Body postures (override)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {V7_POSTURES.map((p) => (
              <Cell key={p} label={p} testId={`cell-v7-posture-${p}`}>
                <LumiV6 emotion="greeting" posture={p} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">Heart rate (Hz override)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {[0.125, 0.25, 0.5, 1.0, 1.5].map((hz) => (
              <Cell key={hz} label={`${hz} Hz`} testId={`cell-v7-hz-${hz}`}>
                <LumiV6 emotion="calm" mouthExpression="breathing" heartHz={hz} size="lg" />
              </Cell>
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
