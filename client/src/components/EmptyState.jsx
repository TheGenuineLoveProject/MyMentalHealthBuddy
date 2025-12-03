import { Link } from "wouter";
import { Smile, BookOpen, MessageCircle, BarChart3, Plus, ArrowRight } from "lucide-react";

const EMPTY_STATE_CONFIGS = {
  moods: {
    icon: Smile,
    title: "No mood entries yet",
    description: "Start tracking your emotional well-being by logging your first mood. It only takes a moment.",
    actionText: "Log Your First Mood",
    actionHref: null,
    gradient: "from-amber-500 to-orange-600",
  },
  journals: {
    icon: BookOpen,
    title: "Your journal is waiting",
    description: "Express your thoughts and feelings by writing your first journal entry. It's a great way to reflect and grow.",
    actionText: "Write First Entry",
    actionHref: null,
    gradient: "from-emerald-500 to-teal-600",
  },
  chat: {
    icon: MessageCircle,
    title: "Start a conversation",
    description: "Your AI wellness companion is here to listen. Share what's on your mind and get supportive guidance.",
    actionText: "Begin Chat",
    actionHref: null,
    gradient: "from-violet-500 to-purple-600",
  },
  analytics: {
    icon: BarChart3,
    title: "No data to analyze yet",
    description: "Start logging moods and journal entries to see insights about your wellness journey over time.",
    actionText: "Log a Mood",
    actionHref: "/mood",
    gradient: "from-blue-500 to-indigo-600",
  },
};

export default function EmptyState({ 
  type = "moods", 
  onAction,
  customTitle,
  customDescription,
  customActionText,
  showAction = true,
}) {
  const config = EMPTY_STATE_CONFIGS[type] || EMPTY_STATE_CONFIGS.moods;
  const Icon = config.icon;
  
  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const actionText = customActionText || config.actionText;

  const ActionButton = () => (
    <button
      onClick={onAction}
      className="btn btn-gradient px-6 py-3 inline-flex items-center gap-2"
      data-testid={`button-empty-${type}-action`}
    >
      <Plus className="w-5 h-5" aria-hidden="true" />
      {actionText}
    </button>
  );

  const ActionLink = () => (
    <Link
      href={config.actionHref}
      className="btn btn-gradient px-6 py-3 inline-flex items-center gap-2"
      data-testid={`link-empty-${type}-action`}
    >
      {actionText}
      <ArrowRight className="w-5 h-5" aria-hidden="true" />
    </Link>
  );

  return (
    <div className="card-elevated p-8 text-center animate-fade-in-up" data-testid={`empty-state-${type}`}>
      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
        <Icon className="w-10 h-10 text-white" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-display font-bold text-[var(--text)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {showAction && (
        config.actionHref ? <ActionLink /> : <ActionButton />
      )}
    </div>
  );
}

export function EmptyStateInline({ 
  icon: Icon = Smile, 
  message = "Nothing here yet",
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="empty-state-inline">
      <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[var(--text-muted)]" aria-hidden="true" />
      </div>
      <p className="text-[var(--text-muted)] mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium text-sm inline-flex items-center gap-1 transition-colors"
          data-testid="button-empty-inline-action"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          {actionText}
        </button>
      )}
    </div>
  );
}
