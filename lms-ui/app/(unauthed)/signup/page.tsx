'use client';
import { redirect } from "next/navigation";
import Header from "../(components)/header";
import Signup from "../(components)/signup";
import { useAuthContext } from "@/app/context/AuthContext";

export default function SignupPage(){
  const { user, signout ,loading } = useAuthContext();
    if (!loading && user)redirect('/dashboard');
    return(
        <div className="mt-32 flex max-h-[850px] min-w-[600px] flex-col justify-center rounded-md border border-0 border-gray-950 shadow-2xl bg-slate-100 p-10">
            <Header
              heading="Signup to create an account"
              paragraph="Already have an account? "
              linkName="Login"
              linkUrl="/signin"
            />
            <Signup/>
        </div>
    )
}