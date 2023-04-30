import { setDoc, doc } from 'firebase/firestore';
import { db } from './getData';
//import getCategories from './getCategories';

export default async function addCategories(newCategories = []) {
  let addResult = null;
  let addError = null;
  //const { categories , error } = await getCategories();
  try {
    let ref = doc(db, 'system', 'categoriesList');
    //console.log(categories);
    const newCatData = { categories: newCategories };
    addResult = await setDoc(ref, newCatData ,{ merge: true });
  } catch (e) {
    addError = e;
  }

  return { addResult, addError };
}
