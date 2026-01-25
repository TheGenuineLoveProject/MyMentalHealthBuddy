import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Moon, Sun, Clock, Coffee, Smartphone, Wind, ThermometerSun, Bed, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import SafetyFooter from "../components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const SLEEP_CLARITY = {
  what: "Evidence-based sleep hygiene practices and relaxation techniques for better rest and recovery.",
  who: "Anyone struggling with sleep, wanting to improve sleep quality, or experiencing stress-related insomnia.",
  when: "Use the hygiene tips daily, wind-down activities 30-60 minutes before bed, and visualization at bedtime.",
  why: "Sleep is when your brain heals, consolidates memories, and regulates emotions. Better sleep transforms every aspect of wellbeing.",
  howSteps: [
    "Review sleep hygiene tips by category",
    "Identify 2-3 changes to implement first",
    "Create a wind-down routine using the suggested activities",
    "Try the sleep journey visualization at bedtime"
  ],
  whereLinkText: "Explore daily routines",
  whereHref: "/daily-routines"
};

const SLEEP_EXAMPLES = [
  {
    level: "beginner",
    title: "Starting with one change",
    situation: "You scroll on your phone until you fall asleep and wake up tired.",
    action: "Choose one technology tip: put your phone in another room and read a physical book for 15 minutes before bed.",
    result: "Your brain starts associating the bedroom with rest, and you fall asleep more easily."
  },
  {
    level: "intermediate",
    title: "Building a wind-down routine",
    situation: "You have trouble transitioning from busy day to restful sleep.",
    action: "Create a 30-minute routine: dim lights, take a warm shower, do 4-7-8 breathing, then read until sleepy.",
    result: "The consistent routine signals your nervous system that it's time to rest."
  },
  {
    level: "advanced",
    title: "Addressing chronic sleep issues",
    situation: "Racing thoughts keep you awake despite good sleep hygiene.",
    action: "Add a 'worry dump' journaling session 2 hours before bed, plus the progressive muscle relaxation wind-down activity.",
    result: "Externalizing worries and releasing physical tension helps quiet the mind for sleep."
  }
];

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
  <WellnessPageShell
    title="SleepGuidePage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
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

    <div className="rounded-xl p-6 shadow-sm" style={{ background: 'var(--glp-paper)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg" style={{ background: 'var(--glp-sage-10)' }}>
          <category.icon className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{category.category}</h3>
      </div>
      <ul className="space-y-3">
        {category.tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm">
            {tip.do ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--glp-sage)' }} />
            ) : (
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--glp-rose)' }} />
            )}
            <span style={{ color: 'var(--glp-ink)', opacity: tip.do ? 0.8 : 0.6 }}>
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--glp-sage-deep), var(--glp-ink))' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 transition-colors mb-8" style={{ color: 'var(--glp-paper)', opacity: 0.7 }} data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
            <Moon className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--glp-paper)' }}>Sleep & Rest Guide</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-paper)', opacity: 0.7 }}>
            Quality sleep is the foundation of mental and physical health.
            Learn evidence-based strategies to transform your rest.
          </p>
        </div>

        <BenefitsBlock
          benefits={[
            "Science-backed sleep hygiene tips",
            "Wind-down activities and relaxation techniques",
            "Sleep stage education and myth-busting"
          ]}
          duration="Read in 5–10 min; apply nightly"
          control="Pause or stop anytime—start with what feels manageable"
          disclaimer="Educational sleep wellness—not medical advice. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-8"
        />

        <ClarityCard {...SLEEP_CLARITY} variant="compact" className="mb-6" />

        <ExamplesAccordion 
          examples={SLEEP_EXAMPLES} 
          title="See how others improve their sleep"
          className="mb-8"
        />

        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "hygiene", label: "Sleep Hygiene", icon: Bed },
            { id: "wind-down", label: "Wind Down", icon: Wind },
            { id: "science", label: "Sleep Science", icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-full transition-colors"
              style={activeTab === tab.id
                ? { background: 'var(--glp-sage)', color: 'var(--glp-paper)' }
                : { background: 'rgba(255,255,255,0.1)', color: 'var(--glp-paper)', opacity: 0.7 }}
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
            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--glp-paper)' }}>Wind-Down Activities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {windDownActivities.map((activity, idx) => (
                  <div key={idx} className="rounded-xl p-4 flex items-start gap-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="p-2 rounded-lg" style={{ background: 'var(--glp-sage-10)' }}>
                      <Moon className="h-5 w-5" style={{ color: 'var(--glp-sage)' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium" style={{ color: 'var(--glp-paper)' }}>{activity.name}</h3>
                      <p className="text-sm" style={{ color: 'var(--glp-paper)', opacity: 0.7 }}>{activity.description}</p>
                      <span className="inline-block mt-2 text-xs" style={{ color: 'var(--glp-sage)' }}>{activity.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, rgba(143,191,159,0.2), rgba(47,93,93,0.3))' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--glp-paper)' }}>Sample Evening Routine</h2>
              <div className="space-y-4">
                {[
                  { time: "2 hours before bed", action: "Dim lights, stop caffeine, finish eating" },
                  { time: "1 hour before bed", action: "Put away screens, take a warm shower/bath" },
                  { time: "30 mins before bed", action: "Gentle stretching or reading" },
                  { time: "15 mins before bed", action: "Journal or gratitude practice" },
                  { time: "In bed", action: "Deep breathing or body scan meditation" }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-32 text-right text-sm font-medium" style={{ color: 'var(--glp-sage)' }}>{step.time}</div>
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--glp-sage)' }} />
                    <div className="flex-1" style={{ color: 'var(--glp-paper)', opacity: 0.85 }}>{step.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "science" && (
          <div className="space-y-8 mb-12">
            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--glp-paper)' }}>Sleep Cycle Stages</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {sleepStages.map((stage, idx) => (
                  <div key={idx} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium" style={{ color: 'var(--glp-paper)' }}>{stage.stage}</h3>
                      <span className="text-sm" style={{ color: 'var(--glp-sage)' }}>{stage.duration}</span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--glp-paper)', opacity: 0.7 }}>{stage.description}</p>
                    <p className="text-xs" style={{ color: 'var(--glp-paper)', opacity: 0.5 }}>Purpose: {stage.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--glp-paper)' }}>Sleep Myths Busted</h2>
              <div className="space-y-4">
                {sleepMyths.map((item, idx) => (
                  <div key={idx} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start gap-3 mb-2">
                      <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--glp-rose)' }} />
                      <p className="font-medium" style={{ color: 'var(--glp-rose)' }}>Myth: {item.myth}</p>
                    </div>
                    <div className="flex items-start gap-3 ml-8">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--glp-sage)' }} />
                      <p style={{ color: 'var(--glp-paper)', opacity: 0.85 }}>Truth: {item.truth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <SafetyFooter variant="default" />
      </div>
    </div>
  </WellnessPageShell>
  );
}
