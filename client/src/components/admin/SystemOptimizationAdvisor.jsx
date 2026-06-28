import { useState } from "react";
import { Cpu, AlertCircle, CheckCircle, Lightbulb, Wrench } from 'lucide-react';

export default function SystemOptimizationAdvisor({
  toolResults,
  toolCategories,
  AI_REMEDIATION,
  getRemediation,
  TOOL_ADMIN_LINKS,
  TOOL_SEVERITY,
}) {
  const [showAdvisor, setShowAdvisor] = useState(false);
  const allTools = toolCategories.flatMap(c => c.tools);
  const checkedTools = allTools.filter(t => toolResults[t.id]);
  if (checkedTools.length === 0) return null;

  const errorTools = checkedTools.filter(t => toolResults[t.id]?.status === 'error');
  const warningTools = checkedTools.filter(t => toolResults[t.id]?.status === 'warning');
  const slowTools = checkedTools.filter(t => toolResults[t.id]?.ms > 1500);
  const verySlowTools = checkedTools.filter(t => toolResults[t.id]?.ms > 3000);
  const healthyTools = checkedTools.filter(t => toolResults[t.id]?.status === 'healthy');
  const authGated = checkedTools.filter(t => toolResults[t.id]?.label === 'auth-gated' || toolResults[t.id]?.label === 'admin-only');
  const unlinkedTools = allTools.filter(t => !TOOL_ADMIN_LINKS[t.id]);
  const unchecked = allTools.filter(t => !toolResults[t.id]);
  const avgMs = checkedTools.length > 0 ? Math.round(checkedTools.reduce((s, t) => s + (toolResults[t.id]?.ms || 0), 0) / checkedTools.length) : 0;

  const advisories = [];
  
  if (errorTools.length > 3) advisories.push({ priority: 'critical', category: 'Reliability', text: `${errorTools.length} endpoints failing — indicates potential systemic issue. Check database connection and server health first.`, action: 'Run Quick Diagnostics', kb: 'Codex' });
  else if (errorTools.length > 0) advisories.push({ priority: 'high', category: 'Reliability', text: `${errorTools.length} endpoint(s) need attention. Most are likely missing route files or unmounted routes.`, action: 'Review 404 errors in diagnostics panel', kb: 'Codex' });
  
  if (verySlowTools.length > 0) advisories.push({ priority: 'high', category: 'Performance', text: `${verySlowTools.length} endpoints take >3 seconds: ${verySlowTools.slice(0, 3).map(t => t.label).join(', ')}${verySlowTools.length > 3 ? '...' : ''}`, action: 'Add response caching or optimize queries', kb: 'Codex' });
  else if (slowTools.length > 2) advisories.push({ priority: 'medium', category: 'Performance', text: `${slowTools.length} endpoints respond >1.5 seconds. Consider implementing server-side caching for frequently accessed data.`, action: 'Review slow endpoints in Repair Center', kb: 'Perplexity' });
  
  if (avgMs > 1000) advisories.push({ priority: 'medium', category: 'Performance', text: `Average response time is ${avgMs}ms (target: <500ms). Global optimization recommended.`, action: 'Enable compression and response caching', kb: 'Perplexity' });
  
  if (authGated.length > 0 && authGated.length === checkedTools.length) advisories.push({ priority: 'medium', category: 'Security', text: 'All endpoints require authentication — verify public-facing routes are accessible for unauthenticated users (crisis, health).', action: 'Check public route configuration', kb: 'Codex' });
  
  if (warningTools.length > 5) advisories.push({ priority: 'medium', category: 'Stability', text: `${warningTools.length} endpoints returning warnings. Rate limiting or partial failures detected.`, action: 'Review rate limit configuration', kb: 'Canva' });
  
  if (unlinkedTools.length > 30) advisories.push({ priority: 'low', category: 'Navigation', text: `${unlinkedTools.length} tools lack admin page links. Consider mapping wellness and intelligence tools to relevant dashboards.`, action: 'Expand admin link mappings', kb: 'Perplexity' });
  
  if (unchecked.length > 0 && checkedTools.length > 0) advisories.push({ priority: 'low', category: 'Coverage', text: `${unchecked.length} tools haven't been checked yet. Full scan recommended for complete visibility.`, action: 'Run full platform scan', kb: 'Codex' });

  const criticalSeverityErrors = errorTools.filter(t => TOOL_SEVERITY[t.id] === 'critical');
  if (criticalSeverityErrors.length > 0) advisories.push({ priority: 'critical', category: 'Critical Path', text: `${criticalSeverityErrors.length} critical-tier tool(s) failing: ${criticalSeverityErrors.map(t => t.label).join(', ')}. Immediate remediation required.`, action: 'Run AI Auto-Repair on critical tools', kb: 'Codex' });

  const autoFixableErrors = errorTools.filter(t => { const rem = getRemediation(toolResults[t.id]?.label, toolResults[t.id]?.ms); return rem?.autoFixable; });
  if (autoFixableErrors.length > 0 && autoFixableErrors.length < errorTools.length) advisories.push({ priority: 'medium', category: 'Repair Strategy', text: `${autoFixableErrors.length} of ${errorTools.length} errors are auto-fixable. ${errorTools.length - autoFixableErrors.length} require manual intervention.`, action: 'Run Auto-Repair, then manually address remaining', kb: 'Perplexity' });

  const kbCoverage = {};
  checkedTools.forEach(t => { const r = toolResults[t.id]; if (r && r.label !== 'ok') { const rem = getRemediation(r.label, r.ms); if (rem?.knowledgeBase) kbCoverage[rem.knowledgeBase] = (kbCoverage[rem.knowledgeBase] || 0) + 1; } });
  if (Object.keys(kbCoverage).length > 1) advisories.push({ priority: 'low', category: 'KB Intelligence', text: `Active KB sources: ${Object.entries(kbCoverage).map(([k, v]) => `${k} (${v})`).join(', ')}. Multi-KB remediation active.`, action: 'Review KB scenario coverage', kb: 'Canva' });

  const groupHealth = toolCategories.map(cat => {
    const catTools = cat.tools.filter(t => toolResults[t.id]);
    const catErrors = catTools.filter(t => toolResults[t.id]?.status === 'error');
    return { title: cat.title, total: cat.tools.length, checked: catTools.length, errors: catErrors.length };
  });
  const failingGroups = groupHealth.filter(g => g.checked > 0 && g.errors > g.checked * 0.5);
  if (failingGroups.length > 0) advisories.push({ priority: 'high', category: 'Component Groups', text: `${failingGroups.length} category group(s) have >50% failure rate: ${failingGroups.map(g => g.title).join(', ')}. Investigate shared dependencies.`, action: 'Check group-level dependencies and routes', kb: 'Codex' });
  
  const perfectGroups = groupHealth.filter(g => g.checked === g.total && g.errors === 0 && g.total > 0);
  if (perfectGroups.length > 0 && perfectGroups.length < groupHealth.length) advisories.push({ priority: 'success', category: 'Component Groups', text: `${perfectGroups.length} of ${groupHealth.length} category groups are fully healthy: ${perfectGroups.slice(0, 3).map(g => g.title).join(', ')}${perfectGroups.length > 3 ? '...' : ''}.`, action: 'Maintain current configuration', kb: 'Codex' });

  const totalScenarios = Object.keys(AI_REMEDIATION).length;
  const autoFixableCount = Object.values(AI_REMEDIATION).filter(r => r.autoFixable).length;
  if (autoFixableCount > 0 && checkedTools.length > 0) advisories.push({ priority: 'low', category: 'KB Depth', text: `${totalScenarios} remediation scenarios loaded across 3 KBs. ${autoFixableCount} auto-fixable with ${[...new Set(Object.values(AI_REMEDIATION).filter(r => r.fixCommand).map(r => r.fixCommand))].length} unique commands.`, action: 'Review Fix Command Inventory', kb: 'Perplexity' });

  if (healthyTools.length === allTools.length) advisories.push({ priority: 'success', category: 'Overall', text: 'All systems healthy — platform is operating at peak performance. No optimization needed.', action: 'Export health report for records', kb: 'Codex' });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, success: 4 };
  advisories.sort((a, b) => (priorityOrder[a.priority] ?? 5) - (priorityOrder[b.priority] ?? 5));

  return (
    <div className="mb-6 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/30 dark:bg-cyan-950/20" data-testid="panel-optimization-advisor">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-cyan-600" />
          <span className="text-sm font-semibold">System Optimization Advisor</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200 font-medium">
            {advisories.length} recommendations
          </span>
        </div>
        <button
          onClick={() => setShowAdvisor(!showAdvisor)}
          className="text-xs px-3 py-1.5 rounded-lg border border-cyan-300 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
          data-testid="button-toggle-advisor"
        >
          {showAdvisor ? 'Hide' : 'Show'} Advisor
        </button>
      </div>

      {!showAdvisor && advisories.length > 0 && (
        <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
          advisories[0].priority === 'critical' ? 'bg-red-50 dark:bg-red-900/15 text-red-700 dark:text-red-400' :
          advisories[0].priority === 'high' ? 'bg-orange-50 dark:bg-orange-900/15 text-orange-700 dark:text-orange-400' :
          advisories[0].priority === 'success' ? 'bg-green-50 dark:bg-green-900/15 text-green-700 dark:text-green-400' :
          'bg-muted/30 text-muted-foreground'
        }`}>
          {advisories[0].priority === 'critical' ? <AlertCircle size={12} /> : advisories[0].priority === 'success' ? <CheckCircle size={12} /> : <Lightbulb size={12} />}
          <span className="font-medium">{advisories[0].category}:</span>
          <span>{advisories[0].text}</span>
        </div>
      )}

      {showAdvisor && (
        <div className="space-y-2">
          {advisories.map((adv, i) => (
            <div key={i} className={`p-3 rounded-lg border ${
              adv.priority === 'critical' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/15' :
              adv.priority === 'high' ? 'border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/15' :
              adv.priority === 'success' ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/15' :
              'border-gray-200 dark:border-gray-700 bg-background'
            }`} data-testid={`advisor-${i}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase ${
                    adv.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                    adv.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                    adv.priority === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    adv.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-600'
                  }`}>{adv.priority}</span>
                  <span className="text-xs font-semibold">{adv.category}</span>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${adv.kb === 'Codex' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : adv.kb === 'Perplexity' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'}`}>
                  {adv.kb}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{adv.text}</p>
              <div className="flex items-center gap-1.5 text-xs">
                <Wrench size={10} className="text-cyan-500" />
                <span className="font-medium text-cyan-700 dark:text-cyan-400">{adv.action}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
