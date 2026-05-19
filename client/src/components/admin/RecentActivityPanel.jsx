import { PenTool, Eye, CheckCircle, Megaphone, BookOpen, FileText, Clock } from 'lucide-react';

export default function RecentActivityPanel({ activities, formatEventType, timeAgo, styles }) {
  const activityIcons = {
    social_post_created: PenTool,
    social_post_submitted: Eye,
    social_post_approved: CheckCircle,
    social_post_posted: Megaphone,
    blog_published: BookOpen,
    blog_approved: CheckCircle,
    blog_submitted: FileText,
  };

  if (!activities || activities.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleContainer}>
            <Clock className={styles.cardHeaderIcon} />
            <h2 className={styles.cardTitle}>Recent Activity</h2>
          </div>
        </div>
        <p style={{ padding: '1rem', color: '#888', fontSize: '0.9rem' }} data-testid="text-no-activity">
          No recent publishing activity. Create a blog post or social post to get started.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Clock className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Recent Activity</h2>
        </div>
      </div>
      <div className={styles.activityList}>
        {activities.map((item, i) => {
          const Icon = activityIcons[item.type] || FileText;
          return (
            <div key={i} className={styles.activityRow} data-testid={`activity-item-${i}`}>
              <div className={styles.activityIcon}>
                <Icon className={styles.activityIconInner} />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityTitle}>{formatEventType(item.type)}</span>
                {item.meta?.postId && (
                  <span className={styles.activitySubtitle}>Post: {item.meta.postId.slice(0, 8)}...</span>
                )}
              </div>
              <span className={styles.activityTime} data-testid={`activity-time-${i}`}>
                {timeAgo(item.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
