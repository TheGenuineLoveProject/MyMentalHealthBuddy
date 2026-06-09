// client/src/components/admin/PlatformEvolutionPanel.jsx
// Platform Evolution Control Tool v1 — admin panel surfacing
// /api/admin/platform-evolution/status. AUDIT-ONLY, read-only: it reports
// findings + recommendations and never offers a mutate/fix action.
// Mirrors SOPMonitorPanel's v28-card chrome for visual coherence.

import { useState, useCallback } from "react";
import {
  Compass, RefreshCw, CheckCircle2, AlertTriangle, Info, XCircle,
  Lock, ShieldCheck, FileWarning, GitFork, Link2Off, Construction, Hourglass, Layers, ListChecks,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function isAuthRequiredError(err) {
  if (!err) return false;
  const msg = typeof err === "string" ? err : (err.message || String(err));
  return /^(401|403)\b/.test(msg);
}

async function fetchEvolutionStatus() {
  const userToken = (typeof localStorage !== "undefined" && localStorage.getItem("mmhb_token")) || null;
  const sessToken = (typeof sessionStorage !== "undefined" && sessionStorage.getItem("adminSessionToken")) || null;
  const candidates = [userToken, sessToken].filter((t, i, a) => t && a.indexOf(t) === i);
  const url = "/api/admin/platform-evolution/status";
  if (candidates.length === 0) {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }
  let lastErr = null;
  for (const token of candidates) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
    if (res.ok) return res.json();
    lastErr = new Error(`${res.status} ${res.statusText}`);
    if (res.status !== 401 && res.status !== 403) break;
  }
  throw lastErr;
}

const CATEGORY_ICONS = {
  "artifact-pollution": FileWarning,
  "orphaned-routes": Link2Off,
  "duplicate-ownership": GitFork,
  "exposed-stubs": Construction,
  "stale-content": Hourglass,
  "loading-risks": Layers,
};

const VERDICT_STYLE = {
  green: { bg: "var(--glp-sage-15)", fg: "var(--glp-sage-deep)", label: "Coherent" },
  amber: { bg: "var(--glp-gold-15, rgba(217,164,65,0.18))", fg: "var(--glp-gold-deep, #8a6322)", label: "Needs attention" },
  red: { bg: "var(--glp-rose-15, rgba(217,82,108,0.18))", fg: "var(--glp-rose-deep, #8a2240)", label: "Action required" },
};

function SeverityBadge({ severity, count }) {
  const map = {
    critical: { bg: "var(--glp-rose-15, rgba(217,82,108,0.18))", fg: "var(--glp-rose-deep, #8a2240)", icon: XCircle },
    warning: { bg: "var(--glp-gold-15, rgba(217,164,65,0.18))", fg: "var(--glp-gold-deep, #8a6322)", icon: AlertTriangle },
    info: { bg: "var(--glp-sage-15)", fg: "var(--glp-sage-deep)", icon: Info },
    none: { bg: "var(--glp-sage-15)", fg: "var(--glp-sage-deep)", icon: CheckCircle2 },
  };
  const s = map[severity] || map.info;
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.fg }}
      data-testid={`badge-severity-${severity}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {severity}{typeof count === "number" ? ` · ${count}` : ""}
    </span>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="v28-card rounded-2xl p-5 flex items-start gap-4" data-testid={`card-pe-summary-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent || "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide" style={{ color: "var(--glp-sage)" }}>{label}</div>
        <div className="text-2xl font-semibold mt-0.5" style={{ color: "var(--glp-ink)" }} data-testid={`text-pe-summary-${label.toLowerCase().replace(/\s+/g, "-")}`}>{value}</div>
        {sub ? <div className="text-xs mt-0.5" style={{ color: "var(--glp-sage)" }}>{sub}</div> : null}
      </div>
    </div>
  );
}

function CategorySection({ category }) {
  const [open, setOpen] = useState(category.severity === "warning" || category.severity === "critical");
  const Icon = CATEGORY_ICONS[category.id] || Compass;
  const clean = category.count === 0;
  return (
    <div className="v28-card rounded-2xl p-5" data-testid={`group-pe-${category.id}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
        data-testid={`button-toggle-pe-${category.id}`}
        aria-expanded={open}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}>
            <Icon className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold" style={{ color: "var(--glp-ink)" }}>{category.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--glp-sage)" }}>{category.description}</p>
            {category.note ? <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--glp-sage)" }}>{category.note}</p> : null}
          </div>
        </div>
        <div className="shrink-0">
          {clean ? <SeverityBadge severity="none" count={0} /> : <SeverityBadge severity={category.severity} count={category.count} />}
        </div>
      </button>

      {open && !clean ? (
        <ul className="mt-4 space-y-3" data-testid={`list-pe-findings-${category.id}`}>
          {category.findings.map((f, idx) => (
            <li key={idx} className="border-t pt-3" style={{ borderColor: "var(--glp-sage-15)" }} data-testid={`finding-pe-${category.id}-${idx}`}>
              <div className="flex items-start gap-2">
                <SeverityBadge severity={f.severity} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm" style={{ color: "var(--glp-ink)" }}>{f.message}</div>
                  {f.location ? <div className="text-xs mt-1 font-mono break-all" style={{ color: "var(--glp-sage)" }}>{f.location}</div> : null}
                  {f.recommendation ? (
                    <div className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}>
                      → {f.recommendation}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
          {category.truncated ? (
            <li className="text-xs pt-2" style={{ color: "var(--glp-sage)" }}>Results truncated — resolve the listed items, then re-run.</li>
          ) : null}
        </ul>
      ) : null}
      {open && clean ? (
        <p className="text-sm mt-4 inline-flex items-center gap-2" style={{ color: "var(--glp-sage-deep)" }}>
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> No findings in this category.
        </p>
      ) : null}
    </div>
  );
}

function RemediationPlan({ plan }) {
  const [showAll, setShowAll] = useState(false);
  const safeActions = Array.isArray(plan?.actions) ? plan.actions.filter(Boolean) : [];
  if (!plan || safeActions.length === 0) return null;
  const { totalActionable = 0, shown = 0, nextAction = null } = plan;
  const list = showAll ? safeActions : safeActions.slice(0, 5);
  return (
    <div className="v28-card rounded-2xl p-6" data-testid="panel-pe-remediation">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}>
            <ListChecks className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: "var(--glp-ink)" }}>Prioritized Next Actions</h3>
            <p className="text-sm mt-0.5" style={{ color: "var(--glp-sage)" }}>Ranked by severity, then smallest valid engine. Recommendations only — apply through the verified-patch workflow.</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-semibold leading-none" style={{ color: "var(--glp-ink)" }} data-testid="text-pe-actionable">{totalActionable}</div>
          <div className="text-xs mt-1" style={{ color: "var(--glp-sage)" }}>actionable</div>
        </div>
      </div>

      {nextAction ? (
        <div className="rounded-xl p-4 mb-4" style={{ background: "var(--glp-sage-15)" }} data-testid="card-pe-next-action">
          <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--glp-sage-deep)" }}>Do this next</div>
          <div className="text-sm font-medium" style={{ color: "var(--glp-ink)" }}>{nextAction.action}</div>
          {nextAction.location ? <div className="text-xs mt-1 font-mono break-all" style={{ color: "var(--glp-sage)" }}>{nextAction.location}</div> : null}
          {nextAction.engineHint ? <div className="text-xs mt-1.5" style={{ color: "var(--glp-sage-deep)" }}>Engine: {nextAction.engineHint}</div> : null}
        </div>
      ) : null}

      <ol className="space-y-2" data-testid="list-pe-remediation">
        {list.map((a, idx) => (
          <li key={a.priority ?? `${a.location || "action"}-${idx}`} className="flex items-start gap-3 border-t pt-2.5" style={{ borderColor: "var(--glp-sage-15)" }} data-testid={`row-pe-action-${a.priority ?? idx}`}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }} aria-hidden="true">{a.priority}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <SeverityBadge severity={a.severity} />
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}>{a.category}</span>
                {a.engine ? <span className="text-xs" style={{ color: "var(--glp-sage)" }}>{a.engine}</span> : null}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--glp-ink)" }}>{a.action}</div>
              {a.location ? <div className="text-xs mt-0.5 font-mono break-all" style={{ color: "var(--glp-sage)" }}>{a.location}</div> : null}
            </div>
          </li>
        ))}
      </ol>

      {safeActions.length > 5 ? (
        <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }} data-testid="button-pe-toggle-all-actions">
          {showAll ? "Show top 5" : `Show all ${safeActions.length}`}
        </button>
      ) : null}
      {totalActionable > shown ? (
        <p className="text-xs mt-3" style={{ color: "var(--glp-sage)" }}>{shown} of {totalActionable} actionable findings shown (capped). Resolve the top items, then re-scan.</p>
      ) : null}
    </div>
  );
}

function TrendBadge({ trend }) {
  if (!trend) return null;
  const delta = typeof trend.delta === "number" ? trend.delta : 0;
  const direction = trend.direction || "flat";
  const map = {
    up: { icon: TrendingUp, bg: "var(--glp-sage-15)", fg: "var(--glp-sage-deep)", label: `+${delta}` },
    down: { icon: TrendingDown, bg: "var(--glp-rose-15, rgba(217,82,108,0.18))", fg: "var(--glp-rose-deep, #8a2240)", label: `${delta}` },
    flat: { icon: Minus, bg: "var(--glp-sage-15)", fg: "var(--glp-sage)", label: "no change" },
  };
  const s = map[direction] || map.flat;
  const Icon = s.icon;
  const verb = direction === "up" ? "improved" : direction === "down" ? "dropped" : "unchanged";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.fg }}
      data-testid="badge-pe-trend"
      title={`Score ${verb} vs previous scan (${trend.previousScore ?? "—"})`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" /> {s.label}
    </span>
  );
}

function HistorySparkline({ history }) {
  const pts = (Array.isArray(history) ? history : []).slice(-16);
  if (pts.length < 2) return null;
  const verdictColor = (v) =>
    v === "green" ? "var(--glp-sage)" : v === "amber" ? "var(--glp-gold, #d9a441)" : "var(--glp-rose, #d9526c)";
  const latest = pts[pts.length - 1];
  return (
    <div className="v28-card rounded-2xl p-5" data-testid="panel-pe-history">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--glp-ink)" }}>Health Trend</h3>
        <span className="text-xs" style={{ color: "var(--glp-sage)" }}>last {pts.length} recorded changes</span>
      </div>
      <div
        className="flex items-end gap-1 h-20"
        role="img"
        aria-label={`Platform health score across the last ${pts.length} recorded changes; most recent ${latest.score} out of 100`}
      >
        {pts.map((p, i) => (
          <div
            key={p.at || i}
            className="flex-1 rounded-t"
            style={{ height: `${Math.max(4, Math.min(100, p.score ?? 0))}%`, background: verdictColor(p.verdict), minWidth: 3 }}
            title={`${p.score}/100${p.at ? ` · ${new Date(p.at).toLocaleString()}` : ""}`}
            data-testid={`bar-pe-history-${i}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: "var(--glp-sage)" }}>
        <span>{pts[0].at ? new Date(pts[0].at).toLocaleDateString() : "start"}</span>
        <span>now · {latest.score}/100</span>
      </div>
    </div>
  );
}

export default function PlatformEvolutionPanel() {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["/api/admin/platform-evolution/status"],
    queryFn: fetchEvolutionStatus,
    refetchOnWindowFocus: false,
    staleTime: 30000,
    retry: 1,
  });

  const handleRetry = useCallback(() => { refetch(); }, [refetch]);

  if (isLoading) {
    return (
      <div className="v28-card rounded-2xl p-8" data-testid="state-pe-loading">
        <div className="flex items-center gap-3 mb-4">
          <Compass className="w-5 h-5" style={{ color: "var(--glp-sage)" }} aria-hidden="true" />
          <h2 className="text-lg font-semibold" style={{ color: "var(--glp-ink)" }}>Platform Evolution</h2>
        </div>
        <p className="text-sm" style={{ color: "var(--glp-sage)" }}>Scanning the codebase for coherence gaps…</p>
      </div>
    );
  }

  if (error && isAuthRequiredError(error)) {
    return (
      <div className="v28-card rounded-2xl p-8" role="status" data-testid="state-pe-needs-auth">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 mt-0.5" style={{ color: "var(--glp-sage)" }} aria-hidden="true" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--glp-ink)" }}>Platform Evolution — sign in as admin to view</h2>
            <p className="text-sm mb-4" style={{ color: "var(--glp-sage)" }}>The audit endpoint correctly required authentication (401/403). This panel will populate once your admin session is active.</p>
            <button type="button" onClick={handleRetry} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }} data-testid="button-retry-pe">
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> Retry after signing in
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="v28-card rounded-2xl p-8" data-testid="state-pe-error">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 mt-0.5" style={{ color: "var(--glp-rose)" }} aria-hidden="true" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--glp-ink)" }}>Platform Evolution unavailable</h2>
            <p className="text-xs font-mono mb-4" style={{ color: "var(--glp-rose)" }}>{String(error?.message || error)}</p>
            <button type="button" onClick={handleRetry} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }} data-testid="button-retry-pe">
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { score = 0, verdict = "amber", summary = {}, categories = [], filesScanned = 0, durationMs = 0, generatedAt, remediationPlan = null, trend = null, history = [] } = data;
  const v = VERDICT_STYLE[verdict] || VERDICT_STYLE.amber;

  return (
    <div className="space-y-6" data-testid="panel-platform-evolution">
      {/* Header */}
      <div className="v28-card rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}>
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--glp-ink)" }}>Platform Evolution Control Tool <span className="text-xs font-normal opacity-60">v1 · audit-only</span></h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--glp-sage)" }}>Static coherence audit — orphaned routes, stale content, artifact pollution, duplicate ownership, exposed stubs, loading risks. Reports only; never edits.</p>
              <p className="text-xs mt-1" style={{ color: "var(--glp-sage)" }}>Scanned {filesScanned} files · {durationMs}ms · {generatedAt ? new Date(generatedAt).toLocaleTimeString() : "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-3xl font-semibold leading-none" style={{ color: v.fg }} data-testid="text-pe-score">{score}</div>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: v.bg, color: v.fg }} data-testid="badge-pe-verdict">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> {v.label}
              </span>
              <div className="mt-1 flex justify-end"><TrendBadge trend={trend} /></div>
            </div>
            <button type="button" onClick={handleRetry} disabled={isFetching} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }} data-testid="button-refresh-pe">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
              {isFetching ? "Scanning…" : "Re-scan"}
            </button>
          </div>
        </div>
      </div>

      {/* Health trend sparkline */}
      <HistorySparkline history={history} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={Compass} label="Findings" value={summary.total ?? 0} sub="total" />
        <SummaryCard icon={XCircle} label="Critical" value={summary.critical ?? 0} sub={summary.critical ? "fix first" : "none"} accent="var(--glp-rose-15, rgba(217,82,108,0.18))" />
        <SummaryCard icon={AlertTriangle} label="Warning" value={summary.warning ?? 0} sub={summary.warning ? "review" : "none"} accent="var(--glp-gold-15, rgba(217,164,65,0.18))" />
        <SummaryCard icon={Info} label="Info" value={summary.info ?? 0} sub="advisory" />
      </div>

      {/* Prioritized remediation plan */}
      <RemediationPlan plan={remediationPlan} />

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((c) => (
          <CategorySection key={c.id} category={c} />
        ))}
      </div>

      {/* Audit-only governance note */}
      <div className="text-xs flex items-start gap-2" style={{ color: "var(--glp-sage)" }}>
        <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
        <p>Audit-only by design: this tool recommends, it never auto-edits production files, routes, schema, auth, payments, or crisis/clinical content. Apply fixes manually through the normal verified-patch workflow.</p>
      </div>
    </div>
  );
}
