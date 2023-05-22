import { doc, setDoc } from 'firebase/firestore';

import { db } from './getData';

export default async function addData(colllection: string , id: string, data: any) {
  let result = null;
  let error = null;

    try {
    // result = await setDoc(doc(db, colllection,id), data, {
    //     merge: true,
    // });
    let ref = doc(db, colllection, id);
    //////console.log();
    
    result = await setDoc(ref, data, { merge: true });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
