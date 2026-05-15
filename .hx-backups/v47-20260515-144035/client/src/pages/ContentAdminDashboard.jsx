import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, FileText, Share2, BookOpen, ShoppingBag, Calendar, Plus, Edit, Eye, Clock, DollarSign, Download, TrendingUp, BarChart3, Loader2, Sparkles, BookMarked, Package, Zap } from 'lucide-react';
import { Instagram, Linkedin, Youtube } from "../lib/lucide-brands";
import { SiTiktok, SiPinterest } from "react-icons/si";
import SEO from "../components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient.js";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const PLATFORM_ICONS = {
  instagram: Instagram,
  twitter: Sparkles,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: SiTiktok,
  pinterest: SiPinterest,
};

const PLATFORM_COLORS = {
  instagram: "from-pink-500 to-purple-600",
  twitter: "from-blue-400 to-blue-600",
  linkedin: "from-blue-600 to-blue-700",
  youtube: "from-red-500 to-red-600",
  tiktok: "from-gray-800 to-black",
  pinterest: "from-red-400 to-red-500",
};

const STATUS_BADGES = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600" },
  scheduled: { label: "Scheduled", className: "bg-amber-100 text-amber-700" },
  published: { label: "Published", className: "bg-green-100 text-green-700" },
  archived: { label: "Archived", className: "bg-gray-100 text-gray-500" },
};

const PRODUCT_TYPES = {
  ebook: { label: "E-Book", icon: BookMarked },
  tool: { label: "Tool", icon: Zap },
  course: { label: "Course", icon: BookOpen },
  template: { label: "Template", icon: FileText },
};

function StatCard({ icon: Icon, label, value, trend, color = "sage" }) {
  const colorClasses = {
    sage: "icon-gradient-sage",
    teal: "icon-gradient-teal",
    gold: "icon-gradient-gold",
    blush: "icon-gradient-blush",
  };
  
  return (
    <div className="card-bordered p-5 hover:shadow-md transition-all" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="flex items-center gap-4">
        <div className={`icon-container icon-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-caption mb-1">{label}</p>
          <p className="text-heading-lg text-teal">{value}</p>
          {trend && (
            <p className="text-caption flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600">{trend}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function BlogSection() {
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["/api/blog/admin"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-premium-card h-24" />
        ))}
      </div>
    );
  }

  const blogPosts = posts || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-md text-teal">Blog Posts</h3>
        <Link 
          href="/write"
          className="btn-premium flex items-center gap-2"
          data-testid="button-new-blog"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {blogPosts.length === 0 ? (
        <div className="card-bordered p-8 text-center">
          <div className="icon-container icon-xl icon-soft-sage mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h4 className="text-heading-sm text-teal mb-2">No blog posts yet</h4>
          <p className="text-body-sm mb-4">Create your first blog post to share with your audience.</p>
          <Link href="/write" className="btn-secondary-premium inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="card-bordered p-4 hover:shadow-md transition-all flex items-center gap-4"
              data-testid={`blog-post-${post.id}`}
            >
              <div className="icon-container icon-md icon-soft-sage">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-heading-sm text-teal truncate">{post.title}</h4>
                <p className="text-caption">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${STATUS_BADGES[post.status]?.className || STATUS_BADGES.draft.className}`}>
                {STATUS_BADGES[post.status]?.label || "Draft"}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-[var(--sage-100)] transition" data-testid={`edit-blog-${post.id}`}>
                  <Edit className="w-4 h-4 text-[var(--sage-600)]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[var(--sage-100)] transition" data-testid={`view-blog-${post.id}`}>
                  <Eye className="w-4 h-4 text-[var(--sage-600)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialMediaSection() {
  const { toast } = useToast();
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["/api/social/posts"],
  });

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    platform: "instagram",
    scheduledAt: "",
  });

  const createMutation = useMutation({
    mutationFn: async (postData) => {
      return await apiRequest("POST", "/api/social/posts", postData);
    },
    onSuccess: () => {
      toast({ title: "Post created!", description: "Your social media post has been saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/social/posts"] });
      setNewPost({ title: "", content: "", platform: "instagram", scheduledAt: "" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const socialPosts = posts || [];
  const platforms = ["instagram", "twitter", "linkedin", "youtube", "tiktok", "pinterest"];

  return (
    <div className="space-y-6">
      <div className="card-bordered p-6">
        <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Create Social Post
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-body-sm font-medium block mb-2">Platform</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => {
                const Icon = PLATFORM_ICONS[platform] || Share2;
                return (
                  <button
                    key={platform}
                    onClick={() => setNewPost(p => ({ ...p, platform }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                      newPost.platform === platform
                        ? "bg-[var(--teal-600)] text-white border-[var(--teal-600)]"
                        : "bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]"
                    }`}
                    data-testid={`platform-${platform}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="capitalize text-sm">{platform}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="text-body-sm font-medium block mb-2">Title</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost(p => ({ ...p, title: e.target.value }))}
              placeholder="Post title or hook"
              className="input-base"
              data-testid="input-social-title"
            />
          </div>
          
          <div>
            <label className="text-body-sm font-medium block mb-2">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost(p => ({ ...p, content: e.target.value }))}
              placeholder="Write your social media post content..."
              rows={4}
              className="input-base resize-none"
              data-testid="input-social-content"
            />
          </div>
          
          <div>
            <label className="text-body-sm font-medium block mb-2">Schedule For</label>
            <input
              type="datetime-local"
              value={newPost.scheduledAt}
              onChange={(e) => setNewPost(p => ({ ...p, scheduledAt: e.target.value }))}
              className="input-base"
              data-testid="input-social-schedule"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => createMutation.mutate({ ...newPost, status: "draft" })}
              disabled={!newPost.title || !newPost.content || createMutation.isPending}
              className="btn-secondary-premium flex items-center gap-2"
              data-testid="button-save-draft"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" /> : <FileText className="w-4 h-4" />}
              Save Draft
            </button>
            <button
              onClick={() => createMutation.mutate({ ...newPost, status: newPost.scheduledAt ? "scheduled" : "draft" })}
              disabled={!newPost.title || !newPost.content || createMutation.isPending}
              className="btn-premium flex items-center gap-2"
              data-testid="button-schedule-post"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" /> : <Calendar className="w-4 h-4" />}
              {newPost.scheduledAt ? "Schedule Post" : "Save & Schedule Later"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-heading-md text-teal mb-4">Scheduled & Recent Posts</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-premium-card h-20" />)}
          </div>
        ) : socialPosts.length === 0 ? (
          <div className="card-bordered p-6 text-center">
            <div className="icon-container icon-lg icon-soft-teal mx-auto mb-3">
              <Share2 className="w-6 h-6" />
            </div>
            <p className="text-body-sm">No social posts yet. Create your first post above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {socialPosts.map((post) => {
              const Icon = PLATFORM_ICONS[post.platform] || Share2;
              return (
                <div key={post.id} className="card-bordered p-4 flex items-center gap-4" data-testid={`social-post-${post.id}`}>
                  <div className={`icon-container icon-md bg-gradient-to-br ${PLATFORM_COLORS[post.platform] || "from-gray-500 to-gray-600"} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-heading-sm text-teal truncate">{post.title}</h4>
                    <p className="text-caption truncate">{post.content?.substring(0, 60)}...</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${STATUS_BADGES[post.status]?.className}`}>
                    {STATUS_BADGES[post.status]?.label}
                  </span>
                  {post.scheduledAt && (
                    <span className="text-caption flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.scheduledAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsSection() {
  const { toast } = useToast();
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["/api/products"],
  });

  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    type: "ebook",
    price: "",
    status: "draft",
  });

  const createMutation = useMutation({
    mutationFn: async (productData) => {
      return await apiRequest("POST", "/api/products", productData);
    },
    onSuccess: () => {
      toast({ title: "Product created!", description: "Your digital product has been saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setNewProduct({ title: "", description: "", type: "ebook", price: "", status: "draft" });
      setShowForm(false);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const digitalProducts = Array.isArray(products) ? products : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-md text-teal">Digital Products</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-premium flex items-center gap-2"
          data-testid="button-new-product"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      {showForm && (
        <div className="card-bordered p-6">
          <h4 className="text-heading-sm text-teal mb-4">Create New Product</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-body-sm font-medium block mb-2">Product Type</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PRODUCT_TYPES).map(([type, { label, icon: Icon }]) => (
                  <button
                    key={type}
                    onClick={() => setNewProduct(p => ({ ...p, type }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                      newProduct.type === type
                        ? "bg-[var(--teal-600)] text-white border-[var(--teal-600)]"
                        : "bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]"
                    }`}
                    data-testid={`type-${type}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-body-sm font-medium block mb-2">Price (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))}
                  placeholder="0.00"
                  className="input-base pl-8"
                  step="0.01"
                  min="0"
                  data-testid="input-product-price"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-body-sm font-medium block mb-2">Title</label>
              <input
                type="text"
                value={newProduct.title}
                onChange={(e) => setNewProduct(p => ({ ...p, title: e.target.value }))}
                placeholder="Product title"
                className="input-base"
                data-testid="input-product-title"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-body-sm font-medium block mb-2">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe your product..."
                rows={3}
                className="input-base resize-none"
                data-testid="input-product-description"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost"
              data-testid="button-cancel-product"
            >
              Cancel
            </button>
            <button
              onClick={() => createMutation.mutate({
                ...newProduct,
                price: Math.round(parseFloat(newProduct.price || 0) * 100),
                slug: newProduct.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              })}
              disabled={!newProduct.title || createMutation.isPending}
              className="btn-premium flex items-center gap-2"
              data-testid="button-create-product"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" /> : <Plus className="w-4 h-4" />}
              Create Product
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-premium-card h-40" />)}
        </div>
      ) : digitalProducts.length === 0 ? (
        <div className="card-bordered p-8 text-center">
          <div className="icon-container icon-xl icon-soft-gold mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h4 className="text-heading-sm text-teal mb-2">No products yet</h4>
          <p className="text-body-sm mb-4">Create e-books, tools, courses, and templates to sell.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {digitalProducts.map((product) => {
            const TypeIcon = PRODUCT_TYPES[product.type]?.icon || Package;
            return (
              <div key={product.id} className="card-bordered p-5 hover:shadow-md transition-all" data-testid={`product-${product.id}`}>
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-lg icon-gradient-gold">
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-heading-sm text-teal">{product.title}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_BADGES[product.status]?.className}`}>
                        {STATUS_BADGES[product.status]?.label}
                      </span>
                    </div>
                    <p className="text-caption mb-2">{PRODUCT_TYPES[product.type]?.label}</p>
                    <p className="text-body-sm line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-heading-sm text-[var(--gold-600)]">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-caption">
                        <Download className="w-3 h-3" />
                        {product.salesCount || 0} sales
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ContentAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stats } = useQuery({
    queryKey: ["/api/content/stats"],
  });

  const contentStats = stats || {
    totalPosts: 0,
    publishedPosts: 0,
    socialPosts: 0,
    scheduledPosts: 0,
    totalProducts: 0,
    totalRevenue: 0,
  };

  return (
    <WellnessPageShell
      title="Content Admin"
      subtitle="Manage your content hub"
      benefits={pickBenefits(["agency","clarity","agency"], 3)}
      clarity={{
        what: "Content management dashboard.",
        why: "To create and manage platform content.",
        who: "For content administrators.",
        when: "As needed for content management.",
        where: "Right here.",
        how: "Navigate tabs to manage different content types."
      }}
      examples={[]}
    >
    <>
      <SEO 
        title="Content Admin - The Genuine Love Project"
        description="Manage blog posts, social media, and digital products from one dashboard."
      />
      
      <div className="min-h-screen v28-paper-bg p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
              data-testid="link-back-admin"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <div className="flex items-center gap-4">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal">Content Admin</h1>
                <p className="text-lead">Manage blogs, social media, and digital products</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FileText} label="Blog Posts" value={contentStats.totalPosts} color="sage" />
            <StatCard icon={Share2} label="Social Posts" value={contentStats.socialPosts} trend={contentStats.scheduledPosts > 0 ? `${contentStats.scheduledPosts} scheduled` : undefined} color="teal" />
            <StatCard icon={ShoppingBag} label="Products" value={contentStats.totalProducts} color="gold" />
            <StatCard icon={DollarSign} label="Revenue" value={`$${(contentStats.totalRevenue / 100).toFixed(0)}`} color="blush" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-[var(--sage-200)] p-1 rounded-xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--sage-100)] rounded-lg px-4 py-2" data-testid="tab-overview">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-[var(--sage-100)] rounded-lg px-4 py-2" data-testid="tab-blog">
                <FileText className="w-4 h-4 mr-2" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-[var(--sage-100)] rounded-lg px-4 py-2" data-testid="tab-social">
                <Share2 className="w-4 h-4 mr-2" />
                Social Media
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-[var(--sage-100)] rounded-lg px-4 py-2" data-testid="tab-products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-bordered p-6">
                  <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Schedule
                  </h3>
                  <div className="space-y-3">
                    <p className="text-body-sm text-center py-6 text-[var(--sage-500)]">
                      No scheduled content. Plan your posts in the Social Media tab.
                    </p>
                  </div>
                </div>
                
                <div className="card-bordered p-6">
                  <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      href="/write"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--sage-50)] hover:bg-[var(--sage-100)] border border-[var(--sage-200)] transition text-center"
                      data-testid="quick-action-blog"
                    >
                      <FileText className="w-6 h-6 text-[var(--sage-600)]" />
                      <span className="text-body-sm font-medium">Write Blog</span>
                    </Link>
                    <button
                      onClick={() => setActiveTab("social")}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--teal-50)] hover:bg-[var(--teal-100)] border border-[var(--teal-200)] transition text-center"
                      data-testid="quick-action-social"
                    >
                      <Share2 className="w-6 h-6 text-[var(--teal-600)]" />
                      <span className="text-body-sm font-medium">Social Post</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("products")}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--gold-50)] hover:bg-[var(--gold-100)] border border-[var(--gold-200)] transition text-center"
                      data-testid="quick-action-product"
                    >
                      <ShoppingBag className="w-6 h-6 text-[var(--gold-600)]" />
                      <span className="text-body-sm font-medium">Add Product</span>
                    </button>
                    <Link
                      href="/content-studio"
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--blush-50)] hover:bg-[var(--blush-100)] border border-[var(--blush-200)] transition text-center"
                      data-testid="quick-action-studio"
                    >
                      <Sparkles className="w-6 h-6 text-[var(--blush-600)]" />
                      <span className="text-body-sm font-medium">AI Studio</span>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="blog">
              <BlogSection />
            </TabsContent>

            <TabsContent value="social">
              <SocialMediaSection />
            </TabsContent>

            <TabsContent value="products">
              <ProductsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
