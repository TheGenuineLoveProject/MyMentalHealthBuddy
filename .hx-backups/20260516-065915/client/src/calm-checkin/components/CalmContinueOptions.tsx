/**
 * Phase 14 (spec-aligned) — "Continue gently" options screen.
 *
 * Spec contracts:
 *   - Four soft options (Continue calmly / Explore tools / Breathe again /
 *     Optional signup later).
 *   - "Optional signup later" is the ONLY signup-adjacent string in the entire
 *     module — and it lives here, not in the exercise screens.
 *   - Hard render-layer guard: returns null + warning if `allowSignup` is false
 *     (defense-in-depth against state bypass).
 */

import { MMHBButton } from "../../design-system/components/MMHBButton";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { CALM_CONTENT } from "../content/calmCheckinContent";

export type CalmContinueOptionId =
  | "continue-calmly"
  | "explore-tools"
  | "breathe-again"
  | "signup-later";

export type CalmContinueOptionsProps = {
  /** Hard render-layer guard. Should mirror `isOptionalSignupAllowed(state)`. */
  allowSignup: boolean;
  onSelect: (option: CalmContinueOptionId) => void;
};

export function CalmContinueOptions({ allowSignup, onSelect }: CalmContinueOptionsProps) {
  if (!allowSignup) {
    if (typeof console !== "undefined") {
      console.warn(
        "[calm-checkin] CalmContinueOptions rendered without allowSignup — refusing to render.",
      );
    }
    return null;
  }

  return (
    <div data-testid="calm-continue-options" style={{ display: "grid", gap: 14 }}>
      <p
        data-testid="text-continue-body"
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 15,
          color: colors.semantic.fgBody,
          margin: 0,
          lineHeight: 1.55,
        }}
      >
        {CALM_CONTENT.continue.body}
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {CALM_CONTENT.continue.options.map((opt) => (
          <li key={opt.id}>
            <MMHBButton
              variant={opt.id === "continue-calmly" ? "primary" : "tertiary"}
              size="md"
              onClick={() => onSelect(opt.id)}
              data-testid={`button-continue-${opt.id}`}
              style={{ width: "100%", justifyContent: "flex-start" }}
            >
              <span style={{ display: "grid", gap: 4, textAlign: "left" }}>
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
                {opt.helperText && (
                  <span
                    style={{
                      fontFamily: typography.fonts.body,
                      fontSize: 12,
                      color: colors.semantic.fgMuted,
                      fontWeight: 400,
                    }}
                  >
                    {opt.helperText}
                  </span>
                )}
              </span>
            </MMHBButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
