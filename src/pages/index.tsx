import ContributionPage from './ContributionPage'
import LeadPage from './LeadPage'
import RedeemPage from './RedeemPage'
import Notifications from '../components/Notification'
import NavBarBeta from '../components/NavBarBeta'

import usePool from '../hooks/usePool'
import { useState } from 'react'

const Index = () => {
  const { startIdo, endIdo } = usePool()

  const [step, setStep] = useState(0)

  const handleState = (v: number) => () => {
    setStep(v)
  }

  return (
    <div className={`bg-bkg-1 text-white transition-all overflow-hidden`}>
      <div className="w-screen h-2 bg-gradient-to-r from-mango-red via-mango-yellow to-mango-green"></div>
      <button className="p-2 mx-2" onClick={handleState(0)}>Before</button>
      <button className="p-2 mx-2" onClick={handleState(1)}>Start</button>
      <button className="p-2 mx-2" onClick={handleState(2)}>Finish</button>
      <NavBarBeta />
      <Notifications />
      {step === 0 && <LeadPage />}
      {step === 1 && <ContributionPage />}
      {step === 2 && <RedeemPage />}
      <div className="w-screen h-2 bg-gradient-to-r from-mango-red via-mango-yellow to-mango-green"></div>
    </div>
  )
}

export default Index
