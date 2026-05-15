/**
 * Phase 14 (spec-aligned) — ONE breath cycle: 4s inhale, 2s hold, 6s exhale.
 *
 * Spec contracts:
 *   - Exactly one cycle initially (12 seconds).
 *   - Optional repeat — never auto-repeated.
 *   - Reduced motion: text-only cues, no animated circle.
 *   - No progress bar / no progress dots.
 *   - User can stop at any time (visible "Take one breath" CTA throughout).
 */

import { useEffect, useRef, useState } from "react";
import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { useReducedCalmMotion } from "../accessibility/useReducedCalmMotion";
import { CALM_CONTENT } from "../content/calmCheckinContent";
import { calmMotion } from "../motion/calmCheckinMotion";

type Phase = "inhale" | "hold" | "exhale" | "done";

export type CalmBreathGuideProps = {
  onComplete: () => void;
  onRepeat: () => void;
  onContinue: () => void;
  /** Counter for analytics / banked repeats — display-only. */
  repeats?: number;
};

const { inhaleSeconds, holdSeconds, exhaleSeconds } = CALM_CONTENT.breathing;

export function CalmBreathGuide({
  onComplete,
  onRepeat,
  onContinue,
  repeats = 0,
}: CalmBreathGuideProps) {
  const reduced = useReducedCalmMotion();
  const [phase, setPhase] = useState<Phase>("inhale");
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    setPhase("inhale");
    const t1 = setTimeout(() => setPhase("hold"), inhaleSeconds * 1000);
    const t2 = setTimeout(() => setPhase("exhale"), (inhaleSeconds + holdSeconds) * 1000);
    const t3 = setTimeout(() => {
      setPhase("done");
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, (inhaleSeconds + holdSeconds + exhaleSeconds) * 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // Re-run if user repeats (key change in parent forces remount; this is a safety belt).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeats]);

  const promptByPhase: Record<Phase, string> = {
    inhale: CALM_CONTENT.breathing.cyclePromptInhale,
    hold: CALM_CONTENT.breathing.cyclePromptHold,
    exhale: CALM_CONTENT.breathing.cyclePromptExhale,
    done: "That was one breath. You can take another, or move on gently.",
  };

  const circleScale =
    phase === "inhale" ? 1.2 : phase === "hold" ? 1.2 : phase === "exhale" ? 0.85 : 1.0;

  return (
    <div data-testid="calm-breath-guide" style={{ display: "grid", gap: 24, justifyItems: "center" }}>
      <p
        data-testid="text-breath-intro"
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 15,
          color: colors.semantic.fgMuted,
          margin: 0,
          textAlign: "center",
          maxWidth: 380,
        }}
      >
        {CALM_CONTENT.breathing.intro}
      </p>

      {reduced ? (
        <p
          data-testid="text-breath-reduced-motion"
          aria-live="polite"
          style={{
            fontFamily: typography.fonts.heading,
            fontSize: 18,
            color: colors.semantic.fgHeading,
            margin: 0,
            textAlign: "center",
            maxWidth: 420,
            lineHeight: 1.55,
          }}
        >
          {CALM_CONTENT.breathing.reducedMotionLabel}
        </p>
      ) : (
        <>
          <div
            data-testid="breath-circle"
            data-phase={phase}
            aria-hidden
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.aura.calm} 0%, transparent 75%)`,
              transform: `scale(${circleScale})`,
              transition:
                phase === "inhale"
                  ? `transform ${inhaleSeconds}s ${calmMotion.easings.soft}`
                  : phase === "exhale"
                  ? `transform ${exhaleSeconds}s ${calmMotion.easings.soft}`
                  : `transform 200ms ${calmMotion.easings.soft}`,
            }}
          />
          <p
            data-testid="text-breath-cue"
            aria-live="polite"
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: 18,
              color: colors.semantic.fgHeading,
              margin: 0,
              textAlign: "center",
            }}
          >
            {promptByPhase[phase]}
          </p>
        </>
      )}

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        <MMHBButton
          variant="tertiary"
          size="sm"
          onClick={onRepeat}
          disabled={phase !== "done"}
          data-testid="button-breath-repeat"
        >
          {CALM_CONTENT.breathing.repeatCta}
        </MMHBButton>
        <MMHBButton
          variant="primary"
          size="sm"
          onClick={onContinue}
          disabled={phase !== "done"}
          data-testid="button-breath-continue"
        >
          {CALM_CONTENT.breathing.completeCta}
        </MMHBButton>
      </div>

      {repeats > 0 && (
        <p
          data-testid="text-breath-repeats"
          style={{
            fontFamily: typography.fonts.body,
            fontSize: 12,
            color: colors.semantic.fgMuted,
            margin: 0,
          }}
        >
          You've taken {repeats + 1} {repeats + 1 === 1 ? "breath" : "breaths"} together.
        </p>
      )}
    </div>
  );
}
