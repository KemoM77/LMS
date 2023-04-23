import firebase_app from "../../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const db = getFirestore(firebase_app)
export default async function getData(collection, id) {
    let docRef = doc(db, collection, id);

    let result = null;
    let error = null;

    try {
        result = await getDoc(docRef);
    } catch (e) {
        error = e;
    }
const docData=result.data()
    return { docData, error };
}