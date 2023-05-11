'use client';
import React, { useEffect, useState } from 'react';
import Input from '@/app/(unauthed)/(components)/input';
import { Button } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import getDailyFees from '@/app/firebase/firestore/getDailyFees';
import getLifeTime from '@/app/firebase/firestore/getLifetime';
import modifyDailyFees from '@/app/firebase/firestore/modifyDailyFees';
import modifyLifeTime from '@/app/firebase/firestore/modifyLifetime';
import getCurrency from '@/app/firebase/firestore/getCurrency';
import modifyCurrency from '@/app/firebase/firestore/modifyCurrency';
import CurrencyCodesDropdown from './currencyDropdown';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';

export default function SettingsPage() {
  const [dailyFess, setDailyFess] = useState<number>(2);
  const [lifeTimeState, setLifeTime] = useState<number>(72);
  const [currencyState, setCurrency] = useState<string>('USD');
  const [loaded, setLoaded] = useState<boolean>(false);

  const { loading, currentUser } = useAuthContext();
  const router = useRouter();


  //if (!currentUser.isLibrarian) router.push('/dashboard');




  const fetchDailyFees = async () => {
    const { dailyFees, error } = await getDailyFees();
    return { dailyFees, error };
  };
  const fetchLifeTime = async () => {
    const { lifeTime, error } = await getLifeTime();
    return { lifeTime, error };
  };
  const fetchCurrency = async () => {
    const { currency, error } = await getCurrency();
    return { currency, error };
  };

  const handleFeesChange = (event) => {
    setDailyFess(event.target.value);
  };

  const handleTimeChange = (event) => {
    //////console.log(event.target.value);

    setLifeTime(event.target.value);
  };

  const handleSubmitEverything = async (event) => {
    event.preventDefault();
    await modifyDailyFees(dailyFess).then(() => {
      toast('New Settings saved Successfully', {
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
    await modifyLifeTime(lifeTimeState).then(() => {
      //////console.log('added life time');
    });
    await modifyCurrency(currencyState).then(() => {
      //////console.log('added cur');
    });
  };
  useEffect(() => {
    if (!loaded) {
      fetchCurrency().then((result) => {
        //////console.log(result.currency);
        setCurrency(result.currency.currency);
      });
      fetchDailyFees().then((result) => {
        //////console.log(result.dailyFees);
        setDailyFess(result.dailyFees.fee);
      });
      fetchLifeTime().then((result) => {
        setLifeTime(result.lifeTime.lifetime);
      });
      setLoaded(true);
    }
  }, [loaded]);

  return currentUser.isLibrarian && (
    <div className=" flex h-full items-center justify-center ">
      <div className="container flex h-full w-full flex-col justify-center p-8 shadow-2xl  ">
        <h1 className="m-5 text-5xl">Manage Settings and Variables</h1>
        <br />
        <form className="m-5 flex flex-col justify-between" onSubmit={handleSubmitEverything}>
          <div className="flex flex-col">
            <Input
              handleChange={handleTimeChange}
              labelText={
                'Life Time of request :(The time will be available before auto deleting the requests) in HOURS:'
              }
              labelFor={'life'}
              id={'life'}
              name={'life'}
              type={'number'}
              isRequired={true}
              value={lifeTimeState?.toString()}
              placeholder={'Life Time'}
            />
            <Input
              handleChange={handleFeesChange}
              labelText={'Fees will be charged by each day delay after deadline:'}
              labelFor={'fees'}
              id={'fees'}
              name={'fees'}
              type={'number'}
              isRequired={true}
              value={dailyFess?.toString()}
              placeholder={'Daily fees'}
            />
            <CurrencyCodesDropdown onChange={setCurrency} value={currencyState} />
          </div>
          <Button className="m-5" type="submit">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}
