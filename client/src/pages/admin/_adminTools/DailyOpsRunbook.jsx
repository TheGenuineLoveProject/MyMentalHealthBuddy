// Extracted from AdminTools.jsx — MMHB v7.4 Phase 2
// Verbatim relocation of DailyOpsRunbook (originally lines 980-1288).
// Props preserved exactly: { toolResults, isAnyRunning, runAllChecks, runErrorsOnly, lastFullCheck, runHealthCheck }.

import { useState, useRef } from 'react';
import { Clipboard, Rocket, RefreshCw, CheckCircle, Clock, Zap, ScanLine, FileWarning, Wand2, RotateCcw, Gauge, GitBranch, Stethoscope, PackageCheck, Brain, Terminal, ShieldCheck, Flame, HardDrive, Download } from 'lucide-react';
import { toolCategories, CRITICAL_CHECKS, AI_REMEDIATION, getRemediation } from '../_adminToolsShared';

export default function DailyOpsRunbook({ toolResults, isAnyRunning, runAllChecks, runErrorsOnly, lastFullCheck, runHealthCheck }) {
  const [showRunbook, setShowRunbook] = useState(false);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [stepTimestamps, setStepTimestamps] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  const [pipelineDuration, setPipelineDuration] = useState(null);
  const [dailyOpsHistory, setDailyOpsHistory] = useState(() => {
    try { const s = localStorage.getItem('glp_daily_ops_history'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const toolResultsRef = useRef(toolResults);
  toolResultsRef.current = toolResults;
  const allTools = toolCategories.flatMap(c => c.tools);
  const totalTools = allTools.length;
  const checkedCount = Object.keys(toolResults).length;
  const healthyCount = Object.values(toolResults).filter(r => r.status === 'healthy').length;
  const errorCount = Object.values(toolResults).filter(r => r.status === 'error').length;
  const warningCount = Object.values(toolResults).filter(r => r.status === 'warning').length;
  const slowCount = Object.values(toolResults).filter(r => r.ms > 2000).length;
  const autoFixableCount = allTools.filter(t => {
    const r = toolResults[t.id];
    if (!r || r.status === 'healthy') return false;
    const rem = getRemediation(r.label, r.ms);
    return rem?.autoFixable;
  }).length;

  const fixCommandCount = [...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length;
  const kbScenarioCount = Object.keys(AI_REMEDIATION).length;

  const opsSteps = [
    { id: 'quick-diag', label: 'Quick Diagnostics (8 critical)', done: CRITICAL_CHECKS.every(c => toolResults[c.id]), icon: Zap, category: 'discovery' },
    { id: 'full-scan', label: `Full Platform Scan (${totalTools} tools)`, done: checkedCount === totalTools, icon: ScanLine, category: 'discovery' },
    { id: 'review-errors', label: `Review Errors (${errorCount} found)`, done: checkedCount === totalTools && errorCount === 0, icon: FileWarning, category: 'triage' },
    { id: 'auto-repair', label: `AI Auto-Repair (${autoFixableCount} fixable)`, done: checkedCount === totalTools && errorCount === 0, icon: Wand2, category: 'repair' },
    { id: 'recheck', label: 'Post-Repair Verification', done: checkedCount === totalTools && errorCount === 0 && warningCount === 0, icon: RotateCcw, category: 'verify' },
    { id: 'perf-review', label: `Performance Review (${slowCount} slow)`, done: checkedCount === totalTools && !Object.values(toolResults).some(r => r.ms > 2000), icon: Gauge, category: 'optimize' },
    { id: 'git-integrity', label: 'Git Integrity Scan', done: checkedCount === totalTools && errorCount === 0, icon: GitBranch, category: 'integrity' },
    { id: 'deep-scan', label: 'Platform Deep Scan', done: checkedCount === totalTools && healthyCount >= totalTools * 0.9, icon: Stethoscope, category: 'integrity' },
    { id: 'service-verify', label: 'Service Integration Verify', done: checkedCount === totalTools && errorCount === 0, icon: PackageCheck, category: 'services' },
    { id: 'kb-sync', label: `KB Cross-Check (${kbScenarioCount} scenarios)`, done: checkedCount === totalTools && errorCount === 0, icon: Brain, category: 'intelligence' },
    { id: 'fix-commands', label: `Fix Commands Audit (${fixCommandCount} commands)`, done: checkedCount === totalTools && autoFixableCount === 0, icon: Terminal, category: 'intelligence' },
    { id: 'integrity', label: 'Platform Integrity Validation', done: checkedCount === totalTools && healthyCount === totalTools, icon: ShieldCheck, category: 'finalize' },
    { id: 'warm-endpoints', label: 'Pre-warm Critical Paths', done: CRITICAL_CHECKS.every(c => toolResults[c.id]?.status === 'healthy' && toolResults[c.id]?.ms < 1000), icon: Flame, category: 'finalize' },
    { id: 'cache-rebuild', label: 'Cache Rebuild & Optimize', done: checkedCount === totalTools && slowCount === 0, icon: HardDrive, category: 'optimize' },
    { id: 'optimize-all', label: 'Full 360° Optimization Pass', done: checkedCount === totalTools && errorCount === 0 && slowCount === 0, icon: Zap, category: 'finalize' },
    { id: 'export', label: 'Export Daily Health Report', done: false, icon: Download, category: 'report' },
  ];

  const completedSteps = opsSteps.filter(s => s.done).length;
  const progress = Math.round((completedSteps / opsSteps.length) * 100);

  const runFullPipeline = async () => {
    setPipelineRunning(true);
    const startTime = Date.now();
    const ts = {};

    setCurrentStep('quick-diag');
    ts['quick-diag'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await Promise.all(CRITICAL_CHECKS.map(t => runHealthCheck(t)));
    await new Promise(r => setTimeout(r, 300));

    setCurrentStep('full-scan');
    ts['full-scan'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await runAllChecks();
    await new Promise(r => setTimeout(r, 300));

    setCurrentStep('review-errors');
    ts['review-errors'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('auto-repair');
    ts['auto-repair'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await runErrorsOnly();
    await new Promise(r => setTimeout(r, 300));

    setCurrentStep('recheck');
    ts['recheck'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await runErrorsOnly();
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('perf-review');
    ts['perf-review'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('git-integrity');
    ts['git-integrity'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try { await fetch('/api/health/git-status', { credentials: 'include' }); } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('deep-scan');
    ts['deep-scan'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try { await fetch('/api/health/platform-integrity', { credentials: 'include' }); } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('service-verify');
    ts['service-verify'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try {
      await Promise.all([
        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-stripe' }) }).catch(() => {}),
        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-resend' }) }).catch(() => {}),
        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-openai' }) }).catch(() => {}),
      ]);
    } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('kb-sync');
    ts['kb-sync'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('fix-commands');
    ts['fix-commands'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 150));

    setCurrentStep('integrity');
    ts['integrity'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('warm-endpoints');
    ts['warm-endpoints'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    await Promise.all(CRITICAL_CHECKS.map(t => fetch(t.endpoint, { credentials: 'include' }).catch(() => {})));
    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }).catch(() => {}); } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('cache-rebuild');
    ts['cache-rebuild'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }).catch(() => {}); } catch {}
    await new Promise(r => setTimeout(r, 200));

    setCurrentStep('optimize-all');
    ts['optimize-all'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });
    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }).catch(() => {}); } catch {}
    await new Promise(r => setTimeout(r, 300));

    setCurrentStep('export');
    ts['export'] = new Date().toLocaleTimeString();
    setStepTimestamps({ ...ts });

    const duration = Math.round((Date.now() - startTime) / 1000);
    setPipelineDuration(duration);

    const freshResults = toolResultsRef.current;
    const finalHealthy = allTools.filter(t => freshResults[t.id]?.status === 'healthy').length;
    const finalErrors = allTools.filter(t => freshResults[t.id]?.status === 'error').length;
    const entry = {
      timestamp: new Date().toISOString(),
      duration,
      healthy: finalHealthy,
      errors: finalErrors,
      total: totalTools,
      score: Math.round((finalHealthy / totalTools) * 100),
      stepsCompleted: opsSteps.filter(s => s.done).length,
    };
    const newHistory = [entry, ...dailyOpsHistory].slice(0, 14);
    setDailyOpsHistory(newHistory);
    try { localStorage.setItem('glp_daily_ops_history', JSON.stringify(newHistory)); } catch {}

    setCurrentStep(null);
    setPipelineRunning(false);
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20" data-testid="panel-daily-ops-runbook">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clipboard size={16} className="text-blue-600" />
          <span className="text-sm font-semibold">Daily Operations Runbook</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-medium" data-testid="text-runbook-progress">
            {completedSteps}/{opsSteps.length} steps · {progress}%
          </span>
          {pipelineDuration && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 font-medium" data-testid="text-runbook-duration">
              {pipelineDuration}s
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runFullPipeline}
            disabled={pipelineRunning || isAnyRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            data-testid="button-run-full-pipeline"
          >
            {pipelineRunning ? <RefreshCw size={12} className="animate-spin" /> : <Rocket size={12} />}
            {pipelineRunning ? `Running ${currentStep || ''}...` : 'Run All Daily Ops'}
          </button>
          <button
            onClick={() => setShowRunbook(!showRunbook)}
            className="text-xs px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            data-testid="button-toggle-runbook"
          >
            {showRunbook ? 'Hide' : 'Show'} Runbook
          </button>
        </div>
      </div>

      <div className="h-2 rounded-full bg-blue-200 dark:bg-blue-800 overflow-hidden mb-2">
        <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {pipelineRunning && currentStep && (
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-2 p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/20" data-testid="text-runbook-current-step">
          <RefreshCw size={12} className="animate-spin" />
          <span className="font-medium">Currently executing: {opsSteps.find(s => s.id === currentStep)?.label || currentStep}</span>
        </div>
      )}

      {showRunbook && (
        <div className="mt-3 space-y-2">
          {opsSteps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const catColors = {
              discovery: 'text-amber-500', triage: 'text-red-500', repair: 'text-purple-500',
              verify: 'text-blue-500', optimize: 'text-cyan-500', intelligence: 'text-indigo-500',
              finalize: 'text-emerald-500', report: 'text-gray-500',
              integrity: 'text-violet-500', services: 'text-teal-500'
            };
            return (
              <div key={step.id} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                isActive ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-300' :
                step.done ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' : 
                'border-gray-200 dark:border-gray-700 bg-background'
              }`} data-testid={`runbook-step-${step.id}`}>
                <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                {isActive ? (
                  <RefreshCw size={14} className="animate-spin text-blue-500 flex-shrink-0" />
                ) : step.done ? (
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                ) : (
                  <StepIcon size={14} className={`${catColors[step.category] || 'text-muted-foreground'} flex-shrink-0`} />
                )}
                <span className={`text-sm flex-1 ${isActive ? 'text-blue-700 dark:text-blue-300 font-medium' : step.done ? 'text-green-700 dark:text-green-400 line-through' : ''}`}>
                  {step.label}
                  {stepTimestamps[step.id] && <span className="text-[10px] text-muted-foreground ml-2 font-normal">({stepTimestamps[step.id]})</span>}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${catColors[step.category] || 'text-gray-500'} bg-muted/50`}>
                  {step.category}
                </span>
                {!step.done && !pipelineRunning && step.id === 'quick-diag' && (
                  <button onClick={() => Promise.all(CRITICAL_CHECKS.map(t => runHealthCheck(t)))} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-gold)] text-[var(--glp-charcoal)] hover:opacity-90 transition-colors font-medium" data-testid="button-runbook-quick-diag">Run</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'full-scan' && (
                  <button onClick={runAllChecks} disabled={isAnyRunning} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-sage)] text-[var(--glp-ivory)] hover:opacity-90 transition-colors disabled:opacity-50 font-medium" data-testid="button-runbook-full-scan">Run All</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'recheck' && checkedCount === totalTools && (
                  <button onClick={runErrorsOnly} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-gold)] text-[var(--glp-charcoal)] hover:opacity-90 transition-colors font-medium" data-testid="button-runbook-recheck">Re-check</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'integrity' && (
                  <button onClick={runAllChecks} disabled={isAnyRunning} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-sage)] text-[var(--glp-ivory)] hover:opacity-90 transition-colors disabled:opacity-50 font-medium" data-testid="button-runbook-integrity">Verify</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'git-integrity' && (
                  <button onClick={() => fetch('/api/health/git-status', { credentials: 'include' }).catch(() => {})} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:opacity-90 transition-colors font-medium" data-testid="button-runbook-git">Scan</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'deep-scan' && (
                  <button onClick={() => fetch('/api/health/platform-integrity', { credentials: 'include' }).catch(() => {})} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:opacity-90 transition-colors font-medium" data-testid="button-runbook-deep-scan">Scan</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'service-verify' && (
                  <button onClick={() => Promise.all(['verify-stripe', 'verify-resend', 'check-openai'].map(cmd => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: cmd }) }).catch(() => {})))} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:opacity-90 transition-colors font-medium" data-testid="button-runbook-service-verify">Verify</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'warm-endpoints' && (
                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }).catch(() => {})} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-blossom)] text-[var(--glp-charcoal)] hover:opacity-90 transition-colors font-medium" data-testid="button-runbook-warm">Warm</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'cache-rebuild' && (
                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }).catch(() => {})} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] hover:opacity-90 transition-colors font-medium" data-testid="button-runbook-cache">Rebuild</button>
                )}
                {!step.done && !pipelineRunning && step.id === 'optimize-all' && (
                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }).catch(() => {})} className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--glp-sage)] text-[var(--glp-ivory)] hover:opacity-90 transition-colors font-medium" data-testid="button-runbook-optimize-all">Optimize</button>
                )}
              </div>
            );
          })}

          {dailyOpsHistory.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <Clock size={12} /> Recent Daily Ops Runs ({dailyOpsHistory.length})
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {dailyOpsHistory.map((run, i) => (
                  <div key={i} className="flex items-center gap-3 text-[11px] p-1.5 rounded bg-background" data-testid={`daily-ops-history-${i}`}>
                    <span className="text-muted-foreground font-mono w-20">{new Date(run.timestamp).toLocaleDateString()}</span>
                    <span className={`font-bold ${run.score >= 90 ? 'text-green-600' : run.score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>{run.score}%</span>
                    <span className="text-green-600">{run.healthy} ok</span>
                    {run.errors > 0 && <span className="text-red-500">{run.errors} err</span>}
                    <span className="text-muted-foreground">{run.duration}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
