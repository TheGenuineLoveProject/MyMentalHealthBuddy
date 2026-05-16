/**
 * Phase 14 — Zustand store with HARD GOVERNANCE.
 *
 * Trust-first contract enforced at the reducer level:
 *   - subscriptionMentioned can ONLY become true via the guarded goToOffer()
 *     action, and goToOffer() rejects unless breathingCompleted === true.
 *   - requireBreathingBeforeOffer is a module-level constant; there is no
 *     setter. Tests and lint can verify this by AST inspection.
 */

import { useMemo } from "react";
import { create } from "zustand";
import type {
  FlowActions,
  FlowState,
  IsSubscriptionMessagingAllowed,
  MoodId,
  ShiftId,
} from "../types/checkInFlowTypes";

/** Locked governance constant. Do not expose a setter. */
export const REQUIRE_BREATHING_BEFORE_OFFER = true;

const initialState: FlowState = {
  step: "welcome",
  selectedMood: null,
  selectedShift: null,
  breathingCompleted: false,
  subscriptionMentioned: false,
  startedAt: null,
  completedAt: null,
};

type Store = FlowState & FlowActions;

export const useCheckInFlowStore = create<Store>((set, get) => ({
  ...initialState,

  selectMood: (mood: MoodId) =>
    set((s) => ({
      selectedMood: mood,
      startedAt: s.startedAt ?? Date.now(),
    })),

  startBreathing: () =>
    set((s) => {
      if (!s.selectedMood) return s; // gentle no-op, no error
      return { step: "breathing" };
    }),

  setBreathingCompleted: () =>
    set((s) => {
      // HARD GUARD — only completable from the breathing step.
      // Prevents non-UI callers from skipping the timed exercise to unlock offer.
      if (s.step !== "breathing") {
        if (typeof console !== "undefined") {
          console.warn(
            "[checkin-flow] Refused setBreathingCompleted(): not on breathing step (CF-R001).",
          );
        }
        return s;
      }
      return { breathingCompleted: true, step: "checkout" };
    }),

  selectShift: (shift: ShiftId) => set(() => ({ selectedShift: shift })),

  goToOffer: () => {
    const s = get();
    // HARD GUARD — never allow offer step without completed breathing.
    if (REQUIRE_BREATHING_BEFORE_OFFER && !s.breathingCompleted) {
      if (typeof console !== "undefined") {
        console.warn(
          "[checkin-flow] Refused goToOffer(): breathing not completed (CF-R001).",
        );
      }
      return;
    }
    if (!s.selectedShift) {
      // Gentle gate: a shift selection is also required.
      return;
    }
    set({ step: "offer", subscriptionMentioned: true });
  },

  acceptOffer: () =>
    set(() => ({ step: "complete", completedAt: Date.now() })),

  declineOffer: () =>
    set(() => ({ step: "declined", completedAt: Date.now() })),

  reset: () => set(() => ({ ...initialState })),
}));

/**
 * Selector — subscription messaging is allowed ONLY when:
 *   1. Breathing has completed
 *   2. The store has explicitly transitioned to step="offer"
 *   3. subscriptionMentioned has been flipped true by goToOffer()
 *
 * Any UI rendering subscription content MUST gate behind this.
 */
export const isSubscriptionMessagingAllowed: IsSubscriptionMessagingAllowed = (
  state,
) =>
  state.breathingCompleted === true &&
  state.step === "offer" &&
  state.subscriptionMentioned === true;

/* ========================================================================== *
 *  PUBLIC API (exposed via barrel `@/checkin-flow`)
 *
 *  External consumers CANNOT bypass governance via raw `setState` / `getState`
 *  because the barrel does not re-export `useCheckInFlowStore`. They get only:
 *
 *    - <MMHBCheckInFlow />           — orchestrator
 *    - useCheckInFlowState(selector) — read-only state subscription
 *    - useCheckInFlowActions()       — bound actions object (no setState)
 *    - isSubscriptionMessagingAllowed selector
 *    - auditFlow() / rules
 *
 *  The raw `useCheckInFlowStore` hook is kept exported so module-internal
 *  components (and the governance test suite) can mount it; reaching into it
 *  from outside the module is a documented Sev-1 governance violation.
 * ========================================================================== */

/** Read-only selector hook — subscribes a component to a slice of state. */
export function useCheckInFlowState<T>(
  selector: (state: FlowState) => T,
): T {
  return useCheckInFlowStore((s) => selector(s));
}

/** Returns the bound action object only — no state, no setState. */
export function useCheckInFlowActions(): FlowActions {
  const selectMood = useCheckInFlowStore((s) => s.selectMood);
  const startBreathing = useCheckInFlowStore((s) => s.startBreathing);
  const setBreathingCompleted = useCheckInFlowStore((s) => s.setBreathingCompleted);
  const selectShift = useCheckInFlowStore((s) => s.selectShift);
  const goToOffer = useCheckInFlowStore((s) => s.goToOffer);
  const acceptOffer = useCheckInFlowStore((s) => s.acceptOffer);
  const declineOffer = useCheckInFlowStore((s) => s.declineOffer);
  const reset = useCheckInFlowStore((s) => s.reset);
  return useMemo(
    () => ({
      selectMood,
      startBreathing,
      setBreathingCompleted,
      selectShift,
      goToOffer,
      acceptOffer,
      declineOffer,
      reset,
    }),
    [
      selectMood,
      startBreathing,
      setBreathingCompleted,
      selectShift,
      goToOffer,
      acceptOffer,
      declineOffer,
      reset,
    ],
  );
}

/**
 * Static structural probe — used by governance rules CF-R004 / CF-R011 to
 * verify that the store API still exposes the actions required for the
 * "early exit always allowed" / "decline reachable from any step" contracts.
 * This avoids placeholder `() => true` rules that audit nothing.
 */
export function getStoreApiSurface(): Readonly<Record<keyof FlowActions, "function" | "missing">> {
  const s = useCheckInFlowStore.getState();
  return {
    selectMood: typeof s.selectMood === "function" ? "function" : "missing",
    startBreathing: typeof s.startBreathing === "function" ? "function" : "missing",
    setBreathingCompleted:
      typeof s.setBreathingCompleted === "function" ? "function" : "missing",
    selectShift: typeof s.selectShift === "function" ? "function" : "missing",
    goToOffer: typeof s.goToOffer === "function" ? "function" : "missing",
    acceptOffer: typeof s.acceptOffer === "function" ? "function" : "missing",
    declineOffer: typeof s.declineOffer === "function" ? "function" : "missing",
    reset: typeof s.reset === "function" ? "function" : "missing",
  };
}
