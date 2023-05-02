import { useEffect, useState } from 'react';
import { loginFields } from '../(constants)/feilds';
import Input from './input';
import FormExtra from './formExtra';
import FormAction from './formAction';
import signIn from '../../firebase/auth/signin';
import { useRouter } from 'next/navigation';
import Loader from '@/app/(authed)/(shared)/loader/loader';
import { CircularProgress } from '@mui/material';

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

export default function Login() {
  const { push } = useRouter();
  const [loginState, setLoginState] = useState(fieldsState);
  const [loading, setLoading] = useState<boolean>(false);
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
    console.log(error, result, 323232323);
    setErrorMessage(
      error?.code == 'auth/too-many-requests'
        ? 'Too many Requests.Try again later, or reset your password'
        : error?.code == 'auth/wrong-password'
        ? 'Invalid email or password'
        : error?.code === 'auth/user-not-found'
        ? 'User does not exist, sign up first'
        : 'Login Error, try again later.'
    );
  //  setErrorMessage(loginState['password'].length < 6 ? 'Password must be more than 6 characters' : '');
    //alert(error.code)
    if (result) {
      push('/dashboard');
      setSuccessful(true);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  return !loading && !successful ? (
    <>
      <form onSubmit={handleSubmit} className="mt-8 min-w-full space-y-6">
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
        <FormAction handleSubmit={handleSubmit} text="Login" disable={loginState['password']< 6} />
      </form>
    </>
  ) : !successful && loading ? (
    <div>
     <CircularProgress size={100}/>
    </div>
  ) : (
    <div>
      Redirecting... <CircularProgress size={100}/>
    </div>
  );
}
