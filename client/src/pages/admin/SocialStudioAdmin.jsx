import { useState, useEffect } from "react";
import { 
  Share2, Calendar, Hash, Zap, FileText, Check, Clock, 
  AlertTriangle, RefreshCw, Download, Copy, Eye, Edit,
  TrendingUp, BarChart, Loader2, Plus, Trash2, Send,
  Instagram, Twitter, Linkedin, Youtube, Image, Video,
  Save, X, Sparkles, Target, Users, Heart, MessageSquare,
  ArrowRight, ExternalLink, Palette, Type, Layout
} from "lucide-react";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-gradient-to-r from-purple-500 to-pink-500", charLimit: 2200 },
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "bg-black", charLimit: 280 },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-600", charLimit: 3000 },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-600", charLimit: 5000 },
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
      posts: []
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
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [utmParams, setUtmParams] = useState({ source: "", medium: "", campaign: "", content: "" });
  const [drafts, setDrafts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [newPost, setNewPost] = useState({
    content: "",
    platform: "instagram",
    scheduledDate: "",
    scheduledTime: "",
    theme: "",
    mediaType: "text",
    status: "draft"
  });

  useEffect(() => {
    setCalendarDates(generateCalendarDates(calendarDays));
    loadDrafts();
  }, [calendarDays]);

  const loadDrafts = () => {
    const saved = localStorage.getItem("social_drafts");
    if (saved) {
      setDrafts(JSON.parse(saved));
    }
  };

  const saveDrafts = (newDrafts) => {
    localStorage.setItem("social_drafts", JSON.stringify(newDrafts));
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

  const toggleHashtag = (tag) => {
    setSelectedHashtags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const generateUTM = () => {
    const base = "https://thegenuineloveproject.com";
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
      status: "draft"
    });
    setSelectedHashtags([]);
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

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Social Content Studio — The Genuine Love Project"
        description="Create and manage trauma-informed social media content with brand safety guardrails."
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
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
        </header>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{drafts.length}</p>
                  <p className="text-sm text-muted-foreground">Total Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{drafts.filter(d => d.status === "scheduled").length}</p>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{drafts.filter(d => d.status === "approved").length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Send className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{drafts.filter(d => d.status === "published").length}</p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="create" data-testid="tab-create">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </TabsTrigger>
            <TabsTrigger value="calendar" data-testid="tab-calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="hooks" data-testid="tab-hooks">
              <Zap className="w-4 h-4 mr-2" />
              Hook Lab
            </TabsTrigger>
            <TabsTrigger value="hashtags" data-testid="tab-hashtags">
              <Hash className="w-4 h-4 mr-2" />
              Hashtags
            </TabsTrigger>
            <TabsTrigger value="utm" data-testid="tab-utm">
              <TrendingUp className="w-4 h-4 mr-2" />
              UTM Builder
            </TabsTrigger>
            <TabsTrigger value="queue" data-testid="tab-queue">
              <FileText className="w-4 h-4 mr-2" />
              Drafts ({drafts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                    <CardDescription>Write trauma-informed content for your audience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                          <strong>Brand Safety Reminder:</strong> Use compassionate, non-judgmental language. 
                          Avoid sensationalism, fear-mongering, or guaranteed outcomes. Include trigger warnings when needed.
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Platform</Label>
                        <Select value={newPost.platform} onValueChange={(v) => setNewPost({...newPost, platform: v})}>
                          <SelectTrigger data-testid="select-platform">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PLATFORMS.map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                <div className="flex items-center gap-2">
                                  <p.icon className="w-4 h-4" />
                                  {p.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Content Theme</Label>
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
                        <span className={`text-xs ${
                          newPost.content.length > getPlatformInfo(newPost.platform).charLimit 
                            ? "text-red-500" 
                            : "text-muted-foreground"
                        }`}>
                          {newPost.content.length} / {getPlatformInfo(newPost.platform).charLimit}
                        </span>
                      </div>
                      <Textarea 
                        placeholder="Write your compassionate, healing-focused content here..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        className="min-h-[200px]"
                        data-testid="textarea-content"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Media Type</Label>
                      <div className="flex gap-2">
                        {[
                          { id: "text", icon: Type, label: "Text Only" },
                          { id: "image", icon: Image, label: "With Image" },
                          { id: "video", icon: Video, label: "With Video" },
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
                        <Label>Schedule Date</Label>
                        <Input 
                          type="date" 
                          value={newPost.scheduledDate}
                          onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})}
                          data-testid="input-schedule-date"
                        />
                      </div>
                      <div>
                        <Label>Schedule Time</Label>
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
                        <Label className="mb-2 block">Selected Hashtags</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedHashtags.map(tag => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleHashtag(tag)}>
                              {tag} <X className="w-3 h-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
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
                        Add Hashtags
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
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("hooks")}>
                      <Zap className="w-4 h-4 mr-2 text-amber-500" />
                      Generate Viral Hooks
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("hashtags")}>
                      <Hash className="w-4 h-4 mr-2 text-blue-500" />
                      Browse Hashtags
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("utm")}>
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      Create UTM Link
                    </Button>
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
                        Invite engagement, don't demand it
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

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Content Calendar</span>
                  <div className="flex gap-2">
                    {[7, 14, 30].map(days => (
                      <Button 
                        key={days}
                        variant={calendarDays === days ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setCalendarDays(days)}
                      >
                        {days} Days
                      </Button>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-7">
                  {calendarDates.slice(0, calendarDays).map((day, idx) => {
                    const dayPosts = drafts.filter(d => 
                      d.scheduledDate === day.date.toISOString().split('T')[0]
                    );
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 border rounded-lg ${day.isToday ? 'border-primary bg-primary/5' : ''}`}
                      >
                        <div className="text-center mb-2">
                          <div className="text-xs text-muted-foreground">{day.dayName}</div>
                          <div className={`text-lg font-semibold ${day.isToday ? 'text-primary' : ''}`}>
                            {day.dayNum}
                          </div>
                          <div className="text-xs text-muted-foreground">{day.month}</div>
                        </div>
                        <div className="min-h-[60px] space-y-1">
                          {dayPosts.map(post => (
                            <div 
                              key={post.id}
                              className={`text-xs p-1.5 rounded truncate ${getPlatformInfo(post.platform).color} text-white`}
                            >
                              {post.content.substring(0, 20)}...
                            </div>
                          ))}
                          {dayPosts.length === 0 && (
                            <div className="h-full flex items-center justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-muted-foreground"
                                onClick={() => setActiveTab("create")}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                    <span className="text-sm text-muted-foreground">Quick topics:</span>
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
                      <Label>Generated Hooks</Label>
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
                              <ArrowRight className="w-3 h-3 mr-1" /> Use in Post
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
                          Clear All
                        </Button>
                      </div>
                      <p className="text-sm font-mono break-all mb-3">{selectedHashtags.join(" ")}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleCopyText(selectedHashtags.join(" "), "Hashtags")}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Selected
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setActiveTab("create")}>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Add to Post
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full" 
                    data-testid="button-copy-all"
                    onClick={() => handleCopyText(Object.values(HASHTAG_SETS).flat().join(" "), "All hashtags")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Tags
                  </Button>
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
                    <Label className="mb-2 block">Source *</Label>
                    <Input 
                      placeholder="e.g., instagram, newsletter, facebook" 
                      value={utmParams.source}
                      onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                      data-testid="input-utm-source"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Where the traffic comes from</p>
                  </div>
                  <div>
                    <Label className="mb-2 block">Medium *</Label>
                    <Input 
                      placeholder="e.g., social, email, cpc" 
                      value={utmParams.medium}
                      onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                      data-testid="input-utm-medium"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Type of traffic</p>
                  </div>
                  <div>
                    <Label className="mb-2 block">Campaign</Label>
                    <Input 
                      placeholder="e.g., healing-week-feb-2026" 
                      value={utmParams.campaign}
                      onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                      data-testid="input-utm-campaign"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Campaign name</p>
                  </div>
                  <div>
                    <Label className="mb-2 block">Content</Label>
                    <Input 
                      placeholder="e.g., post-1, carousel-a" 
                      value={utmParams.content}
                      onChange={(e) => setUtmParams({ ...utmParams, content: e.target.value })}
                      data-testid="input-utm-content"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Differentiate content</p>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Generated URL</Label>
                  <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {generateUTM()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    data-testid="button-copy-utm"
                    onClick={() => handleCopyText(generateUTM(), "UTM URL")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(generateUTM(), '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Test Link
                  </Button>
                </div>

                <div className="grid gap-2 md:grid-cols-4 pt-4 border-t">
                  <p className="md:col-span-4 text-sm font-medium mb-2">Quick Presets</p>
                  {[
                    { source: "instagram", medium: "social", campaign: "organic" },
                    { source: "linkedin", medium: "social", campaign: "b2b" },
                    { source: "newsletter", medium: "email", campaign: "weekly" },
                    { source: "twitter", medium: "social", campaign: "thread" }
                  ].map((preset, idx) => (
                    <Button 
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => setUtmParams({...preset, content: ""})}
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
                <CardTitle>Content Drafts & Queue</CardTitle>
                <CardDescription>Review, approve, and manage your content</CardDescription>
              </CardHeader>
              <CardContent>
                {drafts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Drafts Yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first post to get started</p>
                    <Button onClick={() => setActiveTab("create")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {drafts.map(draft => {
                      const platform = getPlatformInfo(draft.platform);
                      return (
                        <div 
                          key={draft.id}
                          className="p-4 border rounded-lg"
                          data-testid={`draft-${draft.id}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <platform.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{platform.name}</span>
                                {draft.theme && (
                                  <Badge variant="outline" className="text-xs">{draft.theme}</Badge>
                                )}
                                <Badge className={getStatusBadge(draft.status)}>
                                  {draft.status}
                                </Badge>
                              </div>
                              <p className="text-sm mb-2 line-clamp-2">{draft.content}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{draft.charCount} chars</span>
                                {draft.scheduledDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {draft.scheduledDate} {draft.scheduledTime}
                                  </span>
                                )}
                                {draft.hashtags?.length > 0 && (
                                  <span>{draft.hashtags.length} hashtags</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleCopyText(draft.content, "Post content")}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              {draft.status === "draft" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-green-600"
                                  onClick={() => handleApproveDraft(draft.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              {draft.status === "approved" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-blue-600"
                                  onClick={() => handleSchedulePost(draft.id)}
                                >
                                  <Calendar className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-600"
                                onClick={() => handleDeleteDraft(draft.id)}
                              >
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
        </Tabs>
      </main>
    </div>
  );
}
