import BuddyAvatar from "../avatar/BuddyAvatar";
import BuddyBubble from "./BuddyBubble";
import "./zen-scape.css";

/**
 * ZenScape — decorative zen-filled backdrop for sound / meditation /
 * affirmations / calming-scene surfaces. Pure visual layer; never gates
 * interactivity. Composes:
 *   - a soft sage→gold radial gradient wash
 *   - 3 concentric breathing rings (slow, off-phase, prefers-reduced-motion gated)
 *   - 6 floating zen "petals" drifting upward
 *   - an optional BuddyAvatar hero (state="calm", default size 140)
 *
 * The backdrop is rendered absolutely positioned with `pointer-events: none`
 * and `aria-hidden="true"`, so it can't break interactivity or a11y. The
 * children render above it inside a `relative z-10` wrapper.
 */
export default function ZenScape({
  children,
  showBuddy = true,
  buddyState = "calm",
  buddySize = 140,
  buddyLabel,
  className = "",
  bubble = true,
  bubbleRotateMs = 14000,
}) {
  return (
    <div className={`zenscape ${className}`}>
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
              <stop offset="0%"  stopColor="#7FD8A8" stopOpacity="0" />
              <stop offset="60%" stopColor="#7FD8A8" stopOpacity="0.16" />
              <stop offset="85%" stopColor="#5DDB94" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#5DDB94" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="zenWarm" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#FFD75A" stopOpacity="0" />
              <stop offset="55%" stopColor="#FFD75A" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#FFD75A" stopOpacity="0" />
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
      </div>

      {showBuddy ? (
        <div className="zenscape__hero">
          <div className="zenscape__hero-row">
            <BuddyAvatar
              state={buddyState}
              size={buddySize}
              data-testid="zenscape-buddy"
            />
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
