import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Moon, Sun, Clock, Coffee, Smartphone, Wind, ThermometerSun, Bed, CheckCircle2, XCircle, Sparkles } from "lucide-react";

const sleepHygieneTips = [
  {
    category: "Environment",
    icon: ThermometerSun,
    tips: [
      { do: true, text: "Keep your bedroom cool (65-68°F / 18-20°C)" },
      { do: true, text: "Make your room as dark as possible" },
      { do: true, text: "Use white noise or earplugs if needed" },
      { do: true, text: "Reserve your bed for sleep and intimacy only" },
      { do: false, text: "Work, eat, or watch TV in bed" },
      { do: false, text: "Keep your phone charging next to your pillow" }
    ]
  },
  {
    category: "Routine",
    icon: Clock,
    tips: [
      { do: true, text: "Go to bed and wake up at consistent times" },
      { do: true, text: "Create a relaxing 30-60 minute wind-down routine" },
      { do: true, text: "Dim lights 1-2 hours before bed" },
      { do: true, text: "Take a warm bath or shower before bed" },
      { do: false, text: "Hit snooze repeatedly in the morning" },
      { do: false, text: "Sleep in more than 1 hour on weekends" }
    ]
  },
  {
    category: "Substances",
    icon: Coffee,
    tips: [
      { do: true, text: "Stop caffeine at least 6 hours before bed" },
      { do: true, text: "Limit alcohol—it fragments sleep quality" },
      { do: true, text: "Stay hydrated but taper fluids before bed" },
      { do: true, text: "Eat dinner 2-3 hours before sleep" },
      { do: false, text: "Rely on sleep medications long-term" },
      { do: false, text: "Have that 'nightcap' thinking it helps sleep" }
    ]
  },
  {
    category: "Daytime Habits",
    icon: Sun,
    tips: [
      { do: true, text: "Get natural sunlight within 30 mins of waking" },
      { do: true, text: "Exercise regularly (but not too close to bed)" },
      { do: true, text: "Limit naps to 20-30 minutes before 3pm" },
      { do: true, text: "Manage stress with relaxation techniques" },
      { do: false, text: "Stay sedentary all day" },
      { do: false, text: "Take long naps late in the afternoon" }
    ]
  },
  {
    category: "Technology",
    icon: Smartphone,
    tips: [
      { do: true, text: "Use blue light filters after sunset" },
      { do: true, text: "Put devices in 'Do Not Disturb' mode" },
      { do: true, text: "Keep devices out of the bedroom" },
      { do: true, text: "Read a physical book instead of scrolling" },
      { do: false, text: "Check emails or social media in bed" },
      { do: false, text: "Fall asleep with the TV on" }
    ]
  }
];

const windDownActivities = [
  { name: "Progressive Muscle Relaxation", description: "Tense and release each muscle group", duration: "10-15 min" },
  { name: "4-7-8 Breathing", description: "Inhale 4, hold 7, exhale 8", duration: "5 min" },
  { name: "Body Scan Meditation", description: "Bring awareness to each body part", duration: "10-20 min" },
  { name: "Gentle Stretching", description: "Slow, relaxing movements", duration: "10 min" },
  { name: "Journaling", description: "Write out thoughts and worries", duration: "10 min" },
  { name: "Reading Fiction", description: "Escape into a calming story", duration: "15-30 min" },
  { name: "Warm Bath or Shower", description: "Lower core temp after to induce sleepiness", duration: "15-20 min" },
  { name: "Calming Music or Sounds", description: "Nature sounds, ambient music", duration: "While falling asleep" }
];

const sleepMyths = [
  { myth: "You can catch up on sleep on weekends", truth: "Sleep debt can't be fully repaid. Consistency is key for quality sleep." },
  { myth: "Alcohol helps you sleep better", truth: "Alcohol may help you fall asleep but fragments sleep cycles and reduces REM sleep." },
  { myth: "Watching TV helps you relax before bed", truth: "Blue light and stimulating content can interfere with melatonin production." },
  { myth: "Older adults need less sleep", truth: "Sleep needs don't decrease with age, though sleep patterns may change." },
  { myth: "If you can't sleep, stay in bed", truth: "If awake more than 20 minutes, get up and do something calm until sleepy." }
];

const sleepStages = [
  { stage: "Stage 1 (N1)", description: "Light sleep, easily awakened", duration: "5%", purpose: "Transition between wake and sleep" },
  { stage: "Stage 2 (N2)", description: "Heart rate slows, temp drops", duration: "45-50%", purpose: "Memory consolidation begins" },
  { stage: "Stage 3 (N3)", description: "Deep sleep, hard to wake", duration: "20-25%", purpose: "Physical restoration, immune function" },
  { stage: "REM Sleep", description: "Vivid dreams, paralyzed muscles", duration: "20-25%", purpose: "Emotional processing, learning" }
];

function TipCard({ category }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
          <category.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{category.category}</h3>
      </div>
      <ul className="space-y-3">
        {category.tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm">
            {tip.do ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
            )}
            <span className={tip.do ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-500"}>
              {tip.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SleepGuidePage() {
  const [activeTab, setActiveTab] = useState("hygiene");

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white mb-6">
            <Moon className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Sleep & Rest Guide</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Quality sleep is the foundation of mental and physical health.
            Learn evidence-based strategies to transform your rest.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "hygiene", label: "Sleep Hygiene", icon: Bed },
            { id: "wind-down", label: "Wind Down", icon: Wind },
            { id: "science", label: "Sleep Science", icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-colors ${activeTab === tab.id
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
              data-testid={`button-tab-${tab.id}`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "hygiene" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sleepHygieneTips.map((category, idx) => (
              <TipCard key={idx} category={category} />
            ))}
          </div>
        )}

        {activeTab === "wind-down" && (
          <div className="space-y-8 mb-12">
            <div className="bg-slate-800 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Wind-Down Activities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {windDownActivities.map((activity, idx) => (
                  <div key={idx} className="bg-slate-900 rounded-xl p-4 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-indigo-900/50">
                      <Moon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{activity.name}</h3>
                      <p className="text-sm text-slate-400">{activity.description}</p>
                      <span className="inline-block mt-2 text-xs text-indigo-400">{activity.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Sample Evening Routine</h2>
              <div className="space-y-4">
                {[
                  { time: "2 hours before bed", action: "Dim lights, stop caffeine, finish eating" },
                  { time: "1 hour before bed", action: "Put away screens, take a warm shower/bath" },
                  { time: "30 mins before bed", action: "Gentle stretching or reading" },
                  { time: "15 mins before bed", action: "Journal or gratitude practice" },
                  { time: "In bed", action: "Deep breathing or body scan meditation" }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-32 text-right text-sm font-medium text-indigo-400">{step.time}</div>
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <div className="flex-1 text-slate-300">{step.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "science" && (
          <div className="space-y-8 mb-12">
            <div className="bg-slate-800 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Sleep Cycle Stages</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {sleepStages.map((stage, idx) => (
                  <div key={idx} className="bg-slate-900 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{stage.stage}</h3>
                      <span className="text-sm text-indigo-400">{stage.duration}</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{stage.description}</p>
                    <p className="text-xs text-slate-500">Purpose: {stage.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Sleep Myths Busted</h2>
              <div className="space-y-4">
                {sleepMyths.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <p className="text-rose-400 font-medium">Myth: {item.myth}</p>
                    </div>
                    <div className="flex items-start gap-3 ml-8">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">Truth: {item.truth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center py-8 border-t border-slate-700">
          <p className="text-sm text-slate-500">
            If you experience persistent sleep problems, please consult a healthcare provider.
            Sleep disorders like insomnia or sleep apnea require professional evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
