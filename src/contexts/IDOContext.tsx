import { useWallet, WalletEndpoint } from '@parrotfi/wallets'
import React, { createContext, useCallback, useEffect, useState } from 'react'

import { notify } from '../stores/useNotificationStore'
import useWalletStore from '../stores/useWalletStore'

interface IDOContext {
  loadingIDO: boolean
  loadingError: string
  /**
   * Fetch/init IDO pools and connection for given RPC endpoint
   */
  loadIDO: (endpoint: WalletEndpoint) => void
}

export const IDOContext = createContext<IDOContext>({
  loadingIDO: false,
  loadingError: '',
  loadIDO: () => null,
})

export const IDOProvider = ({ children }) => {
  const [loadingIDO, setLoadingIDO] = useState(true)
  const [loadingError, setLoadingError] = useState('')
  const { connected, wallet, endpoint } = useWallet()
  const { set: setWalletStore, actions } = useWalletStore((state) => state)

  useEffect(() => {
    if (!wallet) return
    if (connected) {
      setWalletStore((state) => {
        state.connected = true
      })
      // refetch pool and set provider with new waller
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
    }
    return () => {
      wallet?.disconnect?.()
      setWalletStore((state) => {
        state.connected = false
      })
    }
  }, [connected])

  const loadIDO = useCallback(async (endpoint) => {
    setLoadingIDO(true)
    setLoadingError('')
    setWalletStore((state) => {
      state.pools = []
      state.tokenAccounts = []
    })
    try {
      actions.connectRpc(endpoint)
      await actions.fetchPools()
      setLoadingIDO(false)
      await actions.fetchMints()
    } catch (e) {
      setLoadingError(e.message)
      notify({
        type: 'error',
        title: 'Failed to load IDO pools',
        message: e.message,
      })
    }
    setLoadingIDO(false)
  }, [])

  // pool loading
  useEffect(() => {
    if (endpoint.rpcURL) {
      loadIDO(endpoint)
    }
  }, [endpoint.rpcURL])

  useEffect(() => {
    setWalletStore((state) => {
      state.wallet = wallet
    })
  }, [wallet])

  return (
    <IDOContext.Provider
      value={{
        loadIDO,
        loadingIDO,
        loadingError,
      }}
    >
      {children}
    </IDOContext.Provider>
  )
}
