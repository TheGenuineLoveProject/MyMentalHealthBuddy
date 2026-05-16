import { useMemo } from "react";
import { analyzePatterns, getGrowthMetrics, type ReflectionData } from "@/lib/patterns/patternRecognition";
import { TrendingUp, Clock, Layers, Sparkles } from "lucide-react";

interface PatternInsightsProps {
  reflections: ReflectionData[];
}

export default function PatternInsights({ reflections }: PatternInsightsProps) {
  const patterns = useMemo(() => analyzePatterns(reflections), [reflections]);
  const metrics = useMemo(() => getGrowthMetrics(reflections), [reflections]);

  if (reflections.length < 3) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-purple-400" />
          <h3 className="font-semibold">Your Patterns</h3>
        </div>
        <p className="text-sm opacity-70">
          After a few more reflections, patterns will begin to emerge here.
          Keep reflecting — no rush.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-2xl font-bold">{metrics.totalReflections}</div>
            <div className="text-xs opacity-60">Reflections</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-2xl font-bold">{metrics.uniqueDays}</div>
            <div className="text-xs opacity-60">Days Active</div>
          </div>
        </div>
      </div>
    );
  }

  const typeIcons: Record<string, typeof TrendingUp> = {
    temporal: Clock,
    thematic: Layers,
    growth: TrendingUp,
    state: Sparkles,
  };

  const confidenceColors: Record<string, string> = {
    emerging: "bg-blue-500/20 text-blue-300",
    developing: "bg-purple-500/20 text-purple-300",
    established: "bg-green-500/20 text-green-300",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-5 w-5 text-purple-400" />
        <h3 className="font-semibold">Your Patterns</h3>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6 text-center">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xl font-bold">{metrics.totalReflections}</div>
          <div className="text-xs opacity-60">Reflections</div>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xl font-bold">{metrics.uniqueDays}</div>
          <div className="text-xs opacity-60">Days</div>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xl font-bold">{metrics.streakDays}</div>
          <div className="text-xs opacity-60">Streak</div>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xl font-bold">{metrics.depthScore}%</div>
          <div className="text-xs opacity-60">Depth</div>
        </div>
      </div>

      {patterns.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-sm font-medium opacity-80">Observations (not conclusions)</h4>
          {patterns.map((pattern, idx) => {
            const Icon = typeIcons[pattern.type] || Layers;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-white/5 p-4"
                data-testid={`pattern-insight-${idx}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 opacity-70" />
                    <span className="font-medium text-sm">{pattern.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${confidenceColors[pattern.confidence]}`}>
                    {pattern.confidence}
                  </span>
                </div>
                <p className="text-sm opacity-70 mt-2">{pattern.observation}</p>
                <p className="text-sm mt-2 italic opacity-90">{pattern.question}</p>
              </div>
            );
          })}
          <p className="text-xs opacity-50 mt-4">
            These are observations, not judgments. You decide what fits.
          </p>
        </div>
      ) : (
        <p className="text-sm opacity-70">
          No strong patterns yet — and that's perfectly fine.
          Patterns emerge when they're ready.
        </p>
      )}
    </div>
  );
}
