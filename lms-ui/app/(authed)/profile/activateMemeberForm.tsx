'use client';
import Input from '@/app/(unauthed)/(components)/input';
import addData from '@/app/firebase/firestore/addData';
import { Button } from '@material-tailwind/react';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BookRequest } from './request';
import { UserInfo } from './user';

export function isDateInFuture(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return inputDate < currentDate;
}

export default function ActivateMember({ userInfo, onSubmit }) {
  const [deadline, setDeadline] = useState<string>(undefined);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const router = useRouter();
  const USER_URL = `users`;

  const handleChange = (event) => {
    //_//console.log(event.target.value);
    setDeadline(event.target.value);
    setIsDisabled(isDateInFuture(event.target.value));
  };
  const handleApprove = async (event) => {
    event.preventDefault();
    //_//console.log('aprroved');
    const date = new Date(deadline);
    //_//console.log(Timestamp.fromDate(date));

     userInfo = {
      ...userInfo,
      isActive:true,
      valid_until: Timestamp.fromDate(date)
    };

    //_//console.log(userInfo);

    await addData(USER_URL, userInfo.id.trim(), userInfo);
    toast('User Activated Successfully', {
      position: 'top-center',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    router.refresh();
    onSubmit();
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
