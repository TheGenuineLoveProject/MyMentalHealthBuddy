import { Link } from "wouter";
import { LayoutDashboard, Globe, Wand2, BookOpen, Calendar, Palette, Layers, PenTool, BarChart3, LineChart, Heart, DollarSign, CreditCard, Activity, Settings, Shield, Mail, Users, ShieldCheck, ToggleLeft, ClipboardList, MessageSquare, AlertTriangle, UserCheck, Zap, ArrowRight } from 'lucide-react';
import styles from "../../pages/admin/CommandCenter.module.css";

export default function AdminNavGrid() {
  const sections = [
    {
      title: "Publishing & Content (10)",
      items: [
        { label: "Narrative Ops Console", icon: LayoutDashboard, href: "/admin/social/ops", desc: "Pipeline, campaigns, UTM, scheduling" },
        { label: "Social Dashboard", icon: Globe, href: "/admin/social", desc: "Social posts overview & management" },
        { label: "Social Generator", icon: Wand2, href: "/admin/social/generate", desc: "AI-powered content generation" },
        { label: "Blog Publishing", icon: BookOpen, href: "/admin/publishing", desc: "Editorial discipline pipeline" },
        { label: "Publishing Today", icon: Calendar, href: "/admin/publishing/today", desc: "Today's publishing queue" },
        { label: "Social Studio", icon: Palette, href: "/admin/social-studio", desc: "Multi-platform content tools" },
        { label: "Content Tiers", icon: Layers, href: "/admin/content-studio", desc: "Content tier management" },
        { label: "Social Library", icon: Layers, href: "/admin/social/library", desc: "Approved content library" },
        { label: "Social Calendar", icon: Calendar, href: "/admin/social/calendar", desc: "Visual schedule view" },
        { label: "Narrative Drafts", icon: PenTool, href: "/admin/narrative", desc: "Draft review & approval" },
      ]
    },
    {
      title: "Analytics & Revenue (8)",
      items: [
        { label: "Analytics Dashboard", icon: BarChart3, href: "/admin/analytics", desc: "Platform analytics & metrics" },
        { label: "Social Analytics", icon: LineChart, href: "/admin/social/analytics", desc: "Social performance data" },
        { label: "Engagement Dashboard", icon: Heart, href: "/admin/engagement", desc: "User engagement metrics" },
        { label: "Revenue Dashboard", icon: DollarSign, href: "/admin/revenue", desc: "Revenue & MRR tracking" },
        { label: "Billing Manager", icon: CreditCard, href: "/admin/billing", desc: "Subscription & payment management" },
        { label: "System Health", icon: Activity, href: "/admin/health", desc: "Server, DB & service status" },
        { label: "Content Admin", icon: Settings, href: "/content-admin", desc: "Content management tools" },
        { label: "Command Center", icon: Shield, href: "/admin", desc: "Platform control center" },
      ]
    },
    {
      title: "Management & Security (9)",
      items: [
        { label: "Newsletter Admin", icon: Mail, href: "/admin/newsletter", desc: "Subscriber & send management" },
        { label: "Roles & Permissions", icon: Users, href: "/admin/roles", desc: "User access control" },
        { label: "Security Dashboard", icon: ShieldCheck, href: "/admin/security", desc: "Security & rate limit monitoring" },
        { label: "Feature Flags", icon: ToggleLeft, href: "/admin/feature-flags", desc: "Feature toggles & rollout" },
        { label: "Audit Log Explorer", icon: ClipboardList, href: "/admin/audit-log", desc: "System audit trail & events" },
        { label: "Feedback Aggregator", icon: MessageSquare, href: "/admin/feedback", desc: "User feedback & suggestions" },
        { label: "System Alerts", icon: AlertTriangle, href: "/admin/alerts", desc: "Alert configuration & resolution" },
        { label: "Admin Users", icon: UserCheck, href: "/admin/users", desc: "Admin user management" },
        { label: "Platform Tools", icon: Zap, href: "/admin/tools", desc: "127 tools · AI repair · optimization advisor" },
      ]
    },
  ];

  return (
    <div className={styles.navGridContainer}>
      {sections.map((section, si) => (
        <div key={si} className={styles.navSection}>
          <h3 className={styles.navSectionTitle} data-testid={`nav-section-${si}`}>{section.title}</h3>
          <div className={styles.navGrid}>
            {section.items.map((item, ii) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={ii} 
                  href={item.href} 
                  className={styles.navCard}
                  data-testid={`admin-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={styles.navCardIcon}>
                    <Icon size={18} />
                  </div>
                  <div className={styles.navCardContent}>
                    <span className={styles.navCardLabel}>{item.label}</span>
                    <span className={styles.navCardDesc}>{item.desc}</span>
                  </div>
                  <ArrowRight size={14} className={styles.navCardArrow} />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
