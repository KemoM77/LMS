'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Loader from './(authed)/(shared)/loader/loader';

export default function Home() {
  const router = useRouter()
  useEffect(()=>{
    router.push('/dashboard');
  })

  return (
    <div className="mt-96 flex justify-center">
      <Loader size={100}  />
    </div>
  );
}
