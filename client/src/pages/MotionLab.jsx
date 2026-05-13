/*
 * MotionLab — live demo of FloatIdleAnimated (MMHB_FLOAT_IDLE_UNIT_v1
 * Phase 4-6 motion systems). Standalone QA route at /motion-lab.
 *
 * Sister surface to /rig-lab (Phase 3 controlled rig). This one shows
 * the auto-running motion stack with no controls — flip crisis to see
 * BHCE pin-to-identity behavior, swap sizes to verify motion scales
 * cleanly across container sizes.
 */

import { useState } from "react";
import { Link } from "wouter";
import FloatIdleAnimated from "@/components/lumi/FloatIdleAnimated.jsx";

const EMOTIONAL_STATES = [
  { id: "calmIdle",    label: "Calm Idle",     glow: "Sage 0.15",      breath: "7.1s",   float: "9.3s × 1.0",   feeling: "Peacefully present" },
  { id: "grounding",   label: "Grounding",     glow: "Calm-blue 0.12", breath: "9.94s",  float: "12.09s × 0.6", feeling: "Steady and centered" },
  { id: "reflective",  label: "Reflective",    glow: "Purple 0.10",    breath: "8.52s",  float: "13.02s × 0.7", feeling: "Thoughtful and inward" },
  { id: "sleepy",      label: "Sleepy",        glow: "Mint 0.08",      breath: "11.36s", float: "16.74s × 0.4", feeling: "Drowsy and resting" },
  { id: "comforting",  label: "Comforting",    glow: "Blush 0.18",     breath: "7.81s",  float: "11.16s × 0.8", feeling: "Warm and reassuring" },
  { id: "peacefulJoy", label: "Peaceful Joy",  glow: "Sunshine 0.14",  breath: "6.39s",  float: "7.91s × 1.2",  feeling: "Quietly happy" },
];

const MOTION_SYSTEMS = [
  { phase: 4, name: "Breathing",      property: "torso scale",     range: "1.0 → 1.02",     cycle: "7.1s" },
  { phase: 4, name: "Floating",       property: "body translateY", range: "0 → -10px",       cycle: "9.3s" },
  { phase: 4, name: "Shadow",         property: "opacity / blur / scale", range: "0.55→0.28 / 3→7px / 1→1.15", cycle: "9.3s synced" },
  { phase: 5, name: "Blink",          property: "eyes scaleY",     range: "1.0 → 0.92",     cycle: "random 3-8s, 200ms" },
  { phase: 5, name: "Eye settling",   property: "eyes translate",  range: "±0.5-1.5px",     cycle: "8.7s" },
  { phase: 6, name: "Mouth softness", property: "mouth scale",     range: "1.0 → 1.004/1.006", cycle: "7.1s breath-sync" },
  { phase: 7, name: "Arm settling",   property: "arm-l/r rotate",  range: "±2° asymmetric",   cycle: "10.3s / 10.7s desynced" },
  { phase: 7, name: "Leg settling",   property: "leg-l/r translateY", range: "±3px inertia",  cycle: "9.7s / 10.1s desynced" },
];

// Phase 9 — Interaction systems. Only active when `interactive` prop is on.
// Each row = one of the 5 living awareness behaviors per the verification
// report. Ethics: never attention-seeking, no tracking, sub-pixel only.
const INTERACTION_SYSTEMS = [
  { name: "Hover awareness",    trigger: "pointerenter on bbox",      effect: "breath -7%, amplitude -5%, eye soften 20%, glow +8%", transition: "3s ease" },
  { name: "Proximity response", trigger: "within 200px for ≥4s",      effect: "float drift -25%, breath sync +40%, amplitude -15%, glow +4%", transition: "4s build → 3s ease" },
  { name: "Presence settle",    trigger: "sustained proximity",       effect: "deeper sync (combined with hover for max calm)", transition: "layered" },
  { name: "Idle return",        trigger: "pointer leaves all zones",  effect: "all multipliers → 1, glow → state baseline", transition: "3s ease (instant under reduced-motion)" },
  { name: "Click ack",          trigger: "pointerdown on avatar",     effect: "glow pulse +0.05, decays over 600ms", transition: "3s ease" },
];

export default function MotionLab() {
  const [size, setSize] = useState(420);
  const [crisis, setCrisis] = useState(false);
  const [state, setState] = useState("calmIdle");
  const [interactive, setInteractive] = useState(false);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FBF8F1",
        padding: "2rem 1.25rem",
        color: "#142626",
        fontFamily: "system-ui, sans-serif",
      }}
      data-testid="page-motion-lab"
    >
      <header style={{ maxWidth: 1100, margin: "0 auto 1.5rem" }}>
        <Link
          href="/"
          style={{ color: "#142626", textDecoration: "none", opacity: 0.7, fontSize: "0.9rem" }}
          data-testid="link-motion-lab-home"
        >
          ← Home
        </Link>
        <h1 style={{ fontSize: "1.75rem", margin: "0.5rem 0 0.25rem" }}>
          MMHB_FLOAT_IDLE_UNIT_v1 — Motion Lab
        </h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: "0.95rem" }}>
          Phase 4-8 idle motion systems running live. Body FROZEN per NON-DRIFT contract — only sub-pixel transforms. Phase 8 adds emotional state orchestration (6 of 8 states wired; 2 awaiting spec).
        </p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
          Crisis support: <a href="/crisis" style={{ color: "#E8913A" }}>/crisis</a> · 988 · 741741 · Sister: <Link href="/rig-lab" style={{ color: "#142626", opacity: 0.7 }}>/rig-lab</Link>
        </p>
      </header>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 380px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Live preview */}
        <section
          style={{
            background: "#fff",
            border: "1px solid rgba(168,201,160,0.3)",
            borderRadius: "1rem",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
          }}
          data-testid="section-motion-preview"
        >
          <FloatIdleAnimated size={size} state={state} crisis={crisis} interactive={interactive} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%", maxWidth: 420 }}>
            <label htmlFor="motion-state" style={{ fontSize: "0.78rem", opacity: 0.7, fontWeight: 500 }}>
              Emotional state {crisis ? "(pinned to calmIdle by crisis)" : ""}
            </label>
            <select
              id="motion-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={crisis}
              data-testid="select-motion-state"
              style={{
                padding: "0.5rem 0.7rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(168,201,160,0.5)",
                background: crisis ? "rgba(168,201,160,0.08)" : "#fff",
                color: "#142626",
                fontSize: "0.9rem",
                cursor: crisis ? "not-allowed" : "pointer",
              }}
            >
              {EMOTIONAL_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} — {s.feeling}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[256, 320, 420, 512, 640].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(168,201,160,0.5)",
                  background: size === s ? "#A8C9A0" : "transparent",
                  color: "#142626",
                  fontWeight: size === s ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
                data-testid={`button-motion-size-${s}`}
              >
                {s}px
              </button>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={crisis}
              onChange={(e) => setCrisis(e.target.checked)}
              data-testid="checkbox-motion-crisis"
            />
            <span>Crisis override (BHCE — pin all motion to identity)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={interactive}
              onChange={(e) => setInteractive(e.target.checked)}
              disabled={crisis}
              data-testid="checkbox-motion-interactive"
            />
            <span>
              Phase 9 interactive {crisis ? "(disabled by crisis)" : "(hover · proximity · click)"}
            </span>
          </label>
          {interactive && !crisis && (
            <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.7, textAlign: "center", maxWidth: 420 }}>
              Move cursor near the avatar to see proximity build (4s). Hover for soft awareness. Click for a gentle glow pulse. Move away — Lumi gently returns to baseline.
            </p>
          )}
        </section>

        {/* Active motion table */}
        <aside
          style={{
            background: "#fff",
            border: "1px solid rgba(168,201,160,0.3)",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
          data-testid="section-motion-systems"
        >
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.05rem" }}>Active motion systems</h2>
          <p style={{ margin: "0 0 1rem", fontSize: "0.8rem", opacity: 0.7 }}>
            All transforms are CSS-only on individual transform properties (scale/translate) so they compose cleanly. Mouth motion is breath-synced and never exceeds 0.6% — never looks like speech.
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.78rem",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(168,201,160,0.3)" }}>
                <th style={{ textAlign: "left", padding: "0.4rem 0.3rem", fontWeight: 600 }}>Phase</th>
                <th style={{ textAlign: "left", padding: "0.4rem 0.3rem", fontWeight: 600 }}>System</th>
                <th style={{ textAlign: "left", padding: "0.4rem 0.3rem", fontWeight: 600 }}>Range / Cycle</th>
              </tr>
            </thead>
            <tbody>
              {MOTION_SYSTEMS.map((m, i) => (
                <tr
                  key={m.name}
                  style={{
                    borderBottom: i === MOTION_SYSTEMS.length - 1 ? "none" : "1px solid rgba(168,201,160,0.15)",
                  }}
                  data-testid={`row-motion-${m.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <td style={{ padding: "0.5rem 0.3rem", verticalAlign: "top" }}>
                    <code style={{ background: "rgba(168,201,160,0.18)", padding: "0.1rem 0.4rem", borderRadius: "0.25rem" }}>P{m.phase}</code>
                  </td>
                  <td style={{ padding: "0.5rem 0.3rem", verticalAlign: "top" }}>
                    <strong style={{ fontWeight: 500 }}>{m.name}</strong>
                    <div style={{ opacity: 0.6, fontSize: "0.72rem", marginTop: "0.15rem" }}>{m.property}</div>
                  </td>
                  <td style={{ padding: "0.5rem 0.3rem", verticalAlign: "top", fontFamily: "monospace", opacity: 0.85 }}>
                    {m.range}
                    <div style={{ opacity: 0.6, fontSize: "0.72rem", marginTop: "0.15rem" }}>{m.cycle}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, rgba(168,201,160,0.15) 0%, rgba(116,192,252,0.10) 100%)",
              fontSize: "0.78rem",
              lineHeight: 1.5,
            }}
          >
            <strong>Identity preserved:</strong> silhouette unchanged, expression unchanged at rest, mouth never opens, no redesign or recolor. Reduced-motion + crisis both pause the entire motion stack.
          </div>

          {/* Phase 9 — Interaction systems table (only meaningful when toggled on) */}
          <h2 style={{ margin: "1.25rem 0 0.5rem", fontSize: "1.05rem" }}>
            Phase 9 — Interaction systems {interactive ? "(active)" : "(off)"}
          </h2>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", opacity: 0.7 }}>
            Gentle environmental awareness. Layered ON TOP of the active emotional state via CSS multiplier vars — never replaces base motion, only modulates it. No tracking, no analytics, no attention loops.
          </p>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.76rem" }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(168,201,160,0.3)" }}>
                <th style={{ textAlign: "left", padding: "0.4rem 0.3rem", fontWeight: 600 }}>System</th>
                <th style={{ textAlign: "left", padding: "0.4rem 0.3rem", fontWeight: 600 }}>Trigger</th>
                <th style={{ textAlign: "left", padding: "0.4rem 0.3rem", fontWeight: 600 }}>Effect / Transition</th>
              </tr>
            </thead>
            <tbody>
              {INTERACTION_SYSTEMS.map((m, i) => (
                <tr
                  key={m.name}
                  style={{
                    borderBottom: i === INTERACTION_SYSTEMS.length - 1 ? "none" : "1px solid rgba(168,201,160,0.15)",
                    opacity: interactive ? 1 : 0.5,
                  }}
                  data-testid={`row-interaction-${m.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <td style={{ padding: "0.5rem 0.3rem", verticalAlign: "top" }}>
                    <code style={{ background: "rgba(232,145,58,0.18)", padding: "0.1rem 0.4rem", borderRadius: "0.25rem" }}>P9</code>
                    <div style={{ marginTop: "0.25rem" }}>
                      <strong style={{ fontWeight: 500 }}>{m.name}</strong>
                    </div>
                  </td>
                  <td style={{ padding: "0.5rem 0.3rem", verticalAlign: "top", fontSize: "0.72rem", opacity: 0.85 }}>
                    {m.trigger}
                  </td>
                  <td style={{ padding: "0.5rem 0.3rem", verticalAlign: "top", fontFamily: "monospace", opacity: 0.85, fontSize: "0.7rem" }}>
                    {m.effect}
                    <div style={{ opacity: 0.6, fontSize: "0.68rem", marginTop: "0.15rem" }}>{m.transition}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.6rem 0.75rem",
              borderRadius: "0.5rem",
              background: "rgba(232,145,58,0.08)",
              fontSize: "0.72rem",
              lineHeight: 1.5,
              border: "1px solid rgba(232,145,58,0.2)",
            }}
          >
            <strong>Ethics contract:</strong> Never attention-seeking · Never abandonment-signaling · No eye tracking · No surveillance · Sub-pixel only · User always in control · Crisis disables all interactions.
          </div>
        </aside>
      </div>
    </main>
  );
}
