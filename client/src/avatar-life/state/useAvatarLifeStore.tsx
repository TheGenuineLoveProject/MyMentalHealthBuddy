/**
 * Phase 11 — ONE store, ONE state object — PER SURFACE.
 *
 * Zustand store *factory* + React context provider. Each
 * `MMHBAvatarRuntimeProvider` instantiates its own isolated store, so
 * hero/chat/buddy never cross-contaminate state, telemetry, or crisis
 * locks. Components must NOT hold local copies — all interaction state
 * lives in the per-surface store and is read via selector hooks.
 */

import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";
import { createStore, useStore } from "zustand";
import {
  EMOTIONAL_STATES,
  type EmotionalState,
  type SurfaceContext,
  SURFACE_DEFAULT_STATE,
} from "../types/avatarLifeTypes";

export interface AvatarLifeState {
  currentState: EmotionalState;
  surface: SurfaceContext;
  crisis: boolean;
  reducedMotion: boolean;
  fps: number;
  hover: boolean;
  proximity: boolean;
  clicked: boolean;
  mounted: boolean;

  setState: (next: EmotionalState) => void;
  setSurface: (next: SurfaceContext) => void;
  setCrisis: (next: boolean) => void;
  setReducedMotion: (next: boolean) => void;
  setFps: (next: number) => void;
  setHover: (next: boolean) => void;
  setProximity: (next: boolean) => void;
  setClicked: (next: boolean) => void;
  setMounted: (next: boolean) => void;
  resetForSurface: (surface: SurfaceContext) => void;
}

export type AvatarLifeStoreApi = ReturnType<typeof createAvatarLifeStore>;

const VALID_STATE_SET = new Set<EmotionalState>(EMOTIONAL_STATES);

/** Create an isolated avatar-life store. Called once per provider. */
export function createAvatarLifeStore(initialSurface: SurfaceContext = "hero") {
  return createStore<AvatarLifeState>((set) => ({
    currentState: SURFACE_DEFAULT_STATE[initialSurface] ?? "calmIdle",
    surface: initialSurface,
    crisis: false,
    reducedMotion: false,
    fps: 0,
    hover: false,
    proximity: false,
    clicked: false,
    mounted: false,

    setState: (next) =>
      set((s) =>
        VALID_STATE_SET.has(next) && next !== s.currentState
          ? { currentState: next }
          : s,
      ),
    setSurface: (next) => set({ surface: next }),
    setCrisis: (next) =>
      set((s) =>
        next
          ? { crisis: true, hover: false, proximity: false, clicked: false }
          : s.crisis === next
            ? s
            : { crisis: false },
      ),
    setReducedMotion: (next) =>
      set((s) => (s.reducedMotion === next ? s : { reducedMotion: next })),
    setFps: (next) => set({ fps: Math.max(0, Math.round(next)) }),
    setHover: (next) =>
      set((s) => (s.crisis ? s : s.hover === next ? s : { hover: next })),
    setProximity: (next) =>
      set((s) => (s.crisis ? s : s.proximity === next ? s : { proximity: next })),
    setClicked: (next) =>
      set((s) => (s.crisis ? s : s.clicked === next ? s : { clicked: next })),
    setMounted: (next) => set({ mounted: next }),
    resetForSurface: (surface) =>
      set({
        surface,
        currentState: SURFACE_DEFAULT_STATE[surface] ?? "calmIdle",
        crisis: false,
        hover: false,
        proximity: false,
        clicked: false,
      }),
  }));
}

const AvatarStoreContext = createContext<AvatarLifeStoreApi | null>(null);

interface ProviderProps {
  surface: SurfaceContext;
  children: ReactNode;
}

/** Internal provider — wraps children with an isolated per-surface store. */
export function AvatarStoreProvider({ surface, children }: ProviderProps) {
  const ref = useRef<AvatarLifeStoreApi | null>(null);
  if (!ref.current) ref.current = createAvatarLifeStore(surface);
  return (
    <AvatarStoreContext.Provider value={ref.current}>
      {children}
    </AvatarStoreContext.Provider>
  );
}

/** Read the active store API from context. Throws outside a provider. */
export function useAvatarStoreApi(): AvatarLifeStoreApi {
  const api = useContext(AvatarStoreContext);
  if (!api) {
    throw new Error(
      "Avatar runtime hooks must be used inside <MMHBAvatarRuntimeProvider>.",
    );
  }
  return api;
}

/** Selector hook — re-renders only when the selected slice changes. */
export function useAvatarLifeStore<T>(selector: (s: AvatarLifeState) => T): T {
  const api = useAvatarStoreApi();
  return useStore(api, selector);
}

/** Convenience: get the current store snapshot (for event handlers). */
export function useAvatarLifeStoreActions() {
  const api = useAvatarStoreApi();
  return useMemo(
    () => ({
      get: api.getState,
      set: api.setState,
    }),
    [api],
  );
}

/** Selector: derived 0..1 interaction intensity. */
export const selectInteractionIntensity = (s: AvatarLifeState): number => {
  if (s.crisis) return 0;
  let v = 0;
  if (s.hover) v += 0.3;
  if (s.proximity) v += 0.4;
  if (s.clicked) v += 0.3;
  return Math.min(1, v);
};

/** Selector tuple for the React bridge — exactly 4 values. */
export const selectReactBridge = (s: AvatarLifeState) => ({
  reducedMotion: s.reducedMotion,
  currentState: s.currentState,
  fps: s.fps,
  interactionIntensity: selectInteractionIntensity(s),
});
