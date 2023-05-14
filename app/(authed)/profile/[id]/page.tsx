'use client';
import React from 'react';
import Profile from '../profile';
import getData from '@/app/firebase/firestore/getData';
import { useAuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';


export default async function ProfilePageDynamic({ params }) {

  const {currentUser } = useAuthContext();
  const router =useRouter()
  if (!currentUser.isLibrarian) router.push('/dashboard');

  const { docData, error } = await getData('users', params.id);
  console.log(docData,error);
  return !error ? <Profile userInfo={docData} /> : <h1>User not found</h1>;
}
