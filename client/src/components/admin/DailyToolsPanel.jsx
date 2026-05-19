import { useState, useEffect } from "react";
import { Wand2, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Play, Search, ArrowRight, CheckSquare } from 'lucide-react';
import { toolCategories } from "@/config/toolCategories";
import styles from "../../pages/admin/CommandCenter.module.css";

export default function DailyToolsPanel() {
  const [runningTools, setRunningTools] = useState({});
  const [toolResults, setToolResults] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [lastFullCheck, setLastFullCheck] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [isRunningAll, setIsRunningAll] = useState(false);

  const toggleCategory = (idx) => {
    setCollapsedCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const collapseAll = () => {
    const all = {};
    toolCategories.forEach((_, i) => { all[i] = true; });
    setCollapsedCategories(all);
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  const runHealthCheck = async (tool) => {
    setRunningTools(prev => ({ ...prev, [tool.id]: true }));
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let res = await fetch(tool.endpoint, { method: 'GET', credentials: 'include', signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 405) {
        const c2 = new AbortController();
        const t2 = setTimeout(() => c2.abort(), 8000);
        res = await fetch(tool.endpoint, { method: 'HEAD', credentials: 'include', signal: c2.signal });
        clearTimeout(t2);
      }
      const responseTime = Math.round(performance.now() - startTime);
      let status = 'healthy';
      if (res.ok) status = 'healthy';
      else if (res.status === 401 || res.status === 403) status = 'healthy';
      else if (res.status === 405) status = 'healthy';
      else if (res.status === 404) status = 'error';
      else if (res.status === 429) status = 'warning';
      else if (res.status >= 500) status = 'error';
      else status = 'warning';
      const statusLabel = res.status === 401 ? 'auth-gated' : res.status === 403 ? 'admin-only' : res.status === 405 ? 'post-only' : res.status === 429 ? 'rate-limited' : res.status >= 500 ? 'server-error' : res.ok ? 'ok' : `${res.status}`;
      setToolResults(prev => ({ ...prev, [tool.id]: { status, code: res.status, time: new Date().toLocaleTimeString(), label: statusLabel, ms: responseTime } }));
    } catch (err) {
      const responseTime = Math.round(performance.now() - startTime);
      const label = err?.name === 'AbortError' ? 'timeout' : 'unreachable';
      setToolResults(prev => ({ ...prev, [tool.id]: { status: 'error', code: 0, time: new Date().toLocaleTimeString(), label, ms: responseTime } }));
    } finally {
      setRunningTools(prev => ({ ...prev, [tool.id]: false }));
    }
  };

  const runAllChecks = async () => {
    setIsRunningAll(true);
    setToolResults({});
    const allTools = toolCategories.flatMap(c => c.tools);
    const batchSize = 6;
    for (let i = 0; i < allTools.length; i += batchSize) {
      const batch = allTools.slice(i, i + batchSize);
      await Promise.all(batch.map(tool => runHealthCheck(tool)));
      if (i + batchSize < allTools.length) {
        await new Promise(r => setTimeout(r, 150));
      }
    }
    const checkTime = new Date().toLocaleTimeString();
    setLastFullCheck(checkTime);
    setIsRunningAll(false);
  };

  useEffect(() => {
    if (Object.keys(toolResults).length > 0 && lastFullCheck) {
      try {
        localStorage.setItem('glp_tools_last_check', JSON.stringify({
          results: toolResults,
          lastCheck: lastFullCheck,
          timestamp: Date.now()
        }));
      } catch {}
    }
  }, [toolResults, lastFullCheck]);

  const runErrorsOnly = async () => {
    const errorTools = toolCategories.flatMap(c => c.tools).filter(t => toolResults[t.id]?.status === 'error' || toolResults[t.id]?.status === 'warning');
    if (errorTools.length === 0) return;
    await Promise.all(errorTools.map(t => runHealthCheck(t)));
  };

  const totalTools = toolCategories.reduce((sum, c) => sum + c.tools.length, 0);
  const checkedCount = Object.keys(toolResults).length;
  const healthyCount = Object.values(toolResults).filter(r => r.status === 'healthy').length;
  const warningCount = Object.values(toolResults).filter(r => r.status === 'warning').length;
  const errorCount = Object.values(toolResults).filter(r => r.status === 'error').length;
  const isAnyRunning = isRunningAll || Object.values(runningTools).some(Boolean);
  const avgResponseTime = checkedCount > 0 ? Math.round(Object.values(toolResults).reduce((sum, r) => sum + (r.ms || 0), 0) / checkedCount) : 0;
  const maxResponseTime = checkedCount > 0 ? Math.max(...Object.values(toolResults).map(r => r.ms || 0)) : 0;
  const authGatedCount = Object.values(toolResults).filter(r => r.label === 'auth-gated' || r.label === 'admin-only').length;
  const rateLimitedCount = Object.values(toolResults).filter(r => r.label === 'rate-limited').length;

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Wand2 className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Platform Tools &mdash; Daily Health Monitor ({totalTools})</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {checkedCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }} data-testid="text-tool-check-summary">
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#22c55e' }}>
                <CheckCircle size={12} /> {healthyCount}
              </span>
              {warningCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#eab308' }}>
                  <AlertTriangle size={12} /> {warningCount}
                </span>
              )}
              {errorCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ef4444' }}>
                  <AlertCircle size={12} /> {errorCount}
                </span>
              )}
              <span style={{ color: '#888' }}>/ {totalTools}</span>
            </div>
          )}
          <button
            className={styles.refreshButton}
            onClick={runAllChecks}
            disabled={isAnyRunning}
            data-testid="button-run-all-tool-checks"
            title="Run health check on all platform tools"
          >
            {isAnyRunning ? (
              <RefreshCw size={14} style={{ marginRight: '4px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <Play size={14} style={{ marginRight: '4px' }} />
            )}
            {isAnyRunning ? `Checking... (${checkedCount}/${totalTools})` : 'Run All Checks'}
          </button>
        </div>
      </div>
      
      {checkedCount > 0 && (
        <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
          <div style={{ height: '4px', borderRadius: '2px', background: '#e5e7eb', overflow: 'hidden' }} data-testid="progress-bar-tools">
            <div style={{ 
              height: '100%', 
              width: `${(checkedCount / totalTools) * 100}%`, 
              background: errorCount > 0 ? '#ef4444' : warningCount > 0 ? '#eab308' : '#22c55e',
              transition: 'width 0.3s ease, background 0.3s ease',
              borderRadius: '2px'
            }} />
          </div>
        </div>
      )}
      
      {checkedCount === totalTools && !isAnyRunning && (() => {
        const healthScore = totalTools > 0 ? Math.round((healthyCount / totalTools) * 100) : 0;
        const scoreColor = healthScore >= 90 ? '#22c55e' : healthScore >= 70 ? '#f59e0b' : '#ef4444';
        const scoreBg = healthScore >= 90 ? 'rgba(34,197,94,0.06)' : healthScore >= 70 ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)';
        const scoreBorder = healthScore >= 90 ? 'rgba(34,197,94,0.15)' : healthScore >= 70 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
        return (
        <div style={{ padding: '0.5rem 1rem', marginBottom: '0.25rem' }} data-testid="panel-check-results-summary">
          <div style={{ 
            padding: '0.75rem', borderRadius: '8px', background: scoreBg, border: `1px solid ${scoreBorder}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: scoreColor }} data-testid="text-health-score">{healthScore}%</div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Platform Health Score</div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>Last check: {lastFullCheck}</div>
                </div>
              </div>
              {(errorCount + warningCount > 0) && (
                <button onClick={runErrorsOnly} disabled={isAnyRunning} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.7rem', padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)',
                  cursor: 'pointer', color: '#dc2626', fontWeight: 500
                }} data-testid="button-recheck-issues">
                  <RefreshCw size={10} /> Re-check Issues ({errorCount + warningCount})
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#22c55e' }} data-testid="text-healthy-count">{healthyCount}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Healthy</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#eab308' }} data-testid="text-warning-count">{warningCount}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Warnings</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ef4444' }} data-testid="text-error-count">{errorCount}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Errors</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#3b82f6' }} data-testid="text-auth-gated-count">{authGatedCount}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Auth-Gated</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6' }} data-testid="text-avg-response-time">{avgResponseTime}ms</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Avg Response</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: maxResponseTime > 1000 ? '#ef4444' : '#64748b' }} data-testid="text-max-response-time">{maxResponseTime}ms</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Slowest</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#64748b' }} data-testid="text-total-tools">{totalTools}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>Total Tools</div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
      
      <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{ 
              width: '100%', padding: '6px 8px 6px 28px', fontSize: '0.8rem',
              border: '1px solid rgba(0,0,0,0.12)', borderRadius: '6px',
              background: 'rgba(0,0,0,0.02)', outline: 'none'
            }}
            data-testid="input-search-tools"
          />
        </div>
        <button onClick={expandAll} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }} data-testid="button-expand-all">
          Expand All
        </button>
        <button onClick={collapseAll} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }} data-testid="button-collapse-all">
          Collapse All
        </button>
        {lastFullCheck && (
          <span style={{ fontSize: '0.7rem', color: '#888' }} data-testid="text-last-full-check">
            Last check: {lastFullCheck}
          </span>
        )}
      </div>
      <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {toolCategories.map((category, ci) => {
          const filterLower = searchFilter.toLowerCase();
          const filteredTools = searchFilter 
            ? category.tools.filter(t => t.label.toLowerCase().includes(filterLower) || t.desc.toLowerCase().includes(filterLower) || t.id.toLowerCase().includes(filterLower))
            : category.tools;
          if (searchFilter && filteredTools.length === 0) return null;
          const catHealthy = category.tools.filter(t => toolResults[t.id]?.status === 'healthy').length;
          const catChecked = category.tools.filter(t => toolResults[t.id]).length;
          const catErrors = category.tools.filter(t => toolResults[t.id]?.status === 'error').length;
          const isCollapsed = collapsedCategories[ci];
          return (
          <div key={ci}>
            <button 
              onClick={() => toggleCategory(ci)}
              style={{ 
                fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', 
                marginBottom: isCollapsed ? 0 : '0.5rem', opacity: 0.7, cursor: 'pointer',
                background: 'none', border: 'none', padding: '0.25rem 0', width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left'
              }}
              data-testid={`tool-category-${ci}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowRight size={12} style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                {category.title} ({searchFilter ? `${filteredTools.length}/` : ''}{category.tools.length})
              </span>
              {catChecked > 0 && (
                <span style={{ fontSize: '0.7rem', fontWeight: 400, display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#22c55e' }}>{catHealthy} ok</span>
                  {catErrors > 0 && <span style={{ color: '#ef4444' }}>{catErrors} err</span>}
                </span>
              )}
            </button>
            {!isCollapsed && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
              {filteredTools.map((tool) => {
                const ToolIcon = tool.icon;
                const result = toolResults[tool.id];
                const isRunning = runningTools[tool.id];
                return (
                  <div 
                    key={tool.id} 
                    className={styles.navCard}
                    style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}
                    data-testid={`tool-card-${tool.id}`}
                  >
                    <div className={styles.navCardIcon} style={{ flexShrink: 0 }}>
                      <ToolIcon size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className={styles.navCardLabel} style={{ fontSize: '0.82rem' }}>{tool.label}</span>
                      <span className={styles.navCardDesc} style={{ fontSize: '0.7rem' }}>{tool.desc}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                      {result && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title={`HTTP ${result.code} - ${result.label || ''} - ${result.ms}ms`}>
                          {result.status === 'healthy' ? (
                            <CheckCircle size={14} style={{ color: '#22c55e' }} />
                          ) : result.status === 'warning' ? (
                            <AlertTriangle size={14} style={{ color: '#eab308' }} />
                          ) : (
                            <AlertCircle size={14} style={{ color: '#ef4444' }} />
                          )}
                          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>
                            {result.label && result.label !== 'ok' ? result.label : ''}{result.ms != null ? ` ${result.ms}ms` : ''}
                          </span>
                        </span>
                      )}
                      <button
                        onClick={() => runHealthCheck(tool)}
                        disabled={isRunning}
                        style={{ 
                          background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px',
                          padding: '2px 6px', cursor: isRunning ? 'wait' : 'pointer', fontSize: '0.7rem',
                          opacity: isRunning ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '2px'
                        }}
                        data-testid={`button-check-${tool.id}`}
                        title={`Check ${tool.label} status`}
                      >
                        {isRunning ? (
                          <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <CheckSquare size={10} />
                        )}
                        Check
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
