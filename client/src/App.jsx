import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ReadingLevelProvider } from "./context/ReadingLevelContext.jsx";
import RouteGuard from "./components/RouteGuard.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import SkipToContent from "./components/SkipToContent.jsx";
import { AutopilotPage } from "./pages/_autopilot.jsx";
import AgeConsentGate from "./components/AgeConsentGate.jsx";
import AdminGuard from "./components/AdminGuard.jsx";
import { routeKeyFromRoute } from "./utils/routeKey.js";

const Login = lazy(() => import("./pages/Login.jsx"));
const LoginCallback = lazy(() => import("./pages/LoginCallback.jsx"));
const CanvaLanding = lazy(() => import("./pages/CanvaLanding.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const BlogEditor = lazy(() => import("./pages/BlogEditor.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MoodPage = lazy(() => import("./pages/MoodPage.jsx"));
const StatePage = lazy(() => import("./pages/StatePage.jsx"));
const JournalPage = lazy(() => import("./pages/JournalPage.jsx"));
const AIChatPage = lazy(() => import("./pages/AIChatPage.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const CrisisResources = lazy(() => import("./pages/CrisisResources.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const Wellness = lazy(() => import("./pages/Wellness.jsx"));
const Premium = lazy(() => import("./pages/Premium.jsx"));
const SubscriberBenefitsPage = lazy(() => import("./pages/SubscriberBenefitsPage.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const Upgrade = lazy(() => import("./pages/Upgrade.jsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const DailyFlow = lazy(() => import("./features/daily/DailyFlow.tsx"));
const MirrorPage = lazy(() => import("./pages/MirrorPage.tsx"));
const CommunityPage = lazy(() => import("./features/community/SharedReflectionsPage.jsx"));
const DiscussionPage = lazy(() => import("./features/community/DiscussionPage.jsx"));
const ToolsPage = lazy(() => import("./pages/ToolsPage.jsx"));
const BreathTool = lazy(() => import("./pages/tools/BreathTool.jsx"));
const DailyRitualPage = lazy(() => import("./pages/DailyRitualPage.tsx"));
const WisdomToolsPage = lazy(() => import("./pages/WisdomToolsPage.tsx"));
const AdvancedToolsPage = lazy(() => import("./pages/AdvancedToolsPage.tsx"));
const MasteryToolsPage = lazy(() => import("./pages/MasteryToolsPage.tsx"));
const AtlasDashboard = lazy(() => import("./pages/AtlasDashboard.tsx"));
const StrategyMapsPage = lazy(() => import("./pages/StrategyMapsPage.tsx"));
const CollaborativeLabPage = lazy(() => import("./pages/CollaborativeLabPage.tsx"));
const ResilienceMetricsPage = lazy(() => import("./pages/ResilienceMetricsPage.tsx"));
const AdaptiveCompanionPage = lazy(() => import("./pages/AdaptiveCompanionPage.tsx"));
const KnowledgeSynthesisPage = lazy(() => import("./pages/KnowledgeSynthesisPage.tsx"));
const WisdomPracticesPage = lazy(() => import("./pages/WisdomPracticesPage.tsx"));
const GrowthAnalyticsPage = lazy(() => import("./pages/GrowthAnalyticsPage.tsx"));
const SleepHubPage = lazy(() => import("./pages/hubs/SleepHubPage.jsx"));
const BoundariesHubPage = lazy(() => import("./pages/hubs/BoundariesHubPage.jsx"));
const SelfWorthHubPage = lazy(() => import("./pages/hubs/SelfWorthHubPage.jsx"));
const ResilienceHubPage = lazy(() => import("./pages/hubs/ResilienceHubPage.jsx"));
const AnxietyHubPage = lazy(() => import("./pages/hubs/AnxietyHubPage.jsx"));
const RelationshipsHubPage = lazy(() => import("./pages/hubs/RelationshipsHubPage.jsx"));
const GriefHubPage = lazy(() => import("./pages/hubs/GriefHubPage.jsx"));
const SelfCompassionHubPage = lazy(() => import("./pages/hubs/SelfCompassionHubPage.jsx"));
const MindfulnessHubPage = lazy(() => import("./pages/hubs/MindfulnessHubPage.jsx"));
const StressHubPage = lazy(() => import("./pages/hubs/StressHubPage.jsx"));
const TraumaHealingHubPage = lazy(() => import("./pages/hubs/TraumaHealingHubPage.jsx"));
const EmotionalIntelligenceHubPage = lazy(() => import("./pages/hubs/EmotionalIntelligenceHubPage.jsx"));
const PersonalGrowthHubPage = lazy(() => import("./pages/hubs/PersonalGrowthHubPage.jsx"));
const InnerPeaceHubPage = lazy(() => import("./pages/hubs/InnerPeaceHubPage.jsx"));
const HubsIndexPage = lazy(() => import("./pages/hubs/HubsIndexPage.jsx"));
const HealingJourneyHubPage = lazy(() => import("./pages/hubs/HealingJourneyHubPage.jsx"));
const SelfCareHubPage = lazy(() => import("./pages/hubs/SelfCareHubPage.jsx"));
const CopingSkillsHubPage = lazy(() => import("./pages/hubs/CopingSkillsHubPage.jsx"));
const InnerWorkHubPage = lazy(() => import("./pages/hubs/InnerWorkHubPage.jsx"));
const BreathworkHubPage = lazy(() => import("./pages/hubs/BreathworkHubPage.jsx"));
const JournalingHubPage = lazy(() => import("./pages/hubs/JournalingHubPage.jsx"));
const BodyMindHubPage = lazy(() => import("./pages/hubs/BodyMindHubPage.jsx"));
const DailyPracticeHubPage = lazy(() => import("./pages/hubs/DailyPracticeHubPage.jsx"));
const GratitudeHubPage = lazy(() => import("./pages/hubs/GratitudeHubPage.jsx"));
const ThoughtworkHubPage = lazy(() => import("./pages/hubs/ThoughtworkHubPage.jsx"));
const LifePurposeHubPage = lazy(() => import("./pages/hubs/LifePurposeHubPage.jsx"));
const CommunicationHubPage = lazy(() => import("./pages/hubs/CommunicationHubPage.jsx"));
const ForgivenessHubPage = lazy(() => import("./pages/hubs/ForgivenessHubPage.jsx"));
const EnergyManagementHubPage = lazy(() => import("./pages/hubs/EnergyManagementHubPage.jsx"));
const HabitsHubPage = lazy(() => import("./pages/hubs/HabitsHubPage.jsx"));
const ConfidenceHubPage = lazy(() => import("./pages/hubs/ConfidenceHubPage.jsx"));
const FocusHubPage = lazy(() => import("./pages/hubs/FocusHubPage.jsx"));
const SpiritualityHubPage = lazy(() => import("./pages/hubs/SpiritualityHubPage.jsx"));
const MotivationHubPage = lazy(() => import("./pages/hubs/MotivationHubPage.jsx"));
const AcceptanceHubPage = lazy(() => import("./pages/hubs/AcceptanceHubPage.jsx"));
const CreativityHubPage = lazy(() => import("./pages/hubs/CreativityHubPage.jsx"));
const SelfAwarenessHubPage = lazy(() => import("./pages/hubs/SelfAwarenessHubPage.jsx"));
const NervousSystemHubPage = lazy(() => import("./pages/hubs/NervousSystemHubPage.jsx"));
const PresenceHubPage = lazy(() => import("./pages/hubs/PresenceHubPage.jsx"));
const WisdomHubPage = lazy(() => import("./pages/hubs/WisdomHubPage.jsx"));
const SelfDiscoveryHubPage = lazy(() => import("./pages/hubs/SelfDiscoveryHubPage.jsx"));
const TwelvePracticesPage = lazy(() => import("./pages/TwelvePracticesPage.jsx"));
const GuidedJournalingPage = lazy(() => import("./pages/GuidedJournalingPage.tsx"));
const InsightCardsPage = lazy(() => import("./pages/InsightCardsPage.tsx"));
const ProgressDashboardPage = lazy(() => import("./pages/ProgressDashboardPage.tsx"));
const WisdomSynthesisPage = lazy(() => import("./pages/WisdomSynthesisPage.tsx"));
const CognitiveArchitecturePage = lazy(() => import("./pages/CognitiveArchitecturePage.tsx"));
const PhilosophicalInquiryPage = lazy(() => import("./pages/PhilosophicalInquiryPage.tsx"));
const DailyWisdomOraclePage = lazy(() => import("./pages/DailyWisdomOraclePage.tsx"));
const SystemsThinkingPage = lazy(() => import("./pages/SystemsThinkingPage.tsx"));
const MetaLearningPage = lazy(() => import("./pages/MetaLearningPage.tsx"));
const ContentStudioPage = lazy(() => import("./pages/ContentStudioPage.tsx"));
const StudyVaultPage = lazy(() => import("./pages/StudyVaultPage.jsx"));
const EliteToolsDashboard = lazy(() => import("./pages/EliteToolsDashboard.tsx"));
const ContentAdminDashboard = lazy(() => import("./pages/ContentAdminDashboard.jsx"));
const CRMPage = lazy(() => import("./pages/CRMPage.jsx"));
const DashboardOverview = lazy(() => import("./pages/dashboard/Overview.jsx"));
const AdminCommandCenter = lazy(() => import("./pages/admin/CommandCenter.jsx"));
const SocialDashboard = lazy(() => import("./pages/admin/SocialDashboard.jsx"));
const SocialGenerator = lazy(() => import("./pages/admin/SocialGenerator.jsx"));
const SocialLibrary = lazy(() => import("./pages/admin/SocialLibrary.jsx"));
const SocialCalendar = lazy(() => import("./pages/admin/SocialCalendar.jsx"));
const SocialAnalytics = lazy(() => import("./pages/admin/SocialAnalytics.jsx"));
const ValuesFinderPage = lazy(() => import("./pages/ValuesFinderPage.jsx"));
const BoundariesPage = lazy(() => import("./pages/BoundariesPage.jsx"));
const MovementSnacksPage = lazy(() => import("./pages/MovementSnacksPage.jsx"));
const CoherenceLadderPage = lazy(() => import("./pages/CoherenceLadderPage.jsx"));
const PerceptionRefinementPage = lazy(() => import("./pages/PerceptionRefinementPage.jsx"));
const NervousSystemFloodingPage = lazy(() => import("./pages/NervousSystemFloodingPage.jsx"));
const PermacultureWellnessPage = lazy(() => import("./pages/PermacultureWellnessPage.jsx"));
const SelfWorthReflectionPage = lazy(() => import("./pages/SelfWorthReflectionPage.jsx"));
const Challenge = lazy(() => import("./pages/Challenge.jsx"));
const ChallengeDay = lazy(() => import("./pages/ChallengeDay.jsx"));
const AlignmentPath = lazy(() => import("./pages/AlignmentPath.jsx"));
const SystemMapPage = lazy(() => import("./pages/SystemMapPage.jsx"));
const ReframePage = lazy(() => import("./pages/tools/ReframePage.jsx"));
const TwelveStepsPage = lazy(() => import("./pages/TwelveStepsPage.tsx"));
const BehaviorChangePage = lazy(() => import("./pages/BehaviorChangePage.tsx"));

function ConfigRoute({ route }) {
  const routeKey = routeKeyFromRoute(route);
  return <AutopilotPage route={route} routeKey={routeKey} />;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  return <RouteGuard>{children}</RouteGuard>;
}

function WellnessRoute({ children }) {
  return (
    <AgeConsentGate>
      <RouteGuard>{children}</RouteGuard>
    </AgeConsentGate>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReadingLevelProvider>
          <ErrorBoundary>
            <SkipToContent />
            <main id="main-content">
            <Suspense fallback={<LoadingFallback />}>
            <Switch>
              {/* Landing & Public Pages - Config Driven */}
              <Route path="/">{() => <ConfigRoute route="/" />}</Route>
              {/* /home and /welcome are handled by server-side 301 redirects to "/" */}
              <Route path="/landing">{() => <ConfigRoute route="/landing" />}</Route>
              <Route path="/original-home">{() => <ConfigRoute route="/original-home" />}</Route>
              <Route path="/healing">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/about">{() => <ConfigRoute route="/about" />}</Route>
              <Route path="/features">{() => <ConfigRoute route="/features" />}</Route>
              <Route path="/testimonials">{() => <ConfigRoute route="/testimonials" />}</Route>
              <Route path="/canva-landing" component={CanvaLanding} />
              <Route path="/pricing">{() => <ConfigRoute route="/pricing" />}</Route>
              <Route path="/challenge" component={Challenge} />
              <Route path="/challenge/day/:dayNum" component={ChallengeDay} />

              {/* Auth Pages - Special Components */}
              <Route path="/login" component={Login} />
              <Route path="/login/callback" component={LoginCallback} />
              <Route path="/register" component={Register} />
              <Route path="/signup">{() => <ConfigRoute route="/signup" />}</Route>
              <Route path="/sign-up">{() => <ConfigRoute route="/sign-up" />}</Route>
              <Route path="/signin">{() => <ConfigRoute route="/signin" />}</Route>
              <Route path="/sign-in">{() => <ConfigRoute route="/sign-in" />}</Route>
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />

              {/* Protected Core Routes - Special Components */}
              <Route path="/dashboard">
                <ProtectedRoute><DashboardOverview /></ProtectedRoute>
              </Route>
              <Route path="/today">
                <ProtectedRoute><DailyFlow /></ProtectedRoute>
              </Route>
              <Route path="/mood">
                <WellnessRoute><MoodPage /></WellnessRoute>
              </Route>
              <Route path="/state">
                <WellnessRoute><StatePage /></WellnessRoute>
              </Route>
              <Route path="/journal">
                <WellnessRoute><JournalPage /></WellnessRoute>
              </Route>
              <Route path="/chat">
                <WellnessRoute><AIChatPage /></WellnessRoute>
              </Route>
              {/* Route renamed: /therapy → /companion (see line 243) */}
              <Route path="/ai-chat">{() => <ConfigRoute route="/ai-chat" />}</Route>
              <Route path="/analytics">
                <ProtectedRoute><Analytics /></ProtectedRoute>
              </Route>
              <Route path="/crisis">
                <CrisisResources />
              </Route>
              <Route path="/settings">
                <ProtectedRoute><Settings /></ProtectedRoute>
              </Route>
              <Route path="/wellness">
                <WellnessRoute><Wellness /></WellnessRoute>
              </Route>
              <Route path="/hubs/sleep">
                <WellnessRoute><SleepHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/boundaries">
                <WellnessRoute><BoundariesHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/self-worth">
                <WellnessRoute><SelfWorthHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/resilience">
                <WellnessRoute><ResilienceHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/anxiety">
                <WellnessRoute><AnxietyHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/relationships">
                <WellnessRoute><RelationshipsHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/grief">
                <WellnessRoute><GriefHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/self-compassion">
                <WellnessRoute><SelfCompassionHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/mindfulness">
                <WellnessRoute><MindfulnessHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/stress">
                <WellnessRoute><StressHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/trauma-healing">
                <WellnessRoute><TraumaHealingHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/emotional-intelligence">
                <WellnessRoute><EmotionalIntelligenceHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/personal-growth">
                <WellnessRoute><PersonalGrowthHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/inner-peace">
                <WellnessRoute><InnerPeaceHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs">
                <WellnessRoute><HubsIndexPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/healing-journey">
                <WellnessRoute><HealingJourneyHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/self-care">
                <WellnessRoute><SelfCareHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/coping-skills">
                <WellnessRoute><CopingSkillsHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/inner-work">
                <WellnessRoute><InnerWorkHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/breathwork">
                <WellnessRoute><BreathworkHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/journaling">
                <WellnessRoute><JournalingHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/body-mind">
                <WellnessRoute><BodyMindHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/daily-practice">
                <WellnessRoute><DailyPracticeHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/gratitude">
                <WellnessRoute><GratitudeHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/thoughtwork">
                <WellnessRoute><ThoughtworkHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/life-purpose">
                <WellnessRoute><LifePurposeHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/communication">
                <WellnessRoute><CommunicationHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/forgiveness">
                <WellnessRoute><ForgivenessHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/energy-management">
                <WellnessRoute><EnergyManagementHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/habits">
                <WellnessRoute><HabitsHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/confidence">
                <WellnessRoute><ConfidenceHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/focus">
                <WellnessRoute><FocusHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/spirituality">
                <WellnessRoute><SpiritualityHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/motivation">
                <WellnessRoute><MotivationHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/acceptance">
                <WellnessRoute><AcceptanceHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/creativity">
                <WellnessRoute><CreativityHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/self-awareness">
                <WellnessRoute><SelfAwarenessHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/nervous-system">
                <WellnessRoute><NervousSystemHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/presence">
                <WellnessRoute><PresenceHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/wisdom">
                <WellnessRoute><WisdomHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/self-discovery">
                <WellnessRoute><SelfDiscoveryHubPage /></WellnessRoute>
              </Route>
              <Route path="/twelve-practices">
                <WellnessRoute><TwelvePracticesPage /></WellnessRoute>
              </Route>
              <Route path="/paths/12-practices">
                <WellnessRoute><TwelvePracticesPage /></WellnessRoute>
              </Route>
              <Route path="/premium">
                <ProtectedRoute><Premium /></ProtectedRoute>
              </Route>
              <Route path="/upgrade">
                <ProtectedRoute><Upgrade /></ProtectedRoute>
              </Route>
              <Route path="/what-you-get">
                <ProtectedRoute><SubscriberBenefitsPage /></ProtectedRoute>
              </Route>
              <Route path="/onboarding">
                <ProtectedRoute><Onboarding /></ProtectedRoute>
              </Route>
              <Route path="/profile">
                <ProtectedRoute><Profile /></ProtectedRoute>
              </Route>
              <Route path="/billing">{() => <ConfigRoute route="/billing" />}</Route>
              <Route path="/overview">{() => <ConfigRoute route="/overview" />}</Route>
              <Route path="/insights">{() => <ConfigRoute route="/insights" />}</Route>

              {/* Wellness Pages - Config Driven */}
              <Route path="/breathing">{() => <ConfigRoute route="/breathing" />}</Route>
              <Route path="/grounding">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/meditation">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/affirmations">{() => <ConfigRoute route="/affirmations" />}</Route>
              <Route path="/self-care">{() => <ConfigRoute route="/self-care" />}</Route>
              <Route path="/calming-scenes">{() => <ConfigRoute route="/calming-scenes" />}</Route>
              <Route path="/sleep-guide">{() => <ConfigRoute route="/sleep-guide" />}</Route>
              <Route path="/stress-response">{() => <ConfigRoute route="/stress-response" />}</Route>
              <Route path="/emotional-intelligence">{() => <ConfigRoute route="/emotional-intelligence" />}</Route>

              {/* Healing Pages - Config Driven */}
              <Route path="/inner-child">{() => <ConfigRoute route="/inner-child" />}</Route>
              <Route path="/healing-library">{() => <ConfigRoute route="/healing-library" />}</Route>
              <Route path="/healing-journeys">{() => <ConfigRoute route="/healing-journeys" />}</Route>
              <Route path="/body-wellness">{() => <ConfigRoute route="/body-wellness" />}</Route>
              <Route path="/soul-wellness">{() => <ConfigRoute route="/soul-wellness" />}</Route>

              {/* Wisdom Pages - Wellness Gated */}
              <Route path="/wisdom">
                <WellnessRoute><WisdomToolsPage /></WellnessRoute>
              </Route>
              <Route path="/wisdom-practices">
                <WellnessRoute><WisdomPracticesPage /></WellnessRoute>
              </Route>
              <Route path="/wisdom-synthesis">
                <WellnessRoute><WisdomSynthesisPage /></WellnessRoute>
              </Route>
              <Route path="/daily-wisdom">
                <WellnessRoute><DailyWisdomOraclePage /></WellnessRoute>
              </Route>

              {/* Advanced Tools - Wellness Gated */}
              <Route path="/tools">
                <WellnessRoute><ToolsPage /></WellnessRoute>
              </Route>
              <Route path="/alignment-path">
                <WellnessRoute><AlignmentPath /></WellnessRoute>
              </Route>
              <Route path="/system-map">
                <WellnessRoute><SystemMapPage /></WellnessRoute>
              </Route>
              <Route path="/tools/breath">
                <WellnessRoute><BreathTool /></WellnessRoute>
              </Route>
              <Route path="/tools/reframe">
                <WellnessRoute><ReframePage /></WellnessRoute>
              </Route>
              <Route path="/advanced">
                <WellnessRoute><AdvancedToolsPage /></WellnessRoute>
              </Route>
              <Route path="/mastery">
                <WellnessRoute><MasteryToolsPage /></WellnessRoute>
              </Route>
              <Route path="/ritual">
                <WellnessRoute><DailyRitualPage /></WellnessRoute>
              </Route>
              <Route path="/atlas">
                <ProtectedRoute><AtlasDashboard /></ProtectedRoute>
              </Route>
              <Route path="/strategy-maps">
                <ProtectedRoute><StrategyMapsPage /></ProtectedRoute>
              </Route>
              <Route path="/meta-learning">
                <ProtectedRoute><MetaLearningPage /></ProtectedRoute>
              </Route>
              <Route path="/systems-thinking">
                <ProtectedRoute><SystemsThinkingPage /></ProtectedRoute>
              </Route>
              <Route path="/cognitive-architecture">
                <ProtectedRoute><CognitiveArchitecturePage /></ProtectedRoute>
              </Route>
              <Route path="/philosophical-inquiry">
                <ProtectedRoute><PhilosophicalInquiryPage /></ProtectedRoute>
              </Route>
              <Route path="/knowledge-synthesis">
                <ProtectedRoute><KnowledgeSynthesisPage /></ProtectedRoute>
              </Route>
              <Route path="/content-studio">
                <ProtectedRoute><ContentStudioPage /></ProtectedRoute>
              </Route>
              <Route path="/study-vault">
                <ProtectedRoute><StudyVaultPage /></ProtectedRoute>
              </Route>
              <Route path="/elite-tools">
                <ProtectedRoute><EliteToolsDashboard /></ProtectedRoute>
              </Route>
              <Route path="/resilience">
                <ProtectedRoute><ResilienceMetricsPage /></ProtectedRoute>
              </Route>
              <Route path="/companion">
                <ProtectedRoute><AdaptiveCompanionPage /></ProtectedRoute>
              </Route>
              <Route path="/collaborative-lab">
                <ProtectedRoute><CollaborativeLabPage /></ProtectedRoute>
              </Route>
              <Route path="/growth-analytics">
                <ProtectedRoute><GrowthAnalyticsPage /></ProtectedRoute>
              </Route>
              <Route path="/guided-journaling">
                <WellnessRoute><GuidedJournalingPage /></WellnessRoute>
              </Route>
              <Route path="/insight-cards">
                <WellnessRoute><InsightCardsPage /></WellnessRoute>
              </Route>
              <Route path="/progress">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>
              <Route path="/mirror">
                <ProtectedRoute><MirrorPage /></ProtectedRoute>
              </Route>

              {/* Community Routes */}
              <Route path="/community">
                <ProtectedRoute><CommunityPage /></ProtectedRoute>
              </Route>
              <Route path="/community/discussion/:id">
                <ProtectedRoute><DiscussionPage /></ProtectedRoute>
              </Route>
              <Route path="/social">{() => <ConfigRoute route="/social" />}</Route>

              {/* Blog & Content - Config Driven */}
              <Route path="/blog">{() => <ConfigRoute route="/blog" />}</Route>
              <Route path="/blog/:slug" component={BlogPost} />
              <Route path="/write">
                <ProtectedRoute><BlogEditor /></ProtectedRoute>
              </Route>
              <Route path="/news">{() => <ConfigRoute route="/news" />}</Route>
              <Route path="/research">{() => <ConfigRoute route="/research" />}</Route>
              <Route path="/glossary">{() => <ConfigRoute route="/glossary" />}</Route>
              <Route path="/glossary-full">{() => <ConfigRoute route="/glossary-full" />}</Route>
              <Route path="/how-to-guides">{() => <ConfigRoute route="/how-to-guides" />}</Route>
              <Route path="/daily-routines">{() => <ConfigRoute route="/daily-routines" />}</Route>
              <Route path="/cognitive-tools">{() => <ConfigRoute route="/cognitive-tools" />}</Route>
              <Route path="/behavior-change">{() => <ConfigRoute route="/behavior-change" />}</Route>
              <Route path="/wellness-hub">{() => <ConfigRoute route="/wellness-hub" />}</Route>
              <Route path="/content-index">{() => <ConfigRoute route="/content-index" />}</Route>
              <Route path="/examples">{() => <ConfigRoute route="/examples" />}</Route>
              <Route path="/professional-resources">{() => <ConfigRoute route="/professional-resources" />}</Route>

              {/* Support Pages - Config Driven */}
              <Route path="/faq">{() => <ConfigRoute route="/faq" />}</Route>
              <Route path="/support">{() => <ConfigRoute route="/support" />}</Route>
              <Route path="/resources">{() => <ConfigRoute route="/resources" />}</Route>
              <Route path="/contact">{() => <ConfigRoute route="/contact" />}</Route>
              <Route path="/help">{() => <ConfigRoute route="/help" />}</Route>
              <Route path="/support/guides">{() => <ConfigRoute route="/support/guides" />}</Route>
              <Route path="/support/feedback">{() => <ConfigRoute route="/support/feedback" />}</Route>
              <Route path="/support/accessibility">{() => <ConfigRoute route="/support/accessibility" />}</Route>

              {/* Additional Wellness Routes - Config Driven */}
              <Route path="/wellness/sleep">{() => <ConfigRoute route="/wellness/sleep" />}</Route>
              <Route path="/wellness/nutrition">{() => <ConfigRoute route="/wellness/nutrition" />}</Route>
              <Route path="/wellness/movement">{() => <ConfigRoute route="/wellness/movement" />}</Route>
              <Route path="/wellness/nature">{() => <ConfigRoute route="/wellness/nature" />}</Route>
              <Route path="/wellness/creativity">{() => <ConfigRoute route="/wellness/creativity" />}</Route>

              {/* Wellness Tools - Interactive (Age-Gated) */}
              <Route path="/tools/values">
                <WellnessRoute><ValuesFinderPage /></WellnessRoute>
              </Route>
              <Route path="/tools/boundaries">
                <WellnessRoute><BoundariesPage /></WellnessRoute>
              </Route>
              <Route path="/tools/movement-snacks">
                <WellnessRoute><MovementSnacksPage /></WellnessRoute>
              </Route>
              <Route path="/tools/coherence">
                <WellnessRoute><CoherenceLadderPage /></WellnessRoute>
              </Route>
              <Route path="/tools/perception-refinement">
                <WellnessRoute><PerceptionRefinementPage /></WellnessRoute>
              </Route>
              <Route path="/tools/nervous-system-flooding">
                <WellnessRoute><NervousSystemFloodingPage /></WellnessRoute>
              </Route>
              <Route path="/tools/permaculture">
                <WellnessRoute><PermacultureWellnessPage /></WellnessRoute>
              </Route>
              <Route path="/tools/self-worth">
                <WellnessRoute><SelfWorthReflectionPage /></WellnessRoute>
              </Route>
              <Route path="/tools/twelve-steps">
                <WellnessRoute><TwelveStepsPage /></WellnessRoute>
              </Route>
              <Route path="/tools/behavior-change">
                <WellnessRoute><BehaviorChangePage /></WellnessRoute>
              </Route>

              {/* Additional AI Routes - Config Driven */}
              <Route path="/ai/insights">
                <ProtectedRoute><ConfigRoute route="/ai/insights" /></ProtectedRoute>
              </Route>
              <Route path="/ai/coach">
                <ProtectedRoute><ConfigRoute route="/ai/coach" /></ProtectedRoute>
              </Route>
              <Route path="/ai/meditation">
                <ProtectedRoute><ConfigRoute route="/ai/meditation" /></ProtectedRoute>
              </Route>

              {/* Additional Community Routes - Config Driven */}
              <Route path="/community/events">
                <ProtectedRoute><ConfigRoute route="/community/events" /></ProtectedRoute>
              </Route>
              <Route path="/community/stories">
                <ProtectedRoute><ConfigRoute route="/community/stories" /></ProtectedRoute>
              </Route>
              <Route path="/community/mentors">
                <ProtectedRoute><ConfigRoute route="/community/mentors" /></ProtectedRoute>
              </Route>
              <Route path="/community/challenges">
                <ProtectedRoute><ConfigRoute route="/community/challenges" /></ProtectedRoute>
              </Route>

              {/* Admin Routes (require admin role) */}
              <Route path="/admin">
                <AdminGuard><AdminCommandCenter /></AdminGuard>
              </Route>
              <Route path="/admin/social">
                <AdminGuard><SocialDashboard /></AdminGuard>
              </Route>
              <Route path="/admin/social/generate">
                <AdminGuard><SocialGenerator /></AdminGuard>
              </Route>
              <Route path="/admin/social/library">
                <AdminGuard><SocialLibrary /></AdminGuard>
              </Route>
              <Route path="/admin/social/calendar">
                <AdminGuard><SocialCalendar /></AdminGuard>
              </Route>
              <Route path="/admin/social/analytics">
                <AdminGuard><SocialAnalytics /></AdminGuard>
              </Route>
              <Route path="/content-admin">
                <AdminGuard><ContentAdminDashboard /></AdminGuard>
              </Route>
              <Route path="/crm">
                <AdminGuard><CRMPage /></AdminGuard>
              </Route>
              <Route path="/control">{() => <ConfigRoute route="/control" />}</Route>
              <Route path="/health">{() => <ConfigRoute route="/health" />}</Route>
              <Route path="/publishing">{() => <ConfigRoute route="/publishing" />}</Route>
              <Route path="/qa">{() => <ConfigRoute route="/qa" />}</Route>
              <Route path="/design-system">{() => <ConfigRoute route="/design-system" />}</Route>
              <Route path="/wireframes">{() => <ConfigRoute route="/wireframes" />}</Route>
              <Route path="/design-dashboard">{() => <ConfigRoute route="/design-dashboard" />}</Route>

              {/* Legal Pages - Config Driven */}
              <Route path="/terms">{() => <ConfigRoute route="/terms" />}</Route>
              <Route path="/tos">{() => <ConfigRoute route="/tos" />}</Route>
              <Route path="/privacy">{() => <ConfigRoute route="/privacy" />}</Route>
              <Route path="/legal">{() => <ConfigRoute route="/legal" />}</Route>
              <Route path="/ethics">{() => <ConfigRoute route="/ethics" />}</Route>
              <Route path="/disclaimer">{() => <ConfigRoute route="/disclaimer" />}</Route>
              <Route path="/safety">{() => <ConfigRoute route="/safety" />}</Route>
              <Route path="/accessibility">{() => <ConfigRoute route="/accessibility" />}</Route>
              <Route path="/cookies">{() => <ConfigRoute route="/cookies" />}</Route>

              {/* Fallback - Config Driven Not Found */}
              <Route>{() => <ConfigRoute route="/not-found" />}</Route>
            </Switch>
          </Suspense>
          </main>
          </ErrorBoundary>
        </ReadingLevelProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
