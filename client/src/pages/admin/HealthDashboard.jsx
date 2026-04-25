import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import "@/styles/glp-pane.css";
import { 
  Server, Database, Cpu, HardDrive, Activity, 
  CheckCircle, AlertTriangle, AlertCircle, RefreshCw,
  Clock, Wifi, Shield, Zap, TrendingUp, ArrowLeft, Stethoscope
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import Top50ProcessTracker from "@/components/admin/Top50ProcessTracker";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

function StatusIndicator({ status }) {
  const statusConfig = {
    connected: { color: "text-green-600 bg-green-100", icon: CheckCircle, label: "Connected" },
    healthy: { color: "text-green-600 bg-green-100", icon: CheckCircle, label: "Healthy" },
    warning: { color: "text-yellow-600 bg-yellow-100", icon: AlertTriangle, label: "Warning" },
    error: { color: "text-red-600 bg-red-100", icon: AlertCircle, label: "Error" },
    disconnected: { color: "text-red-600 bg-red-100", icon: AlertCircle, label: "Disconnected" },
    unknown: { color: "text-gray-600 bg-gray-100", icon: Activity, label: "Unknown" }
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="p-2 bg-sage-100 dark:bg-sage-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-sage-600 dark:text-sage-400" />
        </div>
        {status && <StatusIndicator status={status} />}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function EnvCheckItem({ name, isSet }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0" data-testid={`env-${name.toLowerCase()}`}>
      <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
      <span className={`inline-flex items-center gap-1 text-sm ${isSet ? 'text-green-600' : 'text-red-500'}`}>
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

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center" data-testid="loading-state">
        <div className="animate-pulse motion-reduce:animate-none flex items-center gap-3" data-testid="loading-content">
          <RefreshCw className="w-6 h-6 animate-spin motion-reduce:animate-none text-sage-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading health data...</span>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition" data-testid="link-admin-back" aria-label="Back to admin">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Health</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real-time monitoring and diagnostics</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition min-h-[44px]"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700" data-testid="section-environment">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-sage-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="heading-environment">Environment Configuration</h2>
            </div>
            <div className="space-y-1">
              <EnvCheckItem name="NODE_ENV" isSet={!!envConfig.NODE_ENV} />
              <EnvCheckItem name="DATABASE_URL" isSet={envConfig.DATABASE_URL} />
              <EnvCheckItem name="JWT_SECRET" isSet={envConfig.JWT_SECRET} />
              <EnvCheckItem name="OPENAI_API_KEY" isSet={envConfig.OPENAI_API_KEY} />
              <EnvCheckItem name="STRIPE_SECRET_KEY" isSet={envConfig.STRIPE_SECRET_KEY} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700" data-testid="section-resources">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-sage-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="heading-resources">System Resources</h2>
            </div>
            <div className="space-y-4">
              <div data-testid="metric-heap-used">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Heap Used</span>
                  <span className="font-medium text-gray-900 dark:text-white">{memoryInfo.heapUsed || health?.system?.heapUsed || "N/A"}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-sage-500 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div data-testid="metric-heap-total">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Heap Total</span>
                  <span className="font-medium text-gray-900 dark:text-white">{memoryInfo.heapTotal || health?.system?.heapTotal || "N/A"}</span>
                </div>
              </div>
              <div data-testid="metric-system-free">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">System Free</span>
                  <span className="font-medium text-gray-900 dark:text-white">{memoryInfo.systemFree || health?.system?.freeMemory || "N/A"}</span>
                </div>
              </div>
              <div data-testid="metric-cpu-cores">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">CPU Cores</span>
                  <span className="font-medium text-gray-900 dark:text-white">{systemInfo?.cpuCount || health?.system?.cpuCount || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700" data-testid="section-actions">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-sage-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="heading-actions">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/security" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition min-h-[44px]" data-testid="link-security">
              <Shield className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security</span>
            </Link>
            <Link href="/admin/audit-log" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition min-h-[44px]" data-testid="link-logs">
              <Database className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audit Logs</span>
            </Link>
            <Link href="/admin/social" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition min-h-[44px]" data-testid="link-social">
              <TrendingUp className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Studio</span>
            </Link>
            <Link href="/admin" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition min-h-[44px]" data-testid="link-command">
              <Server className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Back to Command Center</span>
            </Link>
          </div>
        </div>

        {/* Deep Health (heal-360 report) */}
        <div className="glp-pane mt-8 rounded-xl p-6" data-testid="section-deep-health">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-sage-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="heading-deep-health">Deep Health (heal-360)</h2>
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
                disabled={reprobe.isPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-60 disabled:cursor-not-allowed transition min-h-[36px]"
                data-testid="btn-reprobe"
                aria-label="Re-run deep health probe"
              >
                <RefreshCw className={`w-4 h-4 ${reprobe.isPending ? "animate-spin motion-reduce:animate-none" : ""}`} />
                {reprobe.isPending ? "Probing..." : "Re-probe now"}
              </button>
            </div>
          </div>

          {deep?.reportError && !deep?.totals?.total ? (
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4" data-testid="text-deep-health-empty">
              <p className="font-medium mb-1">No probe report available yet.</p>
              <p className="text-xs opacity-80">{deep.reportError}</p>
            </div>
          ) : (
            <>
              {/* Totals row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-lg p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" data-testid="metric-pass">
                  <div className="text-xs text-green-700 dark:text-green-400 font-medium">Passing</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{deep?.totals?.pass ?? 0}</div>
                </div>
                <div className="rounded-lg p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" data-testid="metric-warn">
                  <div className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">Warning</div>
                  <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{deep?.totals?.warn ?? 0}</div>
                </div>
                <div className="rounded-lg p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" data-testid="metric-fail">
                  <div className="text-xs text-red-700 dark:text-red-400 font-medium">Failing</div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">{deep?.totals?.fail ?? 0}</div>
                </div>
              </div>

              {/* Categories */}
              {deep?.categories && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5" data-testid="grid-categories">
                  {Object.entries(deep.categories).map(([name, c]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between text-sm py-2 px-3 rounded-md bg-gray-50 dark:bg-gray-700/50"
                      data-testid={`category-${name}`}
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{name}</span>
                      <span className="flex gap-2 text-xs">
                        <span className="text-green-600 dark:text-green-400">✓ {c.pass ?? 0}</span>
                        <span className="text-yellow-600 dark:text-yellow-400">⚠ {c.warn ?? 0}</span>
                        <span className="text-red-600 dark:text-red-400">✗ {c.fail ?? 0}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Non-pass items + repair hints */}
              {Array.isArray(deep?.nonPass) && deep.nonPass.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4" data-testid="section-nonpass">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Items needing attention</h3>
                  <ul className="space-y-2">
                    {deep.nonPass.map((c, i) => (
                      <li
                        key={i}
                        className="text-sm rounded-md p-3 border bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700"
                        data-testid={`nonpass-${i}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            c.status === "fail"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}>
                            {c.status?.toUpperCase()}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white">{c.name}</div>
                            {c.message && <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{c.message}</div>}
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
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4" data-testid="section-watch-streak">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Recent watch streak</h3>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Last {deep.watch.streak.window} samples:
                    <span className="ml-2 text-green-600 dark:text-green-400">✓ {deep.watch.streak.healthy} healthy</span>
                    <span className="ml-2 text-yellow-600 dark:text-yellow-400">⚠ {deep.watch.streak.degraded} degraded</span>
                    <span className="ml-2 text-red-600 dark:text-red-400">✗ {deep.watch.streak.needsRepair} needs repair</span>
                    {deep.watch.updatedAt && (
                      <span className="ml-2 opacity-60">· updated {new Date(deep.watch.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-500 mt-4" data-testid="text-report-meta">
                Source: {deep?.reportPath || "docs/health-check-result.json"}
                {deep?.reportTimestamp && <> · generated {new Date(deep.reportTimestamp).toLocaleString()}</>}
                <br />
                <span className="opacity-70">
                  Refresh by running: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">bash scripts/heal-all.sh</code>
                  {" "}or{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">node scripts/heal-watch.mjs</code>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Top-50 Platform Processes Tracker */}
        <div className="mt-8" data-testid="section-top50">
          <Top50ProcessTracker />
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500" data-testid="text-last-updated">
          Last updated: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : "N/A"}
        </div>
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
