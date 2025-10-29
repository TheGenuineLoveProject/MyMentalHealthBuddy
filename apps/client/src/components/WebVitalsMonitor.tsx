/**
 * Web Vitals Monitor
 * Development tool to display Core Web Vitals in real-time
 */

import { useWebVitals } from '@/hooks/useWebVitals';
import { Activity, Zap, Layout, Eye } from 'lucide-react';

export function WebVitalsMonitor() {
  const { metrics, score, hasData } = useWebVitals();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!hasData) {
    return null;
  }

  const formatMetric = (value: number | null, unit: string = 'ms', decimals?: number): string => {
    if (value === null) return 'N/A';
    if (decimals !== undefined) {
      return `${value.toFixed(decimals)}${unit}`;
    }
    return `${Math.round(value)}${unit}`;
  };

  const getRatingColor = (value: number | null, thresholds: { good: number; poor: number }): string => {
    if (value === null) return 'text-gray-400';
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.poor) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-xs"
      data-testid="web-vitals-monitor"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Web Vitals
        </h3>
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-blue-500" aria-hidden="true" />
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {score}/100
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {/* LCP */}
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-gray-500" aria-hidden="true" />
          <span className="text-gray-600 dark:text-gray-400">LCP:</span>
          <span 
            className={getRatingColor(metrics.lcp, { good: 2500, poor: 4000 })}
            data-testid="metric-lcp"
          >
            {formatMetric(metrics.lcp)}
          </span>
        </div>

        {/* INP */}
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-gray-500" aria-hidden="true" />
          <span className="text-gray-600 dark:text-gray-400">INP:</span>
          <span 
            className={getRatingColor(metrics.inp, { good: 200, poor: 500 })}
            data-testid="metric-inp"
          >
            {formatMetric(metrics.inp)}
          </span>
        </div>

        {/* CLS */}
        <div className="flex items-center gap-1">
          <Layout className="h-3 w-3 text-gray-500" aria-hidden="true" />
          <span className="text-gray-600 dark:text-gray-400">CLS:</span>
          <span 
            className={getRatingColor(metrics.cls, { good: 0.1, poor: 0.25 })}
            data-testid="metric-cls"
          >
            {formatMetric(metrics.cls, '', 2)}
          </span>
        </div>

        {/* FCP */}
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400 text-xs">FCP:</span>
          <span 
            className={getRatingColor(metrics.fcp, { good: 1800, poor: 3000 })}
            data-testid="metric-fcp"
          >
            {formatMetric(metrics.fcp)}
          </span>
        </div>

        {/* TTFB */}
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400 text-xs">TTFB:</span>
          <span 
            className={getRatingColor(metrics.ttfb, { good: 800, poor: 1800 })}
            data-testid="metric-ttfb"
          >
            {formatMetric(metrics.ttfb)}
          </span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            score >= 90 ? 'bg-green-500' :
            score >= 50 ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Performance score: ${score} out of 100`}
        />
      </div>
    </div>
  );
}
