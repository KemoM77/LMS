import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore/lite';
import firebase_app from '@/app/firebase';
import { db } from './getData';

//const db = getFirestore(firebase_app);
export const deleteData = async (id: any, collection: string) => {
  let e = null;
  try {
    await deleteDoc(doc(db, collection, id));
  } catch (error) {
    e = e.code;
  }
  return { e };
};
