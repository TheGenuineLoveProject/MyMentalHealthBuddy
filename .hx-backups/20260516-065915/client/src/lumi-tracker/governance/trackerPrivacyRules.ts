/**
 * Phase 33 — Tracker privacy contract.
 *
 * Module-load floor guard asserts the rule count.
 */

export interface TrackerPrivacyRule {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly enforcement: "blocking" | "advisory";
}

export const TRACKER_PRIVACY_RULES: ReadonlyArray<TrackerPrivacyRule> = Object.freeze([
  {
    id: "client-side-by-default",
    title: "Client-side storage by default",
    detail: "All tracker data lives in the user's browser. No server transmission unless the user explicitly opts in.",
    enforcement: "blocking",
  },
  {
    id: "no-server-sync-without-consent",
    title: "No server sync without explicit opt-in",
    detail: "Background sync is forbidden. Sync requires a visible per-action consent surface.",
    enforcement: "blocking",
  },
  {
    id: "exportable-as-json",
    title: "User can export all data as JSON",
    detail: "`exportTrackerDataAsJson` returns the complete client-side state in a single download.",
    enforcement: "blocking",
  },
  {
    id: "delete-all-with-one-action",
    title: "User can delete all data with one action",
    detail: "Single-call wipe (`clearAllTrackerData`) is exposed and never gated behind funnels.",
    enforcement: "blocking",
  },
  {
    id: "no-mood-data-for-marketing",
    title: "No mood data used for marketing",
    detail: "Mood / habit / sleep data is never used for ad targeting, segmentation, or persona modelling.",
    enforcement: "blocking",
  },
  {
    id: "no-third-party-analytics",
    title: "No third-party analytics on tracker data",
    detail: "Tracker payloads are excluded from any analytics pipeline (GA, Mixpanel, etc.).",
    enforcement: "blocking",
  },
]);

if (TRACKER_PRIVACY_RULES.length < 6) {
  throw new Error(
    `[lumi-tracker] TRACKER_PRIVACY_RULES floor breached: expected ≥6, got ${TRACKER_PRIVACY_RULES.length}`,
  );
}

export interface TrackerExportShape {
  readonly exportedAt: string;
  readonly moodEntries: ReadonlyArray<unknown>;
  readonly habits: ReadonlyArray<unknown>;
  readonly habitLogs: ReadonlyArray<unknown>;
}

export function exportTrackerDataAsJson(data: {
  moodEntries: ReadonlyArray<unknown>;
  habits: ReadonlyArray<unknown>;
  habitLogs: ReadonlyArray<unknown>;
}): string {
  const payload: TrackerExportShape = {
    exportedAt: new Date().toISOString(),
    moodEntries: data.moodEntries,
    habits: data.habits,
    habitLogs: data.habitLogs,
  };
  return JSON.stringify(payload, null, 2);
}
