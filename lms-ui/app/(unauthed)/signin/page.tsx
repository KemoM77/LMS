'use client';
import { loginFields } from '../(constants)/feilds';
import Header from '../(components)/header';
import Login from '../(components)/login';

export default function LoginPage() {

  return (
    <div
    className="border-gray-950 bg-slate-100 mt-32 flex max-h-[850px] min-w-[600px] flex-col justify-center rounded-md  border-0 p-10 shadow-2xl"
    >
      <Header
        heading="Login to your account"
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/signup"
      />
      <div className="sticky flex  justify-center">
        <Login />
      </div>
    </div>
  );
}
