import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Narrative Chart Component
 * Enhanced charts with integrated trend annotations and storytelling features
 */
import { LineChart } from '@/components/Charts';
import { TrendAnnotation } from '@/components/DataStorytelling';
/**
 * NarrativeLineChart - LineChart with integrated trend annotations
 * Automatically calculates annotation positions based on data points
 */
export function NarrativeLineChart({ data, annotations = [], height = 200, showGrid = true, animate = true, title }) {
    const maxValue = Math.max(...data.map(d => d.value));
    // Calculate annotation positions
    const annotationPositions = annotations.map(annotation => {
        const dataPoint = data[annotation.dataIndex];
        if (!dataPoint)
            return null;
        const x = (annotation.dataIndex / (data.length - 1)) * 100;
        const y = 100 - (dataPoint.value / maxValue) * 100;
        return {
            ...annotation,
            position: { x, y }
        };
    }).filter(Boolean);
    return (_jsxs("div", { className: "space-y-2", "data-testid": "narrative-line-chart", children: [title && (_jsx("h4", { className: "text-sm font-semibold text-muted-foreground", children: title })), _jsxs("div", { className: "relative", children: [_jsx(LineChart, { data: data, height: height, showGrid: showGrid, animate: animate }), _jsx("div", { className: "absolute inset-0 pointer-events-auto", children: _jsx("div", { className: "relative w-full h-full", children: annotationPositions.map((annotation, i) => (_jsx(TrendAnnotation, { label: annotation.label, description: annotation.description, position: annotation.position, type: annotation.type }, i))) }) })] })] }));
}
/**
 * Auto-detect peaks, valleys, and anomalies in data
 * Returns suggested annotations based on statistical analysis
 */
export function detectTrendAnnotations(data) {
    if (data.length < 3)
        return [];
    const annotations = [];
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
    data.forEach((point, i) => {
        // Skip first and last points
        if (i === 0 || i === data.length - 1)
            return;
        const prev = data[i - 1].value;
        const next = data[i + 1].value;
        const current = point.value;
        // Detect peak (local maximum)
        if (current > prev && current > next && current > mean) {
            const percentAboveMean = ((current - mean) / mean) * 100;
            annotations.push({
                label: '📈 Peak',
                description: `${point.label}: ${current.toLocaleString()} (${percentAboveMean.toFixed(1)}% above average)`,
                dataIndex: i,
                type: 'peak'
            });
        }
        // Detect valley (local minimum)
        if (current < prev && current < next && current < mean) {
            const percentBelowMean = ((mean - current) / mean) * 100;
            annotations.push({
                label: '📉 Valley',
                description: `${point.label}: ${current.toLocaleString()} (${percentBelowMean.toFixed(1)}% below average)`,
                dataIndex: i,
                type: 'valley'
            });
        }
        // Detect anomaly (>2 standard deviations from mean)
        if (Math.abs(current - mean) > 2 * stdDev) {
            annotations.push({
                label: '⚡ Anomaly',
                description: `${point.label}: Unusual activity detected (${current.toLocaleString()})`,
                dataIndex: i,
                type: 'anomaly'
            });
        }
    });
    // Limit to most significant annotations (max 5)
    return annotations.slice(0, 5);
}
