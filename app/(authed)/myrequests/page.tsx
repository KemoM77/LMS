'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useAuthContext } from '@/app/context/AuthContext';

import RequestsList from '../profile/requestsList';

export default function ReqsPage() {
    const { currentUser} = useAuthContext();
    const router =useRouter()
    if (currentUser.isLibrarian) router.push('/dashboard');


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
