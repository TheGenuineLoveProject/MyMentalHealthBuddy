import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  MessageCircle, Heart, BookOpen, TrendingUp, Calendar,
  Sparkles, ArrowRight, Activity
} from "lucide-react";
import type { SelectMoodEntry, SelectJournal } from "@shared/schema";

export function DashboardPage() {
  const { data: moods = [] } = useQuery<SelectMoodEntry[]>({
    queryKey: ["/api/moods"],
  });

  const { data: journals = [] } = useQuery<SelectJournal[]>({
    queryKey: ["/api/journals"],
  });

  const { data: analytics } = useQuery<{
    totalEntries: number;
    averageIntensity: number;
    trends: { weeklyAverage: number; improving: boolean };
  }>({
    queryKey: ["/api/moods/analytics"]
  });

  // Calculate recent activity
  const recentMoods = moods.slice(0, 3);
  const recentJournals = journals.slice(0, 3);
  const totalActivities = moods.length + journals.length;

  // Get motivational message based on data
  const getMotivationalMessage = () => {
    if (totalActivities === 0) {
      return "Welcome! Start your mental health journey today.";
    }
    if (analytics?.trends.improving) {
      return "You're doing amazing! Your mood is trending upward. 🌟";
    }
    if (totalActivities > 10) {
      return "Great consistency! Keep tracking your journey. 💪";
    }
    return "You're making progress. Every step counts! ✨";
  };

  const quickActions = [
    {
      title: "Start Chat",
      description: "Talk with your AI companion",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-blue-500 hover:bg-blue-600",
      testId: "quick-action-chat"
    },
    {
      title: "Track Mood",
      description: "Log how you're feeling",
      icon: Heart,
      href: "/mood",
      color: "bg-pink-500 hover:bg-pink-600",
      testId: "quick-action-mood"
    },
    {
      title: "Write Journal",
      description: "Express your thoughts",
      icon: BookOpen,
      href: "/journal",
      color: "bg-purple-500 hover:bg-purple-600",
      testId: "quick-action-journal"
    }
  ];

  const stats = [
    {
      label: "Mood Entries",
      value: moods.length,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      label: "Journal Entries",
      value: journals.length,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      label: "Total Activities",
      value: totalActivities,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Avg Mood Intensity",
      value: analytics?.averageIntensity !== undefined && analytics?.averageIntensity !== null
        ? `${analytics.averageIntensity.toFixed(1)}/10`
        : "N/A",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900" data-testid="dashboard-title">
          Welcome to MyMentalHealthBuddy
        </h1>
        <p className="text-xl text-gray-600 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={24} />
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.color} size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <div
                  className={`${action.color} text-white rounded-lg p-6 cursor-pointer transition transform hover:scale-105 shadow-lg`}
                  data-testid={action.testId}
                >
                  <Icon size={32} className="mb-3" />
                  <h3 className="text-xl font-bold mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{action.description}</p>
                  <div className="flex items-center text-sm font-medium">
                    Get Started <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Moods */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="text-pink-500" size={24} />
              Recent Moods
            </h2>
            <Link href="/mood">
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                View All →
              </span>
            </Link>
          </div>
          {recentMoods.length === 0 ? (
            <p className="text-gray-500 text-center py-8" data-testid="no-recent-moods">
              No mood entries yet. Start tracking your mood!
            </p>
          ) : (
            <div className="space-y-3">
              {recentMoods.map((mood) => (
                <div
                  key={mood.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition"
                  data-testid={`recent-mood-${mood.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{mood.mood}</p>
                      <p className="text-sm text-gray-600">Intensity: {mood.intensity}/10</p>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(mood.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {mood.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-1">{mood.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Journals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="text-purple-500" size={24} />
              Recent Journals
            </h2>
            <Link href="/journal">
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                View All →
              </span>
            </Link>
          </div>
          {recentJournals.length === 0 ? (
            <p className="text-gray-500 text-center py-8" data-testid="no-recent-journals">
              No journal entries yet. Start journaling!
            </p>
          ) : (
            <div className="space-y-3">
              {recentJournals.map((journal) => (
                <div
                  key={journal.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition"
                  data-testid={`recent-journal-${journal.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-900">
                      {journal.title || "Untitled Entry"}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(journal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{journal.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={24} />
          Daily Mental Health Tips
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Take a few minutes each day to check in with your feelings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Practice deep breathing when you feel stressed or anxious</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Connect with supportive friends or family members regularly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Remember: It's okay to not be okay. Reach out for help when you need it</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
