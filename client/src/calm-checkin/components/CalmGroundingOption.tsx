/**
 * Phase 14 (spec-aligned) — "Notice one thing around you that feels safe or familiar."
 *
 * Spec contracts:
 *   - User does not need to share what they noticed.
 *   - Single, opt-in confirmation: "I noticed something".
 */

import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { CALM_CONTENT } from "../content/calmCheckinContent";

export type CalmGroundingOptionProps = {
  onComplete: () => void;
  onContinue: () => void;
  completed?: boolean;
};

export function CalmGroundingOption({
  onComplete,
  onContinue,
  completed = false,
}: CalmGroundingOptionProps) {
  return (
    <div data-testid="calm-grounding-option" style={{ display: "grid", gap: 18 }}>
      <p
        data-testid="text-grounding-prompt"
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 15,
          color: colors.semantic.fgBody,
          margin: 0,
          lineHeight: 1.55,
        }}
      >
        {CALM_CONTENT.grounding.prompt}
      </p>
      <p
        data-testid="text-grounding-helper"
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 13,
          color: colors.semantic.fgMuted,
          margin: 0,
        }}
      >
        {CALM_CONTENT.grounding.helperHint}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {!completed && (
          <MMHBButton
            variant="primary"
            size="sm"
            onClick={onComplete}
            data-testid="button-grounding-complete"
          >
            {CALM_CONTENT.grounding.completeCta}
          </MMHBButton>
        )}
        {completed && (
          <MMHBButton
            variant="primary"
            size="sm"
            onClick={onContinue}
            data-testid="button-grounding-continue"
          >
            Continue gently
          </MMHBButton>
        )}
      </div>
    </div>
  );
}
