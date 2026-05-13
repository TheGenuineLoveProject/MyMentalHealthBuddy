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

const MOTION_SYSTEMS = [
  { phase: 4, name: "Breathing",      property: "torso scale",     range: "1.0 → 1.02",     cycle: "7.1s" },
  { phase: 4, name: "Floating",       property: "body translateY", range: "0 → -10px",       cycle: "9.3s" },
  { phase: 4, name: "Shadow",         property: "opacity / blur / scale", range: "0.55→0.28 / 3→7px / 1→1.15", cycle: "9.3s synced" },
  { phase: 5, name: "Blink",          property: "eyes scaleY",     range: "1.0 → 0.92",     cycle: "random 3-8s, 200ms" },
  { phase: 5, name: "Eye settling",   property: "eyes translate",  range: "±0.5-1.5px",     cycle: "8.7s" },
  { phase: 6, name: "Mouth softness", property: "mouth scale",     range: "1.0 → 1.004/1.006", cycle: "7.1s breath-sync" },
];

export default function MotionLab() {
  const [size, setSize] = useState(420);
  const [crisis, setCrisis] = useState(false);

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
          Phase 4-6 idle motion systems running live. Body FROZEN per NON-DRIFT contract — only sub-pixel transforms.
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
          <FloatIdleAnimated size={size} crisis={crisis} />
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
        </aside>
      </div>
    </main>
  );
}
