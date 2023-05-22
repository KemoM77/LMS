'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthContext } from '../context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  useEffect(() => {
    if (!loading && user) {
      redirect('/dashboard');
    }
  }, [user, loading]);


  return !user && !loading && <div className="flex items-center justify-center">{children}</div>;
}
