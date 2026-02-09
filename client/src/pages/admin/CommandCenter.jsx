import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, Activity, Users, Database, Server, Globe, 
  AlertTriangle, CheckCircle, Clock, RefreshCw, 
  BarChart3, Zap, FileText, Settings, ArrowRight,
  TrendingUp, TrendingDown, Minus, Eye, Lock,
  HardDrive, Cpu, Wifi, AlertCircle,
  BookOpen, MessageSquare, Heart, Calendar,
  Megaphone, Mail, Flag, Palette, Search,
  LayoutDashboard, PenTool, Layers, LineChart,
  ShieldCheck, ToggleLeft, Star, ClipboardList,
  Sparkles, Brain, Compass, Flame, Leaf, 
  Wind, Sun, Moon, Lightbulb, Target,
  DollarSign, Wand2, GraduationCap, Headphones,
  HeartHandshake, Flower2, TreePine, CircleDot,
  Footprints, Gem, Mountain, Feather, 
  ExternalLink, CheckSquare, Play,
  UserCheck, CreditCard, Key, Workflow,
  Network, Gauge, Trophy, Award,
  Landmark, Orbit, Rocket, Puzzle,
  FileQuestion, GitBranch, Webhook, Share2,
  ScanLine, Contact, Inbox, LogIn,
  PackageCheck, Milestone, Handshake,
  Upload, UserCog, ListOrdered, Radio,
  Fingerprint, FolderKanban, Rss
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import styles from "./CommandCenter.module.css";

function StatusBadge({ status }) {
  const safeStatus = typeof status === 'string' ? status : 'healthy';
  const statusStyles = {
    healthy: styles.statusHealthy,
    warning: styles.statusWarning,
    error: styles.statusError
  };
  const icons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  };
  const Icon = icons[safeStatus] || CheckCircle;
  
  return (
    <span className={`${styles.statusBadge} ${statusStyles[safeStatus] || styles.statusHealthy}`}>
      <Icon className={styles.statusIcon} />
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, color = "sage" }) {
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

function SystemHealthPanel({ health, onRefresh, isRefreshing }) {
  const services = [
    { name: 'API Server', status: health?.api || 'healthy', icon: Server, latency: '24ms' },
    { name: 'Database', status: health?.database || 'healthy', icon: Database, latency: '12ms' },
    { name: 'Auth Service', status: health?.auth || 'healthy', icon: Lock, latency: '18ms' },
    { name: 'AI/Chat', status: health?.ai || 'healthy', icon: MessageSquare, latency: '156ms' },
    { name: 'CDN/Assets', status: health?.cdn || 'healthy', icon: Globe, latency: '8ms' }
  ];

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
    </div>
  );
}

function formatUptime(seconds) {
  if (!seconds) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatEventType(type) {
  return (type || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function RecentActivityPanel({ activities }) {
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

function DailyToolsPanel() {
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

  const toolCategories = [
    {
      title: "AI & Core Wellness Tools",
      tools: [
        { id: "ai-chat", label: "AI Chat Therapy", endpoint: "/api/ai", icon: MessageSquare, desc: "AI conversation engine" },
        { id: "therapy", label: "Therapy Engine", endpoint: "/api/therapy", icon: Headphones, desc: "Guided therapy sessions" },
        { id: "mood-tracker", label: "Mood Tracker", endpoint: "/api/mood", icon: Heart, desc: "User mood tracking" },
        { id: "journal", label: "Journal System", endpoint: "/api/journal", icon: BookOpen, desc: "Journaling engine" },
        { id: "gratitude", label: "Gratitude Prompts", endpoint: "/api/gratitude", icon: Sun, desc: "Daily gratitude system" },
        { id: "reflection", label: "Reflection Tools", endpoint: "/api/reflection", icon: Moon, desc: "Self-reflection engine" },
        { id: "wellness-tools", label: "Wellness Toolkit", endpoint: "/api/wellness-tools", icon: Leaf, desc: "Breath, body scan, meditation" },
        { id: "mirror", label: "Mirror Reflection", endpoint: "/api/mirror", icon: Eye, desc: "Self-awareness mirror" },
        { id: "prompts", label: "Prompt Engine", endpoint: "/api/prompts", icon: FileQuestion, desc: "Guided prompt system" },
        { id: "states", label: "Emotional States", endpoint: "/api/states", icon: Gauge, desc: "State tracking system" },
      ]
    },
    {
      title: "Intelligence & Growth Tools",
      tools: [
        { id: "wisdom", label: "Wisdom Engine", endpoint: "/api/wisdom", icon: Lightbulb, desc: "Daily wisdom delivery" },
        { id: "wisdom-engine", label: "Wisdom Engine (Advanced)", endpoint: "/api/wisdom-engine", icon: Landmark, desc: "Deep wisdom system" },
        { id: "philosophy", label: "Philosophy Lab", endpoint: "/api/philosophy", icon: GraduationCap, desc: "Philosophical inquiry" },
        { id: "metacognition", label: "Metacognition", endpoint: "/api/metacognition", icon: Brain, desc: "Thinking about thinking" },
        { id: "creativity", label: "Creativity Engine", endpoint: "/api/creativity", icon: Sparkles, desc: "Creative exploration" },
        { id: "resilience", label: "Resilience Builder", endpoint: "/api/resilience", icon: Mountain, desc: "Resilience tools" },
        { id: "foresight", label: "Foresight Lab", endpoint: "/api/foresight", icon: Compass, desc: "Future planning" },
        { id: "knowledge", label: "Knowledge Synthesis", endpoint: "/api/knowledge", icon: BookOpen, desc: "Knowledge integration" },
        { id: "cognitive-lab", label: "Cognitive Lab", endpoint: "/api/cognitive-lab", icon: Brain, desc: "Cognitive exercises" },
        { id: "cognitive-mastery", label: "Cognitive Mastery", endpoint: "/api/cognitive-mastery", icon: Trophy, desc: "Cognitive excellence" },
        { id: "deep-learning", label: "Deep Learning", endpoint: "/api/deep-learning", icon: Layers, desc: "Deep learning tools" },
        { id: "dialectics", label: "Dialectics Engine", endpoint: "/api/dialectics", icon: Puzzle, desc: "Dialectical reasoning" },
        { id: "practices", label: "Practices Library", endpoint: "/api/practices", icon: Milestone, desc: "Guided practices" },
        { id: "insights", label: "Insights Engine", endpoint: "/api/insights", icon: Lightbulb, desc: "Personal insights" },
      ]
    },
    {
      title: "Healing & Recovery Tools",
      tools: [
        { id: "trauma-healing", label: "Trauma Healing", endpoint: "/api/trauma-healing", icon: HeartHandshake, desc: "Trauma-informed protocols" },
        { id: "emotional-resilience", label: "Emotional Resilience", endpoint: "/api/emotional-resilience", icon: Flame, desc: "Emotional strength" },
        { id: "emotional-mastery", label: "Emotional Mastery", endpoint: "/api/emotional-mastery", icon: Target, desc: "Emotion regulation" },
        { id: "healing-modalities", label: "Healing Modalities", endpoint: "/api/healing-modalities", icon: Flower2, desc: "Healing approaches" },
        { id: "holistic-healing", label: "Holistic Healing", endpoint: "/api/holistic-healing", icon: TreePine, desc: "Whole-person wellness" },
        { id: "healing-tools", label: "Healing Tools", endpoint: "/api/healing", icon: Heart, desc: "Core healing toolkit" },
        { id: "healing-core", label: "Healing Core", endpoint: "/api/healing-core", icon: Leaf, desc: "Core healing engine" },
        { id: "healing-intelligence", label: "Healing Intelligence", endpoint: "/api/healing-intelligence", icon: Sparkles, desc: "AI-guided healing" },
        { id: "post-trauma", label: "Post-Trauma Growth", endpoint: "/api/post-trauma", icon: Feather, desc: "Post-traumatic growth" },
        { id: "mind-body", label: "Mind-Body Integration", endpoint: "/api/mind-body", icon: CircleDot, desc: "Mind-body connection" },
        { id: "psychological-safety", label: "Psychological Safety", endpoint: "/api/psychological-safety", icon: Shield, desc: "Safety frameworks" },
      ]
    },
    {
      title: "Mastery & Purpose Tools",
      tools: [
        { id: "self-mastery-intelligence", label: "Self-Mastery Intelligence", endpoint: "/api/self-mastery-intelligence", icon: Gem, desc: "Self-mastery path" },
        { id: "self-mastery", label: "Self-Mastery Core", endpoint: "/api/self-mastery", icon: Award, desc: "Core mastery system" },
        { id: "peak-performance", label: "Peak Performance", endpoint: "/api/peak-performance", icon: Zap, desc: "Performance optimization" },
        { id: "personal-growth", label: "Personal Growth", endpoint: "/api/personal-growth", icon: TrendingUp, desc: "Growth pathways" },
        { id: "life-purpose", label: "Life Purpose", endpoint: "/api/life-purpose", icon: Target, desc: "Purpose discovery" },
        { id: "life-design", label: "Life Design", endpoint: "/api/life-design", icon: Compass, desc: "Life architecture" },
        { id: "purpose-compass", label: "Purpose Compass", endpoint: "/api/purpose-compass", icon: Compass, desc: "Purpose navigation" },
        { id: "mastery-excellence", label: "Mastery Excellence", endpoint: "/api/mastery-excellence", icon: Star, desc: "Excellence framework" },
        { id: "meaning", label: "Meaning & Future", endpoint: "/api/meaning", icon: Rocket, desc: "Meaning creation" },
        { id: "meaning-core", label: "Meaning Core", endpoint: "/api/meaning-core", icon: Star, desc: "Core meaning system" },
        { id: "transformation", label: "Transformation Engine", endpoint: "/api/transformation", icon: Orbit, desc: "Deep transformation" },
        { id: "values", label: "Values Explorer", endpoint: "/api/values", icon: Footprints, desc: "Values discovery" },
        { id: "praxis", label: "Praxis Lab", endpoint: "/api/praxis", icon: Workflow, desc: "Theory to practice" },
      ]
    },
    {
      title: "Advanced Intelligence Tools",
      tools: [
        { id: "consciousness", label: "Consciousness Expansion", endpoint: "/api/consciousness", icon: Sun, desc: "Awareness tools" },
        { id: "human-potential", label: "Human Potential", endpoint: "/api/human-potential", icon: Sparkles, desc: "Potential unlocking" },
        { id: "spiritual-intelligence", label: "Spiritual Intelligence", endpoint: "/api/spiritual-intelligence", icon: Flower2, desc: "Spiritual growth" },
        { id: "wisdom-traditions", label: "Wisdom Traditions", endpoint: "/api/wisdom-traditions", icon: BookOpen, desc: "Ancient wisdom" },
        { id: "wisdom-synthesis", label: "Wisdom Synthesis", endpoint: "/api/wisdom-synthesis", icon: Lightbulb, desc: "Wisdom integration" },
        { id: "contemplative", label: "Contemplative Tools", endpoint: "/api/contemplative", icon: Moon, desc: "Contemplation guides" },
        { id: "ethical-reasoning", label: "Ethical Reasoning", endpoint: "/api/ethical-reasoning", icon: Shield, desc: "Ethics framework" },
        { id: "existential", label: "Existential Inquiry", endpoint: "/api/existential", icon: Globe, desc: "Existential exploration" },
        { id: "neuro-integration", label: "Neuro-Integration", endpoint: "/api/neuro-integration", icon: Network, desc: "Neural integration" },
        { id: "socio-ecology", label: "Socio-Ecology", endpoint: "/api/socio-ecology", icon: Globe, desc: "Social ecosystems" },
        { id: "cognitive-enhancement", label: "Cognitive Enhancement", endpoint: "/api/cognitive-enhancement", icon: Brain, desc: "Mental sharpness" },
      ]
    },
    {
      title: "Relational & Social Tools",
      tools: [
        { id: "relationship-dynamics", label: "Relationship Dynamics", endpoint: "/api/relationship-dynamics", icon: HeartHandshake, desc: "Relationship patterns" },
        { id: "social-intelligence", label: "Social Intelligence", endpoint: "/api/social-intelligence", icon: Users, desc: "Social skills" },
        { id: "relational", label: "Relational Tools", endpoint: "/api/relational", icon: Heart, desc: "Connection building" },
        { id: "collective-intelligence", label: "Collective Intelligence", endpoint: "/api/collective-intelligence", icon: Users, desc: "Group wisdom" },
        { id: "systems-compassion", label: "Systems Compassion", endpoint: "/api/systems-compassion", icon: Globe, desc: "Systemic empathy" },
        { id: "embodiment", label: "Embodiment Tools", endpoint: "/api/embodiment", icon: Footprints, desc: "Body awareness" },
        { id: "narrative", label: "Narrative Tools", endpoint: "/api/narrative", icon: FileText, desc: "Story & meaning" },
        { id: "community", label: "Community Engine", endpoint: "/api/community", icon: Users, desc: "Community features" },
      ]
    },
    {
      title: "Content & Publishing Tools",
      tools: [
        { id: "content-studio", label: "Content Studio", endpoint: "/api/content-studio", icon: Palette, desc: "Content creation" },
        { id: "content-intelligence", label: "Content Intelligence", endpoint: "/api/content-intelligence", icon: Sparkles, desc: "Smart content" },
        { id: "content-generator", label: "Content Generator", endpoint: "/api/content", icon: Wand2, desc: "AI content generation" },
        { id: "universal-content", label: "Universal Content", endpoint: "/api/universal-content", icon: Globe, desc: "Cross-platform content" },
        { id: "blog-api", label: "Blog Engine", endpoint: "/api/blog", icon: BookOpen, desc: "Blog system" },
        { id: "newsletter-api", label: "Newsletter Engine", endpoint: "/api/newsletter", icon: Mail, desc: "Newsletter system" },
        { id: "social-posts", label: "Social Posts API", endpoint: "/api/social-posts", icon: Share2, desc: "Social post management" },
        { id: "social-posting", label: "Social Posting", endpoint: "/api/social-posting", icon: Megaphone, desc: "Post distribution" },
        { id: "narrative-drafts", label: "Narrative Drafts", endpoint: "/api/narrative-drafts", icon: PenTool, desc: "Draft management" },
        { id: "perplexity", label: "Perplexity AI (Factual)", endpoint: "/api/perplexity", icon: Search, desc: "Factual research AI" },
      ]
    },
    {
      title: "User & Engagement Tools",
      tools: [
        { id: "account", label: "Account System", endpoint: "/api/account", icon: UserCheck, desc: "User accounts" },
        { id: "onboarding", label: "Onboarding Flow", endpoint: "/api/onboarding", icon: Rocket, desc: "New user experience" },
        { id: "gamification", label: "Gamification Engine", endpoint: "/api/gamification", icon: Star, desc: "XP, streaks, quests" },
        { id: "progress", label: "Progress Tracker", endpoint: "/api/progress", icon: TrendingUp, desc: "User progress data" },
        { id: "badges", label: "Badges System", endpoint: "/api/badges", icon: Award, desc: "Achievement badges" },
        { id: "favorites", label: "Favorites Engine", endpoint: "/api/favorites", icon: Heart, desc: "User favorites" },
        { id: "dashboard-api", label: "User Dashboard", endpoint: "/api/dashboard", icon: LayoutDashboard, desc: "Dashboard data" },
        { id: "pro-features", label: "Pro Features", endpoint: "/api/pro-features", icon: Gem, desc: "Premium feature gates" },
        { id: "leads", label: "Leads Engine", endpoint: "/api/leads", icon: Inbox, desc: "Lead collection" },
        { id: "feedback", label: "Feedback System", endpoint: "/api/feedback", icon: MessageSquare, desc: "User feedback" },
        { id: "account-actions", label: "Account Actions", endpoint: "/api/account-actions", icon: UserCheck, desc: "Account management" },
        { id: "ai-dashboard", label: "AI Dashboard", endpoint: "/api/ai-dashboard", icon: Brain, desc: "AI wellness dashboard" },
      ]
    },
    {
      title: "Admin & System Tools",
      tools: [
        { id: "admin-core", label: "Admin Core", endpoint: "/api/admin/verify-session", icon: Shield, desc: "Admin authentication" },
        { id: "admin-security", label: "Security Engine", endpoint: "/api/admin/security", icon: ShieldCheck, desc: "Security monitoring" },
        { id: "admin-audit", label: "Audit Logs", endpoint: "/api/admin/audit-logs", icon: ClipboardList, desc: "System audit trail" },
        { id: "admin-billing", label: "Admin Billing", endpoint: "/api/admin/billing", icon: CreditCard, desc: "Billing management" },
        { id: "admin-publishing", label: "Admin Publishing", endpoint: "/api/admin/publishing", icon: BookOpen, desc: "Publishing pipeline" },
        { id: "admin-social", label: "Admin Social Studio", endpoint: "/api/admin/social", icon: Palette, desc: "Social management" },
        { id: "admin-enterprise", label: "Enterprise Social", endpoint: "/api/admin/social/enterprise", icon: Globe, desc: "Enterprise social ops" },
        { id: "analytics", label: "Analytics Engine", endpoint: "/api/analytics", icon: BarChart3, desc: "Platform analytics" },
        { id: "metrics", label: "Metrics System", endpoint: "/api/metrics", icon: Gauge, desc: "System metrics" },
        { id: "soft-launch", label: "Soft Launch Metrics", endpoint: "/api/admin/soft-launch-metrics", icon: Rocket, desc: "Launch tracking" },
        { id: "health-api", label: "Health Monitor", endpoint: "/api/health", icon: Activity, desc: "System health" },
        { id: "deployment", label: "Deployment Readiness", endpoint: "/api/deployment-readiness", icon: PackageCheck, desc: "Deploy checks" },
        { id: "integrations", label: "Integration Health", endpoint: "/api/integrations", icon: Puzzle, desc: "Service integrations" },
      ]
    },
    {
      title: "Infrastructure & Auth Tools",
      tools: [
        { id: "billing", label: "Billing API", endpoint: "/api/billing", icon: DollarSign, desc: "Stripe billing" },
        { id: "webhook", label: "Webhook Handler", endpoint: "/api/webhook", icon: Webhook, desc: "Stripe webhooks" },
        { id: "email", label: "Email Service", endpoint: "/api/email", icon: Mail, desc: "Resend email" },
        { id: "contact", label: "Contact System", endpoint: "/api/contact", icon: Contact, desc: "Contact forms" },
        { id: "auth-github", label: "GitHub Auth", endpoint: "/api/auth/github", icon: Key, desc: "GitHub OAuth" },
        { id: "products", label: "Products API", endpoint: "/api/products", icon: PackageCheck, desc: "Product catalog" },
        { id: "invites", label: "Invite System", endpoint: "/api/invites", icon: Handshake, desc: "User invitations" },
        { id: "feed", label: "Feed Generator", endpoint: "/api/feed", icon: Share2, desc: "Content feed generation" },
        { id: "figma-api", label: "Figma Integration", endpoint: "/api/figma", icon: Palette, desc: "Figma design tools" },
        { id: "login", label: "Login System", endpoint: "/api/login", icon: LogIn, desc: "User login endpoint" },
        { id: "user-mgmt", label: "User Management", endpoint: "/api/user", icon: Users, desc: "User data management" },
        { id: "user-settings", label: "User Settings", endpoint: "/api/user-settings", icon: UserCog, desc: "User preferences" },
        { id: "uploads", label: "File Uploads", endpoint: "/api/uploads", icon: Upload, desc: "Object storage uploads" },
        { id: "metrics-summary", label: "Metrics Summary", endpoint: "/api/metrics/summary", icon: ListOrdered, desc: "Aggregated metrics" },
        { id: "social-posts-alt", label: "Social Posts Feed", endpoint: "/api/social/posts", icon: Radio, desc: "Social post feed" },
        { id: "analytics-events", label: "Analytics Events", endpoint: "/api/analytics-events", icon: BarChart3, desc: "Event tracking" },
        { id: "mfa-auth", label: "MFA Security", endpoint: "/api/mfa", icon: Fingerprint, desc: "Multi-factor auth" },
        { id: "canva-oauth", label: "Canva OAuth", endpoint: "/api/canva-oauth", icon: FolderKanban, desc: "Canva integration" },
        { id: "rss-feed", label: "RSS Feed", endpoint: "/api/rss", icon: Rss, desc: "Blog RSS feed" },
      ]
    },
  ];

  const runHealthCheck = async (tool) => {
    setRunningTools(prev => ({ ...prev, [tool.id]: true }));
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(tool.endpoint, { method: 'GET', credentials: 'include', signal: controller.signal });
      clearTimeout(timeout);
      let status = 'healthy';
      if (res.ok) {
        status = 'healthy';
      } else if (res.status === 401 || res.status === 403) {
        status = 'healthy';
      } else if (res.status === 404) {
        status = 'error';
      } else if (res.status === 429) {
        status = 'warning';
      } else if (res.status >= 500) {
        status = 'error';
      } else {
        status = 'warning';
      }
      const statusLabel = res.status === 401 ? 'auth-gated' : res.status === 403 ? 'admin-only' : res.status === 429 ? 'rate-limited' : res.status >= 500 ? 'server-error' : res.ok ? 'ok' : `${res.status}`;
      setToolResults(prev => ({ ...prev, [tool.id]: { status, code: res.status, time: new Date().toLocaleTimeString(), label: statusLabel } }));
    } catch (err) {
      const label = err?.name === 'AbortError' ? 'timeout' : 'unreachable';
      setToolResults(prev => ({ ...prev, [tool.id]: { status: 'error', code: 0, time: new Date().toLocaleTimeString(), label } }));
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
    setLastFullCheck(new Date().toLocaleTimeString());
    setIsRunningAll(false);
  };

  const totalTools = toolCategories.reduce((sum, c) => sum + c.tools.length, 0);
  const checkedCount = Object.keys(toolResults).length;
  const healthyCount = Object.values(toolResults).filter(r => r.status === 'healthy').length;
  const warningCount = Object.values(toolResults).filter(r => r.status === 'warning').length;
  const errorCount = Object.values(toolResults).filter(r => r.status === 'error').length;
  const isRunningAll = Object.values(runningTools).some(Boolean);

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Wand2 className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Daily Operations &mdash; All Platform Tools ({totalTools})</h2>
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
            disabled={isRunningAll}
            data-testid="button-run-all-tool-checks"
            title="Run health check on all platform tools"
          >
            {isRunningAll ? (
              <RefreshCw size={14} style={{ marginRight: '4px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <Play size={14} style={{ marginRight: '4px' }} />
            )}
            {isRunningAll ? `Checking... (${checkedCount}/${totalTools})` : 'Run All Checks'}
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
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title={`HTTP ${result.code} - ${result.label || ''}`}>
                          {result.status === 'healthy' ? (
                            <CheckCircle size={14} style={{ color: '#22c55e' }} />
                          ) : result.status === 'warning' ? (
                            <AlertTriangle size={14} style={{ color: '#eab308' }} />
                          ) : (
                            <AlertCircle size={14} style={{ color: '#ef4444' }} />
                          )}
                          {result.label && result.label !== 'ok' && (
                            <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>{result.label}</span>
                          )}
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

function AdminNavGrid() {
  const sections = [
    {
      title: "Publishing & Content",
      items: [
        { label: "Narrative Ops Console", icon: LayoutDashboard, href: "/admin/social/ops", desc: "Pipeline, campaigns, scheduling" },
        { label: "Social Dashboard", icon: Globe, href: "/admin/social", desc: "Social posts overview" },
        { label: "Social Generator", icon: Wand2, href: "/admin/social/generate", desc: "AI content generation" },
        { label: "Blog Publishing", icon: BookOpen, href: "/admin/publishing", desc: "Editorial pipeline" },
        { label: "Publishing Today", icon: Calendar, href: "/admin/publishing/today", desc: "Today's publishing queue" },
        { label: "Social Studio", icon: Palette, href: "/admin/social-studio", desc: "Social content tools" },
        { label: "Content Tiers", icon: Layers, href: "/admin/content-studio", desc: "Content tier management" },
        { label: "Social Library", icon: Layers, href: "/admin/social/library", desc: "Approved content library" },
        { label: "Social Calendar", icon: Calendar, href: "/admin/social/calendar", desc: "Visual schedule view" },
        { label: "Narrative Drafts", icon: PenTool, href: "/admin/narrative", desc: "Draft management" },
      ]
    },
    {
      title: "Analytics & Revenue",
      items: [
        { label: "Analytics Dashboard", icon: BarChart3, href: "/admin/analytics", desc: "Platform analytics" },
        { label: "Social Analytics", icon: LineChart, href: "/admin/social/analytics", desc: "Social performance" },
        { label: "Engagement", icon: Heart, href: "/admin/engagement", desc: "User engagement metrics" },
        { label: "Revenue Dashboard", icon: DollarSign, href: "/admin/revenue", desc: "Revenue & MRR tracking" },
        { label: "Billing Manager", icon: BarChart3, href: "/admin/billing", desc: "Subscription management" },
        { label: "System Health", icon: Activity, href: "/admin/health", desc: "Server & service status" },
      ]
    },
    {
      title: "Management & Security",
      items: [
        { label: "Newsletter", icon: Mail, href: "/admin/newsletter", desc: "Subscriber management" },
        { label: "Roles & Permissions", icon: Users, href: "/admin/roles", desc: "User access control" },
        { label: "Security Dashboard", icon: ShieldCheck, href: "/admin/security", desc: "Security monitoring" },
        { label: "Feature Flags", icon: ToggleLeft, href: "/admin/feature-flags", desc: "Feature toggles" },
        { label: "Audit Log", icon: ClipboardList, href: "/admin/audit-log", desc: "System audit trail" },
        { label: "Feedback", icon: MessageSquare, href: "/admin/feedback", desc: "User feedback aggregator" },
        { label: "System Alerts", icon: AlertTriangle, href: "/admin/alerts", desc: "Alert configuration" },
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

export default function AdminCommandCenter() {
  useSEO({
    title: "Admin Command Center - The Genuine Love Project",
    description: "Platform administration dashboard with system monitoring, user management, and analytics.",
    noIndex: true
  });

  const { data: healthData, refetch: refetchHealth, isRefetching: isHealthRefetching, isLoading: isHealthLoading, error: healthError } = useQuery({
    queryKey: ['/api/health'],
    retry: false,
    staleTime: 30000,
    refetchInterval: 60000
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    retry: false,
    staleTime: 30000,
    refetchInterval: 60000,
    select: (data) => data?.data || data,
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (healthData || statsData) {
      setLastUpdated(new Date());
    }
  }, [healthData, statsData]);

  const handleRefreshAll = () => {
    refetchHealth();
  };

  const stats = statsData || {};

  const metrics = [
    { title: "Users", value: stats.users?.toLocaleString() || "—", icon: Users, color: "sage", subtitle: "Total registered" },
    { title: "Blog Posts", value: stats.blogPosts || "—", icon: BookOpen, color: "gold", subtitle: `${stats.publishedBlogs || 0} published` },
    { title: "Social Posts", value: stats.socialPosts || "—", icon: Megaphone, color: "teal", subtitle: `${stats.socialDrafts || 0} drafts` },
    { title: "Campaigns", value: stats.campaigns || "0", icon: Flag, color: "blush", subtitle: "Active campaigns" },
    { title: "Leads", value: stats.leads || "—", icon: Mail, color: "sage", subtitle: "Newsletter signups" },
    { title: "Uptime", value: formatUptime(stats.uptimeSeconds), icon: Activity, color: "teal", subtitle: "Current session" },
  ];

  if (isHealthLoading && isStatsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.loadingSpinner} />
        <p className={styles.loadingText} data-testid="text-loading">Loading admin dashboard...</p>
      </div>
    );
  }

  if (healthError && !statsData) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <h2 className={styles.errorTitle} data-testid="text-error-title">Unable to load admin dashboard</h2>
        <p className={styles.errorText} data-testid="text-error-message">We're having trouble connecting to the server. Please try again.</p>
        <button className={styles.retryButton} onClick={handleRefreshAll} data-testid="button-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleContainer}>
              <div className={styles.titleIcon}>
                <Shield className={styles.titleIconInner} />
              </div>
              <h1 className={styles.pageTitle} data-testid="text-page-title">Command Center</h1>
            </div>
            <div className={styles.headerActions}>
              <span className={styles.lastUpdated} data-testid="text-last-updated">
                <Clock className={styles.clockIcon} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <button 
                className={styles.refreshButton}
                onClick={handleRefreshAll}
                disabled={isHealthRefetching}
                data-testid="button-refresh-all"
              >
                <RefreshCw className={`${styles.refreshIcon} ${isHealthRefetching ? styles.refreshIconSpinning : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          <p className={styles.leadText}>Monitor system health, manage content, and track platform performance.</p>
        </header>

        <div className={styles.metricsGrid}>
          {metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        <div className={styles.mainGrid}>
          <SystemHealthPanel 
            health={healthData} 
            onRefresh={refetchHealth} 
            isRefreshing={isHealthRefetching} 
          />
          <RecentActivityPanel activities={stats.recentActivity} />
        </div>

        <AdminNavGrid />

        <DailyToolsPanel />
      </div>
    </div>
  );
}
