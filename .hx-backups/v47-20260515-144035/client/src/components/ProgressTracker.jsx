import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Calendar, Flame, Star, Award, Sparkles } from 'lucide-react';
import "@/styles/sacred-visuals.css";

const MILESTONES = [
  { id: "first_entry", label: "First Step", target: 1, icon: "🌱", description: "Begin your journey" },
  { id: "week_warrior", label: "Week Warrior", target: 7, icon: "🌿", description: "7 entries completed" },
  { id: "consistency", label: "Inner Light", target: 14, icon: "✨", description: "14 days of reflection" },
  { id: "deep_diver", label: "Deep Diver", target: 21, icon: "🌊", description: "21 days of practice" },
  { id: "lotus_master", label: "Lotus Master", target: 30, icon: "🪷", description: "30 days of growth" },
  { id: "alchemist", label: "Emotional Alchemist", target: 50, icon: "🔮", description: "50 entries" },
  { id: "sage", label: "Wellness Sage", target: 100, icon: "🧘", description: "100 entries" },
];

const STREAK_MILESTONES = [
  { days: 3, label: "Spark", icon: "🔥" },
  { days: 7, label: "Flame", icon: "🔥" },
  { days: 14, label: "Blaze", icon: "🔥" },
  { days: 21, label: "Inferno", icon: "🔥" },
  { days: 30, label: "Eternal Flame", icon: "🔥" },
];

export default function ProgressTracker({ compact = false }) {
  const [view, setView] = useState("weekly");
  const [showMilestones, setShowMilestones] = useState(true);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/progress/stats"],
    staleTime: 1000 * 60 * 5
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/progress/achievements"],
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-pulse">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  const totalEntries = stats?.totalEntries || 0;
  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const weeklyEntries = stats?.weeklyEntries || 0;
  const monthlyEntries = stats?.monthlyEntries || 0;

  const currentMilestone = MILESTONES.find(m => totalEntries < m.target) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = MILESTONES[MILESTONES.indexOf(currentMilestone) - 1];
  const progressToNext = prevMilestone 
    ? ((totalEntries - prevMilestone.target) / (currentMilestone.target - prevMilestone.target)) * 100
    : (totalEntries / currentMilestone.target) * 100;

  const streakMilestone = STREAK_MILESTONES.find(m => currentStreak < m.days) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-rose-50 dark:from-gray-800 dark:to-gray-800 border border-amber-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-gray-800 dark:text-white">{currentStreak}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">day streak</span>
        </div>
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-gray-800 dark:text-white">{totalEntries}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">entries</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-amber-100 dark:border-gray-700 shadow-lg glow-border" data-testid="progress-tracker">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-50/50 via-transparent to-rose-50/50 dark:from-amber-900/10 dark:to-rose-900/10 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-md lotus-blossom">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-semibold text-gray-800 dark:text-white">
                Healing Journey
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your progress and achievements
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView("weekly")}
              className={`px-3 py-1 text-sm rounded-md transition ${
                view === "weekly" 
                  ? "bg-white dark:bg-gray-600 shadow text-amber-600 dark:text-amber-400" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
              data-testid="view-weekly"
            >
              Weekly
            </button>
            <button
              onClick={() => setView("monthly")}
              className={`px-3 py-1 text-sm rounded-md transition ${
                view === "monthly" 
                  ? "bg-white dark:bg-gray-600 shadow text-amber-600 dark:text-amber-400" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
              data-testid="view-monthly"
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={<Calendar className="w-5 h-5" />}
            label="Total Entries"
            value={totalEntries}
            color="blue"
          />
          <StatCard 
            icon={<Flame className="w-5 h-5" />}
            label="Current Streak"
            value={`${currentStreak} days`}
            color="orange"
            glowing={currentStreak >= 7}
          />
          <StatCard 
            icon={<Award className="w-5 h-5" />}
            label="Longest Streak"
            value={`${longestStreak} days`}
            color="purple"
          />
          <StatCard 
            icon={<Star className="w-5 h-5" />}
            label={view === "weekly" ? "This Week" : "This Month"}
            value={view === "weekly" ? weeklyEntries : monthlyEntries}
            color="amber"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress to {currentMilestone.label}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalEntries} / {currentMilestone.target}
            </span>
          </div>
          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 rounded-full transition-all duration-500 ${
                progressToNext >= 100 ? "glow-pulse" : ""
              }`}
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            />
            {progressToNext >= 100 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-center mt-2 gap-2">
            <span className="text-2xl">{currentMilestone.icon}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 italic">
              {currentMilestone.description}
            </span>
          </div>
        </div>

        {showMilestones && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Milestone Journey
            </h4>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {MILESTONES.map((milestone, idx) => {
                const achieved = totalEntries >= milestone.target;
                const current = milestone.id === currentMilestone.id;
                return (
                  <div 
                    key={milestone.id}
                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl transition-all ${
                      achieved 
                        ? "bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 border border-amber-200 dark:border-amber-800" 
                        : current
                          ? "bg-white dark:bg-gray-700 border-2 border-dashed border-amber-400 dark:border-amber-600"
                          : "bg-gray-100 dark:bg-gray-700/50 border border-transparent opacity-50"
                    } ${achieved ? "lotus-glow" : ""}`}
                    data-testid={`milestone-${milestone.id}`}
                  >
                    <span className={`text-2xl ${achieved ? "" : "grayscale"}`}>
                      {milestone.icon}
                    </span>
                    <span className={`text-xs mt-1 font-medium ${
                      achieved ? "text-amber-700 dark:text-amber-300" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {milestone.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, glowing = false }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500 text-blue-600 dark:text-blue-400",
    orange: "from-orange-500 to-amber-500 text-orange-600 dark:text-orange-400",
    purple: "from-purple-500 to-pink-500 text-purple-600 dark:text-purple-400",
    amber: "from-amber-500 to-yellow-500 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className={`p-4 rounded-xl bg-white/80 dark:bg-gray-700/80 border border-gray-100 dark:border-gray-600 ${glowing ? "glow-ring-joy" : ""}`}>
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClasses[color].split(" ").slice(0, 2).join(" ")} flex items-center justify-center mb-2 text-white`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${colorClasses[color].split(" ").slice(2).join(" ")}`}>
        {value}
      </p>
    </div>
  );
}
