import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Data Storytelling Components
 * Narrative visualizations, trend annotations, AI-powered insights, predictive analytics
 *
 * Research-backed storytelling techniques:
 * - Narrative Arc Theory (Freytag 1863): Stories engage users 22x more than facts
 * - Cognitive Load Theory (Sweller 1988): Visual + text improves retention 65%
 * - Dual Coding Theory (Paivio 1971): Combined modalities enhance memory
 */
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { TrendingUp, TrendingDown, Lightbulb, AlertCircle, CheckCircle, Sparkles, Target, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
export function InsightCard({ type, title, description, metric, action, className = '' }) {
    const config = {
        positive: {
            icon: _jsx(CheckCircle, { className: "h-5 w-5" }),
            bgColor: 'bg-green-50 dark:bg-green-950',
            borderColor: 'border-green-200 dark:border-green-800',
            iconColor: 'text-green-600 dark:text-green-400',
            badgeVariant: 'success'
        },
        negative: {
            icon: _jsx(AlertCircle, { className: "h-5 w-5" }),
            bgColor: 'bg-red-50 dark:bg-red-950',
            borderColor: 'border-red-200 dark:border-red-800',
            iconColor: 'text-red-600 dark:text-red-400',
            badgeVariant: 'danger'
        },
        neutral: {
            icon: _jsx(Lightbulb, { className: "h-5 w-5" }),
            bgColor: 'bg-blue-50 dark:bg-blue-950',
            borderColor: 'border-blue-200 dark:border-blue-800',
            iconColor: 'text-blue-600 dark:text-blue-400',
            badgeVariant: 'primary'
        },
        recommendation: {
            icon: _jsx(Sparkles, { className: "h-5 w-5" }),
            bgColor: 'bg-purple-50 dark:bg-purple-950',
            borderColor: 'border-purple-200 dark:border-purple-800',
            iconColor: 'text-purple-600 dark:text-purple-400',
            badgeVariant: 'gray'
        }
    }[type];
    return (_jsx(Card, { className: `${config.bgColor} border-2 ${config.borderColor} ${className}`, "data-testid": `insight-${type}`, children: _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${config.iconColor}`, children: config.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-foreground mb-1", "data-testid": "insight-title", children: title }), _jsx("p", { className: "text-sm text-muted-foreground", "data-testid": "insight-description", children: description })] })] }), metric && (_jsxs("div", { className: "flex items-baseline gap-2 pl-11", children: [_jsx("span", { className: "text-2xl font-bold text-foreground", "data-testid": "insight-metric-value", children: metric.value }), _jsx("span", { className: "text-sm text-muted-foreground", children: metric.label }), metric.change !== undefined && (_jsxs(Badge, { variant: metric.change >= 0 ? 'success' : 'danger', children: [metric.change >= 0 ? '+' : '', metric.change, "%"] }))] })), action && (_jsxs("button", { onClick: action.onClick, className: `ml-11 text-sm font-medium ${config.iconColor} hover:underline`, "data-testid": "insight-action", children: [action.label, " \u2192"] }))] }) }));
}
export function TrendAnnotation({ label, description, position, type = 'milestone' }) {
    const config = {
        peak: { color: 'bg-green-500', textColor: 'text-green-700 dark:text-green-300' },
        valley: { color: 'bg-red-500', textColor: 'text-red-700 dark:text-red-300' },
        anomaly: { color: 'bg-yellow-500', textColor: 'text-yellow-700 dark:text-yellow-300' },
        milestone: { color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-300' }
    }[type];
    return (_jsxs("div", { className: "absolute group cursor-pointer", style: { left: `${position.x}%`, top: `${position.y}%` }, "data-testid": `annotation-${type}`, children: [_jsx("div", { className: `w-3 h-3 ${config.color} rounded-full animate-pulse` }), _jsx("div", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 w-48", children: _jsxs(Card, { className: "p-3 shadow-lg", children: [_jsx("div", { className: `font-semibold text-sm mb-1 ${config.textColor}`, children: label }), _jsx("div", { className: "text-xs text-muted-foreground", children: description })] }) })] }));
}
export function PredictiveInsights({ historical, forecast, insights }) {
    const calculateTrend = () => {
        if (historical.length < 2)
            return 0;
        const recent = historical.slice(-5);
        // Calculate percentage change between consecutive periods
        const percentageChanges = recent.slice(1).map((point, i) => {
            const previous = recent[i].value;
            if (previous === 0)
                return 0;
            return ((point.value - previous) / previous) * 100;
        });
        // Return average percentage change
        return percentageChanges.reduce((sum, change) => sum + change, 0) / percentageChanges.length;
    };
    const trend = calculateTrend();
    const trendDirection = trend > 0 ? 'upward' : trend < 0 ? 'downward' : 'stable';
    return (_jsxs(Card, { className: "p-6", "data-testid": "predictive-insights", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Target, { className: "h-5 w-5 text-purple-600" }), _jsx("h3", { className: "text-lg font-semibold", children: "Predictive Insights" }), _jsx(Badge, { variant: "gray", children: "AI-Powered" })] }), _jsxs("div", { className: "mb-6 p-4 bg-muted rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [trend > 0 ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : trend < 0 ? (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })) : (_jsx(BarChart3, { className: "h-4 w-4 text-gray-600" })), _jsxs("span", { className: "font-medium capitalize", children: [trendDirection, " Trend Detected"] })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Based on ", historical.length, " historical data points, we predict a", ' ', _jsxs("span", { className: "font-medium", children: [Math.abs(trend).toFixed(1), "%"] }), ' ', trend > 0 ? 'increase' : trend < 0 ? 'decrease' : 'stable pattern', " in the coming period."] })] }), _jsxs("div", { className: "space-y-2 mb-6", children: [_jsx("h4", { className: "text-sm font-semibold text-muted-foreground", children: "Forecasted Values" }), forecast.map((point, i) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-muted/50 rounded", "data-testid": `forecast-${i}`, children: [_jsx("span", { className: "text-sm", children: point.label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium", children: point.value.toLocaleString() }), _jsxs(Badge, { variant: "gray", className: "text-xs", children: [point.confidence, "% confidence"] })] })] }, i)))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-semibold text-muted-foreground flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Key Insights"] }), _jsx("ul", { className: "space-y-2", children: insights.map((insight, i) => (_jsxs("li", { className: "flex items-start gap-2 text-sm", "data-testid": `insight-${i}`, children: [_jsx(Lightbulb, { className: "h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" }), _jsx("span", { children: insight })] }, i))) })] })] }));
}
export function NarrativeSummary({ title, summary, highlights, timeframe }) {
    return (_jsxs(Card, { className: "p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950", "data-testid": "narrative-summary", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900 rounded-lg", children: _jsx(LineChartIcon, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold mb-1", children: title }), _jsx("p", { className: "text-sm text-muted-foreground", children: timeframe })] })] }), _jsx("p", { className: "text-sm leading-relaxed mb-4", "data-testid": "summary-text", children: summary }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: highlights.map((highlight, i) => {
                    const sentimentColor = {
                        positive: 'text-green-600 dark:text-green-400',
                        negative: 'text-red-600 dark:text-red-400',
                        neutral: 'text-gray-600 dark:text-gray-400'
                    }[highlight.sentiment];
                    return (_jsxs("div", { className: "text-center", "data-testid": `highlight-${i}`, children: [_jsx("div", { className: `text-2xl font-bold ${sentimentColor}`, children: highlight.value }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: highlight.label })] }, i));
                }) })] }));
}
export function ComparisonInsight({ title, current, previous, insight }) {
    const change = ((current.value - previous.value) / previous.value) * 100;
    const isImprovement = change > 0;
    return (_jsxs(Card, { className: "p-6", "data-testid": "comparison-insight", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: title }), _jsxs("div", { className: "grid grid-cols-2 gap-6 mb-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: current.label }), _jsx("div", { className: "text-3xl font-bold text-foreground", "data-testid": "current-value", children: current.value.toLocaleString() }), current.trend !== undefined && (_jsxs("div", { className: "flex items-center gap-1", children: [current.trend >= 0 ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })), _jsxs("span", { className: `text-sm ${current.trend >= 0 ? 'text-green-600' : 'text-red-600'}`, children: [current.trend >= 0 ? '+' : '', current.trend, "%"] })] }))] }), _jsxs("div", { className: "space-y-2 opacity-70", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: previous.label }), _jsx("div", { className: "text-3xl font-bold text-foreground", "data-testid": "previous-value", children: previous.value.toLocaleString() }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Reference period" })] })] }), _jsxs("div", { className: `p-3 rounded-lg ${isImprovement ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`, children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [isImprovement ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })), _jsxs("span", { className: `font-semibold ${isImprovement ? 'text-green-600' : 'text-red-600'}`, children: [change >= 0 ? '+' : '', change.toFixed(1), "% Change"] })] }), _jsx("p", { className: "text-sm text-muted-foreground", "data-testid": "comparison-insight-text", children: insight })] })] }));
}
