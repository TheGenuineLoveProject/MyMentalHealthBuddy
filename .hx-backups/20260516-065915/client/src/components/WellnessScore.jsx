import { useState, useEffect } from "react";
import { TrendingUp, Heart, Brain, Sparkles, Activity, ArrowUp, ArrowDown, Minus } from "lucide-react";

const WELLNESS_FACTORS = [
  {
    id: "mood",
    name: "Emotional Balance",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    weight: 0.3,
  },
  {
    id: "journal",
    name: "Self-Reflection",
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    weight: 0.2,
  },
  {
    id: "habits",
    name: "Daily Habits",
    icon: Activity,
    color: "from-emerald-400 to-teal-500",
    weight: 0.25,
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    icon: Sparkles,
    color: "from-amber-400 to-orange-500",
    weight: 0.25,
  },
];

export default function WellnessScore({ moodData, journalCount, habitCompletion, meditationMinutes }) {
  const [score, setScore] = useState(0);
  const [trend, setTrend] = useState("stable");
  const [breakdown, setBreakdown] = useState({});

  useEffect(() => {
    const moodScore = moodData?.averageRating 
      ? (moodData.averageRating / 10) * 100 
      : 50;

    const journalScore = Math.min(100, (journalCount || 0) * 10);

    const habitsScore = habitCompletion 
      ? (habitCompletion.completed / habitCompletion.total) * 100 
      : 0;

    const mindfulnessScore = Math.min(100, (meditationMinutes || 0) * 5);

    const newBreakdown = {
      mood: moodScore,
      journal: journalScore,
      habits: habitsScore,
      mindfulness: mindfulnessScore,
    };
    setBreakdown(newBreakdown);

    const totalScore = 
      moodScore * WELLNESS_FACTORS[0].weight +
      journalScore * WELLNESS_FACTORS[1].weight +
      habitsScore * WELLNESS_FACTORS[2].weight +
      mindfulnessScore * WELLNESS_FACTORS[3].weight;

    setScore(Math.round(totalScore));

    const savedScore = localStorage.getItem("last_wellness_score");
    if (savedScore) {
      const lastScore = parseInt(savedScore, 10);
      if (totalScore > lastScore + 5) {
        setTrend("up");
      } else if (totalScore < lastScore - 5) {
        setTrend("down");
      } else {
        setTrend("stable");
      }
    }
    localStorage.setItem("last_wellness_score", Math.round(totalScore).toString());
  }, [moodData, journalCount, habitCompletion, meditationMinutes]);

  const getScoreColor = (s) => {
    if (s >= 80) return "from-emerald-400 to-teal-500";
    if (s >= 60) return "from-green-400 to-emerald-500";
    if (s >= 40) return "from-amber-400 to-yellow-500";
    if (s >= 20) return "from-orange-400 to-amber-500";
    return "from-red-400 to-rose-500";
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    if (s >= 20) return "Needs Attention";
    return "Getting Started";
  };

  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-[var(--text-muted)]";

  return (
    <div className="card-elevated p-8 relative overflow-hidden" data-testid="wellness-score">
      <div className={`absolute inset-0 bg-gradient-to-br ${getScoreColor(score)} opacity-5`} />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-400/10 to-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreColor(score)} flex items-center justify-center shadow-lg`}>
              <TrendingUp className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-[var(--text)]">
                Wellness Score
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">{getScoreLabel(score)}</span>
                <TrendIcon className={`w-4 h-4 ${trendColor}`} aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`} data-testid="text-wellness-score" aria-label={`Wellness score: ${score} out of 100`}>
              {score}
            </div>
            <p className="text-xs text-[var(--text-muted)]">out of 100</p>
          </div>
        </div>

        <div className="relative h-4 bg-[var(--surface)] rounded-full mb-8 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreColor(score)} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {[20, 40, 60, 80].map((mark) => (
              <div
                key={mark}
                className="w-0.5 h-2 bg-white/30 rounded-full"
                style={{ marginLeft: `${mark - 2}%` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {WELLNESS_FACTORS.map((factor) => {
            const Icon = factor.icon;
            const factorScore = breakdown[factor.id] || 0;

            return (
              <div
                key={factor.id}
                className="p-4 rounded-xl bg-[var(--surface)]"
                data-testid={`factor-${factor.id}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${factor.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text)]">{factor.name}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${factor.color} rounded-full transition-all duration-500`}
                        style={{ width: `${factorScore}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-[var(--text)]">
                    {Math.round(factorScore)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--text-muted)]">
            {score >= 60 
              ? "🌟 You're doing great! Keep nurturing your wellbeing."
              : "💪 Small steps lead to big changes. You've got this!"}
          </p>
        </div>
      </div>
    </div>
  );
}
