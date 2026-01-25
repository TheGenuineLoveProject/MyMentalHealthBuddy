import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Sun, Moon, Heart, BookOpen, Sparkles, TrendingUp,
  Calendar, MessageSquare, Compass, Target, Flame, Zap,
  Star, Activity, ArrowRight, Check, RefreshCw, AlertCircle,
  Brain, Lightbulb, Shield
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import styles from "./Overview.module.css";
import WeeklyRecap from "@/components/dashboard/WeeklyRecap";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const RECENT_ACTIVITY = [
  { type: "journal", title: "Morning Gratitude", time: "2 hours ago", xp: 15, color: "sage" },
  { type: "reflection", title: "Self-Compassion Check-in", time: "4 hours ago", xp: 10, color: "blush" },
  { type: "wisdom", title: "Daily Wisdom Reading", time: "Yesterday", xp: 20, color: "gold" },
  { type: "chat", title: "AI Therapy Session", time: "Yesterday", xp: 25, color: "sage" }
];

const QUICK_ACTIONS = [
  { label: "Start Journal", icon: BookOpen, href: "/journal", color: "sage" },
  { label: "Chat Therapy", icon: MessageSquare, href: "/chat", color: "gold" },
  { label: "Daily Wisdom", icon: Lightbulb, href: "/wisdom", color: "blush" },
  { label: "Mood Check", icon: Heart, href: "/state-tracker", color: "teal" }
];

const WELLNESS_INSIGHTS = [
  { icon: Brain, title: "Mindfulness Streak", description: "You've been consistent with your practice for 7 days!" },
  { icon: Shield, title: "Emotional Resilience", description: "Your coping skills have improved by 15% this month." },
  { icon: Flame, title: "Growth Momentum", description: "You're making steady progress on your healing journey." }
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

function TaskItem({ task }) {
  return (
    <div className={styles.taskItem} data-testid={`task-${task.done ? 'done' : 'pending'}`}>
      <div className={task.done ? `${styles.taskCheckbox} ${styles.taskCheckboxDone}` : `${styles.taskCheckbox} ${styles.taskCheckboxPending}`}>
        {task.done && <Check className={styles.taskCheckIcon} />}
      </div>
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
  useSEO({
    title: "Your Dashboard - The Genuine Love Project",
    description: "Your personal wellness dashboard for tracking your healing journey, celebrating progress, and nurturing emotional growth.",
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

  const stats = [
    { label: "Current Streak", value: userStats?.streak || "7 days", icon: Flame, color: "gold" },
    { label: "Sessions", value: userStats?.sessions || "24", icon: Calendar, color: "sage" },
    { label: "Insights", value: userStats?.insights || "12", icon: Sparkles, color: "blush" },
    { label: "Growth Score", value: userStats?.growthScore || "78%", icon: TrendingUp, color: "teal", trend: "↑ 4%" }
  ];

  const todaysTasks = tasksData?.tasks || [
    { task: "Morning gratitude reflection", done: true, xp: 10 },
    { task: "10-minute mindfulness practice", done: true, xp: 15 },
    { task: "Journal your afternoon thoughts", done: false, xp: 10 },
    { task: "Evening self-compassion check-in", done: false, xp: 10 }
  ];

  const recentActivity = activityData?.activities || RECENT_ACTIVITY;
  const completedTasks = todaysTasks.filter(t => t.done).length;
  const totalTasks = todaysTasks.length;
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
        why: "To track your healing journey and celebrate progress.",
        who: "For you and your wellness goals.",
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
                  <p className={styles.greetingText} data-testid="text-greeting">{greeting}</p>
                  <h1 className={styles.pageTitle} data-testid="text-page-title">Your Wellness Dashboard</h1>
                </div>
              </div>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.xpBadge} data-testid="display-xp">
                <Zap className={styles.xpIcon} />
                <span className={styles.xpText}>{userStats?.xp || 1250} XP</span>
              </div>
              <div className={styles.levelBadge} data-testid="display-level">
                <Star className={styles.levelIcon} />
                <span className={styles.levelText}>Level {userStats?.level || 5}</span>
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
          <p className={styles.leadText}>Track your journey, celebrate your progress, and nurture your growth.</p>
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
              {recentActivity.slice(0, 4).map((activity, i) => (
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
              {todaysTasks.map((task, i) => (
                <TaskItem key={i} task={task} />
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
              <h2 className={styles.cardTitle}>Quick Actions</h2>
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
              <h2 className={styles.cardTitle}>Wellness Insights</h2>
            </div>
            <div className={styles.insightsList}>
              {WELLNESS_INSIGHTS.map((insight, i) => (
                <InsightItem key={i} insight={insight} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
