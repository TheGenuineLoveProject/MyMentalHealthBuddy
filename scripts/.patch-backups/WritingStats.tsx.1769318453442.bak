import { useMemo } from "react";
import { analyzeWriting, getWritingInsight, type WritingMetrics } from "@/lib/analytics/writingAnalytics";

interface Props {
  text: string;
}

function StatCard({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <div className="rounded-lg border bg-card p-3" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {subtext && <div className="text-xs text-muted-foreground/70 mt-1">{subtext}</div>}
    </div>
  );
}

function PaceIndicator({ pace }: { pace: WritingMetrics["emotionalPace"] }) {
  const paceColors = {
    slow: "bg-blue-500",
    moderate: "bg-green-500",
    fast: "bg-amber-500",
  };

  const paceLabels = {
    slow: "Slow & Reflective",
    moderate: "Balanced Flow",
    fast: "Quick & Direct",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${paceColors[pace]}`} />
      <span className="text-sm">{paceLabels[pace]}</span>
    </div>
  );
}

export default function WritingStats({ text }: Props) {
  const metrics = useMemo(() => analyzeWriting(text), [text]);
  const insight = useMemo(() => getWritingInsight(metrics), [metrics]);

  if (metrics.wordCount === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Your Writing Patterns</h3>
        <PaceIndicator pace={metrics.emotionalPace} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Words" value={metrics.wordCount} />
        <StatCard label="Sentences" value={metrics.sentenceCount} />
        <StatCard label="Avg Length" value={metrics.avgWordsPerSentence} subtext="words/sentence" />
        <StatCard label="Read Time" value={`${metrics.readingTime}m`} />
      </div>

      {metrics.topWords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {metrics.topWords.slice(0, 6).map((w) => (
            <span
              key={w.word}
              className="rounded-full border px-2 py-1 text-xs"
              data-testid={`word-${w.word}`}
            >
              {w.word} ({w.count})
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground italic">{insight}</p>
    </div>
  );
}
