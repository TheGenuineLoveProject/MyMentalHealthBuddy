import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart, Baby, Sparkles, Shield, Sun, MessageCircle, Gift, Home, Star, Brain, Eye, Feather, BookOpen, Flower2, Zap } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";

const innerChildNeeds = [
  {
    need: "Safety",
    icon: Shield,
    description: "The fundamental need to feel protected, secure, and free from threat",
    whenUnmet: "Hypervigilance, anxiety, difficulty trusting, always waiting for the other shoe to drop, people-pleasing to avoid conflict",
    woundOrigins: "Unpredictable caregivers, chaotic environments, physical or emotional abuse, neglect, witnessing violence",
    healingPractices: [
      "Create a 'safe corner' in your home with comforting objects",
      "Establish predictable routines that your nervous system can rely on",
      "Practice grounding when anxiety arises—feet on floor, name 5 things you see",
      "Speak safety affirmations: 'I am safe now. The past is over.'",
      "Set boundaries that protect your peace without apology"
    ],
    affirmation: "I am safe now. I can protect myself. The danger is in the past. I will never abandon myself again.",
    reparentingAction: "When you feel unsafe, place a hand on your heart and say: 'I'm here. I've got you. You're safe with me now.'"
  },
  {
    need: "Belonging",
    icon: Home,
    description: "The need to be accepted, included, and valued as part of a group or family",
    whenUnmet: "Chronic loneliness, feeling like an outsider, people-pleasing, fear of rejection, shape-shifting to fit in",
    woundOrigins: "Being the 'black sheep,' scapegoating, conditional acceptance, being different from family, moving frequently",
    healingPractices: [
      "Find communities aligned with your authentic values",
      "Practice showing up as yourself, not a version you think others want",
      "Affirm: 'I belong here. I don't have to earn my place.'",
      "Notice when you're shape-shifting and gently return to truth",
      "Cultivate belonging with yourself first—you are home"
    ],
    affirmation: "I belong. I am worthy of connection exactly as I am. I don't have to earn my place in this world.",
    reparentingAction: "Tell your inner child: 'You don't have to be different to be loved. You belong just as you are.'"
  },
  {
    need: "Love & Nurturing",
    icon: Heart,
    description: "The need for unconditional love, affection, tenderness, and emotional attunement",
    whenUnmet: "Low self-worth, seeking external validation, self-neglect, difficulty receiving love, inner critic dominance",
    woundOrigins: "Emotionally unavailable parents, conditional love, parentification, neglect, absence of physical affection",
    healingPractices: [
      "Practice self-compassion meditations (Kristin Neff's work)",
      "Give yourself physical comfort—warm baths, soft blankets, gentle touch",
      "Speak to yourself as you would to a child you adore",
      "Meet your basic needs without guilt—rest, food, pleasure are rights",
      "Write letters to yourself from a loving inner parent"
    ],
    affirmation: "I am lovable exactly as I am. I deserve tenderness and care. My needs matter.",
    reparentingAction: "When struggling, ask: 'What would a loving parent do right now?' Then do that for yourself."
  },
  {
    need: "Autonomy",
    icon: Star,
    description: "The need to make choices, have a sense of agency, and control over one's own life",
    whenUnmet: "Difficulty making decisions, feeling powerless, either excessive compliance or rebellion, loss of self",
    woundOrigins: "Controlling parents, enmeshment, not being allowed opinions, choices made for you, invalidation of preferences",
    healingPractices: [
      "Make small choices daily that honor your preferences",
      "Practice saying what you want without justification",
      "Notice when you defer automatically—pause and check in",
      "Trust your inner knowing—your body often knows before your mind",
      "Reclaim your right to change your mind"
    ],
    affirmation: "I have the right to my own choices. My voice matters. I trust myself to navigate my life.",
    reparentingAction: "Ask your inner child: 'What do YOU want?' and honor their answer without overriding it."
  },
  {
    need: "Play & Joy",
    icon: Sun,
    description: "The need for fun, creativity, spontaneity, and lighthearted experience",
    whenUnmet: "Chronic seriousness, workaholism, difficulty relaxing, guilt around pleasure, forgetting what brings joy",
    woundOrigins: "Having to grow up too fast, parentification, trauma during childhood, joy being punished, scarcity mentality",
    healingPractices: [
      "Schedule unstructured play time—no goals, just exploration",
      "Do activities purely for enjoyment, not productivity",
      "Reconnect with childhood hobbies or try new creative outlets",
      "Allow yourself to be silly, make mistakes, be imperfect",
      "Dance, sing, create without judging the output"
    ],
    affirmation: "I am allowed to play. Joy is my birthright. Life can include pleasure, not just survival.",
    reparentingAction: "Ask your inner child: 'What sounds fun today?' and give them that experience."
  },
  {
    need: "Validation",
    icon: Eye,
    description: "The need to be seen, understood, and have one's experience acknowledged as real",
    whenUnmet: "Doubting your own perceptions, gaslighting yourself, seeking constant reassurance, people-pleasing",
    woundOrigins: "Gaslighting, dismissal of emotions, being told you're 'too sensitive,' experiences being denied or minimized",
    healingPractices: [
      "Practice validating your own emotions: 'It makes sense I feel this way'",
      "Journal to witness and acknowledge your own experience",
      "Stop explaining or justifying your feelings to others",
      "Trust your perceptions—if something felt wrong, it probably was",
      "Surround yourself with people who see and acknowledge you"
    ],
    affirmation: "My feelings are valid. My experience is real. I don't need others to confirm what I know to be true.",
    reparentingAction: "Tell your inner child: 'I believe you. What you felt was real. I see you.'"
  }
];

const developmentalStages = [
  {
    stage: "Infant (0-18 months)",
    theme: "Trust vs. Mistrust",
    needs: "Consistent caregiving, physical comfort, emotional attunement, having needs met reliably",
    wounds: "Neglect, inconsistent care, lack of physical touch, needs unmet",
    adultManifestation: "Difficulty trusting, attachment issues, fear of abandonment, needing constant reassurance",
    healingFocus: "Build internal sense of safety, practice self-soothing, develop secure relationships"
  },
  {
    stage: "Toddler (18 months - 3 years)",
    theme: "Autonomy vs. Shame",
    needs: "Freedom to explore, making choices, having boundaries respected, encouragement",
    wounds: "Over-control, shaming, harsh criticism of normal exploration, rigid expectations",
    adultManifestation: "Shame, difficulty with autonomy, excessive need for approval, perfectionism",
    healingFocus: "Reclaim your right to choose, release shame, celebrate imperfection"
  },
  {
    stage: "Preschool (3-6 years)",
    theme: "Initiative vs. Guilt",
    needs: "Encouragement of curiosity, creative expression, gender identity exploration, play",
    wounds: "Punishment for asking questions, creativity stifled, inappropriate guilt, role confusion",
    adultManifestation: "Excessive guilt, fear of taking initiative, creativity blocks, imposter syndrome",
    healingFocus: "Embrace curiosity, creative expression, take initiative without guilt"
  },
  {
    stage: "School Age (6-12 years)",
    theme: "Industry vs. Inferiority",
    needs: "Competence development, peer acceptance, academic encouragement, skill building",
    wounds: "Comparison to others, academic pressure, bullying, being told you're not good enough",
    adultManifestation: "Inferiority complex, imposter syndrome, perfectionism, fear of failure",
    healingFocus: "Acknowledge your competence, release comparison, celebrate growth over perfection"
  }
];

const reparentingActs = [
  { act: "Comfort yourself when upset", example: "Wrap in a blanket, speak soothing words, hold yourself", icon: Heart },
  { act: "Celebrate your achievements", example: "Acknowledge wins genuinely—even small ones count", icon: Star },
  { act: "Set loving limits", example: "Go to bed on time, eat nourishing food, limit harmful inputs", icon: Shield },
  { act: "Provide structure and routine", example: "Create rhythms that feel safe and predictable", icon: Home },
  { act: "Allow rest without guilt", example: "Take breaks before exhaustion, honor your limits", icon: Sun },
  { act: "Protect from harm", example: "Remove yourself from toxic situations, set firm boundaries", icon: Shield },
  { act: "Encourage and believe", example: "Cheer yourself on, trust your capacity to handle things", icon: Sparkles },
  { act: "Validate emotions", example: "Say: 'It makes sense you feel this way. All feelings are allowed.'", icon: Eye }
];

const healingLetterPrompts = [
  {
    prompt: "What do you wish someone had said to you as a child?",
    guidance: "Write the words your younger self desperately needed to hear. Be specific. Be tender."
  },
  {
    prompt: "What did you need to hear when you were scared?",
    guidance: "Think of a specific scary moment. What reassurance would have helped? Write it now."
  },
  {
    prompt: "What comfort would you offer your younger self during hard times?",
    guidance: "Imagine sitting with your child self during their hardest moment. What would you say? What would you do?"
  },
  {
    prompt: "What would you say to defend and protect your child self?",
    guidance: "If you could go back and stand between your child self and anyone who hurt them, what would you say?"
  },
  {
    prompt: "What do you want your inner child to know about the future?",
    guidance: "Tell them about who they become, how they survive, what good things await them."
  }
];

const ifsPartsWork = {
  title: "Inner Child Work Through Internal Family Systems (IFS)",
  description: "In IFS, your inner child is often understood as an 'exile'—a wounded part that holds pain from the past. Healing happens when your core Self (characterized by curiosity, compassion, and calm) builds a relationship with these young parts.",
  steps: [
    "Notice a part of you that's activated (anxiety, shame, fear)",
    "Ask: 'How old does this part feel?' Often there's a younger quality.",
    "Get curious: 'What is this part trying to protect me from?'",
    "Thank the part for its protective intention",
    "Ask: 'What does this young part need from me right now?'",
    "From your centered Self, offer what the part needs—often just presence and compassion",
    "Notice any shifts in how you feel"
  ],
  keyPrinciple: "Every part has a positive intention. Even the most destructive coping mechanisms began as survival strategies of a child doing their best."
};

function NeedCard({ need, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="text-left p-6 rounded-2xl transition-all hover:shadow-md"
      style={isSelected 
        ? { background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-rose-dark))', color: 'var(--glp-paper)', boxShadow: '0 10px 25px -3px rgba(0,0,0,0.15)', transform: 'scale(1.05)' }
        : { background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
      data-testid={`button-need-${need.need.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <need.icon className="h-8 w-8 mb-3" style={{ color: isSelected ? 'var(--glp-paper)' : 'var(--glp-rose)' }} />
      <h3 className="font-semibold mb-1" style={{ color: isSelected ? 'var(--glp-paper)' : 'var(--glp-ink)' }}>
        {need.need}
      </h3>
      <p className="text-sm" style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--glp-sage)' }}>
        {need.description}
      </p>
    </button>
  );
}

function NeedDetail({ need }) {
  return (
    <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'var(--glp-paper)' }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-rose-dark))', color: 'var(--glp-paper)' }}>
          <need.icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-ink)' }}>The Need for {need.need}</h2>
          <p style={{ color: 'var(--glp-sage)' }}>{need.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-6" style={{ background: 'var(--glp-rose-15)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--glp-ink)' }}>When This Need Was Unmet</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--glp-sage)' }}>{need.whenUnmet}</p>
          <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--glp-ink)' }}>Common Origins:</h4>
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{need.woundOrigins}</p>
        </div>
        <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--glp-ink)' }}>Healing Practices</h3>
          <ul className="space-y-2">
            {need.healingPractices.map((practice, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--glp-sage)' }}>
                <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--glp-sage)' }} />
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--glp-gold-30)' }}>
        <Heart className="h-6 w-6 mb-2" style={{ color: 'var(--glp-rose)' }} />
        <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Affirmation</h3>
        <p className="text-lg italic" style={{ color: 'var(--glp-sage-deep)' }}>"{need.affirmation}"</p>
      </div>

      <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
        <Gift className="h-5 w-5 mb-2" style={{ color: 'var(--glp-sage-deep)' }} />
        <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Reparenting Action</h3>
        <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{need.reparentingAction}</p>
      </div>
    </div>
  );
}

export default function InnerChildPage() {
  const [selectedNeed, setSelectedNeed] = useState(innerChildNeeds[0]);
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  useSEO({
    title: "Inner Child Healing | The Genuine Love Project",
    description: "Reconnect with your wounded inner child through trauma-informed practices. Reparenting exercises, developmental healing, and IFS-informed parts work for deep transformation."
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--glp-paper), var(--glp-rose-15))' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 transition-colors mb-8" style={{ color: 'var(--glp-sage)' }} data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-rose-dark))', color: 'var(--glp-paper)' }}>
            <Baby className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Inner Child Healing</h1>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
            Inside you lives every age you've ever been. Your inner child holds both your deepest wounds and your most authentic joy. 
            Healing happens when you finally give that child what they always needed: safety, love, and someone who stays.
          </p>
        </div>

        <BenefitsBlock
          benefits={[
            "10 core childhood needs with healing practices",
            "Reparenting affirmations and dialogue scripts",
            "Trauma-informed practices for each wound type"
          ]}
          duration="Explore at your own pace"
          control="Pause or stop anytime—only do what feels safe"
          disclaimer="Educational inner child healing—not therapy. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-8"
        />

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'var(--glp-gold-30)' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--glp-sage-deep)' }}>Understanding Inner Child Work</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="rounded-xl p-5" style={{ background: 'var(--glp-paper)' }}>
              <Baby className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--glp-gold)' }} />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>The Inner Child</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                The part of you that holds your earliest experiences, emotions, and unmet needs. 
                This part still influences your adult reactions, relationships, and self-perception.
              </p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'var(--glp-paper)' }}>
              <Heart className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--glp-rose)' }} />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Reparenting</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                The practice of giving yourself now what you needed then—the love, safety, validation, and care you deserved. 
                You become the good parent you never had (or supplement what was missing).
              </p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'var(--glp-paper)' }}>
              <Sparkles className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--glp-sage-deep)' }} />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Integration</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                Bringing your inner child into your present life—not leaving them in the past, 
                but carrying them with you, finally safe and finally loved.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--glp-sage-deep)' }}>Core Childhood Needs</h2>
          <p className="text-center mb-8 max-w-2xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
            Every child has fundamental needs. When these weren't met, we develop coping strategies that persist into adulthood. 
            Healing begins with understanding what was missing—and learning to provide it for yourself now.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {innerChildNeeds.map((need) => (
              <NeedCard
                key={need.need}
                need={need}
                isSelected={selectedNeed.need === need.need}
                onSelect={() => setSelectedNeed(need)}
              />
            ))}
          </div>
          <NeedDetail need={selectedNeed} />
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'var(--glp-sage-10)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-8 w-8" style={{ color: 'var(--glp-sage-deep)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--glp-ink)' }}>{ifsPartsWork.title}</h2>
          </div>
          <p className="mb-6" style={{ color: 'var(--glp-sage)' }}>{ifsPartsWork.description}</p>
          <div className="rounded-xl p-6 mb-4" style={{ background: 'var(--glp-paper)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--glp-ink)' }}>A Simple IFS Practice</h3>
            <ol className="space-y-3">
              {ifsPartsWork.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3" style={{ color: 'var(--glp-sage)' }}>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full text-sm flex items-center justify-center font-medium" style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}>
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'var(--glp-sage-15)' }}>
            <p className="text-sm italic" style={{ color: 'var(--glp-sage-deep)' }}>
              <strong>Key Principle:</strong> {ifsPartsWork.keyPrinciple}
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-8 shadow-lg mb-12" style={{ background: 'var(--glp-paper)' }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
            <MessageCircle className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
            Letter to Your Inner Child
          </h2>
          <p className="mb-6" style={{ color: 'var(--glp-sage)' }}>
            Writing to your younger self is one of the most powerful healing practices. It bridges past and present, 
            giving your child self what they needed to hear while helping your adult self process old pain.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {healingLetterPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPrompt(idx)}
                className="px-4 py-2 rounded-full text-sm transition-colors"
                style={selectedPrompt === idx
                  ? { background: 'var(--glp-sage)', color: 'var(--glp-paper)' }
                  : { background: 'var(--glp-sage-15)', color: 'var(--glp-sage)' }}
                data-testid={`button-prompt-${idx}`}
              >
                Prompt {idx + 1}
              </button>
            ))}
          </div>
          <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
            <p className="text-lg italic mb-3" style={{ color: 'var(--glp-sage-deep)' }}>
              "{healingLetterPrompts[selectedPrompt].prompt}"
            </p>
            <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
              {healingLetterPrompts[selectedPrompt].guidance}
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'var(--glp-sage-10)' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--glp-sage-deep)' }}>Developmental Stages & Wounds</h2>
          <p className="text-center mb-8 max-w-2xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
            Erik Erikson's developmental stages help us understand when certain wounds may have formed. 
            Identifying your stage-specific wounds can guide more targeted healing work.
          </p>
          <div className="space-y-4">
            {developmentalStages.map((stage, idx) => (
              <div key={idx} className="rounded-xl p-6" style={{ background: 'var(--glp-paper)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--glp-sage-15)' }}>
                    <span className="font-bold" style={{ color: 'var(--glp-sage-deep)' }}>{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{stage.stage}</h3>
                    <p className="text-sm" style={{ color: 'var(--glp-sage-deep)' }}>{stage.theme}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: 'var(--glp-ink)' }}>Core Needs</h4>
                    <p style={{ color: 'var(--glp-sage)' }}>{stage.needs}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: 'var(--glp-ink)' }}>When Wounded</h4>
                    <p style={{ color: 'var(--glp-sage)' }}>{stage.wounds}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: 'var(--glp-ink)' }}>Adult Impact</h4>
                    <p style={{ color: 'var(--glp-sage)' }}>{stage.adultManifestation}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1" style={{ color: 'var(--glp-ink)' }}>Healing Focus</h4>
                    <p style={{ color: 'var(--glp-sage)' }}>{stage.healingFocus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'var(--glp-sage-10)' }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
            <Gift className="h-6 w-6" style={{ color: 'var(--glp-sage)' }} />
            Daily Acts of Reparenting
          </h2>
          <p className="mb-6" style={{ color: 'var(--glp-sage)' }}>
            Reparenting isn't a one-time event—it's a daily practice of treating yourself with the care you deserved all along.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {reparentingActs.map((item, idx) => (
              <div key={idx} className="rounded-xl p-4 flex items-start gap-4" style={{ background: 'var(--glp-paper)' }}>
                <div className="p-2 rounded-lg" style={{ background: 'var(--glp-sage-15)' }}>
                  <item.icon className="h-5 w-5" style={{ color: 'var(--glp-sage-deep)' }} />
                </div>
                <div>
                  <h3 className="font-medium mb-1" style={{ color: 'var(--glp-ink)' }}>{item.act}</h3>
                  <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center rounded-2xl p-8 mb-12" style={{ background: 'var(--glp-rose-15)' }}>
          <Heart className="h-10 w-10 mx-auto mb-4" style={{ color: 'var(--glp-rose)' }} />
          <blockquote className="text-lg max-w-2xl mx-auto italic mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
            "It's never too late to have a happy childhood. You can give your inner child now 
            what they didn't receive then. Every moment of conscious reparenting rewrites the story 
            your nervous system carries."
          </blockquote>
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
            — Adapted from inner child healing traditions
          </p>
        </div>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--glp-gold-30)', border: '1px solid var(--glp-gold)' }}>
          <h4 className="font-semibold mb-2" style={{ color: 'var(--glp-gold-dark)' }}>Important Safety Guidance</h4>
          <ul className="text-sm space-y-2" style={{ color: 'var(--glp-sage-deep)' }}>
            <li>• Inner child work can bring up intense emotions and memories. <strong>Move gently</strong> and stay within your window of tolerance.</li>
            <li>• If you feel overwhelmed, <strong>pause and ground yourself</strong>—try the 5-4-3-2-1 senses technique or step away.</li>
            <li>• This content is <strong>not therapy</strong> and is not a substitute for professional mental health care.</li>
            <li>• For deeper trauma processing, we strongly recommend working with a trauma-informed therapist.</li>
            <li>• If you're in crisis, please contact a crisis line or mental health professional immediately.</li>
          </ul>
        </div>

        <SafetyFooter variant="prominent" />
      </div>
    </div>
  );
}
