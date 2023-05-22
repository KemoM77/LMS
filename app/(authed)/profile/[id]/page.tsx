'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useAuthContext } from '@/app/context/AuthContext';
import getData from '@/app/firebase/firestore/getData';

import Profile from '../profile';

export default async function ProfilePageDynamic({ params }) {

  const {currentUser } = useAuthContext();
  const router =useRouter()
  if (!currentUser.isLibrarian) router.push('/dashboard');

  const { docData, error } = await getData('users', params.id);
  console.log(docData,error);
  return !error ? <Profile userInfo={docData} /> : <h1>User not found</h1>;
}
