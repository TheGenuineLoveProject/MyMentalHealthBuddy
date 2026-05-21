// Extracted from AdminTools.jsx — MMHB v7.4 Phase 3
// Verbatim relocation of PlatformCoverageReport (originally lines 388-670).
// OptimizeAllButton (originally lines 672-713) co-located here — it was used only by PlatformCoverageReport.
// Props preserved exactly: { toolResults }.

import { useState } from 'react';
import { Target, Brain, BarChart3, Wrench, Terminal, Activity, Shield, AlertTriangle, CheckCircle2, Loader2, Zap, XCircle } from 'lucide-react';
import { toolCategories, TOOL_ADMIN_LINKS, TOOL_SEVERITY, AI_REMEDIATION } from '../_adminToolsShared';

export default function PlatformCoverageReport({ toolResults }) {
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
