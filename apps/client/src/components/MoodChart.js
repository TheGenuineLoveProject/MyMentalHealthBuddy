import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Mood Chart Component
 * Visualizes mood data with interactive charts
 */
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
export function MoodChart({ data, metric = 'mood', showTrend = true, height = 200, 'data-testid': testId, }) {
    // Guard against empty data
    if (!data || data.length === 0) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6", "data-testid": testId, children: _jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx("p", { children: "No mood data available" }), _jsx("p", { className: "text-sm mt-2", children: "Start logging your mood to see trends!" })] }) }));
    }
    const chartData = useMemo(() => {
        const maxValue = 5;
        const points = data.map((item, index) => {
            const value = item[metric] || item.mood;
            const x = (index / (data.length - 1)) * 100;
            const y = ((maxValue - value) / maxValue) * 100;
            return { x, y, value, date: item.date };
        });
        // Create SVG path
        const path = points
            .map((point, index) => {
            const command = index === 0 ? 'M' : 'L';
            return `${command} ${point.x}% ${point.y}%`;
        })
            .join(' ');
        // Calculate trend
        const firstValue = points[0]?.value || 0;
        const lastValue = points[points.length - 1]?.value || 0;
        const trend = lastValue - firstValue;
        const trendPercentage = ((trend / 5) * 100).toFixed(1);
        return { points, path, trend, trendPercentage };
    }, [data, metric]);
    const getColor = () => {
        if (metric === 'mood')
            return '#3b82f6'; // blue
        if (metric === 'energy')
            return '#10b981'; // green
        if (metric === 'anxiety')
            return '#f59e0b'; // orange
        return '#6b7280'; // gray
    };
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6", "data-testid": testId, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold capitalize", children: [metric, " Trend"] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Last ", data.length, " entries"] })] }), showTrend && (_jsx("div", { className: "flex items-center gap-2", children: chartData.trend > 0 ? (_jsxs(_Fragment, { children: [_jsx(TrendingUp, { className: "h-5 w-5 text-green-500" }), _jsxs("span", { className: "text-green-600 dark:text-green-400 font-semibold", children: ["+", chartData.trendPercentage, "%"] })] })) : chartData.trend < 0 ? (_jsxs(_Fragment, { children: [_jsx(TrendingDown, { className: "h-5 w-5 text-red-500" }), _jsxs("span", { className: "text-red-600 dark:text-red-400 font-semibold", children: [chartData.trendPercentage, "%"] })] })) : (_jsxs(_Fragment, { children: [_jsx(Minus, { className: "h-5 w-5 text-gray-500" }), _jsx("span", { className: "text-gray-500 font-semibold", children: "0%" })] })) }))] }), _jsxs("div", { className: "relative", style: { height: `${height}px` }, children: [_jsxs("svg", { className: "w-full h-full", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: [[0, 25, 50, 75, 100].map((y) => (_jsx("line", { x1: "0", y1: `${y}%`, x2: "100%", y2: `${y}%`, stroke: "currentColor", strokeWidth: "0.2", className: "text-gray-200 dark:text-gray-700" }, y))), chartData.points.length > 0 && (_jsx("path", { d: `${chartData.path} L 100% 100% L 0% 100% Z`, fill: getColor(), fillOpacity: "0.1" })), chartData.points.length > 0 && (_jsx("path", { d: chartData.path, fill: "none", stroke: getColor(), strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" })), chartData.points.map((point, index) => (_jsx("circle", { cx: `${point.x}%`, cy: `${point.y}%`, r: "2", fill: getColor(), className: "hover:r-3 transition-all cursor-pointer", "data-testid": `mood-point-${index}`, children: _jsx("title", { children: `${point.date}: ${point.value}/5` }) }, index)))] }), _jsx("div", { className: "absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-8", children: [5, 4, 3, 2, 1].map((value) => (_jsx("span", { children: value }, value))) })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between text-xs text-gray-500", children: [_jsx("span", { children: data[0]?.date ? new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A' }), _jsx("span", { children: data[data.length - 1]?.date ? new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A' })] }), _jsxs("div", { className: "mt-4 grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-900 rounded", children: [_jsx("div", { className: "text-2xl font-bold", style: { color: getColor() }, children: (data.reduce((sum, item) => sum + (item[metric] || item.mood), 0) / data.length).toFixed(1) }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Average" })] }), _jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-900 rounded", children: [_jsx("div", { className: "text-2xl font-bold", style: { color: getColor() }, children: Math.max(...data.map(item => item[metric] || item.mood)) }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Highest" })] }), _jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-900 rounded", children: [_jsx("div", { className: "text-2xl font-bold", style: { color: getColor() }, children: Math.min(...data.map(item => item[metric] || item.mood)) }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Lowest" })] })] })] }));
}
