import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { EmotionProvider } from "./context/EmotionContext.jsx";
import ResponsiveWrapper from "./components/ResponsiveWrapper.jsx";
import LotusGuide from "./components/LotusGuide.jsx";
import EmotionBackgroundProvider from "./components/EmotionBackgroundProvider.jsx";
import GratitudePrompt from "./components/GratitudePrompt.jsx";
import { ReadingLevelProvider } from "./context/ReadingLevelContext.jsx";
import RouteGuard from "./components/RouteGuard.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import SkipToContent from "./components/SkipToContent.jsx";
import { AutopilotPage } from "./pages/_autopilot.jsx";
import AgeConsentGate from "./components/AgeConsentGate.jsx";
import AdminGuard from "./components/AdminGuard.jsx";
import { routeKeyFromRoute } from "./utils/routeKey.js";
import ConsentBanner from "./components/ConsentBanner.jsx";
import FeedbackWidget from "./components/FeedbackWidget.jsx";
import AICompanion from "./components/AICompanion.jsx";
import AccessibilityToolbar from "./components/AccessibilityToolbar.jsx";
import './index.css'; // Your Tailwind import
const WellnessDashboard = lazy(() => import('./pages/WellnessDashboard'));

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
const ReminderScheduler = lazy(() => import("./components/ReminderScheduler.jsx"));
const VoiceSettings = lazy(() => import("./components/VoiceSettings.jsx"));
const Wellness = lazy(() => import("./pages/Wellness.jsx"));
const AffirmationWall = lazy(() => import("./pages/AffirmationWall.jsx"));
const Premium = lazy(() => import("./pages/Premium.jsx"));
const SubscriberBenefitsPage = lazy(() => import("./pages/SubscriberBenefitsPage.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Invite = lazy(() => import("./pages/Invite.jsx"));
const Upgrade = lazy(() => import("./pages/Upgrade.jsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const DailyFlow = lazy(() => import("./features/daily/DailyFlow.tsx"));
const MirrorPage = lazy(() => import("./pages/MirrorPage.tsx"));
const CommunityPage = lazy(() => import("./pages/CommunityFeed.jsx"));
const CommunityCircle = lazy(() => import("./pages/CommunityCircle.jsx"));
const InsightsDashboard = lazy(() => import("./pages/InsightsDashboard.jsx"));
const CelebrationRitual = lazy(() => import("./pages/CelebrationRitual.jsx"));
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
const AdminHealthDashboard = lazy(() => import("./pages/admin/HealthDashboard.jsx"));
const SocialDashboard = lazy(() => import("./pages/admin/SocialDashboard.jsx"));
const SocialGenerator = lazy(() => import("./pages/admin/SocialGenerator.jsx"));
const SocialLibrary = lazy(() => import("./pages/admin/SocialLibrary.jsx"));
const SocialCalendar = lazy(() => import("./pages/admin/SocialCalendar.jsx"));
const SocialAnalytics = lazy(() => import("./pages/admin/SocialAnalytics.jsx"));
const BillingViewer = lazy(() => import("./pages/admin/BillingViewer.jsx"));
const Sessions = lazy(() => import("./pages/account/Sessions.jsx"));
const DeleteAccount = lazy(() => import("./pages/account/DeleteAccount.jsx"));
const AccountProfile = lazy(() => import("./pages/account/Profile.jsx"));
const AccountSecurity = lazy(() => import("./pages/account/Security.jsx"));
const AccountBilling = lazy(() => import("./pages/account/Billing.jsx"));
const ValuesFinderPage = lazy(() => import("./pages/ValuesFinderPage.jsx"));
const ValuesPage = lazy(() => import("./pages/ValuesPage.jsx"));
const AboutApproachPage = lazy(() => import("./pages/AboutApproachPage.jsx"));
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
const SavedLibrary = lazy(() => import("./pages/library/SavedLibrary.jsx"));
const GentleProgressDashboard = lazy(() => import("./pages/dashboard/ProgressDashboard.jsx"));
const TopicHubPage = lazy(() => import("./pages/hubs/TopicHubPage.jsx"));

// Batch 11 - Personalization (P201-P210)
const PathwaysHome = lazy(() => import("./pages/pathways/PathwaysHome.jsx"));
const GoalOnboarding = lazy(() => import("./pages/pathways/GoalOnboarding.jsx"));
const Favorites = lazy(() => import("./pages/pathways/Favorites.jsx"));
const ProgressStreaks = lazy(() => import("./pages/pathways/ProgressStreaks.jsx"));
const CalmPlan = lazy(() => import("./pages/pathways/CalmPlan.jsx"));
const ValuesToActions = lazy(() => import("./pages/pathways/ValuesToActions.jsx"));
const ReflectionHistory = lazy(() => import("./pages/pathways/ReflectionHistory.jsx"));
const NotificationPreferences = lazy(() => import("./pages/preferences/NotificationPreferences.jsx"));
const SafetyPreferences = lazy(() => import("./pages/preferences/SafetyPreferences.jsx"));

// Batch 11 - Tools Expansion (P211-P220)
const CompassionBreak = lazy(() => import("./pages/tools/CompassionBreak.jsx"));
const Reframe = lazy(() => import("./pages/tools/Reframe.jsx"));
const UrgeSurf = lazy(() => import("./pages/tools/UrgeSurf.jsx"));
const GriefLetter = lazy(() => import("./pages/tools/GriefLetter.jsx"));
const RepairScript = lazy(() => import("./pages/tools/RepairScript.jsx"));
const AweMicrodose = lazy(() => import("./pages/tools/AweMicrodose.jsx"));
const BodyScan = lazy(() => import("./pages/tools/BodyScan.jsx"));
const DigitalSunset = lazy(() => import("./pages/tools/DigitalSunset.jsx"));
const MeaningMap = lazy(() => import("./pages/tools/MeaningMap.jsx"));
const CommunityCheckin = lazy(() => import("./pages/tools/CommunityCheckin.jsx"));

// Batch 11 - Admin & Content (P221-P240)
const ContentStudioAdmin = lazy(() => import("./pages/admin/ContentStudioAdmin.jsx"));
const SocialStudioAdmin = lazy(() => import("./pages/admin/SocialStudioAdmin.jsx"));
const RevenueAdmin = lazy(() => import("./pages/admin/RevenueAdmin.jsx"));

// Batch 11 - Account & Payments (P241-P250)
const Subscription = lazy(() => import("./pages/account/Subscription.jsx"));
const OrderHistory = lazy(() => import("./pages/account/OrderHistory.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const RefundHelp = lazy(() => import("./pages/help/RefundHelp.jsx"));
const LegalPage = lazy(() => import("./pages/LegalPage.jsx"));

// Batch 14 - Trust, Safety, Community, Learning (P351-P400)
const SafetyCenter = lazy(() => import("./pages/SafetyCenter.jsx"));
const DataRetention = lazy(() => import("./pages/DataRetention.jsx"));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines.jsx"));
const PublicRoadmap = lazy(() => import("./pages/PublicRoadmap.jsx"));
const CreatorProfile = lazy(() => import("./pages/CreatorProfile.jsx"));
const PressKit = lazy(() => import("./pages/PressKit.jsx"));
const CourseCatalog = lazy(() => import("./pages/CourseCatalog.jsx"));
const PracticeLibrary = lazy(() => import("./pages/PracticeLibrary.jsx"));
const RolesPermissions = lazy(() => import("./pages/admin/RolesPermissions.jsx"));

// Batch 15 - Optimization + Admin Tools (P401-P450)
const FeatureFlags = lazy(() => import("./pages/admin/FeatureFlags.jsx"));
const SystemAlerts = lazy(() => import("./pages/admin/SystemAlerts.jsx"));
const FeedbackAggregator = lazy(() => import("./pages/admin/FeedbackAggregator.jsx"));

// Batch 16 - Analytics, Community, Personalization, Wellness (P451-P500)
const EngagementDashboard = lazy(() => import("./pages/admin/EngagementDashboard.jsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.jsx"));
const WellnessGoals = lazy(() => import("./pages/WellnessGoals.jsx"));
const MeditationPlayer = lazy(() => import("./pages/tools/MeditationPlayer.jsx"));
const EmotionWheel = lazy(() => import("./pages/tools/EmotionWheel.jsx"));
const EmailDigest = lazy(() => import("./pages/settings/EmailDigest.jsx"));

// Batch 17 - Content, Engagement, AI, A11y, Performance (P501-P550)
const AIPersonality = lazy(() => import("./pages/settings/AIPersonality.jsx"));
const WeeklyReflection = lazy(() => import("./pages/tools/WeeklyReflection.jsx"));

function ConfigRoute({ route }) {
  const routeKey = routeKeyFromRoute(route);
  return <AutopilotPage route={route} routeKey={routeKey} />;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 page-entering">
      <div className="text-center space-y-6" role="status" aria-label="Loading page">
        <div className="relative mx-auto w-20 h-20">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ animation: 'spin 8s linear infinite' }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8fbf9f" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#8fbf9f" />
              </linearGradient>
            </defs>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={angle}
                cx="50"
                cy="50"
                rx="10"
                ry="24"
                fill="url(#loadingGradient)"
                fillOpacity={0.6 + (i % 3) * 0.1}
                transform={`rotate(${angle} 50 50) translate(0, -8)`}
              />
            ))}
            <circle cx="50" cy="50" r="8" fill="#d4af37" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-[#2f5d5d] dark:text-[#8fbf9f] font-medium font-serif">Preparing your space...</p>
          <p className="text-muted-foreground text-sm">A moment of peace is loading</p>
        </div>
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
        <EmotionProvider>
        <EmotionBackgroundProvider>
        <ResponsiveWrapper>
        <ReadingLevelProvider>
          <ErrorBoundary>
            <SkipToContent />
            <main id="main-content">
            <Suspense fallback={<LoadingFallback />}>
            <Switch>
              {/* Landing & Public Pages */}
              <Route path="/">
                <CanvaLanding />
              </Route>
              {/* /home and /welcome are handled by server-side 301 redirects to "/" */}
              <Route path="/landing">{() => <ConfigRoute route="/landing" />}</Route>
              <Route path="/original-home">{() => <ConfigRoute route="/original-home" />}</Route>
              <Route path="/healing">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/about">{() => <ConfigRoute route="/about" />}</Route>
              <Route path="/about/approach" component={AboutApproachPage} />
              <Route path="/values" component={ValuesPage} />
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
              <Route path="/reminders">
                <ProtectedRoute><ReminderScheduler /></ProtectedRoute>
              </Route>
              <Route path="/voice-settings">
                <ProtectedRoute><VoiceSettings /></ProtectedRoute>
              </Route>
              <Route path="/library/saved">
                <ProtectedRoute><SavedLibrary /></ProtectedRoute>
              </Route>
              <Route path="/dashboard/progress">
                <ProtectedRoute><GentleProgressDashboard /></ProtectedRoute>
              </Route>
              <Route path="/wellness">
                <WellnessRoute><Wellness /></WellnessRoute>
              </Route>
              <Route path="/affirmations">
                <AffirmationWall />
              </Route>
              <Route path="/wellness-dashboard">
                <WellnessRoute><WellnessDashboard /></WellnessRoute>
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

              {/* Batch 11 - Personalization (P201-P210) */}
              <Route path="/pathways">
                <ProtectedRoute><PathwaysHome /></ProtectedRoute>
              </Route>
              <Route path="/pathways/onboarding">
                <ProtectedRoute><GoalOnboarding /></ProtectedRoute>
              </Route>
              <Route path="/pathways/favorites">
                <ProtectedRoute><Favorites /></ProtectedRoute>
              </Route>
              <Route path="/pathways/streaks">
                <ProtectedRoute><ProgressStreaks /></ProtectedRoute>
              </Route>
              <Route path="/pathways/calm-plan">
                <ProtectedRoute><CalmPlan /></ProtectedRoute>
              </Route>
              <Route path="/pathways/values">
                <ProtectedRoute><ValuesToActions /></ProtectedRoute>
              </Route>
              <Route path="/pathways/reflections">
                <ProtectedRoute><ReflectionHistory /></ProtectedRoute>
              </Route>

              {/* Batch 11 - Public Pages (P241, P248-P249) */}
              <Route path="/pricing-page" component={PricingPage} />
              <Route path="/legal-info" component={LegalPage} />
              <Route path="/help/billing" component={RefundHelp} />

              {/* Community Routes */}
              <Route path="/community">
                <ProtectedRoute><CommunityPage /></ProtectedRoute>
              </Route>
              <Route path="/community/circle">
                <ProtectedRoute><CommunityCircle /></ProtectedRoute>
              </Route>
              <Route path="/community/discussion/:id">
                <ProtectedRoute><DiscussionPage /></ProtectedRoute>
              </Route>
              <Route path="/insights">
                <ProtectedRoute><InsightsDashboard /></ProtectedRoute>
              </Route>
              <Route path="/celebration">
                <ProtectedRoute><CelebrationRitual /></ProtectedRoute>
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
              <Route path="/contact"><Contact /></Route>
              <Route path="/about"><About /></Route>
              <Route path="/privacy"><Privacy /></Route>
              <Route path="/invite"><ProtectedRoute><Invite /></ProtectedRoute></Route>
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

              {/* Batch 11 - Tool Expansion (P211-P220) */}
              <Route path="/tools/compassion-break">
                <WellnessRoute><CompassionBreak /></WellnessRoute>
              </Route>
              <Route path="/tools/reframe-tool">
                <WellnessRoute><Reframe /></WellnessRoute>
              </Route>
              <Route path="/tools/urge-surf">
                <WellnessRoute><UrgeSurf /></WellnessRoute>
              </Route>
              <Route path="/tools/grief-letter">
                <WellnessRoute><GriefLetter /></WellnessRoute>
              </Route>
              <Route path="/tools/repair-script">
                <WellnessRoute><RepairScript /></WellnessRoute>
              </Route>
              <Route path="/tools/awe-microdose">
                <WellnessRoute><AweMicrodose /></WellnessRoute>
              </Route>
              <Route path="/tools/body-scan">
                <WellnessRoute><BodyScan /></WellnessRoute>
              </Route>
              <Route path="/tools/digital-sunset">
                <WellnessRoute><DigitalSunset /></WellnessRoute>
              </Route>
              <Route path="/tools/meaning-map">
                <WellnessRoute><MeaningMap /></WellnessRoute>
              </Route>
              <Route path="/tools/community-checkin">
                <WellnessRoute><CommunityCheckin /></WellnessRoute>
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
              <Route path="/admin/health">
                <AdminGuard><AdminHealthDashboard /></AdminGuard>
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
              <Route path="/admin/billing">
                <AdminGuard><BillingViewer /></AdminGuard>
              </Route>

              {/* Batch 11 - Admin Routes (P231-P240, P250) */}
              <Route path="/admin/content-studio">
                <AdminGuard><ContentStudioAdmin /></AdminGuard>
              </Route>
              <Route path="/admin/social-studio">
                <AdminGuard><SocialStudioAdmin /></AdminGuard>
              </Route>
              <Route path="/admin/revenue">
                <AdminGuard><RevenueAdmin /></AdminGuard>
              </Route>

              <Route path="/account/sessions">
                <ProtectedRoute><Sessions /></ProtectedRoute>
              </Route>
              <Route path="/account/delete">
                <ProtectedRoute><DeleteAccount /></ProtectedRoute>
              </Route>

              {/* Batch 11 - Account Routes (P244-P246) */}
              <Route path="/account/subscription">
                <ProtectedRoute><Subscription /></ProtectedRoute>
              </Route>
              <Route path="/account/orders">
                <ProtectedRoute><OrderHistory /></ProtectedRoute>
              </Route>
              <Route path="/account/profile">
                <ProtectedRoute><AccountProfile /></ProtectedRoute>
              </Route>
              <Route path="/account/security">
                <ProtectedRoute><AccountSecurity /></ProtectedRoute>
              </Route>
              <Route path="/account/billing">
                <ProtectedRoute><AccountBilling /></ProtectedRoute>
              </Route>
              <Route path="/preferences/notifications">
                <ProtectedRoute><NotificationPreferences /></ProtectedRoute>
              </Route>
              <Route path="/preferences/safety">
                <ProtectedRoute><SafetyPreferences /></ProtectedRoute>
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

              {/* Batch 14 - Trust, Safety, Community, Learning */}
              <Route path="/safety-center">{() => <SafetyCenter />}</Route>
              <Route path="/data-retention">{() => <DataRetention />}</Route>
              <Route path="/community-guidelines">{() => <CommunityGuidelines />}</Route>
              <Route path="/roadmap">{() => <PublicRoadmap />}</Route>
              <Route path="/our-story">{() => <CreatorProfile />}</Route>
              <Route path="/press">{() => <PressKit />}</Route>
              <Route path="/courses">{() => <CourseCatalog />}</Route>
              <Route path="/practices">{() => <PracticeLibrary />}</Route>
              <Route path="/admin/roles">{() => <ProtectedRoute><AdminGuard><RolesPermissions /></AdminGuard></ProtectedRoute>}</Route>
              <Route path="/admin/feature-flags">{() => <ProtectedRoute><AdminGuard><FeatureFlags /></AdminGuard></ProtectedRoute>}</Route>
              <Route path="/admin/alerts">{() => <ProtectedRoute><AdminGuard><SystemAlerts /></AdminGuard></ProtectedRoute>}</Route>
              <Route path="/admin/feedback">{() => <ProtectedRoute><AdminGuard><FeedbackAggregator /></AdminGuard></ProtectedRoute>}</Route>
              <Route path="/admin/engagement">{() => <ProtectedRoute><AdminGuard><EngagementDashboard /></AdminGuard></ProtectedRoute>}</Route>
              <Route path="/profile">{() => <ProtectedRoute><UserProfile /></ProtectedRoute>}</Route>
              <Route path="/goals">{() => <ProtectedRoute><WellnessGoals /></ProtectedRoute>}</Route>
              <Route path="/tools/meditation">{() => <WellnessRoute><MeditationPlayer /></WellnessRoute>}</Route>
              <Route path="/tools/emotion-wheel">{() => <WellnessRoute><EmotionWheel /></WellnessRoute>}</Route>
              <Route path="/settings/email-digest">{() => <ProtectedRoute><EmailDigest /></ProtectedRoute>}</Route>
              <Route path="/settings/ai-personality">{() => <ProtectedRoute><AIPersonality /></ProtectedRoute>}</Route>
              <Route path="/tools/weekly-reflection">{() => <WellnessRoute><WeeklyReflection /></WellnessRoute>}</Route>

              {/* Fallback - Config Driven Not Found */}
              <Route>{() => <ConfigRoute route="/not-found" />}</Route>
            </Switch>
          </Suspense>
          </main>
          <ConsentBanner />
          <FeedbackWidget />
          <AICompanion />
          <AccessibilityToolbar />
          <LotusGuide />
          <GratitudePrompt frequency="weekly" />
          </ErrorBoundary>
        </ReadingLevelProvider>
        </ResponsiveWrapper>
        </EmotionBackgroundProvider>
        </EmotionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
