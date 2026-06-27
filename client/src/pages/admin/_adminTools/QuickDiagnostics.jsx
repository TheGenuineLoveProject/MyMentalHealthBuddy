// Extracted from AdminTools.jsx — MMHB v7.4 Phase 4
// Verbatim relocation of QuickDiagnostics (originally lines 17-88).
// Props preserved exactly: { toolResults, runHealthCheck, runningTools }.

import { Zap, RefreshCw, Play, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { CRITICAL_CHECKS } from '../_adminToolsShared';

export default function QuickDiagnostics({ toolResults, runHealthCheck, runningTools }) {
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
                <div className="text-xs text-muted-foreground truncate">
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
