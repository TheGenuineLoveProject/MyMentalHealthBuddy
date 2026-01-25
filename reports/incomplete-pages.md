# Incomplete Pages Report

Generated: 2026-01-25

---

## Summary

| Category | Count |
|----------|-------|
| TODOs/FIXMEs | 0 |
| Coming Soon/Placeholders | 304 |
| Empty Components | 25 |
| Missing BenefitsBlock (wellness) | 111 |
| Missing Crisis Link (wellness) | 80 |
| Missing Consent Language (wellness) | 149 |
| Missing SafetyFooter (wellness) | 105 |
| Missing ClarityCard (wellness) | 136 |
| Missing ExamplesAccordion (wellness) | 136 |
| **Total Issues** | **1046** |

## Detection Criteria

Wellness pages are detected by:
- Location in `/pages/` directory
- Filename patterns: *Page.jsx, *Tool.jsx, *Guide.jsx, *Practice.jsx
- Content keywords: wellness, healing, trauma, self-care, mindfulness, etc.
- Route patterns matching known wellness routes

Consent language must include:
- "Pause or stop anytime" OR
- "Opt-out" OR
- "Only do what feels safe"

## Coming Soon / Placeholders

- **client/src/components/AIChat.jsx:47** - `placeholder`
  `placeholder="Say something..."`
- **client/src/components/AdvisorySection.jsx:73** - `placeholder`
  `<p className={styles.placeholder}>`
- **client/src/components/BoundaryBuilder.jsx:183** - `placeholder`
  `placeholder="I will..."`
- **client/src/components/BoundaryBuilder.jsx:184** - `placeholder`
  `className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(-`
- **client/src/components/CBTThoughtDiary.jsx:129** - `placeholder`
  `placeholder="What happened? Where were you? Who was there?"`
- **client/src/components/CBTThoughtDiary.jsx:145** - `placeholder`
  `placeholder="What thought went through your mind?"`
- **client/src/components/CBTThoughtDiary.jsx:159** - `placeholder`
  `placeholder="e.g., Anxious, Sad, Angry"`
- **client/src/components/CBTThoughtDiary.jsx:224** - `placeholder`
  `placeholder="What facts support this thought?"`
- **client/src/components/CBTThoughtDiary.jsx:238** - `placeholder`
  `placeholder="What facts contradict this thought?"`
- **client/src/components/CBTThoughtDiary.jsx:254** - `placeholder`
  `placeholder="What's a more balanced way to think about this?"`
- **client/src/components/ChatWidget.tsx:170** - `placeholder`
  `placeholder="Type a message..."`
- **client/src/components/FocusTimer.jsx:309** - `placeholder`
  `placeholder="Set your intention for this session..."`
- **client/src/components/FocusTimer.jsx:310** - `placeholder`
  `className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeho`
- **client/src/components/GlobalSearch.jsx:128** - `placeholder`
  `placeholder="Search tools, guides, glossary, FAQ..."`
- **client/src/components/GlobalSearch.jsx:129** - `placeholder`
  `className="flex-1 bg-transparent text-[var(--text-1)] placeholder-[var(--text-3)] outline-none text-`
- **client/src/components/GoalProgress.jsx:180** - `placeholder`
  `placeholder="Enter your goal..."`
- **client/src/components/GoalProgress.jsx:181** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text`
- **client/src/components/GratitudeJar.jsx:191** - `placeholder`
  `placeholder="I'm grateful for..."`
- **client/src/components/GratitudePrompt.jsx:103** - `placeholder`
  `placeholder="Take a moment to reflect and write your thoughts..."`
- **client/src/components/GratitudePrompt.jsx:105** - `placeholder`
  `className="w-full p-4 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--tex`
- **client/src/components/HabitTracker.jsx:165** - `placeholder`
  `placeholder="Enter habit name..."`
- **client/src/components/HabitTracker.jsx:166** - `placeholder`
  `className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] text-[var(--te`
- **client/src/components/JoinSection.jsx:183** - `placeholder`
  `placeholder="Enter your email"`
- **client/src/components/NewsletterSignup.jsx:121** - `placeholder`
  `placeholder="your@email.com"`
- **client/src/components/NewsletterSignup.jsx:122** - `placeholder`
  `className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] t`
- **client/src/components/PositiveReframing.jsx:143** - `placeholder`
  `placeholder="Write the negative thought that's bothering you..."`
- **client/src/components/PositiveReframing.jsx:144** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:borde`
- **client/src/components/PositiveReframing.jsx:200** - `placeholder`
  `placeholder="Write a more balanced, compassionate perspective..."`
- **client/src/components/PositiveReframing.jsx:201** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-20`
- **client/src/components/QuestPanel.jsx:128** - `Coming Soon`
  `<h3 className="text-lg font-medium text-white mb-2">New Quests Coming Soon</h3>`
- **client/src/components/ResilienceStories.jsx:152** - `placeholder`
  `placeholder="Give your story a title..."`
- **client/src/components/ResilienceStories.jsx:153** - `placeholder`
  `className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-s`
- **client/src/components/ResilienceStories.jsx:165** - `placeholder`
  `placeholder="Share your experience... What happened? How did you feel? What did you do?"`
- **client/src/components/ResilienceStories.jsx:167** - `placeholder`
  `className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-s`
- **client/src/components/ResilienceStories.jsx:180** - `placeholder`
  `placeholder="e.g., perseverance, courage, self-compassion..."`
- **client/src/components/ResilienceStories.jsx:181** - `placeholder`
  `className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-s`
- **client/src/components/ResilienceStories.jsx:193** - `placeholder`
  `placeholder="Take a moment to reflect..."`
- **client/src/components/ResilienceStories.jsx:195** - `placeholder`
  `className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-s`
- **client/src/components/SacredFooter.jsx:140** - `placeholder`
  `placeholder="Your email address"`
- **client/src/components/SacredForm.jsx:93** - `placeholder`
  `placeholder="Your email address"`
- **client/src/components/SelfCompassion.jsx:254** - `placeholder`
  `placeholder="Write your compassionate letter here..."`
- **client/src/components/SelfCompassion.jsx:255** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(-`
- **client/src/components/SleepTracker.jsx:241** - `placeholder`
  `placeholder="Any dreams or thoughts about your sleep..."`
- **client/src/components/SleepTracker.jsx:242** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(-`
- **client/src/components/SocialConnection.jsx:153** - `placeholder`
  `placeholder="Optional: How did it go? How did it make you feel?"`
- **client/src/components/SocialConnection.jsx:154** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:tex`
- **client/src/components/StateTracker.jsx:127** - `placeholder`
  `placeholder="Context, observations..."`
- **client/src/components/StressMonitor.jsx:225** - `placeholder`
  `placeholder="Any additional notes? (optional)"`
- **client/src/components/StressMonitor.jsx:226** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(-`
- **client/src/components/TglpNavbar.jsx:167** - `placeholder`
  `placeholder="Search..."`
- **client/src/components/ValuesExplorer.jsx:248** - `placeholder`
  `placeholder="Write your reflection..."`
- **client/src/components/ValuesExplorer.jsx:249** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(-`
- **client/src/components/WeeklyReflection.jsx:10** - `placeholder`
  `placeholder: "I completed..., I'm proud of..., I succeeded in...",`
- **client/src/components/WeeklyReflection.jsx:17** - `placeholder`
  `placeholder: "I struggled with..., It was hard when..., I learned that...",`
- **client/src/components/WeeklyReflection.jsx:24** - `placeholder`
  `placeholder: "I'm thankful for..., I appreciated when..., It meant a lot that...",`
- **client/src/components/WeeklyReflection.jsx:31** - `placeholder`
  `placeholder: "I discovered..., I realized..., I'm getting better at...",`
- **client/src/components/WeeklyReflection.jsx:38** - `placeholder`
  `placeholder: "I will..., My goal is..., I want to...",`
- **client/src/components/WeeklyReflection.jsx:262** - `placeholder`
  `placeholder={section.placeholder}`
- **client/src/components/WeeklyReflection.jsx:263** - `placeholder`
  `className="w-full h-32 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[`
- **client/src/components/WellnessGoalTracker.jsx:229** - `placeholder`
  `placeholder="Goal title..."`
- **client/src/components/WellnessGoalTracker.jsx:232** - `placeholder`
  `className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] plac`
- **client/src/components/WellnessGoalTracker.jsx:251** - `placeholder`
  `placeholder="Target"`
- **client/src/components/WorryTimeScheduler.jsx:156** - `placeholder`
  `placeholder="What's on your mind?"`
- **client/src/components/WorryTimeScheduler.jsx:157** - `placeholder`
  `className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(-`
- **client/src/components/atlas/PhilosophicalAtlas.tsx:105** - `placeholder`
  `placeholder="Take your time with this question..."`
- **client/src/components/autodidact/AutodidactForge.tsx:139** - `placeholder`
  `placeholder="What question drives your learning?"`
- **client/src/components/autodidact/AutodidactForge.tsx:260** - `placeholder`
  `placeholder="What's your hypothesis or approach?"`
- **client/src/components/autodidact/AutodidactForge.tsx:299** - `placeholder`
  `placeholder="I am someone who..."`
- **client/src/components/beliefs/BeliefMapper.tsx:87** - `placeholder`
  `placeholder="A belief I notice in myself..."`
- **client/src/components/bias/BiasBlindSpots.tsx:146** - `placeholder`
  `placeholder="What was the situation?"`
- **client/src/components/bias/BiasBlindSpots.tsx:153** - `placeholder`
  `placeholder="How did you notice it?"`
- **client/src/components/bias/BiasBlindSpots.tsx:223** - `placeholder`
  `placeholder="Your ongoing reflections on bias awareness..."`
- **client/src/components/consciousness/QuestionReflection.tsx:107** - `placeholder`
  `placeholder="Your reflection..."`
- **client/src/components/consciousness/SilenceMode.tsx:43** - `placeholder`
  `placeholder="Write freely. Nothing will be analyzed or reflected back. This is just for you."`
- **client/src/components/creative/CreativeProblemSolver.tsx:175** - `placeholder`
  `placeholder="What problem are you working on?"`
- **client/src/components/creative/CreativeProblemSolver.tsx:182** - `placeholder`
  `placeholder="Describe the problem in detail..."`
- **client/src/components/creative/CreativeProblemSolver.tsx:193** - `placeholder`
  `placeholder="Add an idea..."`
- **client/src/components/decision/DecisionArchitecture.tsx:99** - `placeholder`
  `placeholder="Add an option to consider..."`
- **client/src/components/decision/DecisionArchitecture.tsx:148** - `placeholder`
  `placeholder="Add benefit..."`
- **client/src/components/decision/DecisionArchitecture.tsx:171** - `placeholder`
  `placeholder="Add drawback..."`
- **client/src/components/decision/DecisionArchitecture.tsx:202** - `placeholder`
  `placeholder="What could go wrong? What are you not seeing?"`
- **client/src/components/decision/DecisionArchitecture.tsx:248** - `placeholder`
  `placeholder="What decision are you facing?"`
- **client/src/components/epistemic/EpistemicCalibration.tsx:105** - `placeholder`
  `placeholder="I predict that..."`
- **client/src/components/epistemic/EpistemicCalibration.tsx:219** - `placeholder`
  `placeholder="I believe that..."`
- **client/src/components/existential/ExistentialInquiry.tsx:106** - `placeholder`
  `placeholder="There are no right answers here. Just write what comes..."`
- **client/src/components/flow/TimedSession.tsx:131** - `placeholder`
  `placeholder="Start writing... let your thoughts flow without judgment."`
- **client/src/components/inquiry/DialecticalInquiry.tsx:115** - `placeholder`
  `placeholder="Enter a belief, question, or dilemma..."`
- **client/src/components/inquiry/DialecticalInquiry.tsx:173** - `placeholder`
  `placeholder="Write your response..."`
- **client/src/components/journey/JourneyComposer.tsx:145** - `placeholder`
  `placeholder="Your reflection for this step..."`
- **client/src/components/logic/LogicLatticeLab.tsx:131** - `placeholder`
  `placeholder="Enter your reasoning..."`
- **client/src/components/logic/LogicLatticeLab.tsx:213** - `placeholder`
  `placeholder="What argument or position do you want to explore?"`
- **client/src/components/mastery/DeepWorkTracker.tsx:125** - `placeholder`
  `placeholder="What are you working on?"`
- **client/src/components/mastery/DeepWorkTracker.tsx:168** - `placeholder`
  `placeholder="One item per line..."`
- **client/src/components/mastery/DeepWorkTracker.tsx:179** - `placeholder`
  `placeholder="One item per line..."`
- **client/src/components/mastery/MentalModelsLibrary.tsx:182** - `placeholder`
  `placeholder="What situation are you thinking about?"`
- **client/src/components/mastery/MentalModelsLibrary.tsx:193** - `placeholder`
  `placeholder="Apply the model's key question..."`
- **client/src/components/mastery/MentalModelsLibrary.tsx:204** - `placeholder`
  `placeholder="What did you learn from applying this model?"`
- **client/src/components/mastery/SkillForge.tsx:194** - `placeholder`
  `placeholder="What specific aspect are you working on?"`
- **client/src/components/mastery/SkillForge.tsx:285** - `placeholder`
  `placeholder="e.g., Public Speaking, Piano, Programming"`
- **client/src/components/metacognition/MetaCognitionStudio.tsx:138** - `placeholder`
  `placeholder="What situation or belief are you examining? (optional)"`
- **client/src/components/metacognition/MetaCognitionStudio.tsx:156** - `placeholder`
  `placeholder="Your reflection..."`
- **client/src/components/metacognition/MetaCognitionStudio.tsx:188** - `placeholder`
  `placeholder="I believe that..."`
- **client/src/components/metacognition/MetaCognitionStudio.tsx:199** - `placeholder`
  `placeholder="What supports this belief?"`
- **client/src/components/metacognition/MetaCognitionStudio.tsx:210** - `placeholder`
  `placeholder="What might contradict this belief?"`
- **client/src/components/metacognition/MetaCognitionStudio.tsx:259** - `placeholder`
  `placeholder="What situation or experience do you want to explore?"`
- **client/src/components/metacognition/MetaCognitionStudio.tsx:303** - `placeholder`
  `placeholder="Your reflection at this level..."`
- **client/src/components/metacognition/MetacognitionDashboard.tsx:136** - `placeholder`
  `placeholder="Any context for this state?"`
- **client/src/components/metacognition/MetacognitionDashboard.tsx:264** - `placeholder`
  `placeholder="Morning, after exercise, quiet environment, etc."`
- **client/src/components/mindscape/MindscapeNavigator.tsx:204** - `placeholder`
  `placeholder="Notes (optional)"`
- **client/src/components/mindscape/MindscapeNavigator.tsx:264** - `placeholder`
  `placeholder="Context (optional)"`
- **client/src/components/moral/MoralReasoningLab.tsx:151** - `placeholder`
  `placeholder="Work through your reasoning here..."`
- **client/src/components/narrative/NarrativeIdentityStudio.tsx:82** - `placeholder`
  `placeholder="Chapter title (e.g., 'The College Years')"`
- **client/src/components/narrative/NarrativeIdentityStudio.tsx:90** - `placeholder`
  `placeholder="Timeframe (e.g., '2015-2019')"`
- **client/src/components/narrative/NarrativeIdentityStudio.tsx:98** - `placeholder`
  `placeholder="What happened in this chapter? What was the arc?"`
- **client/src/components/paradox/ParadoxCartographer.tsx:153** - `placeholder`
  `placeholder="What do you notice at this position?"`
- **client/src/components/paradox/ParadoxCartographer.tsx:185** - `placeholder`
  `placeholder="What emerges when you hold both poles?"`
- **client/src/components/paradox/ParadoxCartographer.tsx:215** - `placeholder`
  `placeholder="What synthesis emerges from this paradox?"`
- **client/src/components/patterns/InsightPatternLab.tsx:192** - `placeholder`
  `placeholder="What do you notice about these patterns?"`
- **client/src/components/semantic/SemanticMapping.tsx:124** - `placeholder`
  `placeholder="The word..."`
- **client/src/components/semantic/SemanticMapping.tsx:131** - `placeholder`
  `placeholder="What does it mean to you?"`
- **client/src/components/semantic/SemanticMapping.tsx:263** - `placeholder`
  `placeholder="What semantic territory do you want to map?"`
- **client/src/components/share/ReflectionCard.jsx:56** - `placeholder`
  `placeholder="Write your reflection here..."`
- **client/src/components/stance/PhilosophicalStanceMapper.tsx:132** - `placeholder`
  `placeholder="Why do you hold this position? What informs your view?"`
- **client/src/components/state/StateTracker.tsx:150** - `placeholder`
  `placeholder="Context, observations..."`
- **client/src/components/synthesis/SynthesisCollider.tsx:125** - `placeholder`
  `placeholder="Give it a name..."`
- **client/src/components/synthesis/SynthesisCollider.tsx:132** - `placeholder`
  `placeholder={ARTIFACT_TYPES.find(t => t.type === artifactType)?.placeholder}`
- **client/src/components/synthesis/SynthesisCollider.tsx:213** - `placeholder`
  `placeholder="What emerges when you combine these through this lens?"`
- **client/src/components/synthesis/SynthesisCollider.tsx:268** - `placeholder`
  `placeholder="What do you want to synthesize toward?"`
- **client/src/components/systems/SystemsResonance.tsx:124** - `placeholder`
  `placeholder="Element name..."`
- **client/src/components/systems/SystemsResonance.tsx:290** - `placeholder`
  `placeholder="What system do you want to explore?"`
- **client/src/components/temporal/TemporalReflection.tsx:131** - `placeholder`
  `placeholder="A relationship, a fear, a goal, a pattern..."`
- **client/src/components/temporal/TemporalReflection.tsx:203** - `placeholder`
  `placeholder="Write your reflection..."`
- **client/src/components/thought/ThoughtExperimentsLab.tsx:116** - `placeholder`
  `placeholder="Your thoughts..."`
- **client/src/components/thought/ThoughtExperimentsLab.tsx:148** - `placeholder`
  `placeholder="Looking back at your responses, what patterns or insights emerge?"`
- **client/src/components/ui/Input.tsx:10** - `placeholder`
  `className={`flex h-10 w-full rounded-xl border-2 border-[var(--glp-border)] bg-[var(--glp-surface)] `
- **client/src/components/ui/textarea.tsx:12** - `placeholder`
  `"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset`
- **client/src/components/weave/KnowledgeWeaveMap.tsx:107** - `placeholder`
  `placeholder="Concept title..."`
- **client/src/components/weave/KnowledgeWeaveMap.tsx:127** - `placeholder`
  `placeholder="Brief summary..."`
- **client/src/components/weave/KnowledgeWeaveMap.tsx:263** - `placeholder`
  `placeholder="What area of knowledge do you want to map?"`
- **client/src/config/leadMagnets.ts:51** - `placeholder`
  `placeholder: 'Your email',`
- **client/src/config/leadMagnets.ts:60** - `placeholder`
  `placeholder: 'Email address',`
- **client/src/copy/journal.ts:16** - `placeholder`
  `placeholder: "Start typing…",`
- **client/src/features/community/Community.tsx:92** - `placeholder`
  `placeholder="If you'd like to share a reflection, write here. Your response will be anonymous."`
- **client/src/features/community/DiscussionPage.jsx:277** - `placeholder`
  `placeholder="Share your experience or wisdom to help others on their journey..."`
- **client/src/features/community/SharedReflectionsPage.jsx:185** - `placeholder`
  `placeholder="Search questions..."`
- **client/src/features/community/SharedReflectionsPage.jsx:212** - `placeholder`
  `placeholder="What would you like to ask? Remember to be kind and specific..."`
- **client/src/features/daily/DailyFlow.tsx:181** - `placeholder`
  `placeholder="Write here if it helps..."`
- **client/src/features/daily/DailyFlow.tsx:182** - `placeholder`
  `className="w-full p-4 rounded-lg border border-[var(--glp-ink)]/10 bg-[var(--glp-paper)]/50 text-[va`
- **client/src/features/journal/JournalPage.jsx:82** - `placeholder`
  `placeholder="Write gently. You can start with one sentence."`
- **client/src/features/mirror/JournalMirror.tsx:126** - `placeholder`
  `placeholder='Example: "I want to feel calmer and trust myself again…"'`
- **client/src/features/mirror/JournalMirror.tsx:127** - `placeholder`
  `className="min-h-[140px] w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-whi`
- **client/src/lib/synthesis/synthesisCollider.ts:43** - `placeholder`
  `export const ARTIFACT_TYPES: { type: ColliderArtifact["sourceType"]; label: string; placeholder: str`
- **client/src/lib/synthesis/synthesisCollider.ts:44** - `placeholder`
  `{ type: "quote", label: "Quote", placeholder: "A passage that moved you..." },`
- **client/src/lib/synthesis/synthesisCollider.ts:45** - `placeholder`
  `{ type: "experience", label: "Experience", placeholder: "Something you lived through..." },`
- **client/src/lib/synthesis/synthesisCollider.ts:46** - `placeholder`
  `{ type: "concept", label: "Concept", placeholder: "An idea or framework..." },`
- **client/src/lib/synthesis/synthesisCollider.ts:47** - `placeholder`
  `{ type: "question", label: "Question", placeholder: "A question that haunts you..." },`
- **client/src/lib/synthesis/synthesisCollider.ts:48** - `placeholder`
  `{ type: "image", label: "Image", placeholder: "Describe a visual memory or symbol..." },`
- **client/src/lib/synthesis/synthesisCollider.ts:49** - `placeholder`
  `{ type: "pattern", label: "Pattern", placeholder: "A recurring theme you've noticed..." }`
- **client/src/pages/AIChatPage.jsx:207** - `placeholder`
  `placeholder="Type your message..."`
- **client/src/pages/Admin.jsx:429** - `placeholder`
  `placeholder="Search users..."`
- **client/src/pages/BlogEditor.jsx:168** - `placeholder`
  `placeholder="Enter your post title..."`
- **client/src/pages/BlogEditor.jsx:169** - `placeholder`
  `className="w-full text-3xl font-bold text-[var(--glp-sage-deep)] bg-transparent border-none focus:ou`
- **client/src/pages/BlogEditor.jsx:178** - `placeholder`
  `placeholder="Write your story..."`
- **client/src/pages/BlogEditor.jsx:180** - `placeholder`
  `className="w-full text-base text-[var(--glp-ink)]/90 bg-transparent border-none focus:outline-none p`
- **client/src/pages/BlogEditor.jsx:194** - `placeholder`
  `placeholder="https://example.com/image.jpg"`
- **client/src/pages/BlogEditor.jsx:208** - `placeholder`
  `placeholder="wellness, self-care, mindfulness"`
- **client/src/pages/BlogEditor.jsx:222** - `placeholder`
  `placeholder="A brief summary of your post (auto-generated if left empty)..."`
- **client/src/pages/BlogIndex.jsx:125** - `placeholder`
  `placeholder="Search articles..."`
- **client/src/pages/BlogPost.jsx:55** - `placeholder`
  `placeholder="Write a reply..."`
- **client/src/pages/BlogPost.jsx:106** - `placeholder`
  `placeholder="Share your thoughts..."`
- **client/src/pages/BoundariesPage.jsx:248** - `placeholder`
  `placeholder="e.g., When someone asks me to work late..."`
- **client/src/pages/BoundariesPage.jsx:261** - `placeholder`
  `placeholder="What you might say..."`
- **client/src/pages/BoundariesPage.jsx:275** - `placeholder`
  `placeholder="A gentler way to say the same thing..."`
- **client/src/pages/ChallengeDay.jsx:102** - `placeholder`
  `placeholder="Write your reflection here... (only you see this)"`
- **client/src/pages/CognitiveArchitecturePage.tsx:222** - `placeholder`
  `placeholder="Search models, tags, or concepts..."`
- **client/src/pages/CognitiveArchitecturePage.tsx:223** - `placeholder`
  `className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placehold`
- **client/src/pages/CoherenceLadderPage.jsx:310** - `placeholder`
  `placeholder="Any notes or context? (you can skip this)"`
- **client/src/pages/CollaborativeLabPage.tsx:353** - `placeholder`
  `placeholder="Share what you've learned, what you're questioning, or wisdom for fellow travelers..."`
- **client/src/pages/CollaborativeLabPage.tsx:354** - `placeholder`
  `className="w-full h-32 px-4 py-3 rounded-xl border border-sage-200 bg-white text-teal-700 placeholde`
- **client/src/pages/CollaborativeLabPage.tsx:416** - `placeholder`
  `placeholder="Take your time with this prompt. There's no rush, no right answer..."`
- **client/src/pages/CollaborativeLabPage.tsx:417** - `placeholder`
  `className="w-full h-40 px-4 py-3 rounded-xl border border-sage-200 bg-white text-teal-700 placeholde`
- **client/src/pages/ContentAdminDashboard.jsx:223** - `placeholder`
  `placeholder="Post title or hook"`
- **client/src/pages/ContentAdminDashboard.jsx:234** - `placeholder`
  `placeholder="Write your social media post content..."`
- **client/src/pages/ContentAdminDashboard.jsx:399** - `placeholder`
  `placeholder="0.00"`
- **client/src/pages/ContentAdminDashboard.jsx:414** - `placeholder`
  `placeholder="Product title"`
- **client/src/pages/ContentAdminDashboard.jsx:425** - `placeholder`
  `placeholder="Describe your product..."`
- **client/src/pages/ContentIndexPage.jsx:208** - `placeholder`
  `placeholder="Search all content..."`
- **client/src/pages/ContentStudioPage.tsx:254** - `placeholder`
  `placeholder="Give your content a title..."`
- **client/src/pages/ContentStudioPage.tsx:265** - `placeholder`
  `placeholder="Paste or type your content here... This will be transformed into multiple platform-spec`
- **client/src/pages/DailyRitualPage.tsx:376** - `placeholder`
  `placeholder="Write whatever comes up... no one will judge."`
- **client/src/pages/DailyWisdomOraclePage.tsx:281** - `placeholder`
  `placeholder="What does this wisdom mean to you today? How might you apply it?"`
- **client/src/pages/DailyWisdomOraclePage.tsx:282** - `placeholder`
  `className="w-full h-24 p-4 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text`
- **client/src/pages/DesignSystem.jsx:341** - `placeholder`
  `placeholder="Enter your email..."`
- **client/src/pages/ForgotPassword.jsx:145** - `placeholder`
  `placeholder="you@example.com"`
- **client/src/pages/GlossaryPage.jsx:103** - `placeholder`
  `placeholder="Search terms..."`
- **client/src/pages/GuidedJournalingPage.tsx:321** - `placeholder`
  `placeholder="Take your time. Write what comes naturally..."`
- **client/src/pages/GuidedJournalingPage.tsx:322** - `placeholder`
  `className="w-full h-48 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/InsightCardsPage.tsx:200** - `placeholder`
  `placeholder="Search insights or tags..."`
- **client/src/pages/InsightCardsPage.tsx:203** - `placeholder`
  `className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-sage-200 text-teal-700 placeho`
- **client/src/pages/InsightCardsPage.tsx:259** - `placeholder`
  `placeholder="Write your insight, quote, or wisdom..."`
- **client/src/pages/InsightCardsPage.tsx:260** - `placeholder`
  `className="w-full h-32 px-4 py-3 rounded-lg bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/InsightCardsPage.tsx:268** - `placeholder`
  `placeholder="Source (optional)"`
- **client/src/pages/InsightCardsPage.tsx:269** - `placeholder`
  `className="px-4 py-2.5 rounded-lg bg-white border border-sage-200 text-teal-700 placeholder:text-sag`
- **client/src/pages/InsightCardsPage.tsx:276** - `placeholder`
  `placeholder="Tags (comma separated)"`
- **client/src/pages/InsightCardsPage.tsx:277** - `placeholder`
  `className="px-4 py-2.5 rounded-lg bg-white border border-sage-200 text-teal-700 placeholder:text-sag`
- **client/src/pages/JournalPage.jsx:289** - `placeholder`
  `placeholder="Give your entry a title..."`
- **client/src/pages/JournalPage.jsx:302** - `placeholder`
  `placeholder="Write your thoughts..."`
- **client/src/pages/KnowledgeSynthesisPage.tsx:268** - `placeholder`
  `placeholder="Search concepts..."`
- **client/src/pages/KnowledgeSynthesisPage.tsx:269** - `placeholder`
  `className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placehold`
- **client/src/pages/KnowledgeSynthesisPage.tsx:282** - `placeholder`
  `placeholder="Concept name"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:283** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:tex`
- **client/src/pages/KnowledgeSynthesisPage.tsx:289** - `placeholder`
  `placeholder="Your understanding of this concept..."`
- **client/src/pages/KnowledgeSynthesisPage.tsx:290** - `placeholder`
  `className="w-full h-24 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/KnowledgeSynthesisPage.tsx:306** - `placeholder`
  `placeholder="Sources (one per line)"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:307** - `placeholder`
  `className="w-full h-16 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/KnowledgeSynthesisPage.tsx:370** - `placeholder`
  `placeholder="What did you learn about?"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:371** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:tex`
- **client/src/pages/KnowledgeSynthesisPage.tsx:377** - `placeholder`
  `placeholder="Key takeaways (one per line)"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:378** - `placeholder`
  `className="w-full h-20 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/KnowledgeSynthesisPage.tsx:384** - `placeholder`
  `placeholder="Questions that arose (one per line)"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:385** - `placeholder`
  `className="w-full h-16 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/KnowledgeSynthesisPage.tsx:391** - `placeholder`
  `placeholder="How might you apply this? (one per line)"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:392** - `placeholder`
  `className="w-full h-16 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/KnowledgeSynthesisPage.tsx:457** - `placeholder`
  `placeholder="Source (book, article, conversation...)"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:458** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:tex`
- **client/src/pages/KnowledgeSynthesisPage.tsx:464** - `placeholder`
  `placeholder="The core insight in your own words..."`
- **client/src/pages/KnowledgeSynthesisPage.tsx:465** - `placeholder`
  `className="w-full h-24 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/KnowledgeSynthesisPage.tsx:471** - `placeholder`
  `placeholder="What are the implications? (one per line)"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:472** - `placeholder`
  `className="w-full h-16 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholde`
- **client/src/pages/KnowledgeSynthesisPage.tsx:478** - `placeholder`
  `placeholder="Related concepts (comma-separated)"`
- **client/src/pages/KnowledgeSynthesisPage.tsx:479** - `placeholder`
  `className="w-full px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:tex`
- **client/src/pages/Login.jsx:94** - `placeholder`
  `placeholder="you@example.com"`
- **client/src/pages/Login.jsx:113** - `placeholder`
  `placeholder="••••••••"`
- **client/src/pages/MetaLearningPage.tsx:197** - `placeholder`
  `placeholder="What did you learn?"`
- **client/src/pages/MetaLearningPage.tsx:198** - `placeholder`
  `className="w-full p-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage`
- **client/src/pages/MetaLearningPage.tsx:252** - `placeholder`
  `placeholder="Key insights, difficulties, connections..."`
- **client/src/pages/MetaLearningPage.tsx:253** - `placeholder`
  `className="w-full h-20 p-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text`
- **client/src/pages/MirrorPage.tsx:148** - `placeholder`
  `placeholder="What's on your mind? Write at least 10 characters..."`
- **client/src/pages/MirrorPage.tsx:149** - `placeholder`
  `className="min-h-[150px] bg-white border-sage-200 text-teal-700 placeholder:text-sage-400 resize-non`
- **client/src/pages/MoodPage.jsx:282** - `placeholder`
  `placeholder="Any thoughts you'd like to add..."`
- **client/src/pages/MovementSnacksPage.jsx:279** - `placeholder`
  `placeholder="How do you feel? (you can skip this)"`
- **client/src/pages/PhilosophicalInquiryPage.tsx:208** - `placeholder`
  `placeholder="Enter a topic, belief, or question to examine..."`
- **client/src/pages/PhilosophicalInquiryPage.tsx:209** - `placeholder`
  `className="w-full p-4 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage`
- **client/src/pages/PhilosophicalInquiryPage.tsx:257** - `placeholder`
  `placeholder="Reflect and respond..."`
- **client/src/pages/PhilosophicalInquiryPage.tsx:258** - `placeholder`
  `className="w-full h-24 p-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text`
- **client/src/pages/Publishing.jsx:285** - `placeholder`
  `placeholder="Enter draft title..."`
- **client/src/pages/QAPage.jsx:194** - `placeholder`
  `placeholder="Search questions..."`
- **client/src/pages/Register.jsx:148** - `placeholder`
  `placeholder="Your name"`
- **client/src/pages/Register.jsx:173** - `placeholder`
  `placeholder="you@example.com"`
- **client/src/pages/Register.jsx:198** - `placeholder`
  `placeholder="At least 6 characters"`
- **client/src/pages/Register.jsx:223** - `placeholder`
  `placeholder="Confirm your password"`
- **client/src/pages/ResetPassword.jsx:195** - `placeholder`
  `placeholder="Min 6 characters"`
- **client/src/pages/ResetPassword.jsx:231** - `placeholder`
  `placeholder="Confirm your password"`
- **client/src/pages/SocialHub.jsx:67** - `Coming soon`
  `Coming soon: Connect Canva exports and post generator integration.`
- **client/src/pages/StudyVaultPage.jsx:408** - `placeholder`
  `placeholder="Search topics..."`
- **client/src/pages/SystemsThinkingPage.tsx:195** - `placeholder`
  `placeholder="Name your system (e.g., 'Team Productivity')"`
- **client/src/pages/SystemsThinkingPage.tsx:196** - `placeholder`
  `className="w-full p-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage`
- **client/src/pages/SystemsThinkingPage.tsx:208** - `placeholder`
  `placeholder="Add an element..."`
- **client/src/pages/SystemsThinkingPage.tsx:209** - `placeholder`
  `className="flex-1 p-2 rounded-lg bg-white border border-sage-200 text-teal-700 placeholder:text-sage`
- **client/src/pages/ValuesFinderPage.jsx:229** - `placeholder`
  `placeholder="Type a value that resonates with you..."`
- **client/src/pages/ValuesFinderPage.jsx:242** - `placeholder`
  `placeholder="Why do these values matter to you? What do they mean in your life?"`
- **client/src/pages/WellnessGlossaryPage.jsx:422** - `placeholder`
  `placeholder="Search terms..."`
- **client/src/pages/WireframeTemplates.jsx:465** - `placeholder`
  `placeholder="Your email address"`
- **client/src/pages/WireframeTemplates.jsx:986** - `placeholder`
  `placeholder="Search articles, topics, or practices..."`
- **client/src/pages/WireframeTemplates.jsx:1227** - `placeholder`
  `placeholder="you@example.com"`
- **client/src/pages/WireframeTemplates.jsx:1243** - `placeholder`
  `placeholder="••••••••"`
- **client/src/pages/WireframeTemplates.jsx:1417** - `placeholder`
  `placeholder="Your email"`
- **client/src/pages/WireframeTemplates.jsx:1501** - `placeholder`
  `placeholder="Search articles..."`
- **client/src/pages/WisdomPracticesPage.tsx:286** - `placeholder`
  `placeholder="Sit with this question. What arises?"`
- **client/src/pages/WisdomPracticesPage.tsx:287** - `placeholder`
  `className="w-full h-40 px-4 py-3 rounded-xl border border-sage-200 bg-white text-teal-700 placeholde`
- **client/src/pages/WisdomPracticesPage.tsx:330** - `placeholder`
  `placeholder={`I'm grateful for...`}`
- **client/src/pages/WisdomPracticesPage.tsx:331** - `placeholder`
  `className="w-full px-3 py-2 rounded-lg border border-sage-200 bg-white text-teal-700 placeholder:tex`
- **client/src/pages/WisdomPracticesPage.tsx:339** - `placeholder`
  `placeholder="What do these have in common? What pattern of blessing emerges?"`
- **client/src/pages/WisdomPracticesPage.tsx:340** - `placeholder`
  `className="w-full h-20 px-3 py-2 rounded-lg border border-sage-200 bg-white text-teal-700 placeholde`
- **client/src/pages/WisdomPracticesPage.tsx:397** - `placeholder`
  `placeholder="Any insights or reflections from your practice?"`
- **client/src/pages/WisdomPracticesPage.tsx:398** - `placeholder`
  `className="w-full h-24 px-3 py-2 rounded-lg border border-sage-200 bg-white text-teal-700 placeholde`
- **client/src/pages/WisdomSynthesisPage.tsx:263** - `placeholder`
  `placeholder="Write freely... What's on your mind? What did you learn today? What pattern are you not`
- **client/src/pages/WisdomSynthesisPage.tsx:264** - `placeholder`
  `className="w-full h-40 p-4 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text`
- **client/src/pages/account/Profile.tsx:117** - `placeholder`
  `placeholder="Your city (optional)"`
- **client/src/pages/account/Profile.tsx:185** - `placeholder`
  `placeholder="Tell us a bit about yourself and your wellness journey..."`
- **client/src/pages/account/Settings.tsx:69** - `placeholder`
  `placeholder="Your name"`
- **client/src/pages/account/Settings.tsx:79** - `placeholder`
  `placeholder="you@example.com"`
- **client/src/pages/admin/SocialCalendar.jsx:388** - `placeholder`
  `placeholder="e.g., Self-Compassion Monday"`
- **client/src/pages/admin/SocialGenerator.jsx:366** - `placeholder`
  `placeholder="e.g., Your nervous system isn't broken..."`
- **client/src/pages/admin/SocialGenerator.jsx:401** - `placeholder`
  `placeholder="Write your main content here. Use trauma-informed language..."`
- **client/src/pages/admin/SocialGenerator.jsx:419** - `placeholder`
  `placeholder="e.g., Save this for later..."`
- **client/src/pages/admin/SocialGenerator.jsx:433** - `placeholder`
  `placeholder="#mentalhealth #healing #wellness"`
- **client/src/pages/admin/SocialLibrary.jsx:137** - `placeholder`
  `placeholder="e.g., Gentle Invitation"`
- **client/src/pages/admin/SocialLibrary.jsx:163** - `placeholder`
  `placeholder="Template structure with [placeholders]..."`
- **client/src/pages/admin/SocialLibrary.jsx:176** - `placeholder`
  `placeholder="e.g., Calm, non-clinical, consent-based language"`
- **client/src/pages/ai/ChatConversation.tsx:184** - `placeholder`
  `placeholder="Share what's on your mind..."`
- **client/src/pages/auth/ForgotPassword.tsx:61** - `placeholder`
  `placeholder="you@example.com"`
- **client/src/pages/auth/Login.tsx:71** - `placeholder`
  `placeholder="you@example.com"`
- **client/src/pages/auth/Login.tsx:88** - `placeholder`
  `placeholder="Enter your password"`
- **client/src/pages/auth/SignUp.tsx:88** - `placeholder`
  `placeholder="How should we call you?"`
- **client/src/pages/auth/SignUp.tsx:105** - `placeholder`
  `placeholder="you@example.com"`
- **client/src/pages/auth/SignUp.tsx:122** - `placeholder`
  `placeholder="Create a secure password"`
- **client/src/pages/auth/SignUp.tsx:139** - `placeholder`
  `placeholder="Confirm your password"`
- **client/src/pages/dashboard/Journal.tsx:88** - `placeholder`
  `placeholder="Search your entries..."`
- **client/src/pages/dashboard/MoodTracker.tsx:155** - `placeholder`
  `placeholder="What's on your mind? Any context you'd like to add..."`
- **client/src/pages/tools/ReframePage.jsx:150** - `placeholder`
  `placeholder="e.g., &quot;I'm failing at everything&quot; or &quot;I'll never get better&quot;"`
- **client/src/pages/tools/ReframePage.jsx:151** - `placeholder`
  `className="w-full p-4 rounded-xl border bg-background dark:bg-[hsl(var(--gray-800))] border-[hsl(var`
- **server/routes/figma.mjs:5** - `Placeholder`
  `// Placeholder route (keeps the platform stable even if Figma is not configured yet)`
- **server/routes/figma.mjs:10** - `placeholder`
  `status: "placeholder",`

## Empty Components

- **client/src/RequireAuth.jsx** - 1 instance(s)
- **client/src/api/fetchWithAuth.js** - 1 instance(s)
- **client/src/components/AccessibilityAudit.jsx** - 1 instance(s)
- **client/src/components/ContentStudio.jsx** - 1 instance(s)
- **client/src/components/ObjectUploader.jsx** - 1 instance(s)
- **client/src/components/PageTemplate.jsx** - 1 instance(s)
- **client/src/components/PlanGate.jsx** - 1 instance(s)
- **client/src/components/RouteGuard.jsx** - 1 instance(s)
- **client/src/components/SEO.tsx** - 1 instance(s)
- **client/src/components/SacredGeometryBg.jsx** - 1 instance(s)
- **client/src/components/SocialLinks.jsx** - 1 instance(s)
- **client/src/components/analytics/WritingStats.tsx** - 1 instance(s)
- **client/src/content/readingLevels.js** - 1 instance(s)
- **client/src/content/routes.js** - 2 instance(s)
- **client/src/context/AuthContext.jsx** - 6 instance(s)
- **client/src/hooks/use-upload.ts** - 1 instance(s)
- **client/src/hooks/useAuth.js** - 1 instance(s)
- **client/src/lib/performance.ts** - 1 instance(s)
- **client/src/lib/queryClient.js** - 1 instance(s)
- **client/src/pages/generated/home.jsx** - 1 instance(s)
- **client/src/pages/generated/welcome.jsx** - 1 instance(s)
- **server/replit_integrations/object_storage/objectAcl.ts** - 1 instance(s)
- **server/replit_integrations/object_storage/objectStorage.ts** - 1 instance(s)
- **server/routes/mirror.mjs** - 1 instance(s)
- **server/routes/stripeWebhook.mjs** - 1 instance(s)

## Wellness Pages Missing BenefitsBlock

- client/src/pages/AIChatPage.jsx
- client/src/pages/Admin.jsx
- client/src/pages/Analytics.jsx
- client/src/pages/AtlasDashboard.tsx
- client/src/pages/Blog.jsx
- client/src/pages/BlogEditor.jsx
- client/src/pages/BlogIndex.jsx
- client/src/pages/CRMPage.jsx
- client/src/pages/CanvaLanding.jsx
- client/src/pages/ChallengeDay.jsx
- client/src/pages/CommunityPage.tsx
- client/src/pages/ContentIndexPage.jsx
- client/src/pages/ContentStudioPage.tsx
- client/src/pages/ControlDashboard.jsx
- client/src/pages/CrisisResources.jsx
- client/src/pages/Dashboard.jsx
- client/src/pages/DesignDashboard.jsx
- client/src/pages/DesignSystem.jsx
- client/src/pages/Disclaimer.tsx
- client/src/pages/EliteToolsDashboard.tsx
- client/src/pages/ExamplesPage.jsx
- client/src/pages/FAQPage.jsx
- client/src/pages/GlossaryPage.jsx
- client/src/pages/HealingJourneysPage.jsx
- client/src/pages/HealingLandingPage.jsx
- client/src/pages/HealingLibraryPage.jsx
- client/src/pages/HealthPage.jsx
- client/src/pages/Home.jsx
- client/src/pages/HowToGuidesPage.jsx
- client/src/pages/Legal.tsx
- client/src/pages/Login.jsx
- client/src/pages/MirrorPage.tsx
- client/src/pages/NewsPage.jsx
- client/src/pages/NotFound.jsx
- client/src/pages/Onboarding.tsx
- client/src/pages/Premium.jsx
- client/src/pages/Pricing.jsx
- client/src/pages/Privacy.tsx
- client/src/pages/ProfessionalResourcesPage.jsx
- client/src/pages/Profile.jsx
- client/src/pages/ProgressDashboardPage.tsx
- client/src/pages/Publishing.jsx
- client/src/pages/QAPage.jsx
- client/src/pages/Register.jsx
- client/src/pages/ResearchEvidencePage.jsx
- client/src/pages/ResourcesPage.jsx
- client/src/pages/SafetyPage.jsx
- client/src/pages/Settings.jsx
- client/src/pages/StudyVaultPage.jsx
- client/src/pages/SupportPage.tsx
- client/src/pages/Terms.tsx
- client/src/pages/Upgrade.jsx
- client/src/pages/Wellness.jsx
- client/src/pages/WellnessGlossaryPage.jsx
- client/src/pages/WellnessHubPage.jsx
- client/src/pages/WireframeTemplates.jsx
- client/src/pages/account/Billing.tsx
- client/src/pages/account/Profile.tsx
- client/src/pages/account/Settings.tsx
- client/src/pages/admin/SocialAnalytics.jsx
- client/src/pages/admin/SocialDashboard.jsx
- client/src/pages/admin/SocialGenerator.jsx
- client/src/pages/ai/ChatConversation.tsx
- client/src/pages/ai/ChatCrisis.tsx
- client/src/pages/ai/ChatEmpty.tsx
- client/src/pages/auth/Login.tsx
- client/src/pages/auth/SignUp.tsx
- client/src/pages/dashboard/Insights.tsx
- client/src/pages/dashboard/Journal.tsx
- client/src/pages/dashboard/MoodTracker.tsx
- client/src/pages/dashboard/Overview.jsx
- client/src/pages/generated/advanced.jsx
- client/src/pages/generated/body-wellness.jsx
- client/src/pages/generated/cognitive-architecture.jsx
- client/src/pages/generated/cognitive-tools.jsx
- client/src/pages/generated/crisis.jsx
- client/src/pages/generated/daily-wisdom.jsx
- client/src/pages/generated/emotional-intelligence.jsx
- client/src/pages/generated/guided-journaling.jsx
- client/src/pages/generated/healing-journeys.jsx
- client/src/pages/generated/healing-library.jsx
- client/src/pages/generated/healing-test.jsx
- client/src/pages/generated/healing.jsx
- client/src/pages/generated/insight-cards.jsx
- client/src/pages/generated/journal.jsx
- client/src/pages/generated/mastery.jsx
- client/src/pages/generated/mood.jsx
- client/src/pages/generated/resilience.jsx
- client/src/pages/generated/ritual.jsx
- client/src/pages/generated/self-care.jsx
- client/src/pages/generated/social.jsx
- client/src/pages/generated/soul-wellness.jsx
- client/src/pages/generated/systems-thinking.jsx
- client/src/pages/generated/tools.jsx
- client/src/pages/generated/wellness-creativity.jsx
- client/src/pages/generated/wellness-hub.jsx
- client/src/pages/generated/wellness-movement.jsx
- client/src/pages/generated/wellness-nature.jsx
- client/src/pages/generated/wellness-nutrition.jsx
- client/src/pages/generated/wellness-sleep.jsx
- client/src/pages/generated/wellness.jsx
- client/src/pages/generated/wisdom-practices.jsx
- client/src/pages/generated/wisdom-synthesis.jsx
- client/src/pages/generated/wisdom.jsx
- client/src/pages/landing/Landing.jsx
- client/src/pages/legal/Disclaimer.jsx
- client/src/pages/legal/Ethics.jsx
- client/src/pages/marketing/LandingCTA.tsx
- client/src/pages/marketing/LandingFeatures.tsx
- client/src/pages/marketing/LandingHero.tsx
- client/src/pages/marketing/LandingTestimonials.tsx

## Wellness Pages Missing Crisis Link

- client/src/pages/Admin.jsx
- client/src/pages/Analytics.jsx
- client/src/pages/AtlasDashboard.tsx
- client/src/pages/BlogEditor.jsx
- client/src/pages/BlogIndex.jsx
- client/src/pages/CRMPage.jsx
- client/src/pages/CommunityPage.tsx
- client/src/pages/ContentStudioPage.tsx
- client/src/pages/ControlDashboard.jsx
- client/src/pages/DesignDashboard.jsx
- client/src/pages/DesignSystem.jsx
- client/src/pages/Disclaimer.tsx
- client/src/pages/EliteToolsDashboard.tsx
- client/src/pages/ExamplesPage.jsx
- client/src/pages/HealingLandingPage.jsx
- client/src/pages/HealthPage.jsx
- client/src/pages/Legal.tsx
- client/src/pages/Login.jsx
- client/src/pages/MirrorPage.tsx
- client/src/pages/NewsPage.jsx
- client/src/pages/Onboarding.tsx
- client/src/pages/Privacy.tsx
- client/src/pages/Profile.jsx
- client/src/pages/ProgressDashboardPage.tsx
- client/src/pages/Publishing.jsx
- client/src/pages/QAPage.jsx
- client/src/pages/Register.jsx
- client/src/pages/Settings.jsx
- client/src/pages/SupportPage.tsx
- client/src/pages/Terms.tsx
- client/src/pages/WireframeTemplates.jsx
- client/src/pages/account/Billing.tsx
- client/src/pages/account/Profile.tsx
- client/src/pages/account/Settings.tsx
- client/src/pages/ai/ChatConversation.tsx
- client/src/pages/ai/ChatCrisis.tsx
- client/src/pages/auth/Login.tsx
- client/src/pages/auth/SignUp.tsx
- client/src/pages/dashboard/Insights.tsx
- client/src/pages/dashboard/Journal.tsx
- client/src/pages/dashboard/MoodTracker.tsx
- client/src/pages/dashboard/Overview.jsx
- client/src/pages/generated/advanced.jsx
- client/src/pages/generated/body-wellness.jsx
- client/src/pages/generated/cognitive-architecture.jsx
- client/src/pages/generated/cognitive-tools.jsx
- client/src/pages/generated/daily-wisdom.jsx
- client/src/pages/generated/emotional-intelligence.jsx
- client/src/pages/generated/guided-journaling.jsx
- client/src/pages/generated/healing-journeys.jsx
- client/src/pages/generated/healing-library.jsx
- client/src/pages/generated/healing-test.jsx
- client/src/pages/generated/healing.jsx
- client/src/pages/generated/insight-cards.jsx
- client/src/pages/generated/journal.jsx
- client/src/pages/generated/mastery.jsx
- client/src/pages/generated/mood.jsx
- client/src/pages/generated/resilience.jsx
- client/src/pages/generated/ritual.jsx
- client/src/pages/generated/self-care.jsx
- client/src/pages/generated/social.jsx
- client/src/pages/generated/soul-wellness.jsx
- client/src/pages/generated/systems-thinking.jsx
- client/src/pages/generated/tools.jsx
- client/src/pages/generated/wellness-creativity.jsx
- client/src/pages/generated/wellness-hub.jsx
- client/src/pages/generated/wellness-movement.jsx
- client/src/pages/generated/wellness-nature.jsx
- client/src/pages/generated/wellness-nutrition.jsx
- client/src/pages/generated/wellness-sleep.jsx
- client/src/pages/generated/wellness.jsx
- client/src/pages/generated/wisdom-practices.jsx
- client/src/pages/generated/wisdom-synthesis.jsx
- client/src/pages/generated/wisdom.jsx
- client/src/pages/legal/Disclaimer.jsx
- client/src/pages/legal/Ethics.jsx
- client/src/pages/marketing/LandingCTA.tsx
- client/src/pages/marketing/LandingFeatures.tsx
- client/src/pages/marketing/LandingHero.tsx
- client/src/pages/marketing/LandingTestimonials.tsx

## Wellness Pages Missing Consent Language

Required: "Pause or stop anytime", "opt-out", or "only do what feels safe"

- client/src/pages/AIChatPage.jsx
- client/src/pages/AdaptiveCompanionPage.tsx
- client/src/pages/Admin.jsx
- client/src/pages/AdvancedToolsPage.tsx
- client/src/pages/AffirmationsPage.jsx
- client/src/pages/Analytics.jsx
- client/src/pages/AtlasDashboard.tsx
- client/src/pages/BehaviorChangePage.jsx
- client/src/pages/Blog.jsx
- client/src/pages/BlogEditor.jsx
- client/src/pages/BlogIndex.jsx
- client/src/pages/BodyWellnessPage.jsx
- client/src/pages/BoundariesPage.jsx
- client/src/pages/BreathingExercisesPage.jsx
- client/src/pages/CRMPage.jsx
- client/src/pages/CalmingScenesPage.jsx
- client/src/pages/CanvaLanding.jsx
- client/src/pages/Challenge.jsx
- client/src/pages/ChallengeDay.jsx
- client/src/pages/CognitiveArchitecturePage.tsx
- client/src/pages/CognitiveToolsPage.jsx
- client/src/pages/CoherenceLadderPage.jsx
- client/src/pages/CollaborativeLabPage.tsx
- client/src/pages/CommunityPage.tsx
- client/src/pages/ContentIndexPage.jsx
- client/src/pages/ContentStudioPage.tsx
- client/src/pages/ControlDashboard.jsx
- client/src/pages/CrisisResources.jsx
- client/src/pages/DailyRitualPage.tsx
- client/src/pages/DailyRoutinesPage.jsx
- client/src/pages/DailyWisdomOraclePage.tsx
- client/src/pages/Dashboard.jsx
- client/src/pages/DesignDashboard.jsx
- client/src/pages/DesignSystem.jsx
- client/src/pages/Disclaimer.tsx
- client/src/pages/EliteToolsDashboard.tsx
- client/src/pages/EmotionalIntelligencePage.jsx
- client/src/pages/ExamplesPage.jsx
- client/src/pages/FAQPage.jsx
- client/src/pages/GlossaryPage.jsx
- client/src/pages/GroundingTechniquesPage.jsx
- client/src/pages/GrowthAnalyticsPage.tsx
- client/src/pages/GuidedJournalingPage.tsx
- client/src/pages/HealingJourneysPage.jsx
- client/src/pages/HealingLandingPage.jsx
- client/src/pages/HealingLibraryPage.jsx
- client/src/pages/HealthPage.jsx
- client/src/pages/HowToGuidesPage.jsx
- client/src/pages/InsightCardsPage.tsx
- client/src/pages/JournalPage.jsx
- client/src/pages/KnowledgeSynthesisPage.tsx
- client/src/pages/Legal.tsx
- client/src/pages/Login.jsx
- client/src/pages/MasteryToolsPage.tsx
- client/src/pages/MetaLearningPage.tsx
- client/src/pages/MirrorPage.tsx
- client/src/pages/MoodPage.jsx
- client/src/pages/MovementSnacksPage.jsx
- client/src/pages/NervousSystemFloodingPage.jsx
- client/src/pages/NewsPage.jsx
- client/src/pages/NotFound.jsx
- client/src/pages/Onboarding.tsx
- client/src/pages/PermacultureWellnessPage.jsx
- client/src/pages/PhilosophicalInquiryPage.tsx
- client/src/pages/Premium.jsx
- client/src/pages/Pricing.jsx
- client/src/pages/Privacy.tsx
- client/src/pages/ProfessionalResourcesPage.jsx
- client/src/pages/Profile.jsx
- client/src/pages/ProgressDashboardPage.tsx
- client/src/pages/Publishing.jsx
- client/src/pages/QAPage.jsx
- client/src/pages/Register.jsx
- client/src/pages/ResearchEvidencePage.jsx
- client/src/pages/ResilienceMetricsPage.tsx
- client/src/pages/ResourcesPage.jsx
- client/src/pages/SafetyPage.jsx
- client/src/pages/SelfWorthReflectionPage.jsx
- client/src/pages/Settings.jsx
- client/src/pages/StatePage.jsx
- client/src/pages/StrategyMapsPage.tsx
- client/src/pages/StudyVaultPage.jsx
- client/src/pages/SupportPage.tsx
- client/src/pages/SystemsThinkingPage.tsx
- client/src/pages/Terms.tsx
- client/src/pages/Upgrade.jsx
- client/src/pages/ValuesFinderPage.jsx
- client/src/pages/Wellness.jsx
- client/src/pages/WellnessGlossaryPage.jsx
- client/src/pages/WellnessHubPage.jsx
- client/src/pages/WireframeTemplates.jsx
- client/src/pages/WisdomPracticesPage.tsx
- client/src/pages/WisdomSynthesisPage.tsx
- client/src/pages/WisdomToolsPage.tsx
- client/src/pages/account/Billing.tsx
- client/src/pages/account/Profile.tsx
- client/src/pages/account/Settings.tsx
- client/src/pages/admin/SocialAnalytics.jsx
- client/src/pages/admin/SocialDashboard.jsx
- client/src/pages/admin/SocialGenerator.jsx
- client/src/pages/ai/ChatConversation.tsx
- client/src/pages/ai/ChatCrisis.tsx
- client/src/pages/ai/ChatEmpty.tsx
- client/src/pages/auth/Login.tsx
- client/src/pages/auth/SignUp.tsx
- client/src/pages/dashboard/Insights.tsx
- client/src/pages/dashboard/Journal.tsx
- client/src/pages/dashboard/MoodTracker.tsx
- client/src/pages/dashboard/Overview.jsx
- client/src/pages/generated/advanced.jsx
- client/src/pages/generated/body-wellness.jsx
- client/src/pages/generated/cognitive-architecture.jsx
- client/src/pages/generated/cognitive-tools.jsx
- client/src/pages/generated/crisis.jsx
- client/src/pages/generated/daily-wisdom.jsx
- client/src/pages/generated/emotional-intelligence.jsx
- client/src/pages/generated/guided-journaling.jsx
- client/src/pages/generated/healing-journeys.jsx
- client/src/pages/generated/healing-library.jsx
- client/src/pages/generated/healing-test.jsx
- client/src/pages/generated/healing.jsx
- client/src/pages/generated/insight-cards.jsx
- client/src/pages/generated/journal.jsx
- client/src/pages/generated/mastery.jsx
- client/src/pages/generated/mood.jsx
- client/src/pages/generated/resilience.jsx
- client/src/pages/generated/ritual.jsx
- client/src/pages/generated/self-care.jsx
- client/src/pages/generated/social.jsx
- client/src/pages/generated/soul-wellness.jsx
- client/src/pages/generated/systems-thinking.jsx
- client/src/pages/generated/tools.jsx
- client/src/pages/generated/wellness-creativity.jsx
- client/src/pages/generated/wellness-hub.jsx
- client/src/pages/generated/wellness-movement.jsx
- client/src/pages/generated/wellness-nature.jsx
- client/src/pages/generated/wellness-nutrition.jsx
- client/src/pages/generated/wellness-sleep.jsx
- client/src/pages/generated/wellness.jsx
- client/src/pages/generated/wisdom-practices.jsx
- client/src/pages/generated/wisdom-synthesis.jsx
- client/src/pages/generated/wisdom.jsx
- client/src/pages/landing/Landing.jsx
- client/src/pages/legal/Disclaimer.jsx
- client/src/pages/legal/Ethics.jsx
- client/src/pages/marketing/LandingCTA.tsx
- client/src/pages/marketing/LandingFeatures.tsx
- client/src/pages/marketing/LandingHero.tsx
- client/src/pages/marketing/LandingTestimonials.tsx

## Wellness Pages Missing SafetyFooter

- client/src/pages/AdaptiveCompanionPage.tsx
- client/src/pages/Admin.jsx
- client/src/pages/AdvancedToolsPage.tsx
- client/src/pages/Analytics.jsx
- client/src/pages/AtlasDashboard.tsx
- client/src/pages/Blog.jsx
- client/src/pages/BlogEditor.jsx
- client/src/pages/BlogIndex.jsx
- client/src/pages/CRMPage.jsx
- client/src/pages/CognitiveArchitecturePage.tsx
- client/src/pages/CollaborativeLabPage.tsx
- client/src/pages/CommunityPage.tsx
- client/src/pages/ContentIndexPage.jsx
- client/src/pages/ContentStudioPage.tsx
- client/src/pages/ControlDashboard.jsx
- client/src/pages/DailyRitualPage.tsx
- client/src/pages/DailyWisdomOraclePage.tsx
- client/src/pages/DesignDashboard.jsx
- client/src/pages/DesignSystem.jsx
- client/src/pages/Disclaimer.tsx
- client/src/pages/EliteToolsDashboard.tsx
- client/src/pages/ExamplesPage.jsx
- client/src/pages/GrowthAnalyticsPage.tsx
- client/src/pages/GuidedJournalingPage.tsx
- client/src/pages/HealingLandingPage.jsx
- client/src/pages/HealthPage.jsx
- client/src/pages/Home.jsx
- client/src/pages/InsightCardsPage.tsx
- client/src/pages/KnowledgeSynthesisPage.tsx
- client/src/pages/Legal.tsx
- client/src/pages/Login.jsx
- client/src/pages/MasteryToolsPage.tsx
- client/src/pages/MetaLearningPage.tsx
- client/src/pages/MirrorPage.tsx
- client/src/pages/NewsPage.jsx
- client/src/pages/NotFound.jsx
- client/src/pages/Onboarding.tsx
- client/src/pages/PhilosophicalInquiryPage.tsx
- client/src/pages/Privacy.tsx
- client/src/pages/Profile.jsx
- client/src/pages/ProgressDashboardPage.tsx
- client/src/pages/Publishing.jsx
- client/src/pages/QAPage.jsx
- client/src/pages/Register.jsx
- client/src/pages/ResilienceMetricsPage.tsx
- client/src/pages/Settings.jsx
- client/src/pages/StrategyMapsPage.tsx
- client/src/pages/SupportPage.tsx
- client/src/pages/SystemsThinkingPage.tsx
- client/src/pages/Terms.tsx
- client/src/pages/WireframeTemplates.jsx
- client/src/pages/WisdomPracticesPage.tsx
- client/src/pages/WisdomSynthesisPage.tsx
- client/src/pages/WisdomToolsPage.tsx
- client/src/pages/account/Billing.tsx
- client/src/pages/account/Profile.tsx
- client/src/pages/account/Settings.tsx
- client/src/pages/ai/ChatConversation.tsx
- client/src/pages/ai/ChatCrisis.tsx
- client/src/pages/ai/ChatEmpty.tsx
- client/src/pages/auth/Login.tsx
- client/src/pages/auth/SignUp.tsx
- client/src/pages/dashboard/Insights.tsx
- client/src/pages/dashboard/Journal.tsx
- client/src/pages/dashboard/MoodTracker.tsx
- client/src/pages/dashboard/Overview.jsx
- client/src/pages/generated/advanced.jsx
- client/src/pages/generated/body-wellness.jsx
- client/src/pages/generated/cognitive-architecture.jsx
- client/src/pages/generated/cognitive-tools.jsx
- client/src/pages/generated/crisis.jsx
- client/src/pages/generated/daily-wisdom.jsx
- client/src/pages/generated/emotional-intelligence.jsx
- client/src/pages/generated/guided-journaling.jsx
- client/src/pages/generated/healing-journeys.jsx
- client/src/pages/generated/healing-library.jsx
- client/src/pages/generated/healing-test.jsx
- client/src/pages/generated/healing.jsx
- client/src/pages/generated/insight-cards.jsx
- client/src/pages/generated/journal.jsx
- client/src/pages/generated/mastery.jsx
- client/src/pages/generated/mood.jsx
- client/src/pages/generated/resilience.jsx
- client/src/pages/generated/ritual.jsx
- client/src/pages/generated/self-care.jsx
- client/src/pages/generated/social.jsx
- client/src/pages/generated/soul-wellness.jsx
- client/src/pages/generated/systems-thinking.jsx
- client/src/pages/generated/tools.jsx
- client/src/pages/generated/wellness-creativity.jsx
- client/src/pages/generated/wellness-hub.jsx
- client/src/pages/generated/wellness-movement.jsx
- client/src/pages/generated/wellness-nature.jsx
- client/src/pages/generated/wellness-nutrition.jsx
- client/src/pages/generated/wellness-sleep.jsx
- client/src/pages/generated/wellness.jsx
- client/src/pages/generated/wisdom-practices.jsx
- client/src/pages/generated/wisdom-synthesis.jsx
- client/src/pages/generated/wisdom.jsx
- client/src/pages/legal/Disclaimer.jsx
- client/src/pages/legal/Ethics.jsx
- client/src/pages/marketing/LandingCTA.tsx
- client/src/pages/marketing/LandingFeatures.tsx
- client/src/pages/marketing/LandingHero.tsx
- client/src/pages/marketing/LandingTestimonials.tsx

## Wellness Pages Missing ClarityCard

ClarityCard provides What/Who/When/Why/How/Where explanation for each tool.

- client/src/pages/AIChatPage.jsx
- client/src/pages/AdaptiveCompanionPage.tsx
- client/src/pages/Admin.jsx
- client/src/pages/AdvancedToolsPage.tsx
- client/src/pages/AlignmentPath.jsx
- client/src/pages/Analytics.jsx
- client/src/pages/AtlasDashboard.tsx
- client/src/pages/Blog.jsx
- client/src/pages/BlogEditor.jsx
- client/src/pages/BlogIndex.jsx
- client/src/pages/CRMPage.jsx
- client/src/pages/CanvaLanding.jsx
- client/src/pages/Challenge.jsx
- client/src/pages/ChallengeDay.jsx
- client/src/pages/CollaborativeLabPage.tsx
- client/src/pages/CommunityPage.tsx
- client/src/pages/ContentIndexPage.jsx
- client/src/pages/ContentStudioPage.tsx
- client/src/pages/ControlDashboard.jsx
- client/src/pages/CrisisResources.jsx
- client/src/pages/Dashboard.jsx
- client/src/pages/DesignDashboard.jsx
- client/src/pages/DesignSystem.jsx
- client/src/pages/Disclaimer.tsx
- client/src/pages/EliteToolsDashboard.tsx
- client/src/pages/ExamplesPage.jsx
- client/src/pages/FAQPage.jsx
- client/src/pages/GlossaryPage.jsx
- client/src/pages/GrowthAnalyticsPage.tsx
- client/src/pages/GuidedJournalingPage.tsx
- client/src/pages/HealingJourneysPage.jsx
- client/src/pages/HealingLandingPage.jsx
- client/src/pages/HealingLibraryPage.jsx
- client/src/pages/HealthPage.jsx
- client/src/pages/Home.jsx
- client/src/pages/HowToGuidesPage.jsx
- client/src/pages/InsightCardsPage.tsx
- client/src/pages/KnowledgeSynthesisPage.tsx
- client/src/pages/Legal.tsx
- client/src/pages/Login.jsx
- client/src/pages/MasteryToolsPage.tsx
- client/src/pages/MetaLearningPage.tsx
- client/src/pages/MirrorPage.tsx
- client/src/pages/NervousSystemFloodingPage.jsx
- client/src/pages/NewsPage.jsx
- client/src/pages/NotFound.jsx
- client/src/pages/Onboarding.tsx
- client/src/pages/PerceptionRefinementPage.jsx
- client/src/pages/PermacultureWellnessPage.jsx
- client/src/pages/PhilosophicalInquiryPage.tsx
- client/src/pages/Premium.jsx
- client/src/pages/Pricing.jsx
- client/src/pages/Privacy.tsx
- client/src/pages/ProfessionalResourcesPage.jsx
- client/src/pages/Profile.jsx
- client/src/pages/ProgressDashboardPage.tsx
- client/src/pages/Publishing.jsx
- client/src/pages/QAPage.jsx
- client/src/pages/Register.jsx
- client/src/pages/ResearchEvidencePage.jsx
- client/src/pages/ResilienceMetricsPage.tsx
- client/src/pages/ResourcesPage.jsx
- client/src/pages/SafetyPage.jsx
- client/src/pages/SelfWorthReflectionPage.jsx
- client/src/pages/Settings.jsx
- client/src/pages/SoulWellnessPage.jsx
- client/src/pages/StatePage.jsx
- client/src/pages/StrategyMapsPage.tsx
- client/src/pages/StressResponseGuidePage.jsx
- client/src/pages/StudyVaultPage.jsx
- client/src/pages/SupportPage.tsx
- client/src/pages/SystemsThinkingPage.tsx
- client/src/pages/Terms.tsx
- client/src/pages/Upgrade.jsx
- client/src/pages/Wellness.jsx
- client/src/pages/WellnessGlossaryPage.jsx
- client/src/pages/WellnessHubPage.jsx
- client/src/pages/WireframeTemplates.jsx
- client/src/pages/WisdomPracticesPage.tsx
- client/src/pages/WisdomSynthesisPage.tsx
- client/src/pages/WisdomToolsPage.tsx
- client/src/pages/account/Billing.tsx
- client/src/pages/account/Profile.tsx
- client/src/pages/account/Settings.tsx
- client/src/pages/admin/SocialAnalytics.jsx
- client/src/pages/admin/SocialDashboard.jsx
- client/src/pages/admin/SocialGenerator.jsx
- client/src/pages/ai/ChatConversation.tsx
- client/src/pages/ai/ChatCrisis.tsx
- client/src/pages/ai/ChatEmpty.tsx
- client/src/pages/auth/Login.tsx
- client/src/pages/auth/SignUp.tsx
- client/src/pages/dashboard/Insights.tsx
- client/src/pages/dashboard/Journal.tsx
- client/src/pages/dashboard/MoodTracker.tsx
- client/src/pages/dashboard/Overview.jsx
- client/src/pages/generated/advanced.jsx
- client/src/pages/generated/body-wellness.jsx
- client/src/pages/generated/cognitive-architecture.jsx
- client/src/pages/generated/cognitive-tools.jsx
- client/src/pages/generated/crisis.jsx
- client/src/pages/generated/daily-wisdom.jsx
- client/src/pages/generated/emotional-intelligence.jsx
- client/src/pages/generated/guided-journaling.jsx
- client/src/pages/generated/healing-journeys.jsx
- client/src/pages/generated/healing-library.jsx
- client/src/pages/generated/healing-test.jsx
- client/src/pages/generated/healing.jsx
- client/src/pages/generated/insight-cards.jsx
- client/src/pages/generated/journal.jsx
- client/src/pages/generated/mastery.jsx
- client/src/pages/generated/mood.jsx
- client/src/pages/generated/resilience.jsx
- client/src/pages/generated/ritual.jsx
- client/src/pages/generated/self-care.jsx
- client/src/pages/generated/social.jsx
- client/src/pages/generated/soul-wellness.jsx
- client/src/pages/generated/systems-thinking.jsx
- client/src/pages/generated/tools.jsx
- client/src/pages/generated/wellness-creativity.jsx
- client/src/pages/generated/wellness-hub.jsx
- client/src/pages/generated/wellness-movement.jsx
- client/src/pages/generated/wellness-nature.jsx
- client/src/pages/generated/wellness-nutrition.jsx
- client/src/pages/generated/wellness-sleep.jsx
- client/src/pages/generated/wellness.jsx
- client/src/pages/generated/wisdom-practices.jsx
- client/src/pages/generated/wisdom-synthesis.jsx
- client/src/pages/generated/wisdom.jsx
- client/src/pages/landing/Landing.jsx
- client/src/pages/legal/Disclaimer.jsx
- client/src/pages/legal/Ethics.jsx
- client/src/pages/marketing/LandingCTA.tsx
- client/src/pages/marketing/LandingFeatures.tsx
- client/src/pages/marketing/LandingHero.tsx
- client/src/pages/marketing/LandingTestimonials.tsx

## Wellness Pages Missing ExamplesAccordion

ExamplesAccordion shows Beginner/Intermediate/Advanced examples.

- client/src/pages/AIChatPage.jsx
- client/src/pages/AdaptiveCompanionPage.tsx
- client/src/pages/Admin.jsx
- client/src/pages/AdvancedToolsPage.tsx
- client/src/pages/AlignmentPath.jsx
- client/src/pages/Analytics.jsx
- client/src/pages/AtlasDashboard.tsx
- client/src/pages/Blog.jsx
- client/src/pages/BlogEditor.jsx
- client/src/pages/BlogIndex.jsx
- client/src/pages/CRMPage.jsx
- client/src/pages/CanvaLanding.jsx
- client/src/pages/Challenge.jsx
- client/src/pages/ChallengeDay.jsx
- client/src/pages/CollaborativeLabPage.tsx
- client/src/pages/CommunityPage.tsx
- client/src/pages/ContentIndexPage.jsx
- client/src/pages/ContentStudioPage.tsx
- client/src/pages/ControlDashboard.jsx
- client/src/pages/CrisisResources.jsx
- client/src/pages/Dashboard.jsx
- client/src/pages/DesignDashboard.jsx
- client/src/pages/DesignSystem.jsx
- client/src/pages/Disclaimer.tsx
- client/src/pages/EliteToolsDashboard.tsx
- client/src/pages/ExamplesPage.jsx
- client/src/pages/FAQPage.jsx
- client/src/pages/GlossaryPage.jsx
- client/src/pages/GrowthAnalyticsPage.tsx
- client/src/pages/GuidedJournalingPage.tsx
- client/src/pages/HealingJourneysPage.jsx
- client/src/pages/HealingLandingPage.jsx
- client/src/pages/HealingLibraryPage.jsx
- client/src/pages/HealthPage.jsx
- client/src/pages/Home.jsx
- client/src/pages/HowToGuidesPage.jsx
- client/src/pages/InsightCardsPage.tsx
- client/src/pages/KnowledgeSynthesisPage.tsx
- client/src/pages/Legal.tsx
- client/src/pages/Login.jsx
- client/src/pages/MasteryToolsPage.tsx
- client/src/pages/MetaLearningPage.tsx
- client/src/pages/MirrorPage.tsx
- client/src/pages/NervousSystemFloodingPage.jsx
- client/src/pages/NewsPage.jsx
- client/src/pages/NotFound.jsx
- client/src/pages/Onboarding.tsx
- client/src/pages/PerceptionRefinementPage.jsx
- client/src/pages/PermacultureWellnessPage.jsx
- client/src/pages/PhilosophicalInquiryPage.tsx
- client/src/pages/Premium.jsx
- client/src/pages/Pricing.jsx
- client/src/pages/Privacy.tsx
- client/src/pages/ProfessionalResourcesPage.jsx
- client/src/pages/Profile.jsx
- client/src/pages/ProgressDashboardPage.tsx
- client/src/pages/Publishing.jsx
- client/src/pages/QAPage.jsx
- client/src/pages/Register.jsx
- client/src/pages/ResearchEvidencePage.jsx
- client/src/pages/ResilienceMetricsPage.tsx
- client/src/pages/ResourcesPage.jsx
- client/src/pages/SafetyPage.jsx
- client/src/pages/SelfWorthReflectionPage.jsx
- client/src/pages/Settings.jsx
- client/src/pages/SoulWellnessPage.jsx
- client/src/pages/StatePage.jsx
- client/src/pages/StrategyMapsPage.tsx
- client/src/pages/StressResponseGuidePage.jsx
- client/src/pages/StudyVaultPage.jsx
- client/src/pages/SupportPage.tsx
- client/src/pages/SystemsThinkingPage.tsx
- client/src/pages/Terms.tsx
- client/src/pages/Upgrade.jsx
- client/src/pages/Wellness.jsx
- client/src/pages/WellnessGlossaryPage.jsx
- client/src/pages/WellnessHubPage.jsx
- client/src/pages/WireframeTemplates.jsx
- client/src/pages/WisdomPracticesPage.tsx
- client/src/pages/WisdomSynthesisPage.tsx
- client/src/pages/WisdomToolsPage.tsx
- client/src/pages/account/Billing.tsx
- client/src/pages/account/Profile.tsx
- client/src/pages/account/Settings.tsx
- client/src/pages/admin/SocialAnalytics.jsx
- client/src/pages/admin/SocialDashboard.jsx
- client/src/pages/admin/SocialGenerator.jsx
- client/src/pages/ai/ChatConversation.tsx
- client/src/pages/ai/ChatCrisis.tsx
- client/src/pages/ai/ChatEmpty.tsx
- client/src/pages/auth/Login.tsx
- client/src/pages/auth/SignUp.tsx
- client/src/pages/dashboard/Insights.tsx
- client/src/pages/dashboard/Journal.tsx
- client/src/pages/dashboard/MoodTracker.tsx
- client/src/pages/dashboard/Overview.jsx
- client/src/pages/generated/advanced.jsx
- client/src/pages/generated/body-wellness.jsx
- client/src/pages/generated/cognitive-architecture.jsx
- client/src/pages/generated/cognitive-tools.jsx
- client/src/pages/generated/crisis.jsx
- client/src/pages/generated/daily-wisdom.jsx
- client/src/pages/generated/emotional-intelligence.jsx
- client/src/pages/generated/guided-journaling.jsx
- client/src/pages/generated/healing-journeys.jsx
- client/src/pages/generated/healing-library.jsx
- client/src/pages/generated/healing-test.jsx
- client/src/pages/generated/healing.jsx
- client/src/pages/generated/insight-cards.jsx
- client/src/pages/generated/journal.jsx
- client/src/pages/generated/mastery.jsx
- client/src/pages/generated/mood.jsx
- client/src/pages/generated/resilience.jsx
- client/src/pages/generated/ritual.jsx
- client/src/pages/generated/self-care.jsx
- client/src/pages/generated/social.jsx
- client/src/pages/generated/soul-wellness.jsx
- client/src/pages/generated/systems-thinking.jsx
- client/src/pages/generated/tools.jsx
- client/src/pages/generated/wellness-creativity.jsx
- client/src/pages/generated/wellness-hub.jsx
- client/src/pages/generated/wellness-movement.jsx
- client/src/pages/generated/wellness-nature.jsx
- client/src/pages/generated/wellness-nutrition.jsx
- client/src/pages/generated/wellness-sleep.jsx
- client/src/pages/generated/wellness.jsx
- client/src/pages/generated/wisdom-practices.jsx
- client/src/pages/generated/wisdom-synthesis.jsx
- client/src/pages/generated/wisdom.jsx
- client/src/pages/landing/Landing.jsx
- client/src/pages/legal/Disclaimer.jsx
- client/src/pages/legal/Ethics.jsx
- client/src/pages/marketing/LandingCTA.tsx
- client/src/pages/marketing/LandingFeatures.tsx
- client/src/pages/marketing/LandingHero.tsx
- client/src/pages/marketing/LandingTestimonials.tsx

---

*This report was generated by scripts/scanIncomplete.mjs*
*Run `npm run scan:incomplete` to regenerate.*
