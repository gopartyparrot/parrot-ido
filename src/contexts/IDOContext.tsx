import { useWallet, WalletEndpoint } from '@parrotfi/wallets'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { notify } from '../stores/useNotificationStore'
import useWalletStore from '../stores/useWalletStore'

export const useIDOProvider = () => useContext(IDOContext)

export const IDOContext = React.createContext({
  loadingIDO: false,
  loadingError: '',
  loadIDO: (endpoint?: WalletEndpoint) => {
    ///
  },
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
    actions.connectRpc(endpoint)
    try {
      await actions.fetchPools()
      setLoadingIDO(false)
      await actions.fetchMints()
    } catch (e) {
      setLoadingError(e.message)
      notify({
        type: 'error',
        title: 'Failed to fetch pools information',
        message: e.message,
      })
    }
    setLoadingIDO(false)
  }, [])

  // initial loading
  useEffect(() => {
    loadIDO(endpoint)
  }, [])

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
