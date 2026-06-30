import React from "react";
import { Route } from "react-router-dom";

export default function ToolRoutes({
  WellnessRoute,
  ValuesFinderPage,
  BoundariesPage,
  MovementSnacksPage,
  CoherenceLadderPage,
  PerceptionRefinementPage,
  NervousSystemFloodingPage,
  PermacultureWellnessPage,
  SelfWorthReflectionPage,
  TwelveStepsPage,
  BehaviorChangePage,
  CompassionBreak,
  Reframe,
  UrgeSurf,
  GriefLetter,
  RepairScript,
  AweMicrodose,
  BodyScan,
  DigitalSunset,
  MeaningMap,
  CommunityCheckin,
  EmotionWheel,
  WeeklyReflection,
}) {
  return (
    <>
      <Route path="/tools/values" element={<WellnessRoute><ValuesFinderPage /></WellnessRoute>} />
      <Route path="/tools/boundaries" element={<WellnessRoute><BoundariesPage /></WellnessRoute>} />
      <Route path="/tools/movement-snacks" element={<WellnessRoute><MovementSnacksPage /></WellnessRoute>} />
      <Route path="/tools/coherence" element={<WellnessRoute><CoherenceLadderPage /></WellnessRoute>} />
      <Route path="/tools/perception-refinement" element={<WellnessRoute><PerceptionRefinementPage /></WellnessRoute>} />
      <Route path="/tools/nervous-system-flooding" element={<WellnessRoute><NervousSystemFloodingPage /></WellnessRoute>} />
      <Route path="/tools/permaculture" element={<WellnessRoute><PermacultureWellnessPage /></WellnessRoute>} />
      <Route path="/tools/self-worth" element={<WellnessRoute><SelfWorthReflectionPage /></WellnessRoute>} />
      <Route path="/tools/twelve-steps" element={<WellnessRoute><TwelveStepsPage /></WellnessRoute>} />
      <Route path="/tools/behavior-change" element={<WellnessRoute><BehaviorChangePage /></WellnessRoute>} />
      <Route path="/tools/compassion-break" element={<WellnessRoute><CompassionBreak /></WellnessRoute>} />
      <Route path="/tools/reframe-tool" element={<WellnessRoute><Reframe /></WellnessRoute>} />
      <Route path="/tools/urge-surf" element={<WellnessRoute><UrgeSurf /></WellnessRoute>} />
      <Route path="/tools/grief-letter" element={<WellnessRoute><GriefLetter /></WellnessRoute>} />
      <Route path="/tools/repair-script" element={<WellnessRoute><RepairScript /></WellnessRoute>} />
      <Route path="/tools/awe-microdose" element={<WellnessRoute><AweMicrodose /></WellnessRoute>} />
      <Route path="/tools/body-scan" element={<WellnessRoute><BodyScan /></WellnessRoute>} />
      <Route path="/tools/digital-sunset" element={<WellnessRoute><DigitalSunset /></WellnessRoute>} />
      <Route path="/tools/meaning-map" element={<WellnessRoute><MeaningMap /></WellnessRoute>} />
      <Route path="/tools/community-checkin" element={<WellnessRoute><CommunityCheckin /></WellnessRoute>} />
      <Route path="/tools/emotion-wheel" element={<WellnessRoute><EmotionWheel /></WellnessRoute>} />
      <Route path="/tools/weekly-reflection" element={<WellnessRoute><WeeklyReflection /></WellnessRoute>} />
    </>
  );
}
