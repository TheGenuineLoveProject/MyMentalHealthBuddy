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
import { toolCategories } from "@/config/toolCategories";
import styles from "./CommandCenter.module.css";

function SystemTelemetryPanel() {
  const { data: telemetry } = useQuery({
    queryKey: ['/api/system'],
    retry: 1,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  if (!telemetry) return null;

  return (
    <div className={styles.card} data-testid="panel-system-telemetry">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <BarChart3 className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>System Telemetry</h2>
        </div>
      </div>
      <div style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#555' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
          <div data-testid="text-total-requests">
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f5d5d' }}>{telemetry.totalRequests?.toLocaleString() || 0}</div>
            <div>Total Requests</div>
          </div>
          <div data-testid="text-5xx-rate">
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: telemetry.errors5xx > 0 ? '#ef4444' : '#22c55e' }}>{telemetry.errorRate5xx}</div>
            <div>5xx Error Rate</div>
          </div>
          <div data-testid="text-4xx-rate">
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b' }}>{telemetry.errorRate4xx}</div>
            <div>4xx Client Errors</div>
          </div>
          <div data-testid="text-memory-rss">
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f5d5d' }}>{telemetry.memory?.rssMB || '—'}MB</div>
            <div>RSS Memory</div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function DailyToolsPanel() {
  const [runningTools, setRunningTools] = useState({});
  const [toolResults, setToolResults] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [lastFullCheck, setLastFullCheck] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [isRunningAll, setIsRunningAll] = useState(false);

  const toggleCategory = (idx) => {
    setCollapsedCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const collapseAll = () => {
    const all = {};
    toolCategories.forEach((_, i) => { all[i] = true; });
    setCollapsedCategories(all);
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  const runHealthCheck = async (tool) => {
    setRunningTools(prev => ({ ...prev, [tool.id]: true }));
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let res = await fetch(tool.endpoint, { method: 'GET', credentials: 'include', signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 405) {
        const c2 = new AbortController();
        const t2 = setTimeout(() => c2.abort(), 8000);
        res = await fetch(tool.endpoint, { method: 'HEAD', credentials: 'include', signal: c2.signal });
        clearTimeout(t2);
      }
      const responseTime = Math.round(performance.now() - startTime);
      let status = 'healthy';
      if (res.ok) status = 'healthy';
      else if (res.status === 401 || res.status === 403) status = 'healthy';
      else if (res.status === 405) status = 'healthy';
      else if (res.status === 404) status = 'error';
      else if (res.status === 429) status = 'warning';
      else if (res.status >= 500) status = 'error';
      else status = 'warning';
      const statusLabel = res.status === 401 ? 'auth-gated' : res.status === 403 ? 'admin-only' : res.status === 405 ? 'post-only' : res.status === 429 ? 'rate-limited' : res.status >= 500 ? 'server-error' : res.ok ? 'ok' : `${res.status}`;
      setToolResults(prev => ({ ...prev, [tool.id]: { status, code: res.status, time: new Date().toLocaleTimeString(), label: statusLabel, ms: responseTime } }));
    } catch (err) {
      const responseTime = Math.round(performance.now() - startTime);
      const label = err?.name === 'AbortError' ? 'timeout' : 'unreachable';
      setToolResults(prev => ({ ...prev, [tool.id]: { status: 'error', code: 0, time: new Date().toLocaleTimeString(), label, ms: responseTime } }));
    } finally {
      setRunningTools(prev => ({ ...prev, [tool.id]: false }));
    }
  };

  const runAllChecks = async () => {
    setIsRunningAll(true);
    setToolResults({});
    const allTools = toolCategories.flatMap(c => c.tools);
    const batchSize = 6;
    for (let i = 0; i < allTools.length; i += batchSize) {
      const batch = allTools.slice(i, i + batchSize);
      await Promise.all(batch.map(tool => runHealthCheck(tool)));
      if (i + batchSize < allTools.length) {
        await new Promise(r => setTimeout(r, 150));
      }
    }
    const checkTime = new Date().toLocaleTimeString();
    setLastFullCheck(checkTime);
    setIsRunningAll(false);
  };

  useEffect(() => {
    if (Object.keys(toolResults).length > 0 && lastFullCheck) {
      try {
        localStorage.setItem('glp_tools_last_check', JSON.stringify({
          results: toolResults,
          lastCheck: lastFullCheck,
          timestamp: Date.now()
        }));
      } catch {}
    }
  }, [toolResults, lastFullCheck]);

  const runErrorsOnly = async () => {
    const errorTools = toolCategories.flatMap(c => c.tools).filter(t => toolResults[t.id]?.status === 'error' || toolResults[t.id]?.status === 'warning');
    if (errorTools.length === 0) return;
    await Promise.all(errorTools.map(t => runHealthCheck(t)));
  };

  const totalTools = toolCategories.reduce((sum, c) => sum + c.tools.length, 0);
  const checkedCount = Object.keys(toolResults).length;
  const healthyCount = Object.values(toolResults).filter(r => r.status === 'healthy').length;
  const warningCount = Object.values(toolResults).filter(r => r.status === 'warning').length;
  const errorCount = Object.values(toolResults).filter(r => r.status === 'error').length;
  const isAnyRunning = isRunningAll || Object.values(runningTools).some(Boolean);
  const avgResponseTime = checkedCount > 0 ? Math.round(Object.values(toolResults).reduce((sum, r) => sum + (r.ms || 0), 0) / checkedCount) : 0;
  const maxResponseTime = checkedCount > 0 ? Math.max(...Object.values(toolResults).map(r => r.ms || 0)) : 0;
  const authGatedCount = Object.values(toolResults).filter(r => r.label === 'auth-gated' || r.label === 'admin-only').length;
  const rateLimitedCount = Object.values(toolResults).filter(r => r.label === 'rate-limited').length;

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Wand2 className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Platform Tools &mdash; Daily Health Monitor ({totalTools})</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {checkedCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }} data-testid="text-tool-check-summary">
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#22c55e' }}>
                <CheckCircle size={12} /> {healthyCount}
              </span>
              {warningCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#eab308' }}>
                  <AlertTriangle size={12} /> {warningCount}
                </span>
              )}
              {errorCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ef4444' }}>
                  <AlertCircle size={12} /> {errorCount}
                </span>
              )}
              <span style={{ color: '#888' }}>/ {totalTools}</span>
            </div>
          )}
          <button
            className={styles.refreshButton}
            onClick={runAllChecks}
            disabled={isAnyRunning}
            data-testid="button-run-all-tool-checks"
            title="Run health check on all platform tools"
          >
            {isAnyRunning ? (
              <RefreshCw size={14} style={{ marginRight: '4px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <Play size={14} style={{ marginRight: '4px' }} />
            )}
            {isAnyRunning ? `Checking... (${checkedCount}/${totalTools})` : 'Run All Checks'}
          </button>
        </div>
      </div>
      
      {checkedCount > 0 && (
        <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
          <div style={{ height: '4px', borderRadius: '2px', background: '#e5e7eb', overflow: 'hidden' }} data-testid="progress-bar-tools">
            <div style={{ 
              height: '100%', 
              width: `${(checkedCount / totalTools) * 100}%`, 
              background: errorCount > 0 ? '#ef4444' : warningCount > 0 ? '#eab308' : '#22c55e',
              transition: 'width 0.3s ease, background 0.3s ease',
              borderRadius: '2px'
            }} />
          </div>
        </div>
      )}
      
      {checkedCount === totalTools && !isAnyRunning && (() => {
        const healthScore = totalTools > 0 ? Math.round((healthyCount / totalTools) * 100) : 0;
        const scoreColor = healthScore >= 90 ? '#22c55e' : healthScore >= 70 ? '#f59e0b' : '#ef4444';
        const scoreBg = healthScore >= 90 ? 'rgba(34,197,94,0.06)' : healthScore >= 70 ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)';
        const scoreBorder = healthScore >= 90 ? 'rgba(34,197,94,0.15)' : healthScore >= 70 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
        return (
        <div style={{ padding: '0.5rem 1rem', marginBottom: '0.25rem' }} data-testid="panel-check-results-summary">
          <div style={{ 
            padding: '0.75rem', borderRadius: '8px', background: scoreBg, border: `1px solid ${scoreBorder}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: scoreColor }} data-testid="text-health-score">{healthScore}%</div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Platform Health Score</div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>Last check: {lastFullCheck}</div>
                </div>
              </div>
              {(errorCount + warningCount > 0) && (
                <button onClick={runErrorsOnly} disabled={isAnyRunning} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.7rem', padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)',
                  cursor: 'pointer', color: '#dc2626', fontWeight: 500
                }} data-testid="button-recheck-issues">
                  <RefreshCw size={10} /> Re-check Issues ({errorCount + warningCount})
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#22c55e' }} data-testid="text-healthy-count">{healthyCount}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Healthy</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#eab308' }} data-testid="text-warning-count">{warningCount}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Warnings</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ef4444' }} data-testid="text-error-count">{errorCount}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Errors</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#3b82f6' }} data-testid="text-auth-gated-count">{authGatedCount}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Auth-Gated</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6' }} data-testid="text-avg-response-time">{avgResponseTime}ms</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Avg Response</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: maxResponseTime > 1000 ? '#ef4444' : '#64748b' }} data-testid="text-max-response-time">{maxResponseTime}ms</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Slowest</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#64748b' }} data-testid="text-total-tools">{totalTools}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Total Tools</div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
      
      <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{ 
              width: '100%', padding: '6px 8px 6px 28px', fontSize: '0.8rem',
              border: '1px solid rgba(0,0,0,0.12)', borderRadius: '6px',
              background: 'rgba(0,0,0,0.02)', outline: 'none'
            }}
            data-testid="input-search-tools"
          />
        </div>
        <button onClick={expandAll} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }} data-testid="button-expand-all">
          Expand All
        </button>
        <button onClick={collapseAll} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }} data-testid="button-collapse-all">
          Collapse All
        </button>
        {lastFullCheck && (
          <span style={{ fontSize: '0.7rem', color: '#888' }} data-testid="text-last-full-check">
            Last check: {lastFullCheck}
          </span>
        )}
      </div>
      <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {toolCategories.map((category, ci) => {
          const filterLower = searchFilter.toLowerCase();
          const filteredTools = searchFilter 
            ? category.tools.filter(t => t.label.toLowerCase().includes(filterLower) || t.desc.toLowerCase().includes(filterLower) || t.id.toLowerCase().includes(filterLower))
            : category.tools;
          if (searchFilter && filteredTools.length === 0) return null;
          const catHealthy = category.tools.filter(t => toolResults[t.id]?.status === 'healthy').length;
          const catChecked = category.tools.filter(t => toolResults[t.id]).length;
          const catErrors = category.tools.filter(t => toolResults[t.id]?.status === 'error').length;
          const isCollapsed = collapsedCategories[ci];
          return (
          <div key={ci}>
            <button 
              onClick={() => toggleCategory(ci)}
              style={{ 
                fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', 
                marginBottom: isCollapsed ? 0 : '0.5rem', opacity: 0.7, cursor: 'pointer',
                background: 'none', border: 'none', padding: '0.25rem 0', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left'
              }}
              data-testid={`tool-category-${ci}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowRight size={12} style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                {category.title} ({searchFilter ? `${filteredTools.length}/` : ''}{category.tools.length})
              </span>
              {catChecked > 0 && (
                <span style={{ fontSize: '0.7rem', fontWeight: 400, display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#22c55e' }}>{catHealthy} ok</span>
                  {catErrors > 0 && <span style={{ color: '#ef4444' }}>{catErrors} err</span>}
                </span>
              )}
            </button>
            {!isCollapsed && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
              {filteredTools.map((tool) => {
                const ToolIcon = tool.icon;
                const result = toolResults[tool.id];
                const isRunning = runningTools[tool.id];
                return (
                  <div 
                    key={tool.id} 
                    className={styles.navCard}
                    style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}
                    data-testid={`tool-card-${tool.id}`}
                  >
                    <div className={styles.navCardIcon} style={{ flexShrink: 0 }}>
                      <ToolIcon size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className={styles.navCardLabel} style={{ fontSize: '0.82rem' }}>{tool.label}</span>
                      <span className={styles.navCardDesc} style={{ fontSize: '0.7rem' }}>{tool.desc}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                      {result && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title={`HTTP ${result.code} - ${result.label || ''} - ${result.ms}ms`}>
                          {result.status === 'healthy' ? (
                            <CheckCircle size={14} style={{ color: '#22c55e' }} />
                          ) : result.status === 'warning' ? (
                            <AlertTriangle size={14} style={{ color: '#eab308' }} />
                          ) : (
                            <AlertCircle size={14} style={{ color: '#ef4444' }} />
                          )}
                          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>
                            {result.label && result.label !== 'ok' ? result.label : ''}{result.ms != null ? ` ${result.ms}ms` : ''}
                          </span>
                        </span>
                      )}
                      <button
                        onClick={() => runHealthCheck(tool)}
                        disabled={isRunning}
                        style={{ 
                          background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px',
                          padding: '2px 6px', cursor: isRunning ? 'wait' : 'pointer', fontSize: '0.7rem',
                          opacity: isRunning ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '2px'
                        }}
                        data-testid={`button-check-${tool.id}`}
                        title={`Check ${tool.label} status`}
                      >
                        {isRunning ? (
                          <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <CheckSquare size={10} />
                        )}
                        Check
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyOpsChecklist() {
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('glp_daily_ops_checklist');
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today) return parsed.items;
      }
    } catch {}
    return null;
  });

  const [taskTimestamps, setTaskTimestamps] = useState(() => {
    try {
      const saved = localStorage.getItem('glp_daily_ops_timestamps');
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today) return parsed.stamps;
      }
    } catch {}
    return {};
  });

  const dailyTasks = [
    { id: 'health-check', label: 'Run Platform Health Check', desc: 'Verify all 123 tools are operational', icon: Activity, href: '/admin/tools', category: 'monitoring', priority: 'high' },
    { id: 'review-drafts', label: 'Review Pending Drafts', desc: 'Check narrative and social drafts for approval', icon: PenTool, href: '/admin/narrative', category: 'content', priority: 'high' },
    { id: 'check-analytics', label: 'Check Analytics', desc: 'Review daily engagement and traffic metrics', icon: BarChart3, href: '/admin/analytics', category: 'analytics', priority: 'medium' },
    { id: 'publishing-queue', label: 'Review Publishing Queue', desc: 'Check today\'s scheduled content', icon: Calendar, href: '/admin/publishing/today', category: 'content', priority: 'high' },
    { id: 'social-posts', label: 'Review Social Posts', desc: 'Approve or schedule social content', icon: Megaphone, href: '/admin/social', category: 'content', priority: 'medium' },
    { id: 'check-feedback', label: 'Check User Feedback', desc: 'Review new feedback submissions', icon: MessageSquare, href: '/admin/feedback', category: 'engagement', priority: 'medium' },
    { id: 'audit-log', label: 'Review Audit Logs', desc: 'Check security events and access logs', icon: ClipboardList, href: '/admin/audit-log', category: 'security', priority: 'low' },
    { id: 'newsletter-check', label: 'Newsletter Status', desc: 'Check subscriber growth and pending sends', icon: Mail, href: '/admin/newsletter', category: 'engagement', priority: 'medium' },
    { id: 'billing-review', label: 'Review Billing', desc: 'Check revenue, subscriptions, and payments', icon: DollarSign, href: '/admin/billing', category: 'revenue', priority: 'low' },
    { id: 'system-alerts', label: 'Resolve System Alerts', desc: 'Address any unresolved system notifications', icon: AlertTriangle, href: '/admin/alerts', category: 'monitoring', priority: 'high' },
    { id: 'security-review', label: 'Security Dashboard', desc: 'Check for vulnerabilities and rate limit violations', icon: ShieldCheck, href: '/admin/security', category: 'security', priority: 'high' },
    { id: 'content-studio', label: 'Content Studio Review', desc: 'Check content tier management and studio tools', icon: Palette, href: '/admin/content-studio', category: 'content', priority: 'low' },
    { id: 'engagement-review', label: 'Engagement Metrics', desc: 'Review user engagement trends and patterns', icon: Heart, href: '/admin/engagement', category: 'analytics', priority: 'medium' },
    { id: 'social-calendar', label: 'Social Calendar', desc: 'Check upcoming scheduled social posts', icon: Calendar, href: '/admin/social/calendar', category: 'content', priority: 'medium' },
    { id: 'revenue-check', label: 'Revenue Dashboard', desc: 'Review MRR, subscriptions, and financial health', icon: TrendingUp, href: '/admin/revenue', category: 'revenue', priority: 'low' },
  ];

  const getInitialState = () => dailyTasks.reduce((acc, t) => ({ ...acc, [t.id]: false }), {});

  const items = checklist || getInitialState();

  const saveChecklist = (updated) => {
    setChecklist(updated);
    try {
      localStorage.setItem('glp_daily_ops_checklist', JSON.stringify({ date: new Date().toDateString(), items: updated }));
    } catch {}
  };

  const saveTimestamps = (stamps) => {
    setTaskTimestamps(stamps);
    try {
      localStorage.setItem('glp_daily_ops_timestamps', JSON.stringify({ date: new Date().toDateString(), stamps }));
    } catch {}
  };

  const toggleItem = (id) => {
    const updated = { ...items, [id]: !items[id] };
    saveChecklist(updated);
    if (!items[id]) {
      saveTimestamps({ ...taskTimestamps, [id]: new Date().toLocaleTimeString() });
    }
  };

  const resetChecklist = () => {
    saveChecklist(getInitialState());
    saveTimestamps({});
  };

  const exportReport = () => {
    const now = new Date();
    const lines = [
      `Daily Operations Report - ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Generated: ${now.toLocaleTimeString()}`,
      `Progress: ${completedCount}/${totalCount} tasks (${progressPercent}%)`,
      '',
      '--- Task Status ---',
      ...dailyTasks.map(t => {
        const done = items[t.id];
        const stamp = taskTimestamps[t.id];
        return `[${done ? 'x' : ' '}] ${t.label} ${stamp ? `(completed ${stamp})` : ''} - ${t.desc}`;
      }),
      '',
      `--- Summary ---`,
      `High Priority: ${dailyTasks.filter(t => t.priority === 'high').filter(t => items[t.id]).length}/${dailyTasks.filter(t => t.priority === 'high').length} complete`,
      `Medium Priority: ${dailyTasks.filter(t => t.priority === 'medium').filter(t => items[t.id]).length}/${dailyTasks.filter(t => t.priority === 'medium').length} complete`,
      `Low Priority: ${dailyTasks.filter(t => t.priority === 'low').filter(t => items[t.id]).length}/${dailyTasks.filter(t => t.priority === 'low').length} complete`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ops-report-${now.toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = Object.values(items).filter(Boolean).length;
  const totalCount = dailyTasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const highPriorityRemaining = dailyTasks.filter(t => t.priority === 'high' && !items[t.id]).length;

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <CheckSquare className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Daily Operations Checklist</h2>
          <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.5rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {highPriorityRemaining > 0 && (
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: '#fef3c7', color: '#92400e', fontWeight: 500 }} data-testid="badge-high-priority">
              {highPriorityRemaining} high priority
            </span>
          )}
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: completedCount === totalCount ? '#22c55e' : '#666' }} data-testid="text-ops-progress">
            {completedCount}/{totalCount}
          </span>
          <button
            onClick={exportReport}
            style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            data-testid="button-export-report"
            title="Download daily ops report"
          >
            <FileText size={10} /> Export
          </button>
          <button
            onClick={resetChecklist}
            style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }}
            data-testid="button-reset-checklist"
          >
            Reset
          </button>
        </div>
      </div>
      <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
        <div style={{ height: '4px', borderRadius: '2px', background: '#e5e7eb', overflow: 'hidden' }} data-testid="progress-bar-ops">
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: completedCount === totalCount ? '#22c55e' : '#3b82f6',
            transition: 'width 0.3s ease',
            borderRadius: '2px'
          }} />
        </div>
      </div>
      {completedCount === totalCount && totalCount > 0 && (
        <div style={{ padding: '0.5rem 1rem', marginBottom: '0.25rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center', fontSize: '0.82rem', color: '#16a34a', fontWeight: 500 }} data-testid="text-all-complete">
            All daily operations complete. Great work!
          </div>
        </div>
      )}
      <div style={{ padding: '0.5rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.5rem' }}>
        {dailyTasks.map((task) => {
          const TaskIcon = task.icon;
          const isChecked = items[task.id];
          const stamp = taskTimestamps[task.id];
          const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };
          const inner = (
            <div 
              className={styles.navCard}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem',
                opacity: isChecked ? 0.55 : 1, transition: 'opacity 0.2s ease',
                textDecoration: 'none', cursor: 'pointer',
                borderLeft: `3px solid ${priorityColors[task.priority] || '#6b7280'}`
              }}
              data-testid={`ops-task-${task.id}`}
            >
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(task.id); }}
                style={{ 
                  width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0,
                  border: isChecked ? '2px solid #22c55e' : '2px solid rgba(0,0,0,0.2)',
                  background: isChecked ? '#22c55e' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0
                }}
                data-testid={`checkbox-${task.id}`}
              >
                {isChecked && <CheckCircle size={14} style={{ color: '#fff' }} />}
              </button>
              <div className={styles.navCardIcon} style={{ flexShrink: 0 }}>
                <TaskIcon size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className={styles.navCardLabel} style={{ fontSize: '0.82rem', textDecoration: isChecked ? 'line-through' : 'none' }}>{task.label}</span>
                <span className={styles.navCardDesc} style={{ fontSize: '0.68rem' }}>
                  {task.desc}
                  {stamp && <span style={{ marginLeft: '4px', color: '#22c55e', fontStyle: 'italic' }}>{stamp}</span>}
                </span>
              </div>
              {task.href && (
                <ArrowRight size={12} style={{ opacity: 0.3, flexShrink: 0 }} />
              )}
            </div>
          );

          if (task.href) {
            return <Link key={task.id} href={task.href} style={{ textDecoration: 'none' }}>{inner}</Link>;
          }
          return <div key={task.id}>{inner}</div>;
        })}
      </div>
    </div>
  );
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
