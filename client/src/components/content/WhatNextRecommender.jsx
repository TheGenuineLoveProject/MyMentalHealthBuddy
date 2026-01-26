import { Link } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RECOMMENDATIONS = {
  mood: [
    { routeKey: "journal", path: "/journal", label: "Journal about your mood" },
    { routeKey: "breathwork", path: "/tools/breathwork", label: "Try breathwork" },
    { routeKey: "gratitude", path: "/gratitude", label: "Practice gratitude" }
  ],
  journal: [
    { routeKey: "reflection", path: "/reflection", label: "Deeper reflection" },
    { routeKey: "mood", path: "/mood", label: "Track your mood" },
    { routeKey: "wisdom", path: "/wisdom", label: "Explore wisdom" }
  ],
  breathwork: [
    { routeKey: "body-scan", path: "/tools/body-scan", label: "Body scan practice" },
    { routeKey: "grounding", path: "/tools/grounding", label: "Grounding exercise" },
    { routeKey: "mood", path: "/mood", label: "Check in with mood" }
  ],
  gratitude: [
    { routeKey: "journal", path: "/journal", label: "Journal entry" },
    { routeKey: "awe-microdose", path: "/tools/awe-microdose", label: "Awe practice" },
    { routeKey: "reflection", path: "/reflection", label: "Reflect on today" }
  ],
  default: [
    { routeKey: "mood", path: "/mood", label: "Track your mood" },
    { routeKey: "journal", path: "/journal", label: "Write in journal" },
    { routeKey: "tools", path: "/tools", label: "Browse all tools" }
  ]
};

export function WhatNextRecommender({ currentRouteKey, maxItems = 3 }) {
  const recommendations = RECOMMENDATIONS[currentRouteKey] || RECOMMENDATIONS.default;
  const displayItems = recommendations.slice(0, maxItems);

  return (
    <Card data-testid="what-next-recommender">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          What to do next
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayItems.map(item => (
            <Link key={item.routeKey} href={item.path}>
              <div 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group cursor-pointer"
                data-testid={`next-${item.routeKey}`}
              >
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default WhatNextRecommender;
