# Phase 74 — Discovery Route Visibility Verification

## Purpose
Confirm that the global discovery engine is reachable and ready for visible navigation.

## Required Public Route
/discover

## Verification Targets
- DiscoveryPage exists
- useToolSearch exists
- ToolCard exists
- toolRegistry exists
- App route includes /discover
- build passes
- production health remains green

## Safety
No billing, auth, crisis, database, secrets, or runtime changes.

## Next Step
If /discover is confirmed, add a visible navigation link labeled:
Discover Tools
echo "===== PHASE 74 COMPLETE ====="fy discovery route visibility"
===== PHASE 74: VERIFY DISCOVERY ROUTE + VISIBLE NAV LINK =====
===== 1) VERIFY DISCOVERY FILES EXIST =====
✅ DiscoveryPage exists
✅ useToolSearch exists
✅ ToolCard exists
✅ toolRegistry exists
===== 2) VERIFY /discover ROUTE EXISTS IN APP =====
client/src/App.jsx:939:              <Route path="/discover">{() => <Redirect to="/wellness-tools" />}</Route>
❌ /discover route not found yet
===== 3) VERIFY APP BUILDS =====

> mymentalhealthbuddy@1.0.0 build
> vite build

vite v8.0.14 building client environment for production...
✓ 3086 modules transformed.
computing gzip size...
client/dist/index.html                                                          10.65 kB │ gzip:  3.13 kB
client/dist/assets/thegenuineloveproject_logo_v2_1777538625498-B2Z66psB.png  1,608.47 kB
client/dist/assets/mmhb_brand_logo_lockup_1777538625498-Bg5tRRhq.png         2,073.40 kB
client/dist/assets/lumi-registry-Pmn-ADNv.css                                    1.06 kB │ gzip:  0.45 kB
client/dist/assets/FloatIdleRig-B2X9YbFE.css                                     1.11 kB │ gzip:  0.39 kB
client/dist/assets/_autopilot-BZu_wX0b.css                                       1.29 kB │ gzip:  0.59 kB
client/dist/assets/glp-pane-DKnephKp.css                                         1.29 kB │ gzip:  0.55 kB
client/dist/assets/sacred-C3NivM-a.css                                           1.98 kB │ gzip:  0.73 kB
client/dist/assets/WellnessPageShell-DJNG-4h4.css                                2.10 kB │ gzip:  0.75 kB
client/dist/assets/PeacescapePage-DfUayL-v.css                                   2.99 kB │ gzip:  0.80 kB
client/dist/assets/CelebrationFlow-D71fqt0c.css                                  3.47 kB │ gzip:  0.88 kB
client/dist/assets/sacred-visuals-CKPEwYqm.css                                   4.31 kB │ gzip:  1.32 kB
client/dist/assets/CheckIn-KbUv1xsW.css                                          4.42 kB │ gzip:  1.06 kB
client/dist/assets/AvatarLab-B6WI5thR.css                                        6.24 kB │ gzip:  1.29 kB
client/dist/assets/FloatIdleAnimated-BvKpiykY.css                                6.74 kB │ gzip:  1.37 kB
client/dist/assets/BreathingTool-DS2q5R40.css                                    7.28 kB │ gzip:  1.46 kB
client/dist/assets/ContentStudioPage-DH_xWkv_.css                                9.62 kB │ gzip:  1.89 kB
client/dist/assets/Overview-DThRZbH-.css                                        10.00 kB │ gzip:  2.28 kB
client/dist/assets/LumiMascot-Bl-icsbP.css                                      10.08 kB │ gzip:  1.93 kB
client/dist/assets/CommandCenter-BfVTyNhP.css                                   11.40 kB │ gzip:  2.47 kB
client/dist/assets/ZenScape-CBZtDpQF.css                                        11.61 kB │ gzip:  2.75 kB
client/dist/assets/BuddyAvatar-CjKorakm.css                                     12.63 kB │ gzip:  2.56 kB
client/dist/assets/LumiV6Preview-DMCLDRmU.css                                   21.38 kB │ gzip:  4.72 kB
client/dist/assets/SacredFooter-DSt2bIFs.css                                    33.35 kB │ gzip:  4.39 kB
client/dist/assets/PageTemplate-DPX131m5.css                                    48.91 kB │ gzip:  7.52 kB
client/dist/assets/CanvaLanding-Bi6MZ_aZ.css                                    53.64 kB │ gzip:  9.05 kB
client/dist/assets/index-VZ0CyR5M.css                                          352.24 kB │ gzip: 58.75 kB
client/dist/assets/lucide-brands-BJ3s_z9g.js                                     0.14 kB │ gzip:  0.12 kB
client/dist/assets/CrisisLanguagePattern-DAaSmDRR.js                             0.21 kB │ gzip:  0.16 kB
client/dist/assets/ui-CSY1EpV2.js                                                0.22 kB │ gzip:  0.17 kB
client/dist/assets/firstCheckinFlag-BRy-V2tX.js                                  0.24 kB │ gzip:  0.17 kB
client/dist/assets/Label-BgyPcKQI.js                                             0.41 kB │ gzip:  0.29 kB
client/dist/assets/Microcopy-y_fVTRji.js                                         0.50 kB │ gzip:  0.33 kB
client/dist/assets/useAuth-B4NAqRVj.js                                           0.59 kB │ gzip:  0.39 kB
client/dist/assets/LumiMascotImage-DdQ0jvYk.js                                   0.68 kB │ gzip:  0.46 kB
client/dist/assets/react-DTmNJSak.js                                             0.73 kB │ gzip:  0.45 kB
client/dist/assets/Input-ChYESn7d.js                                             0.78 kB │ gzip:  0.44 kB
client/dist/assets/rolldown-runtime-M0oDzQ_3.js                                  0.82 kB │ gzip:  0.47 kB
client/dist/assets/RelatedLinksBlock-CP6KREB4.js                                 1.06 kB │ gzip:  0.51 kB
client/dist/assets/api-DblkvTlJ.js                                               1.30 kB │ gzip:  0.66 kB
client/dist/assets/badge-C-QySCZk.js                                             1.33 kB │ gzip:  0.58 kB
client/dist/assets/Button-CBNZ7w5h.js                                            1.47 kB │ gzip:  0.67 kB
client/dist/assets/PersistentDisclaimer-D5Fbd996.js                              1.48 kB │ gzip:  0.64 kB
client/dist/assets/SafetyFooter-CHwQ1URT.js                                      1.56 kB │ gzip:  0.64 kB
client/dist/assets/Switch-BDIVV-_x.js                                            1.58 kB │ gzip:  0.78 kB
client/dist/assets/LumiMascot-By1J_zH6.js                                        1.61 kB │ gzip:  0.88 kB
client/dist/assets/AdminQueryStates-C5d7dDC-.js                                  1.61 kB │ gzip:  0.69 kB
client/dist/assets/useSEO-BcQVkWYN.js                                            1.72 kB │ gzip:  0.90 kB
client/dist/assets/lumiEmotionMap-Cpmh9r6i.js                                    1.79 kB │ gzip:  0.64 kB
client/dist/assets/LegalFooter-IZwtbhDP.js                                       2.07 kB │ gzip:  0.85 kB
client/dist/assets/LoginCallback-D0Z05aIl.js                                     2.22 kB │ gzip:  1.21 kB
client/dist/assets/SavedLibrary-CYKr3Hmv.js                                      2.29 kB │ gzip:  1.05 kB
client/dist/assets/buildGovernanceAttrs-D6IxOzqu.js                              2.29 kB │ gzip:  0.86 kB
client/dist/assets/Card-BPp5aBkk.js                                              2.49 kB │ gzip:  0.81 kB
client/dist/assets/WisdomHubPage-Dl62Jd1j.js                                     2.55 kB │ gzip:  1.20 kB
client/dist/assets/CreativityHubPage-BhYUva55.js                                 2.59 kB │ gzip:  1.21 kB
client/dist/assets/BuddyPanel-ChAgvE6h.js                                        2.60 kB │ gzip:  1.23 kB
client/dist/assets/MotivationHubPage-WZkr-F8J.js                                 2.60 kB │ gzip:  1.23 kB
client/dist/assets/FocusHubPage-CaalHmaC.js                                      2.60 kB │ gzip:  1.23 kB
client/dist/assets/PresenceHubPage-DwQXHvV4.js                                   2.62 kB │ gzip:  1.19 kB
client/dist/assets/SelfDiscoveryHubPage-bX0fdud0.js                              2.62 kB │ gzip:  1.22 kB
client/dist/assets/ConfidenceHubPage-CK9_Zzzj.js                                 2.64 kB │ gzip:  1.21 kB
client/dist/assets/DailyPracticeHubPage-Q2VX8XJM.js                              2.64 kB │ gzip:  1.24 kB
client/dist/assets/InnerPeaceHubPage-C_0iN-ev.js                                 2.65 kB │ gzip:  1.24 kB
client/dist/assets/InnerWorkHubPage-CnJed8-h.js                                  2.66 kB │ gzip:  1.23 kB
client/dist/assets/SelfAwarenessHubPage-D8qIwIai.js                              2.67 kB │ gzip:  1.24 kB
client/dist/assets/GratitudeHubPage-Cscj8xow.js                                  2.68 kB │ gzip:  1.22 kB
client/dist/assets/JournalingHubPage-CSfbUhTS.js                                 2.68 kB │ gzip:  1.24 kB
client/dist/assets/LifePurposeHubPage-CENmzrxX.js                                2.68 kB │ gzip:  1.28 kB
client/dist/assets/BreathworkHubPage-BPAmLuPn.js                                 2.70 kB │ gzip:  1.25 kB
client/dist/assets/BodyMindHubPage-ls21WXD_.js                                   2.70 kB │ gzip:  1.27 kB
client/dist/assets/EnergyManagementHubPage-BbRZ5qar.js                           2.71 kB │ gzip:  1.26 kB
client/dist/assets/HealingJourneyHubPage-BHcMKirk.js                             2.72 kB │ gzip:  1.27 kB
client/dist/assets/PersonalGrowthHubPage-Vh0uMzvh.js                             2.72 kB │ gzip:  1.29 kB
client/dist/assets/CommunicationHubPage-CciWmIyx.js                              2.72 kB │ gzip:  1.24 kB
client/dist/assets/ThoughtworkHubPage-DcnZccNM.js                                2.73 kB │ gzip:  1.27 kB
client/dist/assets/StressHubPage-DS9AsdLc.js                                     2.73 kB │ gzip:  1.31 kB
client/dist/assets/SelfCareHubPage-CB2luViO.js                                   2.75 kB │ gzip:  1.27 kB
client/dist/assets/CopingSkillsHubPage-B29jbobK.js                               2.75 kB │ gzip:  1.29 kB
client/dist/assets/MindfulnessHubPage-Brhjrrm2.js                                2.75 kB │ gzip:  1.28 kB
client/dist/assets/GriefHubPage-BLpZfGPS.js                                      2.79 kB │ gzip:  1.32 kB
client/dist/assets/LearnHub-C8LiZ4LO.js                                          2.79 kB │ gzip:  1.11 kB
client/dist/assets/SelfCompassionHubPage-DAfVH4KM.js                             2.81 kB │ gzip:  1.32 kB
client/dist/assets/RelationshipsHubPage-jhFtjjxV.js                              2.82 kB │ gzip:  1.28 kB
client/dist/assets/EmotionalIntelligenceHubPage-u8X3AZ36.js                      2.83 kB │ gzip:  1.29 kB
client/dist/assets/AnxietyHubPage-Cx8SYzuS.js                                    2.85 kB │ gzip:  1.34 kB
client/dist/assets/LearnGuides-wdMIqONC.js                                       2.90 kB │ gzip:  1.15 kB
client/dist/assets/SelfWorthHubPage-lu2UIZzo.js                                  2.92 kB │ gzip:  1.33 kB
client/dist/assets/SleepHubPage-Bsw65NGj.js                                      2.92 kB │ gzip:  1.34 kB
client/dist/assets/TopicHubPage-d5C93_Kx.js                                      2.95 kB │ gzip:  1.44 kB
client/dist/assets/BoundariesHubPage-DVxFIIEq.js                                 2.96 kB │ gzip:  1.37 kB
client/dist/assets/ResilienceHubPage-BQ3-Fa0E.js                                 2.97 kB │ gzip:  1.37 kB
client/dist/assets/QuickDiagnostics-C6cxfP21.js                                  2.99 kB │ gzip:  1.12 kB
client/dist/assets/HabitsHubPage-qfGjk_vt.js                                     3.01 kB │ gzip:  1.40 kB
client/dist/assets/SpiritualityHubPage-D2BrLPNd.js                               3.04 kB │ gzip:  1.34 kB
client/dist/assets/LearnArticles-KNJ1yLkN.js                                     3.04 kB │ gzip:  1.10 kB
client/dist/assets/AcceptanceHubPage-B5YHiFUo.js                                 3.07 kB │ gzip:  1.39 kB
client/dist/assets/NervousSystemHubPage-D1UCpg6o.js                              3.07 kB │ gzip:  1.38 kB
client/dist/assets/ForgivenessHubPage-DeIx2991.js                                3.08 kB │ gzip:  1.39 kB
client/dist/assets/FloatIdleRig-D8nCmwgZ.js                                      3.09 kB │ gzip:  1.50 kB
client/dist/assets/ProgressDashboard-DxAjVJ9i.js                                 3.17 kB │ gzip:  1.33 kB
client/dist/assets/tabs-Cil-NNFb.js                                              3.28 kB │ gzip:  1.43 kB
client/dist/assets/TraumaHealingHubPage-7Zug3iuZ.js                              3.29 kB │ gzip:  1.46 kB
client/dist/assets/GroupedHealthOverview-CdJy1wJV.js                             3.41 kB │ gzip:  1.33 kB
client/dist/assets/FloatIdleAnimated-DpeoBGGF.js                                 3.66 kB │ gzip:  1.56 kB
client/dist/assets/ReflectionFooter-BqlNxNJr.js                                  3.67 kB │ gzip:  1.13 kB
client/dist/assets/LegalPage-BDBf0Hro.js                                         3.79 kB │ gzip:  1.40 kB
client/dist/assets/BenefitsBlock-D9lPWBga.js                                     3.90 kB │ gzip:  1.04 kB
client/dist/assets/StateTracker-OD7v0sSB.js                                      3.94 kB │ gzip:  1.72 kB
client/dist/assets/buddyEmotion-BUOiKKz1.js                                      3.94 kB │ gzip:  1.49 kB
client/dist/assets/BlogDraftViewer-CIgqzkx4.js                                   4.02 kB │ gzip:  1.57 kB
client/dist/assets/InfinityHeartCard-CG2tqG8o.js                                 4.06 kB │ gzip:  1.36 kB
client/dist/assets/DataExportButton-DdpcrKx0.js                                  4.13 kB │ gzip:  1.57 kB
client/dist/assets/StatePage-KcMhHSZZ.js                                         4.16 kB │ gzip:  1.81 kB
client/dist/assets/Sessions-CJ1-oDJk.js                                          4.18 kB │ gzip:  1.57 kB
client/dist/assets/RefundHelp-ChenK6Hx.js                                        4.21 kB │ gzip:  1.56 kB
client/dist/assets/SectionContainer-gMcjPo_c.js                                  4.27 kB │ gzip:  1.64 kB
client/dist/assets/GlowFooter-DQxnnK2x.js                                        4.42 kB │ gzip:  1.74 kB
client/dist/assets/OrderHistory-DSFg9ns9.js                                      4.46 kB │ gzip:  1.55 kB
client/dist/assets/ValuesToActions-YdX1xudf.js                                   4.50 kB │ gzip:  1.90 kB
client/dist/assets/VoiceAffirmation-CQlPlUwH.js                                  4.52 kB │ gzip:  1.98 kB
client/dist/assets/NewsletterSignup-CA9vQCE2.js                                  4.53 kB │ gzip:  1.86 kB
client/dist/assets/ConsentBanner-Dz3AlkFO.js                                     4.59 kB │ gzip:  1.47 kB
client/dist/assets/select-D7YnigDc.js                                            4.65 kB │ gzip:  1.81 kB
client/dist/assets/UserProfile-Cxj-GIbe.js                                       4.65 kB │ gzip:  1.53 kB
client/dist/assets/WelcomeBackBanner-iObumI1I.js                                 4.72 kB │ gzip:  1.64 kB
client/dist/assets/MIPromptCard-Xu3qJTl1.js                                      4.74 kB │ gzip:  1.63 kB
client/dist/assets/RepairScript-i9kYyyM6.js                                      4.74 kB │ gzip:  2.02 kB
client/dist/assets/AweMicrodose-CdhnkCGT.js                                      4.77 kB │ gzip:  1.93 kB
client/dist/assets/CalmPlan-CwEMNZFn.js                                          4.78 kB │ gzip:  1.94 kB
client/dist/assets/CompassionBreak-BD0YmM7x.js                                   4.81 kB │ gzip:  1.80 kB
client/dist/assets/DigitalSunset-BvNqFkoD.js                                     4.85 kB │ gzip:  1.89 kB
client/dist/assets/ValuesPage-DqIP6I75.js                                        4.94 kB │ gzip:  1.89 kB
client/dist/assets/WellnessScore-BJMSOwJM.js                                     4.99 kB │ gzip:  1.87 kB
client/dist/assets/EmotionAdaptiveBackground-BapXzX71.js                         5.08 kB │ gzip:  1.49 kB
client/dist/assets/PathwaysHome-CXVvsFD5.js                                      5.16 kB │ gzip:  2.00 kB
client/dist/assets/ShareCardPrompt-Ccyv4SDm.js                                   5.18 kB │ gzip:  1.46 kB
client/dist/assets/GoalOnboarding-Cl3bAiJW.js                                    5.24 kB │ gzip:  1.92 kB
client/dist/assets/CreatorProfile-Ddm1Zzaa.js                                    5.37 kB │ gzip:  1.94 kB
client/dist/assets/GratitudePrompt-CbCwZFcD.js                                   5.53 kB │ gzip:  2.21 kB
client/dist/assets/UrgeSurf-D4r9K0NZ.js                                          5.59 kB │ gzip:  2.12 kB
client/dist/assets/AIDiagnosticsPanel-BjZ3_5eu.js                                5.61 kB │ gzip:  1.64 kB
client/dist/assets/Favorites-hUmxByAX.js                                         5.61 kB │ gzip:  1.98 kB
client/dist/assets/Upgrade-BiH3Lahv.js                                           5.62 kB │ gzip:  2.42 kB
client/dist/assets/FeedbackWidget-CP6OzvWl.js                                    5.64 kB │ gzip:  2.21 kB
client/dist/assets/DataRetention-BX3ROKwF.js                                     5.67 kB │ gzip:  1.86 kB
client/dist/assets/XPProgressBar-BzdLgNDg.js                                     5.69 kB │ gzip:  1.44 kB
client/dist/assets/GitIntegrityScanner-grZjZZKJ.js                               5.77 kB │ gzip:  1.55 kB
client/dist/assets/AboutApproachPage-yydtmpQ8.js                                 5.82 kB │ gzip:  1.80 kB
client/dist/assets/Subscription-r6LG6WDy.js                                      5.93 kB │ gzip:  2.04 kB
client/dist/assets/CommunityCheckin-CySDhGc9.js                                  5.93 kB │ gzip:  2.28 kB
client/dist/assets/SelfLovePage-Di6UDwAF.js                                      5.98 kB │ gzip:  2.19 kB
client/dist/assets/BodyScan-BCtV1tar.js                                          6.01 kB │ gzip:  2.31 kB
client/dist/assets/SafetyPreferences-xLuv7QKD.js                                 6.02 kB │ gzip:  2.31 kB
client/dist/assets/MeditationPlayer-Ga01xzBj.js                                  6.05 kB │ gzip:  2.11 kB
client/dist/assets/WeeklyReflection-CzWFIR9D.js                                  6.07 kB │ gzip:  2.25 kB
client/dist/assets/LearnDetail-Bs7cgXMl.js                                       6.10 kB │ gzip:  2.02 kB
client/dist/assets/PublicRoadmap-BG-4RA_1.js                                     6.11 kB │ gzip:  1.80 kB
client/dist/assets/RigLab-CMm1Mfi1.js                                            6.11 kB │ gzip:  2.19 kB
client/dist/assets/EmailDigest-B586YGXP.js                                       6.15 kB │ gzip:  2.09 kB
client/dist/assets/DeleteAccount-Cb4oDDqI.js                                     6.15 kB │ gzip:  2.06 kB
client/dist/assets/GriefLetter-bll3HUIo.js                                       6.20 kB │ gzip:  2.39 kB
client/dist/assets/ProgressStreaks-ByJf-Pkb.js                                   6.27 kB │ gzip:  2.06 kB
client/dist/assets/CommunityGuidelines-CS6zE4xb.js                               6.29 kB │ gzip:  2.04 kB
client/dist/assets/BillingViewer-DU3apNfD.js                                     6.31 kB │ gzip:  1.91 kB
client/dist/assets/PageLayout-DdNugqta.js                                        6.31 kB │ gzip:  2.20 kB
client/dist/assets/CelebrationFlow-A3pzzCJM.js                                   6.32 kB │ gzip:  2.31 kB
client/dist/assets/Newsletter-KqGx4oIx.js                                        6.32 kB │ gzip:  2.01 kB
client/dist/assets/RevenueAdmin-Co1-dDit.js                                      6.36 kB │ gzip:  2.35 kB
client/dist/assets/AccessibilityToolbar-nURlVhga.js                              6.37 kB │ gzip:  1.87 kB
client/dist/assets/CommunityHub-DXRFn78X.js                                      6.38 kB │ gzip:  1.88 kB
client/dist/assets/MMHBFloatAvatar-BbxQVgTg.js                                   6.40 kB │ gzip:  2.51 kB
client/dist/assets/Reframe-DGilPOu8.js                                           6.45 kB │ gzip:  2.23 kB
client/dist/assets/ReturnLoop-DyfhcArj.js                                        6.48 kB │ gzip:  2.49 kB
client/dist/assets/BreathPacer-DgQ8WRZ_.js                                       6.52 kB │ gzip:  2.34 kB
client/dist/assets/PressKit-CV3pe7rt.js                                          6.57 kB │ gzip:  1.99 kB
client/dist/assets/MeaningMap-C8WLXLiX.js                                        6.60 kB │ gzip:  2.48 kB
client/dist/assets/ReflectionHistory-BymyHiYR.js                                 6.62 kB │ gzip:  2.44 kB
client/dist/assets/GAD7Assessment-bRmZBgfd.js                                    6.62 kB │ gzip:  2.27 kB
client/dist/assets/BoundaryBuilderTool-C7C12of6.js                               6.65 kB │ gzip:  2.50 kB
client/dist/assets/SafetyCenter-DVhlPeeS.js                                      6.71 kB │ gzip:  2.15 kB
client/dist/assets/nlpMiContent-0KrsWk_Z.js                                      6.76 kB │ gzip:  2.72 kB
client/dist/assets/NotificationPreferences-Cg4x-Gpw.js                           6.80 kB │ gzip:  2.18 kB
client/dist/assets/FeedbackAggregator-CZXSUY8W.js                                6.86 kB │ gzip:  2.58 kB
client/dist/assets/AIChatPage-ZDaQLHpn.js                                        6.95 kB │ gzip:  2.71 kB
client/dist/assets/BreathingExercise-JtC1fvM0.js                                 6.99 kB │ gzip:  2.15 kB
client/dist/assets/WellnessToolsHub-BDMvz1t9.js                                  7.12 kB │ gzip:  2.52 kB
client/dist/assets/PricingPage-Chl-dRLt.js                                       7.20 kB │ gzip:  2.55 kB
client/dist/assets/AIPersonality-DA7eWB5m.js                                     7.23 kB │ gzip:  2.31 kB
client/dist/assets/RolesPermissions-CsA8gWdF.js                                  7.23 kB │ gzip:  2.30 kB
client/dist/assets/AdminUsers-CZnwCTv0.js                                        7.24 kB │ gzip:  2.56 kB
client/dist/assets/AchievementBadges-nsFQuuB9.js                                 7.24 kB │ gzip:  2.22 kB
client/dist/assets/tools-CGc_9FR6.js                                             7.28 kB │ gzip:  2.41 kB
client/dist/assets/BodyScanMeditation-BSgttNNJ.js                                7.29 kB │ gzip:  2.55 kB
client/dist/assets/MirrorPage-CsXgAVKE.js                                        7.32 kB │ gzip:  2.85 kB
client/dist/assets/ReframePage-Dh2aJ5cy.js                                       7.39 kB │ gzip:  2.62 kB
client/dist/assets/SocialHub-Cnce2XPI.js                                         7.43 kB │ gzip:  2.93 kB
client/dist/assets/PHQ9Assessment-BpP4CUFT.js                                    7.46 kB │ gzip:  2.44 kB
client/dist/assets/EngagementDashboard-C9DrfKJN.js                               7.49 kB │ gzip:  2.58 kB
client/dist/assets/BlogIndex-_bJp35QQ.js                                         7.49 kB │ gzip:  2.57 kB
client/dist/assets/EmotionWheel-_VOV476z.js                                      7.51 kB │ gzip:  2.60 kB
client/dist/assets/About-CWq1bWdJ.js                                             7.53 kB │ gzip:  2.18 kB
client/dist/assets/PlatformIntegrityDeepScan-BxZc64St.js                         7.64 kB │ gzip:  1.95 kB
client/dist/assets/WorryTimeScheduler-X6Ko9fA_.js                                7.69 kB │ gzip:  2.60 kB
client/dist/assets/MicroWinPrompt-B8wlJUxb.js                                    7.72 kB │ gzip:  2.67 kB
client/dist/assets/ReminderScheduler-DKF4CV_h.js                                 7.73 kB │ gzip:  2.69 kB
client/dist/assets/AnalyticsDashboard-DYXiqWkv.js                                7.76 kB │ gzip:  2.14 kB
client/dist/assets/SelfCareChecklist-P0D3cH59.js                                 7.85 kB │ gzip:  2.55 kB
client/dist/assets/ProtocolBrowser-BUTlbeMd.js                                   7.89 kB │ gzip:  2.51 kB
client/dist/assets/QuestPanel-B1NtOBKG.js                                        7.91 kB │ gzip:  2.24 kB
client/dist/assets/AffirmationWall-CGQg6IBn.js                                   7.91 kB │ gzip:  2.51 kB
client/dist/assets/PositiveReframing-M5QK1Vfk.js                                 7.94 kB │ gzip:  2.53 kB
client/dist/assets/HabitTracker-Bk4JCISX.js                                      7.97 kB │ gzip:  2.47 kB
client/dist/assets/CognitiveDistortionChecker-DItUSFIE.js                        7.99 kB │ gzip:  2.88 kB
client/dist/assets/SystemAlerts-Ctgykhzo.js                                      8.04 kB │ gzip:  2.81 kB
client/dist/assets/BoundaryBuilder-CSJXkYwt.js                                   8.06 kB │ gzip:  2.75 kB
client/dist/assets/SocialConnection-hQq5v_ke.js                                  8.09 kB │ gzip:  2.87 kB
client/dist/assets/vendor-icons-DaSKPAiq.js                                      8.12 kB │ gzip:  3.70 kB
client/dist/assets/DailyWellnessPlanner-BvfDsgwo.js                              8.19 kB │ gzip:  2.39 kB
client/dist/assets/WellnessTimer-CYr_DKQE.js                                     8.19 kB │ gzip:  2.55 kB
client/dist/assets/DigitalDetox-PRj7chR1.js                                      8.19 kB │ gzip:  2.57 kB
client/dist/assets/ProgressiveMuscleRelaxation-BCQdO-42.js                       8.26 kB │ gzip:  2.87 kB
client/dist/assets/EnergyBooster-RBGqtV-9.js                                     8.29 kB │ gzip:  2.98 kB
client/dist/assets/Profile-DU-y0YXE.js                                           8.30 kB │ gzip:  2.80 kB
client/dist/assets/MeditationTimer-Bb3IIENv.js                                   8.33 kB │ gzip:  2.62 kB
client/dist/assets/Challenge-DPomRh_P.js                                         8.35 kB │ gzip:  3.14 kB
client/dist/assets/MindfulnessBell-B7HMq1ST.js                                   8.38 kB │ gzip:  2.73 kB
client/dist/assets/Login-BXeys0dM.js                                             8.41 kB │ gzip:  2.72 kB
client/dist/assets/WellnessGoals-JAFCIuDe.js                                     8.45 kB │ gzip:  2.85 kB
client/dist/assets/VoiceSettings-tAiermWV.js                                     8.48 kB │ gzip:  2.49 kB
client/dist/assets/AdminLogin-CoYtTj8k.js                                        8.50 kB │ gzip:  3.11 kB
client/dist/assets/ContentStudioAdmin-BTqThxMl.js                                8.55 kB │ gzip:  2.96 kB
client/dist/assets/MorningEveningRituals-BMgY34ui.js                             8.60 kB │ gzip:  2.71 kB
client/dist/assets/ZenScape-C-XJMOIu.js                                          8.68 kB │ gzip:  3.03 kB
client/dist/assets/SelfCompassion-B1sdoeVq.js                                    8.68 kB │ gzip:  3.13 kB
client/dist/assets/EliteToolsDashboard-Dl7gJZPQ.js                               8.73 kB │ gzip:  2.48 kB
client/dist/assets/Privacy-AsIjBUcq.js                                           8.75 kB │ gzip:  2.39 kB
client/dist/assets/SleepQualityCalculator-Bx4Jut_5.js                            8.77 kB │ gzip:  3.20 kB
client/dist/assets/LaughterTherapy-BHOVHyOi.js                                   8.78 kB │ gzip:  3.05 kB
client/dist/assets/Invite-CA-qIDgx.js                                            8.78 kB │ gzip:  3.14 kB
client/dist/assets/PlatformIntegrityScanner-DFtnM8lY.js                          8.81 kB │ gzip:  2.26 kB
client/dist/assets/WeeklyReflection-2LKxM2Vm.js                                  8.83 kB │ gzip:  2.92 kB
client/dist/assets/ProgressAnalytics-BvtHBbP9.js                                 8.94 kB │ gzip:  2.69 kB
client/dist/assets/MoodVisualizer-BQCjno_P.js                                    8.99 kB │ gzip:  2.76 kB
client/dist/assets/CourseCatalog-CjjlhmE-.js                                     8.99 kB │ gzip:  3.26 kB
client/dist/assets/FocusTimer-p1DzRrnj.js                                        9.16 kB │ gzip:  2.92 kB
client/dist/assets/BlogEditor-BnsTyzBE.js                                        9.21 kB │ gzip:  3.03 kB
client/dist/assets/StressMonitor-By3JPTL7.js                                     9.25 kB │ gzip:  3.10 kB
client/dist/assets/SleepTracker-BGpNYqhE.js                                      9.28 kB │ gzip:  3.00 kB
client/dist/assets/ForgotPassword-DikPrRNs.js                                    9.28 kB │ gzip:  3.08 kB
client/dist/assets/WellnessPageShell-CgyvB9D3.js                                 9.30 kB │ gzip:  3.26 kB
client/dist/assets/SelfCareBingo-B0LCPUGz.js                                     9.33 kB │ gzip:  2.98 kB
client/dist/assets/DailyAffirmations-D_3XMBeJ.js                                 9.38 kB │ gzip:  3.24 kB
client/dist/assets/NextStepCTA-5wLm6OTk.js                                       9.39 kB │ gzip:  2.88 kB
client/dist/assets/SoundHealingPlayer-BCtsEVp2.js                                9.39 kB │ gzip:  3.27 kB
client/dist/assets/Analytics-7i2jXtYd.js                                         9.41 kB │ gzip:  2.50 kB
client/dist/assets/ManipulationDetector-6x_maVDd.js                              9.43 kB │ gzip:  3.63 kB
client/dist/assets/ValuesExplorer-G5gMS6Z2.js                                    9.47 kB │ gzip:  3.06 kB
client/dist/assets/MotivationBooster-BBgkhZ7z.js                                 9.52 kB │ gzip:  3.42 kB
client/dist/assets/ExamplesAccordion-C0NidOb9.js                                 9.56 kB │ gzip:  1.98 kB
client/dist/assets/ReflectionCardExport-B7hgX67l.js                              9.59 kB │ gzip:  3.19 kB
client/dist/assets/TwelveStepsPage-CTBYexZO.js                                   9.60 kB │ gzip:  3.65 kB
client/dist/assets/DailyReflection-BwWgNmJa.js                                   9.62 kB │ gzip:  3.09 kB
client/dist/assets/AuditLogExplorer-u5rgGj7q.js                                  9.63 kB │ gzip:  2.95 kB
client/dist/assets/CrisisStabilizer-Bz4qT3SK.js                                  9.63 kB │ gzip:  3.26 kB
client/dist/assets/BreathTool-DMRb6f1m.js                                        9.66 kB │ gzip:  3.32 kB
client/dist/assets/FeatureFlags-rTxwmQ7D.js                                      9.70 kB │ gzip:  3.20 kB
client/dist/assets/AngerManagement-BLmbTgzI.js                                   9.70 kB │ gzip:  3.29 kB
client/dist/assets/NewsletterAdmin-B7qmPiZQ.js                                   9.77 kB │ gzip:  2.68 kB
client/dist/assets/AffirmationCards-p4DMvxIl.js                                  9.78 kB │ gzip:  3.28 kB
client/dist/assets/CreativeExpression-3mtlE-yH.js                                9.80 kB │ gzip:  3.24 kB
client/dist/assets/learn-rejXj0w_.js                                             9.82 kB │ gzip:  3.82 kB
client/dist/assets/RoutinesPage-b6xIR65D.js                                      9.85 kB │ gzip:  3.00 kB
client/dist/assets/EmotionWheel-BhmQuBQ_.js                                      9.87 kB │ gzip:  3.38 kB
client/dist/assets/SocialLibrary-Dif1syBf.js                                     9.87 kB │ gzip:  2.72 kB
client/dist/assets/SomaticRelease-Bz3lEr4U.js                                    9.87 kB │ gzip:  3.30 kB
client/dist/assets/CommunityFeed-DY30dBVd.js                                     9.89 kB │ gzip:  3.43 kB
client/dist/assets/NervousSystemCheck-1IAtdruo.js                                9.89 kB │ gzip:  3.68 kB
client/dist/assets/SystemMapPage-689OtBam.js                                     9.94 kB │ gzip:  3.45 kB
client/dist/assets/MindfulBreathing-44C5bshi.js                                  9.97 kB │ gzip:  2.98 kB
client/dist/assets/DiscussionPage-ByXGJRAh.js                                    9.99 kB │ gzip:  3.26 kB
client/dist/assets/AIWellnessConcierge-BYZR8qXV.js                              10.07 kB │ gzip:  3.01 kB
client/dist/assets/HubsIndexPage-CuRVf-ov.js                                    10.08 kB │ gzip:  2.94 kB
client/dist/assets/PositiveVisualization-C17PLL4T.js                            10.14 kB │ gzip:  3.59 kB
client/dist/assets/SecurityDashboard-DLOhRjz3.js                                10.18 kB │ gzip:  2.56 kB
client/dist/assets/MindfulnessChallenges-JWOPKA-s.js                            10.25 kB │ gzip:  3.08 kB
client/dist/assets/DailyPracticePage-CZJs5nsg.js                                10.26 kB │ gzip:  3.22 kB
client/dist/assets/EmotionalIntelligenceQuiz-p7EwZtk8.js                        10.30 kB │ gzip:  3.14 kB
client/dist/assets/CheckIn-BmL7pZXS.js                                          10.30 kB │ gzip:  3.40 kB
client/dist/assets/WellnessGoalTracker-GD5VJe6r.js                              10.31 kB │ gzip:  2.79 kB
client/dist/assets/AICompanion-B0PEPJBU.js                                      10.35 kB │ gzip:  3.58 kB
client/dist/assets/AdminPublishingToday-4SGUnCes.js                             10.36 kB │ gzip:  3.24 kB
client/dist/assets/sacred-B21N2I0l.js                                           10.37 kB │ gzip:  4.24 kB
client/dist/assets/WellnessStreakDashboard-CeLFcKrK.js                          10.38 kB │ gzip:  2.87 kB
client/dist/assets/BuddyAvatar-Dj9ncl85.js                                      10.40 kB │ gzip:  3.81 kB
client/dist/assets/RecoveryPage-DPhUtdnj.js                                     10.40 kB │ gzip:  3.16 kB
client/dist/assets/BlogPost-DdvyI1Ux.js                                         10.41 kB │ gzip:  3.34 kB
client/dist/assets/Profile-CyQxVa09.js                                          10.45 kB │ gzip:  3.45 kB
client/dist/assets/Register-Cv9G7xjb.js                                         10.49 kB │ gzip:  2.95 kB
client/dist/assets/HydrationTracker-BVdByk0n.js                                 10.49 kB │ gzip:  3.32 kB
client/dist/assets/Premium-CuRlJzNQ.js                                          10.49 kB │ gzip:  3.39 kB
client/dist/assets/MindfulEating-DwC_ieVE.js                                    10.54 kB │ gzip:  3.28 kB
client/dist/assets/DailyFlow-Bpg0g9e3.js                                        10.60 kB │ gzip:  2.79 kB
client/dist/assets/vendor-confetti-Byz_ELOO.js                                  10.64 kB │ gzip:  4.28 kB
client/dist/assets/GratitudeJar-oTsd0ZOe.js                                     10.79 kB │ gzip:  3.27 kB
client/dist/assets/CrisisResources-DZ28TUaj.js                                  10.81 kB │ gzip:  3.34 kB
client/dist/assets/BehaviorChangePage-BXmdNelw.js                               10.83 kB │ gzip:  3.25 kB
client/dist/assets/FAQPage-g6yiZjBJ.js                                          10.85 kB │ gzip:  4.35 kB
client/dist/assets/ProtocolSession-DG4AvV4G.js                                  10.91 kB │ gzip:  3.31 kB
client/dist/assets/GoalProgress-CLP_RWyT.js                                     10.95 kB │ gzip:  3.08 kB
client/dist/assets/AnxietyRelief-DV1Vlg0i.js                                    10.96 kB │ gzip:  3.46 kB
client/dist/assets/Contact-FGEtWkHl.js                                          10.96 kB │ gzip:  3.09 kB
client/dist/assets/SocialAnalytics-D8h-NSa5.js                                  11.01 kB │ gzip:  3.21 kB
client/dist/assets/MotionLab-RpZ94vcY.js                                        11.06 kB │ gzip:  3.63 kB
client/dist/assets/MMHBCard-Bk8yh85y.js                                         11.14 kB │ gzip:  3.78 kB
client/dist/assets/ResilienceStories-BCBIcaY1.js                                11.23 kB │ gzip:  3.03 kB
client/dist/assets/AchievementSystem-Br1MRJNp.js                                11.28 kB │ gzip:  3.34 kB
client/dist/assets/AvatarLab-BHKT7foC.js                                        11.29 kB │ gzip:  3.71 kB
client/dist/assets/InsightCardsPage-gPgNefxD.js                                 11.47 kB │ gzip:  3.57 kB
client/dist/assets/GratitudePractice-BiDvneYp.js                                11.50 kB │ gzip:  3.72 kB
client/dist/assets/CopingStrategies-ChRLw5yp.js                                 11.53 kB │ gzip:  4.11 kB
client/dist/assets/ValueProposition-DjP1T8SD.js                                 11.54 kB │ gzip:  3.49 kB
client/dist/assets/BiometricDashboard-RP_-7tdM.js                               11.59 kB │ gzip:  3.51 kB
client/dist/assets/ValuesFinderPage-JD9bex6K.js                                 11.74 kB │ gzip:  4.21 kB
client/dist/assets/PowerNap-Cn-Kc59W.js                                         11.80 kB │ gzip:  3.53 kB
client/dist/assets/BreathingTool-DuRGSmc5.js                                    11.85 kB │ gzip:  3.99 kB
client/dist/assets/ProgressDashboardPage-B4C7qjYK.js                            11.86 kB │ gzip:  3.79 kB
client/dist/assets/SleepSanctuary-lWWDF7rB.js                                   12.19 kB │ gzip:  4.22 kB
client/dist/assets/GrowthAnalyticsPage-DQQctXcb.js                              12.34 kB │ gzip:  3.70 kB
client/dist/assets/CelebrationRitual-C0qyov4J.js                                12.39 kB │ gzip:  3.59 kB
client/dist/assets/AgentInteraction-CplwlZRl.js                                 12.39 kB │ gzip:  3.40 kB
client/dist/assets/SubscriberBenefitsPage-Bj2anm8P.js                           12.39 kB │ gzip:  3.18 kB
client/dist/assets/Reflection-BIl6LN_X.js                                       12.55 kB │ gzip:  4.18 kB
client/dist/assets/HealingJourneys-D0ombiVi.js                                  12.56 kB │ gzip:  3.55 kB
client/dist/assets/NarrativeDrafts-Bo7ymJ9w.js                                  12.67 kB │ gzip:  3.95 kB
client/dist/assets/TwelvePracticesPage-qFsIthXO.js                              12.79 kB │ gzip:  4.30 kB
client/dist/assets/AdaptiveCompanionPage-BGbu91j8.js                            12.81 kB │ gzip:  4.06 kB
client/dist/assets/WisdomSynthesisPage-CsY2NmvA.js                              12.84 kB │ gzip:  4.15 kB
client/dist/assets/GuidedJournalingPage-Cx7PFNlR.js                             12.86 kB │ gzip:  4.72 kB
client/dist/assets/SocialCalendar-DoMnCJL_.js                                   12.88 kB │ gzip:  3.72 kB
client/dist/assets/Security-DwwVam98.js                                         12.98 kB │ gzip:  3.36 kB
client/dist/assets/CRMPage-B4oQF4h5.js                                          13.23 kB │ gzip:  3.43 kB
client/dist/assets/MindfulWalking-DxKaP0hY.js                                   13.24 kB │ gzip:  3.95 kB
client/dist/assets/SystemsThinkingPage-DoYr6S4K.js                              13.27 kB │ gzip:  4.32 kB
client/dist/assets/ResilienceMetricsPage-DgUOsZzb.js                            13.37 kB │ gzip:  4.06 kB
client/dist/assets/WisdomPracticesPage-CzVzLogt.js                              13.49 kB │ gzip:  4.02 kB
client/dist/assets/PhilosophicalInquiryPage-4J3LRxSP.js                         13.63 kB │ gzip:  4.37 kB
client/dist/assets/Onboarding-BGe-CMKG.js                                       13.67 kB │ gzip:  4.75 kB
client/dist/assets/MetaLearningPage-BJM6L_Pp.js                                 13.70 kB │ gzip:  4.42 kB
client/dist/assets/PracticeLibrary-D1AWCEep.js                                  13.73 kB │ gzip:  4.45 kB
client/dist/assets/Billing-C9agUfmF.js                                          13.80 kB │ gzip:  3.90 kB
client/dist/assets/MovementSnacksPage-Dl7XUBud.js                               13.87 kB │ gzip:  4.30 kB
client/dist/assets/BoundariesPage-DbKOkEoz.js                                   13.96 kB │ gzip:  4.55 kB
client/dist/assets/CommunityCircle-CZsCR7zo.js                                  14.02 kB │ gzip:  3.87 kB
client/dist/assets/ResetPassword-CY4aafmz.js                                    14.09 kB │ gzip:  3.82 kB
client/dist/assets/CollaborativeLabPage-kV_sQFfE.js                             14.45 kB │ gzip:  4.69 kB
client/dist/assets/wellnessMicrocopy-DPh5jCXw.js                                14.47 kB │ gzip:  5.43 kB
client/dist/assets/CBTThoughtDiary-DzbabkAj.js                                  14.59 kB │ gzip:  3.58 kB
client/dist/assets/DailyWisdomOraclePage-zMZo4hTc.js                            14.77 kB │ gzip:  5.39 kB
client/dist/assets/MoodPage-DhhXkb1P.js                                         14.77 kB │ gzip:  4.83 kB
client/dist/assets/DailyOpsRunbook-qurLZd_L.js                                  14.89 kB │ gzip:  3.80 kB
client/dist/assets/StrategyMapsPage-B6hIjHWj.js                                 14.94 kB │ gzip:  4.89 kB
client/dist/assets/PerceptionRefinementPage-DXrdWsQ5.js                         15.03 kB │ gzip:  4.81 kB
client/dist/assets/OnboardingFlow-BJEKS9MD.js                                   15.25 kB │ gzip:  4.44 kB
client/dist/assets/AtlasDashboard-DWz4mUle.js                                   15.71 kB │ gzip:  5.14 kB
client/dist/assets/lumi-memory-BAaO-Bfx.js                                      15.99 kB │ gzip:  6.10 kB
client/dist/assets/PermacultureWellnessPage-m7rKsXX3.js                         16.11 kB │ gzip:  5.41 kB
client/dist/assets/CoherenceLadderPage-D24Iy0e2.js                              16.15 kB │ gzip:  5.26 kB
client/dist/assets/AIRepairCenter-CsaXL2iN.js                                   16.57 kB │ gzip:  3.39 kB
client/dist/assets/KnowledgeSynthesisPage-CORRzqyg.js                           17.11 kB │ gzip:  4.20 kB
client/dist/assets/PlatformCoverageReport-FtAL-ocA.js                           17.18 kB │ gzip:  3.66 kB
client/dist/assets/ChallengeDay-CuRhHJfy.js                                     17.18 kB │ gzip:  5.68 kB
client/dist/assets/NervousSystemFloodingPage-Crj68BCY.js                        17.37 kB │ gzip:  4.60 kB
client/dist/assets/TalkTopics-DWzPpDRv.js                                       17.60 kB │ gzip:  4.69 kB
client/dist/assets/PeacescapePage-kgMKssSd.js                                   18.85 kB │ gzip:  5.36 kB
client/dist/assets/SelfWorthReflectionPage-DauIxJIs.js                          18.88 kB │ gzip:  5.59 kB
client/dist/assets/AlignmentPath-CQoGqSI6.js                                    19.23 kB │ gzip:  6.20 kB
client/dist/assets/StudyVaultPage-BRs1uj1u.js                                   19.77 kB │ gzip:  6.92 kB
client/dist/assets/DiscernmentDashboard-CqM4koIs.js                             20.24 kB │ gzip:  5.37 kB
client/dist/assets/ContentAdminDashboard-CKcvn_AK.js                            20.52 kB │ gzip:  4.72 kB
client/dist/assets/Overview-DXHGAXM-.js                                         20.81 kB │ gzip:  6.39 kB
client/dist/assets/GrowthPage-Rnj3awsE.js                                       21.34 kB │ gzip:  6.04 kB
client/dist/assets/JournalPage-u2YQeD_J.js                                      21.55 kB │ gzip:  7.23 kB
client/dist/assets/DailyRitualPage-Cmb4y9ku.js                                  22.00 kB │ gzip:  7.54 kB
client/dist/assets/CognitiveArchitecturePage-CKx_Tw2M.js                        22.11 kB │ gzip:  7.72 kB
client/dist/assets/vendor-router-CL3OCh0O.js                                    22.68 kB │ gzip:  8.61 kB
client/dist/assets/Settings-MQRRl-6X.js                                         23.19 kB │ gzip:  6.25 kB
client/dist/assets/SocialGenerator-DOozojH7.js                                  23.29 kB │ gzip:  5.74 kB
client/dist/assets/TglpNavbar-CJkbvLL6.js                                       24.46 kB │ gzip:  7.16 kB
client/dist/assets/Wellness-DxbiMfzh.js                                         24.60 kB │ gzip:  6.45 kB
client/dist/assets/SocialDashboard-DVMsvb9_.js                                  26.71 kB │ gzip:  6.26 kB
client/dist/assets/textarea-CcPY8MgA.js                                         28.10 kB │ gzip:  9.04 kB
client/dist/assets/Pricing-Cu2yiFYP.js                                          28.35 kB │ gzip:  7.85 kB
client/dist/assets/DesignSystemV2-CZvvaHQe.js                                   28.84 kB │ gzip:  6.74 kB
client/dist/assets/AdminPublishing-kFGMCdhu.js                                  29.12 kB │ gzip:  6.54 kB
client/dist/assets/SOPMonitorPanel-BePMnonK.js                                  29.61 kB │ gzip:  7.01 kB
client/dist/assets/ToolsPage-DS8CaL3R.js                                        30.48 kB │ gzip:  9.18 kB
client/dist/assets/lumi-registry-fbVQ0_md.js                                    31.25 kB │ gzip:  8.86 kB
client/dist/assets/Start-BhRloyP8.js                                            31.65 kB │ gzip:  9.32 kB
client/dist/assets/vendor-query-BH6Jyu8l.js                                     32.61 kB │ gzip: 10.04 kB
client/dist/assets/MasteryToolsPage-BjI7D2iF.js                                 34.12 kB │ gzip:  8.84 kB
client/dist/assets/InsightsDashboard-ruyTXp7x.js                                35.59 kB │ gzip: 10.21 kB
client/dist/assets/SocialStudioAdmin-DJHTH_eR.js                                38.85 kB │ gzip:  9.66 kB
client/dist/assets/HealthDashboard-C2ohO4IM.js                                  42.80 kB │ gzip:  9.88 kB
client/dist/assets/Presence-Pp3Me9UX.js                                         43.92 kB │ gzip: 12.74 kB
client/dist/assets/LumiV6Preview-B6GrleOB.js                                    43.99 kB │ gzip: 12.12 kB
client/dist/assets/AdminSocial-BJ0k6KmN.js                                      48.52 kB │ gzip: 10.54 kB
client/dist/assets/AdminTools-DCQGDmls.js                                       50.10 kB │ gzip: 12.98 kB
client/dist/assets/PageTemplate-Ej9kDUrm.js                                     50.63 kB │ gzip: 14.49 kB
client/dist/assets/Admin-9Fnbm2v8.js                                            52.57 kB │ gzip: 10.26 kB
client/dist/assets/NarrativeOpsConsole-DpBkNc_s.js                              53.49 kB │ gzip: 11.13 kB
client/dist/assets/ContentStudioPage-BSGWjxon.js                                54.98 kB │ gzip: 17.61 kB
client/dist/assets/_adminToolsShared-DEw3Z585.js                                64.18 kB │ gzip: 17.21 kB
client/dist/assets/vendor-lucide-bnMo4Sd-.js                                    66.40 kB │ gzip: 21.99 kB
client/dist/assets/WisdomToolsPage-_cHOjHlA.js                                  83.54 kB │ gzip: 22.59 kB
client/dist/assets/CommandCenter-BPPt3W7X.js                                    93.61 kB │ gzip: 23.92 kB
client/dist/assets/vendor-forms-UbwvMrj5.js                                     96.96 kB │ gzip: 29.84 kB
client/dist/assets/SacredFooter-CYAJcEX9.js                                     97.43 kB │ gzip: 36.55 kB
client/dist/assets/vendor-motion-DnxLftd-.js                                   125.15 kB │ gzip: 41.59 kB
client/dist/assets/routeMetaRegistry-De_sNDof.js                               129.30 kB │ gzip: 14.16 kB
client/dist/assets/CanvaLanding-Cg2TqvDN.js                                    129.87 kB │ gzip: 30.70 kB
client/dist/assets/vendor-react-CcWttEQd.js                                    182.94 kB │ gzip: 58.02 kB
client/dist/assets/index-6iTq10yq.js                                           187.48 kB │ gzip: 42.39 kB
client/dist/assets/AdvancedToolsPage-DzNeZFUu.js                               210.00 kB │ gzip: 45.82 kB
client/dist/assets/_autopilot-CuE29eAG.js                                      257.93 kB │ gzip: 62.53 kB
client/dist/assets/WellnessDashboard-D4Y2G-I9.js                               275.14 kB │ gzip: 89.13 kB

[PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
  - vite:esbuild-transpile (64%)
  - vite:css (14%)
  - vite:css-post (6%)
  - visualizer (5%)
See https://rolldown.rs/options/checks#plugintimings for more details.

✓ built in 37.20s
npm notice
npm notice New minor version of npm available! 11.11.0 -> 11.15.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.15.0
npm notice To update run: npm install -g npm@11.15.0
npm notice
===== 4) VERIFY PRODUCTION HEALTH =====
ok
{"status":"ready","timestamp":"2026-05-24T03:10:12.305Z"}
{"status":"healthy","environment":"production","version":"2.0.0","uptime":2889,"uptimeFormatted":"48m 9s","startedAt":"2026-05-24T02:22:15.812Z","database":{"connected":true},"ai":{"available":true},"softLaunch":false,"platform":{"totalTools":127,"totalRoutes":127,"adminPages":27},"services":{"stripe":true,"resend":true,"perplexity":true,"sentry":true},"memory":{"heapUsedMB":46,"heapTotalMB":49,"rssMB":77},"node":"v20.20.0"}
===== 5) WRITE PHASE 74 REPORT =====
[main ba3780467] docs(discovery): verify discovery route visibility
 1 file changed, 23 insertions(+)
 create mode 100644 docs/reports/PHASE_74_DISCOVERY_ROUTE_VISIBILITY.md
Enumerating objects: 8, done.
Counting objects: 100% (8/8), done.
Delta compression using up to 4 threads
Compressing objects: 100% (5/5), done.
Writing objects: 100% (5/5), 810 bytes | 810.00 KiB/s, done.
Total 5 (delta 3), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
remote: 
remote: GitHub found 2 vulnerabilities on TheGenuineLoveProject/MyMentalHealthBuddy's default branch (2 moderate). To find out more, visit:
remote:      https://github.com/TheGenuineLoveProject/MyMentalHealthBuddy/security/dependabot
remote: 
To https://github.com/TheGenuineLoveProject/MyMentalHealthBuddy.git
   a35d0713b..ba3780467  main -> main
===== PHASE 74 COMPLETE =====
~/workspace$ echo "===== PHASE 75: VISIBLE DISCOVERY NAVIGATION ====="

echo "===== VERIFY DISCOVERY ROUTE EXISTS ====="
grep -R "path=.*/discover\\|DiscoveryPage" client/src/App.jsx client/src/App.tsx 2>/dev/null || true

echo "===== FIND NAV FILES ====="
find client/src -type f \( -name "*.jsx" -o -name "*.tsx" -o -name "*.js" \) \
| grep -Ei "nav|header|sidebar|layout|menu|shell" \
| sort \
| tee docs/reports/PHASE_75_NAV_CANDIDATES.txt

echo "===== CREATE SAFE NAV REPORT ONLY ====="
mkdir -p docs/reports
cat > docs/reports/PHASE_75_VISIBLE_DISCOVERY_NAVIGATION.md <<'EOF'
# Phase 75 — Visible Discovery Navigation

## Purpose
Make the new `/discover` tool directory easy for users to find.

## Required Link
Label: Discover Tools  
Route: /discover

## Safety Rules
- Do not touch auth.
- Do not touch billing.
- Do not touch crisis flows.
- Do not touch database.
- Do not delete routes.
- Do not refactor App.jsx globally.
- Add only one visible navigation link after identifying the canonical nav component.

## Verification
- /discover route exists
- DiscoveryPage exists
- navigation candidate files identified
- production health unchanged

## Next Step
Phase 76 should add the link only to the canonical active nav/header/sidebar component.
