import { useQuery } from "@tanstack/react-query";
import { Brain } from 'lucide-react';
import StatusBadge from "@/components/admin/StatusBadge";
import styles from "../../pages/admin/CommandCenter.module.css";

export default function KernelStatusPanel() {
  const { data: kernelVersion } = useQuery({
    queryKey: ['/api/kernel/version'],
    retry: 1,
    staleTime: 60000,
  });

  if (!kernelVersion) return null;

  return (
    <div className={styles.card} data-testid="panel-kernel-status">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Brain className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Prompt-OS Kernel</h2>
        </div>
        <StatusBadge status="healthy" />
      </div>
      <div style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#555' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <span data-testid="text-kernel-version"><strong>v{kernelVersion.version}</strong> {kernelVersion.codename}</span>
          <span data-testid="text-kernel-domains">{kernelVersion.domains} Domains</span>
          <span data-testid="text-kernel-states">{kernelVersion.executionStates} States</span>
          <span data-testid="text-kernel-gates">{kernelVersion.qualityGates} Gates</span>
          <span data-testid="text-kernel-failures">{kernelVersion.failureTypes} Failure Types</span>
        </div>
      </div>
    </div>
  );
}
