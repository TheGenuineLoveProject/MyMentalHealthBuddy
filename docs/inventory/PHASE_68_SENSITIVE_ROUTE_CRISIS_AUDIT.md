client/src/pages/admin/CommandCenter.module.css:438:.resourceFillDanger {
client/src/pages/admin/AdminPublishing.jsx:456:                  <span>Content safety checks run automatically before publishing. Posts with medical claims, urgency manipulation, or pathologizing language will be blocked. Sensitive topics require crisis resource links.</span>
client/src/pages/admin/SocialStudioAdmin.jsx:170:    toast({ title: "Hooks Generated", description: `${hooks.length} trauma-informed hooks ready` });
client/src/pages/admin/SocialStudioAdmin.jsx:184:      "Boundaries": `Setting boundaries isn't selfish—it's self-respect in action. 🌿\n\nHealthy boundaries look like:\n• Saying "no" without guilt\n• Protecting your energy\n• Honoring your needs\n\nYour peace matters. Your time matters. YOU matter.\n\n${brandSettings.includeDisclaimer ? "✨ Educational content. Seek professional guidance for personal situations." : ""}`,
client/src/pages/admin/SocialStudioAdmin.jsx:192:    toast({ title: "Content Generated", description: "AI-generated trauma-informed content ready for review" });
client/src/pages/admin/SocialStudioAdmin.jsx:331:        description="Create and manage trauma-informed social media content with brand safety guardrails."
client/src/pages/admin/SocialStudioAdmin.jsx:349:                Create, schedule, and manage trauma-informed social content with brand safety.
client/src/pages/admin/SocialStudioAdmin.jsx:486:                    <CardDescription>Write trauma-informed content for your audience</CardDescription>
client/src/pages/admin/SocialStudioAdmin.jsx:866:                <CardDescription>Generate trauma-informed hooks that engage your audience</CardDescription>
client/src/pages/admin/SocialStudioAdmin.jsx:873:                      <strong>Brand Safety:</strong> All hooks are checked for trauma-informed language. 
client/src/pages/admin/AdminSocial.jsx:42:  "diagnos", "treatment", "cure", "therapy session", "clinical",
client/src/pages/admin/AdminSocial.jsx:446:    safetyNote: post?.safetyNote || "Educational content only. Not therapy or clinical advice.",
client/src/pages/admin/AdminSocial.jsx:447:    crisisLinkRequired: post?.crisisLinkRequired || 0,
client/src/pages/admin/AdminSocial.jsx:517:        crisisLinkRequired: form.crisisLinkRequired ? 1 : 0,
client/src/pages/admin/AdminSocial.jsx:638:            {["/tools", "/mood", "/blog", "/newsletter", "/pricing", "/crisis"].map(url => (
client/src/pages/admin/AdminSocial.jsx:671:              <input type="checkbox" checked={!!form.crisisLinkRequired} onChange={e => updateField("crisisLinkRequired", e.target.checked ? 1 : 0)} className="rounded" data-testid="checkbox-crisis" />
client/src/pages/admin/NarrativeOpsConsole.jsx:36:  "trauma-awareness", "self-love", "community", "purpose"
client/src/pages/admin/NarrativeOpsConsole.jsx:55:  { label: "Crisis", path: "/crisis" },
client/src/pages/admin/NarrativeOpsConsole.jsx:127:    originType: "standalone", safetyNote: "", crisisLinkRequired: false,
client/src/pages/admin/NarrativeOpsConsole.jsx:329:      crisisLinkRequired: post.crisisLinkRequired === 1,
client/src/pages/admin/NarrativeOpsConsole.jsx:346:      crisisLinkRequired: form.crisisLinkRequired ? 1 : 0,
client/src/pages/admin/NarrativeOpsConsole.jsx:852:              placeholder="e.g. Educational only. Not therapy."
client/src/pages/admin/NarrativeOpsConsole.jsx:920:                checked={form.crisisLinkRequired}
client/src/pages/admin/NarrativeOpsConsole.jsx:921:                onChange={(e) => setForm(f => ({ ...f, crisisLinkRequired: e.target.checked }))}
client/src/pages/admin/NarrativeOpsConsole.jsx:923:                data-testid="checkbox-crisis-link"
client/src/pages/admin/SocialGenerator.jsx:53:  "If you're in crisis, please reach out to 988 (Suicide & Crisis Lifeline) or text HOME to 741741.",
client/src/pages/admin/SocialGenerator.jsx:211:              Create trauma-informed wellness content with AI assistance
client/src/pages/admin/SocialGenerator.jsx:406:                      placeholder="Write your main content here. Use trauma-informed language..."
client/src/pages/admin/SocialGenerator.jsx:534:                    Content passes trauma-informed guidelines
client/src/pages/admin/SocialGenerator.jsx:694:                  Add crisis resources for sensitive topics
client/src/pages/admin/AdminTools.jsx.phase1.bak:12:  "ai-chat": "/chat", "therapy": "/admin/tools", "mood-tracker": "/admin/health", "journal": "/admin/health",
client/src/pages/admin/AdminTools.jsx.phase1.bak:20:  "trauma-healing": "/admin/tools", "emotional-resilience": "/admin/tools", "emotional-mastery": "/admin/tools",
client/src/pages/admin/AdminTools.jsx.phase1.bak:22:  "healing-core": "/admin/tools", "healing-intelligence": "/admin/tools", "post-trauma": "/admin/tools",
client/src/pages/admin/AdminTools.jsx.phase1.bak:67:  "therapy": "critical", "dashboard-api": "critical",
client/src/pages/admin/AdminTools.jsx.phase1.bak:79:  "trauma-healing": "high", "healing-tools": "high", "healing-intelligence": "high",
client/src/pages/admin/AdminTools.jsx.phase1.bak:92:  "healing-core": "medium", "post-trauma": "medium",
client/src/pages/admin/AdminTools.jsx.phase1.bak:293:      { id: "therapy", label: "Therapy Engine", endpoint: "/api/therapy/crisis-resources", icon: Headphones, desc: "Guided therapy sessions" },
client/src/pages/admin/AdminTools.jsx.phase1.bak:326:      { id: "trauma-healing", label: "Trauma Healing", endpoint: "/api/trauma-healing/grounding", icon: HeartHandshake, desc: "Trauma-informed protocols" },
client/src/pages/admin/AdminTools.jsx.phase1.bak:334:      { id: "post-trauma", label: "Post-Trauma Growth", endpoint: "/api/post-trauma/daily", icon: Feather, desc: "Post-traumatic growth" },
client/src/pages/admin/_adminToolsShared.js:11:  "ai-chat": "/chat", "therapy": "/admin/tools", "mood-tracker": "/admin/health", "journal": "/admin/health",
client/src/pages/admin/_adminToolsShared.js:19:  "trauma-healing": "/admin/tools", "emotional-resilience": "/admin/tools", "emotional-mastery": "/admin/tools",
client/src/pages/admin/_adminToolsShared.js:21:  "healing-core": "/admin/tools", "healing-intelligence": "/admin/tools", "post-trauma": "/admin/tools",
client/src/pages/admin/_adminToolsShared.js:66:  "therapy": "critical", "dashboard-api": "critical",
client/src/pages/admin/_adminToolsShared.js:78:  "trauma-healing": "high", "healing-tools": "high", "healing-intelligence": "high",
client/src/pages/admin/_adminToolsShared.js:91:  "healing-core": "medium", "post-trauma": "medium",
client/src/pages/admin/_adminToolsShared.js:292:      { id: "therapy", label: "Therapy Engine", endpoint: "/api/therapy/crisis-resources", icon: Headphones, desc: "Guided therapy sessions" },
client/src/pages/admin/_adminToolsShared.js:325:      { id: "trauma-healing", label: "Trauma Healing", endpoint: "/api/trauma-healing/grounding", icon: HeartHandshake, desc: "Trauma-informed protocols" },
client/src/pages/admin/_adminToolsShared.js:333:      { id: "post-trauma", label: "Post-Trauma Growth", endpoint: "/api/post-trauma/daily", icon: Feather, desc: "Post-traumatic growth" },
client/src/pages/admin/AdminTools.jsx.phase2.bak:12:  "ai-chat": "/chat", "therapy": "/admin/tools", "mood-tracker": "/admin/health", "journal": "/admin/health",
client/src/pages/admin/AdminTools.jsx.phase2.bak:20:  "trauma-healing": "/admin/tools", "emotional-resilience": "/admin/tools", "emotional-mastery": "/admin/tools",
client/src/pages/admin/AdminTools.jsx.phase2.bak:22:  "healing-core": "/admin/tools", "healing-intelligence": "/admin/tools", "post-trauma": "/admin/tools",
client/src/pages/admin/AdminTools.jsx.phase2.bak:67:  "therapy": "critical", "dashboard-api": "critical",
client/src/pages/admin/AdminTools.jsx.phase2.bak:79:  "trauma-healing": "high", "healing-tools": "high", "healing-intelligence": "high",
client/src/pages/admin/AdminTools.jsx.phase2.bak:92:  "healing-core": "medium", "post-trauma": "medium",
client/src/pages/admin/AdminTools.jsx.phase2.bak:293:      { id: "therapy", label: "Therapy Engine", endpoint: "/api/therapy/crisis-resources", icon: Headphones, desc: "Guided therapy sessions" },
client/src/pages/admin/AdminTools.jsx.phase2.bak:326:      { id: "trauma-healing", label: "Trauma Healing", endpoint: "/api/trauma-healing/grounding", icon: HeartHandshake, desc: "Trauma-informed protocols" },
client/src/pages/admin/AdminTools.jsx.phase2.bak:334:      { id: "post-trauma", label: "Post-Trauma Growth", endpoint: "/api/post-trauma/daily", icon: Feather, desc: "Post-traumatic growth" },
client/src/pages/AboutApproachPage.jsx:57:              Every interaction is designed with trauma awareness. We prioritize safety, trustworthiness, 
client/src/pages/AboutApproachPage.jsx:89:              mental health treatment. If you're experiencing a mental health crisis, please seek professional help.
client/src/pages/AboutApproachPage.jsx:92:              href="/crisis"
client/src/pages/AboutApproachPage.jsx:94:              data-testid="link-crisis-resources"
client/src/pages/AlignmentPath.jsx:272:          disclaimer="Educational self-reflection, not therapy or treatment"
client/src/pages/ComingSoon.jsx:91:                href="/crisis"
client/src/pages/ComingSoon.jsx:93:                data-testid="link-coming-soon-crisis"
client/src/pages/ContentIndexPage.jsx:27:  { name: "Crisis Resources", path: "/crisis", description: "Immediate support and hotlines", category: "Support", icon: Shield, protected: true },
client/src/pages/ContentIndexPage.jsx:37:  { name: "Glossary", path: "/glossary-full", description: "A-Z of wellness terms", category: "Knowledge", icon: BookOpen },
client/src/pages/ContentIndexPage.jsx:38:  { name: "Grounding Techniques", path: "/grounding", description: "Body-based anxiety relief", category: "Wellness", icon: Leaf },
client/src/pages/ContentIndexPage.jsx:70:  { name: "Stress Response Guide", path: "/stress-response", description: "Nervous system science", category: "Wellness", icon: Activity },
client/src/pages/ContentIndexPage.jsx:79:  { name: "Wellness Glossary", path: "/glossary", description: "Key wellness terms", category: "Knowledge", icon: BookOpen },
client/src/pages/ContentIndexPage.jsx:213:          <Link href="/crisis" className="p-4 rounded-xl text-center transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: 'white', border: '1px solid var(--glp-sage-15)' }} data-testid="quick-link-crisis">
client/src/pages/DesignSystem.jsx:1030:                  Specialized components designed for trauma-informed mental wellness experiences.
client/src/pages/DesignSystem.jsx:1377:                  Implementation checklist for building trauma-informed, accessible wellness features.
client/src/pages/PracticeLibrary.jsx:96:      description: "A calming 4-count breathing pattern for stress relief",
client/src/pages/TwelveStepsPage.tsx:174:                not addiction recovery. Each step builds on the last, creating a foundation for living with 
client/src/pages/TwelveStepsPage.tsx:178:                <strong>Note:</strong> This is educational content for self-reflection. It is not therapy, 
client/src/pages/ValuesPage.jsx:38:      description: "Every feature is designed with awareness of trauma's impact and commitment to healing.",
client/src/pages/ValuesPage.jsx:119:            If you're in crisis, please reach out to professional support.
client/src/pages/ValuesPage.jsx:122:            href="/crisis"
client/src/pages/ValuesPage.jsx:124:            data-testid="link-crisis"
client/src/pages/account/DeleteAccount.jsx:72:                    Visit our <a href="/crisis" className="underline font-medium">crisis resources</a> page 
client/src/pages/account/Settings.jsx:257:                <h2 className="text-heading-md text-[var(--blush-700)]">Danger Zone</h2>
client/src/pages/dashboard/ProgressDashboard.jsx:23:  const lastRouteKey = wins[0]?.routeKey || "hubs__anxiety";
client/src/pages/dashboard/Journal.jsx:360:                  Writing for just 10 minutes a day can significantly improve emotional clarity and reduce stress.
client/src/pages/hubs/HubsIndexPage.jsx:51:    href: "/hubs/anxiety",
client/src/pages/hubs/HubsIndexPage.jsx:64:    description: "Navigate loss gently",
client/src/pages/hubs/HubsIndexPage.jsx:65:    href: "/hubs/grief",
client/src/pages/hubs/HubsIndexPage.jsx:86:    href: "/hubs/stress",
client/src/pages/hubs/HubsIndexPage.jsx:93:    href: "/hubs/trauma-healing",
client/src/pages/hubs/HubsIndexPage.jsx:317:      description="Explore our collection of wellness topic hubs covering sleep, anxiety, relationships, grief, mindfulness, and more. Find tools that resonate with you."
client/src/pages/hubs/TopicHubPage.jsx:8:  return parts[1] || "anxiety";
client/src/pages/hubs/TraumaHealingHubPage.jsx:4: * Topic hub for trauma-informed healing resources
client/src/pages/hubs/TraumaHealingHubPage.jsx:47:      description="Gentle, trauma-informed educational resources for healing. Safe tools for nervous system regulation and rebuilding a sense of safety."
client/src/pages/hubs/TraumaHealingHubPage.jsx:62:            <strong>Important:</strong> These are educational tools, not therapy. If you're processing trauma, 
client/src/pages/hubs/TraumaHealingHubPage.jsx:64:            <Link href="/crisis" className="underline ml-1">Crisis resources are always available.</Link>
client/src/pages/hubs/StressHubPage.jsx:4: * Topic hub for stress management and relief resources
client/src/pages/hubs/StressHubPage.jsx:47:      description="Educational tools for managing stress and finding relief. Gentle techniques for calming your nervous system and restoring balance."
client/src/pages/hubs/StressHubPage.jsx:54:        what: "Resources for understanding and managing stress responses.",
client/src/pages/hubs/GriefHubPage.jsx:4: * Topic hub for grief support and healing resources
client/src/pages/hubs/GriefHubPage.jsx:47:      description="Gentle educational resources for navigating grief and loss. Find comfort, understanding, and tools for healing at your own pace."
client/src/pages/hubs/GriefHubPage.jsx:51:      subtitle="Gentle tools for navigating loss"
client/src/pages/hubs/GriefHubPage.jsx:54:        what: "A collection of gentle resources for those experiencing grief or loss.",
client/src/pages/hubs/GriefHubPage.jsx:55:        why: "Grief is a natural response to loss. There is no wrong way to grieve.",
client/src/pages/hubs/AnxietyHubPage.jsx:4: * Topic hub for anxiety relief and nervous system regulation resources
client/src/pages/hubs/AnxietyHubPage.jsx:30:    description: "Shift how you see stressful moments",
client/src/pages/hubs/AnxietyHubPage.jsx:47:      description="Gentle educational tools for calming anxiety and regulating your nervous system. Learn techniques for returning to a sense of safety and peace."
client/src/pages/hubs/AnxietyHubPage.jsx:54:        what: "A collection of educational tools designed to help you understand and work with anxiety.",
client/src/pages/hubs/MindfulnessHubPage.jsx:55:        why: "Being present can reduce stress and increase appreciation for life.",
client/src/pages/pathways/ProgressStreaks.jsx:106:                    Turn off if streak counting causes anxiety. Your progress is still valued.
client/src/pages/tools/EmotionWheel.jsx:49:      anxious: ["nervous", "uneasy", "panicked"],
client/src/pages/tools/EmotionWheel.jsx:53:      overwhelmed: ["stressed", "burdened", "pressured"],
client/src/pages/tools/MeditationPlayer.jsx:65:  // No text input exists on this surface → crisisDetected is always-false by
client/src/pages/tools/MeditationPlayer.jsx:69:  const crisisDetected = false;
client/src/pages/tools/MeditationPlayer.jsx:83:        crisisDetected,
client/src/pages/tools/MeditationPlayer.jsx:87:    [crisisDetected, vulnerableState],
client/src/pages/tools/MeditationPlayer.jsx:95:        crisisDetected,
client/src/pages/tools/MeditationPlayer.jsx:100:    [crisisDetected, vulnerableState, governance],
client/src/pages/tools/PHQ9Assessment.jsx:27:  if (score >= 20) return { band: "severe", message: "These responses suggest severe depression symptoms over the past two weeks." };
client/src/pages/tools/PHQ9Assessment.jsx:28:  if (score >= 15) return { band: "moderately severe", message: "These responses suggest moderately severe depression symptoms." };
client/src/pages/tools/PHQ9Assessment.jsx:29:  if (score >= 10) return { band: "moderate", message: "These responses suggest moderate depression symptoms." };
client/src/pages/tools/PHQ9Assessment.jsx:30:  if (score >= 5) return { band: "mild", message: "These responses suggest mild depression symptoms." };
client/src/pages/tools/PHQ9Assessment.jsx:31:  return { band: "minimal", message: "These responses suggest minimal depression symptoms." };
client/src/pages/tools/PHQ9Assessment.jsx:61:      <SEO title="PHQ-9 Mood Check-in | MyMentalHealthBuddy" description="Free 9-question screening to notice depression symptoms over the past two weeks. Educational only." />
client/src/pages/tools/PHQ9Assessment.jsx:67:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/tools/PHQ9Assessment.jsx:98:              Please reach out to crisis support right now — you do not have to face this alone.
client/src/pages/tools/PHQ9Assessment.jsx:101:              href="/crisis"
client/src/pages/tools/PHQ9Assessment.jsx:103:              data-testid="link-phq9-crisis"
client/src/pages/tools/PHQ9Assessment.jsx:105:              Open crisis support →
client/src/pages/tools/index.jsx:11:    slug: "anxiety-assessment",
client/src/pages/tools/index.jsx:14:    description: "Clinically inspired 7-question anxiety check-in. Takes about 2 minutes.",
client/src/pages/tools/index.jsx:17:    keywordTarget: "anxiety test online",
client/src/pages/tools/index.jsx:20:    testid: "tool-anxiety-assessment",
client/src/pages/tools/index.jsx:23:    slug: "depression-screening",
client/src/pages/tools/index.jsx:29:    keywordTarget: "depression test",
client/src/pages/tools/index.jsx:32:    testid: "tool-depression-screening",
client/src/pages/tools/index.jsx:62:    description: "Science-backed breath pacing for anxiety, sleep, and nervous-system regulation.",
client/src/pages/tools/index.jsx:65:    keywordTarget: "breathing exercise for anxiety",
client/src/pages/tools/index.jsx:143:        description="Eight free, self-paced wellness tools — anxiety and depression check-ins, distortion checker, manipulation detector, breath pacer, boundary builder, sleep self-check, and nervous-system check. Educational only, no signup."
client/src/pages/tools/index.jsx:157:            href="/crisis"
client/src/pages/tools/index.jsx:159:            data-testid="link-crisis-header"
client/src/pages/tools/index.jsx:198:                <Link href="/crisis" className="underline" data-testid="link-crisis-inline">
client/src/pages/tools/index.jsx:199:                  crisis support
client/src/pages/tools/SleepQualityCalculator.jsx:107:    "Notice which of your habits help most so you can return to them after a stressful week.",
client/src/pages/tools/SleepQualityCalculator.jsx:154:            href="/crisis"
client/src/pages/tools/SleepQualityCalculator.jsx:156:            data-testid="link-crisis-header"
client/src/pages/tools/SleepQualityCalculator.jsx:270:          <Link href="/crisis" className="underline" data-testid="link-crisis-inline">
client/src/pages/tools/SleepQualityCalculator.jsx:271:            crisis support
client/src/pages/tools/SleepQualityCalculator.jsx:273:          if you are in distress.
client/src/pages/tools/NervousSystemCheck.jsx:51:      "You may be in a blended state — the body wants to act and to disappear at once. This is common after long stress. The work is patient, gentle, layered.",
client/src/pages/tools/NervousSystemCheck.jsx:165:            href="/crisis"
client/src/pages/tools/NervousSystemCheck.jsx:167:            data-testid="link-crisis-header"
client/src/pages/tools/NervousSystemCheck.jsx:286:          <Link href="/crisis" className="underline" data-testid="link-crisis-inline">
client/src/pages/tools/NervousSystemCheck.jsx:287:            crisis support
client/src/pages/tools/ManipulationDetector.jsx:52:    id: "guilt-tripping",
client/src/pages/tools/ManipulationDetector.jsx:149:            href="/crisis"
client/src/pages/tools/ManipulationDetector.jsx:151:            data-testid="link-crisis-header"
client/src/pages/tools/ManipulationDetector.jsx:255:          danger, please use{" "}
client/src/pages/tools/ManipulationDetector.jsx:256:          <Link href="/crisis" className="underline" data-testid="link-crisis-inline">
client/src/pages/tools/ManipulationDetector.jsx:257:            crisis support
client/src/pages/tools/CognitiveDistortionChecker.jsx:88:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/tools/BoundaryBuilderTool.jsx:90:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/tools/BoundaryBuilderTool.jsx:174:          on safety, relationship, and timing. If your safety is at risk, please reach out to crisis support or a
client/src/pages/tools/BreathPacer.jsx:10:    description: "Inhale 4, hold 7, exhale 8. Strong vagal tone — useful before sleep or after stress.",
client/src/pages/tools/BreathPacer.jsx:103:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/tools/BreathPacer.jsx:189:          panic-related condition, consult your clinician before starting any breathwork practice.
client/src/pages/tools/GAD7Assessment.jsx:25:  if (score >= 15) return { band: "severe", message: "These responses suggest severe anxiety symptoms over the past two weeks.", urgent: true };
client/src/pages/tools/GAD7Assessment.jsx:26:  if (score >= 10) return { band: "moderate", message: "These responses suggest moderate anxiety symptoms.", urgent: false };
client/src/pages/tools/GAD7Assessment.jsx:27:  if (score >= 5) return { band: "mild", message: "These responses suggest mild anxiety symptoms.", urgent: false };
client/src/pages/tools/GAD7Assessment.jsx:28:  return { band: "minimal", message: "These responses suggest minimal anxiety symptoms.", urgent: false };
client/src/pages/tools/GAD7Assessment.jsx:52:      <SEO title="GAD-7 Anxiety Check-in | MyMentalHealthBuddy" description="Free 7-question screening to notice anxiety symptoms over the past two weeks. Educational only." />
client/src/pages/tools/GAD7Assessment.jsx:58:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/tools/GAD7Assessment.jsx:154:                  href="/crisis"
client/src/pages/tools/GAD7Assessment.jsx:156:                  data-testid="link-gad7-crisis"
client/src/pages/tools/GAD7Assessment.jsx:158:                  Open crisis support →
client/src/pages/tools/UrgeSurf.jsx:177:          <p>If you're experiencing crisis-level urges, please reach out for support.</p>
client/src/pages/tools/GriefLetter.jsx:14:const STORAGE_KEY = "glp_grief_letter_draft";
client/src/pages/tools/GriefLetter.jsx:21:  "How I'm learning to carry this grief..."
client/src/pages/tools/GriefLetter.jsx:42:    mutationFn: (data) => apiRequest("POST", "/api/wellness-tools/grief-letter", data),
client/src/pages/tools/GriefLetter.jsx:76:        description="A gentle space to write unsent letters as part of your grief process."
client/src/pages/tools/AweMicrodose.jsx:166:          Research shows that experiencing awe can reduce stress and increase feelings of connection.
client/src/pages/tools/BreathingTool.jsx:12: * Safety: every phase exposes /crisis in the nav.
client/src/pages/tools/BreathingTool.jsx:190:            href="/crisis"
client/src/pages/tools/BreathingTool.jsx:192:            data-testid="link-crisis"
client/src/pages/tools/BreathingTool.jsx:431:            crisis, please visit{" "}
client/src/pages/tools/BreathingTool.jsx:432:            <Link href="/crisis" className="font-semibold text-rose-700 underline">our crisis page</Link>{" "}
client/src/pages/LearnDetail.jsx:149:          data-testid="card-crisis-routing"
client/src/pages/LearnDetail.jsx:158:                href="/crisis"
client/src/pages/LearnDetail.jsx:160:                data-testid="link-crisis-resources"
client/src/pages/LearnDetail.jsx:162:                See crisis resources
client/src/pages/LumiV6Preview.jsx:29:const STATES = ["calm", "encouraged", "celebrate", "sad", "anxious", "crisis"];
client/src/pages/LumiV6Preview.jsx:74:            href="/crisis"
client/src/pages/LumiV6Preview.jsx:76:            data-testid="link-crisis"
client/src/pages/LumiV6Preview.jsx:219:          <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800">animated=false (crisis-safe)</h3>
client/src/pages/LumiV6Preview.jsx:540:        <code>animated</code> so crisis surfaces stay still, and disabled by
client/src/pages/LumiV6Preview.jsx:626:        when <code>animated=false</code> (crisis) and when{" "}
client/src/pages/Disclaimer.tsx:68:                  If you are in immediate danger, call your local emergency number right now.
client/src/pages/Disclaimer.tsx:70:                  crisis hotline in your country.
client/src/pages/AvatarLab.jsx:4: * 4 eye types × 10 mouths × 6 arms × 5 legs + crisis override.
client/src/pages/AvatarLab.jsx:53:  const [crisis, setCrisis] = useState(false);
client/src/pages/AvatarLab.jsx:110:                crisis={crisis}
client/src/pages/AvatarLab.jsx:111:                gaze={crisis ? null : gaze}
client/src/pages/AvatarLab.jsx:125:                    checked={crisis}
client/src/pages/AvatarLab.jsx:127:                    data-testid="checkbox-crisis-override"
client/src/pages/Privacy.jsx:180:                If you are in crisis, please visit{" "}
client/src/pages/Privacy.jsx:181:                <Link href="/crisis" className="underline font-medium" data-testid="link-crisis">
client/src/pages/Privacy.jsx:182:                  /crisis
client/src/pages/Blog.jsx:15:// trauma-informed wellness article never needs <script>, <iframe>, <object>,
client/src/pages/Blog.jsx:42:      <p>Everything we offer is grounded in trauma-informed principles. This means:</p>
client/src/pages/Blog.jsx:84:      <p>Mindfulness helps us observe our negative thoughts and emotions without suppressing or exaggerating them. We can acknowledge "I notice I'm feeling anxious" rather than being consumed by anxiety.</p>
client/src/pages/Blog.jsx:98:        <li><strong>Self-indulgence:</strong> Self-compassion actually leads to healthier behaviors because it reduces shame.</li>
client/src/pages/Blog.jsx:121:        <li>Reduce anxiety and depression symptoms</li>
client/src/pages/Blog.jsx:165:    excerpt: "Learn how your nervous system responds to stress and discover simple practices to help yourself feel safer and more grounded in daily life.",
client/src/pages/Blog.jsx:176:      <p>When you perceive danger, your body mobilizes energy: heart racing, muscles tensing, breath quickening. This prepares you to fight or flee. While protective, chronic activation leads to anxiety and exhaustion.</p>
client/src/pages/Blog.jsx:183:        <li>Difficulty calming down after stress</li>
client/src/pages/Blog.jsx:234:        <li>Feeling guilty for prioritizing yourself</li>
client/src/pages/Blog.jsx:235:        <li>Others' disappointment or anger</li>
client/src/pages/Blog.jsx:271:      <p>Perfectionism isn't about being excellent or having high standards. It's an anxiety-driven belief that if we're perfect enough, we can avoid pain and criticism. Researcher Brené Brown calls it "the 20-ton shield" we carry to protect ourselves.</p>
client/src/pages/Blog.jsx:289:        <li>Higher rates of anxiety and depression</li>
client/src/pages/Blog.jsx:417:                dangerouslySetInnerHTML={{ __html: safeArticleHtml }}
client/src/pages/Blog.jsx:424:                    <strong>Disclaimer:</strong> This content is for educational purposes only and is not a substitute for professional mental health care. If you're in crisis, please contact the 988 Suicide & Crisis Lifeline or text HOME to 741741.
client/src/pages/Blog.jsx:427:                    href="/crisis" 
client/src/pages/Blog.jsx:429:                    data-testid="link-crisis"
client/src/pages/Blog.jsx:551:              If you're experiencing a crisis, please reach out to{" "}
client/src/pages/Blog.jsx:552:              <Link href="/crisis" className="text-[var(--teal-600)] hover:underline font-medium" data-testid="link-crisis-footer">
client/src/pages/Blog.jsx:553:                crisis resources
client/src/pages/Terms.tsx:71:                  The app is not therapy or medical care. It provides self-reflection tools and supportive,
client/src/pages/Terms.tsx:97:                  If we detect high-risk content, we may show crisis resources or restrict access to protect users.
client/src/pages/FAQPage.jsx:16:        q: "Is this a replacement for therapy?",
client/src/pages/FAQPage.jsx:17:        a: "No. Our platform is a supportive wellness tool, not a substitute for professional mental health care. We always encourage seeking professional help when needed and provide crisis resources for emergencies."
client/src/pages/FAQPage.jsx:25:        a: "We offer breathing exercises, grounding techniques, meditation guides, affirmations, calming scenes, journaling prompts, mood tracking, emotional intelligence tools, sleep guides, stress response education, inner child healing, and AI chat support."
client/src/pages/FAQPage.jsx:33:        q: "What is trauma and how does it affect me?",
client/src/pages/FAQPage.jsx:34:        a: "Trauma is the emotional response to distressing experiences that overwhelm your ability to cope. It affects your nervous system, creating patterns of hypervigilance, avoidance, or numbing. Research suggests that with proper support and practices, the brain's neuroplasticity may help people move forward in their healing journey."
client/src/pages/FAQPage.jsx:37:        q: "What is the difference between anxiety and normal worry?",
client/src/pages/FAQPage.jsx:38:        a: "Normal worry is temporary and proportional to a situation. Anxiety becomes concerning when it's persistent, excessive, difficult to control, and interferes with daily life. Physical symptoms like racing heart, trouble sleeping, and muscle tension often accompany anxiety disorders."
client/src/pages/FAQPage.jsx:46:        a: "Triggers are sensory cues that remind your nervous system of past threatening experiences. Your brain creates these associations for protection. When triggered, your body activates the stress response as if the past danger is happening now. Understanding your triggers helps you develop coping strategies."
client/src/pages/FAQPage.jsx:63:        a: "Journaling creates a safe space to process emotions, identify patterns, and gain clarity. Writing engages different brain regions than thinking alone, which some people find helps access deeper insights. Research suggests expressive writing may reduce stress and support emotional processing."
client/src/pages/FAQPage.jsx:67:        a: "Inner child work involves connecting with the younger parts of yourself that may carry childhood experiences. Some adult patterns stem from unmet childhood needs or early emotional experiences. By nurturing these younger parts, some people find they can address concerns at a deeper level. For significant childhood trauma, consider professional support."
client/src/pages/FAQPage.jsx:75:        a: "Grounding techniques help you reconnect with the present moment when feeling overwhelmed or dissociated. They engage your senses (5-4-3-2-1 technique), body awareness, or breath to bring you back to the here-and-now and out of stress responses."
client/src/pages/FAQPage.jsx:101:        a: "Our AI Chat provides compassionate, trauma-informed conversations to help you process thoughts and emotions. It's available 24/7 and remembers your conversation history for continuity."
client/src/pages/FAQPage.jsx:117:        q: "What should I do in a mental health crisis?",
client/src/pages/FAQPage.jsx:118:        a: "If in immediate danger, call 911. For suicidal thoughts, call the 988 Suicide & Crisis Lifeline. Text HOME to 741741 for Crisis Text Line. Reach out to a trusted person and go to a safe place. Remember: crises are temporary, and help is available."
client/src/pages/FAQPage.jsx:126:        a: "Consider professional support if you experience: persistent sadness or anxiety for over two weeks, difficulty functioning, changes in sleep or appetite, substance use to cope, thoughts of self-harm, or feeling like you can't cope. Seeking help is a sign of strength."
client/src/pages/FAQPage.jsx:189:    description: "Frequently asked questions about MyMentalHealthBuddy - mental wellness, trauma healing, wellness tools, and getting started with your healing journey.",
client/src/pages/FAQPage.jsx:236:                <Link href="/crisis" className="btn-secondary-premium" data-testid="link-crisis">
client/src/pages/NotFound.jsx:118:            You're not alone. <Link href="/crisis" className="text-[var(--primary)] hover:underline">Crisis support is always available</Link>, or <Link href="/chat" className="text-[var(--primary)] hover:underline">talk with our compassionate AI companion</Link>.
client/src/pages/ForgotPassword.jsx:147:                  no interaction (asymmetric risk: distressed users shouldn't be
client/src/pages/About.jsx:43:              This platform exists because most wellness tools are designed to maximize how long you stay, not whether you're actually helped. We built something different — tools that are useful when you need them and quiet when you don't. No streaks, no guilt-driven notifications, no engagement tricks.
client/src/pages/About.jsx:46:              If you're someone who values privacy, prefers going at your own pace, and wants tools that don't demand constant participation — you'll probably recognize what this is for. You don't need to be in crisis to use it. You don't need to commit to a program. It's here when you want to check in with yourself, and it stays out of the way when you don't.
client/src/pages/About.jsx:67:                Compassionate AI companions available 24/7, trained in trauma-informed care and supportive communication.
client/src/pages/About.jsx:93:              <strong>Important:</strong> MyMentalHealthBuddy by The Genuine Love Project is an educational wellness platform and is not a substitute for professional mental health treatment. If you're in crisis, please reach out to a qualified professional or call your local emergency services.
client/src/pages/About.jsx:96:              href="/crisis"
client/src/pages/About.jsx:99:              data-testid="link-crisis-resources"
client/src/pages/AdaptiveCompanionPage.tsx:167:          disclaimer="Educational tool finder—not clinical guidance. If you need crisis help, visit"
client/src/pages/AdaptiveCompanionPage.tsx:168:          crisisLink="/crisis"
client/src/pages/AdvancedToolsPage.tsx:147:            disclaimer="Educational support—not clinical guidance. If you need crisis help, visit"
client/src/pages/AdvancedToolsPage.tsx:148:            crisisLink="/crisis"
client/src/pages/CognitiveArchitecturePage.tsx:86:  { id: "antifragility", name: "Antifragility", category: "Systems", description: "Some things benefit from shocks and volatility. They get stronger from stress.", example: "Muscles grow stronger when stressed. Immune systems need exposure to pathogens.", application: "Ask: How can I build systems that improve from challenges rather than just survive them?", tags: ["resilience", "growth", "stress"] },
client/src/pages/CognitiveArchitecturePage.tsx:195:          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
client/src/pages/CollaborativeLabPage.tsx:59:    content: "How do we hold space for grief while still moving forward? Not bypassing it, not drowning in it, but dancing with it?",
client/src/pages/CollaborativeLabPage.tsx:243:          disclaimer="Peer insight sharing—not clinical advice. If you need crisis help, visit"
client/src/pages/CollaborativeLabPage.tsx:244:          crisisLink="/crisis"
client/src/pages/DailyWisdomOraclePage.tsx:94:  { text: "We suffer more often in imagination than in reality.", source: "Seneca", tradition: "Stoicism", theme: "anxiety" },
client/src/pages/DailyWisdomOraclePage.tsx:233:          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
client/src/pages/ExamplesPage.jsx:10:    id: "anxiety-panic",
client/src/pages/ExamplesPage.jsx:47:      { step: "Accept Wakefulness", detail: "Stop fighting it. Resistance increases anxiety about not sleeping" },
client/src/pages/ExamplesPage.jsx:58:    id: "anger-response",
client/src/pages/ExamplesPage.jsx:66:      { step: "Find the Need", detail: "Under anger is usually hurt, fear, or unmet need. What do you really need here?" },
client/src/pages/ExamplesPage.jsx:70:    relatedTools: ["/emotional-intelligence", "/stress-response"],
client/src/pages/ExamplesPage.jsx:93:    scenario: "You forgot an important deadline, said something you regret, or made an error that affected others. You're consumed with shame and self-criticism.",
client/src/pages/ExamplesPage.jsx:118:    relatedTools: ["/stress-response", "/cognitive-tools"],
client/src/pages/GrowthAnalyticsPage.tsx:218:          disclaimer="Educational insight tool—not clinical assessment. If you need crisis help, visit"
client/src/pages/GrowthAnalyticsPage.tsx:219:          crisisLink="/crisis"
client/src/pages/GuidedJournalingPage.tsx:29:    id: "anxiety",
client/src/pages/GuidedJournalingPage.tsx:36:      "If your anxiety could speak, what might it be trying to protect you from?",
client/src/pages/GuidedJournalingPage.tsx:45:    id: "grief",
client/src/pages/GuidedJournalingPage.tsx:47:    description: "A sacred space for processing grief and honoring what matters",
client/src/pages/GuidedJournalingPage.tsx:52:      "How has this loss changed the way you see the world?",
client/src/pages/GuidedJournalingPage.tsx:55:      "What does grief feel like in your body today? Simply notice without judgment.",
client/src/pages/GuidedJournalingPage.tsx:226:            disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/GuidedJournalingPage.tsx:386:            It is not a substitute for professional mental health support. If you're in crisis, please reach out 
client/src/pages/GuidedJournalingPage.tsx:387:            to a crisis helpline or mental health professional.
client/src/pages/InsightCardsPage.tsx:41:  "therapy session",
client/src/pages/InsightCardsPage.tsx:177:          disclaimer="Personal organization tool—not clinical guidance. If you need crisis help, visit"
client/src/pages/InsightCardsPage.tsx:178:          crisisLink="/crisis"
client/src/pages/KnowledgeSynthesisPage.tsx:223:          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
client/src/pages/MasteryToolsPage.tsx:93:            disclaimer="Educational support—not clinical guidance. If you need crisis help, visit"
client/src/pages/MasteryToolsPage.tsx:94:            crisisLink="/crisis"
client/src/pages/MetaLearningPage.tsx:181:          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
client/src/pages/MirrorPage.tsx:146:          Write honestly. Receive a gentle reflection. This is not therapy — 
client/src/pages/MirrorPage.tsx:266:          If you're in crisis, please contact a professional or call a helpline.
client/src/pages/PhilosophicalInquiryPage.tsx:190:          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
client/src/pages/QAPage.jsx:17:  { id: "crisis", label: "Crisis Support", icon: Shield },
client/src/pages/QAPage.jsx:25:    answer: "Start with the Wellness Hub - it's your central navigation point. From there, we recommend beginning with Daily Routines for structure, then exploring Breathing or Grounding for immediate stress relief. The How-To Guides provide step-by-step instructions for every tool."
client/src/pages/QAPage.jsx:29:    question: "Do I need any experience with therapy or meditation?",
client/src/pages/QAPage.jsx:39:    question: "What is trauma and how do I know if I have it?",
client/src/pages/QAPage.jsx:45:    answer: "Healing isn't a straight line because the brain processes trauma in layers. You might feel great one day and struggle the next - this is normal. Progress often looks like: feeling a trigger and recovering faster, having more good days, or noticing old patterns with new awareness. Trust the process."
client/src/pages/QAPage.jsx:50:    answer: "Your nervous system has different states: fight-flight (activated), freeze (shutdown), and rest-digest (calm). Regulation means having the ability to move between states flexibly. When dysregulated, you might feel stuck in anxiety or numbness. Practices like breathing, grounding, and movement help restore balance."
client/src/pages/QAPage.jsx:55:    answer: "Self-guided healing can support your journey significantly. However, for trauma, persistent mental health challenges, or severe symptoms, professional support is recommended. Think of our tools as complementary to professional care, not a replacement. We provide resources to help you find affordable therapy options."
client/src/pages/QAPage.jsx:59:    question: "What's the difference between anxiety and just being stressed?",
client/src/pages/QAPage.jsx:60:    answer: "Stress is a response to an external pressure and usually eases when the situation resolves. Anxiety involves persistent worry, often about future possibilities, and can occur without an obvious trigger. Both involve similar physical sensations, but anxiety tends to be more chronic and may require targeted strategies."
client/src/pages/QAPage.jsx:65:    answer: "Sadness is a normal emotion that passes. Depression involves persistent low mood (2+ weeks), loss of interest in things you used to enjoy, changes in sleep/appetite, difficulty concentrating, and sometimes hopelessness. If you're experiencing these symptoms, please reach out to a mental health professional."
client/src/pages/QAPage.jsx:84:    question: "Why does breathing help with anxiety?",
client/src/pages/QAPage.jsx:90:    answer: "Grounding is using your senses to anchor yourself in the present moment. It's especially helpful during anxiety, dissociation, flashbacks, or when emotions feel overwhelming. Techniques include the 5-4-3-2-1 method (naming things you see, hear, feel), holding ice, or pressing your feet into the floor."
client/src/pages/QAPage.jsx:103:    category: "crisis",
client/src/pages/QAPage.jsx:108:    category: "crisis",
client/src/pages/QAPage.jsx:113:    category: "crisis",
client/src/pages/QAPage.jsx:114:    question: "What if I can't afford therapy?",
client/src/pages/QAPage.jsx:188:        { label: "Beginner", examples: ["What is grounding?", "How does breathing help anxiety?"] },
client/src/pages/QAPage.jsx:190:        { label: "Advanced", examples: ["Can I heal without therapy?", "How do patterns form?"] }
client/src/pages/ResilienceMetricsPage.tsx:194:          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
client/src/pages/StrategyMapsPage.tsx:391:          disclaimer="Educational growth framework—not clinical guidance. If you need crisis help, visit"
client/src/pages/StrategyMapsPage.tsx:392:          crisisLink="/crisis"
client/src/pages/SupportPage.tsx:99:                If you feel unsafe, use the crisis resources above immediately.
client/src/pages/SystemsThinkingPage.tsx:171:          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
client/src/pages/WisdomPracticesPage.tsx:231:          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
client/src/pages/WisdomSynthesisPage.tsx:226:          disclaimer="Educational reflection tool—not clinical guidance. If you need crisis help, visit"
client/src/pages/WisdomSynthesisPage.tsx:227:          crisisLink="/crisis"
client/src/pages/WisdomToolsPage.tsx:128:            disclaimer="Educational inquiry tools—not clinical guidance. If you need crisis help, visit"
client/src/pages/WisdomToolsPage.tsx:129:            crisisLink="/crisis"
client/src/pages/RigLab.jsx:34:  const [crisis, setCrisis] = useState(false);
client/src/pages/RigLab.jsx:81:          Crisis support: <a href="/crisis" style={{ color: "#E8913A" }}>/crisis</a> · 988 · 741741
client/src/pages/RigLab.jsx:121:            crisis={crisis}
client/src/pages/RigLab.jsx:215:              checked={crisis}
client/src/pages/RigLab.jsx:217:              data-testid="checkbox-crisis-override"
client/src/pages/MotionLab.jsx:6: * the auto-running motion stack with no controls — flip crisis to see
client/src/pages/MotionLab.jsx:48:  const [crisis, setCrisis] = useState(false);
client/src/pages/MotionLab.jsx:78:          Crisis support: <a href="/crisis" style={{ color: "#E8913A" }}>/crisis</a> · 988 · 741741 · Sister: <Link href="/rig-lab" style={{ color: "#142626", opacity: 0.7 }}>/rig-lab</Link>
client/src/pages/MotionLab.jsx:106:          <FloatIdleAnimated size={size} state={state} crisis={crisis} interactive={interactive} />
client/src/pages/MotionLab.jsx:109:              Emotional state {crisis ? "(pinned to calmIdle by crisis)" : ""}
client/src/pages/MotionLab.jsx:115:              disabled={crisis}
client/src/pages/MotionLab.jsx:121:                background: crisis ? "rgba(168,201,160,0.08)" : "#fff",
client/src/pages/MotionLab.jsx:124:                cursor: crisis ? "not-allowed" : "pointer",
client/src/pages/MotionLab.jsx:159:              checked={crisis}
client/src/pages/MotionLab.jsx:161:              data-testid="checkbox-motion-crisis"
client/src/pages/MotionLab.jsx:170:              disabled={crisis}
client/src/pages/MotionLab.jsx:174:              Phase 9 interactive {crisis ? "(disabled by crisis)" : "(hover · proximity · click)"}
client/src/pages/MotionLab.jsx:177:          {interactive && !crisis && (
client/src/pages/MotionLab.jsx:246:            <strong>Identity preserved:</strong> silhouette unchanged, expression unchanged at rest, mouth never opens, no redesign or recolor. Reduced-motion + crisis both pause the entire motion stack.
client/src/pages/_quarantine/legacy-landing/Home.jsx:83:    description: "Whether it's 3 AM anxiety or a Sunday breakthrough, we're here.",
client/src/pages/_quarantine/legacy-landing/Home.jsx:92:    description: "Psychoeducation helps you make sense of your experience. When you understand why, shame dissolves into compassion."
client/src/pages/_quarantine/legacy-landing/Home.jsx:167:        description="Journaling, mood tracking, and AI-assisted reflection — built with trauma-informed care. Evidence-informed tools including inner child work, nervous system education, and somatic practices, all in complete privacy."
client/src/pages/_quarantine/legacy-landing/Home.jsx:546:                <strong>Important:</strong> This is an educational wellness platform, not a replacement for professional mental health care. If you're in crisis, please reach out to a crisis line or mental health professional.
client/src/pages/_quarantine/legacy-landing/Home.jsx:599:            <a href="/crisis" className="text-[var(--glp-sage)] hover:underline">
client/src/pages/_quarantine/legacy-landing/Home.jsx:600:              If you're in crisis, get help now →
client/src/pages/_quarantine/legacy-landing/HealingLandingPage.jsx:81:      description: "Compassionate, trauma-informed AI guidance available 24/7 to support your healing journey.",
client/src/pages/_quarantine/legacy-landing/LandingV2.jsx:73:            href="/crisis"
client/src/pages/_quarantine/legacy-landing/LandingV2.jsx:75:            data-testid="link-nav-crisis"
client/src/pages/OnboardingFlow.jsx:9:  { id: "anxiety", label: "Anxiety", emoji: "🌀" },
client/src/pages/OnboardingFlow.jsx:10:  { id: "stress", label: "Stress", emoji: "🌊" },
client/src/pages/OnboardingFlow.jsx:429:            href="/crisis"
client/src/pages/OnboardingFlow.jsx:430:            data-testid="link-onboarding-crisis"
client/src/pages/OnboardingFlow.jsx:507:            Crisis? Visit <Link href="/crisis" className="underline" data-testid="link-onboarding-crisis-footer">/crisis</Link> for immediate support.
client/src/pages/AtlasDashboard.tsx:25:  "/crisis",
client/src/pages/AtlasDashboard.tsx:239:  // Atlas itself receives no live crisis input signal (no chat input on this
client/src/pages/AtlasDashboard.tsx:242:  const crisisDetected = false;
client/src/pages/AtlasDashboard.tsx:250:        crisisDetected,
client/src/pages/AtlasDashboard.tsx:254:    [healingFlow, crisisDetected, isVulnerable],
client/src/pages/AtlasDashboard.tsx:262:        crisisDetected,
client/src/pages/AtlasDashboard.tsx:267:    [healingFlow, crisisDetected, isVulnerable, governance],
client/src/pages/JournalPage.jsx:7:// HX-OS Interaction Governance — passive crisis-language detection.
client/src/pages/JournalPage.jsx:183:  // crisis language and derives suspension state via CrisisOverrideEngine +
client/src/pages/JournalPage.jsx:186:  // (defense-in-depth even without a crisis signal).
client/src/pages/JournalPage.jsx:187:  const crisisDetected = useMemo(() => {
client/src/pages/JournalPage.jsx:202:        crisisDetected,
client/src/pages/JournalPage.jsx:203:        vulnerable: crisisDetected,
client/src/pages/JournalPage.jsx:206:    [crisisDetected],
client/src/pages/JournalPage.jsx:214:        crisisDetected,
client/src/pages/JournalPage.jsx:215:        vulnerable: crisisDetected,
client/src/pages/JournalPage.jsx:219:    [crisisDetected, governance],
client/src/pages/DailyRitualPage.tsx:9:// HX-OS Interaction Governance — passive crisis-language detection.
client/src/pages/DailyRitualPage.tsx:215:  // is always false here (defense-in-depth, even without a crisis signal).
client/src/pages/DailyRitualPage.tsx:216:  const crisisDetected = useMemo(
client/src/pages/DailyRitualPage.tsx:226:        crisisDetected,
client/src/pages/DailyRitualPage.tsx:227:        vulnerable: crisisDetected,
client/src/pages/DailyRitualPage.tsx:230:    [crisisDetected],
client/src/pages/DailyRitualPage.tsx:238:        crisisDetected,
client/src/pages/DailyRitualPage.tsx:239:        vulnerable: crisisDetected,
client/src/pages/DailyRitualPage.tsx:243:    [crisisDetected, governance],
client/src/pages/DailyRitualPage.tsx:289:          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/Onboarding.tsx:17:  "grief_support",
client/src/pages/Onboarding.tsx:18:  "anxiety_relief",
client/src/pages/Onboarding.tsx:20:  "stress_management",
client/src/pages/Onboarding.tsx:48:  { id: "anxiety_relief", label: "Anxiety Relief", icon: Wind, color: "teal" },
client/src/pages/Onboarding.tsx:49:  { id: "stress_management", label: "Stress Management", icon: Shield, color: "sage" },
client/src/pages/Onboarding.tsx:56:  { id: "grief_support", label: "Grief Support", icon: Leaf, color: "sage" },
client/src/pages/Onboarding.tsx:62:  { id: "grounding", label: "Grounding", description: "Calming techniques for anxiety and stress" },
client/src/pages/Onboarding.tsx:181:  // crisisDetected memo is pinned `false` for attr-contract uniformity. Vulnerability
client/src/pages/Onboarding.tsx:183:  const crisisDetected = useMemo(() => false, []);
client/src/pages/Onboarding.tsx:195:        crisisDetected,
client/src/pages/Onboarding.tsx:199:    [crisisDetected, vulnerableState],
client/src/pages/Onboarding.tsx:207:        crisisDetected,
client/src/pages/Onboarding.tsx:212:    [crisisDetected, vulnerableState, governance],
client/src/pages/Onboarding.tsx:451:                  If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline.
client/src/pages/MoodPage.jsx:14:// HX-OS Interaction Governance — passive crisis-language detection.
client/src/pages/MoodPage.jsx:18:// Emotion selections from existing EMOTIONS list that indicate distress
client/src/pages/MoodPage.jsx:262:  const crisisDetected = useMemo(
client/src/pages/MoodPage.jsx:277:        crisisDetected,
client/src/pages/MoodPage.jsx:281:    [crisisDetected, vulnerableState],
client/src/pages/MoodPage.jsx:289:        crisisDetected,
client/src/pages/MoodPage.jsx:294:    [crisisDetected, vulnerableState, governance],
client/src/pages/Start.tsx:49: * response succeeded + tool exists + crisis is false + no error).
client/src/pages/Start.tsx:246: *   1. modules: "anxiety"              → "anxious"
client/src/pages/Start.tsx:257: *     modules "anxiety"              → "anxious"
client/src/pages/Start.tsx:290:  if (modules.includes("anxiety")) return "anxious";
client/src/pages/Start.tsx:309: *   overwhelmed → anxious → sad → encouraged → crisis → calm
client/src/pages/Start.tsx:342:  if (/(safe|not alone|reach out)/.test(t)) return "crisis";
client/src/pages/Start.tsx:420:  const [crisis, setCrisis] = useState(false);
client/src/pages/Start.tsx:553:      if (data.outcome === "crisis") {
client/src/pages/Start.tsx:579:  //   - Read-only on existing state (`crisis`, `toolCompleted`, `result`).
client/src/pages/Start.tsx:586:  //   1. crisis           → "crisis"     (safety — never overridden)
client/src/pages/Start.tsx:595:    if (crisis) {
client/src/pages/Start.tsx:596:      setBuddyState("crisis");
client/src/pages/Start.tsx:620:    //   1. crisis        (handled above — always wins)
client/src/pages/Start.tsx:667:  }, [crisis, toolCompleted, result, selectedToolId]);
client/src/pages/Start.tsx:672:  // crisis (which must remain steady — the user needs grounding, not
client/src/pages/Start.tsx:680:    if (buddyState === "calm" || buddyState === "crisis") return;
client/src/pages/Start.tsx:716:    if (crisis) return;
client/src/pages/Start.tsx:749:  }, [loading, crisis, buddyState, streak, result]);
client/src/pages/Start.tsx:752:  //   1. crisis           → null (avatar speaks via presence)
client/src/pages/Start.tsx:761:    if (buddyState === "crisis") return null;
client/src/pages/Start.tsx:858:          <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Calm anxiety instantly</li>
client/src/pages/Start.tsx:866:          Educational wellness tools — not medical advice. By tapping below, you confirm you are 18+. In crisis?{" "}
client/src/pages/Start.tsx:867:          <Link href="/crisis" className="underline font-medium text-rose-600 dark:text-rose-400" data-testid="link-crisis-inline">
client/src/pages/Start.tsx:964:        {crisis && (
client/src/pages/Start.tsx:967:            data-testid="alert-crisis"
client/src/pages/Start.tsx:971:              If you're in crisis, please reach out for immediate support.
client/src/pages/Start.tsx:978:              href="/crisis"
client/src/pages/Start.tsx:980:              data-testid="link-crisis-resources"
client/src/pages/Start.tsx:982:              More crisis resources <ArrowRight className="w-3 h-3" />
client/src/pages/Start.tsx:987:        {reply && !crisis && (() => {
client/src/pages/Start.tsx:1032:        {tool && !crisis && (
client/src/pages/Start.tsx:1116:        {result && !crisis && !error && (
client/src/pages/Start.tsx:1149:        {result && !crisis && !error && (
client/src/pages/Start.tsx:1188:        {result && !crisis && !error && (streak?.daysAway ?? 0) >= 2 && (
client/src/pages/Start.tsx:1200:              - NOT a crisis flow (`!crisis`)
client/src/pages/Start.tsx:1207:        {result && !crisis && !error && tool && (
client/src/pages/Start.tsx:1214:        {/* SOFT PAYWALL — only after value, never on crisis */}
client/src/pages/Start.tsx:1215:        {result && !crisis && result.response?.paywall?.show && (
client/src/pages/Settings.jsx:553:                Lumi can gently remember a few preferences (greeting tone, pacing, last visit) so welcome-back messages feel less repetitive. Memory is opt-in, editable, and never stores feelings, vulnerabilities, or crisis history.
client/src/pages/SelfLovePage.jsx:28:  { icon: Sparkles, title: "Do something just for you", description: "Give yourself permission to enjoy something without guilt" }
client/src/pages/ToolsPage.jsx:86:    helperLine: "These are reflective exercises, not therapy."
client/src/pages/ToolsPage.jsx:213:              disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/ToolsPage.jsx:271:                    If you're in crisis or need immediate support
client/src/pages/ToolsPage.jsx:281:              These tools are for reflection and self-discovery, not therapy. You know yourself best.
client/src/pages/CrisisResources.jsx:11:    description: "Free, confidential support 24/7 for anyone in distress",
client/src/pages/CrisisResources.jsx:20:    description: "Text-based crisis support for those who prefer texting",
client/src/pages/CrisisResources.jsx:23:    website: "https://www.crisistextline.org",
client/src/pages/CrisisResources.jsx:50:    website: "https://www.veteranscrisisline.net",
client/src/pages/CrisisResources.jsx:90:  <div className="hxos-vnext-crisis">
client/src/pages/CrisisResources.jsx:113:        description="24/7 crisis support hotlines and mental health resources. Find immediate help, emergency contacts, and self-care tips when you need them most."
client/src/pages/CrisisResources.jsx:136:                <h2 className="text-heading-md mb-2" style={{ color: 'var(--glp-rose-dark)' }}>In immediate danger?</h2>
client/src/pages/CanvaLanding.jsx:117:      description: "In sixty seconds, you'll enter a private space shaped entirely around how your mind works — your emotional rhythms, your stress patterns, your focus style, your deepest goals. No templates. No one-size-fits-all. Whether you're managing ADHD, navigating overwhelm, or simply seeking clarity, this sanctuary adapts to exactly where you are and evolves as you grow.",
client/src/pages/CanvaLanding.jsx:138:      text: "I was drowning in stress and couldn't even name what was wrong. My buddy asked one question nobody in my life had ever thought to ask — and something I'd buried for years suddenly made sense. It didn't just relieve the stress. It taught me how to observe my own mind, catch the pattern before it spirals, and respond with clarity instead of panic. That's a skill I'll carry forever.",
client/src/pages/CanvaLanding.jsx:140:      highlight: "respond with clarity instead of panic"
client/src/pages/CanvaLanding.jsx:175:      description: "No two minds work the same way. Some think in loops, some in bursts, some go deep, some jump fast. Your AI buddy learns how YOU feel, how you focus, and how you move through your day — the small things that make you, you. ADHD, anxiety, overthinking, a busy brain — we don't see problems to fix. We see a one-of-a-kind mind that deserves tools made for how it really works.",
client/src/pages/CanvaLanding.jsx:187:      description: "Lasting behavioral change doesn't happen under pressure — it happens in safety. No metrics to chase, no streaks to protect, no manufactured guilt. Like a wise mentor who knows when to challenge you, when to teach you, and when to simply hold space, Lumi meets you exactly where you are — because the strongest growth always comes from feeling genuinely supported, understood, and believed in.",
client/src/pages/CanvaLanding.jsx:196:      description: "Part coach who roots for you to grow. Part mentor who shares the right thought at the right time. Part friend who actually cares. Part guide who helps you understand why you do what you do. Trained in real listening, gentle coaching, and emotional smarts — Lumi helps you handle stress, build real confidence, calm your own mind, and become more of who you already are.",
client/src/pages/CanvaLanding.jsx:232:      description: "Work pressure. Relationship tension. Financial worry. ADHD overwhelm. The invisible weight of daily responsibilities. Lumi helps you process all of it through advanced self-regulation techniques — not by avoiding stress, but by understanding the behavioral and cognitive mechanics behind it deeply enough to navigate any situation with wisdom, calm, and genuine resilience.",
client/src/pages/CanvaLanding.jsx:238:      description: "No streaks. No guilt. No manufactured urgency. Like a true friend who never wavers, Lumi waits with genuine patience and greets you warmly whenever you return — because real behavioral transformation isn't a race. It's a lifelong relationship with your own mind, built on unconditional support, humor, honesty, and love.",
client/src/pages/CanvaLanding.jsx:260:      answer: "Imagine having a personal success coach, a wise mentor, a behavioral strategist, and a genuinely loyal friend — available 24/7, deeply invested in who you're becoming. That's your AI buddy. It's trained in metacognitive coaching, emotional intelligence, behavioral science, and active listening, paired with 500+ evidence-based tools for mastering everyday stressors from A to Z, building genuine confidence, deepening self-worth, developing self-regulation skills, and unlocking personal growth you can feel. Whether you're navigating ADHD, managing overwhelm, or seeking your fullest potential — this is the always-there companion that helps you understand your own mind from the inside out."
client/src/pages/CanvaLanding.jsx:268:      answer: "Lumi is coach, mentor, behavioral guide, and friend — woven into one emotionally intelligent presence. It helps you navigate daily stressors with advanced self-regulation techniques, builds your confidence through strength-based coaching and precise cognitive reframing, develops your metacognitive skills so you can observe and evolve your own thinking patterns, and surfaces unconscious behaviors you couldn't see on your own. It remembers your story, adapts to your unique cognitive style, and evolves alongside you — like a wise friend who always knows when to challenge you, when to teach you, and when to just listen."
client/src/pages/CanvaLanding.jsx:276:      answer: "Fundamentally different. Our buddy is purpose-built around trauma-informed communication, metacognitive coaching, emotional attunement, and behavioral science. It doesn't generate generic responses — it reads emotional undertones, recognizes cognitive patterns, reflects what you're feeling with precision and care, asks questions that open doorways you didn't know existed, and coaches you toward real, measurable growth. It's the difference between talking to a search engine and being guided by a wise mentor who genuinely understands how your unique mind works."
client/src/pages/CanvaLanding.jsx:280:      answer: "The core experience — mood tracking, journaling, daily reflections, community affirmations, self-regulation tools, focus strategies, and crisis resources — is completely free, forever. Not a trial. Not a stripped-down version. Not a hook. Pro and Elite unlock unlimited AI coaching and advanced metacognitive tools, but our free tier isn't a compromise — it's the standard we believe every person deserves. Understanding your own mind should never have a price barrier."
client/src/pages/CanvaLanding.jsx:284:      answer: "Life gets full — and your space stays exactly as you left it. Warm. Patient. Unchanged. No guilt emails. No streak that breaks. No passive-aggressive notifications wondering where you went. Behavioral growth happens in waves, not straight lines, and we genuinely honor that. When you're ready, Lumi is here — no judgment, no conditions, picking up right where you left off. That's what a real friend does."
client/src/pages/CanvaLanding.jsx:287:      question: "Is this a replacement for therapy?",
client/src/pages/CanvaLanding.jsx:288:      answer: "No — and we'll always be transparent about that, because integrity isn't optional. This is an educational wellness companion: a metacognitive coach and behavioral guide for deepening self-awareness, mastering stress, building emotional resilience, developing self-regulation skills, growing genuine confidence, and discovering the strength you already carry. If you're in crisis, we connect you directly to professional help. If you have a therapist, this complements their work beautifully. If you're not there yet, this is a gentle, empowering, judgment-free first step toward genuinely understanding and evolving your own mind."
client/src/pages/CanvaLanding.jsx:339:            <Link href="/crisis" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-serif font-semibold mb-3" style={{ color: 'var(--glp-rose, #C4787A)' }} data-testid="mobile-nav-crisis">Crisis Help</Link>
client/src/pages/CanvaLanding.jsx:422:              <Link href="/crisis" className="px-3 xl:px-4 py-3 text-[13px] xl:text-[14px] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--glp-rose-10,rgba(196,120,122,0.10))]" style={{ color: 'var(--glp-rose, #C4787A)' }} data-testid="nav-crisis">Crisis</Link>
client/src/pages/CanvaLanding.jsx:559:                    motion + crisis safety inherited from FloatIdleAnimated. */}
client/src/pages/CanvaLanding.jsx:615:              500+ evidence-informed tools for mastering everyday stressors from A to Z, building genuine confidence, deepening self-worth, and developing the metacognitive skills to understand and evolve your own mind — guided by an AI buddy that truly listens, remembers what matters to you, and coaches you with the intelligence of a behavioral strategist, the wisdom of a mentor, and the warmth of a best friend. Whether you're managing ADHD, navigating overwhelm, or seeking your highest potential — this is the support that changes how you relate to your own mind.
client/src/pages/CanvaLanding.jsx:718:              { headline: "When your thoughts race.", body: "Anxiety doesn't have to win the moment. Breathe with Lumi.", to: "/breathe", accent: "calm", testid: "card-validation-anxiety" },
client/src/pages/CanvaLanding.jsx:764:            If you're in crisis, please visit <Link href="/crisis" className="underline font-semibold" data-testid="link-validation-crisis">/crisis</Link> for immediate support.
client/src/pages/CanvaLanding.jsx:793:            Most wellness apps are engineered to maximize your screen time. We built this to maximize your potential. Built using evidence-informed wellness principles, your AI buddy combines the strategic intelligence of a success coach, the patient wisdom of a mentor, the behavioral insight of a metacognitive guide, and the unconditional warmth of a genuine friend — alongside 500+ evidence-informed tools for mastering every stressor from A to Z, building genuine confidence, developing self-regulation skills, and understanding the cognitive patterns you've carried for years. Whether you're navigating ADHD, managing overwhelm, building emotional resilience, or seeking your fullest potential — this is the relationship with yourself you've been searching for.
client/src/pages/CanvaLanding.jsx:820:                  No dark patterns. No guilt loops. No manipulation. Every interaction is opt-in and designed with your wellbeing as the only priority.
client/src/pages/CanvaLanding.jsx:926:              From dissolving daily stress to developing metacognitive mastery, from building genuine confidence to strengthening self-regulation — your complete A-to-Z, 360-degree toolkit for understanding and evolving your own mind. ADHD strategies. Behavioral insight. Emotional resilience. Cognitive coaching. Take what resonates. Leave what doesn't. There's no wrong way to grow.
client/src/pages/CanvaLanding.jsx:1159:            Free to start. No credit card. No trial that expires. Your AI buddy — success coach, metacognitive guide, wise mentor, and genuine friend — is here, patient and deeply invested in your evolution. Less stress. More confidence. Deeper self-worth. Real self-regulation. The person you're becoming is already inside you — let's meet them.
client/src/pages/CanvaLanding.jsx:1250:                <Link href="/crisis" className="block hover:underline transition-colors" style={{ color: 'var(--glp-ink)' }} data-testid="link-footer-crisis">Crisis Support</Link>
client/src/pages/BreathingExercisesPage.jsx:17:  what: "Evidence-based breathing techniques grounded in polyvagal theory for stress relief, anxiety reduction, and nervous system regulation.",
client/src/pages/BreathingExercisesPage.jsx:18:  who: "Anyone experiencing stress, anxiety, or wanting to build daily calm practices.",
client/src/pages/BreathingExercisesPage.jsx:19:  when: "During acute stress, before sleep, as a morning routine, or whenever you need to shift your nervous system state.",
client/src/pages/BreathingExercisesPage.jsx:41:    title: "Using breath for acute stress",
client/src/pages/BreathingExercisesPage.jsx:42:    situation: "You have a stressful meeting in 10 minutes and notice your heart racing.",
client/src/pages/BreathingExercisesPage.jsx:51:    result: "Over weeks, you notice your baseline stress levels decrease and you recover from challenges more quickly."
client/src/pages/BreathingExercisesPage.jsx:59:    description: "Equal-duration breathing for balance and nervous system reset. Used by Navy SEALs to maintain composure under extreme stress.",
client/src/pages/BreathingExercisesPage.jsx:62:    bestFor: "Acute stress, before important events, centering yourself, anxiety management",
client/src/pages/BreathingExercisesPage.jsx:70:    benefits: ["Promotes deep sleep", "Reduces anxiety rapidly", "Calms racing thoughts", "Lowers cortisol levels"],
client/src/pages/BreathingExercisesPage.jsx:71:    bestFor: "Before sleep, acute anxiety, calming panic, breaking worry cycles",
client/src/pages/BreathingExercisesPage.jsx:79:    benefits: ["Maximizes heart-brain coherence", "Emotional equilibrium", "Builds stress resilience over time", "Optimal vagal tone"],
client/src/pages/BreathingExercisesPage.jsx:88:    benefits: ["Direct vagus nerve activation", "Signals safety to the brain", "Rapid anxiety reduction", "Shifts from fight-flight to rest-digest"],
client/src/pages/BreathingExercisesPage.jsx:89:    bestFor: "Anxiety relief, overwhelm, grounding during stress, returning to your window of tolerance",
client/src/pages/BreathingExercisesPage.jsx:95:    description: "Shorter, more dynamic breathing to gently increase sympathetic activation when you need alertness without anxiety.",
client/src/pages/BreathingExercisesPage.jsx:104:    description: "A double-inhale followed by a long exhale—research from Stanford suggests this may be one of the quickest ways to reduce stress in real-time.",
client/src/pages/BreathingExercisesPage.jsx:106:    benefits: ["May quickly reduce stress", "Helps reinflate lung sacs", "Supports CO2 release", "Can help reset nervous system state"],
client/src/pages/BreathingExercisesPage.jsx:107:    bestFor: "Immediate stress relief, anxious moments, before difficult conversations, real-time regulation",
client/src/pages/BreathingExercisesPage.jsx:123:    content: "HRV—the variation in time between heartbeats—is considered an important indicator of nervous system flexibility. Research suggests higher HRV may be associated with better stress resilience. Studies indicate coherent breathing at 5-7 breaths per minute may support improved HRV."
client/src/pages/BreathingExercisesPage.jsx:127:    content: "Studies demonstrate that just 5 minutes of slow, diaphragmatic breathing reduces cortisol, lowers blood pressure, decreases anxiety symptoms, and improves cognitive performance. Regular practice creates lasting changes in nervous system baseline."
client/src/pages/BreathingExercisesPage.jsx:310:    description: "Evidence-based breathing techniques grounded in polyvagal theory for stress relief, anxiety reduction, and nervous system regulation. Box breathing, 4-7-8 technique, coherent breathing.",
client/src/pages/BreathingExercisesPage.jsx:345:            These evidence-based techniques, grounded in polyvagal theory, help shift your body from stress states into calm presence.
client/src/pages/BreathingExercisesPage.jsx:353:            "Grounded in polyvagal theory for stress relief and calm"
client/src/pages/BreathingExercisesPage.jsx:357:          disclaimer="Educational breathing practice—not medical advice. If you need crisis help, visit"
client/src/pages/BreathingExercisesPage.jsx:358:          crisisLink="/crisis"
client/src/pages/BreathingExercisesPage.jsx:377:                <strong>Polyvagal insight:</strong> Your nervous system is constantly scanning for danger (neuroception). 
client/src/pages/BreathingExercisesPage.jsx:489:              <strong style={{ color: 'var(--glp-ink)' }}>Build gradually:</strong> Start with 3-5 cycles. Overwhelm activates stress, not calm.
client/src/pages/BreathingExercisesPage.jsx:492:              <strong style={{ color: 'var(--glp-ink)' }}>Practice when calm:</strong> Train your nervous system during neutral times, not only during crisis.
client/src/pages/SubscriberBenefitsPage.jsx:34:  { name: "Crisis Resources", path: "/crisis", icon: Heart }
client/src/pages/StudyVaultPage.jsx:20:    id: "trauma",
client/src/pages/StudyVaultPage.jsx:23:    summary: "Trauma is the lasting emotional response to deeply distressing events. It affects the nervous system and can influence behavior, relationships, and well-being.",
client/src/pages/StudyVaultPage.jsx:26:      "The body keeps score of traumatic experiences",
client/src/pages/StudyVaultPage.jsx:57:    summary: "The autonomic nervous system governs our stress responses. Understanding and regulating it is key to emotional well-being.",
client/src/pages/StudyVaultPage.jsx:125:    summary: "Mindfulness is the practice of present-moment awareness without judgment. Research shows it reduces stress, anxiety, and depression.",
client/src/pages/StudyVaultPage.jsx:148:      "Post-traumatic growth is possible and common",
client/src/pages/StudyVaultPage.jsx:159:    id: "grief",
client/src/pages/StudyVaultPage.jsx:162:    summary: "Grief is a natural response to loss. It's not linear, and there's no right way to grieve.",
client/src/pages/StudyVaultPage.jsx:165:      "Grief can be triggered by many types of loss",
client/src/pages/StudyVaultPage.jsx:168:      "Community support is essential during grief",
client/src/pages/StudyVaultPage.jsx:216:    summary: "Somatic approaches recognize that trauma and stress are stored in the body, not just the mind. Healing involves the whole person.",
client/src/pages/StudyVaultPage.jsx:219:      "Shaking and trembling can release stored stress",
client/src/pages/StudyVaultPage.jsx:232:    id: "shame",
client/src/pages/StudyVaultPage.jsx:235:    summary: "Shame is the painful feeling that something is fundamentally wrong with us. Unlike guilt, which says 'I did something bad,' shame says 'I am bad.' Healing shame is central to emotional wellness.",
client/src/pages/StudyVaultPage.jsx:238:      "Empathy is the antidote to shame",
client/src/pages/StudyVaultPage.jsx:240:      "Distinguishing shame from guilt is liberating",
client/src/pages/StudyVaultPage.jsx:241:      "Perfectionism is often a shame-based coping mechanism",
client/src/pages/StudyVaultPage.jsx:251:    id: "anxiety",
client/src/pages/StudyVaultPage.jsx:254:    summary: "Anxiety is the body's natural alarm system. While uncomfortable, it evolved to protect us. Understanding anxiety helps reduce its grip.",
client/src/pages/StudyVaultPage.jsx:257:      "Avoidance maintains and strengthens anxiety",
client/src/pages/StudyVaultPage.jsx:260:      "Exposure and acceptance reduce anxiety over time",
client/src/pages/StudyVaultPage.jsx:301:    why: "Understanding how trauma affects the mind-body system leads to more effective and compassionate support.",
client/src/pages/StudyVaultPage.jsx:313:    why: "We're a wellness resource, not a replacement for professional mental health care. When in crisis, please seek professional support.",
client/src/pages/StudyVaultPage.jsx:330:    subtitle: "Curated research from neuroscience, psychology, and trauma-informed care.",
client/src/pages/StudyVaultPage.jsx:411:          <div className="rounded-xl p-4 mb-8" style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-rose-20)' }} data-testid="section-crisis-support">
client/src/pages/StudyVaultPage.jsx:417:              If you're in crisis, please reach out: <strong>988</strong> (Suicide & Crisis Lifeline) or text <strong>HOME</strong> to <strong>741741</strong>.
client/src/pages/SoulWellnessPage.jsx:134:        description: "Intentionally seeking experiences of awe—things that feel vast and require accommodation—reduces stress and increases well-being.",
client/src/pages/SoulWellnessPage.jsx:148:        exercise: "Today, find 5 beautiful things and pause with each for 30 seconds. They can be simple: light through a window, a stranger's smile, a perfectly ripe fruit."
client/src/pages/SoulWellnessPage.jsx:175:        reflection: "How do you transition between roles and spaces? Do you carry stress from one to another?",
client/src/pages/SoulWellnessPage.jsx:242:            disclaimer="Educational soul wellness—not religious guidance. If you need crisis help, visit"
client/src/pages/SoulWellnessPage.jsx:243:            crisisLink="/crisis"
client/src/pages/ResearchEvidencePage.jsx:19:        implications: "This means healing is always possible—your brain can literally change structure and function through consistent practices like mindfulness, therapy, and healthy habits.",
client/src/pages/ResearchEvidencePage.jsx:24:        summary: "Dr. Stephen Porges' research shows how the vagus nerve regulates our sense of safety and our stress responses (fight, flight, freeze).",
client/src/pages/ResearchEvidencePage.jsx:46:        implications: "Regular mindfulness practice increases gray matter in areas related to learning, memory, and emotional regulation, while decreasing the amygdala (stress center).",
client/src/pages/ResearchEvidencePage.jsx:51:        summary: "Meta-analyses show meditation reduces anxiety with effect sizes comparable to antidepressant medications for some populations.",
client/src/pages/ResearchEvidencePage.jsx:52:        implications: "Meditation is a valid, evidence-based intervention for anxiety that can be practiced independently and has no side effects.",
client/src/pages/ResearchEvidencePage.jsx:64:    id: "trauma",
client/src/pages/ResearchEvidencePage.jsx:72:        summary: "Dr. Bessel van der Kolk's decades of research show trauma is stored in the body, not just the mind. Body-based therapies are essential.",
client/src/pages/ResearchEvidencePage.jsx:73:        implications: "Healing must include the body through practices like yoga, EMDR, somatic experiencing, and breathwork—talk therapy alone is often insufficient.",
client/src/pages/ResearchEvidencePage.jsx:78:        summary: "Research shows many trauma survivors experience significant positive change—improved relationships, new possibilities, personal strength, spiritual growth.",
client/src/pages/ResearchEvidencePage.jsx:79:        implications: "Trauma doesn't define you. Many people not only recover but grow beyond their pre-trauma functioning.",
client/src/pages/ResearchEvidencePage.jsx:105:        summary: "Dr. Kristin Neff's research shows self-compassion is more psychologically beneficial than self-esteem and protects against anxiety and depression.",
client/src/pages/ResearchEvidencePage.jsx:153:        summary: "Controlled breathing directly affects the autonomic nervous system. The physiological sigh (double inhale, long exhale) rapidly reduces stress.",
client/src/pages/ResearchEvidencePage.jsx:159:        summary: "Research shows yoga reduces symptoms of PTSD, depression, and anxiety, often as effectively as medication or therapy.",
client/src/pages/ResearchEvidencePage.jsx:230:                  neuroscience, psychology, somatic therapy, and contemplative traditions—all validated by peer-reviewed studies. 
client/src/pages/ResearchEvidencePage.jsx:317:                  <strong>The body must be included</strong> in healing from trauma and stress—it's not just a mental process.
client/src/pages/ProtocolSession.jsx:173:      // Auto-soft-redirect to /crisis after 1.5s so the user reads the
client/src/pages/ProtocolSession.jsx:175:      const t = setTimeout(() => navigate("/crisis"), 1500);
client/src/pages/ProtocolSession.jsx:197:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/ProtocolSession.jsx:221:              Taking you to crisis resources now. You can return to this protocol anytime.
client/src/pages/ProtocolSession.jsx:223:            <Link href="/crisis" className="mt-3 inline-block rounded-xl bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700" data-testid="link-go-crisis">
client/src/pages/ProtocolSession.jsx:224:              Go to crisis support →
client/src/pages/ProtocolBrowser.jsx:135:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/ProtocolBrowser.jsx:150:            Educational only — not therapy or diagnosis.
client/src/pages/ProfessionalResourcesPage.jsx:16:        description: "Free, confidential 24/7 support for people in distress",
client/src/pages/ProfessionalResourcesPage.jsx:22:        description: "Text-based crisis counseling available 24/7",
client/src/pages/ProfessionalResourcesPage.jsx:24:        url: "https://www.crisistextline.org"
client/src/pages/ProfessionalResourcesPage.jsx:46:        description: "Affordable therapy sessions ($30-$80) for those in need",
client/src/pages/ProfessionalResourcesPage.jsx:51:        description: "Online therapy with licensed counselors",
client/src/pages/ProfessionalResourcesPage.jsx:79:        description: "Evidence-based resources for anxiety and depression",
client/src/pages/ProfessionalResourcesPage.jsx:181:                  If you're experiencing a mental health crisis, please contact one of the crisis hotlines below or call 911.
client/src/pages/ProfessionalResourcesPage.jsx:211:                  If you or someone you know is in crisis, reach out now.
client/src/pages/ProfessionalResourcesPage.jsx:217:                  <Link href="/crisis" className="btn-secondary-premium" data-testid="link-crisis-page">
client/src/pages/HowToGuidesPage.jsx:17:    overview: "Controlled breathing is the fastest way to shift your nervous system from stress to calm. Different breathing patterns create different effects.",
client/src/pages/HowToGuidesPage.jsx:20:      "Before stressful situations (presentations, difficult conversations)",
client/src/pages/HowToGuidesPage.jsx:22:      "During panic attacks",
client/src/pages/HowToGuidesPage.jsx:34:      "Practice when calm first—it's harder to learn during stress",
client/src/pages/HowToGuidesPage.jsx:47:    overview: "Grounding brings you back to the present moment when your mind is stuck in the past (trauma) or future (anxiety). It uses your senses to reconnect with the here-and-now.",
client/src/pages/HowToGuidesPage.jsx:51:      "When anxiety is spiraling",
client/src/pages/HowToGuidesPage.jsx:52:      "Before or after difficult therapy sessions",
client/src/pages/HowToGuidesPage.jsx:127:      "If an affirmation causes distress, soften it",
client/src/pages/HowToGuidesPage.jsx:174:      "Before and after stressful periods",
client/src/pages/DiscernmentDashboard.jsx:448:            href="/crisis"
client/src/pages/DiscernmentDashboard.jsx:450:            data-testid="link-crisis-header"
client/src/pages/DailyRoutinesPage.jsx:134:        why: "A brief pause prevents carrying morning stress into afternoon. It allows conscious transition between activities."
client/src/pages/DailyRoutinesPage.jsx:158:        why: "Social connection releases oxytocin and reduces stress. It reminds us we're not alone."
client/src/pages/DailyRoutinesPage.jsx:236:  { name: "3 Deep Breaths", time: "30 sec", icon: Wind, when: "Anytime stressed" },
client/src/pages/DailyRoutinesPage.jsx:309:            disclaimer="Wellness education—not medical advice. If you need crisis help, visit"
client/src/pages/DailyRoutinesPage.jsx:310:            crisisLink="/crisis"
client/src/pages/ContentStudioPage.tsx:200:              <p className="text-body-sm">Create trauma-informed, brand-aligned content</p>
client/src/pages/CognitiveToolsPage.jsx:16:  who: "Anyone experiencing negative self-talk, anxiety spirals, or wanting to understand their thought patterns.",
client/src/pages/CognitiveToolsPage.jsx:17:  when: "When you notice recurring negative thoughts, before/after stressful situations, or during daily reflection.",
client/src/pages/CognitiveToolsPage.jsx:46:    title: "Breaking an anxiety spiral",
client/src/pages/CognitiveToolsPage.jsx:88:    reframe: "I did what I could with what I knew. 'Should' adds guilt to suffering. What can I do now?"
client/src/pages/CognitiveToolsPage.jsx:110:    questions: ["What situation triggered this feeling?", "What exactly am I telling myself?", "What's the specific thought causing distress?"]
client/src/pages/CognitiveToolsPage.jsx:266:            disclaimer="Educational CBT tools—not therapy. If you need crisis help, visit"
client/src/pages/CognitiveToolsPage.jsx:267:            crisisLink="/crisis"
client/src/pages/CognitiveToolsPage.jsx:286:                  CBT is one of the most researched and effective approaches for managing anxiety, depression, and stress. 
client/src/pages/BodyWellnessPage.jsx:18:  when: "During stress, when feeling disconnected from your body, or as part of daily self-care.",
client/src/pages/BodyWellnessPage.jsx:19:  why: "The body stores experiences and emotions. Gentle body practices help complete stress cycles and restore balance.",
client/src/pages/BodyWellnessPage.jsx:34:    situation: "You notice your shoulders are up by your ears after a stressful meeting.",
client/src/pages/BodyWellnessPage.jsx:40:    title: "Completing a stress cycle",
client/src/pages/BodyWellnessPage.jsx:64:        description: "Slow, intentional stretches that release stored tension in the body. Focus on areas that hold stress: neck, shoulders, hips, and jaw.",
client/src/pages/BodyWellnessPage.jsx:78:        description: "Animals naturally shake after stress to discharge adrenaline. This practice helps complete the stress cycle.",
client/src/pages/BodyWellnessPage.jsx:87:        benefits: "Discharges stress hormones, resets nervous system, releases trapped energy"
client/src/pages/BodyWellnessPage.jsx:101:        benefits: "Grounds anxiety, integrates mind-body connection, gentle exercise"
client/src/pages/BodyWellnessPage.jsx:123:        benefits: "Rapidly reduces stress, balances oxygen/CO2, activates relaxation response"
client/src/pages/BodyWellnessPage.jsx:137:        benefits: "Reduces anxiety, aids sleep, lowers heart rate"
client/src/pages/BodyWellnessPage.jsx:142:        description: "Equal-ratio breathing used by Navy SEALs for stress management and focus.",
client/src/pages/BodyWellnessPage.jsx:151:        benefits: "Increases focus, regulates stress response, grounding"
client/src/pages/BodyWellnessPage.jsx:223:        benefits: "Equivalent to 2-4 hours of sleep, trauma release, deep restoration"
client/src/pages/BodyWellnessPage.jsx:264:        description: "Brief cold exposure activates the vagus nerve and resets the stress response.",
client/src/pages/BodyWellnessPage.jsx:273:        benefits: "Vagus nerve activation, mood boost, increased alertness, stress resilience"
client/src/pages/BodyWellnessPage.jsx:287:        benefits: "Reduces anxiety, induces theta brainwaves, promotes deep relaxation"
client/src/pages/BodyWellnessPage.jsx:373:            disclaimer="Educational body wellness—not medical advice. If you need crisis help, visit"
client/src/pages/BodyWellnessPage.jsx:374:            crisisLink="/crisis"
client/src/pages/BodyWellnessPage.jsx:393:                  Your body holds wisdom and stores experiences, including trauma. Somatic (body-based) practices help release 
client/src/pages/BiometricDashboard.jsx:215:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/BiometricDashboard.jsx:274:                  <span>{stateQuery.data?.disclaimer || "Educational only. Never a clinical assessment. If you are in crisis, visit /crisis."}</span>
client/src/pages/BehaviorChangePage.jsx:65:          example: "Cue: Feeling stressed. Routine: Scroll social media. Reward: Temporary distraction. To change this, keep the cue and reward but change the routine to something healthier like deep breathing."
client/src/pages/BehaviorChangePage.jsx:210:          example: "If you stress-eat for comfort, replace with: calling a friend, taking a walk, or doing breathing exercises. The need for comfort remains—just find a healthier way to meet it."
client/src/pages/BehaviorChangePage.jsx:323:            disclaimer="Educational behavior science—not clinical advice. If you need crisis help, visit"
client/src/pages/BehaviorChangePage.jsx:324:            crisisLink="/crisis"
client/src/pages/AgentInteraction.jsx:262:          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
client/src/pages/Newsletter.jsx:74:              no urgency, no guilt if you skip one. It'll be here when you're ready.
client/src/pages/Newsletter.jsx:113:            It is not therapy, medical advice, or a substitute for professional care.
client/src/pages/Newsletter.jsx:116:            If you or someone you know is in crisis, please visit our{" "}
client/src/pages/Newsletter.jsx:117:            <Link href="/crisis" className="underline text-[var(--glp-sage-deep)] hover:text-[var(--glp-sage)]" data-testid="link-crisis">crisis resources page</Link>.
client/src/pages/GlossaryPage.jsx:9:const glossaryTerms = [
client/src/pages/GlossaryPage.jsx:11:  { term: "Amygdala", category: "Neuroscience", definition: "The brain's alarm system that processes fear and triggers the fight-flight-freeze response. Can become hyperactive after trauma, causing overreaction to perceived threats.", example: "When you startle at a loud noise, your amygdala activated before your thinking brain could assess the situation." },
client/src/pages/GlossaryPage.jsx:15:  { term: "Burnout", category: "Mental Health", definition: "A state of chronic physical and emotional exhaustion caused by prolonged stress, often work-related. Characterized by reduced effectiveness, cynicism, and detachment.", example: "Feeling emotionally drained, dreading work, and unable to feel satisfaction from accomplishments." },
client/src/pages/GlossaryPage.jsx:16:  { term: "Cognitive Behavioral Therapy (CBT)", category: "Therapy", definition: "An evidence-based therapy approach that identifies and changes unhelpful thought patterns and behaviors. Based on the connection between thoughts, feelings, and actions. Note: CBT is a professional therapy modality—seek a licensed therapist for therapeutic application.", example: "Challenging the thought 'I always fail' by examining evidence and creating a more balanced perspective." },
client/src/pages/GlossaryPage.jsx:18:  { term: "Cortisol", category: "Neuroscience", definition: "The primary stress hormone released by the adrenal glands. Chronic elevation can impair immune function, sleep, and cognitive performance.", example: "Morning cortisol helps you wake up, but constant high cortisol from chronic stress causes exhaustion." },
client/src/pages/GlossaryPage.jsx:19:  { term: "Dissociation", category: "Mental Health", definition: "A disconnection from thoughts, feelings, surroundings, or identity. Ranges from daydreaming to more severe experiences. Often a protective response to overwhelming stress.", example: "Feeling like you're watching yourself from outside your body, or that the world seems unreal." },
client/src/pages/GlossaryPage.jsx:21:  { term: "Emotional Regulation", category: "Skills", definition: "The ability to manage and respond to emotional experiences in healthy ways. Includes awareness, acceptance, and appropriate expression of emotions.", example: "Using deep breathing to calm anxiety before an important presentation." },
client/src/pages/GlossaryPage.jsx:25:  { term: "Grounding", category: "Practice", definition: "Techniques that connect you to the present moment, often through sensory awareness. Useful for anxiety, dissociation, and overwhelming emotions.", example: "The 5-4-3-2-1 technique: naming 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste." },
client/src/pages/GlossaryPage.jsx:27:  { term: "Inner Child", category: "Psychology", definition: "The part of your psyche that retains the feelings, memories, and experiences from childhood. Inner child work involves acknowledging and healing childhood wounds.", example: "Feeling disproportionate shame when criticized may reflect an inner child who experienced harsh judgment." },
client/src/pages/GlossaryPage.jsx:28:  { term: "Intrusive Thoughts", category: "Mental Health", definition: "Unwanted, involuntary thoughts that can be disturbing or distressing. Having them is normal; it's how we respond to them that matters.", example: "A sudden, unwanted thought about something embarrassing you once said years ago." },
client/src/pages/GlossaryPage.jsx:31:  { term: "Mindfulness", category: "Practice", definition: "Non-judgmental awareness of the present moment, including thoughts, feelings, and sensations. Rooted in Buddhist tradition, now widely used in therapy.", example: "Noticing the taste, texture, and smell of food while eating, rather than eating on autopilot." },
client/src/pages/GlossaryPage.jsx:32:  { term: "Nervous System Regulation", category: "Neuroscience", definition: "The ability to shift between activation (stress response) and calm (rest-digest). Practices like breathwork and grounding support regulation.", example: "Using slow exhales to activate the parasympathetic nervous system and reduce anxiety." },
client/src/pages/GlossaryPage.jsx:35:  { term: "Parasympathetic Nervous System", category: "Neuroscience", definition: "The 'rest and digest' branch of the nervous system that promotes calm, recovery, and relaxation. Activated by slow breathing and safety cues.", example: "After a stressful event, your parasympathetic system helps your heart rate return to normal." },
client/src/pages/GlossaryPage.jsx:36:  { term: "Polyvagal Theory", category: "Neuroscience", definition: "A theory explaining how the vagus nerve influences our sense of safety and social connection. Three states: ventral vagal (safe), sympathetic (mobilized), dorsal vagal (shutdown).", example: "Feeling shut down and disconnected after overwhelming stress reflects dorsal vagal activation." },
client/src/pages/GlossaryPage.jsx:37:  { term: "PTSD", category: "Mental Health", definition: "Post-Traumatic Stress Disorder - a condition that can develop after experiencing or witnessing a traumatic event. Symptoms include flashbacks, avoidance, and hypervigilance.", example: "Avoiding driving after a serious car accident, or having nightmares about the event." },
client/src/pages/GlossaryPage.jsx:38:  { term: "Resilience", category: "Psychology", definition: "The ability to adapt and recover from adversity, stress, or trauma. Not about avoiding difficulty but developing the capacity to cope and grow.", example: "Bouncing back from job loss by learning new skills and building a support network." },
client/src/pages/GlossaryPage.jsx:41:  { term: "Somatic Experiencing", category: "Therapy", definition: "A body-based therapy approach that addresses trauma stored in the body. Focuses on physical sensations rather than just talking about events. Note: SE is a professional therapy modality—seek a trained practitioner for therapeutic application.", example: "Noticing where you feel tension in your body when discussing a difficult memory." },
client/src/pages/GlossaryPage.jsx:44:  { term: "Trigger", category: "Mental Health", definition: "A stimulus (sound, smell, word, situation) that activates a strong emotional or physical response, often related to past trauma.", example: "A certain song reminding you of a painful breakup and bringing back the associated feelings." },
client/src/pages/GlossaryPage.jsx:50:const categories = [...new Set(glossaryTerms.map(t => t.category))].sort();
client/src/pages/GlossaryPage.jsx:52:export default function GlossaryPage() {
client/src/pages/GlossaryPage.jsx:57:    title: "Mental Health Glossary",
client/src/pages/GlossaryPage.jsx:58:    description: "Comprehensive glossary of mental health, psychology, and wellness terms. Learn about therapy concepts, neuroscience, emotional regulation, and healing practices.",
client/src/pages/GlossaryPage.jsx:62:    return glossaryTerms.filter(term => {
client/src/pages/GlossaryPage.jsx:82:    title="GlossaryPage"
client/src/pages/GlossaryPage.jsx:99:      <SEO title="Glossary — MyMentalHealthBuddy" description="Definitions of key wellness and self-care terms." />
client/src/pages/GlossaryPage.jsx:114:                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Wellness Glossary</h1>
client/src/pages/GlossaryPage.jsx:115:                <p className="text-lead">{glossaryTerms.length} terms explained in simple language</p>
client/src/pages/ResourcesPage.jsx:8:const crisisResources = [
client/src/pages/ResourcesPage.jsx:11:    description: "Free, confidential 24/7 support for anyone in crisis",
client/src/pages/ResourcesPage.jsx:19:    description: "Text-based crisis support with trained counselors",
client/src/pages/ResourcesPage.jsx:21:    website: "https://crisistextline.org",
client/src/pages/ResourcesPage.jsx:39:      { name: "Open Path Collective", description: "Affordable therapy sessions ($30-$80)", url: "https://openpathcollective.org" },
client/src/pages/ResourcesPage.jsx:41:      { name: "AASECT Certified Therapists", description: "Sex therapy specialists", url: "https://aasect.org/referral-directory" }
client/src/pages/ResourcesPage.jsx:58:      { name: "PTSD Foundation", description: "Resources and support for trauma survivors", url: "https://ptsd.va.gov" },
client/src/pages/ResourcesPage.jsx:60:      { name: "The National Child Traumatic Stress Network", description: "Childhood trauma resources", url: "https://nctsn.org" },
client/src/pages/ResourcesPage.jsx:61:      { name: "Sidran Institute", description: "Traumatic stress education and advocacy", url: "https://sidran.org" }
client/src/pages/ResourcesPage.jsx:70:      { name: "Calm Clinic", description: "Free anxiety tests and education", url: "https://calmclinic.com" },
client/src/pages/ResourcesPage.jsx:88:      { name: "The Body Keeps the Score", description: "Bessel van der Kolk on trauma and healing", url: "https://besselvanderkolk.com" },
client/src/pages/ResourcesPage.jsx:91:      { name: "Feeling Good", description: "David Burns on cognitive behavioral therapy", url: "" }
client/src/pages/ResourcesPage.jsx:97:  { name: "The Trevor Project", description: "LGBTQ+ youth crisis support", icon: Heart, phone: "1-866-488-7386" },
client/src/pages/ResourcesPage.jsx:150:              If you or someone you know is in immediate danger, please call 911 or go to your nearest emergency room.
client/src/pages/ResourcesPage.jsx:153:              {crisisResources.map((resource, index) => (
client/src/pages/ResourcesPage.jsx:158:                  data-testid={`card-crisis-${index}`}
client/src/pages/ResourcesPage.jsx:273:                    peer support groups, and sliding-scale therapy options. Contact your local health 
client/src/pages/WellnessToolsHub.jsx:14:    body: "A 7-question screening to notice anxiety levels over the last two weeks. Educational only.",
client/src/pages/WellnessToolsHub.jsx:24:    body: "A 9-question screening to notice depression symptoms. Item 9 routes you to immediate support.",
client/src/pages/WellnessToolsHub.jsx:138:        description="Free, gentle wellness tools — anxiety check-in, mood check-in, distortion checker, breath pacer, boundary builder. Educational only, no paywall."
client/src/pages/WellnessToolsHub.jsx:151:            href="/crisis"
client/src/pages/WellnessToolsHub.jsx:154:            data-testid="link-crisis-header"
client/src/pages/WellnessToolsHub.jsx:192:                <Link href="/crisis" className="underline font-medium" data-testid="link-crisis-disclaimer">crisis support</Link>{" "}
client/src/pages/Dashboard.jsx:240:            <Link href="/crisis" className="group" data-testid="link-quick-crisis" aria-label="Go to Crisis Support">
client/src/pages/Dashboard.jsx:488:            href="/crisis" 
client/src/pages/Dashboard.jsx:491:            data-testid="link-crisis-resources"
client/src/pages/DesignSystemV2.jsx:115:              <Link href="/crisis" className="lumi-link-crisis" data-testid="link-crisis">Crisis Support</Link>
client/src/pages/DesignSystemV2.jsx:139:                  Educational only — not a clinical tool. If you are in distress visit{" "}
client/src/pages/DesignSystemV2.jsx:140:                  <Link href="/crisis" className="lumi-link-inline">Crisis Support</Link>.
client/src/pages/DesignSystemV2.jsx:232:              <button className="lumi-btn lumi-btn-crisis"    data-testid="btn-crisis">I need help now</button>
client/src/pages/DesignSystemV2.jsx:260:                <Link href="/crisis" className="lumi-link-crisis" data-testid="lk-crisis">Crisis Support</Link>
client/src/pages/DesignSystemV2.jsx:358:                  <button className="lumi-btn lumi-btn-tertiary" onClick={() => setDemoCtx({ crisisActive: true })}       data-testid="ctx-crisis">Crisis</button>
client/src/pages/DesignSystemV2.jsx:413:                    <Link href="/crisis" className="lumi-link-crisis" data-testid="footer-crisis">Crisis Support</Link>
client/src/pages/DesignSystemV2.jsx:429:          {/* Canonical SafetyFooter — required on all wellness routes for crisis routing parity */}
client/src/pages/CourseCatalog.jsx:116:      id: "healing-trauma",
client/src/pages/CourseCatalog.jsx:118:      description: "Educational exploration of trauma responses and self-compassion",
client/src/pages/PeacescapePage.jsx:16:  { phase: "Phase 4", title: "Learning curriculum", body: "Bite-sized, trauma-informed micro-lessons that unlock alongside you." },
client/src/pages/CalmingScenesPage.jsx:17:  who: "Anyone needing a moment of peace, experiencing stress, or wanting to use visualization for calm.",
client/src/pages/CalmingScenesPage.jsx:34:    situation: "You have 2 minutes between tasks and feel stressed.",
client/src/pages/CalmingScenesPage.jsx:96:    breathPrompt: "Inhale the sweet fragrance... exhale and feel joy blossom...",
client/src/pages/CalmingScenesPage.jsx:145:    description: "Immersive visual environments for relaxation and stress relief. Ocean waves, peaceful forests, mountain sunrises, and more calming scenes.",
client/src/pages/CalmingScenesPage.jsx:196:            Immerse yourself in peaceful environments designed to reduce stress, ease anxiety, and restore inner calm. 
client/src/pages/CalmingScenesPage.jsx:209:          disclaimer="Relaxation visualization—not therapy. If you need crisis help, visit"
client/src/pages/CalmingScenesPage.jsx:210:          crisisLink="/crisis"
client/src/pages/MovementSnacksPage.jsx:23:  why: "Brief movement activates your vagus nerve, releases tension, and breaks stress hormone cycles—without requiring a workout.",
client/src/pages/MovementSnacksPage.jsx:169:          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/AffirmationsPage.jsx:123:    researchNote: "Post-traumatic growth research shows that struggle often leads to profound positive change. Your challenges have built capacities you may not yet recognize.",
client/src/pages/AffirmationsPage.jsx:165:    researchNote: "Research shows that healthy boundaries are associated with lower anxiety, depression, and burnout, and higher relationship satisfaction.",
client/src/pages/AffirmationsPage.jsx:211:      "I honor my body's survival responses without shame.",
client/src/pages/AffirmationsPage.jsx:219:      "I am not my anxiety. I am the witness of my anxiety.",
client/src/pages/AffirmationsPage.jsx:252:  timing: "Studies on self-affirmation theory show affirmations work best when tailored to personal values and practiced during receptive states rather than acute stress."
client/src/pages/AffirmationsPage.jsx:374:            "10 categories of trauma-informed affirmations grounded in research",
client/src/pages/AffirmationsPage.jsx:380:          disclaimer="Supportive affirmations—not clinical treatment. If you need crisis help, visit"
client/src/pages/AffirmationsPage.jsx:381:          crisisLink="/crisis"
client/src/pages/MeditationGuidePage.jsx:17:  when: "Morning intention-setting, evening wind-down, during stress, or as a daily practice for long-term brain changes.",
client/src/pages/MeditationGuidePage.jsx:41:    action: "Choose the Progressive Body Scan and slowly release tension from head to toe, noticing where you hold stress.",
client/src/pages/MeditationGuidePage.jsx:71:      "Feel your neck and shoulders. This is where many of us carry stress. Let them drop away from your ears.",
client/src/pages/MeditationGuidePage.jsx:90:    benefits: ["Increases self-compassion significantly", "Reduces anxiety and depression", "Improves relationship satisfaction", "Decreases self-criticism and shame"],
client/src/pages/MeditationGuidePage.jsx:101:      "Think of a neutral person—someone you neither like nor dislike, perhaps a stranger you've seen.",
client/src/pages/MeditationGuidePage.jsx:119:    benefits: ["Calms the mind quickly", "Reduces stress hormones", "Improves focus and attention", "Builds meditation foundation"],
client/src/pages/MeditationGuidePage.jsx:203:    benefits: ["Reduces anxiety quickly", "Creates profound sense of stability", "Anchors in present moment", "Helpful for dissociation"],
client/src/pages/MeditationGuidePage.jsx:204:    researchNote: "Grounding practices activate proprioception and interoception, helping the brain orient to present-moment safety rather than past trauma or future worry.",
client/src/pages/MeditationGuidePage.jsx:232:    researchNote: "IFS-informed practices help people relate to their inner experience with more curiosity and less shame, leading to better emotional regulation.",
client/src/pages/MeditationGuidePage.jsx:447:          disclaimer="Educational mindfulness tools—not therapy. If you need crisis help, visit"
client/src/pages/MeditationGuidePage.jsx:448:          crisisLink="/crisis"
client/src/pages/MeditationGuidePage.jsx:554:            <li>• If you experience significant distress, <strong>pause immediately</strong> and ground yourself (feet on floor, slow breaths).</li>
client/src/pages/MeditationGuidePage.jsx:555:            <li>• For trauma survivors: parts work and body scans can sometimes bring up difficult material. Go slowly and stay within your window of tolerance.</li>
client/src/pages/MeditationGuidePage.jsx:556:            <li>• If meditation consistently increases anxiety or distress, this is important information—consider working with a therapist who specializes in trauma.</li>
client/src/pages/MeditationGuidePage.jsx:557:            <li>• These guided practices are educational tools, not therapy or medical treatment.</li>
client/src/pages/CommunityGuidelines.jsx:128:                  If sharing content that discusses trauma, abuse, or distressing topics, 
client/src/pages/InnerChildPage.jsx:15:  who: "Anyone healing from difficult childhood experiences, trauma, or wanting to understand their emotional patterns.",
client/src/pages/InnerChildPage.jsx:34:    result: "Understanding the origin helps you feel compassion for yourself rather than shame about the pattern."
client/src/pages/InnerChildPage.jsx:48:    result: "The writing process allows grief to move through you, and you begin to internalize a new loving voice."
client/src/pages/InnerChildPage.jsx:57:    whenUnmet: "Hypervigilance, anxiety, difficulty trusting, always waiting for the other shoe to drop, people-pleasing to avoid conflict",
client/src/pages/InnerChildPage.jsx:62:      "Practice grounding when anxiety arises—feet on floor, name 5 things you see",
client/src/pages/InnerChildPage.jsx:66:    affirmation: "I am safe now. I can protect myself. The danger is in the past. I will never abandon myself again.",
client/src/pages/InnerChildPage.jsx:95:      "Meet your basic needs without guilt—rest, food, pleasure are rights",
client/src/pages/InnerChildPage.jsx:105:    whenUnmet: "Difficulty making decisions, feeling powerless, either excessive compliance or rebellion, loss of self",
client/src/pages/InnerChildPage.jsx:121:    whenUnmet: "Chronic seriousness, workaholism, difficulty relaxing, guilt around pleasure, forgetting what brings joy",
client/src/pages/InnerChildPage.jsx:122:    woundOrigins: "Having to grow up too fast, parentification, trauma during childhood, joy being punished, scarcity mentality",
client/src/pages/InnerChildPage.jsx:166:    healingFocus: "Reclaim your right to choose, release shame, celebrate imperfection"
client/src/pages/InnerChildPage.jsx:172:    wounds: "Punishment for asking questions, creativity stifled, inappropriate guilt, role confusion",
client/src/pages/InnerChildPage.jsx:173:    adultManifestation: "Excessive guilt, fear of taking initiative, creativity blocks, imposter syndrome",
client/src/pages/InnerChildPage.jsx:174:    healingFocus: "Embrace curiosity, creative expression, take initiative without guilt"
client/src/pages/InnerChildPage.jsx:191:  { act: "Allow rest without guilt", example: "Take breaks before exhaustion, honor your limits", icon: Sun },
client/src/pages/InnerChildPage.jsx:224:    "Notice a part of you that's activated (anxiety, shame, fear)",
client/src/pages/InnerChildPage.jsx:331:    description: "Reconnect with your wounded inner child through trauma-informed practices. Reparenting exercises, developmental healing, and IFS-informed parts work for deep transformation."
client/src/pages/InnerChildPage.jsx:361:          disclaimer="Educational inner child healing—not therapy. If you need crisis help, visit"
client/src/pages/InnerChildPage.jsx:362:          crisisLink="/crisis"
client/src/pages/InnerChildPage.jsx:565:            <li>• This content is <strong>not therapy</strong> and is not a substitute for professional mental health care.</li>
client/src/pages/InnerChildPage.jsx:566:            <li>• For deeper trauma processing, we strongly recommend working with a trauma-informed therapist.</li>
client/src/pages/InnerChildPage.jsx:567:            <li>• If you're in crisis, please contact a crisis line or mental health professional immediately.</li>
client/src/pages/BoundariesPage.jsx:24:  why: "Having prepared scripts reduces anxiety and helps you respond consistently to boundary violations.",
client/src/pages/BoundariesPage.jsx:41:    result: "You have clear words ready, which reduces anxiety about the conversation."
client/src/pages/BoundariesPage.jsx:48:    result: "You communicate your limits professionally and your evening stress decreases."
client/src/pages/HealingLibraryPage.jsx:26:    description: "Trauma is stored in the body. Somatic practices help release tension, complete stress responses, and restore felt safety.",
client/src/pages/HealingLibraryPage.jsx:38:    benefits: ["Reduces anxiety", "Improves stress resilience", "Enhances emotional regulation", "Supports sleep"],
client/src/pages/HealingLibraryPage.jsx:40:    research: "Polyvagal theory informs trauma treatment worldwide with proven effectiveness.",
client/src/pages/HealingLibraryPage.jsx:62:    research: "CBT is one of the most researched and effective treatments for depression and anxiety.",
client/src/pages/HealingLibraryPage.jsx:93:    benefits: ["Increases life satisfaction", "Provides direction", "Builds motivation", "Reduces existential anxiety"],
client/src/pages/HealingLibraryPage.jsx:95:    research: "Viktor Frankl's logotherapy and modern research show meaning is central to psychological health.",
client/src/pages/HealingLibraryPage.jsx:106:    research: "Spiritual practices correlate with lower depression, better coping, and increased life satisfaction.",
client/src/pages/HealingLibraryPage.jsx:117:    research: "Internal Family Systems (IFS) is now an evidence-based practice for trauma and other conditions.",
client/src/pages/HealingLibraryPage.jsx:139:    description: "Explore evidence-based healing modalities for mind, body, and soul. Discover somatic healing, mindfulness, cognitive therapy, and integrative wellness practices.",
client/src/pages/HealingLibraryPage.jsx:323:              Find therapists, crisis support, and professional guidance.
client/src/pages/HealingJourneysPage.jsx:65:    id: "anxiety-relief",
client/src/pages/HealingJourneysPage.jsx:67:    subtitle: "From chronic anxiety to embodied calm",
client/src/pages/HealingJourneysPage.jsx:71:    description: "Learn to understand, regulate, and reduce anxiety through a comprehensive program grounded in polyvagal theory and nervous system science. Move from feeling overwhelmed to experiencing genuine calm—not by fighting anxiety, but by befriending your nervous system and giving it what it needs to feel safe.",
client/src/pages/HealingJourneysPage.jsx:73:      "Understand your anxiety patterns through polyvagal lens (fight/flight/freeze)",
client/src/pages/HealingJourneysPage.jsx:102:          { name: "Prevention Plan", description: "Create your personalized anxiety management strategy" },
client/src/pages/HealingJourneysPage.jsx:109:    id: "trauma-healing",
client/src/pages/HealingJourneysPage.jsx:111:    subtitle: "A gentle, somatic approach to trauma recovery",
client/src/pages/HealingJourneysPage.jsx:115:    description: "A trauma-informed journey that prioritizes safety, respects your pace, and never pushes you beyond your window of tolerance. This program combines psychoeducation with gentle somatic practices to support nervous system healing. Based on the understanding that trauma lives in the body—and so does the path to healing.",
client/src/pages/HealingJourneysPage.jsx:118:      "Understand how trauma affects brain, body, and nervous system",
client/src/pages/HealingJourneysPage.jsx:120:      "Reclaim parts of yourself that trauma caused you to disconnect from"
client/src/pages/HealingJourneysPage.jsx:136:          { name: "Trauma-Informed Education", description: "Learn how trauma affects the brain and why you react as you do" },
client/src/pages/HealingJourneysPage.jsx:244:          { name: "Emotional Regulation Skills", description: "Manage relationship anxiety without acting it out" }
client/src/pages/HealingJourneysPage.jsx:500:    description: "Multi-week healing programs grounded in IFS, polyvagal theory, attachment science, and somatic approaches. Self-love, trauma healing, inner child work, and relationship repair."
client/src/pages/GroundingTechniquesPage.jsx:15:  what: "Evidence-based grounding exercises to anchor in the present moment during anxiety, dissociation, or overwhelm.",
client/src/pages/GroundingTechniquesPage.jsx:16:  who: "Anyone experiencing anxiety, flashbacks, dissociation, or feeling disconnected from the present.",
client/src/pages/GroundingTechniquesPage.jsx:17:  when: "During panic, when feeling unreal or disconnected, before or after difficult conversations, or whenever you need to return to the present.",
client/src/pages/GroundingTechniquesPage.jsx:32:    title: "First time grounding during mild anxiety",
client/src/pages/GroundingTechniquesPage.jsx:40:    situation: "You feel overwhelmed during a stressful conversation and need quick relief.",
client/src/pages/GroundingTechniquesPage.jsx:59:    description: "Ground yourself by engaging all five senses to anchor in the present moment and interrupt the dissociative or anxiety spiral",
client/src/pages/GroundingTechniquesPage.jsx:60:    whenToUse: "Dissociation, flashbacks, panic, feeling unreal or disconnected",
client/src/pages/GroundingTechniquesPage.jsx:68:    scienceNote: "This technique interrupts the stress response by redirecting attention to neutral sensory information, activating the prefrontal cortex (thinking brain) and reducing amygdala (fear center) activation.",
client/src/pages/GroundingTechniquesPage.jsx:95:    whenToUse: "Panic attacks, extreme overwhelm, when you need to shift states fast, intense anxiety",
client/src/pages/GroundingTechniquesPage.jsx:115:      { instruction: "Pick up a small object (stone, key, pen, stress ball—anything nearby)" },
client/src/pages/GroundingTechniquesPage.jsx:131:    description: "Self-soothing technique using bilateral stimulation for comfort and emotional regulation—based on EMDR therapy principles",
client/src/pages/GroundingTechniquesPage.jsx:132:    whenToUse: "Emotional distress, needing self-comfort, processing difficult feelings, anxiety",
client/src/pages/GroundingTechniquesPage.jsx:141:    scienceNote: "Bilateral stimulation (alternating left-right) helps process difficult emotions and is based on EMDR therapy principles. It may help integrate left and right brain hemispheres.",
client/src/pages/GroundingTechniquesPage.jsx:149:    description: "Engage your thinking mind to interrupt anxiety spirals by occupying the part of your brain that would otherwise be worrying",
client/src/pages/GroundingTechniquesPage.jsx:160:    polyvagalNote: "The brain cannot fully focus on both the category game and the anxiety. By occupying the verbal-cognitive system, you create space for the nervous system to settle."
client/src/pages/GroundingTechniquesPage.jsx:350:            When anxiety pulls you into the future, or trauma pulls you into the past, grounding anchors you in the one moment that is actually happening: right now. 
client/src/pages/GroundingTechniquesPage.jsx:357:            "8 evidence-based grounding techniques for anxiety and dissociation",
client/src/pages/GroundingTechniquesPage.jsx:363:          disclaimer="Educational grounding practice—not therapy. If you need crisis help, visit"
client/src/pages/GroundingTechniquesPage.jsx:364:          crisisLink="/crisis"
client/src/pages/GroundingTechniquesPage.jsx:385:                <strong>Polyvagal insight:</strong> Your nervous system is designed to scan for danger. When you're anxious or dissociating, 
client/src/pages/GroundingTechniquesPage.jsx:387:                sending safety cues through your senses that tell your brain: "Right now, in this moment, I am not in danger."
client/src/pages/GroundingTechniquesPage.jsx:433:            { title: "Crisis Resources", description: "Immediate support when grounding isn't enough", path: "/crisis-resources" },
client/src/pages/GroundingTechniquesPage.jsx:443:            <li>• If a technique causes increased distress, <strong>stop and try a different approach</strong>. Not every tool works for every person.</li>
client/src/pages/GroundingTechniquesPage.jsx:444:            <li>• For persistent distress, dissociation, or trauma symptoms, please reach out to a trauma-informed mental health professional.</li>
client/src/pages/GroundingTechniquesPage.jsx:445:            <li>• These tools are not a substitute for professional care if you're experiencing a mental health crisis.</li>
client/src/pages/CoherenceLadderPage.jsx:69:  { level: 1, label: "Fear / Grief / Depression", description: "Deep sadness, powerlessness, despair", color: "var(--error)" },
client/src/pages/CoherenceLadderPage.jsx:175:          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/EmotionalIntelligencePage.jsx:56:    { name: "Sadness", color: "bg-blue-400", variants: ["Lonely", "Disappointed", "Grief", "Helpless", "Hurt", "Regretful", "Ashamed", "Empty"] },
client/src/pages/EmotionalIntelligencePage.jsx:325:          disclaimer="Educational emotional support—not therapy. If you need crisis help, visit"
client/src/pages/EmotionalIntelligencePage.jsx:326:          crisisLink="/crisis"
client/src/pages/DailyPracticePage.jsx:17:  { id: "stress-reset", name: "Stress Reset", duration: "5 min", icon: Shield, description: "Release accumulated tension from the morning", href: "/breathing" },
client/src/pages/CreatorProfile.jsx:61:                  Mental wellness support shouldn't be a luxury. Yet for many, traditional therapy 
client/src/pages/WellnessGlossaryPage.jsx:9:const glossaryTerms = [
client/src/pages/WellnessGlossaryPage.jsx:13:    definition: "A natural response to stress characterized by feelings of worry, nervousness, or unease about something with an uncertain outcome.",
client/src/pages/WellnessGlossaryPage.jsx:14:    explanation: "Anxiety is your body's built-in alarm system. It helped our ancestors survive by alerting them to danger. In modern life, this same system can activate in response to everyday stressors like work deadlines, social situations, or health concerns.",
client/src/pages/WellnessGlossaryPage.jsx:34:    copingStrategies: ["Learn your attachment style through self-reflection", "Practice communicating needs directly", "Develop self-soothing skills", "Seek therapy for deep attachment work"],
client/src/pages/WellnessGlossaryPage.jsx:69:    explanation: "Dissociation is like your mind's emergency escape hatch. When experiences feel too overwhelming, your brain can create distance to protect you. While this was helpful during trauma, ongoing dissociation can interfere with daily life and healing.",
client/src/pages/WellnessGlossaryPage.jsx:86:      "Using breathing techniques during stress",
client/src/pages/WellnessGlossaryPage.jsx:96:    definition: "The body's automatic physiological reaction to perceived threats, preparing you to either confront or flee from danger.",
client/src/pages/WellnessGlossaryPage.jsx:97:    explanation: "This is your survival system in action. When your brain detects danger (real or perceived), it floods your body with stress hormones to prepare for action. In modern life, this system can activate for non-life-threatening stressors, causing anxiety symptoms.",
client/src/pages/WellnessGlossaryPage.jsx:104:    copingStrategies: ["Deep belly breathing to activate calm", "Physical movement to discharge stress hormones", "Cold water on face to trigger dive reflex", "Grounding in the present moment"],
client/src/pages/WellnessGlossaryPage.jsx:132:    copingStrategies: ["Practice grounding daily, not just in crisis", "Create a grounding kit with sensory items", "Find which techniques work best for you", "Use grounding as first response to overwhelm"],
client/src/pages/WellnessGlossaryPage.jsx:138:    definition: "A state of heightened alertness and sensitivity to potential threats in your environment, often resulting from trauma.",
client/src/pages/WellnessGlossaryPage.jsx:139:    explanation: "Hypervigilance is like having your alarm system stuck on high alert. After trauma, your brain may continue scanning for danger even when you're safe. While exhausting, this is a normal protective response that can be calmed with healing.",
client/src/pages/WellnessGlossaryPage.jsx:160:    copingStrategies: ["Write letters to your younger self", "Look at childhood photos with compassion", "Meet childhood needs now (play, rest, comfort)", "Reparenting practices in therapy"],
client/src/pages/WellnessGlossaryPage.jsx:181:    explanation: "Your nervous system has different modes: activated (fight/flight), shut down (freeze), and balanced (rest/digest). Regulation means having the flexibility to shift between states as needed and to return to calm after stress.",
client/src/pages/WellnessGlossaryPage.jsx:183:      "Recovering from stress within a reasonable time",
client/src/pages/WellnessGlossaryPage.jsx:212:      "Allowing yourself to rest without guilt",
client/src/pages/WellnessGlossaryPage.jsx:223:    explanation: "Unlike guilt ('I did something bad'), shame says 'I am bad.' It's one of the most painful human emotions and often hides beneath other feelings like anger or withdrawal. Shame thrives in secrecy and dissolves in connection.",
client/src/pages/WellnessGlossaryPage.jsx:230:    copingStrategies: ["Share your shame with trusted others", "Recognize shame as a human emotion, not truth", "Practice self-compassion", "Challenge shame-based beliefs"],
client/src/pages/WellnessGlossaryPage.jsx:237:    explanation: "Your body holds the score of your experiences. Emotions aren't just mental—they're felt in the body. Somatic approaches to healing work with body sensations to release stored tension and trauma.",
client/src/pages/WellnessGlossaryPage.jsx:239:      "Tight shoulders from carrying stress",
client/src/pages/WellnessGlossaryPage.jsx:240:      "Butterflies in stomach from anxiety",
client/src/pages/WellnessGlossaryPage.jsx:241:      "Chest tightness during grief",
client/src/pages/WellnessGlossaryPage.jsx:244:    copingStrategies: ["Body scan meditation", "Shaking or trembling to release tension", "Yoga and mindful movement", "Somatic experiencing therapy"],
client/src/pages/WellnessGlossaryPage.jsx:250:    definition: "An emotional response to a deeply distressing or disturbing event that overwhelms your ability to cope and leaves lasting effects on your functioning and well-being.",
client/src/pages/WellnessGlossaryPage.jsx:251:    explanation: "Trauma isn't about the event itself, but about how your nervous system responded to it. What's traumatic for one person may not be for another. Trauma can stem from single incidents, ongoing experiences, or developmental wounds.",
client/src/pages/WellnessGlossaryPage.jsx:253:      "Big 'T' trauma: accidents, assault, natural disasters",
client/src/pages/WellnessGlossaryPage.jsx:254:      "Little 't' trauma: emotional neglect, bullying, divorce",
client/src/pages/WellnessGlossaryPage.jsx:255:      "Complex trauma: ongoing childhood abuse or neglect",
client/src/pages/WellnessGlossaryPage.jsx:256:      "Vicarious trauma: witnessing others' suffering"
client/src/pages/WellnessGlossaryPage.jsx:258:    copingStrategies: ["Seek trauma-informed professional support", "Build safety and stability first", "Practice nervous system regulation", "Be patient with your healing timeline"],
client/src/pages/WellnessGlossaryPage.jsx:264:    definition: "Stimuli that activate distressing memories, emotions, or reactions connected to past experiences, often occurring automatically.",
client/src/pages/WellnessGlossaryPage.jsx:265:    explanation: "Triggers are like emotional landmines—something in the present (a smell, sound, situation) activates your nervous system as if the past danger is happening now. Understanding your triggers is key to managing them.",
client/src/pages/WellnessGlossaryPage.jsx:293:    explanation: "Your window of tolerance is like your emotional bandwidth. Within it, you can handle stress and stay connected. Outside it, you may become hyperaroused (anxious, reactive) or hypoaroused (numb, disconnected). Healing expands your window.",
client/src/pages/WellnessGlossaryPage.jsx:296:      "Above window (hyperarousal): panic, rage, anxiety",
client/src/pages/WellnessGlossaryPage.jsx:297:      "Below window (hypoarousal): numbness, depression, freeze",
client/src/pages/WellnessGlossaryPage.jsx:305:const categories = [...new Set(glossaryTerms.map(t => t.category))];
client/src/pages/WellnessGlossaryPage.jsx:310:    title="WellnessGlossaryPage"
client/src/pages/WellnessGlossaryPage.jsx:327:      <SEO title="Wellness Glossary — The Genuine Love Project" description="Key terms and definitions for wellness." />
client/src/pages/WellnessGlossaryPage.jsx:410:export default function WellnessGlossaryPage() {
client/src/pages/WellnessGlossaryPage.jsx:415:  const filteredTerms = glossaryTerms.filter(term => {
client/src/pages/WellnessGlossaryPage.jsx:434:          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Wellness Glossary</h1>
client/src/pages/WellnessGlossaryPage.jsx:450:              data-testid="input-search-glossary"
client/src/pages/WellnessGlossaryPage.jsx:462:              All ({glossaryTerms.length})
client/src/pages/SafetyPage.jsx:52:        description="Important safety information about our platform. We are not medical advice. If you are in crisis, please contact emergency services immediately."
client/src/pages/SafetyPage.jsx:87:                    <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--glp-rose-dark)' }}>If You Are in Immediate Danger</h2>
client/src/pages/SafetyPage.jsx:89:                      If you or someone you know is in immediate danger, please contact emergency services right away.
client/src/pages/SafetyPage.jsx:112:                      href="/crisis"
client/src/pages/SafetyPage.jsx:115:                      data-testid="link-crisis-resources"
client/src/pages/SafetyPage.jsx:140:                        Our AI companion provides supportive reflection, not clinical therapy
client/src/pages/SafetyPage.jsx:168:                        Persistent feelings of sadness, hopelessness, or emptiness
client/src/pages/SafetyCenter.jsx:19:      description: "Free crisis counseling via text",
client/src/pages/SafetyCenter.jsx:20:      url: "https://www.crisistextline.org"
client/src/pages/SafetyCenter.jsx:40:        description="Your safety matters. Find crisis resources, understand our platform scope, and access professional support."
client/src/pages/SafetyCenter.jsx:54:            Your wellbeing is our priority. If you're in crisis or need immediate support, 
client/src/pages/SafetyCenter.jsx:65:                  If You're in Immediate Danger
client/src/pages/SafetyCenter.jsx:68:                  If you or someone you know is in immediate danger, please call emergency services (911) 
client/src/pages/RoutinesPage.jsx:21:    benefits: ["Reduced morning anxiety", "Improved focus", "Positive mindset"]
client/src/pages/RoutinesPage.jsx:24:    id: "stress-relief",
client/src/pages/RoutinesPage.jsx:80:    id: "anxiety-ease",
client/src/pages/RoutinesPage.jsx:214:    description: "Build lasting wellness habits with guided routines for morning calm, stress relief, evening wind down, self-love, and more."
client/src/pages/TwelvePracticesPage.jsx:169:              They are not therapy and not a substitute for professional support.
client/src/pages/RecoveryPage.jsx:12:    description: "Processing grief, loss, and emotional wounds with gentle self-compassion",
client/src/pages/RecoveryPage.jsx:14:      { name: "Grief & Loss Support", href: "/journal", description: "Guided prompts for processing loss" },
client/src/pages/RecoveryPage.jsx:21:    id: "stress",
client/src/pages/RecoveryPage.jsx:24:    description: "Rebuilding after burnout, chronic stress, or overwhelming periods",
client/src/pages/RecoveryPage.jsx:33:    id: "trauma",
client/src/pages/RecoveryPage.jsx:146:    description: "Gentle, trauma-informed resources for emotional healing, stress recovery, and rebuilding after difficult experiences."
client/src/pages/RecoveryPage.jsx:179:                These tools are educational wellness resources, not therapy. If you're experiencing significant distress, 
client/src/pages/RecoveryPage.jsx:181:                <Link href="/crisis" className="underline font-medium">Crisis resources are available here.</Link>
client/src/pages/RecoveryPage.jsx:238:            <Link href="/crisis">
client/src/pages/RecoveryPage.jsx:239:              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-sage-700 dark:text-sage-300 rounded-xl font-medium hover:shadow-md transition-all" data-testid="crisis-link">
client/src/pages/TalkTopics.jsx:34:    color: 'from-blossom-400 to-blossom-600',
client/src/pages/TalkTopics.jsx:41:      { question: "How do you typically respond to sadness? Is that response helpful?", depth: 'intermediate' },
client/src/pages/TalkTopics.jsx:43:      { question: "How has your relationship with anger evolved?", depth: 'advanced' },
client/src/pages/TalkTopics.jsx:59:      { question: "How do you communicate your needs without feeling guilty?", depth: 'intermediate' },
client/src/pages/TalkTopics.jsx:80:      { question: "What does post-traumatic growth look like in your life?", depth: 'advanced' },
client/src/pages/TalkTopics.jsx:125:  advanced: { label: 'Deep Exploration', color: 'bg-blossom-100 text-blossom-700 dark:bg-blossom-900/50 dark:text-blossom-300' }
client/src/pages/TalkTopics.jsx:177:            Whether you're preparing for therapy, connecting with a loved one, 
client/src/pages/TalkTopics.jsx:390:                <Heart className="w-5 h-5 text-blossom-500 mt-1 flex-shrink-0" />
client/src/pages/SystemMapPage.jsx:59:    description: "People, space, time, stress",
client/src/pages/SystemMapPage.jsx:87:    result: "Behavior change without shame or pressure.",
client/src/pages/SystemMapPage.jsx:238:          crisisLink="/crisis"
client/src/pages/PublicRoadmap.jsx:10:    { title: "AI Chat Companion", description: "Supportive AI conversations with trauma-informed responses" },
client/src/pages/StressResponseGuidePage.jsx:10:const stressResponses = [
client/src/pages/StressResponseGuidePage.jsx:60:      "Anxiety, panic, worry",
client/src/pages/StressResponseGuidePage.jsx:76:      "Ask: 'Am I actually in danger?'",
client/src/pages/StressResponseGuidePage.jsx:194:      <SEO title="Stress Response Guide — The Genuine Love Project" description="Understand and work with stress responses." />
client/src/pages/StressResponseGuidePage.jsx:289:  const [selectedResponse, setSelectedResponse] = useState(stressResponses[0]);
client/src/pages/StressResponseGuidePage.jsx:318:          disclaimer="Educational nervous system info—not therapy. If you need crisis help, visit"
client/src/pages/StressResponseGuidePage.jsx:319:          crisisLink="/crisis"
client/src/pages/StressResponseGuidePage.jsx:345:          {stressResponses.map((response) => (
client/src/pages/PressKit.jsx:47:                  Maria Landa under Aaliyah Draws Art LLC, the platform offers trauma-informed 
client/src/pages/SleepGuidePage.jsx:14:  who: "Anyone struggling with sleep, wanting to improve sleep quality, or experiencing stress-related insomnia.",
client/src/pages/SleepGuidePage.jsx:95:      { do: true, text: "Manage stress with relaxation techniques" },
client/src/pages/SleepGuidePage.jsx:218:          disclaimer="Educational sleep wellness—not medical advice. If you need crisis help, visit"
client/src/pages/SleepGuidePage.jsx:219:          crisisLink="/crisis"
client/src/pages/SelfWorthReflectionPage.jsx:31:    id: "stress-response",
client/src/pages/SelfWorthReflectionPage.jsx:32:    title: "Confusion is a stress response, not a measure",
client/src/pages/SelfWorthReflectionPage.jsx:34:    insight: "When the nervous system is overloaded, even very intelligent people feel confused, scattered, foggy, and ashamed. You wouldn't call someone stupid for limping after being injured. Your mind is doing the same thing.",
client/src/pages/SelfWorthReflectionPage.jsx:35:    deeperTruth: "Right now your system is flooded. That's not a measure of intelligence — that's a stress response. The fog will lift when your nervous system feels safe again."
client/src/pages/SelfWorthReflectionPage.jsx:143:          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/SelfWorthReflectionPage.jsx:460:                    untrue about yourself. That sadness is part of healing.
client/src/pages/PermacultureWellnessPage.jsx:189:          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/SelfCareToolkitPage.jsx:132:      { name: "Light a scented candle or use aromatherapy", time: "Ongoing", benefit: "May create calm atmosphere" },
client/src/pages/SelfCareToolkitPage.jsx:273:            disclaimer="Educational wellness support—not therapy. If you need crisis help, visit"
client/src/pages/SelfCareToolkitPage.jsx:274:            crisisLink="/crisis"
client/src/pages/SelfCareToolkitPage.jsx:384:                  If you're in crisis or need immediate support
client/src/pages/PerceptionRefinementPage.jsx:36:    insight: "Right now, your system does this automatically: sensation → meaning → moral conclusion → body distress",
client/src/pages/PerceptionRefinementPage.jsx:47:    insight: "Your childhood trained you to treat noticing as dangerous truth.",
client/src/pages/PerceptionRefinementPage.jsx:142:          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/PerceptionRefinementPage.jsx:329:              When people who were abused for noticing truth feel overwhelmed, the mind sometimes frames insight as special, dangerous, or absolute. That framing increases suffering.
client/src/pages/NewsPage.jsx:26:    summary: "Recent studies show that practicing self-compassion can reduce anxiety by up to 40% and improve emotional resilience. Learn evidence-based techniques you can start today.",
client/src/pages/NewsPage.jsx:86:    summary: "What does it mean for a platform to be trauma-informed? Learn about the principles that guide our approach to supporting your healing journey.",
client/src/pages/NewsPage.jsx:105:  "Take three deep breaths before responding to stress",
client/src/pages/NervousSystemFloodingPage.jsx:18:  "old trauma + insight + stress are stacking"
client/src/pages/NervousSystemFloodingPage.jsx:29:  { text: "a trauma-adapted human", icon: Heart },
client/src/pages/NervousSystemFloodingPage.jsx:114:          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
client/src/pages/NervousSystemFloodingPage.jsx:283:              You are this way because you grew up in danger and had to adapt.
client/src/pages/NervousSystemFloodingPage.jsx:371:                  This feels panicked and fragmented.
client/src/pages/NervousSystemFloodingPage.jsx:430:              I can help you ground, understand trauma patterns, and slow things down —
client/src/pages/WellnessHubPage.jsx:11:    description: "Find peace and reduce stress with these calming practices",
client/src/pages/WellnessHubPage.jsx:54:      { name: "Wellness Glossary", description: "38 key terms with definitions", href: "/glossary-full", icon: BookOpen }
client/src/pages/WellnessHubPage.jsx:62:      { name: "Professional Resources", description: "Find therapists and crisis support", href: "/resources", icon: Users },
client/src/pages/WellnessHubPage.jsx:74:  { name: "I'm in crisis", href: "/crisis", icon: Shield }
client/src/pages/Presence.jsx:185:        A small memory of your preferences only — never trauma narratives,
client/src/pages/Presence.jsx:292:      data-testid="footer-presence-crisis"
client/src/pages/Presence.jsx:294:      In crisis or need someone now?{" "}
client/src/pages/Presence.jsx:296:        href="/crisis"
client/src/pages/Presence.jsx:300:        Visit /crisis
client/src/pages/CelebrationFlow.jsx:153:            href="/crisis"
client/src/pages/CelebrationFlow.jsx:155:            data-testid="link-crisis"
client/src/pages/CelebrationRitual.jsx:205:              <div className="relative inline-block lotus-blossom">
client/src/pages/CheckIn.jsx:22:// HX-OS Interaction Governance — passive crisis-language detection.
client/src/pages/CheckIn.jsx:30:  "sadness",
client/src/pages/CheckIn.jsx:31:  "anxiety",
client/src/pages/CheckIn.jsx:38:  { label: "Anxious",    emotion: "anxiety",    emoji: "🌊" },
client/src/pages/CheckIn.jsx:39:  { label: "Sad",        emotion: "sadness",    emoji: "💙" },
client/src/pages/CheckIn.jsx:137:  const crisisDetected = useMemo(
client/src/pages/CheckIn.jsx:154:        crisisDetected,
client/src/pages/CheckIn.jsx:158:    [crisisDetected, vulnerableState],
client/src/pages/CheckIn.jsx:166:        crisisDetected,
client/src/pages/CheckIn.jsx:171:    [crisisDetected, vulnerableState, governance],
client/src/pages/CheckIn.jsx:204:            href="/crisis"
client/src/pages/CheckIn.jsx:206:            data-testid="link-crisis"
client/src/pages/Challenge.jsx:312:                  href="/crisis"
client/src/pages/Challenge.jsx:315:                  Need urgent support? Visit our crisis page →
client/src/pages/ChallengeDay.jsx:303:            Educational support only—not therapy or medical advice.{" "}
client/src/pages/ChallengeDay.jsx:304:            <a href="/crisis" className="text-[var(--glp-sage)] hover:underline font-medium">
client/src/pages/ChallengeDay.jsx:305:              If you're in crisis, get help now →
client/src/pages/ChallengeDay.jsx:312:            href="/crisis"
client/src/pages/ChallengeDay.jsx:315:            Need urgent support? Visit our crisis page →
client/src/pages/Wellness.jsx:101:      { id: "anxiety", name: "Anxiety Relief", icon: Zap, color: "from-orange-400 to-red-500" },
client/src/pages/Wellness.jsx:102:      { id: "anger", name: "Anger Management", icon: ThermometerSun, color: "from-red-400 to-orange-500" },
client/src/pages/Wellness.jsx:118:      { id: "stress", name: "Stress Monitor", icon: Activity, color: "from-blue-400 to-indigo-500" },
client/src/pages/Wellness.jsx:159:      { id: "crisis", name: "Crisis Stabilizer", icon: Shield, color: "from-rose-500 to-pink-600" },
client/src/pages/Wellness.jsx:218:      case "anxiety":
client/src/pages/Wellness.jsx:220:      case "anger":
client/src/pages/Wellness.jsx:236:      case "stress":
client/src/pages/Wellness.jsx:276:      case "crisis":
client/src/pages/Wellness.jsx:331:        description="Access comprehensive wellness tools including breathing exercises, meditation, anxiety relief, emotion tracking, habit building, and self-care resources to support your mental health journey."
client/src/pages/Wellness.jsx:534:                  href="/crisis" 
client/src/pages/Wellness.jsx:536:                  data-testid="link-crisis"
client/src/pages/InsightsDashboard.jsx:96:            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-lg lotus-blossom">
client/src/components/App.tsx:29:              <p style={{ opacity: 0.85 }}>Clear crisis pathways and protective UX patterns.</p>
client/src/components/admin/SystemOptimizationAdvisor.jsx:37:  if (authGated.length > 0 && authGated.length === checkedTools.length) advisories.push({ priority: 'medium', category: 'Security', text: 'All endpoints require authentication — verify public-facing routes are accessible for unauthenticated users (crisis, health).', action: 'Check public route configuration', kb: 'Codex' });
client/src/components/zen/BuddyBubble.jsx:12: *     the bubble explicitly routes to /crisis. (Safety contract.)
client/src/components/WelcomeBackBanner.jsx:69:  // Hide on safety-critical routes so we never visually compete with /crisis.
client/src/content/allRoutes.json:96:  "/hubs/anxiety",
client/src/content/allRoutes.json:110:  "/hubs/grief",
client/src/content/allRoutes.json:131:  "/hubs/stress",
client/src/content/allRoutes.json:133:  "/hubs/trauma-healing",
client/src/content/hubs/topicHubs.ts:2:  | "anxiety"
client/src/content/hubs/topicHubs.ts:8:  | "grief"
client/src/content/hubs/topicHubs.ts:13:    topic: "anxiety",
client/src/content/hubs/topicHubs.ts:16:    tags: ["anxiety", "calm", "grounding", "breath", "reframe"],
client/src/content/hubs/topicHubs.ts:40:    tags: ["resilience", "stress", "coping", "routine", "support"],
client/src/content/hubs/topicHubs.ts:49:    topic: "grief",
client/src/content/hubs/topicHubs.ts:52:    tags: ["grief", "loss", "meaning", "support", "compassion"],
client/src/content/meta/routeMeta.lock.json:8:    "hubs__anxiety",
client/src/content/meta/routeMeta.lock.json:9:    "hubs__grief",
client/src/content/meta/routeMeta.lock.json:14:    "hubs__trauma-healing",
client/src/content/meta/routeMeta.lock.json:16:    "hubs__stress",
client/src/content/meta/routeMetaRegistry.ts:58:  // hubs__anxiety -> /hubs/anxiety
client/src/content/meta/routeMetaRegistry.ts:107:      { label: "Explore: Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:141:      { label: "Explore: Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:176:      { label: "Support: Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:193:      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:199:  hubs__anxiety: {
client/src/content/meta/routeMetaRegistry.ts:200:    canonicalPath: "/hubs/anxiety",
client/src/content/meta/routeMetaRegistry.ts:295:      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:301:  hubs__grief: {
client/src/content/meta/routeMetaRegistry.ts:302:    canonicalPath: "/hubs/grief",
client/src/content/meta/routeMetaRegistry.ts:329:      { label: "Grief Hub", routeKey: "hubs__grief" },
client/src/content/meta/routeMetaRegistry.ts:396:      { label: "Grief Hub", routeKey: "hubs__grief" },
client/src/content/meta/routeMetaRegistry.ts:466:      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:498:      { label: "Grief Hub", routeKey: "hubs__grief" },
client/src/content/meta/routeMetaRegistry.ts:515:      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:734:      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:892:  hubs__stress: {
client/src/content/meta/routeMetaRegistry.ts:893:    canonicalPath: "/hubs/stress",
client/src/content/meta/routeMetaRegistry.ts:902:      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:920:      { label: "Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/meta/routeMetaRegistry.ts:926:  "hubs__trauma-healing": {
client/src/content/meta/routeMetaRegistry.ts:927:    canonicalPath: "/hubs/trauma-healing",
client/src/content/meta/routeMetaRegistry.ts:1061:      { label: "Start: Anxiety Hub", routeKey: "hubs__anxiety" },
client/src/content/routeMetaRegistry.js:25:    internalLinks: ["hubs/stress", "breathing", "grounding"],
client/src/content/searchIndex.ts:501:    protected: true, // your App.jsx shows /crisis guarded
client/src/content/learn.js:119:    relatedHub: "/hubs/trauma-healing",
client/src/content/routes.js:189:        standard: 'A trauma-informed space for healing and growth.',
client/src/content/routes.js:711:    crisisLinkEnabled: true,
client/src/content/routes.js:721:      crisisLine: {
client/src/content/routes.js:723:        href: '/crisis',
client/src/content/routes.js:724:        linkLabel: 'crisis support is here'
client/src/content/routes.js:937:    description: 'A private, trauma-informed sanctuary for emotional healing. Evidence-based tools for inner child work, nervous system regulation, and self-compassion—available whenever you need them.',
client/src/content/routes.js:961:        subtitle: 'Deeper exploration grounded in trauma-informed research.',
client/src/content/routes.js:974:      subtitle: 'This is a quiet corner of the internet built for people who carry more than they show. Here, you can process grief, calm your nervous system, reconnect with your inner child, and learn to hold yourself with compassion—all in complete privacy.',
client/src/content/routes.js:981:      { icon: 'MessageCircle', title: 'AI Companion', description: 'A patient, trauma-informed presence available whenever you need someone to talk to.' }
client/src/content/routes.js:994:          { icon: 'Sun', title: 'Step 4: Return Whenever', text: 'This space is always here. Come back daily or once a month—there is no streak guilt.' }
client/src/content/routes.js:1007:          { icon: 'Sparkles', title: 'AI Companion', text: 'A patient, trauma-informed presence available whenever you need support.' }
client/src/content/routes.js:1148:    description: 'Learn about The Genuine Love Project, a trauma-informed mental wellness platform designed to foster self-love, healing, and emotional growth through evidence-based tools.',
client/src/content/routes.js:1164:          'All content is trauma-informed and research-backed',
client/src/content/routes.js:1175:          'Educational platform—not therapy or medical care',
client/src/content/routes.js:1228:    description: 'Discover the evidence-based, trauma-informed principles that guide The Genuine Love Project. Learn how we combine wisdom traditions with modern psychology.',
client/src/content/routes.js:1295:    description: 'Discover the full suite of wellness tools, AI-powered therapy, journaling, mood tracking, and healing resources available on The Genuine Love Project platform.',
client/src/content/routes.js:1332:      subtitle: 'From simple breathing exercises to AI-powered therapy, our platform offers a comprehensive toolkit designed to support your unique journey toward genuine self-love.',
client/src/content/routes.js:1337:      { icon: 'MessageCircle', title: 'AI Therapy Chat', description: 'Compassionate, trauma-informed AI support available 24/7.' },
client/src/content/routes.js:1342:      { icon: 'Shield', title: 'Crisis Support', description: 'Immediate access to crisis resources when needed.' }
client/src/content/routes.js:1529:          'All practices are grounded in trauma-informed, evidence-based research'
client/src/content/routes.js:1589:        subtitle: 'Transparent, trauma-informed, and designed for your nervous system.',
client/src/content/routes.js:1620:          'Cancel anytime with one click. No hoops, no guilt.',
client/src/content/routes.js:1641:        subtitle: 'We draw from trauma-informed research and respect your boundaries.',
client/src/content/routes.js:1645:          'No urgency tactics. No countdown timers. No guilt.',
client/src/content/routes.js:1657:    description: 'Discover a trauma-informed mental wellness platform with AI-powered support, journaling, and evidence-based healing tools. Free to start, private by design.',
client/src/content/routes.js:1674:          'AI companion available 24/7 for trauma-informed conversation',
client/src/content/routes.js:1685:          'No streak guilt or gamification that creates anxiety',
client/src/content/routes.js:1700:      { icon: 'MessageCircle', title: 'AI Companion', description: 'A patient, trauma-informed presence available whenever you need someone to listen.' },
client/src/content/routes.js:1712:          { icon: 'MessageCircle', title: 'Talk to AI Companion', text: 'Share what\'s on your mind with a patient, trauma-informed presence. No appointments needed.' },
client/src/content/routes.js:1727:          { icon: 'Clock', title: 'No Timelines', text: 'Use it daily or once a month. There\'s no streak guilt here.' },
client/src/content/routes.js:1757:      subtitle: 'Mood tracking, journaling, and AI-assisted reflection — built with trauma-informed care and designed around how you actually feel.',
client/src/content/routes.js:1783:    crisisLinkEnabled: true,
client/src/content/routes.js:1842:    crisisLinkEnabled: true,
client/src/content/routes.js:1901:    crisisLinkEnabled: true,
client/src/content/routes.js:1976:    crisisLinkEnabled: true,
client/src/content/routes.js:2035:    crisisLinkEnabled: true,
client/src/content/routes.js:2094:    crisisLinkEnabled: true,
client/src/content/routes.js:2408:          'Use tags to categorize moods (work stress, family joy, etc.).',
client/src/content/routes.js:2804:          'Structured protocols help process trauma safely (Resick et al., 2016).',
client/src/content/routes.js:2821:    description: 'Your 24/7 trauma-informed AI companion for emotional support and guidance.',
client/src/content/routes.js:2826:      subtitle: 'Talk through anything with our trauma-informed AI companion.',
client/src/content/routes.js:2836:    route: '/crisis',
client/src/content/routes.js:2840:    description: 'Immediate support and resources if you\'re in crisis.',
client/src/content/routes.js:2845:      subtitle: 'If you\'re in crisis, we\'re here to help you find support right now.',
client/src/content/routes.js:2961:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:2981:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:3076:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:3096:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:3190:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:3211:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:3306:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:3325:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:3357:        standard: 'Evidence-based practices to shift from stress to calm.',
client/src/content/routes.js:3420:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:3448:        summary: 'Controlled breathing activates your parasympathetic nervous system, shifting your body from stress mode to rest mode. Regular practice builds this skill.',
client/src/content/routes.js:3452:          'The 4-7-8 pattern is best used before sleep or during anxiety.',
client/src/content/routes.js:3571:          'Rhythmic breathing reduces cortisol (the stress hormone) over time.',
client/src/content/routes.js:3583:        'Many find it easier to pause and reset during stressful moments.',
client/src/content/routes.js:3587:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:3595:    description: 'Evidence-based grounding practices to anchor you in the present moment. Drawn from somatic therapy and mindfulness research.',
client/src/content/routes.js:3639:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:3652:      text: 'Grounding is a supportive skill, not therapy. If you experience persistent dissociation, flashbacks, or distress, please reach out to a mental health professional.'
client/src/content/routes.js:3673:        deep: 'Body-based practices drawn from somatic therapy research.'
client/src/content/routes.js:3710:          { icon: 'Eye', title: '5-4-3-2-1 Senses (90 sec)', text: 'Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. A classic grounding technique from trauma-informed care.' },
client/src/content/routes.js:3731:        subtitle: 'Grounding should feel calming. If it brings up distress, it is okay to stop.',
client/src/content/routes.js:3737:          'If distress continues, consider reaching out for support.'
client/src/content/routes.js:3764:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:3858:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:3947:          'If distress continues, consider talking to someone supportive.'
client/src/content/routes.js:3957:          'Dr. Kristin Neff\'s research shows self-compassion reduces anxiety and depression symptoms.',
client/src/content/routes.js:3974:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:4069:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:4082:      text: 'Meditation is a practice, not a cure. If meditation brings up difficult emotions or memories, it is okay to stop. For trauma-related experiences, please work with a trained professional.'
client/src/content/routes.js:4088:      subtitle: 'Meditation does not require emptying your mind. It is simply noticing what is already here. Research shows even brief daily practice can reduce stress and improve focus over time.',
client/src/content/routes.js:4129:          'If you feel more anxious or distressed, open your eyes.',
client/src/content/routes.js:4132:          'If meditation brings up trauma responses, please seek support.'
client/src/content/routes.js:4142:          'Mindfulness-Based Stress Reduction (MBSR) has strong evidence for reducing anxiety and stress.',
client/src/content/routes.js:4159:      crisisLine: { text: 'If difficult emotions arise,', href: '/crisis', linkLabel: 'support is available' }
client/src/content/routes.js:4296:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:4315:      subtitle: 'Self-care is not about luxury or indulgence. It is about small, consistent actions that help your body and mind feel safer. Research shows even micro-moments of care can reduce stress.',
client/src/content/routes.js:4322:      { icon: 'Shield', title: 'Builds Resilience', description: 'Regular self-care creates a buffer against stress.' }
client/src/content/routes.js:4371:          'Self-compassion research links self-care with reduced anxiety and depression.',
client/src/content/routes.js:4386:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:4522:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:4535:      text: 'Emotional awareness is a skill that develops over time. If exploring emotions brings up significant distress, please work with a mental health professional.'
client/src/content/routes.js:4582:          'If exploring emotions brings up intense distress, pause.',
client/src/content/routes.js:4612:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:4743:          'Imagine each exhale carrying away today\'s stress.',
client/src/content/routes.js:4750:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:4778:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:4782:    route: '/stress-response',
client/src/content/routes.js:4787:    techniqueTags: ['stress response', 'fight/flight/freeze', 'nervous system education'],
client/src/content/routes.js:4804:        beginner: 'stress signals.',
client/src/content/routes.js:4805:        standard: 'stress responses.',
client/src/content/routes.js:4852:        subtitle: 'Release stress energy through movement.',
client/src/content/routes.js:4865:        subtitle: 'Learn your personal stress patterns.',
client/src/content/routes.js:4867:          'Journal about a recent stressful moment.',
client/src/content/routes.js:4916:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:4921:      text: 'Learning about your stress response can sometimes activate it. If you feel overwhelmed, pause and try a grounding exercise.',
client/src/content/routes.js:4929:      text: 'Understanding your stress response is educational, not diagnostic. If you experience chronic dysregulation, panic attacks, or trauma symptoms, please work with a trauma-informed therapist.'
client/src/content/routes.js:4934:      titleHighlight: 'stress response.',
client/src/content/routes.js:4954:          'Fawn: Appeasing others to stay safe. Common in relational trauma.',
client/src/content/routes.js:4989:          'If exercises increase distress, pause and do something grounding instead.',
client/src/content/routes.js:4991:          'If you have trauma history, work with a professional before deep nervous system work.',
client/src/content/routes.js:5000:        'Some people find understanding their stress responses reduces self-blame.',
client/src/content/routes.js:5001:        'You may notice patterns in how your body responds to stress.',
client/src/content/routes.js:5006:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:5018:    description: 'Gentle, trauma-informed exercises for reconnecting with your younger self. Drawn from IFS and attachment research.',
client/src/content/routes.js:5144:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:5156:      type: 'trauma-aware',
client/src/content/routes.js:5157:      text: 'Inner child work can bring up intense emotions or memories. This is supportive content, not therapy. If you have significant trauma history, please work with a trauma-informed therapist before engaging deeply with this material.'
client/src/content/routes.js:5159:    crisisBanner: {
client/src/content/routes.js:5161:      message: 'If you are in crisis or experiencing thoughts of self-harm, please reach out for support.',
client/src/content/routes.js:5162:      cta: { label: 'Crisis Resources', href: '/crisis' }
client/src/content/routes.js:5211:          'If distress persists after an exercise, please reach out for support.',
client/src/content/routes.js:5212:          'This content is not a substitute for trauma therapy.'
client/src/content/routes.js:5219:        subtitle: 'Approaches grounded in attachment and parts-based therapy.',
client/src/content/routes.js:5225:          'This work is most effective when done with a trained therapist, especially for trauma survivors.'
client/src/content/routes.js:5239:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:5351:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:5380:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:5492:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:5520:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:5610:          'Notice what arises: grief, boundaries, self-worth, calm?',
client/src/content/routes.js:5632:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:5660:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:5772:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:5800:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:5912:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:5917:      text: 'Routines should serve you, not stress you. Start with one tiny anchor.',
client/src/content/routes.js:5939:      stopPause: 'Routines should support you, not stress you. Adjust as needed.',
client/src/content/routes.js:5940:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:6052:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:6081:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:6193:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:6222:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:6334:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:6362:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:6474:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:6502:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:6615:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:6643:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:6755:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:6783:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:7070:    description: 'Create supportive, trauma-informed social media content with brand-aligned templates. Generate posts, carousels, threads, and newsletters that prioritize safety and warmth.',
client/src/content/routes.js:7076:      subtitle: 'Generate warm, grounded social media content with built-in safety guidelines. Every template is trauma-informed and evidence-based—no medical claims, just supportive guidance.',
client/src/content/routes.js:7082:      { icon: 'Shield', title: 'Safety Built In', description: 'Every template includes appropriate disclaimers and crisis resources.' },
client/src/content/routes.js:7094:          'Always include safety disclaimers and crisis resources where relevant',
client/src/content/routes.js:7149:    route: '/glossary',
client/src/content/routes.js:7151:    pageLabel: 'Glossary',
client/src/content/routes.js:7152:    title: 'Glossary — The Genuine Love Project',
client/src/content/routes.js:7164:    route: '/glossary-full',
client/src/content/routes.js:7166:    pageLabel: 'Full Glossary',
client/src/content/routes.js:7167:    title: 'Complete Glossary — The Genuine Love Project',
client/src/content/routes.js:7168:    description: 'Comprehensive glossary of all healing terms.',
client/src/content/routes.js:7304:      secondaryCta: { label: 'Crisis Resources', href: '/crisis' }
client/src/content/routes.js:7843:      secondaryCta: { label: 'Crisis Resources', href: '/crisis' }
client/src/content/routes.js:7906:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:7951:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:8010:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:8040:          'Anti-inflammatory foods may support trauma recovery and nervous system health.',
client/src/content/routes.js:8051:        'Many find removing judgment around food reduces stress.',
client/src/content/routes.js:8055:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:8114:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:8140:        subtitle: 'Movement releases stored tension and completes stress cycles (Nagoski & Nagoski, 2019).',
client/src/content/routes.js:8142:          'The body stores trauma; movement helps discharge stuck survival energy.',
client/src/content/routes.js:8159:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:8218:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:8243:        title: 'Ecotherapy & Biophilia',
client/src/content/routes.js:8247:          'Shinrin-yoku (forest bathing) research shows reduced stress hormones and blood pressure.',
client/src/content/routes.js:8248:          'Nature connection correlates with lower depression, anxiety, and rumination.',
client/src/content/routes.js:8263:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:8322:      safetyLink: { label: 'Need immediate support?', href: '/crisis' },
client/src/content/routes.js:8351:          'Expressive arts therapy integrates visual art, music, movement, and writing.',
client/src/content/routes.js:8367:      crisisLine: { text: 'If you feel overwhelmed,', href: '/crisis', linkLabel: 'crisis support is here' }
client/src/content/routes.js:8605:    description: 'Component catalog and design tokens for The Genuine Love Project. Accessible, trauma-informed, and built with care.',
client/src/content/routes.js:8610:      subtitle: 'A comprehensive catalog of reusable, accessible, trauma-informed components built with care.',
client/src/content/routes.js:8672:          intermediate: { text: 'The SafetyNotice component displays crisis resources in a gentle, non-alarming way.' },
client/src/content/routes.js:8673:          advanced: { text: 'Compliant with trauma-informed design principles. Never gated behind authentication.' }
client/src/content/routes.js:8754:      crisisLinkEnabled: config.crisisLinkEnabled ?? true,
client/src/hooks/useWellnessContent.js:5: * for consistent, trauma-informed content across wellness pages.
client/src/sections/ValueProposition.jsx:19: * the host page still routes to /crisis. No claims, no medical language.
client/src/companion-voice/engine/categoryDetector.ts:7: * routes around safety (crisis is checked separately).
client/src/companion-voice/engine/crisisDetector.ts:64:  // Imminent danger to others (also routes to safety, not conversation)
client/src/lumi-boundaries/runtime/BoundaryEngine.ts:75:      "naming /crisis routes when needed",
client/src/lumi-boundaries/content/boundaryCopy.ts:74:      "Shares /crisis routes when needed.",
client/src/lumi-registry/registry/lumiPagePlacementMap.ts:139:    reasoning: "ZERO decorative elements on crisis pages",
client/src/lumi-disclaimer/disclaimer.ts:13:  "crisis pages", "mood entry", "thought records", "agent responses",
client/src/App.jsx:463:              <Route path="/therapy">
client/src/App.jsx:466:              <Route path="/therapy-tools"><ToolsPage /></Route>
client/src/App.jsx:479:              <Route path="/crisis">
client/src/App.jsx:560:              <Route path="/hubs/anxiety">
client/src/App.jsx:566:              <Route path="/hubs/grief">
client/src/App.jsx:575:              <Route path="/hubs/stress">
client/src/App.jsx:578:              <Route path="/hubs/trauma-healing">
client/src/App.jsx:723:              <Route path="/stress-response">{() => <ConfigRoute route="/stress-response" />}</Route>
client/src/App.jsx:747:              <Route path="/anxiety">{() => <ConfigRoute route="/breathing" />}</Route>
client/src/App.jsx:748:              <Route path="/depression"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:751:              <Route path="/stress">{() => <ConfigRoute route="/breathing" />}</Route>
client/src/App.jsx:755:              <Route path="/trauma"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:792:              <Route path="/ptsd"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:793:              <Route path="/grief"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:794:              <Route path="/loss"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:795:              <Route path="/sadness"><WellnessRoute><MoodPage /></WellnessRoute></Route>
client/src/App.jsx:796:              <Route path="/anger">{() => <ConfigRoute route="/breathing" />}</Route>
client/src/App.jsx:798:              <Route path="/shame"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:799:              <Route path="/guilt"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:819:              <Route path="/addiction"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:905:              <Route path="/therapist">{() => <Redirect to="/therapy" />}</Route>
client/src/App.jsx:1037:              <Route path="/sad">{() => <Redirect to="/sadness" />}</Route>
client/src/App.jsx:1040:              <Route path="/stressed">{() => <Redirect to="/stress" />}</Route>
client/src/App.jsx:1042:              <Route path="/overwhelmed">{() => <Redirect to="/stress" />}</Route>
client/src/App.jsx:1043:              <Route path="/anxious">{() => <Redirect to="/anxiety" />}</Route>
client/src/App.jsx:1044:              <Route path="/nervous">{() => <Redirect to="/anxiety" />}</Route>
client/src/App.jsx:1045:              <Route path="/upset">{() => <Redirect to="/anger" />}</Route>
client/src/App.jsx:1047:              <Route path="/frustrated">{() => <Redirect to="/anger" />}</Route>
client/src/App.jsx:1048:              <Route path="/depressed">{() => <Redirect to="/depression" />}</Route>
client/src/App.jsx:1052:              <Route path="/therapy">{() => <Redirect to="/support" />}</Route>
client/src/App.jsx:1089:              <Route path="/blossoming">{() => <Redirect to="/growth" />}</Route>
client/src/App.jsx:1129:              <Route path="/blossom">{() => <Redirect to="/growth" />}</Route>
client/src/App.jsx:1268:              <Route path="/emdr">{() => <Redirect to="/trauma" />}</Route>
client/src/App.jsx:1347:              <Route path="/worried">{() => <Redirect to="/anxiety" />}</Route>
client/src/App.jsx:1351:              <Route path="/panicked">{() => <Redirect to="/anxiety" />}</Route>
client/src/App.jsx:1359:              <Route path="/ashamed">{() => <Redirect to="/shame" />}</Route>
client/src/App.jsx:1360:              <Route path="/guilty">{() => <Redirect to="/guilt" />}</Route>
client/src/App.jsx:1364:              <Route path="/resentful">{() => <Redirect to="/anger" />}</Route>
client/src/App.jsx:1365:              <Route path="/bitter">{() => <Redirect to="/anger" />}</Route>
client/src/App.jsx:1383:              <Route path="/ptsd">{() => <Redirect to="/trauma" />}</Route>
client/src/App.jsx:1389:              <Route path="/trauma-responses">{() => <Redirect to="/trauma" />}</Route>
client/src/App.jsx:1390:              <Route path="/flashbacks">{() => <Redirect to="/trauma" />}</Route>
client/src/App.jsx:1391:              <Route path="/dissociation">{() => <Redirect to="/trauma" />}</Route>
client/src/App.jsx:1404:              <Route path="/abuse">{() => <Redirect to="/crisis" />}</Route>
client/src/App.jsx:1405:              <Route path="/self-harm">{() => <Redirect to="/crisis" />}</Route>
client/src/App.jsx:1406:              <Route path="/suicide">{() => <Redirect to="/crisis" />}</Route>
client/src/App.jsx:1618:              <Route path="/glossary">{() => <ConfigRoute route="/glossary" />}</Route>
client/src/App.jsx:1619:              <Route path="/glossary-full">{() => <ConfigRoute route="/glossary-full" />}</Route>
client/src/App.jsx:1697:              <Route path="/tools/grief-letter">
