import {firebase_app , second_firebase_app} from "../../firebase";
import { createUserWithEmailAndPassword, getAuth, } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import addData from "../firestore/addData";
import { UserInfo } from "@/app/(authed)/profile/user";

export function getSubstrings(str: string): string[] {
    const substrings: string[] = [];
    
    for (let i = 0; i < str.length; i++) {
        for (let j = i + 1; j <= str.length; j++) {
            substrings.push(str.slice(i, j).toLowerCase());
        }
    }
    
    return substrings;
}


export default async function signUp(data,byLabrarian = false) {
    const DEFULT_PROFILE_PIC = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    const auth = getAuth(byLabrarian?second_firebase_app:firebase_app);
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
       let terms  = getSubstrings(data['first-name'] +' '+ data['last-name'])
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
            profile_img_url:DEFULT_PROFILE_PIC,
            bio:'My bio',
            isActive:data['userType']==='user'?false:true,
            pending_requests:0,
            borrowed_books:0,
            searchableTerms:terms    
        }
       console.log(result,result.user.uid);
       addData('users',result?.user.uid,registerationData)
    }

    return { result, error };
}