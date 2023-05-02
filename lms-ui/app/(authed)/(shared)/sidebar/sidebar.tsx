// components/layout/Sidebar.tsx
'use client';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { defaultNavItems } from './defaultNavItems';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthContext } from '@/app/context/AuthContext';
import { useOnClickOutside } from 'usehooks-ts';
import { useRouter, usePathname, redirect } from 'next/navigation';
import { UserInfo } from '../../profile/user';
import Loader from '../loader/loader';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
// define a NavItem prop
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  forLabrarian: boolean;
  forUsers: boolean;
};
// add NavItem prop to component prop
type Props = {
  open: boolean;
  navItems?: NavItem[];
  setOpen(open: boolean): void;
};
const Sidebar = ({ open, navItems = defaultNavItems, setOpen }: Props) => {
  const { user, signout, currentUser, loading } = useAuthContext();

  // useEffect(() => {
  //   if(!loading && user)
  //     setUserInfo(currentUser);
  // },[])

  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, (e) => {
    setOpen(false);
  });
  function handleSignout(): void {
    signout();
    redirect('/sign');
  }

  return (
    open && (
      <div
        className={classNames({
          'flex flex-col justify-between': true, // layout
          'border-t-[0.5px] bg-[#07074c] text-zinc-50 shadow-sm ': true, // colors
          'fixed top-16 z-10 lg:sticky max-[1100px]:z-20  max-[600px]:top-14': true, // positioning
          'min-h-[calc(100vh_-_64px)] max-[600px]:min-h-[calc(100vh_-_54px)] animate__animated    animate__slideInLeft animate__faster': true,
          'w-[250px] min-[800px]:w-[300px] ': open,
          'min-[800px]:w-[0px]': !open,
          '.3s -translate-x-0 transition-transform ease-in-out': true, //animations
          '-translate-x-full ': !open, //hide sidebar to the left when closed
        })}
        // ref={ref}
      >
        <nav className="sticky top-0">
          {/* nav items */}
          <ul className="flex flex-col gap-2 py-2">
            {navItems.map((item, index) => {
              return (
                (currentUser?.isLibrarian === item.forLabrarian || item.forLabrarian === item.forUsers) && (
                  <Link key={index} href={item.href}>
                    <li
                      className={classNames({
                        'text-indigo-100 hover:bg-[#2e51c5]': true, //colors
                        'flex items-center gap-4': true, //layout
                        'transition-colors duration-300': true, //animation
                        'mx-2 rounded-md p-2': true, //self style
                        'bg-[#2744a287]': pathname.toLowerCase() === item.href,
                      })}
                    >
                      {item.icon} {item.label}
                    </li>
                  </Link>
                )
              );
            })}
          </ul>
        </nav>
        {open && (
          <ArrowBackIosIcon
            className={classNames({
              'bg-[#f2f2f400] text-indigo-100': true, //colors
              'transition-colors duration-300': true, //animation
              'scale-80 right-0  m-auto mr-[-5px] cursor-pointer rounded-xl': true, //self style
            })}
            onClick={() => {
              setOpen(false);
            }}
          />
        )}
        {/* account  */}
        <div className="border-t border-t-indigo-800 p-4 ">
          {!loading ? (
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.profile_img_url}
                alt="profile image"
                className="cursor-pointer
            rounded-full duration-300 hover:scale-125 h-[36px] w-[36px]"
              />
              <div className="flex flex-row items-center justify-between gap-12 min-[800px]:gap-20">
                <div className="flex flex-col ">
                  <span className="my-0 text-indigo-50">{currentUser?.first_name + ' ' + currentUser?.last_name}</span>
                  <Link href="/profile" className="text-sm text-indigo-200">
                    View Profile
                  </Link>
                </div>
                <LogoutIcon tabIndex={0} onClick={handleSignout} className="cursor-pointer text-gray-50 opacity-100 duration-300 " />
              </div>
            </div>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}
        </div>
      </div>
    )
  );
};
export default Sidebar;

// components/layout/Sidebar.tsx
// import React, { useRef } from "react";
// import classNames from "classnames";
// import { useOnClickOutside } from "usehooks-ts";
// type Props = {
//   open: boolean;
//   setOpen(open: boolean): void;
// };
// const Sidebar = ({ open, setOpen }: Props) => {
//   const ref = useRef<HTMLDivElement>(null);
//   useOnClickOutside(ref, (e) => {
//     setOpen(false);
//   });
//   return (
//     <div
//       className={classNames({
//         // ... ommitted for brevity
//       })}
//       ref={ref}
//     >
//       <nav className="md:sticky top-0 md:top-16">
//         {/* nav items */}
//         <ul className="py-2 flex flex-col gap-2">
//           <li>Nav items</li>
//         </ul>
//       </nav>
//     </div>
//   );
// };
// export default Sidebar;
