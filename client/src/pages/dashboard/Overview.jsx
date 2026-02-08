import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Sun, Moon, Heart, BookOpen, Sparkles, TrendingUp,
  Calendar, MessageSquare, Compass, Target, Flame, Zap,
  Star, Activity, ArrowRight, Check, RefreshCw, AlertCircle,
  Brain, Lightbulb, Shield, Sunrise, Crown
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import styles from "./Overview.module.css";
import WeeklyRecap from "@/components/dashboard/WeeklyRecap";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const QUICK_ACTIONS = [
  { label: "Daily Reflection", icon: Sunrise, href: "/reflect", color: "gold" },
  { label: "Start Journal", icon: BookOpen, href: "/journal", color: "sage" },
  { label: "Chat Therapy", icon: MessageSquare, href: "/chat", color: "blush" },
  { label: "Mood Check", icon: Heart, href: "/state-tracker", color: "teal" },
  { label: "Daily Wisdom", icon: Lightbulb, href: "/wisdom", color: "sage" }
];

const WELLNESS_INSIGHTS = [
  { icon: Brain, title: "Mindfulness Streak", description: "You've been consistent with your practice for 7 days!" },
  { icon: Shield, title: "Emotional Resilience", description: "Your coping skills have improved by 15% this month." },
  { icon: Flame, title: "Growth Momentum", description: "You've been showing up consistently. That's real progress." }
];

function getIconClass(color) {
  const map = {
    sage: styles.activityIconSage,
    gold: styles.activityIconGold,
    blush: styles.activityIconBlush,
    teal: styles.activityIconTeal
  };
  return map[color] || styles.activityIconSage;
}

function getStatIconClass(color) {
  const map = {
    sage: styles.statIconSage,
    gold: styles.statIconGold,
    blush: styles.statIconBlush,
    teal: styles.statIconTeal
  };
  return map[color] || styles.statIconSage;
}

function getQuickActionIconClass(color) {
  const map = {
    sage: styles.quickActionIconSage,
    gold: styles.quickActionIconGold,
    blush: styles.quickActionIconBlush,
    teal: styles.quickActionIconTeal
  };
  return map[color] || styles.quickActionIconSage;
}

function getActivityIcon(type) {
  const icons = {
    journal: BookOpen,
    reflection: Heart,
    wisdom: Sparkles,
    chat: MessageSquare,
    mood: Activity
  };
  return icons[type] || Activity;
}

function ActivityItem({ activity }) {
  const Icon = getActivityIcon(activity.type);
  
  return (
    <div className={styles.activityItem} data-testid={`activity-item-${activity.type}`}>
      <div className={`${styles.activityIcon} ${getIconClass(activity.color)}`}>
        <Icon className={styles.activityIconInner} />
      </div>
      <div className={styles.activityContent}>
        <p className={styles.activityTitle} data-testid={`activity-title-${activity.type}`}>{activity.title}</p>
        <p className={styles.activityMeta} data-testid={`activity-time-${activity.type}`}>{activity.time}</p>
      </div>
      <span className={styles.activityXp}>+{activity.xp} XP</span>
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  
  return (
    <div className={styles.statCard} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={styles.statHeader}>
        <div className={`${styles.statIconContainer} ${getStatIconClass(stat.color)}`}>
          <Icon className={styles.statIcon} />
        </div>
        {stat.trend && <span className={styles.statTrend}>{stat.trend}</span>}
      </div>
      <p className={styles.statValue} data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</p>
      <p className={styles.statLabel} data-testid={`stat-label-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>{stat.label}</p>
    </div>
  );
}

function TaskItem({ task, onComplete }) {
  return (
    <div className={styles.taskItem} data-testid={`task-${task.done ? 'done' : 'pending'}`}>
      <button
        className={task.done ? `${styles.taskCheckbox} ${styles.taskCheckboxDone}` : `${styles.taskCheckbox} ${styles.taskCheckboxPending}`}
        onClick={() => !task.done && onComplete && onComplete(task.id)}
        disabled={task.done}
        aria-label={task.done ? "Completed" : "Mark as complete"}
        data-testid={`button-complete-task-${task.id}`}
      >
        {task.done && <Check className={styles.taskCheckIcon} />}
      </button>
      <span 
        className={task.done ? `${styles.taskText} ${styles.taskTextDone}` : `${styles.taskText} ${styles.taskTextPending}`}
        data-testid={`task-text-${task.done ? 'done' : 'pending'}`}
      >
        {task.task}
      </span>
      <span className={styles.taskXp}>+{task.xp} XP</span>
    </div>
  );
}

function QuickActionButton({ action }) {
  const Icon = action.icon;
  
  return (
    <Link href={action.href} className={styles.quickActionButton} data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={`${styles.quickActionIcon} ${getQuickActionIconClass(action.color)}`}>
        <Icon className={styles.quickActionIconInner} />
      </div>
      <span className={styles.quickActionText}>{action.label}</span>
    </Link>
  );
}

function InsightItem({ insight }) {
  const Icon = insight.icon;
  
  return (
    <div className={styles.insightItem} data-testid="insight-item">
      <div className={styles.insightIcon}>
        <Icon className={styles.insightIconInner} />
      </div>
      <div className={styles.insightContent}>
        <p className={styles.insightTitle}>{insight.title}</p>
        <p className={styles.insightDescription}>{insight.description}</p>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { toast } = useToast();
  const { isPro } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("billing") === "success") {
      toast({
        title: "Welcome to Pro!",
        description: "Your subscription is active. All premium features are now unlocked.",
      });
      window.history.replaceState({}, "", "/dashboard");
      queryClient.invalidateQueries({ queryKey: ["/api/billing/subscription-status"] });
    }
  }, []);

  useSEO({
    title: "Your Dashboard - The Genuine Love Project",
    description: "Your personal wellness dashboard for reviewing mood patterns, journal entries, and reflection insights.",
    noIndex: true
  });

  const { data: userStats, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['/api/user/stats'],
    retry: false,
    staleTime: 60000
  });

  const { data: activityData } = useQuery({
    queryKey: ['/api/user/activity'],
    retry: false,
    staleTime: 60000
  });

  const { data: tasksData } = useQuery({
    queryKey: ['/api/user/tasks'],
    retry: false,
    staleTime: 60000
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const TimeIcon = hour < 18 ? Sun : Moon;

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const res = await apiRequest("POST", `/api/user/tasks/${taskId}/complete`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
    }
  });

  const stats = [
    { label: "Current Streak", value: userStats?.streak || "Start today!", icon: Flame, color: "gold" },
    { label: "Sessions", value: userStats?.sessions || "0", icon: Calendar, color: "sage" },
    { label: "Journal Entries", value: userStats?.insights || "0", icon: Sparkles, color: "blush" },
    { label: "Growth Score", value: userStats?.growthScore || "0%", icon: TrendingUp, color: "teal" }
  ];

  const todaysTasks = tasksData?.tasks || [];
  const recentActivity = activityData?.activities || [];
  const completedTasks = todaysTasks.filter(t => t.done).length;
  const totalTasks = todaysTasks.length || 1;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.loadingSpinner} />
        <p className={styles.loadingText} data-testid="text-loading">Loading your wellness dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <h2 className={styles.errorTitle} data-testid="text-error-title">Unable to load dashboard</h2>
        <p className={styles.errorText} data-testid="text-error-message">We're having trouble loading your wellness data. Please try again.</p>
        <button className={styles.retryButton} onClick={() => refetch()} data-testid="button-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <WellnessPageShell
      title="Dashboard Overview"
      subtitle="Your personal wellness hub"
      benefits={pickBenefits(["agency","clarity","growth"], 3)}
      clarity={{
        what: "Your personal wellness dashboard.",
        why: "To see your patterns and notice what's working.",
        who: "For you — review at your own pace.",
        when: "Check in whenever you want.",
        where: "Right here.",
        how: "Explore your stats, activities, and insights."
      }}
      examples={[]}
    >
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <div className={styles.greetingContainer}>
                <div className={styles.greetingIcon}>
                  <TimeIcon className={styles.greetingIconInner} />
                </div>
                <div>
                  <p className={styles.greetingText} data-testid="text-greeting">
                    {greeting}
                    {isPro && (
                      <span
                        className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-xs font-semibold align-middle"
                        style={{
                          background: "linear-gradient(135deg, #d4a843, #c49a38)",
                          color: "#1a3a2a",
                          boxShadow: "0 1px 3px rgba(196,154,56,0.3)",
                        }}
                        data-testid="badge-dashboard-pro"
                        aria-label="Pro member"
                      >
                        <Crown className="w-3 h-3" aria-hidden="true" />
                        Pro
                      </span>
                    )}
                  </p>
                  <h1 className={styles.pageTitle} data-testid="text-page-title">Your Wellness Dashboard</h1>
                </div>
              </div>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.xpBadge} data-testid="display-xp">
                <Zap className={styles.xpIcon} />
                <span className={styles.xpText}>{userStats?.xp ?? 0} XP</span>
              </div>
              <div className={styles.levelBadge} data-testid="display-level">
                <Star className={styles.levelIcon} />
                <span className={styles.levelText}>Level {userStats?.level ?? 1}</span>
              </div>
              <button 
                className={styles.refreshButton}
                onClick={() => refetch()} 
                data-testid="button-refresh-dashboard"
                disabled={isLoading || isRefetching}
              >
                <RefreshCw className={`${styles.refreshIcon} ${isRefetching ? styles.refreshIconSpinning : ''}`} />
              </button>
            </div>
          </div>
          <p className={styles.leadText}>A quiet place to check in with yourself, use your tools, and notice your progress.</p>
        </header>

        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Activity className={styles.cardHeaderIcon} />
              <h2 className={styles.cardTitle}>Recent Activity</h2>
            </div>
            <div className={styles.activityList}>
              {recentActivity.length === 0 ? (
                <p className={styles.emptyText} data-testid="text-no-activity">Nothing here yet — and that's okay. Whenever you're ready, your journal and mood tracker are good places to start.</p>
              ) : recentActivity.slice(0, 4).map((activity, i) => (
                <ActivityItem key={i} activity={activity} />
              ))}
            </div>
            <Link href="/analytics" className={styles.viewAllLink} data-testid="link-view-activity">
              View all activity <ArrowRight className={styles.viewAllIcon} />
            </Link>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Target className={styles.cardHeaderIcon} />
              <h2 className={styles.cardTitle}>Today's Focus</h2>
            </div>
            <div className={styles.taskList}>
              {todaysTasks.length === 0 ? (
                <p className={styles.emptyText} data-testid="text-no-tasks">Your daily quests are loading...</p>
              ) : todaysTasks.map((task, i) => (
                <TaskItem key={task.id || i} task={task} onComplete={(id) => completeTaskMutation.mutate(id)} />
              ))}
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
            </div>
            <p className={styles.progressText}>{completedTasks} of {totalTasks} completed</p>
          </div>
        </div>

        <WeeklyRecap className="mb-6" />

        <div className={styles.secondaryGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Compass className={styles.cardHeaderIcon} />
              <h2 className={styles.cardTitle}>Your Tools</h2>
            </div>
            <div className={styles.quickActionsGrid}>
              {QUICK_ACTIONS.map((action, i) => (
                <QuickActionButton key={i} action={action} />
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Sparkles className={styles.cardHeaderIcon} />
              <h2 className={styles.cardTitle}>Gentle Reminders</h2>
            </div>
            <div className={styles.insightsList}>
              {WELLNESS_INSIGHTS.map((insight, i) => (
                <InsightItem key={i} insight={insight} />
              ))}
            </div>
          </div>

          {!isPro && (
            <div
              className="mt-6 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4"
              style={{
                border: "1px solid var(--glp-sage-20, #d4ddd4)",
                background: "var(--glp-paper, #faf9f6)",
              }}
              data-testid="card-dashboard-upgrade"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--glp-gold-30, #f5e6c0)" }}
                >
                  <Crown className="w-4 h-4" style={{ color: "var(--glp-gold-dark, #a07d2e)" }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--glp-sage-deep, #1a3a2a)" }}>
                    Want more? Pro adds unlimited AI sessions and deeper insights.
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--glp-ink-50, #7a8a7a)" }}>
                    $12/month — cancel anytime, no questions asked.
                  </p>
                </div>
              </div>
              <Link
                href="/account/billing"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{
                  border: "1px solid var(--glp-gold, #d4a843)",
                  color: "var(--glp-gold-dark, #a07d2e)",
                }}
                data-testid="link-dashboard-upgrade"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
