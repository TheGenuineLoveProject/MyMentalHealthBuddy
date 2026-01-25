import { useState, useEffect } from "react";
import { getDailyWisdom, getRandomWisdom, type WisdomEntry } from "@/lib/wisdom/wisdomLibrary";
import { Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

interface WisdomCardProps {
  mode?: "daily" | "random";
  onQuestionClick?: (question: string) => void;
}

export default function WisdomCard({ mode = "daily", onQuestionClick }: WisdomCardProps) {
  const [wisdom, setWisdom] = useState<WisdomEntry | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setWisdom(mode === "daily" ? getDailyWisdom() : getRandomWisdom());
  }, [mode]);

  function handleRefresh() {
    setWisdom(getRandomWisdom(Date.now()));
    setIsFlipped(false);
  }

  if (!wisdom) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Wisdom Card — The Genuine Love Project" description="Explore wisdom card tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Wisdom Card</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  const categoryColors: Record<string, string> = {
    philosophy: "text-blue-400",
    psychology: "text-purple-400",
    systems: "text-green-400",
    spirituality: "text-amber-400",
    science: "text-cyan-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/20 to-black/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium opacity-80">
            {mode === "daily" ? "Today's Wisdom" : "A Thought to Consider"}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          data-testid="button-refresh-wisdom"
        >
          <RefreshCw className="h-4 w-4 opacity-60" />
        </button>
      </div>

      <div
        className="cursor-pointer transition-all duration-300"
        onClick={() => setIsFlipped(!isFlipped)}
        data-testid="card-wisdom"
      >
        {!isFlipped ? (
          <div className="space-y-3">
            <blockquote className="text-lg font-medium leading-relaxed italic">
              "{wisdom.insight}"
            </blockquote>
            <div className="flex items-center justify-between text-xs opacity-70">
              <span className={categoryColors[wisdom.category]}>
                {wisdom.tradition}
              </span>
              {wisdom.source && (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {wisdom.source}
                </span>
              )}
            </div>
            <p className="text-xs opacity-50 mt-2">Tap to see the question</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm opacity-70">A question to sit with:</p>
            <p className="text-lg font-medium">{wisdom.question}</p>
            {onQuestionClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuestionClick(wisdom.question);
                }}
                className="mt-3 text-sm underline underline-offset-2 opacity-80 hover:opacity-100"
                data-testid="button-use-question"
              >
                Use this as a journal prompt
              </button>
            )}
            <p className="text-xs opacity-50 mt-2">Tap to see the insight</p>
          </div>
        )}
      </div>
    </div>
  );
}
