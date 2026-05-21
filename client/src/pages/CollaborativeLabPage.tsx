import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Users, Heart, MessageCircle, Shield, Eye, EyeOff, Send, Sparkles, Brain, Lightbulb, RefreshCw, Quote, Bookmark } from 'lucide-react';
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

interface SharedInsight {
  id: string;
  content: string;
  category: "realization" | "question" | "gratitude" | "challenge" | "wisdom";
  timestamp: string;
  resonanceCount: number;
  isBookmarked: boolean;
}

interface LabProfile {
  sharedInsights: SharedInsight[];
  bookmarkedInsights: string[];
  resonatedWith: string[];
  lastVisit: string;
}

const STORAGE_KEY = "glp_collaborative_lab";

const INSIGHT_CATEGORIES = [
  { id: "realization", name: "Realization", icon: Lightbulb, color: "text-amber-400", description: "Something you've come to understand" },
  { id: "question", name: "Open Question", icon: Brain, color: "text-purple-400", description: "A question you're sitting with" },
  { id: "gratitude", name: "Gratitude", icon: Heart, color: "text-rose-400", description: "Something you appreciate" },
  { id: "challenge", name: "Challenge", icon: Shield, color: "text-blue-400", description: "Something you're working through" },
  { id: "wisdom", name: "Wisdom", icon: Sparkles, color: "text-emerald-400", description: "Insight for fellow travelers" }
];

const REFLECTION_PROMPTS = [
  "What truth have you been avoiding that might set you free?",
  "What would you attempt if you knew you could not fail?",
  "What has disappointment taught you about what you truly value?",
  "Where in your life are you playing small when you could be playing big?",
  "What would your 80-year-old self thank you for doing today?",
  "What belief about yourself are you ready to release?",
  "What is trying to emerge in your life that you've been resisting?",
  "What conversation are you avoiding that could change everything?",
  "What part of yourself have you been neglecting that needs attention?",
  "What would love do in your current situation?"
];

const COMMUNITY_INSIGHTS: SharedInsight[] = [
  {
    id: "comm-1",
    content: "I realized that my need for certainty was keeping me from growth. Uncertainty isn't the enemy—it's the space where possibility lives.",
    category: "realization",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    resonanceCount: 47,
    isBookmarked: false
  },
  {
    id: "comm-2",
    content: "How do we hold space for grief while still moving forward? Not bypassing it, not drowning in it, but dancing with it?",
    category: "question",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    resonanceCount: 32,
    isBookmarked: false
  },
  {
    id: "comm-3",
    content: "Grateful for the small moments of peace between the storms. They're teaching me that calm isn't the absence of chaos—it's presence in the midst of it.",
    category: "gratitude",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    resonanceCount: 89,
    isBookmarked: false
  },
  {
    id: "comm-4",
    content: "Working through the realization that I've been seeking external validation for internal worth. The work is slow, but it's honest.",
    category: "challenge",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    resonanceCount: 56,
    isBookmarked: false
  },
  {
    id: "comm-5",
    content: "Sometimes the most loving thing you can do for yourself is to stop trying to fix yourself and simply witness yourself with compassion.",
    category: "wisdom",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    resonanceCount: 124,
    isBookmarked: false
  },
  {
    id: "comm-6",
    content: "I'm learning that boundaries aren't walls—they're bridges that allow for sustainable connection.",
    category: "realization",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    resonanceCount: 78,
    isBookmarked: false
  }
];

function loadProfile(): LabProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    sharedInsights: [],
    bookmarkedInsights: [],
    resonatedWith: [],
    lastVisit: new Date().toISOString()
  };
}

function saveProfile(profile: LabProfile) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }
}

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function CollaborativeLabPage() {
  const [profile, setProfile] = useState<LabProfile>(loadProfile);
  const [activeTab, setActiveTab] = useState<"explore" | "share" | "reflect">("explore");
  const [newInsight, setNewInsight] = useState({ content: "", category: "realization" as const });
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    const updated = { ...profile, lastVisit: new Date().toISOString() };
    saveProfile(updated);
  }, []);

  const allInsights = [...COMMUNITY_INSIGHTS, ...profile.sharedInsights].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const shareInsight = () => {
    if (!newInsight.content.trim()) return;
    
    const insight: SharedInsight = {
      id: `user-${Date.now()}`,
      content: newInsight.content.trim(),
      category: newInsight.category,
      timestamp: new Date().toISOString(),
      resonanceCount: 0,
      isBookmarked: false
    };

    const updated = {
      ...profile,
      sharedInsights: [...profile.sharedInsights, insight]
    };
    setProfile(updated);
    saveProfile(updated);
    setNewInsight({ content: "", category: "realization" });
  };

  const toggleResonance = (insightId: string) => {
    setProfile(p => {
      const updated = p.resonatedWith.includes(insightId)
        ? { ...p, resonatedWith: p.resonatedWith.filter(id => id !== insightId) }
        : { ...p, resonatedWith: [...p.resonatedWith, insightId] };
      saveProfile(updated);
      return updated;
    });
  };

  const toggleBookmark = (insightId: string) => {
    setProfile(p => {
      const updated = p.bookmarkedInsights.includes(insightId)
        ? { ...p, bookmarkedInsights: p.bookmarkedInsights.filter(id => id !== insightId) }
        : { ...p, bookmarkedInsights: [...p.bookmarkedInsights, insightId] };
      saveProfile(updated);
      return updated;
    });
  };

  const nextPrompt = () => {
    setCurrentPrompt(p => (p + 1) % REFLECTION_PROMPTS.length);
  };

  const getCategoryIcon = (category: string) => {
    const cat = INSIGHT_CATEGORIES.find(c => c.id === category);
    return cat ? cat.icon : MessageCircle;
  };

  const getCategoryColor = (category: string) => {
    const cat = INSIGHT_CATEGORIES.find(c => c.id === category);
    return cat ? cat.color : "text-white";
  };

  return (
  <WellnessPageShell
    title="CollaborativeLabPage"
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
      <SEO title="Collaborative Lab — MyMentalHealthBuddy" description="Explore wellness tools in a collaborative environment." />


    <div className="min-h-screen v28-paper-bg">
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="icon-container icon-xl icon-gradient-blush">
              <Users className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-display-lg text-teal mb-4" data-testid="text-lab-title">
            Collaborative Intelligence Lab
          </h1>
          <p className="text-lead max-w-2xl mx-auto" data-testid="text-lab-subtitle">
            A sanctuary for anonymous reflection and shared wisdom.
            Connect through insights, not identities.
          </p>
        </header>

        <BenefitsBlock
          benefits={[
            "Share insights anonymously with fellow seekers",
            "Explore curated reflection prompts for deeper thinking",
            "Connect through wisdom, not identity—privacy is sacred"
          ]}
          duration="5–15 min"
          control="Share only what feels right—pause anytime"
          disclaimer="Peer insight sharing—not clinical advice. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-6"
        />

        <div className="flex items-center justify-center gap-4 p-2 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)] mb-8">
          {[
            { id: "explore", label: "Explore", icon: Sparkles },
            { id: "share", label: "Share", icon: MessageCircle },
            { id: "reflect", label: "Reflect", icon: Brain }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id ? "bg-white shadow-sm text-[var(--teal-700)]" : "hover:bg-white/50 text-[var(--sage-600)]"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "explore" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blush-50 to-gold-50 border border-blush-200 flex items-center gap-4">
              <div className="icon-container icon-md icon-soft-blush">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-body-sm font-medium text-teal">Anonymous & Private</h3>
                <p className="text-caption">All insights are shared anonymously. Your privacy is sacred.</p>
              </div>
            </div>

            <div className="space-y-4">
              {allInsights.map(insight => {
                const CategoryIcon = getCategoryIcon(insight.category);
                const isResonated = profile.resonatedWith.includes(insight.id);
                const isBookmarked = profile.bookmarkedInsights.includes(insight.id);
                const displayResonance = insight.resonanceCount + (isResonated ? 1 : 0);

                return (
                  <div
                    key={insight.id}
                    className="card-bordered hover:shadow-md transition-all"
                    data-testid={`card-insight-${insight.id}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="icon-container icon-sm icon-soft-sage">
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-caption capitalize">{insight.category}</span>
                          <span className="text-sage-300">•</span>
                          <span className="text-caption">{formatTimeAgo(insight.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-body-sm leading-relaxed mb-4 text-teal-700">{insight.content}</p>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleResonance(insight.id)}
                        className={`flex items-center gap-1.5 text-xs transition-all ${
                          isResonated ? "text-blush-500" : "text-sage-400 hover:text-blush-500"
                        }`}
                        data-testid={`button-resonate-${insight.id}`}
                      >
                        <Heart className="h-4 w-4" fill={isResonated ? "currentColor" : "none"} />
                        <span>{displayResonance}</span>
                      </button>
                      <button
                        onClick={() => toggleBookmark(insight.id)}
                        className={`flex items-center gap-1.5 text-xs transition-all ${
                          isBookmarked ? "text-gold-500" : "text-sage-400 hover:text-gold-500"
                        }`}
                        data-testid={`button-bookmark-${insight.id}`}
                      >
                        <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
                        Save
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "share" && (
          <div className="space-y-6">
            <div className="card-bordered bg-gradient-to-br from-blush-50 to-gold-50">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-teal-500" />
                Share an Insight
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="form-label">What type of insight?</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {INSIGHT_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewInsight(n => ({ ...n, category: cat.id as any }))}
                        className={`p-3 rounded-xl border transition-all text-center ${
                          newInsight.category === cat.id
                            ? "border-sage-400 bg-sage-50"
                            : "border-sage-200 bg-white hover:bg-sage-50"
                        }`}
                        data-testid={`button-category-${cat.id}`}
                      >
                        <cat.icon className="h-4 w-4 mx-auto mb-1 text-sage-500" />
                        <span className="text-caption">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Your insight</label>
                  <textarea
                    value={newInsight.content}
                    onChange={e => setNewInsight(n => ({ ...n, content: e.target.value }))}
                    placeholder="Share what you've learned, what you're questioning, or wisdom for fellow travelers..."
                    className="w-full h-32 px-4 py-3 rounded-xl border border-sage-200 bg-white text-teal-700 placeholder:text-sage-400 resize-none focus:ring-2 focus:ring-sage-400/50 focus:outline-none"
                    data-testid="textarea-insight"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sage-50 border border-sage-200 text-caption text-teal-600"
                      data-testid="button-toggle-anonymous"
                    >
                      {isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isAnonymous ? "Anonymous" : "With Name"}
                    </button>
                  </div>

                  <button
                    onClick={shareInsight}
                    disabled={!newInsight.content.trim()}
                    className="btn-premium flex items-center gap-2 px-4 py-2 disabled:opacity-50"
                    data-testid="button-share-insight"
                  >
                    <Send className="h-4 w-4" />
                    Share with Community
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sage-50 border border-sage-200">
              <p className="text-caption text-center">
                All shared insights are stored locally and displayed anonymously.
                Your privacy is protected—we never collect identifying information.
              </p>
            </div>
          </div>
        )}

        {activeTab === "reflect" && (
          <div className="space-y-6">
            <div className="card-bordered bg-gradient-to-br from-gold-50 via-blush-50 to-sage-50 text-center">
              <Quote className="h-8 w-8 mx-auto mb-4 text-sage-400" />
              <p className="text-xl font-medium leading-relaxed mb-6 text-teal-700" data-testid="text-prompt">
                {REFLECTION_PROMPTS[currentPrompt]}
              </p>
              <button
                onClick={nextPrompt}
                className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-sage-100 border border-sage-300 text-sage-700 hover:bg-sage-200 transition-all"
                data-testid="button-next-prompt"
              >
                <RefreshCw className="h-4 w-4" />
                New Prompt
              </button>
            </div>

            <div className="card-bordered">
              <h3 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-sage-500" />
                Your Reflection
              </h3>
              <textarea
                placeholder="Take your time with this prompt. There's no rush, no right answer..."
                className="w-full h-40 px-4 py-3 rounded-xl border border-sage-200 bg-white text-teal-700 placeholder:text-sage-400 resize-none focus:ring-2 focus:ring-sage-400/50 focus:outline-none"
                data-testid="textarea-reflection"
              />
              <p className="text-caption mt-3 text-center">
                This reflection stays private on your device.
              </p>
            </div>

            {profile.bookmarkedInsights.length > 0 && (
              <div className="card-bordered">
                <h3 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-gold-500" />
                  Your Saved Insights
                </h3>
                <div className="space-y-3">
                  {allInsights
                    .filter(i => profile.bookmarkedInsights.includes(i.id))
                    .map(insight => (
                      <div key={insight.id} className="p-3 rounded-lg bg-sage-50 border border-sage-200 text-body-sm text-teal-700">
                        {insight.content}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-caption max-w-md mx-auto">
            This space honors the courage it takes to reflect honestly.
            Every insight shared adds to our collective wisdom.
          </p>
        </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
