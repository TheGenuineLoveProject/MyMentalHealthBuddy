import { Link } from "wouter";
import { 
  Lightbulb, ArrowLeft, TrendingUp, Heart, Brain, Sparkles,
  Calendar, BarChart3, PieChart, Activity, Target, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const WEEKLY_INSIGHTS = [
  {
    icon: Heart,
    title: "Emotional Patterns",
    insight: "Your mood has been most positive in the mornings. Consider scheduling important tasks during this time.",
    trend: "+15%",
    color: "blush"
  },
  {
    icon: Brain,
    title: "Thought Patterns",
    insight: "You've shown increased self-compassion in your journal entries this week.",
    trend: "+23%",
    color: "teal"
  },
  {
    icon: Activity,
    title: "Engagement Level",
    insight: "Your daily check-in consistency has improved. Keep up the great work!",
    trend: "+8%",
    color: "sage"
  }
];

const MOOD_DATA = [
  { day: "Mon", value: 75 },
  { day: "Tue", value: 82 },
  { day: "Wed", value: 68 },
  { day: "Thu", value: 85 },
  { day: "Fri", value: 90 },
  { day: "Sat", value: 88 },
  { day: "Sun", value: 92 }
];

const ACHIEVEMENTS = [
  { icon: Award, label: "7-Day Streak", earned: true },
  { icon: Target, label: "First Goal Met", earned: true },
  { icon: Sparkles, label: "Insight Seeker", earned: true },
  { icon: Heart, label: "Self-Care Champion", earned: false }
];

export default function Insights() {
  useSEO({
    title: "Wellness Insights",
    description: "Personalized insights into your emotional patterns, thought patterns, and wellness journey progress.",
    noIndex: true
  });

  return (
  <WellnessPageShell
    title="Insights"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen v28-paper-bg">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-gold">
                <Lightbulb className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Your Insights</h1>
                <p className="text-lead">Discover patterns and celebrate your growth</p>
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {WEEKLY_INSIGHTS.map((insight, i) => (
              <div key={i} className="card-bordered" data-testid={`insight-${i}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`icon-container icon-lg icon-soft-${insight.color}`}>
                    <insight.icon className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[var(--sage-100)] text-[var(--sage-700)] text-caption font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {insight.trend}
                  </span>
                </div>
                <h3 className="text-heading-sm text-teal mb-2">{insight.title}</h3>
                <p className="text-body-sm text-[var(--sage-600)]">{insight.insight}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="card-bordered">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading-md text-teal flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--sage-500)]" />
                  Weekly Mood Trend
                </h2>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--sage-400)]" />
                  <span className="text-caption">Last 7 days</span>
                </div>
              </div>
              <div className="flex items-end justify-between h-40 gap-2">
                {MOOD_DATA.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-[var(--sage-400)] to-[var(--sage-300)] rounded-t-lg transition-all hover:from-[var(--teal-500)] hover:to-[var(--teal-400)]"
                      style={{ height: `${day.value}%` }}
                    />
                    <span className="text-caption">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-bordered">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading-md text-teal flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[var(--blush-500)]" />
                  Feeling Distribution
                </h2>
              </div>
              <div className="flex items-center justify-center h-40">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--sage-200)" strokeWidth="20" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--sage-500)" strokeWidth="20" strokeDasharray="126 251" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--teal-500)" strokeWidth="20" strokeDasharray="75 251" strokeDashoffset="-126" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--gold-500)" strokeWidth="20" strokeDasharray="50 251" strokeDashoffset="-201" />
                  </svg>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-2 text-body-sm">
                    <div className="w-3 h-3 rounded-full bg-[var(--sage-500)]" />
                    Peaceful (50%)
                  </div>
                  <div className="flex items-center gap-2 text-body-sm">
                    <div className="w-3 h-3 rounded-full bg-[var(--teal-500)]" />
                    Hopeful (30%)
                  </div>
                  <div className="flex items-center gap-2 text-body-sm">
                    <div className="w-3 h-3 rounded-full bg-[var(--gold-500)]" />
                    Grateful (20%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-bordered">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-md text-teal flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--gold-500)]" />
                Your Achievements
              </h2>
              <Button variant="outline" className="btn-secondary-premium" data-testid="button-view-all-achievements">
                View All
              </Button>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((achievement, i) => (
                <div 
                  key={i} 
                  className={`text-center p-4 rounded-xl border transition ${
                    achievement.earned 
                      ? 'bg-[var(--gold-50)] border-[var(--gold-300)]' 
                      : 'bg-[var(--sage-50)] border-[var(--sage-200)] opacity-50'
                  }`}
                  data-testid={`achievement-${i}`}
                >
                  <div className={`icon-container icon-lg mx-auto mb-3 ${achievement.earned ? 'icon-soft-gold' : 'icon-soft-sage'}`}>
                    <achievement.icon className="h-6 w-6" />
                  </div>
                  <p className="text-body-sm font-medium">{achievement.label}</p>
                  {achievement.earned && (
                    <span className="text-caption text-[var(--gold-600)]">Earned!</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
