import { useWallet, WalletModal } from '@parrotfi/wallets'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import useModal from '../../hooks/useModal'
import { notify } from '../../stores/useNotificationStore'

interface ConnectWalletProps {
  className?: string
  onShowWallets?: () => void
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  className,
  onShowWallets,
}) => {
  const { wallet, connected } = useWallet()

  const [onPresentConnectWallet] = useModal(<WalletModal onNotify={notify} />)

  const handleConnect = useCallback(() => {
    if (connected && wallet) {
      wallet.disconnect()
    } else {
      if (onShowWallets) {
        onShowWallets()
      }
      onPresentConnectWallet()
    }
  }, [wallet, connected])

  return (
    <button
      className={classNames(
        'h-10 px-4 text-sm font-bold rounded-xl border flex flex-row items-center justify-center',
        'outline-none focus:outline-none hover:text-white',
        'shadow-outerButton custom-button-active-effect',
        {
          'text-brandPrimary hover:bg-brandPrimaryHover': !connected,
          'text-failure hover:bg-failureHover': connected,
        },
        className
      )}
      onClick={handleConnect}
    >
      {connected == true ? 'Disconnect' : 'Connect Wallet'}
    </button>
  )
}

export default ConnectWallet
