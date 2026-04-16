import { useState } from "react";
import { Link } from "wouter";
import { MessageSquare, ArrowLeft, Copy, Check, ChevronRight } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";

const SCRIPT_TEMPLATES = [
  {
    id: "apology",
    title: "Apology",
    template: "I want to apologize for [what happened]. I understand that my actions [impact on them]. I take responsibility for this. Going forward, I will [what you'll do differently]. Is there anything else you need from me?"
  },
  {
    id: "boundary",
    title: "Setting a Boundary",
    template: "I care about our relationship, and I need to share something. When [situation], I feel [your feeling]. I need [your need]. Can we talk about how to make this work for both of us?"
  },
  {
    id: "reconnect",
    title: "Reconnection",
    template: "I've been thinking about us, and I miss our connection. I know we've had some distance. I'd like to [suggested next step]. Would you be open to that?"
  },
  {
    id: "express",
    title: "Express Hurt",
    template: "There's something I need to share with you. When [what happened], I felt [your feeling]. I'm not sure you knew how it affected me. I'm sharing this because I value our relationship and want to move forward together."
  }
];

export default function RepairScript() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customScript, setCustomScript] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCustomScript(template.template);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(customScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-background dark:from-pink-900/10 dark:to-background">
      <SEO 
        title="Repair Script — MyMentalHealthBuddy"
        description="Templates for difficult conversations and relationship repair."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm mb-4">
            <MessageSquare className="w-4 h-4" />
            <span>Relationship Tool</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Repair Script
          </h1>
          <p className="text-muted-foreground">
            Templates to help you find words for difficult conversations.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {SCRIPT_TEMPLATES.map(template => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => handleSelectTemplate(template)}
              data-testid={`template-${template.id}`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <span className="font-medium">{template.title}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTemplate && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Customize Your Script: {selectedTemplate.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Edit the template below. Replace the bracketed sections with your own words.
              </p>
              <Textarea
                value={customScript}
                onChange={(e) => { setCustomScript(e.target.value); setCopied(false); }}
                rows={6}
                className="font-mono text-sm"
                data-testid="textarea-script"
              />
              <div className="flex justify-end">
                <Button onClick={handleCopy} variant="outline" data-testid="button-copy">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tips for Difficult Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Choose a calm moment, not during an argument</li>
              <li>• Use "I" statements to express your feelings</li>
              <li>• Listen as much as you speak</li>
              <li>• It's okay to take breaks if emotions run high</li>
              <li>• You can't control their response, only your words</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <SafetyFooter />
    </div>
  );
}
