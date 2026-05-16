/**
 * Phase 11 — Type-safe avatar runtime telemetry.
 *
 * Discriminated-union event emitter. ZERO PII, ZERO pointer coordinates,
 * ZERO journal/mood content ever. Subscribers register typed listeners
 * and receive the exhaustive event union — TS will catch missing cases.
 *
 * Default sink: noop. Production wires to Sentry/PostHog only when an
 * adapter is registered. Per-event payloads are bounded (no arrays of
 * unbounded length, no free-form strings beyond rule/detail).
 */

import type {
  AvatarTelemetryEvent,
  TelemetryListener,
} from "../types/avatarLifeTypes";

const listeners = new Set<TelemetryListener>();
const lastFpsEmitBySurface = new Map<string, number>();
const FPS_EMIT_THROTTLE_MS = 5000;

/** Subscribe to avatar telemetry. Returns an unsubscribe function. */
export function onAvatarTelemetry(listener: TelemetryListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Emit an event to all subscribers. Throttles fps_sample at 1/5s. */
export function emitAvatarTelemetry(event: AvatarTelemetryEvent): void {
  if (event.type === "avatar:fps_sample") {
    // Throttle PER SURFACE — concurrent hero + chat diagnostics must not
    // suppress each other (architect P11.2 fix).
    const last = lastFpsEmitBySurface.get(event.surface) ?? 0;
    if (event.ts - last < FPS_EMIT_THROTTLE_MS) return;
    lastFpsEmitBySurface.set(event.surface, event.ts);
  }
  for (const l of listeners) {
    try {
      l(event);
    } catch {
      // Telemetry must never break the avatar. Swallow listener errors.
    }
  }
}

/** Test-only: clear all listeners. */
export function __resetAvatarTelemetry(): void {
  listeners.clear();
  lastFpsEmitBySurface.clear();
}

/** Convenience: emit a contract violation directly from any module. */
export function reportContractViolation(rule: string, detail: string): void {
  emitAvatarTelemetry({
    type: "avatar:contract_violation",
    rule,
    detail,
    ts: Date.now(),
  });
}
