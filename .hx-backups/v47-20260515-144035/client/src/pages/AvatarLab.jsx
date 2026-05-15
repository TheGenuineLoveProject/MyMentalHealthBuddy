/*
 * AvatarLab — V32 LumiV7 coordination demo + QA surface.
 * Public, no auth. Lets the user (and reviewers) verify all
 * 4 eye types × 10 mouths × 6 arms × 5 legs + crisis override.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import LumiV7 from "../components/lumi/LumiV7.jsx";

const EYES = ["default", "wide", "soft", "happy"];
const MOUTHS = ["happy", "calm", "surprise", "sleepy", "open", "worried", "excited", "loving", "focused", "breathing"];
const ARMS = ["rest", "wave", "hug", "point", "present", "heart"];
const LEGS = ["rest", "sit", "walk", "bounce", "tuck"];

function ChipRow({ label, options, value, onChange, prefix }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--glp-sage-deep)" }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              data-testid={`${prefix}-${opt}`}
              aria-pressed={active}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: active ? "var(--glp-sage-deep)" : "var(--glp-paper)",
                color: active ? "#FFFFFF" : "var(--glp-sage-deep)",
                border: `1.5px solid ${active ? "var(--glp-sage-deep)" : "var(--glp-sage-15)"}`
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AvatarLab() {
  const [eye, setEye] = useState("default");
  const [mouth, setMouth] = useState("happy");
  const [arm, setArm] = useState("wave");
  const [leg, setLeg] = useState("bounce");
  const [crisis, setCrisis] = useState(false);
  const [gaze, setGaze] = useState(null);

  // Mouse-tracking gaze for the playground avatar
  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setGaze({
        x: (e.clientX - cx) / (window.innerWidth / 2),
        y: (e.clientY - cy) / (window.innerHeight / 2)
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.title = "Avatar Lab — MyMentalHealthBuddy";
  }, []);

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{ background: "var(--glp-paper)" }}
      data-testid="page-avatar-lab"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--glp-sage-deep)" }}>
            V32 § Avatar Evolution Engine
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2" style={{ color: "var(--glp-sage-deep)" }}>
            Lumi V7 — Coordination Lab
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--glp-ink)" }}>
            Body is FROZEN per V22/V24/V27. Only eyes, mouth, arms, and legs gain coordination. Move your mouse to test pupil tracking.
          </p>
        </div>

        {/* Playground */}
        <section
          className="mb-12 p-6 sm:p-10 rounded-3xl"
          style={{
            background: "var(--glp-white)",
            border: "1px solid var(--glp-sage-15)",
            boxShadow: "0 24px 60px rgba(74, 126, 114, 0.08)"
          }}
          aria-label="Live coordination playground"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <LumiV7
                eye={eye}
                mouth={mouth}
                arm={arm}
                leg={leg}
                crisis={crisis}
                gaze={crisis ? null : gaze}
                size={280}
                data-testid="lumi-playground"
              />
            </div>
            <div className="space-y-5">
              <ChipRow label="Eye (4)" options={EYES} value={eye} onChange={setEye} prefix="lab-eye" />
              <ChipRow label="Mouth (10)" options={MOUTHS} value={mouth} onChange={setMouth} prefix="lab-mouth" />
              <ChipRow label="Arm (6)" options={ARMS} value={arm} onChange={setArm} prefix="lab-arm" />
              <ChipRow label="Leg (5)" options={LEGS} value={leg} onChange={setLeg} prefix="lab-leg" />
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crisis}
                    onChange={(e) => setCrisis(e.target.checked)}
                    data-testid="checkbox-crisis-override"
                    className="w-4 h-4 accent-rose-500"
                  />
                  <span className="text-sm font-semibold" style={{ color: "var(--glp-sage-deep)" }}>
                    Crisis override (instant calm, no motion)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Mouth gallery */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-bold mb-4" style={{ color: "var(--glp-sage-deep)" }}>
            Mouth gallery — 10 expressions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MOUTHS.map((m) => (
              <div
                key={m}
                className="p-3 rounded-2xl text-center"
                style={{ background: "var(--glp-white)", border: "1px solid var(--glp-sage-15)" }}
                data-testid={`gallery-mouth-${m}`}
              >
                <LumiV7 eye="default" mouth={m} arm="rest" leg="rest" size={120} data-testid={`lumi-gallery-mouth-${m}`} />
                <p className="mt-2 text-xs font-semibold" style={{ color: "var(--glp-sage-deep)" }}>{m}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eye gallery */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-bold mb-4" style={{ color: "var(--glp-sage-deep)" }}>
            Eye gallery — 4 types
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EYES.map((e) => (
              <div
                key={e}
                className="p-3 rounded-2xl text-center"
                style={{ background: "var(--glp-white)", border: "1px solid var(--glp-sage-15)" }}
                data-testid={`gallery-eye-${e}`}
              >
                <LumiV7 eye={e} mouth="happy" arm="rest" leg="rest" size={120} data-testid={`lumi-gallery-eye-${e}`} />
                <p className="mt-2 text-xs font-semibold" style={{ color: "var(--glp-sage-deep)" }}>{e}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-center mt-8" style={{ color: "var(--glp-sage-deep)", opacity: 0.7 }}>
          Body appearance per V22/V24/V27 specs is locked. <Link href="/" className="underline">Back home</Link>
        </p>
      </div>
    </main>
  );
}
