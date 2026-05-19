import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layers, Check, AlertTriangle, Search, FileText, Loader2, ArrowLeft, Activity } from 'lucide-react';
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { AdminErrorBanner, AdminLoadingState } from "../../components/admin/AdminQueryStates";

const CONTENT_TIERS = ["beginner", "intermediate", "advanced"];

const DEFAULT_CONTENT = [
  { id: "1", title: "Self-Compassion Guide", type: "page", hasTiers: true, status: "complete" },
  { id: "2", title: "Grounding Exercise", type: "tool", hasTiers: true, status: "complete" },
  { id: "3", title: "Boundary Setting", type: "page", hasTiers: false, status: "needs-tiers" },
  { id: "4", title: "Breathwork Intro", type: "tool", hasTiers: true, status: "complete" },
  { id: "5", title: "Trauma Basics", type: "page", hasTiers: false, status: "needs-tiers" }
];

export default function ContentStudioAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);
  const [tierContent, setTierContent] = useState({});
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const { data: healthData, error, refetch } = useQuery({
    queryKey: ['/api/health'],
    retry: 1,
    staleTime: 30000,
  });

  useEffect(() => {
    try {
      const cached = localStorage.getItem("glp_admin_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setContentList(parsed);
        } else {
          throw new Error("Invalid format");
        }
      } else {
        setContentList(DEFAULT_CONTENT);
        localStorage.setItem("glp_admin_content", JSON.stringify(DEFAULT_CONTENT));
      }
    } catch {
      setContentList(DEFAULT_CONTENT);
      setTimeout(() => toast({ title: "Cache reset", description: "Using default content data." }), 100);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedContent) {
      try {
        const cached = localStorage.getItem(`glp_content_tiers_${selectedContent.id}`);
        if (cached) {
          setTierContent(JSON.parse(cached));
        } else {
          setTierContent({});
        }
      } catch {
        setTierContent({});
      }
    }
  }, [selectedContent]);

  const handleSave = async () => {
    if (!selectedContent) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    
    try {
      localStorage.setItem(`glp_content_tiers_${selectedContent.id}`, JSON.stringify(tierContent));
      
      const allTiersFilled = CONTENT_TIERS.every(t => tierContent[t]?.trim());
      setContentList(prev => {
        const updated = prev.map(c => 
          c.id === selectedContent.id 
            ? { ...c, hasTiers: allTiersFilled, status: allTiersFilled ? "complete" : "needs-tiers" }
            : c
        );
        localStorage.setItem("glp_admin_content", JSON.stringify(updated));
        return updated;
      });
      
      setSelectedContent(prev => prev ? { ...prev, hasTiers: allTiersFilled, status: allTiersFilled ? "complete" : "needs-tiers" } : null);
      
      toast({ title: "Tiers saved", description: `${selectedContent.title} tiers updated successfully.` });
    } catch {
      toast({ title: "Save failed", description: "Could not save tier content.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const filteredContent = contentList.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const needsTiersCount = contentList.filter(c => !c.hasTiers).length;
  const completeCount = contentList.filter(c => c.hasTiers).length;

  if (!healthData && !error) {
    return <AdminLoadingState label="Loading content studio..." />;
  }

  if (loading) {
    return <AdminLoadingState label="Loading content studio..." />;
  }

  if (error) {
    return <AdminErrorBanner title="Unable to load content studio" onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-content-studio">
      <SEO 
        title="Content Studio Admin — The Genuine Love Project"
        description="Manage content tiers and quality across the platform."
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>
        <header className="mb-8" data-testid="panel-header">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Layers className="w-5 h-5" />
                <span className="text-sm font-medium">Admin</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
                Content Tier Compiler
              </h1>
              <p className="text-muted-foreground" data-testid="text-subtitle">
                Ensure all content has Beginner, Intermediate, and Advanced versions.
              </p>
            </div>
            {healthData?.status && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground" data-testid="text-server-status">
                <Activity className="w-3 h-3" />
                Server: {healthData.status}
              </div>
            )}
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3 mb-8" data-testid="panel-stats">
          <Card data-testid="stat-total">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{contentList.length}</div>
              <div className="text-sm text-muted-foreground">Total Content</div>
            </CardContent>
          </Card>
          <Card className={needsTiersCount > 0 ? "border-amber-500" : ""} data-testid="stat-needs-tiers">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${needsTiersCount > 0 ? "text-amber-500" : "text-green-500"}`}>
                {needsTiersCount}
              </div>
              <div className="text-sm text-muted-foreground">Needs Tiers</div>
            </CardContent>
          </Card>
          <Card data-testid="stat-complete">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {completeCount}
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card data-testid="card-content-library">
            <CardHeader>
              <CardTitle className="text-lg">Content Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto" data-testid="list-content">
                {filteredContent.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-results">No content matches "{searchTerm}"</p>
                )}
                {filteredContent.map(content => (
                  <div
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedContent?.id === content.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    }`}
                    data-testid={`content-${content.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium" data-testid={`text-content-title-${content.id}`}>{content.title}</span>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-muted" data-testid={`badge-type-${content.id}`}>{content.type}</span>
                            {content.hasTiers ? (
                              <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1" data-testid={`badge-tiered-${content.id}`}>
                                <Check className="w-3 h-3" /> Tiered
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex items-center gap-1" data-testid={`badge-needs-tiers-${content.id}`}>
                                <AlertTriangle className="w-3 h-3" /> Needs Tiers
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-tier-editor">
            <CardHeader>
              <CardTitle className="text-lg" data-testid="text-editor-title">
                {selectedContent ? `Edit: ${selectedContent.title}` : "Select Content to Edit"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedContent ? (
                <div className="space-y-4">
                  {CONTENT_TIERS.map(tier => (
                    <div key={tier} data-testid={`tier-section-${tier}`}>
                      <label className="text-sm font-medium capitalize mb-1 block">
                        {tier} Version
                      </label>
                      <Textarea
                        placeholder={`Enter ${tier} version...`}
                        value={tierContent[tier] || ""}
                        onChange={(e) => setTierContent({ ...tierContent, [tier]: e.target.value })}
                        rows={3}
                        data-testid={`textarea-${tier}`}
                      />
                    </div>
                  ))}
                  <Button 
                    className="w-full" 
                    onClick={handleSave}
                    disabled={saving}
                    data-testid="button-save"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    {saving ? "Saving..." : "Save Tiers"}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-select-content">
                  <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select content from the library to edit tiers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <SafetyFooter variant="compact" className="mt-12" />
      </main>
    </div>
  );
}
