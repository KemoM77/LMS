import firebase_app from "../../firebase";
import { createUserWithEmailAndPassword, getAuth, } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import addData from "../firestore/addData";
import { UserInfo } from "@/app/(authed)/profile/user";

const auth = getAuth(firebase_app);

export default async function signUp(data) {
    let result = null,
    error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, data['email-address'], data['password']);
        console.log(result);
        
    } catch (e) {
        error = e;
    }
    if(!error){
        //let date = new Date();
       // date.toLocaleString
        const registerationData  : UserInfo = {
            id:result.user.uid,
            first_name:data['first-name'],
            last_name:data['last-name'],
            email:data['email-address'],
            date_of_birth:data['date-of-birth'],
            country:'Hungary',
            city:'Budapest',
            address:'',
            postalcode:'0000',
            isLibrarian:data['userType']==='user'?false:true,
            date_of_registration:serverTimestamp(),
            fav_books:[],
            profile_img_url:'',
            bio:'My bio',
            isActive:data['userType']==='user'?false:true,
            pending_requests:0,
            borrowed_books:0     
        }
       console.log(result,result.user.uid);
       addData('users',result?.user.uid,registerationData)
    }

    return { result, error };
}