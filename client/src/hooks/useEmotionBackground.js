import { useEffect } from "react";
import { useEmotion } from "../context/EmotionContext";

const EMOTION_CLASSES = {
  joy: "mood-joy",
  excited: "mood-excited",
  grateful: "mood-grateful",
  loved: "mood-loved",
  hopeful: "mood-hopeful",
  peaceful: "mood-peaceful",
  calm: "mood-calm",
  neutral: "mood-neutral",
  tired: "mood-tired",
  anxious: "mood-anxious",
  sad: "mood-sad",
  angry: "mood-angry"
};

const ALL_MOOD_CLASSES = Object.values(EMOTION_CLASSES);

export function useEmotionBackground() {
  const { currentEmotion } = useEmotion();

  useEffect(() => {
    const body = document.body;
    
    ALL_MOOD_CLASSES.forEach(cls => {
      body.classList.remove(cls);
    });

    if (currentEmotion && EMOTION_CLASSES[currentEmotion]) {
      body.classList.add(EMOTION_CLASSES[currentEmotion]);
    }

    return () => {
      ALL_MOOD_CLASSES.forEach(cls => {
        body.classList.remove(cls);
      });
    };
  }, [currentEmotion]);

  return currentEmotion;
}

export default useEmotionBackground;
