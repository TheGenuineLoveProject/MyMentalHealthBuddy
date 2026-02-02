import { db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const saveMoodEntry = async (userId, mood, journal) => {
  try {
    await addDoc(collection(db, "moods"), {
      userId,
      mood,
      journal,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error saving mood:", e);
  }
};