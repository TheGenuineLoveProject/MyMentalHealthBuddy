/*
 * RigLab — QA surface for FloatIdleRig (MMHB_FLOAT_IDLE_UNIT_v1 Phase 3).
 *
 * Standalone, opt-in route at /rig-lab. Lets you drive every rig prop
 * with a slider so Phase 4-6 motion prototypes can be validated against
 * a known-good rig before being wired into LumiV6 / LumiV7 / production
 * surfaces. Mirrors the /avatar-lab pattern from v5.8.28.
 *
 * No production references — flipping to /rig-lab is the only way to
 * see this surface. Zero impact on shipped pages, zero testid drift on
 * existing surfaces.
 */

import { useState, useRef } from "react";
import { Link } from "wouter";
import FloatIdleRig, { MOUTH_SHAPES } from "@/components/lumi/FloatIdleRig.jsx";

const SLIDERS = [
  { key: "breathingScale", label: "Breathing scale", min: 1.0,  max: 1.03, step: 0.005, def: 1.0,  format: (v) => v.toFixed(3) },
  { key: "blinkScaleY",    label: "Blink scaleY",    min: 0.1,  max: 1.0,  step: 0.05,  def: 1.0,  format: (v) => v.toFixed(2) },
  { key: "armLRotate",     label: "Arm L rotate (deg)", min: -30, max: 30, step: 1,     def: 0,    format: (v) => v.toFixed(0) },
  { key: "armRRotate",     label: "Arm R rotate (deg)", min: -30, max: 30, step: 1,     def: 0,    format: (v) => v.toFixed(0) },
  { key: "legLY",          label: "Leg L Y (1024-px)",  min: -12, max: 12, step: 1,     def: 0,    format: (v) => v.toFixed(0) },
  { key: "legRY",          label: "Leg R Y (1024-px)",  min: -12, max: 12, step: 1,     def: 0,    format: (v) => v.toFixed(0) },
  { key: "floatY",         label: "Float Y (1024-px)",  min: -20, max: 20, step: 1,     def: 0,    format: (v) => v.toFixed(0) },
  { key: "sparkleOpacity", label: "Sparkle opacity",  min: 0,   max: 1,   step: 0.05,  def: 1.0,  format: (v) => v.toFixed(2) },
];

export default function RigLab() {
  const [state, setState] = useState(() =>
    Object.fromEntries(SLIDERS.map((s) => [s.key, s.def]))
  );
  const [mouthShape, setMouthShape] = useState("neutral");
  const [crisis, setCrisis] = useState(false);
  const [size, setSize] = useState(512);
  const rigRef = useRef(null);
  const [anchorReadout, setAnchorReadout] = useState("");

  const update = (key, value) =>
    setState((s) => ({ ...s, [key]: parseFloat(value) }));

  const reset = () =>
    setState(Object.fromEntries(SLIDERS.map((s) => [s.key, s.def])));

  const probeAnchors = () => {
    const r = rigRef.current;
    if (!r) return;
    const lines = r.listAnchors().map((name) => {
      const a = r.getAnchor(name);
      return `${name.padEnd(22)} → (${a.xPx.toFixed(1)}px, ${a.yPx.toFixed(1)}px)`;
    });
    setAnchorReadout(lines.join("\n"));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FBF8F1",
        padding: "2rem 1.25rem",
        color: "#142626",
        fontFamily: "system-ui, sans-serif",
      }}
      data-testid="page-rig-lab"
    >
      <header style={{ maxWidth: 1200, margin: "0 auto 1.5rem" }}>
        <Link
          href="/"
          style={{ color: "#142626", textDecoration: "none", opacity: 0.7, fontSize: "0.9rem" }}
          data-testid="link-rig-lab-home"
        >
          ← Home
        </Link>
        <h1 style={{ fontSize: "1.75rem", margin: "0.5rem 0 0.25rem" }}>
          MMHB_FLOAT_IDLE_UNIT_v1 — Rig Lab
        </h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: "0.95rem" }}>
          Phase 3 scaffolding — drive every rig prop, verify pivots, expose anchors. Body FROZEN per NON-DRIFT contract.
        </p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
          Crisis support: <a href="/crisis" style={{ color: "#E8913A" }}>/crisis</a> · 988 · 741741
        </p>
      </header>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 360px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Live rig preview */}
        <section
          style={{
            background: "#fff",
            border: "1px solid rgba(168,201,160,0.3)",
            borderRadius: "1rem",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
          data-testid="section-rig-preview"
        >
          <FloatIdleRig
            ref={rigRef}
            size={size}
            breathingScale={state.breathingScale}
            blinkScaleY={state.blinkScaleY}
            mouthShape={mouthShape}
            armLRotate={state.armLRotate}
            armRRotate={state.armRRotate}
            legLY={state.legLY}
            legRY={state.legRY}
            floatY={state.floatY}
            sparkleOpacity={state.sparkleOpacity}
            crisis={crisis}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[256, 384, 512, 768].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(168,201,160,0.5)",
                  background: size === s ? "#A8C9A0" : "transparent",
                  color: size === s ? "#142626" : "#142626",
                  fontWeight: size === s ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
                data-testid={`button-size-${s}`}
              >
                {s}px
              </button>
            ))}
          </div>
        </section>

        {/* Controls */}
        <aside
          style={{
            background: "#fff",
            border: "1px solid rgba(168,201,160,0.3)",
            borderRadius: "1rem",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          data-testid="section-rig-controls"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Rig props</h2>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.35rem 0.8rem",
                borderRadius: "999px",
                border: "1px solid rgba(168,201,160,0.5)",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
              data-testid="button-reset-rig"
            >
              Reset
            </button>
          </div>

          {SLIDERS.map((s) => (
            <label key={s.key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.85rem" }}>
              <span style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontWeight: 500 }}>{s.label}</strong>
                <code style={{ opacity: 0.7 }}>{s.format(state[s.key])}</code>
              </span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={state[s.key]}
                onChange={(e) => update(s.key, e.target.value)}
                data-testid={`slider-${s.key}`}
                style={{ width: "100%" }}
              />
            </label>
          ))}

          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.85rem" }}>
            <strong style={{ fontWeight: 500 }}>Mouth shape (data attr only)</strong>
            <select
              value={mouthShape}
              onChange={(e) => setMouthShape(e.target.value)}
              data-testid="select-mouth-shape"
              style={{ padding: "0.35rem", borderRadius: "0.5rem", border: "1px solid rgba(168,201,160,0.5)" }}
            >
              {MOUTH_SHAPES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={crisis}
              onChange={(e) => setCrisis(e.target.checked)}
              data-testid="checkbox-crisis-override"
            />
            <span>Crisis override (BHCE — pins all to identity)</span>
          </label>

          <div style={{ borderTop: "1px solid rgba(168,201,160,0.25)", paddingTop: "0.75rem" }}>
            <button
              type="button"
              onClick={probeAnchors}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #A8C9A0 0%, #74C0FC 100%)",
                color: "#142626",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                width: "100%",
              }}
              data-testid="button-probe-anchors"
            >
              Probe anchors via ref
            </button>
            {anchorReadout && (
              <pre
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.7rem",
                  background: "#142626",
                  color: "#FBF8F1",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  whiteSpace: "pre",
                  overflowX: "auto",
                  maxHeight: 220,
                }}
                data-testid="text-anchor-readout"
              >
                {anchorReadout}
              </pre>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
