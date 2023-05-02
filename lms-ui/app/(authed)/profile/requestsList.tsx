'use client';
import { useAuthContext } from '@/app/context/AuthContext';
import getManyDocs from '@/app/firebase/firestore/getManyDocs';
import { Button } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { confirmDialog } from '../(shared)/confirmDialog/dialog';
import addData from '@/app/firebase/firestore/addData';
import { BookRequest, RequestStatus } from './request';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ActionDialog from '../(shared)/dialog/dialog';
import ApproveBook from './approveBook';
import Link from 'next/link';
import getData from '@/app/firebase/firestore/getData';
import { BookInfo } from '../books/book';
import getDailyFees from '@/app/firebase/firestore/getDailyFees';
import getCurrency from '@/app/firebase/firestore/getCurrency';
import { CircularProgress } from '@mui/material';
import addNotification from '@/app/firebase/firestore/addNotification';

function getStatusColor(status: RequestStatus): string {
  switch (status) {
    case 'ACCEPTED':
      return 'text-blue-900';
    case 'PENDING':
      return 'text-gray-600';
    case 'REJECTED':
      return 'text-red-700';
    case 'CANCELED':
      return 'text-gray-600';
    case 'RETURNED':
      return 'text-green-700';
    default:
      return 'black';
  }
}

export function delayDays(date: Date): number {
  const currentDate = new Date();
  if (date >= currentDate) {
    return 0;
  }

  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const delayInMilliseconds = currentDate.getTime() - date.getTime();
  const delayInDays = Math.floor(delayInMilliseconds / millisecondsInADay);

  return delayInDays;
}

export default function RequestsList({ userInfo, onChange = () => {} }) {
  const USER_REQUESTS_URL = `users/${userInfo.id.trim()}/requests`;
  const [userRequests, setUserRequests] = useState<BookRequest[]>(undefined);
  const [isApproveRequestDialogOpen, setIsApproveRequestDialogOpen] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [choosenReq, setChoosenReq] = useState<BookRequest>(undefined);
  const { currentUser } = useAuthContext();
  const router = useRouter();
  const [finesCurrency, setFinesCurrency] = useState<string>('USD');
  const [delayFees, setDelayFees] = useState<number>(undefined);

  const fetchCurrency = async () => {
    const { currency, error } = await getCurrency();
    setFinesCurrency(currency.currency);
    return { currency, error };
  };

  const fetchDailyFees = async () => {
    const { dailyFees, error } = await getDailyFees();
    setDelayFees(dailyFees.fee);
    return { dailyFees, error };
  };

  const fetchRequests = async () => {
    const { querySnapshot, docsCount } = await getManyDocs(
      USER_REQUESTS_URL,
      [],
      'And',
      { feild: 'requestedAt', method: 'desc' },
      50
    );
    return { querySnapshot, docsCount };
  };

  const handleExtendBook = (req: BookRequest) => {
    setChoosenReq(req), setIsApproveRequestDialogOpen(true);
  };

  const handleRejectAccount = (req: BookRequest) => {
    confirmDialog('Do you really want to cancel this request ?', async () => {
      const { docData, error } = await getData('books', req.bookId);
      const newAddedBook: BookInfo = { ...docData, in_stock: parseInt(docData?.in_stock) + 1 };
      await addData('books', req.bookId, newAddedBook);
      req.status = currentUser.isLibrarian ? 'REJECTED' : 'CANCELED';
      req.managedBy = currentUser.first_name + ' ' + currentUser.last_name;
      req.managedAt = serverTimestamp();
      await addData(USER_REQUESTS_URL, req.id.trim(), req).then(() => {});
      toast('Request rejected successfully', {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      await addNotification(
        userInfo.id,
        'Request was Dismissed ',
        `Sorry, your request for (${req.bookName}) has been canceled, please review your requests.`
      );
      router.refresh();
      onChange();
    });
  };
  const handleReturnBook = (req: BookRequest) => {
    confirmDialog('Do you really want to return this book ?', async () => {
      const { docData, error } = await getData('books', req.bookId);

      if (!error) {
        const newAddedBook: BookInfo = { ...docData, in_stock: parseInt(docData?.in_stock) + 1 };
        await addData('books', req.bookId, newAddedBook);
        req.status = 'RETURNED';
        req.managedBy = currentUser.first_name + ' ' + currentUser.last_name;
        req.managedAt = serverTimestamp();
        await addData(USER_REQUESTS_URL, req.id.trim(), req).then(() => {});
        toast('Book Returned successfully', {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        await addNotification(
          userInfo.id,
          'Book Returned',
          `Thanks for returning (${req.bookName}), we hope you enjoyed it!`
        );
        router.refresh();
        onChange();
      }
    });
  };
  const handleAcceptRequest = async (req: BookRequest) => {
    console.log(req);

    if (req?.type === 'BORROW') {
      setChoosenReq(req), setIsApproveRequestDialogOpen(true);
    } else {
      confirmDialog('Do you really want to approve this request ?', async () => {
        req.status = 'ACCEPTED';
        req.managedBy = currentUser.first_name + ' ' + currentUser.last_name;
        req.managedAt = serverTimestamp();
        await addData(USER_REQUESTS_URL, req.id.trim(), req).then(() => {});
        toast('New Settings saved Successfully', {
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
        onChange();
      });
      await addNotification(
        userInfo.id,
        'Buy Request Approved',
        `Thanks for buying (${req.bookName}), we hope you will enjoy it!`
      );
    }
  };
  useEffect(() => {
    if (!loaded) {
      fetchCurrency();
      fetchDailyFees();
      let docs: BookRequest[] = [];
      fetchRequests().then((result) => {
        result.querySnapshot.docs.forEach((req) => {
          docs.push(req.data() as BookRequest);
        });
        setUserRequests(docs);
        console.log(docs);
      });
      setLoaded(true);
    }
    router.refresh();
    onChange();
    console.log('should refresh');
  }, [currentUser, isApproveRequestDialogOpen, finesCurrency, delayFees]);

  return loaded ? (
    <div className="mb-9  flex items-center justify-center">
      <ActionDialog
        title={'Set deadline'}
        content={
          <ApproveBook
            userInfo={userInfo}
            requestInfo={choosenReq}
            onSubmit={() => {
              setIsApproveRequestDialogOpen(false);
              setLoaded(false);
              router.refresh();
              onChange();
            }}
          />
        }
        isOpen={isApproveRequestDialogOpen}
        onClose={() => {
          setIsApproveRequestDialogOpen(false);
        }}
      />
      <div className="container flex h-full flex-col justify-center">
        <h1 className="m-2 text-4xl">Requests:</h1>

        {userRequests &&
          userRequests.map((req) => (
            <div key={req.id.trim()} className="mx-1 flex flex-wrap justify-between border-t-2 p-2">
              <Link href={'/books/' + req.bookId} className="mr-3 truncate font-semibold text-blue-500">
                {req.bookName}
              </Link>
              <div className="font-semibold ">{req.type}</div>
              <div>
                At:
                {req?.requestedAt instanceof Timestamp
                  ? Timestamp.fromMillis(req.requestedAt.seconds * 1000 + req.requestedAt.nanoseconds / 1000000)
                      .toDate()
                      .toLocaleString()
                  : new Date(req?.requestedAt).toLocaleString()}
              </div>
              {req.type === 'BORROW' && req.until && (
                <div className="mr-3 font-semibold">
                  Deadline:
                  {req?.until instanceof Timestamp
                    ? Timestamp.fromMillis(req.until.seconds * 1000 + req.until.nanoseconds / 1000000)
                        .toDate()
                        .toLocaleString()
                    : new Date(req?.until).toLocaleString()}
                  {delayDays(
                    Timestamp.fromMillis(req.until.seconds * 1000 + req.until.nanoseconds / 1000000).toDate()
                  ) > 0 && (
                    <p className="text-red-700">
                      {'( ' +
                        delayDays(
                          Timestamp.fromMillis(req.until.seconds * 1000 + req.until.nanoseconds / 1000000).toDate()
                        ) +
                        ' days late )'}
                    </p>
                  )}
                </div>
              )}
              <div className={`${getStatusColor(req.status)} mr-3 font-semibold`}>
                {req.status}
                {req.status !== 'PENDING'
                  ? ' since ' +
                    (req?.managedAt instanceof Timestamp
                      ? Timestamp.fromMillis(req.managedAt.seconds * 1000 + req.managedAt.nanoseconds / 1000000)
                          .toDate()
                          .toLocaleString()
                      : new Date(req?.managedAt).toLocaleString())
                  : ''}
              </div>
              {req.until && (
                <div className={`mr-3 font-semibold text-red-700`}>
                  {'-'}
                  {delayFees *
                    delayDays(
                      Timestamp.fromMillis(req.until?.seconds * 1000 + req.until?.nanoseconds / 1000000).toDate()
                    )}{' '}
                  {finesCurrency}
                </div>
              )}
              {req.managedBy && <div className="mr-3">By:{req.managedBy}</div>}
              <div className="flex justify-center">
                {req.status === 'PENDING' && (
                  <Button
                    onClick={() => {
                      handleRejectAccount(req);
                    }}
                    color="red"
                    className="mr-2"
                  >
                    {currentUser.isLibrarian ? 'Reject' : 'Cancel'}
                  </Button>
                )}
                {currentUser.isLibrarian && req.status === 'PENDING' && (
                  <Button onClick={() => handleAcceptRequest(req)} color="green">
                    Accept
                  </Button>
                )}
                {currentUser.isLibrarian && req.status === 'ACCEPTED' && req.type === 'BORROW' && (
                  <Button onClick={() => handleExtendBook(req)} color="blue">
                    Extend
                  </Button>
                )}
                {currentUser.isLibrarian && req.status === 'ACCEPTED' && req.type === 'BORROW' && (
                  <Button onClick={() => handleReturnBook(req)} color="orange">
                    Return
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <CircularProgress size={50} />
  );
}
