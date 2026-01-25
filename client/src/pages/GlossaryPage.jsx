import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Search, ChevronRight, Filter } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const glossaryTerms = [
  { term: "Affirmation", category: "Practice", definition: "A positive statement repeated to reinforce self-belief and counter negative thought patterns. Most effective when stated in present tense ('I am') with emotional engagement.", example: "'I am worthy of love and belonging' - spoken daily, especially when self-doubt arises." },
  { term: "Amygdala", category: "Neuroscience", definition: "The brain's alarm system that processes fear and triggers the fight-flight-freeze response. Can become hyperactive after trauma, causing overreaction to perceived threats.", example: "When you startle at a loud noise, your amygdala activated before your thinking brain could assess the situation." },
  { term: "Attachment Style", category: "Psychology", definition: "The pattern of relating to others formed in early childhood based on caregiver responsiveness. Four main styles: secure, anxious, avoidant, and disorganized.", example: "Someone with anxious attachment may frequently seek reassurance in relationships and fear abandonment." },
  { term: "Body Scan", category: "Practice", definition: "A mindfulness technique involving systematic attention to physical sensations throughout the body, often used to release tension and increase body awareness.", example: "Starting at the crown of your head, slowly notice sensations as you move attention down to your toes." },
  { term: "Boundaries", category: "Relationships", definition: "Personal limits that define what behavior you will and won't accept from others. Healthy boundaries protect your emotional wellbeing while respecting others.", example: "Saying 'I can't take calls after 9pm' is setting a time boundary to protect your rest." },
  { term: "Burnout", category: "Mental Health", definition: "A state of chronic physical and emotional exhaustion caused by prolonged stress, often work-related. Characterized by reduced effectiveness, cynicism, and detachment.", example: "Feeling emotionally drained, dreading work, and unable to feel satisfaction from accomplishments." },
  { term: "Cognitive Behavioral Therapy (CBT)", category: "Therapy", definition: "An evidence-based therapy approach that identifies and changes unhelpful thought patterns and behaviors. Based on the connection between thoughts, feelings, and actions. Note: CBT is a professional therapy modality—seek a licensed therapist for therapeutic application.", example: "Challenging the thought 'I always fail' by examining evidence and creating a more balanced perspective." },
  { term: "Cognitive Distortion", category: "Psychology", definition: "Automatic, irrational thought patterns that reinforce negative thinking. Common types include catastrophizing, all-or-nothing thinking, and mind reading.", example: "Catastrophizing: 'If I make one mistake, my entire career is ruined.'" },
  { term: "Cortisol", category: "Neuroscience", definition: "The primary stress hormone released by the adrenal glands. Chronic elevation can impair immune function, sleep, and cognitive performance.", example: "Morning cortisol helps you wake up, but constant high cortisol from chronic stress causes exhaustion." },
  { term: "Dissociation", category: "Mental Health", definition: "A disconnection from thoughts, feelings, surroundings, or identity. Ranges from daydreaming to more severe experiences. Often a protective response to overwhelming stress.", example: "Feeling like you're watching yourself from outside your body, or that the world seems unreal." },
  { term: "Emotional Intelligence (EQ)", category: "Psychology", definition: "The ability to recognize, understand, manage, and effectively use emotions in yourself and others. Includes self-awareness, empathy, and social skills.", example: "Noticing you're becoming frustrated in a meeting and choosing to pause before responding." },
  { term: "Emotional Regulation", category: "Skills", definition: "The ability to manage and respond to emotional experiences in healthy ways. Includes awareness, acceptance, and appropriate expression of emotions.", example: "Using deep breathing to calm anxiety before an important presentation." },
  { term: "Fight-Flight-Freeze", category: "Neuroscience", definition: "The body's automatic survival response to perceived threats. Fight: confront. Flight: escape. Freeze: immobilize. A fourth response, 'fawn,' involves people-pleasing.", example: "Heart racing and muscles tensing when you hear an unexpected loud noise." },
  { term: "Gaslighting", category: "Relationships", definition: "A form of psychological manipulation where someone makes you question your own reality, memory, or perceptions. Often occurs in abusive relationships.", example: "'That never happened' or 'You're being too sensitive' when your concerns are valid." },
  { term: "Gratitude Practice", category: "Practice", definition: "Intentionally focusing on and appreciating positive aspects of life. Research shows it improves mood, relationships, and physical health.", example: "Writing three things you're grateful for each morning, with specific details about why." },
  { term: "Grounding", category: "Practice", definition: "Techniques that connect you to the present moment, often through sensory awareness. Useful for anxiety, dissociation, and overwhelming emotions.", example: "The 5-4-3-2-1 technique: naming 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste." },
  { term: "Habit Loop", category: "Behavior", definition: "The neurological pattern behind every habit: Cue (trigger) → Routine (behavior) → Reward (benefit). Understanding this loop enables habit change.", example: "Cue: boredom. Routine: checking social media. Reward: novelty and distraction." },
  { term: "Inner Child", category: "Psychology", definition: "The part of your psyche that retains the feelings, memories, and experiences from childhood. Inner child work involves acknowledging and healing childhood wounds.", example: "Feeling disproportionate shame when criticized may reflect an inner child who experienced harsh judgment." },
  { term: "Intrusive Thoughts", category: "Mental Health", definition: "Unwanted, involuntary thoughts that can be disturbing or distressing. Having them is normal; it's how we respond to them that matters.", example: "A sudden, unwanted thought about something embarrassing you once said years ago." },
  { term: "Journaling", category: "Practice", definition: "Writing about thoughts, feelings, and experiences as a tool for self-reflection, emotional processing, and personal growth.", example: "Free-writing for 10 minutes each morning about whatever comes to mind." },
  { term: "Loving-Kindness Meditation", category: "Practice", definition: "A meditation practice that cultivates feelings of warmth and goodwill toward self and others. Also called Metta meditation.", example: "Repeating phrases like 'May I be happy, may I be healthy, may I live with ease' then extending to others." },
  { term: "Mindfulness", category: "Practice", definition: "Non-judgmental awareness of the present moment, including thoughts, feelings, and sensations. Rooted in Buddhist tradition, now widely used in therapy.", example: "Noticing the taste, texture, and smell of food while eating, rather than eating on autopilot." },
  { term: "Nervous System Regulation", category: "Neuroscience", definition: "The ability to shift between activation (stress response) and calm (rest-digest). Practices like breathwork and grounding support regulation.", example: "Using slow exhales to activate the parasympathetic nervous system and reduce anxiety." },
  { term: "Neuroplasticity", category: "Neuroscience", definition: "The brain's ability to reorganize itself by forming new neural connections. This means thoughts and behaviors can be changed through practice.", example: "Regular meditation physically changes brain regions associated with attention and emotional regulation." },
  { term: "Oxytocin", category: "Neuroscience", definition: "The 'bonding hormone' released during positive social interactions, physical touch, and connection. Promotes trust, empathy, and attachment.", example: "The warm feeling you get from hugging a loved one is partly due to oxytocin release." },
  { term: "Parasympathetic Nervous System", category: "Neuroscience", definition: "The 'rest and digest' branch of the nervous system that promotes calm, recovery, and relaxation. Activated by slow breathing and safety cues.", example: "After a stressful event, your parasympathetic system helps your heart rate return to normal." },
  { term: "Polyvagal Theory", category: "Neuroscience", definition: "A theory explaining how the vagus nerve influences our sense of safety and social connection. Three states: ventral vagal (safe), sympathetic (mobilized), dorsal vagal (shutdown).", example: "Feeling shut down and disconnected after overwhelming stress reflects dorsal vagal activation." },
  { term: "PTSD", category: "Mental Health", definition: "Post-Traumatic Stress Disorder - a condition that can develop after experiencing or witnessing a traumatic event. Symptoms include flashbacks, avoidance, and hypervigilance.", example: "Avoiding driving after a serious car accident, or having nightmares about the event." },
  { term: "Resilience", category: "Psychology", definition: "The ability to adapt and recover from adversity, stress, or trauma. Not about avoiding difficulty but developing the capacity to cope and grow.", example: "Bouncing back from job loss by learning new skills and building a support network." },
  { term: "Rumination", category: "Psychology", definition: "Repetitive, passive focus on negative thoughts and their causes. Unlike problem-solving, rumination keeps you stuck in the problem.", example: "Replaying a past argument over and over, focusing on what you should have said." },
  { term: "Self-Compassion", category: "Practice", definition: "Treating yourself with the same kindness and understanding you would offer a good friend. Includes self-kindness, common humanity, and mindfulness.", example: "Instead of berating yourself for a mistake, acknowledging 'This is hard, and everyone struggles sometimes.'" },
  { term: "Somatic Experiencing", category: "Therapy", definition: "A body-based therapy approach that addresses trauma stored in the body. Focuses on physical sensations rather than just talking about events. Note: SE is a professional therapy modality—seek a trained practitioner for therapeutic application.", example: "Noticing where you feel tension in your body when discussing a difficult memory." },
  { term: "Sympathetic Nervous System", category: "Neuroscience", definition: "The 'fight or flight' branch of the nervous system that prepares the body for action in response to perceived threats.", example: "Your heart racing and palms sweating before giving a presentation." },
  { term: "Thought Challenging", category: "Skills", definition: "A CBT technique that examines evidence for and against automatic negative thoughts, leading to more balanced perspectives.", example: "Questioning 'Nobody likes me' by listing evidence that contradicts this belief." },
  { term: "Trigger", category: "Mental Health", definition: "A stimulus (sound, smell, word, situation) that activates a strong emotional or physical response, often related to past trauma.", example: "A certain song reminding you of a painful breakup and bringing back the associated feelings." },
  { term: "Vagus Nerve", category: "Neuroscience", definition: "The longest cranial nerve, connecting the brain to major organs. Key to the parasympathetic response and mind-body connection.", example: "Stimulating the vagus nerve through cold water on the face or humming can promote calm." },
  { term: "Vulnerability", category: "Psychology", definition: "The willingness to be emotionally exposed and authentic, despite uncertainty and risk. Research shows it's essential for connection and belonging.", example: "Telling a friend you're struggling, even though you fear judgment." },
  { term: "Window of Tolerance", category: "Psychology", definition: "The zone of emotional arousal in which we can function effectively. Too high (hyperarousal) or too low (hypoarousal) impairs coping.", example: "Learning to recognize when you're outside your window and using skills to return to it." }
];

const categories = [...new Set(glossaryTerms.map(t => t.category))].sort();

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useSEO({
    title: "Mental Health Glossary",
    description: "Comprehensive glossary of mental health, psychology, and wellness terms. Learn about therapy concepts, neuroscience, emotional regulation, and healing practices.",
  });

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach(term => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  return (
  <WellnessPageShell
    title="GlossaryPage"
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
      <SEO title="Glossary — The Genuine Love Project" description="Definitions of key wellness and self-care terms." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Wellness Glossary</h1>
                <p className="text-lead">{glossaryTerms.length} terms explained in simple language</p>
              </div>
            </div>
          </header>

          <div className="card-bordered mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--teal-400)] focus:border-transparent"
                  data-testid="input-search"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  data-testid="select-category"
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(groupedTerms).sort().map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 rounded-lg bg-[var(--teal-100)] text-[var(--teal-600)] flex items-center justify-center font-semibold text-sm hover:bg-[var(--teal-200)] transition"
              >
                {letter}
              </a>
            ))}
          </div>

          {Object.keys(groupedTerms).length === 0 ? (
            <div className="card-bordered text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No terms found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedTerms).sort().map(letter => (
                <div key={letter} id={`letter-${letter}`}>
                  <h2 className="text-2xl font-bold text-[var(--teal-600)] mb-3 flex items-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-[var(--teal-100)] flex items-center justify-center">{letter}</span>
                  </h2>
                  <div className="space-y-3">
                    {groupedTerms[letter].map((item, index) => (
                      <div 
                        key={index}
                        className="card-bordered"
                        data-testid={`card-term-${item.term.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.term}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.definition}</p>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                          <p className="text-xs text-[var(--sage-500)] mb-1">Example:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic">{item.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <SafetyFooter variant="default" />
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
