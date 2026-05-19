import { useState } from "react";
import { Link } from "wouter";
import { Activity, PenTool, BarChart3, Calendar, Megaphone, MessageSquare, ClipboardList, Mail, DollarSign, AlertTriangle, ShieldCheck, Palette, Heart, TrendingUp, CheckSquare, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import styles from "../../pages/admin/CommandCenter.module.css";

export default function DailyOpsChecklist() {
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('glp_daily_ops_checklist');
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today) return parsed.items;
      }
    } catch {}
    return null;
  });

  const [taskTimestamps, setTaskTimestamps] = useState(() => {
    try {
      const saved = localStorage.getItem('glp_daily_ops_timestamps');
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today) return parsed.stamps;
      }
    } catch {}
    return {};
  });

  const dailyTasks = [
    { id: 'health-check', label: 'Run Platform Health Check', desc: 'Verify all 123 tools are operational', icon: Activity, href: '/admin/tools', category: 'monitoring', priority: 'high' },
    { id: 'review-drafts', label: 'Review Pending Drafts', desc: 'Check narrative and social drafts for approval', icon: PenTool, href: '/admin/narrative', category: 'content', priority: 'high' },
    { id: 'check-analytics', label: 'Check Analytics', desc: 'Review daily engagement and traffic metrics', icon: BarChart3, href: '/admin/analytics', category: 'analytics', priority: 'medium' },
    { id: 'publishing-queue', label: 'Review Publishing Queue', desc: 'Check today\'s scheduled content', icon: Calendar, href: '/admin/publishing/today', category: 'content', priority: 'high' },
    { id: 'social-posts', label: 'Review Social Posts', desc: 'Approve or schedule social content', icon: Megaphone, href: '/admin/social', category: 'content', priority: 'medium' },
    { id: 'check-feedback', label: 'Check User Feedback', desc: 'Review new feedback submissions', icon: MessageSquare, href: '/admin/feedback', category: 'engagement', priority: 'medium' },
    { id: 'audit-log', label: 'Review Audit Logs', desc: 'Check security events and access logs', icon: ClipboardList, href: '/admin/audit-log', category: 'security', priority: 'low' },
    { id: 'newsletter-check', label: 'Newsletter Status', desc: 'Check subscriber growth and pending sends', icon: Mail, href: '/admin/newsletter', category: 'engagement', priority: 'medium' },
    { id: 'billing-review', label: 'Review Billing', desc: 'Check revenue, subscriptions, and payments', icon: DollarSign, href: '/admin/billing', category: 'revenue', priority: 'low' },
    { id: 'system-alerts', label: 'Resolve System Alerts', desc: 'Address any unresolved system notifications', icon: AlertTriangle, href: '/admin/alerts', category: 'monitoring', priority: 'high' },
    { id: 'security-review', label: 'Security Dashboard', desc: 'Check for vulnerabilities and rate limit violations', icon: ShieldCheck, href: '/admin/security', category: 'security', priority: 'high' },
    { id: 'content-studio', label: 'Content Studio Review', desc: 'Check content tier management and studio tools', icon: Palette, href: '/admin/content-studio', category: 'content', priority: 'low' },
    { id: 'engagement-review', label: 'Engagement Metrics', desc: 'Review user engagement trends and patterns', icon: Heart, href: '/admin/engagement', category: 'analytics', priority: 'medium' },
    { id: 'social-calendar', label: 'Social Calendar', desc: 'Check upcoming scheduled social posts', icon: Calendar, href: '/admin/social/calendar', category: 'content', priority: 'medium' },
    { id: 'revenue-check', label: 'Revenue Dashboard', desc: 'Review MRR, subscriptions, and financial health', icon: TrendingUp, href: '/admin/revenue', category: 'revenue', priority: 'low' },
  ];

  const getInitialState = () => dailyTasks.reduce((acc, t) => ({ ...acc, [t.id]: false }), {});

  const items = checklist || getInitialState();

  const saveChecklist = (updated) => {
    setChecklist(updated);
    try {
      localStorage.setItem('glp_daily_ops_checklist', JSON.stringify({ date: new Date().toDateString(), items: updated }));
    } catch {}
  };

  const saveTimestamps = (stamps) => {
    setTaskTimestamps(stamps);
    try {
      localStorage.setItem('glp_daily_ops_timestamps', JSON.stringify({ date: new Date().toDateString(), stamps }));
    } catch {}
  };

  const toggleItem = (id) => {
    const updated = { ...items, [id]: !items[id] };
    saveChecklist(updated);
    if (!items[id]) {
      saveTimestamps({ ...taskTimestamps, [id]: new Date().toLocaleTimeString() });
    }
  };

  const resetChecklist = () => {
    saveChecklist(getInitialState());
    saveTimestamps({});
  };

  const exportReport = () => {
    const now = new Date();
    const lines = [
      `Daily Operations Report - ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Generated: ${now.toLocaleTimeString()}`,
      `Progress: ${completedCount}/${totalCount} tasks (${progressPercent}%)`,
      '',
      '--- Task Status ---',
      ...dailyTasks.map(t => {
        const done = items[t.id];
        const stamp = taskTimestamps[t.id];
        return `[${done ? 'x' : ' '}] ${t.label} ${stamp ? `(completed ${stamp})` : ''} - ${t.desc}`;
      }),
      '',
      `--- Summary ---`,
      `High Priority: ${dailyTasks.filter(t => t.priority === 'high').filter(t => items[t.id]).length}/${dailyTasks.filter(t => t.priority === 'high').length} complete`,
      `Medium Priority: ${dailyTasks.filter(t => t.priority === 'medium').filter(t => items[t.id]).length}/${dailyTasks.filter(t => t.priority === 'medium').length} complete`,
      `Low Priority: ${dailyTasks.filter(t => t.priority === 'low').filter(t => items[t.id]).length}/${dailyTasks.filter(t => t.priority === 'low').length} complete`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ops-report-${now.toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = Object.values(items).filter(Boolean).length;
  const totalCount = dailyTasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const highPriorityRemaining = dailyTasks.filter(t => t.priority === 'high' && !items[t.id]).length;

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <CheckSquare className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Daily Operations Checklist</h2>
          <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.5rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {highPriorityRemaining > 0 && (
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: '#fef3c7', color: '#92400e', fontWeight: 500 }} data-testid="badge-high-priority">
              {highPriorityRemaining} high priority
            </span>
          )}
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: completedCount === totalCount ? '#22c55e' : '#666' }} data-testid="text-ops-progress">
            {completedCount}/{totalCount}
          </span>
          <button
            onClick={exportReport}
            style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            data-testid="button-export-report"
            title="Download daily ops report"
          >
            <FileText size={10} /> Export
          </button>
          <button
            onClick={resetChecklist}
            style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }}
            data-testid="button-reset-checklist"
          >
            Reset
          </button>
        </div>
      </div>
      <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
        <div style={{ height: '4px', borderRadius: '2px', background: '#e5e7eb', overflow: 'hidden' }} data-testid="progress-bar-ops">
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: completedCount === totalCount ? '#22c55e' : '#3b82f6',
            transition: 'width 0.3s ease',
            borderRadius: '2px'
          }} />
        </div>
      </div>
      {completedCount === totalCount && totalCount > 0 && (
        <div style={{ padding: '0.5rem 1rem', marginBottom: '0.25rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center', fontSize: '0.82rem', color: '#16a34a', fontWeight: 500 }} data-testid="text-all-complete">
            All daily operations complete. Great work!
          </div>
        </div>
      )}
      <div style={{ padding: '0.5rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.5rem' }}>
        {dailyTasks.map((task) => {
          const TaskIcon = task.icon;
          const isChecked = items[task.id];
          const stamp = taskTimestamps[task.id];
          const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };
          const inner = (
            <div 
              className={styles.navCard}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem',
                opacity: isChecked ? 0.55 : 1, transition: 'opacity 0.2s ease',
                textDecoration: 'none', cursor: 'pointer',
                borderLeft: `3px solid ${priorityColors[task.priority] || '#6b7280'}`
              }}
              data-testid={`ops-task-${task.id}`}
            >
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(task.id); }}
                style={{ 
                  width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0,
                  border: isChecked ? '2px solid #22c55e' : '2px solid rgba(0,0,0,0.2)',
                  background: isChecked ? '#22c55e' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0
                }}
                data-testid={`checkbox-${task.id}`}
              >
                {isChecked && <CheckCircle size={14} style={{ color: '#fff' }} />}
              </button>
              <div className={styles.navCardIcon} style={{ flexShrink: 0 }}>
                <TaskIcon size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className={styles.navCardLabel} style={{ fontSize: '0.82rem', textDecoration: isChecked ? 'line-through' : 'none' }}>{task.label}</span>
                <span className={styles.navCardDesc} style={{ fontSize: '0.68rem' }}>
                  {task.desc}
                  {stamp && <span style={{ marginLeft: '4px', color: '#22c55e', fontStyle: 'italic' }}>{stamp}</span>}
                </span>
              </div>
              {task.href && (
                <ArrowRight size={12} style={{ opacity: 0.3, flexShrink: 0 }} />
              )}
            </div>
          );

          if (task.href) {
            return <Link key={task.id} href={task.href} style={{ textDecoration: 'none' }}>{inner}</Link>;
          }
          return <div key={task.id}>{inner}</div>;
        })}
      </div>
    </div>
  );
}
