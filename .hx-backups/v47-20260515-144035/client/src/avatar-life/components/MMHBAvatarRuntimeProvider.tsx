/**
 * Phase 11 — React provider that mounts an isolated avatar runtime per surface.
 *
 * Each provider creates its own Zustand store (via `AvatarStoreProvider`),
 * so multiple surfaces (hero + chat + buddy) can mount concurrently
 * without cross-contaminating state, telemetry, or crisis locks.
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  type EmotionalState,
  type SurfaceContext,
  SURFACE_DEFAULT_STATE,
} from "../types/avatarLifeTypes";
import { AvatarStoreProvider } from "../state/useAvatarLifeStore";
import { useAvatarPresenceRuntime } from "../hooks/useAvatarPresenceRuntime";

interface RuntimeContextValue {
  surface: SurfaceContext;
  defaultState: EmotionalState;
}

const RuntimeContext = createContext<RuntimeContextValue | null>(null);

interface ProviderProps {
  surfaceContext: SurfaceContext;
  defaultState?: EmotionalState;
  /** Enable rAF FPS sampler. Off by default — flip on for hero only. */
  sampleFps?: boolean;
  children: ReactNode;
}

function RuntimeInner({
  surfaceContext,
  defaultState,
  sampleFps,
  children,
}: Required<Pick<ProviderProps, "surfaceContext">> & ProviderProps) {
  const initialState = defaultState ?? SURFACE_DEFAULT_STATE[surfaceContext] ?? "calmIdle";
  useAvatarPresenceRuntime({ surface: surfaceContext, initialState, sampleFps });
  const value = useMemo<RuntimeContextValue>(
    () => ({ surface: surfaceContext, defaultState: initialState }),
    [surfaceContext, initialState],
  );
  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}

export function MMHBAvatarRuntimeProvider(props: ProviderProps) {
  return (
    <AvatarStoreProvider surface={props.surfaceContext}>
      <RuntimeInner {...props} />
    </AvatarStoreProvider>
  );
}

/** Optional: read the active surface context from a child component. */
export function useAvatarRuntimeContext(): RuntimeContextValue {
  const ctx = useContext(RuntimeContext);
  if (!ctx) {
    throw new Error(
      "useAvatarRuntimeContext must be called inside <MMHBAvatarRuntimeProvider>",
    );
  }
  return ctx;
}
