import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function LineChart({ data, height = 200, showGrid = true, animate = true }) {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((point, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (point.value / maxValue) * 100;
        return `${x},${y}`;
    }).join(' ');
    return (_jsxs("div", { className: "w-full", style: { height }, "data-testid": "chart-line", children: [_jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full", children: [showGrid && (_jsx("g", { opacity: "0.1", children: [0, 25, 50, 75, 100].map(y => (_jsx("line", { x1: "0", y1: y, x2: "100", y2: y, stroke: "currentColor", strokeWidth: "0.2" }, y))) })), _jsx("polygon", { points: `0,100 ${points} 100,100`, fill: "url(#gradient)", opacity: "0.2", className: animate ? 'animate-fade-in' : '' }), _jsx("polyline", { points: points, fill: "none", stroke: "hsl(var(--primary))", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: animate ? 'animate-draw-line' : '' }), data.map((point, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 100 - (point.value / maxValue) * 100;
                        return (_jsx("circle", { cx: x, cy: y, r: "2", fill: "hsl(var(--primary))", className: "hover:r-3 transition-all cursor-pointer", "data-testid": `point-${i}`, children: _jsx("title", { children: `${point.label}: ${point.value}` }) }, i));
                    }), _jsx("defs", { children: _jsxs("linearGradient", { id: "gradient", x1: "0", x2: "0", y1: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "hsl(var(--primary))" }), _jsx("stop", { offset: "100%", stopColor: "hsl(var(--primary))", stopOpacity: "0" })] }) })] }), _jsx("div", { className: "flex justify-between mt-2 text-xs text-muted-foreground", children: data.map((point, i) => (_jsx("span", { className: "text-center", "data-testid": `label-${i}`, children: point.label }, i))) })] }));
}
export function BarChart({ data, height = 200, horizontal = false }) {
    const maxValue = Math.max(...data.map(d => d.value));
    return (_jsx("div", { className: "w-full", style: { height }, "data-testid": "chart-bar", children: _jsx("div", { className: `h-full flex ${horizontal ? 'flex-col' : 'flex-row items-end'} gap-2`, children: data.map((point, i) => {
                const percentage = (point.value / maxValue) * 100;
                return (_jsx("div", { className: `flex-1 ${horizontal ? 'flex items-center' : 'flex flex-col'}`, "data-testid": `bar-${i}`, children: horizontal ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-xs text-muted-foreground w-20 text-right pr-2", children: point.label }), _jsx("div", { className: "flex-1 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: "h-6 bg-primary rounded-full transition-all duration-500 flex items-center justify-end pr-2", style: { width: `${percentage}%` }, children: _jsx("span", { className: "text-xs text-white font-medium", children: point.value }) }) })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-full bg-primary rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer", style: { height: `${percentage}%` }, title: `${point.label}: ${point.value}` }), _jsx("span", { className: "text-xs text-muted-foreground text-center mt-1 truncate", children: point.label })] })) }, i));
            }) }) }));
}
export function PieChart({ data, size = 200, showLegend = true }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const colors = [
        'hsl(var(--primary))',
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
    ];
    let currentAngle = -90;
    const slices = data.map((point, i) => {
        const percentage = (point.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;
        // Calculate arc path
        const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
        const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
        const endX = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
        const endY = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
        const largeArc = angle > 180 ? 1 : 0;
        return {
            ...point,
            percentage,
            path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`,
            color: point.color || colors[i % colors.length],
        };
    });
    return (_jsxs("div", { className: "flex flex-col items-center gap-4", "data-testid": "chart-pie", children: [_jsxs("svg", { width: size, height: size, viewBox: "0 0 100 100", className: "hover:scale-105 transition-transform", children: [slices.map((slice, i) => (_jsx("path", { d: slice.path, fill: slice.color, className: "hover:opacity-80 cursor-pointer transition-opacity", "data-testid": `slice-${i}`, children: _jsx("title", { children: `${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)` }) }, i))), _jsx("circle", { cx: "50", cy: "50", r: "20", fill: "hsl(var(--background))" }), _jsx("text", { x: "50", y: "50", textAnchor: "middle", dominantBaseline: "middle", className: "text-sm font-bold fill-current", children: total })] }), showLegend && (_jsx("div", { className: "grid grid-cols-2 gap-2 w-full max-w-xs", children: slices.map((slice, i) => (_jsxs("div", { className: "flex items-center gap-2", "data-testid": `legend-${i}`, children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: slice.color } }), _jsxs("span", { className: "text-xs text-muted-foreground truncate", children: [slice.label, " (", slice.percentage.toFixed(0), "%)"] })] }, i))) }))] }));
}
export function AreaChart({ data, height = 200, stacked = false }) {
    const maxValue = Math.max(...data.map(d => d.value));
    return (_jsx("div", { className: "w-full", style: { height }, "data-testid": "chart-area", children: _jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "areaGradient", x1: "0", x2: "0", y1: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "hsl(var(--primary))", stopOpacity: "0.5" }), _jsx("stop", { offset: "100%", stopColor: "hsl(var(--primary))", stopOpacity: "0.05" })] }) }), data.map((point, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - (point.value / maxValue) * 100;
                    const nextX = ((i + 1) / (data.length - 1)) * 100;
                    const nextY = i < data.length - 1 ? 100 - (data[i + 1].value / maxValue) * 100 : y;
                    return (_jsx("polygon", { points: `${x},${y} ${nextX},${nextY} ${nextX},100 ${x},100`, fill: "url(#areaGradient)", className: "animate-fade-in" }, i));
                }), _jsx("polyline", { points: data.map((point, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 100 - (point.value / maxValue) * 100;
                        return `${x},${y}`;
                    }).join(' '), fill: "none", stroke: "hsl(var(--primary))", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }) }));
}
