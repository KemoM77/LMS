import { doc, setDoc } from 'firebase/firestore';

import { db } from './getData';

export default async function addCategories(newCategories: string[] | null | undefined) {
  let addResult = null;
  let addError = null;

  // Checks if the input is an array, otherwise, set it to an empty array
  newCategories = Array.isArray(newCategories) ? newCategories : [];

  try {
    let ref = doc(db, 'system', 'categoriesList');

    // Optionally, removes duplicates if needed
    const uniqueCategories = [...new Set(newCategories)];

    const newCatData = { categories: uniqueCategories };
    addResult = await setDoc(ref, newCatData, { merge: true });
  } catch (e) {
    addError = e;
  }

  return { addResult, addError };
}

