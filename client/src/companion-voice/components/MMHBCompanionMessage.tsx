/**
 * Phase 15 — Renders one Lumi response (or crisis card) using design-system tokens.
 *
 * No anthropomorphism in the visual layer either: Lumi is labeled as
 * "your buddy" / "Lumi" — never "I" — and avatar is decorative only.
 */

import { MMHBCard } from "../../design-system/components/MMHBCard";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { CRISIS_RESPONSE } from "../copy/responseBank";
import type { CompanionResponse } from "../types/companionVoiceTypes";

export type MMHBCompanionMessageProps = {
  response: CompanionResponse;
};

export function MMHBCompanionMessage({ response }: MMHBCompanionMessageProps) {
  if (response.isCrisis) {
    return (
      <MMHBCard
        elevation="elevated"
        data-testid="companion-crisis-card"
        style={{ background: colors.aura.warmth }}
      >
        <h3
          style={{
            fontFamily: typography.fonts.heading,
            fontSize: 18,
            color: colors.semantic.fgHeading,
            margin: "0 0 10px",
          }}
          data-testid="text-crisis-heading"
        >
          You matter — and you're not alone in this moment.
        </h3>
        <p
          style={{
            fontFamily: typography.fonts.body,
            fontSize: 15,
            color: colors.semantic.fgBody,
            margin: "0 0 14px",
            lineHeight: 1.55,
          }}
          data-testid="text-crisis-message"
        >
          {response.message}
        </p>
        <ul
          style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}
          data-testid="list-crisis-numbers"
        >
          {CRISIS_RESPONSE.numbers.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                data-testid={`link-crisis-${n.href}`}
                style={{
                  color: colors.palette.primarySage,
                  fontFamily: typography.fonts.body,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <p
          style={{
            fontFamily: typography.fonts.body,
            fontSize: 12,
            color: colors.semantic.fgMuted,
            margin: "14px 0 0",
          }}
          data-testid="text-crisis-optout"
        >
          {response.optOut}
        </p>
      </MMHBCard>
    );
  }

  return (
    <MMHBCard elevation="resting" data-testid="companion-message-card">
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 16,
          color: colors.semantic.fgBody,
          margin: "0 0 12px",
          lineHeight: 1.55,
        }}
        data-testid="text-companion-message"
        data-intent={response.intent}
        data-technique={response.technique ?? "none"}
        data-detected={response.detected}
      >
        {response.message}
      </p>
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 12,
          color: colors.semantic.fgMuted,
          margin: "0 0 6px",
        }}
        data-testid="text-companion-optout"
      >
        {response.optOut}
      </p>
      <p
        style={{
          fontFamily: typography.fonts.body,
          fontSize: 12,
          color: colors.semantic.fgMuted,
          margin: 0,
        }}
        data-testid="text-companion-crisis-line"
      >
        {response.crisisLine.split("/crisis")[0]}
        <a
          href="/crisis"
          data-testid="link-companion-crisis"
          style={{ color: colors.palette.primarySage, fontWeight: 600 }}
        >
          /crisis
        </a>
        {response.crisisLine.split("/crisis")[1] ?? ""}
      </p>
    </MMHBCard>
  );
}
