'use client';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import FilteredSearch from '../(shared)/FilteredSearch/FilteredSearch';
import ActionDialog from '../(shared)/dialog/dialog';
import Signup from '@/app/(unauthed)/(components)/signup';
import { CircularProgress } from '@mui/material';
import getManyDocs from '@/app/firebase/firestore/getManyDocs';
import { FeildQueryConstraint } from '@/app/firebase/firestore/constraints';

export type SearchTerms = {
  searchText: string;
  filterOption: string;
};

function Page() {
  const { user, signout, loading, currentUser } = useAuthContext();
  const [searchTerms, SetSearchTerms] = useState<SearchTerms>(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  const options = ['Librarians', 'Users'];

  const fetchUsers = async () => {
    setSearchResults([]);
    const constraints: FeildQueryConstraint[] = [
      {
        feild: 'first_name',
        value: searchTerms?.searchText,
        comparison: '==',
      },
      {
        feild: 'last_name',
        value: searchTerms?.searchText,
        comparison: '==',
      },
    ];

    const results = await getManyDocs('users', constraints);
    return results.querySnapshot;
  };

  useEffect(() => {
    if (searchTerms !== null) {
      let docs = [];
      fetchUsers().then((value) => {
        const snapDocs = value.docs;
        snapDocs.forEach((doc) => {
          console.log(doc.data());
          docs.push(doc.data());
        });
      });
      setSearchResults(docs);
      console.log('qrrr',searchResults);
      
    }
  }, [searchTerms]);

  console.log(searchTerms);

  return (
    !loading && (
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
          <div className="flex flex-auto">
            <div className="mt-0 flex-1">
              <FilteredSearch options={options} onSearch={SetSearchTerms} />
            </div>
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="mr-7 mt-6 max-h-16 rounded-md bg-blue-700 px-3 py-2 text-white  hover:bg-blue-800"
            >
              Add New User
            </button>
          </div>

          {/* results */}

          {searchTerms &&
            (searchResults?.length > 0 ? (
              <div id="results" className="flex flex-col content-center justify-center">
                HELLO
              </div>
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
