import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Shield, ChevronLeft, RefreshCw, AlertTriangle, 
  Lock, Activity, Users, Clock, TrendingUp, Ban
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function SecurityDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [rateLimitLogs, setRateLimitLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [overviewRes, logsRes] = await Promise.all([
        fetch("/api/admin/security/overview"),
        fetch("/api/admin/security/rate-limits?limit=50&blockedOnly=false"),
      ]);
      
      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setOverview(data.data);
      }
      
      if (logsRes.ok) {
        const data = await logsRes.json();
        setRateLimitLogs(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch security data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="animate-spin motion-reduce:animate-none w-8 h-8 border-4 border-[var(--glp-sage)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--glp-sage-deep)]" data-testid="text-page-title">
                Security Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Monitor security events, rate limiting, and CSRF protection
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin motion-reduce:animate-none' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card data-testid="card-total-requests">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overview?.rateLimit?.totalRequests || 0}</p>
                  <p className="text-sm text-gray-500">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-blocked-requests">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overview?.rateLimit?.blockedRequests || 0}</p>
                  <p className="text-sm text-gray-500">Blocked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-csrf-tokens">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overview?.csrf?.activeTokens || 0}</p>
                  <p className="text-sm text-gray-500">Active CSRF Tokens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-websocket-connections">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overview?.websocket?.activeConnections || 0}</p>
                  <p className="text-sm text-gray-500">WebSocket Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Rate Limiting Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Block Rate</span>
                  <span className={`text-sm font-bold ${
                    (overview?.rateLimit?.blockRate || 0) > 10 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {overview?.rateLimit?.blockRate || 0}%
                  </span>
                </div>
                
                {overview?.rateLimit?.topBlockedIP && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Top Blocked IP</span>
                    </div>
                    <p className="text-sm text-amber-700">
                      {overview.rateLimit.topBlockedIP.ip} ({overview.rateLimit.topBlockedIP.count} blocks)
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm font-medium text-green-800">CSRF Protection</span>
                  <span className="text-sm font-bold text-green-600">
                    {overview?.csrf?.tokenRotationActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Rate Limit Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {rateLimitLogs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No rate limit events recorded
                  </p>
                ) : (
                  rateLimitLogs.slice(0, 10).map((log, idx) => (
                    <div 
                      key={idx}
                      className={`p-2 rounded text-xs ${
                        log.blocked 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono">{log.path}</span>
                        <span className={log.blocked ? 'text-red-600 font-bold' : 'text-gray-500'}>
                          {log.blocked ? 'BLOCKED' : `${log.remaining}/${log.limit}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-gray-500">
                        <span>{log.ip}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              WebSocket Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Active Connections</p>
                <p className="text-3xl font-bold text-purple-800">
                  {overview?.websocket?.activeConnections || 0}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Active Rooms</p>
                <p className="text-3xl font-bold text-purple-800">
                  {overview?.websocket?.activeRooms || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Status</p>
                <p className="text-xl font-bold text-green-800">
                  Operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
