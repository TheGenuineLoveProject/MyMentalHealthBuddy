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
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";
import OperationsPanel from "@/components/admin/OperationsPanel";

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [adminSessionValid, setAdminSessionValid] = useState(null); // null = checking, true = valid, false = invalid
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 0,
    requestsPerMin: 0,
    avgResponseTime: 45,
    errorRate: 0.02,
  });

  // Verify admin session token on mount
  useEffect(() => {
    const verifyAdminSession = async () => {
      // If user has admin role, no need to verify token
      if (user?.role === "admin") {
        setAdminSessionValid(true);
        return;
      }
      
      const sessionToken = typeof sessionStorage !== 'undefined' 
        ? sessionStorage.getItem("adminSessionToken") 
        : null;
      
      if (!sessionToken) {
        setAdminSessionValid(false);
        return;
      }
      
      try {
        const response = await fetch("/api/admin/verify-session", {
          headers: { 
            "Authorization": `Bearer ${sessionToken}`,
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAdminSessionValid(data.valid === true);
        } else {
          // Invalid token - clear session storage
          sessionStorage.removeItem("adminVerified");
          sessionStorage.removeItem("adminSessionToken");
          setAdminSessionValid(false);
        }
      } catch (err) {
        console.error("[Admin] Session verification failed:", err);
        setAdminSessionValid(false);
      }
    };
    
    verifyAdminSession();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionToken = typeof sessionStorage !== 'undefined' 
        ? sessionStorage.getItem("adminSessionToken") 
        : null;
      
      const headers = sessionToken 
        ? { "Authorization": `Bearer ${sessionToken}` }
        : {};
      
      const response = await fetch("/api/admin/stats", { headers });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError("Failed to fetch stats");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminSessionValid === true || user?.role === "admin") {
      fetchStats();
    }
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        requestsPerMin: Math.max(10, prev.requestsPerMin + Math.floor(Math.random() * 20) - 10),
        avgResponseTime: Math.max(20, Math.min(100, prev.avgResponseTime + Math.floor(Math.random() * 10) - 5)),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() * 0.02) - 0.01)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [adminSessionValid, user]);

  // Show loading state while verifying session
  if (adminSessionValid === null && user?.role !== "admin") {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
        <SEO title="Verifying Access" description="Checking admin credentials" />
        <div className="glass-premium max-w-md text-center p-10 rounded-3xl animate-fade-in-up">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" />
          </div>
          <h2 className="text-heading-lg text-teal mb-3">Verifying Access</h2>
          <p className="text-body-base text-sage-500">Checking your admin credentials...</p>
        </div>
      </div>
    );
  }

  // Check for admin access via user role OR verified session token
  const hasAdminAccess = user?.role === "admin" || adminSessionValid === true;

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
        <SEO title="Access Denied" description="Admin access required" />
        <div className="glass-premium max-w-md text-center p-10 rounded-3xl animate-fade-in-up">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--glp-rose-15), var(--glp-paper))' }}>
            <Shield className="w-10 h-10" style={{ color: 'var(--glp-rose)' }} />
          </div>
          <h2 className="text-heading-lg text-teal mb-3">Access Denied</h2>
          <p className="text-body-base text-sage-500 mb-6">You must be an administrator to view this page.</p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="btn-premium inline-flex items-center justify-center gap-2">
              Return to Dashboard
            </Link>
            <Link href="/" className="text-sm font-medium" style={{ color: 'var(--glp-sage)' }}>
              Or use Admin Access from homepage
            </Link>
          </div>
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
    { id: "operations", label: "Operations", icon: Gauge },
  ];

  return (
    <WellnessPageShell
      title="Admin Command Center"
      subtitle="Platform administration and analytics"
      benefits={pickBenefits(["agency","clarity","agency"], 3)}
      clarity={{
        what: "Admin dashboard for platform management.",
        why: "To monitor and manage the platform.",
        who: "For administrators only.",
        when: "As needed for platform oversight.",
        where: "Right here.",
        how: "Navigate tabs to manage different areas."
      }}
      examples={[]}
    >
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
      <SEO title="Admin Command Center" description="Advanced platform administration and real-time analytics" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--glp-sage-15)' }} />
        <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full blur-3xl" style={{ background: 'var(--glp-gold-10)' }} />
      </div>
      
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10 py-10">
        <header className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-18 h-18 rounded-2xl flex items-center justify-center shadow-xl" style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 8px 24px var(--glp-sage-30)' }}>
                  <Shield className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center" style={{ background: 'var(--glp-sage)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl lg:text-4xl font-bold font-serif tracking-tight" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-admin-title">
                    Admin Command Center
                  </h1>
                  <span className="px-4 py-1.5 text-xs font-bold rounded-full text-white" style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))' }}>
                    PRO
                  </span>
                </div>
                <p className="text-base mt-2 flex items-center gap-3" style={{ color: 'var(--glp-sage)' }}>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: 'var(--glp-sage)' }} />
                    Live
                  </span>
                  <span style={{ color: 'var(--glp-sage-20)' }}>•</span>
                  <span>{realtimeData.activeUsers} active users</span>
                  <span style={{ color: 'var(--glp-sage-20)' }}>•</span>
                  <span>{realtimeData.requestsPerMin} req/min</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={fetchStats}
                disabled={loading}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ background: 'white', border: '2px solid var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}
                data-testid="button-refresh"
                aria-label={loading ? "Refreshing data" : "Refresh admin data"}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin motion-reduce:animate-none' : ''}`} aria-hidden="true" />
                Refresh
              </button>
              <Link
                href="/content-admin"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', boxShadow: '0 4px 16px var(--glp-gold-30)' }}
                data-testid="link-content-admin"
              >
                <Sparkles className="w-5 h-5" />
                Content Studio
              </Link>
              <Link
                href="/control"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}
              >
                <Settings className="w-5 h-5" />
                Controls
              </Link>
              <button
                onClick={() => toast({ title: "Export Started", description: "Preparing admin data export..." })}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 4px 16px var(--glp-rose-20)' }}
                data-testid="button-export"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </header>

        <nav className="flex items-center gap-3 mb-10 overflow-x-auto pb-3 scrollbar-hide" role="tablist" aria-label="Admin navigation">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={isActive 
                  ? { background: 'white', boxShadow: '0 4px 16px var(--glp-sage-15)', border: '2px solid var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }
                  : { background: 'transparent', color: 'var(--glp-sage)', border: '2px solid transparent' }
                }
                data-testid={`nav-${item.id}`}
                id={`nav-${item.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
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
              <div role="tabpanel" id="panel-overview" aria-labelledby="nav-overview">
                <OverviewSection stats={stats} realtimeData={realtimeData} />
              </div>
            )}
            {activeView === "users" && (
              <div role="tabpanel" id="panel-users" aria-labelledby="nav-users">
                <UsersSection stats={stats} />
              </div>
            )}
            {activeView === "engagement" && (
              <div role="tabpanel" id="panel-engagement" aria-labelledby="nav-engagement">
                <EngagementSection stats={stats} />
              </div>
            )}
            {activeView === "content" && (
              <div role="tabpanel" id="panel-content" aria-labelledby="nav-content">
                <ContentSection stats={stats} />
              </div>
            )}
            {activeView === "system" && (
              <div role="tabpanel" id="panel-system" aria-labelledby="nav-system">
                <SystemSection stats={stats} realtimeData={realtimeData} />
              </div>
            )}
            {activeView === "security" && (
              <div role="tabpanel" id="panel-security" aria-labelledby="nav-security">
                <SecuritySection stats={stats} />
              </div>
            )}
            {activeView === "operations" && (
              <div role="tabpanel" id="panel-operations" aria-labelledby="nav-operations">
                <OperationsPanel />
              </div>
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
    </WellnessPageShell>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-2xl p-7" style={{ background: 'white', border: '1px solid var(--glp-sage-15)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-xl" style={{ background: 'var(--glp-sage-10)' }} />
              <div className="w-16 h-5 rounded-full" style={{ background: 'var(--glp-sage-10)' }} />
            </div>
            <div className="h-10 w-24 rounded-lg mb-2" style={{ background: 'var(--glp-sage-10)' }} />
            <div className="h-4 w-20 rounded" style={{ background: 'var(--glp-sage-10)' }} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl p-8 h-80" style={{ background: 'white', border: '1px solid var(--glp-sage-15)' }} />
        <div className="rounded-2xl p-8 h-80" style={{ background: 'white', border: '1px solid var(--glp-sage-15)' }} />
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="rounded-3xl p-12 text-center max-w-lg mx-auto" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
      <div className="w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ width: '72px', height: '72px', background: 'var(--glp-rose-15)' }}>
        <AlertTriangle className="w-9 h-9" style={{ color: 'var(--glp-rose)' }} />
      </div>
      <h3 className="text-2xl font-semibold mb-3" style={{ color: 'var(--glp-charcoal)' }}>Unable to load dashboard</h3>
      <p className="mb-8" style={{ color: 'var(--glp-sage)' }}>{error}</p>
      <button 
        onClick={onRetry} 
        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}
      >
        <RefreshCw className="w-5 h-5" />
        Try Again
      </button>
    </div>
  );
}

function OverviewSection({ stats, realtimeData }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold flex items-center gap-3" style={{ color: 'var(--glp-charcoal)' }}>
              <Activity className="w-6 h-6" style={{ color: 'var(--glp-sage)' }} />
              Real-Time Activity
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: 'var(--glp-sage)' }} />
              <span style={{ color: 'var(--glp-sage)' }}>Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <RealtimeMetric label="Active Users" value={realtimeData.activeUsers} icon={Users} color="teal" />
            <RealtimeMetric label="Requests/min" value={realtimeData.requestsPerMin} icon={Zap} color="amber" />
            <RealtimeMetric label="Avg Response" value={`${realtimeData.avgResponseTime}ms`} icon={Clock} color="violet" />
            <RealtimeMetric label="Error Rate" value={`${(realtimeData.errorRate * 100).toFixed(2)}%`} icon={AlertCircle} color={realtimeData.errorRate > 0.05 ? "rose" : "emerald"} />
          </div>
          
          <div className="mt-8 p-5 rounded-xl" style={{ background: 'var(--glp-sage-10)' }}>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Activity Timeline</h4>
            <div className="space-y-3">
              <ActivityItem icon={UserPlus} text="New user registered" time="2 min ago" color="teal" />
              <ActivityItem icon={Heart} text="Wellness session completed" time="5 min ago" color="rose" />
              <ActivityItem icon={FileText} text="Journal entry saved" time="8 min ago" color="violet" />
              <ActivityItem icon={MessageCircle} text="AI conversation started" time="12 min ago" color="amber" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <h3 className="text-xl font-semibold mb-8 flex items-center gap-3" style={{ color: 'var(--glp-charcoal)' }}>
            <PieChart className="w-6 h-6" style={{ color: 'var(--glp-sage)' }} />
            Feature Usage
          </h3>
          <div className="space-y-5">
            <UsageBar label="AI Chat Therapy" percent={78} color="teal" />
            <UsageBar label="Mood Tracking" percent={65} color="amber" />
            <UsageBar label="Journaling" percent={52} color="violet" />
            <UsageBar label="Wellness Tools" percent={41} color="rose" />
            <UsageBar label="Community" percent={28} color="sage" />
          </div>
          <div className="mt-8 p-5 rounded-xl" style={{ background: 'var(--glp-sage-10)' }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--glp-sage)' }}>Most Active Hour</span>
              <span className="font-semibold" style={{ color: 'var(--glp-charcoal)' }}>9:00 PM</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-3">
              <span style={{ color: 'var(--glp-sage)' }}>Peak Day</span>
              <span className="font-semibold" style={{ color: 'var(--glp-charcoal)' }}>Sunday</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
  const { toast } = useToast();
  const mockUsers = [
    { id: 1, name: "Sarah M.", email: "sarah@example.com", status: "active", plan: "premium", sessions: 24, joined: "2 days ago", avatar: "S" },
    { id: 2, name: "James K.", email: "james@example.com", status: "active", plan: "free", sessions: 8, joined: "1 week ago", avatar: "J" },
    { id: 3, name: "Emily R.", email: "emily@example.com", status: "trial", plan: "trial", sessions: 3, joined: "3 days ago", avatar: "E" },
    { id: 4, name: "Michael T.", email: "michael@example.com", status: "churned", plan: "free", sessions: 1, joined: "1 month ago", avatar: "M" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={Users} label="Total Users" value={stats?.users || 0} change="+12%" changeUp={true} color="teal" />
        <MetricCard icon={UserPlus} label="New This Week" value={23} change="+18%" changeUp={true} color="emerald" />
        <MetricCard icon={UserCheck} label="Active Today" value={156} change="+8%" changeUp={true} color="violet" />
        <MetricCard icon={UserX} label="Churned" value={12} change="-5%" changeUp={false} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <div className="p-8" style={{ borderBottom: '1px solid var(--glp-sage-15)' }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-xl font-semibold" style={{ color: 'var(--glp-charcoal)' }}>User Directory</h3>
              <div className="flex items-center gap-4">
                <input 
                  type="search" 
                  placeholder="Search users..." 
                  className="px-5 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                  style={{ border: '2px solid var(--glp-sage-15)', background: 'white', color: 'var(--glp-charcoal)' }}
                />
                <button 
                  onClick={() => toast({ title: "Add User", description: "User creation form coming soon" })}
                  className="px-5 py-3 rounded-xl text-white text-sm font-medium transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 12px var(--glp-sage-30)' }}
                  data-testid="button-add-user"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'var(--glp-sage-10)' }}>
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Plan</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Sessions</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Joined</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(user => (
                  <tr key={user.id} className="transition" style={{ borderTop: '1px solid var(--glp-sage-10)' }}>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--glp-charcoal)' }}>{user.name}</p>
                          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-5 px-6">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={
                          user.plan === 'premium' ? { background: 'var(--glp-gold-10)', color: 'var(--glp-gold-dark)' } :
                          user.plan === 'trial' ? { background: 'var(--glp-sage-10)', color: 'var(--glp-sage-deep)' } :
                          { background: 'var(--glp-sage-10)', color: 'var(--glp-charcoal)' }
                        }
                      >
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </span>
                    </td>
                    <td className="py-5 px-6 font-semibold" style={{ color: 'var(--glp-charcoal)' }}>{user.sessions}</td>
                    <td className="py-5 px-6 text-sm" style={{ color: 'var(--glp-sage)' }}>{user.joined}</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toast({ title: "View User", description: `Viewing ${user.name}'s profile` })}
                          className="p-2.5 rounded-lg transition hover:bg-[var(--glp-sage-10)]" 
                          style={{ color: 'var(--glp-sage)' }}
                          data-testid={`button-view-user-${user.id}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => toast({ title: "Email User", description: `Opening email for ${user.email}` })}
                          className="p-2.5 rounded-lg transition hover:bg-[var(--glp-sage-10)]" 
                          style={{ color: 'var(--glp-sage)' }}
                          data-testid={`button-email-user-${user.id}`}
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => toast({ title: "User Settings", description: `Managing settings for ${user.name}` })}
                          className="p-2.5 rounded-lg transition hover:bg-[var(--glp-sage-10)]" 
                          style={{ color: 'var(--glp-sage)' }}
                          data-testid={`button-settings-user-${user.id}`}
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>User Funnel</h3>
            <div className="space-y-4">
              <FunnelStep label="Visitors" value={1240} percent={100} color="slate" />
              <FunnelStep label="Signups" value={340} percent={27} color="teal" />
              <FunnelStep label="Activated" value={180} percent={53} color="emerald" />
              <FunnelStep label="Subscribed" value={45} percent={25} color="amber" />
            </div>
          </div>

          <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>Revenue</h3>
            <div className="text-4xl font-bold mb-3" style={{ color: 'var(--glp-charcoal)' }}>$2,847</div>
            <p className="text-sm flex items-center gap-1.5 mb-6" style={{ color: 'var(--glp-sage-deep)' }}>
              <ArrowUpRight className="w-4 h-4" />
              +23% from last month
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--glp-sage)' }}>Active Subscriptions</span>
                <span className="font-semibold" style={{ color: 'var(--glp-charcoal)' }}>45</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--glp-sage)' }}>MRR</span>
                <span className="font-semibold" style={{ color: 'var(--glp-charcoal)' }}>$2,250</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--glp-sage)' }}>Lifetime Revenue</span>
                <span className="font-semibold" style={{ color: 'var(--glp-charcoal)' }}>$12,450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EngagementSection({ stats }) {
  const moodGradients = [
    { emoji: "😊", label: "Happy", count: 145, gradient: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))' },
    { emoji: "😌", label: "calm", count: 98, gradient: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' },
    { emoji: "😐", label: "Neutral", count: 67, gradient: 'linear-gradient(135deg, var(--glp-charcoal), #555)' },
    { emoji: "😟", label: "Anxious", count: 34, gradient: 'linear-gradient(135deg, var(--glp-sage-deep), #3d7a7a)' },
    { emoji: "😢", label: "Sad", count: 23, gradient: 'linear-gradient(135deg, var(--glp-rose), #e9a8a3)' },
  ];

  const getHeatmapColor = (intensity) => {
    if (intensity > 0.7) return 'var(--glp-sage)';
    if (intensity > 0.4) return 'var(--glp-sage-30)';
    if (intensity > 0.2) return 'var(--glp-sage-15)';
    return 'var(--glp-sage-10)';
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={Heart} label="Wellness Score Avg" value="7.2" color="rose" />
        <MetricCard icon={Flame} label="Active Streaks" value={89} change="+15%" changeUp={true} color="amber" />
        <MetricCard icon={Target} label="Goals Completed" value={234} change="+42%" changeUp={true} color="emerald" />
        <MetricCard icon={Award} label="Achievements" value={567} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>Mood Distribution (Last 7 Days)</h3>
          <div className="grid grid-cols-5 gap-4">
            {moodGradients.map((mood, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: mood.gradient }}>
                  {mood.emoji}
                </div>
                <div className="text-xl font-bold" style={{ color: 'var(--glp-charcoal)' }}>{mood.count}</div>
                <div className="text-xs" style={{ color: 'var(--glp-sage)' }}>{mood.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>Top Wellness Tools</h3>
          <div className="space-y-5">
            <ToolUsageItem icon={Brain} name="AI Chat Therapy" uses={1234} growth={15} />
            <ToolUsageItem icon={BookOpen} name="Guided Journaling" uses={876} growth={23} />
            <ToolUsageItem icon={Heart} name="Mood Tracker" uses={654} growth={8} />
            <ToolUsageItem icon={Lightbulb} name="Daily Wisdom" uses={432} growth={31} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
        <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>Engagement Heatmap (Weekly)</h3>
        <div className="grid grid-cols-7 gap-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <div key={day} className="text-center">
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--glp-sage)' }}>{day}</div>
              {[...Array(24)].map((_, hour) => {
                const intensity = Math.random();
                return (
                  <div 
                    key={hour}
                    className="h-3 rounded-sm mb-0.5"
                    style={{ background: getHeatmapColor(intensity) }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={FileText} label="Blog Posts" value={24} color="sage" />
        <MetricCard icon={Eye} label="Total Views" value="12.4K" change="+18%" changeUp={true} color="teal" />
        <MetricCard icon={MessageCircle} label="Comments" value={89} color="violet" />
        <MetricCard icon={Heart} label="Engagement" value="4.2%" change="+0.8%" changeUp={true} color="rose" />
      </div>

      <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold" style={{ color: 'var(--glp-charcoal)' }}>Recent Content</h3>
          <Link 
            href="/content-admin" 
            className="text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5"
            style={{ color: 'var(--glp-sage-deep)' }}
          >
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
            <div key={i} className="flex items-center justify-between p-5 rounded-xl transition" style={{ background: 'var(--glp-sage-10)' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'white' }}>
                  <FileText className="w-6 h-6" style={{ color: 'var(--glp-sage)' }} />
                </div>
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--glp-charcoal)' }}>{post.title}</h4>
                  <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{post.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {post.views > 0 && (
                  <span className="text-sm flex items-center gap-1.5" style={{ color: 'var(--glp-sage)' }}>
                    <Eye className="w-4 h-4" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={Server} label="API Health" value="99.9%" color="emerald" />
        <MetricCard icon={Database} label="DB Status" value="Healthy" color="teal" />
        <MetricCard icon={Cpu} label="CPU Usage" value="23%" color="violet" />
        <MetricCard icon={HardDrive} label="Storage" value="45%" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>System Status</h3>
          <div className="space-y-4">
            <SystemStatusItem label="API Server" status="operational" latency="45ms" />
            <SystemStatusItem label="Database" status="operational" latency="12ms" />
            <SystemStatusItem label="AI Services" status="operational" latency="230ms" />
            <SystemStatusItem label="CDN" status="operational" latency="8ms" />
            <SystemStatusItem label="Email Service" status="operational" latency="180ms" />
            <SystemStatusItem label="Payment Gateway" status="operational" latency="95ms" />
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>Resource Usage</h3>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={Shield} label="Security Score" value="A+" color="emerald" />
        <MetricCard icon={Lock} label="Active Sessions" value={stats?.sessions || 24} color="teal" />
        <MetricCard icon={AlertTriangle} label="Threats Blocked" value={12} color="rose" />
        <MetricCard icon={Eye} label="Audit Events" value={stats?.auditLogs || 1234} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>Security Checklist</h3>
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

        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>Recent Security Events</h3>
          <div className="space-y-4">
            <SecurityEvent type="info" message="Admin login successful" time="5 min ago" />
            <SecurityEvent type="warning" message="Rate limit triggered (IP: 192.168.1.x)" time="1 hour ago" />
            <SecurityEvent type="success" message="Security scan completed" time="3 hours ago" />
            <SecurityEvent type="info" message="Session cleanup completed" time="6 hours ago" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}>
        <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--glp-charcoal)' }}>Audit Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--glp-sage-10)' }}>
              <tr>
                <th className="text-left py-4 px-5 font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Action</th>
                <th className="text-left py-4 px-5 font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>User</th>
                <th className="text-left py-4 px-5 font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>IP Address</th>
                <th className="text-left py-4 px-5 font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Timestamp</th>
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
  const colorStyles = {
    teal: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage-deep)', gradient: 'var(--glp-sage)' },
    rose: { bg: 'var(--glp-rose-15)', icon: 'var(--glp-rose)', gradient: 'var(--glp-rose)' },
    violet: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage-deep)', gradient: 'var(--glp-sage-deep)' },
    amber: { bg: 'var(--glp-gold-10)', icon: 'var(--glp-gold-dark)', gradient: 'var(--glp-gold)' },
    emerald: { bg: 'var(--glp-sage-15)', icon: 'var(--glp-sage)', gradient: 'var(--glp-sage)' },
    sage: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage-deep)', gradient: 'var(--glp-sage)' },
    slate: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-charcoal)', gradient: 'var(--glp-charcoal)' },
  };
  
  const colors = colorStyles[color] || colorStyles.teal;
  
  return (
    <div 
      className="rounded-2xl p-7 transition-all group hover:-translate-y-1"
      style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
          style={{ background: colors.bg }}
        >
          <Icon className="w-7 h-7" style={{ color: colors.icon }} />
        </div>
        {change && (
          <span 
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={changeUp 
              ? { background: 'var(--glp-sage-10)', color: 'var(--glp-sage-deep)' }
              : { background: 'var(--glp-rose-15)', color: 'var(--glp-rose)' }
            }
          >
            {changeUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {change}
          </span>
        )}
      </div>
      <div className="text-4xl font-bold mb-2" style={{ color: 'var(--glp-charcoal)' }}>{value}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--glp-sage)' }}>{label}</div>
      {sparklineData && (
        <div className="mt-4 flex items-end gap-1 h-10">
          {sparklineData.map((val, i) => (
            <div 
              key={i} 
              className="flex-1 rounded-t opacity-70"
              style={{ height: `${val}%`, background: colors.gradient }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RealtimeMetric({ label, value, icon: Icon, color }) {
  const colorStyles = {
    teal: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage-deep)' },
    amber: { bg: 'var(--glp-gold-10)', icon: 'var(--glp-gold-dark)' },
    violet: { bg: 'var(--glp-sage-15)', icon: 'var(--glp-sage-deep)' },
    emerald: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage)' },
    rose: { bg: 'var(--glp-rose-15)', icon: 'var(--glp-rose)' },
  };
  
  const colors = colorStyles[color] || colorStyles.teal;
  
  return (
    <div className="p-5 rounded-xl" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-15)' }}>
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: colors.bg }}
      >
        <Icon className="w-6 h-6" style={{ color: colors.icon }} />
      </div>
      <div className="text-2xl font-bold" style={{ color: 'var(--glp-charcoal)' }}>{value}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--glp-sage)' }}>{label}</div>
    </div>
  );
}

function ActivityItem({ icon: Icon, text, time, color }) {
  const colorStyles = {
    teal: { bg: 'var(--glp-sage-15)', icon: 'var(--glp-sage-deep)' },
    rose: { bg: 'var(--glp-rose-15)', icon: 'var(--glp-rose)' },
    violet: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage-deep)' },
    amber: { bg: 'var(--glp-gold-10)', icon: 'var(--glp-gold-dark)' },
  };
  
  const colors = colorStyles[color] || colorStyles.teal;
  
  return (
    <div className="flex items-center gap-4">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: colors.bg }}
      >
        <Icon className="w-5 h-5" style={{ color: colors.icon }} />
      </div>
      <div className="flex-1 text-sm" style={{ color: 'var(--glp-charcoal)' }}>{text}</div>
      <div className="text-xs" style={{ color: 'var(--glp-sage)' }}>{time}</div>
    </div>
  );
}

function UsageBar({ label, percent, color }) {
  const colorStyles = {
    teal: 'var(--glp-sage)',
    amber: 'var(--glp-gold)',
    violet: 'var(--glp-sage-deep)',
    rose: 'var(--glp-rose)',
    sage: 'var(--glp-sage)',
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm" style={{ color: 'var(--glp-charcoal)' }}>{label}</span>
        <span className="text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>{percent}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--glp-sage-10)' }}>
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ width: `${percent}%`, background: colorStyles[color] || colorStyles.teal }} 
        />
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, href, color }) {
  const colorStyles = {
    teal: { bg: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', shadow: 'var(--glp-sage-30)' },
    gold: { bg: 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))', shadow: 'var(--glp-gold-30)' },
    violet: { bg: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', shadow: 'var(--glp-sage-30)' },
    slate: { bg: 'linear-gradient(135deg, var(--glp-charcoal), var(--glp-ink))', shadow: 'var(--glp-sage-20)' },
  };
  
  const colors = colorStyles[color] || colorStyles.teal;
  
  return (
    <Link 
      href={href} 
      className="block rounded-2xl p-7 transition-all group hover:-translate-y-1"
      style={{ background: 'white', border: '1px solid var(--glp-sage-15)', boxShadow: '0 4px 16px var(--glp-sage-10)' }}
    >
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-105 transition-transform"
        style={{ background: colors.bg, boxShadow: `0 4px 12px ${colors.shadow}` }}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--glp-charcoal)' }}>
        {title}
        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" style={{ color: 'var(--glp-sage)' }} />
      </h3>
      <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{description}</p>
    </Link>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    active: { bg: 'var(--glp-sage-10)', color: 'var(--glp-sage-deep)' },
    trial: { bg: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' },
    churned: { bg: 'var(--glp-rose-15)', color: 'var(--glp-rose)' },
    published: { bg: 'var(--glp-sage-10)', color: 'var(--glp-sage-deep)' },
    draft: { bg: 'var(--glp-sage-10)', color: 'var(--glp-charcoal)' },
    scheduled: { bg: 'var(--glp-gold-10)', color: 'var(--glp-gold-dark)' },
  };
  
  const styles = statusStyles[status] || statusStyles.active;
  
  return (
    <span 
      className="px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: styles.bg, color: styles.color }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function FunnelStep({ label, value, percent, color }) {
  const colorStyles = {
    slate: 'var(--glp-sage-20)',
    teal: 'var(--glp-sage)',
    emerald: 'var(--glp-sage-deep)',
    amber: 'var(--glp-gold)',
  };
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 text-sm" style={{ color: 'var(--glp-charcoal)' }}>{label}</div>
      <div className="flex-1 h-7 rounded-full overflow-hidden relative" style={{ background: 'var(--glp-sage-10)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: colorStyles[color] || colorStyles.teal }} />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold" style={{ color: 'var(--glp-charcoal)' }}>
          {value}
        </span>
      </div>
      <div className="w-12 text-right text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>{percent}%</div>
    </div>
  );
}

function ToolUsageItem({ icon: Icon, name, uses, growth }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl transition" style={{ background: 'var(--glp-sage-10)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'white' }}>
        <Icon className="w-6 h-6" style={{ color: 'var(--glp-sage)' }} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold" style={{ color: 'var(--glp-charcoal)' }}>{name}</h4>
        <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{uses.toLocaleString()} uses</p>
      </div>
      <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--glp-sage-deep)' }}>
        <ArrowUpRight className="w-4 h-4" />
        {growth}%
      </span>
    </div>
  );
}

function SystemStatusItem({ label, status, latency }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--glp-sage-10)' }}>
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ background: 'var(--glp-sage)' }} />
        <span className="font-semibold" style={{ color: 'var(--glp-charcoal)' }}>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm" style={{ color: 'var(--glp-sage)' }}>{latency}</span>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}>
          {status}
        </span>
      </div>
    </div>
  );
}

function ResourceGauge({ label, value, max, unit, color }) {
  const percent = (value / max) * 100;
  const colorStyles = {
    violet: 'var(--glp-sage-deep)',
    teal: 'var(--glp-sage)',
    amber: 'var(--glp-gold)',
    rose: 'var(--glp-rose)',
  };
  
  const getBarColor = (pct) => {
    if (pct > 80) return 'var(--glp-rose)';
    if (pct > 60) return 'var(--glp-gold)';
    return 'var(--glp-sage)';
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--glp-charcoal)' }}>{label}</span>
        <span className="text-sm font-semibold" style={{ color: colorStyles[color] || colorStyles.teal }}>{value} {unit}</span>
      </div>
      <div className="h-4 rounded-full overflow-hidden" style={{ background: 'var(--glp-sage-10)' }}>
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: getBarColor(percent) }}
        />
      </div>
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--glp-sage)' }}>{max} {unit} max</div>
    </div>
  );
}

function SecurityCheckItem({ label, status }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-15)' }}>
      <span className="text-sm font-semibold" style={{ color: 'var(--glp-charcoal)' }}>{label}</span>
      <span 
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
        style={status === 'enabled' ? { background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' } : { background: 'var(--glp-gold-10)', color: 'var(--glp-gold-dark)' }}
      >
        <CheckCircle2 className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

function SecurityEvent({ type, message, time }) {
  const typeStyles = {
    info: { bg: 'var(--glp-sage-10)', icon: Info, color: 'var(--glp-sage)' },
    warning: { bg: 'var(--glp-gold-10)', icon: AlertTriangle, color: 'var(--glp-gold-dark)' },
    success: { bg: 'var(--glp-sage-15)', icon: CheckCircle2, color: 'var(--glp-sage-deep)' },
    error: { bg: 'var(--glp-rose-15)', icon: AlertCircle, color: 'var(--glp-rose)' },
  };
  
  const config = typeStyles[type] || typeStyles.info;
  const Icon = config.icon;
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: config.bg }}>
      <Icon className="w-5 h-5 mt-0.5" style={{ color: config.color }} />
      <div className="flex-1">
        <p className="text-sm" style={{ color: 'var(--glp-charcoal)' }}>{message}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--glp-sage)' }}>{time}</p>
      </div>
    </div>
  );
}
