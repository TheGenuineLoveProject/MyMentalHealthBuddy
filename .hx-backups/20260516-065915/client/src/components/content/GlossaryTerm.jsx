import { useState } from "react";
import { HelpCircle, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function GlossaryTerm({ 
  term, 
  simple, 
  detailed,
  learnMoreLink 
}) {
  const [showDetailed, setShowDetailed] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="inline-flex items-center gap-1 border-b border-dashed border-primary/50 text-primary hover:border-primary cursor-help"
          data-testid={`glossary-${term.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {term}
          <HelpCircle className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{term}</h4>
          <p className="text-sm text-muted-foreground">
            {showDetailed && detailed ? detailed : simple}
          </p>
          
          {detailed && !showDetailed && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetailed(true)}
              className="text-xs"
              data-testid="button-show-more"
            >
              Show more detail
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          )}
          
          {learnMoreLink && (
            <a 
              href={learnMoreLink}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Learn more
              <ChevronRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const GLOSSARY = {
  "self-compassion": {
    simple: "Being kind to yourself, especially during difficult times.",
    detailed: "Self-compassion involves treating yourself with the same kindness you'd offer a good friend. It includes self-kindness, recognition of common humanity, and mindfulness of painful emotions without over-identification."
  },
  "grounding": {
    simple: "Techniques to bring your attention to the present moment.",
    detailed: "Grounding exercises use your five senses to anchor you in the here and now, reducing anxiety and helping you feel more stable when emotions feel overwhelming."
  },
  "boundaries": {
    simple: "Limits you set to protect your wellbeing.",
    detailed: "Healthy boundaries define what you're comfortable with and how you allow others to treat you. They're essential for maintaining emotional health and respectful relationships."
  },
  "trauma-informed": {
    simple: "An approach that recognizes and responds to the effects of trauma.",
    detailed: "Trauma-informed practices acknowledge that many people have experienced trauma. They emphasize safety, choice, collaboration, and empowerment while avoiding re-traumatization."
  },
  "mindfulness": {
    simple: "Paying attention to the present moment without judgment.",
    detailed: "Mindfulness is a practice of observing your thoughts, feelings, and sensations as they occur, without labeling them as good or bad. It cultivates awareness and acceptance."
  }
};

export default GlossaryTerm;
