import { useState, useEffect } from "react";
import { Flame, Target, X } from 'lucide-react';
import {
  SkillDomain, MasteryProfile, DeliberatePractice,
  SKILL_LEVELS, PRACTICE_METHODS,
  loadMasteryProfile, saveMasteryProfile
} from "@/lib/mastery/deepWork";

export default function SkillForge() {
  const [profile, setProfile] = useState<MasteryProfile>(() => loadMasteryProfile());
  const [activeTab, setActiveTab] = useState<"skills" | "practice" | "add">("skills");
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "cognitive" as SkillDomain["category"],
    currentLevel: 2 as 1|2|3|4|5,
    targetLevel: 4 as 1|2|3|4|5
  });
  const [selectedSkill, setSelectedSkill] = useState<SkillDomain | null>(null);
  const [practice, setPractice] = useState({
    focus: "",
    method: "challenge" as DeliberatePractice["method"],
    duration: 30,
    difficulty: 3 as 1|2|3|4|5,
    effectiveness: 3 as 1|2|3|4|5,
    notes: ""
  });

  useEffect(() => {
    saveMasteryProfile(profile);
  }, [profile]);

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    
    const skill: SkillDomain = {
      id: crypto.randomUUID(),
      name: newSkill.name,
      category: newSkill.category,
      currentLevel: newSkill.currentLevel,
      targetLevel: newSkill.targetLevel,
      practiceHours: 0,
      resources: [],
      milestones: [],
      lastPracticed: ""
    };
    
    setProfile(p => ({ ...p, skills: [...p.skills, skill] }));
    setNewSkill({ name: "", category: "cognitive", currentLevel: 2, targetLevel: 4 });
    setActiveTab("skills");
  };

  const logPractice = () => {
    if (!selectedSkill || !practice.focus.trim()) return;
    
    const newPractice: DeliberatePractice = {
      id: crypto.randomUUID(),
      skillId: selectedSkill.id,
      date: new Date().toISOString(),
      duration: practice.duration,
      focus: practice.focus,
      method: practice.method,
      difficulty: practice.difficulty,
      effectiveness: practice.effectiveness,
      notes: practice.notes
    };
    
    setProfile(p => ({
      ...p,
      practices: [...p.practices, newPractice],
      skills: p.skills.map(s => 
        s.id === selectedSkill.id 
          ? { ...s, practiceHours: s.practiceHours + practice.duration / 60, lastPracticed: new Date().toISOString() }
          : s
      )
    }));
    
    setPractice({ focus: "", method: "challenge", duration: 30, difficulty: 3, effectiveness: 3, notes: "" });
    setSelectedSkill(null);
  };

  const removeSkill = (id: string) => {
    setProfile(p => ({ ...p, skills: p.skills.filter(s => s.id !== id) }));
  };

  const categories: SkillDomain["category"][] = ["cognitive", "physical", "creative", "interpersonal", "technical"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Flame className="h-5 w-5 text-orange-400" />
        <h2 className="text-xl font-semibold">Skill Forge</h2>
      </div>

      <p className="text-sm opacity-70">
        Deliberate practice is the path to expertise. Track your skills and structure your practice for growth.
      </p>

      <div className="flex gap-2">
        {(["skills", "practice", "add"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "skills" && `Skills (${profile.skills.length})`}
            {tab === "practice" && "Log Practice"}
            {tab === "add" && "Add Skill"}
          </button>
        ))}
      </div>

      {activeTab === "skills" && (
        <div className="space-y-3">
          {profile.skills.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              No skills tracked yet. Add a skill to start your mastery journey.
            </p>
          ) : (
            profile.skills.map(skill => (
              <div key={skill.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{skill.name}</h4>
                    <span className="text-xs opacity-50 capitalize">{skill.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedSkill(skill); setActiveTab("practice"); }}
                      className="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-xs hover:bg-orange-500/30"
                      data-testid={`button-practice-${skill.id}`}
                    >
                      Practice
                    </button>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="p-1 rounded hover:bg-white/10"
                      data-testid={`button-remove-skill-${skill.id}`}
                    >
                      <X className="h-4 w-4 opacity-50" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs opacity-60 mb-1">
                      <span>Level {skill.currentLevel}: {SKILL_LEVELS[skill.currentLevel].name}</span>
                      <span>Target: {skill.targetLevel}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div 
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${(skill.currentLevel / skill.targetLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{Math.round(skill.practiceHours)}h</p>
                    <p className="text-xs opacity-50">practiced</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "practice" && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
          <div>
            <label className="text-xs opacity-60 block mb-1">Skill</label>
            <select
              value={selectedSkill?.id || ""}
              onChange={e => setSelectedSkill(profile.skills.find(s => s.id === e.target.value) || null)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
              data-testid="select-skill"
            >
              <option value="">Select a skill...</option>
              {profile.skills.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs opacity-60 block mb-1">Focus of this session</label>
            <input
              type="text"
              value={practice.focus}
              onChange={e => setPractice(p => ({ ...p, focus: e.target.value }))}
              placeholder="What specific aspect are you working on?"
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
              data-testid="input-focus"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs opacity-60 block mb-1">Practice Method</label>
              <select
                value={practice.method}
                onChange={e => setPractice(p => ({ ...p, method: e.target.value as DeliberatePractice["method"] }))}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                data-testid="select-method"
              >
                {(Object.entries(PRACTICE_METHODS) as [DeliberatePractice["method"], typeof PRACTICE_METHODS[keyof typeof PRACTICE_METHODS]][]).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-60 block mb-1">Duration (minutes)</label>
              <input
                type="number"
                min="5"
                max="180"
                step="5"
                value={practice.duration}
                onChange={e => setPractice(p => ({ ...p, duration: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                data-testid="input-practice-duration"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs opacity-60 block mb-1">Difficulty (1-5)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(d => (
                  <button
                    key={d}
                    onClick={() => setPractice(p => ({ ...p, difficulty: d as 1|2|3|4|5 }))}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                      practice.difficulty === d ? "bg-orange-500/30" : "bg-white/5 hover:bg-white/10"
                    }`}
                    data-testid={`button-difficulty-${d}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs opacity-60 block mb-1">Effectiveness (1-5)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(e => (
                  <button
                    key={e}
                    onClick={() => setPractice(p => ({ ...p, effectiveness: e as 1|2|3|4|5 }))}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                      practice.effectiveness === e ? "bg-green-500/30" : "bg-white/5 hover:bg-white/10"
                    }`}
                    data-testid={`button-effectiveness-${e}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={logPractice}
            disabled={!selectedSkill || !practice.focus.trim()}
            className="w-full px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm disabled:opacity-50"
            data-testid="button-log-practice"
          >
            Log Practice Session
          </button>
        </div>
      )}

      {activeTab === "add" && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
          <div>
            <label className="text-xs opacity-60 block mb-1">Skill Name</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))}
              placeholder="e.g., Public Speaking, Piano, Programming"
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
              data-testid="input-skill-name"
            />
          </div>

          <div>
            <label className="text-xs opacity-60 block mb-1">Category</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setNewSkill(s => ({ ...s, category: cat }))}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                    newSkill.category === cat ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
                  }`}
                  data-testid={`button-category-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs opacity-60 block mb-1">Current Level</label>
              <select
                value={newSkill.currentLevel}
                onChange={e => setNewSkill(s => ({ ...s, currentLevel: Number(e.target.value) as 1|2|3|4|5 }))}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                data-testid="select-current-level"
              >
                {([1, 2, 3, 4, 5] as const).map(level => (
                  <option key={level} value={level}>{level}: {SKILL_LEVELS[level].name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-60 block mb-1">Target Level</label>
              <select
                value={newSkill.targetLevel}
                onChange={e => setNewSkill(s => ({ ...s, targetLevel: Number(e.target.value) as 1|2|3|4|5 }))}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                data-testid="select-target-level"
              >
                {([1, 2, 3, 4, 5] as const).map(level => (
                  <option key={level} value={level}>{level}: {SKILL_LEVELS[level].name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={addSkill}
            disabled={!newSkill.name.trim()}
            className="w-full px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm disabled:opacity-50"
            data-testid="button-add-skill"
          >
            Add Skill
          </button>
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          Mastery is a marathon, not a sprint. Track your deliberate practice.
        </p>
      </footer>
    </div>
  );
}
