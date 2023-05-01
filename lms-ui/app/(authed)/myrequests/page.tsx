'use client';
import React from 'react'
import RequestsList from '../profile/requestsList'
import { useAuthContext } from '@/app/context/AuthContext';

export default function page() {
    const { currentUser} = useAuthContext();

  return (
   <>
     <div className='flex justify-center items-center h-full w-full'>
         <div className='shadow-lg w-full'>
             <RequestsList userInfo={currentUser}/>
         </div>
     </div>
   </>
  )
}
