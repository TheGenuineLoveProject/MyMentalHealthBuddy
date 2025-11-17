import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Heart, BookOpen, TrendingUp, Calendar,
  Sparkles, Activity
} from "lucide-react";
import type { SelectMoodEntry, SelectJournal } from "@shared/schema";
import { QuickActions } from "@/components/QuickActions";
import { Skeleton, SkeletonStats, SkeletonList, SkeletonDashboard } from "@/components/LoadingStates";
import { AtmosphericBackground, DecorativeWave } from "@/components/atmospheric";
import { UnauthenticatedBanner } from "@/components/UnauthenticatedBanner";

// Type guard to check if error has status property
interface HttpError extends Error {
  status?: number;
}

export function DashboardPage() {
  const { data: moods = [], isLoading: moodsLoading, error: moodsError } = useQuery<SelectMoodEntry[]>({
    queryKey: ["/api/moods"],
    retry: (failureCount, error) => {
      // Don't retry on 401 Unauthorized - user needs to login
      if ((error as HttpError)?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: journals = [], isLoading: journalsLoading, error: journalsError } = useQuery<SelectJournal[]>({
    queryKey: ["/api/journals"],
    retry: (failureCount, error) => {
      // Don't retry on 401 Unauthorized - user needs to login
      if ((error as HttpError)?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery<{
    totalEntries: number;
    averageIntensity: number;
    trends: { weeklyAverage: number; improving: boolean };
  }>({
    queryKey: ["/api/moods/analytics"],
    retry: (failureCount, error) => {
      // Don't retry on 401 Unauthorized - user needs to login
      if ((error as HttpError)?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Check if user is unauthenticated (401 HTTP status code)
  const isUnauthorized = 
    (moodsError as HttpError)?.status === 401 || 
    (journalsError as HttpError)?.status === 401 || 
    (analyticsError as HttpError)?.status === 401;

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

  // Show authentication banner for unauthenticated users
  if (isUnauthorized) {
    return (
      <>
        <AtmosphericBackground scene="serenity" intensity="moderate" showParticles={true} />
        <DecorativeWave position="top" scene="serenity" />
        
        <div 
          className="max-w-7xl mx-auto p-6 relative z-10" 
          style={{ 
            minHeight: 'calc(100vh - 64px - 48px)',
            contain: 'layout strict',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UnauthenticatedBanner 
            message="Sign in to track your moods, journal entries, and view your mental health analytics"
          />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Atmospheric Background for Immersive Experience */}
      <AtmosphericBackground scene="serenity" intensity="moderate" showParticles={true} />
      <DecorativeWave position="top" scene="serenity" />
      
      <div 
        className="max-w-7xl mx-auto p-6 particles-bg animate-fade-in relative z-10"
        style={{
          minHeight: 'calc(100vh - 64px)',
          contain: 'layout',
          willChange: 'auto'
        }}
      >
        {/* Welcome Header - Fixed height to prevent CLS */}
      <div className="mb-8 h-[120px] animate-slide-up" style={{ contain: 'layout' }}>
        <h1 className="heading-lg mb-2 text-gray-900 leading-tight text-shadow-soft" data-testid="dashboard-title" style={{ height: '48px', minHeight: '48px', maxHeight: '48px', overflow: 'hidden' }}>
          Welcome to MyMentalHealthBuddy
        </h1>
        <div className="flex items-center gap-2" style={{ contain: 'layout strict', height: '40px', minHeight: '40px', maxHeight: '40px', overflow: 'hidden' }}>
          <Sparkles className="text-yellow-500 flex-shrink-0 animate-subtle-pulse" size={24} />
          <p className="text-xl text-gray-600 line-clamp-2 w-full max-w-[600px]" style={{ minHeight: '32px' }}>
            {getMotivationalMessage()}
          </p>
        </div>
      </div>

      {/* Stats Grid - Fixed heights to prevent CLS - Enhanced with Visual Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stats-grid" style={{ contain: 'layout' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isLoading = moodsLoading || journalsLoading || analyticsLoading;
          
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 stat-card h-[140px] card-hover-lift transition-all-smooth gpu-accelerated stagger-item"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ contain: 'layout strict', animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2 h-[32px]">
                <span className="text-sm font-medium text-gray-600 truncate">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0 hover-scale transition-transform-smooth`}>
                  <Icon className={stat.color} size={20} />
                </div>
              </div>
              <div className="flex items-center" style={{ contain: 'layout strict', width: '140px', height: '48px', minWidth: '140px', maxWidth: '140px', minHeight: '48px', maxHeight: '48px', overflow: 'hidden' }}>
                {isLoading ? (
                  <Skeleton className="h-9 w-[120px]" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none" data-testid={`stat-value-${index}`} style={{ width: '140px', minWidth: '140px', maxWidth: '140px' }}>
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Recent Activity - Enhanced with Visual Effects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Moods */}
        <div className="bg-white rounded-lg shadow-lg p-6 card-hover-lift transition-all-smooth gpu-accelerated">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="text-pink-500 animate-subtle-pulse" size={24} />
              Recent Moods
            </h2>
            <Link href="/mood">
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors-smooth hover-lift">
                View All →
              </span>
            </Link>
          </div>
          <div style={{ height: '252px', contain: 'layout strict' }}>
            {moodsLoading || recentMoods.length === 0 ? (
              <div style={{ height: '252px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-gray-500 text-center" data-testid="no-recent-moods">
                  {moodsLoading ? 'Loading...' : 'No mood entries yet. Start tracking your mood!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3" style={{ height: '252px', overflow: 'auto' }}>
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
        </div>

        {/* Recent Journals */}
        <div className="bg-white rounded-lg shadow-lg p-6 card-hover-lift transition-all-smooth gpu-accelerated">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="text-purple-500 animate-subtle-pulse" size={24} />
              Recent Journals
            </h2>
            <Link href="/journal">
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors-smooth hover-lift">
                View All →
              </span>
            </Link>
          </div>
          <div style={{ height: '276px', contain: 'layout strict' }}>
            {journalsLoading || recentJournals.length === 0 ? (
              <div style={{ height: '276px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-gray-500 text-center" data-testid="no-recent-journals">
                  {journalsLoading ? 'Loading...' : 'No journal entries yet. Start journaling!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3" style={{ height: '276px', overflow: 'auto' }}>
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
      </div>

      {/* Helpful Tips - Enhanced with Visual Effects */}
      <div className="mt-8 bg-gradient-serenity rounded-lg p-6 border border-blue-200 shadow-lg card-hover-lift transition-all-smooth gpu-accelerated">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="text-yellow-500 animate-subtle-pulse" size={24} />
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
    </>
  );
}
