import { setDoc, doc } from 'firebase/firestore';
import { db } from './getData';
//import getCategories from './getCategories';
export default async function addCategories(newCategories: string[] | null | undefined) {
  let addResult = null;
  let addError = null;

  // Check if the input is an array, otherwise, set it to an empty array
  newCategories = Array.isArray(newCategories) ? newCategories : [];

  try {
    let ref = doc(db, 'system', 'categoriesList');

    // Optionally, remove duplicates if needed
    const uniqueCategories = [...new Set(newCategories)];

    const newCatData = { categories: uniqueCategories };
    addResult = await setDoc(ref, newCatData, { merge: true });
  } catch (e) {
    addError = e;
  }

  return { addResult, addError };
}

