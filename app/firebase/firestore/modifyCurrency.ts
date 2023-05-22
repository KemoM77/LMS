import { doc, setDoc } from 'firebase/firestore';

import { db } from './getData';

//import getCategories from './getCategories';

export default async function modifyCurrency(newCurrency: string) {
  let addResult = null;
  let addError = null;
  try {
    let ref = doc(db, 'system', 'currency');
    const newCurrencyData = {
      currency: newCurrency,
    };
    addResult = await setDoc(ref, newCurrencyData, { merge: true });
  } catch (e) {
    addError = e;
  }

  return { addResult, addError };
}
