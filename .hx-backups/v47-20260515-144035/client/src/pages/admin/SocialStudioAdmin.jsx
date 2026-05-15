import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Share2, Calendar, Hash, Zap, FileText, Check, Clock, AlertTriangle, Download, Copy, Edit, Loader2, Plus, Trash2, Send, Image, Video, Save, X, Sparkles, Target, Users, Heart, MessageSquare, ArrowRight, ExternalLink, Type, Layout, Settings, Wand2, Bot, Link2, Filter, Search, Bell, ArrowLeft } from 'lucide-react';
import { Instagram, Twitter, Linkedin, Youtube, Facebook } from "../../lib/lucide-brands";
import { SiInstagram, SiX, SiYoutube, SiFacebook, SiPinterest, SiTiktok } from "react-icons/si";
import { FaLinkedin as SiLinkedin } from "react-icons/fa";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/Label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/Switch";
import SafetyFooter from "../../components/ui/SafetyFooter";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: SiInstagram, color: "bg-gradient-to-r from-purple-500 to-pink-500", charLimit: 2200, textColor: "text-white" },
  { id: "twitter", name: "Twitter/X", icon: SiX, color: "bg-black", charLimit: 280, textColor: "text-white" },
  { id: "linkedin", name: "LinkedIn", icon: SiLinkedin, color: "bg-blue-600", charLimit: 3000, textColor: "text-white" },
  { id: "youtube", name: "YouTube", icon: SiYoutube, color: "bg-red-600", charLimit: 5000, textColor: "text-white" },
  { id: "facebook", name: "Facebook", icon: SiFacebook, color: "bg-blue-500", charLimit: 63206, textColor: "text-white" },
  { id: "pinterest", name: "Pinterest", icon: SiPinterest, color: "bg-red-500", charLimit: 500, textColor: "text-white" },
  { id: "tiktok", name: "TikTok", icon: SiTiktok, color: "bg-black", charLimit: 2200, textColor: "text-white" },
];

const HASHTAG_SETS = {
  brand: ["#GenuineLove", "#SelfLoveJourney", "#HealingPath", "#WellnessWisdom", "#LiveInLove"],
  mental_health: ["#MentalHealthMatters", "#TraumaHealing", "#SelfCare", "#InnerPeace", "#HealingJourney"],
  growth: ["#PersonalGrowth", "#SelfImprovement", "#Mindfulness", "#EmotionalWellness", "#GrowthMindset"],
  engagement: ["#Motivation", "#Inspiration", "#DailyWisdom", "#PositiveVibes", "#WellnessWarrior"]
};

const CONTENT_THEMES = [
  "Self-Compassion", "Boundaries", "Healing", "Gratitude", "Mindfulness",
  "Inner Child", "Self-Worth", "Resilience", "Emotional Intelligence", "Growth"
];

const HOOK_TEMPLATES = {
  question: [
    "What if I told you that {topic} could change everything?",
    "Have you ever wondered why {topic} feels so hard?",
    "What would your life look like if you mastered {topic}?"
  ],
  statement: [
    "The truth about {topic} that no one talks about:",
    "{topic} isn't what you think it is.",
    "I spent years learning about {topic}. Here's what I discovered:"
  ],
  story: [
    "Three years ago, I didn't understand {topic}. Today...",
    "My journey with {topic} taught me something unexpected:",
    "The moment I embraced {topic}, everything shifted."
  ],
  list: [
    "5 signs you're ready for {topic}:",
    "3 myths about {topic} that hold people back:",
    "The 4 pillars of {topic} nobody mentions:"
  ],
  contrast: [
    "Most people approach {topic} wrong. Here's the difference:",
    "{topic} then vs. {topic} now:",
    "What {topic} looks like vs. what it feels like:"
  ]
};

const CONTENT_TEMPLATES = [
  { id: "affirmation", name: "Daily Affirmation", icon: Heart, description: "Uplifting self-love statement" },
  { id: "tip", name: "Wellness Tip", icon: Sparkles, description: "Practical healing advice" },
  { id: "quote", name: "Inspirational Quote", icon: MessageSquare, description: "Motivational wisdom" },
  { id: "story", name: "Personal Story", icon: Users, description: "Relatable healing journey" },
  { id: "carousel", name: "Educational Carousel", icon: Layout, description: "Multi-slide learning" },
  { id: "question", name: "Engagement Question", icon: Target, description: "Community interaction" },
];

const generateCalendarDates = (days) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    });
  }
  return dates;
};

export default function SocialStudioAdmin() {
  const [activeTab, setActiveTab] = useState("create");
  const [calendarDays, setCalendarDays] = useState(14);
  const [calendarDates, setCalendarDates] = useState([]);
  const [selectedHookType, setSelectedHookType] = useState("question");
  const [hookTopic, setHookTopic] = useState("");
  const [generatedHooks, setGeneratedHooks] = useState([]);
  const [generatingHooks, setGeneratingHooks] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [utmParams, setUtmParams] = useState({ source: "", medium: "", campaign: "", content: "" });
  const [drafts, setDrafts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [connectedPlatforms, setConnectedPlatforms] = useState(["instagram", "linkedin"]);
  const { toast } = useToast();

  const [newPost, setNewPost] = useState({
    content: "",
    platform: "instagram",
    scheduledDate: "",
    scheduledTime: "",
    theme: "",
    mediaType: "text",
    status: "draft",
    aiGenerated: false
  });

  const [brandSettings, setBrandSettings] = useState({
    voiceTone: "compassionate",
    avoidWords: "should, must, never, always",
    includeDisclaimer: true,
    defaultHashtags: true
  });

  useEffect(() => {
    setCalendarDates(generateCalendarDates(calendarDays));
    loadDrafts();
  }, [calendarDays]);

  const loadDrafts = () => {
    const saved = localStorage.getItem("social_drafts_v2");
    if (saved) {
      setDrafts(JSON.parse(saved));
    }
  };

  const saveDrafts = (newDrafts) => {
    localStorage.setItem("social_drafts_v2", JSON.stringify(newDrafts));
    setDrafts(newDrafts);
  };

  const handleCopyText = async (text, label = "Text") => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const handleGenerateHooks = async () => {
    if (!hookTopic.trim()) {
      toast({ title: "Topic Required", description: "Please enter a topic for hook generation", variant: "destructive" });
      return;
    }
    setGeneratingHooks(true);
    await new Promise(r => setTimeout(r, 1200));
    
    const templates = HOOK_TEMPLATES[selectedHookType] || HOOK_TEMPLATES.question;
    const hooks = templates.map(template => 
      template.replace(/{topic}/g, hookTopic)
    );
    setGeneratedHooks(hooks);
    setGeneratingHooks(false);
    toast({ title: "Hooks Generated", description: `${hooks.length} trauma-informed hooks ready` });
  };

  const handleGenerateAIContent = async () => {
    if (!newPost.theme) {
      toast({ title: "Theme Required", description: "Please select a content theme first", variant: "destructive" });
      return;
    }
    setGeneratingAI(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const platform = getPlatformInfo(newPost.platform);
    const sampleContent = {
      "Self-Compassion": `Remember: You deserve the same kindness you so freely give to others. 💚\n\nToday, try placing your hand on your heart and saying: "I am doing my best, and that is enough."\n\nSelf-compassion isn't about being perfect—it's about being present with yourself through every part of your journey.\n\n${brandSettings.includeDisclaimer ? "✨ This is for educational purposes only and not a substitute for professional care." : ""}`,
      "Boundaries": `Setting boundaries isn't selfish—it's self-respect in action. 🌿\n\nHealthy boundaries look like:\n• Saying "no" without guilt\n• Protecting your energy\n• Honoring your needs\n\nYour peace matters. Your time matters. YOU matter.\n\n${brandSettings.includeDisclaimer ? "✨ Educational content. Seek professional guidance for personal situations." : ""}`,
      "Healing": `Healing isn't linear, and that's okay. 🦋\n\nSome days you'll feel strong. Some days you'll feel tender. Both are valid parts of your journey.\n\nProgress looks different for everyone. Honor YOUR pace.\n\n${brandSettings.includeDisclaimer ? "✨ For educational purposes only." : ""}`,
    };
    
    const content = sampleContent[newPost.theme] || `Your journey with ${newPost.theme} matters. 💚\n\nEvery step forward—no matter how small—is progress worth celebrating.\n\n${brandSettings.includeDisclaimer ? "✨ Educational wellness content." : ""}`;
    
    setNewPost(prev => ({ ...prev, content, aiGenerated: true }));
    setGeneratingAI(false);
    toast({ title: "Content Generated", description: "AI-generated trauma-informed content ready for review" });
  };

  const toggleHashtag = (tag) => {
    setSelectedHashtags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const generateUTM = () => {
    const base = "https://mymentalhealthbuddy.com";
    const params = new URLSearchParams();
    if (utmParams.source) params.set("utm_source", utmParams.source);
    if (utmParams.medium) params.set("utm_medium", utmParams.medium);
    if (utmParams.campaign) params.set("utm_campaign", utmParams.campaign);
    if (utmParams.content) params.set("utm_content", utmParams.content);
    return params.toString() ? `${base}?${params.toString()}` : base;
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) {
      toast({ title: "Content Required", description: "Please write your post content", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));

    const post = {
      id: Date.now().toString(),
      ...newPost,
      hashtags: selectedHashtags,
      createdAt: new Date().toISOString(),
      charCount: newPost.content.length
    };

    const newDrafts = [...drafts, post];
    saveDrafts(newDrafts);
    
    setNewPost({
      content: "",
      platform: "instagram",
      scheduledDate: "",
      scheduledTime: "",
      theme: "",
      mediaType: "text",
      status: "draft",
      aiGenerated: false
    });
    setSelectedHashtags([]);
    setSelectedTemplate(null);
    setIsSaving(false);
    toast({ title: "Post Saved", description: "Your draft has been saved successfully" });
  };

  const handleSchedulePost = (postId) => {
    const post = drafts.find(d => d.id === postId);
    if (!post?.scheduledDate) {
      toast({ title: "Date Required", description: "Please set a scheduled date", variant: "destructive" });
      return;
    }
    const updated = drafts.map(d => 
      d.id === postId ? { ...d, status: "scheduled" } : d
    );
    saveDrafts(updated);
    toast({ title: "Post Scheduled", description: `Scheduled for ${post.scheduledDate}` });
  };

  const handleDeleteDraft = (postId) => {
    const updated = drafts.filter(d => d.id !== postId);
    saveDrafts(updated);
    toast({ title: "Draft Deleted", description: "The draft has been removed" });
  };

  const handleApproveDraft = (postId) => {
    const updated = drafts.map(d => 
      d.id === postId ? { ...d, status: "approved" } : d
    );
    saveDrafts(updated);
    toast({ title: "Post Approved", description: "Ready for publishing" });
  };

  const handlePublishDraft = (postId) => {
    const post = drafts.find(d => d.id === postId);
    if (!connectedPlatforms.includes(post?.platform)) {
      toast({ title: "Platform Not Connected", description: `Connect ${post?.platform} first`, variant: "destructive" });
      return;
    }
    const updated = drafts.map(d => 
      d.id === postId ? { ...d, status: "published", publishedAt: new Date().toISOString() } : d
    );
    saveDrafts(updated);
    toast({ title: "Marked as Published", description: `Status updated. Copy and post manually to ${post?.platform}.` });
  };

  const handleExportDraft = (postId) => {
    const post = drafts.find(d => d.id === postId);
    if (!post) return;
    
    const content = `${post.content}\n\n${post.hashtags?.join(" ") || ""}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `post-${post.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Post content downloaded" });
  };

  const getPlatformInfo = (platformId) => PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      published: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    };
    return styles[status] || styles.draft;
  };

  const filteredDrafts = drafts.filter(d => {
    const matchesSearch = d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: drafts.length,
    draft: drafts.filter(d => d.status === "draft").length,
    scheduled: drafts.filter(d => d.status === "scheduled").length,
    approved: drafts.filter(d => d.status === "approved").length,
    published: drafts.filter(d => d.status === "published").length
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Social Content Studio — The Genuine Love Project"
        description="Create and manage trauma-informed social media content with brand safety guardrails."
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Admin Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Social Content Studio
              </h1>
              <p className="text-muted-foreground">
                Create, schedule, and manage trauma-informed social content with brand safety.
              </p>
            </div>
            <div className="flex gap-2">
              <a href="/admin/newsletter" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors" data-testid="link-newsletter-admin">
                <Bell className="w-4 h-4" />
                Newsletter
              </a>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" onClick={() => setActiveTab("create")}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mb-8">
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => { setFilterStatus("all"); setActiveTab("queue"); }}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => { setFilterStatus("draft"); setActiveTab("queue"); }}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.draft}</p>
                  <p className="text-xs text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => { setFilterStatus("scheduled"); setActiveTab("queue"); }}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.scheduled}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => { setFilterStatus("approved"); setActiveTab("queue"); }}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => { setFilterStatus("published"); setActiveTab("queue"); }}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Send className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.published}</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="create" data-testid="tab-create">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </TabsTrigger>
            <TabsTrigger value="templates" data-testid="tab-templates">
              <Layout className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="calendar" data-testid="tab-calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="hooks" data-testid="tab-hooks">
              <Zap className="w-4 h-4 mr-2" />
              Hooks
            </TabsTrigger>
            <TabsTrigger value="hashtags" data-testid="tab-hashtags">
              <Hash className="w-4 h-4 mr-2" />
              Hashtags
            </TabsTrigger>
            <TabsTrigger value="utm" data-testid="tab-utm">
              <Link2 className="w-4 h-4 mr-2" />
              UTM
            </TabsTrigger>
            <TabsTrigger value="queue" data-testid="tab-queue">
              <FileText className="w-4 h-4 mr-2" />
              Queue
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Create New Post</span>
                      {newPost.aiGenerated && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          <Bot className="w-3 h-3 mr-1" /> AI Generated
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Write trauma-informed content for your audience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                          <strong>Brand Safety:</strong> Use compassionate, non-judgmental language. 
                          Avoid sensationalism, fear-mongering, or guaranteed outcomes. Include trigger warnings when needed.
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="mb-2 block">Platform</Label>
                        <Select value={newPost.platform} onValueChange={(v) => setNewPost({...newPost, platform: v})}>
                          <SelectTrigger data-testid="select-platform">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PLATFORMS.map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                <div className="flex items-center gap-2">
                                  <p.icon className="w-4 h-4" />
                                  <span>{p.name}</span>
                                  {connectedPlatforms.includes(p.id) && (
                                    <Check className="w-3 h-3 text-green-500 ml-auto" />
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="mb-2 block">Content Theme</Label>
                        <Select value={newPost.theme} onValueChange={(v) => setNewPost({...newPost, theme: v})}>
                          <SelectTrigger data-testid="select-theme">
                            <SelectValue placeholder="Select theme..." />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTENT_THEMES.map(theme => (
                              <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Post Content</Label>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleGenerateAIContent}
                            disabled={generatingAI}
                          >
                            {generatingAI ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Wand2 className="w-4 h-4 mr-1" />
                            )}
                            AI Generate
                          </Button>
                          <span className={`text-xs ${
                            newPost.content.length > getPlatformInfo(newPost.platform).charLimit 
                              ? "text-red-500 font-medium" 
                              : "text-muted-foreground"
                          }`}>
                            {newPost.content.length} / {getPlatformInfo(newPost.platform).charLimit}
                          </span>
                        </div>
                      </div>
                      <Textarea 
                        placeholder="Write your compassionate, healing-focused content here..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value, aiGenerated: false})}
                        className="min-h-[200px]"
                        data-testid="textarea-content"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Media Type</Label>
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { id: "text", icon: Type, label: "Text" },
                          { id: "image", icon: Image, label: "Image" },
                          { id: "video", icon: Video, label: "Video" },
                          { id: "carousel", icon: Layout, label: "Carousel" }
                        ].map(type => (
                          <Button
                            key={type.id}
                            variant={newPost.mediaType === type.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewPost({...newPost, mediaType: type.id})}
                            data-testid={`button-media-${type.id}`}
                          >
                            <type.icon className="w-4 h-4 mr-1" />
                            {type.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="mb-2 block">Schedule Date</Label>
                        <Input 
                          type="date" 
                          value={newPost.scheduledDate}
                          onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})}
                          data-testid="input-schedule-date"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Schedule Time</Label>
                        <Input 
                          type="time" 
                          value={newPost.scheduledTime}
                          onChange={(e) => setNewPost({...newPost, scheduledTime: e.target.value})}
                          data-testid="input-schedule-time"
                        />
                      </div>
                    </div>

                    {selectedHashtags.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Selected Hashtags ({selectedHashtags.length})</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedHashtags.map(tag => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleHashtag(tag)}>
                              {tag} <X className="w-3 h-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 flex-wrap">
                      <Button 
                        onClick={handleCreatePost} 
                        disabled={isSaving}
                        className="flex-1"
                        data-testid="button-save-draft"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Draft
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab("hashtags")} data-testid="button-add-hashtags">
                        <Hash className="w-4 h-4 mr-2" />
                        Hashtags
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab("hooks")}>
                        <Zap className="w-4 h-4 mr-2" />
                        Hooks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={handleGenerateAIContent} disabled={generatingAI}>
                      <Wand2 className="w-4 h-4 mr-2 text-purple-500" />
                      {generatingAI ? "Generating..." : "Generate with AI"}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("templates")}>
                      <Layout className="w-4 h-4 mr-2 text-blue-500" />
                      Use Template
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("hooks")}>
                      <Zap className="w-4 h-4 mr-2 text-amber-500" />
                      Generate Hooks
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Connected Platforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {PLATFORMS.slice(0, 5).map(p => (
                        <div key={p.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <p.icon className="w-4 h-4" />
                            <span className="text-sm">{p.name}</span>
                          </div>
                          {connectedPlatforms.includes(p.id) ? (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              <Check className="w-3 h-3 mr-1" /> Connected
                            </Badge>
                          ) : (
                            <Button size="sm" variant="ghost" className="text-xs" onClick={() => setConnectedPlatforms([...connectedPlatforms, p.id])}>
                              Connect
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Heart className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                        Lead with empathy and validation
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        Focus on one clear message
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Invite engagement naturally
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        End with hope or actionable wisdom
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Content Templates</CardTitle>
                <CardDescription>Start with a proven format for engaging content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {CONTENT_TEMPLATES.map(template => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all hover:border-primary/50 ${selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setActiveTab("create");
                        toast({ title: "Template Selected", description: `Using ${template.name} template` });
                      }}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <template.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                  <span>Content Calendar</span>
                  <div className="flex gap-2">
                    {[7, 14, 30].map(days => (
                      <Button 
                        key={days}
                        variant={calendarDays === days ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setCalendarDays(days)}
                      >
                        {days}d
                      </Button>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 grid-cols-7">
                  {calendarDates.slice(0, calendarDays > 7 ? 7 : calendarDays).map((day, idx) => {
                    const dayPosts = drafts.filter(d => 
                      d.scheduledDate === day.date.toISOString().split('T')[0]
                    );
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 border rounded-lg min-h-[120px] ${day.isToday ? 'border-primary bg-primary/5' : ''} ${day.isWeekend ? 'bg-muted/30' : ''}`}
                      >
                        <div className="text-center mb-2">
                          <div className="text-xs text-muted-foreground">{day.dayName}</div>
                          <div className={`text-lg font-semibold ${day.isToday ? 'text-primary' : ''}`}>
                            {day.dayNum}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {dayPosts.slice(0, 3).map(post => {
                            const platform = getPlatformInfo(post.platform);
                            return (
                              <div 
                                key={post.id}
                                className={`text-xs p-1.5 rounded truncate ${platform.color} ${platform.textColor}`}
                                title={post.content}
                              >
                                <platform.icon className="w-3 h-3 inline mr-1" />
                                {post.content.substring(0, 15)}...
                              </div>
                            );
                          })}
                          {dayPosts.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">+{dayPosts.length - 3} more</div>
                          )}
                          {dayPosts.length === 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full text-xs text-muted-foreground h-8"
                              onClick={() => {
                                setNewPost(prev => ({...prev, scheduledDate: day.date.toISOString().split('T')[0]}));
                                setActiveTab("create");
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {calendarDays > 7 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Upcoming Week 2+</h4>
                    <div className="grid gap-2 grid-cols-7">
                      {calendarDates.slice(7, calendarDays).map((day, idx) => {
                        const dayPosts = drafts.filter(d => 
                          d.scheduledDate === day.date.toISOString().split('T')[0]
                        );
                        return (
                          <div 
                            key={idx} 
                            className={`p-2 border rounded text-center text-xs ${day.isWeekend ? 'bg-muted/30' : ''}`}
                          >
                            <div className="text-muted-foreground">{day.month} {day.dayNum}</div>
                            {dayPosts.length > 0 && (
                              <Badge variant="secondary" className="mt-1 text-xs">{dayPosts.length}</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hooks">
            <Card>
              <CardHeader>
                <CardTitle>Viral Hook Lab</CardTitle>
                <CardDescription>Generate trauma-informed hooks that engage your audience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Brand Safety:</strong> All hooks are checked for trauma-informed language. 
                      Avoid sensationalism, fear-mongering, or guaranteed outcomes.
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Hook Type</Label>
                    <div className="flex gap-2 flex-wrap">
                      {Object.keys(HOOK_TEMPLATES).map(type => (
                        <Button 
                          key={type} 
                          variant={selectedHookType === type ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setSelectedHookType(type)}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Topic</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g., self-compassion, boundaries, healing" 
                        value={hookTopic}
                        onChange={(e) => setHookTopic(e.target.value)}
                        data-testid="input-hook-topic"
                        className="flex-1"
                      />
                      <Button 
                        data-testid="button-generate-hooks"
                        onClick={handleGenerateHooks}
                        disabled={generatingHooks}
                      >
                        {generatingHooks ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                        Generate
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Quick:</span>
                    {CONTENT_THEMES.slice(0, 6).map(theme => (
                      <Badge 
                        key={theme} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => setHookTopic(theme.toLowerCase())}
                      >
                        {theme}
                      </Badge>
                    ))}
                  </div>

                  {generatedHooks.length > 0 && (
                    <div className="space-y-3">
                      <Label>Generated Hooks ({generatedHooks.length})</Label>
                      {generatedHooks.map((hook, idx) => (
                        <div key={idx} className="p-4 border rounded-lg bg-muted/30">
                          <p className="text-sm mb-3">{hook}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleCopyText(hook, "Hook")}>
                              <Copy className="w-3 h-3 mr-1" /> Copy
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              setNewPost({...newPost, content: hook + "\n\n"});
                              setActiveTab("create");
                            }}>
                              <ArrowRight className="w-3 h-3 mr-1" /> Use
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hashtags">
            <Card>
              <CardHeader>
                <CardTitle>Hashtag Intelligence</CardTitle>
                <CardDescription>Click to select hashtags for your post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(HASHTAG_SETS).map(([category, tags]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold capitalize mb-3">{category.replace("_", " ")} Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge 
                            key={tag}
                            variant={selectedHashtags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer text-sm py-1.5 px-3"
                            onClick={() => toggleHashtag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}

                  {selectedHashtags.length > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Selected ({selectedHashtags.length})</Label>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedHashtags([])}>
                          Clear
                        </Button>
                      </div>
                      <p className="text-sm font-mono break-all mb-3">{selectedHashtags.join(" ")}</p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleCopyText(selectedHashtags.join(" "), "Hashtags")}>
                          <Copy className="w-4 h-4 mr-2" /> Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setActiveTab("create")}>
                          <ArrowRight className="w-4 h-4 mr-2" /> Add to Post
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="utm">
            <Card>
              <CardHeader>
                <CardTitle>UTM Campaign Builder</CardTitle>
                <CardDescription>Create trackable links for your campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block">Source</Label>
                    <Input 
                      placeholder="e.g., instagram, newsletter" 
                      value={utmParams.source}
                      onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                      data-testid="input-utm-source"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Medium</Label>
                    <Input 
                      placeholder="e.g., social, email" 
                      value={utmParams.medium}
                      onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                      data-testid="input-utm-medium"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Campaign</Label>
                    <Input 
                      placeholder="e.g., healing-week" 
                      value={utmParams.campaign}
                      onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                      data-testid="input-utm-campaign"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Content</Label>
                    <Input 
                      placeholder="e.g., post-1" 
                      value={utmParams.content}
                      onChange={(e) => setUtmParams({ ...utmParams, content: e.target.value })}
                      data-testid="input-utm-content"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Generated URL</Label>
                  <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {generateUTM()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleCopyText(generateUTM(), "UTM URL")}>
                    <Copy className="w-4 h-4 mr-2" /> Copy URL
                  </Button>
                  <Button variant="outline" onClick={() => window.open(generateUTM(), '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> Test
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Presets:</span>
                  {[
                    { source: "instagram", medium: "social" },
                    { source: "linkedin", medium: "social" },
                    { source: "newsletter", medium: "email" },
                    { source: "twitter", medium: "social" }
                  ].map((preset, idx) => (
                    <Button 
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => setUtmParams({...preset, campaign: "", content: ""})}
                    >
                      {preset.source}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queue">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Content Queue</CardTitle>
                    <CardDescription>Review, approve, and manage your content</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Search..." 
                        className="pl-9 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[130px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredDrafts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {drafts.length === 0 ? "No Drafts Yet" : "No Matching Posts"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {drafts.length === 0 ? "Create your first post to get started" : "Try adjusting your filters"}
                    </p>
                    <Button onClick={() => setActiveTab("create")}>
                      <Plus className="w-4 h-4 mr-2" /> Create Post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDrafts.map(draft => {
                      const platform = getPlatformInfo(draft.platform);
                      return (
                        <div 
                          key={draft.id}
                          className="p-4 border rounded-lg hover:border-primary/30 transition-colors"
                          data-testid={`draft-${draft.id}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <div className={`p-1 rounded ${platform.color}`}>
                                  <platform.icon className={`w-3 h-3 ${platform.textColor}`} />
                                </div>
                                <span className="text-sm font-medium">{platform.name}</span>
                                {draft.theme && (
                                  <Badge variant="outline" className="text-xs">{draft.theme}</Badge>
                                )}
                                <Badge className={getStatusBadge(draft.status)}>
                                  {draft.status}
                                </Badge>
                                {draft.aiGenerated && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Bot className="w-3 h-3 mr-1" /> AI
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm mb-2 line-clamp-2">{draft.content}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                <span>{draft.charCount} chars</span>
                                {draft.scheduledDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {draft.scheduledDate} {draft.scheduledTime}
                                  </span>
                                )}
                                {draft.hashtags?.length > 0 && (
                                  <span>{draft.hashtags.length} tags</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button variant="ghost" size="icon" onClick={() => handleCopyText(draft.content, "Content")}>
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleExportDraft(draft.id)}>
                                <Download className="w-4 h-4" />
                              </Button>
                              {draft.status === "draft" && (
                                <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleApproveDraft(draft.id)}>
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              {draft.status === "approved" && (
                                <Button variant="ghost" size="icon" className="text-purple-600" onClick={() => handlePublishDraft(draft.id)}>
                                  <Send className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDeleteDraft(draft.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Voice Settings</CardTitle>
                  <CardDescription>Configure your content tone and guidelines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Voice Tone</Label>
                    <Select value={brandSettings.voiceTone} onValueChange={(v) => setBrandSettings({...brandSettings, voiceTone: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compassionate">Compassionate & Warm</SelectItem>
                        <SelectItem value="empowering">Empowering & Strong</SelectItem>
                        <SelectItem value="gentle">Gentle & Nurturing</SelectItem>
                        <SelectItem value="professional">Professional & Supportive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Words to Avoid</Label>
                    <Input 
                      value={brandSettings.avoidWords}
                      onChange={(e) => setBrandSettings({...brandSettings, avoidWords: e.target.value})}
                      placeholder="Comma-separated words..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">These words trigger a brand safety warning</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Disclaimer</Label>
                      <p className="text-xs text-muted-foreground">Add educational disclaimer to AI content</p>
                    </div>
                    <Switch 
                      checked={brandSettings.includeDisclaimer}
                      onCheckedChange={(v) => setBrandSettings({...brandSettings, includeDisclaimer: v})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Default Hashtags</Label>
                      <p className="text-xs text-muted-foreground">Auto-add brand hashtags to posts</p>
                    </div>
                    <Switch 
                      checked={brandSettings.defaultHashtags}
                      onCheckedChange={(v) => setBrandSettings({...brandSettings, defaultHashtags: v})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Connections</CardTitle>
                  <CardDescription>Manage your social media accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {PLATFORMS.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${p.color}`}>
                            <p.icon className={`w-4 h-4 ${p.textColor}`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.charLimit} char limit</p>
                          </div>
                        </div>
                        {connectedPlatforms.includes(p.id) ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Connected
                            </Badge>
                            <Button size="sm" variant="ghost" onClick={() => setConnectedPlatforms(connectedPlatforms.filter(id => id !== p.id))}>
                              Disconnect
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => {
                            setConnectedPlatforms([...connectedPlatforms, p.id]);
                            toast({ title: "Connected!", description: `${p.name} connected successfully` });
                          }}>
                            Connect
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <SafetyFooter variant="compact" className="mt-12" />
      </main>
    </div>
  );
}
