import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Share2, Download, FileText, Copy, Check, Sparkles } from 'lucide-react';
import { Instagram, Youtube, Linkedin } from "../lib/lucide-brands";
import { SiPinterest, SiTiktok } from "react-icons/si";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PLATFORMS = [
  { name: "Instagram / Reels", icon: Instagram, color: "from-pink-500 to-purple-600" },
  { name: "YouTube Shorts", icon: Youtube, color: "from-red-500 to-red-600" },
  { name: "Pinterest", icon: SiPinterest, color: "from-red-400 to-red-500" },
  { name: "LinkedIn", icon: Linkedin, color: "from-blue-600 to-blue-700" },
  { name: "TikTok", icon: SiTiktok, color: "from-gray-800 to-black" },
];

const CONTENT_TEMPLATES = [
  { 
    id: "affirmation", 
    title: "Daily Affirmation", 
    template: "Today's affirmation: {content}\n\n#selfcare #mentalhealth #wellness #healing #genuinelove",
    platforms: ["instagram", "tiktok", "twitter"]
  },
  { 
    id: "quote", 
    title: "Inspirational Quote", 
    template: '"{quote}" - {author}\n\nWhat does this mean to you?\n\n#inspiration #motivation #mentalhealth #selfgrowth',
    platforms: ["instagram", "linkedin", "pinterest"]
  },
  { 
    id: "tip", 
    title: "Wellness Tip", 
    template: "Wellness Tip: {tip}\n\nTry this today and let us know how it goes!\n\n#wellnesstips #mentalhealth #selfcare #healing",
    platforms: ["instagram", "tiktok", "youtube"]
  },
  { 
    id: "reflection", 
    title: "Reflection Prompt", 
    template: "Today's reflection: {prompt}\n\nTake a moment to journal or share your thoughts.\n\n#journaling #reflection #mentalhealth #mindfulness",
    platforms: ["instagram", "linkedin"]
  }
];

export default function SocialHub() {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(template.template);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied!",
      description: `${template.title} template copied to clipboard.`
    });
  };
  
  const handleExportAll = () => {
    const exportData = CONTENT_TEMPLATES.map(t => 
      `=== ${t.title} ===\n${t.template}\nPlatforms: ${t.platforms.join(', ')}\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glp-social-templates-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Templates Exported",
      description: "All templates have been downloaded."
    });
  };
  
  const handleGenerateCaption = () => {
    const captions = [
      "Remember: healing isn't linear, and that's okay. Every small step counts. 🌿",
      "Your feelings are valid. Take a breath. You're doing better than you think. 💚",
      "Today's reminder: You deserve the same compassion you give to others. ✨",
      "Gentle reminder: Rest is not a reward, it's a necessity. 🌸"
    ];
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
    navigator.clipboard.writeText(randomCaption);
    toast({
      title: "Caption Generated!",
      description: "A wellness caption has been copied to your clipboard."
    });
  };

  return (
  <WellnessPageShell
    title="SocialHub"
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

    <>
      <SEO 
        title="Social Hub - The Genuine Love Project"
        description="Templates, captions, hashtags, and scheduling exports for social media."
      />
      <div className="min-h-screen v28-paper-bg p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Share2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal">Social Hub</h1>
                <p className="text-lead">Templates, captions, hashtags, and scheduling exports</p>
              </div>
            </div>
          </header>

          <div className="card-bordered">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container icon-md icon-soft-sage">
                <Share2 className="w-5 h-5" />
              </div>
              <h2 className="text-heading-md text-teal">Supported Platforms</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORMS.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)] hover:shadow-md transition"
                  >
                    <div className={`icon-container icon-md bg-gradient-to-br ${platform.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-body-sm font-medium">{platform.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-bordered mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="icon-container icon-md icon-soft-sage">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-heading-md text-teal">Content Templates</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateCaption}
                  data-testid="button-generate-caption"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Caption
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAll}
                  data-testid="button-export-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {CONTENT_TEMPLATES.map((template) => (
                <div 
                  key={template.id}
                  className="p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)] hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--sage-800)]">{template.title}</h3>
                      <p className="text-body-sm text-[var(--sage-600)] mt-1 font-mono text-sm bg-white/50 p-2 rounded mt-2">
                        {template.template.substring(0, 100)}...
                      </p>
                      <div className="flex gap-2 mt-3">
                        {template.platforms.map((p) => (
                          <span key={p} className="text-xs px-2 py-1 bg-[var(--teal-100)] text-[var(--teal-700)] rounded-full capitalize">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyTemplate(template)}
                      data-testid={`copy-${template.id}`}
                    >
                      {copiedId === template.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
