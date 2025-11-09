/**
 * Web Vitals Hook
 * React hook for accessing web vitals metrics
 */
import { useState, useEffect } from 'react';
import { getWebVitals, onWebVitalsUpdate, getPerformanceScore, getPerformanceRecommendations } from '@/lib/webVitals';
export function useWebVitals() {
    const [metrics, setMetrics] = useState(getWebVitals());
    const [lastUpdate, setLastUpdate] = useState(null);
    const [score, setScore] = useState(0);
    const [recommendations, setRecommendations] = useState([]);
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
        hasData: metrics.lcp !== null || metrics.inp !== null || metrics.cls !== null,
    };
}
