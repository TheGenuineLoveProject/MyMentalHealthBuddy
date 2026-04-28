// server/protocols/seed/protocols.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.3: Protocol Registry seed.
//
// Ten evidence-informed therapeutic protocols. Each phases[] entry is a
// node in a directed graph; transitions[] declares allowed next-node IDs
// (with optional `condition` evaluated against session.userVariables).
//
// CRITICAL: This file is EDUCATIONAL ONLY. Content is psychoeducational
// and trauma-informed; nothing here is clinical advice or diagnosis. The
// /crisis safety floor is preserved by the engine — every walk passes
// through a CRISIS_CHECK gate before user-facing skill / experiential
// content is delivered.
//
// References (general only — protocols are not verbatim from any single
// manualised treatment):
//   CBT — Beck (1979) Cognitive Therapy of Depression
//   DBT — Linehan (1993) Cognitive-Behavioral Treatment of BPD
//   ACT — Hayes, Strosahl & Wilson (1999/2012) Acceptance and Commitment Therapy
//   IFS — Schwartz (1995) Internal Family Systems Therapy
//   SE  — Levine (1997) Waking the Tiger / Somatic Experiencing
//   EMDR — Shapiro (1989) — IMPORTANT: only the orientation phase is shipped;
//          eye-movement processing is human-required and gated off.
//   MBSR — Kabat-Zinn (1990) Full Catastrophe Living
//   CFT — Gilbert (2009) The Compassionate Mind
//   BA   — Martell, Dimidjian & Herman-Dunn (2010) Behavioral Activation
//   POLYVAGAL — Porges (2011) / Dana (2018) Polyvagal grounding practices

const PROTOCOLS = [
  // ===================== 1. CBT for Depression =====================
  {
    code: "CBT-DEPRESSION-8W",
    name: "Cognitive Behavioral Therapy for Low Mood (8-week course)",
    modality: "CBT",
    description:
      "Identify thought patterns that fuel low mood, gently challenge them, and rebuild behaviors that bring meaning. Educational adaptation; not a substitute for licensed care.",
    targetSymptoms: ["low_mood", "rumination", "withdrawal", "self_critical_thoughts"],
    evidenceLevel: "high",
    durationWeeks: 8,
    sessionsPerWeek: 1,
    humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "Welcome & Orientation",
        body: "We'll learn how thoughts, feelings, and actions form a loop, and how small shifts in any one of them can ease the others.",
        transitions: [{ to: "safety" }] },
      { id: "safety", type: "CRISIS_CHECK", title: "Gentle safety check",
        prompt: "Before we begin: in the last two weeks, have you had thoughts of hurting yourself?",
        transitions: [{ to: "psychoed_model" }] },
      { id: "psychoed_model", type: "PSYCHOED", title: "The thought-feeling-action loop",
        body: "When mood is low, the brain offers more harsh stories. Noticing the story is the first move — not believing every thought.",
        transitions: [{ to: "skill_thought_record" }] },
      { id: "skill_thought_record", type: "SKILL", title: "Thought record (3-column)",
        instructions: "Notice a moment of low mood today. Write the situation, the automatic thought, and one alternative perspective.",
        transitions: [{ to: "homework_week1" }] },
      { id: "homework_week1", type: "HOMEWORK", title: "This week",
        body: "One thought record per day, no perfection required. Two activities you used to enjoy, even briefly.",
        transitions: [{ to: "assessment_phq9" }] },
      { id: "assessment_phq9", type: "ASSESSMENT", measureCode: "PHQ-9", title: "Mood check (PHQ-9, 9 items)",
        transitions: [
          { to: "branch_severity", condition: "always" },
        ] },
      { id: "branch_severity", type: "BRANCH", title: "Personalize next step",
        branches: [
          { when: "phq9_score >= 20", to: "escalate_human" },
          { when: "phq9_score >= 10", to: "skill_behavioral_activation" },
          { when: "default", to: "skill_compassion" },
        ] },
      { id: "skill_behavioral_activation", type: "SKILL", title: "Add one small action",
        instructions: "Pick one tiny activity tomorrow that connects you to a value (not a chore). Schedule it.",
        transitions: [{ to: "complete" }] },
      { id: "skill_compassion", type: "SKILL", title: "Speak to yourself like a friend",
        instructions: "Re-read your thought record. Rewrite the harshest line as if you were speaking to someone you love.",
        transitions: [{ to: "complete" }] },
      { id: "escalate_human", type: "PSYCHOED", title: "Let's involve a person",
        body: "Your responses suggest support beyond an app would help. We'll show resources and pause this protocol so you can connect with a human.",
        transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "Session complete",
        body: "You showed up. That counts. We'll check in next week.",
        transitions: [] },
    ],
  },
  // ===================== 2. DBT Distress Tolerance =====================
  {
    code: "DBT-DISTRESS-4W",
    name: "DBT Distress Tolerance Skills (4-week mini-course)",
    modality: "DBT",
    description:
      "Crisis-survival skills for moments when emotion is overwhelming and acting on the urge would make things worse. Educational adaptation of Linehan's DBT skills.",
    targetSymptoms: ["emotional_overwhelm", "impulsive_urges", "self_harm_urges", "interpersonal_crisis"],
    evidenceLevel: "high", durationWeeks: 4, sessionsPerWeek: 2, humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "Distress tolerance: what it is and isn't",
        body: "Distress tolerance is not avoidance — it's surviving the wave so the wave doesn't make a permanent decision for you.",
        transitions: [{ to: "safety" }] },
      { id: "safety", type: "CRISIS_CHECK", title: "Are you safe right now?",
        prompt: "Are you safe in this moment? Is anyone around you at risk?",
        transitions: [{ to: "skill_tipp" }] },
      { id: "skill_tipp", type: "SKILL", title: "TIPP: change body chemistry fast",
        instructions: "Temperature (cold water on face, 30s), Intense exercise (1 min), Paced breathing (4-in / 6-out, 2 min), Paired muscle relaxation.",
        transitions: [{ to: "exp_grounding" }] },
      { id: "exp_grounding", type: "GROUNDING", title: "5-4-3-2-1 grounding",
        prompt: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
        transitions: [{ to: "skill_radical_acceptance" }] },
      { id: "skill_radical_acceptance", type: "SKILL", title: "Radical acceptance (one breath at a time)",
        instructions: "Try the sentence: 'This is what is happening right now. I don't have to like it to survive it.'",
        transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "You rode the wave",
        body: "Crisis-survival is a skill. The skill grows each time you use it instead of the urge.",
        transitions: [] },
    ],
  },
  // ===================== 3. ACT for Anxiety =====================
  {
    code: "ACT-ANXIETY-6W",
    name: "Acceptance & Commitment Therapy for Anxiety (6 weeks)",
    modality: "ACT",
    description: "Make room for anxious feelings without letting them choose your direction. Defusion, acceptance, and value-driven action.",
    targetSymptoms: ["generalized_anxiety", "panic", "avoidance", "worry"],
    evidenceLevel: "high", durationWeeks: 6, sessionsPerWeek: 1, humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "Anxiety is a messenger, not a verdict",
        body: "You'll learn to carry the feeling and move toward what matters at the same time.",
        transitions: [{ to: "safety" }] },
      { id: "safety", type: "CRISIS_CHECK", prompt: "Any thoughts of harming yourself recently?",
        transitions: [{ to: "skill_defusion" }] },
      { id: "skill_defusion", type: "SKILL", title: "Cognitive defusion: 'I'm having the thought that...'",
        instructions: "Each time a sticky thought appears today, prepend: 'I'm noticing I'm having the thought that...' Watch what shifts.",
        transitions: [{ to: "exp_leaves" }] },
      { id: "exp_leaves", type: "EXPERIENTIAL", title: "Leaves on a stream (3 min)",
        instructions: "Imagine each thought placed on a leaf and floating downstream. You don't push it; you don't grab it. You watch.",
        durationSec: 180, transitions: [{ to: "skill_values" }] },
      { id: "skill_values", type: "SKILL", title: "What matters?",
        instructions: "Name one value (connection, creativity, learning, courage). Pick one small action this week that honors it.",
        transitions: [{ to: "assessment_gad7" }] },
      { id: "assessment_gad7", type: "ASSESSMENT", measureCode: "GAD-7",
        transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "Carrying it, moving anyway",
        body: "Action with anxiety is courage. You've practiced something today.",
        transitions: [] },
    ],
  },
  // ===================== 4. IFS Parts Mapping =====================
  {
    code: "IFS-PARTS-6W",
    name: "Internal Family Systems: Befriending Parts (6 weeks)",
    modality: "IFS",
    description: "Map the inner protectors and exiles, listen to what each part is trying to do, and lead from Self.",
    targetSymptoms: ["self_criticism", "perfectionism", "inner_conflict", "shame"],
    evidenceLevel: "moderate", durationWeeks: 6, sessionsPerWeek: 1, humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "All parts are welcome",
        body: "IFS holds that the mind is naturally many. No part of you is an enemy — every part is trying, in its own way, to help.",
        transitions: [{ to: "safety" }] },
      { id: "safety", type: "CRISIS_CHECK", prompt: "Any thoughts of self-harm in the last 2 weeks?",
        transitions: [{ to: "exp_part_naming" }] },
      { id: "exp_part_naming", type: "EXPERIENTIAL", title: "Notice one part",
        instructions: "Bring to mind a recent moment of inner conflict. Notice where you feel that part in your body. Give it a gentle name.",
        durationSec: 180, transitions: [{ to: "skill_unblending" }] },
      { id: "skill_unblending", type: "SKILL", title: "Un-blending: 'There's a part of me that...'",
        instructions: "Practice the phrase 'there's a part of me that...'. It creates a kind, observing distance.",
        transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "Befriending, not banishing",
        body: "We don't need to fix any part today. Listening is the work.",
        transitions: [] },
    ],
  },
  // ===================== 5. SE Pendulation =====================
  {
    code: "SE-PENDULATION-3W",
    name: "Somatic Experiencing: Pendulation Basics (3 weeks)",
    modality: "SE",
    description: "Build capacity to move attention between activation and resource, slowly, so the nervous system can complete what was interrupted.",
    targetSymptoms: ["dysregulation", "freeze_response", "hypervigilance", "trauma_aftereffects"],
    evidenceLevel: "moderate", durationWeeks: 3, sessionsPerWeek: 2, humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "Slow is fast",
        body: "We'll work in small doses (titration), and we'll always return to a felt sense of safety (resource) before going further.",
        transitions: [{ to: "safety" }] },
      { id: "safety", type: "CRISIS_CHECK", prompt: "Are you currently in physical danger or in acute crisis?",
        transitions: [{ to: "exp_resource" }] },
      { id: "exp_resource", type: "EXPERIENTIAL", title: "Find your resource",
        instructions: "Bring to mind a place, person, or sensation that feels good in your body. Take 60 seconds to soak in it.",
        durationSec: 60, transitions: [{ to: "exp_pendulation" }] },
      { id: "exp_pendulation", type: "EXPERIENTIAL", title: "Pendulate gently",
        instructions: "Notice a small uncomfortable sensation. Stay 10 seconds. Return to the resource. Repeat 3 times.",
        durationSec: 240, transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "Capacity grows in small reps",
        body: "You taught your nervous system that it's safe to come back. That's the medicine.",
        transitions: [] },
    ],
  },
  // ===================== 6. EMDR Orientation (HUMAN-REQUIRED) =====================
  {
    code: "EMDR-ORIENTATION-1W",
    name: "EMDR Orientation Module (preparation only — human clinician required)",
    modality: "EMDR",
    description: "EMDR processing is HUMAN-REQUIRED. This module only orients you to the approach so you can have an informed conversation with a trained clinician.",
    targetSymptoms: ["ptsd", "trauma_memories"],
    evidenceLevel: "high", durationWeeks: 1, sessionsPerWeek: 1, humanRequired: true,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "What EMDR is — and why this app cannot deliver it",
        body: "EMDR uses bilateral stimulation to reprocess trauma memories. It must be delivered by a trained clinician. We can prepare you to begin that conversation.",
        transitions: [{ to: "skill_resourcing" }] },
      { id: "skill_resourcing", type: "SKILL", title: "Calm-place visualization (preparation skill)",
        instructions: "Build a vivid 'calm place' you can return to. This becomes a stabilizing tool you can use in real EMDR sessions.",
        transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "Next step: find a clinician",
        body: "When you're ready, search for an EMDRIA-credentialed therapist. Bring this orientation with you.",
        transitions: [] },
    ],
  },
  // ===================== 7. MBSR Body Scan =====================
  {
    code: "MBSR-BODYSCAN-8W",
    name: "Mindfulness-Based Stress Reduction: Body Scan Foundations (8 weeks)",
    modality: "MBSR",
    description: "An adaptation of Kabat-Zinn's body scan — a foundational mindfulness practice for non-judgmental awareness of bodily sensations.",
    targetSymptoms: ["chronic_stress", "rumination", "sleep_disturbance"],
    evidenceLevel: "high", durationWeeks: 8, sessionsPerWeek: 3, humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "Beginner's mind",
        body: "We're not trying to relax. We're practicing being with whatever is here — pleasant or not — without trying to change it.",
        transitions: [{ to: "exp_bodyscan" }] },
      { id: "exp_bodyscan", type: "EXPERIENTIAL", title: "Body scan (15 min)",
        instructions: "We'll move attention slowly from feet to head, pausing in each region. Mind will wander. Each return is the practice.",
        durationSec: 900, transitions: [{ to: "homework" }] },
      { id: "homework", type: "HOMEWORK", title: "Daily 15-minute scan",
        body: "Same time and place each day if possible. Use a mat or chair, whichever is sustainable.",
        transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "Awareness, not achievement",
        body: "You don't get better at meditating. You get better at returning. That's the whole skill.",
        transitions: [] },
    ],
  },
  // ===================== 8. CFT Self-Compassion =====================
  {
    code: "CFT-SELFCOMPASSION-4W",
    name: "Compassion Focused Therapy: Soothing System Activation (4 weeks)",
    modality: "CFT",
    description: "Build the soothing system through compassionate imagery, soothing rhythm breathing, and the compassionate self.",
    targetSymptoms: ["self_criticism", "shame", "low_self_worth"],
    evidenceLevel: "moderate", durationWeeks: 4, sessionsPerWeek: 2, humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "Three systems: threat, drive, soothe",
        body: "Modern life keeps the threat and drive systems hot. Compassion is how we re-balance.",
        transitions: [{ to: "exp_soothing_breath" }] },
      { id: "exp_soothing_breath", type: "EXPERIENTIAL", title: "Soothing rhythm breathing (5 min)",
        instructions: "Slow your breath until it feels soothing. Don't force a count — let the rhythm find you.",
        durationSec: 300, transitions: [{ to: "skill_compassionate_self" }] },
      { id: "skill_compassionate_self", type: "SKILL", title: "Compassionate self imagery",
        instructions: "Imagine the wisest, kindest version of yourself sitting beside you. What would they say to today's hardest moment?",
        transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "Soothe is also strength",
        body: "Compassion is not weakness — it's the courage to face what hurts with a kind hand.",
        transitions: [] },
    ],
  },
  // ===================== 9. Behavioral Activation =====================
  {
    code: "BA-ACTIVATION-6W",
    name: "Behavioral Activation for Low Mood (6 weeks)",
    modality: "BA",
    description: "When mood is low, motivation follows action — not the other way around. We'll start tiny.",
    targetSymptoms: ["low_mood", "anhedonia", "withdrawal", "low_motivation"],
    evidenceLevel: "high", durationWeeks: 6, sessionsPerWeek: 2, humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "Outside-in healing",
        body: "Action first, motivation second. We'll schedule one tiny meaningful activity at a time.",
        transitions: [{ to: "safety" }] },
      { id: "safety", type: "CRISIS_CHECK", prompt: "Any thoughts of self-harm recently?",
        transitions: [{ to: "skill_activity_menu" }] },
      { id: "skill_activity_menu", type: "SKILL", title: "Activity menu",
        instructions: "List 5 activities you used to enjoy. Don't aim for joy; aim for slight willingness.",
        transitions: [{ to: "homework" }] },
      { id: "homework", type: "HOMEWORK", title: "Schedule one this week",
        body: "Pick the smallest one. Put it on a calendar. Show up regardless of how you feel.",
        transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "One brick at a time",
        body: "Recovery rebuilds itself one tiny act at a time. You've placed a brick today.",
        transitions: [] },
    ],
  },
  // ===================== 10. Polyvagal Grounding =====================
  {
    code: "POLYVAGAL-GROUNDING-2W",
    name: "Polyvagal Grounding: Cues of Safety (2 weeks)",
    modality: "POLYVAGAL",
    description: "Send your nervous system cues of safety through voice, face, breath, and connection.",
    targetSymptoms: ["dysregulation", "shutdown", "social_anxiety", "freeze_response"],
    evidenceLevel: "emerging", durationWeeks: 2, sessionsPerWeek: 3, humanRequired: false,
    phases: [
      { id: "intro", type: "PSYCHOED", title: "Your nervous system listens to your face",
        body: "Soft eyes, slow exhale, and warm voice are cues that you (and others) are safe.",
        transitions: [{ to: "exp_voo" }] },
      { id: "exp_voo", type: "EXPERIENTIAL", title: "Voo sound (vagal tone, 2 min)",
        instructions: "On a long exhale, hum a low 'voo' sound. Feel the vibration in your chest. Repeat for 2 minutes.",
        durationSec: 120, transitions: [{ to: "exp_orienting" }] },
      { id: "exp_orienting", type: "EXPERIENTIAL", title: "Orienting (90 sec)",
        instructions: "Slowly turn your head and let your eyes soften across the room. Notice what catches your attention without judgment.",
        durationSec: 90, transitions: [{ to: "complete" }] },
      { id: "complete", type: "PSYCHOED", title: "Cues of safety, layered",
        body: "Safety isn't a feeling you wait for — it's a set of small signals you can send.",
        transitions: [] },
    ],
  },
];

export function getSeedProtocols() {
  return PROTOCOLS;
}

export function getProtocolByCode(code) {
  return PROTOCOLS.find((p) => p.code === code) || null;
}

/**
 * Bootstrap-only seeder. Inserts seed protocols ONLY when the registry
 * is empty so admin edits in the live DB are never overwritten.
 */
export async function seedProtocolsIfEmpty(db, schema) {
  const { protocolRegistry } = schema;
  const existing = await db.select({ id: protocolRegistry.id }).from(protocolRegistry).limit(1);
  if (existing.length > 0) return { seeded: 0, skipped: PROTOCOLS.length };
  const rows = PROTOCOLS.map((p) => ({
    code: p.code,
    name: p.name,
    modality: p.modality,
    description: p.description,
    targetSymptoms: p.targetSymptoms,
    evidenceLevel: p.evidenceLevel,
    durationWeeks: p.durationWeeks,
    sessionsPerWeek: p.sessionsPerWeek,
    humanRequired: p.humanRequired,
    phases: p.phases,
    status: "active",
  }));
  await db.insert(protocolRegistry).values(rows);
  return { seeded: rows.length, skipped: 0 };
}
