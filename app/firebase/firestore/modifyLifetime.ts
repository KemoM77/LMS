import { setDoc, doc } from 'firebase/firestore';
import { db } from './getData';
//import getCategories from './getCategories';

export default async function modifyLifeTime(newTime: number) {
  let addResult = null;
  let addError = null;
  try {
    if (newTime < 0) {
      throw Error('Invalid Life Time');
    }
    let ref = doc(db, 'system', 'requestsLifeTime');
    const newTimeData = { lifetime: newTime };
    addResult = await setDoc(ref, newTimeData, { merge: true });
  } catch (e) {
    addError = e;
  }

  return { addResult, addError };
}
