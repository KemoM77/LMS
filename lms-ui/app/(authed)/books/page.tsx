'use client';
import React, { useEffect, useState } from 'react';
import BooksSearchBar from '../(shared)/FilteredSearch/booksSearchBar';
import Link from 'next/link';
import AddBook from './editBook';
import BookCard from './bookCard';
import { Button } from '@material-tailwind/react/components/Button';
import ActionDialog from '../(shared)/dialog/dialog';
import { useAuthContext } from '@/app/context/AuthContext';
import { BookInfo } from './book';
import { FeildQueryConstraint } from '@/app/firebase/firestore/constraints';
import getManyDocs from '@/app/firebase/firestore/getManyDocs';
import getPaginatedDocs, { getQueryCount } from '@/app/firebase/firestore/getPaginatedDocs';
import { CircularProgress } from '@mui/material';
import { useSearchParams } from 'next/navigation';


export default function booksPage() {
  const { currentUser } = useAuthContext();

  const [isAddBooksDialogOpen, setIsAddBooksDialogOpen] = useState<boolean>(false);
  const [searchedBooks, setSearchedBooks] = useState<BookInfo[]>(undefined);
  const [loadedBooks, setLoadedBooks] = useState<BookInfo[]>(undefined);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [bookCount, setBookCount] = useState<number>(0);
  const searchParams = useSearchParams();
  const searchValue = searchParams.get('search');
  const [searchTerms, SetSearchTerms] = useState(
    searchValue !== null ? { name: searchValue, categories: undefined, language: undefined } : undefined
  );
  
  const [urlSearch, setUrlSearch] = useState(undefined);
  const [startAtBook, setStartAtBook] = useState<string>(undefined);
  const endAt = 10;

  const fetchSerchedBooks = async () => {
   
    console.log(searchTerms);
    let mixedSearch = searchTerms?.name ? searchTerms?.name.toLowerCase().split(' ') : undefined;
    if (mixedSearch) {
      searchTerms?.categories?.forEach((cat) => {
        mixedSearch.push(`cat#${cat.toLowerCase()}`);
      });
    }
    console.log(mixedSearch);

    const constraints: FeildQueryConstraint[] = [
      {
        feild: 'searchableTerms',
        value: mixedSearch ? mixedSearch : undefined, //searchTerms?.name ? searchTerms?.name.toLowerCase().split(' ')  : undefined,
        comparison: 'array-contains-any',
      },
      {
        feild: 'categories',
        value: !searchTerms?.name && searchTerms?.categories?.length > 0 ? searchTerms?.categories : undefined,
        comparison: 'array-contains-any',
      },
      {
        feild: 'language',
        value: searchTerms?.language !== 'any' ? searchTerms?.language : undefined,
        comparison: '==',
      },
    ];

    const results = await getManyDocs(
      'books',
      constraints,
      'And',
      { feild: 'title', method: 'asc' },
      10,
      searchedBooks?.length > 0 ? startAtBook : 0
    );
    return { results };
  };

  const fetchRandomBooks = async () => {
    const { querySnapshot } = await getPaginatedDocs('books', loadedBooks?.length > 0 ? startAtBook : 0, endAt, {
      feild: 'title',
      method: 'asc',
    });
    return { querySnapshot };
  };

  const getDocsCount = async () => {
    const { count } = await getQueryCount('books');
    const numOfDocs = count;
    return numOfDocs;
  };

  const handleLoadMore = () => {
    //console.log('loaded more');
    setLoadingMore(true);
    if (loadedBooks)
      setStartAtBook(loadedBooks[loadedBooks?.length - 1].title || searchedBooks[searchedBooks?.length - 1].title);
    else setStartAtBook(searchedBooks[searchedBooks?.length - 1].title);
  };

  const handleAddBooks = () => {
    //console.log('Added books');
    setIsAddBooksDialogOpen(true);
  };

  useEffect(() => {
    // if (newUrlSearch && newUrlSearch !== null && newUrlSearch !== urlSearch) {
    //   setUrlSearch(newUrlSearch);
    //   SetSearchTerms({ name: urlSearch });
    // }
    if (searchTerms) {
      setLoadedBooks(undefined);
      let docs: BookInfo[] = searchedBooks && loadingMore ? searchedBooks : [];
      console.log('im from if', urlSearch, searchTerms);

      fetchSerchedBooks().then(({ results }) => {
        const snapDocs = results.querySnapshot.docs;
        snapDocs.forEach((doc) => {
          // //console.log(doc.data());
          docs.push(doc.data() as BookInfo);
        });

        setSearchedBooks(docs);
        //console.log('searched books are:', docs);
        setBookCount(results.docsCount);
        setLoadingMore(false);
      });
    } else {
      getDocsCount().then((numOfDocs) => {
        console.log('im from else', searchTerms);
        setBookCount(numOfDocs);
        let tempBooks: BookInfo[] = loadedBooks ? loadedBooks : [];
        fetchRandomBooks().then(({ querySnapshot }) => {
          setSearchedBooks(undefined);
          const snapDocs = querySnapshot.docs;
          snapDocs.forEach((doc) => {
            //console.log(doc.data());
            tempBooks.push(doc.data() as BookInfo);
            setLoadedBooks(tempBooks);
            setLoadingMore(false);
          });
        });
      });
    }
    //console.log('book count: ', bookCount, 'arraycount: ', searchedBooks?.length || 0);
    //console.log(loadedBooks, searchedBooks);
  }, [searchTerms, startAtBook]);

  return (
    <div className="flex flex-col md:items-center">
      <ActionDialog
        title={'Edit profile information'}
        content={
          <AddBook
            BookData={undefined}
            onSubmit={() => {
              setIsAddBooksDialogOpen(false);
            }}
          />
        }
        isOpen={isAddBooksDialogOpen}
        onClose={() => {
          setIsAddBooksDialogOpen(false);
        }}
      />
      <div className=" xs:flex-col xs:w-full mt-2   flex grid-rows-header  rounded-md bg-white  shadow-md md:fixed md:z-20">
        <div className="flex-1">
          <BooksSearchBar
            barSearch={searchValue !== null ? searchValue: undefined}
            onSearch={(search) => {
              SetSearchTerms(search);
              setStartAtBook(undefined);
            }}
          />
        </div>
        {currentUser.isLibrarian && (
          <Button className=" mr-3 mt-3 h-10 w-36 shadow-sm" size="sm" color="green" onClick={handleAddBooks}>
            Add Books
          </Button>
        )}
      </div>
      {/* //resultsssssssssss */}
      <div className="flex flex-col items-center justify-between">
        {/* <div className='bg-gray-50 shadow-md w-auto flex justify-center'>
    <AddBook/>
  </div> */}
        {bookCount && <h1 className="mb-4 ml-4 mr-auto mt-44 text-center text-4xl">{bookCount} Books :</h1>}
        <div className={`${!loadedBooks?.length ? 'mt-52' : ''}  flex flex-wrap justify-center`}>
          {bookCount > 0 ? (
            loadedBooks?.length > 0 || searchedBooks?.length > 0 ? (
              (loadedBooks || searchedBooks).map((book) => <BookCard key={book.id} BookDetails={book} />)
            ) : (
              <CircularProgress size={50} />
            )
          ) : (
            <h1>Sorry, No Books Found currently.</h1>
          )}
        </div>

        {(bookCount > loadedBooks?.length || bookCount > searchedBooks?.length) &&
          (!loadingMore ? (
            <div className="my-20 cursor-pointer text-cyan-600" onClick={handleLoadMore}>
              Load more
            </div>
          ) : (
            <CircularProgress size={50} />
          ))}
      </div>
    </div>
  );
}
