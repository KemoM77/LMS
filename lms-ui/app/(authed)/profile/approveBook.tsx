'use client';
import Input from '@/app/(unauthed)/(components)/input';
import addData from '@/app/firebase/firestore/addData';
import { Button } from '@material-tailwind/react';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BookRequest } from './request';
import addNotification from '@/app/firebase/firestore/addNotification';
import { useAuthContext } from '@/app/context/AuthContext';

export function isDateInFuture(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return inputDate < currentDate;
}

export default function ApproveBook({ requestInfo, userInfo ,  onSubmit }) {
  const [deadline, setDeadline] = useState<string>(undefined);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const router = useRouter();
  const { currentUser } = useAuthContext();

  const USER_REQUESTS_URL = `users/${requestInfo.uid.trim()}/requests`;

  const handleChange = (event) => {
    console.log(event.target.value);
    setDeadline(event.target.value);
    setIsDisabled(isDateInFuture(event.target.value));
   // console.log(requestInfo);
    
  };
  const handleApprove = async (event) => {
    event.preventDefault();
    //console.log('aprroved');
    const date = new Date(deadline);
    console.log(Timestamp.fromDate(date));
    const newReqData: BookRequest = {
      ...requestInfo,
      status: 'ACCEPTED',
      managedBy: currentUser.first_name + ' ' + currentUser.last_name,
      until: Timestamp.fromDate(date),
      managedAt: serverTimestamp(),
    };
    // console.log(newReqData);
    // console.log(USER_REQUESTS_URL);

    await addData(USER_REQUESTS_URL, newReqData.id.trim(), newReqData);
    await addNotification(
      userInfo.id,
      requestInfo.status === 'ACCEPTED' ? `Deadline Extended` : 'Request Accepted',
      (requestInfo.status === 'ACCEPTED'
        ? `Deadline for (${requestInfo.bookName}) extended`
        : `Borrow request Approved for(${requestInfo.bookName})`) +
        ' we hope you will enjoy it! consider the deadline ' +
        date.toLocaleDateString() +
        ' !'
    );
    toast('Successful', {
      position: 'top-center',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    onSubmit();
    router.refresh();
  };
  return (
    <div className="flex justify-center">
      <form className="mt-11 flex h-full w-96 flex-col items-center justify-between" onSubmit={handleApprove}>
        <Input
          handleChange={handleChange}
          labelText={'Borrow until(choose a date in the future to activate the button):'}
          labelFor={'until'}
          id={'until'}
          name={'until'}
          type={'date'}
          isRequired={true}
          value={deadline}
          placeholder={'Until'}
          customClass="w-96"
        />
        <Button type="submit" disabled={isDisabled}>
          Approve
        </Button>
      </form>
    </div>
  );
}
