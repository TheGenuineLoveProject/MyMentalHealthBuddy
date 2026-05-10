import { Link } from "wouter";
import { Smile, BookOpen, MessageCircle, BarChart3, Plus, ArrowRight, Heart } from "lucide-react";
import { pickSlot } from "../content/microcopy/wellnessMicrocopy";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";

const EMPTY_STATE_CONFIGS = {
  moods: {
    icon: Smile,
    title: "No mood entries yet",
    description: "Start tracking your emotional well-being by logging your first mood. It only takes a moment.",
    actionText: "Log Your First Mood",
    actionHref: null,
    variant: "sage",
  },
  journals: {
    icon: BookOpen,
    title: "Your journal is waiting",
    description: "Express your thoughts and feelings by writing your first journal entry. It's a great way to reflect and grow.",
    actionText: "Write First Entry",
    actionHref: null,
    variant: "teal",
  },
  chat: {
    icon: MessageCircle,
    title: "Start a conversation",
    description: "Your AI wellness companion is here to listen. Share what's on your mind and get supportive guidance.",
    actionText: "Begin Chat",
    actionHref: null,
    variant: "teal",
  },
  analytics: {
    icon: BarChart3,
    title: "No data to analyze yet",
    description: "Start logging moods and journal entries to see patterns over time.",
    actionText: "Log a Mood",
    actionHref: "/mood",
    variant: "sage",
  },
  default: {
    icon: Heart,
    title: "Nothing here yet",
    description: "This is where your content will appear. You can start whenever you're ready.",
    actionText: "Get Started",
    actionHref: "/dashboard",
    variant: "teal",
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
  const config = EMPTY_STATE_CONFIGS[type] || EMPTY_STATE_CONFIGS.default;
  const Icon = config.icon;
  
  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const actionText = customActionText || config.actionText;

  const iconContainerClass = config.variant === "sage" 
    ? "icon-container icon-gradient-sage" 
    : "icon-container icon-gradient-teal";

  const ActionButton = () => (
    <button
      onClick={onAction}
      className="btn-premium px-6 py-3 inline-flex items-center gap-2"
      data-testid={`button-empty-${type}-action`}
    >
      <Plus className="w-5 h-5" aria-hidden="true" />
      {actionText}
    </button>
  );

  const ActionLink = () => (
    <Link
      href={config.actionHref}
      className="btn-premium px-6 py-3 inline-flex items-center gap-2"
      data-testid={`link-empty-${type}-action`}
    >
      {actionText}
      <ArrowRight className="w-5 h-5" aria-hidden="true" />
    </Link>
  );

  return (
    <div className="surface-card-elevated p-8 text-center animate-fade-in-up" data-testid={`empty-state-${type}`}>
      {/* Lumi (hugging pose, gentle purple) replaces the previous lucide-icon
          slot per Avatar Uniformity v4.2 spec. The original Icon is kept
          imported for EmptyStateInline below. */}
      <div className="mx-auto mb-6 flex items-center justify-center" style={{ width: 128, height: 128 }}>
        <BuddyAvatar
          state="sad"
          colorMode="purple"
          pose="hugging"
          size="lg"
          data-testid={`empty-state-${type}-buddy`}
        />
      </div>
      <h3 className="text-xl font-display font-semibold text-[var(--glp-primary)] mb-3">
        {title}
      </h3>
      <p className="text-[var(--text-2)] max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      <p className="text-sm text-[var(--text-2)] mb-6">
        {pickSlot('encouragement', 'beginner', type)}
      </p>
      {showAction && (
        config.actionHref ? <ActionLink /> : <ActionButton />
      )}
    </div>
  );
}

export function EmptyStateInline({ 
  icon: Icon = Smile, 
  message,
  actionText,
  onAction,
  seed = 'inline',
}) {
  const displayMessage = message || pickSlot('emptyStates', 'beginner', seed);
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="empty-state-inline">
      <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[var(--text-2)]" aria-hidden="true" />
      </div>
      <p className="text-[var(--text-2)] mb-4">{displayMessage}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-[var(--glp-primary)] hover:text-[var(--glp-sage)] font-medium text-sm inline-flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
          data-testid="button-empty-inline-action"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          {actionText}
        </button>
      )}
    </div>
  );
}
