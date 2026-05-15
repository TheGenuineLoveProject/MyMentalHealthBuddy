/**
 * Phase 20 — Single ritual step card.
 *
 * Quiet UI only:
 *  - One serif heading line (the gentle copy).
 *  - One optional sans-serif micro line.
 *  - Optional breath cadence as plain text (no animated circle).
 *  - No progress bar, no dots, no streaks, no countdown timer.
 *
 * Avatar identity untouched — this component never references Lumi DOM.
 */

import type { CSSProperties } from "react";
import { MMHBCard } from "@/design-system";
import {
  fonts,
  heading,
  body,
  semantic,
  spacing,
} from "@/design-system";
import type { RitualStep } from "../runtime/RitualEngine";

export type RitualStepCardProps = {
  step: RitualStep;
  /** When true, the soft cadence is shown as text (no animation). */
  reducedMotion?: boolean;
};

export function RitualStepCard({ step, reducedMotion = false }: RitualStepCardProps) {
  const headingStyle: CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: heading.h3.size,
    lineHeight: heading.h3.lineHeight,
    letterSpacing: heading.h3.letterSpacing,
    fontWeight: heading.h3.weight,
    color: semantic.fgHeading,
    margin: 0,
  };

  const microStyle: CSSProperties = {
    fontFamily: fonts.body,
    fontSize: body.md.size,
    lineHeight: body.md.lineHeight,
    color: semantic.fgMuted,
    margin: 0,
    marginTop: spacing.xs,
  };

  const cadenceStyle: CSSProperties = {
    fontFamily: fonts.body,
    fontSize: body.sm.size,
    lineHeight: body.sm.lineHeight,
    color: semantic.fgBody,
    margin: 0,
    marginTop: spacing.md,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: 8,
    background: semantic.stateHoverWash,
    display: "inline-block",
  };

  const cadenceText = step.breath?.pattern;

  return (
    <MMHBCard elevation="elevated" data-testid={`ritual-step-${step.id}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: spacing.xs }}>
        <p style={headingStyle} data-testid="ritual-step-copy">
          {step.copy}
        </p>
        {step.microCopy ? (
          <p style={microStyle} data-testid="ritual-step-micro">
            {step.microCopy}
          </p>
        ) : null}
        {cadenceText ? (
          <span style={cadenceStyle} aria-label="breath cadence" data-testid="ritual-step-cadence">
            {reducedMotion ? `Soft cadence — ${cadenceText}` : cadenceText}
          </span>
        ) : null}
      </div>
    </MMHBCard>
  );
}
