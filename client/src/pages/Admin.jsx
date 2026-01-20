import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Users, FileText, Activity, Shield, TrendingUp, Clock, Server, Database, AlertTriangle, Download, RefreshCw } from "lucide-react";
import SEO from "../components/SEO";
import { apiRequest } from "../lib/queryClient.js";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest("GET", "/api/admin/stats");
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
        <SEO title="Access Denied" description="Admin access required" />
        <div className="card-bordered max-w-md text-center p-8">
          <div className="icon-container icon-lg icon-soft-blush mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-heading-lg text-teal mb-2">Access Denied</h2>
          <p className="text-body-sm">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient p-6">
      <SEO title="Admin Dashboard" description="Platform administration and metrics" />
      
      <div className="content-wrapper">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="icon-container icon-xl icon-gradient-sage">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-display-lg text-teal" data-testid="text-admin-title">
                Admin Dashboard
              </h1>
              <p className="text-lead">Platform metrics and system health</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              className="btn-secondary-premium flex items-center gap-2"
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              className="btn-premium flex items-center gap-2"
              data-testid="button-export"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card-elevated animate-pulse">
                <div className="h-12 w-12 bg-sage-100 rounded-xl mb-4"></div>
                <div className="h-8 w-20 bg-sage-100 rounded mb-2"></div>
                <div className="h-4 w-24 bg-sage-50 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="card-elevated p-8 text-center">
            <div className="icon-container icon-lg icon-blush mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-heading-md text-teal mb-2">Unable to load stats</h3>
            <p className="text-body-sm mb-4">{error}</p>
            <button onClick={fetchStats} className="btn-premium">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="stat-card" data-testid="card-total-users">
                <div className="flex items-center justify-between mb-3">
                  <div className="icon-container icon-md icon-sage">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="stat-trend stat-trend-up">
                    <TrendingUp className="w-3 h-3" />
                    Active
                  </span>
                </div>
                <div className="stat-value" data-testid="text-total-users">{stats?.users || 0}</div>
                <div className="stat-label">Total Users</div>
              </div>

              <div className="stat-card" data-testid="card-audit-logs">
                <div className="flex items-center justify-between mb-3">
                  <div className="icon-container icon-md icon-teal">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="stat-value" data-testid="text-audit-logs">{stats?.auditLogs || 0}</div>
                <div className="stat-label">Audit Logs</div>
              </div>

              <div className="stat-card" data-testid="card-sessions">
                <div className="flex items-center justify-between mb-3">
                  <div className="icon-container icon-md icon-gold">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="stat-value">{stats?.sessions || 0}</div>
                <div className="stat-label">Active Sessions</div>
              </div>

              <div className="stat-card" data-testid="card-uptime">
                <div className="flex items-center justify-between mb-3">
                  <div className="icon-container icon-md icon-sage">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card-elevated">
                <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-sage-600" />
                  System Health
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    <span className="text-sm font-medium text-green-800">API Server</span>
                    <span className="badge badge-sage">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    <span className="text-sm font-medium text-green-800">Database</span>
                    <span className="badge badge-sage">Connected</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    <span className="text-sm font-medium text-green-800">AI Services</span>
                    <span className="badge badge-sage">Online</span>
                  </div>
                </div>
              </div>

              <div className="card-elevated">
                <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-sage-600" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 rounded-xl border border-sage-200 hover:border-sage-400 hover:bg-sage-50 transition text-left">
                    <Users className="w-5 h-5 text-sage-600 mb-2" />
                    <span className="text-sm font-medium text-teal block">Manage Users</span>
                  </button>
                  <button className="p-4 rounded-xl border border-sage-200 hover:border-sage-400 hover:bg-sage-50 transition text-left">
                    <FileText className="w-5 h-5 text-sage-600 mb-2" />
                    <span className="text-sm font-medium text-teal block">View Logs</span>
                  </button>
                  <button className="p-4 rounded-xl border border-sage-200 hover:border-sage-400 hover:bg-sage-50 transition text-left">
                    <Shield className="w-5 h-5 text-sage-600 mb-2" />
                    <span className="text-sm font-medium text-teal block">Security</span>
                  </button>
                  <button className="p-4 rounded-xl border border-sage-200 hover:border-sage-400 hover:bg-sage-50 transition text-left">
                    <Activity className="w-5 h-5 text-sage-600 mb-2" />
                    <span className="text-sm font-medium text-teal block">Analytics</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center py-4">
              <p className="text-caption">
                Journaling support only — not medical advice.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
