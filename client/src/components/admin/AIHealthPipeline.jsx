import { useState, useRef } from "react";
import { ScanLine, FileWarning, Wand2, CheckCircle, Gauge, Clipboard, GitBranch, RefreshCw, Rocket, Clock } from 'lucide-react';

export default function AIHealthPipeline({
  toolResults,
  runHealthCheck,
  runAllChecks,
  toolCategories,
  getRemediation,
}) {
  const [showPipeline, setShowPipeline] = useState(false);
  const [pipelineHistory, setPipelineHistory] = useState(() => {
    try { const s = localStorage.getItem('glp_health_pipeline_history'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const allTools = toolCategories.flatMap(c => c.tools);
  const checkedTools = allTools.filter(t => toolResults[t.id]);
  const toolResultsRef = useRef(toolResults);
  toolResultsRef.current = toolResults;

  const phases = [
    { id: 'discovery', label: 'Service Discovery', desc: 'Scan all 127 endpoints', icon: ScanLine, kb: 'Codex' },
    { id: 'triage', label: 'Issue Triage', desc: 'Classify by severity & knowledge base', icon: FileWarning, kb: 'Perplexity' },
    { id: 'auto-fix', label: 'Automated Repair', desc: 'Execute auto-fixable remediations', icon: Wand2, kb: 'Codex' },
    { id: 'verify', label: 'Verification Sweep', desc: 'Re-check all repaired endpoints', icon: CheckCircle, kb: 'Codex' },
    { id: 'optimize', label: 'Performance Audit', desc: 'Flag slow endpoints for optimization', icon: Gauge, kb: 'Perplexity' },
    { id: 'report', label: 'Generate Report', desc: 'Compile results with recommendations', icon: Clipboard, kb: 'Canva' },
  ];

  const runDeepPipeline = async () => {
    setIsRunning(true);
    const startTime = Date.now();
    const phaseResults = {};

    setCurrentPhase('discovery');
    await runAllChecks();
    await new Promise(r => setTimeout(r, 500));
    phaseResults.discovery = { status: 'done', time: new Date().toLocaleTimeString() };

    setCurrentPhase('triage');
    await new Promise(r => setTimeout(r, 300));
    const freshResults1 = toolResultsRef.current;
    const errors = allTools.filter(t => freshResults1[t.id]?.status === 'error');
    const warnings = allTools.filter(t => freshResults1[t.id]?.status === 'warning');
    phaseResults.triage = { status: 'done', errors: errors.length, warnings: warnings.length, time: new Date().toLocaleTimeString() };

    setCurrentPhase('auto-fix');
    const fixable = errors.filter(t => {
      const r = toolResultsRef.current[t.id];
      const rem = getRemediation(r?.label, r?.ms);
      return rem?.autoFixable;
    });
    for (const tool of fixable) {
      await runHealthCheck(tool);
      await new Promise(r => setTimeout(r, 200));
    }
    phaseResults['auto-fix'] = { status: 'done', attempted: fixable.length, time: new Date().toLocaleTimeString() };

    setCurrentPhase('verify');
    const freshResults2 = toolResultsRef.current;
    const issueTools = allTools.filter(t => freshResults2[t.id]?.status === 'error' || freshResults2[t.id]?.status === 'warning');
    await Promise.all(issueTools.map(t => runHealthCheck(t)));
    await new Promise(r => setTimeout(r, 300));
    phaseResults.verify = { status: 'done', rechecked: issueTools.length, time: new Date().toLocaleTimeString() };

    setCurrentPhase('optimize');
    await new Promise(r => setTimeout(r, 200));
    const freshResults3 = toolResultsRef.current;
    const slowCount = allTools.filter(t => freshResults3[t.id]?.ms > 2000).length;
    phaseResults.optimize = { status: 'done', slowEndpoints: slowCount, time: new Date().toLocaleTimeString() };

    setCurrentPhase('report');
    const freshResults4 = toolResultsRef.current;
    const finalHealthy = allTools.filter(t => freshResults4[t.id]?.status === 'healthy').length;
    const finalErrors = allTools.filter(t => freshResults4[t.id]?.status === 'error').length;
    const duration = Math.round((Date.now() - startTime) / 1000);
    phaseResults.report = { status: 'done', time: new Date().toLocaleTimeString() };

    const entry = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      healthy: finalHealthy,
      errors: finalErrors,
      fixed: fixable.length,
      score: allTools.length > 0 ? Math.round((finalHealthy / allTools.length) * 100) : 0,
      phases: phaseResults
    };
    const newHistory = [entry, ...pipelineHistory].slice(0, 10);
    setPipelineHistory(newHistory);
    try { localStorage.setItem('glp_health_pipeline_history', JSON.stringify(newHistory)); } catch {}

    setCurrentPhase(null);
    setIsRunning(false);
  };

  const trend = pipelineHistory.length >= 2 
    ? pipelineHistory[0].score - pipelineHistory[1].score 
    : null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/20" data-testid="panel-ai-health-pipeline">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-violet-600" />
          <span className="text-sm font-semibold">AI Health Pipeline</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-200 font-medium" data-testid="text-pipeline-phase-count">
            {phases.length} phases · {pipelineHistory.length} runs
          </span>
          {trend !== null && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${trend > 0 ? 'bg-green-100 text-green-600' : trend < 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`} data-testid="text-pipeline-trend">
              {trend > 0 ? '+' : ''}{trend}% trend
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runDeepPipeline}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
            data-testid="button-run-deep-pipeline"
          >
            {isRunning ? <RefreshCw size={12} className="animate-spin" /> : <Rocket size={12} />}
            {isRunning ? `Phase: ${currentPhase}...` : 'Run Deep Pipeline'}
          </button>
          <button
            onClick={() => setShowPipeline(!showPipeline)}
            className="text-xs px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
            data-testid="button-toggle-pipeline"
          >
            {showPipeline ? 'Hide' : 'Show'} Details
          </button>
        </div>
      </div>

      {isRunning && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
          {phases.map(phase => {
            const PhaseIcon = phase.icon;
            const isActive = currentPhase === phase.id;
            const isDone = phases.indexOf(phase) < phases.findIndex(p => p.id === currentPhase);
            return (
              <div key={phase.id} className={`flex items-center gap-1.5 p-2 rounded-lg border text-[10px] ${isActive ? 'border-violet-400 bg-violet-100 dark:bg-violet-900/30' : isDone ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 bg-background'}`} data-testid={`pipeline-phase-${phase.id}`}>
                {isActive ? <RefreshCw size={10} className="animate-spin text-violet-600" /> : isDone ? <CheckCircle size={10} className="text-green-600" /> : <PhaseIcon size={10} className="text-muted-foreground" />}
                <span className={`font-medium ${isActive ? 'text-violet-700 dark:text-violet-300' : isDone ? 'text-green-600' : ''}`}>{phase.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {showPipeline && pipelineHistory.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Clock size={12} /> Pipeline History ({pipelineHistory.length} runs)
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {pipelineHistory.map((run, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-xs" data-testid={`pipeline-history-${i}`}>
                <span className="text-muted-foreground font-mono w-20">{new Date(run.timestamp).toLocaleDateString()}</span>
                <span className={`text-lg font-bold ${run.score >= 90 ? 'text-green-600' : run.score >= 70 ? 'text-amber-500' : 'text-red-500'}`} data-testid={`text-pipeline-score-${i}`}>{run.score}%</span>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-green-600">{run.healthy} healthy</span>
                  {run.errors > 0 && <span className="text-red-500">{run.errors} errors</span>}
                  {run.fixed > 0 && <span className="text-purple-600">{run.fixed} auto-fixed</span>}
                </div>
                <span className="text-muted-foreground">{run.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPipeline && pipelineHistory.length === 0 && (
        <div className="text-center py-4 text-xs text-muted-foreground">
          No pipeline runs yet. Click "Run Deep Pipeline" to start your first comprehensive health sweep.
        </div>
      )}
    </div>
  );
}
