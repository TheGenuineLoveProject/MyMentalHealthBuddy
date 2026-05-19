import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from 'lucide-react';
import styles from "../../pages/admin/CommandCenter.module.css";

export default function SystemTelemetryPanel() {
  const { data: telemetry } = useQuery({
    queryKey: ['/api/system'],
    retry: 1,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  if (!telemetry) return null;

  return (
    <div className={styles.card} data-testid="panel-system-telemetry">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <BarChart3 className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>System Telemetry</h2>
        </div>
      </div>
      <div style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#555' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
          <div data-testid="text-total-requests">
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f5d5d' }}>{telemetry.totalRequests?.toLocaleString() || 0}</div>
            <div>Total Requests</div>
          </div>
          <div data-testid="text-5xx-rate">
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: telemetry.errors5xx > 0 ? '#ef4444' : '#22c55e' }}>{telemetry.errorRate5xx}</div>
            <div>5xx Error Rate</div>
          </div>
          <div data-testid="text-4xx-rate">
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b' }}>{telemetry.errorRate4xx}</div>
            <div>4xx Client Errors</div>
          </div>
          <div data-testid="text-memory-rss">
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2f5d5d' }}>{telemetry.memory?.rssMB || '—'}MB</div>
            <div>RSS Memory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
