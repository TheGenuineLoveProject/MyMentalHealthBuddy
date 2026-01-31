import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, TrendingUp, Calendar, Sparkles, Sun, ArrowRight, Activity, BookOpen } from "lucide-react";
import EmotionLog from "../components/wellness/EmotionLog";
import JournalAI from "../components/wellness/JournalAI";
import WeatherMoodSync from "../components/wellness/WeatherMoodSync";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { useAuth } from "../context/AuthContext";

function WelcomeHeader({ user }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.name || user?.username || "Beautiful Soul";

  return (
    <div className="mb-8" data-testid="welcome-header">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
        {greeting()}, {displayName}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome back to your sacred space. How can we support your journey today?
      </p>
    </div>
  );
}

function QuickStats({ entries = [] }) {
  const thisWeek = entries.filter((e) => {
    const date = new Date(e.createdAt);
    const now = new Date();
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    return date >= weekAgo;
  });

  const positiveEmotions = ["Happy", "Grateful", "Calm", "Hopeful"];
  const positiveCount = thisWeek.filter((e) => positiveEmotions.includes(e.emotion)).length;

  const stats = [
    { label: "Check-ins this week", value: thisWeek.length, icon: Calendar, color: "var(--glp-sage)" },
    { label: "Positive moments", value: positiveCount, icon: Heart, color: "var(--glp-gold)" },
    { label: "Total reflections", value: entries.length, icon: BookOpen, color: "var(--glp-teal)" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8" data-testid="quick-stats">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
          data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${stat.color}20` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: "Journal", href: "/journal", icon: BookOpen, color: "var(--glp-teal)" },
    { label: "AI Chat", href: "/chat", icon: Sparkles, color: "var(--glp-gold)" },
    { label: "Tools", href: "/tools", icon: Activity, color: "var(--glp-sage)" },
    { label: "Wisdom", href: "/wisdom", icon: Sun, color: "var(--glp-sage-deep)" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8" data-testid="quick-actions">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <div
            className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md transition cursor-pointer group"
            data-testid={`action-${action.label.toLowerCase()}`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${action.color}20` }}
              >
                <action.icon className="w-4 h-4" style={{ color: action.color }} aria-hidden="true" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-200">{action.label}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function WellnessDashboard() {
  const { user } = useAuth();
  const [latestEntry, setLatestEntry] = useState(null);

  const { data: moodEntries = [] } = useQuery({
    queryKey: ["/api/mood"],
    staleTime: 30000,
  });

  const handleEntrySubmit = (entry) => {
    setLatestEntry(entry);
  };

  return (
    <>
      <SEO
        title="Wellness Dashboard | The Genuine Love Project"
        description="Your personal wellness dashboard for tracking emotions, journaling, and connecting with AI-powered support."
      />

      <div className="min-h-screen bg-[var(--glp-paper)] dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WelcomeHeader user={user} />
          
          <QuickStats entries={moodEntries} />
          
          <QuickActions />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <EmotionLog onEntrySubmit={handleEntrySubmit} />
              
              <JournalAI emotionEntry={latestEntry} />
            </div>

            <div className="space-y-6">
              <WeatherMoodSync />

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6" data-testid="progress-tracker">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--glp-sage)]" aria-hidden="true" />
                  Your Progress
                </h3>
                
                {moodEntries.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start logging your emotions to see your progress over time.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Weekly check-ins</span>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                          const hasEntry = moodEntries.some((e) => {
                            const entryDate = new Date(e.createdAt);
                            const today = new Date();
                            const checkDate = new Date(today);
                            checkDate.setDate(today.getDate() - (6 - day));
                            return entryDate.toDateString() === checkDate.toDateString();
                          });
                          return (
                            <div
                              key={day}
                              className={`w-6 h-6 rounded-md ${
                                hasEntry
                                  ? "bg-[var(--glp-sage)]"
                                  : "bg-gray-200 dark:bg-gray-600"
                              }`}
                              aria-label={hasEntry ? "Entry recorded" : "No entry"}
                              data-testid={`progress-day-${day}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    
                    <Link href="/analytics">
                      <span className="inline-flex items-center text-sm font-medium text-[var(--glp-teal)] hover:underline cursor-pointer" data-testid="link-analytics">
                        View detailed analytics
                        <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-[var(--glp-sage-10)] to-[var(--glp-teal-10)] rounded-2xl border border-[var(--glp-sage-20)] p-6" data-testid="daily-affirmation">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Daily Affirmation
                </h3>
                <p className="text-gray-700 dark:text-gray-200 italic leading-relaxed" data-testid="text-affirmation">
                  "You are worthy of love and healing. Every step you take on this journey matters."
                </p>
              </div>
            </div>
          </div>
        </div>

        <SafetyFooter />
      </div>
    </>
  );
}
