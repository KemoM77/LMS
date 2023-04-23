'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { UserInfo } from './user';
import { confirmDialog } from '../(shared)/confirmDialog/dialog';
import { useAuthContext } from '@/app/context/AuthContext';
import { deleteData } from '@/app/firebase/firestore/deleteData';
import { deleteUser } from 'firebase/auth';
import EditProfileComp from './editProfileComp';
import ActionDialog from '../(shared)/dialog/dialog';
import { redirect, useRouter } from 'next/navigation';
import addData from '@/app/firebase/firestore/addData';
import { type } from 'os';

type Props = {
  userInfo: UserInfo
}

export default function Profile({ userInfo }:Props) {
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const { user, signout, loading,currentUser } = useAuthContext();
  const router = useRouter();

  // if (userInfo === null) {
  //   const { docData, error } = await getData('users', user.uid);
  //   userInfo = docData;
  // }
  const handleDeleteAccount = () => {
    confirmDialog('Do you really want to delete your accout?', async () => {
      deleteData(userInfo?.id, 'users');
      await deleteUser(user).then(() => {
        signout();
      });
    });
  };

  const handleActivate = ()=>{
    confirmDialog(`Do you really want to ${userInfo.isActive?'suspend':'activate'} this accout?`, async () => {
      await addData('users',userInfo.id,{isActive:!userInfo.isActive})
      router.refresh();
      console.log(33333);
      
    });
  };
  


  return (!loading &&currentUser.id !== user.uid && !currentUser.isLibrarian?<h1>Unauthorized to view this page!</h1>:
    ( !userInfo?<p className='text-4xl text-center'>User not Found</p>:(
      <>
        <ActionDialog
          title={'Edit profile information'}
          content={<EditProfileComp uid={userInfo?.id} onSubmit={()=>{setIsEditDialogOpen(false)}}/>}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
          }}
        />
        <div className="p-16">
          <div className="mt-24 bg-white p-8 shadow">
            <div className="grid grid-cols-1 md:grid-cols-3">
             <div className="order-last mt-20 grid grid-cols-3 text-center md:order-first md:mt-0">
                <div className='rounded-md border-0 border-red-700 mr-2'>
                  <p className={`text-xl font-bold ${userInfo.fines > 0?'text-red-700':'text-green-700'}  `}>{userInfo.fines > 0 ?'-':''}{userInfo?.fines||0} Ft</p>
                  <p className="text-gray-400">Fines</p>
                </div>
                <div className='mr-3'>
                  <p className="text-xl font-bold text-blue-800">{userInfo?.borrowed_books}</p> <p className="text-gray-400">Borrowed books</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-800">{userInfo?.pending_requests}</p>
                  <p className="text-gray-400">Pending requests</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-x-0 top-0 mx-auto -mt-24 flex h-48 w-48 items-center justify-center rounded-full bg-indigo-100 text-indigo-500 shadow-2xl">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /> */}
                  {/* </svg> */}
                  <Image
                    src={
                      userInfo?.profile_img_url
                        ? userInfo?.profile_img_url
                        : 'https://newprofilepic2.photo-cdn.net//assets/images/article/profile.jpg'
                    }
                    height={176}
                    width={176}
                    alt="profile image"
                    className="cursor-pointer
            rounded-full duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <div className="mt-32 flex justify-between space-x-8 md:mt-0 md:justify-center ">
                {currentUser?.isLibrarian && userInfo.id !== currentUser.id&& (
                  <button onClick={handleActivate} className={`transform rounded ${userInfo.isActive?'bg-red-700':'bg-green-700'} px-4 py-2 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg`}>
                    {userInfo?.isActive ? 'Suspend' : 'Activate'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsEditDialogOpen(true);
                    console.log(isEditDialogOpen);
                  }}
                  className="transform rounded bg-gray-700 px-4 py-2 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
                >
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="mt-20 border-b pb-12 text-center">
              <h1 className="text-4xl font-medium text-gray-700">{userInfo?.first_name + ' ' + userInfo?.last_name}</h1>
              <h3 className={`text-xl font-medium ${userInfo.isActive?'text-green-500':'text-red-600'} text-gray-700`}>Status: {userInfo?.isActive?'Active':'Inactive'}</h3>
              <p className="mt-5 font-light text-gray-600">{'Date of birth: ' + userInfo?.date_of_birth}</p>
              <p className="mt-8 text-gray-500">{userInfo?.email}</p>
              <p className="mt-3 font-light text-gray-600">{userInfo?.country + ', ' + userInfo?.city}</p>
              <p className="mt-2 text-gray-500">{userInfo?.address + ', ' + userInfo?.postalcode}</p>
            </div>
            <div className="mt-12 flex flex-col justify-center">
              <p className="text-center font-light text-gray-600 lg:px-16">
                Registration date : {userInfo?.date_of_registration.toDate().toLocaleString()}
              </p>
              <button
                onClick={handleDeleteAccount}
                className="mt-4 w-40 border border-red-600 px-4 py-2 font-medium text-red-600 hover:bg-red-600 hover:text-white"
              >
                {' '}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </>
    ))
  );
}
