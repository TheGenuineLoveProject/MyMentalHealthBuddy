// Extracted from AdminTools.jsx — MMHB v7.4 Phase 4
// Verbatim relocation of AIDiagnosticsPanel (originally lines 91-203).
// Props preserved exactly: { toolResults, runHealthCheck }.

import { useState } from 'react';
import { Stethoscope, CheckCircle, RotateCcw, Brain, Wrench } from 'lucide-react';
import { toolCategories, TOOL_SEVERITY, getRemediation } from '../_adminToolsShared';

export default function AIDiagnosticsPanel({ toolResults, runHealthCheck }) {
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
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {issue.result.label} · {issue.result.ms}ms
                    </span>
                    {issue.severity !== 'normal' && (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${issue.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
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
                      <span className={`text-xs px-1 py-0.5 rounded font-medium flex-shrink-0 ${remediation.knowledgeBase === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : remediation.knowledgeBase === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
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
