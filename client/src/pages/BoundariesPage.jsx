import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { MIPromptCard } from "@/components/mi/MIPromptCard";
import { Shield, MessageCircle, Clock, Users, Home, Heart, Plus, Trash2, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const BOUNDARIES_CLARITY = {
  what: "A tool for creating and practicing boundary scripts for different situations in your life.",
  who: "Anyone who wants to set healthier limits but struggles with the words to use.",
  when: "When preparing for difficult conversations, or when you want to practice assertive communication.",
  why: "Having prepared scripts reduces anxiety and helps you respond consistently to boundary violations.",
  howSteps: [
    "Choose the type of boundary you need to set",
    "Describe the specific situation",
    "Write your boundary statement (or use a template)",
    "Practice saying it aloud before the real conversation"
  ],
  whereLinkText: "Learn about healthy boundaries",
  whereHref: "/wisdom/boundaries"
};

const BOUNDARIES_EXAMPLES = [
  {
    level: "beginner",
    title: "Your first boundary script",
    situation: "A friend frequently cancels plans last minute and you want to address it.",
    action: "Use the 'Expressing a need' template and customize: 'I'd feel more respected if we could confirm plans 24 hours ahead.'",
    result: "You have clear words ready, which reduces anxiety about the conversation."
  },
  {
    level: "intermediate",
    title: "Setting work-life limits",
    situation: "Your manager expects responses to emails at night and on weekends.",
    action: "Create a time boundary script: 'I'll respond to non-urgent messages during work hours. For emergencies, please call.'",
    result: "You communicate your limits professionally and your evening stress decreases."
  },
  {
    level: "advanced",
    title: "Maintaining boundaries with family",
    situation: "A parent consistently criticizes your life choices during visits.",
    action: "Prepare a gentle emotional boundary: 'I appreciate your care, and I'm not open to feedback on this topic right now. Can we talk about something else?'",
    result: "You feel more confident redirecting conversations, and visits become more manageable over time."
  }
];

const BOUNDARY_TYPES = [
  { id: "emotional", label: "Emotional", icon: Heart, description: "Protecting your feelings and emotional energy" },
  { id: "time", label: "Time", icon: Clock, description: "How you spend and protect your time" },
  { id: "physical", label: "Physical", icon: Home, description: "Personal space and physical comfort" },
  { id: "social", label: "Social", icon: Users, description: "Interactions and social commitments" },
  { id: "communication", label: "Communication", icon: MessageCircle, description: "How and when you communicate" },
];

const SCRIPT_TEMPLATES = [
  { context: "Declining an invitation", script: "Thank you for thinking of me. I'm not able to make it this time, but I appreciate the invite." },
  { context: "Needing space", script: "I need some time to myself right now. I'll reach out when I'm ready to connect again." },
  { context: "Setting a time limit", script: "I have about [X] minutes to chat. After that, I need to get going." },
  { context: "Expressing a need", script: "I'd feel more comfortable if we could [specific request]. Would that work for you?" },
  { context: "Saying no to a request", script: "I'm not able to help with that right now. I hope you find what you need." },
];

export default function BoundariesPage() {
  const [selectedType, setSelectedType] = useState("emotional");
  const [situation, setSituation] = useState("");
  const [script, setScript] = useState("");
  const [softVersion, setSoftVersion] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ["/api/wellness-tools/boundaries"],
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/wellness-tools/boundaries", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/boundaries"] });
      setSituation("");
      setScript("");
      setSoftVersion("");
      toast({ title: "Script saved", description: "Your boundary script has been saved for future reference." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not save script. Please try again.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/wellness-tools/boundaries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/boundaries"] });
      toast({ title: "Script removed", description: "The boundary script has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not delete script. Please try again.", variant: "destructive" });
    },
  });

  const handleSaveScript = () => {
    if (!situation.trim() || !script.trim()) {
      toast({ title: "Missing information", description: "Please fill in the situation and script.", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      situation: situation.trim(),
      boundaryType: selectedType,
      script: script.trim(),
      softVersion: softVersion.trim() || null,
      practiceNotes: null,
    });
  };

  const handleCopyScript = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({ title: "Copied", description: "Script copied to clipboard" });
    } catch (err) {
      toast({ title: "Could not copy", description: "Please select and copy manually", variant: "destructive" });
    }
  };

  return (
  <WellnessPageShell
    title="BoundariesPage"
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
      <SEO title="Boundaries — The Genuine Love Project" description="Learn to set and maintain healthy personal boundaries." />


    <LayoutWrapper>
      <Hero
        title="Boundary Scripts"
        subtitle="Gentle phrases to help you communicate your needs — practice makes it easier"
        variant="wellness"
        data-testid="hero-boundaries"
      />

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <ClarityCard {...BOUNDARIES_CLARITY} variant="compact" className="mb-6" />

          <ExamplesAccordion 
            examples={BOUNDARIES_EXAMPLES} 
            title="See how others use boundary scripts"
            className="mb-8"
          />

          <MIPromptCard context="values" className="mb-8" />

          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                <Shield className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2" data-testid="heading-intro">
                  Setting boundaries is a form of self-care
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed" data-testid="text-intro">
                  Boundaries help protect your energy, time, and wellbeing. Having ready-made phrases can make it easier 
                  to communicate your needs, especially in difficult moments. These scripts are starting points — 
                  adapt them to feel natural for you.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8" data-testid="boundary-type-tabs">
            {BOUNDARY_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)]"
                  }`}
                  data-testid={`tab-${type.id}`}
                  aria-pressed={isActive}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-templates">
            Template scripts
          </h3>

          <CardGrid columns={1}>
            {SCRIPT_TEMPLATES.map((template, idx) => (
              <Card key={idx} data-testid={`card-template-${idx}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[var(--text-muted)] mb-2 block" data-testid={`text-context-${idx}`}>
                      {template.context}
                    </span>
                    <p className="text-[var(--text-primary)] italic" data-testid={`text-script-${idx}`}>
                      "{template.script}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyScript(template.script, `template-${idx}`)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                    aria-label={`Copy script: ${template.context}`}
                    data-testid={`button-copy-template-${idx}`}
                  >
                    {copiedId === `template-${idx}` ? (
                      <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </Card>
            ))}
          </CardGrid>

          <div className="mt-12 p-6 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)]" data-testid="section-create-script">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-create">
              Create your own script
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="situation" data-testid="label-situation">
                  Situation
                </label>
                <input
                  id="situation"
                  type="text"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="e.g., When someone asks me to work late..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  data-testid="input-situation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="script" data-testid="label-script">
                  Your script
                </label>
                <textarea
                  id="script"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="What you might say..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  data-testid="textarea-script"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="soft-version" data-testid="label-soft-version">
                  Softer version (optional)
                </label>
                <textarea
                  id="soft-version"
                  value={softVersion}
                  onChange={(e) => setSoftVersion(e.target.value)}
                  placeholder="A gentler way to say the same thing..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  data-testid="textarea-soft-version"
                />
              </div>
              <Button
                onClick={handleSaveScript}
                disabled={!situation.trim() || !script.trim() || createMutation.isPending}
                data-testid="button-save-script"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Save Script
                  </>
                )}
              </Button>
            </div>
          </div>

          {scripts.length > 0 && (
            <div className="mt-12" data-testid="section-my-scripts">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-my-scripts">
                My Scripts ({scripts.length})
              </h3>
              <div className="grid gap-3">
                {scripts.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]"
                    data-testid={`card-script-${s.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[var(--text-muted)] block mb-1" data-testid={`text-situation-${s.id}`}>
                          {s.situation}
                        </span>
                        <p className="text-[var(--text-primary)] italic" data-testid={`text-script-${s.id}`}>
                          "{s.script}"
                        </p>
                        {s.softVersion && (
                          <p className="text-sm text-[var(--text-secondary)] italic mt-2" data-testid={`text-soft-${s.id}`}>
                            Softer: "{s.softVersion}"
                          </p>
                        )}
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)]" data-testid={`badge-type-${s.id}`}>
                          {s.boundaryType}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyScript(s.script, s.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                          aria-label="Copy script"
                          data-testid={`button-copy-${s.id}`}
                        >
                          {copiedId === s.id ? (
                            <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(s.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                          aria-label="Delete script"
                          data-testid={`button-delete-${s.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8" data-testid="loading-state">
              <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin motion-reduce:animate-none mx-auto" />
              <p className="text-sm text-[var(--text-muted)] mt-2">Loading your scripts...</p>
            </div>
          )}
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  </WellnessPageShell>
  );
}
