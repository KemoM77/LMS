import {firebase_app} from "../../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const db = getFirestore(firebase_app)
export default async function getData(collection:string, id:string) {
    let docRef = doc(db, collection, id);

    let result = null;
    let error = null;
    let docData = null;

    try {
        result = await getDoc(docRef);
        docData =result.data()
    } catch (e) {
        error = e;
    }
    return { docData, error };
}