import { doc, getDoc } from 'firebase/firestore';

import { db } from './getData';

export default async function getLifeTime() {
  let docRef = doc(db, 'system', 'requestsLifeTime');

  let result = null;
  let error = null;

  try {
    result = await getDoc(docRef);
  } catch (e) {
    error = e;
  }

  const lifeTime = error ? null : result?.data();
  return { lifeTime, error };
}

