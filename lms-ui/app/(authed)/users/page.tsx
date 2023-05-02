'use client';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { redirect, useRouter } from 'next/navigation';
import FilteredSearch from '../(shared)/FilteredSearch/FilteredSearch';
import ActionDialog from '../(shared)/dialog/dialog';
import Signup from '@/app/(unauthed)/(components)/signup';
import { CircularProgress } from '@mui/material';
import getManyDocs from '@/app/firebase/firestore/getManyDocs';
import { FeildQueryConstraint } from '@/app/firebase/firestore/constraints';
import { UserInfo } from '../profile/user';
import Link from 'next/link';

export type SearchTerms = {
  searchText: string;
  filterOption: string;
};

function Page() {
  const [searchTerms, SetSearchTerms] = useState<SearchTerms>(undefined);
  const [searchResults, setSearchResults] = useState<UserInfo[]>(undefined);
  const [usersCount, setUsersCount] = useState<number>(undefined);
  const [startAfter, setStartAfter] = useState<string>(undefined);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  
  const {loading ,currentUser } = useAuthContext();
  const router = useRouter();

  if (!currentUser.isLibrarian) redirect('/dashboard');

  const options = ['Librarians', 'Users'];

  const fetchUsers = async () => {
    setSearchResults(undefined);
    console.log(searchTerms);

    const constraints: FeildQueryConstraint[] = [
      {
        feild: 'searchableTerms',
        value: searchTerms?.searchText.toLowerCase() || undefined,
        comparison: 'array-contains',
      },
      {
        feild: 'isLibrarian',
        value:
          searchTerms?.filterOption === 'users' ? false : searchTerms?.filterOption === 'librarians' ? true : undefined,
        comparison: '==',
      },
    ];
    const results = await getManyDocs(
      'users',
      constraints,
      'And',
      { method: 'asc', feild: 'first_name' },
      10,
      startAfter
    );
    setUsersCount(results.docsCount);
    return results.querySnapshot;
  };

  const handleLoadMore = () => {
    //console.log('loaded more');
    setLoadingMore(true);
    setStartAfter(searchResults[searchResults?.length - 1]?.first_name || '');
  };

  useEffect(() => {
    if (searchTerms) {
      let docs: UserInfo[] = [];
      fetchUsers().then((value) => {
        const snapDocs = value.docs;
        snapDocs.forEach((doc) => {
         // console.log(doc.data());
          docs.push(doc.data() as UserInfo);
        });
        // docs =
        //   searchTerms.filterOption === 'all'
        //     ? docs
        //     : docs.filter((doc) => doc.isLibrarian === (searchTerms.filterOption === 'users' ? false : true));
        setSearchResults([...searchResults, ...docs]);
        setLoadingMore(false);
        console.log('SearchResults:', searchResults);
      });
    }
  }, [searchTerms, startAfter]);


  return (
    !loading && currentUser.isLibrarian && (
      <>
        <ActionDialog
          title={'Add Librarian/User'}
          content={
            <div className="min-w-[400px]">
              <Signup
                byLibrarian={true}
                onSubmit={() => {
                  setIsEditDialogOpen(false);
                }}
              />
            </div>
          }
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
          }}
        />

        <div className="flex flex-col ">
          <div className="flex  flex-auto">
            <div className="mt-0 flex-1">
              <FilteredSearch
                options={options}
                onSearch={(val) => {
                  SetSearchTerms(val);
                  setSearchResults([]);
                }}
              />
            </div>
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="mr-7 mt-6 max-h-16 rounded-md bg-blue-700 px-3 py-2 text-white  hover:bg-blue-800"
            >
              Add New User
            </button>
          </div>

          {/* results */}
          {!searchTerms && <h1 className="mt-10 text-center text-5xl font-semibold">Search to view users</h1>}
          {searchTerms &&
            (searchResults !== undefined ? (
              <>
                {' '}
                <h1 className=" ml-14 mt-10 text-3xl">
                  {'Found Total ' + usersCount + ' results for: ' + searchTerms.searchText}
                </h1>
                <div id="results" className="mt-10 flex h-full flex-col items-center justify-center">
                  <ul className="w-[calc(100%_-_200px)] divide-y divide-gray-200 dark:divide-gray-700">
                    {searchResults.map((doc) => (
                      <li key={doc.id} className="pb-3 sm:pb-4">
                        <div className="flex items-center  space-x-4">
                          <Link href={`/profile/${doc.id.trim()}`} className="flex-shrink-0">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={doc.profile_img_url}
                              alt={`${doc.first_name}'s image`}
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/profile/${doc?.id?.trim()}`}
                              className="truncate text-sm font-medium text-gray-900 dark:text-white"
                            >
                              {doc.first_name + ' ' + doc.last_name}
                            </Link>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{doc.email}</p>
                          </div>
                          <div
                            className={`${
                              doc.isActive ? 'text-green-500' : 'text-red-600'
                            } inline-flex items-center text-base font-normal `}
                          >
                            {doc?.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {usersCount > searchResults.length &&
                    (!loadingMore && !loading ? (
                      <div className="my-10 cursor-pointer text-cyan-600" onClick={handleLoadMore}>
                        Load more
                      </div>
                    ) : (
                      <CircularProgress size={50} />
                    ))}
                </div>
              </>
            ) : (
              <div id="results" className="flex h-[calc(100vh_-_140px)] flex-wrap content-center justify-center">
                <CircularProgress size={200} />
              </div>
            ))}
        </div>
      </>
    )
  );
}

export default Page;
