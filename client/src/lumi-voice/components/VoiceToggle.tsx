/**
 * Phase 23 — VoiceToggle
 *
 * Opt-in toggle. OFF by default. Shows confirmation copy before enabling.
 * Uses design-system tokens only.
 */

import { useState } from "react";
import { MMHBCard, MMHBButton, colors, spacing, typography } from "@/design-system";

export interface VoiceToggleProps {
  readonly enabled: boolean;
  readonly onChange: (next: boolean) => void;
  readonly className?: string;
}

export function VoiceToggle({ enabled, onChange, className }: VoiceToggleProps) {
  const [confirming, setConfirming] = useState(false);

  if (enabled) {
    return (
      <MMHBCard elevation="resting" className={className}>
        <div style={{ padding: spacing.md }}>
          <p
            style={{
              fontFamily: typography.fonts.heading,
              color: colors.semantic.fgHeading,
              margin: 0,
              marginBottom: spacing.sm,
            }}
          >
            Lumi's voice is on.
          </p>
          <p
            style={{
              fontFamily: typography.fonts.body,
              color: colors.semantic.fgMuted,
              margin: 0,
              marginBottom: spacing.md,
            }}
          >
            You can turn it off any time. Captions stay on either way.
          </p>
          <MMHBButton
            variant="tertiary"
            size="sm"
            onClick={() => onChange(false)}
            data-testid="button-voice-disable"
          >
            Turn off
          </MMHBButton>
        </div>
      </MMHBCard>
    );
  }

  if (confirming) {
    return (
      <MMHBCard elevation="resting" className={className}>
        <div style={{ padding: spacing.md }}>
          <p
            style={{
              fontFamily: typography.fonts.heading,
              color: colors.semantic.fgHeading,
              margin: 0,
              marginBottom: spacing.sm,
            }}
          >
            Enable Lumi's voice?
          </p>
          <p
            style={{
              fontFamily: typography.fonts.body,
              color: colors.semantic.fgBody,
              margin: 0,
              marginBottom: spacing.md,
            }}
          >
            Soft and quiet. Volume is capped low. Captions appear with every
            line. You can turn it off any time.
          </p>
          <div style={{ display: "flex", gap: spacing.sm }}>
            <MMHBButton
              variant="primary"
              size="sm"
              onClick={() => {
                onChange(true);
                setConfirming(false);
              }}
              data-testid="button-voice-confirm"
            >
              Yes, gently
            </MMHBButton>
            <MMHBButton
              variant="tertiary"
              size="sm"
              onClick={() => setConfirming(false)}
              data-testid="button-voice-cancel"
            >
              Not now
            </MMHBButton>
          </div>
        </div>
      </MMHBCard>
    );
  }

  return (
    <MMHBCard elevation="resting" className={className}>
      <div style={{ padding: spacing.md }}>
        <p
          style={{
            fontFamily: typography.fonts.heading,
            color: colors.semantic.fgHeading,
            margin: 0,
            marginBottom: spacing.sm,
          }}
        >
          Lumi's voice is off.
        </p>
        <p
          style={{
            fontFamily: typography.fonts.body,
            color: colors.semantic.fgMuted,
            margin: 0,
            marginBottom: spacing.md,
          }}
        >
          Captions still work. Voice is opt-in.
        </p>
        <MMHBButton
          variant="primary"
          size="sm"
          onClick={() => setConfirming(true)}
          data-testid="button-voice-enable"
        >
          Enable Lumi's voice
        </MMHBButton>
      </div>
    </MMHBCard>
  );
}
