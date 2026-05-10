import BuddyAvatar from "../avatar/BuddyAvatar";
import BuddyBubble from "./BuddyBubble";
import "./zen-scape.css";

/**
 * ZenScape — decorative zen-filled backdrop for sound / meditation /
 * affirmations / calming-scene / peacescape surfaces. Pure visual layer;
 * never gates interactivity. Composes:
 *   - a soft cool→warm radial gradient wash (palette-aware)
 *   - 3 concentric breathing rings (slow, off-phase, prefers-reduced-motion gated)
 *   - 6 floating zen "petals" drifting upward (theme-aware)
 *   - an optional BuddyAvatar hero (state="calm", default size 140) + bubble
 *   - an optional accessory glyph that floats above Buddy
 *
 * Palette + theme + accessory are visual-only labels (validated server-side
 * against allowlists in /api/peacescape/state). Defaults are sage/meadow/none
 * which exactly match the original v1 visuals — every existing caller keeps
 * its appearance unless it explicitly opts in.
 *
 * The backdrop is rendered absolutely positioned with `pointer-events: none`
 * and `aria-hidden="true"`, so it can't break interactivity or a11y. The
 * children render above it inside a `relative z-10` wrapper.
 */
const ACCESSORY_GLYPH = {
  none: null,
  star: "✦",
  heart: "♡",
  leaf: "❋",
  moon: "☾",
  sun: "☀",
  feather: "⌇",
};

export default function ZenScape({
  children,
  showBuddy = true,
  buddyState = "calm",
  buddySize = 140,
  buddyLabel,
  className = "",
  bubble = true,
  bubbleRotateMs = 14000,
  palette = "sage",
  theme = "meadow",
  accessory = "none",
  stage,
}) {
  const accessoryGlyph = ACCESSORY_GLYPH[accessory] || null;
  const stageNum =
    typeof stage === "number" && stage >= 1 && stage <= 6
      ? Math.floor(stage)
      : null;

  return (
    <div
      className={`zenscape ${className}`}
      data-zen-palette={palette}
      data-zen-theme={theme}
      {...(stageNum ? { "data-zen-stage": String(stageNum) } : {})}
      data-testid="zenscape-root"
    >
      <div className="zenscape__bg" aria-hidden="true">
        <div className="zenscape__wash" />
        <svg
          className="zenscape__rings"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="zenRing" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  style={{ stopColor: "var(--zen-cool, #7FD8A8)" }} stopOpacity="0" />
              <stop offset="60%" style={{ stopColor: "var(--zen-cool, #7FD8A8)" }} stopOpacity="0.16" />
              <stop offset="85%" style={{ stopColor: "var(--zen-cool-deep, #5DDB94)" }} stopOpacity="0.10" />
              <stop offset="100%" style={{ stopColor: "var(--zen-cool-deep, #5DDB94)" }} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="zenWarm" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  style={{ stopColor: "var(--zen-warm, #FFD75A)" }} stopOpacity="0" />
              <stop offset="55%" style={{ stopColor: "var(--zen-warm, #FFD75A)" }} stopOpacity="0.10" />
              <stop offset="100%" style={{ stopColor: "var(--zen-warm, #FFD75A)" }} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="zenscape__ring zenscape__ring--a" cx="400" cy="320" r="240" fill="url(#zenRing)" />
          <circle className="zenscape__ring zenscape__ring--b" cx="400" cy="320" r="180" fill="url(#zenWarm)" />
          <circle className="zenscape__ring zenscape__ring--c" cx="400" cy="320" r="120" fill="url(#zenRing)" />
        </svg>
        <div className="zenscape__petals">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`zenscape__petal zenscape__petal--${i}`} />
          ))}
        </div>
        <div className="zenscape__sparkles">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`zenscape__sparkle zenscape__sparkle--${i}`} aria-hidden="true" />
          ))}
        </div>
      </div>

      {showBuddy ? (
        <div className="zenscape__hero">
          <div className="zenscape__hero-row">
            <div className="zenscape__buddy-stack">
              {accessoryGlyph ? (
                <span
                  className="zenscape__accessory"
                  aria-hidden="true"
                  data-testid="zenscape-accessory"
                  data-accessory={accessory}
                >
                  {accessoryGlyph}
                </span>
              ) : null}
              <BuddyAvatar
                state={buddyState}
                size={buddySize}
                overlay
                data-testid="zenscape-buddy"
              />
            </div>
            {bubble ? (
              <BuddyBubble state={buddyState} rotateMs={bubbleRotateMs} />
            ) : null}
          </div>
          {buddyLabel ? (
            <p className="zenscape__hero-label" data-testid="zenscape-buddy-label">
              {buddyLabel}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="zenscape__content">{children}</div>
    </div>
  );
}
