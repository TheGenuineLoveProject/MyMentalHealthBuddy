import { useEffect, useMemo, useState, useCallback } from "react";
import { RefreshCw, MessageCircleHeart } from "lucide-react";
import "./buddy-bubble.css";

/**
 * BuddyBubble — a small speech bubble next to BuddyAvatar that softly
 * surfaces short, NLP-aware, MI-style messages from a curated library.
 *
 * Design contract:
 *   - Original writing only. Trauma-informed. Calm. Consent-based.
 *   - Crisis state is LOCKED to a single safe message; rotation stops;
 *     the bubble explicitly routes to /crisis. (Safety contract.)
 *   - Auto-rotates every ~14s; user can advance manually with the
 *     "another thought" button (consent-based).
 *   - All transitions gated by `prefers-reduced-motion`.
 *   - aria-live="polite" so screen readers announce gentle changes.
 *   - Pure presentational layer; never imports from server/ai/* or
 *     /api/ai/chat handlers.
 */

const CRISIS_LOCK_MESSAGE = {
  category: "safe",
  emoji: "🤍",
  text: "I'm here. You don't have to do anything right now. If you need a person, please reach out — crisis support is one tap away.",
  cta: { href: "/crisis", label: "Crisis support" },
};

/* ---- Curated message library ----
 * Categories:
 *   encourage — short empowering statements
 *   reflect   — open-ended reflection questions
 *   mi        — motivational interviewing prompts
 *   evolve    — self-integration / self-evolution invitations
 *   powerful  — short, powerful one-liners
 * Each entry: { category, emoji, text } where text < 180 chars.
 */
const LIBRARY = [
  // encourage
  { category: "encourage", emoji: "🌿", text: "You are allowed to take up exactly the space you need today." },
  { category: "encourage", emoji: "✨", text: "Your nervous system has been carrying you. Notice that for one breath." },
  { category: "encourage", emoji: "🤍", text: "You don't have to earn rest. You can simply choose it." },
  { category: "encourage", emoji: "🌱", text: "Showing up here is already self-respect in action." },
  { category: "encourage", emoji: "🌅", text: "What is one tiny thing your future self would thank you for right now?" },
  { category: "encourage", emoji: "🪷", text: "You're allowed to be a beginner at the version of you that's emerging." },
  { category: "encourage", emoji: "💛", text: "Slow is a strategy. Slow is a kindness. Slow is allowed." },
  { category: "encourage", emoji: "🌤️", text: "Today doesn't have to be impressive. It only has to be honest." },

  // reflect
  { category: "reflect", emoji: "🪞", text: "Notice what you're noticing. What's underneath the first feeling?" },
  { category: "reflect", emoji: "📖", text: "If today were a chapter, what would its title be?" },
  { category: "reflect", emoji: "🔎", text: "Where in your body are you holding the most? What might it be asking for?" },
  { category: "reflect", emoji: "🗝️", text: "What story have you been telling yourself this week — and is all of it yours to carry?" },
  { category: "reflect", emoji: "🌗", text: "What was true a month ago that isn't quite as true now?" },
  { category: "reflect", emoji: "🍃", text: "If your nervous system could speak in one sentence today, what would it say?" },

  // mi (motivational interviewing — change-talk evoking, autonomy-respecting)
  { category: "mi", emoji: "🌟", text: "What would change if you trusted that you were allowed to want what you want?" },
  { category: "mi", emoji: "🧭", text: "What does the next small, doable step look like — the one you actually have energy for?" },
  { category: "mi", emoji: "🔮", text: "Imagine a version of you six months from now who is doing okay. What did they let go of?" },
  { category: "mi", emoji: "🌊", text: "On a scale of 1–10, how ready do you feel to try one small thing today? What makes it that number and not lower?" },
  { category: "mi", emoji: "🕯️", text: "What matters to you that's been quietly waiting for your attention?" },
  { category: "mi", emoji: "🌻", text: "If nothing had to change today, what would still be worth honoring about how you're showing up?" },

  // evolve (self-integration / self-evolution)
  { category: "evolve", emoji: "🌳", text: "Every reflection plants a root. The forest is already becoming." },
  { category: "evolve", emoji: "🪶", text: "What part of you is ready to be welcomed back today?" },
  { category: "evolve", emoji: "🧬", text: "You are not a project to be fixed. You are a self being remembered." },
  { category: "evolve", emoji: "🌌", text: "The version of you that is becoming is already inside the version that is here." },
  { category: "evolve", emoji: "🔥", text: "Integration looks like noticing — without having to fix what you noticed." },
  { category: "evolve", emoji: "🌀", text: "You can hold two true things at once. Both belong." },

  // powerful (short, presupposition-rich one-liners — NLP-aware)
  { category: "powerful", emoji: "💫", text: "When you're ready — and you will be — you'll know which step is yours." },
  { category: "powerful", emoji: "🌬️", text: "Notice how naturally your breath knows what to do." },
  { category: "powerful", emoji: "🌠", text: "The moment you choose yourself, you've already changed the timeline." },
  { category: "powerful", emoji: "🪴", text: "Your becoming doesn't need anyone's permission — including, eventually, your own." },
  { category: "powerful", emoji: "🫧", text: "Every breath out is a small act of letting go. You've already done it thousands of times today." },
];

function pickIndex(prevIndex, length) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  if (next === prevIndex) next = (next + 1) % length;
  return next;
}

export default function BuddyBubble({
  state = "calm",
  rotateMs = 14000,
  className = "",
  testIdPrefix = "buddy-bubble",
}) {
  const isCrisis = state === "crisis";
  const messages = useMemo(() => LIBRARY, []);
  const [index, setIndex] = useState(() => Math.floor(Math.random() * LIBRARY.length));

  const message = isCrisis ? CRISIS_LOCK_MESSAGE : messages[index];

  const advance = useCallback(() => {
    if (isCrisis) return; // crisis is locked — never rotate
    setIndex((prev) => pickIndex(prev, messages.length));
  }, [isCrisis, messages.length]);

  useEffect(() => {
    if (isCrisis) return;
    const id = window.setInterval(advance, rotateMs);
    return () => window.clearInterval(id);
  }, [advance, rotateMs, isCrisis]);

  return (
    <div
      className={`buddy-bubble ${isCrisis ? "buddy-bubble--crisis" : ""} ${className}`}
      data-state={state}
      data-testid={testIdPrefix}
    >
      <div className="buddy-bubble__tail" aria-hidden="true" />
      <div
        className="buddy-bubble__body"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="buddy-bubble__header">
          <MessageCircleHeart className="buddy-bubble__icon" aria-hidden="true" />
          <span className="buddy-bubble__name">Buddy</span>
          <span className="buddy-bubble__category">
            {isCrisis ? "safe space" : message.category}
          </span>
        </div>
        <p className="buddy-bubble__text" data-testid={`${testIdPrefix}-text`}>
          <span className="buddy-bubble__emoji" aria-hidden="true">{message.emoji}</span>
          <span>{message.text}</span>
        </p>
        <div className="buddy-bubble__footer">
          {message.cta ? (
            <a
              href={message.cta.href}
              className="buddy-bubble__cta"
              data-testid={`${testIdPrefix}-cta`}
            >
              {message.cta.label} →
            </a>
          ) : (
            <button
              type="button"
              onClick={advance}
              className="buddy-bubble__more"
              aria-label="Show me another thought from Buddy"
              data-testid={`${testIdPrefix}-next`}
            >
              <RefreshCw className="buddy-bubble__more-icon" aria-hidden="true" />
              another thought
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
