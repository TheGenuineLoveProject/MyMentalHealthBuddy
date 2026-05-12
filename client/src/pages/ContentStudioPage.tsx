import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FileText, Save, Loader2, ChevronLeft, Copy, Sparkles, FileJson, FileCode, MessageSquare } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient.js";
import ContentStudio from "@/components/ContentStudio.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const ALL_FORMATS = [
  { id: "blog", name: "Blog Post", icon: "📝" },
  { id: "newsletter", name: "Newsletter", icon: "📧" },
  { id: "twitter", name: "Twitter/X Thread", icon: "🐦" },
  { id: "linkedin", name: "LinkedIn Post", icon: "💼" },
  { id: "instagram_carousel", name: "Instagram Carousel", icon: "📸" },
  { id: "instagram_reel", name: "Instagram Reel Script", icon: "🎬" },
  { id: "youtube_short", name: "YouTube Short Script", icon: "▶️" },
  { id: "pinterest", name: "Pinterest Pin", icon: "📌" },
  { id: "tiktok", name: "TikTok Script", icon: "🎵" },
  { id: "quote_card", name: "Quote Card", icon: "💬" },
];

export default function ContentStudioPage() {
  const { toast } = useToast();
  const [studioMode, setStudioMode] = useState<"ai" | "templates">("templates");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>(ALL_FORMATS.map(f => f.id));
  const [generatedContent, setGeneratedContent] = useState<Record<string, any> | null>(null);
  const [activeTab, setActiveTab] = useState("blog");

  const { data: formatsData } = useQuery({
    queryKey: ["/api/content/formats"],
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const data = await apiRequest("POST", "/api/content/generate", {
        title: title || "Untitled",
        content,
        formats: selectedFormats,
      });
      return data;
    },
    onSuccess: (data: any) => {
      setGeneratedContent(data.outputs);
      toast({ title: "Content generated!", description: `Created ${Object.keys(data.outputs).length} format(s)` });
    },
    onError: (error: Error) => {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = await apiRequest("POST", "/api/content/drafts", {
        title: title || "Untitled Draft",
        sourceContent: content,
        outputs: generatedContent,
      });
      return data;
    },
    onSuccess: () => {
      toast({ title: "Draft saved!", description: "Your content has been saved to the database." });
      queryClient.invalidateQueries({ queryKey: ["/api/content/drafts"] });
    },
    onError: (error: Error) => {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    },
  });

  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(f => f !== formatId)
        : [...prev, formatId]
    );
  };

  const selectAll = () => setSelectedFormats(ALL_FORMATS.map(f => f.id));
  const clearAll = () => setSelectedFormats([]);

  const exportAsJSON = () => {
    if (!generatedContent) return;
    const blob = new Blob([JSON.stringify({ title, content, outputs: generatedContent }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-studio-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = () => {
    if (!generatedContent) return;
    let md = `# ${title || "Content Studio Export"}\n\n`;
    md += `## Source Content\n\n${content}\n\n---\n\n`;
    Object.entries(generatedContent).forEach(([format, data]: [string, any]) => {
      const formatName = ALL_FORMATS.find(f => f.id === format)?.name || format;
      md += `## ${formatName}\n\n`;
      if (data.title) md += `**Title:** ${data.title}\n\n`;
      if (data.content) md += `${data.content}\n\n`;
      if (data.script) md += `**Script:**\n${data.script}\n\n`;
      if (data.slides) md += `**Slides:**\n${data.slides.map((s: any, i: number) => `${i + 1}. ${s.text}`).join("\n")}\n\n`;
      md += "---\n\n";
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-studio-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard" });
  };

  const renderOutput = (format: string, data: any) => {
    if (!data) return <p className="text-body-sm">No content generated for this format.</p>;
    
    return (
      <div className="space-y-4">
      <SEO title="Content Studio — The Genuine Love Project" description="Create and transform wellness content." />

        {data.title && (
          <div>
            <p className="text-eyebrow text-[var(--sage-500)]">Title</p>
            <p className="text-heading-sm text-teal">{data.title}</p>
          </div>
        )}
        {data.content && (
          <div>
            <p className="text-eyebrow text-[var(--sage-500)]">Content</p>
            <div className="bg-[var(--sage-50)] p-3 rounded-xl border border-[var(--sage-200)] whitespace-pre-wrap text-body-sm">{data.content}</div>
          </div>
        )}
        {data.script && (
          <div>
            <p className="text-eyebrow text-[var(--sage-500)]">Script</p>
            <div className="bg-[var(--sage-50)] p-3 rounded-xl border border-[var(--sage-200)] whitespace-pre-wrap text-body-sm">{data.script}</div>
          </div>
        )}
        {data.slides && (
          <div>
            <p className="text-eyebrow text-[var(--sage-500)]">Slides</p>
            <div className="space-y-2">
              {data.slides.map((slide: any, idx: number) => (
                <div key={idx} className="bg-[var(--sage-50)] p-3 rounded-xl border border-[var(--sage-200)]">
                  <span className="text-caption font-bold text-[var(--teal-600)]">Slide {idx + 1}</span>
                  <p className="text-body-sm">{slide.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {Array.isArray(data.hashtags) && data.hashtags.length > 0 && (
          <div>
            <p className="text-eyebrow text-[var(--sage-500)]">Hashtags</p>
            <p className="text-body-sm text-[var(--teal-600)]">{data.hashtags.join(" ")}</p>
          </div>
        )}
        <button 
          className="btn-secondary-premium inline-flex items-center gap-2"
          onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
          data-testid={`button-copy-${format}`}
        >
          <Copy className="w-4 h-4" /> Copy
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen v28-paper-bg">
      <div className="content-wrapper py-8">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <button className="p-3 rounded-xl bg-white border border-[var(--sage-200)] text-[var(--teal-600)] hover:bg-[var(--sage-50)] transition shadow-sm" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="icon-container icon-xl icon-gradient-gold">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-display-lg text-teal" data-testid="text-page-title">
                Content Studio
              </h1>
              <p className="text-body-sm">Create trauma-informed, brand-aligned content</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-8" role="tablist" aria-label="Content studio mode">
          <button
            role="tab"
            aria-selected={studioMode === "templates"}
            onClick={() => setStudioMode("templates")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
              studioMode === "templates"
                ? "bg-[linear-gradient(135deg,var(--sage-400),var(--teal-600))] text-white shadow-md"
                : "bg-white border border-[var(--sage-200)] text-[var(--charcoal)] hover:bg-[var(--sage-50)]"
            }`}
            data-testid="tab-templates"
          >
            <MessageSquare className="w-4 h-4" />
            Social Templates
          </button>
          <button
            role="tab"
            aria-selected={studioMode === "ai"}
            onClick={() => setStudioMode("ai")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
              studioMode === "ai"
                ? "bg-[linear-gradient(135deg,var(--sage-400),var(--teal-600))] text-white shadow-md"
                : "bg-white border border-[var(--sage-200)] text-[var(--charcoal)] hover:bg-[var(--sage-50)]"
            }`}
            data-testid="tab-ai-generation"
          >
            <Sparkles className="w-4 h-4" />
            AI Generation
          </button>
        </div>

        {studioMode === "templates" && (
          <div className="mb-8">
            <ContentStudio />
          </div>
        )}

        {studioMode === "ai" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card-bordered">
              <div className="flex items-center gap-3 mb-5">
                <div className="icon-container icon-md icon-gradient-gold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-heading-md text-teal">Your Content</h2>
              </div>
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">Title (optional)</label>
                  <Input
                    id="title"
                    placeholder="Give your content a title..."
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="input-premium"
                    data-testid="input-title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content" className="form-label">Content (min 50 characters)</label>
                  <Textarea
                    id="content"
                    placeholder="Paste or type your content here... This will be transformed into multiple platform-specific formats."
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    className="min-h-[200px] input-premium"
                    data-testid="input-content"
                  />
                  <p className="form-hint">
                    {content.length} / 50 minimum characters
                  </p>
                </div>
              </div>
            </div>

            <div className="card-bordered">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-heading-md text-teal">Output Formats</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary-premium btn-sm" onClick={selectAll} data-testid="button-select-all">
                    Select All
                  </button>
                  <button className="btn-secondary-premium btn-sm" onClick={clearAll} data-testid="button-clear-all">
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ALL_FORMATS.map((format) => (
                  <div key={format.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--sage-50)] transition">
                    <input
                      type="checkbox"
                      id={format.id}
                      checked={selectedFormats.includes(format.id)}
                      onChange={() => toggleFormat(format.id)}
                      className="w-4 h-4 rounded accent-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-400)]"
                      data-testid={`checkbox-format-${format.id}`}
                    />
                    <label htmlFor={format.id} className="flex items-center gap-2 cursor-pointer text-body-sm">
                      <span>{format.icon}</span>
                      <span>{format.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => generateMutation.mutate()}
                disabled={content.length < 50 || selectedFormats.length === 0 || generateMutation.isPending}
                className="btn-premium flex-1 flex items-center justify-center gap-2"
                data-testid="button-generate"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate Content
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-bordered h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="icon-container icon-md icon-gradient-teal">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-heading-md text-teal">Generated Content</h2>
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <button 
                      className="btn-secondary-premium btn-sm inline-flex items-center gap-2"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                      data-testid="button-save"
                    >
                      {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button className="btn-secondary-premium btn-sm inline-flex items-center gap-2" onClick={exportAsJSON} data-testid="button-export-json">
                      <FileJson className="w-4 h-4" /> JSON
                    </button>
                    <button className="btn-secondary-premium btn-sm inline-flex items-center gap-2" onClick={exportAsMarkdown} data-testid="button-export-md">
                      <FileCode className="w-4 h-4" /> MD
                    </button>
                  </div>
                )}
              </div>
              
              {!generatedContent ? (
                <div className="text-center py-12">
                  <div className="icon-container icon-xl icon-soft-sage mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-heading-sm text-teal mb-2">Your generated content will appear here</p>
                  <p className="text-body-sm">Paste your content and click Generate</p>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="flex flex-wrap gap-1 h-auto p-1 bg-[var(--sage-100)] rounded-xl">
                    {Object.keys(generatedContent).map((format) => {
                      const formatInfo = ALL_FORMATS.find(f => f.id === format);
                      return (
                        <TabsTrigger 
                          key={format} 
                          value={format} 
                          className="text-caption px-3 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          data-testid={`tab-${format}`}
                        >
                          {formatInfo?.icon} {formatInfo?.name?.split(" ")[0]}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {Object.entries(generatedContent).map(([format, data]) => (
                    <TabsContent key={format} value={format} className="mt-4 max-h-[400px] overflow-y-auto">
                      {renderOutput(format, data)}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          </div>
        </div>
        )}
        </div>
      </div>
    
        <SafetyFooter />
      </div>
  );
}
