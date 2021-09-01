import React from 'react'
import ConnectWallet from '../account/ConnectWallet'

import { Logo } from '../logo'
import { DarkModeToggle } from './DarkModeToggle'

export const Header: React.FC = () => {
  return (
    <header className="bg-header px-2 md:px-6">
      <div className="max-w-7xl m-auto h-16 grid grid-cols-2 items-center">
        <div className="flex flex-row items-center">
          <Logo />
        </div>
        <div className="flex flex-row items-center justify-end">
          <DarkModeToggle />
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}
