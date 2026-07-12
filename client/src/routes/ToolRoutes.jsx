import React from "react";
import { Route } from "wouter";
import {
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
} from "./lazyRoutes.jsx";

export default function ToolRoutes({ WellnessRoute }) {
  return (
    <>
      <Route path="/tools/values"><WellnessRoute><ValuesFinderPage /></WellnessRoute></Route>
      <Route path="/tools/boundaries"><WellnessRoute><BoundariesPage /></WellnessRoute></Route>
      <Route path="/tools/movement-snacks"><WellnessRoute><MovementSnacksPage /></WellnessRoute></Route>
      <Route path="/tools/coherence"><WellnessRoute><CoherenceLadderPage /></WellnessRoute></Route>
      <Route path="/tools/perception-refinement"><WellnessRoute><PerceptionRefinementPage /></WellnessRoute></Route>
      <Route path="/tools/nervous-system-flooding"><WellnessRoute><NervousSystemFloodingPage /></WellnessRoute></Route>
      <Route path="/tools/permaculture"><WellnessRoute><PermacultureWellnessPage /></WellnessRoute></Route>
      <Route path="/tools/self-worth"><WellnessRoute><SelfWorthReflectionPage /></WellnessRoute></Route>
      <Route path="/tools/twelve-steps"><WellnessRoute><TwelveStepsPage /></WellnessRoute></Route>
      <Route path="/tools/behavior-change"><WellnessRoute><BehaviorChangePage /></WellnessRoute></Route>
      <Route path="/tools/compassion-break"><WellnessRoute><CompassionBreak /></WellnessRoute></Route>
      <Route path="/tools/reframe-tool"><WellnessRoute><Reframe /></WellnessRoute></Route>
      <Route path="/tools/urge-surf"><WellnessRoute><UrgeSurf /></WellnessRoute></Route>
      <Route path="/tools/grief-letter"><WellnessRoute><GriefLetter /></WellnessRoute></Route>
      <Route path="/tools/repair-script"><WellnessRoute><RepairScript /></WellnessRoute></Route>
      <Route path="/tools/awe-microdose"><WellnessRoute><AweMicrodose /></WellnessRoute></Route>
      <Route path="/tools/body-scan"><WellnessRoute><BodyScan /></WellnessRoute></Route>
      <Route path="/tools/digital-sunset"><WellnessRoute><DigitalSunset /></WellnessRoute></Route>
      <Route path="/tools/meaning-map"><WellnessRoute><MeaningMap /></WellnessRoute></Route>
      <Route path="/tools/community-checkin"><WellnessRoute><CommunityCheckin /></WellnessRoute></Route>
      <Route path="/tools/emotion-wheel"><WellnessRoute><EmotionWheel /></WellnessRoute></Route>
      <Route path="/tools/weekly-reflection"><WellnessRoute><WeeklyReflection /></WellnessRoute></Route>
    </>
  );
}
