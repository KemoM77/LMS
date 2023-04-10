import firebase_app from "./../../firebase";
import { getFirestore, doc, setDoc, addDoc, collection } from "firebase/firestore";

const db = getFirestore(firebase_app)
export default async function addData(colllection: string, id: string, data: any) {
    let result = null;
    let error = null;

    try {
        // result = await setDoc(doc(db, colllection,id), data, {
        //     merge: true,
        // });
        result = await addDoc(collection(db, colllection), data);
    } catch (e) {
        error = e;
    }

    return { result, error };
}