import { useMemo } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Heart, Brain, Shield, Sun, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ALL_TOOLS = [
  { id: "mood", name: "Mood Tracker", path: "/mood", tags: ["emotional", "self-love", "awareness"], icon: Heart },
  { id: "breathwork", name: "Breathwork", path: "/tools/breathwork", tags: ["calm", "grounding", "quick"], icon: Shield },
  { id: "journal", name: "Journal", path: "/journal", tags: ["emotional", "healing", "reflection"], icon: Brain },
  { id: "gratitude", name: "Gratitude", path: "/gratitude", tags: ["self-love", "positivity", "quick"], icon: Sun },
  { id: "reframe", name: "Reframe", path: "/tools/reframe", tags: ["growth", "emotional", "cbt"], icon: Target },
  { id: "grounding", name: "Grounding", path: "/tools/grounding", tags: ["calm", "quick", "grounding"], icon: Shield },
  { id: "body-scan", name: "Body Scan", path: "/tools/body-scan", tags: ["calm", "awareness", "healing"], icon: Heart },
  { id: "values", name: "Values Explorer", path: "/pathways/values", tags: ["purpose", "growth", "reflection"], icon: Target },
  { id: "compassion", name: "Self-Compassion", path: "/tools/compassion-break", tags: ["self-love", "healing", "quick"], icon: Heart },
  { id: "meaning", name: "Meaning Map", path: "/tools/meaning-map", tags: ["purpose", "growth", "reflection"], icon: Sparkles }
];

const GOAL_TO_TAGS = {
  "self-love": ["self-love", "compassion", "positivity"],
  "emotional": ["emotional", "awareness", "reflection"],
  "calm": ["calm", "grounding", "quick"],
  "connection": ["connection", "relationship", "healing"],
  "purpose": ["purpose", "growth", "meaning"],
  "healing": ["healing", "reflection", "awareness"]
};

export function ToolRecommendations({ maxItems = 4, showHeader = true }) {
  const recommendations = useMemo(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem("glp_onboarding_preferences") || "{}");
      const userGoals = prefs.selectedGoals || [];
      const timePreference = prefs.timePreference || "moderate";
      
      if (userGoals.length === 0) {
        return ALL_TOOLS.slice(0, maxItems);
      }
      
      const relevantTags = userGoals.flatMap(g => GOAL_TO_TAGS[g] || []);
      
      const scored = ALL_TOOLS.map(tool => {
        const matchCount = tool.tags.filter(t => relevantTags.includes(t)).length;
        const timeBonus = timePreference === "quick" && tool.tags.includes("quick") ? 1 : 0;
        return { ...tool, score: matchCount + timeBonus };
      });
      
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, maxItems);
    } catch {
      return ALL_TOOLS.slice(0, maxItems);
    }
  }, [maxItems]);

  return (
    <Card data-testid="card-recommendations">
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommended for You
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "" : "pt-6"}>
        <div className="grid gap-3 sm:grid-cols-2">
          {recommendations.map(tool => {
            const Icon = tool.icon;
            return (
              <Link 
                key={tool.id} 
                href={tool.path}
                className="block"
              >
                <div 
                  className="p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                  data-testid={`recommendation-${tool.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {tool.name}
                      </span>
                      <div className="flex gap-1 mt-1">
                        {tool.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default ToolRecommendations;
