'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useAuthContext } from '@/app/context/AuthContext';
import { FeildQueryConstraint } from '@/app/firebase/firestore/constraints';
import getCurrency from '@/app/firebase/firestore/getCurrency';
import getDailyFees from '@/app/firebase/firestore/getDailyFees';
import getManyDocs from '@/app/firebase/firestore/getManyDocs';
import { getQueryCount } from '@/app/firebase/firestore/getPaginatedDocs';
import { Card, Typography } from '@material-tailwind/react';
import { CardContent } from '@mui/material';

import { BookInfo } from '../books/book';
import BookCard from '../books/bookCard';
import { myToDate } from '../profile/notificationList';
import { BookRequest } from '../profile/request';
import { delayDays } from '../profile/requestsList';

export default function DashPage() {
  const { currentUser } = useAuthContext();
  const [reminders, setReminders] = useState<BookRequest[]>([]);
  const [newBooks, setNewBooks] = useState<BookInfo[]>([]);
  const [numOfBooks, setNumOfBooks] = useState<number>(0);
  const [numOfUsers, setNumOfUsers] = useState<number>(0);
  const [fines, setFines] = useState<number>(undefined);
  const [finesCurrency, setFinesCurrency] = useState<string>('USD');
  const [delayFees, setDelayFees] = useState<number>(undefined);
  const router = useRouter();
  const fetchDailyFees = async () => {
    const { dailyFees, error } = await getDailyFees();
    setDelayFees(dailyFees.fee);
    return { dailyFees, error };
  };

  const fetchCurrency = async () => {
    const { currency, error } = await getCurrency();
    setFinesCurrency(currency.currency);
    router.refresh();
    return { currency, error };
  };

  const calcBooks = async () => {
    const { count } = await getQueryCount('books');
    setNumOfBooks(count);
    router.refresh();
  };

  const calcUsers = async () => {
    const { count } = await getQueryCount('users');
    setNumOfUsers(count);
    router.refresh();
  };

  const fetchNewBooks = async () => {
    const { querySnapshot } = await getManyDocs('books', [], 'And', { feild: 'addedAT', method: 'desc' }, 4);

    ////////console.log(34546343234567654357756355,querySnapshot.docs[0].data());

    let rems: BookInfo[] = [];
    querySnapshot.docs.forEach((doc) => {
      //////console.log(delayFees);
      rems.push(doc.data() as BookInfo);
      //////console.log('hererer', doc.data());
    });

    setNewBooks(rems);
    router.refresh();
  };

  const fetchRemindersAndFines = async () => {
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
    const { querySnapshot } = await getManyDocs(`users/${currentUser.id.trim()}/requests`, contraints, 'And', {
      feild: 'until',
      method: 'asc',
    });

    let totalFine = 0;
    let rems: BookRequest[] = [];
    querySnapshot.docs.forEach((doc) => {
      //////console.log(delayFees);

      rems.push(doc.data() as BookRequest);
      totalFine += delayDays(myToDate(doc?.data().until)) * delayFees;
      //////console.log(doc.data());
    });

    setReminders(rems);
    setFines(totalFine);
    router.refresh();
  };

  useEffect(() => {
    {
      fetchDailyFees().then(() => {
        fetchCurrency();
        calcBooks();
        calcUsers();
        fetchRemindersAndFines();
        fetchNewBooks();
      });
    }
  },[fines]);
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex h-full ">
        <div className="flex-1 lg:mr-72">
          <div className="mb-4 max-h-96">
            <Card>
              <CardContent>
                <h1 className="text-5xl">
                  {' '}
                  Welcome, {currentUser?.first_name}! &#128075; <br />
                </h1>
                Current Status: {currentUser?.isActive ? 'Active :) ' : 'Suspended :('} <br />
                {currentUser.isActive && currentUser.valid_until
                  ? 'Until: ' + myToDate(currentUser.valid_until).toLocaleDateString()
                  : ''}
              </CardContent>
            </Card>
          </div>
          <div className="mb-4">
            <Card>
              <CardContent>
                <h1 className="text-3xl">Library Information</h1>
                <ul>
                  <li>Total Books: {numOfBooks} </li>
                  <li>Total Users: {numOfUsers} </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          {!currentUser.isLibrarian && (
            <div className="mb-4">
              <Card>
                <CardContent>
                  <h1 className="text-3xl">Your Fines</h1>-{fines +' ' + finesCurrency || 'Calculating...'}
                  
                </CardContent>
              </Card>
            </div>
          )}
          <Card className="mb-4 ">
            <CardContent>
              <div className="flex flex-col bg-white">
                <h1 className="text-3xl">Recently Added Books: </h1>

                <div className="flex flex-wrap justify-center">
                  {newBooks.map((doc) => (
                    <BookCard key={doc.id } BookDetails={doc} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <Card className=" h-full shadow-md lg:fixed lg:right-0  lg:top-0 lg:mt-16 ">
          <CardContent>
            <Typography variant="h5" component="h2">
              Reminders
            </Typography>
            {reminders.length>0?<ul className="max-h-[700px] overflow-auto lg:w-64 ">
              {reminders.map((reminder, index) => (
                <li color="green" key={index} className="mt-2">
                  <Link className="text-blue-900" href={'books/' + reminder.bookId}>
                    {reminder.bookName}{' '}
                  </Link>
                  - Due {myToDate(reminder.until).toLocaleDateString()}
                </li>
              ))}
            </ul>:<p>No reminders available currently.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

