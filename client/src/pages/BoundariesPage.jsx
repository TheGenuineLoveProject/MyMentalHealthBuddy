import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { Shield, MessageCircle, Clock, Users, Home, Heart, Plus, Trash2, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [customScript, setCustomScript] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ["/api/wellness-tools/boundaries"],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("/api/wellness-tools/boundaries", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/boundaries"] });
      setSituation("");
      setCustomScript("");
      toast({ title: "Script saved", description: "Your boundary script has been saved for future reference." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest(`/api/wellness-tools/boundaries/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/boundaries"] });
      toast({ title: "Script removed", description: "The boundary script has been removed." });
    },
  });

  const handleSaveScript = () => {
    if (!situation.trim() || !customScript.trim()) return;
    createMutation.mutate({
      boundaryType: selectedType,
      situation: situation,
      scriptText: customScript,
      tags: [],
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
    <LayoutWrapper>
      <Hero
        title="Boundary Scripts"
        subtitle="Gentle phrases to help you communicate your needs — practice makes it easier"
        variant="wellness"
        data-testid="hero-boundaries"
      />

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                <Shield className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Setting boundaries is a form of self-care
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
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
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
            Template scripts
          </h3>

          <CardGrid columns={1}>
            {SCRIPT_TEMPLATES.map((template, idx) => (
              <Card key={idx} data-testid={`card-template-${idx}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[var(--text-muted)] mb-2 block">
                      {template.context}
                    </span>
                    <p className="text-[var(--text-primary)] italic">
                      "{template.script}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyScript(template.script, `template-${idx}`)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
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
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
              Create your own script
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Situation
                </label>
                <input
                  type="text"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="e.g., When someone asks me to work late..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  data-testid="input-situation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Your script
                </label>
                <textarea
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  placeholder="What you might say..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  data-testid="textarea-script"
                />
              </div>
              <Button
                onClick={handleSaveScript}
                disabled={!situation.trim() || !customScript.trim() || createMutation.isPending}
                data-testid="button-save-script"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Script
              </Button>
            </div>
          </div>

          {scripts.length > 0 && (
            <div className="mt-12" data-testid="section-my-scripts">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                My Scripts ({scripts.length})
              </h3>
              <div className="grid gap-3">
                {scripts.map((script) => (
                  <div
                    key={script.id}
                    className="p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]"
                    data-testid={`card-script-${script.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[var(--text-muted)] block mb-1">
                          {script.situation}
                        </span>
                        <p className="text-[var(--text-primary)] italic">
                          "{script.scriptText}"
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)]">
                          {script.boundaryType}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyScript(script.scriptText, script.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                          data-testid={`button-copy-${script.id}`}
                        >
                          {copiedId === script.id ? (
                            <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(script.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                          data-testid={`button-delete-${script.id}`}
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
              <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  );
}
