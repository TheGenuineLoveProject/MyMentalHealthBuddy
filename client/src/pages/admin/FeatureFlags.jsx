import { useState, useEffect } from "react";
import { Flag, ToggleLeft, ToggleRight, Search, Plus, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import SEO from "../../components/SEO";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_FLAGS = [
  { id: "new_onboarding", name: "New Onboarding Flow", enabled: true, percentage: 100, description: "Redesigned onboarding experience" },
  { id: "ai_v2", name: "AI Chat V2", enabled: true, percentage: 50, description: "Upgraded AI conversation model" },
  { id: "community_beta", name: "Community Features", enabled: false, percentage: 0, description: "User community and discussions" },
  { id: "dark_mode_v2", name: "Dark Mode V2", enabled: true, percentage: 100, description: "Enhanced dark theme colors" },
  { id: "export_pdf", name: "PDF Export", enabled: true, percentage: 100, description: "Export journals to PDF" },
  { id: "premium_courses", name: "Premium Courses", enabled: true, percentage: 100, description: "Access to paid course content" },
  { id: "mood_insights", name: "Mood Insights AI", enabled: false, percentage: 0, description: "AI-powered mood pattern analysis" }
];

export default function FeatureFlags() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  
  useEffect(() => {
    try {
      const cached = localStorage.getItem("glp_admin_feature_flags");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setFlags(parsed);
        } else {
          throw new Error("Invalid cache format");
        }
      } else {
        setFlags(DEFAULT_FLAGS);
        localStorage.setItem("glp_admin_feature_flags", JSON.stringify(DEFAULT_FLAGS));
      }
    } catch {
      setFlags(DEFAULT_FLAGS);
      try {
        localStorage.setItem("glp_admin_feature_flags", JSON.stringify(DEFAULT_FLAGS));
      } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggle = async (flagId) => {
    setToggling(flagId);
    await new Promise(r => setTimeout(r, 300));
    
    setFlags(prev => {
      const flag = prev.find(f => f.id === flagId);
      const updated = prev.map(f => 
        f.id === flagId 
          ? { ...f, enabled: !f.enabled, percentage: !f.enabled ? 100 : 0 }
          : f
      );
      
      try {
        localStorage.setItem("glp_admin_feature_flags", JSON.stringify(updated));
        toast({
          title: flag?.enabled ? "Feature disabled" : "Feature enabled",
          description: `${flag?.name || flagId} is now ${flag?.enabled ? "off" : "on"}.`
        });
      } catch {
        toast({
          title: "Failed to save",
          description: "Settings could not be saved. Please try again.",
          variant: "destructive"
        });
      }
      
      return updated;
    });
    
    setToggling(null);
  };

  const filteredFlags = flags.filter(flag =>
    flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Feature Flags — Admin" noIndex />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">Feature Flags</h1>
              <p className="text-muted-foreground">Control feature rollouts</p>
            </div>
          </div>
        </header>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search flags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 min-h-[44px]"
              data-testid="input-search-flags"
            />
          </div>
          <Button 
            className="min-h-[44px]" 
            data-testid="button-add-flag"
            onClick={() => toast({
              title: "Add Feature Flag",
              description: "Feature flag creation form coming soon"
            })}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Flag
          </Button>
        </div>

        <div className="space-y-4">
          {filteredFlags.map(flag => (
            <Card key={flag.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{flag.name}</h3>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">{flag.id}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                    {flag.percentage < 100 && flag.enabled && (
                      <p className="text-xs text-amber-600 mt-1">
                        Rolling out to {flag.percentage}% of users
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleToggle(flag.id)}
                    disabled={toggling === flag.id}
                    className={`min-h-[44px] ${flag.enabled ? "text-green-600" : "text-muted-foreground"}`}
                    data-testid={`toggle-${flag.id}`}
                  >
                    {toggling === flag.id ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : flag.enabled ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Feature flags control which features are visible to users. Changes take effect immediately.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
