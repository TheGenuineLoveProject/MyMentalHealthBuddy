import { Calendar, TrendingUp, Heart, BookOpen, MessageSquare, Sparkles, Award, CheckCircle } from "lucide-react";
import { getMiAffirmation } from "@/content/journalPrompts.js";

const MOCK_WEEKLY_DATA = {
  period: "This Week",
  dates: "Jan 19 – Jan 25",
  highlights: [
    { type: "journal", label: "Journal Entries", count: 5, icon: BookOpen, color: "sage" },
    { type: "moods", label: "Mood Check-ins", count: 12, icon: Heart, color: "blush" },
    { type: "sessions", label: "AI Sessions", count: 3, icon: MessageSquare, color: "teal" },
    { type: "practices", label: "Wellness Practices", count: 8, icon: Sparkles, color: "gold" }
  ],
  streakDays: 7,
  topStrength: "Consistency",
  progressNote: "You've been showing up for yourself consistently. That's real growth.",
  miAffirmation: getMiAffirmation()
};

function getColorClass(color) {
  const map = {
    sage: "bg-[var(--sage-100)] text-[var(--sage-700)]",
    gold: "bg-[var(--gold-100)] text-[var(--gold-700)]",
    blush: "bg-[var(--blush-100)] text-[var(--blush-700)]",
    teal: "bg-[var(--teal-100)] text-[var(--teal-700)]"
  };
  return map[color] || map.sage;
}

function StatBadge({ highlight }) {
  const Icon = highlight.icon;
  return (
    <div 
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-elevated)]"
      data-testid={`weekly-stat-${highlight.type}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClass(highlight.color)}`}>
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-lg font-semibold text-[var(--text-primary)]">{highlight.count}</p>
        <p className="text-xs text-[var(--text-muted)]">{highlight.label}</p>
      </div>
    </div>
  );
}

export default function WeeklyRecap({ data = MOCK_WEEKLY_DATA, className = "" }) {
  return (
    <section 
      className={`bg-gradient-to-br from-[var(--sage-50)] to-[var(--cream-50)] rounded-2xl p-6 border border-[var(--sage-200)] shadow-sm ${className}`}
      aria-labelledby="weekly-recap-title"
      data-testid="section-weekly-recap"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 id="weekly-recap-title" className="font-semibold text-[var(--text-primary)]" data-testid="heading-weekly-recap">
              {data.period}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">{data.dates}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)]">
          <Award className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm font-medium">{data.streakDays}-day streak</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {data.highlights.map((highlight, i) => (
          <StatBadge key={i} highlight={highlight} />
        ))}
      </div>

      <div className="bg-white/80 rounded-xl p-4 border border-[var(--sage-100)]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--sage-100)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4 text-[var(--sage-600)]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]" data-testid="text-weekly-strength">
              Your top strength: <span className="text-[var(--primary)]">{data.topStrength}</span>
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1" data-testid="text-weekly-progress">
              {data.progressNote}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-muted)] italic">
              <CheckCircle className="w-3 h-3 text-[var(--sage-500)]" aria-hidden="true" />
              <span data-testid="text-mi-affirmation">{data.miAffirmation}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          Weekly recaps help you see your progress. You decide what counts as success.
        </p>
      </div>
    </section>
  );
}
