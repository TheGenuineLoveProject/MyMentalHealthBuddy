/**
 * ShareCardPrompt Component
 * Viral mechanics for saving and sharing wellness wins
 * 
 * Usage: Encourage users to save progress and share 2-minute wins
 */

import { useState } from "react";

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function Share2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

interface ShareCardPromptProps {
  title?: string;
  quote?: string;
  microTool?: string;
  action?: string;
  onSave?: () => void;
  onShare?: () => void;
  variant?: "minimal" | "full";
  className?: string;
}

export function ShareCardPrompt({
  title = "Save this moment",
  quote,
  microTool,
  action,
  onSave,
  onShare,
  variant = "minimal",
  className = ""
}: ShareCardPromptProps) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  
  const handleSave = () => {
    setSaved(true);
    onSave?.();
  };
  
  const handleShare = async () => {
    if (navigator.share && (quote || microTool)) {
      try {
        await navigator.share({
          title: "The Genuine Love Project",
          text: quote || microTool || "A small step toward self-love",
          url: window.location.href
        });
        setShared(true);
        onShare?.();
      } catch {
        setShared(true);
        onShare?.();
      }
    } else {
      setShared(true);
      onShare?.();
    }
  };
  
  if (variant === "minimal") {
    return (
      <div className={`flex items-center justify-center gap-4 py-4 ${className}`} data-testid="section-share-prompt-minimal">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            saved 
              ? "bg-[hsl(var(--sage-100))] text-[hsl(var(--sage-700))]" 
              : "bg-[hsl(var(--sage-50))] hover:bg-[hsl(var(--sage-100))] text-[hsl(var(--sage-600))]"
          }`}
          data-testid="button-save-tool"
        >
          {saved ? <CheckIcon className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
          <span className="text-sm font-medium">{saved ? "Saved" : "Save this tool"}</span>
        </button>
        <button
          onClick={handleShare}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            shared 
              ? "bg-[hsl(var(--sage-100))] text-[hsl(var(--sage-700))]" 
              : "bg-[hsl(var(--sage-50))] hover:bg-[hsl(var(--sage-100))] text-[hsl(var(--sage-600))]"
          }`}
          data-testid="button-share-win"
        >
          {shared ? <CheckIcon className="w-4 h-4" /> : <Share2Icon className="w-4 h-4" />}
          <span className="text-sm font-medium">{shared ? "Shared" : "Share a 2-min win"}</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className={`rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-gradient-to-br from-[hsl(var(--sage-50))] to-background p-6 ${className}`} data-testid="card-share-prompt">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="w-5 h-5 text-[hsl(var(--sage-500))]" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      
      {quote && (
        <blockquote className="border-l-2 border-[hsl(var(--sage-300))] pl-4 mb-4 italic text-muted-foreground">
          "{quote}"
        </blockquote>
      )}
      
      {microTool && (
        <div className="bg-background rounded-lg p-3 mb-4 border border-[hsl(var(--sage-100))] dark:border-[hsl(var(--sage-800))]">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Micro-tool</p>
          <p className="text-sm text-foreground">{microTool}</p>
        </div>
      )}
      
      {action && (
        <div className="bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))]/30 rounded-lg p-3 mb-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">One tiny action</p>
          <p className="text-sm text-foreground font-medium">{action}</p>
        </div>
      )}
      
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all font-medium ${
            saved 
              ? "bg-[hsl(var(--sage-500))] text-white" 
              : "bg-[hsl(var(--sage-100))] hover:bg-[hsl(var(--sage-200))] text-[hsl(var(--sage-700))]"
          }`}
          data-testid="button-save-progress"
        >
          {saved ? <CheckIcon className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
          <span>{saved ? "Saved!" : "Save progress"}</span>
        </button>
        <button
          onClick={handleShare}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all font-medium ${
            shared 
              ? "bg-[hsl(var(--sage-500))] text-white" 
              : "border border-[hsl(var(--sage-300))] hover:bg-[hsl(var(--sage-50))] text-[hsl(var(--sage-700))]"
          }`}
          data-testid="button-share-card"
        >
          {shared ? <CheckIcon className="w-4 h-4" /> : <Share2Icon className="w-4 h-4" />}
          <span>{shared ? "Shared!" : "Share"}</span>
        </button>
      </div>
    </div>
  );
}

interface InfinityHeartCardProps {
  quote: string;
  tool: string;
  action: string;
  className?: string;
}

export function InfinityHeartCard({ quote, tool, action, className = "" }: InfinityHeartCardProps) {
  return (
    <ShareCardPrompt
      title="Your Infinity-Heart Card"
      quote={quote}
      microTool={tool}
      action={action}
      variant="full"
      className={className}
    />
  );
}

interface StreakShareProps {
  streakDays: number;
  winsCount: number;
  onShare?: () => void;
  className?: string;
}

export function StreakShare({ streakDays, winsCount, onShare, className = "" }: StreakShareProps) {
  const [shared, setShared] = useState(false);
  
  const handleShare = async () => {
    const text = `${streakDays} days of gentle practice, ${winsCount} small wins. Every step counts. 💚 #GenuineLove`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wellness Streak",
          text,
          url: window.location.origin
        });
        setShared(true);
        onShare?.();
      } catch {
        setShared(true);
        onShare?.();
      }
    } else {
      setShared(true);
      onShare?.();
    }
  };
  
  return (
    <div className={`rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-gradient-to-br from-[hsl(var(--sage-50))] to-background p-5 ${className}`} data-testid="card-streak-share">
      <div className="text-center mb-4">
        <p className="text-3xl font-bold text-[hsl(var(--sage-600))]">{streakDays}</p>
        <p className="text-sm text-muted-foreground">days of gentle practice</p>
      </div>
      <div className="text-center mb-4">
        <p className="text-xl font-semibold text-foreground">{winsCount}</p>
        <p className="text-sm text-muted-foreground">small wins celebrated</p>
      </div>
      <button
        onClick={handleShare}
        className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all font-medium ${
          shared 
            ? "bg-[hsl(var(--sage-500))] text-white" 
            : "bg-[hsl(var(--sage-100))] hover:bg-[hsl(var(--sage-200))] text-[hsl(var(--sage-700))]"
        }`}
        data-testid="button-share-streak"
      >
        {shared ? <CheckIcon className="w-4 h-4" /> : <Share2Icon className="w-4 h-4" />}
        <span>{shared ? "Shared!" : "Share your streak"}</span>
      </button>
      <p className="text-xs text-center text-muted-foreground mt-2">
        No shame, just celebration of showing up
      </p>
    </div>
  );
}
