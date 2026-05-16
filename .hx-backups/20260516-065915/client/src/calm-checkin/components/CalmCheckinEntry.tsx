/**
 * Phase 14 (spec-aligned) — main orchestrator.
 *
 *   idle → choose exercise → exercise screen → complete (soft landing) →
 *   continue (gentle options).
 */

import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { CALM_CONTENT } from "../content/calmCheckinContent";
import {
  isOptionalSignupAllowed,
  useCalmCheckinStore,
} from "../state/calmCheckinState";
import { CalmBreathGuide } from "./CalmBreathGuide";
import { CalmCheckinCard } from "./CalmCheckinCard";
import { CalmContinueOptions, type CalmContinueOptionId } from "./CalmContinueOptions";
import { CalmGroundingOption } from "./CalmGroundingOption";
import { CalmReflectionPrompt } from "./CalmReflectionPrompt";

export type CalmCheckinEntryProps = {
  onContinueOption?: (option: CalmContinueOptionId) => void;
  onReturnHome?: () => void;
};

export function CalmCheckinEntry({
  onContinueOption,
  onReturnHome,
}: CalmCheckinEntryProps) {
  const state = useCalmCheckinStore();
  const allowSignup = isOptionalSignupAllowed(state);

  const handleContinueSelect = (id: CalmContinueOptionId) => {
    if (id === "breathe-again") {
      state.reset();
      state.chooseExercise("breathing");
      return;
    }
    if (id === "continue-calmly" && onReturnHome) {
      onReturnHome();
      return;
    }
    onContinueOption?.(id);
  };

  // ── IDLE ──────────────────────────────────────────────────────────────
  if (state.step === "idle") {
    return (
      <CalmCheckinCard
        heading={CALM_CONTENT.idle.heading}
        subheading={CALM_CONTENT.idle.subheading}
        testId="calm-checkin-idle"
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
          {CALM_CONTENT.idle.options.map((opt) => (
            <li key={opt.id}>
              <MMHBButton
                variant={opt.id === "breathing" ? "primary" : "tertiary"}
                size="md"
                onClick={() => state.chooseExercise(opt.id)}
                data-testid={`button-choose-${opt.id}`}
                style={{ width: "100%", justifyContent: "flex-start" }}
              >
                <span style={{ display: "grid", gap: 4, textAlign: "left" }}>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span
                    style={{
                      fontFamily: typography.fonts.body,
                      fontSize: 12,
                      color: colors.semantic.fgMuted,
                      fontWeight: 400,
                    }}
                  >
                    {opt.description}
                  </span>
                </span>
              </MMHBButton>
            </li>
          ))}
        </ul>
        <CrisisLine />
      </CalmCheckinCard>
    );
  }

  // ── BREATHING ─────────────────────────────────────────────────────────
  if (state.step === "breathing") {
    return (
      <CalmCheckinCard heading={CALM_CONTENT.breathing.heading} testId="calm-checkin-breathing">
        <CalmBreathGuide
          key={state.breathingRepeats}
          repeats={state.breathingRepeats}
          onComplete={() => state.markExerciseCompleted()}
          onRepeat={() => state.repeatBreathing()}
          onContinue={() => state.goToComplete()}
        />
        <CrisisLine />
      </CalmCheckinCard>
    );
  }

  // ── GROUNDING ─────────────────────────────────────────────────────────
  if (state.step === "grounding") {
    return (
      <CalmCheckinCard heading={CALM_CONTENT.grounding.heading} testId="calm-checkin-grounding">
        <CalmGroundingOption
          completed={state.exerciseCompleted}
          onComplete={() => state.markExerciseCompleted()}
          onContinue={() => state.goToComplete()}
        />
        <CrisisLine />
      </CalmCheckinCard>
    );
  }

  // ── REFLECTING ────────────────────────────────────────────────────────
  if (state.step === "reflecting") {
    return (
      <CalmCheckinCard heading={CALM_CONTENT.reflection.heading} testId="calm-checkin-reflecting">
        <CalmReflectionPrompt
          value={state.reflectionText}
          completed={state.exerciseCompleted}
          onChange={(t) => state.setReflection(t)}
          onComplete={() => state.markExerciseCompleted()}
          onContinue={() => state.goToComplete()}
        />
        <CrisisLine />
      </CalmCheckinCard>
    );
  }

  // ── COMPLETE ──────────────────────────────────────────────────────────
  if (state.step === "complete") {
    return (
      <CalmCheckinCard
        heading={CALM_CONTENT.complete.heading}
        subheading={CALM_CONTENT.complete.body}
        testId="calm-checkin-complete"
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <MMHBButton
            variant="primary"
            size="md"
            onClick={() => state.goToContinue()}
            data-testid="button-complete-continue"
          >
            {CALM_CONTENT.complete.continueCta}
          </MMHBButton>
        </div>
        <CrisisLine />
      </CalmCheckinCard>
    );
  }

  // ── CONTINUE ──────────────────────────────────────────────────────────
  return (
    <CalmCheckinCard
      heading={CALM_CONTENT.continue.heading}
      testId="calm-checkin-continue"
    >
      <CalmContinueOptions allowSignup={allowSignup} onSelect={handleContinueSelect} />
      <CrisisLine />
    </CalmCheckinCard>
  );
}

function CrisisLine() {
  return (
    <p
      data-testid="text-calm-crisis-line"
      style={{
        fontFamily: typography.fonts.body,
        fontSize: 12,
        color: colors.semantic.fgMuted,
        margin: "18px 0 0",
      }}
    >
      {CALM_CONTENT.crisisLine.split("/crisis")[0]}
      <a
        href="/crisis"
        data-testid="link-calm-crisis"
        style={{ color: colors.palette.primarySage, fontWeight: 600 }}
      >
        /crisis
      </a>
      {CALM_CONTENT.crisisLine.split("/crisis")[1] ?? ""}
    </p>
  );
}
