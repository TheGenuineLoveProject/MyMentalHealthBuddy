import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
export function BarChart({ data, title, height = 200, showTrend = false, testId }) {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const trend = useMemo(() => {
        if (data.length < 2)
            return 0;
        const recent = data.slice(-3).reduce((sum, d) => sum + d.value, 0) / Math.min(3, data.length);
        const previous = data.slice(0, -3).reduce((sum, d) => sum + d.value, 0) / Math.max(1, data.length - 3);
        return ((recent - previous) / Math.max(previous, 1)) * 100;
    }, [data]);
    const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus;
    const trendColor = trend > 5 ? 'text-green-600' : trend < -5 ? 'text-red-600' : 'text-gray-500';
    return (_jsxs("div", { className: "space-y-4", ...(testId && { 'data-testid': testId }), children: [title && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: title }), showTrend && (_jsxs("div", { className: `flex items-center gap-1 text-sm ${trendColor}`, "data-testid": `${testId}-trend`, children: [_jsx(TrendIcon, { className: "h-4 w-4" }), _jsxs("span", { children: [Math.abs(trend).toFixed(1), "%"] })] }))] })), _jsx("div", { className: "space-y-2", style: { height: `${height}px` }, children: data.map((point, index) => (_jsxs("div", { className: "flex items-center gap-3", "data-testid": `${testId}-bar-${index}`, children: [_jsx("span", { className: "text-sm text-muted-foreground w-24 truncate", children: point.label }), _jsx("div", { className: "flex-1 bg-muted rounded-full h-8 relative overflow-hidden", children: _jsx("div", { className: "h-full rounded-full transition-all duration-500 flex items-center justify-end px-2", style: {
                                    width: `${(point.value / maxValue) * 100}%`,
                                    backgroundColor: point.color || 'hsl(var(--primary))'
                                }, children: _jsx("span", { className: "text-xs font-medium text-white", children: point.value }) }) })] }, index))) })] }));
}
export function LineChart({ data, title, height = 200, showTrend = false, testId }) {
    if (!data || data.length === 0) {
        return (_jsxs("div", { className: "space-y-4", ...(testId && { 'data-testid': testId }), children: [title && _jsx("h3", { className: "font-semibold", children: title }), _jsx("div", { className: "flex items-center justify-center h-48 text-muted-foreground", children: "No data available" })] }));
    }
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const minValue = Math.min(...data.map(d => d.value), 0);
    const range = maxValue - minValue || 1;
    const points = data.map((point, index) => {
        const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
        const y = 100 - ((point.value - minValue) / range) * 100;
        return `${x},${y}`;
    }).join(' ');
    const trend = useMemo(() => {
        if (data.length < 2)
            return 0;
        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));
        const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
        return ((secondAvg - firstAvg) / Math.max(firstAvg, 1)) * 100;
    }, [data]);
    const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus;
    const trendColor = trend > 5 ? 'text-green-600' : trend < -5 ? 'text-red-600' : 'text-gray-500';
    return (_jsxs("div", { className: "space-y-4", ...(testId && { 'data-testid': testId }), children: [title && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: title }), showTrend && (_jsxs("div", { className: `flex items-center gap-1 text-sm ${trendColor}`, "data-testid": `${testId}-trend`, children: [_jsx(TrendIcon, { className: "h-4 w-4" }), _jsxs("span", { children: [Math.abs(trend).toFixed(1), "%"] })] }))] })), _jsxs("div", { className: "relative", style: { height: `${height}px` }, children: [_jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full", preserveAspectRatio: "none", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "lineGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "hsl(var(--primary))", stopOpacity: "0.3" }), _jsx("stop", { offset: "100%", stopColor: "hsl(var(--primary))", stopOpacity: "0" })] }) }), _jsx("polyline", { points: `0,100 ${points} 100,100`, fill: "url(#lineGradient)", stroke: "none" }), _jsx("polyline", { points: points, fill: "none", stroke: "hsl(var(--primary))", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), data.map((point, index) => {
                                const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
                                const y = 100 - ((point.value - minValue) / range) * 100;
                                return (_jsx("circle", { cx: x, cy: y, r: "3", fill: "hsl(var(--primary))", className: "cursor-pointer hover:r-4 transition-all", "data-testid": `${testId}-point-${index}`, children: _jsx("title", { children: `${point.label}: ${point.value}` }) }, index));
                            })] }), _jsxs("div", { className: "flex justify-between mt-2 text-xs text-muted-foreground", children: [_jsx("span", { children: data[0]?.label }), _jsx("span", { children: data[data.length - 1]?.label })] })] })] }));
}
export function PieChart({ data, title, height = 200, testId }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;
    const slices = data.map((point, index) => {
        const percentage = (point.value / total) * 100;
        const angle = (point.value / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;
        const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
        const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
        const x2 = 50 + 40 * Math.cos((currentAngle - 90) * Math.PI / 180);
        const y2 = 50 + 40 * Math.sin((currentAngle - 90) * Math.PI / 180);
        const largeArc = angle > 180 ? 1 : 0;
        return {
            ...point,
            percentage,
            path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`
        };
    });
    const colors = [
        'hsl(var(--primary))',
        'hsl(220, 90%, 56%)',
        'hsl(142, 71%, 45%)',
        'hsl(38, 92%, 50%)',
        'hsl(345, 83%, 61%)',
        'hsl(262, 83%, 58%)'
    ];
    return (_jsxs("div", { className: "space-y-4", ...(testId && { 'data-testid': testId }), children: [title && _jsx("h3", { className: "font-semibold", children: title }), _jsxs("div", { className: "flex flex-col md:flex-row gap-6 items-center", children: [_jsx("svg", { viewBox: "0 0 100 100", className: "w-48 h-48", children: slices.map((slice, index) => (_jsx("path", { d: slice.path, fill: slice.color || colors[index % colors.length], className: "cursor-pointer hover:opacity-80 transition-opacity", "data-testid": `${testId}-slice-${index}`, children: _jsx("title", { children: `${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)` }) }, index))) }), _jsx("div", { className: "space-y-2 flex-1", children: slices.map((slice, index) => (_jsxs("div", { className: "flex items-center gap-2", "data-testid": `${testId}-legend-${index}`, children: [_jsx("div", { className: "w-4 h-4 rounded", style: { backgroundColor: slice.color || colors[index % colors.length] } }), _jsx("span", { className: "text-sm flex-1", children: slice.label }), _jsxs("span", { className: "text-sm font-medium", children: [slice.percentage.toFixed(1), "%"] })] }, index))) })] })] }));
}
export function StatCard({ label, value, trend, icon: Icon, testId }) {
    const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus;
    const trendColor = trend && trend > 0 ? 'text-green-600' : trend && trend < 0 ? 'text-red-600' : 'text-gray-500';
    return (_jsxs("div", { className: "bg-card p-6 rounded-lg border shadow-sm", ...(testId && { 'data-testid': testId }), children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: label }), _jsx("p", { className: "text-2xl font-bold", "data-testid": `${testId}-value`, children: value })] }), Icon && (_jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: _jsx(Icon, { className: "h-5 w-5 text-primary" }) }))] }), trend !== undefined && (_jsxs("div", { className: `flex items-center gap-1 mt-2 text-sm ${trendColor}`, "data-testid": `${testId}-trend`, children: [_jsx(TrendIcon, { className: "h-4 w-4" }), _jsxs("span", { children: [Math.abs(trend).toFixed(1), "% from last period"] })] }))] }));
}
