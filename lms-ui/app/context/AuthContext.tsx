import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth, signOut, Auth, User } from 'firebase/auth';
import firebase_app from '../firebase';
import getData from '../firebase/firestore/getData';
import { UserInfo } from '../(authed)/profile/user';
const auth = getAuth(firebase_app);

export const AuthContext = createContext<AuthContextType| null>(null);

export const useAuthContext = () => useContext(AuthContext);

function signout() :Promise<void> {
  return signOut(auth);
}

interface AuthContextType{
   user:User, signout:()=>Promise<void> , currentUser:UserInfo ,loading :boolean,setCurrentUser:any
}

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user:User) => {
      if (user) {
        setUser(user);
       const {docData} = await getData('users',user.uid);
        setCurrentUser(docData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  return <AuthContext.Provider value={{ user, signout , currentUser ,loading , setCurrentUser }}>{children}</AuthContext.Provider>;
};
