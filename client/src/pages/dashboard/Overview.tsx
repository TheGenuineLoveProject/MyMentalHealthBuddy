import { Link } from "wouter";
import { 
  LayoutDashboard, Heart, BookOpen, TrendingUp, Sparkles, 
  Calendar, Target, Flame, ArrowRight, Brain, Sun, Moon
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const QUICK_ACTIONS = [
  { icon: Heart, label: "Check-In", href: "/mood-tracker", color: "blush" },
  { icon: BookOpen, label: "Journal", href: "/journal", color: "sage" },
  { icon: Brain, label: "AI Chat", href: "/chat", color: "teal" },
  { icon: Target, label: "Daily Goals", href: "/daily-ritual", color: "gold" }
];

const STATS = [
  { label: "Day Streak", value: "12", icon: Flame, color: "gold" },
  { label: "Entries", value: "48", icon: BookOpen, color: "sage" },
  { label: "Insights", value: "23", icon: Sparkles, color: "blush" },
  { label: "Growth Score", value: "87%", icon: TrendingUp, color: "teal" }
];

export default function Overview() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const TimeIcon = hour < 18 ? Sun : Moon;

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="icon-container icon-xl icon-gradient-sage">
                <LayoutDashboard className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <TimeIcon className="h-5 w-5 text-[var(--gold-500)]" />
                  <span className="text-body-sm text-[var(--sage-500)]">{greeting}</span>
                </div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Your Wellness Dashboard</h1>
              </div>
            </div>
            <p className="text-lead max-w-2xl">Track your journey, celebrate your progress, and nurture your growth.</p>
          </header>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => (
              <div key={i} className="card-bordered text-center" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                <div className={`icon-container icon-lg icon-soft-${stat.color} mx-auto mb-3`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-display-md text-teal">{stat.value}</p>
                <p className="text-caption">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 card-bordered">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading-md text-teal flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--sage-500)]" />
                  Today's Focus
                </h2>
                <Link href="/daily-ritual">
                  <a className="text-body-sm text-[var(--teal-600)] hover:text-[var(--teal-700)] flex items-center gap-1">
                    View all <ArrowRight className="h-4 w-4" />
                  </a>
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  { task: "Morning gratitude reflection", done: true },
                  { task: "10-minute mindfulness practice", done: true },
                  { task: "Journal your afternoon thoughts", done: false },
                  { task: "Evening self-compassion check-in", done: false }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${item.done ? 'bg-[var(--sage-50)]' : 'bg-white border border-[var(--sage-200)]'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-[var(--sage-500)] border-[var(--sage-500)]' : 'border-[var(--sage-300)]'}`}>
                      {item.done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-body-sm ${item.done ? 'line-through text-[var(--sage-400)]' : ''}`}>{item.task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--gold-500)]" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((action, i) => (
                  <Link key={i} href={action.href}>
                    <a className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--sage-50)] hover:bg-[var(--sage-100)] transition" data-testid={`action-${action.label.toLowerCase()}`}>
                      <div className={`icon-container icon-md icon-soft-${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-body-sm font-medium">{action.label}</span>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="card-glass text-center py-8">
            <div className="icon-container icon-xl icon-gradient-gold mx-auto mb-4">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="text-heading-lg text-teal mb-2">Ready to deepen your practice?</h3>
            <p className="text-lead mb-6 max-w-lg mx-auto">Explore our AI-powered tools designed to support your healing journey.</p>
            <Link href="/tools">
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
