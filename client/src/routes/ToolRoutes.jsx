import { Route } from "wouter";
import {
  WellnessToolsHub,
  GAD7Assessment,
  PHQ9Assessment,
  CognitiveDistortionChecker,
  BreathPacer,
  BoundaryBuilderTool,
  ManipulationDetector,
  SleepQualityCalculator,
  NervousSystemCheck,
  ToolsIndex,
  JournalPage,
  MoodPage,
  BreathingTool,
  AffirmationWall,
  PracticeLibrary,
} from "./lazyRoutes.jsx";

export default function ToolRoutes({ WellnessRoute, ConfigRoute }) {
  return (
    <>
      <Route path="/wellness-tools-hub"><WellnessToolsHub /></Route>
      <Route path="/tools/gad7"><GAD7Assessment /></Route>
      <Route path="/tools/phq9"><PHQ9Assessment /></Route>
      <Route path="/tools/distortion-checker"><CognitiveDistortionChecker /></Route>
      <Route path="/tools/breath-pacer"><BreathPacer /></Route>
      <Route path="/tools/boundary-builder"><BoundaryBuilderTool /></Route>
      <Route path="/tools/manipulation-detector"><ManipulationDetector /></Route>
      <Route path="/tools/sleep-quality-calculator"><SleepQualityCalculator /></Route>
      <Route path="/tools/nervous-system-check"><NervousSystemCheck /></Route>
      <Route path="/tools/all"><ToolsIndex /></Route>

      <Route path="/tools/journal"><WellnessRoute><JournalPage /></WellnessRoute></Route>
      <Route path="/tools/mood"><WellnessRoute><MoodPage /></WellnessRoute></Route>
      <Route path="/tools/breathing"><BreathingTool /></Route>
      <Route path="/tools/affirmations"><AffirmationWall /></Route>
      <Route path="/tools/meditation">{() => <ConfigRoute route="/meditation" />}</Route>
      <Route path="/tools/grounding">{() => <ConfigRoute route="/grounding" />}</Route>
      <Route path="/tools/self-care">{() => <ConfigRoute route="/self-care" />}</Route>

      <Route path="/wellness-tools">{() => <PracticeLibrary />}</Route>
    </>
  );
}
