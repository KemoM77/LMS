'use client';
import getCategories from '@/app/firebase/firestore/getCategories';
import React, { useEffect, useState } from 'react';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import Input from '@/app/(unauthed)/(components)/input';
import FormAction from '@/app/(unauthed)/(components)/formAction';
import addCategories from '@/app/firebase/firestore/addCategories';
import { Button } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';

function arraysHaveSameElements(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }
  return true;
}

export default function CategoriesPage() {
  const [initCategories, setInitCategories] = useState<string[]>([]);
  const [currentCategories, setCurrentCategories] = useState<string[]>();
  const [newCate, setNewCate] = useState<string>('');
  const {currentUser } = useAuthContext();

  if (!currentUser.isLibrarian) redirect('/dashboard');


  const getCates = async () => {
      const { categories, error } = await getCategories();
      setInitCategories(categories.categories.sort());
    setCurrentCategories(categories.categories.sort() || []);
};

const handleNewCatgoryChange = async (event) => {
    setNewCate(event.target.value);
};

const handleNewCatgorySubmit = async (event) => {
    event.preventDefault();
    setCurrentCategories([...currentCategories, newCate]);
    setNewCate('');
    toast('New Catgory Added Successfully', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
    });
};

const handleDeleteCategory = async (name) => {
    setCurrentCategories([...currentCategories?.filter((item) => item !== name)]);
};

const handleSubmitEverything = async (name) => {
    await addCategories(currentCategories).then(() => {
        toast('Categories saved Successfully', {
            position: 'top-center',
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        });
    });
};

useEffect(() => {
    if (!currentCategories) getCates();
}, [currentCategories]);

return  currentUser.isLibrarian && (
    <div className=" flex h-full items-center justify-center ">
      <div className="container flex h-full w-full flex-col justify-between p-8 shadow-2xl  ">
        <h1 className="m-5 text-5xl">Manage Categories</h1>
<br />
        <form className="m-5 flex max-w-md justify-between" onSubmit={handleNewCatgorySubmit}>
          <div className="flex-1">
            <Input
              handleChange={handleNewCatgoryChange}
              labelText={'New Category:'}
              labelFor={'addCategory'}
              id={'addCategory'}
              name={'addCategory'}
              type={'text'}
              isRequired={true}
              value={newCate}
              placeholder={'New Category'}
            />
          </div>
          <Button className="ml-5" type="submit">
            Add
          </Button>
        </form>

        <div id="cateGoriesList" className="mt-6 flex max-h-[500px] flex-wrap  justify-center overflow-y-auto  ">
          {currentCategories?.map((cat,index) => (
            <div key={cat+ index} className=" animate__animated animate__fadeIn m-5 flex w-96 justify-between rounded-md border-2 border-blue-gray-100 p-2">
              <p>{cat}</p>
              <MinusCircleIcon
                onClick={() => {
                  handleDeleteCategory(cat);
                }}
                className="h-6 w-6 cursor-pointer text-red-700"
              />
            </div>
          ))}
        </div>
        <Button
          className="mt-4"
          disabled={arraysHaveSameElements(currentCategories || [], initCategories || [])}
          onClick={handleSubmitEverything}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
