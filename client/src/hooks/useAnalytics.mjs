import { useCallback, useRef, useEffect } from "react";
import { useLocation } from "wouter";

let sessionId = null;
function getSessionId() {
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
  return sessionId;
}

function isOptedOut() {
  try {
    return localStorage.getItem("analytics_opt_out") === "true";
  } catch {
    return false;
  }
}

async function sendEvent(eventName, eventCategory, path, meta) {
  if (isOptedOut()) return;
  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-id": getSessionId(),
      },
      body: JSON.stringify({
        event_name: eventName,
        event_category: eventCategory,
        path: path || window.location.pathname,
        meta: meta || null,
      }),
    });
  } catch {
  }
}

export function trackEvent(name, category, meta) {
  sendEvent(name, category, null, meta);
}

export function trackPageView(path) {
  sendEvent("page_view", "navigation", path);
}

export function usePageViewTracker() {
  const [location] = useLocation();
  const lastPath = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (location === lastPath.current) return;
    lastPath.current = location;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      trackPageView(location);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [location]);
}

export function useAnalytics() {
  const track = useCallback((name, category, meta) => {
    trackEvent(name, category, meta);
  }, []);

  const trackPage = useCallback((path) => {
    trackPageView(path);
  }, []);

  return { trackEvent: track, trackPageView: trackPage };
}
