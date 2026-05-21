// Extracted from AdminTools.jsx — MMHB v7.4 Phase 1
// Verbatim relocation of AIRepairCenter (originally lines 851-1231).
// Props preserved exactly: { toolResults, runHealthCheck, runAllChecks }.

import { useState, useRef } from 'react';
import { Wrench, RefreshCw, Wand2, RotateCcw, CheckCircle, Clock, Terminal, Stethoscope } from 'lucide-react';
import { toolCategories, CRITICAL_CHECKS, TOOL_SEVERITY, AI_REMEDIATION, getRemediation } from '../_adminToolsShared';

export default function AIRepairCenter({ toolResults, runHealthCheck, runAllChecks }) {
  const [showRepairCenter, setShowRepairCenter] = useState(false);
  const [repairLog, setRepairLog] = useState([]);
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairStats, setRepairStats] = useState({ attempted: 0, fixed: 0, failed: 0 });
  const toolResultsRef = useRef(toolResults);
  toolResultsRef.current = toolResults;

  const allTools = toolCategories.flatMap(c => c.tools);
  const issues = allTools.filter(t => {
    const r = toolResults[t.id];
    return r && (r.status === 'error' || r.status === 'warning');
  }).map(t => ({ ...t, result: toolResults[t.id], severity: TOOL_SEVERITY[t.id] || 'normal' }));

  const fixableIssues = issues.filter(i => {
    const rem = getRemediation(i.result.label, i.result.ms);
    return rem?.autoFixable;
  });

  const slowEndpoints = allTools.filter(t => {
    const r = toolResults[t.id];
    return r && r.status === 'healthy' && r.ms > 2000;
  });

  const runAutoRepair = async () => {
    setIsRepairing(true);
    const log = [];
    let fixed = 0;
    let failed = 0;

    for (const issue of fixableIssues) {
      const rem = getRemediation(issue.result.label, issue.result.ms);
      log.push({ id: issue.id, label: issue.label, action: rem.fixCommand, status: 'running', time: new Date().toLocaleTimeString() });
      setRepairLog([...log]);

      if (rem.fixCommand === 'restart-service') {
        await runHealthCheck(issue);
        await new Promise(r => setTimeout(r, 500));
      } else if (rem.fixCommand === 'test-db') {
        try {
          await fetch('/api/health', { credentials: 'include' });
          await new Promise(r => setTimeout(r, 300));
        } catch {}
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-admin-token') {
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'clear-cache' || rem.fixCommand === 'sync-schema') {
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'clear-session-store') {
        try {
          await fetch('/api/health', { credentials: 'include' });
        } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'warm-endpoints') {
        const warmTargets = CRITICAL_CHECKS.slice(0, 4);
        await Promise.all(warmTargets.map(t => fetch(t.endpoint, { credentials: 'include' }).catch(() => {})));
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'flush-dns') {
        try { await fetch('/api/health', { credentials: 'include', cache: 'no-store' }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'rotate-token') {
        try { await fetch('/api/health', { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'flush-cors') {
        try { await fetch(issue.endpoint, { method: 'OPTIONS', credentials: 'include' }).catch(() => {}); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'drain-connections') {
        await new Promise(r => setTimeout(r, 600));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'kill-query') {
        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'throttle-ws') {
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'prune-storage') {
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-tls') {
        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'reindex') {
        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'repair-git') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'repair-git' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'validate-env') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'validate-env' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'prune-logs') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'prune-logs' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'health-deep-scan') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'health-deep-scan' }) }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'rebuild-cache') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'optimize-queries') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-queries' }) }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'check-routes') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-routes' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-sessions') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-sessions' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'warm-all') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }); } catch {}
        await new Promise(r => setTimeout(r, 500));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'audit-middleware') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'audit-middleware' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'check-disk') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-disk' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-stripe') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-stripe' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'verify-resend') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-resend' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'check-openai') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-openai' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'vacuum-db') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'vacuum-db' }) }); } catch {}
        await new Promise(r => setTimeout(r, 600));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'table-health') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'table-health' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'index-health') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'index-health' }) }); } catch {}
        await new Promise(r => setTimeout(r, 400));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'dependency-audit') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'dependency-audit' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'security-headers-audit') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'security-headers-audit' }) }); } catch {}
        await new Promise(r => setTimeout(r, 300));
        await runHealthCheck(issue);
      } else if (rem.fixCommand === 'optimize-all') {
        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }); } catch {}
        await new Promise(r => setTimeout(r, 800));
        await runHealthCheck(issue);
      } else {
        await runHealthCheck(issue);
      }

      await new Promise(r => setTimeout(r, 200));
      const freshResults = toolResultsRef.current;
      const newResult = freshResults[issue.id];
      const wasFixed = !newResult || newResult.status === 'healthy';
      if (wasFixed) fixed++;
      else failed++;
      log[log.length - 1].status = wasFixed ? 'fixed' : 'failed';
      setRepairLog([...log]);
    }

    setRepairStats({ attempted: fixableIssues.length, fixed, failed });
    setIsRepairing(false);
  };

  const runBatchRecheck = async () => {
    await Promise.all(issues.map(i => runHealthCheck(i)));
  };

  if (Object.keys(toolResults).length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20" data-testid="panel-repair-center">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-purple-600" />
          <span className="text-sm font-semibold">AI Repair Center</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 font-medium">
            {fixableIssues.length} auto-fixable · {issues.length} total issues
          </span>
          {slowEndpoints.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 font-medium">
              {slowEndpoints.length} slow
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {fixableIssues.length > 0 && (
            <button
              onClick={runAutoRepair}
              disabled={isRepairing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              data-testid="button-auto-repair"
            >
              {isRepairing ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
              {isRepairing ? 'Repairing...' : `Auto-Fix (${fixableIssues.length})`}
            </button>
          )}
          {issues.length > 0 && (
            <button
              onClick={runBatchRecheck}
              disabled={isRepairing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50"
              data-testid="button-batch-recheck"
            >
              <RotateCcw size={12} /> Re-check All ({issues.length})
            </button>
          )}
          <button
            onClick={() => setShowRepairCenter(!showRepairCenter)}
            className="text-xs px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            data-testid="button-toggle-repair"
          >
            {showRepairCenter ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {repairStats.attempted > 0 && (
        <div className="flex items-center gap-3 text-xs mb-3 p-2 rounded-lg bg-background border border-purple-100 dark:border-purple-800">
          <span className="font-medium">Last Repair Run:</span>
          <span className="text-green-600">{repairStats.fixed} fixed</span>
          <span className="text-red-500">{repairStats.failed} failed</span>
          <span className="text-muted-foreground">{repairStats.attempted} attempted</span>
        </div>
      )}

      {showRepairCenter && (
        <div className="mt-3 space-y-2">
          {issues.length === 0 ? (
            <div className="text-center py-4 text-sm text-green-600">
              <CheckCircle size={20} className="mx-auto mb-2" />
              All systems operational — no repairs needed
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {issues.map(issue => {
                  const rem = getRemediation(issue.result.label, issue.result.ms);
                  const logEntry = repairLog.find(l => l.id === issue.id);
                  return (
                    <div key={issue.id} className={`p-3 rounded-lg border ${issue.severity === 'critical' ? 'border-red-200 dark:border-red-800' : issue.severity === 'high' ? 'border-orange-200 dark:border-orange-800' : 'border-gray-200 dark:border-gray-700'} bg-background`} data-testid={`repair-${issue.id}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <issue.icon size={13} className={issue.result.status === 'error' ? 'text-red-500' : 'text-amber-500'} />
                          <span className="text-xs font-medium">{issue.label}</span>
                          {issue.severity !== 'normal' && (
                            <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${issue.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {rem?.knowledgeBase && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${rem.knowledgeBase === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : rem.knowledgeBase === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
                              {rem.knowledgeBase}
                            </span>
                          )}
                          {rem?.autoFixable && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-medium">Auto-Fix</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-1.5 leading-relaxed">{rem?.suggestion}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px]">
                          <Wrench size={10} className="text-blue-500" />
                          <span className="font-medium text-muted-foreground">{rem?.action}</span>
                        </div>
                        {logEntry && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${logEntry.status === 'fixed' ? 'bg-green-100 text-green-600' : logEntry.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {logEntry.status === 'running' ? 'Repairing...' : logEntry.status === 'fixed' ? 'Fixed' : 'Needs Manual Fix'}
                          </span>
                        )}
                        {!logEntry && (
                          <button
                            onClick={() => runHealthCheck(issue)}
                            className="text-[10px] px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-muted transition-colors flex items-center gap-1"
                            data-testid={`button-repair-retry-${issue.id}`}
                          >
                            <RotateCcw size={9} /> Retry
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {slowEndpoints.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-amber-600 mb-2 flex items-center gap-1.5">
                    <Clock size={12} /> Slow Endpoints ({slowEndpoints.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {slowEndpoints.map(tool => {
                      const r = toolResults[tool.id];
                      return (
                        <div key={tool.id} className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-background flex items-center justify-between" data-testid={`slow-${tool.id}`}>
                          <div className="flex items-center gap-2">
                            <tool.icon size={12} className="text-amber-500" />
                            <span className="text-xs font-medium">{tool.label}</span>
                          </div>
                          <span className="text-xs font-bold text-amber-600">{r?.ms}ms</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {repairLog.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Terminal size={12} /> Repair Log
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {repairLog.map((entry, i) => (
                      <div key={i} className="text-[10px] font-mono flex items-center gap-2">
                        <span className="text-muted-foreground">{entry.time}</span>
                        <span className={entry.status === 'fixed' ? 'text-green-600' : entry.status === 'failed' ? 'text-red-500' : 'text-blue-500'}>
                          [{entry.status.toUpperCase()}]
                        </span>
                        <span>{entry.label}</span>
                        <span className="text-muted-foreground">→ {entry.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3">
                <div className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-purple-600">
                  <Stethoscope size={12} /> Fix Command Inventory ({[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length} commands)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                  {[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].map(cmd => {
                    const scenarios = Object.entries(AI_REMEDIATION).filter(([, r]) => r.fixCommand === cmd);
                    const kbs = [...new Set(scenarios.map(([, r]) => r.knowledgeBase))];
                    return (
                      <div key={cmd} className="p-2 rounded-lg bg-background border border-purple-100 dark:border-purple-800 text-[10px]" data-testid={`fix-cmd-${cmd}`}>
                        <div className="font-mono font-bold text-purple-600 mb-0.5">{cmd}</div>
                        <div className="text-muted-foreground">{scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} · {kbs.join(', ')}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
