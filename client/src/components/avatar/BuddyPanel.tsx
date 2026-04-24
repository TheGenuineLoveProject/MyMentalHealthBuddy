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

import { useEffect, type ReactNode } from "react";
import BuddyAvatar from "./BuddyAvatar";
import type { BuddyState } from "@/lib/avatarState";
import { emitBuddyEvent } from "@/lib/buddyTelemetry";

export interface BuddyPanelProps {
  /** Buddy emotional state (drives avatar visuals via the v1.9 contract). */
  state: BuddyState;
  /** Headline copy near the avatar. Optional — omit for surfaces that need only the avatar. */
  title?: string;
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

  return (
    <section
      className={`flex flex-col items-center text-center ${className}`}
      data-testid={testId}
      data-surface={surface}
    >
      <BuddyAvatar
        state={state}
        size={size}
        data-testid={`${testId}-avatar`}
      />

      {title && (
        <h2
          className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100"
          data-testid={`${testId}-title`}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className="mt-1 text-sm text-slate-600 dark:text-slate-300"
          data-testid={`${testId}-subtitle`}
        >
          {subtitle}
        </p>
      )}

      {children}
    </section>
  );
}
