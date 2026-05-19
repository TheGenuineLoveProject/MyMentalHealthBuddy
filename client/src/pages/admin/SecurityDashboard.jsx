import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, RefreshCw, AlertTriangle, 
  Lock, Activity, Users, Clock, TrendingUp, Ban, ArrowLeft, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { SEO } from "../../components/SEO";
import { AdminErrorBanner } from "../../components/admin/AdminQueryStates";

export default function SecurityDashboard() {
  const { data: overviewData, isLoading: overviewLoading, error: overviewError, refetch: refetchOverview, isRefetching } = useQuery({
    queryKey: ['/api/admin/security/overview'],
    queryFn: async () => {
      const res = await fetch("/api/admin/security/overview", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load security overview");
      const data = await res.json();
      return data.data;
    },
    retry: 2,
    retryDelay: 1000,
    refetchInterval: 30000,
  });

  const { data: rateLimitLogs = [], refetch: refetchLogs } = useQuery({
    queryKey: ['/api/admin/security/rate-limits'],
    queryFn: async () => {
      const res = await fetch("/api/admin/security/rate-limits?limit=50&blockedOnly=false", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load rate limit logs");
      const data = await res.json();
      return data.data || [];
    },
    retry: 2,
    retryDelay: 1000,
    refetchInterval: 30000,
  });

  const { data: healthData } = useQuery({
    queryKey: ['/api/health'],
    retry: 1,
    staleTime: 30000,
  });

  const handleRefresh = () => {
    refetchOverview();
    refetchLogs();
  };

  const overview = overviewData;
  const blockRate = overview?.rateLimit?.blockRate || 0;
  const totalReqs = overview?.rateLimit?.totalRequests || 0;
  const blockedReqs = overview?.rateLimit?.blockedRequests || 0;

  if (overviewLoading) {
    return (
      <div className="min-h-screen v28-paper-bg flex items-center justify-center" data-testid="loading-security">
        <Loader2 className="w-8 h-8 animate-spin motion-reduce:animate-none text-primary" />
        <span className="ml-3 text-muted-foreground">Loading security dashboard...</span>
      </div>
    );
  }

  if (overviewError) {
    return <AdminErrorBanner title="Unable to load security dashboard" onRetry={refetchOverview} />;
  }

  return (
    <div className="min-h-screen v28-paper-bg" data-testid="page-security-dashboard">
      <SEO title="Security Dashboard — Admin" noindex />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>
        <div className="flex items-center justify-between mb-8" data-testid="panel-header">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--glp-sage-deep)]" data-testid="text-page-title">
              Security Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Monitor security events, rate limiting, and CSRF protection
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefetching}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin motion-reduce:animate-none' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8" data-testid="panel-metrics">
          <Card data-testid="card-total-requests">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-requests">{totalReqs}</p>
                  <p className="text-sm text-gray-500">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-blocked-requests">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-blocked-requests">{blockedReqs}</p>
                  <p className="text-sm text-gray-500">Blocked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-csrf-tokens">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-csrf-tokens">{overview?.csrf?.activeTokens || 0}</p>
                  <p className="text-sm text-gray-500">Active CSRF Tokens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-websocket-connections">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-websocket-conns">{overview?.websocket?.activeConnections || 0}</p>
                  <p className="text-sm text-gray-500">WebSocket Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6" data-testid="panel-details">
          <Card data-testid="card-rate-limit-status">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Rate Limiting Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid="row-block-rate">
                  <span className="text-sm font-medium">Block Rate</span>
                  <span className={`text-sm font-bold ${blockRate > 10 ? 'text-red-600' : 'text-green-600'}`} data-testid="text-block-rate">
                    {blockRate}%
                  </span>
                </div>
                
                {overview?.rateLimit?.topBlockedIP && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg" data-testid="panel-top-blocked-ip">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Top Blocked IP</span>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-400" data-testid="text-blocked-ip">
                      {overview.rateLimit.topBlockedIP.ip} ({overview.rateLimit.topBlockedIP.count} blocks)
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg" data-testid="row-csrf-status">
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">CSRF Protection</span>
                  <span className="text-sm font-bold text-green-600" data-testid="text-csrf-status">
                    {overview?.csrf?.tokenRotationActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {healthData?.uptimeFormatted && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" data-testid="row-uptime">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Server Uptime</span>
                    <span className="text-sm font-bold text-blue-600" data-testid="text-uptime">{healthData.uptimeFormatted}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-rate-limit-events">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Rate Limit Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {rateLimitLogs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4" data-testid="text-no-events">
                    No rate limit events recorded
                  </p>
                ) : (
                  rateLimitLogs.slice(0, 10).map((log, idx) => (
                    <div 
                      key={idx}
                      className={`p-2 rounded text-xs ${
                        log.blocked 
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                      data-testid={`rate-limit-event-${idx}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono" data-testid={`text-event-path-${idx}`}>{log.path}</span>
                        <span className={log.blocked ? 'text-red-600 font-bold' : 'text-gray-500'} data-testid={`text-event-status-${idx}`}>
                          {log.blocked ? 'BLOCKED' : `${log.remaining}/${log.limit}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-gray-500">
                        <span data-testid={`text-event-ip-${idx}`}>{log.ip}</span>
                        <span data-testid={`text-event-time-${idx}`}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6" data-testid="card-websocket-activity">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              WebSocket Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg" data-testid="stat-ws-connections">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Active Connections</p>
                <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                  {overview?.websocket?.activeConnections || 0}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg" data-testid="stat-ws-rooms">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Active Rooms</p>
                <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                  {overview?.websocket?.activeRooms || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg" data-testid="stat-ws-status">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Status</p>
                <p className="text-xl font-bold text-green-800 dark:text-green-200">
                  Operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
