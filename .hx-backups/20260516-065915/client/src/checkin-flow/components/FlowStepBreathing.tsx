/**
 * Phase 14 — Breathing step (4-7-8 × 4 cycles ≈ 80s incl. rest).
 * Animated circle with inline-keyframe scaling. Reduced-motion → text-only cues.
 * NO subscription content.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { breathingCopy, breathingCycle } from "../copy/microCopy";
import { useCheckInFlowStore } from "../state/useCheckInFlowStore";
import type { BreathingPhase } from "../types/checkInFlowTypes";

const TOTAL_CYCLES = 4;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export function FlowStepBreathing() {
  const setBreathingCompleted = useCheckInFlowStore((s) => s.setBreathingCompleted);
  const reset = useCheckInFlowStore((s) => s.reset);
  const reduced = usePrefersReducedMotion();

  const [cycleIndex, setCycleIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const completedRef = useRef(false);

  const phase = breathingCycle[phaseIndex];

  useEffect(() => {
    if (completedRef.current) return;
    const t = setTimeout(() => {
      const nextPhase = phaseIndex + 1;
      if (nextPhase >= breathingCycle.length) {
        const nextCycle = cycleIndex + 1;
        if (nextCycle >= TOTAL_CYCLES) {
          completedRef.current = true;
          setBreathingCompleted();
          return;
        }
        setCycleIndex(nextCycle);
        setPhaseIndex(0);
      } else {
        setPhaseIndex(nextPhase);
      }
    }, phase.seconds * 1000);
    return () => clearTimeout(t);
  }, [phaseIndex, cycleIndex, phase.seconds, setBreathingCompleted]);

  const circleStyle = useMemo<React.CSSProperties>(() => {
    if (reduced) {
      return {
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: colors.aura.calm,
        border: `2px solid ${colors.palette.primarySage}`,
      };
    }
    const scaleByPhase: Record<BreathingPhase, number> = {
      inhale: 1.18,
      hold: 1.18,
      exhale: 0.82,
      rest: 0.82,
    };
    return {
      width: 140,
      height: 140,
      borderRadius: "50%",
      background: colors.aura.calm,
      border: `2px solid ${colors.palette.primarySage}`,
      transform: `scale(${scaleByPhase[phase.phase]})`,
      transition: `transform ${phase.seconds}s ease-in-out`,
      willChange: "transform",
    };
  }, [phase.phase, phase.seconds, reduced]);

  return (
    <section data-testid="checkin-flow-step-breathing" aria-labelledby="checkin-breathing-title">
      <h2
        id="checkin-breathing-title"
        style={{
          fontFamily: typography.fonts.heading,
          fontSize: 24,
          color: colors.semantic.fgHeading,
          margin: "0 0 6px",
          textAlign: "center",
        }}
        data-testid="text-breathing-title"
      >
        {breathingCopy.title}
      </h2>
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 14,
          color: colors.semantic.fgMuted,
          textAlign: "center",
          margin: "0 0 24px",
        }}
      >
        {breathingCopy.subtitle}
        {reduced ? ` ${breathingCopy.reducedMotionNote}` : ""}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "8px 0 24px",
        }}
      >
        <div
          aria-hidden
          data-testid="visual-breathing-circle"
          data-phase={phase.phase}
          style={circleStyle}
        />
        <p
          aria-live="polite"
          data-testid="text-breathing-cue"
          style={{
            fontFamily: typography.fonts.body,
            fontSize: 17,
            color: colors.semantic.fgBody,
            margin: 0,
            textAlign: "center",
            minHeight: 48,
          }}
        >
          {phase.cue}
        </p>
        <p
          style={{
            fontFamily: typography.fonts.body,
            fontSize: 13,
            color: colors.semantic.fgMuted,
            margin: 0,
          }}
          data-testid="text-breathing-progress"
        >
          Cycle {cycleIndex + 1} of {TOTAL_CYCLES}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <MMHBButton
          variant="ghost"
          size="md"
          onClick={() => reset()}
          data-testid="button-breathing-cancel"
        >
          {breathingCopy.cancel}
        </MMHBButton>
      </div>

      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 12,
          color: colors.semantic.fgMuted,
          marginTop: 20,
          textAlign: "center",
        }}
      >
        In crisis?{" "}
        <a
          href="/crisis"
          data-testid="link-crisis-breathing"
          style={{ color: colors.palette.primarySage, fontWeight: 600 }}
        >
          /crisis
        </a>
      </p>
    </section>
  );
}
