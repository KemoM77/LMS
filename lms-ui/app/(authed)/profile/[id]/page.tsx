import React from 'react';
import Profile from '../profile';
import getData from '@/app/firebase/firestore/getData';


export default async function ProfilePageDynamic({ params }) {
  const { docData, error } = await getData('users', params.id);
  console.log(docData,error);
  return !error ? <Profile userInfo={docData} /> : <h1>User not found</h1>;
}
