import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Shield, Activity, Users, Database, Server, Globe, AlertTriangle, CheckCircle, Clock, RefreshCw, BarChart3, Zap, FileText, Settings, ArrowRight, TrendingUp, Eye, Lock, HardDrive, AlertCircle, BookOpen, MessageSquare, Heart, Calendar, Megaphone, Mail, Flag, Palette, Search, LayoutDashboard, PenTool, Layers, LineChart, ShieldCheck, ToggleLeft, Star, ClipboardList, Sparkles, Brain, Compass, Flame, Leaf, Sun, Moon, Lightbulb, Target, DollarSign, Wand2, GraduationCap, Headphones, HeartHandshake, Flower2, TreePine, CircleDot, Footprints, Gem, Mountain, Feather, CheckSquare, Play, UserCheck, CreditCard, Key, Workflow, Network, Gauge, Trophy, Award, Landmark, Orbit, Rocket, Puzzle, FileQuestion, Webhook, Share2, Contact, Inbox, LogIn, PackageCheck, Milestone, Handshake, Upload, UserCog, ListOrdered, Radio, Fingerprint, FolderKanban, Rss } from 'lucide-react';
import { useSEO } from "@/hooks/useSEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import SafeBoundary from "../../components/SafeBoundary";
import SOPMonitorPanel from "@/components/admin/SOPMonitorPanel";
import OperationsPanel from "@/components/admin/OperationsPanel";
import ConsciousnessRegistryPanel from "@/components/admin/ConsciousnessRegistryPanel";
import OrchestratorTestPanel from "@/components/admin/OrchestratorTestPanel";
import RecentActivityPanel from "@/components/admin/RecentActivityPanel";
import MetricCard from "@/components/admin/MetricCard";
import StatusBadge from "@/components/admin/StatusBadge";
import SystemHealthPanel from "@/components/admin/SystemHealthPanel";
import AdminNavGrid from "@/components/admin/AdminNavGrid";
import KernelStatusPanel from "@/components/admin/KernelStatusPanel";
import DailyToolsPanel from "@/components/admin/DailyToolsPanel";
import SystemTelemetryPanel from "@/components/admin/SystemTelemetryPanel";
import DailyOpsChecklist from "@/components/admin/DailyOpsChecklist";
import { toolCategories } from "@/config/toolCategories";
import styles from "./CommandCenter.module.css";

function formatUptime(seconds) {
  if (!seconds) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatEventType(type) {
  return (type || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function AIKnowledgeHub() {
  const [aiStatuses, setAiStatuses] = useState({});
  const [checking, setChecking] = useState(false);

  const aiSystems = [
    { id: 'openai', label: 'OpenAI Chat Engine', desc: 'AI-powered wellness conversations with trauma-informed responses', endpoint: '/api/ai/history', icon: MessageSquare, color: '#10a37f', capability: 'Conversation AI, emotional guidance, crisis detection' },
    { id: 'perplexity', label: 'Perplexity AI (Factual)', desc: 'Evidence-based factual research for content validation', endpoint: '/api/perplexity', icon: Search, color: '#1da1f2', capability: 'Fact-checking, research synthesis, content validation' },
    { id: 'canva', label: 'Canva AI Design', desc: 'Visual content creation and brand-aligned design tools', endpoint: '/api/canva-oauth', icon: Palette, color: '#7d2ae8', capability: 'Brand templates, social graphics, visual identity' },
    { id: 'codex', label: 'Codex Knowledge Base', desc: 'Platform intelligence, self-repair diagnostics, and optimization engine', endpoint: '/api/integrations', icon: Brain, color: '#f59e0b', capability: 'Health diagnostics, route validation, remediation' },
  ];

  const knowledgeAreas = [
    { label: 'Wellness Tools', count: 10, href: '/admin/tools', icon: Heart, desc: 'Mood, journal, gratitude, reflection' },
    { label: 'Intelligence APIs', count: 14, href: '/admin/tools', icon: Brain, desc: 'Wisdom, cognitive, deep learning' },
    { label: 'Healing Protocols', count: 11, href: '/admin/tools', icon: Leaf, desc: 'Trauma, emotional, holistic' },
    { label: 'Mastery & Purpose', count: 13, href: '/admin/tools', icon: Target, desc: 'Self-mastery, performance, values' },
    { label: 'Content Pipeline', count: 12, href: '/admin/tools', icon: FileText, desc: 'Studio, blog, newsletter, social, feeds' },
    { label: 'Relational & Social', count: 8, href: '/admin/tools', icon: HeartHandshake, desc: 'Relationships, community, empathy' },
    { label: 'Advanced Intelligence', count: 11, href: '/admin/tools', icon: Sparkles, desc: 'Consciousness, spiritual, ethical' },
    { label: 'User & Engagement', count: 13, href: '/admin/tools', icon: Users, desc: 'Accounts, gamification, feedback' },
    { label: 'Admin Systems', count: 15, href: '/admin/tools', icon: Shield, desc: 'Security, audit, analytics, storage' },
    { label: 'Infrastructure', count: 20, href: '/admin/tools', icon: Server, desc: 'Auth, billing, email, webhooks' },
  ];

  const totalToolCount = knowledgeAreas.reduce((sum, a) => sum + a.count, 0);

  const checkAISystems = async () => {
    setChecking(true);
    const results = {};
    for (const sys of aiSystems) {
      try {
        const start = performance.now();
        const res = await fetch(sys.endpoint, { credentials: 'include' });
        const ms = Math.round(performance.now() - start);
        const ok = res.ok || res.status === 401 || res.status === 403 || res.status === 405;
        results[sys.id] = { status: ok ? 'active' : 'issue', ms, code: res.status };
      } catch {
        results[sys.id] = { status: 'offline', ms: 0, code: 0 };
      }
    }
    setAiStatuses(results);
    setChecking(false);
  };

  const activeCount = Object.values(aiStatuses).filter(s => s.status === 'active').length;
  const hasResults = Object.keys(aiStatuses).length > 0;

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Brain className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>AI Knowledge Hub</h2>
          {hasResults && (
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, background: activeCount === aiSystems.length ? '#dcfce7' : '#fef3c7', color: activeCount === aiSystems.length ? '#16a34a' : '#d97706' }}>
              {activeCount}/{aiSystems.length} AI systems active
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={checkAISystems} disabled={checking} style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} data-testid="button-check-ai-systems">
            <RefreshCw size={10} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking...' : 'Check AI'}
          </button>
          <Link href="/admin/tools" style={{ fontSize: '0.75rem', color: 'hsl(var(--primary))', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }} data-testid="link-ai-hub-tools">
            All {totalToolCount} Tools <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      <div style={{ padding: '0 1rem 0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {aiSystems.map(sys => {
            const st = aiStatuses[sys.id];
            const statusColor = st?.status === 'active' ? '#22c55e' : st?.status === 'issue' ? '#eab308' : st?.status === 'offline' ? '#ef4444' : '#94a3b8';
            return (
              <div key={sys.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '0.75rem', borderRadius: '10px',
                border: `1px solid ${st?.status === 'issue' ? '#fbbf2433' : st?.status === 'offline' ? '#ef444433' : 'rgba(0,0,0,0.08)'}`,
                background: 'rgba(0,0,0,0.015)'
              }} data-testid={`ai-system-${sys.id}`}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${sys.color}15`, flexShrink: 0
                }}>
                  <sys.icon size={18} style={{ color: sys.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {sys.label}
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                    {st && <span style={{ fontSize: '0.6rem', color: '#888' }}>{st.ms}ms</span>}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#888', lineHeight: 1.3, marginBottom: '2px' }}>{sys.desc}</div>
                  <div style={{ fontSize: '0.62rem', color: '#aaa', lineHeight: 1.2 }}>{sys.capability}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
          {knowledgeAreas.map(area => (
            <Link key={area.label} href={area.href} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.65rem', borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.06)', background: 'hsl(var(--muted))',
              textDecoration: 'none', color: 'inherit', fontSize: '0.78rem'
            }} data-testid={`knowledge-area-${area.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <area.icon size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>{area.label}</div>
                <div style={{ fontSize: '0.62rem', color: '#999', lineHeight: 1.2 }}>{area.desc}</div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'hsl(var(--primary))' }}>{area.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolsStatusWidget() {
  const [toolsData, setToolsData] = useState(null);
  const [isQuickChecking, setIsQuickChecking] = useState(false);
  const [quickResults, setQuickResults] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('glp_tools_last_check');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.results && Date.now() - parsed.timestamp < 3600000) {
          setToolsData(parsed);
        }
      }
    } catch {}
  }, []);

  const QUICK_ENDPOINTS = [
    { id: 'health', label: 'System Health', endpoint: '/api/health' },
    { id: 'auth', label: 'Auth Service', endpoint: '/api/auth/user' },
    { id: 'blog', label: 'Blog Engine', endpoint: '/api/blog' },
    { id: 'billing', label: 'Billing API', endpoint: '/api/billing' },
    { id: 'email', label: 'Email Service', endpoint: '/api/email' },
    { id: 'perplexity', label: 'Perplexity AI', endpoint: '/api/perplexity' },
    { id: 'canva', label: 'Canva AI', endpoint: '/api/canva-oauth' },
    { id: 'ai-engine', label: 'AI Engine', endpoint: '/api/ai/history' },
  ];

  const runQuickCheck = async () => {
    setIsQuickChecking(true);
    const results = {};
    await Promise.all(QUICK_ENDPOINTS.map(async (ep) => {
      const start = performance.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        let res = await fetch(ep.endpoint, { method: 'GET', credentials: 'include', signal: controller.signal });
        clearTimeout(timeout);
        if (res.status === 405) {
          const c2 = new AbortController();
          const t2 = setTimeout(() => c2.abort(), 6000);
          res = await fetch(ep.endpoint, { method: 'HEAD', credentials: 'include', signal: c2.signal });
          clearTimeout(t2);
        }
        const ms = Math.round(performance.now() - start);
        const ok = res.ok || res.status === 401 || res.status === 403 || res.status === 405;
        results[ep.id] = { ok, status: res.status, ms };
      } catch {
        results[ep.id] = { ok: false, status: 0, ms: Math.round(performance.now() - start) };
      }
    }));
    setQuickResults(results);
    setIsQuickChecking(false);
  };

  if (!toolsData) {
    return (
      <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleContainer}>
            <Zap className={styles.cardHeaderIcon} />
            <h2 className={styles.cardTitle}>Platform Tools Status</h2>
          </div>
          <button onClick={runQuickCheck} disabled={isQuickChecking} style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.75rem', padding: '0.35rem 0.65rem', borderRadius: '6px',
            border: '1px solid hsl(var(--border))', background: 'transparent', cursor: 'pointer',
            color: 'hsl(var(--primary))', opacity: isQuickChecking ? 0.5 : 1
          }} data-testid="button-quick-check">
            {isQuickChecking ? <RefreshCw size={12} className={styles.refreshIconSpinning} /> : <Activity size={12} />}
            Quick Check
          </button>
        </div>
        <div style={{ padding: '0.75rem 1rem' }}>
          {quickResults ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {QUICK_ENDPOINTS.map(ep => {
                const r = quickResults[ep.id];
                return (
                  <div key={ep.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '0.4rem 0.5rem', borderRadius: '6px', background: 'hsl(var(--muted))' }} data-testid={`quick-check-${ep.id}`}>
                    {r?.ok ? <CheckCircle size={13} style={{ color: '#22c55e', flexShrink: 0 }} /> : <AlertCircle size={13} style={{ color: '#ef4444', flexShrink: 0 }} />}
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.label}</span>
                    <span style={{ fontSize: '0.65rem', color: '#888' }}>{r?.ms || 0}ms</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.75rem', textAlign: 'center' }}>No recent full health check. Run a quick check or go to Platform Tools for a full scan.</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
            <Link href="/admin/tools" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '0.5rem 1rem', borderRadius: '8px',
              background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))',
              fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none'
            }} data-testid="link-run-first-check">
              <Play size={14} /> Full Daily Operations Check
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const results = Object.values(toolsData.results);
  const total = results.length;
  const healthy = results.filter(r => r.status === 'healthy').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;
  const avgMs = total > 0 ? Math.round(results.reduce((s, r) => s + (r.ms || 0), 0) / total) : 0;
  const healthPercent = total > 0 ? Math.round((healthy / total) * 100) : 0;
  const timeSince = toolsData.timestamp ? new Date(toolsData.timestamp).toLocaleTimeString() : '—';
  const isStale = toolsData.timestamp && (Date.now() - toolsData.timestamp > 1800000);
  const scoreColor = healthPercent >= 90 ? '#22c55e' : healthPercent >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }} data-testid="panel-tools-status">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Zap className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Platform Tools Status</h2>
          <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '0.5rem' }}>
            {total} tools checked at {timeSince}
            {isStale && <span style={{ color: '#f59e0b', marginLeft: '4px' }}>(stale)</span>}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={runQuickCheck} disabled={isQuickChecking} style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.7rem', padding: '0.3rem 0.5rem', borderRadius: '5px',
            border: '1px solid hsl(var(--border))', background: 'transparent', cursor: 'pointer',
            color: 'hsl(var(--muted-foreground))', opacity: isQuickChecking ? 0.5 : 1
          }} data-testid="button-quick-recheck">
            {isQuickChecking ? <RefreshCw size={11} className={styles.refreshIconSpinning} /> : <Activity size={11} />}
            Quick
          </button>
          <Link href="/admin/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.75rem', color: 'hsl(var(--primary))', textDecoration: 'none'
          }} data-testid="link-view-all-tools">
            Full Check <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      {quickResults && (
        <div style={{ padding: '0 1rem 0.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.4rem' }}>
          {QUICK_ENDPOINTS.map(ep => {
            const r = quickResults[ep.id];
            return (
              <div key={ep.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', padding: '0.3rem 0.5rem', borderRadius: '5px', background: 'hsl(var(--muted))' }} data-testid={`quick-check-${ep.id}`}>
                {r?.ok ? <CheckCircle size={12} style={{ color: '#22c55e', flexShrink: 0 }} /> : <AlertCircle size={12} style={{ color: '#ef4444', flexShrink: 0 }} />}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.label}</span>
                <span style={{ fontSize: '0.6rem', color: '#888' }}>{r?.ms || 0}ms</span>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ padding: '0 1rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: scoreColor }} data-testid="text-tools-health-pct">{healthPercent}%</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Health Score</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }} data-testid="text-tools-healthy">{healthy}</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Healthy</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }} data-testid="text-tools-warnings">{warnings}</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Warnings</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }} data-testid="text-tools-errors">{errors}</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Errors</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#64748b' }} data-testid="text-tools-avg-ms">{avgMs}ms</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Avg Response</div>
        </div>
      </div>
      <div style={{ padding: '0 1rem 0.75rem' }}>
        <div style={{ height: '6px', borderRadius: '3px', background: '#e5e7eb', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', borderRadius: '3px', transition: 'width 0.3s',
            width: `${healthPercent}%`,
            background: scoreColor
          }} />
        </div>
      </div>
      {(errors > 0 || isStale) && (
        <div style={{ padding: '0 1rem 0.75rem' }}>
          <Link href="/admin/tools" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.5rem 0.75rem', borderRadius: '8px',
            background: errors > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${errors > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
            fontSize: '0.78rem', color: errors > 0 ? '#dc2626' : '#d97706',
            textDecoration: 'none', fontWeight: 500
          }} data-testid="link-fix-tools-issues">
            <AlertTriangle size={14} />
            {errors > 0 ? `${errors} tool(s) need attention` : 'Results may be stale - re-run checks'}
            <ArrowRight size={12} style={{ marginLeft: 'auto' }} />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AdminCommandCenter() {
  useSEO({
    title: "Admin Command Center - The Genuine Love Project",
    description: "Platform administration dashboard with system monitoring, user management, and analytics.",
    noIndex: true
  });

  const { data: healthData, refetch: refetchHealth, isRefetching: isHealthRefetching, isLoading: isHealthLoading, error: healthError } = useQuery({
    queryKey: ['/api/health'],
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
    refetchInterval: 60000
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
    refetchInterval: 60000,
    select: (data) => data?.data || data,
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (healthData || statsData) {
      setLastUpdated(new Date());
    }
  }, [healthData, statsData]);

  const handleRefreshAll = () => {
    refetchHealth();
  };

  const stats = statsData || {};

  const metrics = [
    { title: "Users", value: stats.users?.toLocaleString() || "—", icon: Users, color: "sage", subtitle: "Total registered" },
    { title: "Blog Posts", value: stats.blogPosts || "—", icon: BookOpen, color: "gold", subtitle: `${stats.publishedBlogs || 0} published` },
    { title: "Social Posts", value: stats.socialPosts || "—", icon: Megaphone, color: "teal", subtitle: `${stats.socialDrafts || 0} drafts` },
    { title: "Campaigns", value: stats.campaigns || "0", icon: Flag, color: "blush", subtitle: "Active campaigns" },
    { title: "Leads", value: stats.leads || "—", icon: Mail, color: "sage", subtitle: "Newsletter signups" },
    { title: "Uptime", value: formatUptime(stats.uptimeSeconds), icon: Activity, color: "teal", subtitle: "Current session" },
  ];

  if (isHealthLoading && isStatsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.loadingSpinner} />
        <p className={styles.loadingText} data-testid="text-loading">Loading admin dashboard...</p>
      </div>
    );
  }

  if (healthError && !statsData) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <h2 className={styles.errorTitle} data-testid="text-error-title">Unable to load admin dashboard</h2>
        <p className={styles.errorText} data-testid="text-error-message">We're having trouble connecting to the server. Please try again.</p>
        <button className={styles.retryButton} onClick={handleRefreshAll} data-testid="button-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleContainer}>
              <div className={styles.titleIcon}>
                <Shield className={styles.titleIconInner} />
              </div>
              <h1 className={styles.pageTitle} data-testid="text-page-title">Command Center</h1>
            </div>
            <div className={styles.headerActions}>
              <span className={styles.lastUpdated} data-testid="text-last-updated">
                <Clock className={styles.clockIcon} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <button 
                className={styles.refreshButton}
                onClick={handleRefreshAll}
                disabled={isHealthRefetching}
                data-testid="button-refresh-all"
              >
                <RefreshCw className={`${styles.refreshIcon} ${isHealthRefetching ? styles.refreshIconSpinning : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          <p className={styles.leadText}>Monitor system health, manage content, and track platform performance.</p>
        </header>

        <div className={styles.metricsGrid}>
          {metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        <div className={styles.mainGrid}>
          <SafeBoundary label="System Health">
            <SystemHealthPanel 
              health={healthData} 
              onRefresh={refetchHealth} 
              isRefreshing={isHealthRefetching} 
            />
          </SafeBoundary>
          <SafeBoundary label="Recent Activity">
            <RecentActivityPanel activities={stats.recentActivity} formatEventType={formatEventType} timeAgo={timeAgo} styles={styles} />
          </SafeBoundary>
        </div>

        <div className={styles.mainGrid}>
          <SafeBoundary label="Kernel Status">
            <KernelStatusPanel />
          </SafeBoundary>
          <SafeBoundary label="System Telemetry">
            <SystemTelemetryPanel />
          </SafeBoundary>
        </div>

        <SafeBoundary label="Daily Ops Checklist">
          <DailyOpsChecklist />
        </SafeBoundary>

        <div className="my-8 space-y-6" data-testid="section-platform-healing">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" style={{ color: 'var(--glp-sage-deep)' }} />
            <h2 className="text-2xl font-serif" style={{ color: 'var(--glp-ink)' }}>Platform Healing &amp; Operations</h2>
            <span className="text-xs uppercase tracking-wider px-2 py-1 rounded" style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}>Live</span>
          </div>
          <p className="text-sm text-muted-foreground" style={{ marginTop: '-0.25rem' }}>
            Real-time SOP probes and self-heal controls. Safe, read-only diagnostics with explicit manual repair triggers.
          </p>
          <SafeBoundary label="SOP Monitor">
            <SOPMonitorPanel />
          </SafeBoundary>
          <SafeBoundary label="Operations Panel">
            <OperationsPanel />
          </SafeBoundary>
          <SafeBoundary label="Consciousness Registry">
            <ConsciousnessRegistryPanel />
          </SafeBoundary>
          <SafeBoundary label="Orchestrator Test">
            <OrchestratorTestPanel />
          </SafeBoundary>
        </div>

        <SafeBoundary label="Tools Status">
          <ToolsStatusWidget />
        </SafeBoundary>

        <SafeBoundary label="Admin Nav Grid">
          <AdminNavGrid />
        </SafeBoundary>

        <SafeBoundary label="AI Knowledge Hub">
          <AIKnowledgeHub />
        </SafeBoundary>

        <SafeBoundary label="Daily Tools">
          <DailyToolsPanel />
        </SafeBoundary>
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
