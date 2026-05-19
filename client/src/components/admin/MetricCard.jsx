import styles from "../../pages/admin/CommandCenter.module.css";

export default function MetricCard({ title, value, subtitle, icon: Icon, color = "sage" }) {
  const iconClass = {
    sage: styles.metricIconSage,
    gold: styles.metricIconGold,
    blush: styles.metricIconBlush,
    teal: styles.metricIconTeal
  }[color] || styles.metricIconSage;
  
  return (
    <div className={styles.metricCard} data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={styles.metricHeader}>
        <div className={`${styles.metricIconContainer} ${iconClass}`}>
          <Icon className={styles.metricIcon} />
        </div>
      </div>
      <p className={styles.metricValue} data-testid={`metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
      <p className={styles.metricLabel} data-testid={`metric-label-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</p>
      {subtitle && <p className={styles.metricSubtitle} data-testid={`metric-subtitle-${title.toLowerCase().replace(/\s+/g, '-')}`}>{subtitle}</p>}
    </div>
  );
}
