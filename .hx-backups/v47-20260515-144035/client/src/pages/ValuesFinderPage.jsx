import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { MIPromptCard } from "@/components/mi/MIPromptCard";
import { Heart, Star, Compass, Target, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const VALUES_CLARITY = {
  what: "A guided exploration tool to help you identify and clarify your core personal values.",
  who: "Anyone seeking to understand what truly matters to them and align their life with their values.",
  when: "During life transitions, when feeling uncertain, or when you want more intentional living.",
  why: "Knowing your values helps you make decisions, set boundaries, and live more authentically.",
  howSteps: [
    "Browse value categories that resonate with you",
    "Select values that feel genuinely important",
    "Add any custom values that aren't listed",
    "Reflect on why these values matter to you"
  ],
  whereLinkText: "Explore values-based living",
  whereHref: "/wisdom/values"
};

const VALUES_EXAMPLES = [
  {
    level: "beginner",
    title: "Discovering your first core values",
    situation: "You've never formally thought about your values and want to start somewhere.",
    action: "Browse each category and select 2-3 values that immediately resonate without overthinking.",
    result: "You identify 'Connection' and 'Growth' as core themes, giving you a foundation to build on."
  },
  {
    level: "intermediate",
    title: "Resolving a values conflict",
    situation: "You feel torn between career advancement and family time.",
    action: "Use the values finder to rank both values and reflect on what 'enough' looks like for each.",
    result: "You realize you value 'Presence' over 'Achievement' and adjust your work boundaries."
  },
  {
    level: "advanced",
    title: "Living your values daily",
    situation: "You know your values but struggle to embody them consistently.",
    action: "Review your saved values and write specific behaviors for each in different life domains.",
    result: "You create a personal values code with concrete actions for work, relationships, and self-care."
  }
];

const VALUE_CATEGORIES = [
  { id: "connection", label: "Connection", icon: Heart, examples: ["Family", "Friendship", "Community", "Belonging"] },
  { id: "growth", label: "Growth", icon: Sparkles, examples: ["Learning", "Creativity", "Achievement", "Wisdom"] },
  { id: "purpose", label: "Purpose", icon: Compass, examples: ["Meaning", "Service", "Impact", "Legacy"] },
  { id: "wellbeing", label: "Wellbeing", icon: Star, examples: ["Health", "Peace", "Joy", "Balance"] },
  { id: "authenticity", label: "Authenticity", icon: Target, examples: ["Honesty", "Integrity", "Freedom", "Expression"] },
];

export default function ValuesFinderPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customValue, setCustomValue] = useState("");
  const [reflection, setReflection] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/wellness-tools/values"],
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/wellness-tools/values", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/values"] });
      setCustomValue("");
      setReflection("");
      setSelectedCategory(null);
      setSelectedValues([]);
      toast({ title: "Values saved", description: "Your values have been saved to your collection." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not save values. Please try again.", variant: "destructive" });
    },
  });

  const handleAddToSelection = (value) => {
    if (!selectedValues.includes(value)) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleRemoveFromSelection = (value) => {
    setSelectedValues(selectedValues.filter(v => v !== value));
  };

  const handleSaveValues = () => {
    const valuesToSave = customValue.trim() 
      ? [...selectedValues, customValue.trim()] 
      : selectedValues;
    
    if (valuesToSave.length === 0) {
      toast({ title: "No values selected", description: "Please select or add at least one value.", variant: "destructive" });
      return;
    }

    createMutation.mutate({
      coreValues: valuesToSave,
      reflections: reflection || null,
      priorityRanking: valuesToSave,
    });
  };

  return (
  <WellnessPageShell
    title="ValuesFinderPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >
      <SEO title="Values Finder — The Genuine Love Project" description="Discover and clarify your personal values." />


    <LayoutWrapper>
      <Hero
        title="Values Finder"
        subtitle="Discover what matters most to you — a gentle exploration of your core values"
        variant="wellness"
        data-testid="hero-values-finder"
      />

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <ClarityCard {...VALUES_CLARITY} variant="compact" className="mb-6" />

          <ExamplesAccordion 
            examples={VALUES_EXAMPLES} 
            title="See how others use values exploration"
            className="mb-8"
          />

          <MIPromptCard context="values" className="mb-8" />

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3" data-testid="heading-intro">
              What are values?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed" data-testid="text-intro">
              Values are the qualities and principles that matter most to you. They guide your choices and help you live authentically. 
              There are no right or wrong values — only what feels true for you. Take your time exploring below.
            </p>
          </div>

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-categories">
            Explore value categories
          </h3>

          <CardGrid columns={2}>
            {VALUE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-[var(--primary)]" : ""}`}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  data-testid={`card-category-${category.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                      <Icon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--text-primary)] mb-2" data-testid={`heading-category-${category.id}`}>{category.label}</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example) => {
                          const isValueSelected = selectedValues.includes(example);
                          return (
                            <button
                              key={example}
                              onClick={(e) => {
                                e.stopPropagation();
                                isValueSelected ? handleRemoveFromSelection(example) : handleAddToSelection(example);
                              }}
                              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                isValueSelected 
                                  ? "bg-[var(--primary)] text-white" 
                                  : "bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-secondary)]"
                              }`}
                              data-testid={`button-value-${example.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {example}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </CardGrid>

          {selectedValues.length > 0 && (
            <div className="mt-6 p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]" data-testid="section-selected-values">
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2" data-testid="heading-selected">Selected values ({selectedValues.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((value) => (
                  <span key={value} className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)] text-white rounded-full text-sm" data-testid={`chip-value-${value.toLowerCase().replace(/\s+/g, '-')}`}>
                    {value}
                    <button onClick={() => handleRemoveFromSelection(value)} className="ml-1 hover:opacity-80" data-testid={`button-remove-${value.toLowerCase().replace(/\s+/g, '-')}`}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)]" data-testid="section-add-custom">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-custom">
              Add a custom value or reflection
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="custom-value" data-testid="label-custom-value">
                  Custom value (optional)
                </label>
                <input
                  id="custom-value"
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Type a value that resonates with you..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  data-testid="input-custom-value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="reflection" data-testid="label-reflection">
                  Reflection (optional)
                </label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Why do these values matter to you? What do they mean in your life?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  data-testid="textarea-reflection"
                />
              </div>
              <Button
                onClick={handleSaveValues}
                disabled={selectedValues.length === 0 && !customValue.trim() || createMutation.isPending}
                data-testid="button-save-values"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Save Values
                  </>
                )}
              </Button>
            </div>
          </div>

          {entries.length > 0 && (
            <div className="mt-12" data-testid="section-my-values">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2" data-testid="heading-my-values">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                My Values Entries ({entries.length})
              </h3>
              <div className="grid gap-3">
                {entries.map((entry) => {
                  const values = typeof entry.coreValues === 'string' 
                    ? JSON.parse(entry.coreValues || '[]') 
                    : entry.coreValues || [];
                  return (
                    <div
                      key={entry.id}
                      className="p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]"
                      data-testid={`card-entry-${entry.id}`}
                    >
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Array.isArray(values) && values.map((value, idx) => (
                          <span key={idx} className="px-2 py-1 text-sm bg-[var(--surface-secondary)] rounded-full text-[var(--text-primary)]" data-testid={`text-value-${entry.id}-${idx}`}>
                            {value}
                          </span>
                        ))}
                      </div>
                      {entry.reflections && (
                        <p className="text-sm text-[var(--text-secondary)] italic" data-testid={`text-reflection-${entry.id}`}>"{entry.reflections}"</p>
                      )}
                      <p className="text-xs text-[var(--text-muted)] mt-2" data-testid={`text-date-${entry.id}`}>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8" data-testid="loading-state">
              <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin motion-reduce:animate-none mx-auto" />
              <p className="text-sm text-[var(--text-muted)] mt-2">Loading your values...</p>
            </div>
          )}
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  </WellnessPageShell>
  );
}
