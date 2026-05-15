/**
 * Phase 15 (spec-aligned) — grounding prompt card.
 */

import { MMHBCard, MMHBButton } from "@/design-system";
import { colors, typography } from "@/design-system";
import type { GroundingPrompt } from "../content/groundingPrompts";

export type LumiGroundingResponseProps = {
  prompt: GroundingPrompt;
  onDone: () => void;
  onSkip: () => void;
};

export function LumiGroundingResponse({
  prompt,
  onDone,
  onSkip,
}: LumiGroundingResponseProps) {
  return (
    <div
      data-testid={`lumi-grounding-${prompt.id}`}
      style={{ alignSelf: "flex-start", maxWidth: "92%" }}
    >
      <MMHBCard elevation="elevated">
        <span
          style={{
            display: "block",
            fontFamily: typography.fonts.body,
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: colors.semantic.fgMuted,
            marginBottom: 6,
          }}
        >
          A small grounding option
        </span>
        <p
          style={{
            fontFamily: typography.fonts.heading,
            fontSize: 20,
            lineHeight: 1.35,
            color: colors.semantic.fgBody,
            margin: 0,
            marginBottom: 6,
          }}
        >
          {prompt.text}
        </p>
        <p
          style={{
            fontFamily: typography.fonts.body,
            fontSize: 14,
            lineHeight: 1.5,
            color: colors.semantic.fgMuted,
            margin: 0,
            marginBottom: 14,
          }}
        >
          {prompt.helperHint}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <MMHBButton
            variant="primary"
            size="sm"
            onClick={onDone}
            data-testid="button-lumi-grounding-done"
          >
            I tried it
          </MMHBButton>
          <MMHBButton
            variant="tertiary"
            size="sm"
            onClick={onSkip}
            data-testid="button-lumi-grounding-skip"
          >
            Not right now
          </MMHBButton>
        </div>
      </MMHBCard>
    </div>
  );
}
