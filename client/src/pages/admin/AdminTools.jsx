import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, AlertCircle,
  Search, Play, CheckSquare, ArrowRight, Wand2,
  MessageSquare, Headphones, Heart, BookOpen, Sun, Moon, Leaf, Eye, 
  FileQuestion, Gauge, Lightbulb, Landmark, GraduationCap, Brain,
  Sparkles, Mountain, Compass, Layers, Puzzle, Milestone, Trophy,
  HeartHandshake, Flame, Target, Flower2, TreePine, CircleDot,
  Shield, Feather, Gem, Award, Zap, TrendingUp, Star, Orbit,
  Rocket, Footprints, Workflow, Globe, Network, Users, FileText,
  Palette, Wand2 as WandIcon, BookOpen as BookIcon, Mail, Share2, 
  Megaphone, PenTool, UserCheck, LayoutDashboard, CreditCard,
  ShieldCheck, ClipboardList, BarChart3, Activity, PackageCheck,
  DollarSign, Webhook, Contact, Key, Handshake, Upload, UserCog,
  ListOrdered, Radio, Fingerprint, FolderKanban, Rss, LogIn, Inbox,
  Clock, Download, Timer, Filter, RotateCcw
} from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";

const toolCategories = [
  {
    title: "AI & Core Wellness Tools",
    tools: [
      { id: "ai-chat", label: "AI Chat Therapy", endpoint: "/api/ai/history", icon: MessageSquare, desc: "AI conversation engine" },
      { id: "therapy", label: "Therapy Engine", endpoint: "/api/therapy/crisis-resources", icon: Headphones, desc: "Guided therapy sessions" },
      { id: "mood-tracker", label: "Mood Tracker", endpoint: "/api/mood", icon: Heart, desc: "User mood tracking" },
      { id: "journal", label: "Journal System", endpoint: "/api/journal", icon: BookOpen, desc: "Journaling engine" },
      { id: "gratitude", label: "Gratitude Prompts", endpoint: "/api/gratitude", icon: Sun, desc: "Daily gratitude system" },
      { id: "reflection", label: "Reflection Tools", endpoint: "/api/reflection", icon: Moon, desc: "Self-reflection engine" },
      { id: "wellness-tools", label: "Wellness Toolkit", endpoint: "/api/wellness-tools/all", icon: Leaf, desc: "Breath, body scan, meditation" },
      { id: "mirror", label: "Mirror Reflection", endpoint: "/api/mirror/frameworks", icon: Eye, desc: "Self-awareness mirror" },
      { id: "prompts", label: "Prompt Engine", endpoint: "/api/prompts/daily", icon: FileQuestion, desc: "Guided prompt system" },
      { id: "states", label: "Emotional States", endpoint: "/api/states", icon: Gauge, desc: "State tracking system" },
    ]
  },
  {
    title: "Intelligence & Growth Tools",
    tools: [
      { id: "wisdom", label: "Wisdom Engine", endpoint: "/api/wisdom", icon: Lightbulb, desc: "Daily wisdom delivery" },
      { id: "wisdom-engine", label: "Wisdom Engine (Advanced)", endpoint: "/api/wisdom-engine/daily", icon: Landmark, desc: "Deep wisdom system" },
      { id: "philosophy", label: "Philosophy Lab", endpoint: "/api/philosophy/daily", icon: GraduationCap, desc: "Philosophical inquiry" },
      { id: "metacognition", label: "Metacognition", endpoint: "/api/metacognition/daily", icon: Brain, desc: "Thinking about thinking" },
      { id: "creativity", label: "Creativity Engine", endpoint: "/api/creativity/daily", icon: Sparkles, desc: "Creative exploration" },
      { id: "resilience", label: "Resilience Builder", endpoint: "/api/resilience/daily", icon: Mountain, desc: "Resilience tools" },
      { id: "foresight", label: "Foresight Lab", endpoint: "/api/foresight", icon: Compass, desc: "Future planning" },
      { id: "knowledge", label: "Knowledge Synthesis", endpoint: "/api/knowledge/all", icon: BookOpen, desc: "Knowledge integration" },
      { id: "cognitive-lab", label: "Cognitive Lab", endpoint: "/api/cognitive-lab/daily", icon: Brain, desc: "Cognitive exercises" },
      { id: "cognitive-mastery", label: "Cognitive Mastery", endpoint: "/api/cognitive-mastery", icon: Trophy, desc: "Cognitive excellence" },
      { id: "deep-learning", label: "Deep Learning", endpoint: "/api/deep-learning", icon: Layers, desc: "Deep learning tools" },
      { id: "dialectics", label: "Dialectics Engine", endpoint: "/api/dialectics/daily", icon: Puzzle, desc: "Dialectical reasoning" },
      { id: "practices", label: "Practices Library", endpoint: "/api/practices/daily", icon: Milestone, desc: "Guided practices" },
      { id: "insights", label: "Insights Engine", endpoint: "/api/insights", icon: Lightbulb, desc: "Personal insights" },
    ]
  },
  {
    title: "Healing & Recovery Tools",
    tools: [
      { id: "trauma-healing", label: "Trauma Healing", endpoint: "/api/trauma-healing", icon: HeartHandshake, desc: "Trauma-informed protocols" },
      { id: "emotional-resilience", label: "Emotional Resilience", endpoint: "/api/emotional-resilience/daily", icon: Flame, desc: "Emotional strength" },
      { id: "emotional-mastery", label: "Emotional Mastery", endpoint: "/api/emotional-mastery/daily-eq", icon: Target, desc: "Emotion regulation" },
      { id: "healing-modalities", label: "Healing Modalities", endpoint: "/api/healing-modalities", icon: Flower2, desc: "Healing approaches" },
      { id: "holistic-healing", label: "Holistic Healing", endpoint: "/api/holistic-healing", icon: TreePine, desc: "Whole-person wellness" },
      { id: "healing-tools", label: "Healing Tools", endpoint: "/api/healing/all", icon: Heart, desc: "Core healing toolkit" },
      { id: "healing-core", label: "Healing Core", endpoint: "/api/healing-core", icon: Leaf, desc: "Core healing engine" },
      { id: "healing-intelligence", label: "Healing Intelligence", endpoint: "/api/healing-intelligence/categories", icon: Sparkles, desc: "AI-guided healing" },
      { id: "post-trauma", label: "Post-Trauma Growth", endpoint: "/api/post-trauma/daily", icon: Feather, desc: "Post-traumatic growth" },
      { id: "mind-body", label: "Mind-Body Integration", endpoint: "/api/mind-body/daily", icon: CircleDot, desc: "Mind-body connection" },
      { id: "psychological-safety", label: "Psychological Safety", endpoint: "/api/psychological-safety/daily", icon: Shield, desc: "Safety frameworks" },
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

const CRITICAL_CHECKS = [
  { id: "health-api", label: "System Health", endpoint: "/api/health", icon: Activity, desc: "Server & DB status" },
  { id: "ai-chat", label: "AI Engine", endpoint: "/api/ai/history", icon: MessageSquare, desc: "AI chat system" },
  { id: "auth-core", label: "Auth Service", endpoint: "/api/auth/user", icon: Shield, desc: "Authentication" },
  { id: "billing", label: "Billing API", endpoint: "/api/billing", icon: CreditCard, desc: "Stripe billing" },
  { id: "blog-api", label: "Blog Engine", endpoint: "/api/blog", icon: BookOpen, desc: "Blog system" },
  { id: "email", label: "Email Service", endpoint: "/api/email", icon: Mail, desc: "Resend email" },
];

function QuickDiagnostics({ toolResults, runHealthCheck, runningTools }) {
  const runQuickCheck = async () => {
    await Promise.all(CRITICAL_CHECKS.map(tool => runHealthCheck(tool)));
  };

  const critChecked = CRITICAL_CHECKS.filter(c => toolResults[c.id]).length;
  const critHealthy = CRITICAL_CHECKS.filter(c => toolResults[c.id]?.status === 'healthy').length;
  const critErrors = CRITICAL_CHECKS.filter(c => toolResults[c.id]?.status === 'error').length;
  const isRunning = CRITICAL_CHECKS.some(c => runningTools[c.id]);

  return (
    <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-card" data-testid="panel-quick-diagnostics">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold">Quick Diagnostics</h3>
          <span className="text-xs text-muted-foreground">6 critical endpoints</span>
        </div>
        <button
          onClick={runQuickCheck}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
          data-testid="button-quick-diagnostics"
        >
          {isRunning ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
          {isRunning ? 'Running...' : 'Run Quick Check'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {CRITICAL_CHECKS.map((check) => {
          const Icon = check.icon;
          const result = toolResults[check.id];
          const running = runningTools[check.id];
          return (
            <div
              key={check.id}
              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors ${
                result?.status === 'healthy' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' :
                result?.status === 'error' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' :
                result?.status === 'warning' ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20' :
                'border-gray-100 dark:border-gray-800 bg-muted/30'
              }`}
              data-testid={`quick-check-${check.id}`}
            >
              {running ? (
                <RefreshCw size={14} className="animate-spin text-muted-foreground flex-shrink-0" />
              ) : result ? (
                result.status === 'healthy' ? <CheckCircle size={14} className="text-green-600 flex-shrink-0" /> :
                result.status === 'error' ? <AlertCircle size={14} className="text-red-500 flex-shrink-0" /> :
                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
              ) : (
                <Icon size={14} className="text-muted-foreground flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">{check.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {running ? 'Checking...' : result ? `${result.label} ${result.ms}ms` : check.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {critChecked === CRITICAL_CHECKS.length && (
        <div className={`mt-3 text-xs text-center py-1.5 rounded-lg ${
          critErrors > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'
        }`} data-testid="text-quick-diagnostics-result">
          {critErrors > 0 ? `${critErrors} critical service(s) need attention` : `All ${critHealthy} critical services operational`}
        </div>
      )}
    </div>
  );
}

const STORAGE_KEY = 'glp_tools_last_check';
const AUTO_REFRESH_INTERVALS = [
  { label: 'Off', value: 0 },
  { label: '1 min', value: 60000 },
  { label: '5 min', value: 300000 },
  { label: '15 min', value: 900000 },
  { label: '30 min', value: 1800000 },
];
const STATUS_FILTERS = ['all', 'healthy', 'warning', 'error', 'unchecked'];

export default function AdminTools() {
  const [runningTools, setRunningTools] = useState({});
  const [toolResults, setToolResults] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.results && Date.now() - parsed.timestamp < 3600000) {
          return parsed.results;
        }
      }
    } catch {}
    return {};
  });
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [lastFullCheck, setLastFullCheck] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastCheck && Date.now() - parsed.timestamp < 3600000) {
          return parsed.lastCheck;
        }
      }
    } catch {}
    return null;
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const autoRefreshRef = useRef(null);
  const runAllRef = useRef(null);

  useEffect(() => {
    if (Object.keys(toolResults).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          results: toolResults,
          lastCheck: lastFullCheck,
          timestamp: Date.now()
        }));
      } catch {}
    }
  }, [toolResults, lastFullCheck]);

  const toggleCategory = (idx) => {
    setCollapsedCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const collapseAll = () => {
    const all = {};
    toolCategories.forEach((_, i) => { all[i] = true; });
    setCollapsedCategories(all);
  };

  const expandAll = () => setCollapsedCategories({});

  const runHealthCheck = async (tool) => {
    setRunningTools(prev => ({ ...prev, [tool.id]: true }));
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let res = await fetch(tool.endpoint, { method: 'GET', credentials: 'include', signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 405) {
        const controller2 = new AbortController();
        const timeout2 = setTimeout(() => controller2.abort(), 8000);
        res = await fetch(tool.endpoint, { method: 'HEAD', credentials: 'include', signal: controller2.signal });
        clearTimeout(timeout2);
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

  const runAllChecks = useCallback(async () => {
    if (runAllRef.current) return;
    runAllRef.current = true;
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
    runAllRef.current = false;
  }, []);

  useEffect(() => {
    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = null;
    }
    if (autoRefreshInterval > 0) {
      autoRefreshRef.current = setInterval(() => {
        if (!runAllRef.current) runAllChecks();
      }, autoRefreshInterval);
    }
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [autoRefreshInterval, runAllChecks]);

  const clearResults = () => {
    setToolResults({});
    setLastFullCheck(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

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

  const exportResults = (format = 'txt') => {
    const now = new Date();
    if (format === 'json') {
      const report = {
        generated: now.toISOString(),
        summary: { total: totalTools, checked: checkedCount, healthy: healthyCount, warnings: warningCount, errors: errorCount, avgResponseMs: avgResponseTime, maxResponseMs: maxResponseTime, authGated: authGatedCount },
        categories: toolCategories.map(cat => ({
          name: cat.title,
          tools: cat.tools.map(t => ({ id: t.id, label: t.label, endpoint: t.endpoint, ...toolResults[t.id] }))
        }))
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tools-health-${now.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const lines = [
      `Platform Tools Health Report - ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Generated: ${now.toLocaleTimeString()}`,
      `Total: ${totalTools} | Checked: ${checkedCount} | Healthy: ${healthyCount} | Warnings: ${warningCount} | Errors: ${errorCount}`,
      `Avg Response: ${avgResponseTime}ms | Slowest: ${maxResponseTime}ms`,
      '',
      ...toolCategories.flatMap(cat => [
        `--- ${cat.title} ---`,
        ...cat.tools.map(t => {
          const r = toolResults[t.id];
          return r ? `  [${r.status === 'healthy' ? 'OK' : r.status === 'warning' ? 'WARN' : 'ERR'}] ${t.label} (${t.endpoint}) - ${r.ms}ms ${r.label !== 'ok' ? `(${r.label})` : ''}` : `  [ ] ${t.label} (${t.endpoint}) - not checked`;
        }),
        ''
      ])
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tools-health-${now.toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Platform Tools — Admin" description="All 123 platform tools with health monitoring" noindex />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>

        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Platform Tools ({totalTools})</h1>
                <p className="text-muted-foreground text-sm">Daily health monitor for all platform tools and API endpoints</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {checkedCount > 0 && (
                <div className="flex items-center gap-3 text-sm" data-testid="text-tool-summary">
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14} /> {healthyCount}</span>
                  {warningCount > 0 && <span className="flex items-center gap-1 text-amber-500"><AlertTriangle size={14} /> {warningCount}</span>}
                  {errorCount > 0 && <span className="flex items-center gap-1 text-red-500"><AlertCircle size={14} /> {errorCount}</span>}
                  <span className="text-muted-foreground">/ {totalTools}</span>
                </div>
              )}
              <button
                onClick={runAllChecks}
                disabled={isAnyRunning}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                data-testid="button-run-all-checks"
              >
                {isAnyRunning ? (
                  <><RefreshCw size={14} className="animate-spin" /> Checking... ({checkedCount}/{totalTools})</>
                ) : (
                  <><Play size={14} /> Run Daily Operations</>
                )}
              </button>
            </div>
          </div>
        </header>

        <QuickDiagnostics toolResults={toolResults} runHealthCheck={runHealthCheck} runningTools={runningTools} />

        {checkedCount > 0 && (
          <div className="mb-4">
            <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden" data-testid="progress-bar-tools">
              <div className="h-full rounded-full transition-all duration-300" style={{ 
                width: `${(checkedCount / totalTools) * 100}%`, 
                background: errorCount > 0 ? '#ef4444' : warningCount > 0 ? '#eab308' : '#22c55e'
              }} />
            </div>
          </div>
        )}

        {checkedCount === totalTools && !isAnyRunning && (() => {
          const healthScore = totalTools > 0 ? Math.round((healthyCount / totalTools) * 100) : 0;
          const scoreColor = healthScore >= 90 ? 'text-green-600' : healthScore >= 70 ? 'text-amber-500' : 'text-red-500';
          const scoreBg = healthScore >= 90 ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : healthScore >= 70 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
          return (
            <div className={`mb-6 p-4 rounded-xl border ${scoreBg}`} data-testid="panel-results-summary">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-bold ${scoreColor}`} data-testid="text-health-score">{healthScore}%</div>
                  <div>
                    <div className="font-semibold text-sm">Platform Health Score</div>
                    <div className="text-xs text-muted-foreground">Last check: {lastFullCheck}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={runErrorsOnly} disabled={errorCount + warningCount === 0} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-muted/50 disabled:opacity-40" data-testid="button-recheck-issues">Re-check Issues ({errorCount + warningCount})</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600" data-testid="text-healthy-count">{healthyCount}</div>
                  <div className="text-xs text-muted-foreground">Healthy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500" data-testid="text-warning-count">{warningCount}</div>
                  <div className="text-xs text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500" data-testid="text-error-count">{errorCount}</div>
                  <div className="text-xs text-muted-foreground">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600" data-testid="text-auth-gated-count">{authGatedCount}</div>
                  <div className="text-xs text-muted-foreground">Auth-Gated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600" data-testid="text-avg-response">{avgResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${maxResponseTime > 1000 ? 'text-red-500' : 'text-slate-600'}`} data-testid="text-max-response">{maxResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Slowest</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600" data-testid="text-total-tools">{totalTools}</div>
                  <div className="text-xs text-muted-foreground">Total Tools</div>
                </div>
              </div>
            </div>
          );
        })()}

        {checkedCount > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap p-3 rounded-xl bg-muted/30 border border-gray-100 dark:border-gray-800" data-testid="panel-ops-toolbar">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Timer size={12} />
              <span>Auto-refresh:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-background text-xs"
                data-testid="select-auto-refresh"
              >
                {AUTO_REFRESH_INTERVALS.map(i => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
              {autoRefreshInterval > 0 && <span className="text-green-600 font-medium">Active</span>}
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter size={12} />
              <span>Show:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-background text-xs"
                data-testid="select-status-filter"
              >
                {STATUS_FILTERS.map(f => (
                  <option key={f} value={f}>{f === 'all' ? 'All' : f === 'unchecked' ? 'Unchecked' : f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            {(errorCount > 0 || warningCount > 0) && (
              <button
                onClick={runErrorsOnly}
                disabled={isAnyRunning}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50"
                data-testid="button-recheck-errors"
              >
                <RotateCcw size={10} /> Re-check Issues ({errorCount + warningCount})
              </button>
            )}
            <button
              onClick={() => exportResults('txt')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs hover:bg-muted transition-colors"
              data-testid="button-export-txt"
            >
              <Download size={10} /> TXT
            </button>
            <button
              onClick={() => exportResults('json')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs hover:bg-muted transition-colors"
              data-testid="button-export-json"
            >
              <Download size={10} /> JSON
            </button>
            <button
              onClick={clearResults}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
              data-testid="button-clear-results"
            >
              Clear
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              data-testid="input-search-tools"
            />
          </div>
          <button onClick={expandAll} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs hover:bg-muted transition-colors" data-testid="button-expand-all">Expand All</button>
          <button onClick={collapseAll} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs hover:bg-muted transition-colors" data-testid="button-collapse-all">Collapse All</button>
          {lastFullCheck && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground" data-testid="text-last-check">
              <Clock size={12} /> Last check: {lastFullCheck}
            </span>
          )}
        </div>

        <div className="space-y-6" data-testid="panel-tool-categories">
          {toolCategories.map((category, ci) => {
            const filterLower = searchFilter.toLowerCase();
            let filteredTools = searchFilter 
              ? category.tools.filter(t => t.label.toLowerCase().includes(filterLower) || t.desc.toLowerCase().includes(filterLower) || t.id.toLowerCase().includes(filterLower))
              : category.tools;
            if (statusFilter !== 'all') {
              filteredTools = filteredTools.filter(t => {
                const r = toolResults[t.id];
                if (statusFilter === 'unchecked') return !r;
                return r?.status === statusFilter;
              });
            }
            if ((searchFilter || statusFilter !== 'all') && filteredTools.length === 0) return null;
            const catHealthy = category.tools.filter(t => toolResults[t.id]?.status === 'healthy').length;
            const catChecked = category.tools.filter(t => toolResults[t.id]).length;
            const catErrors = category.tools.filter(t => toolResults[t.id]?.status === 'error').length;
            const isCollapsed = collapsedCategories[ci];
            return (
              <div key={ci} data-testid={`tool-category-${ci}`}>
                <button 
                  onClick={() => toggleCategory(ci)}
                  className="w-full flex items-center justify-between text-left py-2 px-0 bg-transparent border-none cursor-pointer text-sm font-semibold uppercase tracking-wide text-foreground/70 hover:text-foreground transition-colors"
                  data-testid={`toggle-category-${ci}`}
                >
                  <span className="flex items-center gap-2">
                    <ArrowRight size={12} style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                    {category.title} ({searchFilter ? `${filteredTools.length}/` : ''}{category.tools.length})
                  </span>
                  {catChecked > 0 && (
                    <span className="text-xs font-normal flex gap-2">
                      <span className="text-green-600">{catHealthy} ok</span>
                      {catErrors > 0 && <span className="text-red-500">{catErrors} err</span>}
                    </span>
                  )}
                </button>
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                    {filteredTools.map((tool) => {
                      const ToolIcon = tool.icon;
                      const result = toolResults[tool.id];
                      const isRunning = runningTools[tool.id];
                      return (
                        <div 
                          key={tool.id} 
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-card hover:bg-muted/50 transition-colors"
                          data-testid={`tool-card-${tool.id}`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ToolIcon size={16} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{tool.label}</div>
                            <div className="text-xs text-muted-foreground truncate">{tool.desc}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {result && (
                              <span title={`HTTP ${result.code} - ${result.label || ''} - ${result.ms}ms - checked ${result.time}`} className="flex items-center gap-1">
                                {result.status === 'healthy' ? (
                                  <CheckCircle size={14} className="text-green-600" />
                                ) : result.status === 'warning' ? (
                                  <AlertTriangle size={14} className="text-amber-500" />
                                ) : (
                                  <AlertCircle size={14} className="text-red-500" />
                                )}
                                <span className={`text-[10px] ${result.ms > 2000 ? 'text-red-500 font-medium' : result.ms > 500 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                  {result.label && result.label !== 'ok' ? result.label : ''}{result.ms != null ? ` ${result.ms}ms` : ''}
                                </span>
                              </span>
                            )}
                            <button
                              onClick={() => runHealthCheck(tool)}
                              disabled={isRunning}
                              className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-xs hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                              data-testid={`button-check-${tool.id}`}
                            >
                              {isRunning ? <RefreshCw size={10} className="animate-spin" /> : <CheckSquare size={10} />}
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
        <SafetyFooter variant="compact" className="mt-12" />
      </main>
    </div>
  );
}
