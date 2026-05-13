/**
 * Phase 14 (spec-aligned) — optional reflection prompt.
 *
 * Spec contracts:
 *   - No required answer — empty submission is valid.
 *   - Text is ephemeral (state-only, never persisted, never shared).
 *   - Helper text states this explicitly.
 */

import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { CALM_CONTENT } from "../content/calmCheckinContent";

export type CalmReflectionPromptProps = {
  value: string;
  onChange: (text: string) => void;
  onComplete: () => void;
  onContinue: () => void;
  completed?: boolean;
};

export function CalmReflectionPrompt({
  value,
  onChange,
  onComplete,
  onContinue,
  completed = false,
}: CalmReflectionPromptProps) {
  return (
    <div data-testid="calm-reflection-prompt" style={{ display: "grid", gap: 14 }}>
      <p
        data-testid="text-reflection-prompt"
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 15,
          color: colors.semantic.fgBody,
          margin: 0,
          lineHeight: 1.55,
        }}
      >
        {CALM_CONTENT.reflection.prompt}
      </p>
      <textarea
        data-testid="input-reflection"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={CALM_CONTENT.reflection.placeholder}
        rows={3}
        maxLength={600}
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 15,
          color: colors.semantic.fgBody,
          background: colors.semantic.bgCard,
          border: `1px solid ${colors.semantic.borderSubtle}`,
          borderRadius: 12,
          padding: "12px 14px",
          resize: "vertical",
          minHeight: 84,
        }}
      />
      <p
        data-testid="text-reflection-helper"
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 12,
          color: colors.semantic.fgMuted,
          margin: 0,
        }}
      >
        {CALM_CONTENT.reflection.helperHint}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {!completed && (
          <MMHBButton
            variant="primary"
            size="sm"
            onClick={onComplete}
            data-testid="button-reflection-complete"
          >
            {CALM_CONTENT.reflection.completeCta}
          </MMHBButton>
        )}
        {completed && (
          <MMHBButton
            variant="primary"
            size="sm"
            onClick={onContinue}
            data-testid="button-reflection-continue"
          >
            Continue gently
          </MMHBButton>
        )}
      </div>
    </div>
  );
}
