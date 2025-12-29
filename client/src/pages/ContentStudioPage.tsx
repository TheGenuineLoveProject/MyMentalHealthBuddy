import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileText, Download, Save, Loader2, ChevronLeft,
  Copy, Sparkles, FileJson, FileCode
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient.js";

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
    if (!data) return <p className="text-muted-foreground">No content generated for this format.</p>;
    
    return (
      <div className="space-y-4">
        {data.title && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Title</p>
            <p className="font-semibold">{data.title}</p>
          </div>
        )}
        {data.content && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Content</p>
            <div className="bg-muted/50 p-3 rounded-lg whitespace-pre-wrap text-sm">{data.content}</div>
          </div>
        )}
        {data.script && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Script</p>
            <div className="bg-muted/50 p-3 rounded-lg whitespace-pre-wrap text-sm">{data.script}</div>
          </div>
        )}
        {data.slides && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Slides</p>
            <div className="space-y-2">
              {data.slides.map((slide: any, idx: number) => (
                <div key={idx} className="bg-muted/50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-primary">Slide {idx + 1}</span>
                  <p className="text-sm">{slide.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.hashtags && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Hashtags</p>
            <p className="text-sm text-primary">{data.hashtags.join(" ")}</p>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
          data-testid={`button-copy-${format}`}
        >
          <Copy className="w-4 h-4 mr-2" /> Copy
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-page-title">
              <FileText className="w-8 h-8 text-primary" />
              Content Studio
            </h1>
            <p className="text-muted-foreground">Transform your ideas into 10 platform-ready formats</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="text-sm font-medium">Title (optional)</label>
                  <Input
                    id="title"
                    placeholder="Give your content a title..."
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="text-sm font-medium">Content (min 50 characters)</label>
                  <Textarea
                    id="content"
                    placeholder="Paste or type your content here... This will be transformed into multiple platform-specific formats."
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    className="min-h-[200px]"
                    data-testid="input-content"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {content.length} / 50 minimum characters
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Output Formats</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAll} data-testid="button-select-all">
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAll} data-testid="button-clear-all">
                      Clear
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {ALL_FORMATS.map((format) => (
                    <div key={format.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={format.id}
                        checked={selectedFormats.includes(format.id)}
                        onChange={() => toggleFormat(format.id)}
                        className="w-4 h-4 rounded border-gray-300"
                        data-testid={`checkbox-format-${format.id}`}
                      />
                      <label htmlFor={format.id} className="flex items-center gap-2 cursor-pointer text-sm">
                        <span>{format.icon}</span>
                        <span>{format.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => generateMutation.mutate()}
                disabled={content.length < 50 || selectedFormats.length === 0 || generateMutation.isPending}
                className="flex-1"
                data-testid="button-generate"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate Content
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Content</span>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        data-testid="button-save"
                      >
                        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span className="ml-2">Save</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportAsJSON} data-testid="button-export-json">
                        <FileJson className="w-4 h-4 mr-2" /> JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportAsMarkdown} data-testid="button-export-md">
                        <FileCode className="w-4 h-4 mr-2" /> MD
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!generatedContent ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your generated content will appear here</p>
                    <p className="text-sm">Paste your content and click Generate</p>
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex flex-wrap gap-1 h-auto p-1">
                      {Object.keys(generatedContent).map((format) => {
                        const formatInfo = ALL_FORMATS.find(f => f.id === format);
                        return (
                          <TabsTrigger 
                            key={format} 
                            value={format} 
                            className="text-xs"
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
