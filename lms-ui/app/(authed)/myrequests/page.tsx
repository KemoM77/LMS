'use client';
import React from 'react'
import RequestsList from '../profile/requestsList'
import { useAuthContext } from '@/app/context/AuthContext';
import { redirect } from 'next/navigation';

export default function Page() {
    const { currentUser} = useAuthContext();

    if (currentUser.isLibrarian) redirect('/dashboard');


  return !currentUser.isLibrarian && (
   <>
     <div className='flex justify-center items-center h-full w-full'>
         <div className='shadow-lg w-full'>
             <RequestsList userInfo={currentUser}/>
         </div>
     </div>
   </>
  )
}
