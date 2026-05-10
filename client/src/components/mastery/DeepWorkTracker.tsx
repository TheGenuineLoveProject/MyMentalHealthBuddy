import { useState, useEffect } from "react";
import { Focus, Clock, BarChart2, Target } from 'lucide-react';
import {
  DeepWorkSession, MasteryProfile,
  DEEP_WORK_PRINCIPLES,
  loadMasteryProfile, saveMasteryProfile
} from "@/lib/mastery/deepWork";

export default function DeepWorkTracker() {
  const [profile, setProfile] = useState<MasteryProfile>(() => loadMasteryProfile());
  const [activeTab, setActiveTab] = useState<"log" | "history" | "principles">("log");
  const [session, setSession] = useState({
    project: "",
    duration: 60,
    focusQuality: 3 as 1|2|3|4|5,
    accomplishments: "",
    distractions: "",
    environment: "",
    insights: ""
  });

  useEffect(() => {
    saveMasteryProfile(profile);
  }, [profile]);

  const logSession = () => {
    if (!session.project.trim()) return;
    
    const now = new Date();
    const newSession: DeepWorkSession = {
      id: crypto.randomUUID(),
      date: now.toISOString().split("T")[0],
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + session.duration * 60000).toISOString(),
      duration: session.duration,
      focusQuality: session.focusQuality,
      project: session.project,
      accomplishments: session.accomplishments.split("\n").filter(Boolean),
      distractions: session.distractions.split("\n").filter(Boolean),
      environment: session.environment,
      insights: session.insights
    };
    
    setProfile(p => ({
      ...p,
      deepWorkSessions: [...p.deepWorkSessions, newSession],
      totalDeepWorkMinutes: p.totalDeepWorkMinutes + session.duration
    }));
    
    setSession({
      project: "",
      duration: 60,
      focusQuality: 3,
      accomplishments: "",
      distractions: "",
      environment: "",
      insights: ""
    });
  };

  const totalHours = Math.round(profile.totalDeepWorkMinutes / 60);
  const thisWeekSessions = profile.deepWorkSessions.filter(s => {
    const sessionDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });
  const thisWeekHours = Math.round(thisWeekSessions.reduce((sum, s) => sum + s.duration, 0) / 60);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Focus className="h-5 w-5 text-indigo-400" />
        <h2 className="text-xl font-semibold">Deep Work Tracker</h2>
      </div>

      <p className="text-sm opacity-70">
        Deep work is the ability to focus without distraction on cognitively demanding tasks. Track your sessions to build this capability.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
          <Clock className="h-5 w-5 mx-auto opacity-50 mb-2" />
          <p className="text-2xl font-bold">{totalHours}h</p>
          <p className="text-xs opacity-50">Total Deep Work</p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
          <BarChart2 className="h-5 w-5 mx-auto opacity-50 mb-2" />
          <p className="text-2xl font-bold">{thisWeekHours}h</p>
          <p className="text-xs opacity-50">This Week</p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
          <Target className="h-5 w-5 mx-auto opacity-50 mb-2" />
          <p className="text-2xl font-bold">{profile.deepWorkSessions.length}</p>
          <p className="text-xs opacity-50">Sessions</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["log", "history", "principles"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "log" && "Log Session"}
            {tab === "history" && "History"}
            {tab === "principles" && "Principles"}
          </button>
        ))}
      </div>

      {activeTab === "log" && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs opacity-60 block mb-1">Project/Focus</label>
              <input
                type="text"
                value={session.project}
                onChange={e => setSession(s => ({ ...s, project: e.target.value }))}
                placeholder="What are you working on?"
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                data-testid="input-project"
              />
            </div>
            <div>
              <label className="text-xs opacity-60 block mb-1">Duration (minutes)</label>
              <input
                type="number"
                min="15"
                max="240"
                step="15"
                value={session.duration}
                onChange={e => setSession(s => ({ ...s, duration: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                data-testid="input-duration"
              />
            </div>
          </div>

          <div>
            <label className="text-xs opacity-60 block mb-1">Focus Quality (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(q => (
                <button
                  key={q}
                  onClick={() => setSession(s => ({ ...s, focusQuality: q as 1|2|3|4|5 }))}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                    session.focusQuality === q ? "bg-indigo-500/30" : "bg-white/5 hover:bg-white/10"
                  }`}
                  data-testid={`button-focus-quality-${q}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs opacity-60 block mb-1">What did you accomplish?</label>
            <textarea
              value={session.accomplishments}
              onChange={e => setSession(s => ({ ...s, accomplishments: e.target.value }))}
              placeholder="One item per line..."
              className="w-full h-20 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
              data-testid="textarea-accomplishments"
            />
          </div>

          <div>
            <label className="text-xs opacity-60 block mb-1">Distractions encountered</label>
            <textarea
              value={session.distractions}
              onChange={e => setSession(s => ({ ...s, distractions: e.target.value }))}
              placeholder="One item per line..."
              className="w-full h-16 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
              data-testid="textarea-distractions"
            />
          </div>

          <button
            onClick={logSession}
            disabled={!session.project.trim()}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm disabled:opacity-50"
            data-testid="button-log-session"
          >
            Log Deep Work Session
          </button>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3">
          {profile.deepWorkSessions.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              No sessions logged yet. Start tracking your deep work.
            </p>
          ) : (
            profile.deepWorkSessions.slice().reverse().slice(0, 10).map(s => (
              <div key={s.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{s.project}</span>
                  <span className="text-xs opacity-50">{s.duration} min</span>
                </div>
                <div className="flex items-center gap-4 text-xs opacity-60">
                  <span>Focus: {s.focusQuality}/5</span>
                  <span>{new Date(s.date).toLocaleDateString()}</span>
                </div>
                {s.accomplishments.length > 0 && (
                  <p className="text-xs opacity-70">{s.accomplishments.join(", ")}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "principles" && (
        <div className="space-y-3">
          {DEEP_WORK_PRINCIPLES.map((principle, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-sm">{principle}</p>
            </div>
          ))}
          <p className="text-xs opacity-50 text-center mt-4">
            Based on Cal Newport's "Deep Work"
          </p>
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          Deep work is a skill. Track it to train it.
        </p>
      </footer>
    </div>
  );
}
