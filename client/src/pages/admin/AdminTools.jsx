import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, AlertCircle, Search, Play, CheckSquare, ArrowRight, Wand2, MessageSquare, Headphones, Heart, BookOpen, Sun, Moon, Leaf, Eye, FileQuestion, Gauge, Lightbulb, Landmark, GraduationCap, Brain, Sparkles, Mountain, Compass, Layers, Puzzle, Milestone, Trophy, HeartHandshake, Flame, Target, Flower2, TreePine, CircleDot, Shield, Feather, Gem, Award, Zap, TrendingUp, Star, Orbit, Rocket, Footprints, Workflow, Globe, Network, Users, FileText, Palette, Mail, Share2, Megaphone, PenTool, UserCheck, LayoutDashboard, CreditCard, ShieldCheck, ClipboardList, BarChart3, Activity, PackageCheck, DollarSign, Webhook, Contact, Key, Handshake, Upload, UserCog, ListOrdered, Radio, Fingerprint, FolderKanban, Rss, LogIn, Inbox, Clock, Download, Timer, Filter, RotateCcw, Wrench, ExternalLink, Stethoscope, Terminal, FileWarning, Cpu, Clipboard, ScanLine, HardDrive, GitBranch, XCircle, CheckCircle2, Loader2 } from 'lucide-react';
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import AIKnowledgeBaseSummary from "../../components/admin/AIKnowledgeBaseSummary";
import SystemOptimizationAdvisor from "../../components/admin/SystemOptimizationAdvisor";
import AIHealthPipeline from "../../components/admin/AIHealthPipeline";
import GroupedHealthOverview from "../../components/admin/GroupedHealthOverview";
import { TOOL_ADMIN_LINKS, TOOL_SEVERITY, AI_REMEDIATION, getRemediation, toolCategories, CRITICAL_CHECKS } from "./_adminToolsShared";
import { LazyAdminPanel } from "../../components/system/AdminErrorBoundary";
const AIRepairCenter = lazy(() => import("./_adminTools/AIRepairCenter"));
const DailyOpsRunbook = lazy(() => import("./_adminTools/DailyOpsRunbook"));
const PlatformIntegrityScanner = lazy(() => import("./_adminTools/PlatformIntegrityScanner"));
const PlatformCoverageReport = lazy(() => import("./_adminTools/PlatformCoverageReport"));
const QuickDiagnostics = lazy(() => import("./_adminTools/QuickDiagnostics"));
const AIDiagnosticsPanel = lazy(() => import("./_adminTools/AIDiagnosticsPanel"));
const GitIntegrityScanner = lazy(() => import("./_adminTools/GitIntegrityScanner"));
const PlatformIntegrityDeepScan = lazy(() => import("./_adminTools/PlatformIntegrityDeepScan"));




const STORAGE_KEY = 'glp_tools_last_check';
const AUTO_REFRESH_INTERVALS = [
  { label: 'Off', value: 0 },
  { label: '1 min', value: 60000 },
  { label: '5 min', value: 300000 },
  { label: '15 min', value: 900000 },
  { label: '30 min', value: 1800000 },
];
const STATUS_FILTERS = ['all', 'healthy', 'warning', 'error', 'unchecked'];

export default function AdminTools() {
  const [runningTools, setRunningTools] = useState({});
  const [toolResults, setToolResults] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.results && Date.now() - parsed.timestamp < 3600000) {
          return parsed.results;
        }
      }
    } catch {}
    return {};
  });
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [lastFullCheck, setLastFullCheck] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastCheck && Date.now() - parsed.timestamp < 3600000) {
          return parsed.lastCheck;
        }
      }
    } catch {}
    return null;
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(() => {
    try { return Number(localStorage.getItem('glp_tools_auto_refresh')) || 0; } catch { return 0; }
  });
  const [statusFilter, setStatusFilter] = useState(() => {
    try { return localStorage.getItem('glp_tools_status_filter') || 'all'; } catch { return 'all'; }
  });
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const autoRefreshRef = useRef(null);
  const runAllRef = useRef(null);

  useEffect(() => {
    if (Object.keys(toolResults).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          results: toolResults,
          lastCheck: lastFullCheck,
          timestamp: Date.now()
        }));
      } catch {}
    }
  }, [toolResults, lastFullCheck]);

  const toggleCategory = (idx) => {
    setCollapsedCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const collapseAll = () => {
    const all = {};
    toolCategories.forEach((_, i) => { all[i] = true; });
    setCollapsedCategories(all);
  };

  const expandAll = () => setCollapsedCategories({});

  const runHealthCheck = async (tool) => {
    setRunningTools(prev => ({ ...prev, [tool.id]: true }));
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let res = await fetch(tool.endpoint, { method: 'GET', credentials: 'include', signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 405) {
        const controller2 = new AbortController();
        const timeout2 = setTimeout(() => controller2.abort(), 8000);
        res = await fetch(tool.endpoint, { method: 'HEAD', credentials: 'include', signal: controller2.signal });
        clearTimeout(timeout2);
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

  const runAllChecks = useCallback(async () => {
    if (runAllRef.current) return;
    runAllRef.current = true;
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
    setLastFullCheck(new Date().toLocaleTimeString());
    setIsRunningAll(false);
    runAllRef.current = false;
  }, []);

  useEffect(() => {
    try { localStorage.setItem('glp_tools_auto_refresh', String(autoRefreshInterval)); } catch {}
    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = null;
    }
    if (autoRefreshInterval > 0) {
      autoRefreshRef.current = setInterval(() => {
        if (!runAllRef.current) runAllChecks();
      }, autoRefreshInterval);
    }
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [autoRefreshInterval, runAllChecks]);

  useEffect(() => {
    try { localStorage.setItem('glp_tools_status_filter', statusFilter); } catch {}
  }, [statusFilter]);

  const clearResults = () => {
    setToolResults({});
    setLastFullCheck(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

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

  const exportResults = (format = 'txt') => {
    const now = new Date();
    const allTools = toolCategories.flatMap(c => c.tools);
    const kbStats = { Codex: 0, Perplexity: 0, Canva: 0 };
    Object.values(AI_REMEDIATION).forEach(r => { if (r.knowledgeBase && kbStats[r.knowledgeBase] !== undefined) kbStats[r.knowledgeBase]++; });

    if (format === 'json') {
      const report = {
        generated: now.toISOString(),
        platform: "MyMentalHealthBuddy",
        version: "3.0",
        summary: {
          total: totalTools, checked: checkedCount, healthy: healthyCount, warnings: warningCount, errors: errorCount,
          avgResponseMs: avgResponseTime, maxResponseMs: maxResponseTime, authGated: authGatedCount,
          healthScore: totalTools > 0 ? Math.round((healthyCount / Math.max(checkedCount, 1)) * 100) : 0,
        },
        severityDistribution: {
          critical: Object.values(TOOL_SEVERITY).filter(s => s === 'critical').length,
          high: Object.values(TOOL_SEVERITY).filter(s => s === 'high').length,
          medium: Object.values(TOOL_SEVERITY).filter(s => s === 'medium').length,
          unclassified: totalTools - Object.keys(TOOL_SEVERITY).length,
          totalClassified: Object.keys(TOOL_SEVERITY).length,
        },
        knowledgeBase: {
          totalScenarios: Object.keys(AI_REMEDIATION).length,
          autoFixable: Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length,
          distribution: kbStats,
          fixCommands: [...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))],
        },
        categories: toolCategories.map(cat => ({
          name: cat.title,
          tools: cat.tools.map(t => {
            const r = toolResults[t.id];
            const rem = r ? getRemediation(r.label, r.ms) : null;
            return { 
              id: t.id, label: t.label, endpoint: t.endpoint, desc: t.desc,
              ...r,
              severity: TOOL_SEVERITY[t.id] || 'unclassified',
              adminLink: TOOL_ADMIN_LINKS[t.id] || null,
              knowledgeBase: rem?.knowledgeBase || null,
              autoFixable: rem?.autoFixable || false,
              fixCommand: rem?.fixCommand || null,
              remediation: rem?.suggestion || null,
              action: rem?.action || null,
            };
          })
        }))
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glp-health-report-${now.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === 'csv') {
      const csvLines = ['ID,Label,Endpoint,Status,Code,Response(ms),Severity,KB,AutoFix,AdminLink,Remediation'];
      allTools.forEach(t => {
        const r = toolResults[t.id];
        const rem = r ? getRemediation(r.label, r.ms) : null;
        const row = [
          t.id, `"${t.label}"`, t.endpoint,
          r?.status || 'unchecked', r?.code || '', r?.ms || '',
          TOOL_SEVERITY[t.id] || 'unclassified',
          rem?.knowledgeBase || '', rem?.autoFixable ? 'yes' : 'no',
          TOOL_ADMIN_LINKS[t.id] || '',
          `"${(rem?.action || '').replace(/"/g, '""')}"`,
        ].join(',');
        csvLines.push(row);
      });
      const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glp-health-report-${now.toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const healthScore = totalTools > 0 ? Math.round((healthyCount / Math.max(checkedCount, 1)) * 100) : 0;
    const lines = [
      `═══════════════════════════════════════════════════════════`,
      `  THE GENUINE LOVE PROJECT — Platform Health Report`,
      `  ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      `  Generated: ${now.toLocaleTimeString()}`,
      `═══════════════════════════════════════════════════════════`,
      '',
      `HEALTH SCORE: ${healthScore}%`,
      `Total: ${totalTools} | Checked: ${checkedCount} | Healthy: ${healthyCount} | Warnings: ${warningCount} | Errors: ${errorCount}`,
      `Avg Response: ${avgResponseTime}ms | Slowest: ${maxResponseTime}ms | Auth-Gated: ${authGatedCount}`,
      '',
      `SEVERITY DISTRIBUTION:`,
      `  Critical: ${Object.values(TOOL_SEVERITY).filter(s => s === 'critical').length} | High: ${Object.values(TOOL_SEVERITY).filter(s => s === 'high').length} | Medium: ${Object.values(TOOL_SEVERITY).filter(s => s === 'medium').length}`,
      '',
      `AI KNOWLEDGE BASE:`,
      `  Scenarios: ${Object.keys(AI_REMEDIATION).length} | Auto-Fixable: ${Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length}`,
      `  Codex: ${kbStats.Codex} | Perplexity: ${kbStats.Perplexity} | Canva: ${kbStats.Canva}`,
      '',
      ...toolCategories.flatMap(cat => [
        `─── ${cat.title} ───`,
        ...cat.tools.map(t => {
          const r = toolResults[t.id];
          const sev = TOOL_SEVERITY[t.id] || '—';
          const rem = r && (r.status !== 'healthy') ? getRemediation(r.label, r.ms) : null;
          return r ? `  [${r.status === 'healthy' ? 'OK  ' : r.status === 'warning' ? 'WARN' : 'ERR '}] ${t.label.padEnd(28)} ${String(r.ms).padStart(5)}ms  ${sev.padEnd(8)} ${r.label !== 'ok' ? `(${r.label})` : ''}${rem ? ` → ${rem.action}` : ''}` : `  [    ] ${t.label.padEnd(28)}         ${sev.padEnd(8)} not checked`;
        }),
        ''
      ])
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glp-health-report-${now.toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`Platform Tools (${totalTools}) — Admin`} description={`All ${totalTools} platform tools with AI-powered health monitoring, diagnostics, and repair`} noindex />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>

        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Platform Tools ({totalTools})</h1>
                <p className="text-muted-foreground text-sm">AI-powered health monitor with Codex, Perplexity & Canva knowledge base</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {checkedCount > 0 && (
                <div className="flex items-center gap-3 text-sm" data-testid="text-tool-summary">
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14} /> {healthyCount}</span>
                  {warningCount > 0 && <span className="flex items-center gap-1 text-amber-500"><AlertTriangle size={14} /> {warningCount}</span>}
                  {errorCount > 0 && <span className="flex items-center gap-1 text-red-500"><AlertCircle size={14} /> {errorCount}</span>}
                  <span className="text-muted-foreground">/ {totalTools}</span>
                </div>
              )}
              <button
                onClick={runAllChecks}
                disabled={isAnyRunning}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                data-testid="button-run-all-checks"
              >
                {isAnyRunning ? (
                  <><RefreshCw size={14} className="animate-spin" /> Checking... ({checkedCount}/{totalTools})</>
                ) : (
                  <><Play size={14} /> Run Daily Operations</>
                )}
              </button>
            </div>
          </div>
        </header>

        <LazyAdminPanel name="QuickDiagnostics"><QuickDiagnostics toolResults={toolResults} runHealthCheck={runHealthCheck} runningTools={runningTools} /></LazyAdminPanel>

        <AIKnowledgeBaseSummary
          toolResults={toolResults}
          toolCategories={toolCategories}
          AI_REMEDIATION={AI_REMEDIATION}
          getRemediation={getRemediation}
          TOOL_ADMIN_LINKS={TOOL_ADMIN_LINKS}
          TOOL_SEVERITY={TOOL_SEVERITY}
        />

        <LazyAdminPanel name="AIRepairCenter"><AIRepairCenter toolResults={toolResults} runHealthCheck={runHealthCheck} runAllChecks={runAllChecks} /></LazyAdminPanel>

        <AIHealthPipeline
          toolResults={toolResults}
          runHealthCheck={runHealthCheck}
          runAllChecks={runAllChecks}
          toolCategories={toolCategories}
          getRemediation={getRemediation}
        />

        <SystemOptimizationAdvisor
          toolResults={toolResults}
          toolCategories={toolCategories}
          AI_REMEDIATION={AI_REMEDIATION}
          getRemediation={getRemediation}
          TOOL_ADMIN_LINKS={TOOL_ADMIN_LINKS}
          TOOL_SEVERITY={TOOL_SEVERITY}
        />

        <LazyAdminPanel name="PlatformCoverageReport"><PlatformCoverageReport toolResults={toolResults} /></LazyAdminPanel>

        <LazyAdminPanel name="DailyOpsRunbook"><DailyOpsRunbook toolResults={toolResults} isAnyRunning={isAnyRunning} runAllChecks={runAllChecks} runErrorsOnly={runErrorsOnly} lastFullCheck={lastFullCheck} runHealthCheck={runHealthCheck} /></LazyAdminPanel>

        <LazyAdminPanel name="GitIntegrityScanner"><GitIntegrityScanner /></LazyAdminPanel>

        <LazyAdminPanel name="PlatformIntegrityDeepScan"><PlatformIntegrityDeepScan /></LazyAdminPanel>

        <LazyAdminPanel name="AIDiagnosticsPanel"><AIDiagnosticsPanel toolResults={toolResults} runHealthCheck={runHealthCheck} /></LazyAdminPanel>

        <LazyAdminPanel name="PlatformIntegrityScanner"><PlatformIntegrityScanner toolResults={toolResults} /></LazyAdminPanel>

        {checkedCount > 0 && (
          <div className="mb-4">
            <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden" data-testid="progress-bar-tools">
              <div className="h-full rounded-full transition-all duration-300" style={{ 
                width: `${(checkedCount / totalTools) * 100}%`, 
                background: errorCount > 0 ? '#ef4444' : warningCount > 0 ? '#eab308' : '#22c55e'
              }} />
            </div>
          </div>
        )}

        {checkedCount === totalTools && !isAnyRunning && (() => {
          const healthScore = totalTools > 0 ? Math.round((healthyCount / totalTools) * 100) : 0;
          const scoreColor = healthScore >= 90 ? 'text-green-600' : healthScore >= 70 ? 'text-amber-500' : 'text-red-500';
          const scoreBg = healthScore >= 90 ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : healthScore >= 70 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
          return (
            <div className={`mb-6 p-4 rounded-xl border ${scoreBg}`} data-testid="panel-results-summary">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-bold ${scoreColor}`} data-testid="text-health-score">{healthScore}%</div>
                  <div>
                    <div className="font-semibold text-sm">Platform Health Score</div>
                    <div className="text-xs text-muted-foreground">Last check: {lastFullCheck}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={runErrorsOnly} disabled={errorCount + warningCount === 0} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-muted/50 disabled:opacity-40" data-testid="button-recheck-issues">Re-check Issues ({errorCount + warningCount})</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600" data-testid="text-healthy-count">{healthyCount}</div>
                  <div className="text-xs text-muted-foreground">Healthy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500" data-testid="text-warning-count">{warningCount}</div>
                  <div className="text-xs text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500" data-testid="text-error-count">{errorCount}</div>
                  <div className="text-xs text-muted-foreground">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600" data-testid="text-auth-gated-count">{authGatedCount}</div>
                  <div className="text-xs text-muted-foreground">Auth-Gated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600" data-testid="text-avg-response">{avgResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${maxResponseTime > 1000 ? 'text-red-500' : 'text-slate-600'}`} data-testid="text-max-response">{maxResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Slowest</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600" data-testid="text-total-tools">{totalTools}</div>
                  <div className="text-xs text-muted-foreground">Total Tools</div>
                </div>
              </div>
            </div>
          );
        })()}

        {checkedCount > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap p-3 rounded-xl bg-muted/30 border border-gray-100 dark:border-gray-800" data-testid="panel-ops-toolbar">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Timer size={12} />
              <span>Auto-refresh:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-background text-xs"
                data-testid="select-auto-refresh"
              >
                {AUTO_REFRESH_INTERVALS.map(i => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
              {autoRefreshInterval > 0 && <span className="text-green-600 font-medium">Active</span>}
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter size={12} />
              <span>Show:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-background text-xs"
                data-testid="select-status-filter"
              >
                {STATUS_FILTERS.map(f => (
                  <option key={f} value={f}>{f === 'all' ? 'All' : f === 'unchecked' ? 'Unchecked' : f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            {(errorCount > 0 || warningCount > 0) && (
              <button
                onClick={runErrorsOnly}
                disabled={isAnyRunning}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50"
                data-testid="button-recheck-errors"
              >
                <RotateCcw size={10} /> Re-check Issues ({errorCount + warningCount})
              </button>
            )}
            <button
              onClick={() => exportResults('txt')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs hover:bg-muted transition-colors"
              data-testid="button-export-txt"
            >
              <Download size={10} /> TXT
            </button>
            <button
              onClick={() => exportResults('json')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs hover:bg-muted transition-colors"
              data-testid="button-export-json"
            >
              <Download size={10} /> JSON
            </button>
            <button
              onClick={() => exportResults('csv')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs hover:bg-muted transition-colors"
              data-testid="button-export-csv"
            >
              <Download size={10} /> CSV
            </button>
            <button
              onClick={clearResults}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
              data-testid="button-clear-results"
            >
              Clear
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              data-testid="input-search-tools"
            />
          </div>
          <button onClick={expandAll} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs hover:bg-muted transition-colors" data-testid="button-expand-all">Expand All</button>
          <button onClick={collapseAll} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs hover:bg-muted transition-colors" data-testid="button-collapse-all">Collapse All</button>
          {lastFullCheck && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground" data-testid="text-last-check">
              <Clock size={12} /> Last check: {lastFullCheck}
            </span>
          )}
        </div>

        <div className="space-y-6" data-testid="panel-tool-categories">
          {toolCategories.map((category, ci) => {
            const filterLower = searchFilter.toLowerCase();
            let filteredTools = searchFilter 
              ? category.tools.filter(t => t.label.toLowerCase().includes(filterLower) || t.desc.toLowerCase().includes(filterLower) || t.id.toLowerCase().includes(filterLower))
              : category.tools;
            if (statusFilter !== 'all') {
              filteredTools = filteredTools.filter(t => {
                const r = toolResults[t.id];
                if (statusFilter === 'unchecked') return !r;
                return r?.status === statusFilter;
              });
            }
            if ((searchFilter || statusFilter !== 'all') && filteredTools.length === 0) return null;
            const catHealthy = category.tools.filter(t => toolResults[t.id]?.status === 'healthy').length;
            const catChecked = category.tools.filter(t => toolResults[t.id]).length;
            const catErrors = category.tools.filter(t => toolResults[t.id]?.status === 'error').length;
            const isCollapsed = collapsedCategories[ci];
            return (
              <div key={ci} data-testid={`tool-category-${ci}`}>
                <button 
                  onClick={() => toggleCategory(ci)}
                  className="w-full flex items-center justify-between text-left py-2 px-0 bg-transparent border-none cursor-pointer text-sm font-semibold uppercase tracking-wide text-foreground/70 hover:text-foreground transition-colors"
                  data-testid={`toggle-category-${ci}`}
                >
                  <span className="flex items-center gap-2">
                    <ArrowRight size={12} style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                    {category.title} ({searchFilter ? `${filteredTools.length}/` : ''}{category.tools.length})
                  </span>
                  {catChecked > 0 && (
                    <span className="text-xs font-normal flex gap-2">
                      <span className="text-green-600">{catHealthy} ok</span>
                      {catErrors > 0 && <span className="text-red-500">{catErrors} err</span>}
                    </span>
                  )}
                </button>
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                    {filteredTools.map((tool) => {
                      const ToolIcon = tool.icon;
                      const result = toolResults[tool.id];
                      const isRunning = runningTools[tool.id];
                      const adminLink = TOOL_ADMIN_LINKS[tool.id];
                      const severity = TOOL_SEVERITY[tool.id];
                      const sevBorder = severity === 'critical' && result?.status === 'error' ? 'border-red-300 dark:border-red-700' : severity === 'high' && result?.status === 'error' ? 'border-orange-300 dark:border-orange-700' : 'border-gray-100 dark:border-gray-800';
                      return (
                        <div 
                          key={tool.id} 
                          className={`flex items-center gap-3 p-3 rounded-lg border ${sevBorder} bg-card hover:bg-muted/50 transition-colors`}
                          data-testid={`tool-card-${tool.id}`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${severity === 'critical' ? 'bg-red-100 dark:bg-red-900/20' : severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' : severity === 'medium' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-primary/10'}`}>
                            <ToolIcon size={16} className={severity === 'critical' ? 'text-red-600' : severity === 'high' ? 'text-orange-600' : severity === 'medium' ? 'text-blue-600' : 'text-primary'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate flex items-center gap-1.5">
                              {tool.label}
                              {severity && severity !== 'medium' && (
                                <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                                  {severity === 'critical' ? 'CRIT' : 'HIGH'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              {tool.desc}
                              {!adminLink && <span className="text-[9px] px-1 py-0 rounded bg-muted text-muted-foreground">API</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {result && (
                              <span title={`HTTP ${result.code} - ${result.label || ''} - ${result.ms}ms - checked ${result.time}`} className="flex items-center gap-1">
                                {result.status === 'healthy' ? (
                                  <CheckCircle size={14} className="text-green-600" />
                                ) : result.status === 'warning' ? (
                                  <AlertTriangle size={14} className="text-amber-500" />
                                ) : (
                                  <AlertCircle size={14} className="text-red-500" />
                                )}
                                <span className={`text-[10px] ${result.ms > 2000 ? 'text-red-500 font-medium' : result.ms > 500 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                  {result.label && result.label !== 'ok' ? result.label : ''}{result.ms != null ? ` ${result.ms}ms` : ''}
                                </span>
                              </span>
                            )}
                            {adminLink && (
                              <Link href={adminLink} className="p-1 rounded hover:bg-muted transition-colors" title={`Open ${tool.label} admin page`} data-testid={`link-admin-${tool.id}`}>
                                <ExternalLink size={12} className="text-muted-foreground" />
                              </Link>
                            )}
                            <button
                              onClick={() => runHealthCheck(tool)}
                              disabled={isRunning}
                              className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-xs hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                              data-testid={`button-check-${tool.id}`}
                            >
                              {isRunning ? <RefreshCw size={10} className="animate-spin" /> : <CheckSquare size={10} />}
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
        <SafetyFooter variant="compact" className="mt-12" />
      </main>
    </div>
  );
}
