import { useState } from "react";
import { Link } from "wouter";
import { 
  Layers, Edit, Check, AlertTriangle, Search, Filter,
  FileText, Eye, Copy, Trash2, Plus
} from "lucide-react";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";

const CONTENT_TIERS = ["beginner", "intermediate", "advanced"];

const SAMPLE_CONTENT = [
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

  const filteredContent = SAMPLE_CONTENT.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const needsTiersCount = SAMPLE_CONTENT.filter(c => !c.hasTiers).length;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Content Studio Admin — The Genuine Love Project"
        description="Manage content tiers and quality across the platform."
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Layers className="w-5 h-5" />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Content Tier Compiler
          </h1>
          <p className="text-muted-foreground">
            Ensure all content has Beginner, Intermediate, and Advanced versions.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{SAMPLE_CONTENT.length}</div>
              <div className="text-sm text-muted-foreground">Total Content</div>
            </CardContent>
          </Card>
          <Card className={needsTiersCount > 0 ? "border-amber-500" : ""}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${needsTiersCount > 0 ? "text-amber-500" : "text-green-500"}`}>
                {needsTiersCount}
              </div>
              <div className="text-sm text-muted-foreground">Needs Tiers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {SAMPLE_CONTENT.filter(c => c.hasTiers).length}
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
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

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
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
                          <span className="font-medium">{content.title}</span>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-muted">{content.type}</span>
                            {content.hasTiers ? (
                              <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Tiered
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex items-center gap-1">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedContent ? `Edit: ${selectedContent.title}` : "Select Content to Edit"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedContent ? (
                <div className="space-y-4">
                  {CONTENT_TIERS.map(tier => (
                    <div key={tier}>
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
                  <Button className="w-full" data-testid="button-save">
                    <Check className="w-4 h-4 mr-2" />
                    Save Tiers
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select content from the library to edit tiers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
