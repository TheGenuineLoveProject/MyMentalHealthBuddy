/**
 * lumiEmotionMap — maps semantic emotion names to canonical Lumi color modes.
 *
 * Source of truth for color modes is `LumiV6ColorMode` in
 * `client/src/components/lumi/LumiV6.tsx`. Importing the type here keeps
 * this map in lockstep with the component's allowed values — adding a new
 * color mode there will surface a type error here until the map is updated.
 */
import type { LumiV6ColorMode } from "@/components/lumi/LumiV6";

export const EMOTION_TO_COLOR: Record<string, LumiV6ColorMode> = {
  greeting: "default",
  listening: "purple",
  thinking: "blue",
  happy: "yellow",
  sad: "purple",
  anxious: "blue",
  calm: "blue",
  surprised: "orange",
  confused: "purple",
  celebrating: "yellow",
  curious: "orange",
  compassionate: "pink",
  focused: "blue",
  sleepy: "sleep",
  excited: "yellow",
  grateful: "pink",
  encouraging: "pink",
  mindful: "blue",
};

export function getColorMode(emotion: string): LumiV6ColorMode {
  return EMOTION_TO_COLOR[emotion] || "default";
}
