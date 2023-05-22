import { doc, setDoc } from 'firebase/firestore';

import { db } from './getData';

//import getCategories from './getCategories';

export default async function modifyDailyFees(newfees:number) {
  let addResult = null;
  let addError = null;
  try {
    
    let ref = doc(db, 'system', 'defaultDailyFeesAfterDeadline');
    const newFeesData = { fee: newfees };
    addResult = await setDoc(ref, newFeesData ,{ merge: true });
  } catch (e) {
    addError = e;
  }

  return { addResult, addError };
}
