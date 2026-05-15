import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Award, Flame, Heart, Star, Trophy, Sun, Moon, Sparkles, Zap, Crown, Shield, BookOpen, Gift } from 'lucide-react';

const BADGE_DEFINITIONS = {
  "first-entry": {
    id: "first-entry",
    name: "First Step",
    description: "Made your first wellness entry",
    icon: Star,
    color: "#d4af37",
    requirement: 1
  },
  "streak-3": {
    id: "streak-3",
    name: "Consistent Soul",
    description: "Maintained a 3-day streak",
    icon: Flame,
    color: "#f97316",
    requirement: 3
  },
  "streak-7": {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintained a 7-day streak",
    icon: Flame,
    color: "#ef4444",
    requirement: 7
  },
  "streak-14": {
    id: "streak-14",
    name: "Fortnight Focus",
    description: "Maintained a 14-day streak",
    icon: Trophy,
    color: "#8b5cf6",
    requirement: 14
  },
  "streak-30": {
    id: "streak-30",
    name: "Monthly Master",
    description: "Maintained a 30-day streak",
    icon: Crown,
    color: "#d4af37",
    requirement: 30
  },
  "streak-100": {
    id: "streak-100",
    name: "Century Champion",
    description: "Maintained a 100-day streak",
    icon: Crown,
    color: "#10b981",
    requirement: 100
  },
  "gratitude-entry": {
    id: "gratitude-entry",
    name: "Grateful Heart",
    description: "Logged a gratitude entry",
    icon: Heart,
    color: "#ec4899",
    requirement: 1
  },
  "journal-10": {
    id: "journal-10",
    name: "Reflective Writer",
    description: "Created 10 journal entries",
    icon: BookOpen,
    color: "#6366f1",
    requirement: 10
  },
  "journal-50": {
    id: "journal-50",
    name: "Dedicated Journaler",
    description: "Created 50 journal entries",
    icon: BookOpen,
    color: "#8b5cf6",
    requirement: 50
  },
  "moods-25": {
    id: "moods-25",
    name: "Self-Aware Soul",
    description: "Tracked 25 mood entries",
    icon: Sun,
    color: "#fbbf24",
    requirement: 25
  },
  "moods-100": {
    id: "moods-100",
    name: "Emotional Intelligence",
    description: "Tracked 100 mood entries",
    icon: Zap,
    color: "#14b8a6",
    requirement: 100
  },
  "weekly-wins": {
    id: "weekly-wins",
    name: "Weekly Winner",
    description: "Completed a full week of wellness",
    icon: Award,
    color: "#0ea5e9",
    requirement: 1
  },
  "morning-person": {
    id: "morning-person",
    name: "Early Riser",
    description: "Made 5 entries before 8 AM",
    icon: Sun,
    color: "#f59e0b",
    requirement: 5
  },
  "night-owl": {
    id: "night-owl",
    name: "Night Owl",
    description: "Made 5 entries after 10 PM",
    icon: Moon,
    color: "#6366f1",
    requirement: 5
  },
  "invited-friend": {
    id: "invited-friend",
    name: "Community Builder",
    description: "Invited a friend to the platform",
    icon: Gift,
    color: "#ec4899",
    requirement: 1
  },
  "premium-member": {
    id: "premium-member",
    name: "Sacred Supporter",
    description: "Became a premium member",
    icon: Shield,
    color: "#d4af37",
    requirement: 1
  }
};

function BadgeCard({ badge, earned = false, earnedAt = null }) {
  const Icon = badge.icon;
  
  return (
    <div 
      className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${
        earned 
          ? 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl' 
          : 'bg-gray-50 dark:bg-gray-900 opacity-50 grayscale'
      }`}
      style={{ 
        borderColor: earned ? `${badge.color}40` : 'transparent',
        boxShadow: earned ? `0 4px 20px ${badge.color}20` : 'none'
      }}
      data-testid={`badge-${badge.id}`}
    >
      {earned && (
        <div 
          className="absolute -top-2 -right-2 p-1 rounded-full"
          style={{ backgroundColor: badge.color }}
        >
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )}
      
      <div 
        className={`p-4 rounded-full mb-3 ${earned ? 'animate-pulse-slow' : ''}`}
        style={{ 
          backgroundColor: earned ? `${badge.color}20` : '#e5e7eb',
          boxShadow: earned ? `0 0 15px ${badge.color}30` : 'none'
        }}
      >
        <Icon 
          className="w-8 h-8"
          style={{ color: earned ? badge.color : '#9ca3af' }}
        />
      </div>
      
      <h4 className="text-sm font-semibold text-center text-foreground mb-1">
        {badge.name}
      </h4>
      <p className="text-xs text-muted-foreground text-center">
        {badge.description}
      </p>
      
      {earned && earnedAt && (
        <p className="text-xs text-muted-foreground mt-2">
          Earned {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default function Badges({ className = "", compact = false }) {
  const { user } = useAuth();

  const badgesQuery = useQuery({
    queryKey: ["/api/badges"],
    enabled: !!user
  });

  const earnedBadges = badgesQuery.data || [];
  const earnedBadgeIds = new Set(earnedBadges.map(b => b.badgeId));

  const allBadges = Object.values(BADGE_DEFINITIONS);
  const earnedCount = earnedBadges.length;
  const totalCount = allBadges.length;

  if (compact) {
    return (
      <div className={`flex items-center gap-4 ${className}`} data-testid="badges-compact">
        <div className="flex -space-x-2">
          {earnedBadges.slice(0, 5).map((badge) => {
            const def = BADGE_DEFINITIONS[badge.badgeId];
            if (!def) return null;
            const Icon = def.icon;
            return (
              <div 
                key={badge.badgeId}
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"
                style={{ backgroundColor: def.color }}
                title={def.name}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
            );
          })}
          {earnedBadges.length > 5 && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800">
              <span className="text-xs font-bold">+{earnedBadges.length - 5}</span>
            </div>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {earnedCount} / {totalCount} badges earned
        </span>
      </div>
    );
  }

  return (
    <div className={className} data-testid="badges-section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-serif font-semibold text-foreground">
            Your Badges
          </h3>
          <p className="text-sm text-muted-foreground">
            {earnedCount} of {totalCount} badges earned
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#A8C9A0] to-[#FFD93D] transition-all duration-500"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-foreground">
            {Math.round((earnedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allBadges.map((badge) => {
          const earnedBadge = earnedBadges.find(b => b.badgeId === badge.id);
          return (
            <BadgeCard 
              key={badge.id}
              badge={badge}
              earned={earnedBadgeIds.has(badge.id)}
              earnedAt={earnedBadge?.createdAt}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-slow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export { BADGE_DEFINITIONS, BadgeCard };
