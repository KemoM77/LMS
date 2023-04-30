import { doc, getDoc } from 'firebase/firestore';
import { db } from './getData';

export default async function getDailyFees() {
  let docRef = doc(db, 'system', 'defaultDailyFeesAfterDeadline');

  let result = null;
  let error = null;

  try {
    result = await getDoc(docRef);
  } catch (e) {
    error = e;
  }
  const dailyFees = result?.data();
  return { dailyFees, error };
}
