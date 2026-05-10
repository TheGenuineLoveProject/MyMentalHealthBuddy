import { useState, useEffect } from "react";
import { Users, Heart, MessageCircle, Send, Sparkles, Star, ChevronRight } from 'lucide-react';

const CONNECTION_PROMPTS = [
  { id: 1, text: "Text someone you haven't talked to in a while", emoji: "💬", category: "reach-out" },
  { id: 2, text: "Send a gratitude message to someone who helped you", emoji: "🙏", category: "gratitude" },
  { id: 3, text: "Ask a friend how they're really doing", emoji: "💭", category: "deepen" },
  { id: 4, text: "Share something positive that happened today", emoji: "✨", category: "share" },
  { id: 5, text: "Plan a coffee/call date with a friend", emoji: "☕", category: "plan" },
  { id: 6, text: "Tell someone why they matter to you", emoji: "❤️", category: "appreciation" },
  { id: 7, text: "Join an online community about something you love", emoji: "🌐", category: "expand" },
  { id: 8, text: "Write a thoughtful comment on a friend's post", emoji: "💌", category: "engage" },
  { id: 9, text: "Offer to help someone with something", emoji: "🤝", category: "give" },
  { id: 10, text: "Share a funny meme or video with someone", emoji: "😂", category: "lighten" },
];

const SUPPORT_MESSAGES = [
  "You deserve meaningful connections in your life.",
  "Reaching out takes courage. You've got this.",
  "Small gestures can make a big difference.",
  "Quality over quantity - one good friend is enough.",
  "It's okay to take small steps toward connection.",
  "Being vulnerable builds deeper bonds.",
  "Your presence matters to others more than you know.",
];

const LONELINESS_TIPS = [
  { title: "Acknowledge It", text: "It's okay to feel lonely. Don't judge yourself for it." },
  { title: "Start Small", text: "A simple 'hi' message is a valid connection." },
  { title: "Be Present", text: "Focus on quality over quantity of interactions." },
  { title: "Join Groups", text: "Find communities around your interests." },
  { title: "Self-Compassion", text: "Treat yourself like a good friend would." },
];

export default function SocialConnection() {
  const [todayPrompt, setTodayPrompt] = useState(null);
  const [completedPrompts, setCompletedPrompts] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [connectionStreak, setConnectionStreak] = useState(0);
  const [reflectionNote, setReflectionNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem("social_connection_data");
    
    if (savedData) {
      const data = JSON.parse(savedData);
      setCompletedPrompts(data.completed || []);
      setConnectionStreak(data.streak || 0);
      
      const todayIndex = Math.floor(Date.now() / 86400000) % CONNECTION_PROMPTS.length;
      setTodayPrompt(CONNECTION_PROMPTS[todayIndex]);
      
      if (data.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (data.lastDate !== yesterday) {
          setConnectionStreak(0);
        }
      }
    } else {
      const todayIndex = Math.floor(Date.now() / 86400000) % CONNECTION_PROMPTS.length;
      setTodayPrompt(CONNECTION_PROMPTS[todayIndex]);
    }
    
    setSupportMessage(SUPPORT_MESSAGES[Math.floor(Math.random() * SUPPORT_MESSAGES.length)]);
  }, []);

  const completePrompt = () => {
    const today = new Date().toDateString();
    const newCompleted = [...completedPrompts, { id: todayPrompt.id, date: today, note: reflectionNote }];
    const newStreak = connectionStreak + 1;
    
    setCompletedPrompts(newCompleted);
    setConnectionStreak(newStreak);
    setSaved(true);
    
    localStorage.setItem("social_connection_data", JSON.stringify({
      completed: newCompleted,
      streak: newStreak,
      lastDate: today,
    }));
    
    setTimeout(() => setSaved(false), 2000);
  };

  const getNewPrompt = () => {
    const availablePrompts = CONNECTION_PROMPTS.filter(p => 
      !completedPrompts.some(c => c.id === p.id && c.date === new Date().toDateString())
    );
    if (availablePrompts.length > 0) {
      setTodayPrompt(availablePrompts[Math.floor(Math.random() * availablePrompts.length)]);
    }
  };

  const isCompletedToday = completedPrompts.some(
    c => c.id === todayPrompt?.id && c.date === new Date().toDateString()
  );

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="social-connection">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-social-title">
                Social Connection
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Nurture your relationships</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)]">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-[var(--text)]" data-testid="text-streak">
              {connectionStreak} day streak
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 mb-6">
          <p className="text-[var(--text)] text-center italic">"{supportMessage}"</p>
        </div>

        {todayPrompt && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
              Today's Connection Challenge
            </h4>
            <div className={`p-6 rounded-2xl ${
              isCompletedToday 
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                : "bg-gradient-to-br from-cyan-400 to-blue-500 text-white"
            } shadow-lg`}>
              <div className="text-4xl mb-3 text-center" data-testid="text-prompt-emoji">
                {isCompletedToday ? "✅" : todayPrompt.emoji}
              </div>
              <p className="text-lg font-medium text-center mb-4" data-testid="text-prompt">
                {isCompletedToday ? "Great job connecting today!" : todayPrompt.text}
              </p>
              
              {!isCompletedToday && (
                <>
                  <div className="mb-4">
                    <textarea
                      value={reflectionNote}
                      onChange={(e) => setReflectionNote(e.target.value)}
                      placeholder="Optional: How did it go? How did it make you feel?"
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                      rows={2}
                      data-testid="textarea-reflection"
                      aria-label="Reflection note"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={completePrompt}
                      className="flex-1 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                      data-testid="button-complete"
                    >
                      <Heart className="w-5 h-5" />
                      I Did It!
                    </button>
                    <button
                      onClick={getNewPrompt}
                      className="py-3 px-4 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
                      data-testid="button-new-prompt"
                      aria-label="Get new prompt"
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
              
              {isCompletedToday && (
                <button
                  onClick={getNewPrompt}
                  className="w-full py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  data-testid="button-bonus"
                >
                  <Star className="w-5 h-5" />
                  Bonus Challenge
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors mb-4"
          data-testid="button-toggle-tips"
          aria-expanded={showTips}
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-[var(--primary)]" />
            <span className="font-medium text-[var(--text)]">Feeling Lonely?</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${showTips ? "rotate-90" : ""}`} />
        </button>

        {showTips && (
          <div className="space-y-3 mb-4 animate-fade-in-up">
            {LONELINESS_TIPS.map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--surface)]" data-testid={`tip-${i}`}>
                <h5 className="font-semibold text-[var(--text)] mb-1">{tip.title}</h5>
                <p className="text-sm text-[var(--text-secondary)]">{tip.text}</p>
              </div>
            ))}
          </div>
        )}

        {completedPrompts.length > 0 && (
          <div className="pt-4 border-t border-[var(--border)]">
            <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
              Recent Connections
            </h4>
            <div className="space-y-2">
              {completedPrompts.slice(-3).reverse().map((c, i) => {
                const prompt = CONNECTION_PROMPTS.find(p => p.id === c.id);
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)]">
                    <span className="text-xl">{prompt?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text)] truncate">{prompt?.text}</p>
                      <p className="text-xs text-[var(--text-muted)]">{c.date}</p>
                    </div>
                    <Heart className="w-4 h-4 text-pink-500 fill-current" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
