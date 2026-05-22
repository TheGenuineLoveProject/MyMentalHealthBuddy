# Client Route Inventory (20260522T190303Z)

## Route components in client/
client/src/App.jsx:408:              <Route path="/">
client/src/App.jsx:412:              <Route path="/landing">{() => <ConfigRoute route="/landing" />}</Route>
client/src/App.jsx:413:              <Route path="/original-home">{() => <ConfigRoute route="/original-home" />}</Route>
client/src/App.jsx:414:              <Route path="/healing">{() => <ConfigRoute route="/healing" />}</Route>
client/src/App.jsx:415:              <Route path="/about">{() => <ConfigRoute route="/about" />}</Route>
client/src/App.jsx:416:              <Route path="/about/approach" component={AboutApproachPage} />
client/src/App.jsx:417:              <Route path="/values" component={ValuesPage} />
client/src/App.jsx:418:              <Route path="/features">{() => <ConfigRoute route="/features" />}</Route>
client/src/App.jsx:419:              <Route path="/testimonials">{() => <ConfigRoute route="/testimonials" />}</Route>
client/src/App.jsx:420:              <Route path="/canva-landing" component={CanvaLanding} />
client/src/App.jsx:421:              <Route path="/start" component={Start} />
client/src/App.jsx:422:              <Route path="/pricing" component={PricingReal} />
client/src/App.jsx:423:              <Route path="/coming-soon">{() => <ComingSoon />}</Route>
client/src/App.jsx:424:              <Route path="/challenge" component={Challenge} />
client/src/App.jsx:425:              <Route path="/challenge/day/:dayNum" component={ChallengeDay} />
client/src/App.jsx:428:              <Route path="/login" component={Login} />
client/src/App.jsx:429:              <Route path="/login/callback" component={LoginCallback} />
client/src/App.jsx:430:              <Route path="/register" component={Register} />
client/src/App.jsx:431:              <Route path="/signup" component={Register} />
client/src/App.jsx:432:              <Route path="/sign-up" component={Register} />
client/src/App.jsx:433:              <Route path="/signin" component={Login} />
client/src/App.jsx:434:              <Route path="/admin-login" component={AdminLogin} />
client/src/App.jsx:435:              <Route path="/admin/login" component={AdminLogin} />
client/src/App.jsx:436:              <Route path="/sign-in" component={Login} />
client/src/App.jsx:437:              <Route path="/forgot-password" component={ForgotPassword} />
client/src/App.jsx:438:              <Route path="/reset-password" component={ResetPassword} />
client/src/App.jsx:439:              <Route path="/create-account" component={Register} />
client/src/App.jsx:442:              <Route path="/dashboard">
client/src/App.jsx:445:              <Route path="/today">
client/src/App.jsx:448:              <Route path="/mood">
client/src/App.jsx:451:              <Route path="/state">
client/src/App.jsx:454:              <Route path="/journal">
client/src/App.jsx:457:              <Route path="/chat">
client/src/App.jsx:460:              <Route path="/ai-chat">
client/src/App.jsx:463:              <Route path="/therapy">
client/src/App.jsx:466:              <Route path="/therapy-tools"><ToolsPage /></Route>
client/src/App.jsx:467:              <Route path="/coach">
client/src/App.jsx:470:              <Route path="/mentor">
client/src/App.jsx:473:              <Route path="/sessions">
client/src/App.jsx:476:              <Route path="/analytics">
client/src/App.jsx:479:              <Route path="/crisis">
client/src/App.jsx:482:              <Route path="/settings">
client/src/App.jsx:485:              <Route path="/reminders">
client/src/App.jsx:488:              <Route path="/voice-settings">
client/src/App.jsx:491:              <Route path="/library/saved">
client/src/App.jsx:494:              <Route path="/dashboard/progress">
client/src/App.jsx:497:              <Route path="/gratitude">
client/src/App.jsx:500:              <Route path="/gratitude/hub">
client/src/App.jsx:503:              <Route path="/reflect">
client/src/App.jsx:506:              <Route path="/daily-reflection">
client/src/App.jsx:509:              <Route path="/reflections">
client/src/App.jsx:512:              <Route path="/wellness">
client/src/App.jsx:515:              <Route path="/discernment">
client/src/App.jsx:518:              <Route path="/protocols">
client/src/App.jsx:521:              <Route path="/protocols/session/:id">
client/src/App.jsx:524:              <Route path="/biometrics">
client/src/App.jsx:527:              <Route path="/admin/agents">
client/src/App.jsx:530:              <Route path="/presence"><Presence /></Route>
client/src/App.jsx:531:              <Route path="/wellness-tools-hub"><WellnessToolsHub /></Route>
client/src/App.jsx:532:              <Route path="/lumi-design-system"><DesignSystemV2 /></Route>
client/src/App.jsx:533:              <Route path="/tools/gad7"><GAD7Assessment /></Route>
client/src/App.jsx:534:              <Route path="/tools/phq9"><PHQ9Assessment /></Route>
client/src/App.jsx:535:              <Route path="/tools/distortion-checker"><CognitiveDistortionChecker /></Route>
client/src/App.jsx:536:              <Route path="/tools/breath-pacer"><BreathPacer /></Route>
client/src/App.jsx:537:              <Route path="/tools/boundary-builder"><BoundaryBuilderTool /></Route>
client/src/App.jsx:538:              <Route path="/tools/manipulation-detector"><ManipulationDetector /></Route>
client/src/App.jsx:539:              <Route path="/tools/sleep-quality-calculator"><SleepQualityCalculator /></Route>
client/src/App.jsx:540:              <Route path="/tools/nervous-system-check"><NervousSystemCheck /></Route>
client/src/App.jsx:541:              <Route path="/tools/all"><ToolsIndex /></Route>
client/src/App.jsx:542:              <Route path="/affirmations">
client/src/App.jsx:545:              <Route path="/wellness-dashboard">
client/src/App.jsx:548:              <Route path="/hubs/sleep">
client/src/App.jsx:551:              <Route path="/hubs/boundaries">
client/src/App.jsx:554:              <Route path="/hubs/self-worth">
client/src/App.jsx:557:              <Route path="/hubs/resilience">
client/src/App.jsx:560:              <Route path="/hubs/anxiety">
client/src/App.jsx:563:              <Route path="/hubs/relationships">
client/src/App.jsx:566:              <Route path="/hubs/grief">
client/src/App.jsx:569:              <Route path="/hubs/self-compassion">
client/src/App.jsx:572:              <Route path="/hubs/mindfulness">
client/src/App.jsx:575:              <Route path="/hubs/stress">
client/src/App.jsx:578:              <Route path="/hubs/trauma-healing">
client/src/App.jsx:581:              <Route path="/hubs/emotional-intelligence">
client/src/App.jsx:584:              <Route path="/hubs/personal-growth">
client/src/App.jsx:587:              <Route path="/hubs/inner-peace">
client/src/App.jsx:590:              <Route path="/hubs">
client/src/App.jsx:593:              <Route path="/explore/topics">
client/src/App.jsx:596:              <Route path="/explore/pathways">
client/src/App.jsx:599:              <Route path="/explore/search">
client/src/App.jsx:602:              <Route path="/hubs/healing-journey">
client/src/App.jsx:605:              <Route path="/hubs/self-care">
client/src/App.jsx:608:              <Route path="/hubs/coping-skills">
client/src/App.jsx:611:              <Route path="/hubs/inner-work">
client/src/App.jsx:614:              <Route path="/hubs/breathwork">
client/src/App.jsx:617:              <Route path="/hubs/journaling">
client/src/App.jsx:620:              <Route path="/hubs/body-mind">
client/src/App.jsx:623:              <Route path="/hubs/daily-practice">
client/src/App.jsx:626:              <Route path="/hubs/gratitude">
client/src/App.jsx:629:              <Route path="/hubs/thoughtwork">
client/src/App.jsx:632:              <Route path="/hubs/life-purpose">
client/src/App.jsx:635:              <Route path="/hubs/communication">
client/src/App.jsx:638:              <Route path="/hubs/forgiveness">
client/src/App.jsx:641:              <Route path="/hubs/energy-management">
client/src/App.jsx:644:              <Route path="/hubs/habits">
client/src/App.jsx:647:              <Route path="/hubs/confidence">
client/src/App.jsx:650:              <Route path="/hubs/focus">
client/src/App.jsx:653:              <Route path="/hubs/spirituality">
client/src/App.jsx:656:              <Route path="/hubs/motivation">
client/src/App.jsx:659:              <Route path="/hubs/acceptance">
client/src/App.jsx:662:              <Route path="/hubs/creativity">
client/src/App.jsx:665:              <Route path="/hubs/self-awareness">
client/src/App.jsx:668:              <Route path="/hubs/nervous-system">
client/src/App.jsx:671:              <Route path="/hubs/presence">
client/src/App.jsx:674:              <Route path="/hubs/wisdom">
client/src/App.jsx:677:              <Route path="/hubs/self-discovery">
client/src/App.jsx:680:              <Route path="/hubs/emotions">
client/src/App.jsx:683:              <Route path="/hubs/self-love">
client/src/App.jsx:686:              <Route path="/twelve-practices">
client/src/App.jsx:689:              <Route path="/paths/12-practices">
client/src/App.jsx:692:              <Route path="/premium">
client/src/App.jsx:695:              <Route path="/upgrade">
client/src/App.jsx:698:              <Route path="/what-you-get">
client/src/App.jsx:701:              <Route path="/onboarding">
client/src/App.jsx:704:              <Route path="/welcome"><OnboardingFlow /></Route>
client/src/App.jsx:705:              <Route path="/avatar-lab"><AvatarLab /></Route>
client/src/App.jsx:706:              <Route path="/rig-lab"><RigLab /></Route>
client/src/App.jsx:707:              <Route path="/motion-lab"><MotionLab /></Route>
client/src/App.jsx:708:              <Route path="/profile">
client/src/App.jsx:711:              <Route path="/billing">{() => <ConfigRoute route="/billing" />}</Route>
client/src/App.jsx:712:              <Route path="/overview">{() => <ConfigRoute route="/overview" />}</Route>
client/src/App.jsx:715:              <Route path="/breathing">{() => <ConfigRoute route="/breathing" />}</Route>
client/src/App.jsx:716:              <Route path="/grounding">{() => <ConfigRoute route="/grounding" />}</Route>
client/src/App.jsx:717:              <Route path="/meditation">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:718:              <Route path="/mindfulness">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:719:              <Route path="/affirmations">{() => <ConfigRoute route="/affirmations" />}</Route>
client/src/App.jsx:720:              <Route path="/self-care">{() => <ConfigRoute route="/self-care" />}</Route>
client/src/App.jsx:721:              <Route path="/calming-scenes">{() => <ConfigRoute route="/calming-scenes" />}</Route>
client/src/App.jsx:722:              <Route path="/sleep-guide">{() => <ConfigRoute route="/sleep-guide" />}</Route>
client/src/App.jsx:723:              <Route path="/stress-response">{() => <ConfigRoute route="/stress-response" />}</Route>
client/src/App.jsx:724:              <Route path="/emotional-intelligence">{() => <ConfigRoute route="/emotional-intelligence" />}</Route>
client/src/App.jsx:727:              <Route path="/tools/journal"><WellnessRoute><JournalPage /></WellnessRoute></Route>
client/src/App.jsx:728:              <Route path="/tools/mood"><WellnessRoute><MoodPage /></WellnessRoute></Route>
client/src/App.jsx:729:              <Route path="/tools/breathing"><BreathingTool /></Route>
client/src/App.jsx:730:              <Route path="/tools/affirmations"><AffirmationWall /></Route>
client/src/App.jsx:731:              <Route path="/tools/meditation">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:732:              <Route path="/tools/grounding">{() => <ConfigRoute route="/grounding" />}</Route>
client/src/App.jsx:733:              <Route path="/tools/self-care">{() => <ConfigRoute route="/self-care" />}</Route>
client/src/App.jsx:736:              <Route path="/daily"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
client/src/App.jsx:737:              <Route path="/practice"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
client/src/App.jsx:738:              <Route path="/exercises"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
client/src/App.jsx:739:              <Route path="/activities"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
client/src/App.jsx:740:              <Route path="/routines"><WellnessRoute><RoutinesPage /></WellnessRoute></Route>
client/src/App.jsx:741:              <Route path="/habits"><WellnessRoute><RoutinesPage /></WellnessRoute></Route>
client/src/App.jsx:742:              <Route path="/growth"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:743:              <Route path="/peacescape"><WellnessRoute><PeacescapePage /></WellnessRoute></Route>
client/src/App.jsx:744:              <Route path="/recovery"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:745:              <Route path="/reflection"><WellnessRoute><ReflectionPage /></WellnessRoute></Route>
client/src/App.jsx:746:              <Route path="/prompts"><WellnessRoute><JournalPage /></WellnessRoute></Route>
client/src/App.jsx:747:              <Route path="/anxiety">{() => <ConfigRoute route="/breathing" />}</Route>
client/src/App.jsx:748:              <Route path="/depression"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:749:              <Route path="/calm">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:750:              <Route path="/peace">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:751:              <Route path="/stress">{() => <ConfigRoute route="/breathing" />}</Route>
client/src/App.jsx:752:              <Route path="/relax">{() => <ConfigRoute route="/calming-scenes" />}</Route>
client/src/App.jsx:753:              <Route path="/emotions"><WellnessRoute><Suspense fallback={<div>Loading...</div>}><EmotionalIntelligenceHubPage /></Suspense></WellnessRoute></Route>
client/src/App.jsx:754:              <Route path="/feelings"><WellnessRoute><MoodPage /></WellnessRoute></Route>
client/src/App.jsx:755:              <Route path="/trauma"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:756:              <Route path="/love"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
client/src/App.jsx:757:              <Route path="/hope"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:758:              <Route path="/mindset"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:759:              <Route path="/sleep">{() => <ConfigRoute route="/calming-scenes" />}</Route>
client/src/App.jsx:760:              <Route path="/rest">{() => <ConfigRoute route="/calming-scenes" />}</Route>
client/src/App.jsx:761:              <Route path="/focus">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:762:              <Route path="/clarity">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:763:              <Route path="/strength"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:764:              <Route path="/courage"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:765:              <Route path="/acceptance"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:766:              <Route path="/forgiveness"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:767:              <Route path="/motivation"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:768:              <Route path="/purpose"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:769:              <Route path="/balance">{() => <ConfigRoute route="/self-care" />}</Route>
client/src/App.jsx:770:              <Route path="/energy">{() => <ConfigRoute route="/body-wellness" />}</Route>
client/src/App.jsx:771:              <Route path="/happiness"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:772:              <Route path="/joy"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:773:              <Route path="/peace-of-mind">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:774:              <Route path="/inner-peace">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:775:              <Route path="/mind">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:776:              <Route path="/body">{() => <ConfigRoute route="/body-wellness" />}</Route>
client/src/App.jsx:777:              <Route path="/soul"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:778:              <Route path="/mental-health"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:779:              <Route path="/self-help">{() => <ConfigRoute route="/self-care" />}</Route>
client/src/App.jsx:780:              <Route path="/self-improvement"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:781:              <Route path="/personal-growth"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
client/src/App.jsx:782:              <Route path="/emotional"><WellnessRoute><MoodPage /></WellnessRoute></Route>
client/src/App.jsx:783:              <Route path="/coping">{() => <ConfigRoute route="/breathing" />}</Route>
client/src/App.jsx:784:              <Route path="/nervous-system">{() => <ConfigRoute route="/grounding" />}</Route>
client/src/App.jsx:785:              <Route path="/triggers"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
client/src/App.jsx:786:              <Route path="/worry">{() => <ConfigRoute route="/breathing" />}</Route>
client/src/App.jsx:787:              <Route path="/overthinking">{() => <ConfigRoute route="/meditation" />}</Route>
client/src/App.jsx:788:              <Route path="/relaxation">{() => <ConfigRoute route="/meditation" />}</Route>

## Pages directory
client/src/pages/AboutApproachPage.jsx
client/src/pages/About.jsx
client/src/pages/account/Billing.jsx
client/src/pages/account/DeleteAccount.jsx
client/src/pages/account/OrderHistory.jsx
client/src/pages/account/Profile.jsx
client/src/pages/account/Security.jsx
client/src/pages/account/Sessions.jsx
client/src/pages/account/Settings.jsx
client/src/pages/account/Subscription.jsx
client/src/pages/AdaptiveCompanionPage.tsx
client/src/pages/admin/AdminPublishing.jsx
client/src/pages/admin/AdminPublishingToday.jsx
client/src/pages/admin/AdminSocial.jsx
client/src/pages/admin/_adminTools/AIDiagnosticsPanel.jsx
client/src/pages/admin/_adminTools/AIRepairCenter.jsx
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx
client/src/pages/admin/_adminTools/GitIntegrityScanner.jsx
client/src/pages/admin/AdminTools.jsx
client/src/pages/admin/AdminTools.jsx.phase1.bak
client/src/pages/admin/AdminTools.jsx.phase2.bak
client/src/pages/admin/_adminTools/PlatformCoverageReport.jsx
client/src/pages/admin/_adminTools/PlatformIntegrityDeepScan.jsx
client/src/pages/admin/_adminTools/PlatformIntegrityScanner.jsx
client/src/pages/admin/_adminTools/QuickDiagnostics.jsx
client/src/pages/admin/_adminToolsShared.js
client/src/pages/admin/AdminUsers.jsx
client/src/pages/admin/AnalyticsDashboard.jsx
client/src/pages/admin/AuditLogExplorer.jsx
client/src/pages/admin/BillingViewer.jsx
client/src/pages/admin/CommandCenter.jsx
client/src/pages/admin/CommandCenter.module.css
client/src/pages/admin/ContentStudioAdmin.jsx
client/src/pages/admin/EngagementDashboard.jsx
client/src/pages/admin/FeatureFlags.jsx
client/src/pages/admin/FeedbackAggregator.jsx
client/src/pages/admin/HealthDashboard.jsx
client/src/pages/Admin.jsx
client/src/pages/AdminLogin.jsx
client/src/pages/admin/NarrativeDrafts.jsx
client/src/pages/admin/NarrativeOpsConsole.jsx
client/src/pages/admin/NewsletterAdmin.jsx
client/src/pages/admin/RevenueAdmin.jsx
client/src/pages/admin/RolesPermissions.jsx
client/src/pages/admin/SecurityDashboard.jsx
client/src/pages/admin/SocialAnalytics.jsx
client/src/pages/admin/SocialCalendar.jsx
client/src/pages/admin/SocialDashboard.jsx
client/src/pages/admin/SocialGenerator.jsx
client/src/pages/admin/SocialLibrary.jsx
client/src/pages/admin/SocialStudioAdmin.jsx
client/src/pages/admin/SystemAlerts.jsx
client/src/pages/AdvancedToolsPage.tsx
client/src/pages/AffirmationsPage.jsx
client/src/pages/AffirmationWall.jsx
client/src/pages/AgentInteraction.jsx
client/src/pages/AIChatPage.tsx
client/src/pages/AlignmentPath.jsx
client/src/pages/Analytics.jsx
client/src/pages/AtlasDashboard.tsx
client/src/pages/AutopilotFallback.module.css
client/src/pages/_autopilot.jsx
client/src/pages/AvatarLab.jsx
client/src/pages/BehaviorChangePage.jsx
client/src/pages/BehaviorChangePage.tsx
client/src/pages/BiometricDashboard.jsx
client/src/pages/BlogDraftViewer.jsx
client/src/pages/BlogEditor.jsx
client/src/pages/BlogIndex.jsx
client/src/pages/Blog.jsx
client/src/pages/BlogPost.jsx
client/src/pages/BodyWellnessPage.jsx
client/src/pages/BoundariesPage.jsx
client/src/pages/BreathingExercisesPage.jsx
client/src/pages/CalmingScenesPage.jsx
client/src/pages/CanvaLanding.jsx
client/src/pages/CelebrationFlow.jsx
client/src/pages/CelebrationRitual.jsx
client/src/pages/ChallengeDay.jsx
client/src/pages/Challenge.jsx
client/src/pages/CheckIn.jsx
client/src/pages/CognitiveArchitecturePage.tsx
client/src/pages/CognitiveToolsPage.jsx
client/src/pages/CoherenceLadderPage.jsx
client/src/pages/CollaborativeLabPage.tsx
client/src/pages/ComingSoon.jsx
client/src/pages/CommunityCircle.jsx
client/src/pages/CommunityFeed.jsx
client/src/pages/CommunityGuidelines.jsx
client/src/pages/CommunityHub.jsx
client/src/pages/CommunityPage.tsx
client/src/pages/Contact.jsx
client/src/pages/ContentAdminDashboard.jsx
client/src/pages/ContentIndexPage.jsx
client/src/pages/ContentStudioPage.module.css
client/src/pages/ContentStudioPage.tsx
client/src/pages/ControlDashboard.jsx
client/src/pages/CourseCatalog.jsx
client/src/pages/CreatorProfile.jsx
client/src/pages/CrisisResources.jsx
