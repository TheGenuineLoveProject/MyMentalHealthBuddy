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
const AIRepairCenter = lazy(() => import("./_adminTools/AIRepairCenter"));
const DailyOpsRunbook = lazy(() => import("./_adminTools/DailyOpsRunbook"));


function QuickDiagnostics({ toolResults, runHealthCheck, runningTools }) {
  const runQuickCheck = async () => {
    await Promise.all(CRITICAL_CHECKS.map(tool => runHealthCheck(tool)));
  };

  const critChecked = CRITICAL_CHECKS.filter(c => toolResults[c.id]).length;
  const critHealthy = CRITICAL_CHECKS.filter(c => toolResults[c.id]?.status === 'healthy').length;
  const critErrors = CRITICAL_CHECKS.filter(c => toolResults[c.id]?.status === 'error').length;
  const isRunning = CRITICAL_CHECKS.some(c => runningTools[c.id]);

  return (
    <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-card" data-testid="panel-quick-diagnostics">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold">Quick Diagnostics</h3>
          <span className="text-xs text-muted-foreground">8 critical endpoints</span>
        </div>
        <button
          onClick={runQuickCheck}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
          data-testid="button-quick-diagnostics"
        >
          {isRunning ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
          {isRunning ? 'Running...' : 'Run Quick Check'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {CRITICAL_CHECKS.map((check) => {
          const Icon = check.icon;
          const result = toolResults[check.id];
          const running = runningTools[check.id];
          return (
            <div
              key={check.id}
              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors ${
                result?.status === 'healthy' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' :
                result?.status === 'error' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' :
                result?.status === 'warning' ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20' :
                'border-gray-100 dark:border-gray-800 bg-muted/30'
              }`}
              data-testid={`quick-check-${check.id}`}
            >
              {running ? (
                <RefreshCw size={14} className="animate-spin text-muted-foreground flex-shrink-0" />
              ) : result ? (
                result.status === 'healthy' ? <CheckCircle size={14} className="text-green-600 flex-shrink-0" /> :
                result.status === 'error' ? <AlertCircle size={14} className="text-red-500 flex-shrink-0" /> :
                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
              ) : (
                <Icon size={14} className="text-muted-foreground flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">{check.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {running ? 'Checking...' : result ? `${result.label} ${result.ms}ms` : check.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {critChecked === CRITICAL_CHECKS.length && (
        <div className={`mt-3 text-xs text-center py-1.5 rounded-lg ${
          critErrors > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'
        }`} data-testid="text-quick-diagnostics-result">
          {critErrors > 0 ? `${critErrors} critical service(s) need attention` : `All ${critHealthy} critical services operational`}
        </div>
      )}
    </div>
  );
}

function AIDiagnosticsPanel({ toolResults, runHealthCheck }) {
  const [expanded, setExpanded] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const issues = allTools.filter(t => {
    const r = toolResults[t.id];
    return r && (r.status === 'error' || r.status === 'warning');
  }).map(t => ({ ...t, result: toolResults[t.id], severity: TOOL_SEVERITY[t.id] || 'normal' }));

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const highIssues = issues.filter(i => i.severity === 'high');
  const normalIssues = issues.filter(i => i.severity !== 'critical' && i.severity !== 'high');

  if (issues.length === 0 && Object.keys(toolResults).length > 0) {
    return (
      <div className="mb-6 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20" data-testid="panel-ai-diagnostics-clear">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-green-600" />
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">AI Diagnostics: All Systems Healthy</span>
          <CheckCircle size={14} className="text-green-600" />
        </div>
        <p className="text-xs text-green-600 dark:text-green-500 mt-1">Codex Knowledge Base confirms all monitored tools are operational. No remediation required.</p>
      </div>
    );
  }

  if (issues.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20" data-testid="panel-ai-diagnostics">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-amber-600" />
          <span className="text-sm font-semibold">AI Diagnostics & Remediation</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 font-medium">{issues.length} issues</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          data-testid="button-toggle-diagnostics"
        >
          {expanded ? 'Collapse' : 'Expand'} Details
        </button>
      </div>

      {criticalIssues.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold">CRITICAL: {criticalIssues.length}</span>
          <span className="text-muted-foreground">{criticalIssues.map(i => i.label).join(', ')}</span>
        </div>
      )}
      {highIssues.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold">HIGH: {highIssues.length}</span>
          <span className="text-muted-foreground">{highIssues.map(i => i.label).join(', ')}</span>
        </div>
      )}
      {normalIssues.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">NORMAL: {normalIssues.length}</span>
          <span className="text-muted-foreground">{normalIssues.map(i => i.label).join(', ')}</span>
        </div>
      )}

      {expanded && (
        <div className="mt-3 space-y-2">
          {[...criticalIssues, ...highIssues, ...normalIssues].map(issue => {
            const remediation = getRemediation(issue.result.label, issue.result.ms);
            const sevColor = issue.severity === 'critical' ? 'border-red-300 dark:border-red-700' : issue.severity === 'high' ? 'border-orange-300 dark:border-orange-700' : 'border-gray-200 dark:border-gray-700';
            return (
              <div key={issue.id} className={`p-3 rounded-lg border ${sevColor} bg-background`} data-testid={`diagnostics-${issue.id}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <issue.icon size={14} className={issue.result.status === 'error' ? 'text-red-500' : 'text-amber-500'} />
                    <span className="text-sm font-medium">{issue.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {issue.result.label} · {issue.result.ms}ms
                    </span>
                    {issue.severity !== 'normal' && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${issue.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => runHealthCheck(issue)}
                    className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-muted transition-colors flex items-center gap-1"
                    data-testid={`button-retry-${issue.id}`}
                  >
                    <RotateCcw size={10} /> Retry
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <div className="flex items-start gap-1.5 mb-1">
                    <Brain size={11} className="mt-0.5 text-purple-500 flex-shrink-0" />
                    <span>{remediation?.suggestion}</span>
                    {remediation?.knowledgeBase && (
                      <span className={`text-[9px] px-1 py-0.5 rounded font-medium flex-shrink-0 ${remediation.knowledgeBase === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : remediation.knowledgeBase === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
                        {remediation.knowledgeBase}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wrench size={11} className="text-blue-500 flex-shrink-0" />
                    <span className="font-medium">{remediation?.action}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlatformIntegrityScanner({ toolResults }) {
  const [showScanner, setShowScanner] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const totalTools = allTools.length;
  const checkedCount = Object.keys(toolResults).length;
  
  const linkedTools = allTools.filter(t => TOOL_ADMIN_LINKS[t.id]);
  const unlinkedTools = allTools.filter(t => !TOOL_ADMIN_LINKS[t.id]);
  const criticalTools = allTools.filter(t => TOOL_SEVERITY[t.id] === 'critical');
  const highTools = allTools.filter(t => TOOL_SEVERITY[t.id] === 'high');
  const mediumTools = allTools.filter(t => TOOL_SEVERITY[t.id] === 'medium');
  const normalTools = allTools.filter(t => !TOOL_SEVERITY[t.id]);
  
  const duplicateEndpoints = (() => {
    const endpoints = {};
    allTools.forEach(t => {
      if (!endpoints[t.endpoint]) endpoints[t.endpoint] = [];
      endpoints[t.endpoint].push(t.id);
    });
    return Object.entries(endpoints).filter(([_, ids]) => ids.length > 1);
  })();

  const categoryStats = toolCategories.map(cat => ({
    title: cat.title,
    total: cat.tools.length,
    checked: cat.tools.filter(t => toolResults[t.id]).length,
    healthy: cat.tools.filter(t => toolResults[t.id]?.status === 'healthy').length,
    errors: cat.tools.filter(t => toolResults[t.id]?.status === 'error').length,
    avgMs: cat.tools.filter(t => toolResults[t.id]?.ms).length > 0 
      ? Math.round(cat.tools.filter(t => toolResults[t.id]?.ms).reduce((s, t) => s + toolResults[t.id].ms, 0) / cat.tools.filter(t => toolResults[t.id]?.ms).length) 
      : 0
  }));

  if (checkedCount === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20" data-testid="panel-integrity-scanner">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-emerald-600" />
          <span className="text-sm font-semibold">Platform Integrity Scanner</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 font-medium">
            {linkedTools.length} linked · {unlinkedTools.length} API-only · {duplicateEndpoints.length} shared endpoints
          </span>
        </div>
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
          data-testid="button-toggle-scanner"
        >
          {showScanner ? 'Hide' : 'Show'} Details
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-2">
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-critical">
          <div className="text-lg font-bold text-red-500">{criticalTools.length}</div>
          <div className="text-[10px] text-muted-foreground">Critical</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-high">
          <div className="text-lg font-bold text-orange-500">{highTools.length}</div>
          <div className="text-[10px] text-muted-foreground">High</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-medium">
          <div className="text-lg font-bold text-blue-500">{mediumTools.length}</div>
          <div className="text-[10px] text-muted-foreground">Medium</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-linked">
          <div className="text-lg font-bold text-emerald-500">{linkedTools.length}</div>
          <div className="text-[10px] text-muted-foreground">Admin-Linked</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-unclassified">
          <div className="text-lg font-bold text-gray-500">{normalTools.length}</div>
          <div className="text-[10px] text-muted-foreground">Unclassified</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-total">
          <div className="text-lg font-bold text-emerald-600">{totalTools}</div>
          <div className="text-[10px] text-muted-foreground">Total</div>
        </div>
      </div>

      {showScanner && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <BarChart3 size={12} /> Category Health Overview
            </div>
            <div className="space-y-1.5">
              {categoryStats.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium flex-1 truncate">{cat.title}</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-green-600 font-medium">{cat.healthy}/{cat.total}</span>
                    {cat.errors > 0 && <span className="text-red-500 font-bold">{cat.errors} err</span>}
                    <span className="text-muted-foreground">{cat.avgMs}ms avg</span>
                  </div>
                  <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${cat.total > 0 ? (cat.healthy / cat.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <ExternalLink size={12} /> Admin Page Connectivity ({linkedTools.length} linked)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto">
              {linkedTools.map(t => {
                const result = toolResults[t.id];
                return (
                  <div key={t.id} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-[10px]" data-testid={`linked-${t.id}`}>
                    {result?.status === 'healthy' ? <CheckCircle size={10} className="text-green-600 flex-shrink-0" /> : result?.status === 'error' ? <AlertCircle size={10} className="text-red-500 flex-shrink-0" /> : <Clock size={10} className="text-muted-foreground flex-shrink-0" />}
                    <span className="truncate">{t.label}</span>
                    <Link href={TOOL_ADMIN_LINKS[t.id]} className="ml-auto" data-testid={`scanner-link-${t.id}`}>
                      <ExternalLink size={9} className="text-blue-500" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {unlinkedTools.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-blue-600">
                <Puzzle size={12} /> API-Only Tools ({unlinkedTools.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {unlinkedTools.map(t => (
                  <span key={t.id} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground" data-testid={`unlinked-${t.id}`}>{t.label}</span>
                ))}
              </div>
            </div>
          )}

          {duplicateEndpoints.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-amber-600">
                <AlertTriangle size={12} /> Shared Endpoints ({duplicateEndpoints.length})
              </div>
              <div className="space-y-1">
                {duplicateEndpoints.map(([endpoint, ids]) => (
                  <div key={endpoint} className="text-[10px] p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <span className="font-mono text-amber-700 dark:text-amber-400">{endpoint}</span>
                    <span className="text-muted-foreground ml-2">→ {ids.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <GroupedHealthOverview toolResults={toolResults} toolCategories={toolCategories} />

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Target size={12} /> KB Coverage by Severity Tier
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { tier: 'Critical', tools: criticalTools, color: 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/15', textColor: 'text-red-600' },
                { tier: 'High', tools: highTools, color: 'border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/15', textColor: 'text-orange-600' },
                { tier: 'Medium', tools: mediumTools, color: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/15', textColor: 'text-blue-600' },
              ].map((t, ti) => {
                const tierHealthy = t.tools.filter(tool => toolResults[tool.id]?.status === 'healthy').length;
                const tierChecked = t.tools.filter(tool => toolResults[tool.id]).length;
                return (
                  <div key={ti} className={`p-2.5 rounded-lg border ${t.color}`} data-testid={`kb-tier-${t.tier.toLowerCase()}`}>
                    <div className={`text-xs font-bold ${t.textColor} mb-0.5`}>{t.tier} ({t.tools.length})</div>
                    <div className="text-[10px] text-muted-foreground">{tierHealthy}/{tierChecked > 0 ? tierChecked : t.tools.length} healthy</div>
                    <div className="text-[10px] text-muted-foreground">{t.tools.filter(tool => TOOL_ADMIN_LINKS[tool.id]).length} admin-linked</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function PlatformCoverageReport({ toolResults }) {
  const [showReport, setShowReport] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const totalTools = allTools.length;

  const linkCoverage = Object.keys(TOOL_ADMIN_LINKS).length;
  const sevCoverage = Object.keys(TOOL_SEVERITY).length;
  const remScenarios = Object.keys(AI_REMEDIATION).length;
  const autoFixable = Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length;

  const kbBreakdown = { Codex: 0, Perplexity: 0, Canva: 0 };
  Object.values(AI_REMEDIATION).forEach(r => { if (r.knowledgeBase && kbBreakdown[r.knowledgeBase] !== undefined) kbBreakdown[r.knowledgeBase]++; });

  const critCount = Object.values(TOOL_SEVERITY).filter(s => s === 'critical').length;
  const highCount = Object.values(TOOL_SEVERITY).filter(s => s === 'high').length;
  const medCount = Object.values(TOOL_SEVERITY).filter(s => s === 'medium').length;
  const normalCount = totalTools - sevCoverage;

  const checkedCount = Object.keys(toolResults).length;
  const healthyCount = Object.values(toolResults).filter(r => r.status === 'healthy').length;
  const errorCount = Object.values(toolResults).filter(r => r.status === 'error').length;
  const scanCoverage = totalTools > 0 ? Math.round((checkedCount / totalTools) * 100) : 0;

  const categoryBreakdown = toolCategories.map(cat => ({
    title: cat.title,
    total: cat.tools.length,
    linked: cat.tools.filter(t => TOOL_ADMIN_LINKS[t.id]).length,
    prioritized: cat.tools.filter(t => TOOL_SEVERITY[t.id]).length,
    checked: cat.tools.filter(t => toolResults[t.id]).length,
    healthy: cat.tools.filter(t => toolResults[t.id]?.status === 'healthy').length,
  }));

  const overallScore = Math.round(
    ((linkCoverage / totalTools) * 20) +
    ((sevCoverage / totalTools) * 25) +
    ((Math.min(remScenarios, 143) / 143) * 20) +
    ((autoFixable / Math.max(remScenarios, 1)) * 10) +
    ((scanCoverage) * 0.25)
  );

  return (
    <div className="mb-6 p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20" data-testid="panel-coverage-report">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-rose-600" />
          <span className="text-sm font-semibold">360° Platform Coverage Report</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${overallScore >= 85 ? 'bg-green-100 text-green-700' : overallScore >= 65 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`} data-testid="text-coverage-score">
            {overallScore}% coverage
          </span>
        </div>
        <button
          onClick={() => setShowReport(!showReport)}
          className="text-xs px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
          data-testid="button-toggle-coverage"
        >
          {showReport ? 'Hide' : 'Show'} Report
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-admin-links">
          <div className="text-lg font-bold text-emerald-600">{linkCoverage}/{totalTools}</div>
          <div className="text-[9px] text-muted-foreground">Admin Links</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-prioritized">
          <div className="text-lg font-bold text-orange-600">{sevCoverage}/{totalTools}</div>
          <div className="text-[9px] text-muted-foreground">Classified</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-critical-count">
          <div className="text-lg font-bold text-red-500">{critCount}</div>
          <div className="text-[9px] text-muted-foreground">Critical</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-high-count">
          <div className="text-lg font-bold text-amber-500">{highCount}</div>
          <div className="text-[9px] text-muted-foreground">High</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-medium-count">
          <div className="text-lg font-bold text-blue-500">{medCount}</div>
          <div className="text-[9px] text-muted-foreground">Medium</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-ai-scenarios">
          <div className="text-lg font-bold text-indigo-600">{remScenarios}</div>
          <div className="text-[9px] text-muted-foreground">AI Scenarios</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-auto-fixable">
          <div className="text-lg font-bold text-purple-600">{autoFixable}</div>
          <div className="text-[9px] text-muted-foreground">Auto-Fixable</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-scan-coverage">
          <div className="text-lg font-bold text-blue-600">{scanCoverage}%</div>
          <div className="text-[9px] text-muted-foreground">Scan Coverage</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-rose-100 dark:border-rose-800" data-testid="stat-normal-priority">
          <div className="text-lg font-bold text-gray-500">{normalCount}</div>
          <div className="text-[9px] text-muted-foreground">Unclassified</div>
        </div>
      </div>

      {showReport && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Brain size={12} /> AI Knowledge Base Distribution
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(kbBreakdown).map(([name, count]) => {
                const color = name === 'Codex' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700' : name === 'Perplexity' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700' : 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-700';
                return (
                  <div key={name} className={`p-3 rounded-lg border ${color}`} data-testid={`coverage-kb-${name.toLowerCase()}`}>
                    <div className="text-xs font-bold">{name}</div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-[10px] opacity-70">{Math.round((count / remScenarios) * 100)}% of scenarios</div>
                    <div className="w-full h-1 rounded-full bg-current/20 mt-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-current/60" style={{ width: `${(count / remScenarios) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <BarChart3 size={12} /> Category Coverage Matrix
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {categoryBreakdown.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-xs" data-testid={`coverage-cat-${i}`}>
                  <span className="font-medium flex-1 truncate">{cat.title}</span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-emerald-600" title="Admin-linked">{cat.linked}/{cat.total} linked</span>
                    <span className="text-orange-500" title="Prioritized">{cat.prioritized} prioritized</span>
                    <span className="text-blue-600" title="Scanned">{cat.checked}/{cat.total} scanned</span>
                    <span className="text-green-600" title="Healthy">{cat.healthy} healthy</span>
                  </div>
                  <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${cat.total > 0 ? (cat.linked / cat.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-semibold mb-2">Coverage Summary</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px]">
              <div>
                <div className="text-muted-foreground mb-1">Admin Linking</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(linkCoverage / totalTools) * 100}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{Math.round((linkCoverage / totalTools) * 100)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Severity Classification</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${(sevCoverage / totalTools) * 100}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{Math.round((sevCoverage / totalTools) * 100)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">KB Scenarios</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min((remScenarios / 143) * 100, 100)}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{remScenarios}/143</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Auto-Fix Capability</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${(autoFixable / Math.max(remScenarios, 1)) * 100}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{Math.round((autoFixable / Math.max(remScenarios, 1)) * 100)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Scan Coverage</div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${scanCoverage}%` }} />
                </div>
                <div className="text-right font-medium mt-0.5">{scanCoverage}%</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Wrench size={12} /> Fix Command Summary ({[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length} unique commands)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].map(cmd => {
                const count = Object.values(AI_REMEDIATION).filter(r => r.fixCommand === cmd).length;
                return (
                  <span key={cmd} className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-mono" data-testid={`fix-summary-${cmd}`}>
                    <Terminal size={9} /> {cmd} <span className="font-bold">({count})</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs font-semibold mb-2.5 flex items-center gap-1.5">
              <Activity size={12} className="text-emerald-600" /> System Health Summary
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-background border" data-testid="summary-pass">
                <div className="text-xl font-bold text-green-600">{healthyCount}</div>
                <div className="text-[9px] text-muted-foreground">Pass</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-background border" data-testid="summary-fail">
                <div className="text-xl font-bold text-red-500">{errorCount}</div>
                <div className="text-[9px] text-muted-foreground">Fail</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-background border" data-testid="summary-unchecked">
                <div className="text-xl font-bold text-gray-400">{totalTools - checkedCount}</div>
                <div className="text-[9px] text-muted-foreground">Unchecked</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-background border" data-testid="summary-fix-cmds">
                <div className="text-xl font-bold text-purple-600">{[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length}</div>
                <div className="text-[9px] text-muted-foreground">Fix Commands</div>
              </div>
            </div>
            {(() => {
              const latencyBands = { fast: 0, normal: 0, slow: 0, timeout: 0 };
              Object.values(toolResults).forEach(r => {
                if (!r.ms) return;
                if (r.ms < 500) latencyBands.fast++;
                else if (r.ms < 2000) latencyBands.normal++;
                else if (r.ms < 5000) latencyBands.slow++;
                else latencyBands.timeout++;
              });
              return (
                <div className="mb-3">
                  <div className="text-[10px] font-semibold mb-1.5">Latency Distribution</div>
                  <div className="flex gap-1.5">
                    <div className="flex-1 text-center p-1.5 rounded bg-green-100 dark:bg-green-900/30 text-[10px]" data-testid="latency-fast">
                      <div className="font-bold text-green-700 dark:text-green-400">{latencyBands.fast}</div>
                      <div className="text-green-600 dark:text-green-500">&lt;500ms</div>
                    </div>
                    <div className="flex-1 text-center p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-[10px]" data-testid="latency-normal">
                      <div className="font-bold text-blue-700 dark:text-blue-400">{latencyBands.normal}</div>
                      <div className="text-blue-600 dark:text-blue-500">500-2s</div>
                    </div>
                    <div className="flex-1 text-center p-1.5 rounded bg-amber-100 dark:bg-amber-900/30 text-[10px]" data-testid="latency-slow">
                      <div className="font-bold text-amber-700 dark:text-amber-400">{latencyBands.slow}</div>
                      <div className="text-amber-600 dark:text-amber-500">2-5s</div>
                    </div>
                    <div className="flex-1 text-center p-1.5 rounded bg-red-100 dark:bg-red-900/30 text-[10px]" data-testid="latency-timeout">
                      <div className="font-bold text-red-700 dark:text-red-400">{latencyBands.timeout}</div>
                      <div className="text-red-600 dark:text-red-500">&gt;5s</div>
                    </div>
                  </div>
                </div>
              );
            })()}
            <OptimizeAllButton />
          </div>

          <div className="p-3 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Shield size={12} /> Tool Coverage Audit
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {allTools.filter(t => !TOOL_ADMIN_LINKS[t.id] || !TOOL_SEVERITY[t.id]).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-[10px] p-1.5 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800" data-testid={`audit-gap-${t.id}`}>
                  <AlertTriangle size={10} className="text-amber-500 shrink-0" />
                  <span className="font-mono font-medium">{t.id}</span>
                  {!TOOL_ADMIN_LINKS[t.id] && <span className="text-amber-600 text-[9px] px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30">missing admin link</span>}
                  {!TOOL_SEVERITY[t.id] && <span className="text-orange-600 text-[9px] px-1 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30">unclassified severity</span>}
                </div>
              ))}
              {allTools.filter(t => !TOOL_ADMIN_LINKS[t.id] || !TOOL_SEVERITY[t.id]).length === 0 && (
                <div className="text-[11px] text-green-600 flex items-center gap-1.5 p-2">
                  <CheckCircle2 size={12} /> All {totalTools} tools have admin links and severity classification
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptimizeAllButton() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runOptimizeAll = async () => {
    setRunning(true);
    setResult(null);
    try {
      const resp = await fetch('/api/health/repair', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'optimize-all' })
      });
      if (resp.ok) setResult(await resp.json());
    } catch {}
    setRunning(false);
  };

  return (
    <div data-testid="panel-optimize-all">
      <button
        onClick={runOptimizeAll}
        disabled={running}
        className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-semibold hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        data-testid="button-optimize-all"
      >
        {running ? <><Loader2 size={14} className="animate-spin" /> Running Full Optimization...</> : <><Zap size={14} /> Optimize All — Vacuum + Cache + Warm + Clean</>}
      </button>
      {result && (
        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
          {result.actions?.map((a, i) => (
            <div key={i} className="text-[10px] p-1 rounded bg-background border flex items-center gap-1.5" data-testid={`optimize-result-${i}`}>
              {a.startsWith('✓') ? <CheckCircle2 size={9} className="text-green-500 shrink-0" /> : a.startsWith('✗') ? <XCircle size={9} className="text-red-500 shrink-0" /> : <Zap size={9} className="text-amber-500 shrink-0" />}
              <span className="font-mono">{a}</span>
            </div>
          ))}
          <div className="text-[10px] font-semibold text-emerald-600 mt-1">{result.message}</div>
        </div>
      )}
    </div>
  );
}

function GitIntegrityScanner() {
  const [showGit, setShowGit] = useState(false);
  const [gitData, setGitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [repairResult, setRepairResult] = useState(null);

  const fetchGitStatus = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/health/git-status', { credentials: 'include' });
      if (resp.ok) setGitData(await resp.json());
    } catch {}
    setLoading(false);
  };

  const runGitRepair = async () => {
    setRepairResult(null);
    try {
      const resp = await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'repair-git' }) });
      if (resp.ok) setRepairResult(await resp.json());
    } catch {}
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/20" data-testid="panel-git-integrity">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-violet-600" />
          <span className="text-sm font-semibold">Git Integrity Scanner</span>
          {gitData && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gitData.status === 'healthy' ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200'}`}>
              {gitData.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGitStatus}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors flex items-center gap-1"
            data-testid="button-scan-git"
          >
            {loading ? <RefreshCw size={10} className="animate-spin" /> : <ScanLine size={10} />}
            Scan
          </button>
          <button
            onClick={() => setShowGit(!showGit)}
            className="text-xs px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
            data-testid="button-toggle-git"
          >
            {showGit ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {gitData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-2">
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-branch">
            <div className="text-sm font-bold text-violet-600 truncate">{gitData.checks?.branch || '—'}</div>
            <div className="text-[9px] text-muted-foreground">Branch</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-commits">
            <div className="text-lg font-bold text-blue-600">{gitData.checks?.commitCount || 0}</div>
            <div className="text-[9px] text-muted-foreground">Commits</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-changes">
            <div className={`text-lg font-bold ${(gitData.checks?.totalChanges || 0) > 10 ? 'text-amber-500' : 'text-green-600'}`}>{gitData.checks?.totalChanges || 0}</div>
            <div className="text-[9px] text-muted-foreground">Changes</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-modified">
            <div className="text-lg font-bold text-orange-500">{gitData.checks?.modifiedFiles || 0}</div>
            <div className="text-[9px] text-muted-foreground">Modified</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-untracked">
            <div className={`text-lg font-bold ${(gitData.checks?.untrackedFiles || 0) > 5 ? 'text-red-500' : 'text-gray-500'}`}>{gitData.checks?.untrackedFiles || 0}</div>
            <div className="text-[9px] text-muted-foreground">Untracked</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-size">
            <div className="text-sm font-bold text-gray-600">{gitData.checks?.repoSize || '—'}</div>
            <div className="text-[9px] text-muted-foreground">Repo Size</div>
          </div>
        </div>
      )}

      {showGit && gitData && (
        <div className="mt-3 space-y-3">
          {gitData.checks?.lastCommit && gitData.checks.lastCommit !== 'unknown' && (
            <div className="p-3 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
              <div className="text-xs font-semibold mb-1 flex items-center gap-1.5"><Clipboard size={12} /> Last Commit</div>
              <div className="text-[11px] font-mono text-muted-foreground break-all">{gitData.checks.lastCommit}</div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={runGitRepair}
              className="text-xs px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors flex items-center gap-1"
              data-testid="button-repair-git"
            >
              <Wrench size={10} /> Run Git Repair
            </button>
          </div>
          {repairResult && (
            <div className={`p-3 rounded-lg border ${repairResult.success ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/15' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/15'}`}>
              <div className="text-xs font-semibold mb-1">{repairResult.success ? 'Repair Successful' : 'Repair Issues Found'}</div>
              <div className="text-[11px] text-muted-foreground">{repairResult.message}</div>
              {repairResult.actions?.map((a, i) => (
                <div key={i} className="text-[10px] font-mono text-muted-foreground mt-0.5">→ {a}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlatformIntegrityDeepScan() {
  const [showDeepScan, setShowDeepScan] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDeepScan = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/health/platform-integrity', { credentials: 'include' });
      if (resp.ok) setScanData(await resp.json());
    } catch {}
    setLoading(false);
  };

  const envValidate = async () => {
    try {
      const resp = await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'validate-env' }) });
      if (resp.ok) {
        const data = await resp.json();
        setScanData(prev => prev ? { ...prev, envValidation: data } : prev);
      }
    } catch {}
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-950/20" data-testid="panel-deep-scan">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-teal-600" />
          <span className="text-sm font-semibold">Platform Integrity Deep Scan</span>
          {scanData && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${scanData.integrity?.score >= 70 ? 'bg-green-100 text-green-700' : scanData.integrity?.score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`} data-testid="text-integrity-score">
              {scanData.integrity?.score || 0}% integrity
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runDeepScan}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors flex items-center gap-1"
            data-testid="button-deep-scan"
          >
            {loading ? <RefreshCw size={10} className="animate-spin" /> : <ScanLine size={10} />}
            Run Deep Scan
          </button>
          <button
            onClick={() => setShowDeepScan(!showDeepScan)}
            className="text-xs px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
            data-testid="button-toggle-deep-scan"
          >
            {showDeepScan ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {scanData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          <div className="text-center p-2 rounded-lg bg-background border border-teal-100 dark:border-teal-800" data-testid="deep-db">
            <div className={`text-lg font-bold ${scanData.integrity?.database?.connected ? 'text-green-600' : 'text-red-500'}`}>
              {scanData.integrity?.database?.connected ? 'Connected' : 'Down'}
            </div>
            <div className="text-[9px] text-muted-foreground">Database ({scanData.integrity?.database?.tableCount || 0} tables)</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-teal-100 dark:border-teal-800" data-testid="deep-services">
            <div className="text-lg font-bold text-blue-600">
              {Object.values(scanData.integrity?.services || {}).filter(Boolean).length}/4
            </div>
            <div className="text-[9px] text-muted-foreground">Services Active</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-teal-100 dark:border-teal-800" data-testid="deep-env">
            <div className={`text-lg font-bold ${(scanData.integrity?.env?.criticalMissing || 0) === 0 ? 'text-green-600' : 'text-red-500'}`}>
              {(scanData.integrity?.env?.criticalMissing || 0) === 0 ? 'Complete' : `${scanData.integrity?.env?.criticalMissing} Missing`}
            </div>
            <div className="text-[9px] text-muted-foreground">Critical Env Vars</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-teal-100 dark:border-teal-800" data-testid="deep-memory">
            <div className={`text-lg font-bold ${(scanData.integrity?.memory?.heapPercent || 0) < 80 ? 'text-green-600' : 'text-amber-500'}`}>
              {scanData.integrity?.memory?.heapPercent || 0}%
            </div>
            <div className="text-[9px] text-muted-foreground">Heap ({scanData.integrity?.memory?.heapUsedMB || 0}MB)</div>
          </div>
        </div>
      )}

      {showDeepScan && scanData && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Shield size={12} /> Service Health</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(scanData.integrity?.services || {}).map(([name, active]) => (
                <div key={name} className={`p-2 rounded-lg border text-center ${active ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/15' : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/15'}`} data-testid={`service-${name}`}>
                  <div className="text-xs font-semibold capitalize">{name}</div>
                  <div className={`text-[10px] ${active ? 'text-green-600' : 'text-red-500'}`}>{active ? 'Active' : 'Not Configured'}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Key size={12} /> Environment Variables</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {Object.entries(scanData.integrity?.env?.critical || {}).map(([key, set]) => (
                <div key={key} className="flex items-center gap-2 p-1.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-[10px]" data-testid={`env-${key}`}>
                  {set ? <CheckCircle size={10} className="text-green-600 flex-shrink-0" /> : <AlertCircle size={10} className="text-red-500 flex-shrink-0" />}
                  <span className="font-mono truncate">{key}</span>
                  <span className={`ml-auto font-semibold ${set ? 'text-green-600' : 'text-red-500'}`}>{set ? 'SET' : 'MISSING'}</span>
                </div>
              ))}
              {Object.entries(scanData.integrity?.env?.optional || {}).map(([key, set]) => (
                <div key={key} className="flex items-center gap-2 p-1.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-[10px]" data-testid={`env-${key}`}>
                  {set ? <CheckCircle size={10} className="text-green-600 flex-shrink-0" /> : <Clock size={10} className="text-muted-foreground flex-shrink-0" />}
                  <span className="font-mono truncate">{key}</span>
                  <span className={`ml-auto font-semibold ${set ? 'text-green-600' : 'text-muted-foreground'}`}>{set ? 'SET' : 'optional'}</span>
                </div>
              ))}
            </div>
          </div>

          {scanData.integrity?.database?.tables && (
            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><HardDrive size={12} /> Database Tables ({scanData.integrity.database.tableCount})</div>
              <div className="flex flex-wrap gap-1.5">
                {scanData.integrity.database.tables.map(t => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded-lg bg-background border border-gray-100 dark:border-gray-800 font-mono" data-testid={`table-${t}`}>{t}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button onClick={envValidate} className="text-xs px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors flex items-center gap-1" data-testid="button-validate-env">
              <Key size={10} /> Validate All Env Vars
            </button>
          </div>

          {scanData.envValidation && (
            <div className={`p-3 rounded-lg border ${scanData.envValidation.success ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/15' : 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/15'}`}>
              <div className="text-xs font-semibold mb-1">{scanData.envValidation.message}</div>
              {scanData.envValidation.actions?.map((a, i) => (
                <div key={i} className="text-[10px] font-mono text-muted-foreground mt-0.5">→ {a}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


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

        <QuickDiagnostics toolResults={toolResults} runHealthCheck={runHealthCheck} runningTools={runningTools} />

        <AIKnowledgeBaseSummary
          toolResults={toolResults}
          toolCategories={toolCategories}
          AI_REMEDIATION={AI_REMEDIATION}
          getRemediation={getRemediation}
          TOOL_ADMIN_LINKS={TOOL_ADMIN_LINKS}
          TOOL_SEVERITY={TOOL_SEVERITY}
        />

        <Suspense fallback={null}><AIRepairCenter toolResults={toolResults} runHealthCheck={runHealthCheck} runAllChecks={runAllChecks} /></Suspense>

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

        <PlatformCoverageReport toolResults={toolResults} />

        <Suspense fallback={null}><DailyOpsRunbook toolResults={toolResults} isAnyRunning={isAnyRunning} runAllChecks={runAllChecks} runErrorsOnly={runErrorsOnly} lastFullCheck={lastFullCheck} runHealthCheck={runHealthCheck} /></Suspense>

        <GitIntegrityScanner />

        <PlatformIntegrityDeepScan />

        <AIDiagnosticsPanel toolResults={toolResults} runHealthCheck={runHealthCheck} />

        <PlatformIntegrityScanner toolResults={toolResults} />

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
