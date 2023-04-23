import { Timestamp } from "firebase/firestore";

export interface UserInfo {
            id:string,
            first_name:string,
            last_name:string,
            email:string,
            date_of_birth:string,
            isLibrarian:boolean,
            date_of_registration:any,
            fav_books?:[],
            profile_img_url:string,
            bio:string,
            isActive:boolean,
            valid_until?:string,
            country?:string,
            pending_requests:number,
            borrowed_books:number,
            city:string,
            address:string,
            postalcode:string,
            fines?:number
            


}