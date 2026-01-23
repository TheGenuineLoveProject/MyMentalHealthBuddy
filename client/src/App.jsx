import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import RouteGuard from "./components/RouteGuard.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import SkipToContent from "./components/SkipToContent.jsx";

import Home from "./pages/Home.jsx";
import CanvaLanding from "./pages/CanvaLanding.jsx";
import HealingLandingPage from "./pages/HealingLandingPage.jsx";
import { AutopilotPage } from "./pages/_autopilot.jsx";
import DesignSystem from "./pages/DesignSystem.jsx";
import WireframeTemplates from "./pages/WireframeTemplates.jsx";
import Login from "./pages/Login.jsx";
import LoginCallback from "./pages/LoginCallback.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound.jsx";
import HealthPage from "./pages/HealthPage.jsx";
import Publishing from "./pages/Publishing.jsx";
import SocialHub from "./pages/SocialHub.jsx";
import ControlDashboard from "./pages/ControlDashboard.jsx";
import BlogIndex from "./pages/BlogIndex.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Landing from "./pages/landing/Landing.jsx";
import Ethics from "./pages/legal/Ethics.jsx";
import Disclaimer from "./pages/legal/Disclaimer.jsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import Legal from "./pages/Legal.tsx";

const BlogEditor = lazy(() => import("./pages/BlogEditor.jsx"));
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
const Admin = lazy(() => import("./pages/Admin.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Upgrade = lazy(() => import("./pages/Upgrade.jsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const DailyFlow = lazy(() => import("./features/daily/DailyFlow.tsx"));
const MirrorPage = lazy(() => import("./pages/MirrorPage.tsx"));
const CommunityPage = lazy(() => import("./features/community/SharedReflectionsPage.jsx"));
const DiscussionPage = lazy(() => import("./features/community/DiscussionPage.jsx"));
const TodayPage = lazy(() => import("./features/today/TodayPage.jsx"));
const ToolsPage = lazy(() => import("./pages/ToolsPage.tsx"));
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
const StudyVaultPage = lazy(() => import("./pages/StudyVaultPage.tsx"));
const EliteToolsDashboard = lazy(() => import("./pages/EliteToolsDashboard.tsx"));
const ContentAdminDashboard = lazy(() => import("./pages/ContentAdminDashboard.jsx"));
const FAQPage = lazy(() => import("./pages/FAQPage.jsx"));
const ProfessionalResourcesPage = lazy(() => import("./pages/ProfessionalResourcesPage.jsx"));
const SupportPage = lazy(() => import("./pages/SupportPage.tsx"));
const NewsPage = lazy(() => import("./pages/NewsPage.jsx"));
const HealingLibraryPage = lazy(() => import("./pages/HealingLibraryPage.jsx"));
const CalmingScenesPage = lazy(() => import("./pages/CalmingScenesPage.jsx"));
const BreathingExercisesPage = lazy(() => import("./pages/BreathingExercisesPage.jsx"));
const GroundingTechniquesPage = lazy(() => import("./pages/GroundingTechniquesPage.jsx"));
const AffirmationsPage = lazy(() => import("./pages/AffirmationsPage.jsx"));
const MeditationGuidePage = lazy(() => import("./pages/MeditationGuidePage.jsx"));
const SelfCareToolkitPage = lazy(() => import("./pages/SelfCareToolkitPage.jsx"));
const WellnessGlossaryPage = lazy(() => import("./pages/WellnessGlossaryPage.jsx"));
const WellnessHubPage = lazy(() => import("./pages/WellnessHubPage.jsx"));
const EmotionalIntelligencePage = lazy(() => import("./pages/EmotionalIntelligencePage.jsx"));
const SleepGuidePage = lazy(() => import("./pages/SleepGuidePage.jsx"));
const StressResponseGuidePage = lazy(() => import("./pages/StressResponseGuidePage.jsx"));
const InnerChildPage = lazy(() => import("./pages/InnerChildPage.jsx"));
const BodyWellnessPage = lazy(() => import("./pages/BodyWellnessPage.jsx"));
const SoulWellnessPage = lazy(() => import("./pages/SoulWellnessPage.jsx"));
const ResearchEvidencePage = lazy(() => import("./pages/ResearchEvidencePage.jsx"));
const HealingJourneysPage = lazy(() => import("./pages/HealingJourneysPage.jsx"));
const BehaviorChangePage = lazy(() => import("./pages/BehaviorChangePage.jsx"));
const HowToGuidesPage = lazy(() => import("./pages/HowToGuidesPage.jsx"));
const DailyRoutinesPage = lazy(() => import("./pages/DailyRoutinesPage.jsx"));
const CognitiveToolsPage = lazy(() => import("./pages/CognitiveToolsPage.jsx"));
const GlossaryPage = lazy(() => import("./pages/GlossaryPage.jsx"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage.jsx"));
const ContentIndexPage = lazy(() => import("./pages/ContentIndexPage.jsx"));
const ExamplesPage = lazy(() => import("./pages/ExamplesPage.jsx"));
const QAPage = lazy(() => import("./pages/QAPage.jsx"));
const CRMPage = lazy(() => import("./pages/CRMPage.jsx"));
const SafetyPage = lazy(() => import("./pages/SafetyPage.jsx"));

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <SkipToContent />
          <main id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <Switch>
              {/* Public routes */}
              <Route path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route path="/welcome" component={Home} />
              <Route path="/canva-landing" component={CanvaLanding} />
              <Route path="/healing">{() => <AutopilotPage route="/healing" />}</Route>
              <Route path="/design-system" component={DesignSystem} />
              <Route path="/wireframes" component={WireframeTemplates} />
              <Route path="/login" component={Login} />
              <Route path="/login/callback" component={LoginCallback} />
              <Route path="/register" component={Register} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/health" component={HealthPage} />
              <Route path="/publishing" component={Publishing} />
              <Route path="/social" component={SocialHub} />
              <Route path="/control" component={ControlDashboard} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/crm">
                <RouteGuard>
                  <CRMPage />
                </RouteGuard>
              </Route>
              
              {/* Blog routes */}
              <Route path="/blog" component={BlogIndex} />
              <Route path="/blog/:slug" component={BlogPost} />
              <Route path="/write">
                <RouteGuard>
                  <BlogEditor />
                </RouteGuard>
              </Route>

              {/* Onboarding - protected but before main app */}
              <Route path="/onboarding">
                <RouteGuard>
                  <Onboarding />
                </RouteGuard>
              </Route>

              {/* Protected routes */}
              <Route path="/dashboard">
                <RouteGuard>
                  <Dashboard />
                </RouteGuard>
              </Route>
              <Route path="/today">
                <RouteGuard>
                  <DailyFlow />
                </RouteGuard>
              </Route>
              <Route path="/mood">
                <RouteGuard>
                  <MoodPage />
                </RouteGuard>
              </Route>
              <Route path="/state">
                <RouteGuard>
                  <StatePage />
                </RouteGuard>
              </Route>
              <Route path="/journal">
                <RouteGuard>
                  <JournalPage />
                </RouteGuard>
              </Route>
              <Route path="/chat">
                <RouteGuard>
                  <AIChatPage />
                </RouteGuard>
              </Route>
              <Route path="/analytics">
                <RouteGuard>
                  <Analytics />
                </RouteGuard>
              </Route>
              <Route path="/crisis">
                <RouteGuard>
                  <CrisisResources />
                </RouteGuard>
              </Route>
              <Route path="/wellness">
                <RouteGuard>
                  <Wellness />
                </RouteGuard>
              </Route>
              <Route path="/premium">
                <RouteGuard>
                  <Premium />
                </RouteGuard>
              </Route>
              <Route path="/settings">
                <RouteGuard>
                  <Settings />
                </RouteGuard>
              </Route>
              <Route path="/upgrade">
                <RouteGuard>
                  <Upgrade />
                </RouteGuard>
              </Route>
              <Route path="/admin">
                <RouteGuard>
                  <Admin />
                </RouteGuard>
              </Route>
              <Route path="/content-admin">
                <RouteGuard>
                  <ContentAdminDashboard />
                </RouteGuard>
              </Route>
              <Route path="/faq" component={FAQPage} />
              <Route path="/resources" component={ProfessionalResourcesPage} />
              <Route path="/support" component={SupportPage} />
              <Route path="/news" component={NewsPage} />
              <Route path="/healing-library" component={HealingLibraryPage} />
              <Route path="/calming-scenes" component={CalmingScenesPage} />
              <Route path="/breathing" component={BreathingExercisesPage} />
              <Route path="/grounding" component={GroundingTechniquesPage} />
              <Route path="/affirmations" component={AffirmationsPage} />
              <Route path="/meditation" component={MeditationGuidePage} />
              <Route path="/self-care" component={SelfCareToolkitPage} />
              <Route path="/glossary" component={WellnessGlossaryPage} />
              <Route path="/wellness-hub" component={WellnessHubPage} />
              <Route path="/emotional-intelligence" component={EmotionalIntelligencePage} />
              <Route path="/sleep-guide" component={SleepGuidePage} />
              <Route path="/stress-response" component={StressResponseGuidePage} />
              <Route path="/inner-child" component={InnerChildPage} />
              <Route path="/body-wellness" component={BodyWellnessPage} />
              <Route path="/soul-wellness" component={SoulWellnessPage} />
              <Route path="/research" component={ResearchEvidencePage} />
              <Route path="/healing-journeys" component={HealingJourneysPage} />
              <Route path="/behavior-change" component={BehaviorChangePage} />
              <Route path="/how-to-guides" component={HowToGuidesPage} />
              <Route path="/daily-routines" component={DailyRoutinesPage} />
              <Route path="/cognitive-tools" component={CognitiveToolsPage} />
              <Route path="/glossary-full" component={GlossaryPage} />
              <Route path="/professional-resources" component={ResourcesPage} />
              <Route path="/content-index" component={ContentIndexPage} />
              <Route path="/examples" component={ExamplesPage} />
              <Route path="/qa" component={QAPage} />
              <Route path="/mirror">
                <RouteGuard>
                  <MirrorPage />
                </RouteGuard>
              </Route>
              <Route path="/community">
                <RouteGuard>
                  <CommunityPage />
                </RouteGuard>
              </Route>
              <Route path="/community/discussion/:id">
                <RouteGuard>
                  <DiscussionPage />
                </RouteGuard>
              </Route>
              <Route path="/tools">
                <RouteGuard>
                  <ToolsPage />
                </RouteGuard>
              </Route>
              <Route path="/ritual">
                <RouteGuard>
                  <DailyRitualPage />
                </RouteGuard>
              </Route>
              <Route path="/wisdom">
                <RouteGuard>
                  <WisdomToolsPage />
                </RouteGuard>
              </Route>
              <Route path="/advanced">
                <RouteGuard>
                  <AdvancedToolsPage />
                </RouteGuard>
              </Route>
              <Route path="/mastery">
                <RouteGuard>
                  <MasteryToolsPage />
                </RouteGuard>
              </Route>
              <Route path="/atlas">
                <RouteGuard>
                  <AtlasDashboard />
                </RouteGuard>
              </Route>
              <Route path="/strategy-maps">
                <RouteGuard>
                  <StrategyMapsPage />
                </RouteGuard>
              </Route>
              <Route path="/collaborative-lab">
                <RouteGuard>
                  <CollaborativeLabPage />
                </RouteGuard>
              </Route>
              <Route path="/resilience">
                <RouteGuard>
                  <ResilienceMetricsPage />
                </RouteGuard>
              </Route>
              <Route path="/companion">
                <RouteGuard>
                  <AdaptiveCompanionPage />
                </RouteGuard>
              </Route>
              <Route path="/knowledge-synthesis">
                <RouteGuard>
                  <KnowledgeSynthesisPage />
                </RouteGuard>
              </Route>
              <Route path="/wisdom-practices">
                <RouteGuard>
                  <WisdomPracticesPage />
                </RouteGuard>
              </Route>
              <Route path="/growth-analytics">
                <RouteGuard>
                  <GrowthAnalyticsPage />
                </RouteGuard>
              </Route>
              <Route path="/guided-journaling">
                <RouteGuard>
                  <GuidedJournalingPage />
                </RouteGuard>
              </Route>
              <Route path="/insight-cards">
                <RouteGuard>
                  <InsightCardsPage />
                </RouteGuard>
              </Route>
              <Route path="/progress">
                <RouteGuard>
                  <ProgressDashboardPage />
                </RouteGuard>
              </Route>
              <Route path="/wisdom-synthesis">
                <RouteGuard>
                  <WisdomSynthesisPage />
                </RouteGuard>
              </Route>
              <Route path="/cognitive-architecture">
                <RouteGuard>
                  <CognitiveArchitecturePage />
                </RouteGuard>
              </Route>
              <Route path="/philosophical-inquiry">
                <RouteGuard>
                  <PhilosophicalInquiryPage />
                </RouteGuard>
              </Route>
              <Route path="/daily-wisdom">
                <RouteGuard>
                  <DailyWisdomOraclePage />
                </RouteGuard>
              </Route>
              <Route path="/systems-thinking">
                <RouteGuard>
                  <SystemsThinkingPage />
                </RouteGuard>
              </Route>
              <Route path="/meta-learning">
                <RouteGuard>
                  <MetaLearningPage />
                </RouteGuard>
              </Route>
              <Route path="/content-studio">
                <RouteGuard>
                  <ContentStudioPage />
                </RouteGuard>
              </Route>
              <Route path="/study-vault">
                <RouteGuard>
                  <StudyVaultPage />
                </RouteGuard>
              </Route>
              <Route path="/elite-tools">
                <RouteGuard>
                  <EliteToolsDashboard />
                </RouteGuard>
              </Route>

              {/* Legal routes */}
              <Route path="/ethics" component={Ethics} />
              <Route path="/disclaimer" component={Disclaimer} />
              <Route path="/terms" component={Terms} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/legal" component={Legal} />
              <Route path="/safety" component={SafetyPage} />

              {/* Fallback */}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
          </main>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}
