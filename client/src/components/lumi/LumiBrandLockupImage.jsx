/*
 * LumiBrandLockupImage — Real PNG horizontal brand lockup (icon + wordmark).
 *
 * Sibling to LumiBrandLogo.jsx (which is the SVG/CSS lockup). Use this when
 * you want the painted, finished brand mark — typically in marketing pages,
 * footer credit lines, social cards. For headers that need crisp scaling
 * across viewports, prefer the SVG <LumiBrandLogo/>.
 */
import { Link } from "wouter";
import lockupPng from "@assets/mmhb_brand_logo_lockup_1777538625498.png";

export default function LumiBrandLockupImage({
  height = 64,
  href = "/",
  ariaLabel = "MyMentalHealthBuddy by The Genuine Love Project",
  decorative = false,
  className = "",
  style = {},
}) {
  const img = (
    <img
      src={lockupPng}
      alt={decorative ? "" : ariaLabel}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      style={{
        height,
        width: "auto",
        display: "block",
        objectFit: "contain",
        userSelect: "none",
        ...style,
      }}
      draggable={false}
      data-testid="lumi-brand-lockup-image"
    />
  );

  if (!href) {
    return (
      <span className={`lumi-brand-lockup-image ${className}`.trim()}>{img}</span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`lumi-brand-lockup-image lumi-link-brand ${className}`.trim()}
      style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
      data-testid="lumi-brand-lockup-image-link"
    >
      {img}
    </Link>
  );
}
