'use client';
import { useEffect, useState } from 'react';
import Sidebar from './(shared)/sidebar/sidebar';
import { useAuthContext } from '../context/AuthContext';
import { redirect, useRouter } from 'next/navigation';
import PrimarySearchAppBar from './(shared)/navbar/navbar';
import ConfirmDialog from './(shared)/confirmDialog/dialog';
import { CircularProgress } from '@mui/material';

// const metadata = {
// title: 'BookWoods',
// description: 'Library Managements system',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading ,currentUser } = useAuthContext();
  if (!loading && !user) redirect('/signin');
  
  const [showSidebar, setShowSidebar] = useState(false);
  
  useEffect(() => {
    setShowSidebar(window.innerWidth < 1000 ? false : true);
  }, []);

  function handleResize() {
    
    if (window.innerWidth < 700) setShowSidebar(false);
  }
  useEffect(() => {
    ////////console.log(user);

    window.addEventListener('resize', handleResize);
  }, [user]);

  return (
    !loading  && currentUser  ? <>
      <ConfirmDialog />
      <div className="grid  grid-rows-header">
        <div className=" z-20 bg-white shadow-sm">
          {/* <Navbar onMenuButtonClick={() => setShowSidebar(!showSidebar)} /> */}
          <PrimarySearchAppBar isOpen={showSidebar} onMenuButtonClick={() => setShowSidebar(!showSidebar)} />
        </div>
        <div className="flex">
          <div className="bg-[#00000000] bg-zinc-50 shadow-md">
            <Sidebar
              open={showSidebar}
              setOpen={(isOpen) => {
                setShowSidebar(isOpen);
              }}
            />
          </div>
          <div className='flex-1'> { children}</div>
        </div>
      </div>
    </>: <div className='flex items-center justify-center h-screen '> <CircularProgress size={50}/> </div>
  );
}
