'use client';
import React, { useEffect, useState } from 'react';
import { UserInfo } from './user';
import { confirmDialog } from '../(shared)/confirmDialog/dialog';
import { useAuthContext } from '@/app/context/AuthContext';
import { deleteData } from '@/app/firebase/firestore/deleteData';
import { deleteUser } from 'firebase/auth';
import EditProfileComp from './editProfileComp';
import ActionDialog from '../(shared)/dialog/dialog';
import { useRouter } from 'next/navigation';
import addData from '@/app/firebase/firestore/addData';
import RequestsList, { delayDays } from './requestsList';
import { Timestamp } from 'firebase/firestore';
import ActivateMember from './activateMemeberForm';
import getCurrency from '@/app/firebase/firestore/getCurrency';
import getDailyFees from '@/app/firebase/firestore/getDailyFees';
import getManyDocs from '@/app/firebase/firestore/getManyDocs';
import { FeildQueryConstraint, QueryConstraint } from '@/app/firebase/firestore/constraints';
import { BookRequest } from './request';
import addNotification from '@/app/firebase/firestore/addNotification';

type Props = {
  userInfo: UserInfo;
};

export default function Profile({ userInfo }: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState<boolean>(false);

  const [borrowedBooks, setBorrowedBooks] = useState<number>();
  const [pendingRequests, setPendingRequests] = useState<number>();
  const { user, signout, loading, currentUser } = useAuthContext();
  const router = useRouter();
  
  const [fines, setFines] = useState<number>(0);
  const [finesCurrency, setFinesCurrency] = useState<string>('USD');
  const [delayFees, setDelayFees] = useState<number>(undefined);

  const fetchDailyFees = async () => {
    const { dailyFees, error } = await getDailyFees();
    setDelayFees(dailyFees.fee);
    return { dailyFees, error };
  };

  const calcTotalFines = async () => {
    const contraints: FeildQueryConstraint[] = [
      {
        feild: 'type',
        value: 'BORROW',
        comparison: '==',
      },
      {
        feild: 'status',
        value: 'ACCEPTED',
        comparison: '==',
      },
    ];
    const { docsCount, querySnapshot } = await getManyDocs(`users/${userInfo.id.trim()}/requests`, contraints, 'And');
    setBorrowedBooks(docsCount)

    let totalFine = 0;
    querySnapshot.docs.forEach((doc) => {
     // console.log(delayFees);
      
      // console.log( delayDays(
      //   Timestamp.fromMillis(
      //     (doc.data() as BookRequest).until.seconds * 1000 + (doc.data() as BookRequest).until.nanoseconds / 1000000
      //   ).toDate()
      // ) );
      
      totalFine +=
        delayDays(
          Timestamp.fromMillis(
            (doc.data() as BookRequest).until.seconds * 1000 + (doc.data() as BookRequest).until.nanoseconds / 1000000
          ).toDate()
        ) * delayFees;
       // console.log(totalFine);
        
    });

    setFines(totalFine);
  };
  const calcPendingReqs = async () => {
    const contraints: FeildQueryConstraint[] = [
      {
        feild: 'type',
        value: 'BORROW',
        comparison: '==',
      },
      {
        feild: 'status',
        value: 'PENDING',
        comparison: '==',
      },
    ];
    const { docsCount } = await getManyDocs(`users/${userInfo.id.trim()}/requests`, contraints, 'And',{feild:'id' , method:'asc'},1);
    setPendingRequests(docsCount)
  };
  

  const fetchCurrency = async () => {
    const { currency, error } = await getCurrency();
    setFinesCurrency(currency.currency);
    return { currency, error };
  };

  const handleDeleteAccount = () => {
    confirmDialog('Do you really want to delete your accout?', async () => {
      deleteData(userInfo?.id, 'users');
      await deleteUser(user).then(() => {
        signout();
      });
    });
  };

  const handleActivate = async () => {
    if (userInfo.isActive) {
      confirmDialog(`Do you really want to suspend this accout?`, async () => {
        await addData('users', userInfo.id, { isActive: false });
        await addNotification(userInfo.id,'Account Suspended','Your account has been suspended, please contact the library service to re-activate.')
        router.refresh();
       // console.log(33333);
      });
    } else {
      setActivateDialogOpen(true);
    }
  };

  // useEffect(() => {
  // },[fines,finesCurrency,delayFees,pendingRequests,borrowedBooks]);
  fetchDailyFees();
  calcPendingReqs();
  fetchCurrency();
  calcTotalFines();
  return !loading && currentUser.id !== user.uid && !currentUser.isLibrarian ? (
    <h1>Unauthorized to view this page!</h1>
  ) : !loading && !userInfo ? (
    <p className="text-center text-4xl">User not Found</p>
  ) : (
    !loading && (
      <>
        <ActionDialog
          title={'Edit profile information'}
          content={
            <EditProfileComp
              uid={userInfo?.id}
              onSubmit={() => {
                setIsEditDialogOpen(false);
              }}
            />
          }
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
          }}
        />
        <ActionDialog
          title={'Set Unsubscription Date'}
          content={
            <ActivateMember
              userInfo={userInfo}
              onSubmit={() => {
                setActivateDialogOpen(false);
              }}
            />
          }
          isOpen={activateDialogOpen}
          onClose={() => {
            setActivateDialogOpen(false);
            router.refresh();
          }}
        />
        <div className="p-16">
          <div className="mt-24 bg-white p-8 shadow">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="order-last mt-20 grid grid-cols-3 text-center lg:order-first lg:mt-0">
                <div className="mr-2 rounded-md border-0 border-red-700">
                  <p className={`text-xl font-bold ${fines > 0 ? 'text-red-700' : 'text-green-700'}  `}>
                    {fines > 0 ? '-' : ''}
                    {fines} {finesCurrency}
                  </p>
                  <p className="text-gray-400">Fines</p>
                </div>
                <div className="mr-3">
                  <p className="text-xl font-bold text-blue-800">{borrowedBooks}</p>{' '}
                  <p className="text-gray-400">Borrowed books</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-800">{pendingRequests}</p>
                  <p className="text-gray-400">Pending requests</p>
                </div>
              </div>
              <div className="relative">
                <div
                  className={`absolute inset-x-0 top-0 mx-auto -mt-24 flex h-48 w-48 items-center justify-center rounded-full ${
                    userInfo.isActive ? 'bg-green-500' : 'bg-red-500'
                  } text-indigo-500 shadow-2xl`}
                >
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /> */}
                  {/* </svg> */}
                  <img
                    src={userInfo?.profile_img_url}
                    alt="profile image"
                    className="h-[186px]
            w-[186px] cursor-pointer rounded-full duration-300 hover:scale-95"
                  />
                </div>
              </div>
              <div className="mt-32 flex justify-between space-x-8 lg:mt-0 lg:justify-center ">
                {currentUser?.isLibrarian && userInfo.id !== currentUser.id && (
                  <button
                    onClick={handleActivate}
                    className={`transform rounded ${
                      userInfo.isActive ? 'bg-red-700' : 'bg-green-700'
                    } px-4 py-2 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg`}
                  >
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
              <p className="mt-5 font-light text-black">Role: {userInfo?.isLibrarian ? 'Librarian' : 'User'}</p>
              <h3
                className={`text-xl font-medium ${userInfo.isActive ? 'text-green-500' : 'text-red-600'} text-gray-700`}
              >
                Status: {userInfo?.isActive ? 'Active' : 'Inactive'} <br />
                {userInfo?.isActive &&
                  userInfo?.valid_until &&
                  'Until: ' +
                    Timestamp.fromMillis(
                      userInfo.valid_until.seconds * 1000 + userInfo.valid_until.nanoseconds / 1000000
                    )
                      .toDate()
                      .toLocaleDateString()}
              </h3>
              <p className="mt-5 font-light text-gray-600">{'Date of birth: ' + userInfo?.date_of_birth}</p>
              <p className="mt-8 text-gray-500">{userInfo?.email}</p>
              <p className="mt-3 font-light text-gray-600">{userInfo?.country + ', ' + userInfo?.city}</p>
              <p className="mt-2 text-gray-500">{userInfo?.address + ', ' + userInfo?.postalcode}</p>
            </div>
            <div className="mt-12 flex flex-col justify-center">
              <p className="text-center font-light text-gray-600 lg:px-16">
                Registration date :{' '}
                {userInfo?.date_of_registration &&
                  Timestamp.fromMillis(
                    userInfo.date_of_registration.seconds * 1000 + userInfo.date_of_registration.nanoseconds / 1000000
                  )
                    .toDate()
                    .toLocaleString()}
              </p>
              {currentUser?.isLibrarian && userInfo?.id === currentUser?.id && (
                <button
                  onClick={handleDeleteAccount}
                  className="mt-4 w-40 border border-red-600 px-4 py-2 font-medium text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Delete Account
                </button>
              )}
            </div>
          </div>
        </div>
        { !userInfo.isLibrarian&&<RequestsList userInfo={userInfo} onChange={()=>{router.refresh()}} />}
      </>
    )
  );
}
