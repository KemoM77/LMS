import { firebase_app } from '@/app/firebase';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
// import { hashString } from './signup';
// const { TextEncoder } = require("util");

const auth = getAuth(firebase_app);

export default async function signIn(email: string, password: string) {
  let result = null,
    error = null;
  try {
    // const hashedPassword =
    //   email !== 'hma@gmail.com' && email !== 'hma777797728@gmail.com' ? await hashString(password) : password;
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }
  return { result, error };
}
