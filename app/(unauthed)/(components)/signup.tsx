import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Loader from '@/app/(authed)/(shared)/loader/loader';
import signUp from '@/app/firebase/auth/signup';

import { signupFields } from '../(constants)/feilds';
import FormAction from './formAction';
import Input from './input';

// export type SignUpData = {
//     email:string,
//     password : string,
//     first_name:string,
//     last_name:string,
//     date_of_birth:string,
//     confirm_password:string,
// }


const fields = signupFields;
let fieldsState = {}; //:SignUpData;

fields.forEach((field) => {
  fieldsState[field.name] = field.value;
});
fieldsState['userType'] = 'user';

export default function Signup({ byLibrarian = false, onSubmit = () => {} }) {
  const [signupState, setSignupState] = useState(fieldsState);
  const [loading, setLoading] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);
  const { push } = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setSignupState({ ...signupState, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    ////////console.log(94949494949449);
    setErrorMessage(
      signupState['password'].length < 6
        ? 'Password must be more than 6 characters'
        : signupState['password'] !== signupState['confirm-password']
        ? "Passwords don't match"
        : ''
    );
    if (signupState['password'].length < 6 || signupState['password'] !== signupState['confirm-password']) return;
    setLoading(true);
    ////////console.log(signupState);

    const { result, error } = await signUp(signupState, byLibrarian);

    setErrorMessage(
      error?.code == 'auth/too-many-requests'
        ? 'Too many Requests.Try again later, or reset your password'
        : error?.code === 'auth/email-already-in-use'
        ? 'Email already exists, please login instead'
        : error?.message === 'Invalid date of birth'
        ? 'Please enter a valid date of birth in the past!'
        : error?.code === 'auth/user-not-found'
        ? 'User does not exist, sign up first'
        : 'Sign up Error, try again later.'
    );

    // alert(error.code)
    if (result) {
    //  if (!byLibrarian) push('/dashboard');
      setSuccessful(true);
    }
    if (!error) onSubmit();
    setLoading(false);
  };

  //handle Signup API Integration here

  return !loading && !successful ? (
    <>
      <form className="mt-1" onSubmit={handleSubmit}       data-testid="signup-component"
 >
        <div className="text-center text-red-600">{errorMessage}</div>
        <div className="">
          {fields.map(
            (field) =>
              (field.id !== 'isLibrarian' || byLibrarian) && (
                <Input
                  key={field.id}
                  handleChange={handleChange}
                  value={signupState[field.id]}
                  labelText={field.labelText}
                  labelFor={field.labelFor}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  isRequired={field.isRequired}
                  placeholder={field.placeholder}
                  customClass={''}
                />
              )
          )}

          {byLibrarian && (
            <section className="flex gap-3">
              <p className="text-slate-500 text-sm">Sign up as : </p>
              <section className="flex gap-2">
                <input
                  type="radio"
                  id="librarian"
                  name="userType"
                  value="librarian"
                  onClick={handleChange}
                  checked={signupState['userType'] === 'librarian'}
                />
                <label className="text-slate-500 text-sm" htmlFor="librarian">
                  Librarian
                </label>
              </section>
              <section className="flex gap-2">
                <input
                  type="radio"
                  id="user"
                  name="userType"
                  value="user"
                  onClick={handleChange}
                  checked={signupState['userType'] === 'user'}
                />
                <label className="text-slate-500 text-sm" htmlFor="user">
                  User
                </label>
              </section>
            </section>
          )}
          <FormAction handleSubmit={handleSubmit} text="Signup" disable={false} />
        </div>
      </form>
    </>
  ) : !successful && loading ? (
    <div  data-testid="loading-indicator"  >
      <Loader size={100} />
    </div>
  ) : (
    <div >
      Redirecting... <br /> <Loader size={100} />{' '}
    </div>
  );
}
