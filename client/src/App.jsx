import { Switch, Route, Redirect } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { EmotionProvider } from "./context/EmotionContext.jsx";
import ResponsiveWrapper from "./components/ResponsiveWrapper.jsx";
import EmotionBackgroundProvider from "./components/EmotionBackgroundProvider.jsx";
// v5.8.35 perf: GratitudePrompt lazy — global widget, mounts on every page but
// rarely used; no need to block initial render.
const GratitudePrompt = lazy(() => import("./components/GratitudePrompt.jsx"));
import { ReadingLevelProvider } from "./context/ReadingLevelContext.jsx";
import { ReducedMotionProvider } from "./components/a11y/ReducedMotionProvider.jsx";
import { GamificationProvider } from "./context/GamificationContext.jsx";
import RouteGuard from "./components/RouteGuard.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { SafeBoundary } from "./components/SafeBoundary.jsx";
import SkipToContent from "./components/SkipToContent.jsx";
const AutopilotPage = lazy(() =>
  import("./pages/_autopilot.jsx").then((m) => ({
    default: m.AutopilotPage || m.default,
  }))
);
import AgeConsentGate from "./components/AgeConsentGate.jsx";
import AdminGuard from "./components/AdminGuard.jsx";
import { routeKeyFromRoute } from "./utils/routeKey.js";
// v5.8.35 perf: defer heavy global widgets — none are needed for first paint.
const ConsentBanner = lazy(() => import("./components/ConsentBanner.jsx"));
const FeedbackWidget = lazy(() => import("./components/FeedbackWidget.jsx"));
const WelcomeBackBanner = lazy(() => import("./components/WelcomeBackBanner.jsx"));
const ReturnLoop = lazy(() => import("./components/ReturnLoop.jsx"));
const MicroWinPrompt = lazy(() => import("./components/MicroWinPrompt.jsx"));
import { FeatureFlagProvider } from "./contexts/FeatureFlagContext.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
// v5.8.35 perf: AnalyticsDashboard is admin-only — never needed eagerly.
const AnalyticsDashboard = lazy(() => import("./pages/admin/AnalyticsDashboard.jsx"));
import { usePageViewTracker } from "./hooks/useAnalytics.mjs";
// v5.8.35 perf: AICompanion (393 lines) + AccessibilityToolbar (208) deferred.
const AICompanion = lazy(() => import("./components/AICompanion.jsx"));
const AccessibilityToolbar = lazy(() => import("./components/AccessibilityToolbar.jsx"));
import ToastContainer from "./components/ui/toast-container";
import './index.css'; // Your Tailwind import
const WellnessDashboard = lazy(() => import('./pages/WellnessDashboard'));

const Login = lazy(() => import("./pages/Login.jsx"));
const LoginCallback = lazy(() => import("./pages/LoginCallback.jsx"));
const CanvaLanding = lazy(() => import("./pages/CanvaLanding.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const Start = lazy(() => import("./pages/Start.tsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const BlogEditor = lazy(() => import("./pages/BlogEditor.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const BlogIndex = lazy(() => import("./pages/BlogIndex.jsx"));
const MoodPage = lazy(() => import("./pages/MoodPage.jsx"));
const StatePage = lazy(() => import("./pages/StatePage.jsx"));
const JournalPage = lazy(() => import("./pages/JournalPage.jsx"));
const ReflectionPage = lazy(() => import("./pages/Reflection.jsx"));
const DailyReflection = lazy(() => import("./pages/DailyReflection.jsx"));
const AIChatPage = lazy(() => import("./pages/AIChatPage.tsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const CrisisResources = lazy(() => import("./pages/CrisisResources.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const ReminderScheduler = lazy(() => import("./components/ReminderScheduler.jsx"));
const VoiceSettings = lazy(() => import("./components/VoiceSettings.jsx"));
const Wellness = lazy(() => import("./pages/Wellness.jsx"));
const AffirmationWall = lazy(() => import("./pages/AffirmationWall.jsx"));
const TalkTopics = lazy(() => import("./pages/TalkTopics.jsx"));
const Premium = lazy(() => import("./pages/Premium.jsx"));
const SubscriberBenefitsPage = lazy(() => import("./pages/SubscriberBenefitsPage.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const FAQPage = lazy(() => import("./pages/FAQPage.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Invite = lazy(() => import("./pages/Invite.jsx"));
const Upgrade = lazy(() => import("./pages/Upgrade.jsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const OnboardingFlow = lazy(() => import("./pages/OnboardingFlow.jsx"));
const AvatarLab = lazy(() => import("./pages/AvatarLab.jsx"));
const RigLab = lazy(() => import("./pages/RigLab.jsx"));
const MotionLab = lazy(() => import("./pages/MotionLab.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const DailyFlow = lazy(() => import("./features/daily/DailyFlow.tsx"));
const MirrorPage = lazy(() => import("./pages/MirrorPage.tsx"));
const DiscernmentDashboard = lazy(() => import("./pages/DiscernmentDashboard.jsx"));
const ProtocolBrowser = lazy(() => import("./pages/ProtocolBrowser.jsx"));
const ProtocolSession = lazy(() => import("./pages/ProtocolSession.jsx"));
const BiometricDashboard = lazy(() => import("./pages/BiometricDashboard.jsx"));
const AgentInteraction = lazy(() => import("./pages/AgentInteraction.jsx"));
const WellnessToolsHub = lazy(() => import("./pages/WellnessToolsHub.jsx"));
const DesignSystemV2 = lazy(() => import("./pages/DesignSystemV2.jsx"));
const GAD7Assessment = lazy(() => import("./pages/tools/GAD7Assessment.jsx"));
const PHQ9Assessment = lazy(() => import("./pages/tools/PHQ9Assessment.jsx"));
const CognitiveDistortionChecker = lazy(() => import("./pages/tools/CognitiveDistortionChecker.jsx"));
const BreathPacer = lazy(() => import("./pages/tools/BreathPacer.jsx"));
const BoundaryBuilderTool = lazy(() => import("./pages/tools/BoundaryBuilderTool.jsx"));
const ManipulationDetector = lazy(() => import("./pages/tools/ManipulationDetector.jsx"));
const SleepQualityCalculator = lazy(() => import("./pages/tools/SleepQualityCalculator.jsx"));
const NervousSystemCheck = lazy(() => import("./pages/tools/NervousSystemCheck.jsx"));
const ToolsIndex = lazy(() => import("./pages/tools/index.jsx"));
const CommunityPage = lazy(() => import("./pages/CommunityFeed.jsx"));
const CommunityHub = lazy(() => import("./pages/CommunityHub.jsx"));
const CommunityCircle = lazy(() => import("./pages/CommunityCircle.jsx"));
const InsightsDashboard = lazy(() => import("./pages/InsightsDashboard.jsx"));
const CelebrationRitual = lazy(() => import("./pages/CelebrationRitual.jsx"));
const DiscussionPage = lazy(() => import("./features/community/DiscussionPage.jsx"));
const ToolsPage = lazy(() => import("./pages/ToolsPage.jsx"));
const BreathTool = lazy(() => import("./pages/tools/BreathTool.jsx"));
const BreathingTool = lazy(() => import("./pages/tools/BreathingTool.jsx"));
const CheckIn = lazy(() => import("./pages/CheckIn.jsx"));
const CelebrationFlow = lazy(() => import("./pages/CelebrationFlow.jsx"));
const LumiV6Preview = lazy(() => import("./pages/LumiV6Preview.jsx"));
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
const DailyPracticePage = lazy(() => import("./pages/DailyPracticePage.jsx"));
const RoutinesPage = lazy(() => import("./pages/RoutinesPage.jsx"));
const GrowthPage = lazy(() => import("./pages/GrowthPage.jsx"));
const PeacescapePage = lazy(() => import("./pages/PeacescapePage.jsx"));
const RecoveryPage = lazy(() => import("./pages/RecoveryPage.jsx"));
const SelfLovePage = lazy(() => import("./pages/SelfLovePage.jsx"));
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
const GratitudePractice = lazy(() => import("./pages/GratitudePractice.jsx"));
const LearnHub = lazy(() => import("./pages/LearnHub.jsx"));
const LearnGuides = lazy(() => import("./pages/LearnGuides.jsx"));
const LearnArticles = lazy(() => import("./pages/LearnArticles.jsx"));
const LearnGuideDetail = lazy(() => import("./pages/LearnDetail.jsx").then(m => ({ default: m.LearnGuideDetail })));
const LearnArticleDetail = lazy(() => import("./pages/LearnDetail.jsx").then(m => ({ default: m.LearnArticleDetail })));
const ThoughtworkHubPage = lazy(() => import("./pages/hubs/ThoughtworkHubPage.jsx"));
const LifePurposeHubPage = lazy(() => import("./pages/hubs/LifePurposeHubPage.jsx"));
const CommunicationHubPage = lazy(() => import("./pages/hubs/CommunicationHubPage.jsx"));
const ForgivenessHubPage = lazy(() => import("./pages/hubs/ForgivenessHubPage.jsx"));
const EnergyManagementHubPage = lazy(() => import("./pages/hubs/EnergyManagementHubPage.jsx"));
const HabitsHubPage = lazy(() => 
import("./pages/hubs/HabitsHubPage.jsx"));
const ConfidenceHubPage = lazy(() => import("./pages/hubs/ConfidenceHubPage.jsx"));
const AboutPage = lazy(() => import("./pages/About.jsx"));
const FeaturesPage = lazy(() => import("./pages/Features.jsx"));
const HealingPage = lazy(() => import("./pages/Healing.jsx"));
const WellbeingPage = lazy(() => import("./pages/Wellbeing.jsx"));
const MentalWellnessPage = lazy(() => import("./pages/MentalWellness.jsx"));
const SelfLoveCanonical = lazy(() => import("./pages/SelfLove.jsx"));
const GrowthCanonical = lazy(() => import("./pages/Growth.jsx"));
const MindfulnessCanonical = lazy(() => import("./pages/Mindfulness.jsx"));
const ResilienceCanonical = lazy(() => import("./pages/Resilience.jsx"));
const AnxietyCanonical = lazy(() => import("./pages/Anxiety.jsx"));
const DepressionCanonical = lazy(() => import("./pages/Depression.jsx"));
const TrustCenterPage = lazy(() =>
  import("./pages/trust/TrustCenterPage.jsx")
);
const AITransparencyPage = lazy(() =>
  import("./pages/trust/AITransparencyPage.jsx")
);
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
const NarrativeOpsConsole = lazy(() => import("./pages/admin/NarrativeOpsConsole.jsx"));
const AdminSocial = lazy(() => import("./pages/admin/AdminSocial.jsx"));
const SocialGenerator = lazy(() => import("./pages/admin/SocialGenerator.jsx"));
const SocialLibrary = lazy(() => import("./pages/admin/SocialLibrary.jsx"));
const SocialCalendar = lazy(() => import("./pages/admin/SocialCalendar.jsx"));
const SocialAnalytics = lazy(() => import("./pages/admin/SocialAnalytics.jsx"));
const SocialHub = lazy(() => import("./pages/SocialHub.jsx"));
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
const NewsletterAdmin = lazy(() => import("./pages/admin/NewsletterAdmin.jsx"));
const AdminPublishing = lazy(() => import("./pages/admin/AdminPublishing.jsx"));
const AdminPublishingToday = lazy(() => import("./pages/admin/AdminPublishingToday.jsx"));
const BlogDraftViewer = lazy(() => import("./pages/BlogDraftViewer.jsx"));
const RevenueAdmin = lazy(() => import("./pages/admin/RevenueAdmin.jsx"));

// Batch 11 - Account & Payments (P241-P250)
const Subscription = lazy(() => import("./pages/account/Subscription.jsx"));
const OrderHistory = lazy(() => import("./pages/account/OrderHistory.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const PricingReal = lazy(() => import("./pages/Pricing.jsx"));
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
const NarrativeDrafts = lazy(() => import("./pages/admin/NarrativeDrafts.jsx"));
const SecurityDashboard = lazy(() => import("./pages/admin/SecurityDashboard.jsx"));
const AuditLogExplorer = lazy(() => import("./pages/admin/AuditLogExplorer.jsx"));

// Batch 16 - Analytics, Community, Personalization, Wellness (P451-P500)
const EngagementDashboard = lazy(() => import("./pages/admin/EngagementDashboard.jsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.jsx"));
const AdminTools = lazy(() => import("./pages/admin/AdminTools.jsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.jsx"));
const WellnessGoals = lazy(() => import("./pages/WellnessGoals.jsx"));
const MeditationPlayer = lazy(() => import("./pages/tools/MeditationPlayer.jsx"));
const EmotionWheel = lazy(() => import("./pages/tools/EmotionWheel.jsx"));
const EmailDigest = lazy(() => import("./pages/settings/EmailDigest.jsx"));

// Batch 17 - Content, Engagement, AI, A11y, Performance (P501-P550)
const AIPersonality = lazy(() => import("./pages/settings/AIPersonality.jsx"));
const WeeklyReflection = lazy(() => import("./pages/tools/WeeklyReflection.jsx"));
const Presence = lazy(() => import("./pages/Presence.jsx"));

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

function PageViewTracker() {
  usePageViewTracker();
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReducedMotionProvider>
      <AuthProvider>
        <FeatureFlagProvider>
        <GamificationProvider>
        <EmotionProvider>
        <EmotionBackgroundProvider>
        <ResponsiveWrapper>
        <ReadingLevelProvider>
          <ErrorBoundary>
            <PageViewTracker />
            <SkipToContent />
            {/* v5.8.35 perf: ReturnLoop/MicroWinPrompt/WelcomeBackBanner are
                lazy now — wrap in Suspense so React doesn't throw "suspended
                outside of a Suspense boundary" on first hydration. */}
            <SafeBoundary label="ReturnLoop">
              <Suspense fallback={null}>
                <ReturnLoop />
              </Suspense>
            </SafeBoundary>
            <SafeBoundary label="MicroWinPrompt">
              <Suspense fallback={null}>
                <MicroWinPrompt />
              </Suspense>
            </SafeBoundary>
            <main id="main-content">
            <SafeBoundary label="WelcomeBackBanner">
              <Suspense fallback={null}>
                <WelcomeBackBanner />
              </Suspense>
            </SafeBoundary>
            <SafeBoundary label="Route">
            <Suspense fallback={<LoadingFallback />}>
            <Switch>
              {/* Landing & Public Pages */}
              <Route path="/">
                <CanvaLanding />
              </Route>
              {/* /home and /welcome are handled by server-side 301 redirects to "/" */}
              <Route path="/landing">{() => <ConfigRoute route="/landing" />}</Route>
              <Route path="/original-home">{() => <ConfigRoute route="/original-home" />}</Route>
              <Route path="/healing" component={HealingPage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/about/approach" component={AboutApproachPage} />
              <Route path="/values" component={ValuesPage} />
              <Route path="/features" component={FeaturesPage} />
              <Route path="/testimonials">{() => <ConfigRoute route="/testimonials" />}</Route>
              <Route path="/canva-landing" component={CanvaLanding} />
              <Route path="/start" component={Start} />
              <Route path="/pricing" component={PricingReal} />
              <Route path="/coming-soon">{() => <ComingSoon />}</Route>
              <Route path="/challenge" component={Challenge} />
              <Route path="/challenge/day/:dayNum" component={ChallengeDay} />

              {/* Auth Pages - Special Components */}
              <Route path="/login" component={Login} />
              <Route path="/login/callback" component={LoginCallback} />
              <Route path="/register" component={Register} />
              <Route path="/signup" component={Register} />
              <Route path="/signin" component={Login} />
              <Route path="/admin-login" component={AdminLogin} />
              <Route path="/sign-in" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/create-account" component={Register} />

              {/* Protected Core Routes - Special Components */}
              <Route path="/dashboard">
                <ProtectedRoute><DashboardOverview /></ProtectedRoute>
              </Route>
              <Route path="/today">
                <ProtectedRoute><DailyFlow /></ProtectedRoute>
              </Route>
              <Route path="/mood">
                <AgeConsentGate><MoodPage /></AgeConsentGate>
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
              <Route path="/ai-chat">
                <WellnessRoute><AIChatPage /></WellnessRoute>
              </Route>
              <Route path="/therapy">
                <WellnessRoute><AIChatPage /></WellnessRoute>
              </Route>
              <Route path="/therapy-tools"><ToolsPage /></Route>
              <Route path="/coach">
                <WellnessRoute><AIChatPage /></WellnessRoute>
              </Route>
              <Route path="/mentor">
                <WellnessRoute><AIChatPage /></WellnessRoute>
              </Route>
              <Route path="/sessions">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>
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
              <Route path="/gratitude">
                <WellnessRoute><GratitudePractice /></WellnessRoute>
              </Route>
              <Route path="/gratitude/hub">
                <WellnessRoute><GratitudeHubPage /></WellnessRoute>
              </Route>
              <Route path="/reflect">
                <WellnessRoute><DailyReflection /></WellnessRoute>
              </Route>
              <Route path="/daily-reflection">
                <WellnessRoute><DailyReflection /></WellnessRoute>
              </Route>
              <Route path="/reflections">
                <ProtectedRoute><ReflectionHistory /></ProtectedRoute>
              </Route>
              <Route path="/wellness">
                <WellnessRoute><Wellness /></WellnessRoute>
              </Route>
              <Route path="/discernment">
                <ProtectedRoute><DiscernmentDashboard /></ProtectedRoute>
              </Route>
              <Route path="/protocols">
                <ProtectedRoute><ProtocolBrowser /></ProtectedRoute>
              </Route>
              <Route path="/protocols/session/:id">
                <ProtectedRoute><ProtocolSession /></ProtectedRoute>
              </Route>
              <Route path="/biometrics">
                <ProtectedRoute><BiometricDashboard /></ProtectedRoute>
              </Route>
              <Route path="/admin/agents">
                <ProtectedRoute><AgentInteraction /></ProtectedRoute>
              </Route>
              <Route path="/presence"><Presence /></Route>
              <Route path="/wellness-tools-hub"><WellnessToolsHub /></Route>
              <Route path="/lumi-design-system"><DesignSystemV2 /></Route>
              <Route path="/tools/gad7"><GAD7Assessment /></Route>
              <Route path="/tools/phq9"><PHQ9Assessment /></Route>
              <Route path="/tools/distortion-checker"><CognitiveDistortionChecker /></Route>
              <Route path="/tools/breath-pacer"><BreathPacer /></Route>
              <Route path="/tools/boundary-builder"><BoundaryBuilderTool /></Route>
              <Route path="/tools/manipulation-detector"><ManipulationDetector /></Route>
              <Route path="/tools/sleep-quality-calculator"><SleepQualityCalculator /></Route>
              <Route path="/tools/nervous-system-check"><NervousSystemCheck /></Route>
              <Route path="/tools/all"><ToolsIndex /></Route>
              <Route path="/affirmations">{() => <ConfigRoute route="/affirmations" />}</Route>
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
              <Route path="/explore/topics">
                <WellnessRoute><HubsIndexPage /></WellnessRoute>
              </Route>
              <Route path="/explore/pathways">
                <ProtectedRoute><PathwaysHome /></ProtectedRoute>
              </Route>
              <Route path="/explore/search">
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
              <Route path="/hubs/emotions">
                <WellnessRoute><EmotionalIntelligenceHubPage /></WellnessRoute>
              </Route>
              <Route path="/hubs/self-love">
                <WellnessRoute><SelfCompassionHubPage /></WellnessRoute>
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
              <Route path="/welcome"><OnboardingFlow /></Route>
              <Route path="/avatar-lab"><AvatarLab /></Route>
              <Route path="/rig-lab"><RigLab /></Route>
              <Route path="/motion-lab"><MotionLab /></Route>
              <Route path="/profile">
                <ProtectedRoute><Profile /></ProtectedRoute>
              </Route>
              <Route path="/billing">{() => <ConfigRoute route="/billing" />}</Route>
              <Route path="/overview">{() => <ConfigRoute route="/overview" />}</Route>

              {/* Wellness Pages - Config Driven */}
              <Route path="/breathing">{() => <ConfigRoute route="/breathing" />}</Route>
              <Route path="/grounding">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/meditation">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/mindfulness" component={MindfulnessCanonical} />
              <Route path="/self-care">{() => <ConfigRoute route="/self-care" />}</Route>
              <Route path="/calming-scenes">{() => <ConfigRoute route="/calming-scenes" />}</Route>
              <Route path="/sleep-guide">{() => <ConfigRoute route="/sleep-guide" />}</Route>
              <Route path="/stress-response">{() => <ConfigRoute route="/stress-response" />}</Route>
              <Route path="/emotional-intelligence">{() => <ConfigRoute route="/emotional-intelligence" />}</Route>

              {/* Tools Route Aliases */}
              <Route path="/tools/journal"><WellnessRoute><JournalPage /></WellnessRoute></Route>
              <Route path="/tools/mood"><WellnessRoute><MoodPage /></WellnessRoute></Route>
              <Route path="/tools/breathing"><BreathingTool /></Route>
              <Route path="/tools/affirmations"><AffirmationWall /></Route>
              <Route path="/tools/meditation">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/tools/grounding">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/tools/self-care">{() => <ConfigRoute route="/self-care" />}</Route>

              {/* Daily Practice & Routines Pages */}
              <Route path="/daily"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
              <Route path="/practice"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
              <Route path="/exercises"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
              <Route path="/activities"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
              <Route path="/routines"><WellnessRoute><RoutinesPage /></WellnessRoute></Route>
              <Route path="/habits"><WellnessRoute><RoutinesPage /></WellnessRoute></Route>
              <Route path="/growth"><WellnessRoute><GrowthCanonical /></WellnessRoute></Route>
              <Route path="/peacescape"><WellnessRoute><PeacescapePage /></WellnessRoute></Route>
              <Route path="/recovery"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/reflection"><WellnessRoute><ReflectionPage /></WellnessRoute></Route>
              <Route path="/prompts"><WellnessRoute><JournalPage /></WellnessRoute></Route>
              <Route path="/anxiety" component={AnxietyCanonical} />
              <Route path="/depression"><WellnessRoute><DepressionCanonical /></WellnessRoute></Route>
              <Route path="/calm">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/stress">{() => <ConfigRoute route="/breathing" />}</Route>
              <Route path="/relax">{() => <ConfigRoute route="/calming-scenes" />}</Route>
              <Route path="/emotions"><WellnessRoute><Suspense fallback={<div>Loading...</div>}><EmotionalIntelligenceHubPage /></Suspense></WellnessRoute></Route>
              <Route path="/feelings"><WellnessRoute><MoodPage /></WellnessRoute></Route>
              <Route path="/trauma"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/love"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/hope"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/mindset"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/sleep">{() => <ConfigRoute route="/calming-scenes" />}</Route>
              <Route path="/rest">{() => <ConfigRoute route="/calming-scenes" />}</Route>
              <Route path="/focus">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/clarity">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/strength"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/courage"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/acceptance"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/forgiveness"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/motivation"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/purpose"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/balance">{() => <ConfigRoute route="/self-care" />}</Route>
              <Route path="/energy">{() => <ConfigRoute route="/body-wellness" />}</Route>
              <Route path="/happiness"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/joy"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/peace-of-mind">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/inner-peace">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/body">{() => <ConfigRoute route="/body-wellness" />}</Route>
              <Route path="/soul"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/mental-health"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/self-help">{() => <ConfigRoute route="/self-care" />}</Route>
              <Route path="/self-improvement"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/personal-growth"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/emotional"><WellnessRoute><MoodPage /></WellnessRoute></Route>
              <Route path="/coping">{() => <ConfigRoute route="/breathing" />}</Route>
              <Route path="/nervous-system">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/triggers"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/worry">{() => <ConfigRoute route="/breathing" />}</Route>
              <Route path="/overthinking">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/relaxation">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/serenity">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/peace">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/tranquility">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/ptsd"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/grief"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/loss"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/sadness"><WellnessRoute><MoodPage /></WellnessRoute></Route>
              <Route path="/anger">{() => <ConfigRoute route="/breathing" />}</Route>
              <Route path="/fear">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/shame"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/guilt"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/loneliness"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/isolation"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/self-love"><WellnessRoute><SelfLoveCanonical /></WellnessRoute></Route>
              <Route path="/wellness-tools">{() => <PracticeLibrary />}</Route>
              <Route path="/counseling">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/wellbeing" component={WellbeingPage} />
              <Route path="/well-being">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/mental-wellness" component={MentalWellnessPage} />
              <Route path="/emotional-health"><WellnessRoute><MoodPage /></WellnessRoute></Route>
              <Route path="/trust" component={TrustCenterPage} />
              <Route path="/ai-transparency" component={AITransparencyPage} />
              <Route path="/compassion"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/patience"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/kindness"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              
              <Route path="/awareness"><WellnessRoute><DailyPracticePage /></WellnessRoute></Route>
              <Route path="/connection"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/relationships"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/intimacy"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/attachment"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/addiction"><WellnessRoute><RecoveryPage /></WellnessRoute></Route>
              <Route path="/self-esteem"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/confidence"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/boundaries"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/empowerment"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
              <Route path="/mental">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/spiritual">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/spiritual-wellness">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/mind">{() => <ConfigRoute route="/meditation" />}</Route>
              <Route path="/yoga">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/exercise">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/movement">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/fitness">{() => <ConfigRoute route="/grounding" />}</Route>
              <Route path="/nutrition">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/guide">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/science">{() => <ConfigRoute route="/research" />}</Route>
              <Route path="/studies">{() => <ConfigRoute route="/research" />}</Route>
              <Route path="/evidence">{() => <ConfigRoute route="/research" />}</Route>
              <Route path="/materials">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/videos">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/podcasts">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/ebooks">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/webinars">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/events">{() => <ConfigRoute route="/community" />}</Route>
              <Route path="/calendar">{() => <ConfigRoute route="/dashboard" />}</Route>
              <Route path="/feedback">{() => <ConfigRoute route="/contact" />}</Route>
              <Route path="/reviews">{() => <ConfigRoute route="/testimonials" />}</Route>
              <Route path="/partners">{() => <ConfigRoute route="/about" />}</Route>
              <Route path="/sponsorship">{() => <ConfigRoute route="/about" />}</Route>
              <Route path="/careers">{() => <ConfigRoute route="/about" />}</Route>
              <Route path="/team">{() => <ConfigRoute route="/about" />}</Route>
              <Route path="/mobile">{() => <ConfigRoute route="/features" />}</Route>
              <Route path="/newsletter" component={lazy(() => import("./pages/Newsletter.jsx"))} />
              <Route path="/app">{() => <ConfigRoute route="/features" />}</Route>
              <Route path="/download">{() => <ConfigRoute route="/features" />}</Route>
              <Route path="/store">{() => <ConfigRoute route="/pricing" />}</Route>
              <Route path="/shop">{() => <ConfigRoute route="/pricing" />}</Route>
              <Route path="/coaching">{() => <ConfigRoute route="/chat" />}</Route>
              <Route path="/mentoring">{() => <ConfigRoute route="/chat" />}</Route>
              <Route path="/retreats">{() => <Redirect to="/courses" />}</Route>
              <Route path="/services">{() => <ConfigRoute route="/features" />}</Route>
              <Route path="/schedule">{() => <ConfigRoute route="/dashboard" />}</Route>
              <Route path="/booking">{() => <ConfigRoute route="/dashboard" />}</Route>
              <Route path="/webinar">{() => <Redirect to="/courses" />}</Route>
              <Route path="/ebook">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/podcast">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/membership">{() => <ConfigRoute route="/pricing" />}</Route>
              <Route path="/subscription">{() => <ConfigRoute route="/pricing" />}</Route>
              <Route path="/video">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/free">{() => <ConfigRoute route="/pricing" />}</Route>
              <Route path="/trial">{() => <ConfigRoute route="/pricing" />}</Route>
              <Route path="/demo">{() => <ConfigRoute route="/features" />}</Route>
              <Route path="/group">{() => <Redirect to="/community" />}</Route>
              <Route path="/groups">{() => <Redirect to="/community" />}</Route>
              <Route path="/event">{() => <Redirect to="/events" />}</Route>
              <Route path="/updates">{() => <Redirect to="/news" />}</Route>
              <Route path="/partner">{() => <Redirect to="/partners" />}</Route>
              <Route path="/affiliate">{() => <Redirect to="/partners" />}</Route>
              <Route path="/affiliates">{() => <Redirect to="/partners" />}</Route>
              <Route path="/career">{() => <Redirect to="/careers" />}</Route>
              <Route path="/job">{() => <Redirect to="/careers" />}</Route>
              <Route path="/jobs">{() => <Redirect to="/careers" />}</Route>
              <Route path="/ios">{() => <ConfigRoute route="/features" />}</Route>
              <Route path="/android">{() => <ConfigRoute route="/features" />}</Route>
              <Route path="/book">{() => <ConfigRoute route="/learn" />}</Route>
              <Route path="/audio">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/music">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/sounds">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/service">{() => <Redirect to="/services" />}</Route>
              <Route path="/retreat">{() => <Redirect to="/retreats" />}</Route>
              <Route path="/plans">{() => <Redirect to="/pricing" />}</Route>
              <Route path="/plan">{() => <Redirect to="/pricing" />}</Route>
              <Route path="/resource">{() => <Redirect to="/resources" />}</Route>
              <Route path="/tool">{() => <Redirect to="/tools" />}</Route>
              <Route path="/course">{() => <Redirect to="/courses" />}</Route>
              <Route path="/account">{() => <Redirect to="/settings" />}</Route>
              <Route path="/lesson">{() => <Redirect to="/learn" />}</Route>
              <Route path="/session">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/program">{() => <Redirect to="/courses" />}</Route>
              <Route path="/challenges">{() => <Redirect to="/challenge" />}</Route>
              <Route path="/therapist">{() => <Redirect to="/therapy" />}</Route>
              <Route path="/donate">{() => <Redirect to="/pricing" />}</Route>
              <Route path="/subscribe">{() => <Redirect to="/pricing" />}</Route>
              <Route path="/article">{() => <Redirect to="/articles" />}</Route>
              <Route path="/posts">{() => <Redirect to="/blog" />}</Route>
              <Route path="/breathwork">{() => <Redirect to="/breathing" />}</Route>
              <Route path="/meditate">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/affirmation">{() => <Redirect to="/affirmations" />}</Route>
              <Route path="/timer">{() => <Redirect to="/breathing" />}</Route>
              <Route path="/activity">{() => <Redirect to="/activities" />}</Route>
              <Route path="/prompt">{() => <Redirect to="/prompts" />}</Route>
              <Route path="/story">{() => <Redirect to="/journal" />}</Route>
              <Route path="/stories">{() => <Redirect to="/journal" />}</Route>
              <Route path="/track">{() => <Redirect to="/mood" />}</Route>
              <Route path="/tracker">{() => <Redirect to="/mood" />}</Route>
              <Route path="/tracking">{() => <Redirect to="/mood" />}</Route>
              <Route path="/log">{() => <Redirect to="/journal" />}</Route>
              <Route path="/logs">{() => <Redirect to="/journal" />}</Route>
              <Route path="/tutorial">{() => <Redirect to="/guides" />}</Route>
              <Route path="/class">{() => <Redirect to="/courses" />}</Route>
              <Route path="/classes">{() => <Redirect to="/courses" />}</Route>
              <Route path="/selfcare">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/selflove">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/innerchild">{() => <Redirect to="/inner-child" />}</Route>
              <Route path="/quotes">{() => <Redirect to="/affirmations" />}</Route>
              <Route path="/heal">{() => <Redirect to="/healing" />}</Route>
              <Route path="/mentalhealth">{() => <Redirect to="/mental-health" />}</Route>
              <Route path="/ground">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/routine">{() => <Redirect to="/routines" />}</Route>
              <Route path="/explore">{() => <Redirect to="/wellness-tools" />}</Route>
              <Route path="/discover">{() => <Redirect to="/wellness-tools" />}</Route>
              <Route path="/toolkit">{() => <Redirect to="/wellness-tools" />}</Route>
              <Route path="/breathe">{() => <Redirect to="/breathing" />}</Route>
              <Route path="/technique">{() => <Redirect to="/practices" />}</Route>
              <Route path="/techniques">{() => <Redirect to="/practices" />}</Route>
              <Route path="/selfworth">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/emotion">{() => <Redirect to="/emotions" />}</Route>
              <Route path="/topics">{() => <Redirect to="/talk-topics" />}</Route>
              <Route path="/talk">{() => <Redirect to="/talk-topics" />}</Route>
              <Route path="/conversations">{() => <Redirect to="/talk-topics" />}</Route>
              <Route path="/discussion">{() => <Redirect to="/talk-topics" />}</Route>
              <Route path="/find">{() => <Redirect to="/explore/search" />}</Route>
              <Route path="/search">{() => <Redirect to="/explore/search" />}</Route>
              <Route path="/guidance">{() => <Redirect to="/support" />}</Route>
              <Route path="/healing-tools">{() => <Redirect to="/practices" />}</Route>
              <Route path="/my-journey">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/media">{() => <Redirect to="/learn" />}</Route>
              <Route path="/downloads">{() => <Redirect to="/resources" />}</Route>
              <Route path="/user">{() => <Redirect to="/profile" />}</Route>
              <Route path="/apps">{() => <Redirect to="/tools" />}</Route>
              <Route path="/appointment">{() => <Redirect to="/booking" />}</Route>
              <Route path="/test">{() => <Redirect to="/demo" />}</Route>
              <Route path="/begin">{() => <Redirect to="/onboarding" />}</Route>
              <Route path="/join">{() => <Redirect to="/register" />}</Route>
              <Route path="/worksheets">{() => <Redirect to="/practices" />}</Route>
              <Route path="/meditations">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/appointments">{() => <Redirect to="/booking" />}</Route>
              <Route path="/members">{() => <Redirect to="/community" />}</Route>
              <Route path="/member">{() => <Redirect to="/profile" />}</Route>
              <Route path="/log-in">{() => <Redirect to="/login" />}</Route>
              <Route path="/contact-us">{() => <Redirect to="/contact" />}</Route>
              <Route path="/about-us">{() => <Redirect to="/about" />}</Route>
              <Route path="/faqs">{() => <Redirect to="/faq" />}</Route>
              <Route path="/getting-started">{() => <Redirect to="/onboarding" />}</Route>
              <Route path="/how-it-works">{() => <Redirect to="/features" />}</Route>
              <Route path="/sitemap">{() => <Redirect to="/explore" />}</Route>
              <Route path="/my-profile">{() => <Redirect to="/profile" />}</Route>
              <Route path="/my-account">{() => <Redirect to="/profile" />}</Route>
              <Route path="/my-settings">{() => <Redirect to="/settings" />}</Route>
              <Route path="/preferences">{() => <Redirect to="/settings" />}</Route>
              <Route path="/logout">{() => <Redirect to="/login" />}</Route>
              <Route path="/signout">{() => <Redirect to="/login" />}</Route>
              <Route path="/sign-out">{() => <Redirect to="/login" />}</Route>
              <Route path="/log-out">{() => <Redirect to="/login" />}</Route>
              <Route path="/products">{() => <Redirect to="/features" />}</Route>
              <Route path="/index">{() => <Redirect to="/" />}</Route>
              <Route path="/main">{() => <Redirect to="/" />}</Route>
              <Route path="/intro">{() => <Redirect to="/onboarding" />}</Route>
              <Route path="/checkin"><CheckIn /></Route>
              <Route path="/check-in">{() => <Redirect to="/checkin" />}</Route>
              <Route path="/workbooks">{() => <Redirect to="/practices" />}</Route>
              <Route path="/templates">{() => <Redirect to="/practices" />}</Route>
              <Route path="/notifications">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/inbox">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/messages">{() => <Redirect to="/chat" />}</Route>
              <Route path="/alerts">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/cart">{() => <Redirect to="/pricing" />}</Route>
              <Route path="/treatment">{() => <Redirect to="/healing" />}</Route>
              <Route path="/discussions">{() => <Redirect to="/community" />}</Route>
              <Route path="/reports">{() => <Redirect to="/progress" />}</Route>
              <Route path="/history">{() => <Redirect to="/journal" />}</Route>
              <Route path="/favorites">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/bookmarks">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/saved">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/collections">{() => <Redirect to="/learn" />}</Route>
              <Route path="/feed">{() => <Redirect to="/community" />}</Route>
              <Route path="/playlist">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/playlists">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/testimonial">{() => <Redirect to="/reviews" />}</Route>
              <Route path="/review">{() => <Redirect to="/reviews" />}</Route>
              <Route path="/creators">{() => <Redirect to="/about" />}</Route>
              <Route path="/experts">{() => <Redirect to="/about" />}</Route>
              <Route path="/tasks">{() => <Redirect to="/dashboard" />}</Route>
              <Route path="/notes">{() => <Redirect to="/journal" />}</Route>
              <Route path="/sponsor">{() => <Redirect to="/about" />}</Route>
              <Route path="/archive">{() => <Redirect to="/learn" />}</Route>
              <Route path="/episode">{() => <Redirect to="/learn" />}</Route>
              <Route path="/episodes">{() => <Redirect to="/learn" />}</Route>
              <Route path="/series">{() => <Redirect to="/courses" />}</Route>
              <Route path="/programs">{() => <Redirect to="/courses" />}</Route>
              <Route path="/meetups">{() => <Redirect to="/community" />}</Route>
              <Route path="/live">{() => <Redirect to="/community" />}</Route>
              <Route path="/seminar">{() => <Redirect to="/courses" />}</Route>
              <Route path="/seminars">{() => <Redirect to="/courses" />}</Route>
              <Route path="/inspire">{() => <Redirect to="/affirmation" />}</Route>
              <Route path="/inspiration">{() => <Redirect to="/affirmation" />}</Route>
              <Route path="/motivated">{() => <Redirect to="/motivation" />}</Route>
              <Route path="/mantras">{() => <Redirect to="/affirmation" />}</Route>
              <Route path="/mantra">{() => <Redirect to="/affirmation" />}</Route>
              <Route path="/sound">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/transform">{() => <Redirect to="/growth" />}</Route>
              <Route path="/improve">{() => <Redirect to="/growth" />}</Route>
              <Route path="/change">{() => <Redirect to="/growth" />}</Route>
              <Route path="/spirit">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/sad">{() => <Redirect to="/sadness" />}</Route>
              <Route path="/happy">{() => <Redirect to="/joy" />}</Route>
              <Route path="/lonely">{() => <Redirect to="/loneliness" />}</Route>
              <Route path="/stressed">{() => <Redirect to="/stress" />}</Route>
              <Route path="/tired">{() => <Redirect to="/rest" />}</Route>
              <Route path="/overwhelmed">{() => <Redirect to="/stress" />}</Route>
              <Route path="/anxious">{() => <Redirect to="/anxiety" />}</Route>
              <Route path="/nervous">{() => <Redirect to="/anxiety" />}</Route>
              <Route path="/upset">{() => <Redirect to="/anger" />}</Route>
              <Route path="/hurt">{() => <Redirect to="/healing" />}</Route>
              <Route path="/frustrated">{() => <Redirect to="/anger" />}</Route>
              <Route path="/depressed">{() => <Redirect to="/depression" />}</Route>
              <Route path="/wellness-journey">{() => <Redirect to="/healing-journey" />}</Route>
              <Route path="/my-healing">{() => <Redirect to="/healing-journey" />}</Route>
              <Route path="/assistance">{() => <Redirect to="/support" />}</Route>
              <Route path="/toolbox">{() => <Redirect to="/tools" />}</Route>
              <Route path="/calm-down">{() => <Redirect to="/calm" />}</Route>
              <Route path="/grounded">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/grateful">{() => <Redirect to="/gratitude" />}</Route>
              <Route path="/peaceful">{() => <Redirect to="/peace" />}</Route>
              <Route path="/insomnia">{() => <Redirect to="/sleep" />}</Route>
              <Route path="/safe">{() => <Redirect to="/safety" />}</Route>
              <Route path="/secure">{() => <Redirect to="/safety" />}</Route>
              <Route path="/hopeful">{() => <Redirect to="/hope" />}</Route>
              <Route path="/strong">{() => <Redirect to="/strength" />}</Route>
              <Route path="/present">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/moment">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/now">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/connect">{() => <Redirect to="/connection" />}</Route>
              <Route path="/belong">{() => <Redirect to="/community" />}</Route>
              <Route path="/belonging">{() => <Redirect to="/community" />}</Route>
              <Route path="/forgive">{() => <Redirect to="/forgiveness" />}</Route>
              <Route path="/forgiving">{() => <Redirect to="/forgiveness" />}</Route>
              <Route path="/accept">{() => <Redirect to="/acceptance" />}</Route>
              <Route path="/accepting">{() => <Redirect to="/acceptance" />}</Route>
              <Route path="/loving">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/kind">{() => <Redirect to="/kindness" />}</Route>
              <Route path="/tender">{() => <Redirect to="/compassion" />}</Route>
              <Route path="/gentle">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/soft">{() => <Redirect to="/compassion" />}</Route>
              <Route path="/warm">{() => <Redirect to="/love" />}</Route>
              <Route path="/caring">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/understanding">{() => <Redirect to="/compassion" />}</Route>
              <Route path="/supportive">{() => <Redirect to="/support" />}</Route>
              <Route path="/fulfilled">{() => <Redirect to="/purpose" />}</Route>
              <Route path="/uplifting">{() => <Redirect to="/hope" />}</Route>
              <Route path="/fearless">{() => <Redirect to="/courage" />}</Route>
              <Route path="/still">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/vitality">{() => <Redirect to="/energy" />}</Route>
              <Route path="/blossoming">{() => <Redirect to="/growth" />}</Route>
              <Route path="/integrated">{() => <Redirect to="/balance" />}</Route>
              <Route path="/unified">{() => <Redirect to="/balance" />}</Route>
              <Route path="/harmonize">{() => <Redirect to="/balance" />}</Route>
              <Route path="/essence">{() => <Redirect to="/purpose" />}</Route>
              <Route path="/inner">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/core">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/depths">{() => <Redirect to="/reflection" />}</Route>
              <Route path="/within">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/emerge">{() => <Redirect to="/growth" />}</Route>
              <Route path="/unfold">{() => <Redirect to="/growth" />}</Route>
              <Route path="/rise">{() => <Redirect to="/resilience" />}</Route>
              <Route path="/expand">{() => <Redirect to="/growth" />}</Route>
              <Route path="/deepen">{() => <Redirect to="/reflection" />}</Route>
              <Route path="/strengthen">{() => <Redirect to="/resilience" />}</Route>
              <Route path="/nourish">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/sustain">{() => <Redirect to="/resilience" />}</Route>
              <Route path="/cultivate">{() => <Redirect to="/growth" />}</Route>
              <Route path="/embody">{() => <Redirect to="/presence" />}</Route>
              <Route path="/embrace">{() => <Redirect to="/acceptance" />}</Route>
              <Route path="/embark">{() => <Redirect to="/onboarding" />}</Route>
              <Route path="/honor">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/cherish">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/treasure">{() => <Redirect to="/gratitude" />}</Route>
              <Route path="/sacred">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/devotion">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/liberation">{() => <Redirect to="/freedom" />}</Route>
              <Route path="/renewal">{() => <Redirect to="/healing" />}</Route>
              <Route path="/rebirth">{() => <Redirect to="/healing" />}</Route>
              <Route path="/restore">{() => <Redirect to="/healing" />}</Route>
              <Route path="/reclaim">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/rediscover">{() => <Redirect to="/self-discovery" />}</Route>
              <Route path="/reawaken">{() => <Redirect to="/awareness" />}</Route>
              <Route path="/reconnect">{() => <Redirect to="/connection" />}</Route>
              <Route path="/rebuild">{() => <Redirect to="/resilience" />}</Route>
              <Route path="/revive">{() => <Redirect to="/healing" />}</Route>
              <Route path="/rebalance">{() => <Redirect to="/balance" />}</Route>
              <Route path="/reinvent">{() => <Redirect to="/growth" />}</Route>
              <Route path="/prosper">{() => <Redirect to="/gratitude" />}</Route>
              <Route path="/excel">{() => <Redirect to="/growth" />}</Route>
              <Route path="/blossom">{() => <Redirect to="/growth" />}</Route>
              <Route path="/ascend">{() => <Redirect to="/growth" />}</Route>
              <Route path="/soar">{() => <Redirect to="/growth" />}</Route>
              <Route path="/shine">{() => <Redirect to="/joy" />}</Route>
              <Route path="/glow">{() => <Redirect to="/joy" />}</Route>
              <Route path="/radiate">{() => <Redirect to="/joy" />}</Route>
              <Route path="/illuminate">{() => <Redirect to="/awareness" />}</Route>
              <Route path="/uplift">{() => <Redirect to="/joy" />}</Route>
              <Route path="/encourage">{() => <Redirect to="/support" />}</Route>
              <Route path="/motivate">{() => <Redirect to="/growth" />}</Route>
              <Route path="/appreciate">{() => <Redirect to="/gratitude" />}</Route>
              <Route path="/celebrate">{() => <Redirect to="/joy" />}</Route>
              <Route path="/affirm">{() => <Redirect to="/affirmations" />}</Route>
              <Route path="/validate">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/renew">{() => <Redirect to="/healing" />}</Route>
              <Route path="/refresh">{() => <Redirect to="/rest" />}</Route>
              <Route path="/recharge">{() => <Redirect to="/rest" />}</Route>
              <Route path="/recover">{() => <Redirect to="/healing" />}</Route>
              <Route path="/center">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/anchor">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/feel">{() => <Redirect to="/emotions" />}</Route>
              <Route path="/listen">{() => <Redirect to="/awareness" />}</Route>
              <Route path="/witness">{() => <Redirect to="/awareness" />}</Route>
              <Route path="/acknowledge">{() => <Redirect to="/acceptance" />}</Route>
              <Route path="/let-go">{() => <Redirect to="/release" />}</Route>
              <Route path="/protect">{() => <Redirect to="/boundaries" />}</Route>
              <Route path="/shield">{() => <Redirect to="/boundaries" />}</Route>
              <Route path="/patient">{() => <Redirect to="/patience" />}</Route>
              <Route path="/thankful">{() => <Redirect to="/gratitude" />}</Route>
              <Route path="/thanks">{() => <Redirect to="/gratitude" />}</Route>
              <Route path="/worth">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/worthy">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/valued">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/brave">{() => <Redirect to="/courage" />}</Route>
              <Route path="/courageous">{() => <Redirect to="/courage" />}</Route>
              <Route path="/empowered">{() => <Redirect to="/empowerment" />}</Route>
              <Route path="/empower">{() => <Redirect to="/empowerment" />}</Route>
              <Route path="/authentic">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/authenticity">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/genuine">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/mindful">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/aware">{() => <Redirect to="/awareness" />}</Route>
              <Route path="/centered">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/balanced">{() => <Redirect to="/balance" />}</Route>
              <Route path="/nurture">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/nurtured">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/nurturing">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/relaxed">{() => <Redirect to="/relax" />}</Route>
              <Route path="/calming">{() => <Redirect to="/calm" />}</Route>
              <Route path="/soothing">{() => <Redirect to="/calm" />}</Route>
              <Route path="/soothe">{() => <Redirect to="/calm" />}</Route>
              <Route path="/tranquil">{() => <Redirect to="/peace" />}</Route>
              <Route path="/serene">{() => <Redirect to="/peace" />}</Route>
              <Route path="/inspired">{() => <Redirect to="/inspire" />}</Route>
              <Route path="/inspiring">{() => <Redirect to="/inspire" />}</Route>
              <Route path="/motivating">{() => <Redirect to="/motivation" />}</Route>
              <Route path="/resilient">{() => <Redirect to="/resilience" />}</Route>
              <Route path="/confident">{() => <Redirect to="/confidence" />}</Route>
              <Route path="/supported">{() => <Redirect to="/support" />}</Route>
              <Route path="/cherished">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/treasured">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/blessed">{() => <Redirect to="/gratitude" />}</Route>
              <Route path="/whole">{() => <Redirect to="/wholeness" />}</Route>
              <Route path="/complete">{() => <Redirect to="/wholeness" />}</Route>
              <Route path="/connected">{() => <Redirect to="/connection" />}</Route>
              <Route path="/restored">{() => <Redirect to="/rest" />}</Route>
              <Route path="/renewed">{() => <Redirect to="/rest" />}</Route>
              <Route path="/refreshed">{() => <Redirect to="/rest" />}</Route>
              <Route path="/liberated">{() => <Redirect to="/empowerment" />}</Route>
              <Route path="/freedom">{() => <Redirect to="/empowerment" />}</Route>
              <Route path="/clear">{() => <Redirect to="/clarity" />}</Route>
              <Route path="/focused">{() => <Redirect to="/focus" />}</Route>
              <Route path="/stable">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/steady">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/protected">{() => <Redirect to="/safety" />}</Route>
              <Route path="/embraced">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/accepted">{() => <Redirect to="/acceptance" />}</Route>
              <Route path="/understood">{() => <Redirect to="/acceptance" />}</Route>
              <Route path="/validated">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/seen">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/heard">{() => <Redirect to="/support" />}</Route>
              <Route path="/held">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/uplifted">{() => <Redirect to="/joy" />}</Route>
              <Route path="/lifted">{() => <Redirect to="/joy" />}</Route>
              <Route path="/elevated">{() => <Redirect to="/growth" />}</Route>
              <Route path="/rising">{() => <Redirect to="/growth" />}</Route>
              <Route path="/blooming">{() => <Redirect to="/growth" />}</Route>
              <Route path="/flourishing">{() => <Redirect to="/growth" />}</Route>
              <Route path="/thriving">{() => <Redirect to="/growth" />}</Route>
              <Route path="/growing">{() => <Redirect to="/growth" />}</Route>
              <Route path="/transforming">{() => <Redirect to="/growth" />}</Route>
              <Route path="/awakening">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/alive">{() => <Redirect to="/joy" />}</Route>
              <Route path="/stillness">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/consciousness">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/inner-self">{() => <Redirect to="/self-discovery" />}</Route>
              <Route path="/inner-work">{() => <Redirect to="/growth" />}</Route>
              <Route path="/shadow-work">{() => <Redirect to="/healing" />}</Route>
              <Route path="/higher-self">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/ego">{() => <Redirect to="/self-discovery" />}</Route>
              <Route path="/subconscious">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/unconscious">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/psyche">{() => <Redirect to="/self-discovery" />}</Route>
              <Route path="/heart">{() => <Redirect to="/self-love" />}</Route>
              <Route path="/intuition">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/instinct">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/feeling">{() => <Redirect to="/emotions" />}</Route>
              <Route path="/thoughts">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/beliefs">{() => <Redirect to="/self-discovery" />}</Route>
              <Route path="/behavior">{() => <Redirect to="/growth" />}</Route>
              <Route path="/patterns">{() => <Redirect to="/self-discovery" />}</Route>
              <Route path="/chakra">{() => <Redirect to="/energy" />}</Route>
              <Route path="/aura">{() => <Redirect to="/energy" />}</Route>
              <Route path="/vibration">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/frequency">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/manifest">{() => <Redirect to="/growth" />}</Route>
              <Route path="/prayer">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/faith">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/religion">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/karma">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/zen">{() => <Redirect to="/mindfulness" />}</Route>
              <Route path="/buddhism">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/reiki">{() => <Redirect to="/energy" />}</Route>
              <Route path="/tarot">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/astrology">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/numerology">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/crystals">{() => <Redirect to="/energy" />}</Route>
              <Route path="/taichi">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/qigong">{() => <Redirect to="/energy" />}</Route>
              <Route path="/acupuncture">{() => <Redirect to="/healing" />}</Route>
              <Route path="/massage">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/hypnosis">{() => <Redirect to="/healing" />}</Route>
              <Route path="/eft">{() => <Redirect to="/healing" />}</Route>
              <Route path="/tapping">{() => <Redirect to="/healing" />}</Route>
              <Route path="/emdr">{() => <Redirect to="/trauma" />}</Route>
              <Route path="/cbt">{() => <Redirect to="/healing" />}</Route>
              <Route path="/dbt">{() => <Redirect to="/healing" />}</Route>
              <Route path="/somatic">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/act">{() => <Redirect to="/healing" />}</Route>
              <Route path="/ifs">{() => <Redirect to="/self-discovery" />}</Route>
              <Route path="/parts-work">{() => <Redirect to="/self-discovery" />}</Route>
              <Route path="/reparenting">{() => <Redirect to="/inner-child" />}</Route>
              <Route path="/secure-attachment">{() => <Redirect to="/relationships" />}</Route>
              <Route path="/polyvagal">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/window-of-tolerance">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/regulation">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/dysregulation">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/skills">{() => <Redirect to="/practices" />}</Route>
              <Route path="/shadow">{() => <Redirect to="/shadow-work" />}</Route>
              <Route path="/wholeness">{() => <Redirect to="/healing" />}</Route>
              <Route path="/harmony">{() => <Redirect to="/balance" />}</Route>
              <Route path="/authentic-self">{() => <Redirect to="/authentic" />}</Route>
              <Route path="/true-self">{() => <Redirect to="/authentic" />}</Route>
              <Route path="/enough">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/i-am-enough">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/positive-thinking">{() => <Redirect to="/joy" />}</Route>
              <Route path="/positive">{() => <Redirect to="/joy" />}</Route>
              <Route path="/positivity">{() => <Redirect to="/joy" />}</Route>
              <Route path="/optimism">{() => <Redirect to="/hope" />}</Route>
              <Route path="/bravery">{() => <Redirect to="/courage" />}</Route>
              <Route path="/self-acceptance">{() => <Redirect to="/acceptance" />}</Route>
              <Route path="/evolve">{() => <Redirect to="/growth" />}</Route>
              <Route path="/thrive">{() => <Redirect to="/growth" />}</Route>
              <Route path="/flourish">{() => <Redirect to="/growth" />}</Route>
              <Route path="/flourishing">{() => <Redirect to="/growth" />}</Route>
              <Route path="/bloom">{() => <Redirect to="/growth" />}</Route>
              <Route path="/awaken">{() => <Redirect to="/awakening" />}</Route>
              <Route path="/enlighten">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/enlightenment">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/transcend">{() => <Redirect to="/spiritual" />}</Route>
              <Route path="/compassionate">{() => <Redirect to="/compassion" />}</Route>
              <Route path="/empathetic">{() => <Redirect to="/empathy" />}</Route>
              <Route path="/calmness">{() => <Redirect to="/calm" />}</Route>
              <Route path="/quietude">{() => <Redirect to="/meditation" />}</Route>
              <Route path="/centeredness">{() => <Redirect to="/grounding" />}</Route>
              <Route path="/completeness">{() => <Redirect to="/wholeness" />}</Route>
              <Route path="/loved">{() => <Redirect to="/love" />}</Route>
              <Route path="/precious">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/harmonious">{() => <Redirect to="/harmony" />}</Route>
              <Route path="/quiet">{() => <Redirect to="/calm" />}</Route>
              <Route path="/silence">{() => <Redirect to="/stillness" />}</Route>
              <Route path="/solitude">{() => <Redirect to="/stillness" />}</Route>
              <Route path="/healed">{() => <Redirect to="/healing" />}</Route>
              <Route path="/recovered">{() => <Redirect to="/healing-journey" />}</Route>
              <Route path="/stronger">{() => <Redirect to="/resilience" />}</Route>
              <Route path="/content">{() => <Redirect to="/peace" />}</Route>
              <Route path="/fulfillment">{() => <Redirect to="/purpose" />}</Route>
              <Route path="/lightness">{() => <Redirect to="/joy" />}</Route>
              <Route path="/openness">{() => <Redirect to="/acceptance" />}</Route>
              <Route path="/spaciousness">{() => <Redirect to="/calm" />}</Route>
              <Route path="/ease">{() => <Redirect to="/calm" />}</Route>
              <Route path="/relief">{() => <Redirect to="/release" />}</Route>
              <Route path="/comfort">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/valid">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/lovable">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/deserving">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/capable">{() => <Redirect to="/resilience" />}</Route>
              <Route path="/evolving">{() => <Redirect to="/growth" />}</Route>
              <Route path="/becoming">{() => <Redirect to="/growth" />}</Route>
              <Route path="/unfolding">{() => <Redirect to="/growth" />}</Route>
              <Route path="/emerging">{() => <Redirect to="/growth" />}</Route>
              <Route path="/ascending">{() => <Redirect to="/growth" />}</Route>
              <Route path="/expanding">{() => <Redirect to="/growth" />}</Route>
              <Route path="/deepening">{() => <Redirect to="/growth" />}</Route>
              <Route path="/integrating">{() => <Redirect to="/growth" />}</Route>
              <Route path="/releasing">{() => <Redirect to="/release" />}</Route>
              <Route path="/aligned">{() => <Redirect to="/balance" />}</Route>
              <Route path="/revived">{() => <Redirect to="/calm" />}</Route>
              <Route path="/rested">{() => <Redirect to="/rest" />}</Route>
              <Route path="/optimistic">{() => <Redirect to="/hope" />}</Route>
              <Route path="/joyful">{() => <Redirect to="/joy" />}</Route>
              <Route path="/satisfied">{() => <Redirect to="/gratitude" />}</Route>
              <Route path="/nourished">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/worried">{() => <Redirect to="/anxiety" />}</Route>
              <Route path="/fearful">{() => <Redirect to="/fear" />}</Route>
              <Route path="/scared">{() => <Redirect to="/fear" />}</Route>
              <Route path="/afraid">{() => <Redirect to="/fear" />}</Route>
              <Route path="/panicked">{() => <Redirect to="/anxiety" />}</Route>
              <Route path="/hopeless">{() => <Redirect to="/hope" />}</Route>
              <Route path="/empty">{() => <Redirect to="/healing" />}</Route>
              <Route path="/lost">{() => <Redirect to="/healing" />}</Route>
              <Route path="/stuck">{() => <Redirect to="/healing" />}</Route>
              <Route path="/numb">{() => <Redirect to="/healing" />}</Route>
              <Route path="/broken">{() => <Redirect to="/healing" />}</Route>
              <Route path="/damaged">{() => <Redirect to="/healing" />}</Route>
              <Route path="/ashamed">{() => <Redirect to="/shame" />}</Route>
              <Route path="/guilty">{() => <Redirect to="/guilt" />}</Route>
              <Route path="/jealous">{() => <Redirect to="/emotions" />}</Route>
              <Route path="/envious">{() => <Redirect to="/emotions" />}</Route>
              <Route path="/jealousy">{() => <Redirect to="/emotions" />}</Route>
              <Route path="/resentful">{() => <Redirect to="/anger" />}</Route>
              <Route path="/bitter">{() => <Redirect to="/anger" />}</Route>
              <Route path="/exhausted">{() => <Redirect to="/rest" />}</Route>
              <Route path="/drained">{() => <Redirect to="/rest" />}</Route>
              <Route path="/burnout">{() => <Redirect to="/rest" />}</Route>
              <Route path="/burned-out">{() => <Redirect to="/rest" />}</Route>
              <Route path="/weary">{() => <Redirect to="/rest" />}</Route>
              <Route path="/fatigued">{() => <Redirect to="/rest" />}</Route>
              <Route path="/letting-go">{() => <Redirect to="/healing" />}</Route>
              <Route path="/surrender">{() => <Redirect to="/healing" />}</Route>
              <Route path="/release">{() => <Redirect to="/healing" />}</Route>
              <Route path="/moving-on">{() => <Redirect to="/healing" />}</Route>
              <Route path="/closure">{() => <Redirect to="/healing" />}</Route>
              <Route path="/meaning">{() => <Redirect to="/purpose" />}</Route>
              <Route path="/identity">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/empathy">{() => <Redirect to="/compassion" />}</Route>
              <Route path="/body-image">{() => <Redirect to="/self-worth" />}</Route>
              <Route path="/eating">{() => <Redirect to="/self-care" />}</Route>
              <Route path="/sobriety">{() => <Redirect to="/healing" />}</Route>
              <Route path="/assertiveness">{() => <Redirect to="/boundaries" />}</Route>
              <Route path="/vulnerability">{() => <Redirect to="/authenticity" />}</Route>
              <Route path="/security">{() => <Redirect to="/safety" />}</Route>
              <Route path="/stability">{() => <Redirect to="/safety" />}</Route>
              <Route path="/nightmares">{() => <Redirect to="/sleep" />}</Route>
              <Route path="/trauma-responses">{() => <Redirect to="/trauma" />}</Route>
              <Route path="/flashbacks">{() => <Redirect to="/trauma" />}</Route>
              <Route path="/dissociation">{() => <Redirect to="/trauma" />}</Route>
              <Route path="/relationship">{() => <Redirect to="/relationships" />}</Route>
              <Route path="/communication">{() => <Redirect to="/relationships" />}</Route>
              <Route path="/parenting">{() => <Redirect to="/relationships" />}</Route>
              <Route path="/family">{() => <Redirect to="/relationships" />}</Route>
              <Route path="/divorce">{() => <Redirect to="/relationships" />}</Route>
              <Route path="/breakup">{() => <Redirect to="/healing" />}</Route>
              <Route path="/heartbreak">{() => <Redirect to="/healing" />}</Route>
              <Route path="/rejection">{() => <Redirect to="/healing" />}</Route>
              <Route path="/abandonment">{() => <Redirect to="/healing" />}</Route>
              <Route path="/betrayal">{() => <Redirect to="/trust" />}</Route>
              <Route path="/codependency">{() => <Redirect to="/relationships" />}</Route>
              <Route path="/narcissism">{() => <Redirect to="/healing" />}</Route>
              <Route path="/abuse">{() => <Redirect to="/crisis" />}</Route>
              <Route path="/self-harm">{() => <Redirect to="/crisis" />}</Route>
              <Route path="/suicide">{() => <Redirect to="/crisis" />}</Route>
              <Route path="/self-compassion">{() => <Redirect to="/self-care" />}</Route>

              {/* Talk Topics - Conversation Starters */}
              <Route path="/talk-topics">{() => <TalkTopics />}</Route>

              {/* Healing Pages - Config Driven */}
              <Route path="/inner-child">{() => <ConfigRoute route="/inner-child" />}</Route>
              <Route path="/healing-library">{() => <ConfigRoute route="/healing-library" />}</Route>
              <Route path="/healing-journeys">{() => <ConfigRoute route="/healing-journeys" />}</Route>
              <Route path="/healing-journey">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/emotional-wellness"><WellnessRoute><MoodPage /></WellnessRoute></Route>
              <Route path="/mental-health-support">{() => <ConfigRoute route="/healing" />}</Route>
              <Route path="/self-discovery"><WellnessRoute><SelfLovePage /></WellnessRoute></Route>
              <Route path="/transformation"><WellnessRoute><GrowthPage /></WellnessRoute></Route>
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
                <ProtectedRoute><ResilienceCanonical /></ProtectedRoute>
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

              {/* Gamification Routes */}
              <Route path="/quests">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>
              <Route path="/achievements">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>
              <Route path="/rewards">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>
              <Route path="/levels">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>
              <Route path="/badges">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>
              <Route path="/xp">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>
              <Route path="/streaks">
                <ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>
              </Route>

              {/* Community Routes */}
              <Route path="/community">
                <CommunityHub />
              </Route>
              <Route path="/community/feed">
                <ProtectedRoute><CommunityPage /></ProtectedRoute>
              </Route>
              <Route path="/forum">
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
              {/* /celebration: 3-phase "I Did It!" flow per Avatar v4.2 Flow C.
                  Public (no ProtectedRoute) so any tool completion can route
                  here including unauthenticated demo flows. The richer
                  CelebrationRitual lives at /celebration/ritual. */}
              <Route path="/celebration">
                <CelebrationFlow />
              </Route>
              {/* V6 overlay preview — design-iteration sandbox. Public so
                  designers can review without auth. */}
              <Route path="/v6">
                <LumiV6Preview />
              </Route>
              {/* Public so legacy inbound /celebration links (now moved to
                  /celebration/ritual) keep working for unauthenticated demo. */}
              <Route path="/celebration/ritual">
                <CelebrationRitual />
              </Route>
              <Route path="/social">
                <WellnessRoute><SocialHub /></WellnessRoute>
              </Route>

              {/* Blog & Content */}
              <Route path="/blog" component={BlogIndex} />
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
              <Route path="/faq">{() => <FAQPage />}</Route>
              <Route path="/support">{() => <ConfigRoute route="/support" />}</Route>
              <Route path="/resources">{() => <ConfigRoute route="/resources" />}</Route>
              <Route path="/contact"><Contact /></Route>
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
              <Route path="/self-worth-reflection">
                <WellnessRoute><SelfWorthReflectionPage /></WellnessRoute>
              </Route>
              <Route path="/self-worth">
                <WellnessRoute><SelfWorthHubPage /></WellnessRoute>
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
              <Route path="/admin/social/ops">
                <AdminGuard><AdminSocial /></AdminGuard>
              </Route>
              <Route path="/admin/social">
                <AdminGuard><AdminSocial /></AdminGuard>
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
              <Route path="/admin/newsletter">
                <AdminGuard><NewsletterAdmin /></AdminGuard>
              </Route>
              <Route path="/admin/publishing/today">
                <AdminGuard><AdminPublishingToday /></AdminGuard>
              </Route>
              <Route path="/admin/publishing">
                <AdminGuard><AdminPublishing /></AdminGuard>
              </Route>
              <Route path="/blog/draft/:id">
                <AdminGuard><BlogDraftViewer /></AdminGuard>
              </Route>
              <Route path="/admin/revenue">
                <AdminGuard><RevenueAdmin /></AdminGuard>
              </Route>
              <Route path="/admin/security">
                <AdminGuard><SecurityDashboard /></AdminGuard>
              </Route>
              <Route path="/admin/audit-log">
                <AdminGuard><AuditLogExplorer /></AdminGuard>
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
              <Route path="/learn/courses">{() => <CourseCatalog />}</Route>
              <Route path="/practices">{() => <PracticeLibrary />}</Route>
              <Route path="/admin/roles">{() => <AdminGuard><RolesPermissions /></AdminGuard>}</Route>
              <Route path="/admin/feature-flags">{() => <AdminGuard><FeatureFlags /></AdminGuard>}</Route>
              <Route path="/admin/alerts">{() => <AdminGuard><SystemAlerts /></AdminGuard>}</Route>
              <Route path="/admin/feedback">{() => <AdminGuard><FeedbackAggregator /></AdminGuard>}</Route>
              <Route path="/admin/narrative">{() => <AdminGuard><NarrativeDrafts /></AdminGuard>}</Route>
              <Route path="/admin/engagement">{() => <AdminGuard><EngagementDashboard /></AdminGuard>}</Route>
              <Route path="/admin/analytics">{() => <AdminGuard><AnalyticsDashboard /></AdminGuard>}</Route>
              <Route path="/admin/users">{() => <AdminGuard><AdminUsers /></AdminGuard>}</Route>
              <Route path="/admin/tools">{() => <AdminGuard><AdminTools /></AdminGuard>}</Route>
              <Route path="/goals">{() => <ProtectedRoute><WellnessGoals /></ProtectedRoute>}</Route>
              <Route path="/tools/meditation">{() => <WellnessRoute><MeditationPlayer /></WellnessRoute>}</Route>
              <Route path="/tools/emotion-wheel">{() => <WellnessRoute><EmotionWheel /></WellnessRoute>}</Route>
              <Route path="/settings/email-digest">{() => <ProtectedRoute><EmailDigest /></ProtectedRoute>}</Route>
              <Route path="/settings/ai-personality">{() => <ProtectedRoute><AIPersonality /></ProtectedRoute>}</Route>
              <Route path="/tools/weekly-reflection">{() => <WellnessRoute><WeeklyReflection /></WellnessRoute>}</Route>

              {/* AI Routes */}
              <Route path="/ai/companion">{() => <ConfigRoute route="/ai/companion" />}</Route>
              
              {/* Learning Routes */}
              <Route path="/learn" component={LearnHub} />
              <Route path="/learn/guides" component={LearnGuides} />
              <Route path="/learn/guides/:slug" component={LearnGuideDetail} />
              <Route path="/learn/articles" component={LearnArticles} />
              <Route path="/learn/articles/:slug" component={LearnArticleDetail} />
              <Route path="/guides" component={LearnGuides} />
              <Route path="/articles" component={LearnArticles} />
              <Route path="/tutorials" component={LearnGuides} />
              <Route path="/lessons" component={LearnGuides} />
              <Route path="/training">{() => <CourseCatalog />}</Route>
              <Route path="/education" component={LearnHub} />
              <Route path="/workshop">{() => <CourseCatalog />}</Route>
              <Route path="/workshops">{() => <CourseCatalog />}</Route>
              <Route path="/library" component={LearnHub} />

              {/* Fallback - Config Driven Not Found */}
              <Route>{() => <ConfigRoute route="/not-found" />}</Route>
            </Switch>
          </Suspense>
          </SafeBoundary>
          </main>
          {/* v5.8.35 perf: lazy global widgets — Suspense fallback is null
              because none are above-the-fold; they hydrate quietly post-LCP. */}
          <SafeBoundary label="ConsentBanner">
            <Suspense fallback={null}>
              <ConsentBanner />
            </Suspense>
          </SafeBoundary>
          <SafeBoundary label="FeedbackWidget">
            <Suspense fallback={null}>
              <FeedbackWidget />
            </Suspense>
          </SafeBoundary>
          <SafeBoundary label="AICompanion">
            <Suspense fallback={null}>
              <AICompanion />
            </Suspense>
          </SafeBoundary>
          <SafeBoundary label="AccessibilityToolbar">
            <Suspense fallback={null}>
              <AccessibilityToolbar />
            </Suspense>
          </SafeBoundary>
          <SafeBoundary label="GratitudePrompt">
            <Suspense fallback={null}>
              <GratitudePrompt frequency="weekly" />
            </Suspense>
          </SafeBoundary>
          <ToastContainer />
          </ErrorBoundary>
        </ReadingLevelProvider>
        </ResponsiveWrapper>
        </EmotionBackgroundProvider>
        </EmotionProvider>
        </GamificationProvider>
        </FeatureFlagProvider>
      </AuthProvider>
      </ReducedMotionProvider>
    </QueryClientProvider>
  );
}
