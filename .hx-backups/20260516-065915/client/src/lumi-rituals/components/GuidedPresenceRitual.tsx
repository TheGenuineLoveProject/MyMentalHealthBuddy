/**
 * Phase 20 — GuidedPresenceRitual
 *
 * Top-level surface for a single ritual session. Renders an invitation
 * (idle), the active step + controls (active/paused), or a soft closing
 * (completed/skipped/exited). Always exposes pause + skip + exit.
 *
 * NEVER renders:
 *  - Subscription CTA, upsell, "upgrade" prompt
 *  - Streak / progress / completion-percent
 *  - Avatar DOM (Lumi identity is preserved by not being touched)
 *  - A "you must finish" terminal state
 */

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { MMHBButton, MMHBCard } from "@/design-system";
import {
  fonts,
  heading,
  body,
  semantic,
  spacing,
} from "@/design-system";
import { useRitual } from "../runtime/useRitual";
import { RitualStepCard } from "./RitualStepCard";
import type { RitualPreset, RitualStatus } from "../runtime/RitualEngine";
import { isTerminalStatus, shouldNotifyTerminal } from "../runtime/RitualEngine";
import { assertPresetCompliant } from "../governance/ritualSafetyRules";

export type GuidedPresenceRitualProps = {
  preset: RitualPreset;
  /** Called whenever the ritual reaches a terminal status. */
  onClose?: (reason: "completed" | "skipped" | "exited") => void;
  /** Optional element rendered above the controls (e.g. /crisis link). */
  footerSlot?: ReactNode;
  /** Optional className passthrough for surface integration. */
  className?: string;
  style?: CSSProperties;
};

export function GuidedPresenceRitual({
  preset,
  onClose,
  footerSlot,
  className,
  style,
}: GuidedPresenceRitualProps) {
  // Architect-driven hardening: enforce governance at the runtime sink, not
  // just at preset-import time. A host could pass an unaudited preset (e.g.
  // built at runtime) that bypasses module-load freezing/auditing entirely.
  // assertPresetCompliant fails closed — render is refused if the preset
  // contains any forbidden phrase / ceiling violation / missing tone marker.
  // Cached by preset reference so the cost is paid once per preset prop.
  useMemo(() => {
    assertPresetCompliant(preset);
  }, [preset]);

  const r = useRitual(preset);
  const { state, currentStep, reducedMotion } = r;

  // Architect-driven hardening: terminal onClose was previously fired from
  // render via Promise.resolve().then(...), which can double-fire under
  // StrictMode + parent re-renders. Move to a useEffect keyed by status with
  // a useRef dedupe guard — guaranteed one notification per terminal
  // transition, and reset lets the host re-fire if the user starts again.
  const lastNotifiedStatusRef = useRef<RitualStatus | null>(null);
  useEffect(() => {
    const decision = shouldNotifyTerminal(state.status, lastNotifiedStatusRef.current);
    lastNotifiedStatusRef.current = decision.nextLastNotified;
    if (decision.notify && onClose) {
      onClose(state.status as "completed" | "skipped" | "exited");
    }
  }, [state.status, onClose]);

  const wrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
    width: "100%",
    maxWidth: 640,
    margin: "0 auto",
    ...style,
  };

  const frameHeading: CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: heading.h2.size,
    lineHeight: heading.h2.lineHeight,
    letterSpacing: heading.h2.letterSpacing,
    fontWeight: heading.h2.weight,
    color: semantic.fgHeading,
    margin: 0,
  };

  const frameBody: CSSProperties = {
    fontFamily: fonts.body,
    fontSize: body.md.size,
    lineHeight: body.md.lineHeight,
    color: semantic.fgBody,
    margin: 0,
  };

  const controlsRow: CSSProperties = {
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap",
    justifyContent: "flex-start",
  };

  const crisisAnchor = (
    <p
      style={{
        fontFamily: fonts.body,
        fontSize: body.sm.size,
        lineHeight: body.sm.lineHeight,
        color: semantic.fgMuted,
        margin: 0,
      }}
      data-testid="ritual-crisis-anchor"
    >
      If anything feels too much, <a href="/crisis" style={{ color: semantic.accentSecondary }}>/crisis</a> is always here.
    </p>
  );

  // ─── Idle: gentle invitation ───────────────────────────────────────────────
  if (state.status === "idle") {
    return (
      <div
        className={className}
        style={wrapperStyle}
        data-testid="guided-presence-ritual"
        data-status="idle"
        role="region"
        aria-label="Guided presence ritual"
      >
        <MMHBCard elevation="resting">
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
            <h2 style={frameHeading} data-testid="ritual-invitation-heading">
              {preset.internalName}
            </h2>
            <p style={frameBody} data-testid="ritual-invitation-text">
              {preset.invitationText}
            </p>
            {crisisAnchor}
            <div style={controlsRow}>
              <MMHBButton
                variant="primary"
                onClick={r.start}
                data-testid="button-ritual-begin"
              >
                Begin gently
              </MMHBButton>
              <MMHBButton
                variant="tertiary"
                onClick={r.exit}
                data-testid="button-ritual-not-now"
              >
                Not now
              </MMHBButton>
            </div>
            {footerSlot}
          </div>
        </MMHBCard>
      </div>
    );
  }

  // ─── Terminal: soft closing ────────────────────────────────────────────────
  if (isTerminalStatus(state.status)) {
    const closingCopy =
      state.status === "completed"
        ? preset.closing
        : state.status === "skipped"
          ? "Skipping is fine. Nothing to prove. You're free to step away."
          : "You stepped away gently. That's always okay.";
    return (
      <div
        className={className}
        style={wrapperStyle}
        data-testid="guided-presence-ritual"
        data-status={state.status}
        role="region"
        aria-label="Guided presence ritual"
      >
        <MMHBCard elevation="resting">
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
            <p style={frameBody} data-testid="ritual-closing-text">
              {closingCopy}
            </p>
            {crisisAnchor}
            <div style={controlsRow}>
              <MMHBButton
                variant="tertiary"
                onClick={r.reset}
                data-testid="button-ritual-restart"
              >
                Begin again, slowly
              </MMHBButton>
            </div>
            {footerSlot}
          </div>
        </MMHBCard>
      </div>
    );
  }

  // ─── Active / paused: step + controls ──────────────────────────────────────
  return (
    <div
      className={className}
      style={wrapperStyle}
      data-testid="guided-presence-ritual"
      data-status={state.status}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      role="region"
      aria-label="Guided presence ritual"
    >
      {currentStep ? (
        <RitualStepCard step={currentStep} reducedMotion={reducedMotion} />
      ) : null}

      <div style={controlsRow}>
        {state.status === "active" ? (
          <>
            <MMHBButton
              variant="primary"
              onClick={r.next}
              data-testid="button-ritual-continue"
            >
              Continue
            </MMHBButton>
            <MMHBButton
              variant="secondary"
              onClick={r.pause}
              data-testid="button-ritual-pause"
            >
              Pause
            </MMHBButton>
            <MMHBButton
              variant="tertiary"
              onClick={r.skipStep}
              data-testid="button-ritual-skip-step"
            >
              Skip this step
            </MMHBButton>
            <MMHBButton
              variant="tertiary"
              onClick={r.exit}
              data-testid="button-ritual-exit"
            >
              Step away
            </MMHBButton>
          </>
        ) : (
          // paused
          <>
            <MMHBButton
              variant="primary"
              onClick={r.resume}
              data-testid="button-ritual-resume"
            >
              Resume gently
            </MMHBButton>
            <MMHBButton
              variant="tertiary"
              onClick={r.skipStep}
              data-testid="button-ritual-skip-step"
            >
              Skip this step
            </MMHBButton>
            <MMHBButton
              variant="tertiary"
              onClick={r.exit}
              data-testid="button-ritual-exit"
            >
              Step away
            </MMHBButton>
          </>
        )}
      </div>

      {crisisAnchor}
      {footerSlot}
    </div>
  );
}
