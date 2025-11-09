import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Performance Monitor Component
 * Real-time performance metrics and monitoring
 */
import { useEffect, useState } from 'react';
import { Activity, Zap, Clock, Eye } from 'lucide-react';
export function PerformanceMonitor({ show = import.meta.env.DEV, position = 'bottom-right', 'data-testid': testId, }) {
    const [metrics, setMetrics] = useState({
        fps: 0,
        memory: 0,
        loadTime: 0,
        renderTime: 0,
        apiCalls: 0,
    });
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        if (!show)
            return;
        let frameCount = 0;
        let lastTime = performance.now();
        let rafId;
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                setMetrics((prev) => ({
                    ...prev,
                    fps,
                    memory: getMemoryUsage(),
                    loadTime: getPageLoadTime(),
                }));
                frameCount = 0;
                lastTime = currentTime;
            }
            rafId = requestAnimationFrame(measureFPS);
        };
        rafId = requestAnimationFrame(measureFPS);
        return () => {
            if (rafId)
                cancelAnimationFrame(rafId);
        };
    }, [show]);
    if (!show)
        return null;
    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
    };
    return (_jsxs("div", { className: `fixed ${positionClasses[position]} z-[999] bg-black/90 text-white rounded-lg shadow-2xl border border-gray-700 font-mono text-xs overflow-hidden`, "data-testid": testId, children: [_jsxs("button", { onClick: () => setExpanded(!expanded), className: "w-full p-2 hover:bg-gray-800 transition-colors text-left flex items-center justify-between gap-3", "data-testid": "button-toggle-monitor", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "h-3 w-3" }), _jsxs("span", { className: metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400', children: [metrics.fps, " FPS"] })] }), _jsx("span", { className: "text-gray-400", children: expanded ? '▼' : '▶' })] }), expanded && (_jsxs("div", { className: "p-3 space-y-2 border-t border-gray-700 min-w-[200px]", children: [_jsx(MetricRow, { icon: _jsx(Zap, { className: "h-3 w-3" }), label: "FPS", value: metrics.fps, unit: "", status: metrics.fps < 30 ? 'critical' : metrics.fps < 50 ? 'warning' : 'good' }), _jsx(MetricRow, { icon: _jsx(Eye, { className: "h-3 w-3" }), label: "Memory", value: metrics.memory, unit: "MB", status: metrics.memory > 100 ? 'warning' : 'good' }), _jsx(MetricRow, { icon: _jsx(Clock, { className: "h-3 w-3" }), label: "Load", value: metrics.loadTime, unit: "ms", status: metrics.loadTime > 3000 ? 'warning' : 'good' }), _jsx("div", { className: "pt-2 border-t border-gray-700 text-center text-gray-400", children: _jsx("span", { className: "text-[10px]", children: "DEV MODE" }) })] }))] }));
}
function MetricRow({ icon, label, value, unit, status }) {
    const statusColors = {
        good: 'text-green-400',
        warning: 'text-yellow-400',
        critical: 'text-red-400',
    };
    return (_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-300", children: [icon, _jsx("span", { children: label })] }), _jsxs("span", { className: `font-bold ${statusColors[status]}`, children: [value.toFixed(0), unit] })] }));
}
function getMemoryUsage() {
    if ('memory' in performance && performance.memory) {
        return performance.memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return 0;
}
function getPageLoadTime() {
    if (performance.timing) {
        return performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
    return 0;
}
/**
 * Hook to measure component render performance
 * Note: Measures time between renders, not actual render duration
 */
export function useRenderTime(componentName) {
    useEffect(() => {
        const startTime = performance.now();
        return () => {
            const endTime = performance.now();
            const timeSinceMount = endTime - startTime;
            // Log if component stayed mounted for unusually long without update
            if (import.meta.env.DEV && timeSinceMount > 1000) {
                console.info(`ℹ️ ${componentName} was mounted for ${timeSinceMount.toFixed(2)}ms`);
            }
        };
    });
}
/**
 * Hook to track API call performance
 */
export function useAPIPerformance(endpoint) {
    const [metrics, setMetrics] = useState({
        calls: 0,
        totalTime: 0,
        avgTime: 0,
        errors: 0,
    });
    const trackCall = async (fn) => {
        const startTime = performance.now();
        try {
            const result = await fn();
            const endTime = performance.now();
            const duration = endTime - startTime;
            setMetrics((prev) => {
                const calls = prev.calls + 1;
                const totalTime = prev.totalTime + duration;
                return {
                    calls,
                    totalTime,
                    avgTime: totalTime / calls,
                    errors: prev.errors,
                };
            });
            if (import.meta.env.DEV && duration > 1000) {
                console.warn(`⚠️ API call to ${endpoint} took ${duration.toFixed(0)}ms`);
            }
            return result;
        }
        catch (error) {
            setMetrics((prev) => ({
                ...prev,
                calls: prev.calls + 1,
                errors: prev.errors + 1,
            }));
            throw error;
        }
    };
    return { metrics, trackCall };
}
