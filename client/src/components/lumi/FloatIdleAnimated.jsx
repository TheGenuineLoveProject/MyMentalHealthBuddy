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
 * Usage:
 *   <FloatIdleAnimated size={420} />
 *   <FloatIdleAnimated size={512} crisis={someCrisisFlag} />
 *
 * Props:
 *   size       number   px (default 420)
 *   crisis     boolean  BHCE override (default false)
 *   ariaLabel  string   default "Lumi, peacefully floating"
 *   className  string   appended to wrapper
 *   style      object   merged onto wrapper
 */

import { useEffect, useRef, useState } from "react";
import FloatIdleRig from "./FloatIdleRig.jsx";
import "./FloatIdleAnimated.css";

const SHADOW_SRC = "/avatar-core/shadow/MMHB_FLOAT_IDLE_UNIT_v1_shadow.png";

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
  crisis = false,
  ariaLabel = "Lumi, peacefully floating",
  className = "",
  style = {},
}) {
  const rigRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationsOn = !crisis && !reducedMotion;

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
      className={`float-idle-animated${animationsOn ? " is-animating" : ""}${
        className ? " " + className : ""
      }`}
      data-crisis={crisis ? "true" : "false"}
      data-testid="float-idle-animated"
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
        ...style,
      }}
    >
      <img
        src={SHADOW_SRC}
        alt=""
        draggable={false}
        className="float-idle-animated__shadow"
        data-testid="float-idle-shadow"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <FloatIdleRig
        ref={rigRef}
        size={size}
        animated={animationsOn}
        crisis={crisis}
        ariaLabel={ariaLabel}
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  );
}
