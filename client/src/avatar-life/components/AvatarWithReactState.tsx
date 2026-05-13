/**
 * Phase 11 — Bridge component.
 *
 * Architecture rule: ONLY 4 React values are exposed for re-renders:
 *   reducedMotion, currentState, fps, interactionIntensity
 *
 * Render-prop pattern lets dashboards / dev panels / a11y badges read
 * the bridge values without coupling to Zustand directly. Internal
 * motion (transforms, glow, breath, float) NEVER flows through React.
 */

import { type ReactNode } from "react";
import { useAvatarLifeStore, selectReactBridge } from "../state/useAvatarLifeStore";
import type { AvatarReactState } from "../types/avatarLifeTypes";

interface BridgeProps {
  children: (state: AvatarReactState) => ReactNode;
}

export function AvatarWithReactState({ children }: BridgeProps) {
  const bridge = useAvatarLifeStore(selectReactBridge);
  return <>{children(bridge)}</>;
}
