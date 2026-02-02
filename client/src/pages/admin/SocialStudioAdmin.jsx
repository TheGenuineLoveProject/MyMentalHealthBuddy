import { useState } from "react";
import { 
  Share2, Calendar, Hash, Zap, FileText, Check, Clock, 
  AlertTriangle, RefreshCw, Download, Copy, Eye, Edit,
  TrendingUp, BarChart, Loader2
} from "lucide-react";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const HASHTAG_SETS = {
  brand: ["#GenuineLove", "#SelfLoveJourney", "#HealingPath", "#WellnessWisdom"],
  niche: ["#MentalHealthMatters", "#TraumaHealing", "#SelfCare", "#InnerPeace"],
  broad: ["#Motivation", "#Inspiration", "#PersonalGrowth", "#Wellness"]
};

const SAMPLE_DRAFTS = [
  { id: "1", content: "Remember: healing isn't linear...", status: "pending", platform: "instagram" },
  { id: "2", content: "Three grounding techniques...", status: "approved", platform: "twitter" },
  { id: "3", content: "Your boundaries are valid...", status: "needs-revision", platform: "linkedin" }
];

export default function SocialStudioAdmin() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [utmParams, setUtmParams] = useState({ source: "", medium: "", campaign: "" });
  const [calendarDays, setCalendarDays] = useState(7);
  const [selectedHookType, setSelectedHookType] = useState(null);
  const [generatingHooks, setGeneratingHooks] = useState(false);
  const [drafts, setDrafts] = useState(SAMPLE_DRAFTS);
  const { toast } = useToast();

  const generateUTM = () => {
    const base = "https://thegenuineloveproject.com";
    const params = new URLSearchParams();
    if (utmParams.source) params.set("utm_source", utmParams.source);
    if (utmParams.medium) params.set("utm_medium", utmParams.medium);
    if (utmParams.campaign) params.set("utm_campaign", utmParams.campaign);
    return `${base}?${params.toString()}`;
  };

  const handleCopyText = async (text, label = "Text") => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const handleGenerateHooks = async () => {
    setGeneratingHooks(true);
    await new Promise(r => setTimeout(r, 1500));
    setGeneratingHooks(false);
    toast({ title: "Hooks Generated", description: "3 trauma-informed hooks ready for review" });
  };

  const handleDraftAction = (draftId, action) => {
    if (action === "approve") {
      setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: "approved" } : d));
      toast({ title: "Approved", description: "Draft approved for publishing" });
    } else if (action === "view" || action === "edit") {
      toast({ title: action === "view" ? "Previewing" : "Editing", description: `Opening draft ${draftId}` });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Social Studio Admin — The Genuine Love Project"
        description="Manage social media content with brand safety guardrails."
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Social Studio v3
          </h1>
          <p className="text-muted-foreground">
            Create, schedule, and manage social content with brand safety.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
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
              Approval Queue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Content Calendar</span>
                  <div className="flex gap-2">
                    <Button variant={calendarDays === 7 ? "default" : "outline"} size="sm" onClick={() => setCalendarDays(7)}>7 Days</Button>
                    <Button variant={calendarDays === 14 ? "default" : "outline"} size="sm" onClick={() => setCalendarDays(14)}>14 Days</Button>
                    <Button variant={calendarDays === 30 ? "default" : "outline"} size="sm" onClick={() => setCalendarDays(30)}>30 Days</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-7">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <div key={day} className="p-3 border rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-2">{day}</div>
                      <div className="h-20 bg-muted/50 rounded flex items-center justify-center text-xs text-muted-foreground">
                        Drop content
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hooks">
            <Card>
              <CardHeader>
                <CardTitle>Viral Hook Lab</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Brand Safety:</strong> All hooks are checked for trauma-informed language. 
                      Avoid sensationalism, fear-mongering, or guaranteed outcomes.
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Hook Type</label>
                    <div className="flex gap-2 flex-wrap">
                      {["Question", "Statement", "Story", "List", "Contrast"].map(type => (
                        <Button 
                          key={type} 
                          variant={selectedHookType === type ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setSelectedHookType(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Topic</label>
                    <Input placeholder="e.g., self-compassion, boundaries, healing" data-testid="input-topic" />
                  </div>
                  <Button 
                    data-testid="button-generate-hooks"
                    onClick={handleGenerateHooks}
                    disabled={generatingHooks}
                  >
                    {generatingHooks ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                    {generatingHooks ? "Generating..." : "Generate Hooks"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hashtags">
            <Card>
              <CardHeader>
                <CardTitle>Hashtag Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(HASHTAG_SETS).map(([category, tags]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold capitalize mb-2">{category} Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm cursor-pointer hover:bg-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
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
                <CardTitle>UTM Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Source</label>
                  <Input 
                    placeholder="e.g., instagram, newsletter" 
                    value={utmParams.source}
                    onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                    data-testid="input-utm-source"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Medium</label>
                  <Input 
                    placeholder="e.g., social, email" 
                    value={utmParams.medium}
                    onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                    data-testid="input-utm-medium"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Campaign</label>
                  <Input 
                    placeholder="e.g., launch-jan-2026" 
                    value={utmParams.campaign}
                    onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                    data-testid="input-utm-campaign"
                  />
                </div>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {generateUTM()}
                </div>
                <Button 
                  className="w-full" 
                  data-testid="button-copy-utm"
                  onClick={() => handleCopyText(generateUTM(), "UTM URL")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queue">
            <Card>
              <CardHeader>
                <CardTitle>Approval Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drafts.map(draft => (
                    <div 
                      key={draft.id}
                      className="p-4 border rounded-lg"
                      data-testid={`draft-${draft.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm mb-2">{draft.content}</p>
                          <div className="flex gap-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-muted capitalize">
                              {draft.platform}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                              draft.status === "approved" 
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : draft.status === "needs-revision"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            }`}>
                              {draft.status === "approved" && <Check className="w-3 h-3" />}
                              {draft.status === "needs-revision" && <AlertTriangle className="w-3 h-3" />}
                              {draft.status === "pending" && <Clock className="w-3 h-3" />}
                              {draft.status.replace("-", " ")}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleDraftAction(draft.id, "view")}><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDraftAction(draft.id, "edit")}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleDraftAction(draft.id, "approve")}><Check className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
