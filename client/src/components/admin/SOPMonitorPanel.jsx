// client/src/components/admin/SOPMonitorPanel.jsx
// Platform SOP Monitor v1 — admin panel that surfaces /api/admin/sop/status.
// Read-only, additive. Mirrors OperationsPanel's glass-premium chrome.

import { useState, useCallback, useMemo } from "react";
import {
  ClipboardCheck, RefreshCw, CheckCircle2, AlertTriangle, XCircle,
  ShieldAlert, Wrench, Activity, ChevronRight, Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Use the same dual-token fetch shape as Admin.jsx (user JWT first,
// fall back to legacy admin session token).
async function fetchSopStatus() {
  const userToken = (typeof localStorage !== "undefined" && localStorage.getItem("mmhb_token")) || null;
  const sessToken = (typeof sessionStorage !== "undefined" && sessionStorage.getItem("adminSessionToken")) || null;
  const candidates = [userToken, sessToken].filter((t, i, a) => t && a.indexOf(t) === i);
  const url = "/api/admin/sop/status";
  if (candidates.length === 0) {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }
  let lastErr = null;
  for (const token of candidates) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (res.ok) return res.json();
    lastErr = new Error(`${res.status} ${res.statusText}`);
    if (res.status !== 401 && res.status !== 403) break;
  }
  throw lastErr;
}

function StatusBadge({ status }) {
  const map = {
    pass: { bg: "var(--glp-sage-15)", fg: "var(--glp-sage-deep)", icon: CheckCircle2, label: "Pass" },
    warn: { bg: "var(--glp-gold-15, rgba(217,164,65,0.18))", fg: "var(--glp-gold-deep, #8a6322)", icon: AlertTriangle, label: "Warn" },
    fail: { bg: "var(--glp-rose-15, rgba(217,82,108,0.18))", fg: "var(--glp-rose-deep, #8a2240)", icon: XCircle, label: "Fail" },
  };
  const s = map[status] || map.warn;
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.fg }}
      data-testid={`badge-status-${status}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {s.label}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div
      className="glass-premium rounded-2xl p-5 flex items-start gap-4"
      data-testid={`card-summary-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent || "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide" style={{ color: "var(--glp-sage)" }}>{label}</div>
        <div className="text-2xl font-semibold mt-0.5" style={{ color: "var(--glp-ink)" }} data-testid={`text-summary-${label.toLowerCase().replace(/\s+/g, "-")}`}>{value}</div>
        {sub ? <div className="text-xs mt-0.5" style={{ color: "var(--glp-sage)" }}>{sub}</div> : null}
      </div>
    </div>
  );
}

export default function SOPMonitorPanel() {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["/api/admin/sop/status"],
    queryFn: fetchSopStatus,
    refetchInterval: autoRefresh ? 15000 : false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    retry: 1,
  });

  const handleRetry = useCallback(() => { refetch(); }, [refetch]);

  const grouped = useMemo(() => {
    if (!data?.checks) return {};
    return data.checks.reduce((acc, c) => {
      (acc[c.domain] = acc[c.domain] || []).push(c);
      return acc;
    }, {});
  }, [data]);

  // Empty / loading skeleton
  if (isLoading) {
    return (
      <div className="glass-premium rounded-2xl p-8" data-testid="state-sop-loading">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardCheck className="w-5 h-5" style={{ color: "var(--glp-sage)" }} aria-hidden="true" />
          <h2 className="text-lg font-semibold" style={{ color: "var(--glp-ink)" }}>SOP Monitor</h2>
        </div>
        <p className="text-sm" style={{ color: "var(--glp-sage)" }}>Running platform health probes…</p>
      </div>
    );
  }

  // Error state — explicit, not infinite spinner
  if (error) {
    return (
      <div className="glass-premium rounded-2xl p-8" data-testid="state-sop-error">
        <div className="flex items-start gap-3 mb-3">
          <XCircle className="w-5 h-5 mt-0.5" style={{ color: "var(--glp-rose)" }} aria-hidden="true" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--glp-ink)" }}>SOP Monitor unavailable</h2>
            <p className="text-sm mb-2" style={{ color: "var(--glp-sage)" }}>
              The status endpoint did not respond. This usually means your admin session expired or the route isn't mounted.
            </p>
            <p className="text-xs font-mono mb-4" style={{ color: "var(--glp-rose)" }}>
              {String(error?.message || error)}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}
              data-testid="button-retry-sop"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { passing = 0, warning = 0, failing = 0, totalChecks = 0, coveragePct = 0, checks = [], nextFix, elapsedMs, timestamp } = data;

  return (
    <div className="space-y-6" data-testid="panel-sop-monitor">
      {/* Header */}
      <div className="glass-premium rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}
            >
              <ClipboardCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--glp-ink)" }}>SOP Monitor</h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--glp-sage)" }}>
                Platform feature contract — every endpoint proves entry → process → output. Read-only.
              </p>
              <p className="text-xs mt-1 inline-flex items-center gap-1.5" style={{ color: "var(--glp-sage)" }}>
                <Clock className="w-3 h-3" aria-hidden="true" />
                Last run {timestamp ? new Date(timestamp).toLocaleTimeString() : "—"} · {elapsedMs}ms
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label
              htmlFor="sop-autorefresh-toggle"
              className="inline-flex items-center gap-2 text-xs cursor-pointer select-none"
              style={{ color: "var(--glp-sage)" }}
              data-testid="label-sop-autorefresh"
            >
              <input
                id="sop-autorefresh-toggle"
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                data-testid="checkbox-sop-autorefresh"
              />
              Auto-refresh (15s)
            </label>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}
              data-testid="button-refresh-sop"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
              {isFetching ? "Running…" : "Run checks"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={CheckCircle2} label="Passing" value={passing} sub={`of ${totalChecks}`} accent="var(--glp-sage-15)" />
        <SummaryCard icon={AlertTriangle} label="Warning" value={warning} sub={warning ? "needs attention" : "none"} accent="var(--glp-gold-15, rgba(217,164,65,0.18))" />
        <SummaryCard icon={XCircle} label="Failing" value={failing} sub={failing ? "fix immediately" : "none"} accent="var(--glp-rose-15, rgba(217,82,108,0.18))" />
        <SummaryCard icon={Activity} label="Coverage" value={`${coveragePct}%`} sub={`${passing}/${totalChecks} healthy`} />
      </div>

      {/* What to fix next */}
      {nextFix ? (
        <div
          className="glass-premium rounded-2xl p-5 border-l-4"
          style={{ borderLeftColor: failing ? "var(--glp-rose)" : "var(--glp-gold, #d9a441)" }}
          data-testid="card-next-fix"
        >
          <div className="flex items-start gap-3">
            <Wrench className="w-5 h-5 mt-0.5 shrink-0" style={{ color: failing ? "var(--glp-rose)" : "var(--glp-gold, #d9a441)" }} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: failing ? "var(--glp-rose)" : "var(--glp-gold-deep, #8a6322)" }}>
                What to fix next
              </div>
              <div className="font-medium" style={{ color: "var(--glp-ink)" }} data-testid="text-next-fix-name">
                {nextFix.name} <span className="text-xs font-normal opacity-60">({nextFix.domain})</span>
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--glp-sage)" }} data-testid="text-next-fix-message">{nextFix.message}</div>
              {nextFix.remediation ? (
                <div className="text-xs mt-2 font-mono px-3 py-2 rounded-lg" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}>
                  → {nextFix.remediation}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-premium rounded-2xl p-5 border-l-4" style={{ borderLeftColor: "var(--glp-sage)" }} data-testid="card-all-passing">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
            <div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: "var(--glp-sage-deep)" }}>All clear</div>
              <div className="font-medium" style={{ color: "var(--glp-ink)" }}>Every check passing — no remediation queued.</div>
            </div>
          </div>
        </div>
      )}

      {/* Checks table grouped by domain */}
      {Object.entries(grouped).map(([domain, items]) => (
        <div key={domain} className="glass-premium rounded-2xl p-5" data-testid={`group-domain-${domain}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--glp-sage-deep)" }}>
              {domain}
            </h3>
            <span className="text-xs" style={{ color: "var(--glp-sage)" }}>
              {items.filter(i => i.status === "pass").length}/{items.length} passing
            </span>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm" data-testid={`table-checks-${domain}`}>
              <thead>
                <tr style={{ color: "var(--glp-sage)" }} className="text-xs uppercase tracking-wide">
                  <th className="text-left font-normal px-2 py-2">Check</th>
                  <th className="text-left font-normal px-2 py-2 hidden md:table-cell">Endpoint</th>
                  <th className="text-left font-normal px-2 py-2 hidden sm:table-cell">HTTP</th>
                  <th className="text-left font-normal px-2 py-2 hidden lg:table-cell">Latency</th>
                  <th className="text-left font-normal px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-t" style={{ borderColor: "var(--glp-sage-15)" }} data-testid={`row-check-${c.id}`}>
                    <td className="px-2 py-3">
                      <div className="font-medium" style={{ color: "var(--glp-ink)" }}>{c.name}</div>
                      {c.status !== "pass" && c.message ? (
                        <div className="text-xs mt-0.5" style={{ color: c.status === "fail" ? "var(--glp-rose)" : "var(--glp-gold-deep, #8a6322)" }}>
                          {c.message}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-2 py-3 font-mono text-xs hidden md:table-cell" style={{ color: "var(--glp-sage)" }}>
                      {c.endpoint}
                    </td>
                    <td className="px-2 py-3 font-mono text-xs hidden sm:table-cell" style={{ color: "var(--glp-sage)" }}>
                      {c.httpStatus ?? "—"}
                    </td>
                    <td className="px-2 py-3 text-xs hidden lg:table-cell" style={{ color: "var(--glp-sage)" }}>
                      {c.elapsedMs}ms
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Footer note */}
      <div className="text-xs flex items-start gap-2" style={{ color: "var(--glp-sage)" }}>
        <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          Routes flagged <em>protected</em> are required to return <code>401/403</code> when called without admin credentials. A <code>2xx</code> on any of those is treated as a security FAIL even if the route "works."
          Source of truth: <code>docs/SOP_FEATURE_MAP.md</code>.
        </p>
      </div>
    </div>
  );
}
