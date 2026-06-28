// Extracted from AdminTools.jsx — MMHB v7.4 Phase 5
// Verbatim relocation of GitIntegrityScanner (originally lines 20-134).
// Props preserved exactly: () — no props.

import { useState } from 'react';
import { GitBranch, RefreshCw, ScanLine, Clipboard, Wrench } from 'lucide-react';

export default function GitIntegrityScanner() {
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
            <div className="text-xs text-muted-foreground">Branch</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-commits">
            <div className="text-lg font-bold text-blue-600">{gitData.checks?.commitCount || 0}</div>
            <div className="text-xs text-muted-foreground">Commits</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-changes">
            <div className={`text-lg font-bold ${(gitData.checks?.totalChanges || 0) > 10 ? 'text-amber-500' : 'text-green-600'}`}>{gitData.checks?.totalChanges || 0}</div>
            <div className="text-xs text-muted-foreground">Changes</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-modified">
            <div className="text-lg font-bold text-orange-500">{gitData.checks?.modifiedFiles || 0}</div>
            <div className="text-xs text-muted-foreground">Modified</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-untracked">
            <div className={`text-lg font-bold ${(gitData.checks?.untrackedFiles || 0) > 5 ? 'text-red-500' : 'text-gray-500'}`}>{gitData.checks?.untrackedFiles || 0}</div>
            <div className="text-xs text-muted-foreground">Untracked</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background border border-violet-100 dark:border-violet-800" data-testid="git-size">
            <div className="text-sm font-bold text-gray-600">{gitData.checks?.repoSize || '—'}</div>
            <div className="text-xs text-muted-foreground">Repo Size</div>
          </div>
        </div>
      )}

      {showGit && gitData && (
        <div className="mt-3 space-y-3">
          {gitData.checks?.lastCommit && gitData.checks.lastCommit !== 'unknown' && (
            <div className="p-3 rounded-lg bg-background border border-gray-100 dark:border-gray-800">
              <div className="text-xs font-semibold mb-1 flex items-center gap-1.5"><Clipboard size={12} /> Last Commit</div>
              <div className="text-xs font-mono text-muted-foreground break-all">{gitData.checks.lastCommit}</div>
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
              <div className="text-xs text-muted-foreground">{repairResult.message}</div>
              {repairResult.actions?.map((a, i) => (
                <div key={i} className="text-xs font-mono text-muted-foreground mt-0.5">→ {a}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

