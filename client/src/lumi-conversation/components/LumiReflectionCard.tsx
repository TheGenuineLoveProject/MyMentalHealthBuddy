/**
 * Phase 15 (spec-aligned) — reflection prompt card.
 *
 * Reflections are ephemeral. We never persist what the user types here, and
 * the helper text says so explicitly.
 */

import { useState, type CSSProperties } from "react";
import { MMHBCard, MMHBButton } from "@/design-system";
import { colors, typography, radius } from "@/design-system";
import type { ReflectionPrompt } from "../content/reflectionPrompts";

export type LumiReflectionCardProps = {
  prompt: ReflectionPrompt;
  onContinue: () => void;
  onSkip: () => void;
};

const MAX_REFLECTION_CHARS = 600;

const taStyle: CSSProperties = {
  width: "100%",
  resize: "vertical",
  minHeight: 88,
  fontFamily: typography.fonts.body,
  fontSize: 15,
  lineHeight: 1.55,
  color: colors.semantic.fgBody,
  background: colors.semantic.bgCard,
  border: `1px solid ${colors.semantic.borderSubtle}`,
  borderRadius: radius.md,
  padding: 12,
  outline: "none",
};

export function LumiReflectionCard({
  prompt,
  onContinue,
  onSkip,
}: LumiReflectionCardProps) {
  const [text, setText] = useState("");

  return (
    <div
      data-testid={`lumi-reflection-${prompt.id}`}
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
          A gentle reflection
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
            marginBottom: 10,
          }}
        >
          {prompt.helperHint} What you write here isn't saved or shared.
        </p>
        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value.slice(0, MAX_REFLECTION_CHARS))
          }
          style={taStyle}
          maxLength={MAX_REFLECTION_CHARS}
          aria-label="Optional reflection"
          data-testid="textarea-lumi-reflection"
          placeholder="Type a few words, or none. Either is okay."
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginTop: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: typography.fonts.body,
              fontSize: 12,
              color: colors.semantic.fgMuted,
            }}
          >
            {text.length}/{MAX_REFLECTION_CHARS}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <MMHBButton
              variant="tertiary"
              size="sm"
              onClick={onSkip}
              data-testid="button-lumi-reflection-skip"
            >
              Skip
            </MMHBButton>
            <MMHBButton
              variant="primary"
              size="sm"
              onClick={onContinue}
              data-testid="button-lumi-reflection-continue"
            >
              Continue gently
            </MMHBButton>
          </div>
        </div>
      </MMHBCard>
    </div>
  );
}
