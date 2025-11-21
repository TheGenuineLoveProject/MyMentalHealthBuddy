/**
 * Performance Monitor Component
 * Real-time performance metrics and monitoring
 */

import { useEffect, useState } from 'react';
import { Activity, Zap, Clock, Eye } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  loadTime: number;
  renderTime: number;
  apiCalls: number;
}

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  'data-testid'?: string;
}

export function PerformanceMonitor({
  show = import.meta.env.DEV,
  position = 'bottom-right',
  'data-testid': testId,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    loadTime: 0,
    renderTime: 0,
    apiCalls: 0,
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!show) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

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
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [show]);

  if (!show) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-[999] bg-black/90 text-white rounded-lg shadow-2xl border border-gray-700 font-mono text-xs overflow-hidden`}
      data-testid={testId}
    >
      {/* Compact View */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-2 hover:bg-gray-800 transition-colors text-left flex items-center justify-between gap-3"
        data-testid="button-toggle-monitor"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3" />
          <span className={metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
            {metrics.fps} FPS
          </span>
        </div>
        <span className="text-gray-400">{expanded ? '▼' : '▶'}</span>
      </button>

      {/* Expanded View */}
      {expanded && (
        <div className="p-3 space-y-2 border-t border-gray-700 min-w-[200px]">
          <MetricRow
            icon={<Zap className="h-3 w-3" />}
            label="FPS"
            value={metrics.fps}
            unit=""
            status={metrics.fps < 30 ? 'critical' : metrics.fps < 50 ? 'warning' : 'good'}
          />
          
          <MetricRow
            icon={<Eye className="h-3 w-3" />}
            label="Memory"
            value={metrics.memory}
            unit="MB"
            status={metrics.memory > 100 ? 'warning' : 'good'}
          />
          
          <MetricRow
            icon={<Clock className="h-3 w-3" />}
            label="Load"
            value={metrics.loadTime}
            unit="ms"
            status={metrics.loadTime > 3000 ? 'warning' : 'good'}
          />
          
          <div className="pt-2 border-t border-gray-700 text-center text-gray-400">
            <span className="text-[10px]">DEV MODE</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
}

function MetricRow({ icon, label, value, unit, status }: MetricRowProps) {
  const statusColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-gray-300">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`font-bold ${statusColors[status]}`}>
        {value.toFixed(0)}{unit}
      </span>
    </div>
  );
}

function getMemoryUsage(): number {
  if ('memory' in performance && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
  }
  return 0;
}

function getPageLoadTime(): number {
  if (performance.timing) {
    return performance.timing.loadEventEnd - performance.timing.navigationStart;
  }
  return 0;
}

/**
 * Hook to measure component render performance
 * Note: Measures time between renders, not actual render duration
 */
export function useRenderTime(componentName: string) {
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
export function useAPIPerformance(endpoint: string) {
  const [metrics, setMetrics] = useState({
    calls: 0,
    totalTime: 0,
    avgTime: 0,
    errors: 0,
  });

  const trackCall = async <T,>(fn: () => Promise<T>): Promise<T> => {
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
    } catch (error) {
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
