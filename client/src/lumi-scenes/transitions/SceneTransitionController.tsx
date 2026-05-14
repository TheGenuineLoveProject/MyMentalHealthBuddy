/**
 * Phase 19 — Soft scene crossfade + fog + lighting controller
 *
 * Renders scene layers BEHIND/AROUND `children` (Lumi). Identity contract:
 * this component never reads or modifies `children` props — Lumi's body,
 * face, and colors are untouched.
 *
 * Layers (z-index ascending):
 *   z-0  background gradient (current)
 *   z-1  background gradient (previous, fading out during crossfade)
 *   z-2  particle layer
 *   z-3  fog overlay (opacity ≤ 0.15)
 *   z-4  lighting wash (opacity = preset.lighting * 0.4, max ~0.32)
 *   z-10 children (Lumi)
 *
 * Crossfade is opacity-only — no transforms, no scale, no abrupt swaps.
 */

import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useScenePreset } from "../runtime/useScenePreset";
import {
  MIN_TRANSITION_MS,
} from "../governance/presetSafetyRules";
import type { SceneState, ScenePreset } from "../runtime/ScenePresetEngine";

export type SceneTransitionControllerProps = {
  /** Initial scene state. Defaults to "calm" → Still Meadow. */
  initialState?: SceneState;
  /**
   * Optional controlled-mode override. When set, the component listens to
   * this prop instead of relying on `useScenePreset.setSceneState`. Useful
   * when an external state (e.g., Lumi's emotional state machine) drives
   * the scene.
   */
  state?: SceneState;
  /** Wraps Lumi (or whatever the host wants on top). */
  children?: ReactNode;
  /** Additional class for the outer container. */
  className?: string;
  /** Additional inline styles for the outer container. */
  style?: CSSProperties;
  /** Test-only override: skip audio playback even if preset has audio.src. */
  disableAudio?: boolean;
};

export function SceneTransitionController({
  initialState = "calm",
  state,
  children,
  className,
  style,
  disableAudio = true, // Phase 19 ships with audio gated off by default
}: SceneTransitionControllerProps) {
  const { currentPreset, previousPreset, isTransitioning, setSceneState } =
    useScenePreset(initialState);

  // Sync external `state` prop into the internal hook.
  useEffect(() => {
    if (state && state !== currentPreset.state) {
      setSceneState(state);
    }
    // Intentionally not depending on currentPreset to avoid feedback loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, setSceneState]);

  const transitionStyle: CSSProperties = useMemo(
    () => ({ transition: `opacity ${MIN_TRANSITION_MS}ms ease` }),
    [],
  );

  return (
    <div
      className={className}
      data-testid="scene-transition-controller"
      data-scene-state={currentPreset.state}
      data-scene-name={currentPreset.internalName}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <SceneLayer
        preset={currentPreset}
        opacity={1}
        transitionStyle={transitionStyle}
        zBase={0}
        keyId={`current-${currentPreset.state}`}
      />
      {previousPreset ? (
        <SceneLayer
          preset={previousPreset}
          opacity={isTransitioning ? 0 : 1}
          transitionStyle={transitionStyle}
          zBase={5}
          keyId={`prev-${previousPreset.state}`}
          ariaHidden
        />
      ) : null}
      {!disableAudio && currentPreset.audio?.src ? (
        <ScenePresetAudio audio={currentPreset.audio} />
      ) : null}
      <div
        data-testid="scene-content"
        style={{ position: "relative", zIndex: 10, width: "100%", height: "100%" }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Internal layer + audio ────────────────────────────────────────────────

function SceneLayer({
  preset,
  opacity,
  transitionStyle,
  zBase,
  keyId,
  ariaHidden,
}: {
  preset: ScenePreset;
  opacity: number;
  transitionStyle: CSSProperties;
  zBase: number;
  keyId: string;
  ariaHidden?: boolean;
}) {
  const lightingOpacity = Math.min(0.32, preset.lighting * 0.4);
  return (
    <>
      <div
        key={`${keyId}-bg`}
        aria-hidden={ariaHidden}
        data-testid="scene-layer-bg"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: zBase,
          opacity,
          background: preset.background.gradient,
          ...transitionStyle,
        }}
      />
      <div
        key={`${keyId}-particles`}
        aria-hidden
        data-testid="scene-layer-particles"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: zBase + 2,
          opacity,
          ...transitionStyle,
        }}
      >
        {Array.from({ length: preset.particles.count }).map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${(i + 1) * (100 / (preset.particles.count + 1))}%`,
              top: `${20 + ((i * 13) % 60)}%`,
              width: preset.particles.sizePx,
              height: preset.particles.sizePx,
              borderRadius: "50%",
              background: preset.particles.color,
              opacity: 0.85,
            }}
          />
        ))}
      </div>
      <div
        key={`${keyId}-fog`}
        aria-hidden
        data-testid="scene-layer-fog"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: zBase + 3,
          opacity: opacity * preset.fog.opacity,
          background: preset.fog.color,
          ...transitionStyle,
        }}
      />
      <div
        key={`${keyId}-lighting`}
        aria-hidden
        data-testid="scene-layer-lighting"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: zBase + 4,
          opacity: opacity * lightingOpacity,
          background: preset.background.wash,
          mixBlendMode: "soft-light",
          ...transitionStyle,
        }}
      />
    </>
  );
}

function ScenePresetAudio({ audio }: { audio: NonNullable<ScenePreset["audio"]> }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !audio.src) return;
    el.volume = audio.volume;
    el.loop = audio.loop;
    const p = el.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {/* autoplay restrictions — silent */});
    }
    return () => {
      el.pause();
    };
  }, [audio]);
  return (
    <audio
      ref={ref}
      src={audio.src ?? undefined}
      data-testid="scene-audio"
      aria-hidden
    />
  );
}
