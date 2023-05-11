'use client';
import { useAuthContext } from '@/app/context/AuthContext';
import getManyDocs from '@/app/firebase/firestore/getManyDocs';
import { useEffect, useState } from 'react';
import addData from '@/app/firebase/firestore/addData';
import { BookRequest, RequestStatus } from '../../profile//request';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';
import getCollectionGroup from '@/app/firebase/firestore/getCollectionGroup';

export default function BorrowsList({ bookInfo }) {
  const [bookRequests, setBookRequests] = useState<BookRequest[]>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { currentUser } = useAuthContext();

  const fetchRequests = async () => {
    const { querySnapshot, docsCount } = await getCollectionGroup(
      'requests',
      [
        { feild: 'bookId', comparison: '==', value: bookInfo.id },
        { feild: 'status', comparison: '==', value: 'ACCEPTED' },
        { feild: 'type', comparison: '==', value: 'BORROW' },
      ],
      'And',
      { feild: 'until', method: 'desc' }
    );
    return { querySnapshot, docsCount };
  };
  useEffect(() => {
    if (!loaded) {
      let docs: BookRequest[] = [];
      fetchRequests().then((result) => {
        result.querySnapshot.docs.forEach((req) => {
          docs.push(req.data() as BookRequest);
        });
        setBookRequests(docs);
         console.log(docs);
      });
      setLoaded(true);
    }
  }, [loaded]);

  return loaded ? (
    <div className="mb-9  flex items-center justify-center">
      <div className="container flex h-full flex-col justify-center">
        <h1 className="m-2 text-4xl">Borrows:</h1>

        {bookRequests &&
          bookRequests.map((req) => (
            <div key={req.id.trim()} className="mx-1  flex flex-wrap justify-between border border-t-2 p-5 py-11">
              <Link href={'/profile/' + req.uid} className="mr-3 truncate font-semibold text-blue-500">
                {req.userName}
              </Link>
              {req.type === 'BORROW' && req.until && req.status === 'ACCEPTED' && (
                <div className="mr-3 font-semibold">
                  Deadline:
                  {req?.until instanceof Timestamp
                    ? Timestamp.fromMillis(req.until.seconds * 1000 + req.until.nanoseconds / 1000000)
                        .toDate()
                        .toLocaleDateString()
                    : new Date(req?.until).toLocaleDateString()}
                </div>
              )}
              <div className="flex justify-center"></div>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <CircularProgress size={50} />
  );
}
