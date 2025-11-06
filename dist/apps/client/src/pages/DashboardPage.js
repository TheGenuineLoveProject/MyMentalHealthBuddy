import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, BookOpen, TrendingUp, Calendar, Sparkles, Activity } from "lucide-react";
import { QuickActions } from "@/components/QuickActions";
import { Skeleton } from "@/components/SkeletonLoader";
export function DashboardPage() {
    const { data: moods = [], isLoading: moodsLoading, error: moodsError } = useQuery({
        queryKey: ["/api/moods"],
        retry: false,
    });
    const { data: journals = [], isLoading: journalsLoading, error: journalsError } = useQuery({
        queryKey: ["/api/journals"],
        retry: false,
    });
    const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
        queryKey: ["/api/moods/analytics"],
        retry: false,
    });
    const isUnauthorized = moodsError || journalsError || analyticsError;
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
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-6 particles-bg animate-fade-in", children: [_jsxs("div", { className: "mb-8 h-[120px] animate-slide-up", style: { contain: 'layout' }, children: [_jsx("h1", { className: "heading-lg mb-2 text-gray-900 h-[48px] leading-tight text-shadow-soft", "data-testid": "dashboard-title", children: "Welcome to MyMentalHealthBuddy" }), _jsxs("div", { className: "flex items-center gap-2 h-[40px]", style: { contain: 'layout' }, children: [_jsx(Sparkles, { className: "text-yellow-500 flex-shrink-0 animate-subtle-pulse", size: 24 }), _jsx("p", { className: "text-xl text-gray-600 line-clamp-2 min-w-[500px]", children: getMotivationalMessage() })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stats-grid", style: { contain: 'layout' }, children: stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const isLoading = moodsLoading || journalsLoading || analyticsLoading;
                    return (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 stat-card h-[140px] card-hover-lift transition-all-smooth gpu-accelerated stagger-item", "data-testid": `stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`, style: { contain: 'layout strict', animationDelay: `${index * 100}ms` }, children: [_jsxs("div", { className: "flex items-center justify-between mb-2 h-[32px]", children: [_jsx("span", { className: "text-sm font-medium text-gray-600 truncate", children: stat.label }), _jsx("div", { className: `p-2 rounded-lg ${stat.bgColor} flex-shrink-0 hover-scale transition-transform-smooth`, children: _jsx(Icon, { className: stat.color, size: 20 }) })] }), _jsx("div", { className: "w-[100px] h-[48px] flex items-center", style: { contain: 'layout strict' }, children: isLoading ? (_jsx(Skeleton, { className: "h-9 w-20" })) : (_jsx("p", { className: "text-3xl font-bold text-gray-900 tabular-nums leading-none", "data-testid": `stat-value-${index}`, children: stat.value })) })] }, index));
                }) }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100", children: "Quick Actions" }), _jsx(QuickActions, {})] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 card-hover-lift transition-all-smooth gpu-accelerated", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h2", { className: "text-xl font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Heart, { className: "text-pink-500 animate-subtle-pulse", size: 24 }), "Recent Moods"] }), _jsx(Link, { href: "/mood", children: _jsx("span", { className: "text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors-smooth hover-lift", children: "View All \u2192" }) })] }), _jsx("div", { style: { height: '252px', contain: 'layout strict' }, children: moodsLoading || recentMoods.length === 0 ? (_jsx("div", { style: { height: '252px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx("p", { className: "text-gray-500 text-center", "data-testid": "no-recent-moods", children: moodsLoading ? 'Loading...' : 'No mood entries yet. Start tracking your mood!' }) })) : (_jsx("div", { className: "space-y-3", style: { height: '252px', overflow: 'auto' }, children: recentMoods.map((mood) => (_jsxs("div", { className: "p-3 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition", "data-testid": `recent-mood-${mood.id}`, children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: mood.mood }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Intensity: ", mood.intensity, "/10"] })] }), _jsxs("p", { className: "text-xs text-gray-500 flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), new Date(mood.createdAt).toLocaleDateString()] })] }), mood.notes && (_jsx("p", { className: "text-sm text-gray-600 mt-2 line-clamp-1", children: mood.notes }))] }, mood.id))) })) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 card-hover-lift transition-all-smooth gpu-accelerated", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h2", { className: "text-xl font-bold text-gray-900 flex items-center gap-2", children: [_jsx(BookOpen, { className: "text-purple-500 animate-subtle-pulse", size: 24 }), "Recent Journals"] }), _jsx(Link, { href: "/journal", children: _jsx("span", { className: "text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors-smooth hover-lift", children: "View All \u2192" }) })] }), _jsx("div", { style: { height: '276px', contain: 'layout strict' }, children: journalsLoading || recentJournals.length === 0 ? (_jsx("div", { style: { height: '276px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx("p", { className: "text-gray-500 text-center", "data-testid": "no-recent-journals", children: journalsLoading ? 'Loading...' : 'No journal entries yet. Start journaling!' }) })) : (_jsx("div", { className: "space-y-3", style: { height: '276px', overflow: 'auto' }, children: recentJournals.map((journal) => (_jsxs("div", { className: "p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition", "data-testid": `recent-journal-${journal.id}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("p", { className: "font-semibold text-gray-900", children: journal.title || "Untitled Entry" }), _jsxs("p", { className: "text-xs text-gray-500 flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), new Date(journal.createdAt).toLocaleDateString()] })] }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: journal.content })] }, journal.id))) })) })] })] }), _jsxs("div", { className: "mt-8 bg-gradient-serenity rounded-lg p-6 border border-blue-200 shadow-lg card-hover-lift transition-all-smooth gpu-accelerated", children: [_jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(Sparkles, { className: "text-yellow-500 animate-subtle-pulse", size: 24 }), "Daily Mental Health Tips"] }), _jsxs("ul", { className: "space-y-2 text-gray-700", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-600 font-bold", children: "\u2022" }), _jsx("span", { children: "Take a few minutes each day to check in with your feelings" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-600 font-bold", children: "\u2022" }), _jsx("span", { children: "Practice deep breathing when you feel stressed or anxious" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-600 font-bold", children: "\u2022" }), _jsx("span", { children: "Connect with supportive friends or family members regularly" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-600 font-bold", children: "\u2022" }), _jsx("span", { children: "Remember: It's okay to not be okay. Reach out for help when you need it" })] })] })] })] }));
}
