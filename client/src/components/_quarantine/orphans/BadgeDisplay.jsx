import { Award } from "lucide-react";

const badgeData = {
  "week-warrior": { icon: "🏆", name: "Week Warrior", description: "Complete a 7-day streak" },
  "journal-keeper": { icon: "📔", name: "Journal Keeper", description: "Write 10 journal entries" },
  "meditation-master": { icon: "🧘", name: "Meditation Master", description: "Complete 30 meditation sessions" },
  "community-helper": { icon: "🤝", name: "Community Helper", description: "Help 5 community members" },
  "streak-30": { icon: "🔥", name: "30-Day Streak", description: "Maintain a 30-day streak" },
  "early-bird": { icon: "🌅", name: "Early Bird", description: "Log in before 7am 10 times" },
  "night-owl": { icon: "🦉", name: "Night Owl", description: "Practice after 10pm 10 times" },
  "explorer": { icon: "🧭", name: "Explorer", description: "Try 15 different tools" },
  "gratitude-guru": { icon: "🙏", name: "Gratitude Guru", description: "Complete 50 gratitude entries" },
  "self-love": { icon: "💝", name: "Self-Love Champion", description: "Complete the Self-Love challenge" }
};

export function Badge({ id, earned = true, size = "md" }) {
  const badge = badgeData[id] || { icon: "🏅", name: "Unknown Badge", description: "" };
  
  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-4xl"
  };

  return (
    <div
      className={`
        flex flex-col items-center gap-1
        ${earned ? "" : "opacity-40 grayscale"}
      `}
      title={badge.description}
    >
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          ${earned ? "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40" : "bg-muted"}
        `}
      >
        {badge.icon}
      </div>
      <span className="text-xs font-medium text-center">{badge.name}</span>
    </div>
  );
}

export function BadgeDisplay({ badges = [], maxDisplay = 5, showAll = false }) {
  const displayBadges = showAll ? badges : badges.slice(0, maxDisplay);
  const remaining = badges.length - maxDisplay;

  if (badges.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Award className="w-5 h-5" />
        <span className="text-sm">No badges earned yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {displayBadges.map((badge, index) => (
        <Badge
          key={badge.id || index}
          id={badge.id}
          earned={badge.earned !== false}
        />
      ))}
      {!showAll && remaining > 0 && (
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted text-muted-foreground">
          <span className="text-sm font-medium">+{remaining}</span>
        </div>
      )}
    </div>
  );
}

export default BadgeDisplay;
