/**
 * BuddyAvatar.tsx — MMHB Buddy Engine visual.
 * PURE VISUAL COMPONENT. No fetch, no AI, no business logic.
 *
 * Renders a soft cream-tinted robot body with a dark face screen, glowing
 * state-tinted eyes, an antenna with a halo'd glow tip, a multi-ring
 * pulsing heart, plate seams, and a chest status LED.
 * State drives eye color, heart color/pulse, and body micro-motion.
 *
 * Styling lives in BuddyAvatar.css (sibling file) — keyframes are state-class
 * scoped (.buddy--<state>) so adding new states later is additive only.
 *
 * v1.13 visible-presence redesign: stronger silhouette via tinted body
 * gradient + 2px rim strokes, drop-shadow filter for dimensional float,
 * aura opacity boosted 0.20→0.55 (was invisible on white surfaces),
 * heart enlarged with multi-ring halo (3 rings), chest status LED tied
 * to heart-color, plate seam lines for character, antenna outer halo
 * ring, eye crescent shadows, brighter face-screen sheen.
 *
 * Hard contracts (locked, do not change):
 *   - viewBox 200×240
 *   - 3 canonical CSS vars only (--buddy-eye-color/heart-color/heart-pulse)
 *   - 8 data-* fields surfaced on root
 *   - .buddy--crisis CSS rule untouched (crisis must stay steady & green)
 */

import "./BuddyAvatar.css";
import {
  type BuddyState,
  getBuddyVisualOutput,
} from "@/lib/avatarState";

export interface BuddyAvatarProps {
  state?: BuddyState;
  size?: number;
  className?: string;
  "data-testid"?: string;
}

/**
 * MMHB Buddy Engine v1.7 — accessibility-first aria-label vocabulary.
 *
 * State-specific phrasing chosen so a screen-reader user gets a clear,
 * calm understanding of what Buddy is doing right now WITHOUT exposing
 * private chat content. Wording is consent-based and trauma-informed:
 * never alarmist, never clinical.
 */
const BUDDY_ARIA_LABEL: Record<BuddyState, string> = {
  calm: "Buddy avatar showing calm support mode",
  sad: "Buddy avatar showing gentle support mode",
  anxious: "Buddy avatar showing anxious breathing support mode",
  overwhelmed: "Buddy avatar showing grounding support mode",
  encouraged: "Buddy avatar showing encouraging support mode",
  crisis: "Buddy avatar showing crisis-safe support mode",
  celebrate: "Buddy avatar showing celebrating support mode",
};

export default function BuddyAvatar({
  state = "calm",
  size = 160,
  className = "",
  "data-testid": testId = "buddy-avatar",
}: BuddyAvatarProps) {
  const v = getBuddyVisualOutput(state);
  // v1.7 — fall back to v.label only if the state slips past the mapper
  // (e.g., a future state added in avatarState.ts before this map is
  // updated). Keeps screen readers from going silent.
  const ariaLabel = BUDDY_ARIA_LABEL[v.state] ?? `MMHB Buddy: ${v.label}`;

  const styleVars: React.CSSProperties & Record<`--${string}`, string> = {
    width: `${size}px`,
    height: `${size}px`,
    "--buddy-eye-color": v.eyeColor,
    "--buddy-heart-color": v.heartColor,
    "--buddy-heart-pulse": `${v.heartPulse}ms`,
  };

  return (
    <div
      className={`buddy buddy--${v.state} buddy--motion-${v.motion} buddy--expr-${v.expression} ${className}`}
      style={styleVars}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
      data-state={v.state}
      // v1.9 — full BuddyOutput contract surfaced as data-attributes so any
      // downstream observer (a11y tool, e2e test, hardware adapter polling
      // the DOM, telemetry probe) can read the canonical contract without
      // re-deriving it from CSS classes or color values.
      data-safety-mode={v.safetyMode}
      data-motion={v.motion}
      data-expression={v.expression}
      // v1.9 gap-fix — eyeColor / heartColor / heartPulse were exposed only
      // as CSS variables (--buddy-eye-color, etc.), which a hardware adapter
      // or e2e probe cannot read without computed-style introspection. Mirror
      // them as data-attributes so the canonical 8-field BuddyOutput contract
      // is fully readable from the DOM. CSS variables remain authoritative
      // for paint; data-attributes are the read-only mirror for observers.
      data-eye-color={v.eyeColor}
      data-heart-color={v.heartColor}
      data-heart-pulse={v.heartPulse}
    >
      <svg
        viewBox="0 0 200 240"
        xmlns="http://www.w3.org/2000/svg"
        className="buddy__svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* v1.13 visible-presence redesign — gradients are now warm cream
            (visible on light & dark backgrounds), aura is strong enough to
            actually read on a white page, heart is bigger with a 3-ring
            halo, chest LED + plate seams add character.
            All gradient stops with stop-color="var(--buddy-...)" inherit
            the same canonical CSS vars (no new vars introduced). */}
        <defs>
          {/* Head shell — soft cream highlight up top, cooler shadow on
              the bottom edge so the dome reads as a 3D shape, not a flat
              rectangle. Tinted enough to be visible on white surfaces. */}
          <radialGradient id="buddyHeadShine" cx="48%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#fafcfb" />
            <stop offset="80%" stopColor="#dfe6e2" />
            <stop offset="100%" stopColor="#bcc6c0" />
          </radialGradient>
          {/* Body shell — same family but slightly cooler so the body
              reads as a separate "torso" volume from the head dome. */}
          <radialGradient id="buddyBodyShine" cx="50%" cy="32%" r="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f4f8f6" />
            <stop offset="85%" stopColor="#d4ddd8" />
            <stop offset="100%" stopColor="#aab4ae" />
          </radialGradient>
          {/* Face screen — deep, glassy gradient with a subtle teal tint
              at the edges so the screen feels lit, not painted on. */}
          <radialGradient id="buddyFaceShine" cx="50%" cy="32%" r="90%">
            <stop offset="0%" stopColor="#1f2826" />
            <stop offset="55%" stopColor="#0c1413" />
            <stop offset="100%" stopColor="#020605" />
          </radialGradient>
          <radialGradient id="buddyChestPlate" cx="50%" cy="38%" r="85%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#eef2ef" />
            <stop offset="100%" stopColor="#c8d0cb" />
          </radialGradient>
          {/* Heart halo — visibly opaque enough to actually glow. */}
          <radialGradient id="buddyHeartHalo">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.85" />
            <stop offset="35%" stopColor="var(--buddy-heart-color)" stopOpacity="0.45" />
            <stop offset="70%" stopColor="var(--buddy-heart-color)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* Antenna glow — visibly bright tip halo. */}
          <radialGradient id="buddyAntennaGlow">
            <stop offset="0%" stopColor="var(--buddy-eye-color)" stopOpacity="0.95" />
            <stop offset="55%" stopColor="var(--buddy-eye-color)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--buddy-eye-color)" stopOpacity="0" />
          </radialGradient>
          {/* v1.13 ambient aura — strong enough to be visible on a light
              page surface. Was 0.20/0.06 (invisible on near-white). Now
              0.55/0.18 — clearly reads as a soft state-tinted halo
              around Buddy without becoming a glaring "glow blob". */}
          <radialGradient id="buddyAura" cx="50%" cy="55%" r="62%">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.55" />
            <stop offset="55%" stopColor="var(--buddy-heart-color)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* v1.13 floor glow — visible pool of state-tinted light beneath
              Buddy. Boosted 0.32→0.65 at center so the figure reads as
              gently floating on a warm halo rather than sitting flat. */}
          <radialGradient id="buddyFloorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.65" />
            <stop offset="55%" stopColor="var(--buddy-heart-color)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* v1.13 chest LED — small, bright status pip that ties Buddy's
              chest to the heart color. Reads as "alive" indicator. */}
          <radialGradient id="buddyChestLed">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="var(--buddy-heart-color)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* v1.13 face screen scanline tint — subtle horizontal sheen
              across the screen that catches state-tinted light. */}
          <linearGradient id="buddyScreenSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient aura — sits behind everything; gives a soft "alive" glow
            that follows the heart color so it adapts per state. Decorative.
            v1.13: bigger ellipse so the halo extends past the figure edge. */}
        <ellipse cx="100" cy="128" rx="106" ry="124" fill="url(#buddyAura)" aria-hidden="true" />

        {/* Antenna with soft glow tip + base mount + outer halo ring */}
        <g className="buddy__antenna">
          {/* Base mount where antenna meets head */}
          <rect x="94" y="20" width="12" height="6" rx="2" fill="#bdc6c1" />
          <rect x="94" y="20" width="12" height="2" rx="1" fill="#9aa39e" opacity="0.6" />
          <line x1="100" y1="22" x2="100" y2="9" stroke="#9aa39e" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="22" x2="100" y2="9" stroke="#dde3e0" strokeWidth="1.4" strokeLinecap="round" />
          {/* v1.13 — outer fuzzy halo MUST remain the first <circle> in
              .buddy__antenna because BuddyAvatar.css targets
              `.buddy__antenna circle:nth-of-type(1)` for the breathing
              animation. Larger radius (was 11→14) for visibility. */}
          <circle cx="100" cy="7" r="14" fill="url(#buddyAntennaGlow)" />
          <circle cx="100" cy="7" r="6" fill="var(--buddy-eye-color)" opacity="0.45" />
          <circle cx="100" cy="7" r="4.5" fill="var(--buddy-eye-color)" />
          <circle cx="99" cy="5.5" r="1.8" fill="#ffffff" opacity="0.95" />
        </g>

        {/* BODY first (renders behind head + collar so they appear seated on top).
            Wider than head + softer rounding makes the silhouette read as
            "rounded body with a screen-head" instead of two stacked boxes.
            v1.11: body extended UP so it overlaps the head bottom and
            forms natural "shoulders" that rise to meet the head sides. */}
        <g className="buddy__body">
          {/* Arms — rounded, behind body so they emerge naturally.
              v1.13: deeper cool tint so arms read against light pages. */}
          <rect x="22" y="142" width="18" height="68" rx="9" fill="#cdd5d0" className="buddy__arm buddy__arm--left" stroke="#aab4ae" strokeWidth="0.8" />
          <rect x="160" y="142" width="18" height="68" rx="9" fill="#cdd5d0" className="buddy__arm buddy__arm--right" stroke="#aab4ae" strokeWidth="0.8" />
          {/* Hand caps */}
          <circle cx="31" cy="208" r="8.5" fill="#dde3e0" stroke="#aab4ae" strokeWidth="1" />
          <circle cx="169" cy="208" r="8.5" fill="#dde3e0" stroke="#aab4ae" strokeWidth="1" />
          {/* Hand cap highlights for dimension */}
          <ellipse cx="29" cy="206" rx="2.4" ry="1.6" fill="#ffffff" opacity="0.7" />
          <ellipse cx="167" cy="206" rx="2.4" ry="1.6" fill="#ffffff" opacity="0.7" />

          {/* Body shell — wider than head, softer corners, raised to fuse
              with head bottom under the collar. v1.13: 2px rim stroke
              (was 1.4) so the silhouette is clearly defined on white. */}
          <rect
            x="34"
            y="118"
            width="132"
            height="110"
            rx="36"
            ry="36"
            fill="url(#buddyBodyShine)"
            stroke="#9ba59f"
            strokeWidth="2"
          />

          {/* v1.13 plate seam lines — subtle horizontal seams on the body
              that give a sense of "robot panels" without clutter.
              v1.13.1: lower seam moved 218→222 + opacity .45→.30 to give
              clean clearance from the chest LED at y=210 (LED bottom = 214,
              seam now 8px below) so they don't visually merge at small sizes. */}
          <line x1="50" y1="148" x2="150" y2="148" stroke="#c8d0cb" strokeWidth="0.7" opacity="0.55" />
          <line x1="46" y1="222" x2="154" y2="222" stroke="#c8d0cb" strokeWidth="0.7" opacity="0.30" />

          {/* Chest plate — bigger, two-tone with soft ring */}
          <ellipse cx="100" cy="180" rx="40" ry="40" fill="url(#buddyChestPlate)" />
          <ellipse cx="100" cy="180" rx="40" ry="40" fill="none" stroke="#bdc6c1" strokeWidth="1.4" opacity="0.85" />
          {/* Inner bezel ring for depth */}
          <ellipse cx="100" cy="180" rx="34" ry="34" fill="none" stroke="#d6ddd8" strokeWidth="1" opacity="0.7" />

          {/* Heart — bigger, with multi-layer halo. v1.7: explicit
              aria-hidden so this decorative pulse never reaches AT.
              v1.13: enlarged + 3-ring halo + brighter core. */}
          <g className="buddy__heart" transform="translate(100 180)" aria-hidden="true">
            <g className="buddy__heart-glow">
              <circle r="42" fill="url(#buddyHeartHalo)" />
              <circle r="30" fill="var(--buddy-heart-color)" opacity="0.22" />
              <circle r="20" fill="var(--buddy-heart-color)" opacity="0.40" />
            </g>
            <path
              d="M 0 13 C -18 -7 -28 -2 -28 -14 C -28 -25 -18 -28 0 -14 C 18 -28 28 -25 28 -14 C 28 -2 18 -7 0 13 Z"
              fill="var(--buddy-heart-color)"
              className="buddy__heart-shape"
            />
            {/* Soft top-left highlight on heart for dimensionality */}
            <ellipse cx="-10" cy="-15" rx="6" ry="3.4" fill="#ffffff" opacity="0.55" transform="rotate(-30 -10 -15)" />
            <ellipse cx="9" cy="-13" rx="3" ry="1.8" fill="#ffffff" opacity="0.32" transform="rotate(25 9 -13)" />
            <circle r="4.2" cx="-1" cy="-7" fill="#fffbe6" className="buddy__heart-core" opacity="0.95" />
          </g>

          {/* v1.13 chest status LED — small bright pip below the heart
              that ties the chest plate to the heart color. Adds a "live
              status" feel and balances the chest composition.
              v1.13.1: moved 214→210 to give 8px clearance from the lower
              seam (now at y=222) so they don't merge at small sizes. */}
          <g aria-hidden="true">
            <circle cx="100" cy="210" r="4" fill="url(#buddyChestLed)" />
            <circle cx="100" cy="210" r="1.6" fill="#ffffff" opacity="0.95" />
          </g>
        </g>

        {/* Neck collar — wide chunky band that bridges head ↔ body so they
            visually fuse instead of reading as two stacked rectangles. */}
        <g>
          <rect x="74" y="116" width="52" height="16" rx="5" fill="#bdc6c1" />
          <rect x="74" y="116" width="52" height="16" rx="5" fill="none" stroke="#9aa39e" strokeWidth="0.8" />
          <rect x="76" y="118" width="48" height="3" rx="1.5" fill="#9aa39e" opacity="0.75" />
          <rect x="76" y="127" width="48" height="2.5" rx="1.2" fill="#9aa39e" opacity="0.55" />
        </g>

        {/* HEAD — sits on top of the collar/body, slightly narrower so the
            silhouette tapers naturally. */}
        <g className="buddy__head">
          {/* Side ears — softer, integrated. v1.13: deeper tint + rim. */}
          <rect x="36" y="58" width="12" height="28" rx="6" fill="#cdd5d0" stroke="#9aa39e" strokeWidth="0.8" />
          <rect x="152" y="58" width="12" height="28" rx="6" fill="#cdd5d0" stroke="#9aa39e" strokeWidth="0.8" />
          <rect x="38" y="62" width="3" height="20" rx="1.5" fill="#a5aea8" opacity="0.85" />
          <rect x="159" y="62" width="3" height="20" rx="1.5" fill="#a5aea8" opacity="0.85" />

          {/* Head shell with radial highlight. v1.13: 2px rim. */}
          <rect
            x="46"
            y="22"
            width="108"
            height="100"
            rx="24"
            ry="24"
            fill="url(#buddyHeadShine)"
            stroke="#9ba59f"
            strokeWidth="2"
          />
          {/* v1.13 — soft inner highlight crescent at the top of the head
              so the dome reads as a 3D sphere being lit from above. */}
          <path
            d="M 56 30 Q 100 24 144 30 Q 144 40 100 38 Q 56 40 56 30 Z"
            fill="#ffffff"
            opacity="0.55"
          />

          {/* Face screen with inner gradient + bezel */}
          <rect
            x="58"
            y="40"
            width="84"
            height="64"
            rx="16"
            ry="16"
            fill="url(#buddyFaceShine)"
          />
          {/* Screen bezel highlight */}
          <rect
            x="58"
            y="40"
            width="84"
            height="64"
            rx="16"
            ry="16"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.12"
          />
          {/* v1.13 brighter screen sheen — clear glassy reflection arc */}
          <path
            d="M 62 47 Q 100 42 138 47 L 138 60 Q 100 53 62 60 Z"
            fill="url(#buddyScreenSheen)"
          />

          {/* Eyes — bigger, with white highlight for life. v1.7: aria-hidden
              on decorative inner pieces is technically redundant (parent
              SVG is aria-hidden) but it's defensive in case a future
              refactor un-hides the SVG.
              v1.13: outer "eye socket" ring + crescent shadow under each
              eye gives a rounded 3D feel instead of flat dots. */}
          <g className="buddy__eyes" aria-hidden="true">
            {/* Outer halo ring per eye — subtle bloom */}
            <circle cx="80" cy="72" r="13" fill="var(--buddy-eye-color)" opacity="0.18" />
            <circle cx="120" cy="72" r="13" fill="var(--buddy-eye-color)" opacity="0.18" />
            {/* Eye core */}
            <circle cx="80" cy="72" r="10" fill="var(--buddy-eye-color)" className="buddy__eye buddy__eye--left" />
            <circle cx="120" cy="72" r="10" fill="var(--buddy-eye-color)" className="buddy__eye buddy__eye--right" />
            {/* Crescent shadow under each eye — gives a rounded ball feel */}
            <path d="M 71 75 A 10 10 0 0 0 89 75 A 10 6 0 0 1 71 75 Z" fill="#000000" opacity="0.18" />
            <path d="M 111 75 A 10 10 0 0 0 129 75 A 10 6 0 0 1 111 75 Z" fill="#000000" opacity="0.18" />
            {/* Highlight specks — give the eyes life and depth */}
            <circle cx="83.5" cy="68.5" r="3" fill="#ffffff" opacity="0.95" />
            <circle cx="123.5" cy="68.5" r="3" fill="#ffffff" opacity="0.95" />
            {/* Tiny secondary glints */}
            <circle cx="77" cy="75" r="1.2" fill="#ffffff" opacity="0.7" />
            <circle cx="117" cy="75" r="1.2" fill="#ffffff" opacity="0.7" />
          </g>

          {/* Cheek blush — soft tinted dots add warmth & character.
              Uses eye-color so it tints with state. Decorative.
              v1.13: bigger and more visible. */}
          <ellipse cx="66" cy="88" rx="6.5" ry="3.5" fill="var(--buddy-eye-color)" opacity="0.32" />
          <ellipse cx="134" cy="88" rx="6.5" ry="3.5" fill="var(--buddy-eye-color)" opacity="0.32" />

          {/* Subtle smile (varies by state via CSS). v1.13: thicker stroke
              so the smile actually reads at small sizes. */}
          <path
            d="M 82 92 Q 100 100 118 92"
            stroke="var(--buddy-eye-color)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="buddy__mouth"
            opacity="0.78"
          />
        </g>

        {/* Floor glow — soft pool of state-tinted light beneath Buddy.
            Sits between the figure and the dark shadow so Buddy reads as
            gently floating on a warm halo rather than sitting flat.
            v1.13: bigger ellipse + boosted opacity for visibility. */}
        <ellipse cx="100" cy="232" rx="74" ry="13" fill="url(#buddyFloorGlow)" aria-hidden="true" />

        {/* Base / shadow — v1.7 explicit aria-hidden for defensive a11y. */}
        <ellipse cx="100" cy="234" rx="58" ry="6" fill="#0a0f0e" opacity="0.18" className="buddy__shadow" aria-hidden="true" />
      </svg>
    </div>
  );
}
