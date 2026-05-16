/**
 * BuddyPanel.tsx — MMHB Buddy Engine v2.0.
 *
 * Reusable, cross-platform Buddy companion wrapper.
 *
 * Visual / presentational only:
 *   - imports BuddyAvatar
 *   - NO fetch
 *   - NO AI calls
 *   - NO business logic
 *   - NO monetization logic
 *   - NO crisis-detection logic (delegates entirely to upstream `state` prop)
 *
 * Designed so any healing surface (start, onboarding, journaling,
 * mood/check-in, tools) can render Buddy with consistent framing —
 * a calm visual companion, never the controller of the surface.
 *
 * Telemetry (additive): `buddy_panel_viewed { surface, state }` fires
 * once per mount per (surface, state) tuple. No message text, no AI
 * reply, no profile content. Both `surface` and `state` are bucketed
 * system-defined enums chosen by the parent.
 */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import BuddyAvatar from "./BuddyAvatar";
import type { BuddyState } from "@/lib/avatarState";
import { emitBuddyEvent } from "@/lib/buddyTelemetry";
import { BUDDY_PANEL_COPY } from "@/content/microcopy/wellnessMicrocopy";
import { MonetizationBoundaryValidator } from "@/governance/interactions/MonetizationBoundaryValidator";
import { CrisisOverrideEngine } from "@/governance/interactions/CrisisOverrideEngine";

// HX-OS Interaction Governance — emotional-state buckets that gate business actions.
// Per MMHB v7.4 Primary Law: monetization is prohibited inside regulated healing flows,
// and any crisis/vulnerable/escalation signal must hard-suspend it.
const CRISIS_STATES: readonly BuddyState[] = ["crisis"];
const VULNERABLE_STATES: readonly BuddyState[] = ["sad", "anxious", "overwhelmed", "crisis"];
const DYSREGULATED_STATES: readonly BuddyState[] = ["overwhelmed", "crisis"];

/**
 * v1.15 active-listener reflection rotator.
 *
 * Looks up the surface key in BUDDY_PANEL_COPY and, if a `reflections`
 * array exists, returns the current reflection for the rotation index.
 * Returns null otherwise — keeps surfaces that don't define reflections
 * (or any future surface that opts out) completely silent.
 *
 * Pure read-only data lookup. No network, no AI, no fetch. Fully typed.
 */
function getReflectionForSurface(
  surface: string,
  index: number,
): string | null {
  const entry = (BUDDY_PANEL_COPY as Record<string, { reflections?: readonly string[] }>)[surface];
  const list = entry?.reflections;
  if (!list || list.length === 0) return null;
  return list[index % list.length];
}

const REFLECTION_ROTATE_MS = 5500;

export interface BuddyPanelProps {
  /** Buddy emotional state (drives avatar visuals via the v1.9 contract). */
  state: BuddyState;
  /** Headline copy near the avatar. Optional — omit for surfaces that need only the avatar. */
  title?: string;
  /**
   * Element used to render `title`. Defaults to `"h2"` (preserves /start hero
   * semantics where Buddy IS the page heading). Pass `"p"` on companion
   * placements where the host page already owns its primary `<h1>` so the
   * panel does not inject a competing heading into the document outline
   * (work-surface adopters: /journal, /state, /pathways/onboarding).
   * v2.4 a11y sweep — keeps the page's own h1 as the unambiguous primary
   * heading without changing /start (default unchanged).
   */
  titleAs?: "h2" | "p";
  /** Subtitle string. For richer subtitle content (live regions, formatted copy), use `children` instead. */
  subtitle?: string;
  /** Surface identifier for telemetry bucketing (e.g. "start", "onboarding", "journal"). */
  surface: string;
  /** Avatar pixel size. Defaults to 140 for parity with the /start hero. */
  size?: number;
  /** Optional richer subtitle content (e.g. existing aria-live helper-copy region). Renders below `subtitle` if both provided. */
  children?: ReactNode;
  className?: string;
  "data-testid"?: string;
}

export default function BuddyPanel({
  state,
  title,
  titleAs = "h2",
  subtitle,
  surface,
  size = 140,
  children,
  className = "",
  "data-testid": testId = "panel-buddy",
}: BuddyPanelProps) {
  // v2.0 telemetry — fires once per (surface, state) mount tuple.
  // Re-fires when state changes so funnel analyses can attribute panel
  // impressions to the emotional state Buddy was rendering at that moment.
  // No message text, no AI reply, no profile data — only enum metadata.
  // Uses the shared, typed `emitBuddyEvent` helper (v2.1) so every
  // Buddy surface — present and future — gets identical wire shape,
  // identical guest-ID handling, and compile-time payload checking.
  useEffect(() => {
    emitBuddyEvent("buddy_panel_viewed", { surface, state });
  }, [surface, state]);

  // v1.15 active-listener — gentle rotation of trauma-informed reflective
  // microcopy. Pure presentational. No fetch, no AI, no business logic.
  // Index advances on a calm cadence (5.5s) so phrases never feel pushy.
  // `prefers-reduced-motion` users still see the rotation (opacity stays
  // constant, only the text content changes), so no motion-policy issue.
  // The text region is wrapped in aria-live="polite" so screen readers
  // get the supportive companion phrase without it interrupting.
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const reflection = getReflectionForSurface(surface, reflectionIndex);
  useEffect(() => {
    if (!reflection) return; // surface has no reflections — nothing to rotate
    const id = window.setInterval(() => {
      setReflectionIndex((i) => i + 1);
    }, REFLECTION_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reflection, surface]);

  // HX-OS Interaction Governance — Runtime Enforcement (v5.8.120, BuddyPanel iter 2).
  // Deterministic, memoized gates derived from the bucketed `state` + `surface` props.
  // No fetch, no AI, no new behavior — pure logic + observable data-* attrs.
  const crisisDetected = useMemo(
    () => CRISIS_STATES.includes(state),
    [state],
  );
  const isVulnerable = useMemo(
    () => VULNERABLE_STATES.includes(state),
    [state],
  );
  const dysregulated = useMemo(
    () => DYSREGULATED_STATES.includes(state),
    [state],
  );

  const overrideState = useMemo(
    () =>
      CrisisOverrideEngine.getOverrideState({
        crisisDetected,
        escalationRequired: dysregulated,
      }),
    [crisisDetected, dysregulated],
  );

  const monetizationGate = useMemo(
    () =>
      MonetizationBoundaryValidator.validate({
        route: `/${surface}`,
        action: "any-business-action",
        emotionalState: {
          crisisDetected,
          isVulnerable,
          dysregulated,
        },
      }),
    [surface, crisisDetected, isVulnerable, dysregulated],
  );

  return (
    <section
      className={`flex flex-col items-center text-center ${className}`}
      data-testid={testId}
      data-surface={surface}
      data-crisis-active={crisisDetected ? "true" : "false"}
      data-vulnerable={isVulnerable ? "true" : "false"}
      data-dysregulated={dysregulated ? "true" : "false"}
      data-monetization-suspended={overrideState.monetizationSuspended ? "true" : "false"}
      data-monetization-allowed={monetizationGate.allowed ? "true" : "false"}
      data-conversion-disabled={overrideState.conversionDisabled ? "true" : "false"}
      data-paywalls-blocked={overrideState.paywallsBlocked ? "true" : "false"}
    >
      <BuddyAvatar
        state={state}
        size={size}
        overlay
        data-testid={`${testId}-avatar`}
      />

      {title && titleAs === "h2" && (
        <h2
          className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100"
          data-testid={`${testId}-title`}
        >
          {title}
        </h2>
      )}

      {title && titleAs === "p" && (
        <p
          className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100"
          data-testid={`${testId}-title`}
        >
          {title}
        </p>
      )}

      {subtitle && (
        <p
          className="mt-1 text-sm text-slate-600 dark:text-slate-300"
          data-testid={`${testId}-subtitle`}
        >
          {subtitle}
        </p>
      )}

      {/* v1.15 active-listener reflection — calmly rotating reflective
          microcopy. Politely announced via aria-live so screen readers
          hear the supportive companion phrase without losing focus.
          Hidden entirely if the surface has no reflections defined. */}
      {reflection && (
        <p
          className="mt-2 text-xs italic text-slate-500 dark:text-slate-400 transition-opacity duration-500"
          data-testid={`${testId}-reflection`}
          aria-live="polite"
        >
          {reflection}
        </p>
      )}

      {children}
    </section>
  );
}
