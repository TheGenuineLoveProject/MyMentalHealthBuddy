/**
 * InfinityHeartCard Component
 * A shareable wellness card with quote, micro-tool, and action
 * 
 * Usage: Generate beautiful, shareable "Infinity Heart" cards
 * that users can save or share with friends
 */

import { useState } from "react";
import { Heart, Bookmark, Share2, Copy, Check, Sparkles } from "lucide-react";

export function InfinityHeartCard({
  quote,
  microTool,
  action,
  category = "Self-Love",
  onSave,
  onShare,
  className = ""
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setSaved(true);
    onSave?.();
  };

  const handleCopy = async () => {
    const text = `"${quote}"\n\nMicro-tool: ${microTool}\n\nAction: ${action}\n\n— The Genuine Love Project`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write not supported or denied
    }
  };

  const handleShare = async () => {
    const text = `"${quote}" — The Genuine Love Project`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MyMentalHealthBuddy",
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
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-teal-50 dark:from-rose-900/30 dark:via-amber-900/20 dark:to-teal-900/30 border border-rose-200/60 dark:border-rose-800/40 p-6 ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Heart className="w-full h-full text-rose-400" fill="currentColor" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-full bg-rose-100 dark:bg-rose-800">
            <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" fill="currentColor" />
          </div>
          <span className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            {category}
          </span>
        </div>

        <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
          "{quote}"
        </blockquote>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60">
            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase">Micro-Tool</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{microTool}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60">
            <Heart className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase">One Action</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{action}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saved 
                ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300" 
                : "bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-900/30"
            }`}
            data-testid="button-save-heart-card"
          >
            {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? "Saved" : "Save"}
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copied 
                ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" 
                : "bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            data-testid="button-copy-heart-card"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors"
            data-testid="button-share-heart-card"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
          The Genuine Love Project — Live in Genuine Love
        </p>
      </div>
    </div>
  );
}

export default InfinityHeartCard;
