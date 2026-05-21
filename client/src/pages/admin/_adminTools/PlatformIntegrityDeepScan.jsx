// Extracted from AdminTools.jsx — MMHB v7.4 Phase 5
// Verbatim relocation of PlatformIntegrityDeepScan (originally lines 136-284).
// Props preserved exactly: () — no props.

import { useState } from 'react';
import { Stethoscope, RefreshCw, ScanLine, Shield, Key, CheckCircle, AlertCircle, Clock, HardDrive } from 'lucide-react';

export default function PlatformIntegrityDeepScan() {
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

