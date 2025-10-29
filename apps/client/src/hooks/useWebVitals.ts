/**
 * Web Vitals Hook
 * React hook for accessing web vitals metrics
 */

import { useState, useEffect } from 'react';
import { 
  WebVitalsMetrics, 
  WebVitalsReport, 
  getWebVitals, 
  onWebVitalsUpdate,
  getPerformanceScore,
  getPerformanceRecommendations
} from '@/lib/webVitals';

export function useWebVitals() {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>(getWebVitals());
  const [lastUpdate, setLastUpdate] = useState<WebVitalsReport | null>(null);
  const [score, setScore] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to web vitals updates
    const unsubscribe = onWebVitalsUpdate((report) => {
      setMetrics(getWebVitals());
      setLastUpdate(report);
      setScore(getPerformanceScore());
      setRecommendations(getPerformanceRecommendations());
    });

    // Initial update
    setMetrics(getWebVitals());
    setScore(getPerformanceScore());
    setRecommendations(getPerformanceRecommendations());

    return unsubscribe;
  }, []);

  return {
    metrics,
    lastUpdate,
    score,
    recommendations,
    hasData: metrics.lcp !== null || metrics.fid !== null || metrics.cls !== null,
  };
}
