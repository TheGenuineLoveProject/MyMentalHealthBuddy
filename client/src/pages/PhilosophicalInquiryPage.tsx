import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Sparkles, BookOpen, HelpCircle, Lightbulb, ChevronRight, RefreshCw, Save } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/atlas">
            <a className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Atlas
            </a>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="h-10 w-10 text-amber-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent" data-testid="text-title">
              Philosophical Inquiry
            </h1>
          </div>
          <p className="text-lg opacity-70">
            Socratic questioning and dialectical reasoning. Examine beliefs, discover assumptions, find synthesis.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <HelpCircle className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold" data-testid="text-inquiries">{profile.totalInquiries}</div>
            <p className="text-xs opacity-50">Total Inquiries</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Lightbulb className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
            <div className="text-2xl font-bold" data-testid="text-insights">{profile.sessions.reduce((s, e) => s + e.insights.length, 0)}</div>
            <p className="text-xs opacity-50">Insights Generated</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
            <div className="text-2xl font-bold" data-testid="text-sessions">{profile.sessions.length}</div>
            <p className="text-xs opacity-50">Saved Sessions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {!currentSession ? (
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  Begin an Inquiry
                </h2>
                
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic, belief, or question to examine..."
                  className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 mb-4"
                  data-testid="input-topic"
                />

                <button
                  onClick={startInquiry}
                  disabled={topic.trim().length < 5}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 font-semibold disabled:opacity-50 hover:from-amber-500 hover:to-orange-500 transition-all"
                  data-testid="button-start"
                >
                  Start Socratic Inquiry
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Inquiry: {currentSession.topic}</h2>
                  <button
                    onClick={reset}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                    data-testid="button-reset"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                  {currentSession.questions.map((q, i) => (
                    <div key={i} className="space-y-2">
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="text-xs text-amber-400 mb-1">Question {i + 1}</div>
                        <p className="font-medium">{q}</p>
                      </div>
                      {currentSession.responses[i] && (
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 ml-4">
                          <div className="text-xs opacity-50 mb-1">Your Response</div>
                          <p className="text-sm opacity-80">{currentSession.responses[i]}</p>
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
                      className="w-full h-24 p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      data-testid="input-response"
                    />
                    <button
                      onClick={submitResponse}
                      disabled={currentResponse.trim().length < 5}
                      className="w-full py-2 rounded-xl bg-amber-600 font-medium disabled:opacity-50 hover:bg-amber-500"
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
                    className="w-full py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-medium mt-4"
                    data-testid="button-save"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Save Inquiry
                  </button>
                )}
              </div>
            )}

            {currentSession && currentSession.insights.length > 0 && (
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-cyan-400" />
                  Emerging Insights
                </h3>
                <ul className="space-y-2">
                  {currentSession.insights.map((ins, i) => (
                    <li key={i} className="text-sm opacity-70 flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      {ins}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-semibold mb-3">Dialectical Thinking</h3>
              <p className="text-xs opacity-60 mb-4">
                Explore how opposing ideas can lead to deeper truth through synthesis.
              </p>
              
              <div className="space-y-3">
                {DIALECTICAL_PROMPTS.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDialectic(selectedDialectic === i ? null : i)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedDialectic === i ? "bg-purple-500/10 border-purple-500/30" : "bg-black/20 border-white/5 hover:bg-white/5"}`}
                    data-testid={`button-dialectic-${i}`}
                  >
                    <div className="text-sm font-medium">{d.thesis}</div>
                    {selectedDialectic === i && (
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                          <span className="text-red-400">Antithesis:</span> {d.antithesis}
                        </div>
                        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-emerald-400">Synthesis:</span> {d.synthesis}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-semibold mb-3">Socratic Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {SOCRATIC_TEMPLATES.map((cat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-sm font-medium text-amber-300">{cat.category}</div>
                    <div className="text-xs opacity-50 mt-1">{cat.questions.length} questions</div>
                  </div>
                ))}
              </div>
            </div>

            {profile.sessions.length > 0 && (
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold mb-3 opacity-70">Recent Inquiries</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {profile.sessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="p-2 rounded-lg bg-black/20 border border-white/5">
                      <div className="text-sm font-medium">{s.topic}</div>
                      <div className="text-xs opacity-50">{s.responses.length} exchanges</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
