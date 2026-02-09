import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, TrendingUp, BarChart2, Users, Eye, Heart, 
  MessageCircle, Share2, Calendar, Instagram, Twitter, 
  Youtube, Activity, Target
} from "lucide-react";
import SafetyFooter from "../../components/ui/SafetyFooter";

const PLATFORMS = {
  instagram: { icon: Instagram, color: "#E4405F", name: "Instagram" },
  tiktok: { icon: MessageCircle, color: "#000000", name: "TikTok" },
  youtube: { icon: Youtube, color: "#FF0000", name: "YouTube" },
  x: { icon: Twitter, color: "#000000", name: "X/Twitter" },
  facebook: { icon: MessageCircle, color: "#1877F2", name: "Facebook" },
};

function MetricCard({ title, value, change, icon: Icon, color = "sage" }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `var(--glp-${color}-10, rgba(107, 142, 35, 0.1))` }}
        >
          <Icon className="w-5 h-5" style={{ color: `var(--glp-${color}, #6B8E23)` }} />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}>
            {isPositive ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    </div>
  );
}

function PlatformRow({ platform, stats }) {
  const config = PLATFORMS[platform] || PLATFORMS.instagram;
  const Icon = config.icon;
  
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${config.color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color: config.color }} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-slate-900 dark:text-white">{config.name}</p>
        <p className="text-sm text-slate-500">@{stats.handle || "not connected"}</p>
      </div>
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{stats.posts || 0}</p>
          <p className="text-xs text-slate-500">Posts</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{stats.engagement || "0%"}</p>
          <p className="text-xs text-slate-500">Engagement</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{stats.reach || 0}</p>
          <p className="text-xs text-slate-500">Reach</p>
        </div>
      </div>
    </div>
  );
}

function ContentPerformance({ posts }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-[var(--glp-sage)]" />
        Top Performing Content
      </h3>
      
      {posts.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No published content yet. Approve and publish drafts to see analytics.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span className="w-6 h-6 flex items-center justify-center bg-[var(--glp-sage)] text-white rounded-full text-xs font-bold">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">{post.title}</p>
                <p className="text-xs text-slate-500">{post.platform} • {post.date}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Heart className="w-4 h-4" /> {post.likes}
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <MessageCircle className="w-4 h-4" /> {post.comments}
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Share2 className="w-4 h-4" /> {post.shares}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SocialAnalytics() {
  const { data: analytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/social/analytics"],
  });
  
  const { data: drafts = [], isLoading: draftsLoading } = useQuery({
    queryKey: ["/api/admin/social/drafts"],
  });
  
  const isLoading = analyticsLoading || draftsLoading;
  
  const publishedDrafts = drafts.filter(d => d.status === "published");
  const publishedCount = publishedDrafts.length;
  const approvedCount = drafts.filter(d => d.status === "approved").length;
  const scheduledCount = drafts.filter(d => d.status === "scheduled").length;
  const totalDrafts = drafts.length;
  
  const platformCounts = publishedDrafts.reduce((acc, draft) => {
    const platform = draft.platform || "instagram";
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});
  
  const platformStats = Object.entries(platformCounts).map(([platform, count]) => ({
    platform,
    handle: analytics?.handles?.[platform] || "connected",
    posts: count,
    engagement: analytics?.engagement?.[platform] || "—",
    reach: analytics?.reach?.[platform] || "—"
  }));
  
  if (platformStats.length === 0) {
    platformStats.push(
      { platform: "instagram", handle: "not connected", posts: 0, engagement: "—", reach: "—" },
      { platform: "tiktok", handle: "not connected", posts: 0, engagement: "—", reach: "—" }
    );
  }
  
  const topPosts = publishedDrafts
    .slice(0, 5)
    .map((draft, idx) => ({
      title: draft.title || draft.content?.substring(0, 50) || `Post ${idx + 1}`,
      platform: draft.platform || "Instagram",
      date: draft.createdAt ? new Date(draft.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Recent",
      likes: draft.likes || "—",
      comments: draft.comments || "—",
      shares: draft.shares || "—"
    }));
  
  const themes = drafts.reduce((acc, draft) => {
    const content = (draft.content || draft.title || "").toLowerCase();
    if (content.includes("compassion") || content.includes("self-love")) acc["Self-Compassion"] = (acc["Self-Compassion"] || 0) + 1;
    if (content.includes("ground") || content.includes("breath")) acc["Grounding"] = (acc["Grounding"] || 0) + 1;
    if (content.includes("boundary") || content.includes("boundaries")) acc["Boundaries"] = (acc["Boundaries"] || 0) + 1;
    if (content.includes("nervous") || content.includes("calm")) acc["Nervous System"] = (acc["Nervous System"] || 0) + 1;
    if (content.includes("heal") || content.includes("recovery")) acc["Healing"] = (acc["Healing"] || 0) + 1;
    return acc;
  }, {});
  
  const topThemes = Object.entries(themes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4)
    .map(([theme, count]) => ({ theme, count }));
  
  if (topThemes.length === 0) {
    topThemes.push(
      { theme: "Self-Compassion", count: 0 },
      { theme: "Grounding", count: 0 },
      { theme: "Boundaries", count: 0 },
      { theme: "Nervous System", count: 0 }
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '0.5rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} />
          Back to Command Center
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/social" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" data-testid="link-back-social">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-page-title">
              Content Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400" data-testid="text-page-subtitle">
              Track your content performance across platforms
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard 
            title="Total Published" 
            value={publishedCount} 
            icon={BarChart2}
            color="sage"
          />
          <MetricCard 
            title="Ready to Publish" 
            value={approvedCount} 
            icon={Activity}
            color="sage"
          />
          <MetricCard 
            title="Scheduled" 
            value={scheduledCount} 
            icon={Calendar}
            color="sage"
          />
          <MetricCard 
            title="Total Posts" 
            value={publishedCount + approvedCount + scheduledCount}
            icon={Users}
            color="sage"
          />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--glp-sage)]" />
              Platform Performance
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-[var(--glp-sage)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {platformStats.map(stats => (
                  <PlatformRow key={stats.platform} platform={stats.platform} stats={stats} />
                ))}
              </div>
            )}
          </div>
          
          <ContentPerformance posts={topPosts} />
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--glp-sage)]" />
            Best Performing Themes
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topThemes.map((item, idx) => (
              <div key={item.theme} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-[var(--glp-sage)]">#{idx + 1}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{item.theme}</p>
                <p className="text-xs text-slate-500 mt-1">{item.count} posts</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Content Tracking:</strong> Showing data from your content drafts. 
            {totalDrafts > 0 
              ? ` ${totalDrafts} total drafts, ${publishedCount} published, ${approvedCount} approved, ${scheduledCount} scheduled.`
              : " Create and publish content to see your analytics."
            }
            {" "}Engagement and reach metrics require connecting social media APIs.
          </p>
        </div>
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
