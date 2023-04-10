'use client';
import { loginFields } from '../(constants)/feilds';
import Header from '../(components)/header';
import Login from '../(components)/login';
import { useAuthContext } from '@/app/context/AuthContext';
import { redirect } from 'next/navigation';
const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

export default function LoginPage() {
  const { user, signout, loading } = useAuthContext();
  if (!loading && user) redirect('/dashboard');

  return (
    <div
      className="mt-6 flex max-h-[700px] min-w-[500px] 
    flex-col justify-center rounded-md  border-gray-950 bg-slate-100 p-10 shadow-2xl"
    >
      <Header 
        heading="Login to your account"
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/signup" />
      <div className="sticky flex  justify-center">
      <Login />
      </div>
    </div>
  );
}
