/**
 * Phase 23 — VoiceCaptionOverlay
 *
 * Caption display overlay. Bottom-center. Auto-dismiss with fade.
 * Pure presentation — receives captions array from useVoicePresence.
 */

import { colors, spacing, typography, radius } from "@/design-system";
import type { Caption } from "../accessibility/captionsMode";

export interface VoiceCaptionOverlayProps {
  readonly captions: ReadonlyArray<Caption>;
  readonly className?: string;
}

export function VoiceCaptionOverlay({ captions, className }: VoiceCaptionOverlayProps) {
  if (!captions || captions.length === 0) return null;
  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      data-testid="voice-caption-overlay"
      style={{
        position: "fixed",
        left: "50%",
        bottom: spacing.xl,
        transform: "translateX(-50%)",
        maxWidth: "min(90vw, 640px)",
        display: "flex",
        flexDirection: "column",
        gap: spacing.xs,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {captions.map((c) => (
        <div
          key={c.id}
          style={{
            fontFamily: typography.fonts.body,
            color: colors.semantic.fgBody,
            background: "rgba(255, 255, 255, 0.92)",
            border: `1px solid ${colors.semantic.fgMuted}`,
            borderRadius: radius.md,
            padding: `${spacing.xs} ${spacing.sm}`,
            textAlign: "center",
            transition: "opacity 400ms ease-out",
            opacity: 0.96,
          }}
        >
          {c.text}
        </div>
      ))}
    </div>
  );
}
