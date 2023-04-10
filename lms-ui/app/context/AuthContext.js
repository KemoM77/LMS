import React from 'react';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import firebase_app from '../firebase';
import { redirect } from 'next/navigation';

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

function signout() {
  return signOut(auth);
}

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        redirect('/signin')
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  return <AuthContext.Provider value={{ user, signout ,loading }}>{children}</AuthContext.Provider>;
};
