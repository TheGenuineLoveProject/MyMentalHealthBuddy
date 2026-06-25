// PHASE11744_HEALTH_DASHBOARD_VISUAL_TOKEN_PATCH
// PHASE11745_HEALTH_DASHBOARD_REMAINING_TOKEN_CLEANUP
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import "@/styles/glp-pane.css";
import { Server, Database, Cpu, Activity, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Clock, Shield, Zap, TrendingUp, ArrowLeft, Stethoscope, Sparkles, PauseCircle, PlayCircle, BotMessageSquare, Download, BellRing, BellOff } from 'lucide-react';
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import Top50ProcessTracker from "@/components/admin/Top50ProcessTracker";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

function StatusIndicator({ status }) {
  const statusConfig = {
    connected: { color: "text-[var(--glp-deep-teal)] bg-[rgba(143,191,159,0.22)] dark:text-[var(--glp-sage)] dark:bg-[rgba(143,191,159,0.16)]", icon: CheckCircle, label: "Connected" },
    healthy: { color: "text-[var(--glp-deep-teal)] bg-[rgba(143,191,159,0.22)] dark:text-[var(--glp-sage)] dark:bg-[rgba(143,191,159,0.16)]", icon: CheckCircle, label: "Healthy" },
    warning: { color: "text-[var(--glp-deep-teal)] bg-[rgba(212,175,55,0.22)] dark:text-[var(--glp-gold)] dark:bg-[rgba(212,175,55,0.14)]", icon: AlertTriangle, label: "Warning" },
    error: { color: "text-[var(--glp-charcoal)] bg-[rgba(244,199,195,0.34)] dark:text-[var(--glp-blossom)] dark:bg-[rgba(244,199,195,0.16)]", icon: AlertCircle, label: "Error" },
    disconnected: { color: "text-[var(--glp-charcoal)] bg-[rgba(244,199,195,0.34)] dark:text-[var(--glp-blossom)] dark:bg-[rgba(244,199,195,0.16)]", icon: AlertCircle, label: "Disconnected" },
    unknown: { color: "text-[var(--glp-charcoal)] bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)] dark:bg-[rgba(143,191,159,0.10)]", icon: Activity, label: "Unknown" }
  };
  
  const config = statusConfig[status] || statusConfig.unknown;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`} data-testid={`status-${status}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, status }) {
  return (
    <div className="bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] rounded-xl p-6 shadow-sm border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)]" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="p-2 bg-sage-100 dark:bg-sage-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-sage-600 dark:text-sage-400" />
        </div>
        {status && <StatusIndicator status={status} />}
      </div>
      <div className="mt-4">
        <p className="text-xl sm:text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{value}</p>
        <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{title}</p>
        {subtitle && <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function EnvCheckItem({ name, isSet }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.18)] last:border-0" data-testid={`env-${name.toLowerCase()}`}>
      <span className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{name}</span>
      <span className={`inline-flex items-center gap-1 text-sm ${isSet ? 'text-[var(--glp-deep-teal)]' : 'text-[var(--glp-charcoal)]'}`}>
        {isSet ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        {isSet ? "Set" : "Missing"}
      </span>
    </div>
  );
}

export default function HealthDashboard() {
  useSEO({
    title: "System Health | Admin",
    description: "Monitor system health, database status, and environment configuration"
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const { data: health, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/admin/health", refreshKey],
    refetchInterval: 30000
  });

  const { data: diagnostics } = useQuery({
    queryKey: ["/api/admin/diagnostics", refreshKey],
    refetchInterval: 60000
  });

  // Deep health surfaces the heal-360 report + heal-watch streak.
  // Read-only; the report is produced by `bash scripts/heal-all.sh` /
  // `node scripts/heal-360.mjs` / `node scripts/heal-watch.mjs`.
  const { data: deep } = useQuery({
    queryKey: ["/api/admin/health-deep", refreshKey],
    refetchInterval: 60000,
  });

  // Declarative alert rules — read-only evaluation against current state.
  // Same source of truth as the Prometheus `mmhb_alert_firing{rule}` gauge.
  const { data: alertsData } = useQuery({
    queryKey: ["/api/admin/health-deep/alerts", refreshKey],
    refetchInterval: 60000,
  });

  const { toast } = useToast();
  const reprobe = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/health-deep/run");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: `Re-probe complete: ${data?.verdict || "unknown"}`,
        description: data?.totals
          ? `${data.totals.pass || 0} pass · ${data.totals.warn || 0} warn · ${data.totals.fail || 0} fail`
          : "Probe finished.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/health-deep"] });
    },
    onError: (err) => {
      toast({
        title: "Re-probe failed",
        description: err?.message || "Try again in 30 seconds.",
        variant: "destructive",
      });
    },
  });

  // Self-heal: triggers heal-self.mjs (probe → safe-only repair → re-probe).
  // Heavier than re-probe; longer cooldown (60s) and may take ~30s to finish.
  const selfHeal = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/health-deep/self-heal");
      return res.json();
    },
    onSuccess: (data) => {
      const before = data?.before?.verdict || "?";
      const after = data?.after?.verdict || "?";
      toast({
        title: `Self-heal: ${data?.outcome || "unknown"}`,
        description: `${before} → ${after}${data?.durationMs ? ` · ${data.durationMs}ms` : ""}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/health-deep"] });
    },
    onError: (err) => {
      toast({
        title: "Self-heal failed",
        description: err?.message || "Try again in 60 seconds.",
        variant: "destructive",
      });
    },
  });

  // AI-assisted diagnosis: asks Perplexity to analyze the latest probe
  // report and return a prioritized remediation plan as structured JSON.
  // 60s cooldown + 30s timeout.  Admin-only; never touches user-facing AI.
  const aiAnalyze = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/health-deep/ai-analyze");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: `AI diagnosis: ${data?.diagnosis?.overall_severity || "unknown"} severity`,
        description: data?.diagnosis?.summary
          ? data.diagnosis.summary.slice(0, 120)
          : `${data?.model || "AI"} · ${data?.durationMs || 0}ms`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/health-deep"] });
    },
    onError: (err) => {
      toast({
        title: "AI diagnosis failed",
        description: err?.message || "Try again in 60 seconds.",
        variant: "destructive",
      });
    },
  });

  // Scheduler control mutations (pause / resume).  Both invalidate the
  // shared deep-health query so the UI pill updates immediately.
  const schedulerResume = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/health-deep/scheduler/resume");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Auto-heal scheduler resumed" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/health-deep"] });
    },
    onError: (err) => {
      toast({ title: "Resume failed", description: err?.message || "", variant: "destructive" });
    },
  });
  const schedulerPause = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/health-deep/scheduler/pause");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Auto-heal scheduler paused" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/health-deep"] });
    },
    onError: (err) => {
      toast({ title: "Pause failed", description: err?.message || "", variant: "destructive" });
    },
  });

  // Export: downloads a single JSON diagnostic bundle (probe + watch +
  // scheduler + ring buffers + alerts).  Uses fetch + blob + temp anchor
  // so the browser's download UI handles it naturally.  Auth header is
  // attached via the same Bearer-token pattern apiRequest uses.
  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const token = localStorage.getItem("adminSessionToken");
      const res = await fetch("/api/admin/health-deep/export", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        throw new Error(`Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("Content-Disposition") || "";
      const m = cd.match(/filename="?([^"]+)"?/);
      a.download = m?.[1] || `mmhb-health-bundle-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Diagnostic bundle downloaded", description: a.download });
    } catch (e) {
      toast({
        title: "Export failed",
        description: e?.message || "Could not download bundle.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)] flex items-center justify-center" data-testid="loading-state">
        <div className="animate-pulse motion-reduce:animate-none flex items-center gap-3" data-testid="loading-content">
          <RefreshCw className="w-6 h-6 animate-spin motion-reduce:animate-none text-sage-600" />
          <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Loading health data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <AdminErrorBanner title="Unable to load health data" onRetry={refetch} />;
  }

  const dbStatus = health?.database?.status || "unknown";
  const envConfig = health?.environment || {};
  const systemInfo = health?.system || diagnostics?.diagnostics?.server || {};
  const memoryInfo = diagnostics?.diagnostics?.memory || {};

  return (
    <div className="min-h-screen bg-[var(--glp-ivory)] dark:bg-[var(--glp-charcoal)] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-[rgba(143,191,159,0.18)] dark:hover:bg-[rgba(143,191,159,0.14)] rounded-lg transition" data-testid="link-admin-back" aria-label="Back to admin">
              <ArrowLeft className="w-5 h-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">System Health</h1>
              <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Real-time monitoring and diagnostics</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] rounded-lg hover:bg-[var(--glp-charcoal)] transition min-h-[44px] shadow-sm"
            data-testid="btn-refresh"
            aria-label="Refresh health data"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="System Status"
            value={health?.status || "Unknown"}
            subtitle={`Build: ${health?.buildVersion || "dev"}`}
            icon={Server}
            status={health?.ok ? "healthy" : "error"}
          />
          <MetricCard
            title="Uptime"
            value={health?.uptime || "N/A"}
            subtitle={`${health?.uptimeSeconds || 0} seconds`}
            icon={Clock}
          />
          <MetricCard
            title="Database"
            value={`${health?.database?.latencyMs || 0}ms`}
            subtitle="Response latency"
            icon={Database}
            status={dbStatus}
          />
          <MetricCard
            title="Node Version"
            value={systemInfo?.nodeVersion || "N/A"}
            subtitle={systemInfo?.platform || "linux"}
            icon={Zap}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glp-pane rounded-xl p-6" data-testid="section-environment">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-sage-600" />
              <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="heading-environment">Environment Configuration</h2>
            </div>
            <div className="space-y-1">
              <EnvCheckItem name="NODE_ENV" isSet={!!envConfig.NODE_ENV} />
              <EnvCheckItem name="DATABASE_URL" isSet={envConfig.DATABASE_URL} />
              <EnvCheckItem name="JWT_SECRET" isSet={envConfig.JWT_SECRET} />
              <EnvCheckItem name="OPENAI_API_KEY" isSet={envConfig.OPENAI_API_KEY} />
              <EnvCheckItem name="STRIPE_SECRET_KEY" isSet={envConfig.STRIPE_SECRET_KEY} />
            </div>
          </div>

          <div className="glp-pane rounded-xl p-6" data-testid="section-resources">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-sage-600" />
              <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="heading-resources">System Resources</h2>
            </div>
            <div className="space-y-4">
              <div data-testid="metric-heap-used">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Heap Used</span>
                  <span className="font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{memoryInfo.heapUsed || health?.system?.heapUsed || "N/A"}</span>
                </div>
                <div className="h-2 bg-[rgba(143,191,159,0.20)] dark:bg-[rgba(143,191,159,0.14)] rounded-full overflow-hidden">
                  <div className="h-full bg-sage-500 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div data-testid="metric-heap-total">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Heap Total</span>
                  <span className="font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{memoryInfo.heapTotal || health?.system?.heapTotal || "N/A"}</span>
                </div>
              </div>
              <div data-testid="metric-system-free">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">System Free</span>
                  <span className="font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{memoryInfo.systemFree || health?.system?.freeMemory || "N/A"}</span>
                </div>
              </div>
              <div data-testid="metric-cpu-cores">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">CPU Cores</span>
                  <span className="font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{systemInfo?.cpuCount || health?.system?.cpuCount || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glp-pane rounded-xl p-6" data-testid="section-actions">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-sage-600" />
            <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="heading-actions">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/security" className="flex items-center gap-3 p-4 bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)] rounded-lg hover:bg-[rgba(143,191,159,0.22)] dark:hover:bg-[rgba(143,191,159,0.16)] transition min-h-[44px] border border-[rgba(143,191,159,0.24)]" data-testid="link-security">
              <Shield className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Security</span>
            </Link>
            <Link href="/admin/audit-log" className="flex items-center gap-3 p-4 bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)] rounded-lg hover:bg-[rgba(143,191,159,0.22)] dark:hover:bg-[rgba(143,191,159,0.16)] transition min-h-[44px] border border-[rgba(143,191,159,0.24)]" data-testid="link-logs">
              <Database className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Audit Logs</span>
            </Link>
            <Link href="/admin/social" className="flex items-center gap-3 p-4 bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)] rounded-lg hover:bg-[rgba(143,191,159,0.22)] dark:hover:bg-[rgba(143,191,159,0.16)] transition min-h-[44px] border border-[rgba(143,191,159,0.24)]" data-testid="link-social">
              <TrendingUp className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Social Studio</span>
            </Link>
            <Link href="/admin" className="flex items-center gap-3 p-4 bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)] rounded-lg hover:bg-[rgba(143,191,159,0.22)] dark:hover:bg-[rgba(143,191,159,0.16)] transition min-h-[44px] border border-[rgba(143,191,159,0.24)]" data-testid="link-command">
              <Server className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">Back to Command Center</span>
            </Link>
          </div>
        </div>

        {/* Deep Health (heal-360 report) */}
        <div className="glp-pane mt-8 rounded-xl p-6" data-testid="section-deep-health">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-sage-600" />
              <h2 className="text-lg font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="heading-deep-health">Deep Health (heal-360)</h2>
            </div>
            <div className="flex items-center gap-3">
              {deep?.verdict && (
                <StatusIndicator
                  status={
                    deep.verdict === "HEALTHY" ? "healthy" :
                    deep.verdict === "DEGRADED" ? "warning" :
                    deep.verdict === "NEEDS_REPAIR" ? "error" : "unknown"
                  }
                />
              )}
              <button
                onClick={() => reprobe.mutate()}
                disabled={reprobe.isPending || selfHeal.isPending || aiAnalyze.isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] rounded-lg hover:bg-[var(--glp-charcoal)] disabled:opacity-60 disabled:cursor-not-allowed transition min-h-[36px] shadow-sm"
                data-testid="btn-reprobe"
                aria-label="Re-run deep health probe"
              >
                <RefreshCw className={`w-4 h-4 ${reprobe.isPending ? "animate-spin motion-reduce:animate-none" : ""}`} />
                {reprobe.isPending ? "Probing..." : "Re-probe now"}
              </button>
              <button
                onClick={() => selfHeal.mutate()}
                disabled={selfHeal.isPending || reprobe.isPending || aiAnalyze.isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--glp-gold)] text-[var(--glp-deep-teal)] rounded-lg hover:bg-[var(--glp-sage)] disabled:opacity-60 disabled:cursor-not-allowed transition min-h-[36px] shadow-sm"
                data-testid="btn-self-heal"
                aria-label="Run autonomous self-heal (probe + safe-only repair + re-probe)"
                title="Probe + safe-only repair + re-probe (autonomous, never destructive)"
              >
                <Stethoscope className={`w-4 h-4 ${selfHeal.isPending ? "animate-pulse motion-reduce:animate-none" : ""}`} />
                {selfHeal.isPending ? "Healing..." : "Self-heal now"}
              </button>
              <button
                onClick={() => aiAnalyze.mutate()}
                disabled={aiAnalyze.isPending || reprobe.isPending || selfHeal.isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--glp-blossom)] text-[var(--glp-deep-teal)] rounded-lg hover:bg-[var(--glp-sage)] disabled:opacity-60 disabled:cursor-not-allowed transition min-h-[36px] shadow-sm"
                data-testid="btn-ai-analyze"
                aria-label="Ask AI to diagnose the latest health probe report"
                title="Sends the latest probe report to Perplexity (admin-only observability layer)"
              >
                <Sparkles className={`w-4 h-4 ${aiAnalyze.isPending ? "animate-pulse motion-reduce:animate-none" : ""}`} />
                {aiAnalyze.isPending ? "Analyzing..." : "Ask AI"}
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--glp-charcoal)] text-[var(--glp-ivory)] rounded-lg hover:bg-[var(--glp-deep-teal)] disabled:opacity-60 disabled:cursor-not-allowed transition min-h-[36px] shadow-sm"
                data-testid="btn-export-bundle"
                aria-label="Download a JSON diagnostic bundle (probe, watch, scheduler, ring buffers, alerts)"
                title="Downloads a portable JSON snapshot for offline analysis and support handoff"
              >
                <Download className={`w-4 h-4 ${exporting ? "animate-pulse motion-reduce:animate-none" : ""}`} />
                {exporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>

          {/* Alerts panel — declarative rules surface firing operational signals.
              Same source of truth as `mmhb_alert_firing` Prometheus gauge.  When
              nothing is firing, shows a calm "All clear" state. */}
          {alertsData?.alerts && (
            <div
              className="mb-4 rounded-lg border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] bg-[rgba(250,249,247,0.72)] dark:bg-[rgba(143,191,159,0.10)] p-3"
              data-testid="panel-alerts"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {alertsData.summary.firing > 0 ? (
                    <BellRing
                      className={`w-4 h-4 ${alertsData.summary.critical > 0 ? "text-[var(--glp-charcoal)]" : "text-[var(--glp-gold)]"}`}
                      aria-hidden="true"
                    />
                  ) : (
                    <BellOff className="w-4 h-4 text-[var(--glp-deep-teal)]" aria-hidden="true" />
                  )}
                  <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                    Alerts
                  </h3>
                  <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] tabular-nums" data-testid="text-alerts-summary">
                    {alertsData.summary.firing > 0
                      ? `${alertsData.summary.firing} firing · ${alertsData.summary.critical}c / ${alertsData.summary.warning}w / ${alertsData.summary.info}i`
                      : `All ${alertsData.summary.total} rules quiet`}
                  </span>
                </div>
              </div>
              {alertsData.summary.firing === 0 ? (
                <p className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" data-testid="text-alerts-allclear">
                  No alert rules are currently firing.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {alertsData.alerts
                    .filter((a) => a.firing)
                    .sort((a, b) => {
                      const order = { critical: 0, warning: 1, info: 2 };
                      return (order[a.severity] ?? 9) - (order[b.severity] ?? 9);
                    })
                    .map((a) => {
                      const sevColor =
                        a.severity === "critical" ? "bg-[rgba(244,199,195,0.34)] text-[var(--glp-charcoal)] dark:bg-[rgba(244,199,195,0.16)] dark:text-[var(--glp-blossom)]" :
                        a.severity === "warning" ? "bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(212,175,55,0.14)] dark:text-[var(--glp-gold)]" :
                        "bg-[rgba(143,191,159,0.20)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.12)] dark:text-[var(--glp-sage)]";
                      const sinceLabel = a.since
                        ? new Date(a.since).toLocaleString()
                        : "—";
                      return (
                        <li
                          key={a.id}
                          className="flex flex-wrap items-baseline gap-2 text-xs"
                          data-testid={`alert-${a.id}`}
                          title={a.description}
                        >
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-medium uppercase tracking-wide ${sevColor}`}>
                            {a.severity}
                          </span>
                          <span className="font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{a.name}</span>
                          <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] font-mono">{a.message}</span>
                          <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] ml-auto">since {sinceLabel}</span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          )}

          {/* Scheduler status pill — only renders when scheduler module reports state */}
          {deep?.scheduler && (
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs" data-testid="scheduler-status-pill">
              {deep.scheduler.enabled ? (
                deep.scheduler.pausedReason ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(212,175,55,0.14)] dark:text-[var(--glp-gold)] font-medium">
                    <PauseCircle className="w-3.5 h-3.5" />
                    Auto-heal paused
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)] font-medium">
                    <PlayCircle className="w-3.5 h-3.5" />
                    Auto-heal ON · every {Math.round(deep.scheduler.intervalMs / 60000)}m
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(143,191,159,0.16)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.10)] dark:text-[var(--glp-sage)] font-medium" title="Set HEAL_AUTO_ENABLED=true to enable">
                  <PauseCircle className="w-3.5 h-3.5" />
                  Auto-heal OFF
                </span>
              )}
              {deep.scheduler.enabled && (
                <>
                  <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] tabular-nums">
                    {deep.scheduler.totalRuns} run{deep.scheduler.totalRuns === 1 ? "" : "s"}
                  </span>
                  {deep.scheduler.consecutiveFails > 0 && (
                    <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-gold)] tabular-nums">
                      · {deep.scheduler.consecutiveFails} consecutive non-healthy
                    </span>
                  )}
                  {deep.scheduler.pausedReason ? (
                    <button
                      onClick={() => schedulerResume.mutate()}
                      disabled={schedulerResume.isPending}
                      className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] rounded hover:bg-[var(--glp-charcoal)] disabled:opacity-60 transition"
                      data-testid="btn-scheduler-resume"
                    >
                      <PlayCircle className="w-3 h-3" />
                      {schedulerResume.isPending ? "..." : "Resume"}
                    </button>
                  ) : (
                    <button
                      onClick={() => schedulerPause.mutate()}
                      disabled={schedulerPause.isPending}
                      className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[var(--glp-gold)] text-[var(--glp-deep-teal)] rounded hover:bg-[var(--glp-sage)] disabled:opacity-60 transition"
                      data-testid="btn-scheduler-pause"
                    >
                      <PauseCircle className="w-3 h-3" />
                      {schedulerPause.isPending ? "..." : "Pause"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {deep?.reportError && !deep?.totals?.total ? (
            <div className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] bg-[rgba(212,175,55,0.16)] dark:bg-[rgba(212,175,55,0.10)] border border-[rgba(212,175,55,0.35)] dark:border-[rgba(212,175,55,0.22)] rounded-lg p-4" data-testid="text-deep-health-empty">
              <p className="font-medium mb-1">No probe report available yet.</p>
              <p className="text-xs opacity-80">{deep.reportError}</p>
            </div>
          ) : (
            <>
              {/* Totals row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-lg p-3 bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)] border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)]" data-testid="metric-pass">
                  <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] font-medium">Passing</div>
                  <div className="text-2xl font-bold text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{deep?.totals?.pass ?? 0}</div>
                </div>
                <div className="rounded-lg p-3 bg-[rgba(212,175,55,0.16)] dark:bg-[rgba(212,175,55,0.10)] border border-[rgba(212,175,55,0.35)] dark:border-[rgba(212,175,55,0.22)]" data-testid="metric-warn">
                  <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-gold)] font-medium">Warning</div>
                  <div className="text-2xl font-bold text-[var(--glp-deep-teal)] dark:text-[var(--glp-gold)]">{deep?.totals?.warn ?? 0}</div>
                </div>
                <div className="rounded-lg p-3 bg-[rgba(244,199,195,0.22)] dark:bg-[rgba(244,199,195,0.10)] border border-[rgba(244,199,195,0.42)] dark:border-[rgba(244,199,195,0.22)]" data-testid="metric-fail">
                  <div className="text-xs text-[var(--glp-charcoal)] dark:text-[var(--glp-blossom)] font-medium">Failing</div>
                  <div className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-blossom)]">{deep?.totals?.fail ?? 0}</div>
                </div>
              </div>

              {/* Categories */}
              {deep?.categories && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5" data-testid="grid-categories">
                  {Object.entries(deep.categories).map(([name, c]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between text-sm py-2 px-3 rounded-md bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)]"
                      data-testid={`category-${name}`}
                    >
                      <span className="font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] capitalize">{name}</span>
                      <span className="flex gap-2 text-xs">
                        <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">✓ {c.pass ?? 0}</span>
                        <span className="text-[var(--glp-gold)] dark:text-[var(--glp-gold)]">⚠ {c.warn ?? 0}</span>
                        <span className="text-[var(--glp-charcoal)] dark:text-[var(--glp-blossom)]">✗ {c.fail ?? 0}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Non-pass items + repair hints */}
              {Array.isArray(deep?.nonPass) && deep.nonPass.length > 0 && (
                <div className="border-t border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] pt-4 mt-4" data-testid="section-nonpass">
                  <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-3">Items needing attention</h3>
                  <ul className="space-y-2">
                    {deep.nonPass.map((c, i) => (
                      <li
                        key={i}
                        className="text-sm rounded-md p-3 border bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)] border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)]"
                        data-testid={`nonpass-${i}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            c.status === "fail"
                              ? "bg-[rgba(244,199,195,0.34)] text-[var(--glp-charcoal)] dark:bg-[rgba(244,199,195,0.16)] dark:text-[var(--glp-blossom)]"
                              : "bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(212,175,55,0.14)] dark:text-[var(--glp-gold)]"
                          }`}>
                            {c.status?.toUpperCase()}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">{c.name}</div>
                            {c.message && <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-0.5">{c.message}</div>}
                            {c.hint && <div className="text-xs text-sage-700 dark:text-sage-300 mt-1 italic">↳ {c.hint}</div>}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Watch streak (if heal-watch is running) */}
              {deep?.watch?.streak && (
                <div className="border-t border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] pt-4 mt-4" data-testid="section-watch-streak">
                  <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">Recent watch streak</h3>
                  <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
                    Last {deep.watch.streak.window} samples:
                    <span className="ml-2 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">✓ {deep.watch.streak.healthy} healthy</span>
                    <span className="ml-2 text-[var(--glp-gold)] dark:text-[var(--glp-gold)]">⚠ {deep.watch.streak.degraded} degraded</span>
                    <span className="ml-2 text-[var(--glp-charcoal)] dark:text-[var(--glp-blossom)]">✗ {deep.watch.streak.needsRepair} needs repair</span>
                    {deep.watch.updatedAt && (
                      <span className="ml-2 opacity-60">· updated {new Date(deep.watch.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Verdict trend sparkline — colored squares oldest→newest from probeHistory ring buffer */}
              {Array.isArray(deep?.probeHistory) && deep.probeHistory.length > 0 && (
                <div className="border-t border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] pt-4 mt-4" data-testid="section-verdict-sparkline">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">Verdict trend</h3>
                    <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">last {deep.probeHistory.length} probe{deep.probeHistory.length === 1 ? "" : "s"}</span>
                  </div>
                  <div className="flex items-center gap-1" role="img" aria-label="Recent probe verdicts oldest to newest">
                    {[...deep.probeHistory].reverse().map((p, i) => {
                      const v = p?.verdict || "UNKNOWN";
                      const color = v === "HEALTHY" ? "bg-[var(--glp-sage)]"
                        : v === "DEGRADED" ? "bg-[var(--glp-gold)]"
                        : v === "NEEDS_REPAIR" ? "bg-[var(--glp-blossom)]"
                        : "bg-[var(--glp-sage)]";
                      const ts = p?.at ? new Date(p.at) : null;
                      const tsLabel = ts && !isNaN(ts.getTime()) ? ts.toLocaleString() : "—";
                      return (
                        <div
                          key={`${p?.at || i}-${i}`}
                          className={`w-4 h-6 rounded-sm ${color} hover:scale-110 transition-transform motion-reduce:transition-none motion-reduce:hover:scale-100`}
                          title={`${v} · ${tsLabel}${p?.totals ? ` · pass=${p.totals.pass} warn=${p.totals.warn} fail=${p.totals.fail}` : ""}`}
                          data-testid={`sparkline-cell-${i}`}
                        />
                      );
                    })}
                    <span className="ml-2 text-[10px] text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] tabular-nums">
                      ← older · newer →
                    </span>
                  </div>
                </div>
              )}

              {/* AI diagnosis (latest, with collapsed remediation steps) */}
              {Array.isArray(deep?.aiHistory) && deep.aiHistory.length > 0 && (() => {
                const latest = deep.aiHistory[0];
                const dx = latest?.diagnosis;
                if (!dx) return null;
                const sevColor = dx.overall_severity === "critical"
                  ? "bg-[rgba(244,199,195,0.34)] text-[var(--glp-charcoal)] dark:bg-[rgba(244,199,195,0.16)] dark:text-[var(--glp-blossom)]"
                  : dx.overall_severity === "high"
                  ? "bg-[rgba(244,199,195,0.32)] text-[var(--glp-charcoal)] dark:bg-[rgba(244,199,195,0.14)] dark:text-[var(--glp-blossom)]"
                  : dx.overall_severity === "medium"
                  ? "bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(212,175,55,0.14)] dark:text-[var(--glp-gold)]"
                  : "bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)]";
                const steps = Array.isArray(dx.remediation_steps) ? dx.remediation_steps.slice(0, 5) : [];
                const ts = latest.at ? new Date(latest.at) : null;
                const tsLabel = ts && !isNaN(ts.getTime()) ? ts.toLocaleString() : "—";
                return (
                  <div className="border-t border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] pt-4 mt-4" data-testid="section-ai-diagnosis">
                    <div className="flex items-center gap-2 mb-2">
                      <BotMessageSquare className="w-4 h-4 text-[var(--glp-deep-teal)]" />
                      <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">Latest AI diagnosis</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${sevColor}`} data-testid="ai-severity-pill">
                        {dx.overall_severity || "unknown"}
                      </span>
                      {(latest.safetyFiltered || dx.safety_filtered) && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(244,199,195,0.32)] text-[var(--glp-charcoal)] dark:bg-[rgba(244,199,195,0.14)] dark:text-[var(--glp-blossom)]"
                          title="Destructive-language filter modified one or more remediation steps. Review carefully."
                          data-testid="ai-safety-filtered-pill"
                        >
                          <Shield className="w-3 h-3" />
                          Filtered
                        </span>
                      )}
                      <span className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] ml-auto tabular-nums">
                        {latest.model || "AI"}{latest.promptVersion ? ` v${latest.promptVersion}` : ""} · {tsLabel}
                      </span>
                    </div>
                    {dx.summary && (
                      <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-2 leading-relaxed" data-testid="text-ai-summary">
                        {dx.summary}
                      </p>
                    )}
                    {dx.next_action && (
                      <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.10)] border border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] rounded px-2 py-1.5 mb-2" data-testid="text-ai-next-action">
                        <span className="font-semibold">Next:</span> {dx.next_action}
                      </div>
                    )}
                    {steps.length > 0 && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] font-medium hover:text-[var(--glp-deep-teal)] dark:hover:text-[var(--glp-sage)]">
                          {steps.length} remediation step{steps.length === 1 ? "" : "s"}
                        </summary>
                        <ol className="mt-2 space-y-1.5 list-decimal list-inside">
                          {steps.map((s, i) => (
                            <li key={i} className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" data-testid={`ai-step-${i}`}>
                              <span className="font-medium">{s.issue}</span>
                              {" — "}
                              <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{s.suggested_fix}</span>
                              {s.risk_level && (
                                <span className={`ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide ${
                                  s.risk_level === "safe" ? "bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)]"
                                  : s.risk_level === "moderate" ? "bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(212,175,55,0.14)] dark:text-[var(--glp-gold)]"
                                  : "bg-[rgba(244,199,195,0.34)] text-[var(--glp-charcoal)] dark:bg-[rgba(244,199,195,0.16)] dark:text-[var(--glp-blossom)]"
                                }`}>
                                  {s.risk_level}
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}
                  </div>
                );
              })()}

              {/* Self-heal history (admin-triggered closed-loop runs, last 10) */}
              {Array.isArray(deep?.selfHealHistory) && deep.selfHealHistory.length > 0 && (
                <div className="border-t border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] pt-4 mt-4" data-testid="section-self-heal-history">
                  <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">Recent autonomous self-heals</h3>
                  <ul className="space-y-1">
                    {deep.selfHealHistory.map((s, i) => {
                      const ts = s.at ? new Date(s.at) : null;
                      const tsLabel = ts && !isNaN(ts.getTime()) ? ts.toLocaleTimeString() : "—";
                      const goodOutcomes = ["ALREADY_HEALTHY", "REPAIRED_TO_HEALTHY"];
                      const partialOutcomes = ["REPAIRED_TO_DEGRADED", "DRY_RUN"];
                      const isGood = goodOutcomes.includes(s.outcome);
                      const isPartial = partialOutcomes.includes(s.outcome);
                      return (
                        <li
                          key={`${s.at}-${i}`}
                          className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)]"
                          data-testid={`self-heal-history-${i}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              isGood ? "bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)]"
                              : isPartial ? "bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(212,175,55,0.14)] dark:text-[var(--glp-gold)]"
                              : "bg-[rgba(244,199,195,0.34)] text-[var(--glp-charcoal)] dark:bg-[rgba(244,199,195,0.16)] dark:text-[var(--glp-blossom)]"
                            }`}>
                              {s.outcome}
                            </span>
                            <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] tabular-nums">
                              {(s.before?.verdict || "?")} → {(s.after?.verdict || "?")}
                            </span>
                          </span>
                          <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] tabular-nums">
                            {s.durationMs ? `${s.durationMs}ms · ` : ""}{tsLabel}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Re-probe history (admin-triggered runs, last 10) */}
              {Array.isArray(deep?.probeHistory) && deep.probeHistory.length > 0 && (
                <div className="border-t border-[rgba(143,191,159,0.35)] dark:border-[rgba(143,191,159,0.22)] pt-4 mt-4" data-testid="section-probe-history">
                  <h3 className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2">Recent admin re-probes</h3>
                  <ul className="space-y-1">
                    {deep.probeHistory.map((p, i) => (
                      <li
                        key={`${p.at}-${i}`}
                        className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-[rgba(143,191,159,0.12)] dark:bg-[rgba(143,191,159,0.10)]"
                        data-testid={`probe-history-${i}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            p.verdict === "HEALTHY" ? "bg-[rgba(143,191,159,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)]"
                            : p.verdict === "DEGRADED" ? "bg-[rgba(212,175,55,0.22)] text-[var(--glp-deep-teal)] dark:bg-[rgba(212,175,55,0.14)] dark:text-[var(--glp-gold)]"
                            : "bg-[rgba(244,199,195,0.34)] text-[var(--glp-charcoal)] dark:bg-[rgba(244,199,195,0.16)] dark:text-[var(--glp-blossom)]"
                          }`}>
                            {p.verdict}
                          </span>
                          <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] tabular-nums">
                            {p.totals?.pass ?? 0}p · {p.totals?.warn ?? 0}w · {p.totals?.fail ?? 0}f
                          </span>
                        </span>
                        <span className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] tabular-nums">
                          {(() => {
                            const ts = p.at ? new Date(p.at) : null;
                            const tsLabel = ts && !isNaN(ts.getTime()) ? ts.toLocaleTimeString() : "—";
                            return `${p.durationMs ? `${p.durationMs}ms · ` : ""}${tsLabel}`;
                          })()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-4" data-testid="text-report-meta">
                Source: {deep?.reportPath || "docs/health-check-result.json"}
                {deep?.reportTimestamp && <> · generated {new Date(deep.reportTimestamp).toLocaleString()}</>}
                <br />
                <span className="opacity-70">
                  Refresh by running: <code className="bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.12)] px-1 rounded">bash scripts/heal-all.sh</code>
                  {" "}or{" "}
                  <code className="bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.12)] px-1 rounded">node scripts/heal-watch.mjs</code>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Top-50 Platform Processes Tracker */}
        <div className="mt-8" data-testid="section-top50">
          <Top50ProcessTracker />
        </div>

        <div className="mt-6 text-center text-xs text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" data-testid="text-last-updated">
          Last updated: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : "N/A"}
        </div>
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
