import { jsx as _jsx } from "react/jsx-runtime";
import { PerformanceDashboard } from '@/components/PerformanceDashboard';
/**
 * Performance Monitoring Page
 * Real-time performance metrics and optimization insights
 */
export default function PerformancePage() {
    return (_jsx("div", { className: "container mx-auto p-6 max-w-7xl", children: _jsx(PerformanceDashboard, {}) }));
}
