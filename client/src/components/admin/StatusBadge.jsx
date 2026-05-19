import { CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import styles from "../../pages/admin/CommandCenter.module.css";

export default function StatusBadge({ status }) {
  const safeStatus = typeof status === 'string' ? status : 'healthy';
  const statusStyles = {
    healthy: styles.statusHealthy,
    warning: styles.statusWarning,
    error: styles.statusError,
    unknown: styles.statusWarning
  };
  const icons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    unknown: Clock
  };
  const Icon = icons[safeStatus] || CheckCircle;
  
  return (
    <span className={`${styles.statusBadge} ${statusStyles[safeStatus] || styles.statusHealthy}`}>
      <Icon className={styles.statusIcon} />
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}
