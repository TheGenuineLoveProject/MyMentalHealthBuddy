import { useState } from "react";
import { Heart, Sparkles } from 'lucide-react';

const MOOD_COLORS = {
  happy: { ring: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", icon: "😊" },
  great: { ring: "#22c55e", bg: "rgba(34, 197, 94, 0.1)", icon: "🌟" },
  grateful: { ring: "#d4af37", bg: "rgba(212, 175, 55, 0.1)", icon: "🙏" },
  calm: { ring: "#8fbf9f", bg: "rgba(143, 191, 159, 0.1)", icon: "🌿" },
  hopeful: { ring: "#2f5d5d", bg: "rgba(47, 93, 93, 0.1)", icon: "🌅" },
  neutral: { ring: "#9ca3af", bg: "rgba(156, 163, 175, 0.1)", icon: "😌" },
  okay: { ring: "#9ca3af", bg: "rgba(156, 163, 175, 0.1)", icon: "🙂" },
  good: { ring: "#84cc16", bg: "rgba(132, 204, 22, 0.1)", icon: "👍" },
  anxious: { ring: "#b48c8c", bg: "rgba(180, 140, 140, 0.1)", icon: "😰" },
  sad: { ring: "#93a5b4", bg: "rgba(147, 165, 180, 0.1)", icon: "💙" },
  low: { ring: "#b4a08c", bg: "rgba(180, 160, 140, 0.1)", icon: "🫂" },
  struggling: { ring: "#be8282", bg: "rgba(190, 130, 130, 0.1)", icon: "💪" },
  angry: { ring: "#be7878", bg: "rgba(190, 120, 120, 0.1)", icon: "🔥" },
  default: { ring: "#d4af37", bg: "rgba(212, 175, 55, 0.1)", icon: "✨" }
};

export default function SharedEntryCard({ 
  entry,
  className = "",
  style = {}
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const mood = entry?.mood?.toLowerCase() || entry?.emotion?.toLowerCase() || "default";
  const moodConfig = MOOD_COLORS[mood] || MOOD_COLORS.default;
  
  const displayName = entry?.isAnonymous ? "Anonymous Soul" : (entry?.displayName || "A Fellow Traveler");
  const snippet = entry?.content || entry?.text || "";
  const truncatedSnippet = snippet.length > 150 && !showFull 
    ? snippet.slice(0, 150) + "..." 
    : snippet;
  
  const timeAgo = entry?.createdAt 
    ? formatTimeAgo(new Date(entry.createdAt)) 
    : "Recently";

  return (
    <article 
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${moodConfig.bg} 0%, transparent 50%)`,
        ...style
      }}
      data-testid={`shared-entry-${entry?.id}`}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${moodConfig.ring}20 0%, transparent 50%)`,
          filter: "blur(20px)"
        }}
        aria-hidden="true"
      />
      
      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div 
            className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
            style={{
              background: moodConfig.bg,
              boxShadow: `0 0 0 3px ${moodConfig.ring}40, 0 0 20px ${moodConfig.ring}30`
            }}
            aria-label={`Mood: ${mood}`}
          >
            <span className="animate-pulse motion-reduce:animate-none" aria-hidden="true">
              {moodConfig.icon}
            </span>
            <div 
              className="absolute inset-0 rounded-full animate-ping opacity-20 motion-reduce:hidden"
              style={{ background: moodConfig.ring }}
              aria-hidden="true"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {displayName}
                </span>
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{
                    background: moodConfig.bg,
                    color: moodConfig.ring
                  }}
                >
                  {mood}
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {timeAgo}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              "{truncatedSnippet}"
            </p>
            
            {snippet.length > 150 && (
              <button
                onClick={() => setShowFull(!showFull)}
                className="mt-2 text-xs text-[var(--glp-teal)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] rounded"
                data-testid="toggle-full-entry"
              >
                {showFull ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
              isLiked 
                ? "bg-rose-50 dark:bg-rose-900/30 text-rose-500" 
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            aria-label={isLiked ? "Unlike this entry" : "Like this entry"}
            aria-pressed={isLiked}
            data-testid="button-like"
          >
            <Heart 
              className={`w-4 h-4 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} 
              aria-hidden="true" 
            />
            <span>{isLiked ? "Loved" : "Send Love"}</span>
          </button>
          
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Sparkles className="w-3 h-3 text-[var(--glp-gold)]" aria-hidden="true" />
            <span>Shared with compassion</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
