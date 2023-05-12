import { doc, getDoc } from 'firebase/firestore';
import { db } from './getData';

export default async function getCurrency() {
  let docRef = doc(db, 'system', 'currency');

  let result = null;
  let error = null;

  try {
    result = await getDoc(docRef);
  } catch (e) {
    error = e;
  }
  const currency = result?.data();
  return { currency, error };
}
