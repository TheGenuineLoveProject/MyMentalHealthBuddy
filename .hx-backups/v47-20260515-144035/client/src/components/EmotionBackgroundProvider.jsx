import { useEffect } from "react";
import { useEmotion } from "../context/EmotionContext";

const EMOTION_CLASSES = [
  "mood-joy", "mood-excited", "mood-grateful", "mood-loved",
  "mood-hopeful", "mood-peaceful", "mood-calm", "mood-neutral",
  "mood-tired", "mood-anxious", "mood-sad", "mood-angry"
];

export default function EmotionBackgroundProvider({ children }) {
  const { currentEmotion } = useEmotion();

  useEffect(() => {
    const body = document.body;
    
    EMOTION_CLASSES.forEach(cls => body.classList.remove(cls));

    if (currentEmotion) {
      body.classList.add(`mood-${currentEmotion}`);
    }

    return () => {
      EMOTION_CLASSES.forEach(cls => body.classList.remove(cls));
    };
  }, [currentEmotion]);

  return children;
}
