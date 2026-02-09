import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Flag, ToggleLeft, ToggleRight, Search, Plus, Info, Loader2, X, Trash2, ArrowLeft } from "lucide-react";
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFlag, setNewFlag] = useState({
    id: "",
    name: "",
    description: "",
    percentage: 100
  });
  
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

  const handleAddFlag = () => {
    if (!newFlag.id || !newFlag.name) {
      toast({
        title: "Missing Fields",
        description: "Please provide both an ID and name for the flag.",
        variant: "destructive"
      });
      return;
    }
    
    if (flags.some(f => f.id === newFlag.id)) {
      toast({
        title: "Duplicate ID",
        description: "A flag with this ID already exists.",
        variant: "destructive"
      });
      return;
    }
    
    const flagToAdd = {
      id: newFlag.id.toLowerCase().replace(/\s+/g, "_"),
      name: newFlag.name,
      description: newFlag.description || "No description",
      enabled: true,
      percentage: parseInt(newFlag.percentage) || 100
    };
    
    setFlags(prev => {
      const updated = [...prev, flagToAdd];
      try {
        localStorage.setItem("glp_admin_feature_flags", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    
    setNewFlag({ id: "", name: "", description: "", percentage: 100 });
    setShowAddForm(false);
    toast({
      title: "Flag Created",
      description: `${flagToAdd.name} has been added.`
    });
  };
  
  const handleDeleteFlag = (flagId) => {
    setFlags(prev => {
      const flag = prev.find(f => f.id === flagId);
      const updated = prev.filter(f => f.id !== flagId);
      try {
        localStorage.setItem("glp_admin_feature_flags", JSON.stringify(updated));
        toast({
          title: "Flag Deleted",
          description: `${flag?.name || flagId} has been removed.`
        });
      } catch {}
      return updated;
    });
  };

  const filteredFlags = flags.filter(flag =>
    flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enabledCount = flags.filter(f => f.enabled).length;
  const disabledCount = flags.filter(f => !f.enabled).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-feature-flags">
        <Loader2 className="w-8 h-8 animate-spin motion-reduce:animate-none text-primary" />
        <span className="ml-3 text-muted-foreground">Loading feature flags...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-feature-flags">
      <SEO title="Feature Flags — Admin" noIndex />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Command Center
        </Link>
        <header className="mb-8" data-testid="panel-header">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">Feature Flags</h1>
              <p className="text-muted-foreground" data-testid="text-subtitle">
                {flags.length} flags &middot; {enabledCount} enabled &middot; {disabledCount} disabled
              </p>
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
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Flag
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Create New Feature Flag</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Flag ID</label>
                  <Input
                    placeholder="e.g., new_feature"
                    value={newFlag.id}
                    onChange={(e) => setNewFlag(prev => ({ ...prev, id: e.target.value }))}
                    data-testid="input-flag-id"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    placeholder="e.g., New Feature"
                    value={newFlag.name}
                    onChange={(e) => setNewFlag(prev => ({ ...prev, name: e.target.value }))}
                    data-testid="input-flag-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="What does this feature do?"
                  value={newFlag.description}
                  onChange={(e) => setNewFlag(prev => ({ ...prev, description: e.target.value }))}
                  data-testid="input-flag-description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rollout Percentage</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newFlag.percentage}
                  onChange={(e) => setNewFlag(prev => ({ ...prev, percentage: e.target.value }))}
                  data-testid="input-flag-percentage"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddFlag} data-testid="button-create-flag">
                  Create Flag
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4" data-testid="panel-flags-list">
          {filteredFlags.length === 0 && (
            <Card data-testid="text-no-flags">
              <CardContent className="py-12 text-center text-muted-foreground">
                No flags match your search.
              </CardContent>
            </Card>
          )}
          {filteredFlags.map(flag => (
            <Card key={flag.id} data-testid={`card-flag-${flag.id}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold" data-testid={`text-flag-name-${flag.id}`}>{flag.name}</h3>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded" data-testid={`text-flag-id-${flag.id}`}>{flag.id}</code>
                      <span className={`text-xs px-2 py-0.5 rounded ${flag.enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`} data-testid={`badge-flag-status-${flag.id}`}>
                        {flag.enabled ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground" data-testid={`text-flag-desc-${flag.id}`}>{flag.description}</p>
                    {flag.percentage < 100 && flag.enabled && (
                      <p className="text-xs text-amber-600 mt-1" data-testid={`text-flag-rollout-${flag.id}`}>
                        Rolling out to {flag.percentage}% of users
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFlag(flag.id)}
                      className="text-muted-foreground hover:text-red-600"
                      data-testid={`delete-${flag.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
