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
  const { data: analytics = {}, isLoading } = useQuery({
    queryKey: ["/api/admin/social/analytics"],
  });
  
  const { data: drafts = [] } = useQuery({
    queryKey: ["/api/admin/social/drafts"],
  });
  
  const publishedCount = drafts.filter(d => d.status === "published").length;
  const approvedCount = drafts.filter(d => d.status === "approved").length;
  const scheduledCount = drafts.filter(d => d.status === "scheduled").length;
  
  const mockPlatformStats = [
    { platform: "instagram", handle: "thegenuineloveproject", posts: 12, engagement: "4.2%", reach: "2.4K" },
    { platform: "tiktok", handle: "genuineloveproject", posts: 8, engagement: "6.8%", reach: "5.1K" },
    { platform: "youtube", handle: "GenuineLoveProject", posts: 3, engagement: "2.1%", reach: "890" },
    { platform: "x", handle: "GenuineLoveProj", posts: 15, engagement: "1.8%", reach: "1.2K" },
  ];
  
  const mockTopPosts = [
    { title: "5 Signs You're Healing (Even When It Doesn't Feel Like It)", platform: "Instagram", date: "Jan 22", likes: 342, comments: 28, shares: 45 },
    { title: "Grounding Exercise for Anxious Moments", platform: "TikTok", date: "Jan 20", likes: 1.2 + "K", comments: 89, shares: 156 },
    { title: "Why Self-Compassion Matters", platform: "YouTube", date: "Jan 18", likes: 234, comments: 42, shares: 31 },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/social" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Content Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
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
            title="Total Reach" 
            value={analytics.totalReach || "9.5K"}
            change={12}
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
            
            <div className="space-y-3">
              {mockPlatformStats.map(stats => (
                <PlatformRow key={stats.platform} platform={stats.platform} stats={stats} />
              ))}
            </div>
          </div>
          
          <ContentPerformance posts={mockTopPosts} />
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--glp-sage)]" />
            Best Performing Themes
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Self-Compassion", "Grounding", "Boundaries", "Nervous System"].map((theme, idx) => (
              <div key={theme} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-[var(--glp-sage)]">#{idx + 1}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{theme}</p>
                <p className="text-xs text-slate-500 mt-1">{Math.floor(Math.random() * 20 + 5)} posts</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Note:</strong> Analytics are currently showing sample data. Connect your social media API keys in the Secrets panel to see real-time metrics.
          </p>
        </div>
        
        <SafetyFooter variant="compact" className="mt-12" />
      </div>
    </div>
  );
}
