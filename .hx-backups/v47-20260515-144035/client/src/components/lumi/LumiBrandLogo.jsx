/*
 * LumiBrandLogo — renders the official MyMentalHealthBuddy brand lockup.
 *
 * Now uses the canonical brand artwork (lockup PNG with sleeping-Lumi icon +
 * wordmark + "by The Genuine Love Project" subhead). The icon-only variant
 * uses the buddy character PNG cropped via object-fit.
 *
 * Variants:
 *   - "horizontal" (default)  → full lockup PNG
 *   - "stacked"               → full lockup PNG (composition is identical here)
 *   - "icon-only"             → buddy character only
 *   - "wordmark-only"         → lockup PNG with the icon visually trimmed (same image, simpler)
 *
 * Sizes: sm | md | lg | xl
 */
import { Link } from "wouter";
import lockupUrl from "@assets/mmhb_brand_logo_lockup_1777538625498.png";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";

const SIZES = {
  sm: { icon: 28, lockupHeight: 32 },
  md: { icon: 40, lockupHeight: 44 },
  lg: { icon: 56, lockupHeight: 60 },
  xl: { icon: 80, lockupHeight: 88 },
};

// The supplied lockup PNG is roughly 1024 x 320 (~3.2:1). We reserve that
// aspect ratio on the wrapper so the image height + computed width don't
// reflow page content while the bitmap decodes. Update LOCKUP_ASPECT if the
// brand owners ship a recropped version.
const LOCKUP_ASPECT = 1024 / 320;

function LumiIconMark({ size = 40, ariaHidden = true }) {
  // ariaHidden retained for API compat — BuddyAvatar handles its own
  // role/aria via the buddy state contract; the wrapper element below
  // forwards aria-hidden when the icon should be purely decorative.
  return (
    <span
      style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      <BuddyAvatar state="calm" colorMode="default" size={size} data-testid="lumi-icon-mark" />
    </span>
  );
}

export default function LumiBrandLogo({
  variant = "horizontal",
  size = "md",
  showParent = true, // accepted for API compat; lockup PNG already includes the subhead
  href = "/",
  className = "",
  ariaLabel = "MyMentalHealthBuddy by The Genuine Love Project — go to home",
}) {
  const s = SIZES[size] || SIZES.md;

  const inner =
    variant === "icon-only" ? (
      <LumiIconMark size={s.icon} />
    ) : (
      // For horizontal, stacked, and wordmark-only we render the full lockup image.
      // The lockup composition is the canonical brand asset and should not be
      // re-typeset in CSS. `showParent` is preserved as an API hint but doesn't
      // alter the artwork (the subhead is part of the image).
      <img
        src={lockupUrl}
        alt=""
        aria-hidden="true"
        draggable="false"
        loading="lazy"
        decoding="async"
        width={Math.round(s.lockupHeight * LOCKUP_ASPECT)}
        height={s.lockupHeight}
        style={{
          height: s.lockupHeight,
          width: Math.round(s.lockupHeight * LOCKUP_ASPECT),
          aspectRatio: `${LOCKUP_ASPECT}`,
          objectFit: "contain",
          display: "block",
        }}
        data-show-parent={showParent ? "true" : "false"}
      />
    );

  if (!href) {
    return (
      <span
        className={`lumi-brand-logo ${className}`.trim()}
        aria-label={ariaLabel}
        role="img"
        data-testid="lumi-brand-logo"
      >
        {inner}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`lumi-brand-logo lumi-link-brand ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
      }}
      data-testid="lumi-brand-logo"
    >
      {inner}
    </Link>
  );
}

export { LumiIconMark };
