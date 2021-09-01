import LeadPage from './LeadPage';
import RedeemPage from './RedeemPage';
import Notifications from '../components/Notification';
import NavBarBeta from '../components/NavBarBeta';

import usePool from '../hooks/usePool';
import React, { useState } from 'react';
import { Header } from '../components/header';
import ContributionCard from '../components/ido/ContributionCard';

const Main = () => {
  const { startIdo, endIdo } = usePool();

  const [step, setStep] = useState(0);

  const handleState = (v: number) => () => {
    setStep(v);
  };

  return (
    <main className="flex-1 flex justify-center items-center">
      <div className="">
        <ContributionCard />
      </div>
    </main>
  );
};

const Page: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-scaffold">
      <Header />
      <Main />
    </div>
  );
};

export default Page;
