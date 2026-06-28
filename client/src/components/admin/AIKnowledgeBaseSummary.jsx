import { useState } from "react";
import { Brain, Search, Palette, AlertCircle, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

export default function AIKnowledgeBaseSummary({
  toolResults,
  toolCategories,
  AI_REMEDIATION,
  getRemediation,
  TOOL_ADMIN_LINKS,
  TOOL_SEVERITY,
}) {
  const [expanded, setExpanded] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const checkedTools = allTools.filter(t => toolResults[t.id]);
  
  const kbStats = { Codex: { total: 0, applied: 0, fixes: 0 }, Perplexity: { total: 0, applied: 0, fixes: 0 }, Canva: { total: 0, applied: 0, fixes: 0 } };
  Object.entries(AI_REMEDIATION).forEach(([key, rem]) => {
    if (rem.knowledgeBase && kbStats[rem.knowledgeBase]) {
      kbStats[rem.knowledgeBase].total++;
      if (rem.autoFixable) kbStats[rem.knowledgeBase].fixes++;
    }
  });
  
  checkedTools.forEach(t => {
    const r = toolResults[t.id];
    if (r && r.label !== 'ok') {
      const rem = getRemediation(r.label, r.ms);
      if (rem?.knowledgeBase && kbStats[rem.knowledgeBase]) {
        kbStats[rem.knowledgeBase].applied++;
      }
    }
  });

  const totalScenarios = Object.keys(AI_REMEDIATION).length;
  const autoFixableCount = Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length;
  const linkedCount = Object.keys(TOOL_ADMIN_LINKS).length;
  const severityCount = Object.keys(TOOL_SEVERITY).length;

  const recommendations = [];
  const errorTools = checkedTools.filter(t => toolResults[t.id]?.status === 'error');
  const slowTools = checkedTools.filter(t => toolResults[t.id]?.ms > 2000);
  const unlinkedTools = allTools.filter(t => !TOOL_ADMIN_LINKS[t.id]);
  const uncheckedTools = allTools.filter(t => !toolResults[t.id]);
  
  if (errorTools.length > 0) recommendations.push({ level: 'critical', text: `${errorTools.length} endpoints have errors — run AI Auto-Repair`, kb: 'Codex' });
  if (slowTools.length > 0) recommendations.push({ level: 'warning', text: `${slowTools.length} endpoints responding >2s — optimize or add caching`, kb: 'Codex' });
  if (uncheckedTools.length > 0 && checkedTools.length > 0) recommendations.push({ level: 'info', text: `${uncheckedTools.length} tools unchecked — run full scan for complete coverage`, kb: 'Codex' });
  if (unlinkedTools.length > 0) recommendations.push({ level: 'info', text: `${unlinkedTools.length} tools are API-only without admin page links`, kb: 'Perplexity' });
  if (checkedTools.length === allTools.length && errorTools.length === 0) recommendations.push({ level: 'success', text: 'All systems operational — platform integrity confirmed', kb: 'Codex' });

  return (
    <div className="mb-6 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20" data-testid="panel-ai-knowledge-base">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-indigo-600" />
          <span className="text-sm font-semibold">AI Knowledge Base Intelligence</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-medium">
            {totalScenarios} scenarios · {autoFixableCount} auto-fixable
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
          data-testid="button-toggle-kb-summary"
        >
          {expanded ? 'Hide' : 'Show'} Details
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {Object.entries(kbStats).map(([name, stats]) => {
          const colors = name === 'Codex' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' :
            name === 'Perplexity' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' :
            'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300';
          const icon = name === 'Codex' ? Brain : name === 'Perplexity' ? Search : Palette;
          const Icon = icon;
          return (
            <div key={name} className={`p-3 rounded-lg border ${colors}`} data-testid={`kb-${name.toLowerCase()}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} />
                <span className="text-xs font-bold">{name} AI</span>
              </div>
              <div className="text-lg font-bold">{stats.total}</div>
              <div className="text-xs opacity-80">{stats.total} scenarios · {stats.fixes} auto-fixable · {stats.applied} active</div>
            </div>
          );
        })}
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-1.5">
          {recommendations.map((rec, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
              rec.level === 'critical' ? 'bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' :
              rec.level === 'warning' ? 'bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400' :
              rec.level === 'success' ? 'bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' :
              'bg-muted/30 border border-gray-200 dark:border-gray-700 text-muted-foreground'
            }`} data-testid={`kb-rec-${i}`}>
              {rec.level === 'critical' ? <AlertCircle size={12} /> : rec.level === 'warning' ? <AlertTriangle size={12} /> : rec.level === 'success' ? <CheckCircle size={12} /> : <Lightbulb size={12} />}
              <span className="flex-1">{rec.text}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${rec.kb === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : rec.kb === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
                {rec.kb}
              </span>
            </div>
          ))}
        </div>
      )}

      {expanded && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="text-center p-2 rounded-lg bg-background border border-indigo-100 dark:border-indigo-800">
              <div className="text-lg font-bold text-indigo-600">{linkedCount}</div>
              <div className="text-xs text-muted-foreground">Admin-Linked Tools</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-background border border-indigo-100 dark:border-indigo-800">
              <div className="text-lg font-bold text-indigo-600">{severityCount}</div>
              <div className="text-xs text-muted-foreground">Priority-Classified</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-background border border-indigo-100 dark:border-indigo-800">
              <div className="text-lg font-bold text-indigo-600">{totalScenarios}</div>
              <div className="text-xs text-muted-foreground">Error Scenarios</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-background border border-indigo-100 dark:border-indigo-800">
              <div className="text-lg font-bold text-indigo-600">{autoFixableCount}</div>
              <div className="text-xs text-muted-foreground">Auto-Fixable</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2">All Remediation Scenarios</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
              {Object.entries(AI_REMEDIATION).map(([key, rem]) => (
                <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-background border border-gray-100 dark:border-gray-800 text-xs" data-testid={`kb-scenario-${key}`}>
                  <span className="font-mono font-medium text-foreground/70 flex-1 truncate">{key}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${rem.knowledgeBase === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : rem.knowledgeBase === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
                    {rem.knowledgeBase}
                  </span>
                  {rem.autoFixable && <span className="text-xs px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-medium">Fix</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
