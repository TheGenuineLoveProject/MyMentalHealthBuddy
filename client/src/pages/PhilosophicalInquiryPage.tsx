import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Sparkles, BookOpen, HelpCircle, Lightbulb, ChevronRight, RefreshCw, Save } from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const STORAGE_KEY = "glp_philosophical_inquiry";

type InquirySession = {
  id: string;
  topic: string;
  questions: string[];
  responses: string[];
  insights: string[];
  createdAt: string;
};

type Profile = {
  sessions: InquirySession[];
  totalInquiries: number;
};

const SOCRATIC_TEMPLATES = [
  { category: "Clarification", questions: ["What do you mean by that?", "Can you give me an example?", "How does this relate to what we discussed?", "Could you put that another way?"] },
  { category: "Assumptions", questions: ["What are you assuming here?", "Why would someone make this assumption?", "What if the opposite were true?", "How can you verify this assumption?"] },
  { category: "Evidence", questions: ["What evidence supports this?", "How do you know this is true?", "What would change your mind?", "Is this always the case?"] },
  { category: "Perspectives", questions: ["How might others see this differently?", "What would a skeptic say?", "What are the strengths of opposing views?", "Who benefits from this belief?"] },
  { category: "Implications", questions: ["What follows from this?", "If this is true, what else must be true?", "What are the consequences?", "How does this affect other beliefs?"] },
  { category: "Meta-Questions", questions: ["Why is this question important?", "What makes this hard to answer?", "What would make this easier to understand?", "Is this the right question to ask?"] },
];

const DIALECTICAL_PROMPTS = [
  { thesis: "Freedom is the highest value", antithesis: "Security is more fundamental than freedom", synthesis: "True freedom requires a foundation of security, and meaningful security protects freedom" },
  { thesis: "Knowledge comes from experience", antithesis: "Knowledge comes from reason", synthesis: "Knowledge emerges from the interplay of experience and reason, each informing the other" },
  { thesis: "Individuals shape society", antithesis: "Society shapes individuals", synthesis: "Individuals and society co-create each other in an ongoing dialogue" },
  { thesis: "Change is the only constant", antithesis: "Some things remain eternal", synthesis: "Change occurs within patterns that persist, and permanence exists within transformation" },
  { thesis: "Emotions cloud judgment", antithesis: "Emotions provide essential information", synthesis: "Integrated wisdom uses emotions as data while applying reason to interpret them" },
];

function uid() {
  return `pi_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { sessions: [], totalInquiries: 0 };
  } catch {
    return { sessions: [], totalInquiries: 0 };
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function generateSocraticQuestion(topic: string, depth: number): string {
  const templates = SOCRATIC_TEMPLATES[depth % SOCRATIC_TEMPLATES.length];
  const questions = templates.questions;
  return questions[Math.floor(Math.random() * questions.length)];
}

function extractInsight(topic: string, responses: string[]): string {
  const combined = responses.join(" ").toLowerCase();
  
  if (combined.includes("realize") || combined.includes("understand")) {
    return "A shift in understanding is emerging. Notice what assumptions are being questioned.";
  }
  if (combined.includes("feel") || combined.includes("emotion")) {
    return "Emotions are present in this inquiry. They often point to deeply held values.";
  }
  if (combined.includes("but") || combined.includes("however")) {
    return "Tension between perspectives is visible. This dialectic can lead to synthesis.";
  }
  if (combined.includes("why") || combined.includes("how")) {
    return "You're digging deeper. Continue following the thread of curiosity.";
  }
  
  return "The inquiry is unfolding. Stay curious and let the questions guide you.";
}

export default function PhilosophicalInquiryPage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [topic, setTopic] = useState("");
  const [currentSession, setCurrentSession] = useState<InquirySession | null>(null);
  const [currentResponse, setCurrentResponse] = useState("");
  const [selectedDialectic, setSelectedDialectic] = useState<number | null>(null);

  const startInquiry = () => {
    if (topic.trim().length < 5) return;
    
    const session: InquirySession = {
      id: uid(),
      topic: topic.trim(),
      questions: [generateSocraticQuestion(topic, 0)],
      responses: [],
      insights: [],
      createdAt: new Date().toISOString(),
    };
    
    setCurrentSession(session);
  };

  const submitResponse = () => {
    if (!currentSession || currentResponse.trim().length < 5) return;
    
    const updatedResponses = [...currentSession.responses, currentResponse.trim()];
    const depth = updatedResponses.length;
    const newQuestion = depth < 6 ? generateSocraticQuestion(currentSession.topic, depth) : null;
    const newInsight = extractInsight(currentSession.topic, updatedResponses);
    
    const updated: InquirySession = {
      ...currentSession,
      responses: updatedResponses,
      questions: newQuestion ? [...currentSession.questions, newQuestion] : currentSession.questions,
      insights: [...currentSession.insights, newInsight],
    };
    
    setCurrentSession(updated);
    setCurrentResponse("");
  };

  const saveSession = () => {
    if (!currentSession) return;
    
    const updatedProfile: Profile = {
      sessions: [currentSession, ...profile.sessions].slice(0, 50),
      totalInquiries: profile.totalInquiries + 1,
    };
    
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
    setCurrentSession(null);
    setTopic("");
  };

  const reset = () => {
    setCurrentSession(null);
    setTopic("");
    setCurrentResponse("");
  };

  return (
  <WellnessPageShell
    title="PhilosophicalInquiryPage"
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
      <SEO title="Philosophical Inquiry — The Genuine Love Project" description="Explore life's big questions with gentle guidance." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <header className="mb-8">
          <Link href="/atlas" className="inline-flex items-center gap-2 text-body-sm text-sage-600 hover:text-teal-700 mb-4 transition-colors" data-testid="link-back">
            <ArrowLeft className="h-4 w-4" /> Back to Atlas
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="icon-container icon-xl icon-gradient-gold">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-title">
              Philosophical Inquiry
            </h1>
          </div>
          <p className="text-lead max-w-2xl">
            Socratic questioning and dialectical reasoning. Examine beliefs, discover assumptions, find synthesis.
          </p>
        </header>

        <BenefitsBlock
          benefit="Deeper self-understanding through Socratic questioning and dialectical reasoning"
          duration="10–20 minutes per inquiry session"
          control="Explore at your own pace — save insights or start fresh anytime"
          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-gold mx-auto mb-3">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-gold-600" data-testid="text-inquiries">{profile.totalInquiries}</div>
            <p className="text-caption">Total Inquiries</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-teal mx-auto mb-3">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-insights">{profile.sessions.reduce((s, e) => s + e.insights.length, 0)}</div>
            <p className="text-caption">Insights Generated</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-sage mx-auto mb-3">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-sage-600" data-testid="text-sessions">{profile.sessions.length}</div>
            <p className="text-caption">Saved Sessions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {!currentSession ? (
              <div className="card-bordered">
                <h2 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold-500" />
                  Begin an Inquiry
                </h2>
                
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic, belief, or question to examine..."
                  className="w-full p-4 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/50 mb-4"
                  data-testid="input-topic"
                />

                <button
                  onClick={startInquiry}
                  disabled={topic.trim().length < 5}
                  className="w-full btn-premium py-3 disabled:opacity-50"
                  data-testid="button-start"
                >
                  Start Socratic Inquiry
                </button>
              </div>
            ) : (
              <div className="card-bordered bg-gradient-to-br from-gold-50 to-blush-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-heading-sm text-teal">Inquiry: {currentSession.topic}</h2>
                  <button
                    onClick={reset}
                    className="p-2 rounded-lg bg-white border border-sage-200 text-teal-600 hover:bg-sage-50"
                    data-testid="button-reset"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                  {currentSession.questions.map((q, i) => (
                    <div key={i} className="space-y-2">
                      <div className="p-3 rounded-lg bg-gold-50 border border-gold-200">
                        <div className="text-xs text-gold-600 font-medium mb-1">Question {i + 1}</div>
                        <p className="text-body-sm font-medium text-teal-700">{q}</p>
                      </div>
                      {currentSession.responses[i] && (
                        <div className="p-3 rounded-lg bg-white border border-sage-200 ml-4">
                          <div className="text-caption font-medium mb-1">Your Response</div>
                          <p className="text-body-sm">{currentSession.responses[i]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {currentSession.questions.length > currentSession.responses.length && (
                  <div className="space-y-3">
                    <textarea
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      placeholder="Reflect and respond..."
                      className="w-full h-24 p-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 resize-none focus:outline-none focus:ring-2 focus:ring-sage-400/50"
                      data-testid="input-response"
                    />
                    <button
                      onClick={submitResponse}
                      disabled={currentResponse.trim().length < 5}
                      className="w-full btn-premium py-2 disabled:opacity-50"
                      data-testid="button-respond"
                    >
                      <ChevronRight className="h-4 w-4 inline mr-1" />
                      Continue Inquiry
                    </button>
                  </div>
                )}

                {currentSession.responses.length >= 3 && (
                  <button
                    onClick={saveSession}
                    className="w-full py-3 rounded-xl bg-sage-100 border border-sage-300 text-sage-700 hover:bg-sage-200 transition-all font-medium mt-4"
                    data-testid="button-save"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Save Inquiry
                  </button>
                )}
              </div>
            )}

            {currentSession && currentSession.insights.length > 0 && (
              <div className="card-bordered">
                <h3 className="text-body-sm font-semibold text-teal-600 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-teal-500" />
                  Emerging Insights
                </h3>
                <ul className="space-y-2">
                  {currentSession.insights.map((ins, i) => (
                    <li key={i} className="text-body-sm flex items-start gap-2">
                      <span className="text-teal-500 mt-1">•</span>
                      {ins}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card-bordered">
              <h3 className="text-body-sm font-semibold text-teal-600 mb-3">Dialectical Thinking</h3>
              <p className="text-caption mb-4">
                Explore how opposing ideas can lead to deeper truth through synthesis.
              </p>
              
              <div className="space-y-3">
                {DIALECTICAL_PROMPTS.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDialectic(selectedDialectic === i ? null : i)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedDialectic === i ? "bg-blush-50 border-blush-300" : "bg-white border-sage-200 hover:bg-sage-50"}`}
                    data-testid={`button-dialectic-${i}`}
                  >
                    <div className="text-body-sm font-medium text-teal-700">{d.thesis}</div>
                    {selectedDialectic === i && (
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="p-2 rounded bg-blush-50 border border-blush-200">
                          <span className="text-blush-600 font-medium">Antithesis:</span> <span className="text-teal-600">{d.antithesis}</span>
                        </div>
                        <div className="p-2 rounded bg-sage-50 border border-sage-200">
                          <span className="text-sage-600 font-medium">Synthesis:</span> <span className="text-teal-600">{d.synthesis}</span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-bordered">
              <h3 className="text-body-sm font-semibold text-teal-600 mb-3">Socratic Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {SOCRATIC_TEMPLATES.map((cat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gold-50 border border-gold-200">
                    <div className="text-body-sm font-medium text-gold-700">{cat.category}</div>
                    <div className="text-caption mt-1">{cat.questions.length} questions</div>
                  </div>
                ))}
              </div>
            </div>

            {profile.sessions.length > 0 && (
              <div className="card-bordered">
                <h3 className="text-body-sm font-semibold text-sage-600 mb-3">Recent Inquiries</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {profile.sessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="p-2 rounded-lg bg-sage-50 border border-sage-200">
                      <div className="text-body-sm font-medium text-teal-700">{s.topic}</div>
                      <div className="text-caption">{s.responses.length} exchanges</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
