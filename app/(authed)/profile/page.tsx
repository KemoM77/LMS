'use client'
import React from 'react';

import { useAuthContext } from '@/app/context/AuthContext';
import getData from '@/app/firebase/firestore/getData';

import Profile from './profile';

export default  function ProfilePage() {
  const { user, loading,currentUser } = useAuthContext();
 // const { docData, error } = await getData('users', user.uid);
  return !loading && <Profile userInfo={currentUser} />;
}
