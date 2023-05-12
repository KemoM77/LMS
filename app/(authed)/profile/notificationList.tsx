'use client';
import { useAuthContext } from '@/app/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { Notification } from './notification';
import getNotification from '@/app/firebase/firestore/getNotifications';
import { Timestamp } from 'firebase/firestore';
import { CircularProgress } from '@mui/material';
import ReadNotification from '@/app/firebase/firestore/readNotification';
import { useRouter } from 'next/navigation';
import { ClassNames } from '@emotion/react';
import classNames from 'classnames';

export function myToDate(date: Timestamp): Date {
  return Timestamp.fromMillis(date.seconds * 1000 + date.nanoseconds / 1000000).toDate();
}

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString();
  } else if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
  }
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);

  const { currentUser } = useAuthContext();

  const router = useRouter();

  const fetchNotifications = async () => {
    // setLoading(true);

    let notes: Notification[] = [];
    await getNotification(currentUser.id).then((result) => {
      result.notifications.forEach((doc) => {
        notes.push(doc.data() as unknown as Notification);
        //////console.log(doc.data());
      });

      setLoading(false);
      setLoaded(true);
    });

    setNotifications(notes);
  };

  const handleRead = async (not: Notification) => {
    if (!not.isRead) {
      await ReadNotification(currentUser.id, not);
      router.refresh();
      setLoaded(false);
    }
  };
  useEffect(() => {
    if (!loaded) fetchNotifications();
  }, [loaded]);

  return !loading ? (
    <div>
      <div className=" grid h-full place-items-center overflow-auto md:w-[500px] ">
        <div className=" rounded-xl border bg-white p-10 shadow-md dark:bg-gray-800 md:w-full ">
          <div className=" flex flex-col items-center justify-between sm:w-fit md:w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">Notifications</h3> <br />
            <p className='text-xs'>(Notifications older than 30 days will be automatically deleted)</p>
          </div>

          {notifications.length > 0 ? (
            notifications.map((not) => (
              <div
                onClick={() => {
                  handleRead(not);
                }}
                key={not.id}
                className={classNames({
                  'mt-2 w-full rounded-lg px-6 py-4  shadow ': true, // layout
                  'cursor-pointer bg-blue-100': !not.isRead,
                  'bg-blue-gray-50': not.isRead, // colors
                })}
              >
                <div className=" inline-flex w-full items-center justify-between">
                  <div className="inline-flex items-center">
                    <img
                      src="https://w7.pngwing.com/pngs/537/580/png-transparent-bell-notification-communication-information-icon.png"
                      alt="Training Icon"
                      className="mr-3 h-6 w-6"
                    />
                    <h3 className="text-base font-bold text-gray-800">{not.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{timeAgo(myToDate(not.createdAt))}</p>
                </div>
                <p className="mt-1 text-sm">{not.content}</p>
              </div>
            ))
          ) : (
            <h1>No Recent notifications</h1>
          )}
        </div>
      </div>
    </div>
  ) : (
    <CircularProgress size={50} />
  );
}
