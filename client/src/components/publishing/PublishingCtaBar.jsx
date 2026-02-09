import { Link } from "wouter";
import { trackSignalEvent } from "../../utils/trackSignalEvent";

const COPY = {
  "/newsletter": {
    short: "Stay in touch — one gentle note per week.",
    long: "If you'd like a thoughtful reflection delivered weekly, our newsletter is quiet, kind, and never spammy. Unsubscribe anytime.",
  },
  "/pricing": {
    short: "Explore what Pro offers, at your own pace.",
    long: "Pro unlocks deeper tools and unlimited AI conversations. No pressure — take your time exploring what feels right.",
  },
  "/blog": {
    short: "More reflections on the blog.",
    long: "We publish gentle reflections on healing, growth, and self-awareness. Browse whenever it feels right.",
  },
  "/crisis": {
    short: "Need support? Help is always available.",
    long: "If you or someone you know is in crisis, free support is available 24/7. You are not alone.",
  },
  "/tools": {
    short: "Explore gentle wellness tools.",
    long: "Mood tracking, journaling, daily reflections — all private, all optional, all at your pace.",
  },
  "/journal": {
    short: "Write what's on your mind.",
    long: "The journal is a private space for you. No one sees it, and there's no right way to use it.",
  },
  "/reflection": {
    short: "Try a gentle daily reflection.",
    long: "A quiet moment of self-inquiry. No homework, no grading — just a thought to sit with.",
  },
};

export default function PublishingCtaBar({ ctaTarget = "/newsletter", copyVariant = "short", className = "" }) {
  const copy = COPY[ctaTarget] || COPY["/newsletter"];
  const text = copyVariant === "long" ? copy.long : copy.short;

  const handleClick = () => {
    trackSignalEvent("cta_click", { target: ctaTarget, surface: "publishing_cta_bar" });
  };

  return (
    <div className={`my-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-gray-800/80 dark:to-gray-700/80 ${className}`} data-testid="publishing-cta-bar">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{text}</p>
      <Link
        href={ctaTarget}
        onClick={handleClick}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        data-testid={`link-cta-${ctaTarget.replace('/', '')}`}
      >
        {ctaTarget === "/crisis" ? "View Crisis Resources" : ctaTarget === "/newsletter" ? "Subscribe" : "Explore"}
      </Link>
    </div>
  );
}
