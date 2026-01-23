import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, Heart, BookOpen, TrendingUp, Sparkles, 
  Calendar, Target, Flame, ArrowRight, Brain, Sun, Moon,
  MessageCircle, Activity, Award, Clock, CheckCircle2, Circle,
  Zap, BarChart3, Users, Star, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSEO } from "@/hooks/useSEO";

const QUICK_ACTIONS = [
  { icon: Heart, label: "Check-In", href: "/mood", color: "blush", desc: "How are you feeling?" },
  { icon: BookOpen, label: "Journal", href: "/journal", color: "sage", desc: "Reflect & write" },
  { icon: Brain, label: "AI Chat", href: "/chat", color: "teal", desc: "Talk with Luna" },
  { icon: Target, label: "Daily Ritual", href: "/ritual", color: "gold", desc: "Your practice" },
  { icon: Sparkles, label: "Affirmations", href: "/affirmations", color: "blush", desc: "Positive thoughts" },
  { icon: Activity, label: "Breathing", href: "/breathing", color: "sage", desc: "Calm your mind" }
];

const RECENT_ACTIVITY = [
  { type: "journal", text: "Completed morning reflection", time: "2 hours ago", icon: BookOpen },
  { type: "mood", text: "Logged feeling peaceful", time: "4 hours ago", icon: Heart },
  { type: "achievement", text: "Earned 7-day streak badge", time: "Yesterday", icon: Award },
  { type: "chat", text: "Had a supportive chat with Luna", time: "Yesterday", icon: MessageCircle },
  { type: "breathing", text: "Completed 5-min breathing exercise", time: "2 days ago", icon: Activity }
];

const WELLNESS_INSIGHTS = [
  { title: "Mood Trend", value: "↑ Improving", detail: "Your mood has been more positive this week", color: "sage" },
  { title: "Best Time", value: "Morning", detail: "You feel most energized in the morning", color: "gold" },
  { title: "Top Tool", value: "Journaling", detail: "Your most used wellness tool", color: "blush" }
];

function StatCard({ label, value, icon: Icon, color, trend }) {
  return (
    <div className="card-bordered text-center group hover:shadow-lg transition-all duration-300" data-testid={`stat-${label.toLowerCase().replace(' ', '-')}`}>
      <div className={`icon-container icon-lg icon-soft-${color} mx-auto mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-display-md text-teal">{value}</p>
      <p className="text-caption">{label}</p>
      {trend && (
        <p className="text-xs mt-1" style={{ color: trend.includes('+') ? 'var(--glp-sage)' : 'var(--glp-sage)' }}>
          {trend}
        </p>
      )}
    </div>
  );
}

function ActivityItem({ activity }) {
  const Icon = activity.icon;
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-sage-5 transition-colors">
      <div className="icon-container icon-sm icon-soft-sage flex-shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-medium truncate">{activity.text}</p>
        <p className="text-caption flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {activity.time}
        </p>
      </div>
    </div>
  );
}

function TodaysFocus({ tasks }) {
  const completed = tasks.filter(t => t.done).length;
  const progress = (completed / tasks.length) * 100;
  
  return (
    <div className="card-bordered">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heading-md text-teal flex items-center gap-2">
          <Calendar className="h-5 w-5" style={{ color: 'var(--glp-sage)' }} />
          Today's Focus
        </h2>
        <Link href="/ritual" className="text-body-sm flex items-center gap-1" style={{ color: 'var(--glp-sage-deep)' }}>
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-body-sm mb-2">
          <span>{completed} of {tasks.length} completed</span>
          <span className="font-medium" style={{ color: 'var(--glp-sage)' }}>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--glp-sage-10)' }}>
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'var(--glp-sage)' }}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map((item, i) => (
          <div 
            key={i} 
            className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
            style={item.done 
              ? { background: 'var(--glp-sage-10)' } 
              : { background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
          >
            {item.done ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--glp-sage)' }} />
            ) : (
              <Circle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--glp-sage-30)' }} />
            )}
            <span className={`text-body-sm flex-1 ${item.done ? 'line-through' : ''}`} style={item.done ? { color: 'var(--glp-sage)' } : {}}>
              {item.task}
            </span>
            {item.xp && !item.done && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--glp-gold-30)', color: 'var(--glp-gold-deep)' }}>
                +{item.xp} XP
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Overview() {
  useSEO({
    title: "Wellness Dashboard",
    description: "Your personal wellness dashboard for tracking your healing journey, celebrating progress, and nurturing emotional growth.",
    noIndex: true
  });

  const { data: userStats, isLoading, error, refetch } = useQuery({
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
    { label: "Day Streak", value: userStats?.streak || "7", icon: Flame, color: "gold", trend: "+2 this week" },
    { label: "Entries", value: userStats?.entries || "24", icon: BookOpen, color: "sage", trend: "+5 this week" },
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

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="icon-container icon-xl icon-gradient-sage">
                  <LayoutDashboard className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <TimeIcon className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
                    <span className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>{greeting}</span>
                  </div>
                  <h1 className="text-display-lg text-teal" data-testid="text-page-title">Your Wellness Dashboard</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl flex items-center gap-2" style={{ background: 'var(--glp-gold-30)' }} data-testid="display-xp">
                  <Zap className="h-4 w-4" style={{ color: 'var(--glp-gold-deep)' }} />
                  <span className="text-body-sm font-medium" style={{ color: 'var(--glp-gold-deep)' }}>
                    {userStats?.xp || 1250} XP
                  </span>
                </div>
                <div className="px-4 py-2 rounded-xl flex items-center gap-2" style={{ background: 'var(--glp-sage-10)' }} data-testid="display-level">
                  <Star className="h-4 w-4" style={{ color: 'var(--glp-sage)' }} />
                  <span className="text-body-sm font-medium">Level {userStats?.level || 5}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => refetch()} 
                  data-testid="button-refresh-dashboard"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <p className="text-lead max-w-2xl mt-2">Track your journey, celebrate your progress, and nurture your growth.</p>
          </header>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <TodaysFocus tasks={todaysTasks} />
            </div>

            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: 'var(--glp-sage)' }} />
                Recent Activity
              </h2>
              <div className="space-y-1">
                {recentActivity.slice(0, 4).map((activity, i) => (
                  <ActivityItem key={i} activity={activity} />
                ))}
              </div>
              <Link href="/analytics" className="mt-4 text-body-sm flex items-center justify-center gap-1 p-2 rounded-lg hover:bg-sage-5 transition-colors" style={{ color: 'var(--glp-sage-deep)' }}>
                View all activity <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 card-bordered">
              <h2 className="text-heading-md text-teal mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {QUICK_ACTIONS.map((action, i) => (
                  <Link 
                    key={i} 
                    href={action.href} 
                    className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md" 
                    style={{ background: 'var(--glp-sage-10)' }} 
                    data-testid={`action-${action.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className={`icon-container icon-md icon-soft-${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-body-sm font-medium block">{action.label}</span>
                      <span className="text-caption">{action.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: 'var(--glp-blush)' }} />
                Wellness Insights
              </h2>
              <div className="space-y-4">
                {WELLNESS_INSIGHTS.map((insight, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--glp-sage-10)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-caption">{insight.title}</span>
                      <span className="text-body-sm font-medium" style={{ color: `var(--glp-${insight.color})` }}>
                        {insight.value}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--glp-sage)' }}>{insight.detail}</p>
                  </div>
                ))}
              </div>
              <Link href="/analytics" className="mt-4 text-body-sm flex items-center justify-center gap-1 p-2 rounded-lg hover:bg-sage-5 transition-colors" style={{ color: 'var(--glp-sage-deep)' }}>
                View full analytics <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="card-glass text-center py-8">
            <div className="icon-container icon-xl icon-gradient-gold mx-auto mb-4">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="text-heading-lg text-teal mb-2">Ready to deepen your practice?</h3>
            <p className="text-lead mb-6 max-w-lg mx-auto">Explore our AI-powered tools designed to support your healing journey.</p>
            <Link href="/tools" className="inline-block">
              <Button className="btn-premium" data-testid="button-explore-tools">
                Explore Wellness Tools <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
