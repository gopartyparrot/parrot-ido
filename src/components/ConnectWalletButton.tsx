// import { Menu } from '@headlessui/react'
import { LinkIcon } from '@heroicons/react/solid';
import { useWallet, WalletModal } from '@parrotfi/wallets';
import { useCallback, useEffect } from 'react';
import useModal from '../hooks/useModal';
import useWalletStore from '../stores/useWalletStore';

import Button from './Button';

// const ChevronDownIcon = (props) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     {...props}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M19 9l-7 7-7-7"
//     ></path>
//   </svg>
// )

// const CheckIcon = (props) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     {...props}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M5 13l4 4L19 7"
//     ></path>
//   </svg>
// )

const ConnectWalletButton = () => {
  const { set: setWalletStore } = useWalletStore(s => s);

  const { wallet, connected } = useWallet();

  useEffect(() => {
    if (wallet) {
      setWalletStore(s => {
        s.wallet = wallet;
      });
    }
  }, [wallet]);

  const [onPresentConnectWallet] = useModal(
    <WalletModal
      onError={() => {
        console.log('error');
      }}
    />
  );

  const handleConnect = useCallback(() => {
    console.log('handleConnect');

    if (connected && wallet) {
      wallet.disconnect();
    } else {
      onPresentConnectWallet();
    }
  }, [wallet, connected, onPresentConnectWallet]);

  return (
    <div className="flex">
      <Button
        className={`h-9 z-30 px-8 flex items-center`}
        gray={connected}
        onClick={handleConnect}
      >
        <LinkIcon className="h-4 w-4 mr-2" />
        {connected ? 'Disconnect' : 'Connect Wallet'}
      </Button>
    </div>
  );
};

export default ConnectWalletButton;
