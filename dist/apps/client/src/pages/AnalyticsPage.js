import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { PieChart } from '@/components/Charts';
import { InsightCard, PredictiveInsights, NarrativeSummary, ComparisonInsight } from '@/components/DataStorytelling';
import { NarrativeLineChart } from '@/components/NarrativeChart';
import { TrendingUp, Users, Globe, Clock, Target, Award, } from 'lucide-react';
/**
 * Analytics Page - Comprehensive performance insights
 * Track content performance, audience engagement, and growth
 */
export default function AnalyticsPage() {
    const analyticsData = {
        views: { value: 45820, change: 12.5 },
        engagement: { value: 8.4, change: 3.2 },
        shares: { value: 2340, change: -2.1 },
        comments: { value: 1520, change: 15.8 },
    };
    const audienceStats = [
        { label: 'Total Followers', value: '12.5K', change: '+5.2%', icon: Users },
        { label: 'Reach', value: '45.8K', change: '+12.3%', icon: Globe },
        { label: 'Avg. Session', value: '3m 42s', change: '+8.1%', icon: Clock },
        { label: 'Conversion Rate', value: '4.2%', change: '+1.3%', icon: Target },
    ];
    const platformBreakdown = [
        { name: 'Instagram', percentage: 45, color: 'bg-pink-500' },
        { name: 'Twitter', percentage: 30, color: 'bg-blue-500' },
        { name: 'LinkedIn', percentage: 15, color: 'bg-indigo-500' },
        { name: 'Facebook', percentage: 10, color: 'bg-blue-600' },
    ];
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-7xl", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", "data-testid": "text-page-title", children: "Analytics Dashboard" }), _jsx("p", { className: "text-muted-foreground text-lg", children: "Track performance, engagement, and growth across all platforms" })] }), _jsxs("div", { className: "flex gap-3 mb-8", children: [_jsx(Button, { variant: "secondary", "data-testid": "button-export-pdf", children: "Export PDF" }), _jsx(Button, { variant: "secondary", "data-testid": "button-export-csv", children: "Export CSV" }), _jsx(Button, { variant: "secondary", "data-testid": "button-schedule-report", children: "Schedule Report" })] }), _jsx(NarrativeSummary, { title: "\uD83D\uDCCA Your Analytics Story", timeframe: "Last 30 Days", summary: "Your mental health platform achieved remarkable growth this month! Total views increased by 12.5% to nearly 46K visits, while engagement surged by 15.8% with over 1,500 meaningful comments from users. Although shares dipped slightly by 2.1%, your overall community interaction and reach continue strengthening\u2014a testament to the authentic value your content delivers to users seeking mental wellness support.", highlights: [
                    { label: 'Total Reach', value: '45.8K', sentiment: 'positive' },
                    { label: 'Engagement Rate', value: '8.4%', sentiment: 'positive' },
                    { label: 'Active Days', value: '28/30', sentiment: 'positive' }
                ] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-8", children: [_jsx(InsightCard, { type: "positive", title: "\uD83C\uDF89 Comments Surged 15.8%", description: "User engagement reached all-time high with 1,520 comments this month, indicating strong community connection and therapeutic value.", metric: { label: 'total comments', value: '1,520', change: 15.8 }, action: {
                            label: 'View top discussions',
                            onClick: () => console.log('Navigate to discussions')
                        } }), _jsx(InsightCard, { type: "recommendation", title: "\uD83D\uDCA1 Optimize Posting Schedule", description: "Your audience is most active on weekdays between 10 AM - 2 PM. Schedule therapeutic content during these peak engagement windows.", action: {
                            label: 'Set up automation',
                            onClick: () => console.log('Navigate to automation')
                        } })] }), _jsx("div", { className: "mt-8", children: _jsx(PredictiveInsights, { historical: [
                        { label: 'Week 1', value: 10200 },
                        { label: 'Week 2', value: 11500 },
                        { label: 'Week 3', value: 11800 },
                        { label: 'Week 4', value: 12320 }
                    ], forecast: [
                        { label: 'Next Week', value: 13100, confidence: 85 },
                        { label: 'Week +2', value: 13850, confidence: 78 },
                        { label: 'Week +3', value: 14200, confidence: 72 }
                    ], insights: [
                        'Weekly growth rate of 6.2% suggests sustained upward momentum in user engagement',
                        'Peak traffic days (Tue/Thu) correlate with new therapeutic content releases',
                        'Average session duration increased 18% indicating higher content quality perception',
                        'Mobile traffic (68%) dominates—optimize responsive design for mobile journaling features'
                    ] }) }), _jsx("div", { className: "mt-8", children: _jsx(ComparisonInsight, { title: "Monthly Performance Comparison", current: {
                        label: 'This Month (Nov 2025)',
                        value: 45820,
                        trend: 12.5
                    }, previous: {
                        label: 'Last Month (Oct 2025)',
                        value: 40700
                    }, insight: "Exceptional growth driven by viral 'Mindfulness Exercises' content and improved SEO rankings. Your therapeutic guidance resonated with 5,120 new users this month." }) }), _jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6", children: "Engagement Metrics" }), _jsx(AnalyticsDashboard, { data: analyticsData, period: "30d" })] }), _jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6", children: "Audience Insights" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: audienceStats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (_jsxs(Card, { className: "p-6", "data-testid": `audience-stat-${i}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "text-sm font-medium text-muted-foreground", children: stat.label }), _jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: _jsx(Icon, { className: "h-5 w-5 text-primary" }) })] }), _jsx("div", { className: "text-3xl font-bold mb-2", "data-testid": `audience-value-${i}`, children: stat.value }), _jsxs(Badge, { variant: "gray", className: "text-green-600", "data-testid": `audience-change-${i}`, children: [_jsx(TrendingUp, { className: "h-3 w-3 mr-1" }), stat.change] })] }, i));
                        }) })] }), _jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-6", "data-testid": "text-platform-breakdown", children: "Traffic by Platform" }), _jsx(PieChart, { data: platformBreakdown.map(p => ({
                                    label: p.name,
                                    value: p.percentage,
                                    color: undefined
                                })), size: 250, showLegend: true })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-6", children: "Engagement Trend (7 Days) - With Narrative Annotations" }), _jsx(NarrativeLineChart, { data: [
                                    { label: 'Mon', value: 7.2 },
                                    { label: 'Tue', value: 8.1 },
                                    { label: 'Wed', value: 7.8 },
                                    { label: 'Thu', value: 8.9 },
                                    { label: 'Fri', value: 9.2 },
                                    { label: 'Sat', value: 8.4 },
                                    { label: 'Sun', value: 8.4 }
                                ], annotations: [
                                    {
                                        label: '🎯 Best Day',
                                        description: 'Friday reached peak engagement at 9.2% - new content release timing was optimal',
                                        dataIndex: 4,
                                        type: 'peak'
                                    },
                                    {
                                        label: '📊 Milestone',
                                        description: 'Tuesday marked first day above 8% threshold this week',
                                        dataIndex: 1,
                                        type: 'milestone'
                                    }
                                ], height: 250, animate: true })] })] }), _jsx("div", { className: "mt-8", children: _jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Award, { className: "h-6 w-6 text-primary" }), _jsx("h3", { className: "text-xl font-semibold", "data-testid": "text-goals", children: "Goals & Achievements" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83C\uDFAF" }), _jsx("div", { className: "text-2xl font-bold mb-1", children: "10K" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Monthly Views Goal" }), _jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "primary", children: "Achieved!" }) })] }), _jsxs("div", { className: "text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDCC8" }), _jsx("div", { className: "text-2xl font-bold mb-1", children: "5K" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Follower Milestone" }), _jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "gray", children: "In Progress (92%)" }) })] }), _jsxs("div", { className: "text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDCAA" }), _jsx("div", { className: "text-2xl font-bold mb-1", children: "30" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Consecutive Days Publishing" }), _jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "primary", children: "Achieved!" }) })] })] })] }) }), _jsxs(Card, { className: "mt-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "\uD83D\uDCA1 AI-Powered Insights" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg", children: [_jsx("div", { className: "text-2xl", children: "\u2728" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium mb-1", children: "Best posting time identified" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Your audience is most active on weekdays between 10 AM - 2 PM. Consider scheduling more content during this window." })] })] }), _jsxs("div", { className: "flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg", children: [_jsx("div", { className: "text-2xl", children: "\uD83D\uDE80" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium mb-1", children: "Content performance trending up" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "\"How-to\" guides are getting 45% more engagement than other content types. Create more tutorial content!" })] })] }), _jsxs("div", { className: "flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg", children: [_jsx("div", { className: "text-2xl", children: "\uD83C\uDFA8" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium mb-1", children: "Visual content opportunity" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Posts with infographics get 3x more shares. Use the Canva integration to create more visual content." })] })] })] })] })] }));
}
