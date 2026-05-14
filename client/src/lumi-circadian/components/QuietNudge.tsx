/**
 * Phase 22 — QuietNudge
 *
 * Renders a single pending nudge from the scheduler. Locked contracts:
 *  - Always shows a Skip and a Dismiss affordance (skip ≡ dismiss in
 *    engine semantics; both surfaced so the user can pick whichever
 *    word feels lighter).
 *  - Shows /crisis anchor — never disappears.
 *  - No countdown, no progress bar, no streak, no completion %.
 *  - Architect-style hardening: re-audits the nudge copy at the render
 *    sink. If a host somehow constructs a nudge from outside the
 *    scheduler with forbidden copy, render fails closed.
 */

import { useMemo, type CSSProperties } from "react";
import { MMHBButton, MMHBCard } from "@/design-system";
import {
  fonts,
  heading,
  body,
  semantic,
  spacing,
} from "@/design-system";
import type { PendingNudge } from "../runtime/circadianStateMachine";
import {
  containsForbiddenPhrase,
  MAX_NUDGE_COPY_CHARS,
  MAX_NUDGE_MICRO_CHARS,
} from "../governance/schedulerSafetyRules";

export type QuietNudgeProps = {
  nudge: PendingNudge;
  onAcknowledge?: () => void;
  onSkip: () => void;
  onDismiss: () => void;
  className?: string;
  style?: CSSProperties;
};

export function QuietNudge({
  nudge,
  onAcknowledge,
  onSkip,
  onDismiss,
  className,
  style,
}: QuietNudgeProps) {
  // Architect-style hardening: every nudge is re-audited at the render
  // sink. Fails closed on any forbidden phrase or oversized copy. The
  // throw bubbles up — render is refused.
  useMemo(() => {
    const all = `${nudge.copy} ${nudge.microCopy ?? ""}`;
    if (containsForbiddenPhrase(all)) {
      throw new Error(
        `[lumi-circadian] QuietNudge refused: nudge copy failed audit ` +
          `(contains forbidden phrase).`,
      );
    }
    if (nudge.copy.length > MAX_NUDGE_COPY_CHARS) {
      throw new Error(
        `[lumi-circadian] QuietNudge refused: copy exceeds ${MAX_NUDGE_COPY_CHARS} chars.`,
      );
    }
    if (nudge.microCopy && nudge.microCopy.length > MAX_NUDGE_MICRO_CHARS) {
      throw new Error(
        `[lumi-circadian] QuietNudge refused: microCopy exceeds ${MAX_NUDGE_MICRO_CHARS} chars.`,
      );
    }
  }, [nudge.copy, nudge.microCopy]);

  const wrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
    ...style,
  };

  return (
    <MMHBCard elevation="resting" className={className} style={wrapperStyle}>
      <p
        style={{
          ...heading.h3,
          fontFamily: fonts.heading,
          color: semantic.fgHeading,
          margin: 0,
        }}
        data-testid="text-quiet-nudge-copy"
      >
        {nudge.copy}
      </p>
      {nudge.microCopy ? (
        <p
          style={{
            ...body.sm,
            fontFamily: fonts.body,
            color: semantic.fgMuted,
            margin: 0,
          }}
          data-testid="text-quiet-nudge-micro"
        >
          {nudge.microCopy}
        </p>
      ) : null}
      <p
        style={{
          ...body.sm,
          fontFamily: fonts.body,
          color: semantic.fgMuted,
          margin: 0,
        }}
      >
        /<a
          href="/crisis"
          style={{ color: semantic.accentSecondary }}
          data-testid="link-quiet-nudge-crisis"
        >
          crisis
        </a>{" "}
        is always here.
      </p>
      <div style={{ display: "flex", gap: spacing.xs, flexWrap: "wrap" }}>
        {onAcknowledge ? (
          <MMHBButton
            variant="primary"
            onClick={onAcknowledge}
            data-testid="button-quiet-nudge-acknowledge"
          >
            Thanks
          </MMHBButton>
        ) : null}
        <MMHBButton
          variant="tertiary"
          onClick={onSkip}
          data-testid="button-quiet-nudge-skip"
        >
          Skip
        </MMHBButton>
        <MMHBButton
          variant="tertiary"
          onClick={onDismiss}
          data-testid="button-quiet-nudge-dismiss"
        >
          Dismiss
        </MMHBButton>
      </div>
    </MMHBCard>
  );
}
