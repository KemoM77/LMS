'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';

import { loginFields } from '../(constants)/feilds';
import signIn from '../../firebase/auth/signin';
import FormAction from './formAction';
import FormExtra from './formExtra';
import Input from './input';

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

export default function Login() {
  const router = useRouter();
  const [loginState, setLoginState] = useState(fieldsState);
  const [isloading, setLoading] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginState['password'].length < 6) {
      setErrorMessage('Password must be more than 6 characters');
      return;
    }

    setLoading(true);
    const { result, error } = await signIn(loginState['email-address'], loginState['password']);
    // //////console.log(323232323);
    setErrorMessage(
      error?.code == 'auth/too-many-requests'
        ? 'Too many Requests.Try again later, or reset your password'
        : error?.code == 'auth/wrong-password'
        ? 'Invalid email or password'
        : error?.code === 'auth/user-not-found'
        ? 'User does not exist, sign up first'
        : error?.code == 'auth/invalid-email'
        ? 'Invalid Email, please enter a valid email'
        : 'Login Error, try again later.'
    );
    //  setErrorMessage(loginState['password'].length < 6 ? 'Password must be more than 6 characters' : '');
    //alert(error.code)
    if (result) {
      setSuccessful(true);
      //router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  return !isloading && !successful ? (
    <>
      <form onSubmit={handleSubmit} className="mt-8 md:min-w-full space-y-6" data-testid="login-component">
        <div className="text-center text-red-600">{errorMessage}</div>
        <div className="-space-y-px">
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={loginState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
              customClass={'bg-black'}
            />
          ))}
        </div>

        <FormExtra />
        <FormAction handleSubmit={handleSubmit} text="Login" disable={loginState['password'] < 6} />
      </form>
    </>
  ) : !successful && isloading ? (
    <div>
      <CircularProgress size={100} />
    </div>
  ) : (
    <div>
      Redirecting... <CircularProgress size={100} />
    </div>
  );
}
