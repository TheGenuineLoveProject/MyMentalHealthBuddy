/**
 * Phase 11 — Production Framer Motion avatar component.
 *
 * Reads ALL interaction state from the per-surface Zustand store
 * (no React-local copies). Internal motion values (y/scale) live
 * outside React via Framer Motion's compositor.
 *
 * NON-DRIFT contract: only translateY + scale + glow opacity are
 * dynamic. Body geometry: Number(y.get()), palette, silhouette FROZEN. All values
 * capped by governance/nonDriftRules.ts.
 *
 * Crisis safety (3 layers): store reducer rejects interaction writes;
 * useEffect on crisis flip clears any in-flight pulse timers; animation
 * frame returns identity values. Reduced-motion honored at all 3 layers.
 */

import {
  motion,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import { useEffect, useRef, type CSSProperties } from "react";
import {
  EMOTION_MULTIPLIERS,
  INTERACTION_LIMITS,
  SUB_PIXEL_FLOAT_CEILING_PX,
  type EmotionalState,
} from "../types/avatarLifeTypes";
import {
  useAvatarLifeStore,
  useAvatarStoreApi,
} from "../state/useAvatarLifeStore";
import { emitAvatarTelemetry } from "../observability/avatarRuntimeTelemetry";

interface MMHBFloatAvatarProps {
  /** Path to the clean-master sprite (PNG or WebP). */
  imageSrc: string;
  /** Overrides store state when provided (useful for prop-driven surfaces). */
  state?: EmotionalState;
  /** Render size in CSS pixels (square). */
  size?: number;
  /** Enable Phase 9 hover/proximity/click interactions. */
  interactive?: boolean;
  /** Optional crisis override (else reads from store). */
  crisis?: boolean;
  className?: string;
  alt?: string;
  "data-testid"?: string;
}

export function MMHBFloatAvatar({
  imageSrc,
  state: stateProp,
  size = 320,
  interactive = false,
  crisis: crisisProp,
  className,
  alt = "Lumi, your gentle companion",
  "data-testid": testId = "mmhb-float-avatar",
}: MMHBFloatAvatarProps) {
  const api = useAvatarStoreApi();
  const storeState = useAvatarLifeStore((s) => s.currentState);
  const storeCrisis = useAvatarLifeStore((s) => s.crisis);
  const reducedMotion = useAvatarLifeStore((s) => s.reducedMotion);
  const hover = useAvatarLifeStore((s) => s.hover);
  const proximity = useAvatarLifeStore((s) => s.proximity);
  const clicked = useAvatarLifeStore((s) => s.clicked);

  const effectiveState: EmotionalState = (stateProp ?? storeState) as EmotionalState;
  const crisis = crisisProp ?? storeCrisis;
  const interactionsOn = interactive && !crisis && !reducedMotion;
  const m = EMOTION_MULTIPLIERS[effectiveState] ?? EMOTION_MULTIPLIERS.calmIdle;

  // Motion values — sub-pixel only: Number(y.get()), capped by SUB_PIXEL_FLOAT_CEILING_PX.
  // Start at 0 so first frame doesn't snap (architect P11.1 fix).
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const proximityTimerRef = useRef<number | null>(null);
  const clickTimerRef = useRef<number | null>(null);
  const proximityRangeRef = useRef({ inRange: false, buildStartTs: 0 });
  const startTsRef = useRef<number | null>(null);

  // Animation frame: drive floating + breathing as continuous waves.
  // Phase: (1 - cos)/2 maps [0..1] across the period, so t=0 → 0 displacement.
  useAnimationFrame((t) => {
    if (crisis || reducedMotion) {
      y.set(0);
      scale.set(1);
      startTsRef.current = null;
      return;
    }
    if (startTsRef.current == null) startTsRef.current = t;
    const sec = (t - startTsRef.current) / 1000;

    const floatMult = proximity ? INTERACTION_LIMITS.proximity.floatMult : 1;
    const ampMult =
      (hover ? INTERACTION_LIMITS.hover.amplitudeMult : 1) *
      (proximity ? INTERACTION_LIMITS.proximity.amplitudeMult : 1);
    const breathMult =
      (hover ? INTERACTION_LIMITS.hover.breathMult : 1) *
      (proximity ? INTERACTION_LIMITS.proximity.breathMult : 1);

    const floatPeriod = m.floatCycle * floatMult;
    const breathPeriod = m.breathCycle * breathMult;

    const displacement = Math.min(
      SUB_PIXEL_FLOAT_CEILING_PX,
      10 * m.floatAmplitude * ampMult,
    );
    // (1 - cos(2π · sec/period)) / 2 ∈ [0, 1] — starts at 0, peaks at 1.
    const phase = (1 - Math.cos((sec / floatPeriod) * Math.PI * 2)) / 2;
    y.set(-displacement * phase);

    const breathPhase = (1 - Math.cos((sec / breathPeriod) * Math.PI * 2)) / 2;
    scale.set(1 + 0.02 * breathPhase);
  });

  const glowBoost =
    (hover ? INTERACTION_LIMITS.hover.glowBoost : 0) +
    (proximity ? INTERACTION_LIMITS.proximity.glowBoost : 0) +
    (clicked ? INTERACTION_LIMITS.click.glowBoost : 0);
  const glowOpacity = Math.min(0.18 + 0.07, m.glowOpacity + glowBoost);
  const glowStyle: CSSProperties = {
    background: `radial-gradient(circle at 50% 55%, ${m.glowColor} 0%, transparent 65%)`,
    opacity: crisis ? m.glowOpacity : glowOpacity,
    transition: interactionsOn
      ? "opacity 3s cubic-bezier(0.4, 0, 0.2, 1), background 1.2s ease-in-out"
      : "opacity 1.2s ease-in-out, background 1.2s ease-in-out",
  };

  // Crisis flip → clear pulse timers (store already cleared interaction flags).
  useEffect(() => {
    if (crisis) {
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      if (proximityTimerRef.current) {
        window.clearTimeout(proximityTimerRef.current);
        proximityTimerRef.current = null;
      }
      proximityRangeRef.current = { inRange: false, buildStartTs: 0 };
    }
  }, [crisis]);

  // Phase 9 listeners — only when interactionsOn.
  useEffect(() => {
    if (!interactionsOn) return;
    const el = wrapperRef.current;
    if (!el) return;

    const { setHover, setProximity, setClicked, surface } = api.getState();

    const onEnter = () => api.getState().setHover(true);
    const onLeave = () => api.getState().setHover(false);
    const onDown = () => {
      api.getState().setClicked(true);
      emitAvatarTelemetry({
        type: "avatar:click",
        surface,
        ts: Date.now(),
      });
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = window.setTimeout(() => {
        api.getState().setClicked(false);
        clickTimerRef.current = null;
      }, INTERACTION_LIMITS.click.durationMs);
    };

    let raf = 0;
    let lastSampleTs = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSampleTs < 50) return;
      lastSampleTs = now;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const within = dx * dx + dy * dy <= INTERACTION_LIMITS.proximity.radiusPx ** 2;
        const range = proximityRangeRef.current;
        if (within) {
          if (!range.inRange) {
            range.inRange = true;
            range.buildStartTs = now;
          } else if (
            now - range.buildStartTs >= INTERACTION_LIMITS.proximity.buildMs &&
            !api.getState().proximity
          ) {
            api.getState().setProximity(true);
          }
        } else if (range.inRange) {
          range.inRange = false;
          range.buildStartTs = 0;
          api.getState().setProximity(false);
        }
      });
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    void setHover; void setProximity; void setClicked;

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
      if (proximityTimerRef.current) window.clearTimeout(proximityTimerRef.current);
      api.getState().setHover(false);
      api.getState().setProximity(false);
      api.getState().setClicked(false);
    };
  }, [interactionsOn, api]);
  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-block",
        overflow: "visible",
      }}
      data-testid={testId}
      data-state={effectiveState}
      data-crisis={crisis ? "true" : "false"}
      data-interactive={interactionsOn ? "true" : "false"}
      data-hover={hover ? "true" : "false"}
      data-proximity={proximity ? "true" : "false"}
      data-clicked={clicked ? "true" : "false"}
    >
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "none",
          willChange: crisis || reducedMotion ? "auto" : "transform",
        }}
        data-testid={`${testId}-glow`}
      />
      <motion.img
        src={imageSrc}
        alt={alt}
        width={size}
        height={size}
        draggable={false}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "none",
          willChange: crisis || reducedMotion ? "auto" : "transform",
          y,
          scale,
        }}
        data-testid={`${testId}-img`}
      />
    </div>
  );
}
