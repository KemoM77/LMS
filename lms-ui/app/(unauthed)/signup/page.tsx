'use client';
import Header from '../(components)/header';
import Signup from '../(components)/signup';

export default function SignupPage() {  
  return (
    <div  className="border-gray-950 bg-slate-100 mt-32 flex max-h-[850px] min-w-[600px] flex-col justify-center rounded-md  border-0 p-10 shadow-2xl">
      <Header
        heading="Signup to create an account"
        paragraph="Already have an account? "
        linkName="Login"
        linkUrl="/signin"
      />
      <Signup  />
    </div>
  );
}
