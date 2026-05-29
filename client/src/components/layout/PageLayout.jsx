import SafetyFooter from "@/components/safety/LegalFooter";

/**
 * PageLayout — canonical wrapper for direct-routed public pages.
 *
 * Provides a centered max-width content region + the trauma-informed
 * SafetyFooter (with crisis link by default).
 *
 * Phase 157: the inline <SacredNav /> render was removed. The global
 * <TglpNavbar /> (mounted once in App.jsx) is the single canonical navbar,
 * so rendering SacredNav here produced a second, duplicate navbar on
 * PageLayout pages (e.g. /faq, /tools/affirmations). SacredNav's links are
 * a strict subset of TglpNavbar, so no navigation is lost.
 *
 * Notes:
 * - We intentionally use a <div> rather than a second <main> because
 *   App.jsx already provides the semantic <main id="main-content">.
 * - `style` is forwarded so callers can apply page-level gradients/colors
 *   (the inner content card will sit on top of whatever background you set).
 *
 * Props:
 * - children          — page content
 * - maxWidth          — Tailwind class for inner width (default ~1100px)
 * - padded            — apply standard horizontal/vertical padding (default true)
 * - showCrisisLink    — pass-through to SafetyFooter (default true)
 * - className         — extra classes on the outer flex column
 * - innerClassName    — extra classes on the centered content region
 * - style             — inline style on the outer flex column (use for bg gradients)
 */
export default function PageLayout({
  children,
  maxWidth = "max-w-5xl",
  padded = true,
  showCrisisLink = true,
  className = "",
  innerClassName = "",
  style,
}) {
  return (
    <div
      className={`min-h-screen flex flex-col ${className}`}
      style={style}
      data-testid="page-layout"
    >
      <div
        className={`flex-1 w-full mx-auto ${maxWidth} ${padded ? "px-4 sm:px-6 py-10 sm:py-12" : ""} ${innerClassName}`}
      >
        {children}
      </div>
      <SafetyFooter showCrisisLink={showCrisisLink} />
    </div>
  );
}
