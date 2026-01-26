import { useState } from "react";
import { Layers, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContentTierCompiler({ 
  content, 
  defaultLevel = "intermediate" 
}) {
  const [level, setLevel] = useState(defaultLevel);
  const [expanded, setExpanded] = useState(false);

  const levels = ["beginner", "intermediate", "advanced"];
  const currentContent = content?.[level] || content?.intermediate || {};

  const getLevelDescription = (l) => {
    switch (l) {
      case "beginner": return "Simpler explanations, fewer details";
      case "intermediate": return "Balanced depth and accessibility";
      case "advanced": return "In-depth, technical details";
      default: return "";
    }
  };

  return (
    <Card data-testid="content-tier-compiler">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            Reading Level
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
            data-testid="button-toggle-levels"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {expanded && (
          <div className="flex gap-2 mb-4">
            {levels.map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  level === l 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80"
                }`}
                data-testid={`level-${l}`}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        )}
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {currentContent.text || currentContent}
        </div>
        
        {expanded && (
          <p className="text-xs text-muted-foreground mt-3">
            {getLevelDescription(level)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default ContentTierCompiler;
