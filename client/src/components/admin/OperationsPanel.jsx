import { useState, useEffect, useCallback } from "react";
import {
  Activity, Cpu, Network, Wrench, AlertCircle, CheckCircle2,
  RefreshCw, Pause, Play, Sparkles, ServerCog, ShieldAlert, Clock,
  Lock, ShieldCheck,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

function panelChrome(extra = "") {
  return `glass-premium rounded-2xl p-6 ${extra}`;
}

/* True when an apiFetch error message is a 401/403 — i.e. the route is
 * doing its job (auth required) and the viewer simply isn't signed in as
 * admin. We classify those as "needs sign-in" rather than as a red error,
 * because per SOP_FEATURE_MAP a 401/403 on a protected route is the
 * SUCCESS condition (a 200 there would be the failure). */
function isAuthRequiredError(err) {
  if (!err) return false;
  const msg = typeof err === "string" ? err : (err.message || String(err));
  return /^(401|403)\b/.test(msg);
}

function StatusDot({ state }) {
  const map = {
    ok:    { bg: "var(--glp-sage)",   ring: "var(--glp-sage-30)", label: "OK" },
    warn:  { bg: "var(--glp-gold)",   ring: "var(--glp-gold-30)", label: "Warn" },
    fail:  { bg: "var(--glp-rose)",   ring: "var(--glp-rose-30)", label: "Fail" },
    idle:  { bg: "var(--glp-sage-30)", ring: "var(--glp-sage-15)", label: "Idle" },
  };
  const s = map[state] || map.idle;
  return (
    <span className="inline-flex items-center" role="img" aria-label={s.label}>
      <span
        aria-hidden="true"
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ background: s.bg, boxShadow: `0 0 0 4px ${s.ring}` }}
      />
      <span className="sr-only">{s.label}</span>
    </span>
  );
}

function PanelHeader({ icon: Icon, title, subtitle, onRefresh, refreshing, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--glp-sage-deep)" }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm mt-0.5" style={{ color: "var(--glp-sage)" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            data-testid="button-panel-refresh"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2"
            style={{ background: "var(--glp-sage-10)", color: "var(--glp-sage-deep)" }}
            aria-label={refreshing ? "Refreshing" : "Refresh"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin motion-reduce:animate-none" : ""}`} aria-hidden="true" />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}

function PanelBodyState({ loading, error, empty, onRetry, children }) {
  if (loading) {
    return (
      <div className="py-8 text-center" role="status" aria-live="polite">
        <RefreshCw
          className="w-6 h-6 mx-auto animate-spin motion-reduce:animate-none"
          style={{ color: "var(--glp-sage)" }}
          aria-hidden="true"
        />
        <p className="text-sm mt-3" style={{ color: "var(--glp-sage)" }}>
          Loading…
        </p>
      </div>
    );
  }
  if (error) {
    // 401/403 = the viewer simply isn't signed in as admin. Render a calm,
    // neutral "sign in" placeholder (NOT a red role="alert" panel). The
    // protected route is doing its job — surfacing a scary failure here
    // would visually contradict the SOP banner that says 401/403 on
    // protected routes is the success condition.
    if (isAuthRequiredError(error)) {
      return (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "var(--glp-sage-10)", border: "1px solid var(--glp-sage-15)" }}
          role="status"
          data-testid="state-panel-needs-auth"
        >
          <Lock className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--glp-sage)" }} aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--glp-sage-deep)" }}>
              Sign in as admin to view live data
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--glp-sage)" }}>
              The endpoint correctly required authentication (401/403). This panel will populate once you authenticate.
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="text-xs font-semibold mt-2 underline"
                style={{ color: "var(--glp-sage-deep)" }}
                data-testid="button-panel-retry"
              >
                Retry after signing in
              </button>
            )}
          </div>
        </div>
      );
    }
    return (
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: "var(--glp-rose-15)", border: "1px solid var(--glp-rose-30)" }}
        role="alert"
      >
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--glp-rose)" }} aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: "var(--glp-rose-deep, #7a3041)" }}>
            {error}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs font-semibold mt-2 underline"
              style={{ color: "var(--glp-rose-deep, #7a3041)" }}
              data-testid="button-panel-retry"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }
  if (empty) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: "var(--glp-sage)" }}>
        {empty}
      </p>
    );
  }
  return children;
}

/* ---------------- AI Telemetry ---------------- */
function AITelemetryPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // /metrics defaults to Prometheus text/plain; ?format=json returns the
      // structured object (aiDiagnosesTotal, aiSafetyFilteredTotal, verdict, etc.)
      const json = await apiFetch("/api/admin/health-deep/metrics?format=json");
      setData(json);
    } catch (e) {
      setError(e.message || "Failed to load AI telemetry");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const verdict = data?.verdict || null;
  const verdictState = verdict === "HEALTHY" ? "ok" : verdict === "DEGRADED" ? "warn" : verdict === "FAIL" ? "fail" : "idle";

  return (
    <div className={panelChrome()} data-testid="panel-ai-telemetry">
      <PanelHeader
        icon={Cpu}
        title="AI Telemetry"
        subtitle="Healing-AI orchestrator + safety-filter snapshot"
        onRefresh={load}
        refreshing={loading}
      />
      <PanelBodyState loading={loading} error={error} onRetry={load}>
        {verdict && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <StatusDot state={verdictState} />
            <span className="font-medium" style={{ color: "var(--glp-sage-deep)" }} data-testid="text-ai-verdict">
              Platform verdict: {verdict}
            </span>
          </div>
        )}
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "AI diagnoses", value: data?.aiDiagnosesTotal ?? null, testId: "stat-ai-diagnoses" },
            { label: "Safety-filtered", value: data?.aiSafetyFilteredTotal ?? null, testId: "stat-ai-safety" },
            { label: "Self-heal runs", value: data?.selfHealRunsTotal ?? null, testId: "stat-ai-selfheal" },
            { label: "MTTR", value: data?.mttrMs != null ? `${data.mttrMs} ms` : null, testId: "stat-ai-mttr" },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-xl p-4"
              style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-sage-15)" }}
            >
              <dt className="text-xs uppercase tracking-wide font-medium" style={{ color: "var(--glp-sage)" }}>
                {row.label}
              </dt>
              <dd className="text-2xl font-bold mt-1" style={{ color: "var(--glp-sage-deep)" }} data-testid={row.testId}>
                {row.value ?? "—"}
              </dd>
            </div>
          ))}
        </dl>
        {(data?.aiPromptVersion || data?.alerts) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" style={{ color: "var(--glp-sage)" }}>
            {data?.aiPromptVersion && (
              <span>Prompt v{data.aiPromptVersion}</span>
            )}
            {data?.alerts && (
              <span>
                Alerts: {data.alerts.firing}/{data.alerts.total} firing
                {data.alerts.critical ? ` (${data.alerts.critical} critical)` : ""}
              </span>
            )}
            {data?.generatedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" aria-hidden="true" />
                {new Date(data.generatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </PanelBodyState>
    </div>
  );
}

/* ---------------- Health Checks ---------------- */
function HealthChecksPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // /api/admin/health-deep returns the structured probe report:
      //   { ok, verdict, totals: {pass,warn,fail}, categories: { <name>: { checks: [...] } } }
      const json = await apiFetch("/api/admin/health-deep");
      setData(json);
    } catch (e) {
      setError(e.message || "Failed to load health checks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Flatten all category checks into a single ordered list, surfacing
  // failing/warning ones first so the most important info is above the fold.
  const allChecks = [];
  const categories = data?.categories || {};
  for (const [catName, cat] of Object.entries(categories)) {
    const checks = Array.isArray(cat?.checks) ? cat.checks : [];
    for (const c of checks) {
      allChecks.push({ ...c, category: catName });
    }
  }
  const ordered = allChecks.sort((a, b) => {
    const rank = { FAIL: 0, WARN: 1, PASS: 2 };
    return (rank[a.status] ?? 3) - (rank[b.status] ?? 3);
  });
  const totals = data?.totals || {};

  return (
    <div className={panelChrome()} data-testid="panel-health-checks">
      <PanelHeader
        icon={Network}
        title="Health Checks"
        subtitle="Live probe inventory across categories (failing first)"
        onRefresh={load}
        refreshing={loading}
      />
      <PanelBodyState
        loading={loading}
        error={error}
        empty={!error && !loading && ordered.length === 0 ? "No checks returned by probe." : null}
        onRetry={load}
      >
        {Object.keys(totals).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { k: "pass", label: "Pass", state: "ok" },
              { k: "warn", label: "Warn", state: "warn" },
              { k: "fail", label: "Fail", state: "fail" },
            ].map(({ k, label, state }) => (
              <div
                key={k}
                className="rounded-lg p-3 text-center"
                style={{ background: "var(--glp-sage-10)" }}
              >
                <div className="text-xs uppercase tracking-wide flex items-center justify-center gap-1.5" style={{ color: "var(--glp-sage)" }}>
                  <StatusDot state={state} />
                  {label}
                </div>
                <div className="text-lg font-bold mt-0.5" style={{ color: "var(--glp-sage-deep)" }} data-testid={`stat-checks-${k}`}>
                  {totals[k] ?? 0}
                </div>
              </div>
            ))}
          </div>
        )}
        {ordered.length > 0 && (
          <ul
            className="divide-y max-h-72 overflow-y-auto"
            style={{ borderColor: "var(--glp-sage-15)" }}
            data-testid="list-health-checks"
          >
            {ordered.slice(0, 14).map((c, i) => {
              const state = c.status === "PASS" ? "ok" : c.status === "WARN" ? "warn" : c.status === "FAIL" ? "fail" : "idle";
              return (
                <li key={`${c.category}-${c.name || i}`} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2.5 min-w-0 flex-1">
                    <StatusDot state={state} />
                    <span className="truncate" style={{ color: "var(--glp-sage-deep)" }}>
                      <span className="text-xs uppercase tracking-wide opacity-60 mr-2">{c.category}</span>
                      {c.name}
                    </span>
                  </span>
                  {c.message && (
                    <span className="text-xs shrink-0 max-w-[40%] truncate text-right" style={{ color: "var(--glp-sage)" }} title={c.message}>
                      {c.message}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </PanelBodyState>
    </div>
  );
}

/* ---------------- Deployment Readiness ---------------- */
function ReadinessPanel() {
  const [ready, setReady] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [readyRes, detailRes] = await Promise.allSettled([
        fetch("/health/ready", { credentials: "include" }),
        fetch("/health/detailed", { credentials: "include" }),
      ]);
      if (readyRes.status === "fulfilled") {
        const ok = readyRes.value.ok;
        let body = null;
        try { body = await readyRes.value.json(); } catch { /* tolerate non-json */ }
        setReady({ ok, status: readyRes.value.status, body });
      } else {
        setReady({ ok: false, status: 0, body: { error: "fetch failed" } });
      }
      if (detailRes.status === "fulfilled" && detailRes.value.ok) {
        try { setDetail(await detailRes.value.json()); } catch { setDetail(null); }
      }
    } catch (e) {
      setError(e.message || "Failed to load readiness");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className={panelChrome()} data-testid="panel-deployment-readiness">
      <PanelHeader
        icon={Activity}
        title="Deployment Readiness"
        subtitle="503 readiness gate + detailed liveness probe"
        onRefresh={load}
        refreshing={loading}
      />
      <PanelBodyState loading={loading} error={error} onRetry={load}>
        {ready && (
          <div
            className="rounded-xl p-4 flex items-start gap-3 mb-4"
            style={{
              background: ready.ok ? "var(--glp-sage-10)" : "var(--glp-rose-15)",
              border: `1px solid ${ready.ok ? "var(--glp-sage-30)" : "var(--glp-rose-30)"}`,
            }}
          >
            {ready.ok
              ? <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
              : <ShieldAlert className="w-5 h-5 shrink-0" style={{ color: "var(--glp-rose)" }} aria-hidden="true" />
            }
            <div className="flex-1">
              <p className="font-semibold" data-testid="text-readiness-status" style={{ color: ready.ok ? "var(--glp-sage-deep)" : "var(--glp-rose-deep, #7a3041)" }}>
                {ready.ok ? "Ready to serve" : "Not ready"}
                <span className="ml-2 text-xs font-normal opacity-75">HTTP {ready.status}</span>
              </p>
              {ready.body?.checks && (
                <p className="text-xs mt-1" style={{ color: "var(--glp-sage)" }}>
                  {Object.keys(ready.body.checks).length} probe(s) reported
                </p>
              )}
            </div>
          </div>
        )}
        {detail && (
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(detail).slice(0, 8).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 px-3 py-2 rounded-lg" style={{ background: "var(--glp-paper)" }}>
                <dt className="font-medium truncate" style={{ color: "var(--glp-sage)" }}>{k}</dt>
                <dd className="truncate text-right" style={{ color: "var(--glp-sage-deep)" }} title={String(v)}>
                  {typeof v === "object" ? JSON.stringify(v).slice(0, 24) + "…" : String(v)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </PanelBodyState>
    </div>
  );
}

/* ---------------- Self-Healing Controls ---------------- */
function SelfHealingPanel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await apiFetch("/api/admin/health-deep");
      setStatus(json);
    } catch (e) {
      setError(e.message || "Failed to load self-heal status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStatus(); }, [loadStatus]);

  const runSelfHeal = async () => {
    setRunning(true);
    setLastResult(null);
    setError(null);
    try {
      const json = await apiFetch("/api/admin/health-deep/self-heal", { method: "POST" });
      setLastResult({ ok: true, ...json });
      await loadStatus();
    } catch (e) {
      setLastResult({ ok: false, error: e.message || "Self-heal failed" });
    } finally {
      setRunning(false);
      setConfirming(false);
    }
  };

  const toggleScheduler = async (action) => {
    try {
      await apiFetch(`/api/admin/health-deep/scheduler/${action}`, { method: "POST" });
      await loadStatus();
    } catch (e) {
      setError(e.message || `Scheduler ${action} failed`);
    }
  };

  const schedulerPaused = status?.scheduler?.paused === true || status?.schedulerPaused === true;
  const lastHealAt = status?.lastSelfHealAt || status?.selfHealHistory?.[0]?.at;

  return (
    <div className={panelChrome()} data-testid="panel-self-healing">
      <PanelHeader
        icon={Wrench}
        title="Self-Healing Controls"
        subtitle="Manual repair + scheduler control"
        onRefresh={loadStatus}
        refreshing={loading}
      />
      <PanelBodyState loading={loading} error={error} onRetry={loadStatus}>
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-sage-15)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ServerCog className="w-4 h-4" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: "var(--glp-sage-deep)" }}>
                  Heal scheduler
                </span>
                <StatusDot state={schedulerPaused ? "warn" : "ok"} />
                <span className="text-xs" style={{ color: "var(--glp-sage)" }}>
                  {schedulerPaused ? "Paused" : "Active"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleScheduler(schedulerPaused ? "resume" : "pause")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2"
                style={{ background: "var(--glp-sage-10)", color: "var(--glp-sage-deep)" }}
                data-testid={schedulerPaused ? "button-scheduler-resume" : "button-scheduler-pause"}
              >
                {schedulerPaused
                  ? <><Play className="w-3.5 h-3.5" aria-hidden="true" /> Resume</>
                  : <><Pause className="w-3.5 h-3.5" aria-hidden="true" /> Pause</>}
              </button>
            </div>
            {lastHealAt && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--glp-sage)" }}>
                <Clock className="w-3 h-3" aria-hidden="true" />
                Last heal: {new Date(lastHealAt).toLocaleString()}
              </p>
            )}
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-sage-15)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--glp-sage-deep)" }}>
                  Manual self-heal
                </p>
                <p className="text-xs" style={{ color: "var(--glp-sage)" }}>
                  Spawns the platform repair script (safe-only ops). Takes 5–15s.
                </p>
              </div>
              {!confirming ? (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  disabled={running}
                  className="btn-premium inline-flex items-center gap-2 shrink-0"
                  data-testid="button-self-heal-trigger"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Run self-heal
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={running}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium"
                    style={{ background: "var(--glp-sage-10)", color: "var(--glp-sage-deep)" }}
                    data-testid="button-self-heal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={runSelfHeal}
                    disabled={running}
                    className="btn-premium inline-flex items-center gap-2"
                    data-testid="button-self-heal-confirm"
                  >
                    {running ? <RefreshCw className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Sparkles className="w-4 h-4" aria-hidden="true" />}
                    {running ? "Running…" : "Confirm"}
                  </button>
                </div>
              )}
            </div>
            {lastResult && (
              <div
                className="mt-3 rounded-lg p-3 text-xs"
                style={{
                  background: lastResult.ok ? "var(--glp-sage-10)" : "var(--glp-rose-15)",
                  color: lastResult.ok ? "var(--glp-sage-deep)" : "var(--glp-rose-deep, #7a3041)",
                }}
                role="status"
                aria-live="polite"
                data-testid="text-self-heal-result"
              >
                {lastResult.ok
                  ? `✓ Heal complete${lastResult.outcome ? ` (${lastResult.outcome})` : ""}${lastResult.durationMs ? ` in ${lastResult.durationMs}ms` : ""}`
                  : `✗ ${lastResult.error}`}
              </div>
            )}
          </div>
        </div>
      </PanelBodyState>
    </div>
  );
}

/* ---------------- Route Status ----------------
 * Lightweight liveness probe for the small set of admin / public health
 * endpoints we always care about. Each row pings its endpoint, classifies
 * the response status (2xx ok, 4xx warn, 5xx/network fail) and renders a
 * StatusDot row. This is intentionally additive — the existing readiness +
 * health-deep panels stay untouched. */
function RouteStatusPanel() {
  // `protected: true` flips the success semantics for that row:
  //   protected + 401/403 → "ok"   (security boundary working as intended)
  //   protected + 200     → "fail" (security LEAK — admin data served to anon)
  // Public rows stay with the conventional 2xx-is-good classifier.
  // Source of truth for which routes are protected: docs/SOP_FEATURE_MAP.md.
  const ROUTES = [
    { label: "Public health", path: "/api/health",         protected: false },
    { label: "Admin health",  path: "/api/admin/health",   protected: true  },
    { label: "Auth (me)",     path: "/api/auth/me",        protected: true  },
    { label: "Kernel health", path: "/api/kernel/health",  protected: true  },
    { label: "Email health",  path: "/api/email/health",   protected: false },
  ];

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const probe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use raw fetch (NOT apiFetch) here on purpose: apiFetch throws on
      // non-2xx, but a probe panel needs to SEE the actual status code to
      // classify it. We *do* attach the same Authorization header apiFetch
      // would, so admin-only endpoints don't false-warn with 401/403 just
      // because the bearer token wasn't forwarded.
      const token = (() => {
        try {
          return typeof localStorage !== "undefined"
            ? localStorage.getItem("mmhb_token")
            : null;
        } catch {
          return null;
        }
      })();
      const baseHeaders = { Accept: "application/json" };
      if (token) baseHeaders.Authorization = `Bearer ${token}`;

      const results = await Promise.all(
        ROUTES.map(async (r) => {
          const t0 = (typeof performance !== "undefined" ? performance.now() : Date.now());
          try {
            const res = await fetch(r.path, {
              credentials: "include",
              headers: baseHeaders,
            });
            const dt = Math.round(
              (typeof performance !== "undefined" ? performance.now() : Date.now()) - t0
            );
            // Two-axis classifier (status × protected flag):
            //   PROTECTED route:
            //     5xx          → fail (server problem)
            //     401 / 403    → ok   (security boundary intact — the goal)
            //     2xx          → fail (LEAK — admin route served without auth)
            //     other 4xx    → warn
            //   PUBLIC route:
            //     5xx          → fail
            //     2xx          → ok
            //     4xx (incl. 401/403) → warn (public route shouldn't auth-fail)
            let state = "ok";
            if (res.status >= 500) {
              state = "fail";
            } else if (r.protected) {
              if (res.status === 401 || res.status === 403) state = "ok";
              else if (res.status >= 200 && res.status < 300) state = "fail"; // security leak
              else state = "warn";
            } else {
              if (res.status >= 200 && res.status < 300) state = "ok";
              else state = "warn";
            }
            return { ...r, status: res.status, ms: dt, state };
          } catch (e) {
            const dt = Math.round(
              (typeof performance !== "undefined" ? performance.now() : Date.now()) - t0
            );
            return { ...r, status: 0, ms: dt, state: "fail", error: e?.message };
          }
        })
      );
      setRows(results);
    } catch (e) {
      setError(e?.message || "Failed to probe routes");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { probe(); }, [probe]);

  return (
    <div className={panelChrome()} data-testid="panel-route-status">
      <PanelHeader
        icon={Network}
        title="Route Status"
        subtitle="Live probe of key admin + public endpoints"
        onRefresh={probe}
        refreshing={loading}
      />
      <PanelBodyState
        loading={loading}
        error={error}
        empty={!error && !loading && rows.length === 0 ? "No routes to probe." : null}
        onRetry={probe}
      >
        <ul className="space-y-2" data-testid="list-route-status">
          {rows.map((row) => (
            <li
              key={row.path}
              className="flex items-center gap-3 rounded-lg p-3"
              style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-sage-15)" }}
              data-testid={`row-route-${row.path}`}
            >
              <StatusDot state={row.state} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--glp-sage-deep)" }}>
                  {row.label}
                  {row.protected && (
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
                      style={{
                        background: "var(--glp-sage-15)",
                        color: "var(--glp-sage-deep)",
                      }}
                      title="Protected route — 401/403 is the success condition"
                      data-testid={`tag-route-protected-${row.path}`}
                    >
                      <Lock className="w-2.5 h-2.5" aria-hidden="true" />
                      protected
                    </span>
                  )}
                </div>
                <div className="text-xs truncate" style={{ color: "var(--glp-sage)" }}>
                  {row.path}
                </div>
              </div>
              <div
                className="text-xs font-mono shrink-0 text-right"
                style={{ color: "var(--glp-sage)" }}
                data-testid={`text-route-status-${row.path}`}
              >
                <div>{row.status === 0 ? "—" : row.status} · {row.ms}ms</div>
                {row.protected && row.state === "ok" && (
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px]" style={{ color: "var(--glp-sage-deep)" }}>
                    <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                    <span>secured</span>
                  </div>
                )}
                {row.protected && row.state === "fail" && row.status >= 200 && row.status < 300 && (
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px]" style={{ color: "var(--glp-rose-deep, #7a3041)" }}>
                    <ShieldAlert className="w-3 h-3" aria-hidden="true" />
                    <span>LEAK — auth bypassed</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </PanelBodyState>
    </div>
  );
}

/* ---------------- Default export ---------------- */
export default function OperationsPanel() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5" data-testid="section-operations">
      <AITelemetryPanel />
      <ReadinessPanel />
      <RouteStatusPanel />
      <SelfHealingPanel />
    </div>
  );
}
