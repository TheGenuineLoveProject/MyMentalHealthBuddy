/**
 * StreakShare Component
 * Share streaks and wellness wins without shame
 * 
 * Usage: Celebrate consistency with shareable streak cards
 */

import { useState } from "react";
import { Flame, Trophy, Share2, Copy, Check, Calendar, Sparkles } from "lucide-react";

const STREAK_MESSAGES = [
  { min: 1, max: 3, message: "Every journey starts with a single step", emoji: "\u{1F331}" },
  { min: 4, max: 7, message: "Building new neural pathways", emoji: "\u2728" },
  { min: 8, max: 14, message: "Consistency is self-love in action", emoji: "\u{1F4AA}" },
  { min: 15, max: 30, message: "Your future self thanks you", emoji: "\u{1F525}" },
  { min: 31, max: 60, message: "Habits are forming, healing is happening", emoji: "\u{1F31F}" },
  { min: 61, max: 90, message: "You're rewriting your story", emoji: "\u{1F3C6}" },
  { min: 91, max: 365, message: "Living in Genuine Love", emoji: "\u{1F49D}" },
  { min: 366, max: Infinity, message: "A year of choosing yourself", emoji: "\u{1F451}" }
];

function getStreakMessage(days) {
  return STREAK_MESSAGES.find(m => days >= m.min && days <= m.max) || STREAK_MESSAGES[0];
}

export function StreakShare({
  streakDays,
  activityType = "wellness practice",
  milestone = false,
  onShare,
  className = ""
}) {
  const [copied, setCopied] = useState(false);
  const streakInfo = getStreakMessage(streakDays);

  const handleCopy = async () => {
    const text = `${streakInfo.emoji} ${streakDays} day streak!\n\n${streakInfo.message}\n\n\u2014 The Genuine Love Project`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write not supported or denied
    }
  };

  const handleShare = async () => {
    const text = `${streakInfo.emoji} ${streakDays} day streak! ${streakInfo.message}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wellness Streak",
          text,
          url: window.location.origin
        });
        onShare?.();
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`rounded-xl border ${
      milestone 
        ? "border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30" 
        : "border-rose-200/60 dark:border-rose-800/40 bg-gradient-to-br from-rose-50/50 to-amber-50/30 dark:from-rose-900/20 dark:to-amber-900/10"
    } p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${
            milestone 
              ? "bg-amber-100 dark:bg-amber-800" 
              : "bg-rose-100 dark:bg-rose-800"
          }`}>
            {milestone ? (
              <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            ) : (
              <Flame className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {streakDays}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                day{streakDays !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {activityType}
            </span>
          </div>
        </div>
        
        <span className="text-3xl">{streakInfo.emoji}</span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
        "{streakInfo.message}"
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
            copied 
              ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300" 
              : "bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          data-testid="button-copy-streak"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors flex-1 justify-center"
          data-testid="button-share-streak"
        >
          <Share2 className="w-4 h-4" />
          Share Win
        </button>
      </div>

      {milestone && (
        <div className="mt-4 p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-800/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Milestone reached!
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            You've shown incredible dedication to your growth. Celebrate this moment.
          </p>
        </div>
      )}
    </div>
  );
}

export default StreakShare;
