// Extracted from AdminTools.jsx — MMHB v7.4 Phase 3
// Verbatim relocation of PlatformIntegrityScanner (originally lines 204-385).
// Props preserved exactly: { toolResults }.

import { useState } from 'react';
import { Link } from 'wouter';
import { GitBranch, BarChart3, ExternalLink, CheckCircle, AlertCircle, Clock, Puzzle, AlertTriangle, Target } from 'lucide-react';
import { toolCategories, TOOL_ADMIN_LINKS, TOOL_SEVERITY } from '../_adminToolsShared';
import GroupedHealthOverview from '../../../components/admin/GroupedHealthOverview';

export default function PlatformIntegrityScanner({ toolResults }) {
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
          <div className="text-xs text-muted-foreground">Critical</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-high">
          <div className="text-lg font-bold text-orange-500">{highTools.length}</div>
          <div className="text-xs text-muted-foreground">High</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-medium">
          <div className="text-lg font-bold text-blue-500">{mediumTools.length}</div>
          <div className="text-xs text-muted-foreground">Medium</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-linked">
          <div className="text-lg font-bold text-emerald-500">{linkedTools.length}</div>
          <div className="text-xs text-muted-foreground">Admin-Linked</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-unclassified">
          <div className="text-lg font-bold text-gray-500">{normalTools.length}</div>
          <div className="text-xs text-muted-foreground">Unclassified</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-background border border-emerald-100 dark:border-emerald-800" data-testid="scanner-total">
          <div className="text-lg font-bold text-emerald-600">{totalTools}</div>
          <div className="text-xs text-muted-foreground">Total</div>
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
                  <div className="flex items-center gap-2 text-xs">
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
                  <div key={t.id} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-xs" data-testid={`linked-${t.id}`}>
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
                  <span key={t.id} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground" data-testid={`unlinked-${t.id}`}>{t.label}</span>
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
                  <div key={endpoint} className="text-xs p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
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
                    <div className="text-xs text-muted-foreground">{tierHealthy}/{tierChecked > 0 ? tierChecked : t.tools.length} healthy</div>
                    <div className="text-xs text-muted-foreground">{t.tools.filter(tool => TOOL_ADMIN_LINKS[tool.id]).length} admin-linked</div>
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
