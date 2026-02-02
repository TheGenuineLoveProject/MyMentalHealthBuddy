import { db } from "../firebase/firebase";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export const saveJournalEntry = async (userId, mood, entry) => {
  await addDoc(collection(db, "journals"), {
    userId,
    mood,
    entry,
    createdAt: serverTimestamp(),
  });
};

export const getJournalEntries = async (userId) => {
  const q = query(
    collection(db, "journals"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};import { db } from "../firebase/firebase";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export const saveJournalEntry = async (userId, mood, entry) => {
  await addDoc(collection(db, "journals"), {
    userId,
    mood,
    entry,
    createdAt: serverTimestamp(),
  });
};

export const getJournalEntries = async (userId) => {
  const q = query(
    collection(db, "journals"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};