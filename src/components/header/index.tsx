import React from 'react'

import ConnectWallet from '../account/ConnectWallet'
import { Logo } from '../logo'
import { RpcSwitcher } from './RpcSwitcher'

export const Header: React.FC = () => {
  return (
    <header className="px-2 sm:px-6 absolute top-0 w-full z-10">
      <div className="flex flex-row items-center justify-between h-16">
        <div>
          <Logo />
        </div>
        <div className="flex flex-row items-center justify-end space-x-2 sm:space-x-4">
          <RpcSwitcher />
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}
