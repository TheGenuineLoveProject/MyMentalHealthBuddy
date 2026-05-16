/**
 * First-check-in completion flag (Presence route guard).
 *
 * The /presence page is only accessible after the user has completed their
 * first Calm Check-in (Phase 14). This helper persists a single localStorage
 * boolean so the route guard can decide non-destructively (no DB write).
 *
 * Versioned key so a future schema change can ignore older entries without
 * breaking the gate. Read is SSR-safe (returns false when window is absent).
 */

const FIRST_CHECKIN_KEY = "mmhb:first_checkin_completed:v1";

export function hasCompletedFirstCheckin(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(FIRST_CHECKIN_KEY) === "true";
  } catch {
    return false;
  }
}

export function markFirstCheckinComplete(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FIRST_CHECKIN_KEY, "true");
  } catch {
    /* localStorage disabled — gate stays closed, user can re-attempt */
  }
}

export function clearFirstCheckinFlag(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(FIRST_CHECKIN_KEY);
  } catch {
    /* no-op */
  }
}
