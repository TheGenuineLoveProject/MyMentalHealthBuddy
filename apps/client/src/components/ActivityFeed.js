import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Activity Feed Component
 * Real-time activity and updates display
 */
import { useMemo } from 'react';
import { MessageSquare, TrendingUp, BookOpen, Heart, Calendar, CheckCircle, Info, Award, } from 'lucide-react';
export function ActivityFeed({ activities, maxItems = 10, showTimestamps = true, groupByDate = true, 'data-testid': testId, }) {
    const processedActivities = useMemo(() => {
        // Sort by timestamp (newest first)
        const sorted = [...activities]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, maxItems);
        if (!groupByDate)
            return { ungrouped: sorted };
        // Group by date
        const grouped = {};
        sorted.forEach((activity) => {
            const date = new Date(activity.timestamp);
            const key = getDateLabel(date);
            if (!grouped[key])
                grouped[key] = [];
            grouped[key].push(activity);
        });
        return grouped;
    }, [activities, maxItems, groupByDate]);
    if (activities.length === 0) {
        return (_jsxs("div", { className: "text-center py-12 text-gray-500", "data-testid": testId, children: [_jsx(Info, { className: "h-12 w-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "No recent activity" }), _jsx("p", { className: "text-sm mt-1", children: "Start journaling or tracking your mood!" })] }));
    }
    return (_jsx("div", { className: "space-y-6", "data-testid": testId, children: groupByDate ? (Object.entries(processedActivities).map(([dateLabel, items]) => (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2", children: dateLabel }), _jsx("div", { className: "space-y-2", children: items.map((activity) => (_jsx(ActivityItem, { activity: activity, showTimestamp: showTimestamps }, activity.id))) })] }, dateLabel)))) : (_jsx("div", { className: "space-y-2", children: (processedActivities.ungrouped || []).map((activity) => (_jsx(ActivityItem, { activity: activity, showTimestamp: showTimestamps }, activity.id))) })) }));
}
function ActivityItem({ activity, showTimestamp }) {
    const { icon: Icon, color, bgColor } = getActivityStyle(activity.type);
    const isPriority = activity.priority === 'high';
    return (_jsxs("div", { className: `
        flex items-start gap-3 p-3 rounded-lg transition-colors
        ${isPriority ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
      `, "data-testid": `activity-${activity.id}`, children: [_jsx("div", { className: `${bgColor} rounded-full p-2 flex-shrink-0`, children: _jsx(Icon, { className: `h-4 w-4 ${color}` }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("h4", { className: "font-medium text-sm", children: activity.title }), showTimestamp && (_jsx("span", { className: "text-xs text-gray-500 flex-shrink-0", children: formatTime(new Date(activity.timestamp)) }))] }), activity.description && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: activity.description })), activity.metadata && Object.keys(activity.metadata).length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: Object.entries(activity.metadata).map(([key, value]) => (_jsxs("span", { className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded", children: [key, ": ", String(value)] }, key))) }))] })] }));
}
function getActivityStyle(type) {
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
function getDateLabel(date) {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
        return 'Today';
    if (diffDays === 1)
        return 'Yesterday';
    if (diffDays < 7)
        return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(date) {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 1)
        return 'Just now';
    if (diffMinutes < 60)
        return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
        return `${diffHours}h ago`;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
