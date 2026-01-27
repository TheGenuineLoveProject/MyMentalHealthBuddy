import { useState } from "react";
import { 
  Bell, Check, CheckCheck, Trash2, Settings, X,
  Sparkles, Trophy, Heart, Moon, Target, Calendar,
  Clock, ChevronRight, Filter, MoreVertical
} from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "You've earned the 'Mindfulness Master' badge for completing 7 days of meditation.",
    icon: Trophy,
    color: "from-amber-500 to-orange-600",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    actionUrl: "/wellness#achievements"
  },
  {
    id: 2,
    type: "reminder",
    title: "Daily Check-in Reminder",
    message: "Time for your evening mood check-in. How are you feeling today?",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    actionUrl: "/mood"
  },
  {
    id: 3,
    type: "streak",
    title: "Keep Your Streak Alive!",
    message: "You're on a 5-day streak! Complete one wellness activity today to maintain it.",
    icon: Target,
    color: "from-violet-500 to-purple-600",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    actionUrl: "/wellness"
  },
  {
    id: 4,
    type: "recommendation",
    title: "New Tool Suggestion",
    message: "Based on your recent journaling, try the Positive Reframing tool to shift perspectives.",
    icon: Sparkles,
    color: "from-blue-500 to-indigo-600",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    actionUrl: "/wellness#reframing"
  },
  {
    id: 5,
    type: "journey",
    title: "Journey Progress",
    message: "Day 3 of your Anxiety Relief Journey is ready. Continue your healing path.",
    icon: Moon,
    color: "from-indigo-500 to-purple-600",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    actionUrl: "/wellness#journey"
  }
];

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const formatTime = (date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-label="Notification Center"
      data-testid="notification-center-overlay"
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[var(--bg)] shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold text-[var(--text)]">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary)] text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="p-2 hover:bg-[var(--surface)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
              aria-label="Mark all as read"
              data-testid="button-mark-all-read"
            >
              <CheckCheck className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--surface)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
              aria-label="Close notifications"
              data-testid="button-close-notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-3 border-b border-[var(--border)] flex items-center gap-2 overflow-x-auto">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "achievement", label: "Achievements" },
            { key: "reminder", label: "Reminders" },
            { key: "streak", label: "Streaks" }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === key
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              }`}
              data-testid={`filter-${key}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <Bell className="w-12 h-12 text-[var(--text-secondary)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">No Notifications</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {filter === "all" 
                  ? "You're all caught up! Check back later for updates."
                  : `No ${filter} notifications to display.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filteredNotifications.map(notification => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-[var(--surface)] transition-colors cursor-pointer ${
                      !notification.isRead ? "bg-[var(--primary)]/5" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${notification.color} text-white flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-medium text-[var(--text)] ${!notification.isRead ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                            aria-label="Delete notification"
                            data-testid={`button-delete-${notification.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.createdAt)}
                          </span>
                          {notification.actionUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.actionUrl;
                              }}
                              className="text-xs text-[var(--primary)] font-medium flex items-center gap-1 hover:underline"
                              data-testid={`button-action-${notification.id}`}
                            >
                              View
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[var(--primary)] rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={clearAll}
              className="w-full py-2 text-sm text-[var(--text-secondary)] hover:text-red-500 transition-colors"
              data-testid="button-clear-all"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
