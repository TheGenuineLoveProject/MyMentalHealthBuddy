/**
 * ============================================================================
 * CRM WIDGETS COMPONENT
 * ============================================================================
 * 
 * Dashboard widgets for private user hub
 * Brand Colors: #8fbf9f (sage), #f4c7c3 (rose), #2f5d5d (teal), #eac33b (gold)
 * 
 * Widgets:
 *   - StatsWidget: Key metrics display
 *   - CalendarWidget: Upcoming events/sessions
 *   - ProgressWidget: User progress tracking
 *   - QuickActionsWidget: Common actions
 *   - NotificationsWidget: Recent activity
 * ============================================================================
 */

import { Calendar, Clock, Bell, Target, Flame, Star, MessageCircle, BookOpen, Heart, ChevronRight, Plus, Check, ArrowUp, ArrowDown } from 'lucide-react';

export function StatsWidget({ stats = [], title = "Your Progress" }) {
  const defaultStats = [
    { label: "Current Streak", value: "7", unit: "days", icon: Flame, trend: "+2", up: true },
    { label: "Total XP", value: "2,450", unit: "pts", icon: Star, trend: "+150", up: true },
    { label: "Sessions", value: "23", unit: "completed", icon: MessageCircle, trend: null },
    { label: "Journal Entries", value: "45", unit: "written", icon: BookOpen, trend: "+3", up: true }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div 
      className="p-6 rounded-2xl"
      style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
      data-component="StatsWidget"
      data-testid="widget-stats"
    >
      <h3 className="font-semibold mb-4" style={{ color: '#2f5d5d' }}>{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {displayStats.map((stat, i) => {
          const Icon = stat.icon || Star;
          return (
            <div 
              key={i}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(143, 191, 159, 0.05)' }}
              data-testid={`stat-${i}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" />
                {stat.trend && (
                  <span 
                    className="text-xs font-medium flex items-center gap-0.5"
                    style={{ color: stat.up ? '#059669' : '#dc2626' }}
                  >
                    {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarWidget({ events = [] }) {
  const defaultEvents = [
    { id: 1, title: "AI Check-in", time: "9:00 AM", type: "session", today: true },
    { id: 2, title: "Journaling", time: "7:00 PM", type: "practice", today: true },
    { id: 3, title: "Group Session", time: "Tomorrow, 2:00 PM", type: "community", today: false }
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  const typeColors = {
    session: { bg: 'rgba(143, 191, 159, 0.15)', border: '#8fbf9f' },
    practice: { bg: 'rgba(234, 195, 59, 0.15)', border: '#eac33b' },
    community: { bg: 'rgba(244, 199, 195, 0.2)', border: '#f4c7c3' }
  };

  return (
    <div 
      className="p-6 rounded-2xl"
      style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
      data-component="CalendarWidget"
      data-testid="widget-calendar"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Upcoming</h3>
        <button 
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          data-testid="button-view-calendar"
          aria-label="View full calendar"
        >
          <Calendar className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" />
        </button>
      </div>

      <ul className="space-y-3" role="list" aria-label="Upcoming events">
        {displayEvents.map((event) => {
          const colors = typeColors[event.type] || typeColors.session;
          return (
            <li 
              key={event.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50 cursor-pointer"
              style={{ background: colors.bg, borderLeft: `3px solid ${colors.border}` }}
              data-testid={`event-${event.id}`}
              role="listitem"
              aria-label={`${event.title} at ${event.time}${event.today ? ', scheduled for today' : ''}`}
            >
              <div className="flex-1">
                <p className="font-medium text-sm" style={{ color: '#2f5d5d' }}>{event.title}</p>
                <p className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opacity: 0.6 }}>
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <time>{event.time}</time>
                </p>
              </div>
              {event.today && (
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: '#eac33b', color: '#2f5d5d' }}
                  aria-hidden="true"
                >
                  Today
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <button 
        className="w-full mt-4 p-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-teal-50"
        style={{ border: '1px dashed rgba(47, 93, 93, 0.3)', color: '#2f5d5d' }}
        data-testid="button-add-event"
        aria-label="Schedule a new wellness session"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        Schedule Session
      </button>
    </div>
  );
}

export function ProgressWidget({ goals = [] }) {
  const defaultGoals = [
    { id: 1, label: "Daily Check-ins", current: 5, target: 7, unit: "days" },
    { id: 2, label: "Weekly Journaling", current: 3, target: 5, unit: "entries" },
    { id: 3, label: "Mindfulness Minutes", current: 45, target: 60, unit: "min" }
  ];

  const displayGoals = goals.length > 0 ? goals : defaultGoals;

  return (
    <div 
      className="p-6 rounded-2xl"
      style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
      data-component="ProgressWidget"
      data-testid="widget-progress"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Weekly Goals</h3>
        <Target className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" />
      </div>

      <div className="space-y-4">
        {displayGoals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const isComplete = progress >= 100;
          
          return (
            <div key={goal.id} data-testid={`goal-${goal.id}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{goal.label}</span>
                <span className="text-xs" style={{ color: isComplete ? '#059669' : '#3a3a3a', opacity: isComplete ? 1 : 0.6 }}>
                  {isComplete ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" aria-hidden="true" /> Complete
                    </span>
                  ) : (
                    `${goal.current}/${goal.target} ${goal.unit}`
                  )}
                </span>
              </div>
              <div 
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(143, 191, 159, 0.2)' }}
                role="progressbar"
                aria-valuenow={goal.current}
                aria-valuemin={0}
                aria-valuemax={goal.target}
                aria-label={`${goal.label} progress`}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    background: isComplete 
                      ? 'linear-gradient(90deg, #8fbf9f, #059669)' 
                      : 'linear-gradient(90deg, #8fbf9f, #eac33b)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function QuickActionsWidget({ actions = [] }) {
  const defaultActions = [
    { id: 1, label: "Start AI Chat", icon: MessageCircle, href: "/chat", primary: true },
    { id: 2, label: "Write in Journal", icon: BookOpen, href: "/journal" },
    { id: 3, label: "Browse Resources", icon: Heart, href: "/content" },
    { id: 4, label: "Community Q&A", icon: Bell, href: "/community" }
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  return (
    <div 
      className="p-6 rounded-2xl"
      style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
      data-component="QuickActionsWidget"
      data-testid="widget-quick-actions"
    >
      <h3 className="font-semibold mb-4" style={{ color: '#2f5d5d' }}>Quick Actions</h3>
      
      <nav className="space-y-2" aria-label="Quick actions">
        {displayActions.map((action) => {
          const Icon = action.icon || ChevronRight;
          return (
            <a
              key={action.id}
              href={action.href || "#"}
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-x-1"
              style={{ 
                background: action.primary ? 'linear-gradient(135deg, #eac33b, #d4a84b)' : 'rgba(143, 191, 159, 0.08)',
                color: action.primary ? '#2f5d5d' : '#3a3a3a'
              }}
              data-testid={`action-${action.id}`}
              aria-label={action.label}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="flex-1 font-medium text-sm">{action.label}</span>
              <ChevronRight className="w-4 h-4 opacity-50" aria-hidden="true" />
            </a>
          );
        })}
      </nav>
    </div>
  );
}

export function NotificationsWidget({ notifications = [] }) {
  const defaultNotifications = [
    { id: 1, text: "New community response to your question", time: "2h ago", unread: true },
    { id: 2, text: "Your 7-day streak milestone!", time: "5h ago", unread: true },
    { id: 3, text: "New healing resource available", time: "1d ago", unread: false }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <div 
      className="p-6 rounded-2xl"
      style={{ background: 'white', border: '1px solid rgba(143, 191, 159, 0.2)' }}
      data-component="NotificationsWidget"
      data-testid="widget-notifications"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Notifications</h3>
        <div className="relative">
          <Bell className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" />
          {displayNotifications.some(n => n.unread) && (
            <span 
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
              style={{ background: '#eac33b' }}
              aria-label="Unread notifications"
            />
          )}
        </div>
      </div>

      <div className="space-y-3">
        {displayNotifications.map((notification) => (
          <div 
            key={notification.id}
            className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
            style={{ background: notification.unread ? 'rgba(234, 195, 59, 0.05)' : 'transparent' }}
            data-testid={`notification-${notification.id}`}
          >
            {notification.unread && (
              <span 
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: '#eac33b' }}
                aria-hidden="true"
              />
            )}
            <div className={notification.unread ? '' : 'ml-5'}>
              <p className="text-sm" style={{ color: '#3a3a3a' }}>{notification.text}</p>
              <p className="text-xs mt-1" style={{ color: '#3a3a3a', opacity: 0.5 }}>{notification.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="w-full mt-4 text-center text-sm font-medium py-2"
        style={{ color: '#8fbf9f' }}
        data-testid="button-view-all-notifications"
      >
        View All
      </button>
    </div>
  );
}

export default function CRMWidgets() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsWidget />
      <CalendarWidget />
      <ProgressWidget />
      <QuickActionsWidget />
      <NotificationsWidget />
    </div>
  );
}
