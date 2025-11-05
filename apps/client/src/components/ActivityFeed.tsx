/**
 * Activity Feed Component
 * Real-time activity and updates display
 */

import { useMemo } from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  BookOpen, 
  Heart, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Award,
} from 'lucide-react';

export interface Activity {
  id: string;
  type: 'chat' | 'mood' | 'journal' | 'resource' | 'event' | 'achievement' | 'system';
  title: string;
  description?: string;
  timestamp: Date | string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high';
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  showTimestamps?: boolean;
  groupByDate?: boolean;
  'data-testid'?: string;
}

export function ActivityFeed({
  activities,
  maxItems = 10,
  showTimestamps = true,
  groupByDate = true,
  'data-testid': testId,
}: ActivityFeedProps) {
  const processedActivities = useMemo(() => {
    // Sort by timestamp (newest first)
    const sorted = [...activities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, maxItems);

    if (!groupByDate) return { ungrouped: sorted };

    // Group by date
    const grouped: Record<string, Activity[]> = {};
    sorted.forEach((activity) => {
      const date = new Date(activity.timestamp);
      const key = getDateLabel(date);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(activity);
    });

    return grouped;
  }, [activities, maxItems, groupByDate]);

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500" data-testid={testId}>
        <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No recent activity</p>
        <p className="text-sm mt-1">Start journaling or tracking your mood!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid={testId}>
      {groupByDate ? (
        Object.entries(processedActivities).map(([dateLabel, items]) => (
          <div key={dateLabel}>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2">
              {dateLabel}
            </h3>
            <div className="space-y-2">
              {items.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  showTimestamp={showTimestamps}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="space-y-2">
          {(processedActivities.ungrouped || []).map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              showTimestamp={showTimestamps}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityItem({ activity, showTimestamp }: { activity: Activity; showTimestamp: boolean }) {
  const { icon: Icon, color, bgColor } = getActivityStyle(activity.type);
  const isPriority = activity.priority === 'high';

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg transition-colors
        ${isPriority ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
      `}
      data-testid={`activity-${activity.id}`}
    >
      <div className={`${bgColor} rounded-full p-2 flex-shrink-0`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm">{activity.title}</h4>
          {showTimestamp && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatTime(new Date(activity.timestamp))}
            </span>
          )}
        </div>
        
        {activity.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {activity.description}
          </p>
        )}

        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(activity.metadata).map(([key, value]) => (
              <span
                key={key}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
              >
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getActivityStyle(type: Activity['type']) {
  const styles = {
    chat: {
      icon: MessageSquare,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    mood: {
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    journal: {
      icon: BookOpen,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    resource: {
      icon: Heart,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    },
    event: {
      icon: Calendar,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
    achievement: {
      icon: Award,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    system: {
      icon: CheckCircle,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
    },
  };

  return styles[type] || styles.system;
}

function getDateLabel(date: Date): string {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
