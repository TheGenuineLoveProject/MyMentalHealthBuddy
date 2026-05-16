/**
 * Phase 22 — OptInPrompt
 *
 * The ONLY surface that flips the scheduler from `disabled → idle`.
 * Quiet, opt-in by intentional click. No dark patterns:
 *  - No pre-checked checkboxes
 *  - No social-proof copy ("9 out of 10 users...")
 *  - No "are you sure?" dissuasion if the user declines
 *  - Decline is a complete answer; the panel just dismisses.
 *
 * Avatar identity: this component does not import or render Lumi. It
 * is a quiet card that sits next to whatever Lumi surface the host
 * places it beside.
 */

import { useCallback, type CSSProperties } from "react";
import { MMHBButton, MMHBCard } from "@/design-system";
import {
  fonts,
  heading,
  body,
  semantic,
  spacing,
} from "@/design-system";

export type OptInPromptProps = {
  /** Currently opted in? When true, the panel collapses to the off-switch. */
  enabled: boolean;
  /** Called when the user intentionally enables the scheduler. */
  onOptIn: () => void;
  /** Called when the user disables the scheduler. */
  onOptOut: () => void;
  /** Optional dismiss — host can hide the prompt entirely. */
  onDismiss?: () => void;
  className?: string;
  style?: CSSProperties;
};

export function OptInPrompt({
  enabled,
  onOptIn,
  onOptOut,
  onDismiss,
  className,
  style,
}: OptInPromptProps) {
  const wrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
    ...style,
  };

  const handleOptIn = useCallback(() => onOptIn(), [onOptIn]);
  const handleOptOut = useCallback(() => onOptOut(), [onOptOut]);

  if (enabled) {
    return (
      <MMHBCard elevation="resting" className={className} style={wrapperStyle}>
        <h3
          style={{
            ...heading.h3,
            fontFamily: fonts.heading,
            color: semantic.fgHeading,
            margin: 0,
          }}
          data-testid="text-circadian-status-on"
        >
          Gentle presence is on.
        </h3>
        <p
          style={{
            ...body.md,
            fontFamily: fonts.body,
            color: semantic.fgBody,
            margin: 0,
          }}
        >
          A soft check-in may appear from time to time. You can ignore any of
          them — nothing is owed.
        </p>
        <p
          style={{
            ...body.sm,
            fontFamily: fonts.body,
            color: semantic.fgMuted,
            margin: 0,
          }}
        >
          Quiet hours: 10pm–7am. /<a
            href="/crisis"
            style={{ color: semantic.accentSecondary }}
          >crisis</a> is always here.
        </p>
        <div style={{ display: "flex", gap: spacing.xs }}>
          <MMHBButton
            variant="tertiary"
            onClick={handleOptOut}
            data-testid="button-circadian-opt-out"
          >
            Turn off
          </MMHBButton>
        </div>
      </MMHBCard>
    );
  }

  return (
    <MMHBCard elevation="resting" className={className} style={wrapperStyle}>
      <h3
        style={{
          ...heading.h3,
          fontFamily: fonts.heading,
          color: semantic.fgHeading,
          margin: 0,
        }}
        data-testid="text-circadian-prompt-title"
      >
        A gentle check-in, only if you'd like.
      </h3>
      <p
        style={{
          ...body.md,
          fontFamily: fonts.body,
          color: semantic.fgBody,
          margin: 0,
        }}
      >
        You choose. No pressure. Quiet, in-app only — no push notifications,
        no streaks, no missed-day messaging. You can turn this off anytime.
      </p>
      <p
        style={{
          ...body.sm,
          fontFamily: fonts.body,
          color: semantic.fgMuted,
          margin: 0,
        }}
      >
        /<a href="/crisis" style={{ color: semantic.accentSecondary }}>crisis</a>{" "}
        is always available.
      </p>
      <div style={{ display: "flex", gap: spacing.xs, flexWrap: "wrap" }}>
        <MMHBButton
          variant="primary"
          onClick={handleOptIn}
          data-testid="button-circadian-opt-in"
        >
          Yes, gently
        </MMHBButton>
        {onDismiss ? (
          <MMHBButton
            variant="tertiary"
            onClick={onDismiss}
            data-testid="button-circadian-dismiss"
          >
            Not now
          </MMHBButton>
        ) : null}
      </div>
    </MMHBCard>
  );
}
