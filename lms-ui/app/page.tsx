'use client'
import { useRouter } from 'next/navigation';
import Loader from './(authed)/(shared)/loader/loader';
import { useEffect } from 'react';

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
