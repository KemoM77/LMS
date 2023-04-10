'use client';
import { useEffect, useState } from 'react';
import Sidebar from './(shared)/sidebar/sidebar';
import { useAuthContext } from '../context/AuthContext';
import { redirect } from 'next/navigation';
import PrimarySearchAppBar from './(shared)/navbar/navbar';

// const metadata = {
// title: 'BookWoods',
// description: 'Library Managements system',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {    
    const { user, signout ,loading } = useAuthContext();
    if (!loading && !user)redirect('/signin');

    const [showSidebar, setShowSidebar] = useState(innerWidth< 700 ? false :true);
    
    
    useEffect(() => {
        console.log(user);
        function handleResize() {

        if(innerWidth < 700)
          setShowSidebar(false)
        
    }
    
        window.addEventListener('resize', handleResize)
      },[user])

  return (
    <html lang="en">
      <body>
        <div className="grid  grid-rows-header">
          <div className=" z-20 bg-white shadow-sm">
            {/* <Navbar onMenuButtonClick={() => setShowSidebar(!showSidebar)} /> */}
            <PrimarySearchAppBar isOpen={showSidebar} onMenuButtonClick={() => setShowSidebar(!showSidebar)} />
          </div>
          <div className=" flex">
            <div className="bg-zinc-50 shadow-md bg-[#00000000]">
              <Sidebar
                open={showSidebar}
                setOpen={(isOpen) => {
                  setShowSidebar(isOpen);
                }}
              />
            </div>
            <div  > {children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
