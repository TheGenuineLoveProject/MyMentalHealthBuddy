import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Moon, Sun, Cloud, Leaf, Heart, Brain, Clock, Play, Pause, Volume2, Sparkles, Shield, BookOpen, Eye, Anchor } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

const meditations = [
  {
    id: "body-scan",
    name: "Progressive Body Scan",
    duration: "10-15 min",
    category: "relaxation",
    icon: Heart,
    description: "Systematically release tension from head to toe, developing interoception—your ability to sense internal body states, which is key to emotional regulation.",
    benefits: ["Releases stored physical tension", "Develops body awareness (interoception)", "Activates parasympathetic response", "Improves emotional granularity"],
    researchNote: "Body scan meditation increases activity in the insula, the brain region responsible for interoception. Better body awareness = better emotional regulation.",
    script: [
      "Find a comfortable position, lying down or seated. Close your eyes.",
      "Take three deep breaths, letting your body settle into the support beneath you.",
      "Bring your attention to the very top of your head.",
      "Notice any tension in your scalp. As you exhale, let it soften and release.",
      "Move your awareness to your forehead. Smooth out any furrows or tightness.",
      "Soften the small muscles around your eyes. Let your eyelids grow heavy.",
      "Relax your jaw, allowing your teeth to part slightly. Release your tongue from the roof of your mouth.",
      "Feel your neck and shoulders. This is where many of us carry stress. Let them drop away from your ears.",
      "Allow relaxation to flow down through your arms, into your hands, to each fingertip.",
      "Breathe into your chest and belly. With each inhale, they expand freely. With each exhale, they release.",
      "Relax your lower back—a common holding place. Let the muscles soften.",
      "Feel warmth and relaxation moving through your hips and down your legs.",
      "Release any gripping in your thighs, knees, calves.",
      "Relax your feet completely, including each toe.",
      "Rest in this state of full-body relaxation. You are safe. You are held.",
      "When ready, gently wiggle your fingers and toes. Take a deeper breath.",
      "Slowly open your eyes, carrying this relaxation with you."
    ]
  },
  {
    id: "loving-kindness",
    name: "Loving-Kindness (Metta)",
    duration: "10-20 min",
    category: "compassion",
    icon: Heart,
    description: "Cultivate unconditional love for yourself and others. Research shows this practice literally changes brain structure toward greater compassion and reduces self-criticism.",
    benefits: ["Increases self-compassion significantly", "Reduces anxiety and depression", "Improves relationship satisfaction", "Decreases self-criticism and shame"],
    researchNote: "Richard Davidson's research at the University of Wisconsin shows loving-kindness meditation increases positive emotions and activity in brain regions associated with empathy.",
    script: [
      "Sit comfortably and close your eyes. Take a few deep breaths to arrive here.",
      "Begin by directing loving-kindness toward yourself. This can feel vulnerable—that's okay.",
      "Silently repeat: 'May I be happy. May I be healthy. May I be safe. May I live with ease.'",
      "Feel the warmth of these wishes settling into your heart. You deserve this kindness.",
      "If resistance arises, simply notice it. You can say: 'May I learn to accept love.'",
      "Now think of someone you love deeply—someone whose wellbeing brings you joy.",
      "Direct loving-kindness toward them: 'May you be happy. May you be healthy. May you be safe. May you live with ease.'",
      "Feel your genuine care for this person. Let that love flow freely.",
      "Think of a neutral person—someone you neither like nor dislike, perhaps a stranger you've seen.",
      "Extend the same wishes to them. They too have hopes, fears, and struggles.",
      "Now, if you feel ready: think of someone you find difficult. Start with someone mildly challenging.",
      "With courage, offer them the same loving-kindness. This doesn't condone harm—it frees you.",
      "Finally, expand your wishes to all beings everywhere—all humans, all creatures, all life.",
      "'May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease.'",
      "Rest in this expansive feeling of universal love. You are connected to all of life.",
      "Gently return your attention to your breath. Let the love remain.",
      "Open your eyes when ready, carrying this compassion into your day."
    ]
  },
  {
    id: "breath-awareness",
    name: "Mindful Breath Awareness",
    duration: "5-10 min",
    category: "mindfulness",
    icon: Cloud,
    description: "The foundation of all meditation—simple, profound attention to the breath. This practice strengthens the prefrontal cortex and reduces amygdala reactivity.",
    benefits: ["Calms the mind quickly", "Reduces stress hormones", "Improves focus and attention", "Builds meditation foundation"],
    researchNote: "8 weeks of mindfulness practice shows measurable changes in brain structure: increased prefrontal cortex density, reduced amygdala volume.",
    script: [
      "Sit in a comfortable position with your spine gently upright.",
      "Let your hands rest naturally on your lap or knees.",
      "Close your eyes or soften your gaze downward.",
      "Simply notice your breathing without trying to change it.",
      "Feel the cool air entering through your nostrils.",
      "Notice your chest and belly gently expanding with each inhale.",
      "Feel the warm air leaving with each exhale.",
      "When thoughts arise—and they will—simply notice them without judgment.",
      "Say 'thinking' gently to yourself, then return to the breath.",
      "No need to judge yourself for wandering. This IS the practice—noticing and returning.",
      "Each time you return to the breath, you strengthen your attention muscle.",
      "Notice the natural pause at the top of the inhale... and the bottom of the exhale.",
      "Feel the natural rhythm of your breathing—effortless, alive.",
      "Rest in this simple awareness for as long as you like.",
      "When ready, take a slightly deeper breath to transition.",
      "Slowly open your eyes, maintaining this quality of presence."
    ]
  },
  {
    id: "morning",
    name: "Morning Intention Setting",
    duration: "5-7 min",
    category: "intention",
    icon: Sun,
    description: "Start your day with clarity and positive intention. Morning practices are powerful because the brain is particularly receptive in the transition from sleep.",
    benefits: ["Sets positive tone for the day", "Increases sense of purpose", "Improves focus and motivation", "Creates coherence between values and action"],
    researchNote: "Setting intentions activates the prefrontal cortex and creates a cognitive framework that influences perception and behavior throughout the day.",
    script: [
      "Sit comfortably in bed or in a quiet space as you begin your day.",
      "Take three deep breaths to transition from sleep to wakefulness.",
      "Feel gratitude for this new day—a fresh start full of possibility.",
      "Ask yourself: 'How do I want to feel today?'",
      "Choose one or two words that describe this feeling—peace, presence, courage, joy.",
      "Visualize yourself moving through the day embodying this energy.",
      "See yourself handling challenges with calm and grace.",
      "What is one small thing you can do today to honor your wellbeing?",
      "Set this as your intention—not a to-do, but a way of being.",
      "Repeat silently: 'Today, I choose [your intention].'",
      "Feel this intention settling into your body like a gentle glow.",
      "Trust that you have everything you need for whatever this day brings.",
      "Take one more deep, centering breath.",
      "Carry this peaceful, intentional energy with you as you rise.",
      "Remember: you can return to this intention whenever you need it.",
      "Open your eyes, ready for your day."
    ]
  },
  {
    id: "evening",
    name: "Evening Release & Reflection",
    duration: "5-10 min",
    category: "reflection",
    icon: Moon,
    description: "Wind down and process your day with gentle awareness. Evening meditation helps the brain consolidate learning and prepares the nervous system for restorative sleep.",
    benefits: ["Promotes restful sleep", "Processes the day's experiences", "Cultivates gratitude", "Releases accumulated tension"],
    researchNote: "Evening reflection practices reduce rumination and cortisol levels, allowing for deeper sleep and better emotional processing during REM cycles.",
    script: [
      "Settle into a comfortable position as your day winds down.",
      "Close your eyes and take several slow, deep breaths.",
      "Allow your body to sink into relaxation—you've earned this rest.",
      "With each exhale, release the weight of the day.",
      "Gently review your day without judgment, as if watching a movie.",
      "What moments brought you joy, satisfaction, or connection?",
      "Acknowledge any challenges you faced. You did your best with what you had.",
      "Is there anything you need to release to sleep well? Exhale it out.",
      "Think of three things you're grateful for today, no matter how small.",
      "Feel appreciation for these blessings. Let gratitude fill your heart.",
      "Release any worries about tomorrow—they can wait until you're rested.",
      "Let your mind become quiet, like a still pond after the ripples settle.",
      "Feel yourself preparing for deep, restorative sleep.",
      "You are safe in this moment. Nothing needs to be done right now.",
      "Rest in the peace of simply being, simply breathing.",
      "Drift gently toward sleep whenever your body is ready."
    ]
  },
  {
    id: "grounding",
    name: "Earth Grounding Meditation",
    duration: "5-10 min",
    category: "grounding",
    icon: Leaf,
    description: "Connect with the stability of the earth beneath you. This practice is especially helpful when you feel untethered, anxious, or disconnected from your body.",
    benefits: ["Reduces anxiety quickly", "Creates profound sense of stability", "Anchors in present moment", "Helpful for dissociation"],
    researchNote: "Grounding practices activate proprioception and interoception, helping the brain orient to present-moment safety rather than past trauma or future worry.",
    script: [
      "Stand or sit with your feet flat on the ground, hip-width apart.",
      "Close your eyes and feel your connection to the earth beneath you.",
      "Notice the solid, unwavering support that's always there.",
      "The earth has been holding you your entire life. It will not let you fall.",
      "Imagine roots growing from the soles of your feet, deep into the earth.",
      "These roots extend down through soil, through rock, toward the center of the planet.",
      "You are anchored, stable, unmovable.",
      "With each exhale, send any tension, worry, or heaviness down through your roots.",
      "Let the earth absorb and transform this energy. It knows how.",
      "With each inhale, draw up calm, grounding energy from the earth.",
      "Feel this stability rising through your roots, through your legs, into your core.",
      "Notice the weight of your body being fully supported by the ground.",
      "You don't have to hold yourself up. You are held.",
      "Your roots go deep—you cannot be easily shaken by surface storms.",
      "You are connected to something vast, ancient, and enduring.",
      "Carry this grounded, centered feeling with you. You can return here anytime."
    ]
  },
  {
    id: "parts-work",
    name: "Parts Awareness (IFS-Informed)",
    duration: "10-15 min",
    category: "self-awareness",
    icon: Eye,
    description: "A meditation based on Internal Family Systems (IFS) to connect with different parts of yourself with curiosity and compassion, rather than judgment.",
    benefits: ["Develops self-awareness", "Reduces internal conflict", "Cultivates self-compassion", "Helps understand reactive patterns"],
    researchNote: "IFS-informed practices help people relate to their inner experience with more curiosity and less shame, leading to better emotional regulation.",
    script: [
      "Settle into a comfortable position and close your eyes.",
      "Take several deep breaths, arriving fully in this moment.",
      "Notice how you're feeling right now. What's present?",
      "If you notice a strong emotion or reaction, get curious about it.",
      "In IFS, we understand this as a 'part' of you. Say hello to this part.",
      "Notice: Where do you feel this part in your body?",
      "Ask gently: 'How old is this part?'",
      "Often, strong reactions come from younger parts trying to protect you.",
      "Ask the part: 'What are you trying to protect me from?'",
      "Listen without judgment. There's always a good intention behind every part.",
      "Thank this part for trying to help, even if its methods haven't served you.",
      "Ask: 'What does this part need from me right now?'",
      "From your centered Self—characterized by curiosity, compassion, and calm—offer what the part needs.",
      "This might be reassurance, acknowledgment, or simply your presence.",
      "Notice any shifts in how you feel toward this part of yourself.",
      "You can return to dialogue with your parts anytime. They want to be heard.",
      "Take a deep breath and gently open your eyes."
    ]
  }
];

const categories = [
  { id: "all", name: "All", icon: Brain },
  { id: "relaxation", name: "Relaxation", icon: Cloud },
  { id: "compassion", name: "Compassion", icon: Heart },
  { id: "mindfulness", name: "Mindfulness", icon: Leaf },
  { id: "intention", name: "Morning", icon: Sun },
  { id: "reflection", name: "Evening", icon: Moon },
  { id: "grounding", name: "Grounding", icon: Anchor },
  { id: "self-awareness", name: "Self-Awareness", icon: Eye }
];

function MeditationPlayer({ meditation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    if (currentStep < meditation.script.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'var(--glp-paper)' }}>
      <div className="flex items-start gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
          <meditation.icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-ink)' }}>{meditation.name}</h2>
          <div className="flex items-center gap-4 mt-2" style={{ color: 'var(--glp-sage)' }}>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {meditation.duration}
            </span>
          </div>
        </div>
      </div>

      <p className="mb-6" style={{ color: 'var(--glp-sage)' }}>{meditation.description}</p>

      <div className="rounded-xl p-8 mb-6" style={{ background: 'var(--glp-sage-10)' }}>
        <div className="text-center">
          <span className="text-sm mb-4 block" style={{ color: 'var(--glp-sage)' }}>
            Step {currentStep + 1} of {meditation.script.length}
          </span>
          <p className="text-xl leading-relaxed min-h-24" style={{ color: 'var(--glp-ink)' }}>
            {meditation.script[currentStep]}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-full transition-colors disabled:opacity-50"
          style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage)' }}
          data-testid="button-prev-step"
        >
          Previous
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
          style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}
          data-testid="button-toggle-meditation"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isPlaying ? "Pause" : "Begin"}
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === meditation.script.length - 1}
          className="px-6 py-3 rounded-full transition-colors disabled:opacity-50"
          style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage)' }}
          data-testid="button-next-step"
        >
          Next
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex gap-1">
          {meditation.script.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className="rounded-full transition-all"
              style={idx === currentStep 
                ? { width: '1rem', height: '0.5rem', background: 'var(--glp-sage)' } 
                : { width: '0.5rem', height: '0.5rem', background: 'var(--glp-sage-20)' }}
              data-testid={`button-step-dot-${idx}`}
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
            <Sparkles className="h-5 w-5" style={{ color: 'var(--glp-sage)' }} />
            Benefits
          </h3>
          <ul className="space-y-2">
            {meditation.benefits.map((benefit, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2" style={{ color: 'var(--glp-sage)' }}>
                <span className="mt-0.5" style={{ color: 'var(--glp-sage)' }}>•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
            <BookOpen className="h-5 w-5" style={{ color: 'var(--glp-sage-deep)' }} />
            Research Note
          </h3>
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{meditation.researchNote}</p>
        </div>
      </div>
    </div>
  );
}

export default function MeditationGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMeditation, setSelectedMeditation] = useState(meditations[0]);

  useSEO({
    title: "Guided Meditations | Evidence-Based Mindfulness | The Genuine Love Project",
    description: "Research-backed guided meditations for calm, clarity, and self-compassion. Body scans, loving-kindness, mindfulness, and IFS-informed practices.",
  });

  const filteredMeditations = selectedCategory === "all" 
    ? meditations 
    : meditations.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--glp-paper), var(--glp-sage-10))' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 transition-colors mb-8" style={{ color: 'var(--glp-sage)' }} data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
            <Brain className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Meditation Guide</h1>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
            Evidence-based guided meditations that literally change your brain. Research shows just 8 weeks of regular practice 
            increases prefrontal cortex density (self-regulation) while reducing amygdala volume (fear response). 
            Each practice includes step-by-step guidance to support your inner journey.
          </p>
        </div>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
          <div className="flex items-start gap-4">
            <Brain className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: 'var(--glp-sage-deep)' }} />
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>How Meditation Changes the Brain</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                Neuroimaging studies show meditation increases gray matter in areas responsible for learning, memory, emotional regulation, 
                and perspective-taking. It also reduces the size of the amygdala, your brain's fear center. 
                These aren't temporary states—they're lasting structural changes that accumulate with practice.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
              style={selectedCategory === cat.id
                ? { background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)', boxShadow: 'var(--glp-shadow-lg)' }
                : { background: 'var(--glp-paper)', color: 'var(--glp-sage)', border: '1px solid var(--glp-sage-15)' }}
              data-testid={`button-filter-${cat.id}`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {filteredMeditations.map((med) => (
              <button
                key={med.id}
                onClick={() => setSelectedMeditation(med)}
                className="w-full text-left p-4 rounded-xl transition-all"
                style={selectedMeditation.id === med.id
                  ? { background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)', boxShadow: '0 10px 25px -3px rgba(0,0,0,0.15)' }
                  : { background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
                data-testid={`button-meditation-${med.id}`}
              >
                <div className="flex items-center gap-3">
                  <med.icon className="h-5 w-5" style={{ color: selectedMeditation.id === med.id ? 'var(--glp-paper)' : 'var(--glp-sage)' }} />
                  <div>
                    <h3 className="font-medium" style={{ color: selectedMeditation.id === med.id ? 'var(--glp-paper)' : 'var(--glp-ink)' }}>
                      {med.name}
                    </h3>
                    <p className="text-sm" style={{ color: selectedMeditation.id === med.id ? 'rgba(255,255,255,0.8)' : 'var(--glp-sage)' }}>
                      {med.duration}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <MeditationPlayer meditation={selectedMeditation} />
          </div>
        </div>

        <div className="mt-12 rounded-2xl p-6" style={{ background: 'var(--glp-gold-30)', border: '1px solid var(--glp-gold)' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
            <Sparkles className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
            Tips for Your Practice
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm" style={{ color: 'var(--glp-sage)' }}>
            <div>
              <strong style={{ color: 'var(--glp-ink)' }}>Consistency over duration:</strong> 5 minutes daily beats 30 minutes occasionally. The brain changes through repetition.
            </div>
            <div>
              <strong style={{ color: 'var(--glp-ink)' }}>Mind-wandering is normal:</strong> Noticing you've wandered and returning IS the practice. Each return strengthens attention.
            </div>
            <div>
              <strong style={{ color: 'var(--glp-ink)' }}>No wrong way:</strong> If you're paying attention to your experience, you're meditating. Drop perfectionism.
            </div>
          </div>
        </div>

        <RelatedNextSteps 
          steps={[
            { title: "Breathing Exercises", description: "Foundation for deeper meditation", path: "/breathing-exercises" },
            { title: "Grounding Techniques", description: "Prepare your nervous system", path: "/grounding" },
            { title: "Inner Child Work", description: "Deepen self-compassion", path: "/inner-child" },
          ]}
          title="Continue Your Mindfulness Journey"
        />

        <div className="mt-12 rounded-2xl p-6" style={{ background: 'var(--glp-gold-30)', border: '1px solid var(--glp-gold)' }}>
          <h4 className="font-semibold mb-2 text-center" style={{ color: 'var(--glp-gold-dark)' }}>How to Practice Safely</h4>
          <ul className="text-sm space-y-2 max-w-2xl mx-auto" style={{ color: 'var(--glp-sage-deep)' }}>
            <li>• Meditation is a practice, not a perfection. Be patient and compassionate with yourself.</li>
            <li>• If you experience significant distress, <strong>pause immediately</strong> and ground yourself (feet on floor, slow breaths).</li>
            <li>• For trauma survivors: parts work and body scans can sometimes bring up difficult material. Go slowly and stay within your window of tolerance.</li>
            <li>• If meditation consistently increases anxiety or distress, this is important information—consider working with a therapist who specializes in trauma.</li>
            <li>• These guided practices are educational tools, not therapy or medical treatment.</li>
          </ul>
        </div>
        <div className="text-center py-8 mt-8" style={{ borderTop: '1px solid var(--glp-sage-15)' }}>
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
            This content is for educational and wellness purposes and is not a substitute for professional mental health care.
          </p>
        </div>
      </div>
    </div>
  );
}
