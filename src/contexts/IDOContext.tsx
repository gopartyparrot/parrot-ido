import React, { useEffect, useState } from 'react'

import { useWallet } from '@parrotfi/wallets'
import { RPC_URL } from '../config/constants'

import useWalletStore from '../stores/useWalletStore'
import { notify } from '../utils/notifications'
import useLocalStorageState from '../hooks/useLocalStorageState'
import usePool from '../hooks/usePool'
import useInterval from '../hooks/useInterval'

const SECONDS = 1000

export const IDOContext = React.createContext({})

export const IDOProvider = ({ children }) => {
  const { connected, provider, wallet } = useWallet()
  const {
    connection: { endpoint },
    providerUrl: selectedProviderUrl,
    set: setWalletStore,
    actions,
  } = useWalletStore((state) => state)

  const { endIdo } = usePool()
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
          state.current = wallet
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
  }, [provider, endpoint])

  useEffect(() => {
    if (!wallet) return
    if (connected) {
      setWalletStore((state) => {
        state.connected = true
      })
      notify({
        message: 'Wallet connected',
        description:
          'Connected to wallet ' +
          wallet.publicKey.toString().substr(0, 5) +
          '...' +
          wallet.publicKey.toString().substr(-5),
      })
      actions.fetchPool()
      actions.fetchWalletTokenAccounts()
    } else {
      setWalletStore((state) => {
        state.connected = false
        state.tokenAccounts = []
      })
      notify({
        type: 'info',
        message: 'Disconnected from wallet',
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
      await actions.fetchPool()
      actions.fetchMints()
    }
    pageLoad()
  }, [])

  // refresh usdc vault regularly
  useInterval(async () => {
    if (endIdo.isAfter()) {
      await actions.fetchUsdcVault()
    } else {
      await actions.fetchMNGOVault()
      await actions.fetchRedeemableMint()
    }
  }, 10 * SECONDS)

  return <IDOContext.Provider value={{}}>{children}</IDOContext.Provider>
}
