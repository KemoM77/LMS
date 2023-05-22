import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';

import { UserInfo } from '@/app/(authed)/profile/user';

import { firebase_app, second_firebase_app } from '../../firebase';
import addData from '../firestore/addData';

import { TextEncoder } from "util";


export async function hashString(inputString: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert the ArrayBuffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

export function getSubstrings(str: string): string[] {
  const substrings: string[] = [];

  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      substrings.push(str.slice(i, j).toLowerCase());
    }
  }

  return substrings;
}

export default async function signUp(data, byLabrarian = false) {
  const DEFULT_PROFILE_PIC = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  const auth = getAuth(byLabrarian ? second_firebase_app : firebase_app);
  let result = null,
    error = null;
  try {
    if (new Date(data['date-of-birth']) >= new Date()) {
      throw Error('Invalid date of birth');
    }

    //const hashedPassword =  await hashString(data['password']);

    result = await createUserWithEmailAndPassword(auth, data['email-address'], data['password']);
    //////console.log(result);
  } catch (e) {
    error = e;
  }
  if (!error) {
    let terms = getSubstrings(data['first-name'] + ' ' + data['last-name']);
    const registerationData: UserInfo = {
      id: result.user.uid,
      first_name: data['first-name'],
      last_name: data['last-name'],
      email: data['email-address'],
      date_of_birth: data['date-of-birth'],
      country: 'Hungary',
      city: 'Budapest',
      address: '',
      postalcode: '0000',
      isLibrarian: data['userType'] === 'user' ? false : true,
      date_of_registration: serverTimestamp(),
      fav_books: [],
      profile_img_url: DEFULT_PROFILE_PIC,
      bio: 'My bio',
      isActive: data['userType'] === 'user' ? false : true,
      pending_requests: 0,
      borrowed_books: 0,
      searchableTerms: [ ...new Set(terms)],
    };
    //////console.log(result, result.user.uid);
    addData('users', result?.user.uid, registerationData);
  }

  return { result, error };
}
