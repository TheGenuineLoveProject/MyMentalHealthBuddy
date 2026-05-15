/*
 * FloatIdleRig — MMHB_FLOAT_IDLE_UNIT_v1 Phase 3 rig scaffolding.
 *
 * Standalone — does NOT replace LumiV6 / LumiV7 / BuddyAvatar / LumiMascot.
 * Mounts the 11 region PNGs from `client/public/avatar-core/regions/`
 * (SSOT mirrored from repo `avatar-core/`, locked v5.8.41) at their
 * manifest coordinates with rig anchors and prop-driven transforms.
 *
 * NON-DRIFT contract (manifest §"NON-DRIFT CONTRACT"):
 *   The avatar body is FROZEN. Permitted modifications are ONLY:
 *     - Coordinate-based motion (eye blink, mouth shape, arm/leg rotation)
 *     - Scale transforms (breathing expansion)
 *     - Opacity changes (blush, sparkle visibility)
 *     - Color-mode tinting (downstream emotion engine)
 *   This rig exposes those degrees of freedom and NOTHING ELSE.
 *
 * Coordinate system:
 *   Reference space is 1024×1024 (manifest source resolution).
 *   Each region PNG is full 1024×1024 with the region painted at its
 *   correct absolute position and transparent everywhere else, so
 *   stacking with `position: absolute; inset: 0` reconstructs the
 *   master pixel-for-pixel (verified v5.8.41, alpha-coverage 1.0023).
 *   Transform-origin is set per region as percentages of the container
 *   (which is square), matching the rig-zone centers from the manifest.
 *
 * Rig zones (from manifest, scaled to %):
 *   float-center  (512, 500)         → 50.0%, 48.8%
 *   arm-l pivot   (255, 515)         → 24.9%, 50.3%
 *   arm-r pivot   (765, 515)         → 74.7%, 50.3%
 *   leg-l pivot   (460, 780)         → 44.9%, 76.2%
 *   leg-r pivot   (640, 730)         → 62.5%, 71.3%
 *   eyes center   (455, 357.5)       → 44.4%, 34.9%
 *   mouth center  (465, 415)         → 45.4%, 40.5%
 *   torso center  (510, 580)         → 49.8%, 56.6%
 *   top-leaf c.   (530, 190)         → 51.8%, 18.6%
 *
 * Props (all default to identity transforms — no motion in this PR):
 *   size           number  px (default 512)
 *   breathingScale number  1.0 .. 1.03 (default 1.0)
 *   blinkScaleY    number  0.1 .. 1.0 (default 1.0). Applied to combined
 *                          eyes region. Independent L/R blink would
 *                          require a future sub-region split.
 *   mouthShape     string  one of MOUTH_SHAPES (default 'neutral').
 *                          Set as data attribute only — actual shape
 *                          swap is downstream Phase 4-6 motion work.
 *   armLRotate     number  -30 .. 30 deg (default 0)
 *   armRRotate     number  -30 .. 30 deg (default 0)
 *   legLY          number  -12 .. 12 px in 1024-space (default 0)
 *   legRY          number  -12 .. 12 px in 1024-space (default 0)
 *   floatY         number  px in 1024-space (default 0) — body-wide bob
 *   sparkleOpacity number  0 .. 1 (default 1)
 *   crisis         boolean — BHCE override: pins ALL transforms to
 *                          identity, asymmetric-risk safety contract
 *   animated       boolean — sets `data-animated="true"` on container
 *                          so FloatIdleAnimated.css @keyframes engage
 *                          for Phase 4-6 motion systems. Defaults to
 *                          false. When true, the wrapper component
 *                          (FloatIdleAnimated) drives the visuals via
 *                          CSS animations on individual transform
 *                          properties (scale/translate) which compose
 *                          with any inline `transform` set by props.
 *   ariaLabel      string  default "Lumi, peacefully floating"
 *
 * Imperative anchors (for downstream prototypes via ref):
 *   ref.current.getAnchor('float-center' | 'arm-l' | 'arm-r' | ... )
 *     → { xPct, yPct, xPx, yPx } in current container size
 *   Useful for positioning external particle systems, halos, etc.
 *
 * Reduced-motion: `prefers-reduced-motion: reduce` blanket pins all
 * transforms to identity via CSS, regardless of props.
 */

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import "./FloatIdleRig.css";

const REGION_BASE = "/avatar-core/regions";
const FILE_PREFIX = "MMHB_FLOAT_IDLE_UNIT_v1_region_";

// Stacking order (back → front). Body-residual is the catch-all for
// pixels not assigned to a named region (collar, center band, micro
// gaps) so recompose remains lossless.
const STACK = [
  "body-residual",
  "torso",
  "leg-l",
  "leg-r",
  "arm-l",
  "arm-r",
  "face",
  "eyes",
  "mouth",
  "top-leaf",
  "sparkles",
];

// Pivot points (transform-origin) per region, as percentages of the
// 1024×1024 container. Computed from manifest rig-zone bbox centers.
const PIVOTS = {
  "body-residual": { x: 50.0, y: 50.0 },
  torso:           { x: 49.8, y: 56.6 },
  "leg-l":         { x: 44.9, y: 76.2 },
  "leg-r":         { x: 62.5, y: 71.3 },
  "arm-l":         { x: 24.9, y: 50.3 },
  "arm-r":         { x: 74.7, y: 50.3 },
  face:            { x: 49.8, y: 36.1 },
  eyes:            { x: 44.4, y: 34.9 },
  mouth:           { x: 45.4, y: 40.5 },
  "top-leaf":      { x: 51.8, y: 18.6 },
  sparkles:        { x: 50.0, y: 50.0 },
};

// Named anchors exposed via imperative ref (manifest §"Rig Zones")
const ANCHORS = {
  "float-center": { x: 50.0, y: 48.8 },
  "body-centerline-top":    { x: 50.0, y: 0.0 },
  "body-centerline-bottom": { x: 50.0, y: 100.0 },
  "arm-l":   PIVOTS["arm-l"],
  "arm-r":   PIVOTS["arm-r"],
  "leg-l":   PIVOTS["leg-l"],
  "leg-r":   PIVOTS["leg-r"],
  "blink-l": { x: 38.3, y: 34.9 },
  "blink-r": { x: 50.5, y: 34.9 },
  mouth:     PIVOTS.mouth,
  "top-leaf": PIVOTS["top-leaf"],
};

export const MOUTH_SHAPES = [
  "neutral", "happy", "calm", "surprise", "sleepy",
  "open", "worried", "excited", "loving", "focused", "breathing",
];

const FROZEN_FALLBACK = { breathingScale: 1, blinkScaleY: 1, armLRotate: 0, armRRotate: 0, legLY: 0, legRY: 0, floatY: 0, sparkleOpacity: 1 };

const FloatIdleRig = forwardRef(function FloatIdleRig(
  {
    size = 512,
    breathingScale = 1.0,
    blinkScaleY = 1.0,
    mouthShape = "neutral",
    armLRotate = 0,
    armRRotate = 0,
    legLY = 0,
    legRY = 0,
    floatY = 0,
    sparkleOpacity = 1,
    crisis = false,
    animated = false,
    ariaLabel = "Lumi, peacefully floating",
    className = "",
    style = {},
    ...rest
  },
  ref
) {
  const containerRef = useRef(null);

  // Crisis short-circuit: pin everything to identity. Mirrors the
  // BHCE asymmetric-risk pattern from LumiV7.
  const v = crisis
    ? FROZEN_FALLBACK
    : {
        breathingScale,
        blinkScaleY,
        armLRotate,
        armRRotate,
        legLY,
        legRY,
        floatY,
        sparkleOpacity,
      };

  // 1024-space px → container-space px scale factor. legLY/legRY/floatY
  // are expressed in manifest 1024 units so the same prop value works
  // at any size; we convert to current container px here.
  const unit = size / 1024;

  const transformFor = useMemo(() => {
    return {
      "body-residual": "none",
      torso: `scale(${v.breathingScale})`,
      "leg-l": `translateY(${v.legLY * unit}px)`,
      "leg-r": `translateY(${v.legRY * unit}px)`,
      "arm-l": `rotate(${v.armLRotate}deg)`,
      "arm-r": `rotate(${v.armRRotate}deg)`,
      face: "none",
      eyes: `scaleY(${v.blinkScaleY})`,
      mouth: "none", // shape swap is downstream — this region is the canonical small smile
      "top-leaf": "none",
      sparkles: "none",
    };
  }, [v.breathingScale, v.legLY, v.legRY, v.armLRotate, v.armRRotate, v.blinkScaleY, unit]);

  useImperativeHandle(ref, () => ({
    getAnchor(name) {
      const a = ANCHORS[name];
      if (!a) return null;
      // Prefer measured DOM box when available so external CSS resizing
      // (zoom, container queries, transform: scale on parent) stays in
      // sync with anchor px readouts. Falls back to the `size` prop
      // when the container hasn't mounted yet (SSR / first render).
      const node = containerRef.current;
      let basis = size;
      if (node && typeof node.getBoundingClientRect === "function") {
        const r = node.getBoundingClientRect();
        if (r.width > 0) basis = r.width;
      }
      const px = (basis * a.x) / 100;
      const py = (basis * a.y) / 100;
      return { xPct: a.x, yPct: a.y, xPx: px, yPx: py, basis };
    },
    listAnchors() {
      return Object.keys(ANCHORS);
    },
    getContainer() {
      return containerRef.current;
    },
  }), [size]);

  const containerStyle = {
    width: size,
    height: size,
    transform: crisis ? "none" : (v.floatY ? `translateY(${v.floatY * unit}px)` : "none"),
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={`float-idle-rig${className ? " " + className : ""}`}
      style={containerStyle}
      data-rig-version="MMHB_FLOAT_IDLE_UNIT_v1"
      data-rig-phase="3"
      data-crisis={crisis ? "true" : "false"}
      data-animated={animated && !crisis ? "true" : "false"}
      data-mouth={mouthShape}
      role="img"
      aria-label={ariaLabel}
      data-testid="float-idle-rig"
      {...rest}
    >
      {STACK.map((zone) => {
        const pivot = PIVOTS[zone];
        const tx = transformFor[zone];
        const isSparkles = zone === "sparkles";
        const layerStyle = {
          transformOrigin: `${pivot.x}% ${pivot.y}%`,
          transform: tx,
          opacity: isSparkles ? v.sparkleOpacity : 1,
        };
        // v5.8.46 — WebP-first <picture> with PNG fallback. WebP siblings
        // generated via cwebp q82 m6: 14MB total PNGs → 117KB total WebP
        // (~99% smaller). Picture wrapper inherits absolute positioning
        // from float-idle-rig__layer scoping in CSS so layout is unchanged.
        const base = `${REGION_BASE}/${FILE_PREFIX}${zone}`;
        return (
          <picture
            key={zone}
            className="float-idle-rig__layer"
            data-rig-zone={zone}
            data-testid={`rig-region-${zone}`}
            style={layerStyle}
          >
            <source srcSet={`${base}.webp`} type="image/webp" />
            <img
              src={`${base}.png`}
              alt=""
              draggable={false}
              decoding="async"
            />
          </picture>
        );
      })}
    </div>
  );
});

export default FloatIdleRig;
