import { deleteDoc, doc, getFirestore ,collection } from 'firebase/firestore';
import { db } from './getData';

export const deleteData = async (id: any, collectionName: string) => {
  let e = null;
  //console.log('this should be del',docRef);
  try {
   
    const docRef =  doc(db, collectionName, id)
    ;
    if (!docRef.id) {
      console.log('Document does not exist.');
      return;
    }

    await deleteDoc(docRef);
    console.log("successfully deleted");
    
  } catch (error) {
    console.log(error);
    e = error.code;
  }
  return { e };
};
