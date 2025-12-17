import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";

const ANALYTICS_ENDPOINT = "/api/analytics";

type EventType =
  | "page_view"
  | "feature_click"
  | "session_start"
  | "session_end"
  | "tool_opened"
  | "tool_completed"
  | "mood_logged"
  | "journal_created"
  | "goal_set"
  | "goal_completed"
  | "auth_login"
  | "auth_logout"
  | "auth_register"
  | "subscription_viewed"
  | "error_occurred";

interface EventMetadata {
  page?: string;
  tool?: string;
  feature?: string;
  duration?: number;
  source?: string;
}

export function useAnalytics() {
  const [location] = useLocation();
  const lastTrackedPage = useRef<string | null>(null);

  const trackEvent = useCallback(
    (eventType: EventType, metadata: EventMetadata = {}) => {
      fetch(`${ANALYTICS_ENDPOINT}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventType,
          page: location,
          metadata,
        }),
      }).catch(() => {
        // Silently fail - analytics should never break the app
      });
    },
    [location]
  );

  const trackPageView = useCallback(() => {
    if (lastTrackedPage.current === location) return;
    lastTrackedPage.current = location;

    fetch(`${ANALYTICS_ENDPOINT}/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        page: location,
        referrer: typeof window !== "undefined" ? window.document?.referrer : "",
      }),
    }).catch(() => {
      // Silently fail
    });
  }, [location]);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackFeatureClick: (feature: string) =>
      trackEvent("feature_click", { feature }),
    trackToolOpened: (tool: string) => trackEvent("tool_opened", { tool }),
    trackToolCompleted: (tool: string, duration?: number) =>
      trackEvent("tool_completed", { tool, duration }),
    trackError: (source: string) => trackEvent("error_occurred", { source }),
  };
}

export default useAnalytics;
