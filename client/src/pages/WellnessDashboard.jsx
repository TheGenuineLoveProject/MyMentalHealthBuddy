import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, TrendingUp, Calendar, Sparkles, Sun, ArrowRight, Activity, BookOpen, Flame, Lightbulb } from "lucide-react";
import EmotionLog from "../components/wellness/EmotionLog";
import JournalAI from "../components/wellness/JournalAI";
import WeatherMoodSync from "../components/wellness/WeatherMoodSync";
import MoodCalendar from "../components/wellness/MoodCalendar";
import HealingGraph from "../components/wellness/HealingGraph";
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

function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  const uniqueDays = new Set();
  entries.forEach(e => {
    const date = new Date(e.createdAt);
    date.setHours(0, 0, 0, 0);
    uniqueDays.add(date.getTime());
  });
  
  let streak = 0;
  let checkDate = todayTime;
  
  if (!uniqueDays.has(checkDate)) {
    checkDate = todayTime - oneDayMs;
  }
  
  while (uniqueDays.has(checkDate)) {
    streak++;
    checkDate -= oneDayMs;
  }
  
  return streak;
}

const QUICK_MOODS = [
  { id: "great", emoji: "😊", label: "Great", score: 5 },
  { id: "good", emoji: "🙂", label: "Good", score: 4 },
  { id: "okay", emoji: "😐", label: "Okay", score: 3 },
  { id: "low", emoji: "😔", label: "Low", score: 2 },
  { id: "struggling", emoji: "😢", label: "Struggling", score: 1 },
];

function QuickMoodLog({ onLog }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: async (mood) => {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rating: mood.id,
          score: mood.score,
          emotion: mood.label,
        }),
      });
      if (!response.ok) throw new Error("Failed to save mood");
      return response.json();
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
      onLog?.();
      setTimeout(() => {
        setSaved(false);
        setSelected(null);
      }, 2000);
    },
    onError: (err) => {
      console.error("Failed to log mood:", err);
      setSelected(null);
    },
  });

  const handleQuickLog = (mood) => {
    setSelected(mood.id);
    mutation.mutate(mood);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm mb-6"
      data-testid="quick-mood-log"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">How are you feeling right now?</h3>
        {saved && (
          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Logged!
          </span>
        )}
      </div>
      <div className="flex gap-2 justify-between">
        {QUICK_MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleQuickLog(mood)}
            disabled={mutation.isPending}
            className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
              selected === mood.id
                ? "bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-600 scale-105"
                : "bg-gray-50 dark:bg-gray-700 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            }`}
            aria-label={`Log mood as ${mood.label}`}
            data-testid={`quick-mood-${mood.id}`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DailyWellnessTip() {
  const tips = [
    { tip: "Take 3 deep breaths before your first meal today.", category: "Breathing" },
    { tip: "Write down one thing you're grateful for right now.", category: "Gratitude" },
    { tip: "Step outside for 5 minutes and notice nature around you.", category: "Grounding" },
    { tip: "Send a kind message to someone you care about.", category: "Connection" },
    { tip: "Place your hand on your heart and say 'I am enough.'", category: "Affirmation" },
    { tip: "Drink a full glass of water mindfully.", category: "Presence" },
    { tip: "Notice 5 things you can see, 4 you can touch, 3 you can hear.", category: "Grounding" },
    { tip: "Take a 2-minute stretch break and breathe deeply.", category: "Body" },
    { tip: "Write one sentence about how you're feeling right now.", category: "Journaling" },
    { tip: "Close your eyes and listen to the sounds around you for 1 minute.", category: "Mindfulness" },
  ];
  
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % tips.length;
  const todaysTip = tips[dayIndex];

  return (
    <div 
      className="bg-gradient-to-br from-teal-50 to-sage/10 dark:from-teal-900/20 dark:to-sage/5 rounded-xl p-4 border border-teal-200/50 dark:border-teal-700/30"
      data-testid="daily-wellness-tip"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">Today's Tip</span>
            <span className="text-xs text-teal-500/70 dark:text-teal-400/50">• {todaysTip.category}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{todaysTip.tip}</p>
        </div>
      </div>
    </div>
  );
}

function QuickStats({ entries = [] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeek = entries.filter((e) => {
      const date = new Date(e.createdAt);
      return date >= weekAgo;
    });

    const positiveEmotions = ["Happy", "Grateful", "Calm", "Hopeful"];
    const positiveCount = thisWeek.filter((e) => positiveEmotions.includes(e.emotion)).length;
    const streak = calculateStreak(entries);
    
    return { thisWeek, positiveCount, streak };
  }, [entries]);

  const { thisWeek, positiveCount, streak } = stats;

  const statsCards = [
    { label: "Day streak", value: streak, icon: Flame, color: "#f59e0b", isStreak: true },
    { label: "This week", value: thisWeek.length, icon: Calendar, color: "var(--glp-sage)" },
    { label: "Positive", value: positiveCount, icon: Heart, color: "var(--glp-gold)" },
    { label: "Total", value: entries.length, icon: BookOpen, color: "var(--glp-teal)" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="quick-stats">
      {statsCards.map((stat, idx) => (
        <div
          key={idx}
          className={`rounded-xl p-4 border shadow-sm transition-all hover:shadow-md ${
            stat.isStreak 
              ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-700/30' 
              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
          }`}
          data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.isStreak ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-sm' : ''
              }`}
              style={stat.isStreak ? {} : { background: `${stat.color}20` }}
            >
              <stat.icon 
                className={`w-5 h-5 ${stat.isStreak ? 'text-white' : ''}`} 
                style={stat.isStreak ? {} : { color: stat.color }} 
                aria-hidden="true" 
              />
            </div>
            <div>
              <p className={`text-2xl font-bold ${stat.isStreak ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                {stat.value}
              </p>
              <p className={`text-xs ${stat.isStreak ? 'text-amber-600/80 dark:text-amber-400/80' : 'text-gray-500 dark:text-gray-400'}`}>
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: "Journal", href: "/journal", icon: BookOpen, color: "var(--glp-teal)", desc: "Reflect & write" },
    { label: "AI Chat", href: "/chat", icon: Sparkles, color: "var(--glp-gold)", desc: "Get support" },
    { label: "Breathe", href: "/breathing", icon: Activity, color: "var(--glp-sage)", desc: "Calm your mind" },
    { label: "Affirmations", href: "/affirmations", icon: Heart, color: "var(--glp-sage-deep)", desc: "Self-love" },
    { label: "Grounding", href: "/grounding", icon: Sun, color: "var(--glp-teal)", desc: "Feel present" },
    { label: "Mood Track", href: "/mood", icon: TrendingUp, color: "var(--glp-gold)", desc: "How are you?" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8" data-testid="quick-actions">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <div
            className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-sage/30 transition-all duration-300 cursor-pointer group"
            data-testid={`action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                style={{ background: `${action.color}20` }}
              >
                <action.icon className="w-5 h-5" style={{ color: action.color }} aria-hidden="true" />
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200 block text-sm">{action.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function WellnessDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [latestEntry, setLatestEntry] = useState(null);

  const { data: moodEntries = [] } = useQuery({
    queryKey: ["/api/mood"],
    staleTime: 30000,
  });

  const handleEntrySubmit = (entry) => {
    setLatestEntry(entry);
  };

  const handleQuickMoodLog = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
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
          
          <QuickMoodLog onLog={handleQuickMoodLog} />
          
          <DailyWellnessTip />
          
          <div className="mb-6" />
          
          <QuickActions />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <EmotionLog onEntrySubmit={handleEntrySubmit} />
              
              <JournalAI emotionEntry={latestEntry} />
            </div>

            <div className="space-y-6">
              <WeatherMoodSync />
              <MoodCalendar />

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

          <div className="mt-8">
            <h2 className="font-serif text-2xl font-bold text-deepTeal dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-metallicGold" aria-hidden="true" />
              Your Healing Journey
            </h2>
            <HealingGraph />
          </div>
        </div>

        <SafetyFooter />
      </div>
    </>
  );
}
