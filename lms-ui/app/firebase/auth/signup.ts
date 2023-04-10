import firebase_app from "../../firebase";
import { createUserWithEmailAndPassword, getAuth, } from "firebase/auth";
import addData from "../firestore/addData";

const auth = getAuth(firebase_app);


export default async function signUp(email: string, password: string) {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);

    } catch (e) {
        error = e;
    }
    if(!error){
        addData('users','',{email:email,name:'246'})
    }

    return { result, error };
}