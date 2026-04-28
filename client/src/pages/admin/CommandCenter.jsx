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
import SafetyFooter from "../../components/ui/SafetyFooter";
import SOPMonitorPanel from "@/components/admin/SOPMonitorPanel";
import OperationsPanel from "@/components/admin/OperationsPanel";
import ConsciousnessRegistryPanel from "@/components/admin/ConsciousnessRegistryPanel";
import styles from "./CommandCenter.module.css";

function StatusBadge({ status }) {
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

function KernelStatusPanel() {
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

function SystemTelemetryPanel() {
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
        { id: "canva-integration", label: "Canva AI", endpoint: "/api/canva-oauth", icon: Palette, desc: "Canva design integration" },
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
        { id: "content-api", label: "Content API", endpoint: "/api/content", icon: Wand2, desc: "Content management" },
        { id: "content-generator", label: "Content Generator", endpoint: "/api/content-generator", icon: FileText, desc: "Blog-to-social generation" },
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
        { id: "admin-core", label: "Admin Core", endpoint: "/api/admin", icon: Shield, desc: "Admin authentication" },
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
        { id: "rss-feed", label: "RSS Feed", endpoint: "/rss.xml", icon: Rss, desc: "Blog RSS feed" },
        { id: "auth-core", label: "Auth System", endpoint: "/api/auth/user", icon: Shield, desc: "Authentication service" },
      ]
    },
  ];

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

function DailyOpsChecklist() {
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

function AIKnowledgeHub() {
  const [aiStatuses, setAiStatuses] = useState({});
  const [checking, setChecking] = useState(false);

  const aiSystems = [
    { id: 'openai', label: 'OpenAI Chat Engine', desc: 'AI-powered wellness conversations with trauma-informed responses', endpoint: '/api/ai/history', icon: MessageSquare, color: '#10a37f', capability: 'Conversation AI, emotional guidance, crisis detection' },
    { id: 'perplexity', label: 'Perplexity AI (Factual)', desc: 'Evidence-based factual research for content validation', endpoint: '/api/perplexity', icon: Search, color: '#1da1f2', capability: 'Fact-checking, research synthesis, content validation' },
    { id: 'canva', label: 'Canva AI Design', desc: 'Visual content creation and brand-aligned design tools', endpoint: '/api/canva-oauth', icon: Palette, color: '#7d2ae8', capability: 'Brand templates, social graphics, visual identity' },
    { id: 'codex', label: 'Codex Knowledge Base', desc: 'Platform intelligence, self-repair diagnostics, and optimization engine', endpoint: '/api/integrations', icon: Brain, color: '#f59e0b', capability: 'Health diagnostics, route validation, remediation' },
  ];

  const knowledgeAreas = [
    { label: 'Wellness Tools', count: 10, href: '/admin/tools', icon: Heart, desc: 'Mood, journal, gratitude, reflection' },
    { label: 'Intelligence APIs', count: 14, href: '/admin/tools', icon: Brain, desc: 'Wisdom, cognitive, deep learning' },
    { label: 'Healing Protocols', count: 11, href: '/admin/tools', icon: Leaf, desc: 'Trauma, emotional, holistic' },
    { label: 'Mastery & Purpose', count: 13, href: '/admin/tools', icon: Target, desc: 'Self-mastery, performance, values' },
    { label: 'Content Pipeline', count: 12, href: '/admin/tools', icon: FileText, desc: 'Studio, blog, newsletter, social, feeds' },
    { label: 'Relational & Social', count: 8, href: '/admin/tools', icon: HeartHandshake, desc: 'Relationships, community, empathy' },
    { label: 'Advanced Intelligence', count: 11, href: '/admin/tools', icon: Sparkles, desc: 'Consciousness, spiritual, ethical' },
    { label: 'User & Engagement', count: 13, href: '/admin/tools', icon: Users, desc: 'Accounts, gamification, feedback' },
    { label: 'Admin Systems', count: 15, href: '/admin/tools', icon: Shield, desc: 'Security, audit, analytics, storage' },
    { label: 'Infrastructure', count: 20, href: '/admin/tools', icon: Server, desc: 'Auth, billing, email, webhooks' },
  ];

  const totalToolCount = knowledgeAreas.reduce((sum, a) => sum + a.count, 0);

  const checkAISystems = async () => {
    setChecking(true);
    const results = {};
    for (const sys of aiSystems) {
      try {
        const start = performance.now();
        const res = await fetch(sys.endpoint, { credentials: 'include' });
        const ms = Math.round(performance.now() - start);
        const ok = res.ok || res.status === 401 || res.status === 403 || res.status === 405;
        results[sys.id] = { status: ok ? 'active' : 'issue', ms, code: res.status };
      } catch {
        results[sys.id] = { status: 'offline', ms: 0, code: 0 };
      }
    }
    setAiStatuses(results);
    setChecking(false);
  };

  const activeCount = Object.values(aiStatuses).filter(s => s.status === 'active').length;
  const hasResults = Object.keys(aiStatuses).length > 0;

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Brain className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>AI Knowledge Hub</h2>
          {hasResults && (
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, background: activeCount === aiSystems.length ? '#dcfce7' : '#fef3c7', color: activeCount === aiSystems.length ? '#16a34a' : '#d97706' }}>
              {activeCount}/{aiSystems.length} AI systems active
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={checkAISystems} disabled={checking} style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} data-testid="button-check-ai-systems">
            <RefreshCw size={10} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking...' : 'Check AI'}
          </button>
          <Link href="/admin/tools" style={{ fontSize: '0.75rem', color: 'hsl(var(--primary))', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }} data-testid="link-ai-hub-tools">
            All {totalToolCount} Tools <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      <div style={{ padding: '0 1rem 0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {aiSystems.map(sys => {
            const st = aiStatuses[sys.id];
            const statusColor = st?.status === 'active' ? '#22c55e' : st?.status === 'issue' ? '#eab308' : st?.status === 'offline' ? '#ef4444' : '#94a3b8';
            return (
              <div key={sys.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '0.75rem', borderRadius: '10px',
                border: `1px solid ${st?.status === 'issue' ? '#fbbf2433' : st?.status === 'offline' ? '#ef444433' : 'rgba(0,0,0,0.08)'}`,
                background: 'rgba(0,0,0,0.015)'
              }} data-testid={`ai-system-${sys.id}`}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${sys.color}15`, flexShrink: 0
                }}>
                  <sys.icon size={18} style={{ color: sys.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {sys.label}
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                    {st && <span style={{ fontSize: '0.6rem', color: '#888' }}>{st.ms}ms</span>}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#888', lineHeight: 1.3, marginBottom: '2px' }}>{sys.desc}</div>
                  <div style={{ fontSize: '0.62rem', color: '#aaa', lineHeight: 1.2 }}>{sys.capability}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
          {knowledgeAreas.map(area => (
            <Link key={area.label} href={area.href} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.65rem', borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.06)', background: 'hsl(var(--muted))',
              textDecoration: 'none', color: 'inherit', fontSize: '0.78rem'
            }} data-testid={`knowledge-area-${area.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <area.icon size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>{area.label}</div>
                <div style={{ fontSize: '0.62rem', color: '#999', lineHeight: 1.2 }}>{area.desc}</div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'hsl(var(--primary))' }}>{area.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminNavGrid() {
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

function ToolsStatusWidget() {
  const [toolsData, setToolsData] = useState(null);
  const [isQuickChecking, setIsQuickChecking] = useState(false);
  const [quickResults, setQuickResults] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('glp_tools_last_check');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.results && Date.now() - parsed.timestamp < 3600000) {
          setToolsData(parsed);
        }
      }
    } catch {}
  }, []);

  const QUICK_ENDPOINTS = [
    { id: 'health', label: 'System Health', endpoint: '/api/health' },
    { id: 'auth', label: 'Auth Service', endpoint: '/api/auth/user' },
    { id: 'blog', label: 'Blog Engine', endpoint: '/api/blog' },
    { id: 'billing', label: 'Billing API', endpoint: '/api/billing' },
    { id: 'email', label: 'Email Service', endpoint: '/api/email' },
    { id: 'perplexity', label: 'Perplexity AI', endpoint: '/api/perplexity' },
    { id: 'canva', label: 'Canva AI', endpoint: '/api/canva-oauth' },
    { id: 'ai-engine', label: 'AI Engine', endpoint: '/api/ai/history' },
  ];

  const runQuickCheck = async () => {
    setIsQuickChecking(true);
    const results = {};
    await Promise.all(QUICK_ENDPOINTS.map(async (ep) => {
      const start = performance.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        let res = await fetch(ep.endpoint, { method: 'GET', credentials: 'include', signal: controller.signal });
        clearTimeout(timeout);
        if (res.status === 405) {
          const c2 = new AbortController();
          const t2 = setTimeout(() => c2.abort(), 6000);
          res = await fetch(ep.endpoint, { method: 'HEAD', credentials: 'include', signal: c2.signal });
          clearTimeout(t2);
        }
        const ms = Math.round(performance.now() - start);
        const ok = res.ok || res.status === 401 || res.status === 403 || res.status === 405;
        results[ep.id] = { ok, status: res.status, ms };
      } catch {
        results[ep.id] = { ok: false, status: 0, ms: Math.round(performance.now() - start) };
      }
    }));
    setQuickResults(results);
    setIsQuickChecking(false);
  };

  if (!toolsData) {
    return (
      <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleContainer}>
            <Zap className={styles.cardHeaderIcon} />
            <h2 className={styles.cardTitle}>Platform Tools Status</h2>
          </div>
          <button onClick={runQuickCheck} disabled={isQuickChecking} style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.75rem', padding: '0.35rem 0.65rem', borderRadius: '6px',
            border: '1px solid hsl(var(--border))', background: 'transparent', cursor: 'pointer',
            color: 'hsl(var(--primary))', opacity: isQuickChecking ? 0.5 : 1
          }} data-testid="button-quick-check">
            {isQuickChecking ? <RefreshCw size={12} className={styles.refreshIconSpinning} /> : <Activity size={12} />}
            Quick Check
          </button>
        </div>
        <div style={{ padding: '0.75rem 1rem' }}>
          {quickResults ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {QUICK_ENDPOINTS.map(ep => {
                const r = quickResults[ep.id];
                return (
                  <div key={ep.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '0.4rem 0.5rem', borderRadius: '6px', background: 'hsl(var(--muted))' }} data-testid={`quick-check-${ep.id}`}>
                    {r?.ok ? <CheckCircle size={13} style={{ color: '#22c55e', flexShrink: 0 }} /> : <AlertCircle size={13} style={{ color: '#ef4444', flexShrink: 0 }} />}
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.label}</span>
                    <span style={{ fontSize: '0.65rem', color: '#888' }}>{r?.ms || 0}ms</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.75rem', textAlign: 'center' }}>No recent full health check. Run a quick check or go to Platform Tools for a full scan.</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
            <Link href="/admin/tools" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '0.5rem 1rem', borderRadius: '8px',
              background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))',
              fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none'
            }} data-testid="link-run-first-check">
              <Play size={14} /> Full Daily Operations Check
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const results = Object.values(toolsData.results);
  const total = results.length;
  const healthy = results.filter(r => r.status === 'healthy').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;
  const avgMs = total > 0 ? Math.round(results.reduce((s, r) => s + (r.ms || 0), 0) / total) : 0;
  const healthPercent = total > 0 ? Math.round((healthy / total) * 100) : 0;
  const timeSince = toolsData.timestamp ? new Date(toolsData.timestamp).toLocaleTimeString() : '—';
  const isStale = toolsData.timestamp && (Date.now() - toolsData.timestamp > 1800000);
  const scoreColor = healthPercent >= 90 ? '#22c55e' : healthPercent >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }} data-testid="panel-tools-status">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Zap className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>Platform Tools Status</h2>
          <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '0.5rem' }}>
            {total} tools checked at {timeSince}
            {isStale && <span style={{ color: '#f59e0b', marginLeft: '4px' }}>(stale)</span>}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={runQuickCheck} disabled={isQuickChecking} style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.7rem', padding: '0.3rem 0.5rem', borderRadius: '5px',
            border: '1px solid hsl(var(--border))', background: 'transparent', cursor: 'pointer',
            color: 'hsl(var(--muted-foreground))', opacity: isQuickChecking ? 0.5 : 1
          }} data-testid="button-quick-recheck">
            {isQuickChecking ? <RefreshCw size={11} className={styles.refreshIconSpinning} /> : <Activity size={11} />}
            Quick
          </button>
          <Link href="/admin/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.75rem', color: 'hsl(var(--primary))', textDecoration: 'none'
          }} data-testid="link-view-all-tools">
            Full Check <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      {quickResults && (
        <div style={{ padding: '0 1rem 0.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.4rem' }}>
          {QUICK_ENDPOINTS.map(ep => {
            const r = quickResults[ep.id];
            return (
              <div key={ep.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', padding: '0.3rem 0.5rem', borderRadius: '5px', background: 'hsl(var(--muted))' }} data-testid={`quick-check-${ep.id}`}>
                {r?.ok ? <CheckCircle size={12} style={{ color: '#22c55e', flexShrink: 0 }} /> : <AlertCircle size={12} style={{ color: '#ef4444', flexShrink: 0 }} />}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.label}</span>
                <span style={{ fontSize: '0.6rem', color: '#888' }}>{r?.ms || 0}ms</span>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ padding: '0 1rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: scoreColor }} data-testid="text-tools-health-pct">{healthPercent}%</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Health Score</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }} data-testid="text-tools-healthy">{healthy}</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Healthy</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }} data-testid="text-tools-warnings">{warnings}</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Warnings</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }} data-testid="text-tools-errors">{errors}</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Errors</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#64748b' }} data-testid="text-tools-avg-ms">{avgMs}ms</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Avg Response</div>
        </div>
      </div>
      <div style={{ padding: '0 1rem 0.75rem' }}>
        <div style={{ height: '6px', borderRadius: '3px', background: '#e5e7eb', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', borderRadius: '3px', transition: 'width 0.3s',
            width: `${healthPercent}%`,
            background: scoreColor
          }} />
        </div>
      </div>
      {(errors > 0 || isStale) && (
        <div style={{ padding: '0 1rem 0.75rem' }}>
          <Link href="/admin/tools" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.5rem 0.75rem', borderRadius: '8px',
            background: errors > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${errors > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
            fontSize: '0.78rem', color: errors > 0 ? '#dc2626' : '#d97706',
            textDecoration: 'none', fontWeight: 500
          }} data-testid="link-fix-tools-issues">
            <AlertTriangle size={14} />
            {errors > 0 ? `${errors} tool(s) need attention` : 'Results may be stale - re-run checks'}
            <ArrowRight size={12} style={{ marginLeft: 'auto' }} />
          </Link>
        </div>
      )}
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
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
    refetchInterval: 60000
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    retry: 2,
    retryDelay: 1000,
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

        <div className={styles.mainGrid}>
          <KernelStatusPanel />
          <SystemTelemetryPanel />
        </div>

        <DailyOpsChecklist />

        <div className="my-8 space-y-6" data-testid="section-platform-healing">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" style={{ color: 'var(--glp-sage-deep)' }} />
            <h2 className="text-2xl font-serif" style={{ color: 'var(--glp-ink)' }}>Platform Healing &amp; Operations</h2>
            <span className="text-xs uppercase tracking-wider px-2 py-1 rounded" style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}>Live</span>
          </div>
          <p className="text-sm text-muted-foreground" style={{ marginTop: '-0.25rem' }}>
            Real-time SOP probes and self-heal controls. Safe, read-only diagnostics with explicit manual repair triggers.
          </p>
          <SOPMonitorPanel />
          <OperationsPanel />
          <ConsciousnessRegistryPanel />
        </div>

        <ToolsStatusWidget />

        <AdminNavGrid />

        <AIKnowledgeHub />

        <DailyToolsPanel />
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
