import { doc, getDoc } from 'firebase/firestore';
import { db } from './getData';

export default async function getCategories() {
  let docRef = doc(db, 'system', 'categoriesList');

  let result = null;
  let error = null;

  try {
    result = await getDoc(docRef);
  } catch (e) {
    error = e;
  }
  const categories = result?.data();
  return { categories, error };
}
