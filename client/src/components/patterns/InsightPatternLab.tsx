import { useState, useEffect } from "react";
import { 
  STATE_DIMENSIONS,
  PATTERN_EXPERIMENTS,
  analyzePatterns,
  generateInsights,
  getRandomExperiment,
  savePatternLabSession,
  type StatePattern,
  type PatternInsight
} from "@/lib/patterns/insightPatternLab";
import { Activity, TrendingUp, TrendingDown, Minus, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TREND_ICONS = {
  rising: TrendingUp,
  falling: TrendingDown,
  stable: Minus,
  volatile: AlertCircle
};

const TREND_COLORS = {
  rising: "text-green-400",
  falling: "text-amber-400",
  stable: "text-blue-400",
  volatile: "text-purple-400"
};

export default function InsightPatternLab() {
  const { toast } = useToast();
  const [windowDays, setWindowDays] = useState(7);
  const [patterns, setPatterns] = useState<StatePattern[]>([]);
  const [insights, setInsights] = useState<PatternInsight[]>([]);
  const [userNotes, setUserNotes] = useState("");
  const [suggestedExperiment, setSuggestedExperiment] = useState(() => getRandomExperiment());

  useEffect(() => {
    const stateHistoryRaw = localStorage.getItem("glp_state_history");
    if (stateHistoryRaw) {
      try {
        const history = JSON.parse(stateHistoryRaw);
        const analyzed = analyzePatterns(history, windowDays);
        setPatterns(analyzed);
        setInsights(generateInsights(analyzed));
      } catch {
        setPatterns([]);
        setInsights([]);
      }
    }
  }, [windowDays]);

  function handleRefreshExperiment() {
    setSuggestedExperiment(getRandomExperiment());
  }

  function handleSaveSession() {
    savePatternLabSession({
      id: `pattern_${Date.now()}`,
      createdAt: new Date().toISOString(),
      windowDays,
      patterns,
      insights,
      userNotes
    });
    toast({ title: "Pattern observation saved" });
    setUserNotes("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-rose-400" />
        <h2 className="text-xl font-semibold">Insight Pattern Lab</h2>
      </div>

      <p className="text-sm opacity-80">
        Observe patterns in your tracked states — not to judge, but to notice what's there.
      </p>

      <div className="flex items-center gap-3">
        <span className="text-sm opacity-70">Observation window:</span>
        {[3, 7, 14, 30].map((days) => (
          <button
            key={days}
            onClick={() => setWindowDays(days)}
            className={`rounded-full px-3 py-1 text-sm ${
              windowDays === days ? "bg-white/20 font-medium" : "bg-white/5 opacity-70"
            }`}
            data-testid={`button-window-${days}`}
          >
            {days}d
          </button>
        ))}
      </div>

      {patterns.length > 0 ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((pattern) => {
              const TrendIcon = TREND_ICONS[pattern.trend];
              const dimension = STATE_DIMENSIONS.find(d => d.id === pattern.dimension);
              return (
                <div
                  key={pattern.dimension}
                  className="rounded-xl border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{dimension?.label || pattern.dimension}</span>
                    <TrendIcon className={`h-4 w-4 ${TREND_COLORS[pattern.trend]}`} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-light">{pattern.average}</span>
                    <span className="text-xs opacity-50">/ 5</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-rose-400/60"
                      style={{ width: `${(pattern.average / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs opacity-50 mt-2">
                    {pattern.observations} observations • {pattern.trend}
                  </p>
                </div>
              );
            })}
          </div>

          {insights.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium opacity-70">Observations</h3>
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 ${
                    insight.type === "correlation" 
                      ? "border-purple-500/20 bg-purple-500/5" 
                      : "border-white/10 bg-black/10"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 uppercase">
                      {insight.type}
                    </span>
                    <span className="font-medium text-sm">{insight.title}</span>
                  </div>
                  <p className="text-sm opacity-80">{insight.description}</p>
                  {insight.suggestion && (
                    <p className="text-sm opacity-60 mt-2 italic">{insight.suggestion}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/10 p-6 text-center">
          <Activity className="h-8 w-8 opacity-30 mx-auto mb-3" />
          <p className="text-sm opacity-70">
            No state tracking data found for this period.
          </p>
          <p className="text-xs opacity-50 mt-2">
            Use the State Tracker to record observations, then return here to see patterns.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="font-medium">An Experiment to Consider</span>
          </div>
          <button
            onClick={handleRefreshExperiment}
            className="p-1.5 rounded-lg hover:bg-white/10"
            data-testid="button-refresh-experiment"
          >
            <RefreshCw className="h-4 w-4 opacity-60" />
          </button>
        </div>
        <h4 className="font-medium">{suggestedExperiment.title}</h4>
        <p className="text-sm opacity-80 mt-1">{suggestedExperiment.description}</p>
        <p className="text-xs opacity-50 mt-2">Duration: {suggestedExperiment.duration}</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm opacity-70 block">Your observations or notes:</label>
        <textarea
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="What do you notice about these patterns?"
          className="w-full rounded-xl border border-white/10 bg-black/20 p-4 min-h-[100px]"
          data-testid="input-pattern-notes"
        />
        <button
          onClick={handleSaveSession}
          className="rounded-lg bg-rose-500/20 border border-rose-500/30 px-4 py-2 text-sm hover:bg-rose-500/30"
          data-testid="button-save-pattern-session"
        >
          Save observation
        </button>
      </div>
    </div>
  );
}
