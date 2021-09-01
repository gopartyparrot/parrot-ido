import { useWallet, WalletModal } from '@parrotfi/wallets';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import useModal from '../../hooks/useModal';

interface ConnectWalletProps {
  className?: string;
  onShowWallets?: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  className,
  onShowWallets
}) => {
  const { wallet, connected } = useWallet();

  const [onPresentConnectWallet] = useModal(
    <WalletModal
      onError={() => {
        //
      }}
    />
  );

  const handleConnect = useCallback(() => {
    if (connected && wallet) {
      wallet.disconnect();
    } else {
      if (onShowWallets) {
        onShowWallets();
      }
      onPresentConnectWallet();
    }
  }, [wallet, connected]);

  return (
    <button
      className={classNames(
        'font-bold rounded-xl text-sm border shadow-outerButton custom-button-active-effect hover:text-white flex flex-row items-center justify-center',
        'outline-none focus:outline-none h-8 px-4',
        {
          'text-brandPrimary hover:bg-brandPrimaryHover': !connected,
          'text-failure hover:bg-failureHover': connected
        },
        className
      )}
      onClick={handleConnect}
    >
      {connected == true ? 'Disconnect' : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWallet;
