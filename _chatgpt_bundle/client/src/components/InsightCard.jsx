import { Lightbulb, TrendingUp, TrendingDown, Minus, Heart, Brain, Moon, Sun, AlertCircle } from "lucide-react";

const INSIGHT_TYPES = {
  positive: {
    icon: TrendingUp,
    color: "from-emerald-400 to-teal-500",
    bgLight: "from-emerald-50 to-teal-50",
    bgDark: "from-emerald-900/20 to-teal-900/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  negative: {
    icon: TrendingDown,
    color: "from-red-400 to-rose-500",
    bgLight: "from-red-50 to-rose-50",
    bgDark: "from-red-900/20 to-rose-900/20",
    textColor: "text-red-600 dark:text-red-400",
  },
  neutral: {
    icon: Minus,
    color: "from-slate-400 to-gray-500",
    bgLight: "from-slate-50 to-gray-50",
    bgDark: "from-slate-900/20 to-gray-900/20",
    textColor: "text-slate-600 dark:text-slate-400",
  },
  tip: {
    icon: Lightbulb,
    color: "from-amber-400 to-yellow-500",
    bgLight: "from-amber-50 to-yellow-50",
    bgDark: "from-amber-900/20 to-yellow-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  mood: {
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bgLight: "from-pink-50 to-rose-50",
    bgDark: "from-pink-900/20 to-rose-900/20",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  mindfulness: {
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    bgLight: "from-purple-50 to-indigo-50",
    bgDark: "from-purple-900/20 to-indigo-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  sleep: {
    icon: Moon,
    color: "from-indigo-400 to-blue-500",
    bgLight: "from-indigo-50 to-blue-50",
    bgDark: "from-indigo-900/20 to-blue-900/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  energy: {
    icon: Sun,
    color: "from-orange-400 to-amber-500",
    bgLight: "from-orange-50 to-amber-50",
    bgDark: "from-orange-900/20 to-amber-900/20",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  alert: {
    icon: AlertCircle,
    color: "from-red-400 to-rose-500",
    bgLight: "from-red-50 to-rose-50",
    bgDark: "from-red-900/20 to-rose-900/20",
    textColor: "text-red-600 dark:text-red-400",
  },
};

export default function InsightCard({ 
  type = "tip", 
  title, 
  description, 
  metric,
  metricLabel,
  action,
  onAction,
  compact = false 
}) {
  const style = INSIGHT_TYPES[type] || INSIGHT_TYPES.tip;
  const Icon = style.icon;

  if (compact) {
    return (
      <div 
        className={`p-4 rounded-xl bg-gradient-to-r ${style.bgLight} dark:${style.bgDark} transition-all hover:shadow-md`}
        data-testid="insight-card-compact"
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${style.color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[var(--text)] text-sm">{title}</p>
            {description && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">{description}</p>
            )}
          </div>
          {metric && (
            <div className="text-right flex-shrink-0">
              <span className={`text-lg font-bold ${style.textColor}`}>{metric}</span>
              {metricLabel && (
                <p className="text-xs text-[var(--text-muted)]">{metricLabel}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`card-elevated p-6 relative overflow-hidden transition-all hover:shadow-lg`}
      data-testid="insight-card"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.color} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-display font-bold text-[var(--text)]">{title}</h4>
              {type !== "tip" && (
                <span className={`text-xs font-medium ${style.textColor} capitalize`}>{type}</span>
              )}
            </div>
          </div>

          {metric && (
            <div className="text-right">
              <span className={`text-3xl font-bold ${style.textColor}`}>{metric}</span>
              {metricLabel && (
                <p className="text-xs text-[var(--text-muted)]">{metricLabel}</p>
              )}
            </div>
          )}
        </div>

        {description && (
          <p className="text-[var(--text-secondary)] mb-4">{description}</p>
        )}

        {action && onAction && (
          <button
            onClick={onAction}
            className={`w-full py-3 rounded-xl font-medium bg-gradient-to-r ${style.color} text-white shadow-md hover:shadow-lg transition-all`}
            data-testid="button-insight-action"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}
