import { useCallback, useEffect, useRef } from "react";

const ANALYTICS_ENDPOINT = "/api/analytics/events";

export function useAnalytics(options = {}) {
  const { userId = null, sessionId = null } = options;
  const queueRef = useRef([]);
  const timerRef = useRef(null);

  const flush = useCallback(async () => {
    if (queueRef.current.length === 0) return;

    const events = [...queueRef.current];
    queueRef.current = [];

    try {
      await fetch(ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
        credentials: "include"
      });
    } catch (error) {
      queueRef.current = [...events, ...queueRef.current];
      console.warn("Analytics flush failed:", error);
    }
  }, []);

  const track = useCallback((eventName, properties = {}) => {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        userId,
        sessionId,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
        userAgent: navigator.userAgent
      }
    };

    queueRef.current.push(event);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(flush, 2000);
  }, [userId, sessionId, flush]);

  const trackPageView = useCallback((pageName, properties = {}) => {
    track("page_view", {
      page: pageName || document.title,
      referrer: document.referrer,
      ...properties
    });
  }, [track]);

  const trackClick = useCallback((elementId, properties = {}) => {
    track("click", {
      element: elementId,
      ...properties
    });
  }, [track]);

  const trackFeatureUse = useCallback((featureName, properties = {}) => {
    track("feature_use", {
      feature: featureName,
      ...properties
    });
  }, [track]);

  const trackError = useCallback((errorType, errorMessage, properties = {}) => {
    track("error", {
      errorType,
      errorMessage,
      ...properties
    });
  }, [track]);

  const trackTiming = useCallback((category, variable, time, properties = {}) => {
    track("timing", {
      category,
      variable,
      time,
      ...properties
    });
  }, [track]);

  const startTimer = useCallback((timerName) => {
    return {
      name: timerName,
      startTime: performance.now()
    };
  }, []);

  const endTimer = useCallback((timer, properties = {}) => {
    if (!timer || !timer.startTime) return;
    const elapsed = Math.round(performance.now() - timer.startTime);
    trackTiming("user_action", timer.name, elapsed, properties);
    return elapsed;
  }, [trackTiming]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      flush();
    };
  }, [flush]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (queueRef.current.length > 0) {
        const events = queueRef.current;
        navigator.sendBeacon(
          ANALYTICS_ENDPOINT,
          JSON.stringify({ events })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return {
    track,
    trackPageView,
    trackClick,
    trackFeatureUse,
    trackError,
    trackTiming,
    startTimer,
    endTimer,
    flush
  };
}

export default useAnalytics;
