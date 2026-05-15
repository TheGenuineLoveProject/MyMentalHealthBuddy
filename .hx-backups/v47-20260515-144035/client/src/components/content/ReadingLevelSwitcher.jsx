import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LEVELS = [
  { id: "beginner", label: "Beginner", description: "Simpler language" },
  { id: "intermediate", label: "Intermediate", description: "Balanced depth" },
  { id: "advanced", label: "Advanced", description: "Full detail" }
];

export function ReadingLevelSwitcher({ 
  currentLevel = "intermediate", 
  onLevelChange,
  compact = false 
}) {
  const current = LEVELS.find(l => l.id === currentLevel) || LEVELS[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={compact ? "sm" : "default"}
          className="gap-2"
          data-testid="button-reading-level"
        >
          <BookOpen className="w-4 h-4" />
          {!compact && <span>{current.label}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LEVELS.map(level => (
          <DropdownMenuItem
            key={level.id}
            onClick={() => onLevelChange?.(level.id)}
            className={currentLevel === level.id ? "bg-primary/10" : ""}
            data-testid={`menu-level-${level.id}`}
          >
            <div>
              <div className="font-medium">{level.label}</div>
              <div className="text-xs text-muted-foreground">{level.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ReadingLevelSwitcher;
