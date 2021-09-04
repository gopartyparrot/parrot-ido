import React from 'react'
import ConnectWallet from '../account/ConnectWallet'

import { Logo } from '../logo'
import { DarkModeToggle } from './DarkModeToggle'
import { RpcSwitcher } from './RpcSwitcher'

export const Header: React.FC = () => {
  return (
    <header className="bg-header px-2 sm:px-6">
      <div className="flex flex-row items-center justify-between h-16">
        <div>
          <Logo />
        </div>
        <div className="flex flex-row items-center justify-end space-x-2 sm:space-x-4">
          <DarkModeToggle />
          <RpcSwitcher />
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}
