import React from 'react';
import Profile from '../profile';
import getData from '@/app/firebase/firestore/getData';
import { useAuthContext } from '@/app/context/AuthContext';
import { redirect } from 'next/navigation';
import { Dashboard } from '@mui/icons-material';

export default async function ProfilePageDynamic({ params }) {
  const { docData, error } = await getData('users', params.id);
  //_//console.log(docData,error);
  return !error ? <Profile userInfo={docData} /> : <h1>User not found</h1>;
}
