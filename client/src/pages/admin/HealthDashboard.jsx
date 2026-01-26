import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Server, Database, Cpu, HardDrive, Activity, 
  CheckCircle, AlertTriangle, AlertCircle, RefreshCw,
  Clock, Wifi, Shield, Zap, TrendingUp, ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

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

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-sage-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading health data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md">
          <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Failed to Load Health Data</h2>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">Please check your admin permissions and try again.</p>
          <button onClick={handleRefresh} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition" data-testid="btn-retry">
            Retry
          </button>
        </div>
      </div>
    );
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-sage-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Environment Configuration</h2>
            </div>
            <div className="space-y-1">
              <EnvCheckItem name="NODE_ENV" isSet={!!envConfig.NODE_ENV} />
              <EnvCheckItem name="DATABASE_URL" isSet={envConfig.DATABASE_URL} />
              <EnvCheckItem name="JWT_SECRET" isSet={envConfig.JWT_SECRET} />
              <EnvCheckItem name="OPENAI_API_KEY" isSet={envConfig.OPENAI_API_KEY} />
              <EnvCheckItem name="STRIPE_SECRET_KEY" isSet={envConfig.STRIPE_SECRET_KEY} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-sage-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Resources</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Heap Used</span>
                  <span className="font-medium text-gray-900 dark:text-white">{memoryInfo.heapUsed || health?.system?.heapUsed || "N/A"}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-sage-500 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Heap Total</span>
                  <span className="font-medium text-gray-900 dark:text-white">{memoryInfo.heapTotal || health?.system?.heapTotal || "N/A"}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">System Free</span>
                  <span className="font-medium text-gray-900 dark:text-white">{memoryInfo.systemFree || health?.system?.freeMemory || "N/A"}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">CPU Cores</span>
                  <span className="font-medium text-gray-900 dark:text-white">{systemInfo?.cpuCount || health?.system?.cpuCount || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-sage-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/security" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition min-h-[44px]" data-testid="link-security">
              <Shield className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security</span>
            </Link>
            <Link href="/admin/logs" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition min-h-[44px]" data-testid="link-logs">
              <Database className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audit Logs</span>
            </Link>
            <Link href="/admin/social" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition min-h-[44px]" data-testid="link-social">
              <TrendingUp className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Studio</span>
            </Link>
            <Link href="/admin" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition min-h-[44px]" data-testid="link-command">
              <Server className="w-5 h-5 text-sage-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Command Center</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          Last updated: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : "N/A"}
        </div>
      </div>
    </div>
  );
}
