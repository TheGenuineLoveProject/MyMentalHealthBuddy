/**
 * Phase 14 (spec-aligned) — soft card container with ambient aura glow.
 * Wraps every step screen so the calm visual language is consistent.
 */

import type { CSSProperties, ReactNode } from "react";
import { MMHBCard } from "../../design-system/components/MMHBCard";
import { colors } from "../../design-system/tokens/colors";
import { typography } from "../../design-system/tokens/typography";
import { calmMotion } from "../motion/calmCheckinMotion";
import { useReducedCalmMotion } from "../accessibility/useReducedCalmMotion";

export type CalmCheckinCardProps = {
  heading?: string;
  subheading?: string;
  children: ReactNode;
  testId?: string;
};

export function CalmCheckinCard({
  heading,
  subheading,
  children,
  testId = "calm-checkin-card",
}: CalmCheckinCardProps) {
  const reduced = useReducedCalmMotion();
  const auraStyle: CSSProperties = reduced
    ? { opacity: calmMotion.glow.minOpacity }
    : {
        opacity: calmMotion.glow.minOpacity,
        animation: `calmAura ${calmMotion.durations.glowPulse}ms ${calmMotion.easings.soft} infinite alternate`,
      };

  return (
    <MMHBCard elevation="elevated" data-testid={testId} style={{ position: "relative" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `radial-gradient(circle at 50% 30%, ${colors.aura.calm} 0%, transparent 70%)`,
          pointerEvents: "none",
          ...auraStyle,
        }}
      />
      <style>{`
        @keyframes calmAura {
          from { opacity: ${calmMotion.glow.minOpacity}; }
          to { opacity: ${calmMotion.glow.maxOpacity}; }
        }
      `}</style>
      <div style={{ position: "relative", zIndex: 1 }}>
        {heading && (
          <h2
            data-testid={`${testId}-heading`}
            style={{
              fontFamily: typography.fonts.heading,
              fontSize: 22,
              color: colors.semantic.fgHeading,
              margin: "0 0 8px",
              lineHeight: 1.3,
            }}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p
            data-testid={`${testId}-subheading`}
            style={{
              fontFamily: typography.fonts.body,
              fontSize: 15,
              color: colors.semantic.fgMuted,
              margin: "0 0 18px",
              lineHeight: 1.55,
            }}
          >
            {subheading}
          </p>
        )}
        {children}
      </div>
    </MMHBCard>
  );
}
