'use client';
import { useEffect, useState } from 'react';
import { editProfileFields } from '@/app/(unauthed)/(constants)/feilds';
import FormAction from '@/app/(unauthed)/(components)/formAction';
import Input from '../../(unauthed)/(components)/input';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthContext } from '@/app/context/AuthContext';
import getData from '@/app/firebase/firestore/getData';
import addData from '@/app/firebase/firestore/addData';
import { toast } from 'react-toastify';
import { UserInfo } from './user';

const fields = editProfileFields;
let fieldsState = {};

export default function EditProfileComp({ uid ,onSubmit=()=>{} }) {
  const { user, setCurrentUser,currentUser } = useAuthContext();
  const [userData, setUserData] = useState<UserInfo>(null);

  useEffect(() => {
    async function fetchUser() {
      const { docData, error } = await getData('users', uid);
      setUserData(docData);
      fields.forEach((field) => (fieldsState[field.id] = docData[field.id]));
      fields.forEach((field) => {
        console.log(docData[field.id]);
      });
    }

    fetchUser();
  }, []);

  const [editProfileState, setEditProfileState] = useState(fieldsState);
  const [loading, setLoading] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setEditProfileState({ ...editProfileState, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { result, error } = await addData('users', uid, editProfileState);

    setSuccessful(false);
    toast('User Information Updated', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    if (user.uid === userData.id) {
      setCurrentUser({ ...currentUser ,...editProfileState });
      console.log('same');
    }

    console.log('load off');
    router.refresh();
    onSubmit();
    setLoading(false);
  };

  return !loading && !successful ? (
    <>
      <form onSubmit={handleSubmit} className=" w-96 mt-8 flex  min-w-full flex-col space-y-6">
        <div className="text-center text-red-600">{errorMessage}</div>
        <div className="-space-y-px">
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={editProfileState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
              customClass={''}
            />
          ))}
        </div>
        <FormAction handleSubmit={handleSubmit} text="Update" disable={false} />
      </form>
    </>
  ) : !successful && loading ? (
    <div>
      <CircularProgress size={100} />
    </div>
  ) : (
    <div>
      Redirecting... <CircularProgress size={100} />
    </div>
  );
}
