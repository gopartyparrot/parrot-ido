import { useWallet } from '@parrotfi/wallets'
import React, { useEffect } from 'react'
import { RPC_URL } from '../config/constants'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { notify } from '../stores/useNotificationStore'
import useWalletStore from '../stores/useWalletStore'

export const IDOContext = React.createContext({})

export const IDOProvider = ({ children }) => {
  const { connected, provider, wallet } = useWallet()
  const {
    providerUrl: selectedProviderUrl,
    set: setWalletStore,
    actions,
  } = useWalletStore((state) => state)

  const [savedProviderUrl, setSavedProviderUrl] = useLocalStorageState(
    'walletProvider',
    RPC_URL
  )

  useEffect(() => {
    if (selectedProviderUrl && selectedProviderUrl != savedProviderUrl) {
      setSavedProviderUrl(selectedProviderUrl)
    }
  }, [selectedProviderUrl])

  useEffect(() => {
    if (provider) {
      const updateWallet = () => {
        setWalletStore((state) => {
          state.wallet = wallet
        })
      }

      if (document.readyState !== 'complete') {
        // wait to ensure that browser extensions are loaded
        const listener = () => {
          updateWallet()
          window.removeEventListener('load', listener)
        }
        window.addEventListener('load', listener)
        return () => window.removeEventListener('load', listener)
      } else {
        updateWallet()
      }
    }
  }, [provider])

  useEffect(() => {
    if (!wallet) return
    if (connected) {
      setWalletStore((state) => {
        state.connected = true
      })
      notify({
        title: 'Wallet connected',
        message:
          'Connected to wallet ' +
          wallet.publicKey.toString().substr(0, 5) +
          '...' +
          wallet.publicKey.toString().substr(-5),
      })
      actions.fetchPools().catch((e) => {
        notify({
          type: 'error',
          title: 'Failed to fetch pools information',
          message: e.message,
        })
      })
      actions.fetchWalletTokenAccounts()
    } else {
      setWalletStore((state) => {
        state.connected = false
        state.tokenAccounts = []
      })
      notify({
        title: 'Disconnected from wallet',
      })
    }
    return () => {
      wallet?.disconnect?.()
      setWalletStore((state) => {
        state.connected = false
      })
    }
  }, [connected])

  // fetch pool on page load
  useEffect(() => {
    const pageLoad = async () => {
      await actions.fetchPools()
      await actions.fetchMints()
    }
    pageLoad().catch((e) => {
      notify({
        type: 'error',
        title: 'Failed to fetch pools information',
        message: e.message,
      })
    })
  }, [])

  return <IDOContext.Provider value={{}}>{children}</IDOContext.Provider>
}
