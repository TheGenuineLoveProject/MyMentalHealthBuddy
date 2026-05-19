import { Activity, RefreshCw, Server, Database, Lock, MessageSquare, HardDrive } from 'lucide-react';
import StatusBadge from "@/components/admin/StatusBadge";
import styles from "../../pages/admin/CommandCenter.module.css";

export default function SystemHealthPanel({ health, onRefresh, isRefreshing }) {
  const dbStatus = health?.database?.connected ? 'healthy' : (health?.database ? 'warning' : 'unknown');
  const aiStatus = health?.ai?.available ? 'healthy' : (health?.ai ? 'warning' : 'unknown');
  const apiStatus = health?.status === 'healthy' ? 'healthy' : (health ? 'warning' : 'error');
  const uptimeStr = health?.uptimeFormatted || (health?.uptime ? `${Math.floor(health.uptime / 60)}m` : '—');
  const memMB = health?.memory?.heapUsedMB ? `${health.memory.heapUsedMB}MB` : '—';
  const memPercent = health?.memory?.heapUsedMB && health?.memory?.heapTotalMB ? Math.round((health.memory.heapUsedMB / health.memory.heapTotalMB) * 100) : 0;

  const services = [
    { name: 'API Server', status: apiStatus, icon: Server, latency: uptimeStr },
    { name: 'Database', status: dbStatus, icon: Database, latency: health?.database?.connected ? 'connected' : 'offline' },
    { name: 'Auth Service', status: health?.softLaunch !== undefined ? 'healthy' : 'unknown', icon: Lock, latency: 'active' },
    { name: 'AI/Chat', status: aiStatus, icon: MessageSquare, latency: health?.ai?.available ? 'ready' : 'offline' },
    { name: 'Memory', status: health?.memory?.heapUsedMB < 500 ? 'healthy' : 'warning', icon: HardDrive, latency: `${memMB} (${memPercent}%)` }
  ];

  const integrations = health?.services ? [
    { name: 'Stripe', active: health.services.stripe },
    { name: 'Resend', active: health.services.resend },
    { name: 'Perplexity', active: health.services.perplexity },
    { name: 'Sentry', active: health.services.sentry },
  ] : [];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Activity className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>System Health</h2>
        </div>
        <button 
          className={styles.refreshButton}
          onClick={onRefresh}
          disabled={isRefreshing}
          data-testid="button-refresh-health"
        >
          <RefreshCw className={`${styles.refreshIcon} ${isRefreshing ? styles.refreshIconSpinning : ''}`} />
        </button>
      </div>
      <div className={styles.servicesList}>
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <div key={i} className={styles.serviceRow} data-testid={`service-${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={styles.serviceInfo}>
                <Icon className={styles.serviceIcon} />
                <span className={styles.serviceName}>{service.name}</span>
              </div>
              <div className={styles.serviceStatus}>
                <span className={styles.serviceLatency}>{service.latency}</span>
                <StatusBadge status={service.status} />
              </div>
            </div>
          );
        })}
      </div>
      {health?.platform && (
        <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }} data-testid="panel-platform-stats">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.72rem', color: '#666' }}>
            <span data-testid="text-tool-count">{health.platform.totalTools} Tools</span>
            <span data-testid="text-route-count">{health.platform.totalRoutes} Routes</span>
            <span data-testid="text-admin-page-count">{health.platform.adminPages} Admin Pages</span>
            {health.node && <span>Node {health.node}</span>}
            {health.startedAt && <span>Started: {new Date(health.startedAt).toLocaleTimeString()}</span>}
          </div>
        </div>
      )}
      {integrations.length > 0 && (
        <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }} data-testid="panel-integrations">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.72rem' }}>
            {integrations.map(int => (
              <span key={int.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: int.active ? '#22c55e' : '#d1d5db', flexShrink: 0 }} />
                <span style={{ color: int.active ? '#333' : '#999' }}>{int.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
