import { Route } from "wouter";
import {
  SleepHubPage, BoundariesHubPage, SelfWorthHubPage, ResilienceHubPage,
  AnxietyHubPage, RelationshipsHubPage, GriefHubPage, SelfCompassionHubPage,
  MindfulnessHubPage, StressHubPage, TraumaHealingHubPage,
  EmotionalIntelligenceHubPage, PersonalGrowthHubPage, InnerPeaceHubPage,
  HubsIndexPage, PathwaysHome, HealingJourneyHubPage, SelfCareHubPage,
  CopingSkillsHubPage, InnerWorkHubPage, BreathworkHubPage, JournalingHubPage,
  BodyMindHubPage, DailyPracticeHubPage, GratitudeHubPage, ThoughtworkHubPage,
  LifePurposeHubPage, CommunicationHubPage, ForgivenessHubPage,
  EnergyManagementHubPage, HabitsHubPage, ConfidenceHubPage, FocusHubPage,
  SpiritualityHubPage, MotivationHubPage, AcceptanceHubPage, CreativityHubPage,
  SelfAwarenessHubPage, NervousSystemHubPage, PresenceHubPage, WisdomHubPage,
  SelfDiscoveryHubPage
} from "./lazyRoutes.jsx";

export default function HubRoutes({ WellnessRoute, ProtectedRoute }) {
  return (
    <>
      <Route path="/hubs/sleep"><WellnessRoute><SleepHubPage /></WellnessRoute></Route>
      <Route path="/hubs/boundaries"><WellnessRoute><BoundariesHubPage /></WellnessRoute></Route>
      <Route path="/hubs/self-worth"><WellnessRoute><SelfWorthHubPage /></WellnessRoute></Route>
      <Route path="/hubs/resilience"><WellnessRoute><ResilienceHubPage /></WellnessRoute></Route>
      <Route path="/hubs/anxiety"><WellnessRoute><AnxietyHubPage /></WellnessRoute></Route>
      <Route path="/hubs/relationships"><WellnessRoute><RelationshipsHubPage /></WellnessRoute></Route>
      <Route path="/hubs/grief"><WellnessRoute><GriefHubPage /></WellnessRoute></Route>
      <Route path="/hubs/self-compassion"><WellnessRoute><SelfCompassionHubPage /></WellnessRoute></Route>
      <Route path="/hubs/mindfulness"><WellnessRoute><MindfulnessHubPage /></WellnessRoute></Route>
      <Route path="/hubs/stress"><WellnessRoute><StressHubPage /></WellnessRoute></Route>
      <Route path="/hubs/trauma-healing"><WellnessRoute><TraumaHealingHubPage /></WellnessRoute></Route>
      <Route path="/hubs/emotional-intelligence"><WellnessRoute><EmotionalIntelligenceHubPage /></WellnessRoute></Route>
      <Route path="/hubs/personal-growth"><WellnessRoute><PersonalGrowthHubPage /></WellnessRoute></Route>
      <Route path="/hubs/inner-peace"><WellnessRoute><InnerPeaceHubPage /></WellnessRoute></Route>
      <Route path="/hubs"><WellnessRoute><HubsIndexPage /></WellnessRoute></Route>
      <Route path="/explore/topics"><WellnessRoute><HubsIndexPage /></WellnessRoute></Route>
      <Route path="/explore/pathways"><ProtectedRoute><PathwaysHome /></ProtectedRoute></Route>
      <Route path="/explore/search"><WellnessRoute><HubsIndexPage /></WellnessRoute></Route>
      <Route path="/hubs/healing-journey"><WellnessRoute><HealingJourneyHubPage /></WellnessRoute></Route>
      <Route path="/hubs/self-care"><WellnessRoute><SelfCareHubPage /></WellnessRoute></Route>
      <Route path="/hubs/coping-skills"><WellnessRoute><CopingSkillsHubPage /></WellnessRoute></Route>
      <Route path="/hubs/inner-work"><WellnessRoute><InnerWorkHubPage /></WellnessRoute></Route>
      <Route path="/hubs/breathwork"><WellnessRoute><BreathworkHubPage /></WellnessRoute></Route>
      <Route path="/hubs/journaling"><WellnessRoute><JournalingHubPage /></WellnessRoute></Route>
      <Route path="/hubs/body-mind"><WellnessRoute><BodyMindHubPage /></WellnessRoute></Route>
      <Route path="/hubs/daily-practice"><WellnessRoute><DailyPracticeHubPage /></WellnessRoute></Route>
      <Route path="/hubs/gratitude"><WellnessRoute><GratitudeHubPage /></WellnessRoute></Route>
      <Route path="/hubs/thoughtwork"><WellnessRoute><ThoughtworkHubPage /></WellnessRoute></Route>
      <Route path="/hubs/life-purpose"><WellnessRoute><LifePurposeHubPage /></WellnessRoute></Route>
      <Route path="/hubs/communication"><WellnessRoute><CommunicationHubPage /></WellnessRoute></Route>
      <Route path="/hubs/forgiveness"><WellnessRoute><ForgivenessHubPage /></WellnessRoute></Route>
      <Route path="/hubs/energy-management"><WellnessRoute><EnergyManagementHubPage /></WellnessRoute></Route>
      <Route path="/hubs/habits"><WellnessRoute><HabitsHubPage /></WellnessRoute></Route>
      <Route path="/hubs/confidence"><WellnessRoute><ConfidenceHubPage /></WellnessRoute></Route>
      <Route path="/hubs/focus"><WellnessRoute><FocusHubPage /></WellnessRoute></Route>
      <Route path="/hubs/spirituality"><WellnessRoute><SpiritualityHubPage /></WellnessRoute></Route>
      <Route path="/hubs/motivation"><WellnessRoute><MotivationHubPage /></WellnessRoute></Route>
      <Route path="/hubs/acceptance"><WellnessRoute><AcceptanceHubPage /></WellnessRoute></Route>
      <Route path="/hubs/creativity"><WellnessRoute><CreativityHubPage /></WellnessRoute></Route>
      <Route path="/hubs/self-awareness"><WellnessRoute><SelfAwarenessHubPage /></WellnessRoute></Route>
      <Route path="/hubs/nervous-system"><WellnessRoute><NervousSystemHubPage /></WellnessRoute></Route>
      <Route path="/hubs/presence"><WellnessRoute><PresenceHubPage /></WellnessRoute></Route>
      <Route path="/hubs/wisdom"><WellnessRoute><WisdomHubPage /></WellnessRoute></Route>
      <Route path="/hubs/self-discovery"><WellnessRoute><SelfDiscoveryHubPage /></WellnessRoute></Route>
      <Route path="/hubs/emotions"><WellnessRoute><EmotionalIntelligenceHubPage /></WellnessRoute></Route>
      <Route path="/hubs/self-love"><WellnessRoute><SelfCompassionHubPage /></WellnessRoute></Route>
    </>
  );
}
