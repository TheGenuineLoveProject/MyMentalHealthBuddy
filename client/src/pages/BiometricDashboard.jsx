import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Heart, Activity, Moon, Footprints, ArrowLeft, AlertTriangle,
  Loader2, RefreshCw, Plug, PlugZap, Plus, Info,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";

const STATE_COLOR = {
  ventral:     "from-emerald-400 via-teal-400 to-cyan-400",
  sympathetic: "from-amber-400 via-orange-400 to-rose-400",
  dorsal:      "from-slate-400 via-indigo-400 to-purple-400",
  unknown:     "from-slate-300 via-slate-400 to-slate-500",
};
const STATE_LABEL = {
  ventral: "Ventral · Calm engagement",
  sympathetic: "Sympathetic · Mobilized",
  dorsal: "Dorsal · Conserving energy",
  unknown: "State not yet inferable",
};

const METRIC_ICON = {
  HRV_RMSSD: Activity, HRV_SDNN: Activity,
  HEART_RATE_RESTING: Heart, HEART_RATE_AVG: Heart, HEART_RATE_MAX: Heart,
  SLEEP_TOTAL_MIN: Moon, SLEEP_DEEP_MIN: Moon, SLEEP_REM_MIN: Moon,
  SLEEP_LIGHT_MIN: Moon, SLEEP_AWAKE_MIN: Moon, SLEEP_EFFICIENCY_PCT: Moon,
  ACTIVITY_STEPS: Footprints, ACTIVITY_KCAL: Footprints,
};

function metricLabel(t) {
  return t.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function ConnectionRow({ source, connection, onSync, isSyncing }) {
  const connected = !!connection?.id;
  return (
    <div
      className="flex items-center justify-between rounded-xl v28-card px-3 py-2"
      data-testid={`row-connection-${source}`}
    >
      <div className="flex items-center gap-2">
        {connected ? (
          <PlugZap className="h-4 w-4 text-emerald-600 dark:text-emerald-300" aria-hidden />
        ) : (
          <Plug className="h-4 w-4 text-slate-400" aria-hidden />
        )}
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{source.replace(/_/g, " ")}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{connected ? "Connected" : "Not connected"}</p>
        </div>
      </div>
      {connected && (
        <button
          type="button"
          onClick={() => onSync(source)}
          disabled={isSyncing}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:underline disabled:opacity-50"
          data-testid={`button-sync-${source}`}
        >
          {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> : <RefreshCw className="h-3 w-3" aria-hidden />}
          Sync
        </button>
      )}
    </div>
  );
}

function ManualUploadCard({ metricsCatalog, sources }) {
  const [metricType, setMetricType] = useState("HRV_RMSSD");
  const [value, setValue] = useState("");
  const [recordedAt, setRecordedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [success, setSuccess] = useState(false);

  const meta = metricsCatalog?.[metricType];
  const mutation = useMutation({
    mutationFn: async (payload) => apiRequest("POST", "/api/biometrics/upload", payload),
    onSuccess: () => {
      setSuccess(true);
      setValue("");
      queryClient.invalidateQueries({ queryKey: ["/api/biometrics/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/biometrics/state"] });
      setTimeout(() => setSuccess(false), 2000);
    },
  });

  function submit(e) {
    e.preventDefault();
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    mutation.mutate({
      metricType,
      value: numericValue,
      recordedAt: new Date(recordedAt).toISOString(),
      deviceSource: "manual",
    });
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl v28-card p-4 space-y-3"
      data-testid="form-manual-upload"
    >
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
        <Plus className="h-4 w-4" aria-hidden /> Add a manual reading
      </h3>
      <label className="block text-xs text-slate-700 dark:text-slate-200">
        Metric
        <select
          value={metricType}
          onChange={(e) => setMetricType(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          data-testid="select-metric-type"
        >
          {Object.keys(metricsCatalog || {}).map((m) => (
            <option key={m} value={m}>{metricLabel(m)}</option>
          ))}
        </select>
      </label>
      <label className="block text-xs text-slate-700 dark:text-slate-200">
        Value{meta?.unit && <span className="text-slate-500"> ({meta.unit})</span>}
        {meta?.range && <span className="text-slate-400"> — {meta.range[0]}–{meta.range[1]}</span>}
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          min={meta?.range?.[0]}
          max={meta?.range?.[1]}
          className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          data-testid="input-metric-value"
        />
      </label>
      <label className="block text-xs text-slate-700 dark:text-slate-200">
        When
        <input
          type="datetime-local"
          value={recordedAt}
          onChange={(e) => setRecordedAt(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          data-testid="input-recorded-at"
        />
      </label>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
        data-testid="button-upload-reading"
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Save reading
      </button>
      {success && (
        <p className="text-xs text-emerald-700 dark:text-emerald-300" role="status" data-testid="text-upload-success">
          Saved.
        </p>
      )}
      {mutation.isError && (
        <p className="text-xs text-rose-600 dark:text-rose-300" role="alert" data-testid="text-upload-error">
          Could not save reading. Check that the value is in range.
        </p>
      )}
    </form>
  );
}

export default function BiometricDashboard() {
  const metaQuery = useQuery({ queryKey: ["/api/biometrics/meta"] });
  const connectionsQuery = useQuery({ queryKey: ["/api/biometrics/connections"] });
  const latestQuery = useQuery({ queryKey: ["/api/biometrics/latest"] });
  const stateQuery = useQuery({ queryKey: ["/api/biometrics/state"] });
  const [syncingSource, setSyncingSource] = useState(null);

  const meta = metaQuery.data;
  const connections = connectionsQuery.data?.connections || [];
  const connectionMap = useMemo(() => {
    const m = {};
    for (const c of connections) m[c.deviceSource] = c;
    return m;
  }, [connections]);

  const latest = latestQuery.data?.latest || latestQuery.data?.readings || [];
  const computedState = stateQuery.data?.state || stateQuery.data;

  const syncMutation = useMutation({
    mutationFn: async (source) => apiRequest("POST", `/api/biometrics/sync/${source}`, {}),
    onMutate: (source) => setSyncingSource(source),
    onSettled: () => setSyncingSource(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/biometrics/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/biometrics/state"] });
    },
  });

  const recomputeMutation = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/biometrics/state/compute", {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/biometrics/state"] }),
  });

  const isLoading = metaQuery.isLoading || connectionsQuery.isLoading || latestQuery.isLoading;
  const stateClass = STATE_COLOR[computedState?.state] || STATE_COLOR.unknown;

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO title="Biometric Dashboard | MyMentalHealthBuddy" description="Opt-in nervous system telemetry. Educational only." />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-back-dashboard">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to dashboard
          </Link>
          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-2">
            <Heart className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Body Signals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Listen to your nervous system, gently.
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl">
            Opt-in nervous-system telemetry from your wearables. Educational only — never a diagnosis.
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-16" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" aria-hidden />
            <span className="sr-only">Loading…</span>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <section
              aria-label="Nervous system state"
              className="lg:col-span-2 rounded-2xl v28-card shadow-sm overflow-hidden"
              data-testid="section-state"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${stateClass}`} aria-hidden />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {STATE_LABEL[computedState?.state] || STATE_LABEL.unknown}
                  </h2>
                  <button
                    type="button"
                    onClick={() => recomputeMutation.mutate()}
                    disabled={recomputeMutation.isPending}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:underline disabled:opacity-50"
                    data-testid="button-recompute-state"
                  >
                    {recomputeMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> : <RefreshCw className="h-3 w-3" aria-hidden />}
                    Recompute
                  </button>
                </div>
                {computedState?.confidence !== undefined && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Confidence: <strong>{Math.round((computedState.confidence || 0) * 100)}%</strong>
                  </p>
                )}
                {computedState?.rationale && (
                  <p className="text-sm text-slate-700 dark:text-slate-200" data-testid="text-state-rationale">
                    {computedState.rationale}
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                  <Info className="h-3.5 w-3.5 mt-0.5" aria-hidden />
                  <span>{stateQuery.data?.disclaimer || "Educational only. Never a clinical assessment. If you are in crisis, visit /crisis."}</span>
                </p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Latest readings</h3>
                {latest.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400" data-testid="text-readings-empty">
                    No readings yet. Connect a device or add a manual reading to begin.
                  </p>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-2" data-testid="list-readings">
                    {latest.slice(0, 8).map((r, idx) => {
                      const Icon = METRIC_ICON[r.metricType] || Activity;
                      return (
                        <li
                          key={`${r.metricType}-${r.recordedAt}-${idx}`}
                          className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2"
                          data-testid={`reading-${r.metricType}`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-indigo-500 dark:text-indigo-300" aria-hidden />
                            <div>
                              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{metricLabel(r.metricType)}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">{r.deviceSource}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {r.value} <span className="text-xs text-slate-500 dark:text-slate-400">{r.unit}</span>
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>

            <aside className="space-y-4">
              <section
                aria-label="Devices"
                className="rounded-2xl v28-card p-4 space-y-2"
                data-testid="section-connections"
              >
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Devices</h3>
                {(meta?.deviceSources || []).map((src) => (
                  <ConnectionRow
                    key={src}
                    source={src}
                    connection={connectionMap[src]}
                    onSync={(s) => syncMutation.mutate(s)}
                    isSyncing={syncingSource === src}
                  />
                ))}
              </section>

              {meta?.metrics && (
                <ManualUploadCard metricsCatalog={meta.metrics} sources={meta.deviceSources || []} />
              )}
            </aside>
          </div>
        )}

        <SafetyFooter />
      </div>
    </div>
  );
}
