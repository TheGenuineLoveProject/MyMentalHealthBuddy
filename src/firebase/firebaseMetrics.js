// /src/firebase/firebaseMetrics.js
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from './firebase';

const db = getFirestore();

export async function fetchUserMetrics() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const ref = doc(db, 'users', user.uid, 'metrics', 'summary');
  const snapshot = await getDoc(ref);

  return snapshot.exists() ? snapshot.data() : null;
}