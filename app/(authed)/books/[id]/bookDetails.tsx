'use client';
import React, { useEffect, useState } from 'react';
import { confirmDialog } from '../../(shared)/confirmDialog/dialog';
import { useAuthContext } from '@/app/context/AuthContext';
import { deleteData } from '@/app/firebase/firestore/deleteData';
import { deleteUser } from 'firebase/auth';
import ActionDialog from '../../(shared)/dialog/dialog';
import { useRouter } from 'next/navigation';
import addData from '@/app/firebase/firestore/addData';
import { BookInfo } from '../book';
import AddBook from '../editBook';
import { Button } from '@material-tailwind/react';
import { getLanguageLabel } from './getLangLabel';
import { toast } from 'react-toastify';
import { BookRequest } from '../../profile/request';
import { serverTimestamp } from 'firebase/firestore';
import { addBook } from '../addBooktoDB';
import getLifeTime from '@/app/firebase/firestore/getLifetime';
import getCurrency from '@/app/firebase/firestore/getCurrency';
import BorrowsList from './borrowsList';

type Props = {
  bookInfo: BookInfo;
};

export default function BookDetails({ bookInfo }: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const { user, signout, loading, currentUser } = useAuthContext();
  const [reqLifeTime, setReqLifeTime] = useState<number>(72);
  const [finesCurrency, setFinesCurrency] = useState<string>('USD');

  const router = useRouter();

  console.log(bookInfo);

  // if (bookInfo === null) {
  //   const { docData, error } = await getData('users', user.uid);
  //   bookInfo = docData;
  // }

  const fetchLifeTime = async () => {
    const { lifeTime, error } = await getLifeTime();
    return { lifeTime, error };
  };

  const handleDeleteBook = () => {
    confirmDialog('Do you really want to delete this book?', async () => {
      deleteData(bookInfo?.id, 'books');
      router.push('/books');
      toast('Book was deleted from database successfully', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      router.refresh();
    });
  };

  const handleBorrowBook = () => {
    confirmDialog(
      `Do you really want to send a borrow request for this book?(request will be auto-cancelled in ${reqLifeTime} hours if not processed)`,
      async () => {
        //deleteData(bookInfo?.id, 'books');
        // router.push('/books');
        const request: BookRequest = {
          id: bookInfo.isbn13 + bookInfo.in_stock + '',
          uid: currentUser.id,
          bookId: bookInfo.id,
          bookName: bookInfo.title,
          status: 'PENDING',
          requestedAt: serverTimestamp(),
          type: 'BORROW',
        };
        const updatedBook = {
          ...bookInfo,
          in_stock: bookInfo.in_stock - 1,
        };
        addBook(updatedBook);
        await addData(`users/${currentUser.id}/requests`, request.id, request);
        toast('A borrow request has been sent successfully', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        router.refresh();
      }
    );
  };

  const handleBuyBook = () => {
    confirmDialog(
      `Do you really want to send a buy request for this book?(request will be auto-cancelled in ${reqLifeTime} hours if not processed)`,
      async () => {
        //deleteData(bookInfo?.id, 'books');
        // router.push('/books');
        const request: BookRequest = {
          id: bookInfo.isbn13 + bookInfo.in_stock + '',
          uid: currentUser.id,
          userName: currentUser.first_name + ' ' + currentUser.last_name,
          bookId: bookInfo.id,
          bookName: bookInfo.title,
          status: 'PENDING',
          requestedAt: serverTimestamp(),
          type: 'BUY',
        };
        const updatedBook = {
          ...bookInfo,
          in_stock: bookInfo.in_stock - 1,
        };
        addBook(updatedBook);
        await addData(`users/${currentUser.id}/requests`, request.id, request);
        toast('Buy request has been sent successfully', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        router.refresh();
      }
    );
  };

  //   const handleActivate = () => {
  //     confirmDialog(`Do you really want to ${bookInfo.isActive ? 'suspend' : 'activate'} this accout?`, async () => {
  //       await addData('users', bookInfo.id, { isActive: !bookInfo.isActive });
  //       router.refresh();
  //       console.log(33333);
  //     });
  //   };
  const fetchCurrency = async () => {
    const { currency, error } = await getCurrency();
    setFinesCurrency(currency.currency);
    return { currency, error };
  };

  useEffect(() => {
    fetchCurrency();
    fetchLifeTime().then(({ lifeTime }) => {
      console.log(lifeTime);

      setReqLifeTime(lifeTime.lifetime);
    });
  }, [reqLifeTime]);

  return !loading && currentUser.id !== user.uid && !currentUser.isLibrarian ? (
    <h1>Unauthorized to view this page!</h1>
  ) : !loading && !bookInfo ? (
    <p className="text-center text-4xl">Book not Found</p>
  ) : (
    !loading && (
      <>
        <ActionDialog
          title={'Edit profile information'}
          content={
            <AddBook
              BookData={bookInfo}
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
        <div className="p-16">
          <div className="mt-24 rounded-md bg-white p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="order-last mt-20 grid grid-cols-3 text-center lg:order-first lg:mt-0">
                <div className="mr-2 rounded-md border-0 border-red-700">
                  <p className={`text-xl font-bold text-blue-800 `}>
                    {getLanguageLabel(bookInfo?.language) || 'English'}
                  </p>
                  <p className="text-gray-400">Language</p>
                </div>
                <div className="mr-3">
                  <p className="text-xl font-bold text-blue-800">{bookInfo?.location}</p>{' '}
                  <p className="text-gray-400">Location</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-800">{bookInfo?.pages}</p>
                  <p className="text-gray-400">Pages</p>
                </div>
              </div>
              <div className="relative">
                <div
                  className={`absolute inset-x-0 top-0 m-auto -mt-24 flex h-56 w-56 items-center justify-center  ${
                    bookInfo.borrowable ? 'bg-green-500' : 'bg-red-500'
                  } text-indigo-500 shadow-2xl`}
                >
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /> */}
                  {/* </svg> */}
                  <img src={bookInfo?.cover_img} alt="profile image" className="h-72 w-56 cursor-pointer rounded-md" />
                </div>
              </div>
              <div className="mt-52 flex justify-between space-x-8 lg:mt-0 lg:justify-center ">
                {/* {currentUser?.isLibrarian && bookInfo.id !== currentUser.id && (
                <button
                  onClick={handleActivate}
                  className={`transform rounded ${
                    bookInfo.isActive ? 'bg-red-700' : 'bg-green-700'
                  } px-4 py-2 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg`}
                >
                  {bookInfo?.isActive ? 'Suspend' : 'Activate'}
                </button>
              )} */}
                {currentUser?.isLibrarian && (
                  <button
                    onClick={() => {
                      setIsEditDialogOpen(true);
                    }}
                    className="transform rounded bg-gray-700 px-4 py-2 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
                  >
                    Edit Book
                  </button>
                )}
                {!currentUser?.isLibrarian && bookInfo.sellable && (
                  <Button
                    color="green"
                    onClick={handleBuyBook}
                    disabled={bookInfo.in_stock <= 0 || !currentUser.isActive}
                    //className="transform rounded bg-gray-700 px-4 py-2 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
                  >
                    Buy Book
                  </Button>
                )}
                {!currentUser?.isLibrarian && (
                  <Button
                    onClick={handleBorrowBook}
                    disabled={bookInfo.in_stock <= 0 || !currentUser.isActive}
                    //className="transform rounded bg-gray-700 px-4 py-2 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
                  >
                    Borrow Book
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-44  border-b pb-12 text-center">
              <h1 className="text-4xl font-medium text-gray-700 lg:mt-10">{bookInfo?.title}</h1>
              <h3
                className={`text-xl font-bold ${
                  bookInfo.in_stock > 0 ? 'text-green-500' : 'text-red-600'
                } text-gray-700`}
              >
                In Stock: {bookInfo?.in_stock}
              </h3>
              <p className="mt-2 text-gray-500">Description: {bookInfo?.description}</p>
              <p className="mt-8 text-gray-500">Author(s): {bookInfo?.authors.toString()}</p>
              <p className="mt-8 text-gray-500">Categories: {bookInfo?.categories.toString()}</p>
              <p className="mt-5 font-light text-gray-600">Date of publish: {bookInfo.published}</p>
              <p className="mt-8 text-gray-500">
                ISBN/ISBN13: {bookInfo?.isbn}/{bookInfo?.isbn13}
              </p>
              {bookInfo.sellable ? (
                <p className="mt-3 font-semibold text-black">
                  Price: {bookInfo?.price}
                  {finesCurrency}
                </p>
              ) : (
                <p className="mt-3 font-semibold text-black">Not for Sale.</p>
              )}
              {!currentUser.isActive && (
                <p className="text-red-700">
                  NOTE: YOU ARE SUSBENDED, YOU WILL NOT BE ABLE SEND BUY/BORROW REQUESTS,PLEASE CONTACT COSTUMER
                  SERVICE.
                </p>
              )}
            </div>
            <div className="mt-12 flex flex-col justify-center">
              <p className="text-center font-light text-gray-600 lg:px-16"></p>
              {currentUser?.isLibrarian && (
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteBook}
                  className="mt-4 w-40 border  px-4 py-2 font-medium"
                >
                  Delete this book
                </Button>
              )}
            </div>
          </div>
        </div>
        { currentUser.isLibrarian && <BorrowsList bookInfo={bookInfo} />}
      </>
    )
  );
}
