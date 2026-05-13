/*
 * FloatIdleAnimated — MMHB_FLOAT_IDLE_UNIT_v1 Phase 4-6 motion engine.
 *
 * Wraps FloatIdleRig (Phase 3 scaffolding) and adds the six idle motion
 * systems documented in the Phase 6 verification report (2026-05-13):
 *
 *   Phase 4 — Breathing      : torso scale 1.0 → 1.02   over 7.1s
 *   Phase 4 — Floating       : body  translateY 0 → -10px  9.3s
 *   Phase 4 — Shadow         : opacity 0.55→0.28, blur 3→7px,
 *                              scale 1.0→1.15           synced 9.3s
 *   Phase 5 — Blink          : eyes  scaleY 1.0 → 0.92  random 3-8s
 *   Phase 5 — Eye settling   : eyes  translate ±0.5-1.5px 8.7s
 *   Phase 6 — Mouth softness : mouth scale 1.0 → 1.004/1.006
 *                              synced with breathing      7.1s
 *
 * Identity safety:
 *   - All motions are CSS transform-only on individual transform
 *     properties (scale/translate) so they compose without overriding
 *     each other or the rig's body geometry.
 *   - Sub-pixel or near-sub-pixel everywhere. The mouth must NEVER
 *     look like it's speaking — max 0.6% vertical change. This is
 *     "micro-softness linked to breathing" per the Phase 6 contract.
 *   - prefers-reduced-motion: reduce → all keyframes paused via CSS;
 *     JS blink also short-circuits.
 *   - crisis prop → FloatIdleRig pins everything; this wrapper also
 *     skips JS blink scheduling and freezes shadow at rest values.
 *
 * Phase 8 — Emotional state orchestration:
 *   The avatar has 8 verified emotional states (6 shipped + 2 pending
 *   spec) that shift cycle durations + float amplitude + glow color
 *   without changing the avatar's appearance. Each state is the same
 *   floating, breathing being — only its emotional weather changes.
 *   States drive CSS custom properties consumed by the keyframes:
 *
 *     calmIdle    — sage 0.15      / breath 7.1s  / float 9.3s  amp 1.0
 *     grounding   — calm-blue 0.12 / breath 9.94s / float 12.09s amp 0.6
 *     reflective  — purple 0.10    / breath 8.52s / float 13.02s amp 0.7
 *     sleepy      — mint 0.08      / breath 11.36s/ float 16.74s amp 0.4
 *     comforting  — blush 0.18     / breath 7.81s / float 11.16s amp 0.8
 *     peacefulJoy — sunshine 0.14  / breath 6.39s / float 7.91s  amp 1.2
 *
 * Usage:
 *   <FloatIdleAnimated size={420} />
 *   <FloatIdleAnimated size={512} state="comforting" />
 *   <FloatIdleAnimated size={512} crisis={someCrisisFlag} />
 *
 * Props:
 *   size       number   px (default 420)
 *   state      string   emotional state (default "calmIdle"). Crisis
 *                       pins to "calmIdle" baseline regardless.
 *   crisis     boolean  BHCE override (default false)
 *   ariaLabel  string   default "Lumi, peacefully floating"
 *   className  string   appended to wrapper
 *   style      object   merged onto wrapper
 */

const VALID_STATES = new Set([
  "calmIdle",
  "grounding",
  "reflective",
  "sleepy",
  "comforting",
  "peacefulJoy",
]);

import { useEffect, useRef, useState } from "react";
import FloatIdleRig from "./FloatIdleRig.jsx";
import "./FloatIdleAnimated.css";

// v5.8.46 — WebP-first shadow with PNG fallback. cwebp q82 m6: 90KB → 5.5KB (94% smaller).
const SHADOW_BASE = "/avatar-core/shadow/MMHB_FLOAT_IDLE_UNIT_v1_shadow";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduced(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  return reduced;
}

export default function FloatIdleAnimated({
  size = 420,
  state = "calmIdle",
  crisis = false,
  // v5.8.47 — Phase 9 interaction systems. When true, the avatar gently
  // notices pointer presence: hover awareness, proximity response (within
  // 200px sustained 4s), click acknowledgment (600ms glow pulse), and
  // automatic idle return when the pointer leaves. Default false so
  // the homepage hero (v5.8.46) and other production surfaces stay
  // exactly as they are during the 24h hero-stability watch. Crisis
  // overrides → all listeners disabled, baseline pinned.
  interactive = false,
  ariaLabel = "Lumi, peacefully floating",
  className = "",
  style = {},
  // v5.8.46 — Allow callers to override the wrapper testid so production
  // surfaces can preserve their existing analytics anchors (e.g. the
  // homepage hero's `lumi-hero-companion` testid). Defaults to the
  // canonical `float-idle-animated` for QA surfaces like /motion-lab.
  "data-testid": dataTestId = "float-idle-animated",
}) {
  const rigRef = useRef(null);
  const wrapperRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationsOn = !crisis && !reducedMotion;
  const interactionsOn = interactive && !crisis;
  // Crisis pins to calmIdle baseline (asymmetric-risk safety: never
  // surface elevated/comforting states during a crisis routing path).
  const effectiveState = crisis
    ? "calmIdle"
    : VALID_STATES.has(state)
      ? state
      : "calmIdle";

  // ──────────────────────────────────────────────────────────────────
  // Phase 9 — Interaction systems (hover / proximity / click / idle return)
  //
  // Five gently-aware behaviors, all opt-in via `interactive` prop. The
  // CSS does ALL the visual work via three data attributes on the
  // wrapper (`data-hover`, `data-proximity`, `data-clicked`); JS only
  // toggles those attributes. This keeps the motion contract: no JS-
  // driven transforms, no per-frame DOM writes, no rAF loops touching
  // styles directly. Reduced-motion is intentionally NOT short-circuited
  // here — listeners still attach so the static glow can react; the CSS
  // @media (prefers-reduced-motion) block filters out cycle/amplitude
  // changes and only allows glow opacity to respond.
  //
  // Ethics contract (per Phase 9 verification report):
  //   - No tracking, no analytics, no logging of pointer position
  //   - No interval-based heartbeat (no idle "look at me" attention bait)
  //   - All effects sub-pixel or sub-percent
  //   - Click pulse decays in 600ms (no sustained attention pull)
  //   - Idle return is gentle (CSS transition handles it, no JS state)
  // ──────────────────────────────────────────────────────────────────
  const [hovered, setHovered] = useState(false);
  const [proximate, setProximate] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!interactionsOn) {
      setHovered(false);
      setProximate(false);
      setClicked(false);
      return undefined;
    }
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    // Hover: pointerenter/leave on wrapper bounding box
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    wrapper.addEventListener("pointerenter", onEnter);
    wrapper.addEventListener("pointerleave", onLeave);

    // Click acknowledgment: 600ms data-clicked window (CSS handles the
    // gentle glow pulse inside that window; under reduced-motion the
    // pulse becomes a static opacity bump per spec).
    let clickClearTimer = null;
    const onPointerDown = () => {
      setClicked(true);
      if (clickClearTimer) clearTimeout(clickClearTimer);
      clickClearTimer = setTimeout(() => setClicked(false), 600);
    };
    wrapper.addEventListener("pointerdown", onPointerDown);

    // Proximity: pointer within 200px of wrapper center for ≥4 seconds.
    // Implementation: rAF-throttled distance check on document
    // pointermove. Build timer (4000ms) starts when first within range,
    // clears immediately on out-of-range. No setInterval heartbeat —
    // we only react to actual cursor activity (no attention-seeking).
    let rafId = null;
    let buildTimer = null;
    let lastInRange = false;
    const PROX_RADIUS = 200;
    const BUILD_MS = 4000;

    const checkDistance = (x, y) => {
      const node = wrapperRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const inRange = (dx * dx + dy * dy) <= (PROX_RADIUS * PROX_RADIUS);
      if (inRange === lastInRange) return;
      lastInRange = inRange;
      if (inRange) {
        if (buildTimer) clearTimeout(buildTimer);
        buildTimer = setTimeout(() => setProximate(true), BUILD_MS);
      } else {
        if (buildTimer) {
          clearTimeout(buildTimer);
          buildTimer = null;
        }
        setProximate(false);
      }
    };

    const onPointerMove = (e) => {
      if (rafId) return; // already scheduled
      const x = e.clientX;
      const y = e.clientY;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        checkDistance(x, y);
      });
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      wrapper.removeEventListener("pointerenter", onEnter);
      wrapper.removeEventListener("pointerleave", onLeave);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
      if (clickClearTimer) clearTimeout(clickClearTimer);
      if (buildTimer) clearTimeout(buildTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [interactionsOn]);

  // Random blink scheduler per Phase 5 spec: 3-8s random interval,
  // 200ms duration, scaleY compression. JS-driven because the timing
  // is random — pure CSS can't randomize between iterations.
  useEffect(() => {
    if (!animationsOn) return undefined;
    let nextTimer = null;
    let endTimer = null;
    const getEyesEl = () => {
      const root = rigRef.current?.getContainer?.();
      return root ? root.querySelector('[data-rig-zone="eyes"]') : null;
    };
    const schedule = () => {
      const wait = 3000 + Math.random() * 5000; // 3-8s
      nextTimer = setTimeout(() => {
        const el = getEyesEl();
        if (el) {
          el.classList.add("float-idle-blinking");
          endTimer = setTimeout(() => {
            el.classList.remove("float-idle-blinking");
            schedule();
          }, 200);
        } else {
          schedule();
        }
      }, wait);
    };
    schedule();
    return () => {
      if (nextTimer) clearTimeout(nextTimer);
      if (endTimer) clearTimeout(endTimer);
      const el = getEyesEl();
      if (el) el.classList.remove("float-idle-blinking");
    };
  }, [animationsOn]);

  return (
    <div
      ref={wrapperRef}
      className={`float-idle-animated${animationsOn ? " is-animating" : ""}${
        interactionsOn ? " is-interactive" : ""
      }${className ? " " + className : ""}`}
      data-crisis={crisis ? "true" : "false"}
      data-state={effectiveState}
      data-interactive={interactionsOn ? "true" : "false"}
      data-hover={interactionsOn && hovered ? "true" : "false"}
      data-proximity={interactionsOn && proximate ? "true" : "false"}
      data-clicked={interactionsOn && clicked ? "true" : "false"}
      data-testid={dataTestId}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
        ...style,
      }}
    >
      <div
        className="float-idle-animated__glow"
        data-testid="float-idle-glow"
        aria-hidden="true"
      />
      <picture
        className="float-idle-animated__shadow"
        data-testid="float-idle-shadow"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <source srcSet={`${SHADOW_BASE}.webp`} type="image/webp" />
        <img
          src={`${SHADOW_BASE}.png`}
          alt=""
          draggable={false}
          decoding="async"
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      </picture>
      <FloatIdleRig
        ref={rigRef}
        size={size}
        animated={animationsOn}
        crisis={crisis}
        ariaLabel={ariaLabel}
        /* v5.8.46 — width/height:100% lets the rig stretch when the wrapper
         * is given a responsive size (e.g. hero w-44/sm:w-52/md:w-60/lg:w-64
         * with style {width:100%,height:100%}). Without these, the rig's
         * inline `width: size` (px) wins over `inset:0` and the rig overflows
         * smaller breakpoints. The `size` prop still drives JS unit math
         * (legLY/legRY/floatY 1024-space → px conversion); only the rendered
         * box is forced to fill. Pivots are %-based so they stay exact. */
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
