/* PHASE116Z2_LUMIV6PREVIEW_VISIBLE_DRIFT_PATCH */
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
import { useState, useEffect } from "react";
import { Link } from "wouter";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import LumiV6 from "@/components/lumi/LumiV6";
import SEO from "@/components/SEO";
import { LUMI_TOY_SPEC } from "@/data/lumiToySpec";
import { useLumiAudio } from "@/hooks/useLumiAudio.js";
import "@/styles/v6-preview.css";

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

// V7 emotion → expression coordination table (mirrors getLumiV6Derivation()
// in LumiV6.tsx). Used by the playground's read-only visualization.
const COORDINATION_TABLE = [
  { emotion: "greeting", mouth: "greeting",  eye: "default", posture: "upright",  hz: 0.5   },
  { emotion: "joy",      mouth: "excited",   eye: "happy",   posture: "bouncy",   hz: 1.0   },
  { emotion: "love",     mouth: "loving",    eye: "soft",    posture: "relaxed",  hz: 0.5   },
  { emotion: "calm",     mouth: "breathing", eye: "soft",    posture: "relaxed",  hz: 0.25  },
  { emotion: "empathy",  mouth: "worried",   eye: "soft",    posture: "leaning",  hz: 0.35  },
  { emotion: "sleepy",   mouth: "sleepy",    eye: "closed",  posture: "relaxed",  hz: 0.125 },
  { emotion: "surprise", mouth: "surprise",  eye: "wide",    posture: "curious",  hz: 1.5   },
];

function Cell({ label, children, testId }) {
  return (
    <div
      className="v6-preview-cell-hoverable flex flex-col items-center gap-2 rounded-2xl border border-[var(--glp-sage-15)] bg-[var(--glp-ivory)] p-4 shadow-sm"
      data-testid={testId}
    >
      <div className="flex h-40 w-40 items-center justify-center">
        {children}
      </div>
      <span className="text-xs font-medium text-[var(--glp-charcoal)]">{label}</span>
    </div>
  );
}

// PHASE11645_LUMI_PREVIEW_PALETTE_BUTTON_POLISH_PATCH
export default function LumiV6Preview() {
  return (
    <div className="v6-preview-polish min-h-screen bg-gradient-to-b from-[var(--glp-ivory)] via-[var(--glp-sage-10)] to-[var(--glp-blossom-10)]">
      {/* Workspace ambient wash — V10 §3.5 control-panel feel. */}
      <div className="v6-preview-wash" aria-hidden="true" />
      <SEO
        title="Lumi V6 Overlay Preview"
        description="Internal preview of the V6 CSS overlay system."
      />
      <div className="v6-preview-content relative z-10 mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-6 flex items-center justify-between text-sm">
          <Link href="/dashboard" className="text-[var(--glp-deep-teal)] hover:underline" data-testid="link-back-dashboard">
            ← Back to Dashboard
          </Link>
          <Link
            href="/crisis"
            className="rounded-md bg-[var(--glp-blossom-10)] px-3 py-1 font-semibold text-[var(--glp-deep-teal)] hover:bg-[var(--glp-blossom-10)]"
            data-testid="link-crisis"
          >
            Crisis Support
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="v6-preview-section-header text-3xl font-semibold text-[var(--glp-charcoal)]" data-testid="text-title">
            Lumi V6 Overlay — Preview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--glp-charcoal)]">
            Each row compares <code>overlay=false</code> (current PNG) with
            <code className="mx-1">overlay=true</code> (CSS face system on top).
            Faceless V5 PNGs will replace the underlying art later; until then
            the soft face-pad mutes the PNG face beneath the new CSS face.
          </p>
        </header>

        <section className="mb-10" data-testid="section-states">
          <h2 className="mb-4 text-xl font-semibold text-[var(--glp-deep-teal)]">States · overlay=true</h2>
          <p className="mb-3 text-sm text-[var(--glp-charcoal)]">
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
          <h2 className="mb-4 text-xl font-semibold text-[var(--glp-deep-teal)]">Color modes · overlay=true · state=calm</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {COLORS.map((c) => (
              <Cell key={c} label={c} testId={`cell-color-${c}`}>
                <BuddyAvatar state="calm" colorMode={c} overlay={true} size={140} />
              </Cell>
            ))}
          </div>
        </section>

        <section className="mb-10" data-testid="section-poses">
          <h2 className="mb-4 text-xl font-semibold text-[var(--glp-deep-teal)]">Poses · overlay=true · state=encouraged</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {POSES.map((p) => (
              <Cell key={p} label={p} testId={`cell-pose-${p}`}>
                <BuddyAvatar state="encouraged" colorMode="pink" pose={p} overlay={true} size={140} />
              </Cell>
            ))}
          </div>
        </section>

        <section className="mb-10" data-testid="section-compare">
          <h2 className="mb-4 text-xl font-semibold text-[var(--glp-deep-teal)]">Side-by-side · overlay off vs on</h2>
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
          <h2 className="mb-4 text-xl font-semibold text-[var(--glp-deep-teal)]">Sizes · overlay=true</h2>
          <div className="flex flex-wrap items-end gap-6">
            {["sm", "md-header", "md", "lg", "xl"].map((sz) => (
              <div key={sz} className="flex flex-col items-center gap-2">
                <BuddyAvatar state="calm" colorMode="default" overlay={true} size={sz} />
                <span className="text-xs text-[var(--glp-charcoal)]">{sz}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Section 1: LumiV6 "Living Lumi" component ---------- */}
        <section className="mb-10 rounded-2xl bg-[var(--glp-ivory)] p-6 ring-1 ring-[var(--glp-gold)]" data-testid="section-lumiv6">
          <h2 className="mb-2 text-2xl font-semibold text-[var(--glp-charcoal)]">LumiV6 — "Living Lumi"</h2>
          <p className="mb-6 text-sm text-[var(--glp-charcoal)]">
            New multi-layer component (separate from BuddyAvatar). Mouse-track,
            blink, breathe, heart pulse — all opt-in via <code>animated</code> /
            <code className="mx-1">interactive</code>. Hover any avatar below
            to see eye-tracking + the gentle bounce.
          </p>

          <h3 className="mb-3 mt-6 text-lg font-semibold text-[var(--glp-deep-teal)]">Emotions</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {V6_EMOTIONS.map((e) => (
              <Cell key={e} label={e} testId={`cell-v6-emotion-${e}`}>
                <LumiV6 emotion={e} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Poses</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {V6_POSES.map((p) => (
              <Cell key={p} label={p} testId={`cell-v6-pose-${p}`}>
                <LumiV6 pose={p} emotion="greeting" size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Color modes</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {V6_COLORS.map((c) => (
              <Cell key={c} label={c} testId={`cell-v6-color-${c}`}>
                <LumiV6 colorMode={c} emotion="calm" size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Speech bubbles</h3>
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

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Sizes</h3>
          <div className="flex flex-wrap items-end gap-6">
            {["sm", "md-header", "md", "lg", "xl"].map((sz) => (
              <div key={sz} className="flex flex-col items-center gap-2">
                <LumiV6 emotion="greeting" size={sz} />
                <span className="text-xs text-[var(--glp-charcoal)]">{sz}</span>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">animated=false (crisis-safe)</h3>
          <div className="flex flex-wrap items-end gap-6">
            {V6_EMOTIONS.slice(0, 4).map((e) => (
              <div key={e} className="flex flex-col items-center gap-2">
                <LumiV6 emotion={e} size="lg" animated={false} interactive={false} />
                <span className="text-xs text-[var(--glp-charcoal)]">{e}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- V7 "Expressive Soul" playground ---------- */}
        <section className="mb-10 rounded-2xl bg-[var(--glp-ivory)] p-6 ring-1 ring-[var(--glp-blossom)]" data-testid="section-lumiv7">
          <h2 className="mb-2 text-2xl font-semibold text-[var(--glp-charcoal)]">LumiV7 — "Expressive Soul"</h2>
          <p className="mb-6 text-sm text-[var(--glp-charcoal)]">
            Additive on top of V6: 5 new mouth shapes, 2 new eye variants, 5 body
            postures, 600ms emotion-morph transitions, and per-emotion heart rate.
            Every existing V6 prop still works. New props are independently
            overridable — leave any of them undefined and the value is derived
            from <code>emotion</code>.
          </p>

          <h3 className="mb-3 mt-2 text-lg font-semibold text-[var(--glp-deep-teal)]">
            Emotion-derived (mouth · eye · posture · heart rate)
          </h3>
          <p className="mb-3 text-sm text-[var(--glp-charcoal)]">
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

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Mouth expressions (override)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {V7_MOUTHS.map((m) => (
              <Cell key={m} label={m} testId={`cell-v7-mouth-${m}`}>
                <LumiV6 emotion="greeting" mouthExpression={m} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Eye expressions (override)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {V7_EYES.map((eye) => (
              <Cell key={eye} label={eye} testId={`cell-v7-eye-${eye}`}>
                <LumiV6 emotion="greeting" eyeExpression={eye} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Body postures (override)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {V7_POSTURES.map((p) => (
              <Cell key={p} label={p} testId={`cell-v7-posture-${p}`}>
                <LumiV6 emotion="greeting" posture={p} size="lg" />
              </Cell>
            ))}
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Coordination table (resolved runtime)</h3>
          <p className="mb-3 text-sm text-[var(--glp-charcoal)]">
            Shows the <em>resolved</em> output of <code>getLumiV6Derivation()</code>
            in <code className="mx-1">LumiV6.tsx</code> — i.e. after the
            backward-compat overrides apply. Note the <code>sleepy</code> eye
            row reads <code>closed</code> here (visible result) even though the
            raw derivation map stores <code>soft</code>; the runtime hard-codes
            the closed slit for sleepy to preserve the V6 silhouette.
          </p>
          <div className="overflow-x-auto rounded-lg ring-1 ring-[var(--glp-gold)]" data-testid="table-v7-coordination">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--glp-gold)] text-[var(--glp-charcoal)]">
                <tr>
                  <th className="px-3 py-2">Emotion</th>
                  <th className="px-3 py-2">Mouth</th>
                  <th className="px-3 py-2">Eye</th>
                  <th className="px-3 py-2">Posture</th>
                  <th className="px-3 py-2">Heart (Hz)</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--glp-ivory)]">
                {COORDINATION_TABLE.map((row) => (
                  <tr key={row.emotion} className="border-t border-[var(--glp-gold)]" data-testid={`row-coord-${row.emotion}`}>
                    <td className="px-3 py-2 font-medium text-[var(--glp-charcoal)]">{row.emotion}</td>
                    <td className="px-3 py-2 text-[var(--glp-charcoal)]">{row.mouth}</td>
                    <td className="px-3 py-2 text-[var(--glp-charcoal)]">{row.eye}</td>
                    <td className="px-3 py-2 text-[var(--glp-charcoal)]">{row.posture}</td>
                    <td className="px-3 py-2 text-[var(--glp-charcoal)]">{row.hz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Live emotion cycle</h3>
          <p className="mb-3 text-sm text-[var(--glp-charcoal)]">
            Watch the 600ms morph between emotions — eyes blink, mouth/eye
            geometry crossfades, posture shifts, heart rate retunes.
          </p>
          <EmotionCycleDemo />

          <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--glp-deep-teal)]">Heart rate (Hz override)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {[0.125, 0.25, 0.5, 1.0, 1.5].map((hz) => (
              <Cell key={hz} label={`${hz} Hz`} testId={`cell-v7-hz-${hz}`}>
                <LumiV6 emotion="calm" mouthExpression="breathing" heartHz={hz} size="lg" />
              </Cell>
            ))}
          </div>
        </section>

        {/* ---------- V8 "Heart, Mind & Soul" demo ---------- */}
        <section className="mb-10 rounded-2xl bg-[var(--glp-ivory)] p-6 ring-1 ring-[var(--glp-sage-20)]" data-testid="section-lumiv8">
          <h2 className="mb-2 text-2xl font-semibold text-[var(--glp-charcoal)]">LumiV8 — "Heart, Mind & Soul"</h2>
          <p className="mb-6 text-sm text-[var(--glp-charcoal)]">
            Procedural breathing (every 15s the cadence drifts), randomized
            blink (2-6s with 15% double-blinks), idle drift after 10s of no
            activity, smooth emotional gaze lerp, aura halo, ground shadow,
            click zones, and session-memory recognition. Try clicking Lumi's
            head, heart, or body on the demo at right.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <Cell label="V7 baseline (no V8 props)" testId="cell-v8-off">
              <LumiV6 emotion="greeting" size="xl" />
            </Cell>
            <Cell label="V8 on (aura + shadow + idle + lerp)" testId="cell-v8-on">
              <LumiV6 emotion="greeting" size="xl" v8 />
            </Cell>
            <Cell label="V8 + clickable + memory (try clicking)" testId="cell-v8-interactive">
              <LumiV6
                emotion="greeting"
                size="xl"
                v8
                clickable
                memoryKey="v6-demo"
                data-testid="lumi-v8-clickable"
              />
            </Cell>
          </div>
          <p className="mt-3 text-xs text-[var(--glp-deep-teal)]">
            The middle and right Lumi share the same V8 subsystems — only the
            right one accepts clicks. Click the head (greeting flourish),
            heart (loving burst), or body (joy bounce) to see the override.
          </p>
        </section>

        {/* ---------- V9 "Soul Capture" demo ---------- */}
        <V9DemoSection />

        <V20EffectsSection />

        {/* ---------- V7 Toy Spec readout ---------- */}
        <LumiAudioPanel />

        <ToySpecPanel />
      </div>
    </div>
  );
}

/**
 * EmotionCycleDemo — interactive button cycles the avatar through all 7
 * emotions so reviewers can see the 600ms blink-and-morph beat live, plus
 * an auto-cycle toggle for hands-free demoing.
 */
function EmotionCycleDemo() {
  const order = ["greeting", "joy", "love", "calm", "empathy", "sleepy", "surprise"];
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(false);
  const current = order[idx];
  const next = () => setIdx((i) => (i + 1) % order.length);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % order.length), 2200);
    return () => clearInterval(t);
  }, [auto, order.length]);

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl bg-[var(--glp-ivory)] p-6 ring-1 ring-[var(--glp-gold)]"
      data-testid="cell-v7-cycle"
    >
      <div className="flex h-44 w-44 items-center justify-center">
        <LumiV6 emotion={current} size="lg" data-testid={`cycle-avatar-${current}`} />
      </div>
      <div className="text-sm text-[var(--glp-charcoal)]">
        Now showing: <span className="font-semibold text-[var(--glp-charcoal)]" data-testid="text-cycle-emotion">{current}</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={next}
          className="rounded-md bg-[var(--glp-deep-teal)] px-3 py-1.5 text-sm font-semibold text-[var(--glp-ivory)] hover:bg-[var(--glp-sage)]"
          data-testid="button-cycle-next"
        >
          Next emotion →
        </button>
        <button
          type="button"
          onClick={() => setAuto((a) => !a)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold ${auto ? "bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:bg-[var(--glp-sage)]" : "bg-[var(--glp-gold)] text-[var(--glp-deep-teal)] hover:bg-[var(--glp-sage)]"}`}
          data-testid="button-cycle-auto"
        >
          {auto ? "Stop auto-cycle" : "Start auto-cycle"}
        </button>
      </div>
    </div>
  );
}

/**
 * ToySpecPanel — readable display of LUMI_TOY_SPEC for product/manufacturing
 * review. Pure presentation; no editing.
 */
function ToySpecPanel() {
  const s = LUMI_TOY_SPEC;
  return (
    <section className="mb-10 rounded-2xl bg-[var(--glp-ivory)] p-6 ring-1 ring-[var(--glp-sage-20)]" data-testid="section-toy-spec">
      <h2 className="mb-2 text-2xl font-semibold text-[var(--glp-charcoal)]">Lumi Toy — Manufacturing Spec</h2>
      <p className="mb-6 text-sm text-[var(--glp-charcoal)]">
        Canonical hardware contract for the physical AI companion. The on-screen
        avatar's emotion → expression mapping mirrors this spec so the toy
        firmware stays in lockstep with the React component.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <SpecCard title="Physical">
          <SpecRow k="Dimensions" v={`${s.dimensions.width} × ${s.dimensions.height} × ${s.dimensions.depth} ${s.dimensions.unit}`} />
          <SpecRow k="Weight" v={`${s.weight.value} ${s.weight.unit}`} />
          <SpecRow k="Body" v={s.materials.body} />
          <SpecRow k="Heart" v={s.materials.heart} />
          <SpecRow k="Base" v={s.materials.base} />
          <SpecRow k="Certifications" v={s.materials.certifications.join(", ")} />
        </SpecCard>

        <SpecCard title="Power & Sensors">
          <SpecRow k="Battery" v={`${s.power.battery.type} ${s.power.battery.capacity} (${s.power.battery.lifeHours}h life)`} />
          <SpecRow k="Charging" v={`${s.power.charging.type} (~${s.power.charging.timeHours}h)`} />
          <SpecRow k="Standby" v={`${s.power.standby.days} days`} />
          <SpecRow k="Touch" v={s.sensors.touch} />
          <SpecRow k="Accelerometer" v={s.sensors.accelerometer} />
          <SpecRow k="Microphone" v={s.sensors.microphone} />
          <SpecRow k="Ambient light" v={s.sensors.ambientLight} />
        </SpecCard>

        <SpecCard title="LED Systems">
          <SpecRow k="Eye L" v={`${s.leds.eyeLeft.type} ${s.leds.eyeLeft.size} ${s.leds.eyeLeft.color}`} />
          <SpecRow k="Eye R" v={`${s.leds.eyeRight.type} ${s.leds.eyeRight.size} ${s.leds.eyeRight.color}`} />
          <SpecRow k="Mouth" v={`${s.leds.mouth.count}-LED ${s.leds.mouth.arrangement} ${s.leds.mouth.type}`} />
          <SpecRow k="Heart" v={`${s.leds.heart.type} (${s.leds.heart.feature}), default ${s.leds.heart.defaultColor}`} />
          <SpecRow k="Body" v={`${s.leds.body.count} ${s.leds.body.type} (${s.leds.body.coverage})`} />
          <SpecRow k="Eyebrows" v={`${s.leds.eyebrows.count}× ${s.leds.eyebrows.type} ${s.leds.eyebrows.range}`} />
        </SpecCard>

        <SpecCard title="Emotion States (firmware seed)">
          <div className="overflow-x-auto" data-testid="table-toy-emotion-states">
            <table className="w-full text-left text-xs">
              <thead className="text-[var(--glp-charcoal)]">
                <tr>
                  <th className="py-1 pr-3">Name</th>
                  <th className="py-1 pr-3">Color</th>
                  <th className="py-1 pr-3">Pattern</th>
                  <th className="py-1">Hz</th>
                </tr>
              </thead>
              <tbody>
                {s.emotionStates.map((e) => (
                  <tr key={e.name} className="border-t border-[var(--glp-sage-15)]" data-testid={`row-toy-state-${e.name}`}>
                    <td className="py-1 pr-3 font-medium text-[var(--glp-charcoal)]">{e.name}</td>
                    <td className="py-1 pr-3 text-[var(--glp-charcoal)]">
                      <span
                        className="mr-2 inline-block h-3 w-3 rounded-full align-middle ring-1 ring-[var(--glp-sage-20)]"
                        style={{ background: e.color }}
                      />
                      {e.color}
                    </td>
                    <td className="py-1 pr-3 text-[var(--glp-charcoal)]">{e.ledPattern}</td>
                    <td className="py-1 text-[var(--glp-charcoal)]">{e.heartRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecCard>
      </div>
    </section>
  );
}

function V9DemoSection() {
  const [sentiment, setSentiment] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const fireSentiment = (s) => {
    setSentiment(s);
    // clear after the 1.5s mirror so a re-click of the same value re-fires
    setTimeout(() => setSentiment(null), 1600);
  };
  const resetEntrance = () => {
    try { sessionStorage.removeItem("lumi:v9:entered"); } catch { /* noop */ }
    setResetKey((n) => n + 1);
  };
  return (
    <section
      className="mb-10 rounded-2xl bg-[var(--glp-ivory)] p-6 ring-1 ring-[var(--glp-gold)]"
      data-testid="section-lumiv9"
    >
      <h2 className="mb-2 text-2xl font-semibold text-[var(--glp-charcoal)]">
        LumiV9 — "Soul Capture"
      </h2>
      <p className="mb-4 max-w-3xl text-sm text-[var(--glp-charcoal)]">
        Additive layer over V8. <b>Entrance</b> plays once per session via
        IntersectionObserver. <b>Attention capture</b> fires after 15s of no
        Lumi-local interaction when the cursor enters a 200px radius.
        <b> Escalation</b> tracks 1-3 click-zone activations within a 10s
        window. <b>Mirroring</b> flashes a sentiment for 1.5s. <b>Goodbye</b>
        fades on <code>beforeunload</code> or 5min idle. All gated by{" "}
        <code>animated</code> so crisis surfaces stay still, and disabled by
        <code className="ml-1">prefers-reduced-motion</code>.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Cell label="V8 baseline (no V9 props)" testId="cell-v9-off">
          <LumiV6 emotion="greeting" size="xl" v8 />
        </Cell>
        <Cell label="V9 on (entrance + attention + goodbye)" testId="cell-v9-on">
          <LumiV6
            key={`v9-base-${resetKey}`}
            emotion="greeting"
            size="xl"
            v8
            v9
            data-testid="lumi-v9-base"
          />
        </Cell>
        <Cell
          label="V9 + clickable + sentiment mirror"
          testId="cell-v9-interactive"
        >
          <LumiV6
            key={`v9-interactive-${resetKey}`}
            emotion="greeting"
            size="xl"
            v8
            v9
            clickable
            memoryKey="v9-playground"
            detectedSentiment={sentiment}
            data-testid="lumi-v9-interactive"
          />
        </Cell>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--glp-deep-teal)]">
          Mirror sentiment →
        </span>
        {["joy", "love", "empathy", "surprise", "calm"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => fireSentiment(s)}
            className="rounded-full bg-[var(--glp-gold)] px-3 py-1 text-xs font-medium text-[var(--glp-deep-teal)] ring-1 ring-[var(--glp-gold)] hover:bg-[var(--glp-sage-20)]"
            data-testid={`btn-mirror-${s}`}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={resetEntrance}
          className="ml-auto rounded-full bg-[var(--glp-sage-10)] px-3 py-1 text-xs font-medium text-[var(--glp-charcoal)] ring-1 ring-[var(--glp-sage-20)] hover:bg-[var(--glp-sage-20)]"
          data-testid="btn-reset-entrance"
        >
          Replay entrance (clears session gate)
        </button>
      </div>

      <p className="mt-3 text-xs text-[var(--glp-deep-teal)]">
        Try: load the page (entrance plays once), click the rightmost Lumi's
        head/heart/body 3+ times within 10s (escalation builds to celebration
        sparkle), tap a sentiment chip (1.5s mirror flash), then leave the
        cursor away for 15s and slowly approach (attention capture wobble).
      </p>
    </section>
  );
}

function V20EffectsSection() {
  return (
    <section
      className="mb-10 rounded-2xl bg-[var(--glp-ivory)] p-6 ring-1 ring-[var(--glp-gold)]"
      data-testid="section-lumiv20"
    >
      <h2 className="mb-2 text-2xl font-semibold text-[var(--glp-charcoal)]">
        LumiV20 — Visual Effects (Phase 1)
      </h2>
      <p className="mb-4 max-w-3xl text-sm text-[var(--glp-charcoal)]">
        Additive overlay layer. <b>Sparkles</b> auto-on for joy or click
        escalation level 3. <b>Floating particles</b> auto-on for calm /
        sleepy / empathy (per-emotion tint). <b>Blush</b> escalates with
        click-zone interactions only (1, 2, 3 clicks within 10s). The PNG
        image itself is byte-identical untouched. All effects suppressed
        when <code>animated=false</code> (crisis) and when{" "}
        <code>prefers-reduced-motion: reduce</code>.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Cell label="V20 + greeting + explicit sparkles" testId="cell-v20-sparkles">
          <LumiV6
            emotion="greeting"
            size="xl"
            v8
            v20
            sparkles
            data-testid="lumi-v20-sparkles"
          />
        </Cell>
        <Cell label="V20 + calm (auto particles)" testId="cell-v20-particles">
          <LumiV6
            emotion="calm"
            size="xl"
            v8
            v20
            data-testid="lumi-v20-particles"
          />
        </Cell>
        <Cell
          label="V20 + clickable (click for blush escalation 1→2→3)"
          testId="cell-v20-blush-interactive"
        >
          <LumiV6
            emotion="love"
            size="xl"
            v8
            v9
            v20
            clickable
            data-testid="lumi-v20-blush-interactive"
          />
        </Cell>
      </div>

      <p className="mt-3 text-xs text-[var(--glp-deep-teal)]">
        Try: click the third Lumi's heart 3+ times — cheek blush deepens
        through level 1 → 2 → 3, and at level 3 the joy sparkles fire on
        top. Decays after 10s of no clicks.
      </p>
    </section>
  );
}

/**
 * V14 Voice + Expression Sync — Lumi audio preview & preference toggle.
 *
 * Three programmatic Web Audio cues (pop / heartbeat / chime), default OFF,
 * gated behind a localStorage preference. Per-surface auto-wiring is deferred
 * so this control panel is the only place that *plays* sound until the user
 * approves wider integration.
 */
function LumiAudioPanel() {
  const { enabled, effective, available, reducedMotion, setEnabled, pop, heartbeat, chime } = useLumiAudio();
  return (
    <section
      className="mb-10 rounded-2xl bg-[var(--glp-ivory)] p-6 ring-1 ring-[var(--glp-sage-20)]"
      data-testid="section-lumi-audio"
      aria-labelledby="lumi-audio-title"
    >
      <h2 id="lumi-audio-title" className="mb-2 text-xl font-semibold text-[var(--glp-deep-teal)]">
        V14 — Voice + Expression Sync
      </h2>
      <p className="mb-4 max-w-2xl text-sm text-[var(--glp-charcoal)]">
        Three whisper-quiet Web Audio cues for Lumi: a soft entrance{" "}
        <em>pop</em>, a synced <em>heartbeat</em>, and an interaction{" "}
        <em>chime</em>. Programmatic tones only (no audio files), capped at
        ≈ -22 dBFS per the prime directive. Default <strong>OFF</strong>, stored
        in <code>localStorage</code> as <code>lumi:audio:enabled</code>.
        Respects <code>prefers-reduced-motion</code>: when set, the toggle
        appears but every play is a silent no-op.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--glp-sage-10)] px-4 py-2 text-sm font-medium text-[var(--glp-deep-teal)] ring-1 ring-[var(--glp-sage-20)] hover:bg-[var(--glp-sage-20)]"
          data-testid="label-toggle-lumi-audio"
        >
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 accent-[var(--glp-deep-teal)]"
            disabled={!available}
            data-testid="toggle-lumi-audio"
            aria-describedby="lumi-audio-status"
          />
          <span>Enable Lumi sound cues</span>
        </label>
        <span
          id="lumi-audio-status"
          className="text-xs text-[var(--glp-deep-teal)]"
          data-testid="text-lumi-audio-status"
        >
          {!available
            ? "Audio not available in this browser."
            : reducedMotion
              ? "Reduced-motion is on — sound is suppressed even when enabled."
              : effective
                ? "Sound is ON. Click a cue below to preview."
                : "Sound is OFF. Toggle to preview."}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={pop}
          disabled={!effective}
          className="rounded-full bg-[var(--glp-gold)] px-3 py-1 text-xs font-medium text-[var(--glp-deep-teal)] ring-1 ring-[var(--glp-gold)] hover:bg-[var(--glp-sage-20)] disabled:cursor-not-allowed disabled:opacity-50"
          data-testid="btn-lumi-audio-pop"
          aria-label="Preview Lumi entrance pop"
        >
          ▶ Pop (entrance)
        </button>
        <button
          type="button"
          onClick={heartbeat}
          disabled={!effective}
          className="rounded-full bg-[var(--glp-blossom-10)] px-3 py-1 text-xs font-medium text-[var(--glp-deep-teal)] ring-1 ring-[var(--glp-blossom)] hover:bg-[var(--glp-blossom-10)] disabled:cursor-not-allowed disabled:opacity-50"
          data-testid="btn-lumi-audio-heartbeat"
          aria-label="Preview Lumi heartbeat"
        >
          ♥ Heartbeat
        </button>
        <button
          type="button"
          onClick={chime}
          disabled={!effective}
          className="rounded-full bg-[var(--glp-sage-10)] px-3 py-1 text-xs font-medium text-[var(--glp-deep-teal)] ring-1 ring-[var(--glp-sage-20)] hover:bg-[var(--glp-sage-20)] disabled:cursor-not-allowed disabled:opacity-50"
          data-testid="btn-lumi-audio-chime"
          aria-label="Preview Lumi interaction chime"
        >
          ✶ Chime (interaction)
        </button>
      </div>

      <p className="mt-3 text-xs text-[var(--glp-deep-teal)]">
        Per-surface auto-wiring (entrance pop on Lumi mount, heartbeat synced to
        the heart pulse, chime on interaction) is deferred — the control panel
        is the only place that plays sound until you approve broader
        integration.
      </p>
    </section>
  );
}

function SpecCard({ title, children }) {
  return (
    <div className="rounded-xl bg-[var(--glp-ivory)] p-4 ring-1 ring-[var(--glp-sage-15)]">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--glp-deep-teal)]">{title}</h3>
      <dl className="space-y-1 text-sm">{children}</dl>
    </div>
  );
}

function SpecRow({ k, v }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="min-w-[110px] text-xs uppercase tracking-wide text-[var(--glp-deep-teal)]">{k}</dt>
      <dd className="flex-1 text-[var(--glp-deep-teal)]">{v}</dd>
    </div>
  );
}

