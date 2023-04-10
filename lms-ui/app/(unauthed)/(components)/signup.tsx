import { useState } from 'react';
import { signupFields } from "../(constants)/feilds"
import FormAction from "./formAction";
import Input from "./input";
import signUp from '@/app/firebase/auth/signup';
import { useRouter } from 'next/navigation';
import Loader from '@/app/(authed)/(shared)/loader/loader';

const fields=signupFields;
let fieldsState={};

fields.forEach(field => fieldsState[field.id]='');

export default function Signup(){
  const [signupState,setSignupState]=useState(fieldsState);
  const [loading,setLoading]=useState<boolean>(false);
  const [successful,setSuccessful]=useState<boolean>(false);
  const { push } = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange=(e)=>setSignupState({...signupState,[e.target.id]:e.target.value});

  const handleSubmit= async(e)=>{
    e.preventDefault();
    setErrorMessage(signupState['password'].length < 6 ?'Password must be more than 6 characters':signupState['password'] !== signupState['confirm-password']?"Passwords don't match":'')
    if(signupState['password'].length < 6 || signupState['password'] !== signupState['confirm-password'])return; 
    setLoading(true);
    const { result, error } = await signUp(signupState['email-address'], signupState['password']);

    //console.log(error, result, 323232323);
    // alert(
        //   error.code == 'auth/too-many-requests'
        //     ? 'Too many Requests.Try again later, or reset your password'
        //     : error.code == 'auth/wrong-password'
        //     ? 'Invalid email or password'
        //     : error.code === 'auth/user-not-found'
        //     ? 'User does not exist, sign up first'
        //     : 'Login Error, try again later.'
        // );
        
        setErrorMessage(error.code == 'auth/too-many-requests'
        ? 'Too many Requests.Try again later, or reset your password'
        : error.code === 'auth/email-already-in-use'
        ? 'Email already exists, please login instead'
        : error.code === 'auth/user-not-found'
        ? 'User does not exist, sign up first'
        : 'Login Error, try again later.')

       // alert(error.code)
        if (result) {
            push('/dashboard');
            setSuccessful(true);
        }
        setLoading(false);
  }

  //handle Signup API Integration here
  const createAccount=()=>{

  }

  return !loading && !successful ? (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className='text-red-600 text-center' >{errorMessage}</div>
        <div className="">
        {
                fields.map(field=>
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
            }
          <FormAction handleSubmit={handleSubmit} text="Signup" />
        </div>
      </form>
    </>
  ) : !successful && loading ? (
    <div>
      <Loader />
    </div>
  ) : (
    <div>
      {' '}
      Redirecting... <Loader />{' '}
    </div>
  );
}