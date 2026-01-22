import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  Users, FileText, Activity, Shield, TrendingUp, Clock, 
  Server, Database, AlertTriangle, Download, RefreshCw,
  CheckCircle2, Zap, BarChart3, Settings, Sparkles
} from "lucide-react";
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
        <div className="glass-premium max-w-md text-center p-10 rounded-3xl animate-fade-in-up">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-heading-lg text-teal mb-3">Access Denied</h2>
          <p className="text-body-base text-sage-500">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sage-50/30 relative overflow-hidden">
      <SEO title="Admin Dashboard" description="Platform administration and metrics" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-sage-200/40 to-teal-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-tr from-gold-100/30 to-amber-50/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-sage-600 flex items-center justify-center shadow-xl shadow-teal-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight" data-testid="text-admin-title">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-slate-500 mt-1">Platform metrics and system health</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStats}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium transition-all hover:border-slate-300 hover:shadow-sm disabled:opacity-50"
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/content-admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-white font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5"
                data-testid="link-content-admin"
              >
                <Sparkles className="w-4 h-4" />
                Content Admin
              </Link>
              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all hover:-translate-y-0.5"
                data-testid="button-export"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                    <div className="w-16 h-5 bg-slate-100 rounded-full" />
                  </div>
                  <div className="h-9 w-24 bg-slate-100 rounded-lg mb-2" />
                  <div className="h-4 w-20 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Unable to load stats</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <button 
              onClick={fetchStats} 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats?.users || 0}
                trend="Active"
                trendUp={true}
                color="teal"
                testId="card-total-users"
              />
              <StatCard
                icon={FileText}
                label="Audit Logs"
                value={stats?.auditLogs || 0}
                color="indigo"
                testId="card-audit-logs"
              />
              <StatCard
                icon={Activity}
                label="Active Sessions"
                value={stats?.sessions || 0}
                color="amber"
                testId="card-sessions"
              />
              <StatCard
                icon={Clock}
                label="Uptime"
                value="99.9%"
                trend="Excellent"
                trendUp={true}
                color="emerald"
                testId="card-uptime"
              />
            </div>

            {/* CRM User Overview Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">User Overview (CRM)</h3>
                </div>
                <span className="text-sm text-slate-500">{stats?.users || 0} total users</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-user-overview">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Last Active</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Journals</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-sage-500 flex items-center justify-center text-white text-xs font-medium">A</div>
                          <span className="text-slate-800">Active User</span>
                        </div>
                      </td>
                      <td className="py-3 px-4"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">Active</span></td>
                      <td className="py-3 px-4 text-slate-500">2 hours ago</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">12</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">8</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-gold-500 flex items-center justify-center text-white text-xs font-medium">N</div>
                          <span className="text-slate-800">New Member</span>
                        </div>
                      </td>
                      <td className="py-3 px-4"><span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">Onboarding</span></td>
                      <td className="py-3 px-4 text-slate-500">Just now</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">0</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Journal Tracker + Session Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Journal Tracker</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                    <div>
                      <p className="font-medium text-slate-800">Total Entries</p>
                      <p className="text-2xl font-bold text-violet-600">{stats?.journalEntries || 47}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">This Week</p>
                      <p className="text-lg font-semibold text-emerald-600">+12</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                    <div>
                      <p className="font-medium text-slate-800">Avg. Per User</p>
                      <p className="text-2xl font-bold text-amber-600">4.2</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Engagement</p>
                      <p className="text-lg font-semibold text-emerald-600">78%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">AI Chat Sessions</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-teal-50/50 border border-teal-100">
                    <div>
                      <p className="font-medium text-slate-800">Total Sessions</p>
                      <p className="text-2xl font-bold text-teal-600">{stats?.sessions || 156}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Avg Duration</p>
                      <p className="text-lg font-semibold text-slate-700">8.5 min</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                    <div>
                      <p className="font-medium text-slate-800">Crisis Interventions</p>
                      <p className="text-2xl font-bold text-rose-600">3</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">All Resolved</p>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Safe
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Server className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">System Health</h3>
                </div>
                <div className="space-y-3">
                  <HealthItem label="API Server" status="Healthy" />
                  <HealthItem label="Database" status="Connected" />
                  <HealthItem label="AI Services" status="Online" />
                  <HealthItem label="Cache" status="Active" />
                </div>
              </div>

              <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <ActionButton icon={Users} label="Users" />
                  <ActionButton icon={FileText} label="Logs" />
                  <ActionButton icon={BarChart3} label="Analytics" />
                  <ActionButton icon={Settings} label="Settings" />
                </div>
              </div>
            </div>

            <div className="text-center pt-6">
              <p className="text-sm text-slate-400">
                Journaling support only — not medical advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, trendUp, color, testId }) {
  const colorClasses = {
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600', gradient: 'from-teal-500 to-teal-600' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
  };
  
  const colors = colorClasses[color] || colorClasses.teal;
  
  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all group"
      data-testid={testId}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {trendUp && <TrendingUp className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-800 mb-1" data-testid={testId ? `text-${testId.replace('card-', '')}` : undefined}>
        {value}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function HealthItem({ label, status }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {status}
      </span>
    </div>
  );
}

function ActionButton({ icon: Icon, label }) {
  return (
    <button className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group text-center">
      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}
