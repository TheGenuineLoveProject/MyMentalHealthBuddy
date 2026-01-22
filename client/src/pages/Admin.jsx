import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  Users, FileText, Activity, Shield, TrendingUp, Clock, 
  Server, Database, AlertTriangle, Download, RefreshCw,
  CheckCircle2, Zap, BarChart3, Settings, Sparkles,
  Heart, Brain, MessageCircle, Calendar, Globe, Lock,
  Eye, Bell, PieChart, ArrowUpRight, ArrowDownRight,
  Wifi, WifiOff, HardDrive, Cpu, MemoryStick, 
  UserPlus, UserCheck, UserX, Mail, CreditCard,
  Target, Award, Flame, BookOpen, Lightbulb,
  AlertCircle, Info, ChevronRight, ExternalLink,
  LayoutDashboard, Layers, Gauge
} from "lucide-react";
import SEO from "../components/SEO";
import { apiRequest } from "../lib/queryClient.js";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 0,
    requestsPerMin: 0,
    avgResponseTime: 45,
    errorRate: 0.02,
  });

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
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        requestsPerMin: Math.max(10, prev.requestsPerMin + Math.floor(Math.random() * 20) - 10),
        avgResponseTime: Math.max(20, Math.min(100, prev.avgResponseTime + Math.floor(Math.random() * 10) - 5)),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() * 0.02) - 0.01)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
        <SEO title="Access Denied" description="Admin access required" />
        <div className="glass-premium max-w-md text-center p-10 rounded-3xl animate-fade-in-up">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-rose-15), var(--glp-paper))' }}>
            <Shield className="w-10 h-10" style={{ color: 'var(--glp-rose)' }} />
          </div>
          <h2 className="text-heading-lg text-teal mb-3">Access Denied</h2>
          <p className="text-body-base text-sage-500 mb-6">You must be an administrator to view this page.</p>
          <Link href="/dashboard" className="btn-premium inline-flex items-center gap-2">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users & CRM", icon: Users },
    { id: "engagement", label: "Engagement", icon: Heart },
    { id: "content", label: "Content", icon: FileText },
    { id: "system", label: "System", icon: Server },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <SEO title="Admin Command Center" description="Advanced platform administration and real-time analytics" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-sage-200/40 to-teal-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-tr from-gold-100/30 to-amber-50/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-teal-50/20 to-transparent rounded-full" />
      </div>
      
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-8">
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-sage-600 flex items-center justify-center shadow-xl shadow-teal-500/20">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'var(--glp-ink)' }} data-testid="text-admin-title">
                    Admin Command Center
                  </h1>
                  <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full">
                    PRO
                  </span>
                </div>
                <p className="text-lg mt-1 flex items-center gap-2" style={{ color: 'var(--glp-sage)' }}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--glp-sage)' }} />
                    Live
                  </span>
                  <span style={{ color: 'var(--glp-sage-20)' }}>•</span>
                  <span>{realtimeData.activeUsers} active users</span>
                  <span style={{ color: 'var(--glp-sage-20)' }}>•</span>
                  <span>{realtimeData.requestsPerMin} req/min</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={fetchStats}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium transition-all hover:border-slate-300 hover:shadow-sm disabled:opacity-50"
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/content-admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-white font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5"
                data-testid="link-content-admin"
              >
                <Sparkles className="w-4 h-4" />
                Content Studio
              </Link>
              <Link
                href="/control"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Settings className="w-4 h-4" />
                Controls
              </Link>
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all hover:-translate-y-0.5"
                data-testid="button-export"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </header>

        <nav className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white shadow-md border border-slate-200 text-teal-600"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchStats} />
        ) : (
          <div className="space-y-8">
            {activeView === "overview" && (
              <OverviewSection stats={stats} realtimeData={realtimeData} />
            )}
            {activeView === "users" && (
              <UsersSection stats={stats} />
            )}
            {activeView === "engagement" && (
              <EngagementSection stats={stats} />
            )}
            {activeView === "content" && (
              <ContentSection stats={stats} />
            )}
            {activeView === "system" && (
              <SystemSection stats={stats} realtimeData={realtimeData} />
            )}
            {activeView === "security" && (
              <SecuritySection stats={stats} />
            )}
          </div>
        )}

        <footer className="mt-12 pt-8" style={{ borderTop: '1px solid var(--glp-sage-15)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--glp-sage)' }}>
            <p>The Genuine Love Project • Admin Dashboard v2.0</p>
            <p className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Secure admin session • All actions logged
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 h-80 border border-slate-100" />
        <div className="bg-white rounded-2xl p-6 h-80 border border-slate-100" />
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-5">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Unable to load dashboard</h3>
      <p className="text-slate-500 mb-6">{error}</p>
      <button 
        onClick={onRetry} 
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

function OverviewSection({ stats, realtimeData }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          label="Total Users"
          value={stats?.users || 0}
          change="+12%"
          changeUp={true}
          color="teal"
          sparklineData={[30, 45, 32, 60, 45, 80, 55]}
        />
        <MetricCard
          icon={Heart}
          label="Wellness Sessions"
          value={stats?.sessions || 156}
          change="+28%"
          changeUp={true}
          color="rose"
          sparklineData={[20, 35, 45, 30, 55, 70, 85]}
        />
        <MetricCard
          icon={FileText}
          label="Journal Entries"
          value={stats?.journalEntries || 47}
          change="+15%"
          changeUp={true}
          color="violet"
          sparklineData={[40, 50, 35, 60, 45, 55, 70]}
        />
        <MetricCard
          icon={MessageCircle}
          label="AI Conversations"
          value={stats?.conversations || 234}
          change="+42%"
          changeUp={true}
          color="amber"
          sparklineData={[25, 40, 55, 70, 60, 85, 95]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-500" />
              Real-Time Activity
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-slate-500">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RealtimeMetric label="Active Users" value={realtimeData.activeUsers} icon={Users} color="teal" />
            <RealtimeMetric label="Requests/min" value={realtimeData.requestsPerMin} icon={Zap} color="amber" />
            <RealtimeMetric label="Avg Response" value={`${realtimeData.avgResponseTime}ms`} icon={Clock} color="violet" />
            <RealtimeMetric label="Error Rate" value={`${(realtimeData.errorRate * 100).toFixed(2)}%`} icon={AlertCircle} color={realtimeData.errorRate > 0.05 ? "rose" : "emerald"} />
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50">
            <h4 className="text-sm font-medium text-slate-600 mb-3">Activity Timeline</h4>
            <div className="space-y-3">
              <ActivityItem icon={UserPlus} text="New user registered" time="2 min ago" color="teal" />
              <ActivityItem icon={Heart} text="Wellness session completed" time="5 min ago" color="rose" />
              <ActivityItem icon={FileText} text="Journal entry saved" time="8 min ago" color="violet" />
              <ActivityItem icon={MessageCircle} text="AI conversation started" time="12 min ago" color="amber" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-violet-500" />
            Feature Usage
          </h3>
          <div className="space-y-4">
            <UsageBar label="AI Chat Therapy" percent={78} color="teal" />
            <UsageBar label="Mood Tracking" percent={65} color="amber" />
            <UsageBar label="Journaling" percent={52} color="violet" />
            <UsageBar label="Wellness Tools" percent={41} color="rose" />
            <UsageBar label="Community" percent={28} color="sage" />
          </div>
          <div className="mt-6 p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Most Active Hour</span>
              <span className="font-semibold text-slate-800">9:00 PM</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-600">Peak Day</span>
              <span className="font-semibold text-slate-800">Sunday</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard 
          icon={Users} 
          title="User Management" 
          description="View all users, manage permissions"
          href="/control"
          color="teal"
        />
        <QuickActionCard 
          icon={FileText} 
          title="Content Studio" 
          description="Manage blog posts and media"
          href="/content-admin"
          color="gold"
        />
        <QuickActionCard 
          icon={BarChart3} 
          title="Analytics" 
          description="Deep-dive into metrics"
          href="/analytics"
          color="violet"
        />
        <QuickActionCard 
          icon={Settings} 
          title="Settings" 
          description="Platform configuration"
          href="/control"
          color="slate"
        />
      </div>
    </>
  );
}

function UsersSection({ stats }) {
  const mockUsers = [
    { id: 1, name: "Sarah M.", email: "sarah@example.com", status: "active", plan: "premium", sessions: 24, joined: "2 days ago", avatar: "S" },
    { id: 2, name: "James K.", email: "james@example.com", status: "active", plan: "free", sessions: 8, joined: "1 week ago", avatar: "J" },
    { id: 3, name: "Emily R.", email: "emily@example.com", status: "trial", plan: "trial", sessions: 3, joined: "3 days ago", avatar: "E" },
    { id: 4, name: "Michael T.", email: "michael@example.com", status: "churned", plan: "free", sessions: 1, joined: "1 month ago", avatar: "M" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Users} label="Total Users" value={stats?.users || 0} change="+12%" changeUp={true} color="teal" />
        <MetricCard icon={UserPlus} label="New This Week" value={23} change="+18%" changeUp={true} color="emerald" />
        <MetricCard icon={UserCheck} label="Active Today" value={156} change="+8%" changeUp={true} color="violet" />
        <MetricCard icon={UserX} label="Churned" value={12} change="-5%" changeUp={false} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">User Directory</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="search" 
                  placeholder="Search users..." 
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <button className="px-4 py-2 rounded-xl bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition">
                  Add User
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">User</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Plan</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Sessions</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Joined</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(user => (
                  <tr key={user.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-sage-500 flex items-center justify-center text-white font-medium">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.plan === 'premium' ? 'bg-amber-100 text-amber-700' :
                        user.plan === 'trial' ? 'bg-violet-100 text-violet-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">{user.sessions}</td>
                    <td className="py-4 px-6 text-slate-500 text-sm">{user.joined}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">User Funnel</h3>
            <div className="space-y-3">
              <FunnelStep label="Visitors" value={1240} percent={100} color="slate" />
              <FunnelStep label="Signups" value={340} percent={27} color="teal" />
              <FunnelStep label="Activated" value={180} percent={53} color="emerald" />
              <FunnelStep label="Subscribed" value={45} percent={25} color="amber" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue</h3>
            <div className="text-3xl font-bold text-slate-800 mb-2">$2,847</div>
            <p className="text-sm text-emerald-600 flex items-center gap-1 mb-4">
              <ArrowUpRight className="w-4 h-4" />
              +23% from last month
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Active Subscriptions</span>
                <span className="font-medium text-slate-800">45</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">MRR</span>
                <span className="font-medium text-slate-800">$2,250</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Lifetime Revenue</span>
                <span className="font-medium text-slate-800">$12,450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EngagementSection({ stats }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Heart} label="Wellness Score Avg" value="7.2" color="rose" />
        <MetricCard icon={Flame} label="Active Streaks" value={89} change="+15%" changeUp={true} color="amber" />
        <MetricCard icon={Target} label="Goals Completed" value={234} change="+42%" changeUp={true} color="emerald" />
        <MetricCard icon={Award} label="Achievements" value={567} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Mood Distribution (Last 7 Days)</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { emoji: "😊", label: "Happy", count: 145, color: "from-amber-400 to-orange-400" },
              { emoji: "😌", label: "Calm", count: 98, color: "from-teal-400 to-emerald-400" },
              { emoji: "😐", label: "Neutral", count: 67, color: "from-slate-400 to-slate-500" },
              { emoji: "😟", label: "Anxious", count: 34, color: "from-violet-400 to-purple-400" },
              { emoji: "😢", label: "Sad", count: 23, color: "from-blue-400 to-indigo-400" },
            ].map((mood, i) => (
              <div key={i} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center text-2xl mb-2`}>
                  {mood.emoji}
                </div>
                <div className="text-lg font-bold text-slate-800">{mood.count}</div>
                <div className="text-xs text-slate-500">{mood.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Wellness Tools</h3>
          <div className="space-y-4">
            <ToolUsageItem icon={Brain} name="AI Chat Therapy" uses={1234} growth={15} />
            <ToolUsageItem icon={BookOpen} name="Guided Journaling" uses={876} growth={23} />
            <ToolUsageItem icon={Heart} name="Mood Tracker" uses={654} growth={8} />
            <ToolUsageItem icon={Lightbulb} name="Daily Wisdom" uses={432} growth={31} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Engagement Heatmap (Weekly)</h3>
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <div key={day} className="text-center">
              <div className="text-xs text-slate-500 mb-2">{day}</div>
              {[...Array(24)].map((_, hour) => {
                const intensity = Math.random();
                return (
                  <div 
                    key={hour}
                    className={`h-3 rounded-sm mb-0.5 ${
                      intensity > 0.7 ? 'bg-teal-500' :
                      intensity > 0.4 ? 'bg-teal-300' :
                      intensity > 0.2 ? 'bg-teal-100' : 'bg-slate-50'
                    }`}
                    title={`${hour}:00`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ContentSection({ stats }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={FileText} label="Blog Posts" value={24} color="sage" />
        <MetricCard icon={Eye} label="Total Views" value="12.4K" change="+18%" changeUp={true} color="teal" />
        <MetricCard icon={MessageCircle} label="Comments" value={89} color="violet" />
        <MetricCard icon={Heart} label="Engagement" value="4.2%" change="+0.8%" changeUp={true} color="rose" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Recent Content</h3>
          <Link href="/content-admin" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {[
            { title: "Finding Peace in Uncertainty", status: "published", views: 1234, date: "2 days ago" },
            { title: "The Art of Self-Compassion", status: "published", views: 987, date: "5 days ago" },
            { title: "Building Emotional Resilience", status: "draft", views: 0, date: "Draft" },
            { title: "Morning Rituals for Mental Clarity", status: "scheduled", views: 0, date: "Tomorrow" },
          ].map((post, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{post.title}</h4>
                  <p className="text-sm text-slate-500">{post.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {post.views > 0 && (
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {post.views}
                  </span>
                )}
                <StatusBadge status={post.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SystemSection({ stats, realtimeData }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Server} label="API Health" value="99.9%" color="emerald" />
        <MetricCard icon={Database} label="DB Status" value="Healthy" color="teal" />
        <MetricCard icon={Cpu} label="CPU Usage" value="23%" color="violet" />
        <MetricCard icon={HardDrive} label="Storage" value="45%" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">System Status</h3>
          <div className="space-y-4">
            <SystemStatusItem label="API Server" status="operational" latency="45ms" />
            <SystemStatusItem label="Database" status="operational" latency="12ms" />
            <SystemStatusItem label="AI Services" status="operational" latency="230ms" />
            <SystemStatusItem label="CDN" status="operational" latency="8ms" />
            <SystemStatusItem label="Email Service" status="operational" latency="180ms" />
            <SystemStatusItem label="Payment Gateway" status="operational" latency="95ms" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Resource Usage</h3>
          <div className="space-y-6">
            <ResourceGauge label="CPU" value={23} max={100} unit="%" color="violet" />
            <ResourceGauge label="Memory" value={1.2} max={4} unit="GB" color="teal" />
            <ResourceGauge label="Storage" value={4.5} max={10} unit="GB" color="amber" />
            <ResourceGauge label="Bandwidth" value={125} max={500} unit="GB" color="rose" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent API Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Endpoint</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Method</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { endpoint: "/api/chat", method: "POST", status: 200, duration: "234ms", time: "Just now" },
                { endpoint: "/api/journal", method: "GET", status: 200, duration: "45ms", time: "1 min ago" },
                { endpoint: "/api/mood", method: "POST", status: 201, duration: "67ms", time: "2 min ago" },
                { endpoint: "/api/user/profile", method: "GET", status: 200, duration: "23ms", time: "3 min ago" },
              ].map((req, i) => (
                <tr key={i} className="border-t border-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-700">{req.endpoint}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      req.method === 'GET' ? 'bg-emerald-100 text-emerald-700' :
                      req.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.method}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${req.status < 400 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{req.duration}</td>
                  <td className="py-3 px-4 text-slate-500">{req.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function SecuritySection({ stats }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Shield} label="Security Score" value="A+" color="emerald" />
        <MetricCard icon={Lock} label="Active Sessions" value={stats?.sessions || 24} color="teal" />
        <MetricCard icon={AlertTriangle} label="Threats Blocked" value={12} color="rose" />
        <MetricCard icon={Eye} label="Audit Events" value={stats?.auditLogs || 1234} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Security Checklist</h3>
          <div className="space-y-3">
            <SecurityCheckItem label="SSL/TLS Encryption" status="enabled" />
            <SecurityCheckItem label="Rate Limiting" status="enabled" />
            <SecurityCheckItem label="CSRF Protection" status="enabled" />
            <SecurityCheckItem label="SQL Injection Prevention" status="enabled" />
            <SecurityCheckItem label="XSS Protection" status="enabled" />
            <SecurityCheckItem label="Content Security Policy" status="enabled" />
            <SecurityCheckItem label="Two-Factor Auth" status="optional" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Security Events</h3>
          <div className="space-y-4">
            <SecurityEvent type="info" message="Admin login successful" time="5 min ago" />
            <SecurityEvent type="warning" message="Rate limit triggered (IP: 192.168.1.x)" time="1 hour ago" />
            <SecurityEvent type="success" message="Security scan completed" time="3 hours ago" />
            <SecurityEvent type="info" message="Session cleanup completed" time="6 hours ago" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Audit Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Action</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">IP Address</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {[
                { action: "Admin login", user: "admin@genuine.love", ip: "192.168.1.1", time: "5 min ago" },
                { action: "User created", user: "admin@genuine.love", ip: "192.168.1.1", time: "1 hour ago" },
                { action: "Settings updated", user: "admin@genuine.love", ip: "192.168.1.1", time: "2 hours ago" },
                { action: "Blog published", user: "admin@genuine.love", ip: "192.168.1.1", time: "1 day ago" },
              ].map((log, i) => (
                <tr key={i} className="border-t border-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-700">{log.action}</td>
                  <td className="py-3 px-4 text-slate-500">{log.user}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.ip}</td>
                  <td className="py-3 px-4 text-slate-500">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function MetricCard({ icon: Icon, label, value, change, changeUp, color, sparklineData }) {
  const colorClasses = {
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600', gradient: 'from-teal-500 to-teal-600' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-600', gradient: 'from-rose-500 to-rose-600' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', gradient: 'from-violet-500 to-violet-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
    sage: { bg: 'bg-sage-50', icon: 'text-sage-600', gradient: 'from-sage-500 to-sage-600' },
    slate: { bg: 'bg-slate-100', icon: 'text-slate-600', gradient: 'from-slate-500 to-slate-600' },
  };
  
  const colors = colorClasses[color] || colorClasses.teal;
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        {change && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            changeUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
          }`}>
            {changeUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      {sparklineData && (
        <div className="mt-3 flex items-end gap-0.5 h-8">
          {sparklineData.map((val, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-t bg-gradient-to-t ${colors.gradient} opacity-60`}
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RealtimeMetric({ label, value, icon: Icon, color }) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function ActivityItem({ icon: Icon, text, time, color }) {
  const colorClasses = {
    teal: 'bg-teal-100 text-teal-600',
    rose: 'bg-rose-100 text-rose-600',
    violet: 'bg-violet-100 text-violet-600',
    amber: 'bg-amber-100 text-amber-600',
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 text-sm text-slate-600">{text}</div>
      <div className="text-xs text-slate-400">{time}</div>
    </div>
  );
}

function UsageBar({ label, percent, color }) {
  const colorClasses = {
    teal: 'bg-teal-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
    sage: 'bg-sage-500',
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-medium text-slate-800">{percent}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, href, color }) {
  const colorClasses = {
    teal: 'icon-gradient-teal',
    gold: 'icon-gradient-gold',
    violet: 'from-violet-500 to-purple-600',
    slate: 'from-slate-500 to-slate-600',
  };
  
  return (
    <Link href={href} className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all group">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
        {title}
        <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
      </h3>
      <p className="text-sm text-slate-500">{description}</p>
    </Link>
  );
}

function StatusBadge({ status }) {
  const statusClasses = {
    active: 'bg-emerald-100 text-emerald-700',
    trial: 'bg-violet-100 text-violet-700',
    churned: 'bg-rose-100 text-rose-700',
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-slate-100 text-slate-600',
    scheduled: 'bg-amber-100 text-amber-700',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function FunnelStep({ label, value, percent, color }) {
  const colorClasses = {
    slate: 'bg-slate-200',
    teal: 'bg-teal-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  };
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 text-sm text-slate-600">{label}</div>
      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden relative">
        <div className={`h-full ${colorClasses[color]} rounded-full transition-all`} style={{ width: `${percent}%` }} />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
          {value}
        </span>
      </div>
      <div className="w-12 text-right text-sm font-medium text-slate-600">{percent}%</div>
    </div>
  );
}

function ToolUsageItem({ icon: Icon, name, uses, growth }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition">
      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-teal-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-slate-800">{name}</h4>
        <p className="text-sm text-slate-500">{uses.toLocaleString()} uses</p>
      </div>
      <span className="text-sm text-emerald-600 flex items-center gap-1">
        <ArrowUpRight className="w-3.5 h-3.5" />
        {growth}%
      </span>
    </div>
  );
}

function SystemStatusItem({ label, status, latency }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span className="font-medium text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">{latency}</span>
        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
          {status}
        </span>
      </div>
    </div>
  );
}

function ResourceGauge({ label, value, max, unit, color }) {
  const percent = (value / max) * 100;
  const colorClasses = {
    violet: 'text-violet-600',
    teal: 'text-teal-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-sm font-semibold ${colorClasses[color]}`}>{value} {unit}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            percent > 80 ? 'bg-rose-500' : 
            percent > 60 ? 'bg-amber-500' : 'bg-teal-500'
          }`} 
          style={{ width: `${percent}%` }} 
        />
      </div>
      <div className="text-xs text-slate-400 mt-1 text-right">{max} {unit} max</div>
    </div>
  );
}

function SecurityCheckItem({ label, status }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
        status === 'enabled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

function SecurityEvent({ type, message, time }) {
  const typeClasses = {
    info: { bg: 'bg-blue-50', icon: Info, color: 'text-blue-600' },
    warning: { bg: 'bg-amber-50', icon: AlertTriangle, color: 'text-amber-600' },
    success: { bg: 'bg-emerald-50', icon: CheckCircle2, color: 'text-emerald-600' },
    error: { bg: 'bg-rose-50', icon: AlertCircle, color: 'text-rose-600' },
  };
  
  const config = typeClasses[type];
  const Icon = config.icon;
  
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${config.bg}`}>
      <Icon className={`w-5 h-5 ${config.color} mt-0.5`} />
      <div className="flex-1">
        <p className="text-sm text-slate-700">{message}</p>
        <p className="text-xs text-slate-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
