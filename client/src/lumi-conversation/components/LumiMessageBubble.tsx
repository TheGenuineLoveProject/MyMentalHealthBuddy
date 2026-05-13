/**
 * Phase 15 (spec-aligned) — Lumi message bubble.
 *
 * Renders a single user or Lumi turn. All visuals are sourced from the
 * Phase 12 design system — zero hex literals.
 */

import type { CSSProperties } from "react";
import { MMHBCard } from "@/design-system";
import { colors, typography } from "@/design-system";
import type {
  ConversationTurn,
  EscalationLevel,
} from "../state/conversationState";

export type LumiMessageBubbleProps = {
  turn: ConversationTurn;
  /** When true, render the crisis resource pointer with elevated emphasis. */
  emphasizeResource?: boolean;
};

const userBubbleStyle: CSSProperties = {
  alignSelf: "flex-end",
  maxWidth: "82%",
  marginInline: 0,
};

const lumiBubbleStyle: CSSProperties = {
  alignSelf: "flex-start",
  maxWidth: "88%",
  marginInline: 0,
};

const bodyStyle: CSSProperties = {
  fontFamily: typography.fonts.body,
  fontSize: 16,
  lineHeight: 1.55,
  color: colors.semantic.fgBody,
  margin: 0,
};

const labelStyle: CSSProperties = {
  fontFamily: typography.fonts.body,
  fontSize: 12,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: colors.semantic.fgMuted,
  marginBottom: 6,
  display: "block",
};

const escalationStyle = (level: EscalationLevel): CSSProperties => {
  if (level === "critical") {
    return {
      borderLeft: `3px solid ${colors.semantic.statusWarning}`,
      paddingLeft: 12,
    };
  }
  if (level === "elevated") {
    return {
      borderLeft: `2px solid ${colors.palette.eternalGold}`,
      paddingLeft: 12,
    };
  }
  return {};
};

export function LumiMessageBubble({
  turn,
  emphasizeResource = false,
}: LumiMessageBubbleProps) {
  const isUser = turn.speaker === "user";
  const wrapperStyle = isUser ? userBubbleStyle : lumiBubbleStyle;
  const elevation = isUser ? "resting" : "elevated";

  return (
    <div
      data-testid={`lumi-bubble-${turn.id}`}
      data-speaker={turn.speaker}
      data-escalation={turn.escalation ?? "none"}
      style={wrapperStyle}
    >
      <MMHBCard elevation={elevation as "resting" | "elevated" | "floating"}>
        <div style={escalationStyle(turn.escalation ?? "none")}>
          <span style={labelStyle}>{isUser ? "You" : "Lumi"}</span>
          <p
            style={{
              ...bodyStyle,
              ...(emphasizeResource && turn.escalation === "critical"
                ? { fontWeight: 500 }
                : null),
            }}
          >
            {turn.text}
          </p>
        </div>
      </MMHBCard>
    </div>
  );
}
