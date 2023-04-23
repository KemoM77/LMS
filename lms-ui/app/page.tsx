'use client'
import { redirect } from 'next/navigation';
import Loader from './(authed)/(shared)/loader/loader';

export default function Home() {
redirect('/dashboard');

  return (
    <div className="mt-96 flex justify-center">
      <Loader size={100}  />
    </div>
  );
}
