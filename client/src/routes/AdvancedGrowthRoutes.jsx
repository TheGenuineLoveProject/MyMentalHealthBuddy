import { Route } from "wouter";
import {
  AdaptiveCompanionPage,
  AdvancedToolsPage,
  AlignmentPath,
  AtlasDashboard,
  BreathTool,
  CognitiveArchitecturePage,
  CollaborativeLabPage,
  ContentStudioPage,
  DailyRitualPage,
  EliteToolsDashboard,
  GrowthAnalyticsPage,
  GuidedJournalingPage,
  InsightCardsPage,
  KnowledgeSynthesisPage,
  MasteryToolsPage,
  MetaLearningPage,
  MirrorPage,
  PhilosophicalInquiryPage,
  ProgressDashboardPage,
  ReframePage,
  ResilienceCanonical,
  StrategyMapsPage,
  StudyVaultPage,
  SystemMapPage,
  SystemsThinkingPage,
  ToolsPage,
} from "./lazyRoutes.jsx";

export default function AdvancedGrowthRoutes({ WellnessRoute, ProtectedRoute }) {
  return (
    <>
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
    </>
  );
}
